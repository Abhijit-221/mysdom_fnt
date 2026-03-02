import React from "react";
import "./LandingPage.css";
import WebinarCarousel from "../components/WebinarCarousel";
import ServiceCard from "../components/ServiceCard";
import WhyMysdom from "../components/WhyMysdom";
import Difference from "../components/Difference";
import UnifiedCTA from "../components/UnifiedCTA";
import ClientDashboard from "../components/ClientDashboard";
import UploadCandidate from "../components/UploadCandidate";

export default function LandingPage() {
  return (
    <div className="landing">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="container hero-content">
          <div className="hero-left">
            <span className="badge">
              India's Most Trusted Background Verification Partner
            </span>

            <h1>
              Hiring Never Felt <br />
              So <span>Right</span>
            </h1>

            <p>
              Empower your hiring decisions with accurate, compliant, and fast
              background verification services across India.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary">Talk to Sales →</button>
              <button className="btn-outline">Check Verification Status</button>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <h2>99.8%</h2>
              <p>Accuracy Rate</p>
            </div>

            <div className="stat-card">
              <h2>24/7</h2>
              <p>Support</p>
            </div>

            <div className="stat-card">
              <h2>2.5K+</h2>
              <p>Companies</p>
            </div>

            <div className="stat-card">
              <h2>5M+</h2>
              <p>Verifications</p>
            </div>
          </div>
        </div>
      </section>
      {/* WEBINAR SECTION */}
      <section className="webinar">
        {/* <div className="container webinar-card">
          <div className="webinar-left">
            <span className="webinar-tag">Webinar</span>
            <h3>Background Verification Trends in India 2025</h3>
            <p>February 15, 2025 (3:00 PM IST)</p>
            <button className="btn-primary">Register Now</button>
          </div>
          <div className="webinar-right"></div>
         
        </div> */}
         <WebinarCarousel/>
      </section>

      {/* SERVICES SECTION */}
      <section className="services">
        {/* <div className="container text-center">
          <h2>Explore Our Range of Services</h2>

          <div className="service-grid">
            <div className="service-card">
              <h4>Employment Verification</h4>
              <p>Verify employment history across India.</p>
              <span>Learn More →</span>
            </div>

            <div className="service-card">
              <h4>Education Verification</h4>
              <p>Validate degrees and certifications.</p>
              <span>Learn More →</span>
            </div>

            <div className="service-card">
              <h4>Criminal Record Check</h4>
              <p>Comprehensive police and court checks.</p>
              <span>Learn More →</span>
            </div>

            <div className="service-card">
              <h4>Identity Verification</h4>
              <p>Aadhaar, PAN, Passport authentication.</p>
              <span>Learn More →</span>
            </div>
          </div>
        </div> */}
        <ServiceCard/>
      </section>

          {/* WHY MYSDOM */}
       <section className="why-mysdom">
          <WhyMysdom/>
       </section>
      {/* DIFFERENCE SECTION */}
      <section className="difference">
          <Difference/>
       </section>
      {/* UPLOAD CANDIDATE SECTION */}
      <section className="upload-section">
          <UploadCandidate/>
      </section>
      {/* CLIENT DASHBOARD SECTION */}
      <section className="client-dashboard">
        <ClientDashboard/>
      </section>
      {/* UNIFIED CTA SECTION */}
      <section className="unifiedcta">
        <UnifiedCTA/>
      </section>
    </div>
  );
}
