import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Grow,
} from "@mui/material";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

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
    "&.Mui-disabled": { backgroundColor: "#F3EFE7" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: INK },
};

const ClientViewEditModal = ({ clientData, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [client, setClient] = useState({});

  useEffect(() => {
    setClient(clientData);
  }, [clientData]);

  const handleChange = (e) => {
    setClient({
      ...client,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      let response = await axiosInstance.put(`/client/update`, client);
      console.log("Response:", response.data);
      toast.success(response.data.message || "Client updated successfully");
      setEditMode(false);
      onUpdate(); // Refresh client list in parent component
      onClose();

    }
    catch (err) {
      console.error("Failed to update client:", err);
      toast.error(err.response?.data?.message || "Failed to update client");
      return;
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      TransitionComponent={Grow}
      // PaperProps={{ sx: { borderRadius: "20px", width: "92vw", overflow: "hidden",border:'1px solid red' } }}
    >
      {/* header band */}
      <Box
        sx={{
          position: "relative",
          bgcolor: INK,
          background: `linear-gradient(155deg, ${INK} 0%, ${INK_SOFT} 100%)`,
          color: "#fff",
          px: { xs: 3, md: 4 },
          py: { xs: 2.75, md: 3.25 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          width:'100vw'
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -20,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${AMBER} 0%, rgba(242,166,90,0) 70%)`,
            opacity: 0.35,
          }}
        />
        <Typography
          sx={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: 19,
            position: "relative",
          }}
        >
          {editMode ? "Edit Client" : "Client Details"}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "#fff", position: "relative", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: { xs: 3, md: 4 }, fontFamily: "'Inter', sans-serif" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            fullWidth
            required
            label="Client Name"
            name="companyName"
            value={client.companyName || ""}
            onChange={handleChange}
            disabled={!editMode}
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessRoundedIcon sx={{ fontSize: 19, color: MUTED }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type="email"
            label="Email"
            name="contactEmail"
            value={client.contactEmail || ""}
            onChange={handleChange}
            disabled={!editMode}
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
            value={client.contactPhone || ""}
            onChange={handleChange}
            disabled={!editMode}
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CallRoundedIcon sx={{ fontSize: 19, color: MUTED }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Address"
            name="address"
            value={client.address || ""}
            onChange={handleChange}
            disabled={!editMode}
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
            value={client.slaDays ?? ""}
            onChange={handleChange}
            disabled={!editMode}
            sx={{ ...fieldSx, maxWidth: { sm: 200 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EventAvailableRoundedIcon sx={{ fontSize: 19, color: MUTED }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, mt: 4 }}>
          <Button
            onClick={onClose}
            sx={{
              flex: 1,
              border: `1px solid ${LINE}`,
              color: INK,
              fontWeight: 600,
              fontSize: 14.5,
              textTransform: "none",
              borderRadius: "10px",
              py: 1.3,
              "&:hover": { bgcolor: "rgba(11,43,51,0.04)" },
            }}
          >
            Close
          </Button>

          {!editMode ? (
            <Button
              onClick={() => setEditMode(true)}
              startIcon={<EditRoundedIcon sx={{ fontSize: 17 }} />}
              sx={{
                flex: 1,
                bgcolor: AMBER,
                color: INK,
                fontWeight: 700,
                fontSize: 14.5,
                textTransform: "none",
                borderRadius: "10px",
                py: 1.3,
                boxShadow: "none",
                "&:hover": { bgcolor: "#E4934A" },
              }}
            >
              Edit
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              sx={{
                flex: 1,
                bgcolor: AMBER,
                color: INK,
                fontWeight: 700,
                fontSize: 14.5,
                textTransform: "none",
                borderRadius: "10px",
                py: 1.3,
                boxShadow: "none",
                "&:hover": { bgcolor: "#E4934A" },
              }}
            >
              Save
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ClientViewEditModal;