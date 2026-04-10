import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import WebinarCarousel from "../components/WebinarCarousel";
import ServiceCard from "../components/ServiceCard";
import WhyMysdom from "../components/WhyMysdom";
import MysdomCaseStudyCarousel from "../components/CaseStudy";
import Reviews from "../components/Reviews";
import { useNavigate } from "react-router-dom";
import ContactSection from "../components/commn/ConsultationForm";

const words1 = [["Smart", "Screening", "Solutions"],["Verify", "Trust", "Succeed"]];
const words2 = ["Verify", "Trust", "Succeed"];
export default function LandingPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words1.length);
    }, 5000); // change every 2 sec

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="lp-wrapper">

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-overlay"></div>

        <div className="lp-container lp-hero-content">
          <div className="lp-hero-left">

            <span className="lp-badge">
              Welcome to Mysdom
            </span>

            {/* <h1 className="lp-title">
              Smart Screening Solutions <br />
              Verify <span>Trust</span> Succeed
            </h1> */}
             <h1 className="lp-title">
              <span className="line1">
                {words1[index][0]}
              </span>
              <br />
              <span className="line2">
                {words1[index][1]}
              </span><br />
              <span className="line3">
                {words1[index][2]}
              </span>
            </h1>

            <div className="lp-buttons">
              <button
                type="button"
                className="lp-btn-primary"
                onClick={() => navigate('/about')}
              >
                Read more →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT COMPANY MYSDOM */}
      <section className="lp-why">
        <WhyMysdom />
      </section>

      {/* SERVICES */}
      <section className="lp-services">
        <ServiceCard />
      </section>

      {/* Brand details */}
      <section className="lp-webinar">
        <WebinarCarousel />
      </section>

      {/* CASE STUDY */}
      <section className="lp-case">
        <MysdomCaseStudyCarousel />
      </section>

      {/* REVIEWS */}
      <section className="lp-reviews">
        <Reviews />
      </section>
      {/* contact */}
      <section className="lp-contact">
        <ContactSection />
      </section>
    </div>
  );
}