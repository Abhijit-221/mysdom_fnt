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
} from "lucide-react";

export default function WhyMysdom() {
  return (
    <section className="why-section">
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
              <div>
                <h3>99.8%</h3>
                <p>Accuracy</p>
              </div>
            </div>

            <div className="why-stat-card stat-2 pink">
              <Globe size={20} />
              <div>
                <h3>500+</h3>
                <p>Cities</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="why-right">
          <p className="why-tag">WHY MYSDOM</p>

          <h2 className="why-title">
            We Provide a Unified Background Screening Solution
          </h2>

          <p className="why-subtitle">
            As India's trusted background verification partner, we help
            organizations of all sizes hire the right people for the right
            opportunities.
          </p>

          <div className="feature-list">
            <Feature
              icon={<Target size={18} />}
              title="99.8% Accuracy Rate"
              text="Industry-leading accuracy with minimal disputes and comprehensive verification."
            />
            <Feature
              icon={<Globe size={18} />}
              title="Pan-India Coverage"
              text="Verification services across all 28 states and 8 union territories of India."
            />
            <Feature
              icon={<ShieldCheck size={18} />}
              title="Compliance Focused"
              text="Fully compliant with DPDPPA, IT Act, and Indian labor laws."
            />
            <Feature
              icon={<Clock size={18} />}
              title="Fast Turnaround"
              text="Average TAT of 3-5 days with real-time status tracking."
            />
            <Feature
              icon={<Zap size={18} />}
              title="Seamless Integration"
              text="API integration with leading Indian ATS platforms and HRMS systems."
            />
            <Feature
              icon={<Headphones size={18} />}
              title="24/7 Support"
              text="Dedicated support team available round-the-clock for queries and assistance."
            />
          </div>

          <div className="cta-buttons">
            <button className="whymsdm-btn-primary">
              Learn About Our Company
            </button>
            <button className="btn-outline">
              Talk to Sales
            </button>
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
        <p>{text}</p>
      </div>
    </div>
  );
}