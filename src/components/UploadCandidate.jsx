import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./uploadCandidate.css";
import axiosInstance from "../api/axiosInstance";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/pdf",
];

const UploadCandidate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ Validate file
  const validateFile = (file) => {
    let errorList = [];

    if (!file) {
      errorList.push("No file selected.");
      return { validFile: null, errorList };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      errorList.push(`${file.name} is not a supported format.`);
    }

    if (file.size > MAX_FILE_SIZE) {
      errorList.push(`${file.name} exceeds 5MB size limit.`);
    }

    return {
      validFile: errorList.length === 0 ? file : null,
      errorList,
    };
  };

  // ✅ Handle file selection
  const handleFiles = (selectedFiles) => {
    if (selectedFiles.length > 1) {
      setErrors(["Only one file can be uploaded at a time."]);
      setFile(null);
      return;
    }

    const selectedFile = selectedFiles[0];
    const { validFile, errorList } = validateFile(selectedFile);

    setFile(validFile);
    setErrors(errorList);
    setSuccessMsg("");
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const removeFile = () => {
    setFile(null);
    setErrors([]);
    setSuccessMsg("");
    setUploadProgress(0);
  };

  const [product, setProduct] = useState(null);
  const [batchUploadError, setBatchUploadError] = useState(null);
  async function fetchBatchUploadService() {
    try {

      let response = await axiosInstance.get(`/product/getby-title/${'Address verification'}`);
      let productId = response?.data?.data.id;
      // console.log("response:--",productId);
      if(!productId){
        setErrors([
          "This service is unavailable"
        ])
      }else{
        setProduct(response?.data?.data.id);
      }
    }
    catch (error) {
      if (error?.response?.data?.message === "Product not found") {
        setBatchUploadError(
          "This service is unavailable"
        )
        setErrors([
          "This service is unavailable"
        ])
        // Server responded with error (4xx / 5xx)
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
        console.log("Headers:", error.response.headers);
      } else if (error.request) {
        // Request was made but no response
        console.log("No response received:", error.request);
      } else {
        // Something else happened
        console.log("Error message:", error.message);
      }
      console.log("Error config:", error.config);
    }

  }
  useEffect(() => {
    fetchBatchUploadService();
  }, []);
  // ✅ Upload to backend
  const handleUpload = async () => {
    if (!file) {
      setErrors(["Please select a file first"]);
      return;
    }

    const formData = new FormData();
    formData.append("batch_upload", file);
    formData.append('product_id', product);


    try {
      setUploading(true);
      setUploadProgress(0);
      setErrors([]);
      setSuccessMsg("");

      const res = await axiosInstance.post(
        "/bgvrequest/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      setSuccessMsg(res.data.message || "Upload successful");
      setFile(null);
    } catch (err) {
      setErrors([
        err.response?.data?.message || "Upload failed. Try again.",
      ]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="upload-section">
      <div className="upload-container">
        <button className="back-button" onClick={()=>navigate('/bgv/list')}><ArrowLeft size={15}/>Back to list</button>
        <div className="upload-header">
          <span className="tag">FOR CLIENTS</span>
          <h2>Upload Candidate List for Background Verification</h2>
          <p>
            Upload your candidate data file. Only one file allowed per upload.
          </p>
        </div>

        <div className="upload-grid">
          {/* LEFT CARD */}
          <div className="upload-card">
            <h3>Upload Candidate Data</h3>


            {!batchUploadError &&
              <div>
                <div
                  className="drop-area"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={openFileDialog}
                >
                  <div className="upload-icon">⬆</div>
                  <h4>Drag and drop file here</h4>
                  <p>or click to browse file</p>

                  <button
                    type="button"
                    className="btn-green"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFileDialog();
                    }}
                  >
                    Select File
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleInputChange}
                  />

                  <small>
                    Supported: Excel (.xlsx, .xls), CSV (.csv)
                  </small>
                  <div className="multi-note">✓ Max size: 5MB</div>
                </div>

                {/* FILE DISPLAY */}
                {file && (
                  <div className="file-list">
                    <h4>Selected File:</h4>
                    <ul>
                      <li>
                        {file.name} (
                        {(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    </ul>
    
                    <button className="btn-remove" onClick={removeFile}>
                      Remove File
                    </button>
    
                    <button
                      className="btn-green"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload File"}
                    </button>
                  </div>
                )}
    
                {/* PROGRESS BAR */}
                {uploading && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
    
                {/* SUCCESS */}
                {successMsg && (
                  <p style={{ color: "green" }}>{successMsg}</p>
                )}
              </div>
            }

            {/* ERRORS */}
            {errors.length > 0 && (
              <div className="error-list">
                <h4>Errors:</h4>
                <ul>
                  {errors.map((err, index) => (
                    <li key={index} style={{ color: "red" }}>
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT CARD */}
          <div className="instructions-card">
            <h3>Upload Instructions</h3>

            {[1, 2, 3, 4,5].map((step) => (
              <div className="step" key={step}>
                <div className="step-number">{step}</div>
                <div>
                  <h4>
                    {
                      [
                        "Prepare Your File",
                        "Max Limit",
                        "Upload File",
                        "Process",
                        "Receive Report",
                      ][step - 1]
                    }
                  </h4>
                  <p>
                    {
                      [
                        "Download template & fill candidate details.",
                        "Upload a maximum of 500 records at a time",
                        "Upload your file.",
                        "Process verification.",
                        "Receive report within few secconds.",
                      ][step - 1]
                    }
                  </p>
                </div>
              </div>
            ))}

            {/* DOWNLOAD TEMPLATE */}
            <a
              href="/templates/candidate_template.xlsx"
              download="Candidate_Template.xlsx"
              className="btn-outline"
            >
              ⬇ Download Template
            </a>

            <div className="important-note">
              <strong>Important Note</strong>
              <p>
                Ensure all candidate data is accurate. Max 500 records allowed
                per upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadCandidate;