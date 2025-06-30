import Axios from "axios";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {setIsLoading} from "../../../@redux/features/payments"
import { useDispatch } from "react-redux";
//const [tableData,setTableData]=useState('');

//list Beneficiaries

// export const listbeneficiaries = async (customerHashId) => {
//   try {
//     const response = await Axios.get(
//       sessionStorage.getItem("baseUrl") +
//         `/PaymentRoutes/listBeneficiries/${customerHashId}`
//     );
//     let obj = response.data;
//     if (obj.length == 0) {
//       // toast.error("Beneficiary list is empty");
//     } else if (obj.statusText == "Internal Server Error") {
//       toast.error("Internal Server Error");
//     } else if (obj.status == "BAD_REQUEST") {
//       toast.error(obj.message);
//     } else {
//       return obj;
//     }
//   } catch (error) {
//     console.error("Error fetching beneficiaries:", error);
//     return [];
//   }
// };

export const fetchDetails = async (beneficiaryHashId, customerHashId) => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/fetchBeneficiryDetails/${beneficiaryHashId}/${customerHashId}`
    );
    let obj = response.data;
    return obj;
  } catch (error) {
    console.error("Error fetching beneficiaries:", error);
    return [];
  }
};
export const onDelete = async (customerHashId, beneficiaryHashId) => {
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/deleteBeneficiry/${beneficiaryHashId}/${customerHashId}`
    );
    let obj = response.data;
    switch (response.status) {
      case 200:
        if (obj.hasOwnProperty("message")) {
          toast.success(obj.message);

          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        if (obj.hasOwnProperty("errors")) {
          toast.error(obj.errors[0].message);
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

    return obj;
  } catch (error) {
    console.error("Error fetching beneficiaries:", error);
    return [];
  }
};

// fetch currency
export const fetchCurrency = async (customerHashId) => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/listCurrency/${customerHashId}`
    );
    let obj = response.data;
    console.log(obj);
    return obj;
  } catch (error) {
    console.error("Error fetching currency:", error);
    return [];
  }
};

// add beneficiary
// export const addBeneficiry = async (formData, customerHashId) => {
//   const body = formData;

//   console.log(body);

//   try {
//     const response = await Axios.post(
//       sessionStorage.getItem("baseUrl") +
//         `/PaymentRoutes/addBeneficeries/${customerHashId}`,
//       body
//     );
//     let obj = response.data;
//     switch (response.status) {
//       case 200:
//         if (obj?.status === "BAD_REQUEST") {
//           const errors = obj.errors;
//           errors.forEach((error) => {
//             // console.error(error); // You can log it or handle it in any way you prefer
//             toast.error(error);
//           });
//         } else if (obj?.status === "404") {
//           toast.error(obj.error);
//         } else if (obj?.status === "INTERNAL_SERVER_ERROR") {
//           toast.error(obj.message);
//         } else if (obj?.beneficiaryHashId) {
//           toast.success("Beneficiary added succesfully...");
//         }
//         break;
//       case 400:
//         if (obj.status === "BAD_REQUEST") {
//           toast.error(obj.message);
//         }
//         break;
//       default:
//         toast.error(obj.message);
//     }

//     // let obj = response;
//     // console.log(obj);
//     // if (obj.status == "BAD_REQUEST") {
//     //   toast.error(obj.message);
//     // } else if (obj.statusText == "Internal Server Error") {
//     //   toast.error("Internal Server Error");
//     // }
//     // else {
//     //  //toast.success("Beneficiary added succesfully...");
//     // }
//     return obj;
//   } catch (error) {
//     console.log(error.message);
//     console.error("Error adding beneficiary:", error.message);
//     toast.error(error.message);
//     return [];
//   }
// };

// send Money
export const sendMoney = async (paymentbody, customerHashId) => {
  
  // dispatch(setIsLoading(true));
  let beneficiaryid = paymentbody.beneficiaryid;
  let customerComments = paymentbody.customerComments;
  let source_currency = paymentbody.source_currency;
  let source_amount = paymentbody.source_amount;
  let purposeCode = paymentbody.purposeCode;
  let sourceOfFunds = paymentbody.sourceOfFunds;
  //let exemptionCode = paymentbody.exemptionCode;
  let audit_id = paymentbody.audit_id;
  let swiftFeeType = paymentbody.swiftFeeType;
  let payout;

  payout = {
    audit_id: audit_id,
    source_amount: source_amount,
    swiftFeeType: swiftFeeType,
  };

  const beneficiary = {
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
  console.log(body);
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/sendMoney/${customerHashId}`,
      body
    );
    let obj = response.data;
    switch (response.status) {
      case 200:
        if (obj.status === "BAD_REQUEST") {
          toast.error(obj.errors[0]);
        } else if (obj.status === "404") {
          toast.error(obj.error);
        } else if (obj.status === "INTERNAL_SERVER_ERROR") {
          toast.error(obj.message);
        } else if (obj.message === "Transfer Initiated") {
          toast.success("Money sent successfully...");
        }
        break;
      default:
        toast.error(obj.message);
    }
    // dispatch(setIsLoading(false));
    return obj;
  } catch (error) {
    // dispatch(setIsLoading(false));
    console.log(error.message);
    console.error("Error sending money :", error.message);
    toast.error(error.message);
    return [];
  }
};

