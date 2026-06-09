import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../types/authTypes";

type AuthState = {
  user: User | null;
};

const mockUser: User = {
  id: "user-001",
  name: "Michael Weber",
  email: "michael.weber@example.de",
  companyName: "Müller Recycling GmbH",
  drafts: 0,
};

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginMockUser: (state) => {
      state.user = mockUser;
    },
    logout: (state) => {
      state.user = null;
    },
    setDraftCount: (state, payload) => {
      if (state.user) {
        state.user.drafts = payload.payload;
      }
    },
  },
});

export const { loginMockUser, logout, setDraftCount } = authSlice.actions;
export const authReducer = authSlice.reducer;
