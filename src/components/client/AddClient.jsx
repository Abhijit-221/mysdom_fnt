import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    GlobalStyles,
} from "@mui/material";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

// ── Brand-locked tokens ──
const INK = "#0B2B33";
const INK_SOFT = "#123B45";
const AMBER = "#F2A65A";
const LINE = "rgba(11,43,51,0.1)";
const MUTED = "#5C7178";

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        "& fieldset": { borderColor: LINE },
        "&.Mui-focused fieldset": { borderColor: AMBER, borderWidth: "2px" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: INK },
};

const AddClient = () => {
    const [client, setClient] = useState({
        companyName: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
        slaDays: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setClient({
            ...client,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!client.companyName || !client.contactEmail || !client.contactPhone || !client.address || !client.slaDays) {
                toast.error("Please fill all required fields");
                return;
            }
            console.log('client details:', client);
            const response = await axiosInstance.post("/client/add", client);
            toast.success(response.data.message || "Client added successfully");
            onCancel(); // Close the form after successful submission
            navigate('/clients'); // Redirect to client list page
        }
        catch (err) {
            toast.error(err.response?.data?.message || "Failed to add client");
        }
    };

    const onCancel = () => {
        setClient({
            companyName: "",
            contactEmail: "",
            contactPhone: "",
            address: "",
            slaDays: ""
        });
        navigate('/clients');
    };

    return (
        <>
            <GlobalStyles
                styles={{
                    "@import":
                        "url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap')",
                }}
            />
            <Box
                sx={{
                    fontFamily: "'Inter', sans-serif",
                    bgcolor: "#F5F1E9",
                    minHeight: "100%",
                    p: { xs: 2, md: 4 },
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 640,
                        borderRadius: "20px",
                        border: `1px solid ${LINE}`,
                        boxShadow: "0 24px 50px -28px rgba(11,43,51,0.28)",
                        overflow: "hidden",
                    }}
                >
                    {/* header band */}
                    <Box
                        sx={{
                            position: "relative",
                            bgcolor: INK,
                            background: `linear-gradient(155deg, ${INK} 0%, ${INK_SOFT} 100%)`,
                            color: "#fff",
                            px: { xs: 3.5, md: 5 },
                            py: { xs: 3.5, md: 4.5 },
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: -60,
                                right: -30,
                                width: 160,
                                height: 160,
                                borderRadius: "50%",
                                background: `radial-gradient(circle, ${AMBER} 0%, rgba(242,166,90,0) 70%)`,
                                opacity: 0.35,
                            }}
                        />
                        <Typography
                            sx={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 700,
                                fontSize: 22,
                                position: "relative",
                            }}
                        >
                            Add Client
                        </Typography>
                        <Typography sx={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", mt: 0.5, position: "relative" }}>
                            Fill in the company details to onboard a new client.
                        </Typography>
                    </Box>

                    {/* form body */}
                    <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 3.5, md: 5 } }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                            <TextField
                                fullWidth
                                required
                                label="Company Name"
                                name="companyName"
                                value={client.companyName}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                sx={fieldSx}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BusinessRoundedIcon sx={{ fontSize: 19, color: MUTED }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2.5 }}>
                                <TextField
                                    fullWidth
                                    required
                                    type="email"
                                    label="Email"
                                    name="contactEmail"
                                    value={client.contactEmail}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    sx={fieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineRoundedIcon sx={{ fontSize: 19, color: MUTED }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    required
                                    label="Phone"
                                    name="contactPhone"
                                    value={client.contactPhone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    sx={fieldSx}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CallRoundedIcon sx={{ fontSize: 19, color: MUTED }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={3}
                                label="Address"
                                name="address"
                                value={client.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                                sx={fieldSx}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                                            <LocationOnOutlinedIcon sx={{ fontSize: 19, color: MUTED }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                required
                                type="number"
                                label="SLA (days)"
                                name="slaDays"
                                value={client.slaDays}
                                onChange={handleChange}
                                placeholder="Enter SLA days"
                                sx={{ ...fieldSx, maxWidth: { sm: 220 } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EventAvailableRoundedIcon sx={{ fontSize: 19, color: MUTED }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 1.5, mt: 4.5 }}>
                            <Button
                                type="button"
                                onClick={onCancel}
                                sx={{
                                    flex: 1,
                                    border: `1px solid ${LINE}`,
                                    color: INK,
                                    fontWeight: 600,
                                    fontSize: 14.5,
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    py: 1.4,
                                    "&:hover": { bgcolor: "rgba(11,43,51,0.04)" },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                endIcon={<ArrowForwardRoundedIcon />}
                                sx={{
                                    flex: 1,
                                    bgcolor: AMBER,
                                    color: INK,
                                    fontWeight: 700,
                                    fontSize: 14.5,
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    py: 1.4,
                                    boxShadow: "none",
                                    "&:hover": { bgcolor: "#E4934A" },
                                }}
                            >
                                Save Client
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default AddClient;