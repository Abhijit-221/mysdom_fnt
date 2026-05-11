import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PRODUCT_DISPLAY_ORDER = [
  "id verification",
  "criminal check",
  "address verification",
  "education check",
  "employment check",
  "credit check",
  "social media check",
];

const normalizeProductTitle = (title = "") =>
  String(title)
    .toLowerCase()
    .replace(/checks/g, "check")
    .replace(/\s+/g, " ")
    .trim();

const getRequestProducts = (data = {}) => {
  const rawProducts = data.BGVRequestProducts || data.bgvReqestService || [];
  return rawProducts
    .map((item) => ({
      ...item,
      productTitle: item.Product?.title || item.services?.name || "—",
    }))
    .sort((a, b) => {
      const aTitle = normalizeProductTitle(a.productTitle);
      const bTitle = normalizeProductTitle(b.productTitle);
      const aIndex = PRODUCT_DISPLAY_ORDER.indexOf(aTitle);
      const bIndex = PRODUCT_DISPLAY_ORDER.indexOf(bTitle);
      const safeAIndex = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
      const safeBIndex = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

      if (safeAIndex !== safeBIndex) {
        return safeAIndex - safeBIndex;
      }

      return aTitle.localeCompare(bTitle);
    });
};

const SINGLE_VALUE_LABELS = new Set([
  "Mode of Response",
  "Mode of Verification",
  "Verifier's Comments",
  "Final Disposition",
  "Remark",
  "Check Status",
]);

const markSingleValueRows = (rows = []) =>
  rows.map((row) => ({
    ...row,
    singleValue: SINGLE_VALUE_LABELS.has(row.label),
  }));

const getProductTableRows = (product, data = {}) => {
  const title = (product?.productTitle || "").toLowerCase();
  console.log("Generating table rows for product:", title);
  const firstEmployment = data.employments?.[0] || {};

  if (title.includes("employment")) {
    console.log("First employment record:", firstEmployment);
    return markSingleValueRows([
      { label: "Employer", stated: firstEmployment.company_name || "—", verified: firstEmployment.verify_company_name || "—" },
      { label: "Employee Code", stated: firstEmployment.employee_id || "—", verified: firstEmployment.verify_employee_id || "—" },
      { label: "Start Date", stated: firstEmployment.employment_start || "—", verified: firstEmployment.verify_employment_start || "—" },
      { label: "Recent Employment", stated: (firstEmployment.isCurrent ? "Yes" : "No") || "—", verified: ((firstEmployment.verify_isCurrent===false||firstEmployment.verify_isCurrent==="false")? "No" : "_") || "—" },
      { label: "End Date", stated: firstEmployment.employment_end || "—", verified: firstEmployment.verify_employment_end || "—" },
      { label: "Designation", stated: firstEmployment.job_title || "—", verified: firstEmployment.verify_job_title || "—" },
      { label: "Employment Category", stated: firstEmployment.employment_category || "—", verified: firstEmployment.verify_employment_category || "—" },
      { label: "Employment Type", stated: firstEmployment.employment_type || "—", verified: firstEmployment.verify_employment_type || "—" },
      { label: "Leaving Reason", stated: firstEmployment.leaving_reason || "—", verified: firstEmployment.verify_leaving_reason || "—" },

      { label: "Mode of Response", stated: product.mode_of_verification || "—", verified: product.mode_of_verification || "—" },
      { label: "Verifier's Comments", stated: product.verifier_comment || "—", verified: product.verifier_comment || "—" },
      { label: "Final Disposition", stated: product.final_desc || "—", verified: product.final_desc || "—" },
      { label: "Remark", stated: product.remark || "—", verified: product.remark || "—" },
      { label: "Check Status", stated: product.status || "—", verified: product.status || "—" },
    ]);
  }

  if (title.includes("education")) {
    return markSingleValueRows([
      { label: "Institute", stated: data.institute_name || "—", verified: data.verify_institute_name || "—" },
      { label: "University", stated: data.university || "—", verified: data.verify_university || "—" },
      { label: "Qualification", stated: data.qualification || "—", verified: data.verify_qualification || "—" },
      { label: "Specialization", stated: data.specialization || "—", verified: data.verify_specialization || "—" },
      { label: "Roll Number", stated: data.roll_number || "—", verified: data.verify_roll_number || "—" },
      { label: "Education Start", stated: data.education_start || "—", verified: data.verify_education_start || "—" },
      { label: "Education End", stated: data.education_end || "—", verified: data.verify_education_end || "—" },
      { label: "Passing Year", stated: data.passing_year || "—", verified: data.verify_passing_year || "—" },
      { label: "Degree Completion", stated: (data.degree_status==="yes" ? "Yes" : "No") || "—", verified: (data.verify_degree_status==="yes"? "Yes" : "No") || "—" },

      { label: "Mode of Verification", stated: product.mode_of_verification || "—", verified: product.mode_of_verification || "—" },
      { label: "Verifier's Comments", stated: product.verifier_comment || "—", verified: product.verifier_comment || "—" },
      { label: "Final Disposition", stated: product.final_desc || "—", verified: product.final_desc || "—" },
      { label: "Remark", stated: product.remark || "—", verified: product.remark || "—" },
      { label: "Check Status", stated: product.status || "—", verified: product.status || "—" },
    ]);
  }

  if (title.includes("address")) {
    return markSingleValueRows([
      { label: "Current Address", stated: data.current_address || "—", verified: data.verify_current_address || "—" },
      { label: "Current Landmark", stated: data.current_landmark || "—", verified: data.verify_current_landmark || "—" },
      { label: "Current Residency", stated: data.current_residency || "—", verified: data.verify_current_residency || "—" },
      { label: "Current Duration", stated: data.current_duration || "—", verified: data.verify_current_duration || "—" },

      { label: "Permanent Address", stated: data.permanent_address || "—", verified: data.verify_permanent_address || "—" },
      { label: "Permanent Landmark", stated: data.permanent_landmark || "—", verified: data.verify_permanent_landmark || "—" },
      { label: "Permanent Residency", stated: data.permanent_residency || "—", verified: data.verify_permanent_residency || "—" },
      { label: "Permanent Duration", stated: data.permanent_duration || "—", verified: data.verify_permanent_duration || "—" },

      { label: "Mode of Verification", stated: product.mode_of_verification || "—", verified: product.mode_of_verification || "—" },
      { label: "Verifier's Comments", stated: product.verifier_comment || "—", verified: product.verifier_comment || "—" },
      { label: "Final Disposition", stated: product.final_desc || "—", verified: product.final_desc || "—" },
      { label: "Remark", stated: product.remark || "—", verified: product.remark || "—" },
      { label: "Check Status", stated: product.status || "—", verified: product.status || "—" },
    ]);
  }

  if (title.includes("id")) {
    return markSingleValueRows([
      { label: "ID Type", stated: data.id_type || "—", verified: data.verify_id_type || "—" },
      { label: "ID Number", stated: data.id_number || "—", verified: data.verify_id_number || "—" },
      { label: "PAN", stated: data.pan_card || "—", verified: data.verify_pan_card || "—" },
      { label: "Mode of Verification", stated: product.mode_of_verification || "—", verified: product.mode_of_verification || "—" },
      { label: "Verifier's Comments", stated: product.verifier_comment || "—", verified: product.verifier_comment || "—" },
      { label: "Final Disposition", stated: product.final_desc || "—", verified: product.final_desc || "—" },
      { label: "Remark", stated: product.remark || "—", verified: product.remark || "—" },
      { label: "Check Status", stated: product.status || "—", verified: product.status || "—" },
    ]);
  }

  if (title.includes("criminal")) {
    return markSingleValueRows([
      { label: "Father's Name", stated: data.father_name || "—", verified: data.verify_father_name || "—" },
      { label: "Mother's Name", stated: data.mother_name || "—", verified: data.verify_mother_name || "—" },
      { label: "Address", stated: data.address_detail || "—", verified: data.verify_address_detail || "—" },
      { label: "City", stated: data.city || "—", verified: data.verify_city || "—" },
      { label: "Mode of Verification", stated: product.mode_of_verification || "—", verified: product.mode_of_verification || "—" },
      { label: "Verifier's Comments", stated: product.verifier_comment || "—", verified: product.verifier_comment || "—" },
      { label: "Final Disposition", stated: product.final_desc || "—", verified: product.final_desc || "—" },
      { label: "Remark", stated: product.remark || "—", verified: product.remark || "—" },
      { label: "Check Status", stated: product.status || "—", verified: product.status || "—" },
    ]);
  }
  
  if (title.includes("credit")) {
    return markSingleValueRows([
      // { label: "Name", stated: data.candidate_name || "—", verified: data.candidate_name || "—" },
      { label: "PAN Card", stated: data.pan_card || "—", verified: data.verify_pan_card || "—" },
      { label: "Mode of Verification", stated: product.mode_of_verification || "—", verified: product.mode_of_verification || "—" },
      { label: "Verifier's Comments", stated: product.verifier_comment || "—", verified: product.verifier_comment || "—" },
      { label: "Final Disposition", stated: product.final_desc || "—", verified: product.final_desc || "—" },
      { label: "Remark", stated: product.remark || "—", verified: product.remark || "—" },
      { label: "Check Status", stated: product.status || "—", verified: product.status || "—" },
    ]);
  }

  if (title.includes("social")) {
    return markSingleValueRows([
      { label: "Social Media Type", stated: data.social_media_type || "—", verified: data.verify_social_media_type || "—" },
      { label: "Social Media ID", stated: data.social_media_id || "—", verified: data.verify_social_media_id || "—" },
      { label: "Mode of Verification", stated: product.mode_of_verification || "—", verified: product.mode_of_verification || "—" },
      { label: "Verifier's Comments", stated: product.verifier_comment || "—", verified: product.verifier_comment || "—" },
      { label: "Final Disposition", stated: product.final_desc || "—", verified: product.final_desc || "—" },
      { label: "Remark", stated: product.remark || "—", verified: product.remark || "—" },
      { label: "Check Status", stated: product.status || "—", verified: product.status || "—" },
    ]);
  }

  return markSingleValueRows([
    { label: "Product", stated: product.productTitle || "—", verified: product.productTitle || "—" },
    { label: "Mode of Verification", stated: product.mode_of_verification || "—", verified: product.mode_of_verification || "—" },
    { label: "Verifier's Comments", stated: product.verifier_comment || "—", verified: product.verifier_comment || "—" },
    { label: "Final Disposition", stated: product.final_desc || "—", verified: product.final_desc || "—" },
    { label: "Remark", stated: product.remark || "—", verified: product.remark || "—" },
    { label: "Check Status", stated: product.status || "—", verified: product.status || "—" },
  ]);
};

