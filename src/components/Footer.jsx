import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer-top">
        {/* Company Info */}
        <div className="footer-column company">
          <h2 className="footer-logo">
            <span className="logo-green">mys</span>
            <span className="logo-pink">dom</span>
          </h2>
          <p>
            India's most trusted background verification partner.
            Empowering organizations to hire with confidence.
          </p>

          <p>📧 contact@mysdom.com</p>
          <p>📞 +91 7077669661</p>
          <p>
            📍 Plot No.89, State Bank of India complex,
            Satya Nagar, Bhubaneswar, Odisha, India
          </p>
        </div>

        {/* Services */}
        <div className="footer-column">
          <h4>Services</h4>
          <ul>
            <li>Employment Verification</li>
            <li>Education Verification</li>
            <li>Criminal Record Check</li>
            <li>Identity Verification</li>
            <li>Address Verification</li>
            <li>Reference Checks</li>
          </ul>
        </div>

        {/* Industries */}
        <div className="footer-column">
          <h4>Industries</h4>
          <ul>
            <li>IT & Technology</li>
            <li>Banking & Finance</li>
            <li>Healthcare</li>
            <li>E-commerce</li>
            <li>Manufacturing</li>
            <li>Education</li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-column">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Our Team</li>
            <li>Careers</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer-column">
          <h4>Resources</h4>
          <ul>
            <li>Blog</li>
            <li>Case Studies</li>
            <li>Webinars</li>
            <li>eBooks</li>
            <li>Help Center</li>
            <li>API Documentation</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © 2025 mysdom. All rights reserved. | DPDP Act Compliant | ISO 27001 Certified
        </p>
      </div>
    </footer>
  );
};

export default Footer;
