import React from "react";
import "./uploadCandidate.css";

const UploadCandidate = () => {
  return (
    <section className="upload-section">
      <div className="upload-container">
        {/* Top Heading */}
        <div className="upload-header">
          <span className="tag">FOR CLIENTS</span>
          <h2>Upload Candidate List for Background Verification</h2>
          <p>
            Seamlessly upload your candidate data in bulk. Support for batch
            uploading multiple files at once.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="upload-grid">
          {/* LEFT CARD */}
          <div className="upload-card">
            <h3>Batch Upload Candidate Data</h3>

            <div className="drop-area">
              <div className="upload-icon">⬆</div>
              <h4>Drag and drop files here</h4>
              <p>or click to browse and select multiple files</p>

              <button className="btn-green">Select Files</button>

              <small>
                Supported formats: Excel (.xlsx, .xls), CSV (.csv), PDF (.pdf)
              </small>
              <div className="multi-note">
                ✓ Multiple files can be uploaded at once
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="instructions-card">
            <h3>Upload Instructions</h3>

            <div className="step">
              <div className="step-number">1</div>
              <div>
                <h4>Prepare Your Files</h4>
                <p>
                  Download our template and fill in candidate details. You can
                  prepare multiple files for different departments or batches.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div>
                <h4>Batch Upload</h4>
                <p>
                  Select multiple files at once or drag and drop them together.
                  All files will be validated automatically.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div>
                <h4>Process Batch</h4>
                <p>
                  Review your uploaded files and process all verifications in
                  one go. Track individual file progress.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div>
                <h4>Receive Reports</h4>
                <p>
                  Get comprehensive verification reports for each batch
                  delivered within 3-5 business days.
                </p>
              </div>
            </div>

            <button className="btn-outline">
              ⬇ Download Template
            </button>

            <div className="important-note">
              <strong>Important Note</strong>
              <p>
                Ensure all candidate data is accurate and complete. Maximum 10
                files per batch upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadCandidate;