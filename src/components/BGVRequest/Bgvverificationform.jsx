import { useState } from "react";
import "./BGVVerificationForm.css";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

// ─── Replace with your actual API response / props ────────────────────────────
// const bgvData = {
//   id: "c0e4b973-b27a-49ea-983f-48e506bb616c",
//   req_code: "MYS-ABC-BBS-831272246",
//   candidate_name: "test2",
//   candidate_email: "test21@gmail.com",
//   candidate_phone: "9178922177",
//   status: "IN_PROGRESS",
//   id_type: "Aadhar",
//   id_number: "890478569123",
//   current_address: "Sector 15, Noida, Uttar Pradesh",
//   current_landmark: "Near Metro Station",
//   current_residency: "Owned",
//   current_duration: "3",
//   permanent_address: "Patia, Bhubaneswar, Odisha",
//   permanent_landmark: "KIIT Square",
//   permanent_residency: "Owned",
//   permanent_duration: "10",
//   father_name: "LK Lenka",
//   mother_name: "JL lenka",
//   city: null,
//   institute_name: "IIM bbsr",
//   university: "BPUT, Bhubaneswar",
//   education_start: "2026-04-22",
//   education_end: "2026-04-23",
//   roll_number: "256354",
//   qualification: "MCA",
//   specialization: "Computer Application",
//   passing_year: "2020",
//   degree_status: "yes",
//   pan_card: "ABHGY1254D",
//   social_media_type: "LinkedIn",
//   social_media_id: "abdjkfjd.kk/linkedin/jfd",
//   nick_name: "Harihara",
//   employments: [
//     {
//       id: "460d6e4c-76be-478f-b25c-9c7978a7fc3e",
//       bgvRequestId: "c0e4b973-b27a-49ea-983f-48e506bb616c",
//       company_name: "TCS",
//       employee_id: "TCS01256",
//       employment_start: "2026-04-15",
//       isCurrent: false,
//       employment_end: "2026-04-23",
//       job_title: "Software developer",
//       leaving_reason: "Carrier growth",
//       employment_category: null,
//       employment_type: null,
//     },
//   ],
//   BGVRequestProducts: [
//     { id: "p1", productId: "5fa31cb2", status: "SUBMITED", doc_1: "public/bgvservice_docs/doc1.png", doc_2: "public/bgvservice_docs/doc2.png", verifier_comment: "hhh", Product: { id: "5fa31cb2", title: "Employment check" } },
//     { id: "p2", productId: "e22036ba", status: "SUBMITED", doc_1: null, doc_2: null, verifier_comment: null, Product: { id: "e22036ba", title: "Education check" } },
//     { id: "p3", productId: "3e0ae6b8", status: "SUBMITED", doc_1: null, doc_2: null, verifier_comment: null, Product: { id: "3e0ae6b8", title: "Criminal check" } },
//     { id: "p4", productId: "aa4f03c3", status: "SUBMITED", doc_1: null, doc_2: null, verifier_comment: null, Product: { id: "aa4f03c3", title: "ID verification" } },
//     { id: "p5", productId: "a12f4870", status: "SUBMITED", doc_1: null, doc_2: null, verifier_comment: null, Product: { id: "a12f4870", title: "Address verification" } },
//     { id: "p6", productId: "8d3546da", status: "SUBMITED", doc_1: null, doc_2: null, verifier_comment: null, Product: { id: "8d3546da", title: "Social media checks" } },
//     { id: "p7", productId: "2760abce", status: "SUBMITED", doc_1: null, doc_2: null, verifier_comment: null, Product: { id: "2760abce", title: "Credit checks" } },
//   ],
// };

// ─── Constants ────────────────────────────────────────────────────────────────
const PRODUCT_ORDER = [
  "Employment check",
  "Education check",
  "Criminal check",
  "ID verification",
  "Address verification",
  "Social media checks",
  "Credit checks",
];

const ICONS = {
  "Employment check": "🏢",
  "Education check": "🎓",
  "Criminal check": "🔍",
  "ID verification": "🪪",
  "Address verification": "📍",
  "Social media checks": "📱",
  "Credit checks": "💳",
};

const STATUS_OPTIONS = ['SUBMITED', 'IN PROGRESS', 'ON HOLD', 'COMPLETED', 'REJECTED', 'CLOSED'];
const MODE_OPTIONS = ["Online", "Offline"];
const DISCREPANCY_OPTIONS = ["Clear Discrepancy", "Minor Discrepancy", "Discrepancy"];

