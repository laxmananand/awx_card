import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogin: false,
  clientHashId: null,
  userType: null,
  loginErrorMessage: "",
  isPending: false,
  showSidebar: true,
  dashboardLoading: false,
  awxAccountId: "",
  codeChallenge: "",
  authCode: "",
  adminFlag: "N",
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearAuth: (state) => {
      return initialState;
    },
    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    setDashboardLoading: (state, action) => {
      state.dashboardLoading = action.payload;
    },
    setAWXAccountId: (state, action) => {
      state.awxAccountId = action.payload;
    },
    setCodeChallenge: (state, action) => {
      state.codeChallenge = action.payload;
    },
    setAuthCode: (state, action) => {
      state.authCode = action.payload;
    },
    setAdminFlag: (state, action) => {
      state.adminFlag = action.payload;
    },
  },
});

export const {
  clearAuth,
  setAuthState,
  setShowSidebar,
  setDashboardLoading,
  setAWXAccountId,
  setCodeChallenge,
  setAuthCode,
  setAdminFlag,
} = authSlice.actions;

export default authSlice.reducer;
