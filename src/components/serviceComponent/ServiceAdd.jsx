import React, { useState, useContext, useEffect, use } from "react";
import { Edit3, Save, X } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import "./serviceDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";


export default function ServiceAdd() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name:"",
    description:""
  });
  const navigate = useNavigate();

  const canAdd = ["admin", "superadmin"].includes(
    user?.role?.toLowerCase()?.trim()
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSave = async() =>{
        console.log("updatedData:",formData);
        try {
            if(!formData.name || !formData.description){
                toast.error("Please fill all required fields");
                return;
            }
            const res = await axiosInstance.post(
                `/service/add`,
                formData
            );
            const serviceData = res?.data?.data || {};
            // delete serviceData.isActive;
            setFormData(serviceData);
            toast.success("Service saved");
            // navigate("/services");

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

  return (
    <div className="service-details-wrapper">
      <div className="service-details-card">

        <div className="service-details-header">
          <h2>Service Details</h2>

          {canAdd && (
            // <button
            //   className="edit-btn"
            //   onClick={() => setIsEditing(true)}
            // >
            //   <Edit3 size={16} />
            //   Edit
            // </button>
            <button
                className="back-btn"
                onClick={() => navigate("/services")}
              >
                <X size={16} />
                Back
              </button>
          )}
        </div>
          <div className="service-details-content">
            <div className="detail-item">
              <label>Title<span style={{color:"red"}}>*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="detail-item">
              <label>Description<span style={{color:"red"}}>*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="edit-actions">
              <button className="saved-btn" onClick={handleSave}>
                <Save size={16} />
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() => {setFormData({
                    name:"",
                    description:""
                });}}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}