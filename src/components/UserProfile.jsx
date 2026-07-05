import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Avatar,
  IconButton,
  GlobalStyles,
} from "@mui/material";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

// ── Brand-locked tokens ──
const INK = "#0B2B33";
const INK_SOFT = "#123B45";
const AMBER = "#F2A65A";
const CREAM = "#FBF6EF";
const LINE = "rgba(11,43,51,0.12)";
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

function UserProfile() {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const fileInputRef = useRef(null);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get(
        `/auth/user/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.data);
      console.log(`${import.meta.env.VITE_BASE_URL}/${res.data.data.profilePicture}`);
      setPreview(`${import.meta.env.VITE_BASE_URL}/${res.data.data.profilePicture}`);
    } catch (err) {
      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
        toast.error(err.response.data.message || "Server Error");
      }
      else if (err.request) {
        console.log("No response received:", err.request);
        toast.error("No response from server");
      }
      else {
        console.log("Error:", err.message);
        toast.error(err.message);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const [errorMsg, setErrorMsg] = useState("");

  // Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!user.username || user.username.trim() === "") {
      toast.error("Username cannot be empty");
      return;
    }

    if (!user.gender) {
      toast.error("Please select a gender");
      return;
    }

    if (user.phone && user.phone.trim() === "") {
      toast.error("Phone number cannot be empty");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", user.id);
      formData.append("username", user.username);
      formData.append("gender", user.gender);

      if (user.phone) {
        formData.append("phone", user.phone);
      }

      if (imageFile) {
        formData.append("profile_pic", imageFile);
      }

      await axiosInstance.post(
        `/auth/user-update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile Updated Successfully");
      fetchProfile();

    } catch (err) {
      handleApiError(err);
    }
  };

  const handleApiError = (err) => {
    if (err.response) {
      const data = err.response.data;

      if (data.errors && Array.isArray(data.errors)) {
        data.errors.forEach((error) => {
          toast.error(error.msg);
        });
        return;
      }

      if (data.message) {
        toast.error(data.message);
        return;
      }

      toast.error("Something went wrong");
    } else if (err.request) {
      toast.error("No response from server");
    } else {
      toast.error(err.message);
    }
  };

  if (!user) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: CREAM }}>
        <Typography sx={{ color: MUTED, fontSize: 15 }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <GlobalStyles
        styles={{
          "@import":
            "url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&display=swap')",
        }}
      />
      <Box sx={{ fontFamily: "'Inter', sans-serif", bgcolor: CREAM, minHeight: "100%" }}>

        {/* ── PROFILE HEADER (no card, full-bleed banner) ── */}
        <Box
          sx={{
            position: "relative",
            bgcolor: INK,
            background: `linear-gradient(155deg, ${INK} 0%, ${INK_SOFT} 100%)`,
            color: "#fff",
            pt: { xs: 7, md: 9 },
            pb: { xs: 9, md: 11 },
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -90,
              right: "10%",
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${AMBER} 0%, rgba(242,166,90,0) 70%)`,
              opacity: 0.35,
            }}
          />
          <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <Typography
              sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: { xs: 26, md: 30 },
                mb: 3.5,
              }}
            >
              My Profile
            </Typography>

            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={preview || "https://via.placeholder.com/120"}
                alt="Profile"
                sx={{
                  width: 112,
                  height: 112,
                  border: `3px solid ${AMBER}`,
                  bgcolor: "rgba(255,255,255,0.1)",
                }}
              />
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 34,
                  height: 34,
                  bgcolor: AMBER,
                  color: INK,
                  border: `2px solid ${INK_SOFT}`,
                  "&:hover": { bgcolor: AMBER },
                }}
              >
                <CameraAltRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Box>

            <Typography sx={{ mt: 2.5, fontWeight: 600, fontSize: 17 }}>
              {user.username}
            </Typography>
            <Typography sx={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)" }}>
              {user.email}
            </Typography>
          </Container>
        </Box>

        {/* ── PROFILE FORM (open layout, no card wrapper) ── */}
        <Container maxWidth="sm" sx={{ pt: { xs: 5, md: 6 }, pb: { xs: 8, md: 10 } }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              sx={{
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: AMBER,
                textTransform: "uppercase",
                mb: 3,
              }}
            >
              Account Details
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={user.username}
                onChange={handleChange}
                sx={fieldSx}
              />

              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={user.email}
                InputProps={{ readOnly: true }}
                sx={{ ...fieldSx, "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], bgcolor: "#F3EFE7" } }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={user.phone || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setUser({ ...user, phone: value });
                }}
                inputProps={{ maxLength: 10 }}
                placeholder="Enter phone number"
                sx={fieldSx}
              />

              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={user.gender || ""}
                onChange={handleChange}
                sx={fieldSx}
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 4.5 }}>
              <Button
                type="submit"
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
                Save Changes
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/manage-users")}
                startIcon={<ArrowBackRoundedIcon />}
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
                Back
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default UserProfile;