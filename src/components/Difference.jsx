import React from "react";
import "./difference.css";

const Difference = () => {
  return (
    <section className="difference">
      <div className="difference-overlay"></div>

      <div className="container difference-wrapper">
        {/* Header */}
        <div className="difference-header">
          <h2>
            The <span>mysdom</span> Difference
          </h2>
          <p>
            Leading Background Screening Services For More Than 15 Years
          </p>
        </div>

        {/* Cards */}
        <div className="difference-cards">
          <div className="diff-card">
            <div className="icon green">🛡</div>
            <h3>99.98%</h3>
            <p>Dispute-Free Results</p>
          </div>

          <div className="diff-card">
            <div className="icon pink">⚡</div>
            <h3>3-5 Days</h3>
            <p>Average Turnaround Time</p>
          </div>

          <div className="diff-card">
            <div className="icon green">🌍</div>
            <h3>Pan-India</h3>
            <p>Coverage & Delivery</p>
          </div>

          <div className="diff-card">
            <div className="icon pink">⏰</div>
            <h3>24/7</h3>
            <p>Customer Support</p>
          </div>
        </div>

        {/* Description */}
        <div className="difference-description">
          <p>
            Many of India's most successful organizations rely on mysdom.
            With a history of innovation and excellence, we deliver smart,
            customer-focused solutions that increase efficiency, speed up
            time-to-hire, and provide your candidates with a simplified experience.
          </p>

          <button className="dif-btn-primary">
            Learn More About Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default Difference;