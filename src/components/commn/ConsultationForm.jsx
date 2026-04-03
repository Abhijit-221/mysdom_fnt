import React, { useState } from "react";
import axios from "axios";
import "./consultationForm.css";
import axiosInstance from "../../api/axiosInstance";


const ContactSection = () => {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState("");
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullName, email, subject, message } = form;

        if (!fullName || !email || !subject || !message) {
            setErrorMsg("Please fill in all fields.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        try {
            const response = await axiosInstance.post("/mail/send", { fullName, email, subject, message });
            const data = response.data;

            if (data.success === true) {
                setStatus("success");
                setForm({ fullName: "", email: "", subject: "", message: "" });
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setErrorMsg(data.error || "Something went wrong. Please try again.");
                setStatus("error");
            }
        } catch (err) {
            console.log("Error sending contact form:", err);
            setErrorMsg("Unable to reach the server. Please try again later.");
            setStatus("error");
        }
    };

    return (
        <section className="contact-section">
            <div className="contact-container">

                {/* LEFT FORM */}
                <div className="contact-form">
                    <p className="tag">GET IN TOUCH</p>
                    <h2>Free Consultation</h2>

                    <div className="cu-form-section">
                        {/* ── Success Banner ── */}
                        {status === "success" && (
                            <div className="cu-alert cu-alert-success">
                                ✅ Message sent successfully! We'll get back to you soon.
                            </div>
                        )}
                        {/* ── Error Banner ── */}
                        {status === "error" && (
                            <div className="cu-alert cu-alert-error">
                                ❌ {errorMsg}
                            </div>
                        )}

                        <form className="cu-form" onSubmit={handleSubmit} noValidate>
                            <div className="cu-input-row">
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    disabled={status === "loading"}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled={status === "loading"}
                                    required
                                />
                            </div>

                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={form.subject}
                                onChange={handleChange}
                                disabled={status === "loading"}
                                required
                            />

                            <textarea
                                name="message"
                                placeholder="Message"
                                rows="5"
                                value={form.message}
                                onChange={handleChange}
                                disabled={status === "loading"}
                                required
                            ></textarea>

                            <button
                                type="submit"
                                className="cu-submit-btn"
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? "SENDING..." : "SUBMIT MESSAGE »"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="contact-content">
                    <h1>
                        Unlock Your Small Business Potential With Tailored Consulting
                        Services.
                    </h1>
                </div>

            </div>
            {/* BOTTOM INFO */}
            <div className="contact-footer">
                <div className="contact-info">
                    <div className="info-box">
                        <div className="icon call-icon">
                            📞
                        </div>
                        <div>
                            <p>Talk To Us</p>
                            <h4>+91 7077669661</h4>
                        </div>
                    </div>

                    <div className="info-box">
                        <div className="icon mail-icon">
                            ✉️
                        </div>
                        <div>
                            <p>Reach Out To Us</p>
                            <h4>contactus@mysdom.com</h4>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
};

export default ContactSection;