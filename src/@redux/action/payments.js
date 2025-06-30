import axios from "axios";
import { toast } from "react-toastify";
import {
  setBankList,
  setBankListWithValue,
  setCountryList,
  setCurrencyList,
  setPhoneCodeList,
  setPayoutMethod,
  setPayoutMethodOptions,
  setPropertiesAndRequiredFields,
  setBeneficiaryList,
  setSourceCurrency,
  setPurposeCodeList,
  setSelectedBeneficiary,
  setUploadReceipt,
  setTxnBusinessTag,
  setDownloadReceipt,
  setIsLoading,
  fetchExchangeRateRequest,
  fetchExchangeRateSuccess,
  fetchExchangeRateFailure,
  setAuditId,
  setFxRate,
  setHoldExpiryAt,
  // setPayload,
  setPayload,
  setSendMoneyRes,
  resetSetSendMoneyRes,
  setIsSuccess,
  resetPayload,
  setBeneficiaryList_awx,
  // resetSetSendMoneyRes
} from "../features/payments";
import { transactionDetailsPayments } from "./accounts.js";
import { triggerBase64Download } from "common-base64-downloader-react";
import { useDispatch, useSelector } from "react-redux";

// const platform = useSelector((state) => state.common.platform);

export const getCurrencyAndCountry = () => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.get(
      sessionStorage.getItem("baseUrl") + "/PaymentRoutes/listCountrycurrency"
    );
    let obj = response.data;
    dispatch(setIsLoading(false));
    if (obj.length == 0) {
      toast.error("Something went wrong");
    } else if (obj.statusText == "Internal Server Error") {
      toast.error("Internal Server Error");
    } else if (obj.status == "BAD_REQUEST") {
      toast.error(obj.message);
    } else {
      function onlyUnique(value, index, array) {
        const unique =
          array.findIndex((obj) => obj.label === value.label) === index;
        return unique;
      }
      const extractedcountry = obj?.List?.map((item) => ({
        label: item?.countryName,
        value: item?.iso2CharName,
        currency: item?.currencyCode,
      }));
      const extractedcurrency = obj?.List?.map((item) => ({
        label: item?.currencyName + " (" + item?.currencyCode + ")",
        value: item?.currencyCode,
      }));
      const extractedphonecode = obj?.List?.map((item) => ({
        label: "+" + item?.phoneCode + " (" + item?.countryName + ")",
        value: item?.iso2CharName,
        phonecode: item?.phoneCode,
      }));
      dispatch(setCountryList(extractedcountry.filter(onlyUnique)));
      dispatch(setCurrencyList(extractedcurrency.filter(onlyUnique)));
      dispatch(setPhoneCodeList(extractedphonecode.filter(onlyUnique)));
    }
  } catch (error) {
    dispatch(setIsLoading(false));
    console.error("Error fetching countrylist!", error);
  }
};
export const getBankName = (body) => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.post(
      sessionStorage.getItem("baseUrl") + "/PaymentRoutes/fetchBankName",
      body
    );
    let obj = response.data;
    if (obj.length == 0) {
    } else if (obj.statusText == "Internal Server Error") {
      toast.error("Internal Server Error");
    } else if (obj.status == "BAD_REQUEST") {
      toast.error(obj.message);
    } else {
      // const bankListWithValue = obj?.map((bank) => ({
      //   name: bank?.bankName,
      //   option: bank?.routingCodeValue?.map((item) => ({
      //     value: item,
      //     label: item,
      //   })),
      // }));

      const bankListWithValue = obj?.map((bank) => ({
        name: bank?.bankName,
        option: Array.from(new Set(bank?.routingCodeValue)).map((item) => ({
          value: item,
          label: item,
        })),
      }));

      const bankList = obj?.map((bank) => ({
        label: bank?.bankName,
        value: bank?.bankName,
      }));
      dispatch(setIsLoading(false));
      dispatch(setBankListWithValue(bankListWithValue));
      dispatch(setBankList(bankList));
    }
  } catch (error) {
    dispatch(setIsLoading(false));
    console.error("Error fetching bankname!", error);
  }
};
export const getPayoutMethod =
  (formData, setPending) => async (dispatch, getState) => {
    dispatch(setPayoutMethod(""));
    setPending(true);
    dispatch(setIsLoading(true));
    const countryList = getState().payments.countryList;
    try {
      const response = await axios.get(
        sessionStorage.getItem("baseUrl") +
          "/PaymentRoutes/fetchSupportedCorridors",
        {
          params: {
            destinationCountry: formData.destinationCountry,
            destinationCurrency: formData.destinationCurrency,
            accounttype: formData.beneficiaryAccountType,
          },
        }
      );
      let obj = response.data;
      let PayoutMethod = [];
      let selectedPaymentMethod = "";
      let filteredData = [];
      if (obj.status === "BAD_REQUEST") {
        toast.info(obj.message);
      }
      if (obj.length > 0) {
        filteredData = obj.filter(
          (item) =>
            item.payoutMethod === "LOCAL" || item.payoutMethod === "SWIFT"
        );
        // Remove duplicates
        const uniqueFilteredData = Array.from(
          new Set(filteredData.map(JSON.stringify))
        ).map(JSON.parse);
        // Check if 'LOCAL' is present in uniqueFilteredData
        const hasLocal = uniqueFilteredData.some(
          (item) => item.payoutMethod === "LOCAL"
        );
        const hasSwift = uniqueFilteredData.some(
          (item) => item.payoutMethod === "SWIFT"
        );
        if (hasLocal) {
          PayoutMethod.push({ label: "LOCAL", value: "LOCAL" });
        }
        if (hasSwift) {
          PayoutMethod.push({ label: "SWIFT", value: "SWIFT" });
        }
        // Assign PayoutMethod based on the presence of 'LOCAL'
        selectedPaymentMethod = hasLocal ? "LOCAL" : hasSwift ? "SWIFT" : "";
      }
      if (filteredData.length == 0) {
        toast.error(
          "Currently we are not supporting " +
            formData.destinationCurrency +
            " in " +
            countryList?.find(
              (item) => item.value === formData.destinationCountry
            )?.label +
            "."
        );
      } else if (obj.statusText == "Internal Server Error") {
        toast.error("Internal Server Error");
      } else if (obj.status == "BAD_REQUEST") {
        toast.error(obj.message);
      } else {
        dispatch(setPayoutMethodOptions(PayoutMethod));
        dispatch(setPayoutMethod(selectedPaymentMethod));
        if (selectedPaymentMethod)
          dispatch(
            getSchema({
              payoutMethod: selectedPaymentMethod,
              destinationCurrency: formData?.destinationCurrency,
              customerHashId: formData?.customerHashId,
            })
          );
      }
      setPending(false);
      dispatch(setIsLoading(false));
    } catch (error) {
      setPending(false);
      dispatch(setIsLoading(false));
      console.error("Error fetching supported Corridors!", error);
    }
  };
