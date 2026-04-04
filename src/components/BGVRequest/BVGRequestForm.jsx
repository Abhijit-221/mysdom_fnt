import { useEffect, useState, useCallback } from "react";
import "./bgvRequestForm.css";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const TOTAL_STEPS = 8;
const STEP_LABELS = ["Personal", "Identity", "Address", "Criminal", "Employment", "Education", "Service", "Review"];

const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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
  candidate_name: "",
  candidate_phone: "",
  candidate_email: "",
  designation: "",
  department: "",
  id_type: "",
  id_number: "",
  id_doc: null,
  current_address: "",
  current_landmark: "",
  current_residency: "",
  current_duration: "",
  permanent_address: "",
  permanent_landmark: "",
  permanent_residency: "",
  permanent_duration: "",
  father_name: "",
  mother_name: "",
  gender: "",
  dob: "",
  institute_name: "",
  university: "",
  education_start: "",
  education_end: "",
  roll_number: "",
  qualification: "",
  specialization: "",
  passing_year: "",
  edu_doc: null,
};

/* ══════════════════════════════════════════
   VALIDATION HELPERS
══════════════════════════════════════════ */
const validators = {
  /* Step 1 — Personal */
  1: (form) => {
    const errors = {};
    if (!form.candidate_name.trim())
      errors.candidate_name = "Candidate name is required";
    else if (form.candidate_name.trim().length < 2)
      errors.candidate_name = "Candidate name must be at least 2 characters";

    if (!form.candidate_email.trim())
      errors.candidate_email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.candidate_email))
      errors.candidate_email = "Invalid email format";

    if (!form.candidate_phone.trim())
      errors.candidate_phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.candidate_phone))
      errors.candidate_phone = "Invalid phone number";

    return errors;
  },

  /* Step 4 — Criminal */
  4: (form) => {
    const errors = {};
    if (form.gender && !["MALE", "FEMALE", "OTHER"].includes(form.gender))
      errors.gender = "Invalid gender";
    if (form.dob && isNaN(Date.parse(form.dob)))
      errors.dob = "Invalid date format";
    return errors;
  },

  /* Step 6 — Education */
  6: (form) => {
    const errors = {};
    if (form.passing_year) {
      const yr = Number(form.passing_year);
      if (!Number.isInteger(yr) || yr < 1900 || yr > 2100)
        errors.passing_year = "Invalid passing year";
    }
    if (form.education_start && isNaN(Date.parse(form.education_start)))
      errors.education_start = "Invalid date format";
    if (form.education_end && isNaN(Date.parse(form.education_end)))
      errors.education_end = "Invalid date format";
    return errors;
  },

  /* Step 7 — Service */
  7: (_, selectedServices) => {
    const errors = {};
    if (!selectedServices || selectedServices.length === 0)
      errors.services = "Service must be a non-empty array";
    return errors;
  },
};

/* ── File validator ── */
function validateFile(file) {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    toast.error("Only PDF, JPG, JPEG, PNG files are allowed");
    return false;
  }
  if (file.size > MAX_FILE_SIZE) {
    toast.error("File must be under 5MB");
    return false;
  }
  return true;
}

/* ══════════════════════════════════════════
   FIELD ERROR DISPLAY
══════════════════════════════════════════ */
function FieldError({ message }) {
  if (!message) return null;
  return <p className="bgv-field-error">⚠ {message}</p>;
}

