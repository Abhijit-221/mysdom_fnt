import React from "react";
import "./unifiedCTA.css";

const UnifiedCTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">

        {/* Left Card */}
        <div className="cta-card green-card">
          <h2>
            mysdom Provides A Unified <br />
            Background Screening Solution
          </h2>

          <p>
            As India's leading provider of background verification solutions,
            we help organizations of all sizes hire the right people for the
            right opportunities.
          </p>

          <button className="cta-btn">
            Talk to Sales <span>→</span>
          </button>
        </div>

        {/* Right Card */}
        <div className="cta-card pink-card">
          <h2>
            Need Assistance With Your <br />
            Background Check Status?
          </h2>

          <p>
            Check out our Candidate Help Center to find answers to your
            questions regarding your background check status or to obtain
            a copy of your report.
          </p>

          <button className="cta-btn">
            Visit Candidate Help Center <span>→</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default UnifiedCTA;