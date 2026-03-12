import React, { useState } from "react";
import "./addClient.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const AddClient = () => {
    const [client, setClient] = useState({
        companyName: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
        slaDays: ""
    });
    const navigate = useNavigate();
    const handleChange = (e) => {

        setClient({
            ...client,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            if (!client.companyName || !client.contactEmail || !client.contactPhone || !client.address || !client.slaDays) {
                toast.error("Please fill all required fields");
                return;
            }
            console.log('client details:',client);
            const response =  await axiosInstance.post("/client/add", client);
            toast.success(response.data.message || "Client added successfully");
            onCancel(); // Close the form after successful submission
            navigate('/clients'); // Redirect to client list page
        }
        catch(err){
            toast.error(err.response?.data?.message || "Failed to add client");
        }
        // onSubmit(client);
    };

    const onCancel = () => {
        setClient({
            companyName: "",
            contactEmail: "",
            contactPhone: "",
            address: "",
            slaDays: ""
        });
        navigate('/clients');

    };

    return (
        <div className="add-client-container">
            <h2>Add Client</h2>

            <form className="add-client-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Company Name<span className="required">*</span></label>
                    <input
                        type="text"
                        name="companyName"
                        value={client.companyName}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email<span className="required">*</span></label>
                    <input
                        type="email"
                        name="contactEmail"
                        value={client.contactEmail}
                        onChange={handleChange}
                        placeholder="Enter email"
                    />
                </div>

                <div className="form-group">
                    <label>Phone<span className="required">*</span></label>
                    <input
                        type="text"
                        name="contactPhone"
                        value={client.contactPhone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                    />
                </div>

                <div className="form-group">
                    <label>Address<span className="required">*</span></label>
                    <textarea
                        name="address"
                        value={client.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label>SLA<span className="required">*</span></label>
                    <input
                        type="number"
                        name="slaDays"
                        value={client.slaDays}
                        onChange={handleChange}
                        placeholder="Enter SLA days"
                    />
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>

                    <button type="submit" className="submit-btn">
                        Save Client
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddClient;