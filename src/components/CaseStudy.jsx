import React, { useState, useEffect } from "react";
import "./caseStudy.css";

const data = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b",
    title: "Business Consulting",
    subtitle: "Mysdom Agency",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    title: "Digital Consulting",
    subtitle: "Mysdom Agency",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    title: "Business Strategy",
    subtitle: "Mysdom Agency",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    title: "Human Resource",
    subtitle: "Mysdom Agency",
  },
];

export default function MysdomCaseStudyCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? data.length - 1 : prev - 1
    );
  };

  return (
    <section className="mysdom-carousel-section">
      <div className="mysdom-carousel-container">
        
        <p className="mysdom-carousel-tag">COMPANY CASE STUDY</p>

        <h2 className="mysdom-carousel-title">
          Our Consulting Success
        </h2>

        <div className="mysdom-carousel-wrapper">
          <button className="mysdom-arrow left" onClick={prevSlide}>
            ❮
          </button>

          <div className="mysdom-carousel-track">
            {data.map((item, index) => {
              let position = "nextSlide";

              if (index === currentIndex) {
                position = "activeSlide";
              } else if (
                index === currentIndex - 1 ||
                (currentIndex === 0 && index === data.length - 1)
              ) {
                position = "lastSlide";
              }

              return (
                <div
                  className={`mysdom-carousel-card ${position}`}
                  key={item.id}
                >
                  <img src={item.image} alt={item.title} />

                  <div className="mysdom-overlay">
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="mysdom-arrow right" onClick={nextSlide}>
            ❯
          </button>
        </div>
      </div>
    </section>
  );
}