export const fetchSupportedCorridors = async (formData) => {
  try {
    console.log(formData);
    const response = await Axios.get(
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
    let PayoutMethod;
    if (obj.length > 0) {
      const filteredData = obj.filter(
        (item) => item.payoutMethod === "LOCAL" || item.payoutMethod === "SWIFT"
      );
      // Remove duplicates
      const uniqueFilteredData = Array.from(
        new Set(filteredData.map(JSON.stringify))
      ).map(JSON.parse);

      // Check if 'LOCAL' is present in uniqueFilteredData
      const hasLocal = uniqueFilteredData.some(
        (item) => item.payoutMethod === "LOCAL"
      );

      // Assign PayoutMethod based on the presence of 'LOCAL'
      PayoutMethod = hasLocal ? "LOCAL" : "SWIFT";
    }
    if (obj.length == 0) {
      toast.error("No payout method found");
    } else if (obj.statusText == "Internal Server Error") {
      toast.error("Internal Server Error");
    } else if (obj.status == "BAD_REQUEST") {
      toast.error(obj.message);
    } else {
      return PayoutMethod;
    }
  } catch (error) {
    console.error("Error fetching supported Corridors!", error);
    return [];
  }
};

export const fetchexcahngerate = async (
  source_currency,
  destinationCurrency,
  customerHashId
) => {
  const body = {
    sourceCurrency: source_currency,
    destinationCurrency: destinationCurrency,
    // customerHashId: customerHashId,
  };
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/fetchexcahngerate/${customerHashId}`,
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
      return obj;
    }
  } catch (error) {
    console.error("Error fetching exchange rate!", error);
    return [];
  }
};

export const beneficiaryValidationSchema = async (
  payoutmethod,
  destinationCurrency,
  customerHashId
) => {
  const body = {
    currencyCode: destinationCurrency,
    payoutMethod: payoutmethod,
  };
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/validationschema/${customerHashId}`,
      body
    );
    let obj = response.data;
    let routingCodeType1 = [];
    for (let i = 0; i < obj.length; i++) {
      routingCodeType1.push(obj[i].properties.routingCodeType1.const);
    }

    if (obj.length == 0) {
      toast.error("Something went wrong");
    } else if (obj.statusText == "Internal Server Error") {
      toast.error("Internal Server Error");
    } else if (obj.status == "BAD_REQUEST") {
      toast.error(obj.message);
    } else {
      return routingCodeType1;
    }
  } catch (error) {
    console.error("Error fetching validationschema!", error);
    return [];
  }
};

