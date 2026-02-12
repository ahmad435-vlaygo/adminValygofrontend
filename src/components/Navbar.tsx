"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Typography,
  Badge,
  Avatar,
  Button,
} from "@mui/material";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLanguage } from "@/contexts/LanguageContext";

const Icon = ({ name, className = "", style }: { name: string; className?: string; style?: React.CSSProperties }) => (
  <span className={`material-symbols-outlined ${className}`} style={{ fontSize: 24, ...style }}>{name}</span>
);

const StyledAppBar = styled(AppBar)`
  background: #0b0f33 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: none !important;
`;

const NavbarContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 16px;
`;

const LogoSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavLinks = styled(Box)`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
  @media (max-width: 900px) {
    display: none;
  }
`;

const RightSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconButtonStyled = styled(IconButton)`
  color: white !important;
  transition: all 0.2s ease;
  &:hover {
    color: rgba(255, 255, 255, 0.9) !important;
    background: rgba(255, 255, 255, 0.06);
  }
`;

const UserInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: white;
  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.9);
  }
`;

const navItems = [
  { path: "/dashboard", labelKey: "nav.dashboard" },
  { path: "/dashboard/users-management", labelKey: "nav.usersManagement" },
  { path: "/dashboard/transactions", labelKey: "nav.transactions" },
  { path: "/dashboard/subscriptions", labelKey: "nav.subscriptions" },
  { path: "/dashboard/team", labelKey: "nav.teamMembers" },
  { path: "/dashboard/settings", labelKey: "nav.settings" },
];

const salesNavItems = [
  { path: "/dashboard/referral", labelKey: "nav.referralDashboard" },
  { path: "/dashboard/settings", labelKey: "nav.settings" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationOpen = (e: React.MouseEvent<HTMLElement>) => setNotificationAnchor(e.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);
  const handleMoreOpen = (e: React.MouseEvent<HTMLElement>) => setMoreAnchor(e.currentTarget);
  const handleMoreClose = () => setMoreAnchor(null);
  const handleLogout = () => {
    router.push("/login");
    handleMenuClose();
  };

  return (
    <StyledAppBar position="fixed" sx={{ height: 64 }}>
      <Toolbar sx={{ minHeight: 64, height: 64, px: { xs: 2, md: 3 } }}>
        <NavbarContent>
          <LogoSection>
            <Box
              component="button"
              onClick={() => router.push("/dashboard")}
              sx={{ display: "flex", alignItems: "center", gap: 1, border: "none", background: "none", cursor: "pointer", p: 0 }}
            >
              <Image src="/valygo-logo.svg" alt="VALYGO" width={100} height={34} style={{ objectFit: "contain" }} />
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", display: { xs: "none", sm: "block" } }}>
                Admin
              </Typography>
            </Box>
          </LogoSection>

          <NavLinks>
            {(user?.role === "sales_team" ? salesNavItems : navItems).map((item) => {
              const isActive = pathname === item.path || (item.path !== "/dashboard" && pathname.startsWith(item.path));
              return (
                <Button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  sx={{
                    color: isActive ? "#00C2FF" : "rgba(255,255,255,0.85)",
                    textTransform: "none",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 500,
                    minWidth: "auto",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "8px",
                    "&:hover": { background: "rgba(255,255,255,0.06)", color: "#fff" },
                  }}
                >
                  {t(item.labelKey)}
                </Button>
              );
            })}
          </NavLinks>

          {/* Mobile: More menu */}
          <Box sx={{ display: { xs: "block", md: "none" }, flex: 1 }} />
          <Button
            sx={{ display: { xs: "flex", md: "none" }, color: "#fff", minWidth: "auto", textTransform: "none" }}
            onClick={handleMoreOpen}
            endIcon={<Icon name="expand_more" style={{ fontSize: 20 }} />}
          >
            {t("nav.settings")}
          </Button>
          <Menu
            anchorEl={moreAnchor}
            open={Boolean(moreAnchor)}
            onClose={handleMoreClose}
            PaperProps={{ sx: { background: "#0b0f33", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", minWidth: 200 } }}
          >
            {navItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => { router.push(item.path); handleMoreClose(); }}
                sx={{ color: "#fff", "&:hover": { background: "rgba(255,255,255,0.06)" } }}
              >
                {t(item.labelKey)}
              </MenuItem>
            ))}
          </Menu>

          <RightSection>
            <IconButtonStyled onClick={handleNotificationOpen} aria-label="notifications">
              <Badge badgeContent={3} sx={{ "& .MuiBadge-badge": { backgroundColor: "#D32F2F" } }}>
                <Icon name="notifications" />
              </Badge>
            </IconButtonStyled>
            <IconButtonStyled aria-label="settings" onClick={() => router.push("/dashboard/settings")}>
              <Icon name="settings" />
            </IconButtonStyled>
            <UserInfo onClick={handleMenuOpen}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: "linear-gradient(135deg, #00C2FF 0%, #0099CC 100%)",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
                  {user?.name || "Admin"}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  {user?.role || "Administrator"}
                </Typography>
              </Box>
            </UserInfo>
          </RightSection>
        </NavbarContent>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { background: "#0b0f33", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "8px", minWidth: 180 },
        }}
      >
        <MenuItem sx={{ color: "#fff", "&:hover": { background: "rgba(255, 255, 255, 0.06)" } }} onClick={() => { router.push("/dashboard/settings"); handleMenuClose(); }}>
          {t("nav.settings")}
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: "#D32F2F", "&:hover": { background: "rgba(211, 47, 47, 0.1)" } }}>
          <Icon name="logout" style={{ marginRight: 8, fontSize: 20 }} /> {t("nav.logout")}
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: { background: "#0b0f33", border: "1px solid rgba(255, 255, 255, 0.12)", minWidth: 300, borderRadius: "8px" },
        }}
      >
        <MenuItem sx={{ color: "#fff", "&:hover": { background: "rgba(255, 255, 255, 0.06)" } }}>
          New user registration
        </MenuItem>
        <MenuItem sx={{ color: "#fff", "&:hover": { background: "rgba(255, 255, 255, 0.06)" } }}>
          Plan upgrade request
        </MenuItem>
        <MenuItem sx={{ color: "#fff", "&:hover": { background: "rgba(255, 255, 255, 0.06)" } }}>
          System update available
        </MenuItem>
      </Menu>
    </StyledAppBar>
  );
}
