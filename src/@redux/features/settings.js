import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    twoFA: false,
    branding: {},
    activeTabPassword: 1
}

export const settingsSlice = createSlice({

    name: 'settingsSlice',
    initialState,
    reducers: { 
    setActive2fa: (state, action) => {
        state.twoFA = action.payload;
    },
    setBranding: (state, action) => {
        state.branding = action.payload;
    },
    setActiveTabPassword: (state, action) => {
        state.activeTabPassword = action.payload;
    }
},
})

export const {setActive2fa, setBranding, setActiveTabPassword} = settingsSlice.actions;

export default settingsSlice.reducer