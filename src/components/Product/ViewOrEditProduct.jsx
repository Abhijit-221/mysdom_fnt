import React, { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { ArrowLeft, Edit2, Save, X } from "lucide-react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

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

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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

const ViewOrEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableTitles, setAvailableTitles] = useState(FIXED_TITLES);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchAvailableTitles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/product/getby/${id}`);
      const productData = response.data?.data || {};
      setProduct(productData);
      setTitle(productData.name || productData.title || "");
      setDescription(productData.description || "");
    } catch (error) {
      toast.error("Failed to load product details");
      navigate("/product");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTitles = async () => {
    try {
      const response = await axiosInstance.get("/product/list");
      const products = response.data?.data || [];
      const usedTitles = products
        .filter((p) => p.id)
        .map((item) => (item.name || item.title || "").toString().trim().toLowerCase())
        .filter(Boolean);

      setAvailableTitles(FIXED_TITLES.filter((item) => !usedTitles.includes(item.toLowerCase())));
    } catch (error) {
      setAvailableTitles(FIXED_TITLES);
    }
  };

  const handleSave = async () => {
    if (!title) {
      toast.error("Please select a product title");
      return;
    }

    try {
      setSaving(true);
      const payload = { id, name: title, title, description };
      const response = await axiosInstance.put(`/product/update`, payload);
      toast.success(response.data?.message || "Product updated successfully");
      setEditMode(false);
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (editMode) {
      setTitle(product.name || product.title || "");
      setDescription(product.description || "");
      setEditMode(false);
    } else {
      navigate("/product");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          bgcolor: "#F7FAFA",
        }}
      >
        <CircularProgress sx={{ color: "#0B2B33" }} />
        <Typography sx={{ color: "rgba(11,43,51,0.6)" }}>Loading product details...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7FAFA" }}>
      {/* Hero banner */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 6, md: 7 },
          overflow: "hidden",
          background: "linear-gradient(135deg, #071c21 0%, #0b2b33 55%, #123f4a 100%)",
          backgroundSize: "200% 200%",
          animation: `${gradientShift} 14s ease infinite`,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            onClick={handleCancel}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              fontSize: "0.88rem",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              mb: 2.5,
              opacity: 0,
              animation: `${fadeUp} 0.5s ease forwards`,
              "&:hover": { color: "#F2A65A" },
            }}
          >
            <ArrowLeft size={17} /> Back to Products
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "1.7rem", md: "2.1rem" },
              fontWeight: 700,
              color: "#fff",
              mb: 0.5,
              opacity: 0,
              animation: `${fadeUp} 0.55s ease 0.08s forwards`,
            }}
          >
            {editMode ? "Edit Product" : "Product Details"}
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              color: "#F2A65A",
              fontWeight: 600,
              opacity: 0,
              animation: `${fadeUp} 0.55s ease 0.15s forwards`,
            }}
          >
            {title}
          </Typography>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ mt: -4, position: "relative", zIndex: 2, pb: 8 }}>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 5,
            border: "1px solid rgba(11,43,51,0.08)",
            boxShadow: "0 24px 60px rgba(11,43,51,0.12)",
            overflow: "hidden",
            opacity: 0,
            animation: `${fadeUp} 0.5s ease 0.1s forwards`,
          }}
        >
          <Box sx={{ px: { xs: 3, md: 4 }, py: 3, borderBottom: "1px solid rgba(11,43,51,0.08)" }}>
            <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#0B2B33" }}>
              Product Information
            </Typography>
          </Box>

          <Box sx={{ px: { xs: 3, md: 4 }, py: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#0B2B33", mb: 1 }}>
                Product Title <Box component="span" sx={{ color: "#F2A65A" }}>*</Box>
              </Typography>

              {editMode ? (
                <TextField
                  select
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={saving}
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
                  {title && !availableTitles.includes(title) && (
                    <MenuItem value={title}>{title} (Current)</MenuItem>
                  )}
                </TextField>
              ) : (
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 2.5,
                    bgcolor: "rgba(11,43,51,0.04)",
                    color: "#0B2B33",
                    fontWeight: 600,
                  }}
                >
                  {title}
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#0B2B33", mb: 1 }}>
                Description
              </Typography>

              {editMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a detailed product description"
                  disabled={saving}
                  sx={fieldSx}
                />
              ) : (
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 2.5,
                    bgcolor: "rgba(11,43,51,0.04)",
                    color: description ? "#0B2B33" : "rgba(11,43,51,0.4)",
                    lineHeight: 1.65,
                    minHeight: 80,
                  }}
                >
                  {description || "No description available"}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3 }}>
          {!editMode && (
            <Button
              onClick={() => setEditMode(true)}
              startIcon={<Edit2 size={17} />}
              sx={{
                px: 3.5,
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
              }}
            >
              Edit Product
            </Button>
          )}

          {editMode && (
            <>
              <Button
                onClick={handleCancel}
                disabled={saving}
                startIcon={<X size={17} />}
                sx={{
                  px: 3,
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
                onClick={handleSave}
                disabled={saving || !title}
                startIcon={!saving && <Save size={17} />}
                sx={{
                  px: 3.5,
                  py: 1.4,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  textTransform: "none",
                  color: "#fff",
                  bgcolor: "#2E9E5B",
                  boxShadow: "0 10px 24px rgba(46,158,91,0.3)",
                  transition: "transform 0.2s ease, background-color 0.2s ease",
                  "&:hover": { transform: "translateY(-2px)", bgcolor: "#268650" },
                  "&.Mui-disabled": { bgcolor: "rgba(11,43,51,0.15)", color: "rgba(255,255,255,0.6)" },
                }}
              >
                {saving ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                    Saving...
                  </Box>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ViewOrEditProduct;