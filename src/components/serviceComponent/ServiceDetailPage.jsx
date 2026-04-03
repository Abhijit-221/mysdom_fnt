import { useEffect, useState } from "react";
import "./serviceDetailPage.css";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

// const services = [
//   { label: "Regular Employee Verification", href: "#", active: true },
//   { label: "Contractual Verification", href: "#" },
//   { label: "Third-Party Verification", href: "#" },
//   { label: "Tenant Verification", href: "#" },
//   { label: "Individual Verification", href: "#" },
// ];

// const keyBenefits = [
//   {
//     icon: "✔",
//     title: "Thorough Background Checks:",
//     desc: "Ensuring credibility and reliability in every hire.",
//   },
//   {
//     icon: "✔",
//     title: "Long-Term Focus:",
//     desc: "Prioritizing candidates who align with your long-term success.",
//   },
//   {
//     icon: "✔",
//     title: "Confidentiality:",
//     desc: "We maintain high levels of data security during the process.",
//   },
// ];

// const processCol1 = [
//   "Targeted sourcing",
//   "Detailed screening",
//   "Background verification",
// ];
// const processCol2 = [
//   "Skill assessment",
//   "Interview coordination",
//   "Post-hire support",
// ];

// const faqs = [
//   {
//     q: "How do you ensure the quality of candidates?",
//     a: "We conduct in-depth background checks and assessments to guarantee the qualifications and credibility of every hire.",
//   },
//   {
//     q: "How long does the hiring process take?",
//     a: "Our efficient process typically takes between 2–4 weeks, depending on the role and candidate availability.",
//   },
//   {
//     q: "What happens if a candidate doesn't work out?",
//     a: "We offer post-hire support and provide replacement candidates if necessary within a pre-defined period.",
//   },
// ];

export default function ServiceDetailPage() {
    const {id} = useParams();
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("Service ID:", id);
    const navigate = useNavigate();
    const [service, setService] = useState({});
    const [multiservice, setMultiservice] = useState([]);
    // extradetails states
    const [processCol1, setProcessCol1] = useState([]);
    const [processCol2, setProcessCol2] = useState([]);
    const [extradetailSubTitle, setExtradetailSubTitle] = useState("");


    // faq state
    const [faqs, setFaqs] = useState([]);
    const [openFaq, setOpenFaq] = useState(0);

    //fetch service details
    const fetchServiceDetails = async (id) => {
        try {
            const res = await axiosInstance.get(`/service/getby/${id}`);
            const serviceData = res?.data?.data || {};
            console.log("service details data:", serviceData);
            setService(serviceData);

            const servicesRespones = await axiosInstance.get(`/service/list`);
            const multiResp = servicesRespones?.data?.data?.services || [];
            console.log("services data:", multiResp);
            setMultiservice(multiResp);
            
            console.log("servicesData:",serviceData?.moredetails);
            const mid = Math.ceil(serviceData.moredetails?.extradetailList.length / 2);
            setExtradetailSubTitle(serviceData?.moredetails?.extradetailList[0] || "");;
            const firstCol = serviceData?.moredetails?.extradetailList.slice(1, mid);
            const secondCol = serviceData?.moredetails?.extradetailList.slice(mid);
            setProcessCol1(firstCol);
            setProcessCol2(secondCol);
            console.log("extradetailSubTitle:", extradetailSubTitle);
            setFaqs(serviceData?.moredetails?.frequentlyaskedquestions || []);

        }
        catch (err) {
            toast.error(err.response?.data?.message || "Failed to load Service Details");
        }
    };
    useEffect(() => {
        fetchServiceDetails(id);
    }, []);
    
    
    
   
    // console.log(firstCol,secondCol)
  return (
    <div className="mysdom-page">
      {/* Page Banner */}
      <section className="page-banner">
        <div className="banner-overlay" />
        <div className="banner-content">
          <p className="banner-eyebrow" onClick={()=>(navigate('/'))}>Home</p>
          <h1 className="banner-title">Regular Employee Verification</h1>
          <div className="banner-accent" />
        </div>
      </section>

      {/* Main Content */}
      <section className="service-section">
        <div className="service-container">
          {/* ── Sidebar ── */}
          <aside className="sidebar">
            <div className="sidebar-card">
              <h4 className="sidebar-heading">Our Services</h4>
              <ul className="sidebar-list">
                {multiservice?.map((s) => (
                  <li key={s.id} className={s.active ? "active" : ""}>
                    <p onClick={()=>(fetchServiceDetails(s.id))}>
                      <span className="chevron">››</span>
                      {s.name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-help">
              <div className="sidebar-help-overlay" />
              <div className="sidebar-help-content">
                <h4>We're Always Ready to Help You</h4>
                {
                    user.role==="admin" || user.role==="superadmin"? <p className="btn-primary" onClick={()=>navigate(`/service/update/${id}`)}>
                  Edit <span className="chevron">››</span>
                </p> : <p className="btn-primary" onClick={()=>navigate('/contact')}>
                  Need Help <span className="chevron">››</span>
                </p>
                }
               
              </div>
            </div>
          </aside>

          {/* ── Main Panel ── */}
          <main className="service-main">
            <div className="service-image-wrap">
              <img
                src="https://mysdom.com/assets/img/regular-employee-hiring.webp"
                alt="Regular Employee Verification"
                className="service-image"
              />
              <div className="image-tag">Verified Hiring</div>
            </div>

            <div className="service-content">
              <h2 className="service-title">{service.name}</h2>

              <p className="service-para">
                {service.description}
              </p>
              <p className="service-para">
               {service?.moredetails?.detaildescription}
              </p>

              <h4 className="section-subheading">Key Benefits</h4>
              <ul className="benefits-list">
                {service?.moredetails?.keybenifits.map((b) => (
                  <li key={b} className="benefit-item">
                    <span className="benefit-icon">{b.icon}</span>
                    <p>
                      <strong>{b}</strong> 
                    </p>
                  </li>
                ))}
              </ul>

              <h3 className="section-heading">
                {service.moredetails?.extradetailTitle}
              </h3>
              <p className="service-para">
                {extradetailSubTitle}
              </p>

              <div className="process-grid">
                <ul className="process-col">
                  {processCol1?.map((item) => (
                    <li key={item}>
                      <span className="check">✔</span> {item}
                    </li>
                  ))}
                </ul>
                <ul className="process-col">
                  {processCol2?.map((item) => (
                    <li key={item}>
                      <span className="check">✔</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ */}
              <h3 className="section-heading faq-heading">
                Frequently Asked Questions
              </h3>
              <div className="faq-list">
                {faqs?.map((faq, i) => (
                  <div
                    key={i}
                    className={`faq-item ${openFaq === i ? "open" : ""}`}
                  >
                    <button
                      className="faq-question"
                      onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    >
                      <span className="faq-icon">?</span>
                      <span>{faq.question}</span>
                      <span className="faq-toggle">{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
}
