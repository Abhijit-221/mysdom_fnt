import React, { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { PackagePlus, ChevronLeft } from "lucide-react";

const FIXED_TITLES = [
  "Employment check",
  "Education check",
  "Criminal check",
  "ID verification",
  "Due diligence",
  "Address verification",
  "Social media checks",
  "Database checks",
  "Credit checks",
];

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    bgcolor: "#fbfcfc",
    transition: "box-shadow 0.25s ease",
    "& fieldset": { borderColor: "rgba(11,43,51,0.15)" },
    "&:hover fieldset": { borderColor: "rgba(11,43,51,0.3)" },
    "&.Mui-focused fieldset": { borderColor: "#F2A65A", borderWidth: 2 },
    "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(242,166,90,0.14)" },
  },
};

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [availableTitles, setAvailableTitles] = useState(FIXED_TITLES);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExistingProducts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/product/list");
        const products = response.data?.data || [];
        const usedTitles = products
          .map((item) => (item.name || item.title || "").toString().trim().toLowerCase())
          .filter(Boolean);

        setAvailableTitles(FIXED_TITLES.filter((item) => !usedTitles.includes(item.toLowerCase())));
      } catch (error) {
        toast.error("Failed to load existing products");
      } finally {
        setLoading(false);
      }
    };

    fetchExistingProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title) {
      toast.error("Please select a product title");
      return;
    }

    try {
      setSaving(true);
      const payload = { title, description };
      const response = await axiosInstance.post("/product/add", payload);
      toast.success(response.data?.message || "Product added successfully");
      navigate("/product");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/product");
  const isSubmitDisabled = saving || loading || availableTitles.length === 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7FAFA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 6, md: 8 },
        px: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 520,
          bgcolor: "#fff",
          borderRadius: 5,
          border: "1px solid rgba(11,43,51,0.08)",
          boxShadow: "0 24px 60px rgba(11,43,51,0.12)",
          overflow: "hidden",
          opacity: 0,
          animation: `${fadeUp} 0.5s ease forwards`,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "relative",
            px: 4,
            py: 4,
            background: "linear-gradient(135deg, #071c21 0%, #0b2b33 55%, #123f4a 100%)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(242,166,90,0.2), transparent 70%)",
              top: -80,
              right: -60,
            }}
          />
          <Box
            onClick={handleCancel}
            sx={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.65)",
              cursor: "pointer",
              mb: 2,
              "&:hover": { color: "#F2A65A" },
            }}
          >
            <ChevronLeft size={15} /> Back to products
          </Box>

          <Box sx={{ position: "relative", display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 46,
                height: 46,
                flexShrink: 0,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(242,166,90,0.18)",
                color: "#F2A65A",
              }}
            >
              <PackagePlus size={22} />
            </Box>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1.4rem" }}>
              Add Product
            </Typography>
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#0B2B33", mb: 1 }}>
              Product title <Box component="span" sx={{ color: "#F2A65A" }}>*</Box>
            </Typography>

            <TextField
              select
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading || availableTitles.length === 0}
              displayEmpty
              sx={fieldSx}
            >
              <MenuItem value="">
                <Typography sx={{ color: "rgba(11,43,51,0.4)" }}>Select product title</Typography>
              </MenuItem>
              {availableTitles.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>

            {loading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.25 }}>
                <CircularProgress size={14} sx={{ color: "#0B2B33" }} />
                <Typography sx={{ fontSize: "0.8rem", color: "rgba(11,43,51,0.5)" }}>
                  Loading existing products…
                </Typography>
              </Box>
            )}
            {!loading && availableTitles.length === 0 && (
              <Typography sx={{ fontSize: "0.8rem", color: "#B23A3A", mt: 1.25 }}>
                All fixed product titles are already in use.
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#0B2B33", mb: 1 }}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short description for the product"
              sx={fieldSx}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              type="button"
              onClick={handleCancel}
              fullWidth
              sx={{
                py: 1.4,
                borderRadius: 2.5,
                fontWeight: 600,
                textTransform: "none",
                color: "#0B2B33",
                bgcolor: "rgba(11,43,51,0.06)",
                "&:hover": { bgcolor: "rgba(11,43,51,0.12)" },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              fullWidth
              sx={{
                py: 1.4,
                borderRadius: 2.5,
                fontWeight: 700,
                textTransform: "none",
                color: "#0B2B33",
                backgroundImage:
                  "linear-gradient(120deg, #F2A65A 0%, #FFCB8E 25%, #F2A65A 50%, #FFCB8E 75%, #F2A65A 100%)",
                backgroundSize: "200% 100%",
                animation: `${shimmer} 5s ease infinite`,
                boxShadow: "0 10px 24px rgba(242,166,90,0.35)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 30px rgba(242,166,90,0.5)" },
                "&.Mui-disabled": { backgroundImage: "none", bgcolor: "rgba(11,43,51,0.15)", animation: "none" },
              }}
            >
              {saving ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} sx={{ color: "#0B2B33" }} />
                  Saving...
                </Box>
              ) : (
                "Save Product"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddProduct;