import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────
   COLORS  (RGB tuples for jsPDF)
───────────────────────────────────────────── */
const C = {
  navy: [30, 43, 74],
  green: [123, 193, 66],
  orange: [245, 166, 35],
  cleared: [39, 174, 96],
  tableHead: [30, 43, 74],
  rowAlt: [244, 246, 250],
  white: [255, 255, 255],
  gray: [136, 136, 136],
  lightGray: [229, 231, 235],
  bodyText: [31, 41, 55],
  labelText: [107, 114, 128],
  successBg: [240, 253, 244],
  successBorder: [187, 247, 208],
  successText: [22, 101, 52],
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

  const services = data.bgvReqestService || [];
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
    doc.text(sanitize(str), x, yy, { align, ...(maxWidth ? { maxWidth } : {}) });
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

  const drawHeader = () => {
    fill(C.green); doc.rect(0, 0, 4, 20, "F");
    fill([248, 249, 252]); doc.rect(4, 0, 152, 20, "F");
    txt("MYSDOM", 10, 13, { bold: true, size: 16, color: C.navy });
    const bars = [[0, 5], [3, 9], [6, 7], [9, 12], [12, 8]];
    fill(C.green);
    bars.forEach(([bx, bh]) => doc.rect(88 + bx, 13 - bh, 2.2, bh, "F"));
    txt("BGV Report", PW - MR - 32, 8, { size: 7, color: C.gray, align: "right" });
    txt(`#-${data.req_code || "N/A"}`, PW - MR - 32, 13, { size: 8, bold: true, color: C.green, align: "right" });
    txt("Date", PW - MR, 8, { size: 7, color: C.gray, align: "right" });
    txt(reqDate, PW - MR, 13, { size: 8, bold: true, color: C.orange, align: "right" });
    stroke(C.lightGray); doc.setLineWidth(0.3);
    doc.line(PW - MR - 34, 3, PW - MR - 34, 17);
    stroke(C.green); doc.setLineWidth(1.2);
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
    if (["IN PROGRESS", "NEW"].includes(up)) {
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

  /* Service overview card (grid) */
  const serviceStatusCard = (sv, x, cardY, cardW) => {
    const statusLabel = (sv.status || "N/A").replace(/_/g, " ");
    fill(C.rowAlt); stroke(C.lightGray);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, cardY, cardW, 22, 2, 2, "FD");
    // left accent bar
    fill(C.green); doc.rect(x, cardY, 3, 22, "F");
    txt(sv.services?.name || "—", x + 7, cardY + 8, { bold: true, size: 9, color: C.navy, maxWidth: cardW - 14 });
    statusBadge(statusLabel, x + 7, cardY + 17);
  };

  /* Try embed image — uses pre-fetched base64 from imageCache */
  const tryEmbedImage = (path, xPos, yPos, w, h) => {
    if (!path) return false;
    const b64 = imageCache[path];
    if (!b64) return false;
    try {
      // b64 is a data URL like "data:image/png;base64,..."
      doc.addImage(b64, xPos, yPos, w, h);
      return true;
    } catch (e) {
      console.warn("addImage failed for", path, e);
      return false;
    }
  };

  /* File fallback pill (no emoji) */
  const filePill = (path, labelText) => {
    checkPage(14);
    txt(labelText + ":", ML, y + 5, { bold: true, size: 8, color: C.labelText });
    y += 9;
    const filename = path.split(/[\\/]/).pop();
    const display = "[Attachment] " + filename;
    doc.setFontSize(8); doc.setFont("helvetica", "normal");
    const tw = measuredWidth(display);
    const pillW = Math.min(tw + 8, CW);
    fill(C.successBg); stroke(C.successBorder); doc.setLineWidth(0.25);
    doc.roundedRect(ML, y, pillW, 7, 1.5, 1.5, "FD");
    txt(display, ML + 4, y + 5, { size: 8, color: C.cleared, maxWidth: pillW - 6 });
    y += 11;
  };

  /* ══════════════════════════════════════════
     PAGE 1 — Cover + Executive Summary
  ══════════════════════════════════════════ */
  drawHeader();

  /* ── Cover card ── */
  // Calculate dynamic height based on number of services
  const bh = Math.max(66, 46 + services.length * 5);
  fill(C.rowAlt); doc.roundedRect(ML, y, CW, bh, 3, 3, "F");
  stroke(C.lightGray); doc.setLineWidth(0.3);
  doc.roundedRect(ML, y, CW, bh, 3, 3, "S");

  const halfX = ML + CW * 0.52;

  /* Left column */
  let ly = y + 8;
  txt("FINAL REPORT", ML + 6, ly, { bold: true, size: 7, color: C.green }); ly += 6;
  txt(data.candidate_name || "—", ML + 6, ly, { bold: true, size: 11, color: C.navy }); ly += 7;
  txt(data.req_code ? `Requested #${data.req_code}` : "", ML + 6, ly, { size: 8, color: C.labelText }); ly += 9;
  txt("PACKAGE OPTED", ML + 6, ly, { bold: true, size: 7, color: C.navy }); ly += 5;
  services.forEach(s => {
    txt(`- ${s.services?.name || "—"}`, ML + 8, ly, { size: 8, color: C.bodyText, maxWidth: halfX - ML - 10 });
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
  txt("Report No", midRx, ry, { size: 7, color: C.gray, align: "right" });
  txt("Completion Date", rx, ry, { size: 7, color: C.gray, align: "right" }); ry += 5;
  txt(data.req_code ? `#${data.req_code}` : "—", midRx, ry, { bold: true, size: 8, color: C.green, align: "right", maxWidth: midRx - halfX - 4 });
  txt(isCompleted ? updateDate : "_ _ _", rx, ry, { bold: true, size: 9, color: C.orange, align: "right" });

  y += bh + 10;

  /* ── Executive Summary ── */
  sectionTitle("Executive Summary");
  cardHeader("EXECUTIVE SUMMARY");

  /* Dynamic column widths: fixed cols + one per service */
  const serviceNames = services.map(s => s.services?.name || "—");
  const nSvc = serviceNames.length;
  // fixed cols: MYS# | Applicant | Organisation | Package
  const col0 = CW * 0.12;
  const col1 = CW * 0.17;
  const col2 = CW * 0.18;
  const col3 = CW * 0.20;
  const svcColW = nSvc > 0 ? (CW - col0 - col1 - col2 - col3) / nSvc : 0;
  const execColW = [col0, col1, col2, col3, ...serviceNames.map(() => svcColW)];
  const execCols = ["MYS#", "Applicant", "Organisation", "Package", ...serviceNames];

  // Header row
  checkPage(22);
  fill(C.tableHead); doc.rect(ML, y, CW, 9, "F");
  let cx = ML;
  execCols.forEach((h, i) => {
    txt(h, cx + execColW[i] / 2, y + 6, { bold: true, size: 7, color: C.white, align: "center", maxWidth: execColW[i] - 2 });
    cx += execColW[i];
  });
  y += 9;

  // Data row
  fill(C.rowAlt); doc.rect(ML, y, CW, 11, "F");
  stroke(C.lightGray); doc.setLineWidth(0.2); doc.rect(ML, y, CW, 11, "S");
  cx = ML;
  const pkgText = services.map(s => s.services?.name).join(", ") || "—";
  [data.req_code, data.candidate_name, data.client?.companyName, pkgText].forEach((v, i) => {
    txt(v ?? "—", cx + execColW[i] / 2, y + 7, { size: 7, color: C.bodyText, align: "center", maxWidth: execColW[i] - 2 });
    cx += execColW[i];
  });
  services.forEach((sv, i) => {
    const sl = (sv.status || "N/A").replace(/_/g, " ");
    txt(sl, cx + execColW[4 + i] / 2, y + 7, { size: 7, color: C.cleared, bold: true, align: "center", maxWidth: execColW[4 + i] - 2 });
    cx += execColW[4 + i];
  });
  y += 15;

  /* ══════════════════════════════════════════
     SERVICE PAGES — one per service
  ══════════════════════════════════════════ */
  services.forEach((sv) => {
    doc.addPage();
    y = 0; drawHeader();

    const svcName = sv.services?.name || "Service";
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
    txt(svcName.toUpperCase() + "  -", ML + 5, y + 8, { bold: true, size: 8, color: C.labelText });
    doc.setFontSize(8); doc.setFont("helvetica", "bold");
    const labelPartW = measuredWidth(svcName.toUpperCase() + "  -");
    txt(svcStatus, ML + 5 + labelPartW + 2, y + 8, { bold: true, size: 8, color: C.cleared });

    // Right: "Completion Date" label on top, value below — two separate lines
    const compLabelX = ML + CW * 0.62;
    txt("Completion Date:", compLabelX, y + 5, { size: 7, color: C.gray });
    txt(svcCompletionDate, compLabelX, y + 10.5, { bold: true, size: 8, color: C.orange });
    y += 17;

    /* Documents */
    const hasDocs = sv.doc_1 || sv.doc_2;
    if (hasDocs) {
      checkPage(14);
      txt(svcName + " Documents", ML, y + 5, { bold: true, size: 9, color: C.navy });
      y += 12;

      [["doc_1", "Document 1"], ["doc_2", "Document 2"]].forEach(([field, label]) => {
        if (!sv[field]) return;
        const path = sv[field];
        const ext = path.split(".").pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);

        if (isImage) {
          checkPage(80);
          txt(label + ":", ML, y + 5, { bold: true, size: 8, color: C.labelText });
          y += 9;
          const imgH = 65;
          const imgW = 100;
          const embedded = tryEmbedImage(path, ML, y, imgW, imgH);
          if (!embedded) {
            filePill(path, label);
          } else {
            // thin border around image
            stroke(C.lightGray); doc.setLineWidth(0.3);
            doc.rect(ML, y, imgW, imgH, "S");
            y += imgH + 5;
          }
        } else {
          filePill(path, label);
        }
      });
    } else {
      checkPage(12);
      txt("No documents attached for this service.", ML, y + 6, { size: 8, color: C.labelText });
      y += 12;
    }
  });

  /* ══════════════════════════════════════════
     SERVICES OVERVIEW PAGE
  ══════════════════════════════════════════ */
  doc.addPage();
  y = 0; drawHeader();

  sectionTitle("Services Overview");
  cardHeader("SERVICES STATUS");
  y += 6;

  if (services.length > 0) {
    const cols = 2;
    const gap = 8;
    const cardW = (CW - gap * (cols - 1)) / cols;
    const cardH = 24;

    services.forEach((sv, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      if (col === 0) checkPage(cardH + 4);
      const xPos = ML + col * (cardW + gap);
      const yPos = y + row * (cardH + 4);
      serviceStatusCard(sv, xPos, yPos, cardW);
    });

    const rows = Math.ceil(services.length / cols);
    y += rows * (cardH + 4) + 4;
  } else {
    txt("No services found.", ML, y + 6, { size: 9, color: C.labelText });
    y += 14;
  }

  /* ── Footer ── */
  checkPage(18);
  y += 8;
  stroke(C.green); doc.setLineWidth(0.8);
  doc.line(ML, y, ML + CW, y);
  y += 7;
  txt("MYSDOM Background Verification", PW / 2, y, { bold: true, size: 8, color: C.navy, align: "center" });
  y += 5;
  txt("www.mysdom.com  |  contactus@mysdom.com  |  Bhubaneswar", PW / 2, y, { size: 7, color: C.labelText, align: "center" });

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
  if (["CLEARED", "COMPLETED", "CLEAR"].includes(s)) return { bg: "#d1fae5", txt: "#065f46" };
  if (["IN_PROGRESS", "NEW"].includes(s)) return { bg: "#fef9c3", txt: "#854d0e" };
  if (["FAILED", "DISCREPANCY", "REJECTED"].includes(s)) return { bg: "#fee2e2", txt: "#991b1b" };
  return { bg: "#e0f2fe", txt: "#075985" };
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
    background: "linear-gradient(90deg,#1e2b4a 0%,#243459 100%)", color: "#fff"
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
      color: "#1e2b4a", textTransform: "uppercase"
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
    background: loading ? "#9ca3af" : "linear-gradient(135deg,#7bc142 0%,#5a9e2f 100%)",
    color: "#fff", fontSize: size === "lg" ? 14 : 12,
    fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
    boxShadow: loading ? "none" : "0 4px 14px rgba(123,193,66,.4)",
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
      // Pre-fetch all service document images to base64 before building PDF
      const services = data.bgvReqestService || [];
      const imageCache = await preloadImages(services, base_url);
      const doc = buildPDF(jsPDF, data, base_url, imageCache);
      doc.save(`BGV-Report-${data.req_code || "report"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const services = data.bgvReqestService || [];
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
        background: "linear-gradient(160deg,#f0f4ff 0%,#f8fafc 60%,#edf7e6 100%)",
        padding: "32px 24px 60px",
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Back button */}
          <div style={{ paddingBottom: "10px" }}>
            <button
              style={{
                display: "flex", flexDirection: "row", alignItems: "center", gap: "2px",
                textAlign: "center", padding: "6px", background: "#3d6ca9",
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
                  background: "linear-gradient(135deg,#1e2b4a,#2d4070)",
                  color: "#fff", fontWeight: 800, fontSize: 18,
                  padding: "6px 14px", borderRadius: 8, letterSpacing: "0.06em"
                }}>MYSDOM</div>
                <div style={{ width: 3, height: 28, background: "#7bc142", borderRadius: 2 }} />
                <span style={{ fontWeight: 700, fontSize: 13, color: "#6b7280" }}>BGV Report</span>
              </div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e2b4a" }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <div style={{ padding: 20, borderRight: "1px solid #f3f4f6" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#7bc142", textTransform: "uppercase", letterSpacing: "0.08em" }}>Final Report</p>
                  <p style={{ margin: "0 0 2px", fontSize: 13, color: "#1f2937", fontWeight: 600 }}>{data.candidate_name || "—"}</p>
                  <p style={{ margin: "0 0 14px", fontSize: 12, color: "#6b7280" }}>{data.req_code ? `Requested #${data.req_code}` : ""}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#1e2b4a", textTransform: "uppercase", letterSpacing: "0.06em" }}>Package Opted</p>
                  {services.length > 0
                    ? services.map(s => <p key={s.id} style={{ margin: "0 0 2px", fontSize: 12, color: "#374151" }}>• {s.services?.name}</p>)
                    : <p style={{ fontSize: 12, color: "#aaa" }}>—</p>}
                  <p style={{ margin: "14px 0 4px", fontSize: 11, fontWeight: 700, color: "#1e2b4a", textTransform: "uppercase", letterSpacing: "0.06em" }}>Date of Request</p>
                  <p style={{ margin: "0 0 2px", fontSize: 12, color: "#374151" }}>{reqDate}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#374151" }}>{data.client?.companyName || ""}</p>
                </div>
                <div style={{ padding: 20, background: "#f9fafb" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#1e2b4a", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "right" }}>Prepared By</p>
                  {["Mysdom", "Bhubaneswar", "www.mysdom.com", "contactus@mysdom.com"].map(v => (
                    <p key={v} style={{ margin: "0 0 2px", fontSize: 12, color: "#374151", textAlign: "right" }}>{v}</p>
                  ))}
                  <div style={{ marginTop: 20, borderTop: "1px solid #e5e7eb", paddingTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 20 }}>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: 10, color: "#9ca3af" }}>Report No</p>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#7bc142" }}>{data.req_code ? `#${data.req_code}` : "—"}</p>
                      </div>
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
              <div style={{ overflowX: "auto", paddingBottom: 4 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>{["MYS#", "Applicant", "Organisation", "Package", ...services.map(s => s.services?.name)].map(h => (
                      <th key={h} style={{ background: "#1e2b4a", color: "#fff", padding: "9px 10px", textAlign: "center", fontWeight: 700, fontSize: 11 }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: "#f9fafb" }}>
                      {[data.req_code, data.candidate_name, data.client?.companyName, services.map(s => s.services?.name).join(", ") || "—"].map((v, i) => (
                        <td key={i} style={{ padding: "9px 10px", textAlign: "center", fontSize: 12, color: "#1f2937", borderBottom: "1px solid #e5e7eb" }}>{v || "—"}</td>
                      ))}
                      {services.map((sv, i) => (
                        <td key={i} style={{ padding: "9px 10px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
                          <Badge label={sv.status?.replace(/_/g, " ")} color={{ bg: "#d1fae5", txt: "#065f46" }} />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ── Service Sections — one card per service, matching PDF layout ── */}
          {services.map(sv => {
            const svcName = sv.services?.name || "Service";
            const svcStatus = sv.status || "—";
            const isSvcCompleted = ["COMPLETED", "REJECTED", "CLOSED"].includes(sv.status);
            const svcDate = isSvcCompleted
              ? (sv.updatedAt ? new Date(sv.updatedAt).toLocaleDateString("en-IN") : updateDate)
              : "_ _ _";

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
                    <div style={{ padding: "12px 20px 4px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>
                        {svcName} — <span style={{ color: "#27ae60" }}>{svcStatus.replace(/_/g, " ")}</span>
                      </span>
                    </div>
                    <div style={{ padding: "12px 20px 4px" }}>
                      <p style={{ margin: 0, fontSize: 10, color: "#757677" }}>Completion Date</p>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f5a623" }}>{svcDate}</p>
                    </div>
                  </div>
                  {(sv.doc_1 || sv.doc_2) && (
                    <div style={{ padding: "0 20px 16px" }}>
                      <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {svcName} Documents
                      </p>
                      {sv.doc_1 && <FilePill path={sv.doc_1} base_url={base_url} label="Document 1" />}
                      {sv.doc_2 && <FilePill path={sv.doc_2} base_url={base_url} label="Document 2" />}
                    </div>
                  )}
                </Card>
              </div>
            );
          })}

          {/* ── Services Overview ── */}
          <div className="rs">
            <SectionDivider title="Services Overview" />
            <Card>
              <CardHeader icon="⚙️" title="SERVICES STATUS" />
              {services.length > 0
                ? (
                  <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                    {services.map(sv => {
                      const sc = statusColor(sv.status);
                      return (
                        <div key={sv.id} style={{ border: `1.5px solid ${sc.bg}`, borderRadius: 10, padding: "12px 14px", background: sc.bg + "55" }}>
                          <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13, color: "#1e2b4a" }}>{sv.services?.name}</p>
                          <Badge label={sv.status?.replace(/_/g, " ") || "—"} color={sc} />
                        </div>
                      );
                    })}
                  </div>
                )
                : <div style={{ padding: 24, color: "#aaa", fontSize: 13 }}>No services found.</div>
              }
            </Card>
          </div>

          {/* ── Footer CTA ── */}
          <div className="no-print" style={{ display: "flex", justifyContent: "center", paddingTop: 24 }}>
            <div style={{
              background: "linear-gradient(135deg,#1e2b4a,#2d4070)",
              borderRadius: 16, padding: "24px 40px", textAlign: "center", color: "#fff", maxWidth: 480
            }}>
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#7bc142" }}>MYSDOM Background Verification</p>
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