const parseVerificationData = (value) => {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return typeof value === "object" ? value : {};
};

const buildInitialProductState = (product) => ({
  status: product?.status || "",
  mode_of_verification: product?.mode_of_verification || "",
  verifier_comment: product?.verifier_comment || "",
  final_desc: product?.final_desc || "",
  final_discrepancy: product?.final_discrepancy || "",
  remark: product?.remark || "",
  verification_data: parseVerificationData(product?.verification_data),
});

const getValue = (primaryValue, fallbackValue) =>
  primaryValue !== null && primaryValue !== undefined && primaryValue !== ""
    ? primaryValue
    : (fallbackValue ?? "");

const getFieldValue = (value, options) => {
  if (typeof value === "boolean" && Array.isArray(options)) {
    return value ? "Yes" : "No";
  }

  return value ?? "";
};

const normalizeBooleanSelection = (value) => {
  if (value === true || value === false) return value;
  if (value === "Yes") return true;
  if (value === "No") return false;
  return value;
};

const normalizeVerificationData = (verificationData = {}) => ({
  ...verificationData,
  employeeDetails: Array.isArray(verificationData.employeeDetails)
    ? verificationData.employeeDetails.map((employee) => ({
        ...employee,
        verify_isCurrent: normalizeBooleanSelection(employee?.verify_isCurrent),
      }))
    : verificationData.employeeDetails,
});

const isImageFile = (file) => file?.type?.startsWith("image/");

// ─── Tiny helper components ───────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="bgv-info-row">
    <span className="bgv-info-label">{label}</span>
    <span className="bgv-info-value">
      {value != null && value !== "" ? value : <em>N/A</em>}
    </span>
  </div>
);

const Field = ({ label, name, value, onChange, type = "text", options, fullWidth }) => (
  <div className={`bgv-field${fullWidth ? " full" : ""}`}>
    <label>{label}</label>
    {options ? (
      <select name={name} value={getFieldValue(value, options)} onChange={onChange}>
        <option value="">— Select —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={getFieldValue(value)}
        onChange={onChange}
        placeholder={`Verified ${label.toLowerCase()}`}
      />
    )}
  </div>
);

const Card = ({ title, icon, children }) => (
  <div className="bgv-card">
    <div className="bgv-card-title">
      <span className="bgv-card-title-icon">{icon}</span>
      {title}
    </div>
    {children}
  </div>
);
//-----Personal details-------------//
function PersonalDetails({ bgv }) {
  return (
    <div className="bgv-personal-info">
      <Card title="Personal Details" icon="👤">
        <InfoRow label="Name" value={bgv.candidate_name} />
        <InfoRow label="Email" value={bgv.candidate_email} />
        <InfoRow label="Phone" value={bgv.candidate_phone} />
        <InfoRow label="Gender" value={bgv.gender} />
        <InfoRow label="Date of Birth" value={bgv.dob} />
        {bgv.designation && <InfoRow label="Designation" value={bgv.designation} />}
        {bgv.department && <InfoRow label="Department" value={bgv.department} />}
      </Card>
    </div>
  )
}

