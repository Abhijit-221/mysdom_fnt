import React, { useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const TESTIMONIALS = [
  {
    id: 1,
    text: "Wonderful to see a startup doing a great work in this ever-changing market of background verifications. Well done team.",
    company: "A Leading Technology Service Provider",
  },
  {
    id: 2,
    text: "We are working with Mysdom for the last 6 months and are very impressed with their verifications report. This has helped in gaining the speed of our hiring process.",
    company: "A Leading Steel Manufacturing Company",
  },
];

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px) rotate(var(--tilt)); }
  to { opacity: 1; transform: translateY(0) rotate(var(--tilt)); }
`;

function useInView(threshold = 0.2) {
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

function initialsOf(text) {
  const words = text.replace(/^A |^An /i, "").split(" ");
  return (words[0]?.[0] || "") + (words[1]?.[0] || "");
}

function TestimonialChip({ item, index, inView }) {
  const tilt = index % 2 === 0 ? "-1.5deg" : "1.5deg";

  return (
    <Box
      sx={{
        "--tilt": tilt,
        position: "relative",
        flex: "1 1 300px",
        maxWidth: 340,
        p: 2.75,
        borderRadius: 3,
        bgcolor: "#fff",
        border: "1px solid rgba(11,43,51,0.08)",
        boxShadow: "0 10px 24px rgba(11,43,51,0.08)",
        opacity: 0,
        transform: `rotate(${tilt})`,
        animation: inView ? `${fadeUp} 0.6s ease forwards` : "none",
        animationDelay: `${index * 140}ms`,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "default",
        "&:hover": {
          transform: "rotate(0deg) translateY(-4px)",
          boxShadow: "0 18px 36px rgba(11,43,51,0.14)",
        },
      }}
    >
      {/* Giant faint quote mark, bleeding off the corner */}
      <Typography
        aria-hidden
        sx={{
          position: "absolute",
          top: -18,
          right: 8,
          fontSize: "5rem",
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          color: "rgba(242,166,90,0.18)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        &rdquo;
      </Typography>

      <Typography
        sx={{
          position: "relative",
          fontSize: "0.92rem",
          lineHeight: 1.6,
          color: "#0B2B33",
          mb: 2.5,
        }}
      >
        {item.text}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            flexShrink: 0,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "#0B2B33",
            bgcolor: "#F2A65A",
          }}
        >
          {initialsOf(item.company)}
        </Box>
        <Typography
          sx={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "rgba(11,43,51,0.65)",
            lineHeight: 1.3,
          }}
        >
          {item.company}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Reviews() {
  const [ref, inView] = useInView(0.2);

  return (
    <Box ref={ref} component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: "#F7FAFA" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            opacity: 0,
            animation: inView ? `${fadeUp} 0.6s ease forwards` : "none",
          }}
          style={{ "--tilt": "0deg" }}
        >
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#F2A65A",
              mb: 1.5,
            }}
          >
            REAL CLIENT STORIES
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.9rem", md: "2.6rem" },
              fontWeight: 700,
              color: "#0B2B33",
            }}
          >
            Customer Experiences
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {TESTIMONIALS.map((item, index) => (
            <TestimonialChip key={item.id} item={item} index={index} inView={inView} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}