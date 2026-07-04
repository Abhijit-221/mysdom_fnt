import React, { useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

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
  Gavel,
} from "lucide-react";

import axiosInstance from "../api/axiosInstance";

/* Cycled per card so the grid doesn't repeat one icon for every service */
const ICONS = [
  ShieldCheck,
  Briefcase,
  Fingerprint,
  GraduationCap,
  MapPin,
  Users,
  Filter,
  Gavel,
  Martini,
];

/* ---- Keyframes ---- */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* Lightweight scroll-reveal hook, fires once */
function useInView(threshold = 0.15) {
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

function ServiceCardItem({ service, index, inView, onClick }) {
  const Icon = ICONS[index % ICONS.length];

  return (
    <Box
      onClick={onClick}
      sx={{
        flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)", md: "1 1 calc(33.333% - 16px)" },
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: 3.5,
        borderRadius: 4,
        bgcolor: "#fff",
        border: "1px solid rgba(11,43,51,0.08)",
        cursor: "pointer",
        opacity: 0,
        animation: inView ? `${fadeUp} 0.6s ease forwards` : "none",
        animationDelay: `${(index % 6) * 90}ms`,
        boxShadow: "0 20px 40px rgba(11,43,51,0.12)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 40px rgba(11,43,51,0.12)",
          borderColor: "rgba(242,166,90,0.4)",
        },
        "&:hover .service-icon-box": {
          bgcolor: "#F2A65A",
          color: "#0B2B33",
          transform: "rotate(-8deg) scale(1.08)",
        },
        "&:hover .service-learn-more": {
          color: "#F2A65A",
        },
        "&:hover .service-learn-more svg": {
          transform: "translateX(4px)",
        },
      }}
    >
      <Box
        className="service-icon-box"
        sx={{
          width: 56,
          height: 56,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(11,43,51,0.06)",
          color: "#0B2B33",
          transition: "background-color 0.3s ease, color 0.3s ease, transform 0.3s ease",
        }}
      >
        <Icon size={26} />
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#0B2B33" }}>
        {service.name}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.92rem",
          lineHeight: 1.6,
          color: "rgba(11,43,51,0.6)",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {service.description}
      </Typography>

      <Box
        className="service-learn-more"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          mt: "auto",
          pt: 1.5,
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#0B2B33",
          transition: "color 0.25s ease",
          "& svg": { transition: "transform 0.25s ease" },
        }}
      >
        Learn More <ArrowRight size={16} />
      </Box>
    </Box>
  );
}

function ServiceCardSkeleton() {
  return (
    <Box
      sx={{
        flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)", md: "1 1 calc(33.333% - 16px)" },
        p: 3.5,
        borderRadius: 4,
        border: "1px solid rgba(11,43,51,0.08)",
        bgcolor: "#fff",
      }}
    >
      <Skeleton variant="rounded" width={56} height={56} sx={{ borderRadius: 3, mb: 2 }} />
      <Skeleton variant="text" width="70%" height={28} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="40%" sx={{ mt: 2 }} />
    </Box>
  );
}

export default function ServiceCard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [ref, inView] = useInView(0.1);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/service/ext-list", {
        params: { page: 1, limit: 6 },
      });
      const serviceData = res?.data?.data?.services || [];
      setServices(serviceData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <Box
      ref={ref}
      component="section"
      sx={{
        position: "relative",
        py: { xs: 8, md: 12 },
        bgcolor: "#F7FAFA",
        overflow: "hidden",
      }}
    >
      {/* soft background accent */}
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(242,166,90,0.1), transparent 70%)",
          bottom: -140,
          right: -120,
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            textAlign: "center",
            maxWidth: 620,
            mx: "auto",
            mb: 6,
            opacity: 0,
            animation: inView ? `${fadeUp} 0.6s ease forwards` : "none",
          }}
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
            WHAT SERVICES DOES MYSDOM OFFER?
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.9rem", md: "2.6rem" },
              fontWeight: 700,
              lineHeight: 1.2,
              color: "#0B2B33",
              mb: 2.5,
            }}
          >
            Explore Our Range of Services
          </Typography>

          <Box
            onClick={() => navigate("/services")}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "#0B2B33",
              cursor: "pointer",
              "& svg": { transition: "transform 0.25s ease" },
              "&:hover": { color: "#F2A65A" },
              "&:hover svg": { transform: "translateX(4px)" },
            }}
          >
            Explore All Services <ArrowRight size={16} />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)
            : services.map((service, index) => (
                <ServiceCardItem
                  key={service.id || index}
                  service={service}
                  index={index}
                  inView={inView}
                  onClick={() => navigate("/services")}
                />
              ))}
        </Box>

        {!loading && services.length === 0 && (
          <Typography sx={{ textAlign: "center", color: "rgba(11,43,51,0.5)", mt: 4 }}>
            No services available right now.
          </Typography>
        )}
      </Container>
    </Box>
  );
}