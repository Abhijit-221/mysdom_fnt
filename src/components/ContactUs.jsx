import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    Alert,
    Collapse,
    CircularProgress,
    GlobalStyles,
} from "@mui/material";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardRounded";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

// ── Brand-locked tokens ──
const INK = "#0B2B33";
const INK_SOFT = "#123B45";
const AMBER = "#F2A65A";
const CREAM = "#FBF6EF";
const LINE = "rgba(11,43,51,0.08)";
const MUTED = "#5C7178";

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        "& fieldset": { borderColor: "rgba(11,43,51,0.15)" },
        "&.Mui-focused fieldset": { borderColor: AMBER, borderWidth: "2px" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: INK },
};

const ContactUs = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { fullName, email, subject, message } = form;

        if (!fullName || !email || !subject || !message) {
            setErrorMsg("Please fill in all fields.");
            setStatus("error");
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        try {
            const response = await axiosInstance.post("/mail/send", { fullName, email, subject, message });
            const data = response.data;

            if (data.success === true) {
                setStatus("success");
                setForm({ fullName: "", email: "", subject: "", message: "" });
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setErrorMsg(data.error || "Something went wrong. Please try again.");
                setStatus("error");
            }
        } catch (err) {
            console.log("Error sending contact form:", err);
            setErrorMsg("Unable to reach the server. Please try again later.");
            setStatus("error");
        }
    };

    const infoCards = [
        {
            icon: <CallOutlinedIcon />,
            title: "Talk To Us",
            content: "+91 7077669661",
            href: "tel:+917077669661",
        },
        {
            icon: <MailOutlineRoundedIcon />,
            title: "Reach Out To Us",
            content: "contactus@mysdom.com",
            href: "mailto:contactus@mysdom.com",
        },
        {
            icon: <LocationOnOutlinedIcon />,
            title: "Office Location",
            content: "Plot No.89, State Bank Of India Complex, Satya Nagar, Bhubaneswar - 751007",
            href: null,
        },
    ];

    return (
        <>
            <GlobalStyles
                styles={{
                    "@import":
                        "url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap')",
                }}
            />
            <Box sx={{ fontFamily: "'Inter', sans-serif", bgcolor: CREAM, color: INK }}>

                {/* ── HERO ── */}
                <Box
                    sx={{
                        position: "relative",
                        bgcolor: INK,
                        background: `linear-gradient(155deg, ${INK} 0%, ${INK_SOFT} 100%)`,
                        color: "#fff",
                        py: { xs: 9, md: 13 },
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
                        }}
                    />
                    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1.25, mb: 3 }}>
                            <Typography
                                onClick={() => navigate('/')}
                                sx={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", cursor: "pointer" }}
                            >
                                Home
                            </Typography>
                            <Typography sx={{ fontSize: 13.5, color: "rgba(255,255,255,0.3)" }}>/</Typography>
                            <Typography sx={{ fontSize: 13.5, color: AMBER, fontWeight: 600 }}>
                                Contact
                            </Typography>
                        </Box>
                        <Typography
                            sx={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 800,
                                fontSize: { xs: 40, md: 56 },
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Contact Us
                        </Typography>
                    </Container>
                </Box>

                {/* ── MAP + FORM ── */}
                <Box sx={{ py: { xs: 8, md: 11 } }}>
                    <Container maxWidth="lg">
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: "20px",
                                border: `1px solid ${LINE}`,
                                boxShadow: "0 20px 45px -25px rgba(11,43,51,0.25)",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                            }}
                        >
                            {/* MAP */}
                            <Box sx={{ flex: { md: "0 0 42%" }, minHeight: { xs: 260, md: "auto" } }}>
                                <Box
                                    component="iframe"
                                    title="map"
                                    src="https://maps.google.com/maps?q=Satya%20Nagar%20Bhubaneswar&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        minHeight: { xs: 260, md: 520 },
                                        border: 0,
                                        display: "block",
                                    }}
                                />
                            </Box>

                            {/* FORM */}
                            <Box sx={{ flex: 1, p: { xs: 4, md: 6 } }}>
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
                                    Request A Call Back
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 700,
                                        fontSize: { xs: 24, md: 29 },
                                        mb: 3,
                                    }}
                                >
                                    Contact About Your Queries.
                                </Typography>

                                <Collapse in={status === "success"}>
                                    <Alert severity="success" sx={{ mb: 2.5, borderRadius: "10px" }}>
                                        Message sent successfully! We'll get back to you soon.
                                    </Alert>
                                </Collapse>
                                <Collapse in={status === "error"}>
                                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }}>
                                        {errorMsg}
                                    </Alert>
                                </Collapse>

                                <Box component="form" onSubmit={handleSubmit} noValidate>
                                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            disabled={status === "loading"}
                                            required
                                            sx={fieldSx}
                                        />
                                        <TextField
                                            fullWidth
                                            type="email"
                                            label="Email Address"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            disabled={status === "loading"}
                                            required
                                            sx={fieldSx}
                                        />
                                    </Box>

                                    <TextField
                                        fullWidth
                                        label="Subject"
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleChange}
                                        disabled={status === "loading"}
                                        required
                                        sx={{ mb: 2, ...fieldSx }}
                                    />

                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={5}
                                        label="Message"
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        disabled={status === "loading"}
                                        required
                                        sx={{ mb: 3, ...fieldSx }}
                                    />

                                    <Button
                                        type="submit"
                                        disabled={status === "loading"}
                                        endIcon={
                                            status === "loading" ? (
                                                <CircularProgress size={16} sx={{ color: INK }} />
                                            ) : (
                                                <ArrowForwardIcon />
                                            )
                                        }
                                        sx={{
                                            bgcolor: AMBER,
                                            color: INK,
                                            fontWeight: 700,
                                            fontSize: 14,
                                            letterSpacing: "0.02em",
                                            textTransform: "uppercase",
                                            borderRadius: "10px",
                                            px: 3.5,
                                            py: 1.4,
                                            boxShadow: "none",
                                            "&:hover": { bgcolor: AMBER },
                                            "&.Mui-disabled": {
                                                bgcolor: "rgba(242,166,90,0.5)",
                                                color: INK,
                                            },
                                        }}
                                    >
                                        {status === "loading" ? "Sending" : "Submit Message"}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Container>
                </Box>

                {/* ── CONTACT INFO CARDS ── */}
                <Box sx={{ pb: { xs: 10, md: 14 } }}>
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 3,
                            }}
                        >
                            {infoCards.map((card, index) => (
                                <Paper
                                    key={index}
                                    elevation={0}
                                    sx={{
                                        flex: "1 1 0",
                                        p: { xs: 3.5, md: 4 },
                                        borderRadius: "16px",
                                        border: `1px solid ${LINE}`,
                                        boxShadow: "0 16px 34px -24px rgba(11,43,51,0.25)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: "rgba(242,166,90,0.15)",
                                            color: AMBER,
                                            mb: 2.5,
                                        }}
                                    >
                                        {card.icon}
                                    </Avatar>
                                    <Typography sx={{ fontWeight: 700, fontSize: 17, color: INK, mb: 1 }}>
                                        {card.title}
                                    </Typography>
                                    {card.href ? (
                                        <Typography
                                            component="a"
                                            href={card.href}
                                            sx={{
                                                fontSize: 14.5,
                                                color: MUTED,
                                                textDecoration: "none",
                                            }}
                                        >
                                            {card.content}
                                        </Typography>
                                    ) : (
                                        <Typography sx={{ fontSize: 14.5, lineHeight: 1.7, color: MUTED }}>
                                            {card.content}
                                        </Typography>
                                    )}
                                </Paper>
                            ))}
                        </Box>
                    </Container>
                </Box>
            </Box>
        </>
    );
};

export default ContactUs;