export const fetchsupportedcorridorv3 = (formdata) => async (dispatch) => {
  try {
    const response = await axios.get(
      sessionStorage.getItem("baseUrl") +
        "/PaymentRoutes/fetchSupportedCorridorsfullrespone",
      {
        params: {
          destinationCurrency: formdata?.destinationCurrency,
          destinationCountry: formdata?.destinationCountry,
          beneficiaryAccountType: formdata?.beneficiaryAccountType,
          payoutMethod: formdata?.payoutMethod,
          routingCodeType: formdata?.routingCodeType,
        },
      }
    );
    let obj = response.data;
    console.log("v3response", obj);
    dispatch(
      setPayload({
        deliveryTAT: obj[0].deliveryTAT,
        maximumAmount: obj[0].maximumAmount,
        minimumAmount: obj[0].minimumAmount,
      })
    );
    // let PayoutMethod = [];
    // let selectedPaymentMethod = "";
    // let filteredData;
    if (obj.status === "BAD_REQUEST") {
      toast.info(obj.message);
    }

    dispatch(setIsLoading(false));
  } catch (error) {
    dispatch(setIsLoading(false));
    console.error("Error fetching supported Corridors!", error);
  }
};
export const getSchema = (data) => async (dispatch) => {
  dispatch(setIsLoading(true));
  const body = {
    currencyCode: data?.destinationCurrency,
    payoutMethod: data?.payoutMethod,
  };
  try {
    const response = await axios.post(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/validationschema/${data?.customerHashId}`,
      body
    );
    let obj = response.data;
    if (obj.length == 0) {
      toast.error("Something went wrong");
    } else if (obj.statusText == "Internal Server Error") {
      toast.error("Internal Server Error");
    } else if (obj.status == "BAD_REQUEST") {
      toast.error(obj.message);
    } else {
      dispatch(setPropertiesAndRequiredFields(obj[0]));
    }
    dispatch(setIsLoading(false));
  } catch (error) {
    dispatch(setIsLoading(false));
    console.error("Error fetching validationschema!", error);
    return [];
  }
};
export const addBeneficiary =
  (formData, innermethod) => async (dispatch, getState) => {
    dispatch(setIsLoading(true));
    const customerHashId =
      getState().onboarding?.UserOnboardingDetails?.customerHashId;
    const body = formData;
    try {
      const response = await axios.post(
        sessionStorage.getItem("baseUrl") +
          `/PaymentRoutes/addBeneficeries/${customerHashId}`,
        body
      );
      let obj = response.data;
      switch (response.status) {
        case 200:
          if (obj?.status === "BAD_REQUEST") {
            const errors = obj.errors;
            errors.forEach((error) => {
              // console.error(error); // You can log it or handle it in any way you prefer
              toast.error(error);
            });
          } else if (obj?.status === "404") {
            toast.error(obj.error);
          } else if (obj?.status === "INTERNAL_SERVER_ERROR") {
            toast.error(obj.message);
          } else if (obj?.beneficiaryHashId) {
            innermethod();
            toast.success("Beneficiary added successfully...");
          }
          break;
        case 400:
          if (obj.status === "BAD_REQUEST") {
            toast.error(obj.message);
          }
          break;
        default:
          toast.error(obj.message);
      }
      dispatch(setPayoutMethod(""));
      dispatch(setIsLoading(false));
    } catch (error) {
      dispatch(setIsLoading(false));
      console.log(error.message);
      console.error("Error adding beneficiary:", error.message);
      toast.error(error.message);
      return [];
    }
  };

// export const addBeneficiaryawx

export const addBeneficiaryawx =
  ({ formData, awxAccountId, authToken }) =>
  async (dispatch, getState) => {
    dispatch(setIsLoading(true));

    console.log(JSON.stringify(formData, null, 2));

    // const customerHashId =
    //   getState().onboarding?.UserOnboardingDetails?.customerHashId;
    const accountId = getState().auth.awxAccountId;
    const body = { formData, awxAccountId, authToken };
    try {
      const response = await axios.post(
        sessionStorage.getItem("baseUrl") + `/PaymentRoutes/addBeneficeriesAWX`,
        body
      );
      let obj = response.data;
      switch (response.status) {
        case 201:
          if (obj?.beneficiaryHashId) {
            toast.success("Beneficiary added successfully...");
          }
          break;
        case 400:
          if (obj.status === "BAD_REQUEST") {
            toast.error(obj.message);
          }
          break;
        default:
          toast.error(obj.message);
      }
      dispatch(setPayoutMethod(""));
      dispatch(setIsLoading(false));
    } catch (error) {
      const errData = error?.response?.data;
      // Handle structured error from backend
      if (errData?.status === "VALIDATION_FAILED") {
        (errData.errors || []).forEach((msg) => toast.error(msg));
      } else if (errData?.message) {
        toast.error(errData.message);
      } else {
        toast.error("Something went wrong while adding beneficiary.");
      }

      dispatch(setIsLoading(false));
      return [];
    }
  };

export const listbeneficiaries = (customerHashId) => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.get(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/listBeneficiries/${customerHashId}`
    );
    let obj = response.data;
    if (obj.statusText == "Internal Server Error") {
      toast.error("Internal Server Error");
      dispatch(setIsLoading(false));
    } else if (obj.status == "BAD_REQUEST") {
      toast.error(obj.message);
      dispatch(setIsLoading(false));
    } else {
      dispatch(setBeneficiaryList(obj));
      dispatch(setIsLoading(false));
    }
  } catch (error) {
    dispatch(setIsLoading(false));
    console.error("Error fetching beneficiaries:", error);
    dispatch(setBeneficiaryList([]));
  }
};