/* ─────────────────────────────────────────────
   COLORS  (RGB tuples for jsPDF)
───────────────────────────────────────────── */
const formatEmploymentBoolean = (value) => {
  if (value === true || value === "true" || value === "Yes" || value === "yes") return "Yes";
  if (value === false || value === "false" || value === "No" || value === "no") return "No";
  return "_";
};

const getEmploymentTableRows = (employment = {}) =>
  markSingleValueRows([
    { label: "Employer", stated: employment.company_name || "_", verified: employment.verify_company_name || "_" },
    { label: "Employee Code", stated: employment.employee_id || "_", verified: employment.verify_employee_id || "_" },
    { label: "Start Date", stated: employment.employment_start || "_", verified: employment.verify_employment_start || "_" },
    { label: "Recent Employment", stated: formatEmploymentBoolean(employment.isCurrent), verified: formatEmploymentBoolean(employment.verify_isCurrent) },
    { label: "End Date", stated: employment.employment_end || "_", verified: employment.verify_employment_end || "_" },
    { label: "Designation", stated: employment.job_title || "_", verified: employment.verify_job_title || "_" },
    { label: "Employment Category", stated: employment.employment_category || "_", verified: employment.verify_employment_category || "_" },
    { label: "Employment Type", stated: employment.employment_type || "_", verified: employment.verify_employment_type || "_" },
    { label: "Leaving Reason", stated: employment.leaving_reason || "_", verified: employment.verify_leaving_reason || "_" },
  ]);

const getProductTableSections = (product, data = {}) => {
  const title = (product?.productTitle || "").toLowerCase();

  if (!title.includes("employment")) {
    return [{ title: null, rows: getProductTableRows(product, data) }];
  }

  const employments = Array.isArray(data.employments) ? data.employments : [];
  const detailSections = employments.length
    ? employments.map((employment, index) => ({
        title: `Employment ${index + 1}`,
        rows: getEmploymentTableRows(employment),
      }))
    : [{ title: "Employment", rows: getEmploymentTableRows() }];

  const summaryRows = markSingleValueRows([
    { label: "Mode of Response", stated: product.mode_of_verification || "_", verified: product.mode_of_verification || "_" },
    { label: "Verifier's Comments", stated: product.verifier_comment || "_", verified: product.verifier_comment || "_" },
    { label: "Final Disposition", stated: product.final_desc || "_", verified: product.final_desc || "_" },
    { label: "Remark", stated: product.remark || "_", verified: product.remark || "_" },
    { label: "Check Status", stated: product.status || "_", verified: product.status || "_" },
  ]);

  return [...detailSections, { title: "Verification Summary", rows: summaryRows }];
};

const isEmploymentVerificationSummarySection = (section) =>
  section?.title === "Verification Summary";

const DISCREPANCY_LEGEND = [
  { label: "CLEAR", ui: { dot: "#22c55e", bg: "#dcfce7", text: "#166534" }, pdf: { dot: [34, 197, 94], bg: [220, 252, 231], text: [22, 101, 52] } },
  { label: "MINOR", ui: { dot: "#f59e0b", bg: "#fef3c7", text: "#92400e" }, pdf: { dot: [245, 158, 11], bg: [254, 243, 199], text: [146, 64, 14] } },
  { label: "DISCREPANCY", ui: { dot: "#ef4444", bg: "#fee2e2", text: "#991b1b" }, pdf: { dot: [239, 68, 68], bg: [254, 226, 226], text: [153, 27, 27] } },
];

const normalizeFinalDiscrepancy = (value = "") => {
  const normalized = String(value || "")
    .toUpperCase()
    .replace(/[_\s]+/g, " ")
    .trim();

  if (["CLEAR", "CLEARED"].includes(normalized)) return "CLEAR";
  if (normalized === "MINOR") return "MINOR";
  if (normalized === "DISCREPANCY") return "DISCREPANCY";
  return "";
};

const getDiscrepancyMeta = (value = "") =>
  DISCREPANCY_LEGEND.find((item) => item.label === normalizeFinalDiscrepancy(value)) ||
  { label: "—", ui: { dot: "#cbd5e1", bg: "#f8fafc", text: "#475569" }, pdf: { dot: [203, 213, 225], bg: [248, 250, 252], text: [71, 85, 105] } };

const C = {
  navy: [131, 24, 67],
  green: [253, 242, 248],//[255, 47, 143],
  orange: [255, 47, 143],
  cleared: [39, 174, 96],
  tableHead: [248, 164, 204],
  rowAlt: [253, 242, 248],
  white: [255, 255, 255],
  gray: [113, 63, 97],
  lightGray: [244, 209, 228],
  bodyText: [31, 41, 55],
  labelText: [131, 24, 67],
  successBg: [253, 242, 248],//[252, 231, 243],
  successBorder: [244, 114, 182],
  successText: [157, 23, 77],
};

