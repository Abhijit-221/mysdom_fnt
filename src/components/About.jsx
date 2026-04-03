import React from "react";
import "./about.css";
import { useNavigate } from "react-router-dom";

const About = () => {
    const navigate = useNavigate();
    return (
        <div className="about-page">

                    {/* <p className="breadcrumb" onClick={()=>(navigate('/'))}>Home |</p>
                    <h1>About Mysdom</h1> */}
                {/* </div> */}
            {/* HERO SECTION */}
            <section className="about-hero">
                <div className="about-hero-overlay"></div>

                <div className="about-hero-content">

                    <div className="about-hero-left">
                        <p className="about-breadcrumb">
                            <span onClick={()=>navigate('/')} >Home</span> <span>|</span> <span className="active">About Us</span>
                        </p>

                        <h1 className="about-hero-title">
                            About Mysdom
                        </h1>
                    </div>

                </div>
            </section>

            {/* ABOUT COMPANY */}
            <section className="about-section light">
                <div className="about-container reverse">
                    <div className="about-image">
                        <img src="/home1.webp" alt="meeting" />
                    </div>

                    <div className="about-text">
                        <span className="section-tag">ABOUT OUR COMPANY</span>
                        <h2>Discover How Our Consulting Drives Business Success.</h2>
                        <p>
                            At Mysdom, we are dedicated to helping businesses grow by providing expert consulting, tailored hiring solutions through background verification. Our priority is ensuring that companies can make secure and informed decisions when it comes to hiring employees, tenants, or partners.
                        </p>
                        
                    </div>
                    
                </div>
                <div className="section-aboutdesc">
                    <p>
                        We specialize in comprehensive background checks, including education, employment, criminal, and identity verifications, giving you peace of mind that you’re building trusted relationships. Whether you're looking for regular, contractual, or third-party hires, our team delivers efficient, reliable solutions that meet your specific needs.
                        At Mysdom, we don't just offer services; we provide the foundation for long-term business success. Trust us to safeguard your business with our top-notch verification processes and customized consulting solutions.
                    </p>
                </div>
            </section>

            {/* WHO WE ARE */}
            <section className="about-section">
                <div className="about-container">
                    <div className="about-text">
                        <span className="section-tag">WHO WE ARE</span>
                        <h2>Your Trusted Partner In Business Success</h2>
                        <p>
                            We are your trusted partner, offering reliable background
                            verification services that ensure secure hires and partnerships,
                            helping businesses grow with confidence and informed decision-making.
                        </p>
                    </div>

                    <div className="about-image">
                        <img src="/about-9.jpg" alt="team" />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-overlay">
                    <h2>Innovate Strategies, Reach Milestones</h2>
                    <button onClick={()=>(navigate('/contact'))}>Get Free Consultations →</button>
                </div>
            </section>
            {/* HISTORY */}
            <section className="history-section">
                <div className="history-header">
                    <span className="section-tag">OUR HISTORY</span>
                    <h2>Our Company History</h2>
                </div>

                <div className="timeline">
                    <div className="timeline-left">
                        <img src="/company.webp" alt="history" />
                    </div>

                    <div className="timeline-right">
                        <div className="timeline-card">
                            <span className="year">2024</span>
                            <h3>Company Inception</h3>
                            <p>
                                Mysdom offers expert business consulting, hiring, and verification
                                services, helping companies make informed decisions and achieve
                                lasting success.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default About;