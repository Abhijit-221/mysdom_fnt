import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0B2B33",   // deep teal/navy - used for AppBar, text, dark surfaces
      light: "#1D4A54",
      dark: "#061A1F",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F2A65A",   // warm amber - CTA buttons, hover accents
      dark: "#E8944A",
      contrastText: "#0B2B33",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0B2B33",
      secondary: "rgba(11,43,51,0.7)",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      "sans-serif",
    ].join(","),
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
        contained: {
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;