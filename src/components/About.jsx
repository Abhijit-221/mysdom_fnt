import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    Paper,
    Avatar,
    Fade,
    Grow,
    GlobalStyles,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardRounded";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import { useNavigate } from "react-router-dom";

// ── Brand-locked tokens ──
const INK = "#0B2B33";
const AMBER = "#F2A65A";
const CREAM = "#FBF6EF";
const LINE = "rgba(11,43,51,0.08)";
const MUTED = "#5C7178";

// Reveals a section once it scrolls into view, then leaves it alone
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
            { threshold: 0.18 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return [ref, visible];
};

const robustCardSx = {
    borderRadius: "20px",
    border: `1px solid ${LINE}`,
    boxShadow: "0 20px 45px -25px rgba(11,43,51,0.25)",
    overflow: "hidden",
    transition: "transform 0.35s ease, box-shadow 0.35s ease",
    "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0 28px 55px -22px rgba(11,43,51,0.32)",
    },
};

// shared flex-row layout for the image/content split cards
const splitRowSx = {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
};

const halfSx = {
    flex: { xs: "1 1 auto", md: "1 1 50%" },
    minWidth: 0,
};

const FeatureChip = ({ icon, label }) => (
    <Stack direction="row" spacing={1.25} alignItems="center">
        <Avatar sx={{ width: 30, height: 30, bgcolor: "rgba(242,166,90,0.15)", color: AMBER }}>
            {icon}
        </Avatar>
        <Typography sx={{ fontSize: 14, color: INK, fontWeight: 500 }}>{label}</Typography>
    </Stack>
);

