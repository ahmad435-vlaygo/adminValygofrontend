"use client"
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
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
  Grid,
} from "@mui/material";
import { Plus, Gift, TrendingUp } from "lucide-react";
import styled from "styled-components";
import DashboardLayout from "@/components/DashboardLayout";

const PageHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const StatsCard = styled(Card)`
  background: #1a1f4d !important;
  border: 1px solid #00C2FF;
  border-radius: 12px;
`;

const StatValue = styled(Typography)`
  font-size: 28px;
  font-weight: 700;
  color: #00C2FF;
  margin: 10px 0;
`;

const StyledCard = styled(Card)`
  background: #1a1f4d !important;
  border: 1px solid #00C2FF;
  border-radius: 12px;
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

const mockLoyaltyData = [
  {
    id: 1,
    userName: "John Doe",
    email: "john@example.com",
    points: 5000,
    tier: "Gold",
    lastActivity: "2024-03-10",
  },
  {
    id: 2,
    userName: "Jane Smith",
    email: "jane@example.com",
    points: 3500,
    tier: "Silver",
    lastActivity: "2024-03-09",
  },
  {
    id: 3,
    userName: "Bob Johnson",
    email: "bob@example.com",
    points: 1200,
    tier: "Bronze",
    lastActivity: "2024-03-08",
  },
  {
    id: 4,
    userName: "Alice Brown",
    email: "alice@example.com",
    points: 8000,
    tier: "Platinum",
    lastActivity: "2024-03-11",
  },
];

export default function LoyaltyPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockLoyaltyData[0] | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState("");

  const handleAddPoints = (user: typeof mockLoyaltyData[0]) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setPointsToAdd("");
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, "success" | "info" | "warning" | "error"> = {
      Bronze: "info",
      Silver: "info",
      Gold: "warning",
      Platinum: "success",
    };
    return colors[tier] || "info";
  };

  const totalPoints = mockLoyaltyData.reduce((sum, user) => sum + user.points, 0);
  const averagePoints = Math.round(totalPoints / mockLoyaltyData.length);

  return (
    <DashboardLayout>
      <PageHeader>
        <Box>
          <Typography variant="h2" sx={{ color: "#ffffff", marginBottom: 1 }}>
            Loyalty Points
          </Typography>
          <Typography variant="body2" sx={{ color: "#00C2FF" }}>
            Manage user loyalty points and rewards
          </Typography>
        </Box>
      </PageHeader>

      {/* Stats */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Gift size={32} color="#00C2FF" />
                <Box>
                  <Typography variant="body2" sx={{ color: "#999999" }}>
                    Total Points
                  </Typography>
                  <StatValue>{totalPoints.toLocaleString()}</StatValue>
                </Box>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TrendingUp size={32} color="#004C00" />
                <Box>
                  <Typography variant="body2" sx={{ color: "#999999" }}>
                    Average Points
                  </Typography>
                  <StatValue>{averagePoints.toLocaleString()}</StatValue>
                </Box>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Gift size={32} color="#FFA500" />
                <Box>
                  <Typography variant="body2" sx={{ color: "#999999" }}>
                    Active Users
                  </Typography>
                  <StatValue>{mockLoyaltyData.length}</StatValue>
                </Box>
              </Box>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      <StyledCard>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" sx={{ color: "#ffffff", marginBottom: 2 }}>
            User Loyalty Points
          </Typography>
        </Box>
        <StyledTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Tier</TableCell>
                <TableCell>Last Activity</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockLoyaltyData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ color: "#ffffff" }}>{user.userName}</TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>{user.email}</TableCell>
                  <TableCell sx={{ color: "#00C2FF", fontWeight: 600 }}>
                    {user.points.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.tier}
                      color={getTierColor(user.tier)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#ffffff" }}>{user.lastActivity}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Plus size={16} />}
                      onClick={() => handleAddPoints(user)}
                      sx={{ color: "#00C2FF", borderColor: "#00C2FF" }}
                    >
                      Add Points
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTable>
      </StyledCard>

      {/* Add Points Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            background: "#1a1f4d",
            border: "1px solid #00C2FF",
          },
        }}
      >
        <DialogTitle sx={{ color: "#ffffff" }}>
          Add Points to {selectedUser?.userName}
        </DialogTitle>
        <DialogContent sx={{ color: "#ffffff", minWidth: 400 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
            <Typography variant="body2" sx={{ color: "#999999" }}>
              Current Points: {selectedUser?.points.toLocaleString()}
            </Typography>
            <TextField
              label="Points to Add"
              type="number"
              value={pointsToAdd}
              onChange={(e) => setPointsToAdd(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "#00C2FF",
                  },
                },
              }}
            />
            <Typography variant="body2" sx={{ color: "#00C2FF" }}>
              New Total: {(selectedUser?.points || 0) + (parseInt(pointsToAdd) || 0)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ color: "#ffffff" }}>
            Cancel
          </Button>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              background: "linear-gradient(to top, #013800, #004C00)",
            }}
          >
            Add Points
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
