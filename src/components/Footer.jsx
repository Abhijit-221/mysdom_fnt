import React, { useEffect } from "react";
import "./footer.css";
import { PiLinkedinLogo } from "react-icons/pi";
import { BsTwitter } from "react-icons/bs";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const [services,setServices] = React.useState([]);
  useEffect(()=>{
    // fetch services
    const fetchServices = async () => {
      try {
        const res = await axiosInstance.get("/service/get", {
        });
        const serviceData = res?.data?.data || [];
        console.log("services res:", res);
        setServices(serviceData);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load Services");
      }
    };
    fetchServices();
  },[]);
  return (
    <footer className="footer" id="contact">
      <div className="footer-top">
        {/* Company Info */}
        <div className="footer-column company">
          <h2 className="footer-logo">
            <span className="logo-green">About</span>
            <span className="logo-pink"> Us</span>
          </h2>
          <p>
            At Mysdom, we thrive to help our client’s
            business grow by providing expert consulting,
            tailored hiring through our Smart screening solutions
            which is at par with industry standard background verification services.
          </p>
          <div className="footer-social">
            <a href="#" className="social-icon">
              <BsTwitter size={18} />
            </a>
            <a href="https://www.linkedin.com/company/mysdom/" className="social-icon">
              <PiLinkedinLogo size={18} />
            </a>
          </div>
          {/* <p>📧 contact@mysdom.com</p>
          <p>📞 +91 7077669661</p>
          <p>
            📍 Plot No.89, State Bank of India complex,
            Satya Nagar, Bhubaneswar, Odisha, India
          </p> */}
        </div>

        {/* Services */}
        <div className="footer-column">
          <h4>Services</h4>
          <ul>
            {
              services.map((service) => (
                <li key={service.id} onClick={()=>navigate(`/service/detail/${service.id}`)}>{service.name}</li>
              ))
            }
            {/* <li>Regular Employee Verification</li>
            <li>Contractual Verification</li>
            <li>Third-Party Verification</li>
            <li>Tenant Verification</li>
            <li>Individual Verification</li> */}
            {/* <li>Reference Checks</li> */}
          </ul>
        </div>

        {/* Industries */}
        {/* <div className="footer-column">
          <h4>Industries</h4>
          <ul>
            <li>IT & Technology</li>
            <li>Banking & Finance</li>
            <li>Healthcare</li>
            <li>E-commerce</li>
            <li>Manufacturing</li>
            <li>Education</li>
          </ul>
        </div> */}

        {/* Company */}
        <div className="footer-column">
          <h4>Contact Details</h4>
          <ul>
            <li>📍 Plot No.89, State Bank of India Complex, Satya Nagar, Bhubaneswar- 751007</li>
            <li>📞 +91 7077669661</li>
            <li>📧 contactus@mysdom.com</li>
            {/* <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li> */}
          </ul>
        </div>

        {/* Resources */}
        {/* <div className="footer-column">
          <h4>Resources</h4>
          <ul>
            <li>Blog</li>
            <li>Case Studies</li>
            <li>Webinars</li>
            <li>eBooks</li>
            <li>Help Center</li>
            <li>API Documentation</li>
          </ul>
        </div> */}
      </div>

      <div className="footer-bottom">
        <p>
          Copyright 2024 Mysdom - All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
