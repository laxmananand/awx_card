import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    bankDetails: [],
    currentType: "",
    isLoading: false,
    currencyList: [],
    conversionHistory: [],
    txnHistoryPayments: []

}

export const accountsSlice = createSlice({
    name: 'accountsSlice',
    initialState,
    reducers: {
        setBankDetails: (state, action) => {
            state.bankDetails = action.payload
        },
        setType: (state, action) => {
            state.currentType = action.payload
        },
        startLoading: (state) => {
            state.bankDetails = []
            state.isLoading= true
        },
        stopLoading: (state) => {
            state.isLoading= false
        },
        setCurrencyList: (state, action) => {
            state.currencyList = action.payload
        },
        setConversionHistory: (state, action) => {
            state.conversionHistory = action.payload
        },
        setTxnHistoryPayments: (state, action) => {
            state.txnHistoryPayments = action.payload
        }
    },
})

export const { setBankDetails, setType, startLoading, stopLoading, setCurrencyList, setConversionHistory, setTxnHistoryPayments} = accountsSlice.actions

export default accountsSlice.reducer