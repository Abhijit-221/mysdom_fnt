import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import GlobalStyles from "@mui/material/GlobalStyles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// ── Brand-locked tokens ──
const INK = "#0B2B33";
const AMBER = "#F2A65A";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Product", path: "/product" },
  { label: "Contact Us", path: "/contact" },
];

/* Hides the AppBar on scroll-down, reveals on scroll-up */
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({ threshold: 10 });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

/* ── Wordmark logo: monogram badge + "MYSDOM" ── */
const Logo = ({ onClick, light = false }) => (
  <Box
    onClick={onClick}
    sx={{
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 1.1,
      transition: "opacity 0.2s ease",
      "&:hover": { opacity: 0.85 },
    }}
  >
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: "10px",
        bgcolor: light ? AMBER : INK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: 18,
          lineHeight: 1,
          color: light ? INK : AMBER,
        }}
      >
        M
      </Typography>
    </Box>
    <Typography
      sx={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 800,
        fontSize: 21,
        letterSpacing: "-0.01em",
        color: light ? "#fff" : INK,
      }}
    >
      MYS
      <Box component="span" sx={{ color: AMBER }}>DOM</Box>
    </Typography>
  </Box>
);

/* Nav link with a quiet underline that slides in on hover/active */
const NavLink = ({ label, onClick, active }) => (
  <Box
    onClick={onClick}
    sx={{
      position: "relative",
      px: 1.75,
      py: 1,
      cursor: "pointer",
      fontWeight: 500,
      fontSize: "0.95rem",
      color: active ? INK : "rgba(11,43,51,0.65)",
      transition: "color 0.2s ease",
      "&:hover": { color: INK },
      "&::after": {
        content: '""',
        position: "absolute",
        left: "50%",
        bottom: 2,
        transform: active ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
        transformOrigin: "center",
        width: "60%",
        height: 2,
        borderRadius: 2,
        bgcolor: AMBER,
        transition: "transform 0.25s ease",
      },
      "&:hover::after": {
        transform: "translateX(-50%) scaleX(1)",
      },
    }}
  >
    {label}
  </Box>
);

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user, logout } = useContext(AuthContext);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(anchorEl);
  const currentPath = useRef(typeof window !== "undefined" ? window.location.pathname : "/");

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const go = (path) => {
    navigate(path);
    setDrawerOpen(false);
    setAnchorEl(null);
  };

  return (
    <>
      <GlobalStyles
        styles={{
          "@import":
            "url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap')",
        }}
      />

      {/* Utility strip */}
      <Box
        sx={{
          bgcolor: INK,
          color: "rgba(255,255,255,0.8)",
          fontSize: "0.8rem",
        }}
      >
        <Container>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 36,
            }}
          >
            <Box
              onClick={() => go("/contact")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                "&:hover": { color: AMBER },
                transition: "color 0.2s ease",
              }}
            >
              <Typography variant="body2">Get Help</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {user ? (
                <>
                  <Box
                    onClick={() => go(`/users/${user.id}`)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      cursor: "pointer",
                      "&:hover": { color: "#fff" },
                      transition: "color 0.2s ease",
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">{user.username}</Typography>
                  </Box>
                  <Button
                    onClick={logout}
                    size="small"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      textTransform: "none",
                      minWidth: "auto",
                      px: 1,
                      "&:hover": { color: AMBER, bgcolor: "transparent" },
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => go("/login")}
                  size="small"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    textTransform: "none",
                    minWidth: "auto",
                    px: 1,
                    "&:hover": { color: AMBER, bgcolor: "transparent" },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main nav */}
      <HideOnScroll>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(11,43,51,0.08)",
            color: INK,
          }}
        >
          <Container>
            <Toolbar disableGutters sx={{ minHeight: 72 }}>
              {/* Logo */}
              <Box sx={{ flexGrow: { xs: 1, md: 0 } }}>
                <Logo onClick={() => go("/")} />
              </Box>

              {/* Desktop links */}
              {!isMobile && (
                <Box sx={{ display: "flex", alignItems: "center", ml: 5, flexGrow: 1 }}>
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.path}
                      label={link.label}
                      active={currentPath.current === link.path}
                      onClick={() => go(link.path)}
                    />
                  ))}

                  {isAdmin && (
                    <>
                      <NavLink label="Clients" onClick={() => go("/clients")} />
                      <NavLink label="Manage Users" onClick={() => go("/manage-users")} />
                    </>
                  )}
                </Box>
              )}

              {/* Right side: CTA (desktop) or menu icon (mobile) */}
              {!isMobile ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {user?.role === "user" && (
                    <Button
                      onClick={() => go("/contact")}
                      variant="contained"
                      disableElevation
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: INK,
                        bgcolor: AMBER,
                        px: 2.75,
                        py: 1,
                        borderRadius: 2,
                        transition: "background-color 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          bgcolor: "#E4934A",
                          boxShadow: "0 6px 16px rgba(242,166,90,0.35)",
                        },
                      }}
                    >
                      Talk to sales
                    </Button>
                  )}

                  {user && (
                    <>
                      <IconButton
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{
                          p: 0.5,
                          borderRadius: 3,
                          "&:hover": { bgcolor: "rgba(11,43,51,0.05)" },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            bgcolor: INK,
                            fontSize: 14,
                          }}
                        >
                          {user.username?.[0]?.toUpperCase()}
                        </Avatar>
                        <KeyboardArrowDownIcon
                          sx={{
                            fontSize: 18,
                            ml: 0.3,
                            color: INK,
                            transition: "transform 0.2s ease",
                            transform: profileMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={profileMenuOpen}
                        onClose={() => setAnchorEl(null)}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        TransitionComponent={Fade}
                        PaperProps={{
                          elevation: 3,
                          sx: { mt: 1, borderRadius: 2, minWidth: 160 },
                        }}
                      >
                        <MenuItem onClick={() => go(`/users/${user.id}`)}>Profile</MenuItem>
                        <Divider />
                        <MenuItem onClick={logout} sx={{ color: "error.main" }}>
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </Box>
              ) : (
                <IconButton
                  onClick={() => setDrawerOpen(true)}
                  sx={{
                    color: INK,
                    "&:hover": { bgcolor: "rgba(11,43,51,0.05)" },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, bgcolor: INK, color: "#fff" } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
          <Logo onClick={() => go("/")} light />
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, pb: 2 }}>
            <Avatar sx={{ bgcolor: AMBER, color: INK }}>
              {user.username?.[0]?.toUpperCase()}
            </Avatar>
            <Typography sx={{ fontWeight: 600 }}>{user.username}</Typography>
          </Box>
        )}

        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

        <List>
          {NAV_LINKS.map((link) => (
            <ListItemButton
              key={link.path}
              onClick={() => go(link.path)}
              sx={{
                "&:hover": { bgcolor: "rgba(242,166,90,0.12)" },
                transition: "background-color 0.2s ease",
              }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}

          {isAdmin && (
            <>
              <ListItemButton
                onClick={() => go("/clients")}
                sx={{
                  "&:hover": { bgcolor: "rgba(242,166,90,0.12)" },
                  transition: "background-color 0.2s ease",
                }}
              >
                <ListItemText primary="Clients" />
              </ListItemButton>
              <ListItemButton
                onClick={() => go("/manage-users")}
                sx={{
                  "&:hover": { bgcolor: "rgba(242,166,90,0.12)" },
                  transition: "background-color 0.2s ease",
                }}
              >
                <ListItemText primary="Manage Users" />
              </ListItemButton>
            </>
          )}
        </List>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {user?.role === "user" && (
            <Button
              onClick={() => go("/contact")}
              variant="contained"
              disableElevation
              fullWidth
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: INK,
                bgcolor: AMBER,
                "&:hover": { bgcolor: "#E4934A" },
              }}
            >
              Talk to sales
            </Button>
          )}

          {user ? (
            <Button onClick={logout} fullWidth sx={{ color: "#fff", textTransform: "none" }}>
              Logout
            </Button>
          ) : (
            <Button onClick={() => go("/login")} fullWidth sx={{ color: "#fff", textTransform: "none" }}>
              Login
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;