/* ─────────────────────────────────────────────
   IMAGE PRE-FETCHER
   Fetches all service document images to base64
   BEFORE PDF generation. jsPDF cannot fetch URLs
   at draw-time; supplying pre-loaded base64 data
   ensures every image renders reliably.
───────────────────────────────────────────── */
async function fetchImageAsBase64(url) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // "data:image/...;base64,..."
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function preloadImages(services, base_url) {
  if (!base_url) return {};
  const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp"];
  const map = {};
  const jobs = [];

  services.forEach((sv) => {
    ["doc_1", "doc_2"].forEach((field) => {
      const path = sv[field];
      if (!path) return;
      const ext = path.split(".").pop().toLowerCase();
      if (!IMAGE_EXTS.includes(ext)) return;
      if (path in map) return; // already queued
      map[path] = null;        // placeholder
      const url = `${base_url}/${path.replace(/\\/g, "/")}`;
      jobs.push(
        fetchImageAsBase64(url).then((b64) => { map[path] = b64; })
      );
    });
  });

  await Promise.all(jobs);
  return map;
}

/* ─────────────────────────────────────────────
   PDF BUILDER — mirrors the UI view exactly
───────────────────────────────────────────── */
function buildPDF(jsPDF, data, base_url, imageCache = {}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const PW = 210;
  const ML = 20;
  const MR = 20;
  const CW = PW - ML - MR;
  let y = 0;

  const products = getRequestProducts(data);
  const reqDate = data.createdAt ? data.createdAt.slice(0, 10) : "N/A";
  const updateDate = data.updatedAt ? data.updatedAt.slice(0, 10) : "N/A";
  const isCompleted = ["COMPLETED", "REJECTED", "CLOSED"].includes(data.status);

  /* ── helpers ── */
  const fill = (rgb) => doc.setFillColor(...rgb);
  const stroke = (rgb) => doc.setDrawColor(...rgb);

  /**
   * txt() — safe text renderer, strips any non-latin characters (emoji etc.)
   * that jsPDF's built-in helvetica cannot encode, preventing garbage glyphs.
   */
  const sanitize = (str) =>
    String(str ?? "—").replace(/[^\x00-\xFF]/g, "").trim() || "—";

  const txt = (str, x, yy, { size = 9, bold = false, color = C.bodyText, align = "left", maxWidth } = {}) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    const safeText = Array.isArray(str)
      ? str.map((line) => sanitize(line))
      : sanitize(str);
    doc.text(safeText, x, yy, { align, ...(maxWidth ? { maxWidth } : {}) });
  };

  /**
   * measuredWidth() — returns the actual mm width of a string at the
   * CURRENT font size / style.  Must be called AFTER setFontSize + setFont.
   */
  const measuredWidth = (str) => {
    const dim = doc.getTextDimensions(sanitize(str));
    return dim.w; // already in mm for "mm" unit docs
  };

  const checkPage = (needed = 20) => {
    if (y + needed > 282) { doc.addPage(); y = 0; drawHeader(); y += 6; }
  };

  /* PDF top bar pink accent — matches UI brand (#ff2f8f / C.orange) */
  const drawHeader = () => {
    fill(C.orange); doc.rect(0, 0, 4, 20, "F");
    fill([248, 249, 252]); doc.rect(4, 0, PW - 4, 20, "F");
    const logoB64 = imageCache.__brandLogo;
    if (logoB64) {
      try {
        const logoProps = doc.getImageProperties(logoB64);
        const maxW = 44;
        const maxH = 11;
        const ratio = Math.min(maxW / logoProps.width, maxH / logoProps.height);
        const drawW = logoProps.width * ratio;
        const drawH = logoProps.height * ratio;
        doc.addImage(logoB64, 10, 5, drawW, drawH);
      } catch {
        txt("MYSDOM", 10, 13, { bold: true, size: 16, color: C.navy });
      }
    } else {
      txt("MYSDOM", 10, 13, { bold: true, size: 16, color: C.navy });
    }
    const bars = [[0, 5], [3, 9], [6, 7], [9, 12], [12, 8]];
    fill(C.orange);
    bars.forEach(([bx, bh]) => doc.rect(88 + bx, 13 - bh, 2.2, bh, "F"));
    txt("BGV Report", PW - MR - 32, 8, { size: 7, color: C.gray, align: "right" });
    txt(`#-${data.req_code || "N/A"}`, PW - MR - 32, 13, { size: 8, bold: true, color: C.navy, align: "right" });
    txt("Date", PW - MR, 8, { size: 7, color: C.gray, align: "right" });
    txt(reqDate, PW - MR, 13, { size: 8, bold: true, color: C.orange, align: "right" });
    stroke(C.lightGray); doc.setLineWidth(0.3);
    stroke(C.orange); doc.setLineWidth(1.2);
    doc.line(0, 20, PW, 20);
    y = 26;
  };

  const sectionTitle = (title) => {
    checkPage(16);
    const cx = PW / 2;
    doc.setLineWidth(0.6); stroke(C.lightGray);
    doc.line(ML, y + 4, cx - 28, y + 4);
    doc.line(cx + 28, y + 4, ML + CW, y + 4);
    txt(title.toUpperCase(), cx, y + 7, { bold: true, size: 10, color: C.navy, align: "center" });
    y += 14;
  };

  /* Card header bar — NO emoji, plain text only */
  const cardHeader = (title) => {
    checkPage(12);
    fill(C.navy); doc.rect(ML, y, CW, 10, "F");
    txt(title, ML + 5, y + 6.5, { bold: true, size: 9, color: C.white });
    y += 10;
  };

  /**
   * statusBadge() — draws a rounded pill badge.
   * Correctly measures text width using getTextDimensions() before drawing.
   */
  const statusBadge = (label, x, yy) => {
    const safeLabel = sanitize(label);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    const tw = measuredWidth(safeLabel);
    const padH = 3;
    const padV = 2;
    const bw = tw + padH * 2;
    const bh = 5.5;

    // pick colour by status
    const up = safeLabel.toUpperCase();
    let bg = C.successBg, border = C.successBorder, textColor = C.cleared;
    if (["IN PROGRESS", "SUBMITTED"].includes(up)) {
      bg = [254, 249, 195]; border = [253, 224, 71]; textColor = [133, 77, 14];
    } else if (["FAILED", "DISCREPANCY", "REJECTED"].includes(up)) {
      bg = [254, 226, 226]; border = [252, 165, 165]; textColor = [153, 27, 27];
    }

    fill(bg); stroke(border); doc.setLineWidth(0.25);
    doc.roundedRect(x, yy - bh + padV, bw, bh, 1, 1, "FD");
    doc.setTextColor(...textColor);
    doc.text(safeLabel, x + padH, yy - 0.5);
    return bw;
  };

  /* Product overview card (grid) */
  const serviceStatusCard = (sv, x, cardY, cardW) => {
    const statusLabel = (sv.status || "N/A").replace(/_/g, " ");
    fill(C.rowAlt); stroke(C.lightGray);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, cardY, cardW, 22, 2, 2, "FD");
    // left accent bar
    fill(C.green); doc.rect(x, cardY, 3, 22, "F");
    txt(sv.productTitle || "—", x + 7, cardY + 8, { bold: true, size: 9, color: C.navy, maxWidth: cardW - 14 });
    statusBadge(statusLabel, x + 7, cardY + 17);
  };

  /* Try embed image — uses pre-fetched base64 from imageCache */
  const tryEmbedImage = (path, xPos, yPos, w, h) => {
    if (!path) return false;
    const b64 = imageCache[path];
    if (!b64) return false;
    try {
      // Keep original orientation and center-fit image within the document box.
      const props = doc.getImageProperties(b64);
      const scale = Math.min(w / props.width, h / props.height);
      const drawW = props.width * scale;
      const drawH = props.height * scale;
      const drawX = xPos + (w - drawW) / 2;
      const drawY = yPos + (h - drawH) / 2;
      doc.addImage(b64, drawX, drawY, drawW, drawH);
      return { drawX, drawY, drawW, drawH };
    } catch (e) {
      console.warn("addImage failed for", path, e);
      return false;
    }
  };

  /* File fallback pill (no emoji) */
  const filePill = (path, labelText) => {
    checkPage(14);
    txt(labelText + ":", PW / 2, y + 5, { bold: true, size: 8, color: C.labelText, align: "center" });
    y += 9;
    const filename = path.split(/[\\/]/).pop();
    const display = "[Attachment] " + filename;
    doc.setFontSize(8); doc.setFont("helvetica", "normal");
    const tw = measuredWidth(display);
    const pillW = Math.min(tw + 8, CW);
    const pillX = ML + (CW - pillW) / 2;
    fill(C.successBg); stroke(C.successBorder); doc.setLineWidth(0.25);
    doc.roundedRect(pillX, y, pillW, 7, 1.5, 1.5, "FD");
    txt(display, pillX + pillW / 2, y + 5, { size: 8, color: C.cleared, align: "center", maxWidth: pillW - 6 });
    y += 11;
  };

  const drawProductDetailTable = (product) => {
    const rows = getProductTableRows(product, data);
    const headerH = 9;
    const detailW = 38;
    const valueW = (CW - detailW) / 2;
    const cols = [
      { key: "label", title: "Details", width: detailW },
      { key: "stated", title: "Stated", width: valueW },
      { key: "verified", title: "Verified", width: valueW },
    ];

    const drawHeaderRow = (section) => {
      checkPage(headerH + 4);
      let x = ML;
      cols.forEach((col) => {
        fill(C.tableHead);
        stroke([31, 41, 55]);
        doc.setLineWidth(0.25);
        doc.rect(x, y, col.width, headerH, "FD");
        const headerTitle =
          isEmploymentVerificationSummarySection(section) && col.key === "stated"
            ? ""
            : col.title;
        txt(headerTitle, x + 2, y + 6, {
          bold: true,
          size: col.key === "stated" || col.key === "verified" ? 9 : 8,
          color: C.white,
        });
        x += col.width;
      });
      y += headerH;
    };

    const employmentSections = getProductTableSections(product, data);
    if (employmentSections.length > 1) {
      employmentSections.forEach((section, sectionIndex) => {
        if (section.title) {
          checkPage(12);
          txt(section.title, ML, y + 5, { bold: true, size: 8.5, color: C.navy });
          y += 8;
        }

        drawHeaderRow(section);
        section.rows.forEach((row) => {
          const labelLines = doc.splitTextToSize(sanitize(row.label || "_"), detailW - 4);
          const statedLines = doc.splitTextToSize(sanitize(row.stated || "_"), valueW - 4);
          const verifiedLines = row.singleValue
            ? []
            : doc.splitTextToSize(sanitize(row.verified || "_"), valueW - 4);
          const singleValueLines = row.singleValue
            ? doc.splitTextToSize(sanitize(row.stated || row.verified || "_"), valueW * 2 - 4)
            : [];
          const maxLines = Math.max(labelLines.length, statedLines.length, verifiedLines.length);
          const mergedMaxLines = row.singleValue
            ? Math.max(labelLines.length, singleValueLines.length)
            : maxLines;
          const rowH = Math.max(9, mergedMaxLines * 4.2 + 3);

          if (y + rowH > 282) {
            doc.addPage();
            y = 0;
            drawHeader();
            y += 6;
            if (section.title) {
              txt(section.title, ML, y + 5, { bold: true, size: 8.5, color: C.navy });
              y += 8;
            }
            drawHeaderRow(section);
          }

          let x = ML;
          fill(C.tableHead);
          stroke([31, 41, 55]);
          doc.setLineWidth(0.25);
          doc.rect(x, y, detailW, rowH, "FD");
          txt(labelLines, x + 2, y + 5.5, {
            bold: true,
            size: 7.5,
            color: C.white,
          });
          x += detailW;

          if (row.singleValue) {
            fill(C.white);
            stroke([31, 41, 55]);
            doc.setLineWidth(0.25);
            doc.rect(x, y, valueW * 2, rowH, "FD");
            txt(singleValueLines, x + 2, y + 5.5, {
              size: 8.2,
              color: C.bodyText,
            });
          } else {
            const values = [statedLines, verifiedLines];
            [valueW, valueW].forEach((width, idx) => {
              fill(C.white);
              stroke([31, 41, 55]);
              doc.setLineWidth(0.25);
              doc.rect(x, y, width, rowH, "FD");
              txt(values[idx], x + 2, y + 5.5, {
                size: 8.2,
                color: C.bodyText,
              });
              x += width;
            });
          }
          y += rowH;
        });

        if (sectionIndex < employmentSections.length - 1) {
          y += 6;
        }
      });
      y += 6;
      return;
    }

    drawHeaderRow();
    rows.forEach((row) => {
      const labelLines = doc.splitTextToSize(sanitize(row.label || "—"), detailW - 4);
      const statedLines = doc.splitTextToSize(sanitize(row.stated || "—"), valueW - 4);
      const verifiedLines = row.singleValue
        ? []
        : doc.splitTextToSize(sanitize(row.verified || "—"), valueW - 4);
      const singleValueLines = row.singleValue
        ? doc.splitTextToSize(sanitize(row.stated || row.verified || "—"), valueW * 2 - 4)
        : [];
      const maxLines = Math.max(labelLines.length, statedLines.length, verifiedLines.length);
      const mergedMaxLines = row.singleValue
        ? Math.max(labelLines.length, singleValueLines.length)
        : maxLines;
      const rowH = Math.max(9, mergedMaxLines * 4.2 + 3);

      if (y + rowH > 282) {
        doc.addPage();
        y = 0;
        drawHeader();
        y += 6;
        drawHeaderRow();
      }

      let x = ML;
      fill(C.tableHead);
      stroke([31, 41, 55]);
      doc.setLineWidth(0.25);
      doc.rect(x, y, detailW, rowH, "FD");
      txt(labelLines, x + 2, y + 5.5, {
        bold: true,
        size: 7.5,
        color: C.white,
      });
      x += detailW;

      if (row.singleValue) {
        fill(C.white);
        stroke([31, 41, 55]);
        doc.setLineWidth(0.25);
        doc.rect(x, y, valueW * 2, rowH, "FD");
        txt(singleValueLines, x + 2, y + 5.5, {
          size: 8.2,
          color: C.bodyText,
        });
      } else {
        const values = [statedLines, verifiedLines];
        [valueW, valueW].forEach((width, idx) => {
          fill(C.white);
          stroke([31, 41, 55]);
          doc.setLineWidth(0.25);
          doc.rect(x, y, width, rowH, "FD");
          txt(values[idx], x + 2, y + 5.5, {
            size: 8.2,
            color: C.bodyText,
          });
          x += width;
        });
      }
      y += rowH;
    });
    y += 6;
  };

  /* ══════════════════════════════════════════
     PAGE 1 — Cover + Executive Summary
  ══════════════════════════════════════════ */
  drawHeader();

  /* ── Cover card ── */
  // Dynamic card height keeps all left-column content inside the card.
  const bh = Math.max(92, 74 + products.length * 6);
  fill(C.rowAlt); doc.roundedRect(ML, y, CW, bh, 3, 3, "F");
  stroke(C.lightGray); doc.setLineWidth(0.3);
  doc.roundedRect(ML, y, CW, bh, 3, 3, "S");

  const halfX = ML + CW * 0.52;

  /* Left column */
  let ly = y + 8;
  txt("FINAL REPORT", ML + 6, ly, { bold: true, size: 7, color: C.green }); ly += 6;
  txt(data.candidate_name || "—", ML + 6, ly, { bold: true, size: 11, color: C.navy }); ly += 7;
  txt(data.candidate_email || "—", ML + 6, ly, { bold: true, size: 11, color: C.navy }); ly += 7;
  txt(data.candidate_phone || "—", ML + 6, ly, { bold: true, size: 11, color: C.navy }); ly += 7;
  txt(data.gender || "—", ML + 6, ly, { bold: true, size: 11, color: C.navy }); ly += 7;
  txt(data.dob || "—", ML + 6, ly, { bold: true, size: 11, color: C.navy }); ly += 7;
  txt(data.designation || "", ML + 6, ly, { bold: true, size: 11, color: C.navy }); ly += 7;
  txt(data.department || "", ML + 6, ly, { bold: true, size: 11, color: C.navy }); ly += 7;

  // txt(data.req_code ? `Requested #${data.req_code}` : "", ML + 6, ly, { size: 8, color: C.labelText }); ly += 9;
  txt("PACKAGE OPTED", ML + 6, ly, { bold: true, size: 7, color: C.navy }); ly += 5;
  products.forEach((p) => {
    txt(`- ${p.productTitle || "—"}`, ML + 8, ly, { size: 8, color: C.bodyText, maxWidth: halfX - ML - 10 });
    ly += 5;
  });
  ly += 3;
  txt("DATE OF REQUEST", ML + 6, ly, { bold: true, size: 7, color: C.navy }); ly += 5;
  txt(reqDate, ML + 6, ly, { size: 8, color: C.bodyText }); ly += 5;
  if (data.client?.companyName) {
    txt(data.client.companyName, ML + 6, ly, { size: 8, color: C.labelText, maxWidth: halfX - ML - 10 });
  }

  /* Vertical divider */
  stroke(C.lightGray); doc.setLineWidth(0.3);
  doc.line(halfX, y + 6, halfX, y + bh - 6);

  /* Right column */
  const rx = ML + CW - 6;
  let ry = y + 8;
  txt("PREPARED BY", rx, ry, { bold: true, size: 7, color: C.navy, align: "right" }); ry += 6;
  ["Mysdom", "Bhubaneswar", "www.mysdom.com", "contactus@mysdom.com"].forEach(v => {
    txt(v, rx, ry, { size: 8, color: C.labelText, align: "right" }); ry += 5;
  });
  ry += 8;

  // Report No label + value (left of two-col footer)
  const midRx = halfX + (rx - halfX) / 2 - 4;
  // txt("Report No", midRx, ry, { size: 7, color: C.gray, align: "right" });
  txt("Completion Date", rx, ry, { size: 7, color: C.gray, align: "right" }); ry += 5;
  // txt(data.req_code ? `#${data.req_code}` : "—", midRx, ry, { bold: true, size: 8, color: C.green, align: "right", maxWidth: midRx - halfX - 4 });
  txt(isCompleted ? updateDate : "_ _ _", rx, ry, { bold: true, size: 9, color: C.orange, align: "right" });

  y += bh + 10;

  /* ── Executive Summary ── */
  sectionTitle("Executive Summary");
  cardHeader("EXECUTIVE SUMMARY");

  const drawDiscrepancyLegend = () => {
    checkPage(20);
    txt("Final Discrepancy", ML, y + 5, { size: 8, bold: true, color: C.navy });

    let legendX = ML;
    const legendY = y + 11;

    DISCREPANCY_LEGEND.forEach((item, index) => {
      if (index > 0) legendX += 42;
      fill(item.pdf.dot);
      doc.circle(legendX + 2, legendY, 2, "F");
      txt(item.label, legendX + 7, legendY + 1, { size: 8, bold: true, color: item.pdf.text });
    });

    y += 18;
  };

  const drawSummaryTable = ({ headers, rows, colWidths }) => {
    const headH = 9;
    checkPage(26);
    let x = ML;
    headers.forEach((h, idx) => {
      fill(C.tableHead);
      stroke(C.lightGray);
      doc.setLineWidth(0.2);
      doc.rect(x, y, colWidths[idx], headH, "FD");
      txt(h, x + 2, y + 6, { size: 7.5, bold: true, color: C.white });
      x += colWidths[idx];
    });
    y += headH;

    rows.forEach((row) => {
      const rowDiscrepancy = row.finalDiscrepancy;
      const rowMeta = getDiscrepancyMeta(rowDiscrepancy);
      const lines = row.map((v, idx) => doc.splitTextToSize(sanitize(v), colWidths[idx] - 4));
      const maxLines = Math.max(...lines.map((l) => l.length), 1);
      const bodyH = Math.max(12, maxLines * 4 + 3);
      checkPage(bodyH + 4);
      x = ML;
      row.forEach((_, idx) => {
        fill(rowDiscrepancy ? rowMeta.pdf.bg : C.rowAlt);
        stroke(C.lightGray);
        doc.setLineWidth(0.2);
        doc.rect(x, y, colWidths[idx], bodyH, "FD");
        txt(lines[idx], x + 2, y + 5, { size: 7.2, color: rowDiscrepancy ? rowMeta.pdf.text : C.bodyText });
        x += colWidths[idx];
      });
      y += bodyH;
    });
    y += 6;
  };

  const getSummaryTableHeight = ({ rows, colWidths }) => {
    const headH = 9;
    const rowsHeight = rows.reduce((total, row) => {
      const lines = row.map((v, idx) => doc.splitTextToSize(sanitize(v), colWidths[idx] - 4));
      const maxLines = Math.max(...lines.map((l) => l.length), 1);
      const bodyH = Math.max(12, maxLines * 4 + 3);
      return total + bodyH;
    }, 0);

    return headH + rowsHeight + 6;
  };

  const overviewHeaders = ["MYS#", "Applicant", "Organisation", "Package"];
  const overviewColW = [CW * 0.18, CW * 0.20, CW * 0.22, CW * 0.40];
  const pkgText = products.map((p) => p.productTitle).join(", ") || "—";
  drawSummaryTable({
    headers: overviewHeaders,
    rows: [[data.req_code || "—", data.candidate_name || "—", data.client?.companyName || "—", pkgText]],
    colWidths: overviewColW,
  });

  drawDiscrepancyLegend();

  const statusHeaders = ["Product", "Status"];
  const statusColW = [CW * 0.72, CW * 0.28];
  const statusRows = products.map((sv) => {
    const discrepancy = normalizeFinalDiscrepancy(sv.final_discrepancy);
    const row = [sv.productTitle || "—", discrepancy || "—"];
    row.finalDiscrepancy = discrepancy;
    return row;
  });
  const executiveStatusRows = products.map((sv) => {
    const discrepancy = normalizeFinalDiscrepancy(sv.final_discrepancy);
    const row = [sv.productTitle || "â€”", (sv.status || "N/A").replace(/_/g, " ")];
    row.finalDiscrepancy = discrepancy;
    return row;
  });

  const executiveSummaryStatusRows = products.map((sv) => {
    const discrepancy = normalizeFinalDiscrepancy(sv.final_discrepancy);
    const row = [sv.productTitle || "N/A", (sv.status || "N/A").replace(/_/g, " ")];
    row.finalDiscrepancy = discrepancy;
    return row;
  });

  const statusTableHeight = getSummaryTableHeight({
    rows: executiveSummaryStatusRows,
    colWidths: statusColW,
  });

  if (y + statusTableHeight > 282) {
    doc.addPage();
    y = 0;
    drawHeader();
    sectionTitle("Executive Summary");
    cardHeader("EXECUTIVE SUMMARY");
    drawDiscrepancyLegend();
  }

  drawSummaryTable({
    headers: statusHeaders,
    rows: executiveSummaryStatusRows,
    colWidths: statusColW,
  });

  /* ══════════════════════════════════════════
     SERVICE PAGES — one per service
  ══════════════════════════════════════════ */
  products.forEach((sv) => {
    doc.addPage();
    y = 0; drawHeader();

    const svcName = sv.productTitle || "Product";
    const svcStatus = (sv.status || "N/A").replace(/_/g, " ");
    const isSvcCompleted = ["COMPLETED", "REJECTED", "CLOSED"].includes(sv.status);
    const svcCompletionDate = isSvcCompleted
      ? (sv.updatedAt ? sv.updatedAt.slice(0, 10) : (data.updatedAt ? data.updatedAt.slice(0, 10) : "—"))
      : "_ _ _";

    sectionTitle(svcName);

    /* Card header — no emoji, plain text */
    checkPage(12);
    fill(C.navy); doc.rect(ML, y, CW, 10, "F");
    txt(svcName.toUpperCase(), ML + 5, y + 6.5, { bold: true, size: 9, color: C.white });
    // Badge on the right side of the header bar
    const badgeX = ML + CW - 42;
    statusBadge(svcStatus, badgeX, y + 7);
    y += 10;

    /* Status + completion date sub-row */
    checkPage(16);
    fill([249, 250, 251]); doc.rect(ML, y, CW, 13, "F");
    stroke(C.lightGray); doc.setLineWidth(0.2); doc.rect(ML, y, CW, 13, "S");

    // Left: "SERVICE NAME - STATUS" — each part on its own x position
    // txt(svcName.toUpperCase() + "  -", ML + 5, y + 8, { bold: true, size: 8, color: C.labelText });
    // doc.setFontSize(8); doc.setFont("helvetica", "bold");
    // const labelPartW = measuredWidth(svcName.toUpperCase() + "  -");
    // txt(svcStatus, ML + 5 + labelPartW + 2, y + 8, { bold: true, size: 8, color: C.cleared });

    // Right: "Completion Date" label on top, value below — two separate lines
    const compLabelX = ML + 5 * 0.62;
    txt("Completion Date:", compLabelX, y + 8, { size: 7, color: C.gray });
    txt(svcCompletionDate, compLabelX, y + 10.2, { bold: true, size: 8, color: C.orange });
    y += 17;

    /* Product details table */
    drawProductDetailTable(sv);

    /* Documents — dedicated PDF page(s), large embed with aspect-preserving fit */
    const hasDocs = sv.doc_1 || sv.doc_2;
    if (hasDocs) {
      const docPairs = [["doc_1", "Document 1"], ["doc_2", "Document 2"]].filter(([field]) => sv[field]);
      let docSectionStarted = false;

      const ensureDocumentsCoverPage = () => {
        if (docSectionStarted) return;
        doc.addPage();
        y = 0;
        drawHeader();
        cardHeader("DOCUMENTS");
        txt(sanitize(svcName), PW / 2, y + 5, {
          bold: true,
          size: 10,
          color: C.navy,
          align: "center",
        });
        y += 13;
        docSectionStarted = true;
      };

      docPairs.forEach(([field, label], idx) => {
        const path = sv[field];
        const ext = path.split(".").pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);

        if (isImage) {
          if (idx === 0) {
            ensureDocumentsCoverPage();
            txt(label, PW / 2, y + 6, {
              bold: true,
              size: 11,
              color: C.navy,
              align: "center",
            });
            const imgTop = y + 12;
            const imgMaxW = CW;
            const imgMaxH = Math.max(40, 275 - imgTop - 10);
            const embeddedBox = tryEmbedImage(path, ML, imgTop, imgMaxW, imgMaxH);
            if (!embeddedBox) {
              y = imgTop + 4;
              filePill(path, label);
            } else {
              stroke(C.lightGray);
              doc.setLineWidth(0.3);
              doc.rect(ML, imgTop, imgMaxW, imgMaxH, "S");
              y = imgTop + imgMaxH + 8;
            }
          } else {
            doc.addPage();
            y = 0;
            drawHeader();
            txt(label, PW / 2, y + 7, {
              bold: true,
              size: 11,
              color: C.navy,
              align: "center",
            });
            const imgTop = y + 13;
            const imgMaxW = CW;
            const imgMaxH = Math.max(40, 275 - imgTop - 10);
            const embeddedBox = tryEmbedImage(path, ML, imgTop, imgMaxW, imgMaxH);
            if (!embeddedBox) {
              y = imgTop + 4;
              filePill(path, label);
            } else {
              stroke(C.lightGray);
              doc.setLineWidth(0.3);
              doc.rect(ML, imgTop, imgMaxW, imgMaxH, "S");
              y = imgTop + imgMaxH + 8;
            }
          }
        } else {
          if (idx === 0) ensureDocumentsCoverPage();
          else {
            doc.addPage();
            y = 0;
            drawHeader();
          }
          filePill(path, label);
        }
      });
    } else {
      checkPage(12);
      txt("No documents attached for this product.", ML, y + 6, { size: 8, color: C.labelText });
      y += 12;
    }
  });

  /* ══════════════════════════════════════════
    PRODUCTS OVERVIEW PAGE
  ══════════════════════════════════════════ */
  // doc.addPage();
  // y = 0; drawHeader();

  // sectionTitle("Products Overview");
  // cardHeader("PRODUCTS STATUS");
  // y += 6;

  // if (products.length > 0) {
  //   const cols = 2;
  //   const gap = 8;
  //   const cardW = (CW - gap * (cols - 1)) / cols;
  //   const cardH = 24;

  //   products.forEach((sv, i) => {
  //     const col = i % cols;
  //     const row = Math.floor(i / cols);
  //     if (col === 0) checkPage(cardH + 4);
  //     const xPos = ML + col * (cardW + gap);
  //     const yPos = y + row * (cardH + 4);
  //     serviceStatusCard(sv, xPos, yPos, cardW);
  //   });

  //   const rows = Math.ceil(products.length / cols);
  //   y += rows * (cardH + 4) + 4;
  // } else {
  //   txt("No products found.", ML, y + 6, { size: 9, color: C.labelText });
  //   y += 14;
  // }

  /* ── Footer — same page as last content (no extra blank page from checkPage) ── */
  const pageH = doc.internal.pageSize.getHeight() || 297;
  const footerMinY = Math.min(275, pageH - 22);
  const lineY = Math.min(Math.max(y + 6, footerMinY), pageH - 18);
  stroke(C.orange); doc.setLineWidth(0.8);
  doc.line(ML, lineY, ML + CW, lineY);
  txt("MYSDOM Background Verification", PW / 2, lineY + 7, { bold: true, size: 8, color: C.navy, align: "center" });
  txt("www.mysdom.com  |  contactus@mysdom.com  |  Bhubaneswar", PW / 2, lineY + 12, { size: 7, color: C.labelText, align: "center" });

  return doc;
}