export const listBeneficiary_awx =
  (awxAccountId, authToken) => async (dispatch) => {
    debugger;
    const body = {
      awxAccountId,
      authToken,
    };
    try {
      const response = await axios.post(
        sessionStorage.getItem("baseUrl") +
          `/PaymentRoutes/listBeneficeriesAWX`,
        body
      );
      let obj = response.data;
      if (obj) {
        dispatch(setBeneficiaryList_awx(obj));
      }
    } catch (error) {
      console.error("Error in list beneficiary_awx:", error);
    }
  };

export const fetchCurrency = (customerHashId) => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.get(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/listCurrency/${customerHashId}`
    );
    let obj = response.data;
    console.log(obj);
    dispatch(setSourceCurrency(obj));
    dispatch(setIsLoading(false));
    // return obj;
  } catch (error) {
    dispatch(setIsLoading(false));
    console.error("Error fetching currency:", error);
    // return [];
    dispatch(setSourceCurrency([]));
  }
};
export const listpurposeCode = () => async (dispatch) => {
  dispatch(setIsLoading(true));
  try {
    const response = await axios.get(
      sessionStorage.getItem("baseUrl") + "/PaymentRoutes/listpurposeCode"
    );
    let obj = response.data;
    if (obj.length == 0) {
      toast.error("Something went wrong");
    } else if (obj.statusText == "Internal Server Error") {
      toast.error("Internal Server Error");
    } else if (obj.status == "BAD_REQUEST") {
      toast.error(obj.message);
    } else {
      // return obj;
      dispatch(setPurposeCodeList(obj));
    }
    dispatch(setIsLoading(false));
  } catch (error) {
    dispatch(setIsLoading(false));
    console.error("Error fetching purposecode!", error);
    dispatch(setPurposeCodeList([]));
  }
};
export const fetchDetails =
  (beneficiaryHashId, customerHashId) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
      const response = await axios.get(
        sessionStorage.getItem("baseUrl") +
          `/PaymentRoutes/fetchBeneficiryDetails/${beneficiaryHashId}/${customerHashId}`
      );
      let obj = response.data;
      dispatch(setSelectedBeneficiary(obj));
      dispatch(setIsLoading(false));
      // return obj;
    } catch (error) {
      dispatch(setIsLoading(false));
      dispatch(setSelectedBeneficiary(null));
      console.error("Error fetching beneficiaries:", error);
      return {};
    }
  };
// upload Reciept
export const uploadReciept =
  (formData, custHashId) => async (dispatch, getState) => {
    const sendData = {
      document: formData?.baseFile,
      receiptFileName: formData?.fileName,
      receiptType: formData?.fileType,
    };
    if (custHashId == "" || custHashId == null) {
      return [];
    } else {
      try {
        const response = await axios.post(
          sessionStorage.getItem("baseUrl") + "/PaymentRoutes/uploadReciept",
          sendData,
          {
            params: {
              txnId: formData?.txnId,
              custHashId: custHashId,
            },
          }
        );
        let obj = response.data;
        if (obj.status == "OK" && obj.errors.length == 0) {
          toast.success("Transaction receipt uploaded successfully!");
          dispatch(setUploadReceipt(obj));
          dispatch(
            transactionDetailsPayments(getState().payments?.txnData, custHashId)
          );
        } else {
          toast.error(obj.message);
        }
      } catch (error) {
        // Handle any errors here
        console.error("Error:", error);
        if (error instanceof AxiosError) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.status === "BAD_REQUEST"
          ) {
            toast.error(error.response.data.message);
          } else {
            toast.error(error.response.data.message);
          }
        } else {
          toast.error("Something went wrong! Please try again later.");
        }
      }
    }
  };
//Business transaction tag
export const businessTxnTag =
  (formData, custHashId) => async (dispatch, getState) => {
    if (custHashId == "" || custHashId == null) {
      return [];
    } else {
      var authCode = formData.txnId;
      var businessTag = formData.businessTag;
      try {
        const response = await axios.get(
          sessionStorage.getItem("baseUrl") + "/PaymentRoutes/businessTag",
          {
            params: {
              txnId: authCode,
              businessTag: businessTag,
              custHashId: custHashId,
            },
          }
        );
        let obj = response.data;
        console.log(obj);
        if (obj.status == "OK" && obj.errors.length == 0) {
          dispatch(setTxnBusinessTag(obj));
          dispatch(
            transactionDetailsPayments(getState().payments?.txnData, custHashId)
          );
        } else {
          toast.error(obj.message);
        }
      } catch (error) {
        // Handle any errors here
        console.error("Error:", error);
        if (error instanceof AxiosError) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.status === "BAD_REQUEST"
          ) {
            toast.error(error.response.data.message);
          } else {
            toast.error(error.response.data.message);
          }
        } else {
          toast.error("Something went wrong! Please try again later.");
        }
      }
    }
  };
// Download receipt
export const downloadReceipt = (formData, custHashId) => async (dispatch) => {
  var buttonText = document.getElementById("button-textDownloadReceipt");
  var buttonLoader = document.getElementById("button-loaderDownloadReceipt");
  if (custHashId == "" || custHashId == null) {
    return [];
  } else {
    buttonText.style.display = "none";
    buttonLoader.style.display = "flex";
    try {
      const response = await axios.get(
        sessionStorage.getItem("baseUrl") + "/PaymentRoutes/downloadReceipt",
        {
          params: {
            txnId: formData?.txnId,
            custHashId: custHashId,
          },
        }
      );
      let obj = response.data;
      console.log(obj);
      buttonText.style.display = "flex";
      buttonLoader.style.display = "none";
      if (obj.document && obj.document !== "") {
        dispatch(setDownloadReceipt(obj));
        triggerBase64Download(
          "data:" + obj?.receiptType + ";base64," + obj?.document,
          obj?.receiptFileName
        );
        toast.success("Transaction receipt downloaded successfully!");
      } else {
        toast.error(obj.message);
      }
    } catch (error) {
      buttonText.style.display = "flex";
      buttonLoader.style.display = "none";
      // Handle any errors here
      console.error("Error:", error);
      if (error instanceof AxiosError) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.status === "BAD_REQUEST"
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("Something went wrong! Please try again later.");
      }
    }
  }
};
export const updateBeneficiary =
  (formData, beneficiaryHashId) => async (dispatch, getState) => {
    dispatch(setIsLoading(true));
    const customerHashId =
      getState().onboarding?.UserOnboardingDetails?.customerHashId;
    const body = formData;
    try {
      const response = await axios.post(
        sessionStorage.getItem("baseUrl") +
          `/PaymentRoutes/editBeneficiary/${customerHashId}/${beneficiaryHashId}`,
        body
      );
      let obj = response.data;
      switch (response.status) {
        case 200:
          if (obj.status === "404") {
            toast.error(obj.error);
          }
          if (obj.status === "BAD_REQUEST") {
            toast.error(obj.message);
          }
          if (obj.beneficiaryHashId) {
            dispatch(setSelectedBeneficiary(obj));
            toast.success(
              formData.beneficiaryName + "'s details updated successfully."
            );
          }
          break;
        default:
          toast.error(obj.message);
      }
      dispatch(setIsLoading(false));
      return obj;
    } catch (error) {
      dispatch(setIsLoading(false));
      console.log(error.message);
      console.error("Error in update beneficiary :", error.message);
      toast.error(error.message);
    }
  };
export const fetchexcahngerate = (
  source_currency,
  destinationCurrency,
  customerHashId
) => {
  return async (dispatch) => {
    dispatch(fetchExchangeRateRequest());
    dispatch(setIsLoading(true));
    const body = {
      sourceCurrency: source_currency,
      destinationCurrency: destinationCurrency,
    };
    try {
      const response = await axios.post(
        sessionStorage.getItem("baseUrl") +
          `/PaymentRoutes/fetchexcahngerate/${customerHashId}`,
        body
      );
      let obj = response.data;
      if (obj.length === 0) {
        dispatch(setIsLoading(false));
        toast.error("Something went wrong");
        dispatch(fetchExchangeRateFailure("Something went wrong"));
      } else if (obj.statusText === "Internal Server Error") {
        dispatch(setIsLoading(false));
        toast.error("Internal Server Error");
        dispatch(fetchExchangeRateFailure("Internal Server Error"));
      } else if (obj.status === "BAD_REQUEST") {
        dispatch(setIsLoading(false));
        toast.error(obj.message);
        dispatch(fetchExchangeRateFailure(obj.message));
      } else {
        dispatch(fetchExchangeRateSuccess(obj));
        dispatch(setAuditId(obj.audit_id));
        dispatch(setFxRate(obj.fx_rate));
        dispatch(
          setPayload({
            ...setPayload,
            fxrate: obj?.fx_rate,
            audit_id: obj?.audit_id,
          })
        );
        dispatch(setHoldExpiryAt(obj?.hold_expiry_at));
        dispatch(setIsLoading(false));
        // dispatch(
        //   setPayload({
        //     audit_id: obj.audit_id,
        //     fx_rate: obj.fx_rate,
        //     source_currency: obj.source_currency,
        //   })
        // );
      }
    } catch (error) {
      dispatch(setIsLoading(false));
      console.error("Error fetching exchange rate!", error);
      toast.error("Error fetching exchange rate!");
      dispatch(fetchExchangeRateFailure(error.message));
    }
  };
};

export const sendMoney = (payload, customerHashId) => async (dispatch) => {
  dispatch(setIsLoading(true));
  let beneficiaryid = payload.id;
  let customerComments = payload.customerComments;
  let source_currency = payload.sourceCurrency;
  let source_amount = payload.sourceAmount;
  let purposeCode = payload.purposeCode;
  let sourceOfFunds = payload.sourceOfFunds;
  //let exemptionCode = payload.exemptionCode;
  let audit_id = payload.audit_id;
  let swiftFeeType = payload.swiftcode;

  let payout;

  payout = {
    audit_id: audit_id,
    source_amount: source_amount,
    swiftFeeType: swiftFeeType,
  };
  let beneficiary = {
    id: beneficiaryid,
  };

  const body = {
    beneficiary: beneficiary,
    customerComments: customerComments,
    payout: payout,
    purposeCode: purposeCode,
    sourceOfFunds: sourceOfFunds,
    //exemptionCode: exemptionCode,
  };

  try {
    const response = await axios.post(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/sendMoney/${customerHashId}`,
      body
    );
    let obj = response.data;
    dispatch(setSendMoneyRes(obj));
    if (obj.message === "Transfer Initiated") {
      toast.success("Money sent successfully...");
      dispatch(setIsSuccess(true));
      dispatch(setIsLoading(false));
    }
    if (obj.status === "BAD_REQUEST") {
      toast.error(obj.errors[0]);
      dispatch(setIsSuccess(true));
      dispatch(setIsLoading(false));
    }
    if (obj.status === "404") {
      toast.error(obj.error);
      dispatch(setIsSuccess(true));
      dispatch(setIsLoading(false));
    }
  } catch (error) {
    dispatch(setSendMoneyRes(error.response.data));
    toast.error(error.response.data);
    dispatch(setIsSuccess(false));
    dispatch(setIsLoading(false));
  }
};

