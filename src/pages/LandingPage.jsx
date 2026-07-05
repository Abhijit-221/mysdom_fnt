// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { keyframes } from "@emotion/react";

// import Box from "@mui/material/Box";
// import Container from "@mui/material/Container";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Stack from "@mui/material/Stack";
// import Grid from "@mui/material/Grid";

// import WebinarCarousel from "../components/WebinarCarousel";
// import ServiceCard from "../components/ServiceCard";
// import WhyMysdom from "../components/WhyMysdom";
// import MysdomCaseStudyCarousel from "../components/CaseStudy";
// import Reviews from "../components/Reviews";
// import ContactSection from "../components/commn/ConsultationForm";

// const HEADLINE_SETS = [
//   ["Smart", "Screening", "Solutions"],
//   ["Verify", "Trust", "Succeed"],
// ];

// const STATS = [
//   { value: "10,000+", label: "Screenings completed" },
//   { value: "99.8%", label: "Verification accuracy" },
//   { value: "24 hrs", label: "Average turnaround" },
//   { value: "500+", label: "Businesses trust us" },
// ];

// /* ---- Keyframes ---- */
// const gradientShift = keyframes`
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// `;

// const floatBlob = keyframes`
//   0%, 100% { transform: translate(0, 0); }
//   50% { transform: translate(20px, -30px); }
// `;

// const scanMove = keyframes`
//   0% { left: -2%; opacity: 0; }
//   10% { opacity: 0.7; }
//   90% { opacity: 0.7; }
//   100% { left: 102%; opacity: 0; }
// `;

// const pulseDot = keyframes`
//   0%, 100% { box-shadow: 0 0 0 0 rgba(242, 166, 90, 0.6); }
//   50% { box-shadow: 0 0 0 6px rgba(242, 166, 90, 0); }
// `;

// const fadeUp = keyframes`
//   from { opacity: 0; transform: translateY(16px); }
//   to { opacity: 1; transform: translateY(0); }
// `;

// const scrollBounce = keyframes`
//   0% { top: 8px; opacity: 1; }
//   70% { top: 20px; opacity: 0; }
//   100% { top: 8px; opacity: 0; }
// `;

// export default function LandingPage() {
//   const navigate = useNavigate();
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % HEADLINE_SETS.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <Box>
//       {/* ============ HERO ============ */}
//       <Box
//         sx={{
//           position: "relative",
//           minHeight: "92vh",
//           display: "flex",
//           alignItems: "center",
//           overflow: "hidden",
//           background: "linear-gradient(135deg, #071c21 0%, #0b2b33 45%, #123f4a 100%)",
//           backgroundSize: "200% 200%",
//           animation: `${gradientShift} 14s ease infinite`,
//         }}
//       >
//         {/* dotted grid overlay */}
//         <Box
//           sx={{
//             position: "absolute",
//             inset: 0,
//             backgroundImage:
//               "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
//             backgroundSize: "28px 28px",
//             zIndex: 1,
//           }}
//         />

//         {/* floating glow blobs */}
//         <Box
//           sx={{
//             position: "absolute",
//             width: 420,
//             height: 420,
//             borderRadius: "50%",
//             filter: "blur(90px)",
//             background: "rgba(242,166,90,0.18)",
//             top: -120,
//             right: -100,
//             zIndex: 1,
//             animation: `${floatBlob} 9s ease-in-out infinite`,
//           }}
//         />
//         <Box
//           sx={{
//             position: "absolute",
//             width: 340,
//             height: 340,
//             borderRadius: "50%",
//             filter: "blur(90px)",
//             background: "rgba(90,200,200,0.12)",
//             bottom: -100,
//             left: -80,
//             zIndex: 1,
//             animation: `${floatBlob} 11s ease-in-out infinite reverse`,
//           }}
//         />

//         {/* scanning line */}
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             width: 2,
//             height: "100%",
//             background:
//               "linear-gradient(180deg, transparent, rgba(242,166,90,0.6), transparent)",
//             animation: `${scanMove} 6s linear infinite`,
//             zIndex: 1,
//           }}
//         />

