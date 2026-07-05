import React, { useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { ArrowBigRight, Plus, ArrowRight } from "lucide-react";

/* ---- Keyframes ---- */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
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

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function ProductCard({ product, index, inView, clickable, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(33.333% - 16px)" },
        position: "relative",
        borderRadius: 4,
        overflow: "hidden",
        height: 280,
        cursor: clickable ? "pointer" : "default",
        opacity: 0,
        animation: inView ? `${fadeUp} 0.6s ease forwards` : "none",
        animationDelay: `${(index % 9) * 80}ms`,
        boxShadow: "0 12px 30px rgba(11,43,51,0.12)",
        transition: "transform 0.35s ease, box-shadow 0.35s ease",
        "&:hover": clickable
          ? { transform: "translateY(-6px)", boxShadow: "0 24px 48px rgba(11,43,51,0.2)" }
          : {},
        "&:hover .product-card-img": { transform: "scale(1.08)" },
        "&:hover .product-arrow-btn": { opacity: 1, transform: "translateX(0)" },
        "&:hover .product-accent-line": { width: 48 },
      }}
    >
      <Box
        className="product-card-img"
        component="img"
        src={product.image}
        alt={product.name || product.title}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.5s ease",
        }}
      />

      {/* base gradient so text is always readable */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, transparent 35%, rgba(7,20,24,0.9) 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          p: 2.5,
        }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem", mb: 0.5 }}>
          {product.title || product.name}
        </Typography>

        <Box
          className="product-accent-line"
          sx={{
            width: 32,
            height: 2,
            bgcolor: "#F2A65A",
            borderRadius: 2,
            mb: 1,
            transition: "width 0.3s ease",
          }}
        />

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>
            Mysdom
          </Typography>
          {clickable && (
            <Box
              className="product-arrow-btn"
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(242,166,90,0.9)",
                color: "#0B2B33",
                opacity: 0,
                transform: "translateX(-6px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              <ArrowRight size={15} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function Product() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [gridRef, gridInView] = useInView(0.05);

  const productImages = [
    { id: 1, name: "Employment check", image: "/product/employeecheck.jpg" },
    { id: 2, name: "Education check", image: "/product/educationcheck.webp" },
    { id: 3, name: "Criminal check", image: "/product/criminalcheck.webp" },
    { id: 4, name: "ID verification", image: "/product/idverificationcheck.png" },
    { id: 5, name: "Due diligence", image: "/product/deudeligance.jpg" },
    { id: 6, name: "Address verification", image: "/product/addressCheck.webp" },
    { id: 7, name: "Social media checks", image: "/product/socialmediacheck.webp" },
    { id: 8, name: "Database checks", image: "/product/databasecheck.avif" },
    { id: 9, name: "Credit checks", image: "/product/creditcheck.webp" },
  ];

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/product/list");
        const apiProducts = response.data?.data || [];

        const mergedProducts = apiProducts.map((apiProduct) => {
          const imageData = productImages.find(
            (img) => img.name.toLowerCase() === apiProduct.title.toLowerCase()
          );
          return {
            ...apiProduct,
            image: imageData?.image || "/product/socialmediacheck.webp",
          };
        });

        setProducts(mergedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        const fallbackProducts = productImages.map((img) => ({
          ...img,
          description: "Service description",
        }));
        setProducts(fallbackProducts);
      }
    };

    fetchProducts();
  }, []);

  function handleProductClick() {
    navigate("/bgv/list");
  }

  const isAdmin = ["admin", "superadmin"].includes(user?.role);
  const canGoToBgv = ["admin", "superadmin", "user"].includes(user?.role);

  return (
    <Box>
      {/* ============ HERO ============ */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 8, md: 12 },
          overflow: "hidden",
          background: "linear-gradient(135deg, #071c21 0%, #0b2b33 45%, #123f4a 100%)",
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

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.6)",
              mb: 2,
              opacity: 0,
              animation: `${fadeUp} 0.55s ease forwards`,
            }}
          >
            <Box
              component="span"
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer", "&:hover": { color: "#F2A65A" } }}
            >
              Home
            </Box>
            <Box component="span">|</Box>
            <Box component="span" sx={{ color: "#F2A65A", fontWeight: 600 }}>
              Our Products
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "2.1rem", md: "3rem" },
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.01em",
              opacity: 0,
              animation: `${fadeUp} 0.6s ease 0.1s forwards`,
            }}
          >
            Explore Our Range Of Products
          </Typography>
        </Container>
      </Box>

      {/* ============ ACTION ROW ============ */}
      <Container maxWidth="lg" sx={{ mt: -3.5, position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          {isAdmin && (
            <Button
              onClick={() => navigate("/product/add")}
              startIcon={<Plus size={18} />}
              sx={{
                px: 3,
                py: 1.3,
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                color: "#0B2B33",
                backgroundImage:
                  "linear-gradient(120deg, #F2A65A 0%, #FFCB8E 25%, #F2A65A 50%, #FFCB8E 75%, #F2A65A 100%)",
                backgroundSize: "200% 100%",
                animation: `${shimmer} 5s ease infinite`,
                boxShadow: "0 10px 24px rgba(242,166,90,0.35)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 30px rgba(242,166,90,0.5)" },
              }}
            >
              Create Product
            </Button>
          )}

          {canGoToBgv && (
            <Button
              onClick={handleProductClick}
              endIcon={<ArrowBigRight size={18} />}
              sx={{
                px: 3,
                py: 1.3,
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                color: "#fff",
                bgcolor: "#0B2B33",
                boxShadow: "0 10px 24px rgba(11,43,51,0.3)",
                transition: "transform 0.25s ease, background-color 0.25s ease",
                "&:hover": { transform: "translateY(-2px)", bgcolor: "#123f4a" },
              }}
            >
              Go to BGV
            </Button>
          )}
        </Box>
      </Container>

      {/* ============ PRODUCT GRID ============ */}
      <Box ref={gridRef} component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: "#F7FAFA" }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {products.map((product, index) => (
              <ProductCard
                key={product.id || index}
                product={product}
                index={index}
                inView={gridInView}
                clickable={isAdmin}
                onClick={() => {
                  if (isAdmin) navigate(`/product/view/${product.id}`);
                }}
              />
            ))}
          </Box>

          {products.length === 0 && (
            <Typography sx={{ textAlign: "center", color: "rgba(11,43,51,0.5)", mt: 4 }}>
              No products available right now.
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default Product;