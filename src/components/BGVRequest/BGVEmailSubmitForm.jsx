import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import "./bgvRequestForm.css";
import PDFViewer from "../PDFViewer";

/* ══════════════════════════════════════════
   PRODUCT TITLE → STEP KEY MAPPING
══════════════════════════════════════════ */
const PRODUCT_STEP_MAP = {
  "Employment check": "employment",
  "Education check": "education",
  "Criminal check": "criminal",
  "ID verification": "identity",
  "Due diligence": "due_diligence",
  "Address verification": "address",
  "Social media checks": "social_media",
  "Database checks": "database",
  "Credit checks": "credit",
};

// Step metadata: key → { label, order }
const ALL_STEPS_META = {
  personal: { label: "Personal", order: 0 },
  identity: { label: "Identity", order: 1 },
  address: { label: "Address", order: 2 },
  criminal: { label: "Criminal", order: 3 },
  employment: { label: "Employment", order: 4 },
  education: { label: "Education", order: 5 },
  credit: { label: "Credit", order: 6 },
  social_media: { label: "Social Media", order: 7 },
  database: { label: "Database", order: 8 },
  due_diligence: { label: "Due Diligence", order: 9 },
  acknowledge: { label: "Acknowledge", order: 98 },
  review: { label: "Review", order: 99 },
};

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const EMPTY_EMPLOYMENT = {
  company_name: "",
  employee_id: "",
  employment_start: "",
  employment_end: "",
  job_title: "",
  leaving_reason: "",
  is_current: false,
  job_doc: null,
};

const INITIAL_FORM = {
  // Personal
  candidate_name: "",
  candidate_phone: "",
  candidate_email: "",
  designation: "",
  department: "",
  gender: "",
  dob: "",
  // Identity
  id_type: "",
  id_number: "",
  id_doc: null,
  // Address
  current_address: "",
  current_landmark: "",
  current_residency: "",
  current_duration: "",
  permanent_address: "",
  permanent_landmark: "",
  permanent_residency: "",
  permanent_duration: "",
  // Criminal
  father_name: "",
  mother_name: "",
  criminal_address_detail: "",
  criminal_city: "",
  // Education
  institute_name: "",
  university: "",
  education_start: "",
  education_end: "",
  roll_number: "",
  qualification: "",
  specialization: "",
  passing_year: "",
  degree_status: "",
  edu_doc: null,
  // Credit
  pan_card: "",
  // Social Media
  social_media_type: "",
  social_media_id: "",
  nick_name: "",
};

/* ══════════════════════════════════════════
   VALIDATORS (per step key)
══════════════════════════════════════════ */
const validators = {
  personal: (form) => {
    const errors = {};
    if (!form.candidate_name.trim()) errors.candidate_name = "Candidate name is required";
    else if (form.candidate_name.trim().length < 2) errors.candidate_name = "At least 2 characters";
    if (!form.candidate_email.trim()) errors.candidate_email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.candidate_email)) errors.candidate_email = "Invalid email format";
    if (!form.candidate_phone.trim()) errors.candidate_phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.candidate_phone)) errors.candidate_phone = "Invalid phone number";
    if (!form.gender || !["MALE", "FEMALE", "OTHER"].includes(form.gender)) errors.gender = "Gender is required";
    if (!form.dob) errors.dob = "Date of birth is required";
    return errors;
  },
  identity: (form) => {
    const errors = {};
    if (!form.id_type.trim()) errors.id_type = "ID type is required";
    if (!form.id_number.trim()) errors.id_number = "ID number is required";
    if (!form.id_doc) errors.id_doc = "ID document is required";
    return errors;
  },
  address: (form) => {
    const errors = {};
    const hasCurrentAddressBlock = !!(
      form.current_address.trim() ||
      form.current_landmark.trim() ||
      form.current_residency.trim() ||
      form.current_duration.trim()
    );
    const hasPermanentAddressBlock = !!(
      form.permanent_address.trim() ||
      form.permanent_landmark.trim() ||
      form.permanent_residency.trim() ||
      form.permanent_duration.trim()
    );

    if (!hasCurrentAddressBlock && !hasPermanentAddressBlock) {
      errors.current_address = "Enter either current address or permanent address";
      errors.permanent_address = "Enter either current address or permanent address";
      return errors;
    }

    if (hasCurrentAddressBlock) {
      if (!form.current_address.trim()) errors.current_address = "Current address is required";
      if (!form.current_landmark.trim()) errors.current_landmark = "Current landmark is required";
    }

    if (hasPermanentAddressBlock) {
      if (!form.permanent_address.trim()) errors.permanent_address = "Permanent address is required";
      if (!form.permanent_landmark.trim()) errors.permanent_landmark = "Permanent landmark is required";
    }

    return errors;
  },
  criminal: (form) => {
    const errors = {};
    if (!form.father_name.trim()) errors.father_name = "Father's name is required";
    if (!form.mother_name.trim()) errors.mother_name = "Mother's name is required";
    if (!form.criminal_address_detail.trim()) errors.criminal_address_detail = "Address detail is required";
    if (!form.criminal_city.trim()) errors.criminal_city = "City is required";
    return errors;
  },
  education: (form) => {
    const errors = {};
    if (!form.institute_name.trim()) errors.institute_name = "Institute name is required";
    if (!form.university.trim()) errors.university = "University name is required";
    if (!form.qualification.trim()) errors.qualification = "Qualification is required";
    if (!form.specialization.trim()) errors.specialization = "Specialization is required";
    if (!form.degree_status) errors.degree_status = "Degree status is required";
    if (form.passing_year) {
      const yr = Number(form.passing_year);
      if (!Number.isInteger(yr) || yr < 1900 || yr > 2100) errors.passing_year = "Invalid passing year";
    }
    return errors;
  },
  credit: (form) => {
    const errors = {};
    if (!form.pan_card.trim()) errors.pan_card = "PAN card number is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan_card.toUpperCase()))
      errors.pan_card = "Invalid PAN format (e.g. ABCDE1234F)";
    return errors;
  },
  social_media: (form) => {
    const errors = {};
    if (!form.social_media_type.trim()) errors.social_media_type = "Social media type is required";
    if (!form.social_media_id.trim()) errors.social_media_id = "Social media ID is required";
    return errors;
  },
  employment: null, // handled separately
  database: null,
  due_diligence: null,
};