export const sendMoney_awx =
  (payload, awxAccountId, authToken) => async (dispatch) => {
    dispatch(setIsLoading(true));
    const uuid = crypto.randomUUID(); // Generate a unique UUID
  
    const body = {
      beneficiary_id: payload.beneficiary_id,
      transfer_currency: payload.obj.values.transfer_currency,
      transfer_method: payload.obj.values.transfer_method,
      reason: payload.purposeCode,
      reference: `Test ${uuid}`, // Replace with actual guid if needed
      request_id: uuid, // Replace with actual guid if needed
      source_amount: payload.obj.values.source_amount,
      source_currency: payload.obj.values.source_currency,
      swift_charge_option: "SHARED",
      awxAccountId, authToken
    };

    try {
      const response = await axios.post(
        sessionStorage.getItem("baseUrl") + `/PaymentRoutes/sendMoney_AWX`,
        body 
      );
      let obj = response.data;
      if (obj.id) {
        toast.success("Money sent successfully...");
        dispatch(setIsSuccess(true));
        dispatch(setIsLoading(false));
        dispatch(setSendMoneyRes(obj));
      }
      if (obj.status === "BAD_REQUEST") {
        toast.error(obj.errors[0]);
        dispatch(setIsSuccess(true));
        dispatch(setIsLoading(false));
      }
      if (obj.status === "404") {
        toast.error(obj.error);
        dispatch(setIsSuccess(true));
        dispatch(setIsLoading(false));
      }
    } 
    // catch (error) {
    //   dispatch(setSendMoneyRes(error.response));
    //   toast.error(error.response);
    //   dispatch(setIsSuccess(false));
    //   dispatch(setIsLoading(false));
    // }

    catch (error) {
      const status = error?.response?.status;
      const errData = error?.response?.data;

      if (status === 400) {
        toast.error(
          errData?.message ||
            "There is an issue with your request. Please review and try again."
        );
      } else {
        toast.error("Something went wrong. Please try again later.");
      }

      dispatch(setSendMoneyRes(errData));
      dispatch(setIsSuccess(false));
    } finally {
      dispatch(setIsLoading(false));
    }

  };
