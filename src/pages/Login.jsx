import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./auth.css";
import toast from "react-hot-toast";
import axios from "axios"
import axiosInstance from "../api/axiosInstance";
const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {email,password}=form
        // console.log(email,password)
        try {
            // 🔥 API CALL HERE
            const response = await axiosInstance.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );
            console.log(response?.data?.data?.token)
            // ✅ Save token
            let user = {
                email:response?.data?.data?.email,
                username:response?.data?.data?.username,
                role:response?.data?.data?.role,
            }
            localStorage.setItem("token", response?.data?.data?.token);
            localStorage.setItem("user", JSON.stringify(user));

            toast.success("Login Successful 🎉");

            // redirect if needed
            navigate("/");

        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                {/* LEFT PANEL */}
                <div className="auth-left">
                    <h1>Welcome Back 👋</h1>
                    <p>
                        Access real-time background verification insights, manage client
                        reports, and streamline your hiring process securely.
                    </p>
                </div>

                {/* RIGHT PANEL */}
                <div className="auth-right">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h2>Login</h2>

                        <input
                            type="email"
                            placeholder="Email Address"
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />

                        <button type="submit">Login</button>

                        <p className="switch-text">
                            Don’t have an account? <Link to="/signup">Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;