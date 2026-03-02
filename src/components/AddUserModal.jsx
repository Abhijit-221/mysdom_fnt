import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./AddUserModal.css";
import axiosInstance from "../api/axiosInstance";

function AddUserModal({ close, refresh }) {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "user",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    let token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "/auth/user-add";
        // console.log("url:", url);
        // console.log('token:', token);
        // console.log('form:', form);
        try {
            let user = await axiosInstance.post(url,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            console.log(user)
            toast.success("User Created Successfully");
            refresh();
            close();

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
        <div className="adduser-overlay">
            <div className="adduser-modal">

                <div className="adduser-header">
                    <h3>Add New User</h3>
                </div>

                <form className="adduser-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />

                    <select name="role" onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        {/* <option value="superadmin">Super Admin</option> */}
                    </select>

                    <div className="adduser-buttons">
                        <button
                            type="button"
                            className="adduser-btn adduser-btn-outline"
                            onClick={close}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="adduser-btn adduser-btn-primary"
                        >
                            Create
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default AddUserModal;