/* ─────────────────────────────────────────────
   Load jsPDF from CDN
───────────────────────────────────────────── */
function loadJsPDF() {
  return new Promise((resolve, reject) => {
    if (window.jspdf?.jsPDF) { resolve(window.jspdf.jsPDF); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = () => resolve(window.jspdf.jsPDF);
    s.onerror = () => reject(new Error("Failed to load jsPDF"));
    document.head.appendChild(s);
  });
}

/* ─────────────────────────────────────────────
   UI ATOMS
───────────────────────────────────────────── */
const statusColor = (st = "") => {
  const s = st.toUpperCase();
  if (["CLEARED", "COMPLETED", "CLEAR"].includes(s)) return { bg: "#ffe4f1", txt: "#a10f5f" };
  if (["IN_PROGRESS", "SUBMITTED"].includes(s)) return { bg: "#ffe9f5", txt: "#a10f5f" };
  if (["FAILED", "DISCREPANCY", "REJECTED"].includes(s)) return { bg: "#fee2e2", txt: "#991b1b" };
  return { bg: "#ffeaf6", txt: "#a10f5f" };
};

const Badge = ({ label, color }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 700, background: color.bg, color: color.txt,
    letterSpacing: "0.03em"
  }}>{label || "—"}</span>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,.06)", marginBottom: 20,
    overflow: "hidden", ...style
  }}>{children}</div>
);

