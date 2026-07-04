import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Stack,
    IconButton,
    Divider,
    GlobalStyles,
} from "@mui/material";
import { PiLinkedinLogo } from "react-icons/pi";
import { BsTwitter } from "react-icons/bs";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // was referenced but not imported in the original file
import axiosInstance from "../api/axiosInstance";

// ── Theme tokens (brand-locked) ──
const INK = "#0B2B33";
const INK_SOFT = "#123B45";
const AMBER = "#F2A65A";

const Footer = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axiosInstance.get("/service/get", {});
                const serviceData = res?.data?.data || [];
                console.log("services res:", res);
                setServices(serviceData);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to load Services");
            }
        };
        fetchServices();
    }, []);

    return (
        <>
            <GlobalStyles
                styles={{
                    "@import":
                        "url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600&display=swap')",
                }}
            />
            <Box
                component="footer"
                id="contact"
                sx={{
                    position: "relative",
                    bgcolor: INK,
                    background: `linear-gradient(160deg, ${INK} 0%, ${INK_SOFT} 100%)`,
                    color: "rgba(255,255,255,0.85)",
                    fontFamily: "'Inter', sans-serif",
                    overflow: "hidden",
                    pt: { xs: 7, md: 9 },
                }}
            >
                {/* signature glow, echoes the contact panel above it on the page */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -120,
                        left: "8%",
                        width: 320,
                        height: 320,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${AMBER} 0%, rgba(242,166,90,0) 70%)`,
                        opacity: 0.14,
                        pointerEvents: "none",
                    }}
                />

                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Grid container spacing={{ xs: 5, md: 4 }}>
                        {/* ── Company / About ── */}
                        <Grid item xs={12} md={4}>
                            <Typography
                                sx={{
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 600,
                                    fontSize: 22,
                                    color: "#fff",
                                    mb: 2,
                                }}
                            >
                                About <Box component="span" sx={{ color: AMBER }}>Us</Box>
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 14.5,
                                    lineHeight: 1.7,
                                    color: "rgba(255,255,255,0.6)",
                                    maxWidth: 340,
                                }}
                            >
                                At Mysdom, we thrive to help our clients' business grow by
                                providing expert consulting and tailored hiring through our
                                Smart Screening solutions — at par with industry-standard
                                background verification services.
                            </Typography>

                            <Stack direction="row" spacing={1.25} sx={{ mt: 3.5 }}>
                                <IconButton
                                    component="a"
                                    href="#"
                                    size="small"
                                    disableRipple
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        color: "#fff",
                                        border: "1px solid rgba(255,255,255,0.18)",
                                        "&:hover": { bgcolor: "transparent" },
                                    }}
                                >
                                    <BsTwitter size={15} />
                                </IconButton>
                                <IconButton
                                    component="a"
                                    href="https://www.linkedin.com/company/mysdom/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="small"
                                    disableRipple
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        color: "#fff",
                                        border: "1px solid rgba(255,255,255,0.18)",
                                        "&:hover": { bgcolor: "transparent" },
                                    }}
                                >
                                    <PiLinkedinLogo size={16} />
                                </IconButton>
                            </Stack>
                        </Grid>

                        {/* ── Services (dynamic) ── */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography
                                sx={{
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    letterSpacing: "0.14em",
                                    color: AMBER,
                                    mb: 2.5,
                                }}
                            >
                                SERVICES
                            </Typography>
                            <Stack spacing={1.4} component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                                {services.length > 0 ? (
                                    services.map((service) => (
                                        <Typography
                                            key={service.id}
                                            component="li"
                                            onClick={() => navigate(`/service/detail/${service.id}`)}
                                            sx={{
                                                fontSize: 14.5,
                                                color: "rgba(255,255,255,0.65)",
                                                cursor: "pointer",
                                                width: "fit-content",
                                            }}
                                        >
                                            {service.name}
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>
                                        Loading services…
                                    </Typography>
                                )}
                            </Stack>
                        </Grid>

                        {/* ── Contact Details ── */}
                        <Grid item xs={12} sm={6} md={5}>
                            <Typography
                                sx={{
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    letterSpacing: "0.14em",
                                    color: AMBER,
                                    mb: 2.5,
                                }}
                            >
                                CONTACT DETAILS
                            </Typography>
                            <Stack spacing={2}>
                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                    <LocationOnOutlinedIcon sx={{ color: AMBER, fontSize: 20, mt: 0.2 }} />
                                    <Typography sx={{ fontSize: 14.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                                        Plot No. 89, State Bank of India Complex, Satya Nagar,
                                        Bhubaneswar – 751007
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <CallOutlinedIcon sx={{ color: AMBER, fontSize: 20 }} />
                                    <Typography sx={{ fontSize: 14.5, color: "rgba(255,255,255,0.7)" }}>
                                        +91 7077669661
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <MailOutlineRoundedIcon sx={{ color: AMBER, fontSize: 20 }} />
                                    <Typography sx={{ fontSize: 14.5, color: "rgba(255,255,255,0.7)" }}>
                                        contactus@mysdom.com
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mt: { xs: 6, md: 7 } }} />

                <Container maxWidth="lg">
                    <Box
                        sx={{
                            py: 2.75,
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 1,
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                            Copyright 2024 Mysdom — All Rights Reserved
                        </Typography>
                        <Box sx={{ width: 28, height: 2, bgcolor: AMBER, opacity: 0.6 }} />
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Footer;