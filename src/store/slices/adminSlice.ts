import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  sidebarOpen: boolean;
  selectedUser: string | null;
  selectedPlan: string | null;
  loyaltyPoints: number;
  teamMembers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}

const initialState: AdminState = {
  sidebarOpen: true,
  selectedUser: null,
  selectedPlan: null,
  loyaltyPoints: 0,
  teamMembers: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSelectedUser: (state, action: PayloadAction<string | null>) => {
      state.selectedUser = action.payload;
    },
    setSelectedPlan: (state, action: PayloadAction<string | null>) => {
      state.selectedPlan = action.payload;
    },
    setLoyaltyPoints: (state, action: PayloadAction<number>) => {
      state.loyaltyPoints = action.payload;
    },
    setTeamMembers: (state, action: PayloadAction<AdminState["teamMembers"]>) => {
      state.teamMembers = action.payload;
    },
    addTeamMember: (state, action: PayloadAction<AdminState["teamMembers"][0]>) => {
      state.teamMembers.push(action.payload);
    },
    removeTeamMember: (state, action: PayloadAction<string>) => {
      state.teamMembers = state.teamMembers.filter(m => m.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setSelectedUser,
  setSelectedPlan,
  setLoyaltyPoints,
  setTeamMembers,
  addTeamMember,
  removeTeamMember,
} = adminSlice.actions;
export default adminSlice.reducer;
