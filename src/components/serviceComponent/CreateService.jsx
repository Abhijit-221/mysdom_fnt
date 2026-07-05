import React, { useState } from "react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

import {
  Sparkles,
  AlignLeft,
  Gem,
  LayoutList,
  HelpCircle,
  CheckCircle2,
  Circle,
  Plus,
  X,
  ArrowRight,
} from "lucide-react";

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
  if (!form.name.trim()) errors.name = "Service name is required.";
  if (!form.description.trim()) errors.description = "Short description is required.";
  if (!form.moredetails.detaildescription.trim())
    errors.detaildescription = "Full description is required.";
  if (!form.moredetails.extradetailTitle.trim())
    errors.extradetailTitle = "Section title is required.";
  return errors;
}

/* ---- Keyframes ---- */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#fbfcfc",
    transition: "box-shadow 0.25s ease",
    "& fieldset": { borderColor: "rgba(11,43,51,0.14)" },
    "&:hover fieldset": { borderColor: "rgba(11,43,51,0.3)" },
    "&.Mui-focused fieldset": { borderColor: "#F2A65A", borderWidth: 2 },
    "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(242,166,90,0.12)" },
  },
};

const STEPS = ["Basic Info", "Details", "Benefits & Lists", "FAQs"];

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */
function CardShell({ icon, title, subtitle, onFocus, children }) {
  return (
    <Box
      onFocus={onFocus}
      sx={{
        bgcolor: "#fff",
        borderRadius: 4,
        border: "1px solid rgba(11,43,51,0.08)",
        p: { xs: 2.5, md: 3.5 },
        mb: 3,
        boxShadow: "0 8px 24px rgba(11,43,51,0.05)",
        opacity: 0,
        animation: `${fadeUp} 0.5s ease forwards`,
        height: "400px",
        overflow: "auto",

        // Hide scrollbar (Chrome, Safari, Edge)
        "&::-webkit-scrollbar": {
          display: "none",
        },

        // Hide scrollbar (Firefox)
        scrollbarWidth: "none",

        // Hide scrollbar (IE & old Edge)
        msOverflowStyle: "none",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(242,166,90,0.15)",
            color: "#0B2B33",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#0B2B33" }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "rgba(11,43,51,0.55)" }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
      {children}
    </Box>
  );
}

function FieldLabel({ children, required }) {
  return (
    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#0B2B33", mb: 0.75 }}>
      {children}
      {required && <Box component="span" sx={{ color: "#F2A65A", ml: 0.5 }}>*</Box>}
    </Typography>
  );
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
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5, minHeight: 32 }}>
        {items.length === 0 && (
          <Typography sx={{ fontSize: "0.85rem", color: "rgba(11,43,51,0.4)", fontStyle: "italic" }}>
            No items yet — add one below
          </Typography>
        )}
        {items.map((item, idx) => (
          <Chip
            key={idx}
            label={item}
            onDelete={() => removeItem(idx)}
            deleteIcon={<X size={14} />}
            sx={{
              bgcolor: "rgba(242,166,90,0.15)",
              color: "#0B2B33",
              fontWeight: 500,
              "& .MuiChip-deleteIcon": { color: "rgba(11,43,51,0.5)" },
              "& .MuiChip-deleteIcon:hover": { color: "#B23A3A" },
            }}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Type and press Enter to add…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={fieldSx}
        />
        <Button
          type="button"
          onClick={addItem}
          startIcon={<Plus size={16} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "#0B2B33",
            bgcolor: "rgba(11,43,51,0.06)",
            px: 2.5,
            borderRadius: 2,
            whiteSpace: "nowrap",
            "&:hover": { bgcolor: "rgba(11,43,51,0.12)" },
          }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}

/* ── FAQ editor ── */
function FaqEditor({ faqs = [], onChange }) {
  const update = (idx, field, value) =>
    onChange(faqs.map((faq, i) => (i === idx ? { ...faq, [field]: value } : faq)));

  const addFaq = () => onChange([...faqs, { question: "", answer: "" }]);
  const removeFaq = (idx) => onChange(faqs.filter((_, i) => i !== idx));

  return (
    <Box>
      {faqs.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            borderRadius: 3,
            border: "1px dashed rgba(11,43,51,0.2)",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              mx: "auto",
              mb: 1,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(11,43,51,0.06)",
              color: "rgba(11,43,51,0.4)",
            }}
          >
            <HelpCircle size={20} />
          </Box>
          <Typography sx={{ fontSize: "0.85rem", color: "rgba(11,43,51,0.5)" }}>
            No FAQs yet. Click below to add your first one.
          </Typography>
        </Box>
      )}

      {faqs.map((faq, idx) => (
        <Box
          key={idx}
          sx={{
            p: 2.5,
            mb: 2,
            borderRadius: 3,
            bgcolor: "rgba(11,43,51,0.02)",
            border: "1px solid rgba(11,43,51,0.08)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Chip
              label={`Q${idx + 1}`}
              size="small"
              sx={{ bgcolor: "#0B2B33", color: "#fff", fontWeight: 700 }}
            />
            <Button
              type="button"
              size="small"
              onClick={() => removeFaq(idx)}
              startIcon={<X size={14} />}
              sx={{ textTransform: "none", color: "#B23A3A", fontSize: "0.8rem" }}
            >
              Remove
            </Button>
          </Box>

          <FieldLabel>Question</FieldLabel>
          <TextField
            size="small"
            fullWidth
            value={faq.question}
            onChange={(e) => update(idx, "question", e.target.value)}
            placeholder="Enter question…"
            sx={{ ...fieldSx, mb: 2 }}
          />

          <FieldLabel>Answer</FieldLabel>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={faq.answer}
            onChange={(e) => update(idx, "answer", e.target.value)}
            placeholder="Enter answer…"
            sx={fieldSx}
          />
        </Box>
      ))}

      <Button
        type="button"
        onClick={addFaq}
        fullWidth
        startIcon={<Plus size={16} />}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          color: "#0B2B33",
          py: 1.4,
          borderRadius: 2.5,
          border: "1px dashed rgba(11,43,51,0.25)",
          "&:hover": { bgcolor: "rgba(242,166,90,0.08)", borderColor: "#F2A65A" },
        }}
      >
        Add FAQ
      </Button>
    </Box>
  );
}

