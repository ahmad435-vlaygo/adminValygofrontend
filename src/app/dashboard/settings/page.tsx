"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { Save, Lock } from "lucide-react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { PageHeader } from "@/components/ui";
import apiClient from "@/lib/api/apiClient";

const SettingsCard = styled(Card)`
  background: linear-gradient(145deg, rgba(11, 15, 51, 0.7) 0%, rgba(8, 12, 40, 0.8) 100%) !important;
  border: 1px solid rgba(0, 194, 255, 0.2) !important;
  border-radius: 16px !important;
  margin-bottom: 24px;
`;

const SettingSection = styled(Box)`
  padding: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled(Typography)`
  color: #00C2FF !important;
  font-weight: 600 !important;
  margin-bottom: 16px !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
`;

const SettingLabel = styled(Typography)`
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500 !important;
  margin-bottom: 8px !important;
`;

const SettingDescription = styled(Typography)`
  color: rgba(255, 255, 255, 0.5) !important;
  font-size: 12px !important;
  margin-bottom: 12px !important;
`;

const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&:hover fieldset": { borderColor: "rgba(0, 194, 255, 0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#00C2FF" },
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#00C2FF" },
};

export default function SettingsPage() {
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [profile, setProfile] = useState<{ name?: string; email?: string }>({ name: "", email: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get("/auth/profile");
        const data = res.data?.data ?? res.data;
        if (data) {
          setProfile({ name: data.name ?? "", email: data.email ?? "" });
        }
      } catch (e: any) {
        const msg = e?.response?.data?.message ?? "Failed to load profile";
        setError(msg);
        if (authUser) {
          setProfile({ name: authUser.name ?? "", email: authUser.email ?? "" });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [authUser]);

  const handleSave = async () => {
    setError("");
    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    if (newPassword && !currentPassword) {
      setError("Enter current password to change password");
      return;
    }
    try {
      setSaving(true);
      await apiClient.put("/auth/profile", {
        name: profile.name,
        email: profile.email,
        ...(newPassword ? { currentPassword, newPassword } : {}),
      });
      setSaveSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Settings" subtitle="Manage your admin account" />
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#00C2FF" }} />
        </Box>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your admin account" />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully.
        </Alert>
      )}

      <SettingsCard>
        <CardContent>
          <SectionTitle>
            <Lock size={20} />
            Account
          </SectionTitle>

          <SettingSection>
            <SettingLabel>Name</SettingLabel>
            <TextField
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              fullWidth
              size="small"
              placeholder="Admin name"
              sx={inputSx}
            />
          </SettingSection>

          <SettingSection>
            <SettingLabel>Email</SettingLabel>
            <TextField
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              fullWidth
              size="small"
              placeholder="admin@example.com"
              sx={inputSx}
            />
          </SettingSection>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", my: 2 }} />

          <SettingSection>
            <SettingLabel>Change password</SettingLabel>
            <SettingDescription>
              Leave blank to keep your current password.
            </SettingDescription>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                type="password"
                label="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                size="small"
                sx={inputSx}
              />
              <TextField
                type="password"
                label="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                size="small"
                sx={inputSx}
              />
              <TextField
                type="password"
                label="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                size="small"
                sx={inputSx}
              />
            </Box>
          </SettingSection>
        </CardContent>
      </SettingsCard>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          component={Link}
          href="/dashboard"
          sx={{ color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.3)" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save size={20} />}
          onClick={handleSave}
          disabled={saving}
          sx={{
            background: "linear-gradient(135deg, #00C2FF 0%, #0099CC 100%)",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </Box>
    </>
  );
}