const CardHeader = ({ icon, title, right }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 20px",
    background: "linear-gradient(90deg,#ff2f8f 0%,#cf1a70 100%)", color: "#fff"
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.04em" }}>{title}</span>
    </div>
    {right}
  </div>
);

const SectionDivider = ({ title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0 16px" }}>
    <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
    <span style={{
      fontWeight: 800, fontSize: 12, letterSpacing: "0.12em",
      color: "#a10f5f", textTransform: "uppercase"
    }}>{title}</span>
    <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
  </div>
);

const FilePill = ({ path, base_url, label }) => {
  if (!path) return <em style={{ fontSize: 12, color: "#aaa" }}>No file</em>;
  const cleanPath = path.replace(/\\/g, "/");
  const url = base_url ? `${base_url}/${cleanPath}` : "#";
  const ext = cleanPath.split('.').pop().toLowerCase();
  const name = cleanPath.split('/').pop();

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        <img src={url} alt={label} style={{ width: 500, height: 500, borderRadius: 8, border: "1px solid #ddd", objectFit: "contain" }} />
      </div>
    );
  }
  if (ext === "pdf") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        <iframe src={url} title={label} style={{ width: 500, height: 500, border: "1px solid #ddd", borderRadius: 6 }} />
      </div>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12,
      color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0",
      borderRadius: 20, padding: "3px 12px", textDecoration: "none", fontWeight: 500
    }}>📎 {label || name}</a>
  );
};

