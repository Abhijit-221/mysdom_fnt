import React from "react";
import "./serviceCard.css";
import {
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Fingerprint,
  ArrowRight,
  MapPin,
  Users,
  Filter,
  Martini,
  Gavel
} from "lucide-react";
import ServiceGrid from "./ServiceGrid";

const services = [
  {
    icon: <Briefcase size={28} />,
    name: "Employment Verification",
    description:
      "Verify employment history with past employers across India. Confirm dates, designation, and reason for leaving.",
  },
  {
    icon: <GraduationCap size={28} />,
    name: "Education Verification",
    description:
      "Validate degrees, diplomas, and certificates from universities and educational institutions across India.",
  },
  {
    icon: <ShieldCheck size={28} />,
    name: "Criminal Record Check",
    description:
      "Comprehensive police verification and court record checks across states and union territories.",
  },
  {
    icon: <Fingerprint size={28} />,
    name: "Identity Verification",
    description:
      "Authenticate Aadhaar, PAN, Passport, and other government-issued identity documents.",
  },


  {
    icon: <MapPin size={28} />,
    name: "Address Verification",
    description:
      "Physical verification of current and permanent addresses with geo-tagged proof.",
  },
  {
    icon: <Users size={28} />,
    name: "Reference Checks",
    description:
      "Detailed professional and personal reference verification with structured feedback..",
  },
  {
    icon: <Martini size={28} />,
    name: "Drug & Alcohol Testing",
    description:
      "Pre-employment and periodic drug screening with NABL-accredited lab network.",
  },
  {
    icon: <Gavel size={28} />,
    name: "Court Record Verification",
    description:
      "Search civil and criminal court records across district and high courts in India.",
  },
];

export default function ServiceCard() {
  return (
    <section className="services-section">
      <div className="services-container">
        <p className="services-tag">
          WHAT SERVICES DOES MYSDOM OFFER?
        </p>

        <h2 className="services-title">
          Explore Our Range of Services
        </h2>

        <p className="services-subtitle">
          Our comprehensive offerings are the result of continuous innovation,
          customer feedback, and expertise in Indian employment screening
          solutions.
        </p>

        <a href="#" className="explore-link">
          Explore All Services <ArrowRight size={16} />
        </a>

        {/* <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="icon-box"><ShieldCheck size={28} /></div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <a href="#" className="learn-more">
                Learn More <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div> */}
        <ServiceGrid services={services}/>
      </div>
    </section>
  );
}