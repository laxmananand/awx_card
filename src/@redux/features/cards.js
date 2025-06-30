import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cardsList: [],
  sensitivecarddetails: {},
  selecdedCard: {},
};

export const cardsSlice = createSlice({
  name: "cardsSlice",
  initialState,
  reducers: {
    setCardsList: (state, action) => {
      state.cardsList = action.payload;
    },
    setSensitivecarddetails: (state, action) => {
      state.sensitivecarddetails = action.payload;
    },
    setSelecdedCard: (state, action) => {
      state.selecdedCard = action.payload;
    },
  },
});

export const { setCardsList, setSensitivecarddetails, setSelecdedCard } = cardsSlice.actions;

export default cardsSlice.reducer;
