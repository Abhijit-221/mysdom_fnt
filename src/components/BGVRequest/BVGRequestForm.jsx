import { useEffect, useState, useCallback } from "react";
import "./bgvRequestForm.css";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PDFViewer from "../PDFViewer";

/* ══════════════════════════════════════════
   PRODUCT → STEP MAPPING
   Maps product names (lowercase) to step keys
══════════════════════════════════════════ */
const PRODUCT_STEP_MAP = {
  "id verification": "identity",
  "address verification": "address",
  "criminal check": "criminal",
  "employment check": "employment",
  "education check": "education",
  "credit checks": "credit",
  "social media checks": "social",
  "due diligence": null,       // no extra form step
  "database checks": null,     // no extra form step
};

/* Given a list of selected product names, returns ordered step keys */
const STEP_ORDER = ["personal", "products", "identity", "address", "criminal", "employment", "education", "credit", "social", "acknowledge", "review"];
const TERMS_PDF_URL = "/MysdomConsent.pdf";

const STEP_DISPLAY_NAMES = {
  personal: "Personal",
  products: "Products",
  identity: "ID Verification",
  address: "Address",
  criminal: "Criminal",
  employment: "Employment",
  education: "Education",
  credit: "Credit",
  social: "Social Media",
  acknowledge: "Acknowledge",
  review: "Review",
};

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
  employment_category: "",
  employment_type: "",
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
  address_detail: "",
  city: "",
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
   VALIDATION HELPERS
══════════════════════════════════════════ */
const validators = {
  personal: (form) => {
    const errors = {};
    if (!form.candidate_name.trim()) errors.candidate_name = "Candidate name is required";
    else if (form.candidate_name.trim().length < 2) errors.candidate_name = "Name must be at least 2 characters";
    if (!form.candidate_email.trim()) errors.candidate_email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.candidate_email)) errors.candidate_email = "Invalid email format";
    if (!form.candidate_phone.trim()) errors.candidate_phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.candidate_phone)) errors.candidate_phone = "Invalid Indian phone number";
    if (!form.gender) errors.gender = "Gender is required";
    if (!form.dob) errors.dob = "Date of birth is required";
    return errors;
  },

  products: (_, selectedProducts) => {
    const errors = {};
    if (!selectedProducts || selectedProducts.length === 0)
      errors.selectedProducts = "Select at least one product";
    return errors;
  },

  identity: (form) => {
    const errors = {};
    if (!form.id_type.trim()) errors.id_type = "ID Type is required";
    if (!form.id_number.trim()) errors.id_number = "ID Number is required";
    if (!form.id_doc) errors.id_doc = "ID Document is required";
    return errors;
  },

  address: (form) => {
    const errors = {};
    if (!form.current_address.trim()) errors.current_address = "Current address is required";
    if (!form.current_landmark.trim()) errors.current_landmark = "Current landmark is required";
    if (!form.permanent_address.trim()) errors.permanent_address = "Permanent address is required";
    if (!form.permanent_landmark.trim()) errors.permanent_landmark = "Permanent landmark is required";
    return errors;
  },

  criminal: (form) => {
    const errors = {};
    if (!form.father_name.trim()) errors.father_name = "Father's name is required";
    if (!form.mother_name.trim()) errors.mother_name = "Mother's name is required";
    if (!form.address_detail.trim()) errors.address_detail = "Address detail is required";
    if (!form.city.trim()) errors.city = "City is required";
    return errors;
  },

  education: (form) => {
    const errors = {};
    if (!form.institute_name.trim()) errors.institute_name = "Institute name is required";
    if (!form.university.trim()) errors.university = "University is required";
    if (!form.education_start) errors.education_start = "Enrollment date is required";
    if (!form.roll_number.trim()) errors.roll_number = "Roll/Enrollment number is required";
    if (!form.passing_year) errors.passing_year = "Year of passing is required";
    else {
      const yr = Number(form.passing_year);
      if (!Number.isInteger(yr) || yr < 1900 || yr > 2100)
        errors.passing_year = "Invalid passing year";
    }
    if (!form.edu_doc) errors.edu_doc = "Education document is required";
    if (form.education_start && isNaN(Date.parse(form.education_start)))
      errors.education_start = "Invalid date format";
    if (form.education_end && isNaN(Date.parse(form.education_end)))
      errors.education_end = "Invalid date format";
    return errors;
  },

  credit: (form) => {
    const errors = {};
    if (!form.pan_card.trim()) errors.pan_card = "PAN card number is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan_card.toUpperCase()))
      errors.pan_card = "Invalid PAN format (e.g. ABCDE1234F)";
    return errors;
  },

  social: (form) => {
    const errors = {};
    if (!form.social_media_type.trim()) errors.social_media_type = "Social media type is required";
    if (!form.social_media_id.trim()) errors.social_media_id = "Social media ID is required";
    return errors;
  },

  acknowledge: (_, acknowledgeChecked) => {
    const errors = {};
    if (!acknowledgeChecked) {
      errors.acknowledge = "Please acknowledge Terms & Conditions before continuing";
    }
    return errors;
  },
};

