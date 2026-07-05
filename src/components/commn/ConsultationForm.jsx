import React, { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import axiosInstance from "../../api/axiosInstance";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  ArrowRight,
  User,
  Tag,
  MessageSquare,
} from "lucide-react";

/* ---- Keyframes ---- */
const swingInLeft = keyframes`
  from { opacity: 0; transform: perspective(1200px) rotateY(35deg) translateX(-40px); }
  to { opacity: 1; transform: perspective(1200px) rotateY(0deg) translateX(0); }
`;

const swingInRight = keyframes`
  from { opacity: 0; transform: perspective(1200px) rotateY(-35deg) translateX(40px); }
  to { opacity: 1; transform: perspective(1200px) rotateY(0deg) translateX(0); }
`;

const sweep = keyframes`
  from { transform: translateX(-120%) skewX(-20deg); }
  to { transform: translateX(220%) skewX(-20deg); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
`;

const pulseDot = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(242,166,90,0.55); }
  70% { box-shadow: 0 0 0 6px rgba(242,166,90,0); }
`;

const floatBlob = keyframes`
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(16px, -22px); }
`;

const PANEL_DURATION = 700;
const SWEEP_DELAY = PANEL_DURATION + 150;
const CONTENT_START = PANEL_DURATION * 0.55;

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    bgcolor: "#fff",
    transition: "box-shadow 0.25s ease, transform 0.2s ease",
    "& fieldset": { borderColor: "rgba(11,43,51,0.15)" },
    "&:hover fieldset": { borderColor: "rgba(11,43,51,0.3)" },
    "&.Mui-focused fieldset": { borderColor: "#F2A65A", borderWidth: 2 },
    "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(242,166,90,0.15)" },
  },
};

const ContactSection = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSweep, setShowSweep] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSweep(true), SWEEP_DELAY);
    return () => clearTimeout(timer);
  }, []);

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
    <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: "#F7FAFA" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: 5,
            overflow: "hidden",
            boxShadow: "0 30px 70px rgba(11,43,51,0.15)",
            perspective: "1200px",
          }}
        >
          {showSweep && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "35%",
                height: "160%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                animation: `${sweep} 1.1s ease-out forwards`,
                zIndex: 5,
                pointerEvents: "none",
              }}
            />
          )}

          {/* LEFT — form */}
          <Box
            sx={{
              flex: 1.1,
              bgcolor: "#fff",
              p: { xs: 4, md: 6 },
              position: "relative",
              transformOrigin: "left center",
              opacity: 0,
              animation: `${swingInLeft} ${PANEL_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                mb: 1.25,
                opacity: 0,
                animation: `${fadeUp} 0.5s ease ${CONTENT_START}ms forwards`,
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "#F2A65A",
                  animation: `${pulseDot} 2s ease infinite`,
                }}
              />
              <Typography
                sx={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", color: "#F2A65A" }}
              >
                GET IN TOUCH
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.7rem", md: "2.1rem" },
                fontWeight: 700,
                color: "#0B2B33",
                mb: 3.5,
                opacity: 0,
                animation: `${fadeUp} 0.55s ease ${CONTENT_START + 60}ms forwards`,
              }}
            >
              Free Consultation
            </Typography>

            {status === "success" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  p: 2,
                  mb: 2.5,
                  borderRadius: 2.5,
                  bgcolor: "rgba(46,160,90,0.1)",
                  color: "#1E7A45",
                  animation: `${fadeUp} 0.4s ease`,
                }}
              >
                <CheckCircle2 size={20} />
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                  Message sent successfully! We'll get back to you soon.
                </Typography>
              </Box>
            )}
            {status === "error" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  p: 2,
                  mb: 2.5,
                  borderRadius: 2.5,
                  bgcolor: "rgba(211,60,60,0.08)",
                  color: "#B23A3A",
                  animation: `${shake} 0.4s ease`,
                }}
              >
                <XCircle size={20} />
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>{errorMsg}</Typography>
              </Box>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                  opacity: 0,
                  animation: `${fadeUp} 0.5s ease ${CONTENT_START + 120}ms forwards`,
                }}
              >
                <TextField
                  name="fullName"
                  label="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={17} color="rgba(11,43,51,0.4)" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...fieldSx, flex: "1 1 220px" }}
                />
                <TextField
                  type="email"
                  name="email"
                  label="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  disabled={status === "loading"}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={17} color="rgba(11,43,51,0.4)" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...fieldSx, flex: "1 1 220px" }}
                />
              </Box>

              <TextField
                name="subject"
                label="Subject"
                value={form.subject}
                onChange={handleChange}
                disabled={status === "loading"}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag size={17} color="rgba(11,43,51,0.4)" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ...fieldSx,
                  mb: 2,
                  opacity: 0,
                  animation: `${fadeUp} 0.5s ease ${CONTENT_START + 170}ms forwards`,
                }}
              />

              <TextField
                name="message"
                label="Message"
                value={form.message}
                onChange={handleChange}
                disabled={status === "loading"}
                required
                fullWidth
                multiline
                rows={5}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                      <MessageSquare size={17} color="rgba(11,43,51,0.4)" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ...fieldSx,
                  mb: 3,
                  opacity: 0,
                  animation: `${fadeUp} 0.5s ease ${CONTENT_START + 220}ms forwards`,
                }}
              />

              <Box
                sx={{
                  opacity: 0,
                  animation: `${fadeUp} 0.5s ease ${CONTENT_START + 280}ms forwards`,
                }}
              >
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  endIcon={
                    status !== "loading" && (
                      <Box component="span" className="cta-arrow" sx={{ display: "flex" }}>
                        <ArrowRight size={18} />
                      </Box>
                    )
                  }
                  sx={{
                    px: 4,
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "0.04em",
                    color: "#0B2B33",
                    textTransform: "none",
                    backgroundImage:
                      "linear-gradient(120deg, #F2A65A 0%, #FFCB8E 25%, #F2A65A 50%, #FFCB8E 75%, #F2A65A 100%)",
                    backgroundSize: "200% 100%",
                    animation: `${shimmer} 5s ease infinite`,
                    boxShadow: "0 8px 22px rgba(242,166,90,0.35)",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-2px) scale(1.02)",
                      boxShadow: "0 12px 28px rgba(242,166,90,0.5)",
                    },
                    "&:hover .cta-arrow": { transform: "translateX(4px)" },
                    "& .cta-arrow": { transition: "transform 0.25s ease" },
                    "&.Mui-disabled": {
                      backgroundImage: "none",
                      bgcolor: "rgba(11,43,51,0.15)",
                      animation: "none",
                    },
                  }}
                >
                  {status === "loading" ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <CircularProgress size={16} sx={{ color: "#0B2B33" }} />
                      SENDING...
                    </Box>
                  ) : (
                    "SUBMIT MESSAGE"
                  )}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* RIGHT — dark content panel */}
          <Box
            sx={{
              flex: 0.9,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: 4, md: 6 },
              background: "linear-gradient(135deg, #071c21 0%, #0b2b33 55%, #123f4a 100%)",
              color: "#fff",
              overflow: "hidden",
              transformOrigin: "right center",
              opacity: 0,
              animation: `${swingInRight} ${PANEL_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(242,166,90,0.18), transparent 70%)",
                top: -80,
                right: -80,
                animation: `${floatBlob} 8s ease-in-out infinite`,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(90,200,200,0.14), transparent 70%)",
                bottom: -60,
                left: -60,
                animation: `${floatBlob} 10s ease-in-out infinite reverse`,
              }}
            />

            <Typography
              variant="h3"
              sx={{
                position: "relative",
                fontSize: { xs: "1.5rem", md: "1.9rem" },
                fontWeight: 700,
                lineHeight: 1.35,
                mb: 4,
                opacity: 0,
                animation: `${fadeUp} 0.6s ease ${CONTENT_START + 100}ms forwards`,
              }}
            >
              Unlock your small business potential with tailored consulting services.
            </Typography>

            <Box sx={{ position: "relative", display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  opacity: 0,
                  animation: `${fadeUp} 0.55s ease ${CONTENT_START + 180}ms forwards`,
                  transition: "background-color 0.25s ease, transform 0.25s ease",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)", transform: "translateX(4px)" },
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(242,166,90,0.18)",
                    color: "#F2A65A",
                    animation: `${pulseDot} 2.4s ease infinite`,
                  }}
                >
                  <Phone size={18} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>
                    Talk To Us
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>+91 7077669661</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  opacity: 0,
                  animation: `${fadeUp} 0.55s ease ${CONTENT_START + 240}ms forwards`,
                  transition: "background-color 0.25s ease, transform 0.25s ease",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)", transform: "translateX(4px)" },
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(242,166,90,0.18)",
                    color: "#F2A65A",
                    animation: `${pulseDot} 2.4s ease infinite`,
                    animationDelay: "0.4s",
                  }}
                >
                  <Mail size={18} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}>
                    Reach Out To Us 
                  </Typography> 
                  <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>contactus@mysdom.com</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactSection;