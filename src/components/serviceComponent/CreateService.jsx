import { useState } from "react";
import "./createService.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

/* ══════════════════════════════════════════
   EMPTY FORM SHAPE  (matches req.body)
══════════════════════════════════════════ */
const EMPTY_FORM = {
  name: "",
  description: "",
  moredetails: {
    detaildescription: "",
    keybenifits: [],
    extradetailTitle: "",
    extradetailList: [],
    frequentlyaskedquestions: [],
  },
};

/* ══════════════════════════════════════════
   VALIDATION
══════════════════════════════════════════ */
function validate(form) {
  const errors = {};

  if (!form.name.trim())
    errors.name = "Service name is required.";

  if (!form.description.trim())
    errors.description = "Short description is required.";

  if (!form.moredetails.detaildescription.trim())
    errors.detaildescription = "Full description is required.";

  if (!form.moredetails.extradetailTitle.trim())
    errors.extradetailTitle = "Section title is required.";

  return errors; // empty object = valid
}

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */
function SectionLabel({ children, required }) {
  return (
    <p className="cs-section-label">
      {children}
      {required && <span className="cs-required">*</span>}
    </p>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="cs-field-error">⚠ {message}</p>;
}

/* ── Tag pill editor ── */
function TagList({ items = [], onChange }) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const trimmed = draft.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setDraft("");
    }
  };

  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="cs-taglist">
      <div className="cs-tags">
        {items.length === 0 && (
          <p className="cs-tags-empty">No items yet — add one below</p>
        )}
        {items.map((item, idx) => (
          <span key={idx} className="cs-tag">
            {item}
            <button
              type="button"
              className="cs-tag-remove"
              onClick={() => removeItem(idx)}
              aria-label="Remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="cs-tag-input-row">
        <input
          className="cs-input cs-tag-input"
          placeholder="Type and press Enter to add…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="cs-tag-add-btn" onClick={addItem}>
          + Add
        </button>
      </div>
    </div>
  );
}

/* ── FAQ editor ── */
function FaqEditor({ faqs = [], onChange }) {
  const update = (idx, field, value) =>
    onChange(faqs.map((faq, i) => (i === idx ? { ...faq, [field]: value } : faq)));

  const addFaq    = () => onChange([...faqs, { question: "", answer: "" }]);
  const removeFaq = (idx) => onChange(faqs.filter((_, i) => i !== idx));

  return (
    <div className="cs-faq-editor">
      {faqs.length === 0 && (
        <div className="cs-faq-empty">
          <span className="cs-faq-empty-icon">?</span>
          <p>No FAQs yet. Click below to add your first one.</p>
        </div>
      )}
      {faqs.map((faq, idx) => (
        <div key={idx} className="cs-faq-card">
          <div className="cs-faq-card-head">
            <span className="cs-faq-num">Q{idx + 1}</span>
            <button
              type="button"
              className="cs-faq-remove"
              onClick={() => removeFaq(idx)}
            >
              Remove
            </button>
          </div>

          <label className="cs-label">Question</label>
          <input
            className="cs-input"
            value={faq.question}
            onChange={(e) => update(idx, "question", e.target.value)}
            placeholder="Enter question…"
          />

          <label className="cs-label" style={{ marginTop: "10px" }}>
            Answer
          </label>
          <textarea
            className="cs-input cs-textarea"
            value={faq.answer}
            onChange={(e) => update(idx, "answer", e.target.value)}
            placeholder="Enter answer…"
            rows={3}
          />
        </div>
      ))}
      <button type="button" className="cs-add-faq-btn" onClick={addFaq}>
        + Add FAQ
      </button>
    </div>
  );
}

/* ── Toast ── */
function Toast({ message, type = "success", onClose }) {
  return (
    <div className={`cs-toast ${type === "error" ? "cs-toast-error" : ""}`}>
      <span>{type === "error" ? "✖" : "✔"} {message}</span>
      <button onClick={onClose} className="cs-toast-close">×</button>
    </div>
  );
}

/* ── Progress steps ── */
const STEPS = ["Basic Info", "Details", "Benefits & Lists", "FAQs"];

function StepBar({ current }) {
  return (
    <div className="cs-stepbar">
      {STEPS.map((label, i) => (
        <div
          key={i}
          className={`cs-step ${i < current ? "cs-step-done" : ""} ${i === current ? "cs-step-active" : ""}`}
        >
          <div className="cs-step-circle">
            {i < current ? "✓" : i + 1}
          </div>
          <span className="cs-step-label">{label}</span>
          {i < STEPS.length - 1 && <div className="cs-step-line" />}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function CreateService() {
  const navigate = useNavigate();

  /* ── state ── */
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);   // { message, type }
  const [errors,  setErrors]  = useState({});     // inline field errors
  const [step,    setStep]    = useState(0);      // which step is visually "active"

  /* ── helpers ── */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const setTop = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    // clear error on change
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const setDetail = (field, value) => {
    setForm((f) => ({
      ...f,
      moredetails: { ...f.moredetails, [field]: value },
    }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleReset = () => {
    if (window.confirm("Clear all fields and start over?")) {
      setForm(EMPTY_FORM);
      setErrors({});
      setStep(0);
    }
  };

  /* ── POST on submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before sending
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.post("/service/add", form);
      showToast("Service created successfully!");
      // Navigate to services list after short delay so user sees the toast
      setTimeout(() => navigate("/services"), 1500);
    } catch (err) {
      console.error("Create service error:", err);
      showToast(
        err?.response?.data?.message ?? "Failed to create service. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ── Track active step based on scroll / focus (lightweight approach) ── */
  const handleCardFocus = (stepIdx) => setStep(stepIdx);

  /* ── Render ── */
  return (
    <div className="cs-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form className="cs-form" onSubmit={handleSubmit} noValidate>

        {/* ── Header ── */}
        <div className="cs-form-header">
          <div className="cs-form-header-left">
            <p className="cs-form-eyebrow">Service Manager</p>
            <h1 className="cs-form-title">Add New Service</h1>
            <p className="cs-form-subtitle">
              Fill in the details below to publish a new service offering.
            </p>
          </div>
          <div className="cs-form-header-actions">
            <button
              type="button"
              className="cs-btn-ghost"
              onClick={handleReset}
            >
              Clear All
            </button>
            <button
              type="submit"
              className="cs-btn-primary"
              disabled={saving}
            >
              {saving ? (
                <span className="cs-spinner" />
              ) : (
                <>Create Service <span className="cs-arrow">→</span></>
              )}
            </button>
          </div>
        </div>

        {/* ── Step bar ── */}
        <StepBar current={step} />

        <div className="cs-form-body">

          {/* ══ LEFT COLUMN ══ */}
          <div className="cs-col cs-col-left">

            {/* 1 — Basic Info */}
            <section
              className="cs-card"
              onFocus={() => handleCardFocus(0)}
            >
              <div className="cs-card-title-row">
                <div className="cs-card-icon">✦</div>
                <div>
                  <h2 className="cs-card-title">Basic Information</h2>
                  <p className="cs-card-subtitle">Name and short description</p>
                </div>
              </div>

              <div className="cs-field">
                <SectionLabel required>Service Name</SectionLabel>
                <input
                  className={`cs-input ${errors.name ? "cs-input-error" : ""}`}
                  value={form.name}
                  onChange={(e) => setTop("name", e.target.value)}
                  placeholder="e.g. Tenant Verification"
                />
                <FieldError message={errors.name} />
              </div>

              <div className="cs-field">
                <SectionLabel required>Short Description</SectionLabel>
                <textarea
                  className={`cs-input cs-textarea ${errors.description ? "cs-input-error" : ""}`}
                  value={form.description}
                  onChange={(e) => setTop("description", e.target.value)}
                  rows={4}
                  placeholder="Brief public-facing description shown on the services listing page…"
                />
                <div className="cs-field-footer">
                  <FieldError message={errors.description} />
                  <span className="cs-char-count">{form.description.length} chars</span>
                </div>
              </div>
            </section>

            {/* 2 — Detail Description */}
            <section
              className="cs-card"
              onFocus={() => handleCardFocus(1)}
            >
              <div className="cs-card-title-row">
                <div className="cs-card-icon">≡</div>
                <div>
                  <h2 className="cs-card-title">Detail Description</h2>
                  <p className="cs-card-subtitle">Extended content shown on the service page</p>
                </div>
              </div>

              <div className="cs-field">
                <SectionLabel required>Full Description</SectionLabel>
                <textarea
                  className={`cs-input cs-textarea ${errors.detaildescription ? "cs-input-error" : ""}`}
                  value={form.moredetails.detaildescription}
                  onChange={(e) => setDetail("detaildescription", e.target.value)}
                  rows={7}
                  placeholder="Comprehensive description with full context about what this service offers…"
                />
                <FieldError message={errors.detaildescription} />
              </div>
            </section>

            {/* 3 — Key Benefits */}
            <section
              className="cs-card"
              onFocus={() => handleCardFocus(2)}
            >
              <div className="cs-card-title-row">
                <div className="cs-card-icon">◆</div>
                <div>
                  <h2 className="cs-card-title">Key Benefits</h2>
                  <p className="cs-card-subtitle">Highlight what sets this service apart</p>
                </div>
              </div>
              <p className="cs-card-hint">
                Format each item as <code>Title:Description</code>
              </p>
              <TagList
                items={form.moredetails.keybenifits}
                onChange={(val) => setDetail("keybenifits", val)}
              />
            </section>
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="cs-col cs-col-right">

            {/* 4 — Extra Detail Section */}
            <section
              className="cs-card"
              onFocus={() => handleCardFocus(2)}
            >
              <div className="cs-card-title-row">
                <div className="cs-card-icon">▤</div>
                <div>
                  <h2 className="cs-card-title">Extra Detail Section</h2>
                  <p className="cs-card-subtitle">Additional bullet-point content block</p>
                </div>
              </div>

              <div className="cs-field">
                <SectionLabel required>Section Title</SectionLabel>
                <input
                  className={`cs-input ${errors.extradetailTitle ? "cs-input-error" : ""}`}
                  value={form.moredetails.extradetailTitle}
                  onChange={(e) => setDetail("extradetailTitle", e.target.value)}
                  placeholder="e.g. Tenant Screening Solutions"
                />
                <FieldError message={errors.extradetailTitle} />
              </div>

              <div className="cs-field">
                <SectionLabel>Detail List Items</SectionLabel>
                <p className="cs-hint">First item is treated as the intro paragraph</p>
                <TagList
                  items={form.moredetails.extradetailList}
                  onChange={(val) => setDetail("extradetailList", val)}
                />
              </div>
            </section>

            {/* 5 — FAQs */}
            <section
              className="cs-card"
              onFocus={() => handleCardFocus(3)}
            >
              <div className="cs-card-title-row">
                <div className="cs-card-icon cs-card-icon-q">?</div>
                <div>
                  <h2 className="cs-card-title">Frequently Asked Questions</h2>
                  <p className="cs-card-subtitle">Common questions about this service</p>
                </div>
              </div>
              <FaqEditor
                faqs={form.moredetails.frequentlyaskedquestions}
                onChange={(val) => setDetail("frequentlyaskedquestions", val)}
              />
            </section>

            {/* 6 — Summary card */}
            <div className="cs-summary-card">
              <h3 className="cs-summary-title">Ready to publish?</h3>
              <ul className="cs-summary-list">
                <li className={form.name ? "cs-sum-ok" : "cs-sum-missing"}>
                  {form.name ? "✓" : "○"} Service name
                </li>
                <li className={form.description ? "cs-sum-ok" : "cs-sum-missing"}>
                  {form.description ? "✓" : "○"} Short description
                </li>
                <li className={form.moredetails.detaildescription ? "cs-sum-ok" : "cs-sum-missing"}>
                  {form.moredetails.detaildescription ? "✓" : "○"} Full description
                </li>
                <li className={form.moredetails.keybenifits.length > 0 ? "cs-sum-ok" : "cs-sum-optional"}>
                  {form.moredetails.keybenifits.length > 0 ? "✓" : "○"} Key benefits ({form.moredetails.keybenifits.length})
                </li>
                <li className={form.moredetails.extradetailTitle ? "cs-sum-ok" : "cs-sum-missing"}>
                  {form.moredetails.extradetailTitle ? "✓" : "○"} Extra section title
                </li>
                <li className={form.moredetails.frequentlyaskedquestions.length > 0 ? "cs-sum-ok" : "cs-sum-optional"}>
                  {form.moredetails.frequentlyaskedquestions.length > 0 ? "✓" : "○"} FAQs ({form.moredetails.frequentlyaskedquestions.length})
                </li>
              </ul>
              <button
                type="submit"
                className="cs-btn-primary cs-btn-full"
                disabled={saving}
              >
                {saving ? <span className="cs-spinner" /> : "Create Service →"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="cs-form-footer">
          <button
            type="button"
            className="cs-btn-ghost"
            onClick={() => navigate("/services")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cs-btn-primary"
            disabled={saving}
          >
            {saving ? <span className="cs-spinner" /> : "Create Service →"}
          </button>
        </div>
      </form>
    </div>
  );
}