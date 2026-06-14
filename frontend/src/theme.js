import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2F855A",
      dark: "#22543D",
      light: "#E6FFFA",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#38A169",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F8FAF8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A202C",
      secondary: "#4A5568",
    },
  },
  typography: {
    fontFamily: ['"Inter"', "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    h1: { fontWeight: 900, fontSize: "2.75rem", lineHeight: 1.05 },
    h2: { fontWeight: 900, fontSize: "2.25rem" },
    h3: { fontWeight: 800, fontSize: "1.75rem" },
    h4: { fontWeight: 800 },
    button: { textTransform: "none", fontWeight: 700 },
    body1: { color: "#1A202C", lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": { height: "100%" },
        body: {
          backgroundColor: "#F8FAF8",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: "transform .28s ease, box-shadow .28s ease",
          boxShadow: "0 10px 30px rgba(17,24,39,0.06)",
          "&:hover": { transform: "translateY(-8px)", boxShadow: "0 18px 50px rgba(17,24,39,0.08)" },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 18px",
        },
        containedPrimary: {
          backgroundColor: "#2F855A",
          boxShadow: "0 8px 24px rgba(46,125,50,0.12)",
          "&:hover": { backgroundColor: "#22543D", boxShadow: "0 12px 30px rgba(34,84,61,0.14)" },
        },
        outlinedPrimary: {
          borderColor: "rgba(34,84,61,0.08)",
          color: "#22543D",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 44,
        },
        indicator: {
          height: 3,
          borderRadius: 3,
          backgroundColor: "#2F855A",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 10,
          borderRadius: 8,
        },
        bar: {
          borderRadius: 8,
        },
      },
    },
  },
  spacing: 8,
});

export default theme;