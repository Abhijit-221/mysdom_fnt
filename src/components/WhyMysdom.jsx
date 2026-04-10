import React from "react";
import "./whyMysdom.css";
import {
  Target,
  Globe,
  ShieldCheck,
  Clock,
  Zap,
  Headphones,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WhyMysdom() {
  const navigate = useNavigate();
  return (
    <section className="why-section">
      <div className="why-section-overlay">

        <div className="why-container">
          {/* LEFT SIDE */}
          <div className="why-left">
            <div className="image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200"
                alt="Interview"
              />

              <div className="why-stat-card stat-1">
                <CheckCircle size={20} />
                <div className="small-stat-card1">
                  <h3>100%</h3>
                  <p>Accuracy</p>
                </div>
              </div>

              <div className="why-stat-card stat-2 pink">
                <Globe size={20} />
                <div className="small-stat-card2">
                  <h3>10+</h3>
                  <p>Cities</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="why-right">
            <p className="why-tag">ABOUT COMPANY</p>

            <h2 className="why-title">
              Helping your business thrive with confidence
            </h2>

            <p className="why-subtitle">
              As a leader in hiring and verification, Mysdom ensures secure hires and trustworthy partnerships, empowering businesses to thrive with confidence and peace of mind.
            </p>

            <div className="feature-list">
              <Feature
                icon={<Target size={18} />}
                title="100% Accuracy Rate"
                text="Comprehensive Verification"
              />
              <Feature
                icon={<Globe size={18} />}
                title="Tailored Hiring Solutions"
                text="Tailored Hiring Solutions"
              />
              <Feature
                icon={<ShieldCheck size={18} />}
                title="Risk-Free Partnerships"
                text="Risk-Free Partnerships"
              />
              {/* <Feature
                icon={<Clock size={18} />}
                title="Fast Turnaround"
                text="Average TAT of 3-5 days with real-time status tracking."
              /> */}
              {/* <Feature
                icon={<Zap size={18} />}
                title="Seamless Integration"
                text="API integration with leading Indian ATS platforms and HRMS systems."
              /> */}
              <Feature
                icon={<Headphones size={18} />}
                // title="24/7 Support"
                title="10+ Expert Team members"
                text="10+ Expert Team members"
              />
            </div>

            <div className="cta-buttons">
              <button className="whymsdm-btn-primary" onClick={()=>navigate('/about')}>
                DISCOVER MORE <ArrowRight size={16} />
              </button>
              {/* <button className="btn-outline">
                Talk to Sales
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        {/* <p>{text}</p> */}
      </div>
    </div>
  );
}