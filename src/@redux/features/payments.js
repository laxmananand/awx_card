import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payoutMethod: "",
  payoutMethodOptions: [],
  countryList: [],
  currencyList: [],
  phoneCodeList: [],
  beneficiaryFormInputProperties: {},
  bankAccountTypeList: [
    { label: "Checking", value: "Checking" },
    { label: "Saving", value: "Saving" },
    { label: "Maestra", value: "Maestra" },
    { label: "Current", value: "Current" },
  ],
  bankNameWithValue: [],
  bankNameList: [{ value: "", label: "Type to search" }],
  properties: {},
  requiredFields: [],
  beneficiaryList: [],
  beneficiaryList_awx : [],
  sourceCurrency: [],
  purposeCodeList: [],
  selectedBeneficiary: {},
  txnUploadReceipt: [],
  txnBusinessTag: [],
  txnData: [],
  downloadReceipt: [],
  isLoading: false,
  exchangeRate: null,
  exchangeRateError: null,
  auditId: null,
  fxRate: null,
  holdExpiryAt: null,
  payload: {},
  sendMoneyRes: {},
  isSuccess : null
};

export const paymentsSlice = createSlice({
  name: "paymentsSlice",
  initialState,
  reducers: {
    setCountryList: (state, action) => {
      state.countryList = action.payload;
    },
    setCurrencyList: (state, action) => {
      state.currencyList = action.payload;
    },
    setPhoneCodeList: (state, action) => {
      state.phoneCodeList = action.payload;
    },
    setBankListWithValue: (state, action) => {
      state.bankNameWithValue = action.payload;
    },
    setBankList: (state, action) => {
      state.bankNameList = action.payload;
    },
    setPropertiesAndRequiredFields: (state, action) => {
      state.properties = action.payload?.properties;
      state.requiredFields = action.payload?.required;
    },
    setPayoutMethod: (state, action) => {
      state.payoutMethod = action.payload;
    },
    setPayoutMethodOptions: (state, action) => {
      state.payoutMethodOptions = action.payload;
    },
    setBeneficiaryList: (state, action) => {
      state.beneficiaryList = action.payload;
    },
    
    setBeneficiaryList_awx: (state, action) => {
      state.beneficiaryList_awx = action.payload;
    },
    setSourceCurrency: (state, action) => {
      state.sourceCurrency = action.payload;
    },
    setPurposeCodeList: (state, action) => {
      state.purposeCodeList = action.payload;
    },
    setSelectedBeneficiary(state, action) {
      state.selectedBeneficiary = action.payload;
    },
    setUploadReceipt: (state, action) => {
      state.txnUploadReceipt = action.payload;
    },
    setTxnBusinessTag: (state, action) => {
      state.txnBusinessTag = action.payload;
    },
    setTxnData: (state, action) => {
      state.txnData = action.payload;
    },
    setDownloadReceipt: (state, action) => {
      state.downloadReceipt = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    fetchExchangeRateRequest: (state) => {
      state.isLoading = true;
      state.exchangeRateError = null;
    },
    fetchExchangeRateSuccess: (state, action) => {
      state.isLoading = false;
      state.exchangeRate = action.payload;
    },
    fetchExchangeRateFailure: (state, action) => {
      state.isLoading = false;
      state.exchangeRateError = action.payload;
    },
    setAuditId: (state, action) => {
      state.auditId = action.payload;
    },
    setFxRate: (state, action) => {
      state.fxRate = action.payload;
    },
    setHoldExpiryAt: (state, action) => {
      state.holdExpiryAt = action.payload;
    },
    setPayload: (state, action) => {
      state.payload = { ...state.payload, ...action.payload };
    },
    resetPayload: (state, action) => {
      state.payload = {};
    },
    setSendMoneyRes: (state, action) => {
      state.sendMoneyRes = action.payload;
    },
    resetSetSendMoneyRes: (state, action) => {
      state.sendMoneyRes = {};
    },
    setIsSuccess : (state,action) =>{
      state.isSuccess = action.payload;
    }
  },
});

export const {
  setCountryList,
  setCurrencyList,
  setPhoneCodeList,
  setBankList,
  setBankListWithValue,
  setPayoutMethod,
  setPropertiesAndRequiredFields,
  setPayoutMethodOptions,
  setBeneficiaryList,
  setSourceCurrency,
  setPurposeCodeList,
  setSelectedBeneficiary,
  setUploadReceipt,
  setTxnBusinessTag,
  setTxnData,
  setDownloadReceipt,
  setIsLoading,
  fetchExchangeRateRequest,
  fetchExchangeRateSuccess,
  fetchExchangeRateFailure,
  setAuditId,
  setFxRate,
  setHoldExpiryAt,
  setPayload,
  resetPayload,
  setSendMoneyRes,
  resetSetSendMoneyRes,
  setIsSuccess,
  setBeneficiaryList_awx
} = paymentsSlice.actions;

export default paymentsSlice.reducer;
