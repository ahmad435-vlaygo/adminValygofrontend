"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import DashboardLayout from "@/components/DashboardLayout";
import { PageHeader, DataCard } from "@/components/ui";
import apiClient from "@/lib/api/apiClient";
import { useLanguage } from "@/contexts/LanguageContext";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";

interface SalesTeamMember {
  _id: string;
  name: string;
  email: string;
  referralCode: string;
  status: "active" | "inactive";
  onboardedUsers: number;
  totalSubscriptions: number;
  monthlyNewSubscriptions: number;
  lastMonthNewSubscriptions: number;
  downlines?: unknown[];
  createdAt: string;
}

export default function TeamPage() {
  const { t } = useLanguage();
  const [members, setMembers] = useState<SalesTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedMember, setSelectedMember] = useState<SalesTeamMember | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ success?: boolean; data?: SalesTeamMember[] }>("/admin/sales-team");
      const data = res.data?.data ?? res.data;
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddMember = () => {
    setIsAddingNew(true);
    setFormData({ name: "", email: "", password: "" });
    setSelectedMember(null);
    setOpenDialog(true);
  };

  const handleEdit = (member: SalesTeamMember) => {
    setIsAddingNew(false);
    setSelectedMember(member);
    setFormData({ name: member.name, email: member.email, password: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMember(null);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    if (isAddingNew && !formData.password.trim()) return;
    setSaving(true);
    try {
      if (isAddingNew) {
        await apiClient.post("/admin/sales-team", {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });
      } else if (selectedMember) {
        await apiClient.put(`/admin/sales-team/${selectedMember._id}`, {
          name: formData.name.trim(),
          email: formData.email.trim(),
        });
      }
      handleCloseDialog();
      fetchTeam();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('team.removeConfirm'))) return;
    try {
      await apiClient.delete(`/admin/sales-team/${id}`);
      fetchTeam();
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => (status === "active" ? "success" : "default");

  return (
    <DashboardLayout>
      <PageHeader
        title={t('team.title')}
        subtitle={t('team.subtitle')}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddMember}
            sx={{ borderRadius: "30px", textTransform: "none" }}
          >
            {t('team.addMember')}
          </Button>
        }
      />

      <DataCard title={t('team.salesTeam')} subtitle={`${members.length} member(s)`}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#00C2FF" }} />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#00C2FF", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>{t('team.name')}</TableCell>
                  <TableCell sx={{ color: "#00C2FF", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>{t('team.email')}</TableCell>
                  <TableCell sx={{ color: "#00C2FF", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>{t('team.referralCode')}</TableCell>
                  <TableCell sx={{ color: "#00C2FF", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>{t('team.status')}</TableCell>
                  <TableCell sx={{ color: "#00C2FF", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>{t('team.onboarded')}</TableCell>
                  <TableCell sx={{ color: "#00C2FF", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>{t('team.subscriptions')}</TableCell>
                  <TableCell sx={{ color: "#00C2FF", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>{t('team.joinDate')}</TableCell>
                  <TableCell align="right" sx={{ color: "#00C2FF", fontWeight: 600, borderColor: "rgba(255,255,255,0.08)" }}>{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.length > 0 ? members.map((member) => (
                  <TableRow key={member._id} sx={{ "&:hover": { background: "rgba(255,255,255,0.04)" } }}>
                    <TableCell sx={{ color: "rgba(255,255,255,0.9)", borderColor: "rgba(255,255,255,0.06)" }}>{member.name}</TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.9)", borderColor: "rgba(255,255,255,0.06)" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 18, color: "#00C2FF" }} />
                        {member.email}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "#00C2FF", fontFamily: "monospace", borderColor: "rgba(255,255,255,0.06)" }}>{member.referralCode}</TableCell>
                    <TableCell sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <Chip label={member.status} size="small" color={getStatusColor(member.status) as any} sx={{ textTransform: "capitalize" }} />
                    </TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.85)", borderColor: "rgba(255,255,255,0.06)" }}>{member.onboardedUsers ?? 0}</TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.85)", borderColor: "rgba(255,255,255,0.06)" }}>{member.totalSubscriptions ?? 0}</TableCell>
                    <TableCell sx={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.06)" }}>
                      {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell align="right" sx={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => handleEdit(member)} sx={{ mr: 0.5, textTransform: "none" }}>
                        {t('team.edit')}
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDelete(member._id)} color="error" sx={{ textTransform: "none" }}>
                        {t('team.remove')}
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", color: "rgba(255,255,255,0.5)", py: 4 }}>{t('team.noMembersYet')}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataCard>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            background: "rgba(11, 15, 51, 0.98)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>
          {isAddingNew ? t('team.addMemberDialog') : `${t('team.editMemberDialog')} ${selectedMember?.name}`}
        </DialogTitle>
        <DialogContent sx={{ color: "#fff", minWidth: 400 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label={t('team.fullName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              }}
            />
            <TextField
              label={t('team.email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              disabled={!!selectedMember}
              sx={{
                "& .MuiOutlinedInput-root": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              }}
            />
            {isAddingNew && (
              <TextField
                label={t('team.password')}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": { color: "#fff" },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: "rgba(255,255,255,0.8)" }}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ borderRadius: "30px", textTransform: "none" }}>
            {saving ? t('team.saving') : isAddingNew ? t('team.addMemberButton') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
