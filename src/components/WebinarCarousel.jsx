import React, { useState, useEffect } from "react";
import "./webinarCarousel.css";

const slides = [
  {
    tag: "Brand Success",
    title: "Cultivating success through reliable connections",
    // date: "February 15, 2025 (3:00 PM IST)",
    description: "We foster success by connecting businesses with reliable talent and partners, ensuring peace of mind through thorough hiring and verification services.",
    // credits: "SHRM/HRCI credits offered",
    // button: "Register Now",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200",
  },
  // {
  //   tag: "eBook",
  //   title: "Complete Guide to Employee Background Screening in India",
  //   // date: "March 10, 2025 (5:00 PM IST)",
  //   description: "Speaker: Ananya Mehta, HR Tech Specialist",
  //   // credits: "Free certification included",
  //   // button: "Download Now",
  //   image:
  //     "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
  // },
  // {
  //   tag: "Report",
  //   title: "2025: The Year Hiring Gets Smarter in India",
  //   // date: "April 2, 2025 (2:00 PM IST)",
  //   description: "Speaker: Vikram Shah, Risk Consultant",
  //   // credits: "Limited seats available",
  //   // button: "Read Report",
  //   image:
  //     "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200",
  // },
];

export default function WebinarCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-wrapper">
      <div className="carousel-card">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${
              index === current ? "active" : ""
            }`}
          >
            <div className="carousel-content">
              <span className="tag">{slide.tag}</span>
              <h1>{slide.title}</h1>
              {/* <p className="date">{slide.date}</p> */}
              <p>{slide.description}</p>
              {/* <p>{slide.credits}</p> */}
              {/* <button className="cta-btn">{slide.button}</button> */}
            </div>

            <div
              className="carousel-image"
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
          </div>
        ))}

        {/* Navigation */}
        <button className="nav left" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="nav right" onClick={nextSlide}>
          &#10095;
        </button>

        {/* Indicators */}
        <div className="indicators">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === current ? "active-dot" : ""}`}
              onClick={() => setCurrent(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}