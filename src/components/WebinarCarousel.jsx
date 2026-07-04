import React, { useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    tag: "Brand Success",
    title: "Cultivating success through reliable connections",
    description:
      "We foster success by connecting businesses with reliable talent and partners, ensuring peace of mind through thorough hiring and verification services.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200",
  },
  {
    tag: "eBook",
    title: "Complete Guide to Employee Background Screening in India",
    date: "March 10, 2025 (5:00 PM IST)",
    description: "Speaker: Ananya Mehta, HR Tech Specialist",
    credits: "Free certification included",
    button: "Download Now",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
  },
  // Add more slide objects here — the layout, arrows, dots, and
  // progress bar all already support any number of slides.
];

const AUTOPLAY_MS = 5000;

/* ---- Keyframes ---- */
const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

const kenBurns = keyframes`
  from { transform: scale(1.08); }
  to { transform: scale(1); }
`;

const progressFill = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

export default function WebinarCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused || SLIDES.length <= 1) return;
    timerRef.current = setInterval(nextSlide, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, current]);

  const slide = SLIDES[current];

  return (
    <Box
      sx={{ position: "relative", maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 } }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 5,
          overflow: "hidden",
          bgcolor: "#0B2B33",
          boxShadow: "0 30px 60px rgba(11,43,51,0.25)",
          minHeight: { xs: "auto", md: 420 },
        }}
      >
        {/* Text side */}
        <Box
          key={`text-${current}`}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            p: { xs: 4, md: 6 },
            position: "relative",
            zIndex: 2,
          }}
        >
          <Typography
            sx={{
              display: "inline-flex",
              alignSelf: "flex-start",
              px: 2,
              py: 0.75,
              borderRadius: 999,
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#0B2B33",
              bgcolor: "#F2A65A",
              opacity: 0,
              animation: `${fadeSlideIn} 0.55s ease forwards`,
            }}
          >
            {slide.tag}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1.6rem", md: "2.2rem" },
              fontWeight: 700,
              lineHeight: 1.25,
              color: "#fff",
              opacity: 0,
              animation: `${fadeSlideIn} 0.55s ease 0.1s forwards`,
            }}
          >
            {slide.title}
          </Typography>

          <Typography
            sx={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 460,
              opacity: 0,
              animation: `${fadeSlideIn} 0.55s ease 0.2s forwards`,
            }}
          >
            {slide.description}
          </Typography>
        </Box>

        {/* Image side */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            minHeight: { xs: 240, md: "auto" },
            overflow: "hidden",
          }}
        >
          <Box
            key={`img-${current}`}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              animation: `${kenBurns} 6s ease-out forwards`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: {
                xs: "linear-gradient(0deg, rgba(11,43,51,0.6), transparent 40%)",
                md: "linear-gradient(90deg, rgba(11,43,51,0.55), transparent 45%)",
              },
            }}
          />
        </Box>

        {/* Nav arrows */}
        {SLIDES.length > 1 && (
          <>
            <IconButton
              onClick={prevSlide}
              sx={{
                position: "absolute",
                top: "50%",
                left: 16,
                transform: "translateY(-50%)",
                zIndex: 3,
                bgcolor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                transition: "background-color 0.25s ease, transform 0.25s ease",
                "&:hover": { bgcolor: "#F2A65A", color: "#0B2B33", transform: "translateY(-50%) scale(1.08)" },
              }}
            >
              <ChevronLeft size={20} />
            </IconButton>
            <IconButton
              onClick={nextSlide}
              sx={{
                position: "absolute",
                top: "50%",
                right: 16,
                transform: "translateY(-50%)",
                zIndex: 3,
                bgcolor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                transition: "background-color 0.25s ease, transform 0.25s ease",
                "&:hover": { bgcolor: "#F2A65A", color: "#0B2B33", transform: "translateY(-50%) scale(1.08)" },
              }}
            >
              <ChevronRight size={20} />
            </IconButton>
          </>
        )}
      </Box>

      {/* Indicators with autoplay progress */}
      {SLIDES.length > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 3 }}>
          {SLIDES.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrent(index)}
              sx={{
                position: "relative",
                width: index === current ? 44 : 10,
                height: 6,
                borderRadius: 999,
                bgcolor: "rgba(11,43,51,0.15)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "width 0.35s ease",
              }}
            >
              {index === current && (
                <Box
                  key={`progress-${current}`}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "#F2A65A",
                    animation: `${progressFill} ${AUTOPLAY_MS}ms linear forwards`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}