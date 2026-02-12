import { createTheme, Theme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import { Fira_Sans } from 'next/font/google';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxl: true;
    xxxl: true;
  }
}

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const BLUE_PRIMARY = '#00C2FF';
const BLUE_FOCUS = '#0099CC';

export const getAdminTheme = (mode: PaletteMode): Theme => {
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: BLUE_PRIMARY,
      },
      secondary: {
        main: BLUE_PRIMARY,
      },
      background: {
        default: "#0b0f33",
        paper: "#0b0f33",
      },
      text: {
        primary: "#ffffff",
        secondary: BLUE_PRIMARY,
      },
      error: {
        main: "#D32F2F"
      },
      success: {
        main: BLUE_PRIMARY
      },
      warning: {
        main: "#FFA500"
      },
      info: {
        main: BLUE_PRIMARY
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1536,
        xxl: 1920,
        xxxl: 2560
      }
    },
    typography: {
      fontFamily: firaSans.style.fontFamily,
      h1: { fontSize: "36px", fontWeight: 600 },
      h2: { fontSize: "28px", fontWeight: 600 },
      h3: { fontSize: "24px", fontWeight: 600 },
      h4: { fontSize: "20px", fontWeight: 600 },
      h5: { fontSize: "18px", fontWeight: 500 },
      h6: { fontSize: "16px", fontWeight: 500 },
      subtitle1: { fontSize: "16px", fontWeight: 500 },
      subtitle2: { fontSize: "14px", fontWeight: 500 },
      body1: { fontSize: "15px", fontWeight: 400 },
      body2: { fontSize: "14px", fontWeight: 400 },
      button: { fontSize: "16px", fontWeight: 600 },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#0b0f33',
            color: 'white',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "30px",
            fontWeight: 600,
            minHeight: 44,
            "&:focus-visible": {
              outline: `2px solid ${BLUE_PRIMARY}`,
              outlineOffset: "2px",
            },
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${BLUE_PRIMARY} 0%, #0099CC 100%)`,
            color: "#fff",
            "&:hover": {
              background: `linear-gradient(135deg, #00d4ff 0%, ${BLUE_FOCUS} 100%)`,
            },
            "&:focus-visible": {
              outline: `2px solid rgba(0, 194, 255, 0.6)`,
              outlineOffset: "2px",
            },
          },
          outlined: {
            borderColor: `rgba(0, 194, 255, 0.6)`,
            color: BLUE_PRIMARY,
            "&:hover": {
              borderColor: BLUE_PRIMARY,
              backgroundColor: "rgba(0, 194, 255, 0.08)",
            },
            "&:focus-visible": {
              outline: `2px solid ${BLUE_PRIMARY}`,
              outlineOffset: "2px",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(11, 15, 51, 0.8)",
            color: "#ffffff",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(11, 15, 51, 0.8)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              color: "#ffffff",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.15)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(0, 194, 255, 0.6)",
              },
              "&.Mui-focused fieldset": {
                borderColor: BLUE_PRIMARY,
                boxShadow: "0 0 0 2px rgba(0, 194, 255, 0.25)",
              },
            },
            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .MuiInputLabel-root.Mui-focused": { color: BLUE_PRIMARY },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255, 255, 255, 0.4)",
              opacity: 1,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            color: "#ffffff",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.15)" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0, 194, 255, 0.6)" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: BLUE_PRIMARY,
              boxShadow: "0 0 0 2px rgba(0, 194, 255, 0.25)",
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(11, 15, 51, 0.6)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            "& .MuiDataGrid-cell": {
              borderColor: "rgba(255, 255, 255, 0.06)",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderColor: "rgba(255, 255, 255, 0.08)",
            },
          },
        },
      },
    },
  });

  return theme;
};
