import React from 'react'
import {
  ShieldCheck,
  ArrowRight,
  FingerprintPattern,
  Gavel,
  GlobeLock,
  GraduationCap,
  Trash2Icon
} from "lucide-react";
import './serviceGrid.css'
function ServiceGrid({ services,user ,deleteService}) {
  console.log("services---", services);
  
  return (

    <div className="svcgrid-wrapper">
      <div className="svcgrid-grid">
        {services.map((service, index) => (
          <div
            className='svcgrid-card'
            key={index}
          >
            <div className="svcgrid-icon">
              <ShieldCheck size={30} />
            </div>

            <h3 className="svcgrid-title">{service.name}</h3>

            <p className="svcgrid-desc">{service.description}</p>
            
            <div className='svc-card-footer'>
              <p className="svcgrid-link" onClick={()=>window.location.href=`/service/detail/${service.id}`}>
                Learn More <ArrowRight size={16} />
              </p>
              {
              user && 
              <button className="svc-delete-btn" onClick={()=>(deleteService(service.id))}>
                <Trash2Icon size={20}/>
              </button>
              }
            </div>
            
            
          </div>
        ))}
      </div>
    </div>

  )
}

export default ServiceGrid