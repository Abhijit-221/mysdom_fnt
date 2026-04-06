import { ArrowBigLeft, ArrowLeft } from "lucide-react";
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
};

/* ─────────────────────────────────────────────
   PDF BUILDER
───────────────────────────────────────────── */
function buildPDF(jsPDF, data, base_url) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const PW = 210;
  const ML = 20;
  const MR = 20;
  const CW = PW - ML - MR;
  let y = 0;

  const reqDate = data.createdAt ? data.createdAt.slice(0, 10) : "N/A";
  const services = data.bgvReqestService || [];
  const emps = data.employments || [];

  console.log('services:', services)
  const fill = (rgb) => doc.setFillColor(...rgb);
  const stroke = (rgb) => doc.setDrawColor(...rgb);

  const txt = (str, x, yy, { size = 9, bold = false, color = C.bodyText, align = "left", maxWidth } = {}) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    doc.text(String(str ?? "—"), x, yy, { align, ...(maxWidth ? { maxWidth } : {}) });
  };

  const drawHeader = () => {
    fill(C.green); doc.rect(0, 0, 4, 20, "F");
    fill([248, 249, 252]); doc.rect(4, 0, 152, 20, "F");
    txt("MYSDOM", 10, 13, { bold: true, size: 16, color: C.navy });
    const bars = [[0, 5], [3, 9], [6, 7], [9, 12], [12, 8]];
    fill(C.green);
    bars.forEach(([bx, bh]) => doc.rect(88 + bx, 13 - bh, 2.2, bh, "F"));
    txt("Report No", PW - MR - 28, 8, { size: 7, color: C.gray, align: "right" });
    txt(`#-${data.req_code || "N/A"}`, PW - MR - 28, 13, { size: 8, bold: true, color: C.green, align: "right" });
    txt("Date", PW - MR, 8, { size: 7, color: C.gray, align: "right" });
    txt(reqDate, PW - MR, 13, { size: 8, bold: true, color: C.orange, align: "right" });
    stroke(C.lightGray); doc.setLineWidth(0.3);
    doc.line(PW - MR - 30, 3, PW - MR - 30, 17);
    stroke(C.green); doc.setLineWidth(1.2);
    doc.line(0, 20, PW, 20);
    y = 24;
  };

  const checkPage = (needed = 20) => {
    if (y + needed > 282) { doc.addPage(); y = 0; drawHeader(); y += 6; }
  };

  const sectionTitle = (title) => {
    checkPage(16);
    const cx = PW / 2;
    doc.setLineWidth(0.8); stroke(C.navy);
    doc.line(ML, y + 4, cx - 28, y + 4);
    doc.line(cx + 28, y + 4, ML + CW, y + 4);
    txt(title, cx, y + 7, { bold: true, size: 14, color: C.navy, align: "center" });
    y += 14;
  };

  const verifyTable = (rows) => {
    checkPage(12 + rows.length * 8);
    const colW = [CW * 0.34, CW * 0.33, CW * 0.33];
    fill(C.tableHead); doc.rect(ML, y, CW, 8, "F");
    let cx = ML;
    ["Details", "Stated", "Verified"].forEach((h, i) => {
      txt(h, cx + 3, y + 5.5, { bold: true, size: 8, color: C.white });
      cx += colW[i];
    });
    y += 8;
    rows.forEach((row, ri) => {
      checkPage(9);
      if (ri % 2 === 1) { fill(C.rowAlt); doc.rect(ML, y, CW, 8, "F"); }
      stroke(C.lightGray); doc.setLineWidth(0.2);
      doc.rect(ML, y, CW, 8, "S");
      cx = ML;
      row.forEach((cell, ci) => {
        txt(cell ?? "—", cx + 3, y + 5.5, { size: 8, color: C.bodyText, maxWidth: colW[ci] - 6 });
        cx += colW[ci];
      });
      y += 8;
    });
    y += 4;
  };

  const commentRows = (rows) => {
    checkPage(rows.length * 9 + 4);
    const colW = [CW * 0.35, CW * 0.65];
    rows.forEach((row, ri) => {
      checkPage(9);
      if (ri % 2 === 1) { fill(C.rowAlt); doc.rect(ML, y, CW, 9, "F"); }
      stroke(C.lightGray); doc.setLineWidth(0.2);
      doc.rect(ML, y, CW, 9, "S");
      txt(row[0], ML + 3, y + 6, { bold: true, size: 8, color: C.navy, maxWidth: colW[0] - 6 });
      txt(row[1] ?? "—", ML + colW[0] + 3, y + 6, { size: 8, color: C.bodyText, maxWidth: colW[1] - 6 });
      y += 9;
    });
    y += 5;
  };

  const statusBadge = (label) => {
    txt(`${label}— `, ML, y + 4, { bold: true, size: 8, color: C.navy });
    const lw = doc.getTextWidth(`${label}— `) * 0.8;
    txt("Completed", ML + lw, y + 4, { bold: true, size: 8, color: C.cleared });
    y += 9;
  };

  const dateRow = (req, comp) => {
    txt("Request Date", ML, y, { bold: true, size: 8, color: C.labelText });
    txt("Completion Date", ML + CW / 2, y, { bold: true, size: 8, color: C.labelText });
    y += 5;
    txt(req, ML, y, { size: 8, color: C.bodyText });
    txt(comp, ML + CW / 2, y, { size: 8, color: C.bodyText });
    y += 9;
  };

  // ── helper: embed an image from a server path ──
  const tryEmbedImage = (path, xPos, yPos, w, h) => {
    if (!path || !base_url) return false;
    try {
      const url = `${base_url}/${path.replace(/\\/g, "/")}`;
      const ext = path.split(".").pop().toUpperCase();
      const fmt = ["JPG", "JPEG"].includes(ext) ? "JPEG" : ext === "PNG" ? "PNG" : null;
      if (!fmt) return false;
      doc.addImage(url, fmt, xPos, yPos, w, h);
      return true;
    } catch { return false; }
  };

  /* ── PAGE 1 ── */
  drawHeader();
  const bh = 58;
  fill(C.rowAlt); doc.roundedRect(ML, y, CW, bh, 3, 3, "F");
  let ly = y + 8;
  txt("Final Report", ML + 6, ly, { bold: true, size: 8, color: C.green }); ly += 6;
  txt(data.candidate_name || "—", ML + 6, ly, { bold: true, size: 9, color: C.navy }); ly += 5;
  txt(`Requested #-${data.req_code || "N/A"}`, ML + 6, ly, { size: 8, color: C.labelText }); ly += 9;
  txt("Package Opted-", ML + 6, ly, { bold: true, size: 8, color: C.navy }); ly += 5;
  services.forEach(s => { txt(`• ${s.services?.name || "—"}`, ML + 6, ly, { size: 8, color: C.bodyText }); ly += 5; });
  ly += 2;
  txt("Date of Request", ML + 6, ly, { bold: true, size: 8, color: C.navy }); ly += 5;
  txt(reqDate, ML + 6, ly, { size: 8, color: C.bodyText });
  const rx = ML + CW - 6;
  let ry = y + 8;
  txt("Prepared By", rx, ry, { bold: true, size: 8, color: C.navy, align: "right" }); ry += 6;
  ["Mysdom", "Bhubaneswar", "www.mysdom.com", "contactus@mysdom.com"].forEach(v => {
    txt(v, rx, ry, { size: 8, color: C.labelText, align: "right" }); ry += 5;
  });
  stroke(C.lightGray); doc.setLineWidth(0.3);
  doc.line(ML + CW * 0.56, y + 6, ML + CW * 0.56, y + bh - 6);
  y += bh + 8;

  sectionTitle("EXECUTIVE SUMMARY");
  const execCols = ["MYS#", "Applicant", "Organisation", "Package", "Address", "Education", "Employment"];
  const execColW = [CW * 0.12, CW * 0.14, CW * 0.17, CW * 0.19, CW * 0.13, CW * 0.12, CW * 0.13];
  fill(C.tableHead); doc.rect(ML, y, CW, 9, "F");
  let cx = ML;
  execCols.forEach((h, i) => {
    txt(h, cx + execColW[i] / 2, y + 6, { bold: true, size: 7, color: C.white, align: "center", maxWidth: execColW[i] - 2 });
    cx += execColW[i];
  });
  y += 9;
  fill(C.rowAlt); doc.rect(ML, y, CW, 10, "F");
  stroke(C.lightGray); doc.setLineWidth(0.2); doc.rect(ML, y, CW, 10, "S");
  cx = ML;
  const pkgText = services.map(s => s.services?.name).join(", ");
  [data.req_code, data.candidate_name, data.client?.companyName, pkgText, "Cleared", "Cleared", "Cleared"].forEach((v, i) => {
    const isStatus = i >= 4;
    txt(v ?? "—", cx + execColW[i] / 2, y + 6.5,
      { size: 7, color: isStatus ? C.cleared : C.bodyText, bold: isStatus, align: "center", maxWidth: execColW[i] - 2 });
    cx += execColW[i];
  });
  y += 14;
  doc.addPage();

  /* ── PAGE 2: Education ── */
  y = 0; drawHeader(); y += 4;
  sectionTitle("EDUCATION CHECK");
  dateRow("N/A", "N/A");
  statusBadge("Education Verification");
  verifyTable([
    ["University", data.university || "N/A", data.university || "N/A"],
    ["Roll No / Reg. No.", data.roll_number || "N/A", data.roll_number || "N/A"],
    ["Course / Qualification", data.qualification || "N/A", data.qualification || "N/A"],
    ["Year of Passing", data.passing_year || "N/A", data.passing_year || "N/A"],
    ["Specialization", data.specialization || "N/A", data.specialization || "N/A"],
    ["Mode of Verification", "Online", ""],
  ]);
  commentRows([
    ["Verifier's Comments:", "Verification done via institute records."],
    ["Final Disposition", "Provided details have been verified and found to be correct"],
    ["Check Status", "Clear"],
  ]);

  // education doc
  if (data.edu_doc) {
    checkPage(50);
    txt("Education Certificate:", ML, y + 4, { bold: true, size: 8, color: C.navy });
    y += 7;
    const embedded = tryEmbedImage(data.edu_doc, ML, y, 80, 50);
    if (!embedded) txt(data.edu_doc.split(/[\\/]/).pop(), ML + 4, y + 5, { size: 8, color: C.labelText });
    y += embedded ? 54 : 10;
  }
  doc.addPage();

  /* ── PAGE 3+: Employment ── */
  emps.forEach((emp, idx) => {
    y = 0; drawHeader(); y += 4;
    sectionTitle("EMPLOYMENT CHECK");
    dateRow("N/A", "N/A");
    statusBadge("Employment Verification");
    verifyTable([
      ["Employer", emp.company_name || "N/A", emp.company_name || "N/A"],
      ["Employee Code", emp.employee_id || "N/A", emp.employee_id || "N/A"],
      ["Start Date", emp.employment_start || "N/A", emp.employment_start || "N/A"],
      ["End Date", emp.isCurrent ? "Currently Working" : (emp.employment_end || "N/A"),
        emp.isCurrent ? "Currently Working" : (emp.employment_end || "N/A")],
      ["Designation", emp.job_title || "N/A", emp.job_title || "N/A"],
      ["Mode of Response", "Email Verification", ""],
    ]);
    commentRows([
      ["Verifier's Comments:", emp.leaving_reason || "Verified via email confirmation."],
      ["Final Disposition", "Clear"],
      ["Check Status", "Complete"],
    ]);

    // employment doc
    if (emp.job_doc) {
      checkPage(50);
      txt("Supporting Document:", ML, y + 4, { bold: true, size: 8, color: C.navy });
      y += 7;
      const embedded = tryEmbedImage(emp.job_doc, ML, y, 80, 50);
      if (!embedded) txt(emp.job_doc.split(/[\\/]/).pop(), ML + 4, y + 5, { size: 8, color: C.labelText });
      y += embedded ? 54 : 10;
    }

    if (idx < emps.length - 1) doc.addPage();
  });
  doc.addPage();

  /* ── Address ── */
  y = 0; drawHeader(); y += 4;
  sectionTitle("ADDRESS CHECK");
  dateRow("N/A", "N/A");
  statusBadge("Address Verification");
  verifyTable([
    ["Current Address", data.current_address || "N/A", data.current_address || "N/A"],
    ["Current Landmark", data.current_landmark || "N/A", data.current_landmark || "N/A"],
    ["Residency Status", data.current_residency || "N/A", data.current_residency || "N/A"],
    ["Permanent Address", data.permanent_address || "N/A", data.permanent_address || "N/A"],
    ["Perm. Landmark", data.permanent_landmark || "N/A", data.permanent_landmark || "N/A"],
    ["Ownership Status", data.permanent_residency || "N/A", ""],
  ]);
  commentRows([
    ["Verifier's relation with Subject", "Field verification agent"],
    ["Check Status", "Clear"],
  ]);

  // ID doc
  if (data.id_doc) {
    checkPage(50);
    txt("Identity Document:", ML, y + 4, { bold: true, size: 8, color: C.navy });
    y += 7;
    const embedded = tryEmbedImage(data.id_doc, ML, y, 80, 50);
    if (!embedded) txt(data.id_doc.split(/[\\/]/).pop(), ML + 4, y + 5, { size: 8, color: C.labelText });
    y += embedded ? 54 : 10;
  }

  // Service docs
  const servicesWithDocs = services.filter(s => s.doc_1 || s.doc_2);
  if (servicesWithDocs.length > 0) {
    doc.addPage();
    y = 0; drawHeader(); y += 4;
    sectionTitle("SERVICE DOCUMENTS");
    servicesWithDocs.forEach(sv => {
      checkPage(60);
      txt(sv.services?.name || "Service", ML, y + 5, { bold: true, size: 10, color: C.navy });
      y += 9;
      [["doc_1", "Document 1"], ["doc_2", "Document 2"]].forEach(([field, label]) => {
        if (!sv[field]) return;
        checkPage(55);
        txt(label + ":", ML, y + 4, { bold: true, size: 8, color: C.labelText });
        y += 7;
        const embedded = tryEmbedImage(sv[field], ML, y, 80, 50);
        if (!embedded) txt(sv[field].split(/[\\/]/).pop(), ML + 4, y + 5, { size: 8, color: C.labelText });
        y += embedded ? 54 : 10;
      });
      y += 4;
    });
  }

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