// ─── Product-specific form sections ──────────────────────────────────────────
function EmploymentForm({ bgv, vd, onVerify, onEmpVerify }) {
  const empList = vd.employeeDetails ||
    bgv.employments.map((e) => ({ id: e.id, bgvRequestId: e.bgvRequestId }));

  return (
    <div className="bgv-split">
      <Card title="Submitted Employment" icon="🏢">
        {bgv.employments.map((emp, i) => (
          <div key={i} className="bgv-emp-block">
            <div className="bgv-emp-block-title">#{i + 1} — {emp.company_name}</div>
            <InfoRow label="Company" value={emp.company_name} />
            <InfoRow label="Employee ID" value={emp.employee_id} />
            <InfoRow label="Job Title" value={emp.job_title} />
            <InfoRow label="Start" value={emp.employment_start} />
            <InfoRow label="End" value={emp.employment_end} />
            <InfoRow label="Current" value={emp.isCurrent ? "Yes" : "No"} />
            <InfoRow label="Leaving Reason" value={emp.leaving_reason} />
            <InfoRow label="Category" value={emp.employment_category} />
            <InfoRow label="Type" value={emp.employment_type} />
          </div>
        ))}
      </Card>

      <Card title="Verify Employment" icon="✅">
        {bgv.employments.map((emp, i) => {
          const ev = empList[i] || {};
          const handle = (e) => onEmpVerify(i, e, empList);
          console.log("Rendering employment form for:", empList[i]);
          return (
            <div key={i} className="bgv-emp-block">
              <div className="bgv-emp-block-title">#{i + 1} — {emp.company_name}</div>
              <Field label="Company Name" name="verify_company_name" value={getValue(ev.verify_company_name, emp.verify_company_name)} onChange={handle} />
              <Field label="Employee ID" name="verify_employee_id" value={getValue(ev.verify_employee_id, emp.verify_employee_id)} onChange={handle} />
              <Field label="Job Title" name="verify_job_title" value={getValue(ev.verify_job_title, emp.verify_job_title)} onChange={handle} />
              <Field label="Start Date" name="verify_employment_start" value={getValue(ev.verify_employment_start, emp.verify_employment_start)} onChange={handle} type="date" />
              <Field label="End Date" name="verify_employment_end" value={getValue(ev.verify_employment_end, emp.verify_employment_end)} onChange={handle} type="date" />
              <Field label="Is Current" name="verify_isCurrent" value={getValue(ev.verify_isCurrent, emp.verify_isCurrent )} onChange={handle} options={["Yes", "No"]} />
              <Field label="Leaving Reason" name="verify_leaving_reason" value={getValue(ev.verify_leaving_reason, emp.verify_leaving_reason)} onChange={handle} />
              <Field label="Employment Category" name="verify_employment_category" value={getValue(ev.verify_employment_category, emp.verify_employment_category)} onChange={handle} />
              <Field label="Employment Type" name="verify_employment_type" value={getValue(ev.verify_employment_type, emp.verify_employment_type)} onChange={handle} />
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function EducationForm({ bgv, vd, onVerify }) {
  return (
    <div className="bgv-split">
      <Card title="Submitted Education" icon="🎓">
        <InfoRow label="Institute" value={bgv.institute_name} />
        <InfoRow label="University" value={bgv.university} />
        <InfoRow label="Qualification" value={bgv.qualification} />
        <InfoRow label="Specialization" value={bgv.specialization} />
        <InfoRow label="Roll Number" value={bgv.roll_number} />
        <InfoRow label="Start Date" value={bgv.education_start} />
        <InfoRow label="End Date" value={bgv.education_end} />
        <InfoRow label="Passing Year" value={bgv.passing_year} />
        <InfoRow label="Degree Status" value={bgv.degree_status} />
      </Card>
      <Card title="Verify Education" icon="✅">
        <Field label="Institute Name" name="verify_institute_name" value={getValue(vd.verify_institute_name, bgv.verify_institute_name)} onChange={onVerify} />
        <Field label="University" name="verify_university" value={getValue(vd.verify_university, bgv.verify_university)} onChange={onVerify} />
        <Field label="Qualification" name="verify_qualification" value={getValue(vd.verify_qualification, bgv.verify_qualification)} onChange={onVerify} />
        <Field label="Specialization" name="verify_specialization" value={getValue(vd.verify_specialization, bgv.verify_specialization)} onChange={onVerify} />
        <Field label="Roll Number" name="verify_roll_number" value={getValue(vd.verify_roll_number, bgv.verify_roll_number)} onChange={onVerify} />
        <Field label="Start Date" name="verify_education_start" value={getValue(vd.verify_education_start, bgv.verify_education_start)} onChange={onVerify} type="date" />
        <Field label="End Date" name="verify_education_end" value={getValue(vd.verify_education_end, bgv.verify_education_end)} onChange={onVerify} type="date" />
        <Field label="Passing Year" name="verify_passing_year" value={getValue(vd.verify_passing_year, bgv.verify_passing_year)} onChange={onVerify} />
        <Field label="Degree Status" name="verify_degree_status" value={getValue(vd.verify_degree_status, bgv.verify_degree_status)} onChange={onVerify} options={["yes", "no", "awaited"]} />
      </Card>
    </div>
  );
}

function CriminalForm({ bgv, vd, onVerify }) {
  return (
    <div className="bgv-split">
      <Card title="Submitted Details" icon="🔍">
        <InfoRow label="Father's Name" value={bgv.father_name} />
        <InfoRow label="Mother's Name" value={bgv.mother_name} />
        <InfoRow label="Address" value={bgv.address_detail} />
        <InfoRow label="City" value={bgv.city} />
      </Card>
      <Card title="Verify Criminal Check" icon="✅">
        <Field label="Father's Name" name="verify_father_name" value={getValue(vd.verify_father_name, bgv.verify_father_name)} onChange={onVerify} />
        <Field label="Mother's Name" name="verify_mother_name" value={getValue(vd.verify_mother_name, bgv.verify_mother_name)} onChange={onVerify} />
        <Field label="Address Detail" name="verify_address_detail" value={getValue(vd.verify_address_detail, bgv.verify_address_detail)} onChange={onVerify} />
        <Field label="City" name="verify_city" value={getValue(vd.verify_city, bgv.verify_city)} onChange={onVerify} />
      </Card>
    </div>
  );
}

function IDForm({ bgv, vd, onVerify }) {
  return (
    <div className="bgv-split">
      <Card title="Submitted ID" icon="🪪">
        <InfoRow label="ID Type" value={bgv.id_type} />
        <InfoRow label="ID Number" value={bgv.id_number} />
      </Card>
      <Card title="Verify ID" icon="✅">
        <Field label="ID Type" name="verify_id_type" value={getValue(vd.verify_id_type, bgv.verify_id_type)} onChange={onVerify} options={["Aadhar", "PAN", "Passport","Others"]} />
        <Field label="ID Number" name="verify_id_number" value={getValue(vd.verify_id_number, bgv.verify_id_number)} onChange={onVerify} />
      </Card>
    </div>
  );
}

function AddressForm({ bgv, vd, onVerify }) {
  return (
    <div className="bgv-split">
      <Card title="Submitted Address" icon="📍">
        <div className="bgv-sub-label">Current</div>
        <InfoRow label="Address" value={bgv.current_address} />
        <InfoRow label="Landmark" value={bgv.current_landmark} />
        <InfoRow label="Residency" value={bgv.current_residency} />
        <InfoRow label="Duration" value={bgv.current_duration ? `${bgv.current_duration} yrs` : null} />
        <div className="bgv-sub-label">Permanent</div>
        <InfoRow label="Address" value={bgv.permanent_address} />
        <InfoRow label="Landmark" value={bgv.permanent_landmark} />
        <InfoRow label="Residency" value={bgv.permanent_residency} />
        <InfoRow label="Duration" value={bgv.permanent_duration ? `${bgv.permanent_duration} yrs` : null} />
      </Card>
      <Card title="Verify Address" icon="✅">
        <div className="bgv-sub-label">Current</div>
        <Field label="Address" name="verify_current_address" value={getValue(vd.verify_current_address, bgv.verify_current_address)} onChange={onVerify} />
        <Field label="Landmark" name="verify_current_landmark" value={getValue(vd.verify_current_landmark, bgv.verify_current_landmark)} onChange={onVerify} />
        <Field label="Residency" name="verify_current_residency" value={getValue(vd.verify_current_residency, bgv.verify_current_residency)} onChange={onVerify} options={["Owned", "Rented"]} />
        <Field label="Duration (yrs)" name="verify_current_duration" value={getValue(vd.verify_current_duration, bgv.verify_current_duration)} onChange={onVerify} />
        <div className="bgv-sub-label">Permanent</div>
        <Field label="Address" name="verify_permanent_address" value={getValue(vd.verify_permanent_address, bgv.verify_permanent_address)} onChange={onVerify} />
        <Field label="Landmark" name="verify_permanent_landmark" value={getValue(vd.verify_permanent_landmark, bgv.verify_permanent_landmark)} onChange={onVerify} />
        <Field label="Residency" name="verify_permanent_residency" value={getValue(vd.verify_permanent_residency, bgv.verify_permanent_residency)} onChange={onVerify} options={["Owned", "Rented"]} />
        <Field label="Duration (yrs)" name="verify_permanent_duration" value={getValue(vd.verify_permanent_duration, bgv.verify_permanent_duration)} onChange={onVerify} />
      </Card>
    </div>
  );
}

function SocialMediaForm({ bgv, vd, onVerify }) {
  return (
    <div className="bgv-split">
      <Card title="Submitted Social Media" icon="📱">
        <InfoRow label="Platform" value={bgv.social_media_type} />
        <InfoRow label="Profile ID" value={bgv.social_media_id} />
        <InfoRow label="Nick Name" value={bgv.nick_name} />
      </Card>
      <Card title="Verify Social Media" icon="✅">
        <Field label="Platform" name="verify_social_media_type" value={getValue(vd.verify_social_media_type, bgv.verify_social_media_type)} onChange={onVerify} options={["LinkedIn", "Twitter", "Facebook", "Instagram", "Others"]} />
        <Field label="Profile ID" name="verify_social_media_id" value={getValue(vd.verify_social_media_id, bgv.verify_social_media_id)} onChange={onVerify} />
        <Field label="Nick Name" name="verify_nick_name" value={getValue(vd.verify_nick_name, bgv.verify_nick_name)} onChange={onVerify} />
      </Card>
    </div>
  );
}

function CreditForm({ bgv, vd, onVerify }) {
  return (
    <div className="bgv-split">

      <Card title="Submitted Credit Info" icon="💳">
        <InfoRow label="Name" value={bgv.candidate_name} />
        <InfoRow label="PAN Card" value={bgv.pan_card} />
      </Card>
      <Card title="Verify Credit" icon="✅">
        <Field label="PAN Card" name="verify_pan_card" value={getValue(vd.verify_pan_card, bgv.verify_pan_card)} onChange={onVerify} />
      </Card>
    </div>
  );
}

// ─── Dispatch to the right form by product title ──────────────────────────────
function ProductFormSection({ product, bgv, vd, onVerify, onEmpVerify }) {
  const title = product.Product.title;
  switch (title) {
    case "Employment check": return <EmploymentForm bgv={bgv} vd={vd} onVerify={onVerify} onEmpVerify={onEmpVerify} />;
    case "Education check": return <EducationForm bgv={bgv} vd={vd} onVerify={onVerify} />;
    case "Criminal check": return <CriminalForm bgv={bgv} vd={vd} onVerify={onVerify} />;
    case "ID verification": return <IDForm bgv={bgv} vd={vd} onVerify={onVerify} />;
    case "Address verification": return <AddressForm bgv={bgv} vd={vd} onVerify={onVerify} />;
    case "Social media checks": return <SocialMediaForm bgv={bgv} vd={vd} onVerify={onVerify} />;
    case "Credit checks": return <CreditForm bgv={bgv} vd={vd} onVerify={onVerify} />;
    default: return <p style={{ color: "#94a3b8", fontSize: 13 }}>No verification form defined for this product.</p>;
  }
}

// ─── Chip class helper ────────────────────────────────────────────────────────
function chipClass(status) {
  if (!status) return "bgv-tab-chip";
  const s = status.toLowerCase();
  if (s === "verified") return "bgv-tab-chip verified";
  if (s === "discrepancy") return "bgv-tab-chip discrepancy";
  if (s === "submited" || s === "submitted") return "bgv-tab-chip submited";
  return "bgv-tab-chip";
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function BGVVerificationForm({ onClose, bgvData, initialProductId, onUpdated }) {
  const bgv = bgvData;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const sortedProducts = [...bgv.BGVRequestProducts].sort(
    (a, b) => PRODUCT_ORDER.indexOf(a.Product.title) - PRODUCT_ORDER.indexOf(b.Product.title)
  );

  const [activeTab, setActiveTab] = useState(initialProductId || sortedProducts[0]?.productId || "");
  const [formState, setFormState] = useState({});
  const [files, setFiles] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const activeProduct = sortedProducts.find((p) => p.productId === activeTab);
  const pid = activeProduct?.productId;
  const initialProductState = buildInitialProductState(activeProduct);
  const pForm = {
    ...initialProductState,
    ...(formState[pid] || {}),
    verification_data: {
      ...initialProductState.verification_data,
      ...(formState[pid]?.verification_data || {}),
    },
  };
  const vd = pForm.verification_data || {};

  // Update a top-level field (status, mode, comment, etc.)
  const handleTopLevel = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [pid]: { ...prev[pid], [name]: value } }));
  };

  // Update a verification_data field
  const handleVerify = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [pid]: { ...prev[pid], verification_data: { ...vd, [name]: value } },
    }));
  };

  // Update a single employment verify field
  const handleEmpVerify = (idx, e, empList) => {
    const { name, value } = e.target;
    const updated = [...empList];
    if (!updated[idx]) {
      updated[idx] = { id: bgv.employments[idx]?.id, bgvRequestId: bgv.employments[idx]?.bgvRequestId };
    }
    const parsedValue =
      name === "verify_isCurrent"
        ? value === "Yes"
        : value;

    updated[idx] = { ...updated[idx], [name]: parsedValue };
    setFormState((prev) => ({
      ...prev,
      [pid]: { ...prev[pid], verification_data: { ...vd, employeeDetails: updated } },
    }));
  };

  const handleFileChange = (field, file) => {
    if (!file) return;

    if (!isImageFile(file)) {
      toast.error("Only image files are allowed for Document 1 and Document 2");
      return;
    }

    setFiles((prev) => ({ ...prev, [pid]: { ...(prev[pid] || {}), [field]: file } }));
  };

  const handleSubmit = async() => {
    try {
    const normalizedVerificationData = normalizeVerificationData(pForm.verification_data || {});
    const payload = {
      request_id: bgv.id,
      product_id: pid,
      remark: pForm.remark || null,
      status: pForm.status || null,
      mode_of_verification: pForm.mode_of_verification || null,
      verifier_comment: pForm.verifier_comment || null,
      final_desc: pForm.final_desc || null,
      final_discrepancy: pForm.final_discrepancy || null,
      verification_data: normalizedVerificationData,
    };
    console.log("📦 Payload:", payload);
    console.log("📎 Files:", files[pid]);
    const fd = new FormData();
    fd.append("request_id", payload.request_id);
    fd.append("product_id", payload.product_id);
    if (payload.remark) fd.append("remark", payload.remark);
    if (payload.status) fd.append("status", payload.status);
    if (payload.final_discrepancy) fd.append("final_discrepancy", payload.final_discrepancy);
    if (payload.mode_of_verification) fd.append("mode_of_verification", payload.mode_of_verification);
    if (payload.verifier_comment) fd.append("verifier_comment", payload.verifier_comment);
    if (payload.final_desc) fd.append("final_desc", payload.final_desc);
    fd.append("verification_data", JSON.stringify(payload.verification_data));
    if (files[pid]?.doc_1) fd.append("doc_1", files[pid].doc_1);
    if (files[pid]?.doc_2) fd.append("doc_2", files[pid].doc_2);
    await axiosInstance.put('/bgvrequest/status/update', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

    if (typeof onUpdated === "function") {
      await onUpdated();
    }

    setFiles((prev) => ({ ...prev, [pid]: {} }));

    setSubmitted(true);
    toast.success('Updated successfully');
    setTimeout(() => setSubmitted(false), 3000);
  }catch (error) {
    console.error("Error submitting verification:", error);
      toast.error(
        error.response?.data?.message ||
        (error.request ? 'Server not responding.' : error.message)
      );
    } 
  };

   const ExistingFile = ({ path, label }) => {
    if (!path) return <span className="no-file">No file</span>;
    const fileName = path.split(/[\\/]/).pop();

    return (
      <a
        href={`${baseUrl}/${path.replace(/\\/g, '/')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="file-pill"
        title={fileName}
      >
        {label}
      </a>
    );
  };

  //LET GET STATUS
  const getBgvStatus = (status) => {
    if(status === "IN_PROGRESS"){
      return "IN PROGRESS";
    }else 
    if(status === "ON_HOLD"){
      return "ON HOLD";
    }
    return status;
  };

  return (
    <div className="bgv-overlay">
      <div className="bgv-modal">

        {/* ── Header ── */}
        <div className="bgv-modal-header">
          <div className="bgv-modal-header-left">
            <div className="bgv-badge">BGV</div>
            <div className="bgv-header-info">
              <h2>Background Verification</h2>
              <p>Req: {bgv.req_code}</p>
            </div>
          </div>

          <div className="bgv-modal-header-right">
            <div className="bgv-candidate-pill">
              <div className="bgv-avatar">{bgv.candidate_name[0].toUpperCase()}</div>
              <div>
                <div className="bgv-cand-name">{bgv.candidate_name}</div>
                <div className="bgv-cand-meta">{bgv.candidate_email}</div>
              </div>
            </div>
            <span className="bgv-status-badge">{getBgvStatus(bgv.status)}</span>
            <button className="bgv-close-btn" onClick={onClose} title="Close">✕</button>
          </div>
        </div>

        {/* ── Body: sidebar + content ── */}
        <div className="bgv-modal-body">

          {/* Sidebar tabs */}
          <div className="bgv-sidebar">
            {/* <div className="bgv-sidebar-label">Checks</div> */}
             {/* <div className="bgv-personal-info"> */}
              <PersonalDetails bgv={bgv} />
            {/* </div>   */}
            {/* {sortedProducts.map((p) => (
              <button
                key={p.productId}
                className={`bgv-tab-btn${activeTab === p.productId ? " active" : ""}`}
                onClick={() => setActiveTab(p.productId)}
              >
                <div className="bgv-tab-row">
                  <span className="bgv-tab-icon">{ICONS[p.Product.title] || "📋"}</span>
                  <span className="bgv-tab-label">{p.Product.title}</span>
                </div>
                <span className={chipClass(p.status)}>{p.status}</span>
              </button>
            ))} */}
          </div>
         

          {/* Content area */}
          {activeProduct && (
            <div className="bgv-content">
              <div className="bgv-panel-title">
                <span>{ICONS[activeProduct.Product.title] || "📋"}</span>
                {activeProduct.Product.title}
              </div>

              {/* Product-specific submitted + verify form */}
              <ProductFormSection
                product={activeProduct}
                bgv={bgv}
                vd={vd}
                onVerify={handleVerify}
                onEmpVerify={handleEmpVerify}
              />

              {/* Admin / meta fields */}
              <div className="bgv-meta-card">
                <div className="bgv-meta-card-title">⚙️ Verification Meta</div>
                <div className="bgv-meta-grid">

                  <div className="bgv-field">
                    <label>Status</label>
                    <select name="status" value={pForm.status || ""} onChange={handleTopLevel}>
                      <option value="">— Select Status —</option>
                      {STATUS_OPTIONS.map((s) => {
                        let t=s;
                        if(s === "IN PROGRESS"){
                          t = "IN_PROGRESS";
                        }
                        if(s === "ON HOLD"){
                          t = "ON_HOLD";
                        }

                        return <option key={s} value={t}>{s}</option>;
                      })}
                    </select>
                  </div>
                  <div className="bgv-field">
                    <label>Final Discrepancy</label>
                    <select name="final_discrepancy" value={pForm.final_discrepancy || ""} onChange={handleTopLevel}>
                      <option value="">— Select Discrepancy —</option>
                      {DISCREPANCY_OPTIONS.map((d) => {
                        let v=d;
                        if(d === "Clear Discrepancy"){
                          v = "CLEAR";
                        }
                        if(d === "Minor Discrepancy"){
                          console.log("Minor discrepancy selected");
                          v = "MINOR";
                        }
                        if(d === "Discrepancy"){
                          v = "DISCREPANCY";
                        }
                        return <option key={d} value={v}>{d}</option>;
                      })}
                    </select>
                  </div>
                  <div className="bgv-field">
                    <label>Mode of Verification</label>
                    <select name="mode_of_verification" value={pForm.mode_of_verification || ""} onChange={handleTopLevel}>
                      <option value="">— Select Mode —</option>
                      {MODE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div className="bgv-field full">
                    <label>Verifier Comment</label>
                    <textarea name="verifier_comment" value={pForm.verifier_comment || ""} onChange={handleTopLevel} placeholder="Enter verifier comment..." />
                  </div>

                  <div className="bgv-field full">
                    <label>Final Description</label>
                    <textarea name="final_desc" value={pForm.final_desc || ""} onChange={handleTopLevel} placeholder="Enter final description..." />
                  </div>

                  <div className="bgv-field full">
                    <label>Remark</label>
                    <input type="text" name="remark" value={pForm.remark || ""} onChange={handleTopLevel} placeholder="Enter remark..." />
                  </div>

                  <div className="bgv-field">
                    {/* <ExistingFile path={activeProduct.doc_1} label={"Document 1"} /> */}
                    <label>Document 1</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange("doc_1", e.target.files[0])} />
                    {activeProduct.doc_1 && (
                      <span className="bgv-existing-file">Existing: {activeProduct.doc_1.split("/").pop()}</span>
                    )}
                  </div>

                  <div className="bgv-field">
                    {/* <ExistingFile path={activeProduct.doc_2} label={"Document 2"} /> */}
                    <label>Document 2</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange("doc_2", e.target.files[0])} />
                    {activeProduct.doc_2 && (
                      <span className="bgv-existing-file">Existing: {activeProduct.doc_2.split("/").pop()}</span>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="bgv-modal-footer">
          {submitted && <span className="bgv-success-msg">✓ Submitted successfully!</span>}
          <button className="bgv-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="bgv-submit-btn" onClick={handleSubmit}>Submit Verification</button>
        </div>

      </div>
    </div>
  );
}
