import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listInvoices: [],
  listBill: [],
  updateBill: {},
  apiData: null,
  currentState: 0,
  transferFields: null,
  reviewFields: null,
};

export const expenceSlice = createSlice({
  name: "expenceSlice",
  initialState,
  reducers: {
    setListInvoices: (state, action) => {
      state.listInvoices = action.payload;
    },
    setListBill: (state, action) => {
      state.listBill = action.payload;
    },
    setUpdateBill: (state, action) => {
      state.updateBill = action.payload;
    },

    setApiData: (state, action) => {
      state.apiData = action.payload;
    },

    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },

    setTransferFields: (state, action) => {
      state.transferFields = action.payload;
    },

    setReviewFields: (state, action) => {
      state.reviewFields = action.payload;
    },
  },
});

export const {
  setListInvoices,
  setListBill,
  setUpdateBill,
  setApiData,
  setCurrentState,
  setTransferFields,
  setReviewFields,
} = expenceSlice.actions;

export default expenceSlice.reducer;
