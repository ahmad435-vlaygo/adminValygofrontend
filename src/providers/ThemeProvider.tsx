"use client"
import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { PaletteMode } from "@mui/material";
import { getAdminTheme } from "@/theme/theme";

interface ThemeContextType {
    mode: PaletteMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<PaletteMode>("light");

    const toggleTheme = () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
    };

    const theme = useMemo(() => getAdminTheme(mode), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useThemeContext must be used inside ThemeProvider");
    return context;
};
