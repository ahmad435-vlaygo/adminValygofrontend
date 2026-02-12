"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/slices/authSlice";
import Cookies from "js-cookie";
import Image from "next/image";

const Icon = ({ name, style }: { name: string; style?: React.CSSProperties }) => (
  <span className="material-symbols-outlined" style={{ fontSize: 22, ...style }}>{name}</span>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [error]);

  const floatingParticles = useMemo(() => {
    return [...Array(20)].map((_, i) => (
      <Box
        key={i}
        sx={{
          position: "absolute",
          width: "2px",
          height: "2px",
          background: "rgba(255, 255, 255, 0.5)",
          borderRadius: "50%",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
            "50%": {
              transform: `translateY(-${20 + Math.random() * 20}px) translateX(${-10 + Math.random() * 20}px)`,
            },
          },
        }}
      />
    ));
  }, []);

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      const { accessToken, user } = data.data;
      Cookies.set("adminToken", accessToken, { expires: 7 });
      dispatch(setAuth({ token: accessToken, user }));
      router.push(user?.role === "sales_team" ? "/dashboard/referral" : "/dashboard");
    } catch {
      setError("Connection error. Please check if the backend is reachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        background: "linear-gradient(135deg, #0b0f33 0%, #1a1f4a 50%, #000000 100%)",
        backgroundSize: "200% 200%",
        animation: "gradientShift 15s ease infinite",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden",
        py: { xs: 0, sm: 3 },
        ...(shake && {
          animation: "gradientShift 15s ease infinite, shake 0.5s ease",
        }),
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "@keyframes shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-10px)" },
          "75%": { transform: "translateX(10px)" },
        },
      }}
    >
      {floatingParticles}

      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: { xs: "100%", sm: 400, md: 480 },
          boxShadow: { xs: "none", sm: "0 8px 32px rgba(0,0,0,0.5)" },
          borderRadius: { xs: 0, sm: "16px" },
          background: "rgba(11, 15, 51, 0.85)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          mb: 3,
          animation: "fadeSlideUp 0.6s ease-out",
          "@keyframes fadeSlideUp": {
            "0%": { opacity: 0, transform: "translateY(30px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Image
              src="/valygo-logo.svg"
              alt="VALYGO"
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
            />
            <Typography variant="h6" fontWeight={700} sx={{ color: "#fff" }}>
              VALYGO
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 0, pt: 3 }}>
          <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 0.5, color: "#fff" }}>
            Sign In
          </Typography>
          <Typography variant="body2" align="center" sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>
            Secure access to your admin panel
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{
                mb: 2,
                background: "rgba(211, 47, 47, 0.15)",
                border: "1px solid rgba(211, 47, 47, 0.3)",
                color: "#ff6b6b",
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@valygo.com"
              required
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.6)",
                    boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.15)",
                  },
                },
                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "rgba(255, 255, 255, 0.9)" },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      sx={{
                        color: "rgba(255, 255, 255, 0.8)",
                        "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
                        "&:focus-visible": { outline: "2px solid rgba(255, 255, 255, 0.5)", outlineOffset: "2px" },
                      }}
                    >
                      <Icon name={showPassword ? "visibility_off" : "visibility"} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  borderRadius: "12px",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.6)",
                    boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.15)",
                  },
                },
                "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "rgba(255, 255, 255, 0.9)" },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                mt: 1,
                background: "rgba(255, 255, 255, 0.1)",
                color: "#fff",
                height: 50,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "45px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                fontSize: "0.95rem",
                fontWeight: 700,
                textTransform: "uppercase",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
                transition: "all 0.35s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.18)",
                  color: "#fff",
                  transform: "translateY(-4px) scale(1.03)",
                  boxShadow: "0 16px 50px rgba(0, 0, 0, 0.55)",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  background: "rgba(255, 255, 255, 0.15)",
                },
                "&:focus-visible": {
                  outline: "2px solid rgba(255, 255, 255, 0.5)",
                  outlineOffset: "2px",
                },
                "& .MuiCircularProgress-root": { color: "#fff" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          <Typography
            align="center"
            sx={{
              mt: 3,
              fontSize: 15,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            COPYRIGHT © VALYGO 2025
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
