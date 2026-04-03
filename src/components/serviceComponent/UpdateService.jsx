import { useEffect, useState, useRef } from "react";
import "./updateService.css";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

/* ══════════════════════════════════════════
   EMPTY FORM SHAPE  (matches req.body)
   Used only as a fallback — real initial
   state always comes from the GET response.
══════════════════════════════════════════ */
const EMPTY_FORM = {
  id: "",
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
   SUB-COMPONENTS
══════════════════════════════════════════ */
function SectionLabel({ children }) {
  return <p className="es-section-label">{children}</p>;
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
    <div className="es-taglist">
      <div className="es-tags">
        {items.map((item, idx) => (
          <span key={idx} className="es-tag">
            {item}
            <button
              type="button"
              className="es-tag-remove"
              onClick={() => removeItem(idx)}
              aria-label="Remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="es-tag-input-row">
        <input
          className="es-input es-tag-input"
          placeholder="Type and press Enter to add…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="es-tag-add-btn" onClick={addItem}>
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

  const addFaq = () => onChange([...faqs, { question: "", answer: "" }]);
  const removeFaq = (idx) => onChange(faqs.filter((_, i) => i !== idx));

  return (
    <div className="es-faq-editor">
      {faqs.map((faq, idx) => (
        <div key={idx} className="es-faq-card">
          <div className="es-faq-card-head">
            <span className="es-faq-num">Q{idx + 1}</span>
            <button
              type="button"
              className="es-faq-remove"
              onClick={() => removeFaq(idx)}
            >
              Remove
            </button>
          </div>

          <label className="es-label">Question</label>
          <input
            className="es-input"
            value={faq.question}
            onChange={(e) => update(idx, "question", e.target.value)}
            placeholder="Enter question…"
          />

          <label className="es-label" style={{ marginTop: "10px" }}>
            Answer
          </label>
          <textarea
            className="es-input es-textarea"
            value={faq.answer}
            onChange={(e) => update(idx, "answer", e.target.value)}
            placeholder="Enter answer…"
            rows={3}
          />
        </div>
      ))}
      <button type="button" className="es-add-faq-btn" onClick={addFaq}>
        + Add FAQ
      </button>
    </div>
  );
}

/* ── Toast ── */
function Toast({ message, type = "success", onClose }) {
  return (
    <div className={`es-toast ${type === "error" ? "es-toast-error" : ""}`}>
      <span>{type === "error" ? "✖" : "✔"} {message}</span>
      <button onClick={onClose} className="es-toast-close">
        ×
      </button>
    </div>
  );
}

/* ── Skeleton shimmer while fetching ── */
function Skeleton() {
  return (
    <div className="es-skeleton-page">
      <div className="es-skeleton-header">
        <div className="es-skel es-skel-title" />
        <div className="es-skel es-skel-btn" />
      </div>
      <div className="es-skeleton-body">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="es-skeleton-card">
            <div className="es-skel es-skel-label" />
            <div className="es-skel es-skel-input" />
            <div className="es-skel es-skel-input es-skel-tall" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function UpdateService() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ── state ── */
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);       // true on first mount
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);       // { message, type }
  const originalRef = useRef(null);          // snapshot for Discard

  /* ── helpers ── */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const setTop = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const setDetail = (field, value) =>
    setForm((f) => ({
      ...f,
      moredetails: { ...f.moredetails, [field]: value },
    }));

  /* ── GET service on mount ── */
  useEffect(() => {
    if (!id) return;

    let cancelled = false; // prevent stale state update on unmount

    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/service/getby/${id}`);
        const serviceData = res?.data?.data ?? {};

        // Ensure nested shape is always safe even if API omits some keys
        const safe = {
          ...EMPTY_FORM,
          ...serviceData,
          moredetails: {
            ...EMPTY_FORM.moredetails,
            ...(serviceData.moredetails ?? {}),
          },
        };

        if (!cancelled) {
          originalRef.current = safe;   // keep a clean copy for Discard
          setForm(safe);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Fetch service error:", err);
          showToast(
            err?.response?.data?.message ?? "Failed to load service details.",
            "error"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchService();
    return () => { cancelled = true; };
  }, [id]); // re-fetch if id ever changes (e.g. navigating between edit pages)

  /* ── PUT (update) on submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();  // ← must be first, before any possible throw
    setSaving(true);

    try {
      // form is a plain object — just spread id in, no .append() needed
      const payload = { ...form, id };

      console.log("Submitting form:", payload);

      await axiosInstance.put(`/service/update`, payload);

      originalRef.current = payload;
      showToast("Changes saved successfully!");
    } catch (err) {
      console.error("Update service error:", err);
      showToast(
        err?.response?.data?.message ?? "Failed to save changes. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ── Discard: restore the last fetched/saved snapshot ── */
  const handleDiscard = () => {
    if (window.confirm("Discard all unsaved changes?")) {
      setForm(originalRef.current ?? EMPTY_FORM);
    }
  };

  /* ── Render ── */
  if (loading) return <Skeleton />;

  return (
    <div className="es-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form className="es-form" onSubmit={handleSubmit} noValidate>

        {/* ── Header ── */}
        <div className="es-form-header">
          <div>
            <p className="es-form-eyebrow">Service Editor</p>
            <h1 className="es-form-title">Edit Service</h1>
          </div>
          <div className="es-form-header-actions">
            <button
              type="button"
              className="es-btn-ghost"
              onClick={handleDiscard}
            >
              Discard
            </button>
            <button
              type="submit"
              className="es-btn-primary"
              disabled={saving}
            >
              {saving ? (
                <span className="es-spinner" />
              ) : (
                <>Save Changes <span className="es-arrow">→</span></>
              )}
            </button>
          </div>
        </div>

        <div className="es-form-body">

          {/* ══ LEFT COLUMN ══ */}
          <div className="es-col es-col-left">

            {/* Basic Info */}
            <section className="es-card">
              <div className="es-card-title-row">
                <div className="es-card-icon">✦</div>
                <h2 className="es-card-title">Basic Information</h2>
              </div>

              <div className="es-field">
                <SectionLabel>Service Name *</SectionLabel>
                <input
                  className="es-input"
                  value={form.name}
                  onChange={(e) => setTop("name", e.target.value)}
                  placeholder="e.g. Tenant Verification"
                  required
                />
              </div>

              <div className="es-field">
                <SectionLabel>Short Description *</SectionLabel>
                <textarea
                  className="es-input es-textarea"
                  value={form.description}
                  onChange={(e) => setTop("description", e.target.value)}
                  rows={4}
                  placeholder="Brief public-facing description…"
                  required
                />
                <p className="es-hint">{form.description?.length ?? 0} characters</p>
              </div>
            </section>

            {/* Detail Description */}
            <section className="es-card">
              <div className="es-card-title-row">
                <div className="es-card-icon">≡</div>
                <h2 className="es-card-title">Detail Description</h2>
              </div>
              <div className="es-field">
                <SectionLabel>Full Description *</SectionLabel>
                <textarea
                  className="es-input es-textarea"
                  value={form.moredetails.detaildescription}
                  onChange={(e) => setDetail("detaildescription", e.target.value)}
                  rows={6}
                  placeholder="Extended service description…"
                  required
                />
              </div>
            </section>

            {/* Key Benefits */}
            <section className="es-card">
              <div className="es-card-title-row">
                <div className="es-card-icon">◆</div>
                <h2 className="es-card-title">Key Benefits</h2>
              </div>
              <p className="es-card-hint">
                Format: <code>Title:Description</code>
              </p>
              <TagList
                items={form.moredetails.keybenifits}
                onChange={(val) => setDetail("keybenifits", val)}
              />
            </section>
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="es-col es-col-right">

            {/* Extra Detail */}
            <section className="es-card">
              <div className="es-card-title-row">
                <div className="es-card-icon">▤</div>
                <h2 className="es-card-title">Extra Detail Section</h2>
              </div>

              <div className="es-field">
                <SectionLabel>Section Title *</SectionLabel>
                <input
                  className="es-input"
                  value={form.moredetails.extradetailTitle}
                  onChange={(e) => setDetail("extradetailTitle", e.target.value)}
                  placeholder="e.g. Tenant Screening Solutions"
                  required
                />
              </div>

              <div className="es-field">
                <SectionLabel>Detail List Items</SectionLabel>
                <p className="es-hint">First item is treated as intro text</p>
                <TagList
                  items={form.moredetails.extradetailList}
                  onChange={(val) => setDetail("extradetailList", val)}
                />
              </div>
            </section>

            {/* FAQs */}
            <section className="es-card">
              <div className="es-card-title-row">
                <div className="es-card-icon">?</div>
                <h2 className="es-card-title">Frequently Asked Questions</h2>
              </div>
              <FaqEditor
                faqs={form.moredetails.frequentlyaskedquestions}
                onChange={(val) => setDetail("frequentlyaskedquestions", val)}
              />
            </section>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="es-form-footer">
          <button
            type="button"
            className="es-btn-ghost"
            onClick={() => navigate("/services")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="es-btn-primary"
            disabled={saving}
          >
            {saving ? <span className="es-spinner" /> : "Save Changes →"}
          </button>
        </div>
      </form>
    </div>
  );
}