import React, { useEffect, useState } from 'react';
import Pagination from '../commn/Pagination';
import ServiceGrid from '../ServiceGrid';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ScreenShare, Users, Search, ArrowRight } from 'lucide-react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    Stack,
    InputAdornment,
    Alert,
    Collapse,
    CircularProgress,
    GlobalStyles,
} from '@mui/material';

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

function Services() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [services, setServices] = useState([]);
    const navigate = useNavigate();
    let user = JSON.parse(localStorage.getItem('user'));

    const fetchServices = async () => {
        try {
            let res = await axiosInstance.get("/service/ext-list", {
                params: { search, page, limit }
            });
            console.log("User", user);
            if (user) {
                res = await axiosInstance.get("/service/list", {
                    params: { search, page, limit }
                });
            }
            console.log("services res:", res);
            const serviceData = res?.data?.data?.services || [];
            const totalCount = res?.data?.data?.count || 0;

            setServices(serviceData);
            setTotalPages(Math.ceil(totalCount / limit));

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to load Services");
        }
    };

    useEffect(() => {
        fetchServices();
    }, [page, search]);

    // service footer details
    const servicefooter = [
        {
            title: "Customized Hiring Solutions",
            desc: "Tailored Approaches To Meet Your Specific Recruitment Needs.",
            logo: <ScreenShare size={26} />
        },
        {
            title: "Thorough Verification Processes",
            desc: "Comprehensive Checks To Ensure Trust And Reliability.",
            logo: <ClipboardList size={26} />
        },
        {
            title: "Informed Decision-Making",
            desc: "Data-Driven Insights For Smarter Hiring And Business Choices.",
            logo: <Users size={26} />
        },
    ];

    // mail config
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        subject: "Consultation",
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

    const deleteServiceHandler = async (id) => {
        try {
            console.log("id:", id);
            const response = await axiosInstance.post(`/service/delete`,
                {
                    id
                }
            );
            console.log(response);
            fetchServices();
        }
        catch (error) {
            console.log("Error sending contact form:", error.response);
            setErrorMsg("Unable to reach the server. Please try again later.");
            setStatus("error");
        }
    }

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
                                Our Services
                            </Typography>
                        </Box>
                        <Typography
                            sx={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 800,
                                fontSize: { xs: 36, md: 52 },
                                letterSpacing: "-0.02em",
                                maxWidth: 620,
                            }}
                        >
                            Explore Our Range Of Services
                        </Typography>
                    </Container>
                </Box>

                {/* ── CONSULTING SERVICES ── */}
                <Box sx={{ py: { xs: 8, md: 11 } }}>
                    <Container maxWidth="lg">
                        <Box sx={{ mb: { xs: 4, md: 5 } }}>
                            <Typography
                                sx={{
                                    fontSize: 12.5,
                                    fontWeight: 700,
                                    letterSpacing: "0.14em",
                                    color: AMBER,
                                    textTransform: "uppercase",
                                    mb: 1.5,
                                }}
                            >
                                Our Solution
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 700,
                                    fontSize: { xs: 26, md: 34 },
                                }}
                            >
                                Consulting Services
                            </Typography>
                        </Box>

                        {/* FILTER */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: 2,
                                alignItems: { sm: "center" },
                                justifyContent: "space-between",
                                mb: 5,
                            }}
                        >
                            <TextField
                                placeholder="Search services..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                sx={{ ...fieldSx, width: { xs: "100%", sm: 340 } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search size={18} color={MUTED} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {['admin', 'superadmin'].includes(user?.role) && (
                                <Button
                                    onClick={() => navigate('/service/add')}
                                    sx={{
                                        bgcolor: AMBER,
                                        color: INK,
                                        fontWeight: 700,
                                        fontSize: 14,
                                        textTransform: "none",
                                        borderRadius: "10px",
                                        px: 3,
                                        py: 1.2,
                                        boxShadow: "none",
                                        whiteSpace: "nowrap",
                                        "&:hover": { bgcolor: AMBER },
                                    }}
                                >
                                    + Add Service
                                </Button>
                            )}
                        </Box>

                        {/* GRID */}
                        <Box
                            sx={{
                                "& > *": {
                                    // ServiceGrid is an external component; give its cards a consistent frame
                                },
                            }}
                        >
                            <ServiceGrid services={services} user={user} deleteService={deleteServiceHandler} />
                        </Box>

                        {/* PAGINATION */}
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                            <Pagination
                                page={page}
                                setPage={setPage}
                                totalPages={totalPages}
                            />
                        </Box>
                    </Container>
                </Box>

                {/* ── QUOTE / CONTACT BAND ── */}
                <Box sx={{ pb: { xs: 8, md: 11 } }}>
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
                            {/* left tag panel */}
                            <Box
                                sx={{
                                    flex: { md: "0 0 38%" },
                                    bgcolor: INK,
                                    background: `linear-gradient(155deg, ${INK} 0%, ${INK_SOFT} 100%)`,
                                    color: "#fff",
                                    p: { xs: 4, md: 6 },
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
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
                                    Get In Touch
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 700,
                                        fontSize: { xs: 26, md: 30 },
                                    }}
                                >
                                    Free Consultation
                                </Typography>
                            </Box>

                            {/* right form panel */}
                            <Box sx={{ flex: 1, p: { xs: 4, md: 6 }, bgcolor: "#fff" }}>
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
                                                <ArrowRight size={18} />
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

                {/* ── BOTTOM SECTION ── */}
                <Box sx={{ pb: { xs: 10, md: 14 } }}>
                    <Container maxWidth="lg">
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: { xs: 6, md: 8 } }}>

                            {/* LEFT CONTENT */}
                            <Box sx={{ flex: { md: "0 0 36%" } }}>
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
                                    Advance Solutions
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 700,
                                        fontSize: { xs: 30, md: 38 },
                                        lineHeight: 1.2,
                                        mb: 2.5,
                                    }}
                                >
                                    We Assist With Strategic Planning
                                </Typography>
                                <Typography sx={{ fontSize: 15, lineHeight: 1.8, color: MUTED }}>
                                    Tailored Hiring And Verification Strategies For Efficient
                                    Processes And Informed Decisions.
                                </Typography>
                            </Box>

                            {/* RIGHT — icon cards */}
                            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>
                                {servicefooter.map((item, index) => (
                                    <Paper
                                        key={index}
                                        elevation={0}
                                        sx={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 2.5,
                                            p: { xs: 3, md: 3.5 },
                                            borderRadius: "16px",
                                            border: `1px solid ${LINE}`,
                                            boxShadow: "0 16px 34px -24px rgba(11,43,51,0.25)",
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 52,
                                                height: 52,
                                                bgcolor: "rgba(242,166,90,0.15)",
                                                color: AMBER,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {item.logo}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 700, fontSize: 17, mb: 0.75, color: INK }}>
                                                {item.title}
                                            </Typography>
                                            <Typography sx={{ fontSize: 14.5, lineHeight: 1.7, color: MUTED }}>
                                                {item.desc}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </>
    );
}

export default Services;