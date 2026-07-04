// import React from "react";
// import "./whyMysdom.css";
// import {
//   Target,
//   Globe,
//   ShieldCheck,
//   Clock,
//   Zap,
//   Headphones,
//   CheckCircle,
//   ArrowRight,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function WhyMysdom() {
//   const navigate = useNavigate();
//   return (
//     <section className="why-section">
//       <div className="why-section-overlay">

//         <div className="why-container">
//           {/* LEFT SIDE */}
//           <div className="why-left">
//             <div className="image-wrapper">
//               <img
//                 src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200"
//                 alt="Interview"
//               />

//               <div className="why-stat-card stat-1">
//                 <CheckCircle size={20} />
//                 <div className="small-stat-card1">
//                   <h3>100%</h3>
//                   <p>Accuracy</p>
//                 </div>
//               </div>

//               <div className="why-stat-card stat-2 pink">
//                 <Globe size={20} />
//                 <div className="small-stat-card2">
//                   <h3>10+</h3>
//                   <p>Cities</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT SIDE */}
//           <div className="why-right">
//             <p className="why-tag">ABOUT COMPANY</p>

//             <h2 className="why-title">
//               Helping your business thrive with confidence
//             </h2>

//             <p className="why-subtitle">
//               As a leader in hiring and verification, Mysdom ensures secure hires and trustworthy partnerships, empowering businesses to thrive with confidence and peace of mind.
//             </p>

//             <div className="feature-list">
//               <Feature
//                 icon={<Target size={18} />}
//                 title="100% Accuracy Rate"
//                 text="Comprehensive Verification"
//               />
//               <Feature
//                 icon={<Globe size={18} />}
//                 title="Tailored Hiring Solutions"
//                 text="Tailored Hiring Solutions"
//               />
//               <Feature
//                 icon={<ShieldCheck size={18} />}
//                 title="Risk-Free Partnerships"
//                 text="Risk-Free Partnerships"
//               />
//               <Feature
//                 icon={<Headphones size={18} />}
//                 // title="24/7 Support"
//                 title="10+ Expert Team members"
//                 text="10+ Expert Team members"
//               />
//             </div>

//             <div className="cta-buttons">
//               <button className="whymsdm-btn-primary" onClick={()=>navigate('/about')}>
//                 DISCOVER MORE <ArrowRight size={16} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function Feature({ icon, title, text }) {
//   return (
//     <div className="feature-card">
//       <div className="feature-icon">{icon}</div>
//       <div>
//         <h4>{title}</h4>
//         {/* <p>{text}</p> */}
//       </div>
//     </div>
//   );
// }







import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import {
  Target,
  Globe,
  ShieldCheck,
  Headphones,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

/* ---- Keyframes ---- */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeLeft = keyframes`
  from { opacity: 0; transform: translateX(-28px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeRight = keyframes`
  from { opacity: 0; transform: translateX(28px); }
  to { opacity: 1; transform: translateX(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* Lightweight scroll-reveal hook — no extra dependency */
function useInView(threshold = 0.25) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

const FEATURES = [
  { icon: Target, title: "100% Accuracy Rate", text: "Comprehensive verification" },
  { icon: Globe, title: "Tailored Hiring Solutions", text: "Built around your process" },
  { icon: ShieldCheck, title: "Risk-Free Partnerships", text: "Vetted and dependable" },
  { icon: Headphones, title: "10+ Expert Team Members", text: "Real people, real support" },
];

function Feature({ icon: Icon, title, index, inView }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(11,43,51,0.08)",
        bgcolor: "#fff",
        opacity: 0,
        animation: inView ? `${fadeUp} 0.6s ease forwards` : "none",
        animationDelay: `${0.4 + index * 0.12}s`,
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        cursor: "default",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(11,43,51,0.1)",
          borderColor: "rgba(242,166,90,0.4)",
        },
        "&:hover .why-feature-icon": {
          bgcolor: "#F2A65A",
          color: "#0B2B33",
          transform: "rotate(-8deg) scale(1.08)",
        },
      }}
    >
      <Box
        className="why-feature-icon"
        sx={{
          flexShrink: 0,
          width: 40,
          height: 40,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(11,43,51,0.06)",
          color: "#0B2B33",
          transition: "background-color 0.25s ease, color 0.25s ease, transform 0.25s ease",
        }}
      >
        <Icon size={18} />
      </Box>
      <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#0B2B33", mt: 0.5 }}>
        {title}
      </Typography>
    </Box>
  );
}

