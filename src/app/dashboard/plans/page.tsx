"use client"
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Plus, Edit2, Trash2 } from "lucide-react";
import styled from "styled-components";
import { PageHeader } from "@/components/ui";

const PlanCard = styled(Card)`
  background: rgba(11, 15, 51, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 12px;
  transition: all 0.25s ease;
  position: relative;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    border-color: rgba(0, 212, 170, 0.3) !important;
  }
`;

const PlanBadge = styled(Box)<{ featured?: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${(p: { featured?: boolean }) => (p.featured ? "linear-gradient(135deg, #00d4aa 0%, #00b896 100%)" : "rgba(255,255,255,0.1)")};
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

const PlanPrice = styled(Typography)`
  font-size: 28px;
  font-weight: 700;
  color: #00d4aa;
  margin: 15px 0;
`;

const FeatureList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0;
`;

const FeatureItem = styled(Typography)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  &:before {
    content: "✓";
    color: #00d4aa;
    font-weight: bold;
  }
`;

const ActionButtons = styled(Box)`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const mockPlans = [
  {
    id: 1,
    name: "Basic",
    price: "$9.99",
    description: "Perfect for getting started",
    features: ["Up to 5 users", "Basic analytics", "Email support"],
    featured: false,
    active: true,
  },
  {
    id: 2,
    name: "Professional",
    price: "$29.99",
    description: "For growing businesses",
    features: ["Up to 50 users", "Advanced analytics", "Priority support", "Custom branding"],
    featured: true,
    active: true,
  },
  {
    id: 3,
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: ["Unlimited users", "Full analytics", "24/7 support", "Custom integration"],
    featured: false,
    active: true,
  },
];

export default function PlansPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof mockPlans[0] | null>(null);

  const handleEdit = (plan: typeof mockPlans[0]) => {
    setSelectedPlan(plan);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlan(null);
  };

  return (
    <Box>
      <PageHeader
        title="Plans Management"
        subtitle="Create and manage subscription plans"
        action={
          <Button variant="contained" startIcon={<Plus size={20} />} sx={{ textTransform: "none", borderRadius: "8px" }}>
            Create Plan
          </Button>
        }
      />

      <Grid container spacing={3}>
        {mockPlans.map((plan) => (
          <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
            <PlanCard>
              <PlanBadge featured={plan.featured}>
                {plan.featured ? "FEATURED" : "STANDARD"}
              </PlanBadge>
              <CardContent>
                <Typography variant="h5" sx={{ color: "#ffffff", marginBottom: 1 }}>
                  {plan.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#999999", marginBottom: 2 }}>
                  {plan.description}
                </Typography>
                <PlanPrice>{plan.price}</PlanPrice>
                <FeatureList>
                  {plan.features.map((feature, idx) => (
                    <FeatureItem key={idx}>{feature}</FeatureItem>
                  ))}
                </FeatureList>
                <ActionButtons>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Edit2 size={16} />}
                    onClick={() => handleEdit(plan)}
                    sx={{ color: "#00d4aa", borderColor: "rgba(0, 212, 170, 0.5)", flex: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Trash2 size={16} />}
                    sx={{ color: "#D32F2F", borderColor: "#D32F2F", flex: 1 }}
                  >
                    Delete
                  </Button>
                </ActionButtons>
              </CardContent>
            </PlanCard>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            background: "#0b0f33",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#ffffff" }}>
          Edit Plan: {selectedPlan?.name}
        </DialogTitle>
        <DialogContent sx={{ color: "#ffffff", minWidth: 400 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
            <TextField
              label="Plan Name"
              defaultValue={selectedPlan?.name}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                },
              }}
            />
            <TextField
              label="Price"
              defaultValue={selectedPlan?.price}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                },
              }}
            />
            <TextField
              label="Description"
              defaultValue={selectedPlan?.description}
              fullWidth
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                },
              }}
            />
            <FormControlLabel
              control={<Switch defaultChecked={selectedPlan?.featured} />}
              label="Featured Plan"
              sx={{ color: "#ffffff" }}
            />
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