export const fetchBank = async (
  query,
  destinationCurrency,
  destinationCountry,
  selectroutingcodeType
) => {
  const body = {
    currencyCode: destinationCurrency,
    searchValue: query,
    countryCode: destinationCountry,
    routingCodeType: selectroutingcodeType,
  };
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/PaymentRoutes/fetchBankName",
      body
    );
    let obj = response.data;
    if (obj.length == 0) {
      // toast.error("");
    } else if (obj.statusText == "Internal Server Error") {
      toast.error("Internal Server Error");
    } else if (obj.status == "BAD_REQUEST") {
      toast.error(obj.message);
    } else {
      return obj;
    }
  } catch (error) {
    console.error("Error fetching bankname!", error);
    return [];
  }
};

export const listpurposeCode = async () => {
  try {
    const response = await Axios.get(
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
      return obj;
    }
  } catch (error) {
    console.error("Error fetching purposecode!", error);
    return [];
  }
};

//fetch transacction status

export const fetchtransactionstatus = async (
  system_reference_number,
  customerHashId
) => {
  const body = {
    systemReferenceNumber: system_reference_number,
  };
  console.log(body);
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/fetchpaymentstatus/${customerHashId}`,
      body
    );
    let obj = response.data;
    switch (response.status) {
      case 200:
        if (obj.status === "BAD_REQUEST") {
          toast.error(obj.message);
        } else if (obj.status === "404") {
          toast.error(obj.error);
        }
        // else {
        //   toast.success("Money sent successfully...");
        // }
        break;
      case 400:
        if (obj.status === "BAD_REQUEST") {
          toast.error(obj.message);
        }
        break;
      default:
        toast.error(obj.message);
    }

    return obj;
  } catch (error) {
    console.error("Error:", error);
    toast.error("An error occurred. Please try again later.");
    return [];
  }
};
export const editBeneficiary = async (basicinfo, customerHashId) => {
  const body = basicinfo;
  console.log(body);
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/editBeneficiary/${customerHashId}`,
      body
    );
    let obj = response.data;
    switch (response.status) {
      case 200:
        if (obj.status === "BAD_REQUEST") {
          toast.error(obj.message);
        } else if (obj.status === "404") {
          toast.error(obj.error);
        } else if (obj.status === "INTERNAL_SERVER_ERROR") {
          toast.error(obj.message);
        } else {
          toast.success("Beneficiary updated successfully...");
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

    return obj;
  } catch (error) {
    console.log(error.message);
    console.error("Error in update beneficiary :", error.message);
    toast.error(error.message);
    return [];
  }
};
// export const listCountrycurrency = async () => {
//   try {
//     const response = await Axios.get(
//       sessionStorage.getItem("baseUrl") + "/PaymentRoutes/listCountrycurrency"
//     );
//     let obj = response.data;

//     if (obj.length == 0) {
//       toast.error("Something went wrong");
//     } else if (obj.statusText == "Internal Server Error") {
//       toast.error("Internal Server Error");
//     } else if (obj.status == "BAD_REQUEST") {
//       toast.error(obj.message);
//     } else {
//       return obj;
//     }
//   } catch (error) {
//     console.error("Error fetching countrylist!", error);
//     return [];
//   }
// };

export const fetchBeneficiaryValidationSchema = async (
  formData,
  payoutMethod,
  customerHashId
) => {
  const body = {
    currencyCode: formData.destinationCurrency,
    payoutMethod: payoutMethod,
  };
  // console.log(formData, 5454);
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") +
        `/PaymentRoutes/fetchBeneficiaryValidationSchema/${customerHashId}`,
      body
    );
    let obj = response.data;
    switch (response.status) {
      case 200:
        if (obj.status === "BAD_REQUEST") {
          toast.error(obj.message);
        } else if (obj.status === "404") {
          toast.error(obj.error);
        } else if (obj.status === "INTERNAL_SERVER_ERROR") {
          toast.error(obj.message);
        } else {
          toast.success("");
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

    return obj;
  } catch (error) {
    console.log(error.message);
    console.error("", error.message);
    toast.error(error.message);
    return [];
  }
};

export const ConfirmPayee = () => {};
