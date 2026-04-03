import React, { useState } from "react";
import "./contactUs.css";
import axiosInstance from "../api/axiosInstance";

const ContactUs = () => {
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
        <div className="cu-container">

            {/* HERO SECTION */}
            <section className="cu-hero">
                <div className="cu-hero-overlay"></div>

                <div className="cu-hero-content">

                    <div className="cu-hero-left">
                        <p className="cu-breadcrumb">
                            <span onClick={() => navigate('/')} >Home</span> <span>|</span> <span className="active">Contact</span>
                        </p>

                        <h1 className="cu-hero-title">
                            Contact Us
                        </h1>
                    </div>

                </div>
            </section>
            {/* MAP + FORM */}
            <div className="cu-contact-wrapper">

                {/* MAP */}
                <div className="cu-map">
                    <iframe
                        title="map"
                        src="https://maps.google.com/maps?q=Satya%20Nagar%20Bhubaneswar&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        className="cu-map-frame"
                    />
                </div>

                {/* FORM */}
                <div className="cu-form-section">
                    <p className="cu-small-title">REQUEST A CALL BACK</p>
                    <h2 className="cu-form-heading">Contact About Your Queries.</h2>

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

            {/* CONTACT INFO CARDS */}
            <div className="cu-info-section">

                <div className="cu-card">
                    <div className="cu-icon">📞</div>
                    <h3>Talk To US</h3>
                    <a href="tel:+917077669661" className="cu-link">
                        +91 7077669661
                    </a>
                </div>

                <div className="cu-card">
                    <div className="cu-icon">✉️</div>
                    <h3>Reach Out To Us</h3>
                    <a href="mailto:contactus@mysdom.com" className="cu-link">
                        contactus@mysdom.com
                    </a>
                </div>

                <div className="cu-card">
                    <div className="cu-icon">📍</div>
                    <h3>Office Location</h3>
                    <p>
                        Plot No.89, State Bank Of India Complex,
                        Satya Nagar, Bhubaneswar - 751007
                    </p>
                </div>

            </div>

        </div>
    );
};

export default ContactUs;