/* Employment validators */
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
   SUB-COMPONENTS
══════════════════════════════════════════ */
function FieldError({ message }) {
  if (!message) return null;
  return <p className="bgv-field-error">⚠ {message}</p>;
}

function StepBar({ activeSteps, currentStep, onStepClick }) {
  return (
    <div className="bgv-steps">
      {activeSteps.map((key, i) => (
        <button
          key={key}
          type="button"
          className={`bgv-step-btn ${i < activeSteps.indexOf(currentStep) ? "done" : ""} ${currentStep === key ? "active" : ""}`}
          onClick={() => onStepClick(key)}
          title={`Go to ${STEP_DISPLAY_NAMES[key]}`}
        >
          <span className="bgv-step-circle">
            {i < activeSteps.indexOf(currentStep) ? "✓" : i + 1}
          </span>
          <span className="bgv-step-label">{STEP_DISPLAY_NAMES[key]}</span>
        </button>
      ))}
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

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
function BgvRequestForm() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState("personal");
  const [form, setForm] = useState(INITIAL_FORM);
  const [stepErrors, setStepErrors] = useState({});
  const [employments, setEmployments] = useState([{ ...EMPTY_EMPLOYMENT }]);
  const [empErrors, setEmpErrors] = useState([{}]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [clientId, setClientId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [acknowledgeChecked, setAcknowledgeChecked] = useState(false);

  /* Compute active steps based on selected products */
  const getActiveSteps = useCallback(() => {
    const always = ["personal", "products"];
    const productSteps = new Set();

    selectedProducts.forEach((pid) => {
      const product = products.find((p) => (p.id || p._id) === pid);
      if (!product) return;
      const name = (product.name || product.title || "").toLowerCase().trim();
      const stepKey = PRODUCT_STEP_MAP[name];
      if (stepKey) productSteps.add(stepKey);
    });

    const middle = STEP_ORDER.filter(
      (s) => !["personal", "products", "review"].includes(s) && productSteps.has(s)
    );

    return [...always, ...middle, "acknowledge", "review"];
  }, [selectedProducts, products]);

  const activeSteps = getActiveSteps();
  const currentIndex = activeSteps.indexOf(currentStep);
  const totalSteps = activeSteps.length;
  const scrollActiveSectionToTop = () => {
    document.querySelector(".form-section")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Data fetching ── */
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

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/product/list");
      setProducts(res.data?.data || []);
    } catch (error) {
      console.error("Product fetch error:", error);
      toast.error("Failed to load products");
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchProducts();
  }, [fetchUser, fetchProducts]);

  /* ── Navigation ── */
  const runValidation = useCallback((stepKey) => {
    if (stepKey === "products") {
      const errors = validators.products(form, selectedProducts);
      setStepErrors(errors);
      return errors;
    }
    if (stepKey === "employment") {
      // Employment has its own validation flow
      return {};
    }
    if (stepKey === "acknowledge") {
      const errors = validators.acknowledge(form, acknowledgeChecked);
      setStepErrors(errors);
      const first = Object.values(errors)[0];
      if (first) toast.error(first);
      return errors;
    }
    const validator = validators[stepKey];
    if (!validator) return {};
    const errors = validator(form);
    setStepErrors(errors);
    const first = Object.values(errors)[0];
    if (first) toast.error(first);
    return errors;
  }, [form, selectedProducts, acknowledgeChecked]);

  const goToStep = (target) => {
    runValidation(currentStep);
    setCurrentStep(target);
    setTimeout(scrollActiveSectionToTop, 0);
  };

  const next = () => {
    let errors = {};

    if (currentStep === "employment") {
      const { valid } = validateEmployments();
      if (!valid) {
        toast.error("Please fix employment errors before proceeding");
        return;
      }
    } else {
      errors = runValidation(currentStep);
      if (Object.keys(errors).length > 0) return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < activeSteps.length) {
      setCurrentStep(activeSteps[nextIndex]);
      setTimeout(scrollActiveSectionToTop, 0);
    }
  };

  const back = () => {
    if (currentIndex > 0) {
      setCurrentStep(activeSteps[currentIndex - 1]);
      setTimeout(scrollActiveSectionToTop, 0);
    }
  };

  /* ── Field handlers ── */
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
      if (stepErrors[e.target.name]) setStepErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
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

  const validateEmployments = () => {
    const allErrors = employments.map((emp) => {
      if (!isEmploymentTouched(emp)) return {};
      const errs = {};
      if (!emp.company_name.trim()) errs.company_name = "Company name is required";
      if (!emp.employee_id.trim()) errs.employee_id = "Employee ID is required";
      if (!emp.job_title.trim()) errs.job_title = "Job title is required";
      if (!emp.employment_start) errs.employment_start = "Start date is required";
      else if (isNaN(Date.parse(emp.employment_start))) errs.employment_start = "Invalid start date";
      if (!emp.is_current) {
        if (!emp.employment_end) errs.employment_end = "End date is required (or check 'Currently working')";
        else if (isNaN(Date.parse(emp.employment_end))) errs.employment_end = "Invalid end date";
      }
      return errs;
    });
    setEmpErrors(allErrors);
    return {
      valid: allErrors.every((e) => Object.keys(e).length === 0),
      errors: allErrors,
    };
  };

  const getFilledEmployments = () =>
    employments.filter((emp) => isEmploymentTouched(emp) && emp.company_name.trim());

  /* ── Product toggle ── */
  const handleProductToggle = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
    if (stepErrors.selectedProducts)
      setStepErrors((prev) => ({ ...prev, selectedProducts: undefined }));
  };

  /* ── Submit ── */
  const submitForm = async () => {
    // Validate all active steps
    const personalErrors = validators.personal(form);
    if (Object.keys(personalErrors).length > 0) {
      toast.error(Object.values(personalErrors)[0]);
      setCurrentStep("personal"); setStepErrors(personalErrors); return;
    }
    const productErrors = validators.products(form, selectedProducts);
    if (Object.keys(productErrors).length > 0) {
      toast.error(Object.values(productErrors)[0]);
      setCurrentStep("products"); setStepErrors(productErrors); return;
    }

    // Validate each active product step
    for (const stepKey of activeSteps) {
      if (["personal", "products", "review", "employment", "acknowledge"].includes(stepKey)) continue;
      const validator = validators[stepKey];
      if (!validator) continue;
      const errors = validator(form);
      if (Object.keys(errors).length > 0) {
        toast.error(`${STEP_DISPLAY_NAMES[stepKey]}: ${Object.values(errors)[0]}`);
        setCurrentStep(stepKey); setStepErrors(errors); return;
      }
    }

    if (activeSteps.includes("employment")) {
      const { valid } = validateEmployments();
      if (!valid) {
        toast.error("Please fix employment errors before submitting");
        setCurrentStep("employment"); return;
      }
    }

    const acknowledgeErrors = validators.acknowledge(form, acknowledgeChecked);
    if (Object.keys(acknowledgeErrors).length > 0) {
      toast.error(Object.values(acknowledgeErrors)[0]);
      setCurrentStep("acknowledge");
      setStepErrors(acknowledgeErrors);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) return;
        formData.append(key, value);
      });

      // Pan card — uppercase
      if (form.pan_card) formData.set("pan_card", form.pan_card.toUpperCase());

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
      // formData.append("acknowledgeChecked", String(acknowledgeChecked));
      formData.append("acknowladge", acknowledgeChecked);
      selectedProducts.forEach((id) => formData.append("products[]", id));

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

  /* ── Review helpers ── */
  const getProductNames = () =>
    products
      .filter((p) => selectedProducts.includes(p.id || p._id))
      .map((p) => p.name || p.title)
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
            <p className="bgv-header-sub">
              Step {currentIndex + 1} of {totalSteps} — {STEP_DISPLAY_NAMES[currentStep]}
            </p>
          </div>
          <button className="bgv-close-btn" type="button" onClick={() => navigate("/bgv/list")}>✕</button>
        </div>

        {/* STEP BAR */}
        <StepBar activeSteps={activeSteps} currentStep={currentStep} onStepClick={goToStep} />

        {/* ══ PERSONAL ══ */}
        {currentStep === "personal" && (
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
              <div className="form-field">
                <label>Gender <span className="req-star">*</span></label>
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
                <label>Date of Birth <span className="req-star">*</span></label>
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
              <span />
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ PRODUCTS ══ */}
        {currentStep === "products" && (
          <div className="form-section">
            <h4>Select Products <span className="req-star">*</span></h4>
            <p className="form-section-hint">
              Choose one or more verification products. Each selected product will unlock its own form section.
            </p>

            {stepErrors.selectedProducts && (
              <div className="bgv-error-banner">⚠ {stepErrors.selectedProducts}</div>
            )}

            {products.length === 0 ? (
              <p className="no-services">Loading products…</p>
            ) : (
              <div className="service-list">
                {products.map((product) => {
                  const productId = product.id || product._id;
                  const name = (product.name || product.title || "").toLowerCase().trim();
                  const hasStep = PRODUCT_STEP_MAP[name] !== undefined;
                  return (
                    <label
                      key={productId}
                      className={`service-card ${selectedProducts.includes(productId) ? "selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(productId)}
                        onChange={() => handleProductToggle(productId)}
                      />
                      <span>{product.name || product.title || "Unnamed product"}</span>
                      {hasStep && selectedProducts.includes(productId) && (
                        <span className="product-step-badge">+ form section</span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button
                className="btn-next"
                type="button"
                onClick={() => {
                  const errors = validators.products(form, selectedProducts);
                  if (Object.keys(errors).length === 0) {
                    next();
                  } else {
                    setStepErrors(errors);
                    toast.error(errors.selectedProducts || "Please select at least one product");
                  }
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ══ IDENTITY (ID Verification) ══ */}
        {currentStep === "identity" && (
          <div className="form-section">
            <h4>ID Verification <span className="step-tag">Identity Check</span></h4>
            <p className="form-section-hint">All fields are mandatory for ID verification.</p>
            <div className="form-grid">
              <div className="form-field">
                <label>ID Type <span className="req-star">*</span></label>
                <select
                  name="id_type"
                  value={form.id_type}
                  onChange={handleChange}
                  className={stepErrors.id_type ? "input-error" : ""}
                >
                  <option value="">Select ID Type</option>
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="PAN">PAN</option>
                  <option value="Passport">Passport</option>
                  <option value="Others">Others</option>
                </select>
                <FieldError message={stepErrors.id_type} />
              </div>
              <div className="form-field">
                <label>ID Number <span className="req-star">*</span></label>
                <input
                  name="id_number"
                  placeholder="Enter ID number"
                  value={form.id_number}
                  onChange={handleChange}
                  className={stepErrors.id_number ? "input-error" : ""}
                />
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

        {/* ══ ADDRESS (Address Verification) ══ */}
        {currentStep === "address" && (
          <div className="form-section">
            <h4>Address Verification</h4>
            <p className="form-section-hint">Fields marked <span className="req-star">*</span> are mandatory.</p>

            <h5 className="sub-section-title">Current Address</h5>
            <div className="form-grid">
              <div className="form-field">
                <label>Address <span className="req-star">*</span></label>
                <input
                  name="current_address"
                  placeholder="Street, Area"
                  value={form.current_address}
                  onChange={handleChange}
                  className={stepErrors.current_address ? "input-error" : ""}
                />
                <FieldError message={stepErrors.current_address} />
              </div>
              <div className="form-field">
                <label>Landmark <span className="req-star">*</span></label>
                <input
                  name="current_landmark"
                  placeholder="Nearest landmark"
                  value={form.current_landmark}
                  onChange={handleChange}
                  className={stepErrors.current_landmark ? "input-error" : ""}
                />
                <FieldError message={stepErrors.current_landmark} />
              </div>
              <div className="form-field">
                <label>Residency Status</label>
                <select
                  name="current_residency"
                  value={form.current_residency}
                  onChange={handleChange}
                  className={stepErrors.current_residency ? "input-error" : ""}
                >
                  <option value="">Select Residency Status</option>
                  <option value="Owned">Owned</option>
                  <option value="Rented">Rented</option>
                </select>
              </div>
              <div className="form-field">
                <label>Duration of Stay</label>
                <input name="current_duration" placeholder="e.g. 2 years" value={form.current_duration} onChange={handleChange} />
              </div>
            </div>

            <h5 className="sub-section-title">Permanent Address</h5>
            <div className="form-grid">
              <div className="form-field">
                <label>Address <span className="req-star">*</span></label>
                <input
                  name="permanent_address"
                  placeholder="Street, Area"
                  value={form.permanent_address}
                  onChange={handleChange}
                  className={stepErrors.permanent_address ? "input-error" : ""}
                />
                <FieldError message={stepErrors.permanent_address} />
              </div>
              <div className="form-field">
                <label>Landmark <span className="req-star">*</span></label>
                <input
                  name="permanent_landmark"
                  placeholder="Nearest landmark"
                  value={form.permanent_landmark}
                  onChange={handleChange}
                  className={stepErrors.permanent_landmark ? "input-error" : ""}
                />
                <FieldError message={stepErrors.permanent_landmark} />
              </div>
              <div className="form-field">
                <label>Residency Status</label>
                <select
                  name="permanent_residency"
                  value={form.permanent_residency}
                  onChange={handleChange}
                  className={stepErrors.permanent_residency ? "input-error" : ""}
                >
                  <option value="">Select Residency Status</option>
                  <option value="Owned">Owned</option>
                  <option value="Rented">Rented</option>
                </select>
                {/* <input name="permanent_residency" placeholder="e.g. Rented, Owned" value={form.permanent_residency} onChange={handleChange} /> */}
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

        {/* ══ CRIMINAL ══ */}
        {currentStep === "criminal" && (
          <div className="form-section">
            <h4>Criminal Check</h4>
            <p className="form-section-hint">All fields are mandatory for criminal background verification.</p>
            <div className="form-grid">
              <div className="form-field">
                <label>Father's Name <span className="req-star">*</span></label>
                <input
                  name="father_name"
                  placeholder="Father's full name"
                  value={form.father_name}
                  onChange={handleChange}
                  className={stepErrors.father_name ? "input-error" : ""}
                />
                <FieldError message={stepErrors.father_name} />
              </div>
              <div className="form-field">
                <label>Mother's Name <span className="req-star">*</span></label>
                <input
                  name="mother_name"
                  placeholder="Mother's full name"
                  value={form.mother_name}
                  onChange={handleChange}
                  className={stepErrors.mother_name ? "input-error" : ""}
                />
                <FieldError message={stepErrors.mother_name} />
              </div>
              <div className="form-field">
                <label>Address Detail <span className="req-star">*</span></label>
                <input
                  name="address_detail"
                  placeholder="Full address for criminal check"
                  value={form.address_detail}
                  onChange={handleChange}
                  className={stepErrors.address_detail ? "input-error" : ""}
                />
                <FieldError message={stepErrors.address_detail} />
              </div>
              <div className="form-field">
                <label>City <span className="req-star">*</span></label>
                <input
                  name="city"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className={stepErrors.city ? "input-error" : ""}
                />
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
        {currentStep === "employment" && (
          <div className="form-section">
            <h4>Employment Check</h4>
            <p className="form-section-hint">
              Add at least one employment record. <strong>Company Name, Employee ID, Job Title, and Start Date</strong> are required for each entry.
            </p>

            {employments.map((emp, index) => (
              <div key={index} className="employment-card">
                <div className="emp-card-header">
                  <h5>Organization {index + 1}</h5>
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
                    <label>Company Name <span className="req-star">*</span></label>
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
                    <label>Employee ID <span className="req-star">*</span></label>
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
                    <label>Job Title <span className="req-star">*</span></label>
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
                    <label>Employment Category</label>
                    <select
                      name="employment_category"
                      value={emp.employment_category}
                      onChange={(e) => handleEmploymentChange(index, e)}
                    >
                      <option value="">Select Category</option>
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Employment Type</label>
                    <select
                      name="employment_type"
                      value={emp.employment_type}
                      onChange={(e) => handleEmploymentChange(index, e)}
                    >
                      <option value="">Select Type</option>
                      <option value="Full time">Full Time</option>
                      <option value="Part time">Part Time</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Start Date <span className="req-star">*</span></label>
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
                      <label>End Date <span className="req-star">*</span></label>
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

        {/* ══ EDUCATION ══ */}
        {currentStep === "education" && (
          <div className="form-section">
            <h4>Education Check</h4>
            <p className="form-section-hint">Fields marked <span className="req-star">*</span> are mandatory.</p>
            <div className="form-grid">
              <div className="form-field">
                <label>Institute Name <span className="req-star">*</span></label>
                <input
                  name="institute_name"
                  placeholder="e.g. IIT Delhi"
                  value={form.institute_name}
                  onChange={handleChange}
                  className={stepErrors.institute_name ? "input-error" : ""}
                />
                <FieldError message={stepErrors.institute_name} />
              </div>
              <div className="form-field">
                <label>University / Board <span className="req-star">*</span></label>
                <input
                  name="university"
                  placeholder="e.g. Delhi University"
                  value={form.university}
                  onChange={handleChange}
                  className={stepErrors.university ? "input-error" : ""}
                />
                <FieldError message={stepErrors.university} />
              </div>
              <div className="form-field">
                <label>Enrollment Date <span className="req-star">*</span></label>
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
                <label>Roll / Enrollment Number <span className="req-star">*</span></label>
                <input
                  name="roll_number"
                  placeholder="Roll number"
                  value={form.roll_number}
                  onChange={handleChange}
                  className={stepErrors.roll_number ? "input-error" : ""}
                />
                <FieldError message={stepErrors.roll_number} />
              </div>
              <div className="form-field">
                <label>Qualification <span className="req-star">*</span></label>
                <input name="qualification" placeholder="e.g. B.Tech, MBA" value={form.qualification}
                  onChange={handleChange}
                  className={stepErrors.qualification ? "input-error" : ""}
                />
                <FieldError message={stepErrors.qualification} />
              </div>
              <div className="form-field">
                <label>Specialization <span className="req-star">*</span></label>
                <input name="specialization" placeholder="e.g. Computer Science" value={form.specialization} onChange={handleChange}
                  className={stepErrors.specialization ? "input-error" : ""}
                />
                <FieldError message={stepErrors.specialization} />
              </div>
              <div className="form-field">
                <label>Year of Passing <span className="req-star">*</span></label>
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
              <div className="form-field">
                <label>Degree Status</label>
                <select name="degree_status" value={form.degree_status} onChange={handleChange}>
                  <option value="">Select Status</option>
                  <option value="yes">Yes — Degree Awarded</option>
                  <option value="no">No — Not Yet Awarded</option>
                </select>
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

        {/* ══ CREDIT CHECK ══ */}
        {currentStep === "credit" && (
          <div className="form-section">
            <h4>Credit Checks</h4>
            <p className="form-section-hint">PAN card number is required for credit verification.</p>
            <div className="form-grid">
              <div className="form-field">
                <label>PAN Card Number <span className="req-star">*</span></label>
                <input
                  name="pan_card"
                  placeholder="e.g. ABCDE1234F"
                  value={form.pan_card}
                  onChange={(e) => {
                    handleChange({ target: { name: "pan_card", value: e.target.value.toUpperCase() } });
                  }}
                  maxLength={10}
                  className={stepErrors.pan_card ? "input-error" : ""}
                  style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
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
        {currentStep === "social" && (
          <div className="form-section">
            <h4>Social Media Checks</h4>
            <p className="form-section-hint">Fields marked <span className="req-star">*</span> are mandatory.</p>
            <div className="form-grid">
              <div className="form-field">
                <label>Social Media Type <span className="req-star">*</span></label>
                <select
                  name="social_media_type"
                  value={form.social_media_type}
                  onChange={handleChange}
                  className={stepErrors.social_media_type ? "input-error" : ""}
                >
                  <option value="">Select Platform</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Twitter">Twitter / X</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Other">Other</option>
                </select>
                <FieldError message={stepErrors.social_media_type} />
              </div>
              <div className="form-field">
                <label>Social Media ID / Username <span className="req-star">*</span></label>
                <input
                  name="social_media_id"
                  placeholder="e.g. @rahulkumar or profile URL"
                  value={form.social_media_id}
                  onChange={handleChange}
                  className={stepErrors.social_media_id ? "input-error" : ""}
                />
                <FieldError message={stepErrors.social_media_id} />
              </div>
              <div className="form-field">
                <label>Nick Name / Display Name</label>
                <input
                  name="nick_name"
                  placeholder="e.g. Rahul K"
                  value={form.nick_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-footer">
              <button className="btn-back" type="button" onClick={back}>← Back</button>
              <button className="btn-next" type="button" onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ══ ACKNOWLEDGE ══ */}
        {currentStep === "acknowledge" && (
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
        {currentStep === "review" && (
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
                  <ReviewRow label="Gender" value={form.gender} />
                  <ReviewRow label="DOB" value={form.dob} />
                </div>
              </div>

              <div className="review-section">
                <h5>Selected Products ({selectedProducts.length})</h5>
                <p className="review-services">{getProductNames()}</p>
              </div>

              {activeSteps.includes("identity") && (
                <div className="review-section">
                  <h5>ID Verification</h5>
                  <div className="review-grid">
                    <ReviewRow label="ID Type" value={form.id_type} />
                    <ReviewRow label="ID Number" value={form.id_number} />
                    <ReviewRow label="ID Doc" value={form.id_doc?.name} />
                  </div>
                </div>
              )}

              {activeSteps.includes("address") && (
                <div className="review-section">
                  <h5>Address Verification</h5>
                  <div className="review-grid">
                    <ReviewRow label="Current" value={form.current_address} />
                    <ReviewRow label="Current Landmark" value={form.current_landmark} />
                    <ReviewRow label="Permanent" value={form.permanent_address} />
                    <ReviewRow label="Permanent Landmark" value={form.permanent_landmark} />
                  </div>
                </div>
              )}

              {activeSteps.includes("criminal") && (
                <div className="review-section">
                  <h5>Criminal Check</h5>
                  <div className="review-grid">
                    <ReviewRow label="Father" value={form.father_name} />
                    <ReviewRow label="Mother" value={form.mother_name} />
                    <ReviewRow label="Address Detail" value={form.address_detail} />
                    <ReviewRow label="City" value={form.city} />
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
                              <span className="emp-meta">{emp.job_title}</span>
                              {emp.employment_category && <span className="emp-meta">{emp.employment_category}</span>}
                              {emp.employment_type && <span className="emp-meta">{emp.employment_type}</span>}
                              {emp.is_current && <span className="emp-current">Current</span>}
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
                  <h5>Education Check</h5>
                  <div className="review-grid">
                    <ReviewRow label="Institute" value={form.institute_name} />
                    <ReviewRow label="University" value={form.university} />
                    <ReviewRow label="Qualification" value={form.qualification} />
                    <ReviewRow label="Roll Number" value={form.roll_number} />
                    <ReviewRow label="Passing Year" value={form.passing_year} />
                    <ReviewRow label="Degree Status" value={form.degree_status === "yes" ? "Awarded" : form.degree_status === "no" ? "Not Yet Awarded" : ""} />
                    <ReviewRow label="Edu Doc" value={form.edu_doc?.name} />
                  </div>
                </div>
              )}

              {activeSteps.includes("credit") && (
                <div className="review-section">
                  <h5>Credit Checks</h5>
                  <div className="review-grid">
                    <ReviewRow label="PAN Card" value={form.pan_card} />
                  </div>
                </div>
              )}

              {activeSteps.includes("social") && (
                <div className="review-section">
                  <h5>Social Media Checks</h5>
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

export default BgvRequestForm;
