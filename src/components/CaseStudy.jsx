import React, { useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DATA = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=800",
    title: "Business Consulting",
    subtitle: "Mysdom Agency",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800",
    title: "Digital Consulting",
    subtitle: "Mysdom Agency",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800",
    title: "Business Strategy",
    subtitle: "Mysdom Agency",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800",
    title: "Human Resource",
    subtitle: "Mysdom Agency",
  },
];

const AUTOPLAY_MS = 3000;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* Shortest cyclic distance from currentIndex, e.g. -2..-1..0..1..2 */
function relativeOffset(index, current, length) {
  let raw = index - current;
  if (raw > length / 2) raw -= length;
  if (raw < -length / 2) raw += length;
  return raw;
}

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

export default function MysdomCaseStudyCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sectionRef, inView] = useInView(0.1);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % DATA.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? DATA.length - 1 : prev - 1));

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(nextSlide, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{ py: { xs: 8, md: 12 }, bgcolor: "#0B2B33", overflow: "hidden" }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            mb: 7,
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
            COMPANY CASE STUDY
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.9rem", md: "2.6rem" },
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Our Consulting Success
          </Typography>
        </Box>

        {/* Coverflow stage */}
        <Box
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={prevSlide}
            sx={{
              position: "absolute",
              left: { xs: 0, md: 10 },
              zIndex: 10,
              bgcolor: "rgba(255,255,255,0.1)",
              color: "#fff",
              transition: "background-color 0.25s ease, transform 0.25s ease",
              "&:hover": { bgcolor: "#F2A65A", color: "#0B2B33", transform: "scale(1.1)" },
            }}
          >
            <ChevronLeft size={20} />
          </IconButton>

          <Box
            sx={{
              position: "relative",
              height: { xs: 320, md: 400 },
              width: "100%",
              maxWidth: 720,
              perspective: "1400px",
            }}
          >
            {DATA.map((item, index) => {
              const offset = relativeOffset(index, currentIndex, DATA.length);
              const absOffset = Math.abs(offset);
              const isActive = offset === 0;

              // Cards beyond +-2 are pushed far off-stage and hidden
              const visible = absOffset <= 2;

              const translateX = offset * 190;
              const scale = isActive ? 1 : absOffset === 1 ? 0.78 : 0.6;
              const rotateY = offset === 0 ? 0 : offset > 0 ? -35 : 35;
              const opacity = !visible ? 0 : isActive ? 1 : absOffset === 1 ? 0.65 : 0.3;
              const zIndex = 10 - absOffset;

              return (
                <Box
                  key={item.id}
                  onClick={() => !isActive && setCurrentIndex(index)}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: { xs: 220, md: 280 },
                    height: { xs: 280, md: 340 },
                    borderRadius: 4,
                    overflow: "hidden",
                    cursor: isActive ? "default" : "pointer",
                    boxShadow: isActive
                      ? "0 30px 60px rgba(0,0,0,0.45)"
                      : "0 15px 30px rgba(0,0,0,0.3)",
                    transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    opacity,
                    zIndex,
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease",
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      filter: isActive ? "none" : "brightness(0.6)",
                      transition: "filter 0.5s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85))",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      p: 2.5,
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(10px)",
                      transition: "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s",
                    }}
                  >
                    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1.15rem" }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: "absolute",
              right: { xs: 0, md: 10 },
              zIndex: 10,
              bgcolor: "rgba(255,255,255,0.1)",
              color: "#fff",
              transition: "background-color 0.25s ease, transform 0.25s ease",
              "&:hover": { bgcolor: "#F2A65A", color: "#0B2B33", transform: "scale(1.1)" },
            }}
          >
            <ChevronRight size={20} />
          </IconButton>
        </Box>

        {/* Dots */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 5 }}>
          {DATA.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: index === currentIndex ? 28 : 8,
                height: 8,
                borderRadius: 999,
                bgcolor: index === currentIndex ? "#F2A65A" : "rgba(255,255,255,0.25)",
                cursor: "pointer",
                transition: "width 0.3s ease, background-color 0.3s ease",
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}