const About = () => {
    const navigate = useNavigate();

    const [heroRef, heroVisible] = useReveal();
    const [companyRef, companyVisible] = useReveal();
    const [whoRef, whoVisible] = useReveal();
    const [ctaRef, ctaVisible] = useReveal();
    const [historyRef, historyVisible] = useReveal();

    return (
        <>
            <GlobalStyles
                styles={{
                    "@import":
                        "url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap')",
                    "@keyframes floatY": {
                        "0%, 100%": { transform: "translateY(0px)" },
                        "50%": { transform: "translateY(-10px)" },
                    },
                }}
            />
            <Box sx={{ fontFamily: "'Inter', sans-serif", bgcolor: CREAM, color: INK, overflow: "hidden" }}>

                {/* ── HERO ── */}
                <Box
                    ref={heroRef}
                    sx={{
                        position: "relative",
                        bgcolor: INK,
                        background: `linear-gradient(155deg, ${INK} 0%, #123B45 100%)`,
                        color: "#fff",
                        py: { xs: 10, md: 14 },
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: -90,
                            right: "8%",
                            width: 260,
                            height: 260,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, ${AMBER} 0%, rgba(242,166,90,0) 70%)`,
                            opacity: 0.4,
                            animation: "floatY 6s ease-in-out infinite",
                        }}
                    />
                    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                        <Fade in={heroVisible} timeout={700}>
                            <Box>
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.25, mb: 3 }}>
                                    <Typography
                                        onClick={() => navigate("/")}
                                        sx={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", cursor: "pointer" }}
                                    >
                                        Home
                                    </Typography>
                                    <Typography sx={{ fontSize: 13.5, color: "rgba(255,255,255,0.3)" }}>/</Typography>
                                    <Typography sx={{ fontSize: 13.5, color: AMBER, fontWeight: 600 }}>
                                        About Us
                                    </Typography>
                                </Box>
                                <Typography
                                    sx={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 800,
                                        fontSize: { xs: 40, md: 58 },
                                        letterSpacing: "-0.02em",
                                        maxWidth: 640,
                                    }}
                                >
                                    Building Trust, One Verification at a Time
                                </Typography>
                                <Typography sx={{ mt: 2.5, color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 480 }}>
                                    Consulting, hiring, and background verification services
                                    designed around your business's peace of mind.
                                </Typography>
                            </Box>
                        </Fade>
                    </Container>
                </Box>

                {/* ── ABOUT COMPANY — robust card, content left / image right ── */}
                <Box ref={companyRef} sx={{ py: { xs: 8, md: 12 } }}>
                    <Container maxWidth="lg">
                        <Grow in={companyVisible} timeout={800}>
                            <Paper elevation={0} sx={robustCardSx}>
                                <Box sx={splitRowSx}>

                                    <Box sx={{ ...halfSx, p: { xs: 4, md: 6 } }}>
                                        <Typography
                                            sx={{
                                                fontSize: 12.5,
                                                fontWeight: 700,
                                                letterSpacing: "0.14em",
                                                color: AMBER,
                                                textTransform: "uppercase",
                                                mb: 2,
                                            }}
                                        >
                                            About Our Company
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                fontWeight: 700,
                                                fontSize: { xs: 24, md: 29 },
                                                lineHeight: 1.3,
                                                mb: 2.5,
                                            }}
                                        >
                                            Discover How Our Consulting Drives Business Success.
                                        </Typography>
                                        <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: MUTED, mb: 3 }}>
                                            At Mysdom, we are dedicated to helping businesses grow by
                                            providing expert consulting, tailored hiring solutions through
                                            background verification. Our priority is ensuring that companies
                                            can make secure and informed decisions when it comes to hiring
                                            employees, tenants, or partners. We specialize in comprehensive
                                            background checks — education, employment, criminal, and
                                            identity — so you can build relationships you trust.
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                                            <Box sx={{ flex: "1 1 50%" }}>
                                                <FeatureChip icon={<VerifiedUserOutlinedIcon sx={{ fontSize: 16 }} />} label="Verified hiring outcomes" />
                                            </Box>
                                            <Box sx={{ flex: "1 1 50%" }}>
                                                <FeatureChip icon={<TrendingUpOutlinedIcon sx={{ fontSize: 16 }} />} label="Long-term growth focus" />
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ ...halfSx, position: "relative" }}>
                                        <Box
                                            component="img"
                                            src="/home1.webp"
                                            alt="meeting"
                                            sx={{ width: "100%", height: "100%", minHeight: { xs: 220, md: 0 }, objectFit: "cover", display: "block" }}
                                        />
                                        <Avatar
                                            sx={{
                                                position: "absolute",
                                                bottom: -22,
                                                right: 24,
                                                width: 56,
                                                height: 56,
                                                bgcolor: AMBER,
                                                color: INK,
                                                border: `4px solid #fff`,
                                                boxShadow: "0 8px 18px rgba(11,43,51,0.25)",
                                            }}
                                        >
                                            <WorkspacePremiumOutlinedIcon />
                                        </Avatar>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grow>
                    </Container>
                </Box>

                {/* ── WHO WE ARE — robust card, image left / content right ── */}
                <Box ref={whoRef} sx={{ pb: { xs: 8, md: 12 } }}>
                    <Container maxWidth="lg">
                        <Grow in={whoVisible} timeout={800}>
                            <Paper elevation={0} sx={robustCardSx}>
                                <Box sx={splitRowSx}>
                                    <Box sx={{ ...halfSx, position: "relative" }}>
                                        <Box
                                            component="img"
                                            src="/about-9.jpg"
                                            alt="team"
                                            sx={{ width: "100%", height: "100%", minHeight: { xs: 220, md: 0 }, objectFit: "cover", display: "block" }}
                                        />
                                        <Avatar
                                            sx={{
                                                position: "absolute",
                                                bottom: -22,
                                                left: 24,
                                                width: 56,
                                                height: 56,
                                                bgcolor: AMBER,
                                                color: INK,
                                                border: `4px solid #fff`,
                                                boxShadow: "0 8px 18px rgba(11,43,51,0.25)",
                                            }}
                                        >
                                            <GroupsOutlinedIcon />
                                        </Avatar>
                                    </Box>
                                    <Box sx={{ ...halfSx, p: { xs: 4, md: 6 } }}>
                                        <Typography
                                            sx={{
                                                fontSize: 12.5,
                                                fontWeight: 700,
                                                letterSpacing: "0.14em",
                                                color: AMBER,
                                                textTransform: "uppercase",
                                                mb: 2,
                                            }}
                                        >
                                            Who We Are
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                fontWeight: 700,
                                                fontSize: { xs: 24, md: 29 },
                                                lineHeight: 1.3,
                                                mb: 2.5,
                                            }}
                                        >
                                            Your Trusted Partner In Business Success
                                        </Typography>
                                        <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: MUTED, mb: 3 }}>
                                            We are your trusted partner, offering reliable background
                                            verification services that ensure secure hires and
                                            partnerships, helping businesses grow with confidence and
                                            informed decision-making.
                                        </Typography>
                                        <FeatureChip icon={<HandshakeOutlinedIcon sx={{ fontSize: 16 }} />} label="Industry-standard verification processes" />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grow>
                    </Container>
                </Box>

                {/* ── CTA ── */}
                <Box ref={ctaRef} sx={{ pb: { xs: 8, md: 12 } }}>
                    <Container maxWidth="lg">
                        <Grow in={ctaVisible} timeout={800}>
                            <Box
                                sx={{
                                    position: "relative",
                                    bgcolor: INK,
                                    background: `linear-gradient(155deg, #123B45 0%, ${INK} 100%)`,
                                    color: "#fff",
                                    borderRadius: "20px",
                                    py: { xs: 6, md: 7 },
                                    px: { xs: 4, md: 7 },
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: { xs: "column", md: "row" },
                                    justifyContent: "space-between",
                                    alignItems: { xs: "flex-start", md: "center" },
                                    gap: 3.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: -70,
                                        left: "10%",
                                        width: 200,
                                        height: 200,
                                        borderRadius: "50%",
                                        background: `radial-gradient(circle, ${AMBER} 0%, rgba(242,166,90,0) 70%)`,
                                        opacity: 0.3,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 700,
                                        fontSize: { xs: 24, md: 30 },
                                        position: "relative",
                                        zIndex: 1,
                                        maxWidth: 480,
                                    }}
                                >
                                    Innovate Strategies, Reach Milestones
                                </Typography>
                                <Button
                                    onClick={() => navigate("/contact")}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        position: "relative",
                                        zIndex: 1,
                                        bgcolor: AMBER,
                                        color: INK,
                                        fontWeight: 700,
                                        fontSize: 14,
                                        letterSpacing: "0.02em",
                                        textTransform: "none",
                                        borderRadius: "10px",
                                        px: 3.5,
                                        py: 1.5,
                                        boxShadow: "none",
                                        whiteSpace: "nowrap",
                                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                        "&:hover": {
                                            bgcolor: AMBER,
                                            transform: "scale(1.05)",
                                            boxShadow: "0 10px 24px -8px rgba(242,166,90,0.6)",
                                        },
                                    }}
                                >
                                    Get Free Consultations
                                </Button>
                            </Box>
                        </Grow>
                    </Container>
                </Box>

                {/* ── HISTORY / TIMELINE — robust card, image left / content right ── */}
                <Box ref={historyRef} sx={{ pb: { xs: 10, md: 14 } }}>
                    <Container maxWidth="lg">
                        <Fade in={historyVisible} timeout={600}>
                            <Box sx={{ mb: { xs: 4, md: 5 } }}>
                                <Typography
                                    sx={{
                                        fontSize: 12.5,
                                        fontWeight: 700,
                                        letterSpacing: "0.14em",
                                        color: AMBER,
                                        textTransform: "uppercase",
                                        mb: 2,
                                    }}
                                >
                                    Our History
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 700,
                                        fontSize: { xs: 24, md: 30 },
                                    }}
                                >
                                    Our Company History
                                </Typography>
                            </Box>
                        </Fade>

                        <Grow in={historyVisible} timeout={900}>
                            <Paper elevation={0} sx={robustCardSx}>
                                <Box sx={splitRowSx}>
                                    <Box sx={halfSx}>
                                        <Box
                                            component="img"
                                            src="/company.webp"
                                            alt="history"
                                            sx={{ width: "100%", height: { xs: 240, md: "100%" }, minHeight: { xs: 240, md: 0 }, objectFit: "cover", display: "block" }}
                                        />
                                    </Box>
                                    <Box sx={halfSx}>
                                        <Box sx={{ p: { xs: 4, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
                                            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, mb: 2.5 }}>
                                                <Avatar sx={{ bgcolor: "rgba(242,166,90,0.15)", color: AMBER, width: 46, height: 46 }}>
                                                    <HistoryEduOutlinedIcon />
                                                </Avatar>
                                                <Typography
                                                    sx={{
                                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                        fontWeight: 800,
                                                        fontSize: 30,
                                                        color: AMBER,
                                                    }}
                                                >
                                                    2024
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 1.5 }}>
                                                Company Inception
                                            </Typography>
                                            <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: MUTED }}>
                                                Mysdom offers expert business consulting, hiring, and
                                                verification services, helping companies make informed
                                                decisions and achieve lasting success.
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grow>
                    </Container>
                </Box>
            </Box>
        </>
    );
};

export default About;