import React from 'react'
import {
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import './serviceGrid.css'
function ServiceGrid({services}) {
    console.log("services---",services);
  return (
    
        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="icon-box"><ShieldCheck size={28} /></div>

              <h3>{service.name}</h3>

              <p>{service.description}</p>

              <a href={`/service/getby/${service.id}`} className="learn-more">
                Learn More <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
    
  )
}

export default ServiceGrid