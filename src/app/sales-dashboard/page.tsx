"use client"
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Users, TrendingUp, Gift, Copy, LogOut } from "lucide-react";
import styled from "styled-components";
import DashboardLayout from "@/components/DashboardLayout";
import apiClient from "@/lib/api/apiClient";

const StatsCard = styled(Card)`
  background: #1a1f4d !important;
  border: 1px solid #00C2FF;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 194, 255, 0.2);
  }
`;

const StatIcon = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #004C00 0%, #00C2FF 100%);
  margin-bottom: 15px;
`;

const StatValue = styled(Typography)`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 5px;
`;

const StatLabel = styled(Typography)`
  font-size: 14px;
  color: #00C2FF;
`;

const ReferralCard = styled(Card)`
  background: #1a1f4d !important;
  border: 1px solid #00C2FF;
  border-radius: 12px;
  padding: 20px;
`;

const ReferralCode = styled(Box)`
  background: #0b0f33;
  border: 1px solid #00C2FF;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
`;

const CodeText = styled(Typography)`
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
  color: #00C2FF;
`;

const StyledTable = styled(TableContainer)`
  & .MuiTable-root {
    color: #ffffff;
  }
  & .MuiTableHead-root {
    background: #0b0f33;
  }
  & .MuiTableCell-head {
    color: #00C2FF;
    font-weight: 600;
    border-bottom: 1px solid #00C2FF;
  }
  & .MuiTableCell-body {
    border-bottom: 1px solid #2a2f5d;
  }
  & .MuiTableRow-root:hover {
    background: rgba(0, 194, 255, 0.05);
  }
`;

export default function SalesDashboardPage() {
  const [salesData, setSalesData] = useState({
    onboardedUsers: 0,
    totalSubscriptions: 0,
    monthlyNewSubscriptions: 0,
    lastMonthNewSubscriptions: 0,
    referralCode: "",
    downlines: [],
  });
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await apiClient.get('/admin/sales-team/dashboard');
      setSalesData(response.data?.data ?? response.data ?? {
        onboardedUsers: 0,
        totalSubscriptions: 0,
        monthlyNewSubscriptions: 0,
        lastMonthNewSubscriptions: 0,
        referralCode: '',
        downlines: [],
      });
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(salesData.referralCode);
    alert('Referral code copied to clipboard!');
  };

  const stats = [
    {
      label: "Onboarded Users",
      value: salesData.onboardedUsers,
      icon: Users,
      change: "+5 this month",
    },
    {
      label: "Total Subscriptions",
      value: salesData.totalSubscriptions,
      icon: TrendingUp,
      change: "+3 this month",
    },
    {
      label: "Monthly New Subscriptions",
      value: salesData.monthlyNewSubscriptions,
      icon: Gift,
      change: "Current month",
    },
    {
      label: "Last Month Subscriptions",
      value: salesData.lastMonthNewSubscriptions,
      icon: TrendingUp,
      change: "Previous month",
    },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h2" sx={{ color: "#ffffff", marginBottom: 1 }}>
          Sales Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: "#00C2FF" }}>
          Track your referrals and performance metrics
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <StatsCard>
                <CardContent>
                  <StatIcon>
                    <Icon size={28} color="#ffffff" />
                  </StatIcon>
                  <StatValue>{stat.value}</StatValue>
                  <StatLabel>{stat.label}</StatLabel>
                  <Typography
                    variant="caption"
                    sx={{ color: "#004C00", fontWeight: 600 }}
                  >
                    {stat.change}
                  </Typography>
                </CardContent>
              </StatsCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Referral Code Section */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReferralCard>
            <Typography variant="h5" sx={{ color: "#ffffff", marginBottom: 2 }}>
              Your Referral Code
            </Typography>
            <Typography variant="body2" sx={{ color: "#999999", marginBottom: 2 }}>
              Share this code with potential customers to earn commissions
            </Typography>
            <ReferralCode>
              <CodeText>{salesData.referralCode}</CodeText>
              <Button
                startIcon={<Copy size={20} />}
                onClick={copyReferralCode}
                sx={{ color: "#00C2FF" }}
              >
                Copy
              </Button>
            </ReferralCode>
          </ReferralCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ReferralCard>
            <Typography variant="h5" sx={{ color: "#ffffff", marginBottom: 2 }}>
              Performance Summary
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: "#999999" }}>Conversion Rate</Typography>
                <Typography sx={{ color: "#00C2FF", fontWeight: 600 }}>
                  {((salesData.totalSubscriptions / Math.max(salesData.onboardedUsers, 1)) * 100).toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: "#999999" }}>Avg. Subscriptions/User</Typography>
                <Typography sx={{ color: "#00C2FF", fontWeight: 600 }}>
                  {(salesData.totalSubscriptions / Math.max(salesData.onboardedUsers, 1)).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </ReferralCard>
        </Grid>
      </Grid>

      {/* Downlines Section */}
      <ReferralCard>
        <Typography variant="h5" sx={{ color: "#ffffff", marginBottom: 3 }}>
          Your Downlines (5 Levels)
        </Typography>
        <StyledTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Onboarded Users</TableCell>
                <TableCell>Subscriptions</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.downlines.map((downline: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell sx={{ color: "#ffffff" }}>{downline.name}</TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>{downline.email}</TableCell>
                  <TableCell sx={{ color: "#00C2FF", fontWeight: 600 }}>
                    {downline.onboardedUsers}
                  </TableCell>
                  <TableCell sx={{ color: "#00C2FF", fontWeight: 600 }}>
                    {downline.totalSubscriptions}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={downline.status}
                      color={downline.status === "active" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" sx={{ color: "#00C2FF" }}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTable>
      </ReferralCard>
    </DashboardLayout>
  );
}
