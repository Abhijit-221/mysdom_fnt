import React, { useState, useEffect } from "react";
import "./ClientViewEditModal.css";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

const ClientViewEditModal = ({ clientData, onClose, onUpdate}) => {
  const [editMode, setEditMode] = useState(false);
  const [client, setClient] = useState({});

  useEffect(() => {
    setClient(clientData);
  }, [clientData]);

  const handleChange = (e) => {
    setClient({
      ...client,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    // if (!client.name || !client.phone) {
    //   alert("Please fill required fields");
    //   return;
    // }
    try{
        let response = await axiosInstance.put(`/client/update`, client);
        console.log("Response:", response.data);
        toast.success(response.data.message || "Client updated successfully");
        setEditMode(false);
        onUpdate(); // Refresh client list in parent component
        onClose();
    
    }
    catch(err){
      console.error("Failed to update client:", err);
      toast.error(err.response?.data?.message || "Failed to update client");
      return;
    }
    
  };

  return (
    <div className="modal-overlay">
      <div className="client-modal">

        <div className="modal-header">
          <h2>{editMode ? "Edit Client" : "Client Details"}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">

          <div className="form-group">
            <label>Client Name <span className="required">*</span></label>
            <input
              type="text"
              name="companyName"
              value={client.companyName || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="contactEmail"
              value={client.contactEmail || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="form-group">
            <label>Phone <span className="required">*</span></label>
            <input
              type="text"
              name="contactPhone"
              value={client.contactPhone || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={client.address || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>SLA<span className="required">*</span></label>
            <input
                type="number"
                name="slaDays"
                value={client.slaDays}
                onChange={handleChange}
                disabled={!editMode}
            />
        </div>

        </div>

        <div className="modal-actions">
          {!editMode ? (
            <button
              className="edit-btn"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          ) : (
            <button
              className="submit-btn"
              onClick={handleSave}
            >
              Save
            </button>
          )}

          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ClientViewEditModal;