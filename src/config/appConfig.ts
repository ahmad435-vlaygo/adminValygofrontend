// Application Configuration
export const appConfig = {
  // App Info
  appName: process.env.NEXT_PUBLIC_APP_NAME || "VALYGO Admin",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  
  // Theme Colors
  colors: {
    primary: "#004C00",
    secondary: "#00C2FF",
    background: "#0b0f33",
    paper: "#1a1f4d",
    error: "#D32F2F",
    success: "#004C00",
    warning: "#FFA500",
    info: "#00C2FF",
    text: {
      primary: "#ffffff",
      secondary: "#00C2FF",
      disabled: "#999999",
    },
  },
  
  // Sidebar Configuration
  sidebar: {
    width: 280,
    collapsedWidth: 80,
  },
  
  // Navbar Configuration
  navbar: {
    height: 64,
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
  },
  
  // Loyalty Tiers
  loyaltyTiers: [
    { name: "Bronze", minPoints: 0, maxPoints: 999, color: "#CD7F32" },
    { name: "Silver", minPoints: 1000, maxPoints: 4999, color: "#C0C0C0" },
    { name: "Gold", minPoints: 5000, maxPoints: 9999, color: "#FFD700" },
    { name: "Platinum", minPoints: 10000, maxPoints: Infinity, color: "#E5E4E2" },
  ],
  
  // User Roles
  userRoles: [
    { value: "super_admin", label: "Super Admin", permissions: ["all"] },
    { value: "admin", label: "Admin", permissions: ["manage_users", "manage_plans"] },
    { value: "manager", label: "Manager", permissions: ["view_users", "view_plans"] },
    { value: "support", label: "Support", permissions: ["view_users"] },
    { value: "analyst", label: "Analyst", permissions: ["view_analytics"] },
  ],
  
  // Plan Types
  planTypes: [
    { value: "basic", label: "Basic", color: "#00C2FF" },
    { value: "professional", label: "Professional", color: "#004C00" },
    { value: "enterprise", label: "Enterprise", color: "#FFA500" },
  ],
  
  // API Endpoints
  endpoints: {
    auth: {
      login: "/admin/login",
      logout: "/admin/logout",
      profile: "/admin/profile",
    },
    users: {
      list: "/admin/users",
      get: "/admin/users/:id",
      create: "/admin/users",
      update: "/admin/users/:id",
      delete: "/admin/users/:id",
    },
    plans: {
      list: "/admin/plans",
      get: "/admin/plans/:id",
      create: "/admin/plans",
      update: "/admin/plans/:id",
      delete: "/admin/plans/:id",
    },
    loyalty: {
      list: "/admin/loyalty",
      addPoints: "/admin/loyalty/:userId/points",
      getTiers: "/admin/loyalty/tiers",
    },
    team: {
      list: "/admin/team",
      get: "/admin/team/:id",
      create: "/admin/team",
      update: "/admin/team/:id",
      delete: "/admin/team/:id",
    },
  },
};

export default appConfig;
