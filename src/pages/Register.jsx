import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./auth.css";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
    navigate("/login");
  };

  return (
    <div className="auth-wrapper">
        <div className="auth-container">

            {/* LEFT PANEL */}
            <div className="auth-left">
                <h1>Create Your Account 🚀</h1>
                <p>
                Join India's most trusted background verification platform and
                empower smarter hiring decisions today.
                </p>
            </div>

            {/* RIGHT PANEL */}
            <div className="auth-right">
                <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Register</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                    }
                />

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

                <button type="submit">Create Account</button>

                <p className="switch-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Register;