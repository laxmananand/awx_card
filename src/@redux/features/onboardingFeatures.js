import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //Sidebar
  currentTab: "Cards",
  isDashboardVisited: false,

  //index js - dashboard
  ListCountryZOQQ: [],
  ListCountryCode: [],
  ListNationality: [],
  region: null,
  UserCognitoDetails: null,
  contactName: "User",
  UserStatusObj: null,
  UserOnboardingDetails: null,
  CustomerDetailsNIUM: null,
  complianceStatus: null,
  finalKycStatus: null,
  isActivated: false,

  //dashboard js - onboarding
  ListCountry: [],
  BusinessCorporationDetails: null,
  AdditionalBusinessCorporationDetails: null,
  StakeholderDetails: null,
  ApplicantBusinessDetails: null,
  BusinessTypeValues: [],
  ListedExchangeValues: [],
  TotalEmployeesValues: [],
  AnnualTurnoverValues: [],
  IndustrySectorValues: [],
  IntendedUseOfAccountValues: [],
  PositionValues: [],
  UnregulatedTrustTypeValues: [],
  OccupationValues: [],
  DocumentTypeValues: [],
  showTab: 0,
  currentPage: 1,

  //region === EU
  monthlyTransactionVolume: [],
  monthlyTransactions: [],
  averageTransactionValue: [],

  //general details page
  brn: "",
  businessType: null,
  businessKybMode: "M_KYB",
  businessDetailsNIUMObj: null,
  businessName: "",

  //business details page
  registeredCountry: null,
  searchId: "",

  rfiDetails: null,
};

export const onboardingSlice = createSlice({
  name: "onboardingSlice",
  initialState,
  reducers: {
    //Sidebar
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },

    setDashboardVisited: (state, action) => {
      state.isDashboardVisited = action.payload;
    },

    ////index js - dashboard
    setCountryZoqq: (state, action) => {
      state.ListCountryZOQQ = action.payload;
    },
    setCountryCodeValues: (state, action) => {
      state.ListCountryCode = action.payload;
    },

    setNationalityValues: (state, action) => {
      state.ListNationality = action.payload;
    },

    setRegion: (state, action) => {
      state.region = action.payload;
    },

    setUserCognitoDetails: (state, action) => {
      state.UserCognitoDetails = action.payload;
    },

    setContactName: (state, action) => {
      state.contactName = action.payload;
    },

    setUserStatusObj: (state, action) => {
      state.UserStatusObj = action.payload;
    },

    setUserOnboardingDetails: (state, action) => {
      state.UserOnboardingDetails = action.payload;
    },

    setCustomerDetailsNIUMObj: (state, action) => {
      state.CustomerDetailsNIUM = action.payload;
    },

    setComplianceStatus: (state, action) => {
      state.complianceStatus = action.payload;
    },

    setFinalKycStatus: (state, action) => {
      state.finalKycStatus = action.payload;
    },

    //dashboard
    setBusinessCorporationDetails: (state, action) => {
      state.BusinessCorporationDetails = action.payload;
    },

    setAdditionalBusinessCorporationDetails: (state, action) => {
      state.AdditionalBusinessCorporationDetails = action.payload;
    },

    setStakeholderDetails: (state, action) => {
      state.StakeholderDetails = action.payload;
    },

    setApplicantBusinessDetails: (state, action) => {
      state.ApplicantBusinessDetails = action.payload;
    },

    setBusinessTypeValues: (state, action) => {
      state.BusinessTypeValues = action.payload;
    },
    setListedExchangeValues: (state, action) => {
      state.ListedExchangeValues = action.payload;
    },
    setTotalEmployeesValues: (state, action) => {
      state.TotalEmployeesValues = action.payload;
    },
    setAnnualTurnoverValues: (state, action) => {
      state.AnnualTurnoverValues = action.payload;
    },
    setIndustrySectorValues: (state, action) => {
      state.IndustrySectorValues = action.payload;
    },
    setIntendedUseOfAccountValues: (state, action) => {
      state.IntendedUseOfAccountValues = action.payload;
    },
    setPositionValues: (state, action) => {
      state.PositionValues = action.payload;
    },

    setUnregulatedTrustTypeValues: (state, action) => {
      state.UnregulatedTrustTypeValues = action.payload;
    },

    setShowTab: (state, action) => {
      state.showTab = action.payload;
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    setCountryNameValues: (state, action) => {
      state.ListCountry = action.payload;
    },

    setActivated: (state, action) => {
      state.isActivated = action.payload;
    },

    //general details page
    setBRN: (state, action) => {
      state.brn = action.payload;
    },
    setBusinessType: (state, action) => {
      state.businessType = action.payload;
    },
    setBusinessKybMode: (state, action) => {
      state.businessKybMode = action.payload;
    },

    setBusinessDetailsNIUMObj: (state, action) => {
      state.businessDetailsNIUMObj = action.payload;
    },

    setBusinessName: (state, action) => {
      state.businessName = action.payload;
    },

    //business details page
    setRegisteredCountry: (state, action) => {
      state.registeredCountry = action.payload;
    },

    setSearchId: (state, action) => {
      state.searchId = action.payload;
    },

    //applicant details page
    setOccupation: (state, action) => {
      state.OccupationValues = action.payload;
    },

    setDocumentTypeValues: (state, action) => {
      state.DocumentTypeValues = action.payload;
    },

    setMonthlyTransactionVolume: (state, action) => {
      state.monthlyTransactionVolume = action.payload;
    },

    setMonthlyTransactions: (state, action) => {
      state.monthlyTransactions = action.payload;
    },

    setAverageTransactionValue: (state, action) => {
      state.averageTransactionValue = action.payload;
    },

    setRFIDetails: (state, action) => {
      state.rfiDetails = action.payload;
    },
  },
});

export const {
  setCountryZoqq,
  setCountryCodeValues,
  setNationalityValues,
  setRegion,
  setUserCognitoDetails,
  setContactName,
  setUserStatusObj,
  setUserOnboardingDetails,
  setCustomerDetailsNIUMObj,
  setComplianceStatus,
  setFinalKycStatus,

  setBusinessCorporationDetails,
  setAdditionalBusinessCorporationDetails,
  setStakeholderDetails,
  setApplicantBusinessDetails,
  setBusinessTypeValues,
  setListedExchangeValues,
  setTotalEmployeesValues,
  setAnnualTurnoverValues,
  setIndustrySectorValues,
  setIntendedUseOfAccountValues,
  setPositionValues,
  setUnregulatedTrustTypeValues,
  setShowTab,
  setCurrentPage,
  setCountryNameValues,

  setBRN,
  setBusinessType,
  setBusinessKybMode,
  setBusinessDetailsNIUMObj,
  setBusinessName,
  setSearchId,
  setRegisteredCountry,

  setOccupation,

  setDocumentTypeValues,

  setCurrentTab,

  setActivated,

  setMonthlyTransactionVolume,
  setMonthlyTransactions,
  setAverageTransactionValue,

  setDashboardVisited,

  setRFIDetails,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
