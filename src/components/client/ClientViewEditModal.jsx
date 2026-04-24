import React, { useEffect, useState } from "react";
import "./ClientViewEditModal.css";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

const ClientViewEditModal = ({ clientData, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [client, setClient] = useState({});

  useEffect(() => {
    setClient(clientData);
  }, [clientData]);

  const handleChange = (e) => {
    setClient((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeStatus = (e) => {
    const { name, value } = e.target;

    setClient((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put(`/client/update`, client);
      toast.success(response.data.message || "Client updated successfully");
      setEditMode(false);
      onUpdate();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update client");
    }
  };

  const statusLabel = client.isActive ? "Active Client" : "Inactive Client";

  return (
    <div className="modal-overlay">
      <div className="client-modal">
        <div className="modal-header">
          <div className="modal-header-copy">
            <span className={`client-status-pill ${client.isActive ? "active" : "inactive"}`}>
              {statusLabel}
            </span>
            <h2>{editMode ? "Edit Client Profile" : "Client Profile"}</h2>
            <p>
              Review and manage company profile details, operational status, and
              service-level settings from one place.
            </p>
          </div>

          <button
            className="close-btn modal-icon-btn"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            X
          </button>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <div className="modal-section-header">
              <h3>Company Details</h3>
              <span>Primary organization information</span>
            </div>

            <div className="modal-form-grid">
              <div className="form-group">
                <label>
                  Client Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={client.companyName || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Enter company name"
                />
              </div>

              <div className="form-group">
                <label>Client Code</label>
                <input
                  type="text"
                  name="clientCode"
                  value={client.clientCode || ""}
                  disabled
                  placeholder="Client code"
                />
              </div>

              <div className="form-group form-group-full">
                <label>Address</label>
                <textarea
                  name="address"
                  value={client.address || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Add full company address"
                />
              </div>
            </div>
          </section>

          <section className="modal-section">
            <div className="modal-section-header">
              <h3>Contact & Operations</h3>
              <span>Communication and service configuration</span>
            </div>

            <div className="modal-form-grid">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={client.contactEmail || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="contact@company.com"
                />
              </div>

              <div className="form-group">
                <label>
                  Phone <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={client.contactPhone || ""}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Enter contact number"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="isActive"
                  value={client.isActive === true ? "true" : "false"}
                  onChange={handleChangeStatus}
                  disabled={!editMode}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  SLA <span className="required">*</span>
                </label>
                <div className="input-with-tag">
                  <input
                    type="number"
                    name="slaDays"
                    value={client.slaDays || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder="0"
                  />
                  <span className="field-tag">Days</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose} type="button">
            Close
          </button>

          {!editMode ? (
            <button
              className="primary-btn edit-btn"
              onClick={() => setEditMode(true)}
              type="button"
            >
              Edit Client
            </button>
          ) : (
            <button
              className="primary-btn submit-btn"
              onClick={handleSave}
              type="button"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientViewEditModal;