/* ── Step bar ── */
function StepBar({ current }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 4, overflowX: "auto" }}>
      {STEPS.map((label, i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "0 0 auto" }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.75, minWidth: 72 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.85rem",
                transition: "background-color 0.3s ease, color 0.3s ease, transform 0.3s ease",
                bgcolor: i < current ? "#F2A65A" : i === current ? "#0B2B33" : "rgba(11,43,51,0.08)",
                color: i <= current ? (i < current ? "#0B2B33" : "#fff") : "rgba(11,43,51,0.4)",
                transform: i === current ? "scale(1.1)" : "scale(1)",
              }}
            >
              {i < current ? "✓" : i + 1}
            </Box>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: i === current ? 700 : 500,
                color: i === current ? "#0B2B33" : "rgba(11,43,51,0.5)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </Typography>
          </Box>
          {i < STEPS.length - 1 && (
            <Box
              sx={{
                flex: 1,
                height: 2,
                mx: 1,
                mt: -2.5,
                bgcolor: i < current ? "#F2A65A" : "rgba(11,43,51,0.1)",
                transition: "background-color 0.3s ease",
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
}

function SummaryRow({ done, label, optional }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.6 }}>
      {done ? <CheckCircle2 size={16} color="#2E9E5B" /> : <Circle size={16} color={optional ? "rgba(11,43,51,0.25)" : "#D08A3E"} />}
      <Typography sx={{ fontSize: "0.88rem", color: '#ffffff' }}>
        {label}
      </Typography>
    </Box>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function CreateService() {
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const setTop = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const setDetail = (field, value) => {
    setForm((f) => ({ ...f, moredetails: { ...f.moredetails, [field]: value } }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleReset = () => {
    if (window.confirm("Clear all fields and start over?")) {
      setForm(EMPTY_FORM);
      setErrors({});
      setStep(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setTimeout(() => navigate("/services"), 1500);
    } catch (err) {
      console.error("Create service error:", err);
      showToast(err?.response?.data?.message ?? "Failed to create service. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCardFocus = (stepIdx) => setStep(stepIdx);

  const primaryBtnSx = {
    px: 3,
    py: 1.3,
    borderRadius: 2.5,
    fontWeight: 700,
    fontSize: "0.88rem",
    textTransform: "none",
    color: "#0B2B33",
    backgroundImage:
      "linear-gradient(120deg, #F2A65A 0%, #FFCB8E 25%, #F2A65A 50%, #FFCB8E 75%, #F2A65A 100%)",
    backgroundSize: "200% 100%",
    animation: `${shimmer} 5s ease infinite`,
    boxShadow: "0 6px 18px rgba(242,166,90,0.35)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 10px 22px rgba(242,166,90,0.45)" },
    "&.Mui-disabled": { backgroundImage: "none", bgcolor: "rgba(11,43,51,0.15)", animation: "none" },
  };

  const ghostBtnSx = {
    px: 2.5,
    py: 1.3,
    borderRadius: 2.5,
    fontWeight: 600,
    fontSize: "0.88rem",
    textTransform: "none",
    color: "#0B2B33",
    "&:hover": { bgcolor: "rgba(11,43,51,0.06)" },
  };

  return (
    <Box sx={{ bgcolor: "#F7FAFA", minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={(props) => <Slide {...props} direction="left" />}
      >
        <Alert
          severity={toast?.type === "error" ? "error" : "success"}
          onClose={() => setToast(null)}
          variant="filled"
          sx={{ borderRadius: 2.5 }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 } }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 4,
            opacity: 0,
            animation: `${fadeUp} 0.5s ease forwards`,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", color: "#F2A65A", mb: 0.5 }}>
              SERVICE MANAGER
            </Typography>
            <Typography sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, fontWeight: 700, color: "#0B2B33" }}>
              Add New Service
            </Typography>
            <Typography sx={{ fontSize: "0.92rem", color: "rgba(11,43,51,0.55)", mt: 0.5 }}>
              Fill in the details below to publish a new service offering.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button type="button" onClick={handleReset} sx={ghostBtnSx}>
              Clear All
            </Button>
            <Button type="submit" disabled={saving} sx={primaryBtnSx} endIcon={!saving && <ArrowRight size={16} />}>
              {saving ? <CircularProgress size={18} sx={{ color: "#0B2B33" }} /> : "Create Service"}
            </Button>
          </Box>
        </Box>

        <StepBar current={step} />

        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
          {/* LEFT COLUMN */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CardShell
              icon={<Sparkles size={18} />}
              title="Basic Information"
              subtitle="Name and short description"
              onFocus={() => handleCardFocus(0)}
            >
              <Box sx={{ mb: 2.5 }}>
                <FieldLabel required>Service Name</FieldLabel>
                <TextField
                  fullWidth
                  value={form.name}
                  onChange={(e) => setTop("name", e.target.value)}
                  placeholder="e.g. Tenant Verification"
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={fieldSx}
                />
              </Box>

              <Box>
                <FieldLabel required>Short Description</FieldLabel>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={form.description}
                  onChange={(e) => setTop("description", e.target.value)}
                  placeholder="Brief public-facing description shown on the services listing page…"
                  error={!!errors.description}
                  helperText={errors.description}
                  sx={fieldSx}
                />
                <Typography sx={{ textAlign: "right", fontSize: "0.75rem", color: "rgba(11,43,51,0.4)", mt: 0.5 }}>
                  {form.description.length} chars
                </Typography>
              </Box>
            </CardShell>

            <CardShell
              icon={<AlignLeft size={18} />}
              title="Detail Description"
              subtitle="Extended content shown on the service page"
              onFocus={() => handleCardFocus(1)}
            >
              <FieldLabel required>Full Description</FieldLabel>
              <TextField
                fullWidth
                multiline
                rows={7}
                value={form.moredetails.detaildescription}
                onChange={(e) => setDetail("detaildescription", e.target.value)}
                placeholder="Comprehensive description with full context about what this service offers…"
                error={!!errors.detaildescription}
                helperText={errors.detaildescription}
                sx={fieldSx}
              />
            </CardShell>

            <CardShell
              icon={<Gem size={18} />}
              title="Key Benefits"
              subtitle="Highlight what sets this service apart"
              onFocus={() => handleCardFocus(2)}
            >
              <Typography sx={{ fontSize: "0.82rem", color: "rgba(11,43,51,0.5)", mb: 1.5 }}>
                Format each item as <Box component="code" sx={{ bgcolor: "rgba(11,43,51,0.06)", px: 0.75, py: 0.25, borderRadius: 1 }}>Title:Description</Box>
              </Typography>
              <TagList items={form.moredetails.keybenifits} onChange={(val) => setDetail("keybenifits", val)} />
            </CardShell>
          </Box>

          {/* RIGHT COLUMN */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CardShell
              icon={<LayoutList size={18} />}
              title="Extra Detail Section"
              subtitle="Additional bullet-point content block"
              onFocus={() => handleCardFocus(2)}
            >
              <Box sx={{ mb: 2.5 }}>
                <FieldLabel required>Section Title</FieldLabel>
                <TextField
                  fullWidth
                  value={form.moredetails.extradetailTitle}
                  onChange={(e) => setDetail("extradetailTitle", e.target.value)}
                  placeholder="e.g. Tenant Screening Solutions"
                  error={!!errors.extradetailTitle}
                  helperText={errors.extradetailTitle}
                  sx={fieldSx}
                />
              </Box>

              <Box>
                <FieldLabel>Detail List Items</FieldLabel>
                <Typography sx={{ fontSize: "0.8rem", color: "rgba(11,43,51,0.5)", mb: 1 }}>
                  First item is treated as the intro paragraph
                </Typography>
                <TagList items={form.moredetails.extradetailList} onChange={(val) => setDetail("extradetailList", val)} />
              </Box>
            </CardShell>

            <CardShell
              icon={<HelpCircle size={18} />}
              title="Frequently Asked Questions"
              subtitle="Common questions about this service"
              onFocus={() => handleCardFocus(3)}
            >
              <FaqEditor
                faqs={form.moredetails.frequentlyaskedquestions}
                onChange={(val) => setDetail("frequentlyaskedquestions", val)}
              />
            </CardShell>


          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 4 }}>
          <Button type="button" onClick={() => navigate("/services")} sx={ghostBtnSx}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} sx={primaryBtnSx}>
            {saving ? <CircularProgress size={18} sx={{ color: "#0B2B33" }} /> : "Create Service →"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}