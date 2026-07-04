import React, { useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { keyframes } from "@emotion/react";

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
import useMediaQuery from "@mui/material/useMediaQuery";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Product", path: "/product" },
  { label: "Contact Us", path: "/contact" },
];

/* ---- Keyframes ---- */
const shimmer = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseRing = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(242, 166, 90, 0.55); }
  70% { box-shadow: 0 0 0 8px rgba(242, 166, 90, 0); }
  100% { box-shadow: 0 0 0 0 rgba(242, 166, 90, 0); }
`;

const dropIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* Hides the AppBar on scroll-down, reveals on scroll-up */
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({ threshold: 10 });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

/* Nav link with animated center-out underline */
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
      color: active ? "#0B2B33" : "rgba(11,43,51,0.75)",
      transition: "color 0.25s ease",
      "&:hover": { color: "#0B2B33" },
      "&::after": {
        content: '""',
        position: "absolute",
        left: "50%",
        bottom: 2,
        transform: active ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
        transformOrigin: "center",
        width: "70%",
        height: 2,
        borderRadius: 2,
        background: "linear-gradient(90deg, #F2A65A, #0B2B33)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
      {/* Utility strip */}
      <Fade in timeout={500}>
        <Box
          sx={{
            bgcolor: "#0B2B33",
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.8rem",
          }}
        >
          <Container >
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
                  position: "relative",
                  "&:hover": { color: "#F2A65A" },
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
                        color: "rgba(255,255,255,0.85)",
                        textTransform: "none",
                        minWidth: "auto",
                        px: 1,
                        "&:hover": { color: "#F2A65A", bgcolor: "transparent" },
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
                      color: "rgba(255,255,255,0.85)",
                      textTransform: "none",
                      minWidth: "auto",
                      px: 1,
                      "&:hover": { color: "#F2A65A", bgcolor: "transparent" },
                    }}
                  >
                    Login
                  </Button>
                )}
              </Box>
            </Box>
          </Container>
        </Box>
      </Fade>

      {/* Main nav */}
      <HideOnScroll>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(11,43,51,0.08)",
            color: "#0B2B33",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <Container >
            <Toolbar disableGutters sx={{ minHeight: 72, transition: "min-height 0.25s ease" }}>
              {/* Logo */}
              <Box
                onClick={() => go("/")}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  flexGrow: { xs: 1, md: 0 },
                  transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  "&:hover": { transform: "scale(1.06) rotate(-1deg)" },
                }}
              >
                <img src="/logo.png" alt="Logo" style={{ height: 36 }} />
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
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#0B2B33",
                        px: 2.75,
                        py: 1,
                        borderRadius: 2.5,
                        boxShadow: "0 4px 14px rgba(242,166,90,0.4)",
                        backgroundImage:
                          "linear-gradient(120deg, #F2A65A 0%, #FFCB8E 25%, #F2A65A 50%, #FFCB8E 75%, #F2A65A 100%)",
                        backgroundSize: "200% 100%",
                        animation: `${shimmer} 5s ease infinite`,
                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                        "&:hover": {
                          transform: "translateY(-2px) scale(1.03)",
                          boxShadow: "0 8px 20px rgba(242,166,90,0.55)",
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
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            bgcolor: "#0B2B33",
                            fontSize: 14,
                            animation: `${pulseRing} 2.4s infinite`,
                          }}
                        >
                          {user.username?.[0]?.toUpperCase()}
                        </Avatar>
                        <KeyboardArrowDownIcon
                          sx={{
                            fontSize: 18,
                            ml: 0.3,
                            color: "#0B2B33",
                            transition: "transform 0.25s ease",
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
                    color: "#0B2B33",
                    transition: "transform 0.25s ease",
                    "&:hover": { transform: "rotate(90deg)" },
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
        PaperProps={{ sx: { width: 280, bgcolor: "#0B2B33", color: "#fff" } }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1.5 }}>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{
              color: "#fff",
              transition: "transform 0.25s ease",
              "&:hover": { transform: "rotate(90deg)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {user && (
          <Fade in timeout={400}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, pb: 2 }}>
              <Avatar sx={{ bgcolor: "#F2A65A", color: "#0B2B33", animation: `${pulseRing} 2.4s infinite` }}>
                {user.username?.[0]?.toUpperCase()}
              </Avatar>
              <Typography sx={{ fontWeight: 600 }}>{user.username}</Typography>
            </Box>
          </Fade>
        )}

        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

        <List>
          {NAV_LINKS.map((link, i) => (
            <ListItemButton
              key={link.path}
              onClick={() => go(link.path)}
              sx={{
                opacity: 0,
                animation: `${dropIn} 0.4s ease forwards`,
                animationDelay: `${i * 60}ms`,
                "&:hover": { bgcolor: "rgba(242,166,90,0.12)", pl: 2.5 },
                transition: "padding-left 0.2s ease, background-color 0.2s ease",
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
                  opacity: 0,
                  animation: `${dropIn} 0.4s ease forwards`,
                  animationDelay: `${NAV_LINKS.length * 60}ms`,
                  "&:hover": { bgcolor: "rgba(242,166,90,0.12)", pl: 2.5 },
                  transition: "padding-left 0.2s ease, background-color 0.2s ease",
                }}
              >
                <ListItemText primary="Clients" />
              </ListItemButton>
              <ListItemButton
                onClick={() => go("/manage-users")}
                sx={{
                  opacity: 0,
                  animation: `${dropIn} 0.4s ease forwards`,
                  animationDelay: `${(NAV_LINKS.length + 1) * 60}ms`,
                  "&:hover": { bgcolor: "rgba(242,166,90,0.12)", pl: 2.5 },
                  transition: "padding-left 0.2s ease, background-color 0.2s ease",
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
              fullWidth
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#0B2B33",
                backgroundImage:
                  "linear-gradient(120deg, #F2A65A 0%, #FFCB8E 25%, #F2A65A 50%, #FFCB8E 75%, #F2A65A 100%)",
                backgroundSize: "200% 100%",
                animation: `${shimmer} 5s ease infinite`,
                "&:hover": { transform: "scale(1.02)" },
                transition: "transform 0.2s ease",
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