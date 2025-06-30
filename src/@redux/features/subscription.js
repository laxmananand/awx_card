import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    planDetails: [],
    clientSecret: "",
    invoices: {
        hasMore: false,
        data: []
    },
    paymentMethods: []
}

export const subscriptionSlice = createSlice({
    name: 'subscriptionSlice',
    initialState,
    reducers: {
        setPlanDetails: (state, action) => {
            state.planDetails = action.payload
        },
        setClientSecret: (state, action) => {
            state.clientSecret = action.payload
        },
        setSubscriptionData: (state, action) => {
            state.data = action.payload
        },
        setInvoices: (state, action) => {
            state.invoices = action.payload
        },
        addInvoices: (state, action) => {
            state.invoices = {...action.payload, data: [...state.invoices.data, ...action.payload.data]}
        },
        setPaymentMethod: (state, action) => {
            state.paymentMethods = action.payload
        }
    },
})

export const { setPlanDetails, setClientSecret, setSubscriptionData, setInvoices, addInvoices, setPaymentMethod } = subscriptionSlice.actions

export default subscriptionSlice.reducer