//         <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
//           <Box sx={{ maxWidth: 640 }}>
//             {/* Badge */}
//             <Stack
//               direction="row"
//               alignItems="center"
//               spacing={1}
//               sx={{
//                 display: "inline-flex",
//                 px: 2,
//                 py: 1,
//                 borderRadius: 999,
//                 bgcolor: "rgba(255,255,255,0.08)",
//                 border: "1px solid rgba(255,255,255,0.16)",
//                 backdropFilter: "blur(6px)",
//                 animation: `${fadeUp} 0.6s ease both`,
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 7,
//                   height: 7,
//                   borderRadius: "50%",
//                   bgcolor: "#F2A65A",
//                   animation: `${pulseDot} 2s ease infinite`,
//                 }}
//               />
//               <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.85rem", fontWeight: 500 }}>
//                 Welcome to Mysdom
//               </Typography>
//             </Stack>

//             {/* Title */}
//             <Typography
//               key={index}
//               variant="h1"
//               sx={{
//                 mt: 3,
//                 mb: 2.5,
//                 fontSize: { xs: "2.4rem", sm: "3rem", md: "4rem" },
//                 lineHeight: 1.08,
//                 fontWeight: 700,
//                 letterSpacing: "-0.02em",
//                 color: "#fff",
//               }}
//             >
//               <Box
//                 component="span"
//                 sx={{ display: "inline-block", opacity: 0, animation: `${fadeUp} 0.55s ease 0.05s forwards`, color: "#fff" }}
//               >
//                 {HEADLINE_SETS[index][0]}
//               </Box>
//               <br />
//               <Box
//                 component="span"
//                 sx={{ display: "inline-block", opacity: 0, animation: `${fadeUp} 0.55s ease 0.18s forwards`, color: "#F2A65A" }}
//               >
//                 {HEADLINE_SETS[index][1]}
//               </Box>
//               <br />
//               <Box
//                 component="span"
//                 sx={{
//                   display: "inline-block",
//                   opacity: 0,
//                   animation: `${fadeUp} 0.55s ease 0.3s forwards`,
//                   background: "linear-gradient(90deg, #ffffff, #cfe8e8)",
//                   WebkitBackgroundClip: "text",
//                   backgroundClip: "text",
//                   color: "transparent",
//                 }}
//               >
//                 {HEADLINE_SETS[index][2]}
//               </Box>
//             </Typography>

//             {/* Subtitle */}
//             <Typography
//               sx={{
//                 maxWidth: 520,
//                 fontSize: "1.05rem",
//                 lineHeight: 1.65,
//                 color: "rgba(255,255,255,0.72)",
//                 mb: 4,
//                 opacity: 0,
//                 animation: `${fadeUp} 0.6s ease 0.4s forwards`,
//               }}
//             >
//               Fast, accurate background screening built for businesses that can't
//               afford to get hiring wrong. Verify candidates with confidence, backed
//               by data you can trust.
//             </Typography>

//             {/* Buttons */}
//             <Stack
//               direction="row"
//               spacing={2}
//               flexWrap="wrap"
//               sx={{ opacity: 0, animation: `${fadeUp} 0.6s ease 0.5s forwards`, rowGap: 2 }}
//             >
//               <Button
//                 onClick={() => navigate("/about")}
//                 sx={{
//                   px: 3.5,
//                   py: 1.6,
//                   borderRadius: 3,
//                   fontSize: "1rem",
//                   fontWeight: 600,
//                   color: "#0B2B33",
//                   textTransform: "none",
//                   backgroundImage:
//                     "linear-gradient(120deg, #F2A65A 0%, #FFCB8E 25%, #F2A65A 50%, #FFCB8E 75%, #F2A65A 100%)",
//                   backgroundSize: "200% 100%",
//                   animation: `${gradientShift} 5s ease infinite`,
//                   boxShadow: "0 8px 24px rgba(242,166,90,0.35)",
//                   transition: "transform 0.25s ease, box-shadow 0.25s ease",
//                   "&:hover": {
//                     transform: "translateY(-3px) scale(1.03)",
//                     boxShadow: "0 12px 30px rgba(242,166,90,0.5)",
//                   },
//                 }}
//               >
//                 Read more &nbsp;→
//               </Button>

