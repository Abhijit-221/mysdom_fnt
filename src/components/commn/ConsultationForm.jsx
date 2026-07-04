import React, { useState } from "react";
import {
    Box,
    Grid,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    Collapse,
    CircularProgress,
    Avatar,
    Stack,
    GlobalStyles,
} from "@mui/material";
import CallIcon from "@mui/icons-material/CallOutlined";
import MailIcon from "@mui/icons-material/MailOutlineRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardRounded";
import HandshakeIcon from "@mui/icons-material/HandshakeRounded";
import axiosInstance from "../../api/axiosInstance";

// ── Theme tokens (do not change — client brand colors) ──
const INK = "#0B2B33";   // deep teal — grounding, authority
const AMBER = "#F2A65A"; // warm amber — signal, accent
const CREAM = "#FBF6EF"; // paper background
const INK_SOFT = "#123B45"; // lighter teal for panel gradient
const MUTED = "#5C7178"; // muted teal-grey for secondary text

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        "& fieldset": { borderColor: "rgba(11,43,51,0.15)" },
        "&:hover fieldset": { borderColor: AMBER },
        "&.Mui-focused fieldset": { borderColor: AMBER, borderWidth: "2px" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: INK },
};

const ContactSection = () => {
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

    return (
        <>
            <GlobalStyles
                styles={{
                    "@import": "url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap')",
                }}
            />
            <Box
                component="section"
                sx={{
                    bgcolor: CREAM,
                    py: { xs: 8, md: 12 },
                    px: { xs: 2, sm: 4, md: 8 },
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <Grid sx={{
                    display:'flex'
                }}>
                    {/* ── DARK PANEL: pitch + contact channels ── */}
                    <Grid item  md={6}>
                        <Box
                            sx={{
                                position: "relative",
                                height: "100%",
                                bgcolor: INK,
                                background: `linear-gradient(155deg, ${INK} 0%, ${INK_SOFT} 100%)`,
                                borderRadius: { xs: "20px 20px 0 0", md: "20px 0 0 20px" },
                                color: "#fff",
                                p: { xs: 4, md: 6 },
                                pr: { md: 8 },
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                minHeight: { md: 480 },
                            }}
                        >
                            {/* signature glow */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: -60,
                                    right: -60,
                                    width: 220,
                                    height: 220,
                                    borderRadius: "50%",
                                    background: `radial-gradient(circle, ${AMBER} 0%, rgba(242,166,90,0) 70%)`,
                                    opacity: 0.55,
                                }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: -40,
                                    right: 40,
                                    width: 3,
                                    height: 120,
                                    bgcolor: "rgba(242,166,90,0.4)",
                                    display: { xs: "none", md: "block" },
                                }}
                            />

                            <Box sx={{ position: "relative", zIndex: 1 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                                    <Box sx={{ width: 28, height: 2, bgcolor: AMBER }} />
                                    <Typography
                                        sx={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            letterSpacing: "0.18em",
                                            color: AMBER,
                                        }}
                                    >
                                        GET IN TOUCH
                                    </Typography>
                                </Stack>

                                <Typography
                                    sx={{
                                        fontFamily: "'Fraunces', serif",
                                        fontWeight: 600,
                                        fontSize: { xs: 34, md: 42 },
                                        lineHeight: 1.15,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Unlock your small
                                    business potential with
                                    tailored consulting.
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 2.5,
                                        color: "rgba(255,255,255,0.65)",
                                        fontSize: 15,
                                        maxWidth: 360,
                                    }}
                                >
                                    Tell us where things stand and where you want to be.
                                    A strategist replies within one business day.
                                </Typography>
                            </Box>

                            <Stack spacing={2.5} sx={{ position: "relative", zIndex: 1 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: "rgba(242,166,90,0.15)", color: AMBER, width: 44, height: 44 }}>
                                        <CallIcon fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)" }}>
                                            Talk to us
                                        </Typography>
                                        <Typography sx={{ fontSize: 15.5, fontWeight: 600 }}>
                                            +91 7077669661
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: "rgba(242,166,90,0.15)", color: AMBER, width: 44, height: 44 }}>
                                        <MailIcon fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)" }}>
                                            Reach out to us
                                        </Typography>
                                        <Typography sx={{ fontSize: 15.5, fontWeight: 600 }}>
                                            contactus@mysdom.com
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </Grid>

                    {/* ── FORM CARD: overlaps the dark panel like a slipped-out card ── */}
                    <Grid item  md={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                position: "relative",
                                height: "100%",
                                bgcolor: "#fff",
                                borderRadius: { xs: "0 0 20px 20px", md: "0 20px 20px 0" },
                                border: "1px solid rgba(11,43,51,0.08)",
                                borderLeft: { md: "none" },
                                p: { xs: 4, md: 6 },
                                pl: { md: 8 },
                                boxShadow: { md: "0 30px 60px -20px rgba(11,43,51,0.18)" },
                            }}
                        >
                            {/* wax-seal style badge marking the handoff point between panels */}
                            <Avatar
                                sx={{
                                    display: { xs: "none", md: "flex" },
                                    position: "absolute",
                                    left: -28,
                                    top: 48,
                                    width: 56,
                                    height: 56,
                                    bgcolor: AMBER,
                                    color: INK,
                                    border: `4px solid ${CREAM}`,
                                    boxShadow: "0 6px 16px rgba(11,43,51,0.25)",
                                }}
                            >
                                <HandshakeIcon />
                            </Avatar>

                            <Typography
                                sx={{
                                    fontFamily: "'Fraunces', serif",
                                    fontWeight: 600,
                                    fontSize: 24,
                                    color: INK,
                                    mb: 3,
                                }}
                            >
                                Free Consultation
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
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
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
                                </Stack>

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
                                    fullWidth
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
                                        fontWeight: 600,
                                        fontSize: 14.5,
                                        letterSpacing: "0.04em",
                                        py: 1.5,
                                        borderRadius: "10px",
                                        textTransform: "uppercase",
                                        boxShadow: "none",
                                        "&:hover": {
                                            bgcolor: "#E4934A",
                                            boxShadow: "none",
                                        },
                                        "&.Mui-disabled": {
                                            bgcolor: "rgba(242,166,90,0.5)",
                                            color: INK,
                                        },
                                    }}
                                >
                                    {status === "loading" ? "Sending" : "Submit Message"}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default ContactSection;