const DownloadButton = ({ onClick, loading, size = "md" }) => (
  <button onClick={onClick} disabled={loading} style={{
    display: "flex", alignItems: "center", gap: 8,
    padding: size === "lg" ? "12px 28px" : "9px 20px",
    borderRadius: 8, border: "none",
    background: loading ? "#9ca3af" : "linear-gradient(135deg,#ff2f8f 0%,#cf1a70 100%)",
    color: "#fff", fontSize: size === "lg" ? 14 : 12,
    fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
    boxShadow: loading ? "none" : "0 4px 14px rgba(255,47,143,.35)",
    transition: "all .2s", letterSpacing: "0.02em",
  }}>
    {loading
      ? <><span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span> Generating…</>
      : <><span>⬇</span> Download PDF Report</>}
  </button>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const BGVReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data || {};
  const base_url = import.meta.env.VITE_BASE_URL;
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const jsPDF = await loadJsPDF();
      // Pre-fetch all product document images to base64 before building PDF
      const products = getRequestProducts(data);
      const imageCache = await preloadImages(products, base_url);
      const logoUrl = `${window.location.origin}/logo.png`;
      imageCache.__brandLogo = await fetchImageAsBase64(logoUrl);
      const doc = buildPDF(jsPDF, data, base_url, imageCache);
      doc.save(`BGV-Report-${data.req_code || "report"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const products = getRequestProducts(data);
  const reqDate = data.createdAt ? new Date(data.createdAt).toLocaleDateString("en-IN") : "—";
  const updateDate = data.updatedAt ? new Date(data.updatedAt).toLocaleDateString("en-IN") : "—";
  const isCompleted = ["COMPLETED", "REJECTED", "CLOSED"].includes(data.status);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .rs              { animation: fadeUp .35s ease both; }
        .rs:nth-child(2) { animation-delay: .07s; }
        .rs:nth-child(3) { animation-delay: .13s; }
        .rs:nth-child(4) { animation-delay: .19s; }
        .rs:nth-child(5) { animation-delay: .25s; }
        .rs:nth-child(6) { animation-delay: .31s; }
        .rs:nth-child(7) { animation-delay: .37s; }
        @media print { .no-print { display: none !important; } }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#fff0f8 0%,#fff6fb 60%,#ffeef7 100%)",
        padding: "32px 24px 60px",
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Back button */}
          <div style={{ paddingBottom: "10px" }}>
            <button
              style={{
                display: "flex", flexDirection: "row", alignItems: "center", gap: "2px",
                textAlign: "center", padding: "6px", background: "#3D6CA9",
                color: "white", borderRadius: "5px", border: "none", cursor: "pointer"
              }}
              onClick={() => navigate('/bgv/list')}
            >
              <ArrowLeft size={18} />Back
            </button>
          </div>

          {/* ── Top Bar ── */}
          <div className="no-print" style={{
            display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{
                  background: "linear-gradient(135deg,#ff2f8f,#cf1a70)",
                  color: "#fff", fontWeight: 800, fontSize: 18,
                  padding: "6px 14px", borderRadius: 8, letterSpacing: "0.06em"
                }}>MYSDOM</div>
                <div style={{ width: 3, height: 28, background: "#ff2f8f", borderRadius: 2 }} />
                <span style={{ fontWeight: 700, fontSize: 13, color: "#6b7280" }}>BGV Report</span>
              </div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#a10f5f" }}>
                Background Verification Report
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
                  {data.req_code ? `#${data.req_code}` : ""}
                </span>
                {data.req_code && <span style={{ color: "#d1d5db" }}>·</span>}
                <span style={{ fontSize: 12, color: "#6b7280" }}>{reqDate}</span>
                {data.status && <Badge label={data.status.replace(/_/g, " ")} color={statusColor(data.status)} />}
              </div>
            </div>
            <DownloadButton onClick={handleDownload} loading={loading} />
          </div>

          {/* ── Cover ── */}
          <div className="rs">
            <Card>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "stretch" }}>
                <div style={{ padding: 20, borderRight: "1px solid #f3f4f6" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#ff2f8f", textTransform: "uppercase", letterSpacing: "0.08em" }}>Final Report</p>
                  <p style={{ margin: "0 0 2px", fontSize: 13, color: "#1f2937", fontWeight: 600 }}>{data.candidate_name || "—"}</p>
                  <p style={{ margin: "0 0 2px", fontSize: 13, color: "#1f2937", fontWeight: 600 }}>{data.candidate_email || "—"}</p>
                  <p style={{ margin: "0 0 2px", fontSize: 13, color: "#1f2937", fontWeight: 600 }}>{data.candidate_phone || "—"}</p>
                  <p style={{ margin: "0 0 2px", fontSize: 13, color: "#1f2937", fontWeight: 600 }}>{data.gender || "—"}</p>
                  <p style={{ margin: "0 0 2px", fontSize: 13, color: "#1f2937", fontWeight: 600 }}>{data.dob || "—"}</p>
                  {data?.designation && <p style={{ margin: "0 0 2px", fontSize: 13, color: "#1f2937", fontWeight: 600 }}>{data.designation || "—"}</p>}
                  {data?.department && <p style={{ margin: "0 0 2px", fontSize: 13, color: "#1f2937", fontWeight: 600 }}>{data.department || "—"}</p>}

                  {/* <p style={{ margin: "0 0 14px", fontSize: 12, color: "#6b7280" }}>{data.req_code ? `Requested #${data.req_code}` : ""}</p> */}
                  <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#a10f5f", textTransform: "uppercase", letterSpacing: "0.06em" }}>Package Opted</p>
                  {products.length > 0
                    ? products.map((p) => <p key={p.id} style={{ margin: "0 0 2px", fontSize: 12, color: "#374151" }}>• {p.productTitle}</p>)
                    : <p style={{ fontSize: 12, color: "#aaa" }}>—</p>}
                  <p style={{ margin: "14px 0 4px", fontSize: 11, fontWeight: 700, color: "#a10f5f", textTransform: "uppercase", letterSpacing: "0.06em" }}>Date of Request</p>
                  <p style={{ margin: "0 0 2px", fontSize: 12, color: "#374151" }}>{reqDate}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#374151" }}>{data.client?.companyName || ""}</p>
                </div>
                <div style={{ padding: 20, background: "#f9fafb" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#a10f5f", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "right" }}>Prepared By</p>
                  {["Mysdom", "Bhubaneswar", "www.mysdom.com", "contactus@mysdom.com"].map(v => (
                    <p key={v} style={{ margin: "0 0 2px", fontSize: 12, color: "#374151", textAlign: "right" }}>{v}</p>
                  ))}
                  <div style={{ marginTop: 20, borderTop: "1px solid #e5e7eb", paddingTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 20 }}>
                      {/* <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: 10, color: "#9ca3af" }}>Report No</p>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#ff2f8f" }}>{data.req_code ? `#${data.req_code}` : "—"}</p>
                      </div> */}
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: 10, color: "#9ca3af" }}>Completion Date</p>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f5a623" }}>{isCompleted ? updateDate : "_ _ _"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Executive Summary ── */}
          <div className="rs">
            <SectionDivider title="Executive Summary" />
            <Card>
              <CardHeader icon="📊" title="EXECUTIVE SUMMARY" />
              <div style={{ padding: "12px 16px 16px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 14, tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: "18%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "22%" }} />
                    <col style={{ width: "40%" }} />
                  </colgroup>
                  <thead>
                    <tr>{["MYS#", "Applicant", "Organisation", "Package"].map(h => (
                      <th key={h} style={{ background: "#ff2f8f", color: "#fff", padding: "9px 10px", textAlign: "left", fontWeight: 700, fontSize: 11, border: "1px solid #f7b5d7" }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: "#f9fafb" }}>
                      {[data.req_code, data.candidate_name, data.client?.companyName, products.map((p) => p.productTitle).join(", ") || "—"].map((v, i) => (
                        <td
                          key={i}
                          style={{
                            padding: "9px 10px",
                            textAlign: "left",
                            fontSize: 12,
                            color: "#1f2937",
                            border: "1px solid #f1c6dd",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            verticalAlign: "top",
                          }}
                        >
                          {v || "—"}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>

                <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#a10f5f" }}>Final Discrepancy</span>
                  {DISCREPANCY_LEGEND.map((item) => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: item.ui.dot,
                          display: "inline-block",
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 700, color: item.ui.text }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th style={{ background: "#ff2f8f", color: "#fff", padding: "9px 10px", textAlign: "left", fontWeight: 700, fontSize: 11, border: "1px solid #f7b5d7" }}>Product</th>
                      <th style={{ background: "#ff2f8f", color: "#fff", padding: "9px 10px", textAlign: "left", fontWeight: 700, fontSize: 11, border: "1px solid #f7b5d7" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((sv) => {
                      const discrepancyLabel = normalizeFinalDiscrepancy(sv.final_discrepancy) || "—";
                      const discrepancyMeta = getDiscrepancyMeta(sv.final_discrepancy);
                      const statusLabel = sv.status?.replace(/_/g, " ") || "—";

                      return (
                        <tr key={sv.id} style={{ background: discrepancyLabel !== "—" ? discrepancyMeta.ui.bg : "#f9fafb" }}>
                          <td style={{ padding: "9px 10px", border: "1px solid #f1c6dd", color: discrepancyLabel !== "—" ? discrepancyMeta.ui.text : "#1f2937" }}>{sv.productTitle || "—"}</td>
                          <td style={{ padding: "9px 10px", border: "1px solid #f1c6dd", color: discrepancyLabel !== "—" ? discrepancyMeta.ui.text : "#1f2937", fontWeight: 700 }}>
                            <Badge label={statusLabel} color={statusColor(sv.status)} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ── Product Sections — one card per product, matching PDF layout ── */}
          {products.map((sv) => {
            const svcName = sv.productTitle || "Product";
            const svcStatus = sv.status || "—";
            const isSvcCompleted = ["COMPLETED", "REJECTED", "CLOSED"].includes(sv.status);
            const svcDate = isSvcCompleted
              ? (sv.updatedAt ? new Date(sv.updatedAt).toLocaleDateString("en-IN") : updateDate)
              : "_ _ _";
            const productSections = getProductTableSections(sv, data);

            return (
              <div className="rs" key={sv.id}>
                <SectionDivider title={svcName} />
                <Card>
                  <CardHeader
                    icon="🎓"
                    title={svcName.toUpperCase()}
                    right={<Badge label={svcStatus.replace(/_/g, " ")} color={{ bg: "#d1fae5", txt: "#065f46" }} />}
                  />
                  <div style={{ padding: "4px", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    {/* <div style={{ padding: "12px 20px 4px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>
                        {svcName} — <span style={{ color: "#27ae60" }}>{svcStatus.replace(/_/g, " ")}</span>
                      </span>
                    </div> */}
                    <div style={{ padding: "12px 20px 4px" }}>
                      <p style={{ margin: 0, fontSize: 10, color: "#757677" }}>Completion Date</p>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f5a623" }}>{svcDate}</p>
                    </div>
                  </div>
                  <div style={{ padding: "0 20px 16px" }}>
                    {productSections.map((section, sectionIndex) => (
                      <div key={`${svcName}-${section.title || "default"}-${sectionIndex}`} style={{ marginBottom: sectionIndex < productSections.length - 1 ? 18 : 0 }}>
                        {section.title && (
                          <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#a10f5f" }}>
                            {section.title}
                          </p>
                        )}
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, border: "1px solid #ff2f8f" }}>
                          <thead>
                            <tr>
                              {["Details", "Stated", "Verified"].map((head) => (
                                <th
                                  key={head}
                                  style={{
                                    background: "#ff2f8f",
                                    color: "#fff",
                                    border: "1px solid #1f2937",
                                    textAlign: "left",
                                    padding: "8px",
                                    fontWeight: 700,
                                  }}
                                >
                                  {isEmploymentVerificationSummarySection(section) && head === "Stated" ? "" : head}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.rows.map((row) => (
                              <tr key={`${section.title || "row"}-${row.label}`}>
                                <td style={{ background: "#ff2f8f", color: "#fff", border: "1px solid #1f2937", padding: "8px", fontWeight: 600 }}>{row.label}</td>
                                <td
                                  colSpan={row.singleValue ? 2 : 1}
                                  style={{ border: "1px solid #1f2937", padding: "8px", color: "#1f2937" }}
                                >
                                  {row.stated}
                                </td>
                                {!row.singleValue && (
                                  <td style={{ border: "1px solid #1f2937", padding: "8px", color: "#1f2937" }}>{row.verified}</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                  {(sv.doc_1 || sv.doc_2) && (
                    <div style={{ padding: "0 20px 16px" }}>
                      <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Documents
                      </p>
                      <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 600, color: "#a10f5f" }}>{svcName}</p>
                      {sv.doc_1 && <FilePill path={sv.doc_1} base_url={base_url} label="Document 1" />}
                      {sv.doc_2 && <FilePill path={sv.doc_2} base_url={base_url} label="Document 2" />}
                    </div>
                  )}
                </Card>
              </div>
            );
          })}

          {/* ── Products Overview ── */}
          {/* <div className="rs">
            <SectionDivider title="Products Overview" />
            <Card>
              <CardHeader icon="⚙️" title="PRODUCTS STATUS" />
              {products.length > 0
                ? (
                  <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                    {products.map((sv) => {
                      const sc = statusColor(sv.status);
                      return (
                        <div key={sv.id} style={{ border: `1.5px solid ${sc.bg}`, borderRadius: 10, padding: "12px 14px", background: sc.bg + "55" }}>
                          <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13, color: "#a10f5f" }}>{sv.productTitle}</p>
                          <Badge label={sv.status?.replace(/_/g, " ") || "—"} color={sc} />
                        </div>
                      );
                    })}
                  </div>
                )
                : <div style={{ padding: 24, color: "#aaa", fontSize: 13 }}>No products found.</div>
              }
            </Card>
          </div> */}

          {/* ── Footer CTA ── */}
          <div className="no-print" style={{ display: "flex", justifyContent: "center", paddingTop: 24 }}>
            <div style={{
              background: "linear-gradient(135deg,#ff2f8f,#cf1a70)",
              borderRadius: 16, padding: "24px 40px", textAlign: "center", color: "#fff", maxWidth: 480
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#ffd3ea" }}>MYSDOM Background Verification</p>
              <p style={{ margin: "0 0 16px", fontSize: 12, color: "rgba(255,255,255,.7)" }}>
                Download the official PDF report
                {data.candidate_name && <> for <strong style={{ color: "#fff" }}>{data.candidate_name}</strong></>}
              </p>
              <DownloadButton onClick={handleDownload} loading={loading} size="lg" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default BGVReportPage;
