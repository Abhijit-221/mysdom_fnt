import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./bgvViewEditForm.css";
import "./BGVViewForm.css";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return value;
};

const formatDate = (value) => {
  if (!value) return "Not provided";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fileNameFromPath = (value) => {
  if (!value || typeof value !== "string") return "";
  return value.split(/[\\/]/).pop();
};

const readProductName = (entry) =>
  entry?.product?.name ||
  entry?.products?.name ||
  entry?.services?.name ||
  entry?.service?.name ||
  entry?.name ||
  "Unnamed product";

const ReviewRow = ({ k, v }) => (
  <div className="bgv-review-row">
    {/* <span className="bgv-review-key">{k}</span> */}
    <span>{v || <em className="bgv-review-empty">Not provided</em>}</span>
  </div>
);

const FileOrLink = ({ value, base, label }) => {
  if (!value || typeof value !== "string") return null;

  return (
    <a
      href={`${base}/${value.replace(/\\/g, "/")}`}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="bgv-file-link"
    >
      {label}: {fileNameFromPath(value)}
    </a>
  );
};

function BGVViewForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data;
  const baseUrl = import.meta.env.VITE_BASE_URL;

  if (!data) {
    return (
      <div className="bgv-root bgv-view-only-root">
        <div className="bgv-card bgv-view-only-card">
          <div className="bgv-header">
            <div className="bgv-header-icon">BG</div>
            <div>
              <h2>BGV Request</h2>
              <p>View candidate background verification details</p>
            </div>
          </div>

          <div className="bgv-review-card">
            <p className="bgv-review-title">Request Not Found</p>
            <p className="bgv-view-empty-note">
              No request data was passed to this page.
            </p>
          </div>

          <div className="bgv-btn-group">
            <button
              className="bgv-btn bgv-btn-back"
              onClick={() => navigate("/bgv/list")}
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  const employments = Array.isArray(data.employments) ? data.employments : [];
  const products = Array.isArray(data?.BGVRequestProducts) ? data.BGVRequestProducts : [];
//   console.log('products:',products);
  return (
    <div className="bgv-root bgv-view-only-root">
      <div className="bgv-card bgv-view-only-card">
        <div className="bgv-header">
          <div className="bgv-header-icon">BG</div>
          <div>
            <h2>BGV Request</h2>
            <p>View candidate background verification details</p>
          </div>
          <div className="bgv-view-status-wrap">
            <span className="bgv-view-pill">{formatValue(data.status)}</span>
            <span className="bgv-view-code">{formatValue(data.req_code)}</span>
          </div>
        </div>

        <h3 className="bgv-section-title">
          <span className="bgv-section-badge" /> Request Summary
        </h3>

        <div className="bgv-review-layout">
          <div className="bgv-review-card">
            <p className="bgv-review-title">Personal Details</p>
            <ReviewRow k="Candidate Name" v={data.candidate_name} />
            <ReviewRow k="Email" v={data.candidate_email} />
            <ReviewRow k="Phone" v={data.candidate_phone} />
            <ReviewRow k="Designation" v={data.designation} />
            <ReviewRow k="Department" v={data.department} />
            <ReviewRow k="Submitted On" v={formatDate(data.createdAt)} />
          </div>

          <div className="bgv-review-card">
            <p className="bgv-review-title">Product Details</p>
            {products.length > 0 ? (
              <div className="bgv-view-table-wrap">
                <table className="bgv-view-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Status</th>
                      {/* <th>Remark</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id || product.serviceId || index}>
                        <td>{index + 1}</td>
                        <td>{product?.Product?.title || readProductName(product)}</td>
                        <td>{product.status || product.service_status || "Pending"}</td>
                        {/* <td>{product.remark || product.comments || "Not provided"}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <em className="bgv-review-empty">No product details available</em>
            )}
          </div>

          <div className="bgv-review-card">
            <p className="bgv-review-title">Identity Check</p>
            <ReviewRow k="ID Type" v={data.id_type} />
            <ReviewRow k="ID Number" v={data.id_number} />
            <FileOrLink value={data.id_doc} base={baseUrl} label="ID Document" />
          </div>

          <div className="bgv-review-card">
            <p className="bgv-review-title">Address Details</p>
            <ReviewRow k="Current Address" v={data.current_address} />
            <ReviewRow k="Current Landmark" v={data.current_landmark} />
            <ReviewRow k="Current Residency" v={data.current_residency} />
            <ReviewRow k="Current Duration" v={data.current_duration} />
            <ReviewRow k="Permanent Address" v={data.permanent_address} />
            <ReviewRow k="Permanent Landmark" v={data.permanent_landmark} />
            <ReviewRow k="Permanent Residency" v={data.permanent_residency} />
            <ReviewRow k="Permanent Duration" v={data.permanent_duration} />
          </div>

          <div className="bgv-review-card">
            <p className="bgv-review-title">Criminal Check</p>
            <ReviewRow k="Father's Name" v={data.father_name} />
            <ReviewRow k="Mother's Name" v={data.mother_name} />
            <ReviewRow k="Gender" v={data.gender} />
            <ReviewRow k="Date of Birth" v={formatDate(data.dob)} />
          </div>

          <div className="bgv-review-card">
            <p className="bgv-review-title">Education</p>
            <ReviewRow k="Institute Name" v={data.institute_name} />
            <ReviewRow k="University" v={data.university} />
            <ReviewRow k="Qualification" v={data.qualification} />
            <ReviewRow k="Specialization" v={data.specialization} />
            <FileOrLink
              value={data.edu_doc}
              base={baseUrl}
              label="Education Document"
            />
          </div>
        </div>

        <div className="bgv-review-card bgv-view-employment-section">
          <p className="bgv-review-title">Employment History</p>
          {employments.length > 0 ? (
            employments.map((emp, index) => (
              <div key={emp.id || index}>
                {index > 0 && <hr className="bgv-review-divider" />}
                <ReviewRow k="Company" v={emp.company_name} />
                <ReviewRow k="Employee ID" v={emp.employee_id} />
                <ReviewRow k="Job Title" v={emp.job_title} />
                <ReviewRow k="Start Date" v={formatDate(emp.employment_start)} />
                <ReviewRow
                  k="End Date"
                  v={emp.isCurrent ? "Currently Working" : formatDate(emp.employment_end)}
                />
                <ReviewRow k="Reason for Leaving" v={emp.leaving_reason} />
                <FileOrLink
                  value={emp.job_doc}
                  base={baseUrl}
                  label="Experience Document"
                />
              </div>
            ))
          ) : (
            <em className="bgv-review-empty">No employment history added</em>
          )}
        </div>

        <div className="bgv-btn-group">
          <button
            className="bgv-btn bgv-btn-back"
            onClick={() => navigate("/bgv/list")}
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}

export default BGVViewForm;
