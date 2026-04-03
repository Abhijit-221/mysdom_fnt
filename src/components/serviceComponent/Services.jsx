import React, { useContext, useEffect, useState } from 'react'
import Pagination from '../commn/Pagination';
import ServiceGrid from '../ServiceGrid';
import axiosInstance from '../../api/axiosInstance';
import './services.css'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowBigDownIcon, ChevronsRight, ClipboardList, ScreenShare, ShieldCheck, Users } from 'lucide-react';

function Services() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [services, setServices] = useState([]);
    const navigate = useNavigate();
    let user = JSON.parse(localStorage.getItem('user'));
    // let user = JSON.parse(localStorage.getItem('user'));

    const fetchServices = async () => {
        try {
            let res = await axiosInstance.get("/service/ext-list", {
                params: { search, page, limit }
            });
            console.log("User", user);
            if (user) {
                res = await axiosInstance.get("/service/list", {
                    params: { search, page, limit }
                });
            }
            console.log("services res:", res);
            const serviceData = res?.data?.data?.services || [];
            const totalCount = res?.data?.data?.count || 0;

            setServices(serviceData);
            setTotalPages(Math.ceil(totalCount / limit));

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load Services");
        }
    };

    useEffect(() => {
        fetchServices();
    }, [page, search]);


    // service footer details
    const servicefooter = [
        {
            title: "Customized Hiring Solutions",
            desc: "Tailored Approaches To Meet Your Specific Recruitment Needs.",
            logo: <ScreenShare size={30} />
        },
        {
            title: "Thorough Verification Processes",
            desc: "Comprehensive Checks To Ensure Trust And Reliability.",
            logo: <ClipboardList size={30} />
        },
        {
            title: "Informed Decision-Making",
            desc: "Data-Driven Insights For Smarter Hiring And Business Choices.",
            logo: <Users size={30} />
        },
    ];


    // mail config
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        subject: "Consultation",
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
        <div>

            <section className="svc-hero">
                <div className="svc-hero-overlay"></div>

                <div className="svc-hero-content">

                    <div className="svc-hero-left">
                        <p className="svc-breadcrumb">
                            <span onClick={() => navigate('/')} >Home</span> <span>|</span> <span className="active">Our Services</span>
                        </p>

                        <h1 className="svc-hero-title">
                            Explore Our Range Of Services
                        </h1>
                    </div>

                </div>
            </section>
            <section className="svc-section">
                <div className="svc-container">
                    <div className='scv-subhead'>
                        <p className="svc-tag">
                            OUR SOLUTION
                        </p>

                        <h2 className="svc-title">
                            Consulting Services
                        </h2>
                    </div>

                    {/* <p className="svc-subtitle">
                        Our comprehensive offerings are the result of continuous innovation,
                        customer feedback, and expertise in Indian employment screening solutions.
                    </p> */}

                    {/* FILTER */}
                    <div className="svc-filter">

                        <div className="svc-search">
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>

                        {['admin', 'superadmin'].includes(user?.role) && (
                            <button
                                className="svc-add-btn"
                                onClick={() => navigate('/service/add')}
                            >
                                + Add Service
                            </button>
                        )}
                    </div>

                    {/* GRID */}

                    <ServiceGrid services={services} user={user} />

                    {/* PAGINATION */}
                    <div className="svc-pagination">
                        <Pagination
                            page={page}
                            setPage={setPage}
                            totalPages={totalPages}
                        />
                    </div>

                </div>
            </section>


            <div className="quote-contact-form">
                <div className="quote-tag">
                    <p >GET IN TOUCH</p>
                    <h2>Free Consultation</h2>
                </div>

                 <form className="quote-form" onSubmit={handleSubmit} noValidate>
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
                                name="message"
                                placeholder="Subject"
                                value={form.message}
                                onChange={handleChange}
                                disabled={status === "loading"}
                                required
                            />

                            {/* <textarea
                                name="message"
                                placeholder="Message"
                                rows="5"
                                value={form.message}
                                onChange={handleChange}
                                disabled={status === "loading"}
                                required
                            ></textarea> */}

                            <button
                                type="submit"
                                className="cu-submit-btn"
                                disabled={status === "loading"}
                            >
                                {status === "loading" ? "SENDING..." : "SUBMIT MESSAGE »"}
                            </button>
                        </form>
            </div>
            {/* bottom section            */}
            <section className="svc-bottom-section">
                <div className="svc-bottom-container">

                    {/* LEFT CONTENT */}
                    <div className="svc-bottom-left">
                        <span className="svc-bottom-tag">ADVANCE SOLUTIONS</span>

                        <h1>
                            We Assist <br />
                            With <br />
                            Strategic <br />
                            Planning
                        </h1>

                        <p>
                            Tailored Hiring And Verification Strategies For Efficient
                            Processes And Informed Decisions.
                        </p>
                    </div>

                    {/* RIGHT GRID */}
                    <div className="svc-bottom-grid">
                        {servicefooter.map((item, index) => (
                            <div className="svc-bottom-card" key={index}>

                                <div className="svc-bottom-icon">
                                    {item.logo}
                                </div>

                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>

                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </div>
    )
}

export default Services;