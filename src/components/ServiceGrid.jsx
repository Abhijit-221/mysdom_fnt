import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, ArrowRight, Trash2Icon } from "lucide-react";
import { keyframes } from "@emotion/react";
import { Box, Paper, Typography, Avatar, IconButton } from '@mui/material';

// ── Brand-locked tokens ──
const INK = "#0B2B33";
const AMBER = "#F2A65A";
const LINE = "rgba(11,43,51,0.08)";
const MUTED = "#5C7178";

const cardRise = keyframes`
  from { opacity: 0; transform: translateY(26px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Reveals the grid the first time it scrolls into view
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
};

function ServiceGrid({ services, user, deleteService }) {
  console.log("services---", services);
  const [gridRef, visible] = useReveal();

  return (
    <Box
      ref={gridRef}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
      }}
    >
      {services.map((service, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            position: "relative",
            flex: {
              xs: "1 1 100%",
              sm: "1 1 calc(50% - 12px)",
              md: "1 1 calc(33.333% - 16px)",
            },
            display: "flex",
            flexDirection: "column",
            p: 3.5,
            borderRadius: "16px",
            border: `1px solid ${LINE}`,
            boxShadow: "0 16px 34px -24px rgba(11,43,51,0.25)",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            animation: visible
              ? `${cardRise} 0.6s ease ${Math.min(index, 8) * 0.09}s both`
              : "none",
            transition: "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
            "&:hover": {
              transform: "translateY(-8px)",
              boxShadow: "0 26px 48px -20px rgba(11,43,51,0.32)",
              borderColor: "rgba(242,166,90,0.4)",
            },
            "&:hover .svcgrid-accent": {
              transform: "scaleX(1)",
            },
            "&:hover .svcgrid-icon": {
              bgcolor: AMBER,
              color: INK,
              transform: "rotate(-8deg) scale(1.08)",
            },
            "&:hover .svcgrid-arrow": {
              transform: "translateX(4px)",
            },
          }}
        >
          {/* accent bar that sweeps in on hover */}
          <Box
            className="svcgrid-accent"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 3,
              bgcolor: AMBER,
              transform: "scaleX(0)",
              transformOrigin: "left",
              transition: "transform 0.4s ease",
            }}
          />

          <Avatar
            className="svcgrid-icon"
            sx={{
              width: 52,
              height: 52,
              bgcolor: "rgba(242,166,90,0.15)",
              color: AMBER,
              mb: 2.5,
              transition: "transform 0.35s ease, background-color 0.35s ease, color 0.35s ease",
            }}
          >
            <ShieldCheck size={26} />
          </Avatar>

          <Typography sx={{ fontWeight: 700, fontSize: 18, color: INK, mb: 1.25 }}>
            {service.name}
          </Typography>

          <Typography sx={{ fontSize: 14.5, lineHeight: 1.75, color: MUTED, mb: user ? 3 : 0, flexGrow: 1 }}>
            {service.description}
          </Typography>

          {user && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: 2.5,
                borderTop: `1px solid ${LINE}`,
              }}
            >
              <Typography
                onClick={() => (window.location.href = `/service/detail/${service.id}`)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  fontSize: 14,
                  fontWeight: 600,
                  color: INK,
                  cursor: "pointer",
                }}
              >
                Learn More{" "}
                <Box
                  className="svcgrid-arrow"
                  sx={{ display: "flex", transition: "transform 0.3s ease" }}
                >
                  <ArrowRight size={16} />
                </Box>
              </Typography>
              <IconButton
                onClick={() => deleteService(service.id)}
                disableRipple
                sx={{
                  color: "#B3431E",
                  bgcolor: "rgba(179,67,30,0.08)",
                  borderRadius: "8px",
                  width: 34,
                  height: 34,
                  transition: "transform 0.25s ease, background-color 0.25s ease",
                  "&:hover": {
                    bgcolor: "rgba(179,67,30,0.16)",
                    transform: "scale(1.08)",
                  },
                }}
              >
                <Trash2Icon size={17} />
              </IconButton>
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );
}

export default ServiceGrid;