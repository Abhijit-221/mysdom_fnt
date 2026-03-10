import React, { useState, useContext, useEffect } from "react";
import { Edit3, Save, X } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import "./serviceDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

export default function ServiceDetails({ service }) {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get(
        `/service/${id}`,
      );

      const serviceData = res?.data?.data || {};
      if (serviceData && serviceData.isActive) {
        serviceData.status = 'active'
      } else {
        serviceData.status = 'inactive'
      }
      // delete serviceData.isActive;
      setFormData(serviceData);

    } catch (err) {
      if (err.response) {
        // Server responded with error (4xx, 5xx)
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);

        toast.error(err.response.data.message || "Server Error");
      }
      else if (err.request) {
        // Request was sent but no response received
        console.log("No response received:", err.request);
        toast.error("No response from server");
      }
      else {
        // Something else happened
        console.log("Error:", err.message);
        toast.error(err.message);
      }
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);

  const canEdit = ["admin", "superadmin"].includes(
    user?.role?.toLowerCase()?.trim()
  );

  const handleChange = (e) => {
    let status = {};
    if (e.target.name === 'status') {
      status.isActive = e.target.value === "active" ? true : false
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      ...status
    });
  };

  const handleSave = async () => {
    let updatedData = {
      id: formData.id,
      ...(formData.name && { name: formData.name }),
      ...(formData.description && { description: formData.description }),
      ...(typeof formData.isActive !== 'undefined' && { isActive: formData.isActive })
    };
    console.log("updatedData:", updatedData);
    try {
      const res = await axiosInstance.put(
        `/service/update`,
        updatedData
      );

      const serviceData = res?.data?.data || {};
      if (serviceData && serviceData.isActive) {
        serviceData.status = 'active'
      } else {
        serviceData.status = 'inactive'
      }
      // delete serviceData.isActive;
      setFormData(serviceData);
      toast.success("Service saved");

    } catch (err) {
      if (err.response) {
        // Server responded with error (4xx, 5xx)
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);

        toast.error(err.response.data.message || "Server Error");
      }
      else if (err.request) {
        // Request was sent but no response received
        console.log("No response received:", err.request);
        toast.error("No response from server");
      }
      else {
        // Something else happened
        console.log("Error:", err.message);
        toast.error(err.message);
      }
    }
  };
  console.log(canEdit,isEditing);
  return (
    <div className="service-details-wrapper">
      <div className="service-details-card">

        <div className="service-details-header">
          <h2>Service Details</h2>

          {/* {canEdit && !isEditing && (
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={16} />
              Edit
            </button> */}
            <button
              className="back-btn"
              onClick={() => navigate("/services")}
            >
              <X size={16} />
              Back
            </button>
          {/* )} */}
        </div>

        {/* VIEW MODE */}
        {!isEditing ? (
          <div className="service-details-content">
            <div className="detail-item">
              <label>Title</label>
              <p>{formData.name}</p>
            </div>

            <div className="detail-item">
              <label>Description</label>
              <p>{formData.description}</p>
            </div>

            <div className="detail-item">
              <label>Status</label>
              <span
                className={`status-badge ${formData.status === "active" ? "active" : "inactive"
                  }`}
              >
                {formData.status}
              </span>
            </div>
            <div className="back-action">
              {/* <button
                className="back-btn"
                onClick={() => navigate("/services")}
              >
                <X size={16} />
                Back
              </button> */}
              {canEdit && <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={16} />
                Edit
              </button>}
            </div>
          </div>
        ) : (
          /* EDIT MODE */
          <div className="service-details-content">
            <div className="detail-item">
              <label>Title</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="detail-item">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="detail-item">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="edit-actions">
              <button className="saved-btn" onClick={handleSave}>
                <Save size={16} />
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}