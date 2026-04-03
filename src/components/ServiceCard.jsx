import React, { useEffect, useState } from "react";
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
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";



export default function ServiceCard() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get(
        "/service/ext-list",
        {
          params: {
            page: 1,
            limit: 6,
          },
        }
      );

      const serviceData = res?.data?.data?.services || [];
      const totalCount = res?.data?.data?.count || 0;

      setServices(serviceData);

      // 🔥 Calculate total pages
      // setTotalPages(Math.ceil(totalCount / limit));

    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);
  return (
    <section className="mysdom-services-section">
  <div className="mysdom-services-container">
    <p className="mysdom-services-tag">
      WHAT SERVICES DOES MYSDOM OFFER?
    </p>

    <h2 className="mysdom-services-title">
      Explore Our Range of Services
    </h2>

    {/* <p className="mysdom-services-subtitle">
      Our comprehensive offerings are the result of continuous innovation,
      customer feedback, and expertise in Indian employment screening
      solutions.
    </p> */}

    <p  className="mysdom-explore-link" onClick={()=>navigate('/services')}>
      Explore All Services <ArrowRight size={16} />
    </p>

    <div className="mysdom-services-grid">
      {services.map((service, index) => (
        <div className="mysdom-service-card" key={index}>
          <div className="mysdom-icon-box">
            <ShieldCheck size={28} />
          </div>

          <h3>{service.name}</h3>
          <p>{service.description}</p>

          <p className="mysdom-learn-more" onClick={()=>navigate('/services')}>
            Learn More <ArrowRight size={16} />
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
  );
}