import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  isSideBarClose: false,
  customerHashId: "",
  expanded: false,
  platform: "",
  authToken: "",
  authTokenTimestamp: "",
  dashboardType: "",
  cardholderId: "",
};

export const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
    openLoader: (state) => {
      state.loading = true;
    },
    closeLoader: (state) => {
      state.loading = false;
    },
    toggleSideBar: (state) => {
      state.isSideBarClose = !state.isSideBarClose;
    },
    setCustomerHashId: (state, action) => {
      state.customerHashId = action.payload;
    },
    setExpanded: (state, action) => {
      state.expanded = action.payload;
    },
    setPlatform: (state, action) => {
      state.platform = action.payload;
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    setAuthTokenTimestamp: (state, action) => {
      state.authTokenTimestamp = action.payload;
    },
    setDashboardType: (state, action) => {
      state.dashboardType = action.payload;
    },
    setCardholderId: (state, action) => {
      state.cardholderId = action.payload;
    },
  },
});

export const {
  openLoader,
  closeLoader,
  toggleSideBar,
  setCustomerHashId,
  setExpanded,
  setPlatform,
  setAuthToken,
  setAuthTokenTimestamp,
  setDashboardType,
  setCardholderId,
} = commonSlice.actions;

export default commonSlice.reducer;
