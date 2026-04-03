import React from "react";
import "./reviews.css";

const testimonials = [
  {
    id: 1,
    text: "Wonderful to see a startup doing a great work in this ever-changing market of background verifications. Well done team.",
    company: "A Leading Technology Service Provider",
  },
  {
    id: 2,
    text: "We are working with Mysdom for the last 6 months and are very impressed with their verifications report. This has helped in gaining the speed of our hiring process.",
    company: "A Leading Steel Manufacturing Company",
  },
];

export default function Reviews() {
  return (
    <section className="mysdom-testimonial-section">
      <div className="mysdom-testimonial-container">
        
        <p className="mysdom-testimonial-tag">REAL CLIENT STORIES</p>

        <h2 className="mysdom-testimonial-title">
          Customer Experiences
        </h2>

        <div className="mysdom-testimonial-grid">
          {testimonials.map((item) => (
            <div className="mysdom-testimonial-card" key={item.id}>
              
              <div className="mysdom-quote-icon">❝❞</div>

              <p className="mysdom-testimonial-text">
                {item.text}
              </p>

              <div className="mysdom-testimonial-user">
                <div className="mysdom-user-avatar">👨‍💼</div>
                <div className="mysdom-user-info">
                  <p>{item.company}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}