const Row = ({ label, value }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "160px 1fr",
    padding: "8px 20px", borderBottom: "1px solid #f3f4f6", fontSize: 13
  }}>
    <span style={{ color: "#6b7280", fontWeight: 600 }}>{label}</span>
    <span style={{ color: "#111827" }}>{value || <em style={{ color: "#aaa" }}>—</em>}</span>
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

const VerifyTable = ({ rows }) => (
  <div style={{ overflowX: "auto" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
      <thead>
        <tr>{["Details", "Stated", "Verified"].map(h => (
          <th key={h} style={{
            background: "#1e2b4a", color: "#fff",
            padding: "9px 14px", textAlign: "left",
            fontWeight: 700, fontSize: 11, letterSpacing: "0.04em"
          }}>{h}</th>
        ))}</tr>
      </thead>
      <tbody>
        {rows.map(([d, s, v], i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
            {[d, s, v].map((cell, ci) => (
              <td key={ci} style={{
                padding: "9px 14px",
                color: ci === 0 ? "#374151" : "#1f2937",
                fontWeight: ci === 0 ? 600 : 400,
                borderBottom: "1px solid #f3f4f6"
              }}>{cell || "—"}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ClearedBox = ({ label }) => (
  <div style={{
    margin: "12px 20px 16px", background: "#f0fdf4",
    border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px"
  }}>
    <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#166534" }}>{label}</p>
    <p style={{ margin: "0 0 6px", fontSize: 12, color: "#14532d" }}>
      Provided details have been verified and found to be correct.
    </p>
    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#27ae60" }}>✓ Check Status: Clear</p>
  </div>
);

/* file attachment pill — shown in UI when a path exists */
// const FilePill = ({ path, base_url, label }) => {
//   if (!path) return <em style={{ fontSize: 12, color: "#aaa" }}>No file</em>;
//   const name = path.split(/[\\/]/).pop();
//   const url = base_url ? `${base_url}/${path.replace(/\\/g, "/")}` : "#";
//   return (
//     <a href={url} target="_blank" rel="noopener noreferrer"
//       style={{
//         display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12,
//         color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0",
//         borderRadius: 20, padding: "3px 12px", textDecoration: "none", fontWeight: 500
//       }}>
//       📎 {label || name}
//     </a>
//   );
// };

const FilePill = ({ path, base_url, label }) => {
  if (!path) {
    return <em style={{ fontSize: 12, color: "#aaa" }}>No file</em>;
  }

  const cleanPath = path.replace(/\\/g, "/");
  const url = base_url ? `${base_url}/${cleanPath}` : "#";
  const ext = cleanPath.split('.').pop().toLowerCase();
  const name = cleanPath.split('/').pop();

  // 🖼️ Image Preview
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        <img
          src={url}
          alt={label}
          style={{

            // width: "80%",
            width: 500,
            // height: "auto",
            height: 500,
            borderRadius: 8,
            border: "1px solid #ddd"
          }}
        />
        {/* <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
          🔍 View Full
        </a> */}
      </div>
    );
  }

  // 📄 PDF Preview
  if (ext === "pdf") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        <iframe
          src={url}
          title={label}
          style={{
            // width: "100%",
            // height: 200,
            width: 500,
            height: 500,
            border: "1px solid #ddd",
            borderRadius: 6
          }}
        />
        {/* <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
          📥 Open PDF
        </a> */}
      </div>
    );
  }

  // 🔗 Default (other files)
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        color: "#166534",
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        borderRadius: 20,
        padding: "3px 12px",
        textDecoration: "none",
        fontWeight: 500
      }}
    >
      📎 {label || name}
    </a>
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
  // data comes from navigate(..., { state: { data: req } })
  const navigate = useNavigate();
  const data = location.state?.data || {};
  const base_url = import.meta.env.VITE_BASE_URL;

  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const jsPDF = await loadJsPDF();
      const doc = buildPDF(jsPDF, data, base_url);
      doc.save(`BGV-Report-${data.req_code || "report"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const services = data.bgvReqestService || [];
  const emps = data.employments || [];
  const reqDate = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-IN")
    : "—";
  const updateDate = data.updatedAt
    ? new Date(data.updatedAt).toLocaleDateString("en-IN")
    : "—";
  console.log('bgv services:', services);
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
          <div style={{paddingBottom:"10px", }}>
            <button 
              style={{display:"flex",flexDirection:'row',
                      alignItems:"center", gap:'2px',
                      textAlign:"center",
                      padding:"6px",
                      background:'#3d6ca9',
                      color:'white',
                      borderRadius:"5px"
                     }}
              onClick={()=>(navigate('/bgv/list'))}
            >
              <ArrowLeft size={18}/>Back
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
                  <p style={{
                    margin: "0 0 4px", fontSize: 11, fontWeight: 700,
                    color: "#7bc142", textTransform: "uppercase", letterSpacing: "0.08em"
                  }}>Final Report</p>
                  <p style={{ margin: "0 0 2px", fontSize: 13, color: "#1f2937", fontWeight: 600 }}>
                    {data.candidate_name || "—"}
                  </p>
                  <p style={{ margin: "0 0 14px", fontSize: 12, color: "#6b7280" }}>
                    {data.req_code ? `Requested #${data.req_code}` : ""}
                  </p>
                  <p style={{
                    margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#1e2b4a",
                    textTransform: "uppercase", letterSpacing: "0.06em"
                  }}>Package Opted</p>
                  {services.length > 0
                    ? services.map(s => (
                      <p key={s.id} style={{ margin: "0 0 2px", fontSize: 12, color: "#374151" }}>
                        • {s.services?.name}
                      </p>
                    ))
                    : <p style={{ fontSize: 12, color: "#aaa" }}>—</p>}
                  <p style={{
                    margin: "14px 0 4px", fontSize: 11, fontWeight: 700, color: "#1e2b4a",
                    textTransform: "uppercase", letterSpacing: "0.06em"
                  }}>Date of Request</p>
                  <p style={{ margin: "0 0 2px", fontSize: 12, color: "#374151" }}>{reqDate}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#374151" }}>{data.client?.companyName || ""}</p>
                </div>
                <div style={{ padding: 20, background: "#f9fafb" }}>
                  <p style={{
                    margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#1e2b4a",
                    textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "right"
                  }}>Prepared By</p>
                  {["Mysdom", "Bhubaneswar", "www.mysdom.com", "contactus@mysdom.com"].map(v => (
                    <p key={v} style={{ margin: "0 0 2px", fontSize: 12, color: "#374151", textAlign: "right" }}>{v}</p>
                  ))}
                  <div style={{ marginTop: 20, borderTop: "1px solid #e5e7eb", paddingTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 20 }}>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: 10, color: "#9ca3af" }}>Report No</p>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#7bc142" }}>
                          {data.req_code ? `#${data.req_code}` : "—"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: 10, color: "#9ca3af" }}>Completion Date</p>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f5a623" }}>{['COMPLETED', 'REJECTED', 'CLOSED'].includes(data.status) ? updateDate : "_ _ _"}</p>
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
                      <th key={h} style={{
                        background: "#1e2b4a", color: "#fff",
                        padding: "9px 10px", textAlign: "center", fontWeight: 700, fontSize: 11
                      }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: "#f9fafb" }}>
                      {[data.req_code, data.candidate_name, data.client?.companyName,
                      services.map(s => s.services?.name).join(", ") || "—"].map((v, i) => (
                        <td key={i} style={{
                          padding: "9px 10px", textAlign: "center",
                          fontSize: 12, color: "#1f2937", borderBottom: "1px solid #e5e7eb"
                        }}>
                          {v || "—"}
                        </td>
                      ))}
                      {[...services.map(s => s.status)].map((v, i) => (
                        <td key={i} style={{
                          padding: "9px 10px", textAlign: "center",
                          borderBottom: "1px solid #e5e7eb"
                        }}>
                          <Badge label={v} color={{ bg: "#d1fae5", txt: "#065f46" }} />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ── Personal Details ── */}
          {/* <div className="rs">
            <SectionDivider title="Candidate Details" />
            <Card>
              <CardHeader icon="👤" title="PERSONAL DETAILS"
                right={data.designation
                  ? <Badge label={data.designation} color={{ bg:"rgba(255,255,255,.15)", txt:"#fff" }} />
                  : null}
              />
              <div style={{ paddingBottom:6 }}>
                <Row label="Full Name"     value={data.candidate_name} />
                <Row label="Email"         value={data.candidate_email} />
                <Row label="Phone"         value={data.candidate_phone} />
                <Row label="Department"    value={data.department} />
                <Row label="Date of Birth" value={data.dob} />
                <Row label="Gender"        value={data.gender} />
                <Row label="Father's Name" value={data.father_name} />
                <Row label="Mother's Name" value={data.mother_name} />
              </div>
              {data.id_doc && (
                <div style={{ padding:"10px 20px 16px", borderTop:"1px solid #f3f4f6" }}>
                  <p style={{ margin:"0 0 6px", fontSize:11, fontWeight:700, color:"#6b7280",
                    textTransform:"uppercase", letterSpacing:"0.06em" }}>
                    Identity Document ({data.id_type})
                  </p>
                  <FilePill path={data.id_doc} base_url={base_url} label={`${data.id_type || "ID"} — ${data.id_number || ""}`} />
                </div>
              )}
            </Card>
          </div> */}

          {/* ── Address Check ── */}
          {/* <div className="rs">
            <SectionDivider title="Address Check" />
            <Card>
              <CardHeader icon="🏠" title="ADDRESS CHECK"
                right={<Badge label="Cleared" color={{ bg:"#d1fae5", txt:"#065f46" }} />}
              />
              <div style={{ padding:"12px 20px 4px" }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase" }}>
                  Address Verification — <span style={{ color:"#27ae60" }}>Completed</span>
                </span>
              </div>
              <VerifyTable rows={[
                ["Current Address",   data.current_address,    data.current_address],
                ["Current Landmark",  data.current_landmark,   data.current_landmark],
                ["Residency",         data.current_residency,  data.current_residency],
                ["Duration",          data.current_duration ? `${data.current_duration} yrs` : null, null],
                ["Permanent Address", data.permanent_address,  data.permanent_address],
                ["Perm. Landmark",    data.permanent_landmark, data.permanent_landmark],
              ]} />
              <ClearedBox label="Final Disposition" />
            </Card>
          </div> */}

          {/* ── Education Check ── */}
          {
            services?.map(s =>
              <div className="rs">
                <SectionDivider title={`${s.services.name}`} />
                <Card>
                  <CardHeader icon="🎓" title={`${s.services.name}`}
                    right={<Badge label={`${s.status}`} color={{ bg: "#d1fae5", txt: "#065f46" }} />}
                  />
                  <div style={{ padding: "4px", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>

                    <div style={{ padding: "12px 20px 4px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>
                        {`${s.services.name}`} — <span style={{ color: "#27ae60" }}>{`${s.status}`}</span>
                      </span>
                    </div>
                    <div style={{ padding: "12px 20px 4px" }}>
                      <p style={{ margin: 0, fontSize: 10, color: "#757677" }}>Completion Date</p>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#f5a623" }}>{['COMPLETED', 'REJECTED', 'CLOSED'].includes(s.status) ? (s.updatedAt
                        ? new Date(data.updatedAt).toLocaleDateString("en-IN")
                        : ""):"_ _ _"}</p>
                    </div>
                  </div>
                  {/* <VerifyTable rows={[
                    ["University", data.university, data.university],
                    ["Qualification", data.qualification, data.qualification],
                    ["Specialization", data.specialization, data.specialization],
                    ["Roll Number", data.roll_number, data.roll_number],
                    ["Passing Year", data.passing_year, data.passing_year],
                    ["Mode", "Online", ""],
                  ]} /> */}
                  {/* <ClearedBox label="Final Disposition" /> */}
                  {/* Education doc */}
                  {(s.doc_1 || s.doc_2) && (
                    <div style={{ padding: "0 20px 16px" }}>
                      <p style={{
                        margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#6b7280",
                        textTransform: "uppercase", letterSpacing: "0.06em"
                      }}>{s.services.name} Documents</p>
                      {s.doc_1 && <FilePill path={s?.doc_1} base_url={base_url} label="Education Certificate" />}
                      {s.doc_2 && <FilePill path={s?.doc_2} base_url={base_url} label="Education Certificate" />}
                    </div>
                  )}
                </Card>
              </div>
            )
          }


          {/* ── Employment Check ── */}
          {/* <div className="rs">
            <SectionDivider title="Employment Check" />
            {emps.length > 0
              ? emps.map((emp, i) => (
                  <Card key={emp.id || i}>
                    <CardHeader icon="💼"
                      title={`EMPLOYMENT CHECK${emps.length > 1 ? ` #${i+1}` : ""}`}
                      right={<Badge label="Cleared" color={{ bg:"#d1fae5", txt:"#065f46" }} />}
                    />
                    <div style={{ padding:"12px 20px 4px" }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#6b7280", textTransform:"uppercase" }}>
                        Employment Verification — <span style={{ color:"#27ae60" }}>Completed</span>
                      </span>
                    </div>
                    <VerifyTable rows={[
                      ["Employer",       emp.company_name,     emp.company_name],
                      ["Employee Code",  emp.employee_id,      emp.employee_id],
                      ["Start Date",     emp.employment_start, emp.employment_start],
                      ["End Date",       emp.isCurrent ? "Currently Working" : emp.employment_end,
                                         emp.isCurrent ? "Currently Working" : emp.employment_end],
                      ["Designation",    emp.job_title,        emp.job_title],
                      ["Mode",           "Email Verification", ""],
                    ]} />
                    <ClearedBox label="Final Disposition" />
                    
                    {emp.job_doc && (
                      <div style={{ padding:"0 20px 16px" }}>
                        <p style={{ margin:"0 0 6px", fontSize:11, fontWeight:700, color:"#6b7280",
                          textTransform:"uppercase", letterSpacing:"0.06em" }}>Supporting Document</p>
                        <FilePill path={emp.job_doc} base_url={base_url} label="Payslip / Relieving Letter" />
                      </div>
                    )}
                  </Card>
                ))
              : <Card><div style={{ padding:24, color:"#aaa", fontSize:13 }}>No employment records.</div></Card>
            }
          </div> */}

          {/* ── Services ── */}
          <div className="rs">
            <SectionDivider title="Services Overview" />
            <Card>
              <CardHeader icon="⚙️" title="SERVICES STATUS" />
              {services.length > 0
                ? (
                  <div style={{
                    padding: "16px 20px", display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12
                  }}>
                    {services.map(sv => {
                      const sc = statusColor(sv.status);
                      const docCount = [sv.doc_1, sv.doc_2].filter(Boolean).length;
                      return (
                        <div key={sv.id} style={{
                          border: `1.5px solid ${sc.bg}`,
                          borderRadius: 10, padding: "12px 14px", background: sc.bg + "55"
                        }}>
                          <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13, color: "#1e2b4a" }}>
                            {sv.services?.name}
                          </p>
                          <Badge label={sv.status?.replace(/_/g, " ") || "—"} color={sc} />
                          {/* service docs */}
                          {/* {(sv.doc_1 || sv.doc_2) && (
                            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                              {sv.doc_1 && <FilePill path={sv.doc_1} base_url={base_url} label="Document 1" />}
                              {sv.doc_2 && <FilePill path={sv.doc_2} base_url={base_url} label="Document 2" />}
                            </div>
                          )}
                          {docCount === 0 && (
                            <p style={{ margin: "8px 0 0", fontSize: 11, color: "#9ca3af" }}>No documents attached</p>
                          )} */}
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
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#7bc142" }}>
                MYSDOM Background Verification
              </p>
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