/* ══════════════════════════════════════════
   STEP INDICATOR
══════════════════════════════════════════ */
function StepBar({ step, onStepClick }) {
  return (
    <div className="bgv-steps">
      {STEP_LABELS.map((label, i) => (
        <button
          key={label}
          type="button"
          className={`bgv-step-btn ${step > i + 1 ? "done" : ""} ${step === i + 1 ? "active" : ""}`}
          onClick={() => onStepClick(i + 1)}
          title={`Go to ${label}`}
        >
          <span className="bgv-step-circle">{step > i + 1 ? "✓" : i + 1}</span>
          <span className="bgv-step-label">{label}</span>
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */

/**
 * Returns true if an employment record is considered "started" —
 * i.e. the user has begun filling it in (any field is non-empty).
 * A completely blank record is ignored and not validated.
 */
function isEmploymentTouched(emp) {
  return !!(
    emp.company_name.trim() ||
    emp.employee_id.trim() ||
    emp.job_title.trim() ||
    emp.employment_start ||
    emp.leaving_reason.trim() ||
    emp.job_doc
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
function BgvRequestForm() {
  const navigate = useNavigate();

  /* ── core state ── */
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [stepErrors, setStepErrors] = useState({});
  const [employments, setEmployments] = useState([{ ...EMPTY_EMPLOYMENT }]);
  const [empErrors, setEmpErrors] = useState([{}]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [clientId, setClientId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ══════════════════════════════════════════
     DATA FETCHING
  ══════════════════════════════════════════ */
  const fetchServices = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userDetails = await axiosInstance.get(`/auth/user/get/${user.id}`);
      const clientIdFromUser = userDetails?.data?.data?.client;
      const res = await axiosInstance.get(`/client-service/getby/${clientIdFromUser}`);
      setServices(res.data?.data || []);
    } catch (error) {
      console.error("Service fetch error:", error);
      toast.error("Failed to load services");
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axiosInstance.get("/auth/users/get");
      const users = res.data.data || [];

      let superAdminId = "";
      let cId = "";
      users.forEach((u) => {
        if (u.role === "superadmin") superAdminId = u.id;
        if (u.id === user.id) cId = u.client;
      });

      setAssignedTo(superAdminId);
      setClientId(cId);
    } catch (error) {
      console.error("User fetch error:", error);
      toast.error("Failed to load user info");
    }
  }, []);

  useEffect(() => {
    fetchServices();
    fetchUser();
  }, [fetchServices, fetchUser]);

  /* ══════════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════════ */
  const goToStep = (target) => {
    runValidation(step);
    setStep(target);
    document.querySelector(".bgv-modal")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    const errors = runValidation(step);
    if (Object.keys(errors).length > 0) return;
    setStep((p) => Math.min(p + 1, TOTAL_STEPS));
    document.querySelector(".bgv-modal")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((p) => Math.max(p - 1, 1));
    document.querySelector(".bgv-modal")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const runValidation = (s) => {
    const validator = validators[s];
    if (!validator) return {};
    const errors = validator(form, selectedServices);
    setStepErrors(errors);
    const first = Object.values(errors)[0];
    if (first) toast.error(first);
    return errors;
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
    if (validateFile(file)) {
      setForm((prev) => ({ ...prev, [e.target.name]: file }));
    } else {
      e.target.value = "";
    }
  };

  /* ── Employment ── */
  const handleEmploymentChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setEmployments((prev) => {
      const updated = [...prev];
      if (type === "checkbox") {
        updated[index] = { ...updated[index], [name]: checked };
        if (checked) updated[index].employment_end = "";
      } else {
        updated[index] = { ...updated[index], [name]: value };
      }
      return updated;
    });
    if (empErrors[index]?.[name]) {
      setEmpErrors((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], [name]: undefined };
        return copy;
      });
    }
  };

  const handleEmploymentFile = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!validateFile(file)) { e.target.value = ""; return; }
    setEmployments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], job_doc: file };
      return updated;
    });
  };

  const addEmployment = () => {
    setEmployments((prev) => [...prev, { ...EMPTY_EMPLOYMENT }]);
    setEmpErrors((prev) => [...prev, {}]);
  };

  const removeEmployment = (index) => {
    if (employments.length === 1) {
      // Instead of blocking removal, reset the single record to blank
      setEmployments([{ ...EMPTY_EMPLOYMENT }]);
      setEmpErrors([{}]);
      return;
    }
    setEmployments((prev) => prev.filter((_, i) => i !== index));
    setEmpErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const isLastEmploymentFilled = () => {
    const last = employments[employments.length - 1];
    return !!(last.company_name && last.employee_id && last.employment_start && last.job_title);
  };

  /**
   * Validates only "touched" employment records.
   * A blank/untouched record is silently skipped — employment is optional.
   * Returns { valid: boolean, errors: array }
   */
  const validateEmployments = () => {
    const allErrors = employments.map((emp) => {
      // Skip completely blank records — they are optional
      if (!isEmploymentTouched(emp)) return {};

      const errs = {};
      if (!emp.company_name.trim()) errs.company_name = "Company name is required";
      if (!emp.employee_id.trim()) errs.employee_id = "Employee ID is required";
      if (!emp.job_title.trim()) errs.job_title = "Job title is required";
      if (emp.employment_start && isNaN(Date.parse(emp.employment_start)))
        errs.employment_start = "Invalid employment start date";
      if (!emp.is_current && emp.employment_end && isNaN(Date.parse(emp.employment_end)))
        errs.employment_end = "Invalid employment end date";
      return errs;
    });

    setEmpErrors(allErrors);
    return {
      valid: allErrors.every((e) => Object.keys(e).length === 0),
      errors: allErrors,
    };
  };

  /**
   * Returns only the employment records that are actually filled in
   * (touched + valid), ready for submission.
   */
  const getFilledEmployments = () =>
    employments.filter((emp) => isEmploymentTouched(emp) && emp.company_name.trim());

  /* ── Service toggle ── */
  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
    if (stepErrors.services) setStepErrors((prev) => ({ ...prev, services: undefined }));
  };

  /* ══════════════════════════════════════════
     SUBMIT
  ══════════════════════════════════════════ */
  const submitForm = async () => {
    const step1Errors = validators[1](form, selectedServices);
    const step7Errors = validators[7](form, selectedServices);
    const { valid: empValid } = validateEmployments();

    if (Object.keys(step1Errors).length > 0) {
      toast.error(Object.values(step1Errors)[0]);
      setStep(1); setStepErrors(step1Errors); return;
    }
    if (Object.keys(step7Errors).length > 0) {
      toast.error(Object.values(step7Errors)[0]);
      setStep(7); setStepErrors(step7Errors); return;
    }
    if (!empValid) {
      toast.error("Please fix employment errors before submitting");
      setStep(5); return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) return;
        formData.append(key, value);
      });

      /* Only send filled employment records */
      const filledEmployments = getFilledEmployments();
      filledEmployments.forEach((emp, index) => {
        Object.entries(emp).forEach(([key, value]) => {
          if (value === "" || value === null || value === false || value === undefined) return;
          if (key === "job_doc") {
            formData.append(`bgvEmployments[${index}][job_doc]`, value);
          } else {
            const backendKey = key === "is_current" ? "isCurrent" : key;
            formData.append(`bgvEmployments[${index}][${backendKey}]`, value);
          }
        });
      });

      formData.append("clientId", clientId);
      formData.append("assignedTo", assignedTo);
      console.log("Selected services on submit:", selectedServices);
      selectedServices.forEach((id) => {
        formData.append("service[]", id);
      });
      console.log('formData:',formData);

      await axiosInstance.post("/bgvrequest/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("BGV request submitted successfully!");
      navigate("/bgv/list");

    } catch (error) {
      console.error("Submit error:", error);
      let message = "Failed to submit form";
      if (error.response) {
        const data = error.response?.data;
        if (Array.isArray(data?.errors) && data.errors.length > 0) {
          message = data.errors.map((e) => e.msg).join(" • ");
        } else {
          message = data?.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        message = "Server not responding. Please try again.";
      } else {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ══════════════════════════════════════════
     REVIEW HELPERS
  ══════════════════════════════════════════ */
  const getServiceNames = () =>
    services
      .filter((s) => selectedServices.includes(s.service.id))
      .map((s) => s.service.name)
      .join(", ") || "None";

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
            <p className="bgv-header-sub">Step {step} of {TOTAL_STEPS}</p>
          </div>
          <button className="bgv-close-btn" type="button" onClick={() => navigate("/bgv/list")}>✕</button>
        </div>

        {/* STEP BAR */}
        <StepBar step={step} onStepClick={goToStep} />

        {/* ══ STEP 1: PERSONAL ══ */}
        {step === 1 && (
          <div className="form-section">
            <h4>Personal Details</h4>
            <p className="form-section-hint">Fields marked <span className="req-star">*</span> are mandatory.</p>
            <div className="form-grid">
              <div className="form-field">
                <label>Full Name <span className="req-star">*</span></label>
                <input
                  name="candidate_name"
                  placeholder="e.g. Rahul Kumar"
                  value={form.candidate_name}
                  onChange={handleChange}
                  className={stepErrors.candidate_name ? "input-error" : ""}
                />
                <FieldError message={stepErrors.candidate_name} />
              </div>
              <div className="form-field">
                <label>Phone Number <span className="req-star">*</span></label>
                <input
                  name="candidate_phone"
                  placeholder="10-digit mobile number"
                  value={form.candidate_phone}
                  onChange={handleChange}
                  maxLength={10}
                  className={stepErrors.candidate_phone ? "input-error" : ""}
                />
                <FieldError message={stepErrors.candidate_phone} />
              </div>
              <div className="form-field">
                <label>Email Address <span className="req-star">*</span></label>
                <input
                  name="candidate_email"
                  type="email"
                  placeholder="e.g. rahul@email.com"
                  value={form.candidate_email}
                  onChange={handleChange}
                  className={stepErrors.candidate_email ? "input-error" : ""}
                />
                <FieldError message={stepErrors.candidate_email} />
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

        {/* ══ STEP 2: IDENTITY ══ */}
        {step === 2 && (
          <div className="form-section">
            <h4>Identity Check</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>ID Type</label>
                <input name="id_type" placeholder="e.g. Aadhaar, PAN, Passport" value={form.id_type} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>ID Number</label>
                <input name="id_number" placeholder="Enter ID number" value={form.id_number} onChange={handleChange} />
              </div>
              <div className="form-field file-field">
                <label>ID Document <span className="file-hint">(PDF / JPG / PNG, max 5MB)</span></label>
                <input type="file" name="id_doc" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} />
                {form.id_doc && <p className="file-chosen">✓ {form.id_doc.name}</p>}
              </div>
            </div>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ STEP 3: ADDRESS ══ */}
        {step === 3 && (
          <div className="form-section">
            <h4>Current Address</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Address</label>
                <input name="current_address" placeholder="Street, Area" value={form.current_address} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Landmark</label>
                <input name="current_landmark" placeholder="Nearest landmark" value={form.current_landmark} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Residency Status</label>
                <input name="current_residency" placeholder="e.g. Rented, Owned" value={form.current_residency} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Duration of Stay</label>
                <input name="current_duration" placeholder="e.g. 2 years" value={form.current_duration} onChange={handleChange} />
              </div>
            </div>

            <h4>Permanent Address</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Address</label>
                <input name="permanent_address" placeholder="Street, Area" value={form.permanent_address} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Landmark</label>
                <input name="permanent_landmark" placeholder="Nearest landmark" value={form.permanent_landmark} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Residency Status</label>
                <input name="permanent_residency" placeholder="e.g. Rented, Owned" value={form.permanent_residency} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Duration of Stay</label>
                <input name="permanent_duration" placeholder="e.g. 5 years" value={form.permanent_duration} onChange={handleChange} />
              </div>
            </div>

            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ STEP 4: CRIMINAL ══ */}
        {step === 4 && (
          <div className="form-section">
            <h4>Criminal Check</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Father's Name</label>
                <input name="father_name" placeholder="Father's full name" value={form.father_name} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Mother's Name</label>
                <input name="mother_name" placeholder="Mother's full name" value={form.mother_name} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={stepErrors.gender ? "input-error" : ""}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                <FieldError message={stepErrors.gender} />
              </div>
              <div className="form-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className={stepErrors.dob ? "input-error" : ""}
                />
                <FieldError message={stepErrors.dob} />
              </div>
            </div>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ STEP 5: EMPLOYMENT ══ */}
        {step === 5 && (
          <div className="form-section">
            <h4>Employment Check</h4>
            <p className="form-section-hint">
              Employment details are <strong>optional</strong>. If you add an organization, Company Name, Employee ID, and Job Title become required for that entry.
            </p>

            {employments.map((emp, index) => (
              <div key={index} className="employment-card">
                <div className="emp-card-header">
                  <h5>Organization {index + 1}</h5>
                  {/* Allow removing even the last card — it resets to blank */}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeEmployment(index)}
                    title={employments.length === 1 ? "Clear this record" : "Remove this record"}
                  >
                    {employments.length === 1 ? "Clear" : "Remove"}
                  </button>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    {/* Mark required only when the record has been touched */}
                    <label>
                      Company Name{" "}
                      {isEmploymentTouched(emp) && <span className="req-star">*</span>}
                    </label>
                    <input
                      name="company_name"
                      placeholder="Company name"
                      value={emp.company_name}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className={empErrors[index]?.company_name ? "input-error" : ""}
                    />
                    <FieldError message={empErrors[index]?.company_name} />
                  </div>

                  <div className="form-field">
                    <label>
                      Employee ID{" "}
                      {isEmploymentTouched(emp) && <span className="req-star">*</span>}
                    </label>
                    <input
                      name="employee_id"
                      placeholder="Employee ID / Staff number"
                      value={emp.employee_id}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className={empErrors[index]?.employee_id ? "input-error" : ""}
                    />
                    <FieldError message={empErrors[index]?.employee_id} />
                  </div>

                  <div className="form-field">
                    <label>
                      Job Title{" "}
                      {isEmploymentTouched(emp) && <span className="req-star">*</span>}
                    </label>
                    <input
                      name="job_title"
                      placeholder="e.g. Software Engineer"
                      value={emp.job_title}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className={empErrors[index]?.job_title ? "input-error" : ""}
                    />
                    <FieldError message={empErrors[index]?.job_title} />
                  </div>

                  <div className="form-field">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="employment_start"
                      value={emp.employment_start}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className={empErrors[index]?.employment_start ? "input-error" : ""}
                    />
                    <FieldError message={empErrors[index]?.employment_start} />
                  </div>

                  <div className="form-field checkbox-field">
                    <label className="current-check">
                      <input
                        type="checkbox"
                        name="is_current"
                        checked={emp.is_current || false}
                        disabled={employments.some((e, i) => e.is_current && i !== index)}
                        onChange={(e) => handleEmploymentChange(index, e)}
                      />
                      <span>Currently working here</span>
                    </label>
                  </div>

                  {!emp.is_current && (
                    <div className="form-field">
                      <label>End Date</label>
                      <input
                        type="date"
                        name="employment_end"
                        value={emp.employment_end}
                        onChange={(e) => handleEmploymentChange(index, e)}
                        className={empErrors[index]?.employment_end ? "input-error" : ""}
                      />
                      <FieldError message={empErrors[index]?.employment_end} />
                    </div>
                  )}

                  <div className="form-field">
                    <label>Reason for Leaving</label>
                    <input
                      name="leaving_reason"
                      placeholder="e.g. Better opportunity"
                      value={emp.leaving_reason}
                      onChange={(e) => handleEmploymentChange(index, e)}
                    />
                  </div>

                  <div className="form-field file-field">
                    <label>Experience Document <span className="file-hint">(PDF / JPG / PNG, max 5MB)</span></label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleEmploymentFile(index, e)}
                    />
                    {emp.job_doc && <p className="file-chosen">✓ {emp.job_doc.name}</p>}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="ad-btn"
              onClick={addEmployment}
              disabled={!isLastEmploymentFilled()}
              title={!isLastEmploymentFilled() ? "Fill current organization first" : "Add another organization"}
            >
              + Add Organization
            </button>

            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ STEP 6: EDUCATION ══ */}
        {step === 6 && (
          <div className="form-section">
            <h4>Education Check</h4>
            <div className="form-grid">
              <div className="form-field">
                <label>Institute Name</label>
                <input name="institute_name" placeholder="e.g. IIT Delhi" value={form.institute_name} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>University / Board</label>
                <input name="university" placeholder="e.g. Delhi University" value={form.university} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Start Date</label>
                <input
                  type="date"
                  name="education_start"
                  value={form.education_start}
                  onChange={handleChange}
                  className={stepErrors.education_start ? "input-error" : ""}
                />
                <FieldError message={stepErrors.education_start} />
              </div>
              <div className="form-field">
                <label>End Date</label>
                <input
                  type="date"
                  name="education_end"
                  value={form.education_end}
                  onChange={handleChange}
                  className={stepErrors.education_end ? "input-error" : ""}
                />
                <FieldError message={stepErrors.education_end} />
              </div>
              <div className="form-field">
                <label>Roll / Enrollment Number</label>
                <input name="roll_number" placeholder="Roll number" value={form.roll_number} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Qualification</label>
                <input name="qualification" placeholder="e.g. B.Tech, MBA" value={form.qualification} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Specialization</label>
                <input name="specialization" placeholder="e.g. Computer Science" value={form.specialization} onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Passing Year</label>
                <input
                  name="passing_year"
                  placeholder="e.g. 2020"
                  value={form.passing_year}
                  onChange={handleChange}
                  maxLength={4}
                  className={stepErrors.passing_year ? "input-error" : ""}
                />
                <FieldError message={stepErrors.passing_year} />
              </div>
              <div className="form-field file-field">
                <label>Education Document <span className="file-hint">(PDF / JPG / PNG, max 5MB)</span></label>
                <input type="file" name="edu_doc" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} />
                {form.edu_doc && <p className="file-chosen">✓ {form.edu_doc.name}</p>}
              </div>
            </div>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ STEP 7: SERVICE ══ */}
        {step === 7 && (
          <div className="form-section">
            <h4>Select Services <span className="req-star">*</span></h4>
            <p className="form-section-hint">
              Select at least one service. Selected: <strong>{selectedServices.length}</strong>
            </p>

            {stepErrors.services && (
              <div className="bgv-error-banner">⚠ {stepErrors.services}</div>
            )}

            {services.length === 0 ? (
              <p className="no-services">No services available for your account.</p>
            ) : (
              <div className="service-list">
                {services.map((item) => (
                  <label
                    key={item.service.id}
                    className={`service-card ${selectedServices.includes(item.service.id) ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(item.service.id)}
                      onChange={() => handleServiceToggle(item.service.id)}
                    />
                    <span>{item.service.name}</span>
                  </label>
                ))}
              </div>
            )}

            {selectedServices.length > 0 && (
              <p className="selected-ids-hint">
                IDs: {JSON.stringify(selectedServices)}
              </p>
            )}

            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button
                className="btn-next"
                type="button"
                onClick={() => {
                  if (Object.keys(validators[7](form, selectedServices)).length === 0) {
                    next();
                  } else {
                    setStepErrors(validators[7](form, selectedServices));
                    toast.error("Service must be a non-empty array");
                  }
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 8: REVIEW ══ */}
        {step === 8 && (
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
                  <ReviewRow label="Designation" value={form.designation} />
                  <ReviewRow label="Department" value={form.department} />
                </div>
              </div>

              <div className="review-section">
                <h5>Identity</h5>
                <div className="review-grid">
                  <ReviewRow label="ID Type" value={form.id_type} />
                  <ReviewRow label="ID Number" value={form.id_number} />
                  <ReviewRow label="ID Doc" value={form.id_doc?.name} />
                </div>
              </div>

              <div className="review-section">
                <h5>Address</h5>
                <div className="review-grid">
                  <ReviewRow label="Current" value={form.current_address} />
                  <ReviewRow label="Permanent" value={form.permanent_address} />
                </div>
              </div>

              <div className="review-section">
                <h5>Criminal Check</h5>
                <div className="review-grid">
                  <ReviewRow label="Father" value={form.father_name} />
                  <ReviewRow label="Mother" value={form.mother_name} />
                  <ReviewRow label="Gender" value={form.gender} />
                  <ReviewRow label="DOB" value={form.dob} />
                </div>
              </div>

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
                            <span className="emp-meta">{emp.job_title}</span>
                            {emp.is_current && <span className="emp-current">Current</span>}
                          </div>
                        ))
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="review-section">
                <h5>Education</h5>
                <div className="review-grid">
                  <ReviewRow label="Institute" value={form.institute_name} />
                  <ReviewRow label="Qualification" value={form.qualification} />
                  <ReviewRow label="Passing Year" value={form.passing_year} />
                </div>
              </div>

              <div className="review-section">
                <h5>Selected Services ({selectedServices.length})</h5>
                <p className="review-services">{getServiceNames()}</p>
              </div>
            </div>

            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button
                className="btn-submit"
                type="button"
                onClick={submitForm}
                disabled={submitting}
              >
                {submitting ? <span className="bgv-spinner" /> : "Submit BGV Request"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── Review row helper ── */
function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="review-row">
      <span className="review-label">{label}</span>
      <span className="review-value">{value}</span>
    </div>
  );
}

export default BgvRequestForm;