//               <Button
//                 onClick={() => navigate("/contact")}
//                 variant="outlined"
//                 sx={{
//                   px: 3.5,
//                   py: 1.6,
//                   borderRadius: 3,
//                   fontSize: "1rem",
//                   fontWeight: 600,
//                   textTransform: "none",
//                   color: "#fff",
//                   borderColor: "rgba(255,255,255,0.35)",
//                   transition: "background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease",
//                   "&:hover": {
//                     bgcolor: "rgba(255,255,255,0.1)",
//                     borderColor: "rgba(255,255,255,0.6)",
//                     transform: "translateY(-3px)",
//                   },
//                 }}
//               >
//                 Talk to us
//               </Button>
//             </Stack>

//             {/* Rotation dots */}
//             <Stack
//               direction="row"
//               spacing={1}
//               sx={{ mt: 5, opacity: 0, animation: `${fadeUp} 0.6s ease 0.6s forwards` }}
//             >
//               {HEADLINE_SETS.map((_, i) => (
//                 <Box
//                   key={i}
//                   onClick={() => setIndex(i)}
//                   sx={{
//                     width: i === index ? 40 : 24,
//                     height: 4,
//                     borderRadius: 4,
//                     bgcolor: i === index ? "#F2A65A" : "rgba(255,255,255,0.25)",
//                     cursor: "pointer",
//                     transition: "background-color 0.3s ease, width 0.3s ease",
//                   }}
//                 />
//               ))}
//             </Stack>
//           </Box>
//         </Container>

//         {/* Scroll cue */}
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 28,
//             left: "50%",
//             transform: "translateX(-50%)",
//             width: 26,
//             height: 42,
//             border: "2px solid rgba(255,255,255,0.4)",
//             borderRadius: 7,
//             zIndex: 2,
//             display: { xs: "none", sm: "block" },
//           }}
//         >
//           <Box
//             sx={{
//               position: "absolute",
//               top: 8,
//               left: "50%",
//               transform: "translateX(-50%)",
//               width: 4,
//               height: 8,
//               borderRadius: 1,
//               bgcolor: "#F2A65A",
//               animation: `${scrollBounce} 1.8s ease infinite`,
//             }}
//           />
//         </Box>
//       </Box>

//       {/* ============ TRUST STATS STRIP ============ */}
//       {/* <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid rgba(11,43,51,0.08)", py: 5.5 }}>
//         <Container maxWidth="lg">
//           <Grid container spacing={3}>
//             {STATS.map((stat, i) => (
//               <Grid item xs={6} md={3} key={stat.label}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     textAlign: "center",
//                     gap: 0.5,
//                     opacity: 0,
//                     animation: `${fadeUp} 0.6s ease forwards`,
//                     animationDelay: `${i * 100}ms`,
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       fontSize: { xs: "1.6rem", md: "2.1rem" },
//                       fontWeight: 700,
//                       background: "linear-gradient(90deg, #0B2B33, #1D4A54)",
//                       WebkitBackgroundClip: "text",
//                       backgroundClip: "text",
//                       color: "transparent",
//                     }}
//                   >
//                     {stat.value}
//                   </Typography>
//                   <Typography sx={{ fontSize: "0.9rem", color: "rgba(11,43,51,0.6)" }}>
//                     {stat.label}
//                   </Typography>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box> */}

//       {/* ============ CHILD SECTIONS ============ */}
//       <WhyMysdom />
//       <ServiceCard />
//       <WebinarCarousel />
//       <Box sx={{ py: 5 }}>
//         <MysdomCaseStudyCarousel />
//       </Box>
//       <Reviews />
//       <ContactSection />
//     </Box>
//   );
// }









