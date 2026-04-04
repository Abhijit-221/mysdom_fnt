import React, { useEffect, useState } from "react";
import "./bgvViewEditForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const STEPS = [
  { label: "Personal",   icon: "👤" },
  { label: "Identity",   icon: "🪪" },
  { label: "Address",    icon: "🏠" },
  { label: "Criminal",   icon: "🔍" },
  { label: "Employment", icon: "💼" },
  { label: "Education",  icon: "🎓" },
  { label: "Services",   icon: "⚙️" },
  { label: "Review",     icon: "✅" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/; // en-IN mobile

/* ─────────────────────────────────────────────
   VALIDATION
───────────────────────────────────────────── */
const validateStep = (step, formData, selectedServices) => {
  const errs = {};

  if (step === 1) {
    if (!formData.candidate_name?.trim())
      errs.candidate_name = "Name is required";
    if (formData.candidate_email && !EMAIL_RE.test(formData.candidate_email))
      errs.candidate_email = "Invalid email address";
    if (formData.candidate_phone && !PHONE_RE.test(formData.candidate_phone))
      errs.candidate_phone = "Must be a valid 10-digit Indian mobile number";
  }

  if (step === 2) {
    if (!formData.id_type?.trim())   errs.id_type   = "ID type is required";
    if (!formData.id_number?.trim()) errs.id_number = "ID number is required";
  }

  if (step === 4) {
    if (formData.gender && !["MALE", "FEMALE", "OTHER"].includes(formData.gender.toUpperCase()))
      errs.gender = "Gender must be MALE, FEMALE or OTHER";
    if (formData.dob && isNaN(new Date(formData.dob).getTime()))
      errs.dob = "Invalid date";
  }

  if (step === 5) {
    formData.employments.forEach((emp, i) => {
      if (!emp.company_name?.trim())
        errs[`emp_${i}_company`] = "Company name is required";
      if (emp.employment_start && emp.employment_end && !emp.isCurrent) {
        if (new Date(emp.employment_end) < new Date(emp.employment_start))
          errs[`emp_${i}_end`] = "End date must be after start date";
      }
    });
  }

  if (step === 7 && selectedServices.length === 0)
    errs.services = "Please select at least one service";

  return errs;
};

/* ─────────────────────────────────────────────
   SMALL UI HELPERS — defined OUTSIDE component
   so their identity is stable across re-renders
───────────────────────────────────────────── */

// ✅ FIX: Inp is now at module level — no more focus loss on keystroke
const Inp = ({ name, value, onChange, errors = {}, className = "", ...rest }) => (
  <input
    name={name}
    className={`bgv-input ${errors[name] ? "error" : ""} ${className}`}
    onChange={onChange}
    value={value || ""}
    {...rest}
  />
);

const Field = ({ label, error, children }) => (
  <div className="bgv-field">
    <label className="bgv-label">{label}</label>
    {children}
    {error && <div className="bgv-error-text">⚠ {error}</div>}
  </div>
);

const FileOrLink = ({ value, base }) => {
  if (!value) return null;
  if (typeof value === "string")
    return (
      <a
        href={`${base}/${value.replace(/\\/g, "/")}`}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="bgv-file-link"
      >
        📎 {value.split(/[\\/]/).pop()}
      </a>
    );
  return <div className="bgv-file-chip">📄 {value.name}</div>;
};

const ReviewRow = ({ k, v }) => (
  <div className="bgv-review-row">
    <span className="bgv-review-key">{k}</span>
    <span>{v || <em className="bgv-review-empty">—</em>}</span>
  </div>
);

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const BGVViewEditRequestForm = () => {
  const location = useLocation();
  const data     = location.state?.data;
  const mode     = location.state?.mode || "edit";
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_BASE_URL;

  const [step, setStep]                             = useState(mode === "view" ? 8 : 1);
  const [formData, setFormData]                     = useState(data);
  const [errors, setErrors]                         = useState({});
  const [removedEmployments, setRemovedEmployments] = useState([]);
  const [services, setServices]                     = useState([]);
  const [selectedServices, setSelectedServices]     = useState([]);
  const [originalServices, setOriginalServices]     = useState([]);
  const [removedServices, setRemovedServices]       = useState([]);
  const [submitting, setSubmitting]                 = useState(false);

  /* ── fetch services on mount ── */
  useEffect(() => {
    fetchServices();
    const initial = data.bgvReqestService.map((s) => s.serviceId);
    setSelectedServices(initial);
    setOriginalServices(initial);
  }, []);

  const fetchServices = async () => {
    try {
      if (mode === "edit") {
        const userDetails = await axiosInstance.get(`/auth/user/get/${data.submittedBy}`);
        const res = await axiosInstance.get(
          `/client-service/getby/${userDetails?.data?.data?.client}`
        );
        setServices(res.data?.data.map((d) => d.service));
      } else {
        setServices(data.bgvReqestService?.map((d) => d.services));
      }
    } catch (err) {
      console.error("Service fetch error", err);
    }
  };

  /* ── field handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleEmploymentChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updated = [...formData.employments];

    if (name === "isCurrent") {
      updated.forEach((_, i) => (updated[i].isCurrent = false));
      updated[index].isCurrent = checked;
      if (checked) updated[index].employment_end = "";
    } else {
      updated[index][name] = type === "checkbox" ? checked : value;
    }

    setFormData((prev) => ({ ...prev, employments: updated }));
    const errKey = `emp_${index}_${name.replace("employment_", "")}`;
    if (errors[errKey]) setErrors((prev) => ({ ...prev, [errKey]: undefined }));
  };

  const handleEmploymentFile = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...formData.employments];
    updated[index].job_doc = file;
    setFormData((prev) => ({ ...prev, employments: updated }));
  };

  const addEmployment = () => {
    setFormData((prev) => ({
      ...prev,
      employments: [
        ...prev.employments,
        {
          id: null,
          company_name: "",
          employee_id: "",
          employment_start: "",
          employment_end: "",
          job_title: "",
          leaving_reason: "",
          isCurrent: false,
          job_doc: null,
        },
      ],
    }));
  };

  const removeEmployment = (index) => {
    const emp = formData.employments[index];
    if (emp.id) setRemovedEmployments((prev) => [...prev, emp.id]);
    setFormData((prev) => ({
      ...prev,
      employments: prev.employments.filter((_, i) => i !== index),
    }));
  };

  const handleServiceChange = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
      if (originalServices.includes(serviceId))
        setRemovedServices((prev) => [...new Set([...prev, serviceId])]);
    } else {
      setSelectedServices((prev) => [...prev, serviceId]);
      setRemovedServices((prev) => prev.filter((id) => id !== serviceId));
    }
    if (errors.services) setErrors((prev) => ({ ...prev, services: undefined }));
  };

  /* ── step navigation ── */
  const next = () => {
    const errs = validateStep(step, formData, selectedServices);
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error("Please fix the highlighted errors");
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const prev = () => setStep((s) => s - 1);

  /* ── submit ── */
  const submitForm = async () => {
    const errs = validateStep(8, formData, selectedServices);
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error("Validation errors found");
      return;
    }
    try {
      setSubmitting(true);
      const fd = new FormData();

      const SKIP_KEYS = [
        "employments", "id_doc", "edu_doc", "clientId", "submittedBy",
        "updatedBy", "createdAt", "updatedAt", "client", "bgvReqestService",
        "deletedAt", "status",
      ];

      Object.keys(formData).forEach((key) => {
        if (!SKIP_KEYS.includes(key)) fd.append(key, formData[key] ?? "");
      });

      if (formData.id_doc instanceof File) fd.append("id_doc", formData.id_doc);
      if (formData.edu_doc instanceof File) fd.append("edu_doc", formData.edu_doc);

      const empWithoutFiles = formData.employments.map((emp) => ({
        id:               emp.id,
        company_name:     emp.company_name,
        employee_id:      emp.employee_id,
        employment_start: emp.employment_start,
        employment_end:   emp.employment_end,
        job_title:        emp.job_title,
        leaving_reason:   emp.leaving_reason,
        isCurrent:        emp.isCurrent,
      }));
      fd.append("bgvEmployments", JSON.stringify(empWithoutFiles));

      formData.employments.forEach((emp, index) => {
        if (emp.job_doc instanceof File)
          fd.append(`bgvEmployments[${index}][job_doc]`, emp.job_doc);
      });

      fd.append("removeEmployments", JSON.stringify(removedEmployments));
      fd.append("addservice", JSON.stringify(
        selectedServices.filter((id) => !originalServices.includes(id))
      ));
      fd.append("removeService", JSON.stringify(removedServices));

      await axiosInstance.put("/bgvrequest/update", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("BGV request updated successfully!");
      navigate("/bgv/list");
    } catch (err) {
      console.error(err);
      toast.error("Update failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="bgv-root">
      <div className="bgv-card">

        {/* ── Header ── */}
        <div className="bgv-header">
          <div className="bgv-header-icon">📋</div>
          <div>
            <h2>BGV Request</h2>
            <p>
              {mode === "view"
                ? "View-only summary"
                : "Edit & update background verification details"}
            </p>
          </div>
        </div>

        {/* ── Stepper ── */}
        {mode === "edit" && (
          <div className="bgv-stepper">
            {STEPS.map((s, i) => {
              const num    = i + 1;
              const active = step === num;
              const done   = step > num;
              return (
                <div
                  key={num}
                  className={`bgv-step-item ${active ? "active" : ""} ${done ? "done" : ""}`}
                >
                  <div className="bgv-step-dot">{done ? "✓" : num}</div>
                  <span className="bgv-step-label">{s.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════ STEP 1 — PERSONAL ══════════════ */}
        {step === 1 && (
          <div>
            <h3 className="bgv-section-title">
              <span className="bgv-section-badge" /> Personal Details
            </h3>
            <div className="bgv-two-col">
              <Field label="Candidate Name *" error={errors.candidate_name}>
                <Inp
                  name="candidate_name"
                  value={formData.candidate_name}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="Full name"
                />
              </Field>
              <Field label="Email" error={errors.candidate_email}>
                <Inp
                  name="candidate_email"
                  value={formData.candidate_email}
                  onChange={handleChange}
                  errors={errors}
                  type="email"
                  placeholder="email@example.com"
                />
              </Field>
              <Field label="Phone" error={errors.candidate_phone}>
                <Inp
                  name="candidate_phone"
                  value={formData.candidate_phone}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="10-digit mobile number"
                />
              </Field>
              <Field label="Designation">
                <Inp
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="e.g. Software Engineer"
                />
              </Field>
            </div>
            <Field label="Department">
              <Inp
                name="department"
                value={formData.department}
                onChange={handleChange}
                errors={errors}
                placeholder="e.g. Engineering"
              />
            </Field>
          </div>
        )}

        {/* ══════════════ STEP 2 — IDENTITY ══════════════ */}
        {step === 2 && (
          <div>
            <h3 className="bgv-section-title">
              <span className="bgv-section-badge" /> Identity Check
            </h3>
            <div className="bgv-two-col">
              <Field label="ID Type *" error={errors.id_type}>
                <select
                  name="id_type"
                  value={formData.id_type || ""}
                  onChange={handleChange}
                  className={`bgv-input ${errors.id_type ? "error" : ""}`}
                >
                  <option value="">Select type</option>
                  {["Aadhaar", "PAN", "Passport", "Voter ID", "Driving License"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <Field label="ID Number *" error={errors.id_number}>
                <Inp
                  name="id_number"
                  value={formData.id_number}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="Enter ID number"
                />
              </Field>
            </div>
            <Field label="Upload ID Document">
              <input
                type="file"
                name="id_doc"
                className="bgv-input"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, id_doc: e.target.files[0] }))
                }
              />
              <FileOrLink value={formData.id_doc} base={base_url} />
            </Field>
          </div>
        )}

        {/* ══════════════ STEP 3 — ADDRESS ══════════════ */}
        {step === 3 && (
          <div>
            <h3 className="bgv-section-title">
              <span className="bgv-section-badge" /> Address Details
            </h3>
            <div className="bgv-section-box">
              <p className="bgv-section-box-title">🏠 Current Address</p>
              <Field label="Full Address">
                <Inp
                  name="current_address"
                  value={formData.current_address}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="House / Street / Area"
                />
              </Field>
              <div className="bgv-address-grid">
                <Field label="Landmark">
                  <Inp
                    name="current_landmark"
                    value={formData.current_landmark}
                    onChange={handleChange}
                    errors={errors}
                    placeholder="Nearby landmark"
                  />
                </Field>
                <Field label="Residency Status">
                  <Inp
                    name="current_residency"
                    value={formData.current_residency}
                    onChange={handleChange}
                    errors={errors}
                    placeholder="Owned / Rented"
                  />
                </Field>
                <Field label="Duration of Stay">
                  <Inp
                    name="current_duration"
                    value={formData.current_duration}
                    onChange={handleChange}
                    errors={errors}
                    placeholder="e.g. 2 years"
                  />
                </Field>
              </div>
            </div>
            <div className="bgv-section-box">
              <p className="bgv-section-box-title">📌 Permanent Address</p>
              <Field label="Full Address">
                <Inp
                  name="permanent_address"
                  value={formData.permanent_address}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="House / Street / Area"
                />
              </Field>
              <div className="bgv-address-grid">
                <Field label="Landmark">
                  <Inp
                    name="permanent_landmark"
                    value={formData.permanent_landmark}
                    onChange={handleChange}
                    errors={errors}
                    placeholder="Nearby landmark"
                  />
                </Field>
                <Field label="Residency Status">
                  <Inp
                    name="permanent_residency"
                    value={formData.permanent_residency}
                    onChange={handleChange}
                    errors={errors}
                    placeholder="Owned / Rented"
                  />
                </Field>
                <Field label="Duration of Stay">
                  <Inp
                    name="permanent_duration"
                    value={formData.permanent_duration}
                    onChange={handleChange}
                    errors={errors}
                    placeholder="e.g. 5 years"
                  />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ STEP 4 — CRIMINAL ══════════════ */}
        {step === 4 && (
          <div>
            <h3 className="bgv-section-title">
              <span className="bgv-section-badge" /> Criminal Check
            </h3>
            <div className="bgv-two-col">
              <Field label="Father's Name">
                <Inp
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="Father's full name"
                />
              </Field>
              <Field label="Mother's Name">
                <Inp
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="Mother's full name"
                />
              </Field>
              <Field label="Gender" error={errors.gender}>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className={`bgv-input ${errors.gender ? "error" : ""}`}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </Field>
              <Field label="Date of Birth" error={errors.dob}>
                <Inp
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  errors={errors}
                  type="date"
                />
              </Field>
            </div>
          </div>
        )}

        {/* ══════════════ STEP 5 — EMPLOYMENT ══════════════ */}
        {step === 5 && (
          <div>
            <h3 className="bgv-section-title">
              <span className="bgv-section-badge" /> Employment History
            </h3>
            {formData.employments.map((emp, index) => (
              <div key={index} className="bgv-emp-box">
                <p className="bgv-emp-title">💼 Employment {index + 1}</p>
                <div className="bgv-two-col">
                  <Field label="Company Name *" error={errors[`emp_${index}_company`]}>
                    <input
                      name="company_name"
                      value={emp.company_name || ""}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      placeholder="Company name"
                      className={`bgv-input ${errors[`emp_${index}_company`] ? "error" : ""}`}
                    />
                  </Field>
                  <Field label="Employee ID">
                    <input
                      name="employee_id"
                      value={emp.employee_id || ""}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      placeholder="Employee ID"
                      className="bgv-input"
                    />
                  </Field>
                  <Field label="Job Title">
                    <input
                      name="job_title"
                      value={emp.job_title || ""}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      placeholder="Job title"
                      className="bgv-input"
                    />
                  </Field>
                  <Field label="Start Date">
                    <input
                      type="date"
                      name="employment_start"
                      value={emp.employment_start || ""}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className="bgv-input"
                    />
                  </Field>
                  {!emp.isCurrent && (
                    <Field label="End Date" error={errors[`emp_${index}_end`]}>
                      <input
                        type="date"
                        name="employment_end"
                        min={emp.employment_start || ""}
                        value={emp.employment_end || ""}
                        onChange={(e) => handleEmploymentChange(index, e)}
                        className={`bgv-input ${errors[`emp_${index}_end`] ? "error" : ""}`}
                      />
                    </Field>
                  )}
                </div>
                <Field label="Reason for Leaving">
                  <input
                    name="leaving_reason"
                    value={emp.leaving_reason || ""}
                    onChange={(e) => handleEmploymentChange(index, e)}
                    placeholder="e.g. Better opportunity"
                    className="bgv-input"
                  />
                </Field>
                <Field label="Payslip / Relieving Letter">
                  <input
                    type="file"
                    className="bgv-input"
                    onChange={(e) => handleEmploymentFile(index, e)}
                  />
                  {emp.job_doc && typeof emp.job_doc === "string" && (
                    <a
                      href={`${base_url}/${emp.job_doc.replace(/\\/g, "/")}`}
                      download
                      className="bgv-file-link"
                    >
                      📎 {emp.job_doc.split(/[\\/]/).pop()}
                    </a>
                  )}
                </Field>
                <div className="bgv-check-row">
                  <input
                    type="checkbox"
                    id={`cur_${index}`}
                    name="isCurrent"
                    checked={emp.isCurrent || false}
                    onChange={(e) => handleEmploymentChange(index, e)}
                  />
                  <label htmlFor={`cur_${index}`}>Currently working here</label>
                </div>
                <div className="bgv-emp-remove-row">
                  <button
                    type="button"
                    className="bgv-remove-btn"
                    onClick={() => removeEmployment(index)}
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="bgv-add-btn" onClick={addEmployment}>
              + Add Employment
            </button>
          </div>
        )}

        {/* ══════════════ STEP 6 — EDUCATION ══════════════ */}
        {step === 6 && (
          <div>
            <h3 className="bgv-section-title">
              <span className="bgv-section-badge" /> Education
            </h3>
            <div className="bgv-two-col">
              <Field label="Institute Name">
                <Inp
                  name="institute_name"
                  value={formData.institute_name}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="e.g. IIT Bombay"
                />
              </Field>
              <Field label="University">
                <Inp
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="University name"
                />
              </Field>
              <Field label="Qualification">
                <Inp
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="e.g. B.Tech"
                />
              </Field>
              <Field label="Specialization">
                <Inp
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  errors={errors}
                  placeholder="e.g. Computer Science"
                />
              </Field>
            </div>
            <Field label="Education Certificate">
              <input
                type="file"
                name="edu_doc"
                className="bgv-input"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, edu_doc: e.target.files[0] }))
                }
              />
              <FileOrLink value={formData.edu_doc} base={base_url} />
            </Field>
          </div>
        )}

        {/* ══════════════ STEP 7 — SERVICES ══════════════ */}
        {step === 7 && (
          <div>
            <h3 className="bgv-section-title">
              <span className="bgv-section-badge" /> Select Services
            </h3>
            {errors.services && (
              <div className="bgv-error-text" style={{ marginBottom: 12 }}>
                ⚠ {errors.services}
              </div>
            )}
            <div className="bgv-services-grid">
              {services.map((service) => {
                const sel = selectedServices.includes(service.id);
                return (
                  <div
                    key={service.id}
                    className={`bgv-service-chip ${sel ? "selected" : ""}`}
                    onClick={() => handleServiceChange(service.id)}
                  >
                    <span>{sel ? "✓" : "○"}</span>
                    {service.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════ STEP 8 — REVIEW ══════════════ */}
        {step === 8 && (
          <div>
            <h3 className="bgv-section-title">
              <span className="bgv-section-badge" /> Review All Details
            </h3>

            <div className="bgv-review-card">
              <p className="bgv-review-title">👤 Personal</p>
              <ReviewRow k="Name"        v={formData.candidate_name} />
              <ReviewRow k="Email"       v={formData.candidate_email} />
              <ReviewRow k="Phone"       v={formData.candidate_phone} />
              <ReviewRow k="Designation" v={formData.designation} />
              <ReviewRow k="Department"  v={formData.department} />
            </div>

            <div className="bgv-review-card">
              <p className="bgv-review-title">🪪 Identity</p>
              <ReviewRow k="ID Type"   v={formData.id_type} />
              <ReviewRow k="ID Number" v={formData.id_number} />
              {formData.id_doc && <FileOrLink value={formData.id_doc} base={base_url} />}
            </div>

            <div className="bgv-review-card">
              <p className="bgv-review-title">🏠 Address</p>
              <ReviewRow k="Current Address"    v={formData.current_address} />
              <ReviewRow k="Current Landmark"   v={formData.current_landmark} />
              <ReviewRow k="Permanent Address"  v={formData.permanent_address} />
              <ReviewRow k="Permanent Landmark" v={formData.permanent_landmark} />
            </div>

            <div className="bgv-review-card">
              <p className="bgv-review-title">🔍 Criminal Check</p>
              <ReviewRow k="Father's Name" v={formData.father_name} />
              <ReviewRow k="Mother's Name" v={formData.mother_name} />
              <ReviewRow k="Gender"        v={formData.gender} />
              <ReviewRow k="Date of Birth" v={formData.dob} />
            </div>

            <div className="bgv-review-card">
              <p className="bgv-review-title">💼 Employment History</p>
              {formData.employments.map((emp, i) => (
                <div key={i}>
                  {i > 0 && <hr className="bgv-review-divider" />}
                  <ReviewRow k="Company"            v={emp.company_name} />
                  <ReviewRow k="Employee ID"        v={emp.employee_id} />
                  <ReviewRow k="Job Title"          v={emp.job_title} />
                  <ReviewRow k="Start Date"         v={emp.employment_start} />
                  <ReviewRow
                    k="End Date / Status"
                    v={emp.isCurrent ? "Currently Working" : emp.employment_end}
                  />
                  <ReviewRow k="Reason for Leaving" v={emp.leaving_reason} />
                  {emp.job_doc && <FileOrLink value={emp.job_doc} base={base_url} />}
                </div>
              ))}
            </div>

            <div className="bgv-review-card">
              <p className="bgv-review-title">🎓 Education</p>
              <ReviewRow k="Institute"      v={formData.institute_name} />
              <ReviewRow k="University"     v={formData.university} />
              <ReviewRow k="Qualification"  v={formData.qualification} />
              <ReviewRow k="Specialization" v={formData.specialization} />
              {formData.edu_doc && <FileOrLink value={formData.edu_doc} base={base_url} />}
            </div>

            <div className="bgv-review-card">
              <p className="bgv-review-title">⚙️ Selected Services</p>
              {services
                .filter((s) => selectedServices.includes(s.id))
                .map((s) => (
                  <div key={s.id} className="bgv-review-row">
                    <span className="bgv-service-tick">✔</span>
                    <span>{s.name}</span>
                  </div>
                ))}
              {selectedServices.length === 0 && (
                <em className="bgv-service-no-selection">No services selected</em>
              )}
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        <div className="bgv-btn-group">
          <button className="bgv-btn bgv-btn-back" onClick={() => navigate("/bgv/list")}>
            ← Back to List
          </button>

          {mode === "edit" && (
            <div className="bgv-right-btns">
              {step > 1 && (
                <button className="bgv-btn bgv-btn-prev" onClick={prev}>
                  ← Previous
                </button>
              )}
              {step < 8 && (
                <button className="bgv-btn bgv-btn-next" onClick={next}>
                  Next →
                </button>
              )}
              {step === 8 && (
                <button
                  className="bgv-btn bgv-btn-update"
                  onClick={submitForm}
                  disabled={submitting}
                >
                  {submitting ? "Updating…" : "✓ Update Request"}
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BGVViewEditRequestForm;