function validateFile(file) {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) { toast.error("Only PDF, JPG, JPEG, PNG files are allowed"); return false; }
  if (file.size > MAX_FILE_SIZE) { toast.error("File must be under 5MB"); return false; }
  return true;
}

function isEmploymentTouched(emp) {
  return !!(emp.company_name.trim() || emp.employee_id.trim() || emp.job_title.trim() || emp.employment_start || emp.leaving_reason.trim() || emp.job_doc);
}

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */
function FieldError({ message }) {
  if (!message) return null;
  return <p className="bgv-field-error">⚠ {message}</p>;
}

function StepBar({ activeSteps, currentStepIndex, onStepClick }) {
  return (
    <div className="bgv-steps">
      {activeSteps.map((stepKey, i) => {
        const meta = ALL_STEPS_META[stepKey];
        const isDone = currentStepIndex > i;
        const isActive = currentStepIndex === i;
        return (
          <button
            key={stepKey}
            type="button"
            className={`bgv-step-btn ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
            onClick={() => onStepClick(i)}
            title={`Go to ${meta.label}`}
          >
            <span className="bgv-step-circle">{isDone ? "✓" : i + 1}</span>
            <span className="bgv-step-label">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SuccessScreen() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "48px 40px", textAlign: "center", maxWidth: "420px", width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
        <h2 style={{ margin: "0 0 12px", color: "#1a1a1a", fontSize: "24px" }}>Submitted Successfully!</h2>
        <p style={{ color: "#666", lineHeight: 1.6, margin: 0 }}>Your BGV form has been submitted. We will review your details and get back to you shortly.</p>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="review-row">
      <span className="review-label">{label}</span>
      <span className="review-value">{value}</span>
    </div>
  );
}
const TERMS_PDF_URL = "/MysdomConsent.pdf";
/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
function BGVEmailSubmitForm() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [stepErrors, setStepErrors] = useState({});
  const [employments, setEmployments] = useState([{ ...EMPTY_EMPLOYMENT }]);
  const [empErrors, setEmpErrors] = useState([{}]);
  const [acknowledgeChecked, setAcknowledgeChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [decodeData, setDecodeData] = useState({});
  const [activeSteps, setActiveSteps] = useState(["personal", "acknowledge", "review"]);

  /* ── Build active steps from products array ── */
  const buildActiveSteps = (products) => {
    const stepKeys = new Set(["personal"]);
    if (Array.isArray(products)) {
      products.forEach((product) => {
        const key = PRODUCT_STEP_MAP[product?.title];
        if (key) stepKeys.add(key);
      });
    }
    stepKeys.add("acknowledge");
    stepKeys.add("review");
    // Sort by defined order
    const sorted = Array.from(stepKeys).sort(
      (a, b) => (ALL_STEPS_META[a]?.order ?? 50) - (ALL_STEPS_META[b]?.order ?? 50)
    );
    return sorted;
  };

  const verifyToken = async () => {
    try {
      const response = await axiosInstance.get(`/bgvrequest/token/verify/${token}`);
      const data = response?.data?.data || {};
      setIsVerified(true);
      setDecodeData(data);
      const steps = buildActiveSteps(data?.products);
      setActiveSteps(steps);
    } catch {
      setIsVerified(false);
    }
  };

  useEffect(() => { verifyToken(); }, []);

  const currentStepKey = activeSteps[stepIndex];
  const totalSteps = activeSteps.length;

  /* ══════════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════════ */
  const runValidation = (key) => {
    if (key === "employment") {
      const { valid, errors } = validateEmployments();
      setEmpErrors(errors);
      return valid ? {} : { _employment: "fix" };
    }
    if (key === "acknowledge") {
      const errors = acknowledgeChecked ? {} : { acknowledge: "Please accept Terms & Conditions to continue" };
      setStepErrors(errors);
      if (errors.acknowledge) toast.error(errors.acknowledge);
      return errors;
    }
    const validator = validators[key];
    if (!validator) return {};
    const errors = validator(form);
    setStepErrors(errors);
    const first = Object.values(errors)[0];
    if (first) toast.error(first);
    return errors;
  };

  const goToStep = (targetIndex) => {
    runValidation(currentStepKey);
    setStepIndex(targetIndex);
    document.querySelector(".bgv-modal")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    const errors = runValidation(currentStepKey);
    if (currentStepKey === "employment") {
      const { valid, errors: empErrs } = validateEmployments();
      if (!valid) { setEmpErrors(empErrs); toast.error("Please fix employment errors before proceeding"); return; }
    } else if (Object.keys(errors).length > 0) return;
    setStepIndex((p) => Math.min(p + 1, totalSteps - 1));
    document.querySelector(".bgv-modal")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStepIndex((p) => Math.max(p - 1, 0));
    document.querySelector(".bgv-modal")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ══════════════════════════════════════════
     FIELD HANDLERS
  ══════════════════════════════════════════ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (stepErrors[name]) setStepErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (validateFile(file)) setForm((prev) => ({ ...prev, [e.target.name]: file }));
    else e.target.value = "";
  };

  /* ── Employment ── */
  const handleEmploymentChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setEmployments((prev) => {
      const updated = [...prev];
      if (type === "checkbox") { updated[index] = { ...updated[index], [name]: checked }; if (checked) updated[index].employment_end = ""; }
      else updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
    if (empErrors[index]?.[name]) setEmpErrors((prev) => { const c = [...prev]; c[index] = { ...c[index], [name]: undefined }; return c; });
  };

  const handleEmploymentFile = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateFile(file)) { e.target.value = ""; return; }
    setEmployments((prev) => { const u = [...prev]; u[index] = { ...u[index], job_doc: file }; return u; });
    if (empErrors[index]?.job_doc) setEmpErrors((prev) => { const c = [...prev]; c[index] = { ...c[index], job_doc: undefined }; return c; });
  };

  const addEmployment = () => { setEmployments((p) => [...p, { ...EMPTY_EMPLOYMENT }]); setEmpErrors((p) => [...p, {}]); };
  const removeEmployment = (index) => {
    if (employments.length === 1) { setEmployments([{ ...EMPTY_EMPLOYMENT }]); setEmpErrors([{}]); return; }
    setEmployments((p) => p.filter((_, i) => i !== index));
    setEmpErrors((p) => p.filter((_, i) => i !== index));
  };
  const isLastEmploymentFilled = () => { const last = employments[employments.length - 1]; return !!(last.company_name && last.employee_id && last.employment_start && last.job_title); };
  const validateEmployments = () => {
    const allErrors = employments.map((emp) => {
      if (!isEmploymentTouched(emp)) return {};
      const errs = {};
      if (!emp.company_name.trim()) errs.company_name = "Company name is required";
      if (!emp.employee_id.trim()) errs.employee_id = "Employee ID is required";
      if (!emp.job_title.trim()) errs.job_title = "Job title is required";
      if (!emp.employment_start) errs.employment_start = "Start date is required";
      if (!emp.is_current && !emp.employment_end) errs.employment_end = "End date is required";
      if (!emp.is_current && !emp.leaving_reason?.trim()) errs.leaving_reason = "Reason for leaving is required";
      if (!emp.job_doc) errs.job_doc = "Job document is required";
      return errs;
    });
    setEmpErrors(allErrors);
    return { valid: allErrors.every((e) => Object.keys(e).length === 0), errors: allErrors };
  };
  const getFilledEmployments = () => employments.filter((emp) => isEmploymentTouched(emp) && emp.company_name.trim());

  /* ══════════════════════════════════════════
     SUBMIT
  ══════════════════════════════════════════ */
  const submitForm = async () => {
    const p1Errors = validators.personal(form);
    const { valid: empValid } = validateEmployments();
    if (Object.keys(p1Errors).length > 0) { toast.error(Object.values(p1Errors)[0]); setStepIndex(0); setStepErrors(p1Errors); return; }
    if (!empValid && activeSteps.includes("employment")) { toast.error("Please fix employment errors"); setStepIndex(activeSteps.indexOf("employment")); return; }
    if (activeSteps.includes("acknowledge") && !acknowledgeChecked) {
      const acknowledgeStepIndex = activeSteps.indexOf("acknowledge");
      toast.error("Please accept Terms & Conditions to continue");
      setStepErrors({ acknowledge: "Please accept Terms & Conditions to continue" });
      setStepIndex(acknowledgeStepIndex >= 0 ? acknowledgeStepIndex : 0);
      return;
    }
    if (!decodeData?.clientId) { toast.error("Session data missing. Please reload the page."); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "" && v !== null && v !== undefined) fd.append(k, v); });
      getFilledEmployments().forEach((emp, i) => {
        Object.entries(emp).forEach(([k, v]) => {
          if (v === "" || v === null || v === false || v === undefined) return;
          if (k === "job_doc") fd.append(`bgvEmployments[${i}][job_doc]`, v);
          else fd.append(`bgvEmployments[${i}][${k === "is_current" ? "isCurrent" : k}]`, v);
        });
      });
      fd.append("clientId", decodeData.clientId);
      fd.append("assignedTo", decodeData.assignedTo);
      fd.append("submittedBy", decodeData.submittedBy);
      fd.append("acknowladge", acknowledgeChecked);
      // const productIds = decodeData?.products?.map(p=>p.id);
      // fd.append("products", productIds);
      decodeData?.products.forEach((p) => fd.append("products[]", p.id));


      await axiosInstance.post("/bgvrequest/user/form/apply", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setIsSubmitted(true);
      toast.success("BGV request submitted successfully!");
    } catch (error) {
      let message = "Failed to submit form";
      if (error.response) {
        const d = error.response?.data;
        if (Array.isArray(d?.errors) && d.errors.length > 0) message = d.errors.map((e) => e.msg).join(" • ");
        else message = d?.message || `Error ${error.response.status}`;
      } else if (error.request) message = "Server not responding. Please try again.";
      else message = error.message;
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ══════════════════════════════════════════
     EARLY RETURNS
  ══════════════════════════════════════════ */
  if (!isVerified) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "40px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔗</div>
          <h2 style={{ color: "#e53e3e", margin: "0 0 8px" }}>Link Expired</h2>
          <p style={{ color: "#666", margin: 0 }}>This verification link has expired or is invalid. Please request a new one.</p>
        </div>
      </div>
    );
  }
  if (isSubmitted) return <SuccessScreen />;

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className="bgv-overlay">
      <div className="bgv-modal">

        {/* HEADER */}
        <div className="bgv-header">
          <div className="bgv-header-left">
            <h3>BGV Submission Form</h3>
            <p className="bgv-header-sub">Step {stepIndex + 1} of {totalSteps}</p>
          </div>
          <button className="bgv-close-btn" type="button" onClick={() => navigate("/")}>✕</button>
        </div>

        {/* STEP BAR */}
        <StepBar activeSteps={activeSteps} currentStepIndex={stepIndex} onStepClick={goToStep} />

        {/* ══ PERSONAL ══ */}
        {currentStepKey === "personal" && (
          <div className="form-section">
            <h4>Personal Details</h4>
            <p className="form-section-hint">Fields marked <span className="req-star">*</span> are mandatory.</p>
            <div className="form-grid">
              <div className="form-field">
                <label>Full Name <span className="req-star">*</span></label>
                <input name="candidate_name" placeholder="e.g. Rahul Kumar" value={form.candidate_name} onChange={handleChange} className={stepErrors.candidate_name ? "input-error" : ""} />
                <FieldError message={stepErrors.candidate_name} />
              </div>
              <div className="form-field">
                <label>Phone Number <span className="req-star">*</span></label>
                <input name="candidate_phone" placeholder="10-digit mobile number" value={form.candidate_phone} onChange={handleChange} maxLength={10} className={stepErrors.candidate_phone ? "input-error" : ""} />
                <FieldError message={stepErrors.candidate_phone} />
              </div>
              <div className="form-field">
                <label>Email Address <span className="req-star">*</span></label>
                <input name="candidate_email" type="email" placeholder="e.g. rahul@email.com" value={form.candidate_email} onChange={handleChange} className={stepErrors.candidate_email ? "input-error" : ""} />
                <FieldError message={stepErrors.candidate_email} />
              </div>
              <div className="form-field">
                <label>Gender <span className="req-star">*</span></label>
                <select name="gender" value={form.gender} onChange={handleChange} className={stepErrors.gender ? "input-error" : ""}>
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                <FieldError message={stepErrors.gender} />
              </div>
              <div className="form-field">
                <label>Date of Birth <span className="req-star">*</span></label>
                <input type="date" name="dob" value={form.dob} onChange={handleChange} className={stepErrors.dob ? "input-error" : ""} />
                <FieldError message={stepErrors.dob} />
              </div>
              <div className="form-field">
                <label>Designation</label>
                <input name="designation" placeholder="e.g. Software Engineer" value={form.designation} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Department</label>
                <input name="department" placeholder="e.g. Engineering" value={form.department} onChange={handleChange} />
              </div>
            </div>
            <div className="form-footer">
              <span />
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ IDENTITY ══ */}
        {currentStepKey === "identity" && (
          <div className="form-section">
            <h4>Identity Check</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>ID Type <span className="req-star">*</span></label>
                <select name="id_type" value={form.id_type} onChange={handleChange} className={stepErrors.id_type ? "input-error" : ""}>
                  <option value="">Select ID type</option>
                  <option value="Aadhar">Aadhar</option>
                  <option value="PAN">PAN</option>
                  <option value="Passport">Passport</option>

                  <option value="OTHER">Other</option>
                </select>
                <FieldError message={stepErrors.id_type} />
              </div>
              <div className="form-field">
                <label>ID Number <span className="req-star">*</span></label>
                <input name="id_number" placeholder="Enter ID number" value={form.id_number} onChange={handleChange} className={stepErrors.id_number ? "input-error" : ""} />
                <FieldError message={stepErrors.id_number} />
              </div>
              <div className="form-field file-field">
                <label>ID Document <span className="req-star">*</span> <span className="file-hint">(PDF / JPG / PNG, max 5MB)</span></label>
                <input type="file" name="id_doc" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} />
                {form.id_doc && <p className="file-chosen">✓ {form.id_doc.name}</p>}
                <FieldError message={stepErrors.id_doc} />
              </div>
            </div>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ ADDRESS ══ */}
        {currentStepKey === "address" && (
          <div className="form-section">
            <p className="form-section-hint">
              Fill either the current address or the permanent address. You can also fill both.
              If you use one address block, complete its required fields.
            </p>
            <h4>Current Address</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Address</label>
                <input name="current_address" placeholder="Street, Area" value={form.current_address} onChange={handleChange} className={stepErrors.current_address ? "input-error" : ""} />
                <FieldError message={stepErrors.current_address} />
              </div>
              <div className="form-field">
                <label>Landmark</label>
                <input name="current_landmark" placeholder="Nearest landmark" value={form.current_landmark} onChange={handleChange} className={stepErrors.current_landmark ? "input-error" : ""} />
                <FieldError message={stepErrors.current_landmark} />
              </div>
              <div className="form-field">
                <label>Residency Status </label>
                <select name="current_residency" value={form.current_residency} onChange={handleChange} >
                  <option value="">Select Residency</option>
                  <option value="Owned">Owned</option>
                  <option value="Rented">Rented</option>
                </select>
                {/* <input name="current_residency" placeholder="e.g. Rented, Owned" value={form.current_residency} onChange={handleChange} className={stepErrors.current_residency ? "input-error" : ""} />
                <FieldError message={stepErrors.current_residency} /> */}
              </div>
              <div className="form-field">
                <label>Duration of Stay (years)</label>
                <input type="number" name="current_duration" placeholder="e.g. 2" value={form.current_duration} onChange={handleChange} />
                {/* <FieldError message={stepErrors.current_duration} /> */}
              </div>
            </div>

            <h4>Permanent Address</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Address</label>
                <input name="permanent_address" placeholder="Street, Area" value={form.permanent_address} onChange={handleChange} className={stepErrors.permanent_address ? "input-error" : ""} />
                <FieldError message={stepErrors.permanent_address} />
              </div>
              <div className="form-field">
                <label>Landmark</label>
                <input name="permanent_landmark" placeholder="Nearest landmark" value={form.permanent_landmark} onChange={handleChange} className={stepErrors.permanent_landmark ? "input-error" : ""} />
                <FieldError message={stepErrors.permanent_landmark} />
              </div>
              <div className="form-field">
                <label>Residency Status </label>
                <select name="permanent_residency" value={form.permanent_residency} onChange={handleChange} >
                  <option value="">Select Residency</option>
                  <option value="Owned">Owned</option>
                  <option value="Rented">Rented</option>
                </select>
                {/* <input name="permanent_residency" placeholder="e.g. Rented, Owned" value={form.permanent_residency} onChange={handleChange} className={stepErrors.permanent_residency ? "input-error" : ""} />
                <FieldError message={stepErrors.permanent_residency} /> */}
              </div>
              <div className="form-field">
                <label>Duration of Stay (years) </label>
                <input type="number" name="permanent_duration" placeholder="e.g. 5" value={form.permanent_duration} onChange={handleChange} />
                {/* <FieldError message={stepErrors.permanent_duration} /> */}
              </div>
            </div>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ CRIMINAL ══ */}
        {currentStepKey === "criminal" && (
          <div className="form-section">
            <h4>Criminal Check</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Father's Name <span className="req-star">*</span></label>
                <input name="father_name" placeholder="Father's full name" value={form.father_name} onChange={handleChange} className={stepErrors.father_name ? "input-error" : ""} />
                <FieldError message={stepErrors.father_name} />
              </div>
              <div className="form-field">
                <label>Mother's Name <span className="req-star">*</span></label>
                <input name="mother_name" placeholder="Mother's full name" value={form.mother_name} onChange={handleChange} className={stepErrors.mother_name ? "input-error" : ""} />
                <FieldError message={stepErrors.mother_name} />
              </div>
              <div className="form-field">
                <label>Address Detail <span className="req-star">*</span></label>
                <input name="address_detail" placeholder="e.g. House No, Street, Area" value={form.address_detail} onChange={handleChange} className={stepErrors.address_detail ? "input-error" : ""} />
                <FieldError message={stepErrors.address_detail} />
              </div>
              <div className="form-field">
                <label>City <span className="req-star">*</span></label>
                <input name="city" placeholder="e.g. Mumbai" value={form.city} onChange={handleChange} className={stepErrors.city ? "input-error" : ""} />
                <FieldError message={stepErrors.city} />
              </div>
            </div>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ EMPLOYMENT ══ */}
        {currentStepKey === "employment" && (
          <div className="form-section">
            <h4>Employment Check</h4>
            <p className="form-section-hint">Employment details are <strong>optional</strong>. If you fill any field in an organization, Company Name, Employee ID, Job Title, Start Date, and Job Document become required for that entry.</p>

            {employments.map((emp, index) => (
              <div key={index} className="employment-card">
                <div className="emp-card-header">
                  <h5>Organization {index + 1}</h5>
                  <button type="button" className="remove-btn" onClick={() => removeEmployment(index)} title={employments.length === 1 ? "Clear this record" : "Remove this record"}>
                    {employments.length === 1 ? "Clear" : "Remove"}
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Company Name {isEmploymentTouched(emp) && <span className="req-star">*</span>}</label>
                    <input name="company_name" placeholder="Company name" value={emp.company_name} onChange={(e) => handleEmploymentChange(index, e)} className={empErrors[index]?.company_name ? "input-error" : ""} />
                    <FieldError message={empErrors[index]?.company_name} />
                  </div>
                  <div className="form-field">
                    <label>Employee ID {isEmploymentTouched(emp) && <span className="req-star">*</span>}</label>
                    <input name="employee_id" placeholder="Employee ID / Staff number" value={emp.employee_id} onChange={(e) => handleEmploymentChange(index, e)} className={empErrors[index]?.employee_id ? "input-error" : ""} />
                    <FieldError message={empErrors[index]?.employee_id} />
                  </div>
                  <div className="form-field">
                    <label>Job Title {isEmploymentTouched(emp) && <span className="req-star">*</span>}</label>
                    <input name="job_title" placeholder="e.g. Software Engineer" value={emp.job_title} onChange={(e) => handleEmploymentChange(index, e)} className={empErrors[index]?.job_title ? "input-error" : ""} />
                    <FieldError message={empErrors[index]?.job_title} />
                  </div>
                  <div className="form-field">
                    <label>Start Date {isEmploymentTouched(emp) && <span className="req-star">*</span>}</label>
                    <input type="date" name="employment_start" value={emp.employment_start} onChange={(e) => handleEmploymentChange(index, e)} className={empErrors[index]?.employment_start ? "input-error" : ""} />
                    <FieldError message={empErrors[index]?.employment_start} />
                  </div>
                  <div className="form-field checkbox-field">
                    <label className="current-check">
                      <input type="checkbox" name="is_current" checked={emp.is_current || false} disabled={employments.some((e, i) => e.is_current && i !== index)} onChange={(e) => handleEmploymentChange(index, e)} />
                      <span>Currently working here</span>
                    </label>
                  </div>
                  {!emp.is_current && (
                    <div className="form-field">
                      <label>End Date {isEmploymentTouched(emp) && <span className="req-star">*</span>}</label>
                      <input type="date" name="employment_end" value={emp.employment_end} onChange={(e) => handleEmploymentChange(index, e)} className={empErrors[index]?.employment_end ? "input-error" : ""} />
                      <FieldError message={empErrors[index]?.employment_end} />
                    </div>
                  )}
                  <div className="form-field">
                    <label>Reason for Leaving {isEmploymentTouched(emp) && !emp.is_current && <span className="req-star">*</span>}</label>
                    <input name="leaving_reason" placeholder="e.g. Better opportunity" value={emp.leaving_reason} onChange={(e) => handleEmploymentChange(index, e)} className={empErrors[index]?.leaving_reason ? "input-error" : ""} />
                    <FieldError message={empErrors[index]?.leaving_reason} />
                  </div>
                  <div className="form-field file-field">
                    <label>Experience Document {isEmploymentTouched(emp) && <span className="req-star">*</span>} <span className="file-hint">(PDF / JPG / PNG, max 5MB)</span></label>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleEmploymentFile(index, e)} />
                    {emp.job_doc && <p className="file-chosen">✓ {emp.job_doc.name}</p>}
                    <FieldError message={empErrors[index]?.job_doc} />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="ad-btn" onClick={addEmployment} disabled={!isLastEmploymentFilled()} title={!isLastEmploymentFilled() ? "Fill current organization first" : "Add another organization"}>
              + Add Organization
            </button>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ EDUCATION ══ */}
        {currentStepKey === "education" && (
          <div className="form-section">
            <h4>Education Check</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Institute Name <span className="req-star">*</span></label>
                <input name="institute_name" placeholder="e.g. IIT Delhi" value={form.institute_name} onChange={handleChange} className={stepErrors.institute_name ? "input-error" : ""} />
                <FieldError message={stepErrors.institute_name} />
              </div>
              <div className="form-field">
                <label>University / Board <span className="req-star">*</span></label>
                <input name="university" placeholder="e.g. Delhi University" value={form.university} onChange={handleChange} className={stepErrors.university ? "input-error" : ""} />
                <FieldError message={stepErrors.university} />
              </div>
              <div className="form-field">
                <label>Enrollment Date <span className="req-star">*</span></label>
                <input type="date" name="education_start" value={form.education_start} onChange={handleChange} className={stepErrors.education_start ? "input-error" : ""} />
                <FieldError message={stepErrors.education_start} />
              </div>
              <div className="form-field">
                <label>End Date <span className="req-star">*</span></label>
                <input type="date" name="education_end" value={form.education_end} onChange={handleChange} className={stepErrors.education_end ? "input-error" : ""} />
                <FieldError message={stepErrors.education_end} />
              </div>
              <div className="form-field">
                <label>Roll / Enrollment Number <span className="req-star">*</span></label>
                <input name="roll_number" placeholder="Roll number" value={form.roll_number} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Qualification <span className="req-star">*</span></label>
                <input name="qualification" placeholder="e.g. B.Tech, MBA" value={form.qualification} onChange={handleChange} className={stepErrors.qualification ? "input-error" : ""} />
                <FieldError message={stepErrors.qualification} />
              </div>
              <div className="form-field">
                <label>Specialization <span className="req-star">*</span></label>
                <input name="specialization" placeholder="e.g. Computer Science" value={form.specialization} onChange={handleChange} className={stepErrors.specialization ? "input-error" : ""} />
                <FieldError message={stepErrors.specialization} />
              </div>
              <div className="form-field">
                <label>Passing Year <span className="req-star">*</span></label>
                <input name="passing_year" placeholder="e.g. 2020" value={form.passing_year} onChange={handleChange} maxLength={4} className={stepErrors.passing_year ? "input-error" : ""} />
                <FieldError message={stepErrors.passing_year} />
              </div>
              <div className="form-field">
                <label>Degree Status <span className="req-star">*</span></label>
                <select name="degree_status" value={form.degree_status} onChange={handleChange} className={stepErrors.degree_status ? "input-error" : ""}>
                  <option value="">Select degree status</option>
                  <option value="yes">Yes – Degree Obtained</option>
                  <option value="no">No – Degree Not Obtained</option>
                </select>
                <FieldError message={stepErrors.degree_status} />
              </div>
              <div className="form-field file-field">
                <label>Education Document <span className="req-star">*</span> <span className="file-hint">(PDF / JPG / PNG, max 5MB)</span></label>
                <input type="file" name="edu_doc" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} />
                {form.edu_doc && <p className="file-chosen">✓ {form.edu_doc.name}</p>}
                <FieldError message={stepErrors.edu_doc} />
              </div>
            </div>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ CREDIT ══ */}
        {currentStepKey === "credit" && (
          <div className="form-section">
            <h4>Credit Check</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>PAN Card Number <span className="req-star">*</span></label>
                <input
                  name="pan_card"
                  placeholder="e.g. ABCDE1234F"
                  value={form.pan_card}
                  onChange={(e) => { handleChange({ target: { name: "pan_card", value: e.target.value.toUpperCase() } }); }}
                  maxLength={10}
                  className={stepErrors.pan_card ? "input-error" : ""}
                />
                <FieldError message={stepErrors.pan_card} />
              </div>
            </div>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ SOCIAL MEDIA ══ */}
        {currentStepKey === "social_media" && (
          <div className="form-section">
            <h4>Social Media Check</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Social Media Type <span className="req-star">*</span></label>
                <select name="social_media_type" value={form.social_media_type} onChange={handleChange} className={stepErrors.social_media_type ? "input-error" : ""}>
                  <option value="">Select platform</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">Twitter / X</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Other">Other</option>
                </select>
                <FieldError message={stepErrors.social_media_type} />
              </div>
              <div className="form-field">
                <label>Social Media ID / Username <span className="req-star">*</span></label>
                <input name="social_media_id" placeholder="e.g. @username or profile URL" value={form.social_media_id} onChange={handleChange} className={stepErrors.social_media_id ? "input-error" : ""} />
                <FieldError message={stepErrors.social_media_id} />
              </div>
              <div className="form-field">
                <label>Nick Name / Display Name</label>
                <input name="nick_name" placeholder="Display name on platform" value={form.nick_name} onChange={handleChange} />
              </div>
            </div>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ DATABASE / DUE DILIGENCE (placeholder steps) ══ */}
        {(currentStepKey === "database" || currentStepKey === "due_diligence") && (
          <div className="form-section">
            <h4>{ALL_STEPS_META[currentStepKey]?.label} Check</h4>
            <p className="form-section-hint">This section will be verified by our team. No additional information required from you at this stage.</p>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}
        {/* ══ ACKNOWLEDGE ══ */}
        {currentStepKey === "acknowledge" && (
          <div className="form-section">
            <h4>Terms & Conditions Acknowledgement</h4>
            <p className="form-section-hint">
              Please review the Terms & Conditions and confirm your acknowledgement to continue.
            </p>

            <div className="bgv-terms-wrapper">
              <div className="bgv-terms-actions">
                <a
                  className="bgv-terms-link"
                  href={TERMS_PDF_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Terms & Conditions PDF
                </a>
              </div>
              {/* <iframe
                className="bgv-terms-viewer"
                src={TERMS_PDF_URL}
                title="Terms and Conditions"
              /> */}

              <PDFViewer url={TERMS_PDF_URL} />
            </div>

            <label className="bgv-ack-check">
              <input
                type="checkbox"
                checked={acknowledgeChecked}
                onChange={(e) => {
                  setAcknowledgeChecked(e.target.checked);
                  if (stepErrors.acknowledge) {
                    setStepErrors((prev) => ({ ...prev, acknowledge: undefined }));
                  }
                }}
              />
              <span>I acknowledge and accept the Terms & Conditions.</span>
            </label>
            <FieldError message={stepErrors.acknowledge} />

            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ REVIEW ══ */}
        {currentStepKey === "review" && (
          <div className="form-section">
            <h4>Review & Submit</h4>
            <p className="form-section-hint">Review your details before submitting.</p>
            <div className="review-box">

              <div className="review-section">
                <h5>Personal</h5>
                <div className="review-grid">
                  <ReviewRow label="Name" value={form.candidate_name} />
                  <ReviewRow label="Email" value={form.candidate_email} />
                  <ReviewRow label="Phone" value={form.candidate_phone} />
                  <ReviewRow label="Gender" value={form.gender} />
                  <ReviewRow label="Date of Birth" value={form.dob} />
                  <ReviewRow label="Designation" value={form.designation} />
                  <ReviewRow label="Department" value={form.department} />
                </div>
              </div>

              {activeSteps.includes("identity") && (
                <div className="review-section">
                  <h5>Identity</h5>
                  <div className="review-grid">
                    <ReviewRow label="ID Type" value={form.id_type} />
                    <ReviewRow label="ID Number" value={form.id_number} />
                    <ReviewRow label="ID Doc" value={form.id_doc?.name} />
                  </div>
                </div>
              )}

              {activeSteps.includes("address") && (
                <>
                  <div className="review-section">
                    <h5>Current Address</h5>
                    <div className="review-grid">
                      <ReviewRow label="Address" value={form.current_address} />
                      <ReviewRow label="Landmark" value={form.current_landmark} />
                      <ReviewRow label="Residency" value={form.current_residency} />
                      <ReviewRow label="Duration" value={form.current_duration} />
                    </div>
                  </div>
                  <div className="review-section">
                    <h5>Permanent Address</h5>
                    <div className="review-grid">
                      <ReviewRow label="Address" value={form.permanent_address} />
                      <ReviewRow label="Landmark" value={form.permanent_landmark} />
                      <ReviewRow label="Residency" value={form.permanent_residency} />
                      <ReviewRow label="Duration" value={form.permanent_duration} />
                    </div>
                  </div>
                </>
              )}

              {activeSteps.includes("criminal") && (
                <div className="review-section">
                  <h5>Criminal Check</h5>
                  <div className="review-grid">
                    <ReviewRow label="Father's Name" value={form.father_name} />
                    <ReviewRow label="Mother's Name" value={form.mother_name} />
                    <ReviewRow label="Address Detail" value={form.criminal_address_detail} />
                    <ReviewRow label="City" value={form.criminal_city} />
                  </div>
                </div>
              )}

              {activeSteps.includes("employment") && (
                <div className="review-section">
                  {(() => {
                    const filled = getFilledEmployments();
                    return (
                      <>
                        <h5>Employment ({filled.length} record{filled.length !== 1 ? "s" : ""})</h5>
                        {filled.length === 0 ? (
                          <p className="review-empty">No employment records added.</p>
                        ) : (
                          filled.map((emp, i) => (
                            <div key={i} className="review-emp-row">
                              <span className="emp-badge">#{i + 1}</span>
                              <span>{emp.company_name}</span>
                              <span className="emp-meta">{emp.employee_id}</span>
                              <span className="emp-meta">{emp.job_title}</span>
                              <span className="emp-meta">{emp.employment_start}</span>
                              {emp.is_current ? <span className="emp-current">Current</span> : <span className="emp-meta">{emp.employment_end}</span>}
                              <ReviewRow label="Job Doc" value={emp?.job_doc?.name} />
                            </div>
                          ))
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {activeSteps.includes("education") && (
                <div className="review-section">
                  <h5>Education</h5>
                  <div className="review-grid">
                    <ReviewRow label="Institute" value={form.institute_name} />
                    <ReviewRow label="University / Board" value={form.university} />
                    <ReviewRow label="Qualification" value={form.qualification} />
                    <ReviewRow label="Specialization" value={form.specialization} />
                    <ReviewRow label="Passing Year" value={form.passing_year} />
                    <ReviewRow label="Degree Obtained" value={form.degree_status === "yes" ? "Yes" : form.degree_status === "no" ? "No" : ""} />
                    <ReviewRow label="Education Doc" value={form.edu_doc?.name} />
                  </div>
                </div>
              )}

              {activeSteps.includes("credit") && (
                <div className="review-section">
                  <h5>Credit Check</h5>
                  <div className="review-grid">
                    <ReviewRow label="PAN Card" value={form.pan_card} />
                  </div>
                </div>
              )}

              {activeSteps.includes("social_media") && (
                <div className="review-section">
                  <h5>Social Media</h5>
                  <div className="review-grid">
                    <ReviewRow label="Platform" value={form.social_media_type} />
                    <ReviewRow label="ID / Username" value={form.social_media_id} />
                    <ReviewRow label="Nick Name" value={form.nick_name} />
                  </div>
                </div>
              )}

              {activeSteps.includes("acknowledge") && (
                <div className="review-section">
                  <h5>Acknowledgement</h5>
                  <div className="review-grid">
                    <ReviewRow
                      label="Terms Accepted"
                      value={acknowledgeChecked ? "Yes" : "No"}
                    />
                  </div>
                </div>
              )}

            </div>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-submit" type="button" onClick={submitForm} disabled={submitting}>
                {submitting ? <span className="bgv-spinner" /> : "Submit BGV Request"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default BGVEmailSubmitForm;
