"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const Icon = ({ name }: { name: string }) => (
  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{name}</span>
);

const menuItems = [
  { section: "nav.main", items: [
    { labelKey: "nav.overview", icon: "dashboard", path: "/dashboard/overview" },
    { labelKey: "nav.usersManagement", icon: "group", path: "/dashboard/users-management" },
  ]},
  { section: "nav.compliance", items: [
    { labelKey: "nav.kycVerification", icon: "verified_user", path: "/dashboard/kyc-verification" },
    { labelKey: "nav.kycKyb", icon: "bar_chart", path: "/dashboard/kyc-kyb" },
  ]},
  { section: "nav.financial", items: [
    { labelKey: "nav.subscriptions", icon: "credit_card", path: "/dashboard/subscriptions" },
    { labelKey: "nav.transactions", icon: "receipt_long", path: "/dashboard/transactions" },
  ]},
  { section: "nav.management", items: [
    { labelKey: "nav.plans", icon: "inventory_2", path: "/dashboard/plans" },
    { labelKey: "nav.loyaltyPoints", icon: "card_giftcard", path: "/dashboard/loyalty" },
    { labelKey: "nav.teamMembers", icon: "groups", path: "/dashboard/team" },
  ]},
  { section: "nav.operations", items: [
    { labelKey: "nav.meetings", icon: "calendar_today", path: "/dashboard/meetings" },
    { labelKey: "nav.salesDashboard", icon: "trending_up", path: "/sales-dashboard" },
    { labelKey: "nav.settings", icon: "settings", path: "/dashboard/settings" },
  ]},
];

const SIDEBAR_WIDTH = 260;

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? SIDEBAR_WIDTH : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          top: 0,
          left: 0,
          zIndex: 1200,
          background: "linear-gradient(180deg, #0d1133 0%, #080a1f 100%)",
          borderRight: "1px solid rgba(255, 255, 255, 0.06)",
          transition: "width 225ms cubic-bezier(0.4, 0, 0.6, 1), box-shadow 225ms",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          minHeight: 64,
          px: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            letterSpacing: "0.05em",
            background: "linear-gradient(90deg, #00d4aa 0%, #00a884 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "1.25rem",
          }}
        >
          VALYGO
        </Typography>
        <Typography
          component="span"
          sx={{
            ml: 1.5,
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {t("nav.adminPanel")}
        </Typography>
      </Box>

      {/* Nav sections */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 1.5 }}>
        {menuItems.map((section, idx) => (
          <Box key={idx} sx={{ mb: 1 }}>
            <Typography
              sx={{
                px: 2,
                py: 0.75,
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {t(section.section)}
            </Typography>
            <List disablePadding>
              {section.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <ListItemButton
                    key={item.path}
                    onClick={() => { router.push(item.path); onClose(); }}
                    sx={{
                      mx: 1,
                      borderRadius: "10px",
                      py: 1.25,
                      px: 1.5,
                      mb: 0.25,
                      backgroundColor: isActive ? "rgba(0, 76, 0, 0.2)" : "transparent",
                      borderLeft: isActive ? "3px solid #004C00" : "3px solid transparent",
                      color: isActive ? "#00d4aa" : "rgba(255,255,255,0.7)",
                      "&:hover": {
                        backgroundColor: isActive ? "rgba(0, 76, 0, 0.25)" : "rgba(255,255,255,0.06)",
                        color: isActive ? "#00d4aa" : "#fff",
                      },
                      "& .MuiListItemIcon-root": {
                        minWidth: 36,
                        color: "inherit",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Icon name={item.icon} />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(item.labelKey)}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />

      <List disablePadding sx={{ py: 1 }}>
        <ListItemButton
          onClick={() => router.push("/login")}
          sx={{
            mx: 1,
            borderRadius: "10px",
            py: 1.25,
            px: 1.5,
            color: "rgba(255, 107, 107, 0.95)",
            "&:hover": {
              backgroundColor: "rgba(255, 107, 107, 0.1)",
              color: "#ff6b6b",
            },
            "& .MuiListItemIcon-root": { minWidth: 36, color: "inherit" },
          }}
        >
          <ListItemIcon>
            <Icon name="logout" />
          </ListItemIcon>
          <ListItemText
            primary={t("nav.logout")}
            primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

export { SIDEBAR_WIDTH };