export default function WhyMysdom() {
  const navigate = useNavigate();
  const [ref, inView] = useInView(0.2);

  return (
    <Box
      ref={ref}
      component="section"
      sx={{
        position: "relative",
        py: { xs: 8, md: 10 },
        overflow: "hidden",
        bgcolor: "#F7FAFA",
      }}
    >
      {/* soft background accent */}
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(242,166,90,0.12), transparent 70%)",
          top: -100,
          left: -100,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            gap: { xs: 6, md: 8 },
          }}
        >
          {/* LEFT — image + stat cards in a row underneath */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              opacity: 0,
              animation: inView ? `${fadeLeft} 0.7s ease forwards` : "none",
            }}
          >
            <Box
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(11,43,51,0.15)",
                mb: 2.5,
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200"
                alt="Interview"
                sx={{
                  width: "100%",
                  height: { xs: 260, md: 380 },
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              />
            </Box>

            {/* Stat cards row */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  bgcolor: "#fff",
                  borderRadius: 3,
                  px: 2,
                  py: 1.5,
                  boxShadow: "0 8px 22px rgba(11,43,51,0.1)",
                  animation: `${float} 4s ease-in-out infinite`,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: "rgba(11,43,51,0.08)",
                    color: "#0B2B33",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle size={18} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#0B2B33", lineHeight: 1.1 }}>
                    100%
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "rgba(11,43,51,0.6)" }}>
                    Accuracy
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  bgcolor: "#0B2B33",
                  color: "#fff",
                  borderRadius: 3,
                  px: 2,
                  py: 1.5,
                  boxShadow: "0 8px 22px rgba(11,43,51,0.25)",
                  animation: `${float} 4.5s ease-in-out infinite`,
                  animationDelay: "0.4s",
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: "rgba(242,166,90,0.2)",
                    color: "#F2A65A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Globe size={18} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.1 }}>
                    10+
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
                    Cities
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* RIGHT — copy + features */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              opacity: 0,
              animation: inView ? `${fadeRight} 0.7s ease forwards` : "none",
            }}
          >
            <Typography
              sx={{
                display: "inline-block",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#F2A65A",
                mb: 1.5,
              }}
            >
              ABOUT COMPANY
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.9rem", md: "2.6rem" },
                fontWeight: 700,
                lineHeight: 1.2,
                color: "#0B2B33",
                mb: 2,
              }}
            >
              Helping your business thrive with confidence
            </Typography>

            <Typography
              sx={{
                fontSize: "1.02rem",
                lineHeight: 1.7,
                color: "rgba(11,43,51,0.65)",
                mb: 4,
                maxWidth: 500,
              }}
            >
              As a leader in hiring and verification, Mysdom ensures secure hires
              and trustworthy partnerships, empowering businesses to thrive with
              confidence and peace of mind.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 4,
              }}
            >
              {FEATURES.map((f, i) => (
                <Box
                  key={f.title}
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" },
                  }}
                >
                  <Feature icon={f.icon} title={f.title} index={i} inView={inView} />
                </Box>
              ))}
            </Box>

            <Button
              onClick={() => navigate("/about")}
              endIcon={<ArrowRight size={16} />}
              sx={{
                px: 3.5,
                py: 1.5,
                borderRadius: 3,
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: "#0B2B33",
                textTransform: "none",
                backgroundImage:
                  "linear-gradient(120deg, #F2A65A 0%, #FFCB8E 25%, #F2A65A 50%, #FFCB8E 75%, #F2A65A 100%)",
                backgroundSize: "200% 100%",
                animation: `${shimmer} 5s ease infinite`,
                boxShadow: "0 8px 22px rgba(242,166,90,0.35)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "translateY(-3px) scale(1.03)",
                  boxShadow: "0 12px 28px rgba(242,166,90,0.5)",
                },
              }}
            >
              DISCOVER MORE
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}