import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

import WebinarCarousel from "../components/WebinarCarousel";
import ServiceCard from "../components/ServiceCard";
import WhyMysdom from "../components/WhyMysdom";
import MysdomCaseStudyCarousel from "../components/CaseStudy";
import Reviews from "../components/Reviews";
import ContactSection from "../components/commn/ConsultationForm";

const HEADLINE_SETS = [
  ["Smart", "Screening", "Solutions"],
  ["Verify", "Trust", "Succeed"],
];

const STATS = [
  { value: "10,000+", label: "Screenings completed" },
  { value: "99.8%", label: "Verification accuracy" },
  { value: "24 hrs", label: "Average turnaround" },
  { value: "500+", label: "Businesses trust us" },
];

/* ---- Keyframes ---- */
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatBlob = keyframes`
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -30px); }
`;

const scanMove = keyframes`
  0% { left: -2%; opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.7; }
  100% { left: 102%; opacity: 0; }
`;

const pulseDot = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(242, 166, 90, 0.6); }
  50% { box-shadow: 0 0 0 6px rgba(242, 166, 90, 0); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scrollBounce = keyframes`
  0% { top: 8px; opacity: 1; }
  70% { top: 20px; opacity: 0; }
  100% { top: 8px; opacity: 0; }
`;

/* ---- New keyframes for the right-side visual ---- */
const cardFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
  50% { transform: translateY(-16px) rotate(1deg); }
`;

const scanVertical = keyframes`
  0% { top: -8%; opacity: 0; }
  12% { opacity: 0.9; }
  88% { opacity: 0.9; }
  100% { top: 106%; opacity: 0; }
`;

const chipFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const chipPopIn = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const ringPulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(242, 166, 90, 0.5); }
  50% { box-shadow: 0 0 0 10px rgba(242, 166, 90, 0); }
`;

/* Floating verification chip used around the hero card */
const FloatingChip = ({ icon, label, sx, delay = "0s", floatDelay = "0s" }) => (
  <Box
    sx={{
      position: "absolute",
      display: "flex",
      alignItems: "center",
      gap: 1,
      px: 1.75,
      py: 1,
      borderRadius: 999,
      bgcolor: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.2)",
      backdropFilter: "blur(8px)",
      opacity: 0,
      animation: `${chipPopIn} 0.6s ease ${delay} forwards, ${chipFloat} 4.5s ease-in-out ${floatDelay} infinite`,
      animationFillMode: "backwards, none",
      whiteSpace: "nowrap",
      ...sx,
    }}
  >
    <Box
      sx={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        bgcolor: "rgba(242,166,90,0.2)",
        color: "#F2A65A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#fff" }}>
      {label}
    </Typography>
  </Box>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HEADLINE_SETS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      {/* ============ HERO ============ */}
      <Box
        sx={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: "linear-gradient(135deg, #071c21 0%, #0b2b33 45%, #123f4a 100%)",
          backgroundSize: "200% 200%",
          animation: `${gradientShift} 14s ease infinite`,
        }}
      >
        {/* dotted grid overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "28px 28px",
            zIndex: 1,
          }}
        />

        {/* floating glow blobs */}
        <Box
          sx={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            filter: "blur(90px)",
            background: "rgba(242,166,90,0.18)",
            top: -120,
            right: -100,
            zIndex: 1,
            animation: `${floatBlob} 9s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: "50%",
            filter: "blur(90px)",
            background: "rgba(90,200,200,0.12)",
            bottom: -100,
            left: -80,
            zIndex: 1,
            animation: `${floatBlob} 11s ease-in-out infinite reverse`,
          }}
        />

        {/* scanning line */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            width: 2,
            height: "100%",
            background:
              "linear-gradient(180deg, transparent, rgba(242,166,90,0.6), transparent)",
            animation: `${scanMove} 6s linear infinite`,
            zIndex: 1,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: { xs: 6, md: 4 },
            }}
          >
            {/* ── LEFT: copy ── */}
            <Box sx={{ maxWidth: 640, flex: { md: "1 1 55%" } }}>
              {/* Badge */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  display: "inline-flex",
                  px: 2,
                  py: 1,
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  backdropFilter: "blur(6px)",
                  animation: `${fadeUp} 0.6s ease both`,
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor: "#F2A65A",
                    animation: `${pulseDot} 2s ease infinite`,
                  }}
                />
                <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "0.85rem", fontWeight: 500 }}>
                  Welcome to Mysdom
                </Typography>
              </Stack>

              {/* Title */}
              <Typography
                key={index}
                variant="h1"
                sx={{
                  mt: 3,
                  mb: 2.5,
                  fontSize: { xs: "2.4rem", sm: "3rem", md: "4rem" },
                  lineHeight: 1.08,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                }}
              >
                <Box
                  component="span"
                  sx={{ display: "inline-block", opacity: 0, animation: `${fadeUp} 0.55s ease 0.05s forwards`, color: "#fff" }}
                >
                  {HEADLINE_SETS[index][0]}
                </Box>
                <br />
                <Box
                  component="span"
                  sx={{ display: "inline-block", opacity: 0, animation: `${fadeUp} 0.55s ease 0.18s forwards`, color: "#F2A65A" }}
                >
                  {HEADLINE_SETS[index][1]}
                </Box>
                <br />
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    opacity: 0,
                    animation: `${fadeUp} 0.55s ease 0.3s forwards`,
                    background: "linear-gradient(90deg, #ffffff, #cfe8e8)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {HEADLINE_SETS[index][2]}
                </Box>
              </Typography>

              {/* Subtitle */}
              <Typography
                sx={{
                  maxWidth: 520,
                  fontSize: "1.05rem",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.72)",
                  mb: 4,
                  opacity: 0,
                  animation: `${fadeUp} 0.6s ease 0.4s forwards`,
                }}
              >
                Fast, accurate background screening built for businesses that can't
                afford to get hiring wrong. Verify candidates with confidence, backed
                by data you can trust.
              </Typography>

              {/* Buttons */}
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                sx={{ opacity: 0, animation: `${fadeUp} 0.6s ease 0.5s forwards`, rowGap: 2 }}
              >
                <Button
                  onClick={() => navigate("/about")}
                  sx={{
                    px: 3.5,
                    py: 1.6,
                    borderRadius: 3,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#0B2B33",
                    textTransform: "none",
                    backgroundImage:
                      "linear-gradient(120deg, #F2A65A 0%, #FFCB8E 25%, #F2A65A 50%, #FFCB8E 75%, #F2A65A 100%)",
                    backgroundSize: "200% 100%",
                    animation: `${gradientShift} 5s ease infinite`,
                    boxShadow: "0 8px 24px rgba(242,166,90,0.35)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-3px) scale(1.03)",
                      boxShadow: "0 12px 30px rgba(242,166,90,0.5)",
                    },
                  }}
                >
                  Read more &nbsp;→
                </Button>

                <Button
                  onClick={() => navigate("/contact")}
                  variant="outlined"
                  sx={{
                    px: 3.5,
                    py: 1.6,
                    borderRadius: 3,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.35)",
                    transition: "background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                      borderColor: "rgba(255,255,255,0.6)",
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  Talk to us
                </Button>
              </Stack>

              {/* Rotation dots */}
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 5, opacity: 0, animation: `${fadeUp} 0.6s ease 0.6s forwards` }}
              >
                {HEADLINE_SETS.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setIndex(i)}
                    sx={{
                      width: i === index ? 40 : 24,
                      height: 4,
                      borderRadius: 4,
                      bgcolor: i === index ? "#F2A65A" : "rgba(255,255,255,0.25)",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease, width 0.3s ease",
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* ── RIGHT: animated verification-card illustration ── */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flex: "1 1 45%",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                height: 460,
              }}
            >
              <Box sx={{ position: "relative", width: 300, height: 380 }}>
                {/* main floating card */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)",
                    p: 3,
                    overflow: "hidden",
                    animation: `${cardFloat} 6.5s ease-in-out infinite`,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar sx={{ width: 44, height: 44, bgcolor: "#F2A65A", color: "#0B2B33" }}>
                      <VerifiedRoundedIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ width: "70%", height: 9, borderRadius: 1, bgcolor: "rgba(255,255,255,0.4)", mb: 0.75 }} />
                      <Box sx={{ width: "45%", height: 7, borderRadius: 1, bgcolor: "rgba(255,255,255,0.2)" }} />
                    </Box>
                  </Stack>

                  {[100, 85, 92, 60].map((w, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: `${w}%`,
                        height: 8,
                        borderRadius: 1,
                        bgcolor: "rgba(255,255,255,0.12)",
                        mb: 1.5,
                      }}
                    />
                  ))}

                  <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                    {[ShieldRoundedIcon, CheckCircleRoundedIcon, VerifiedRoundedIcon].map((Icon, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          bgcolor: "rgba(242,166,90,0.15)",
                          color: "#F2A65A",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          animation: i === 0 ? `${ringPulse} 2.4s ease infinite` : "none",
                        }}
                      >
                        <Icon sx={{ fontSize: 18 }} />
                      </Box>
                    ))}
                  </Stack>

                  {/* vertical scanning beam sweeping the card */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      width: "100%",
                      height: 3,
                      background:
                        "linear-gradient(90deg, transparent, rgba(242,166,90,0.9), transparent)",
                      animation: `${scanVertical} 3.2s linear infinite`,
                    }}
                  />
                </Box>

                {/* floating verification chips around the card */}
                <FloatingChip
                  icon={<CheckCircleRoundedIcon sx={{ fontSize: 14 }} />}
                  label="Identity Verified"
                  delay="0.7s"
                  floatDelay="0s"
                  sx={{ top: -18, right: -34 }}
                />
                <FloatingChip
                  icon={<ShieldRoundedIcon sx={{ fontSize: 14 }} />}
                  label="Employment Checked"
                  delay="0.95s"
                  floatDelay="1.2s"
                  sx={{ bottom: 96, left: -48 }}
                />
                <FloatingChip
                  icon={<VerifiedRoundedIcon sx={{ fontSize: 14 }} />}
                  label="Criminal Record Clear"
                  delay="1.2s"
                  floatDelay="0.6s"
                  sx={{ bottom: -20, right: -10 }}
                />
              </Box>
            </Box>
          </Box>
        </Container>

        {/* Scroll cue */}
        <Box
          sx={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            width: 26,
            height: 42,
            border: "2px solid rgba(255,255,255,0.4)",
            borderRadius: 7,
            zIndex: 2,
            display: { xs: "none", sm: "block" },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 4,
              height: 8,
              borderRadius: 1,
              bgcolor: "#F2A65A",
              animation: `${scrollBounce} 1.8s ease infinite`,
            }}
          />
        </Box>
      </Box>

      {/* ============ TRUST STATS STRIP ============ */}
      {/* <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid rgba(11,43,51,0.08)", py: 5.5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {STATS.map((stat, i) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 0.5,
                    opacity: 0,
                    animation: `${fadeUp} 0.6s ease forwards`,
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "1.6rem", md: "2.1rem" },
                      fontWeight: 700,
                      background: "linear-gradient(90deg, #0B2B33, #1D4A54)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", color: "rgba(11,43,51,0.6)" }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box> */}

      {/* ============ CHILD SECTIONS ============ */}
      <WhyMysdom />
      <ServiceCard />
      <WebinarCarousel />
      <Box sx={{ py: 5 }}>
        <MysdomCaseStudyCarousel />
      </Box>
      <Reviews />
      <ContactSection />
    </Box>
  );
}