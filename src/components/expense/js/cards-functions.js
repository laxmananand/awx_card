import Axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { closeLoader, openLoader } from "../../../@redux/features/common";
import axios from "axios";

// Create an Axios instance
const axiosInstance = Axios.create({
    baseURL: sessionStorage.getItem("baseUrl"),
    withCredentials: true,
});

export const listcards = async (walletHashid, customerHashId) => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/expense/listcards",
      {
        params: {
          wallethashId: walletHashid,
          customerhashId: customerHashId,
        },
      }
    );

    let obj = response?.data;
    if (obj?.message === "No card has been added yet.") {
      return obj?.message;
    }

    if (response?.status === 200 && response?.data) {
      console.log("Data found:", response?.data);
      let carddata = obj?.content;
      return carddata;
    } else {
      console.log("No Cards found or Internal Server Error!");
      toast.error("Something went Wrong");
      return null;
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to retrieve card list. Please try again later.");
    return null;
  }
};

export const getcvvandexpiry = async (cardHashId, walletHashid, customerHashId) => {

  const response = await Axios.get(
    sessionStorage.getItem("baseUrl") + "/expense/getcvvandexpiry",
    {
      params: {
        wallethashId: walletHashid,
        customerhashId: customerHashId,
        cardhashId: cardHashId,
      },
    }
  );
  let obj = response.data;
  if (response.status === 200 && response.data) {
    console.log("Data found:", response.data);
    let obj = response.data;
    let cvv = obj.cvv;
    let expiry = obj.expiry;
    let decodedcvv = atob(cvv);
    let decodedexpiry = atob(expiry);
    const decodedData = {
      cvv: decodedcvv,
      expiry: decodedexpiry,
    };

    console.log("Decoded Data:", decodedData);

    return decodedData;
  }
  if (obj.length == 0) {
    console.log("Card unmasking failed");
  } else {
    console.log("No unmaskedcard number not found or Internal Server Error!");
    toast.error("Something went Wrong");
    return null;
  }
};

export const getcardnumber = async (cardHashId, walletHashid, customerHashId) => {
  debugger;
  debugger;

  const response = await Axios.get(
    sessionStorage.getItem("baseUrl") + "/expense/getcardnumber",
    {
      params: {
        wallethashId: walletHashid,
        customerhashId: customerHashId,
        cardhashId: cardHashId,
      },
    }
  );
  let obj = response.data;
  if (response.status === 200 && response.data) {
    console.log("Data found:", response.data);
    let obj = response.data;

    return obj;
  }
  if (obj.length == 0) {
    //toast.error("No invoice found")
    console.log("Card unmasking failed");
  } else {
    console.log("No unmaskedcard number not found or Internal Server Error!");
    toast.error("Something went Wrong");
    return null;
  }
};

export const getcardlimitdata = async (cardHashId, walletHashid, customerHashId) => {
  const response = await Axios.get(
    sessionStorage.getItem("baseUrl") + "/expense/getcardlimitdata",
    {
      params: {
        wallethashId: walletHashid,
        customerhashId: customerHashId,
        cardhashId: cardHashId,
      },
    }
  );
  let obj = response.data;
  if (response.status === 200 && response.data) {
    console.log("Data found:", response.data);
    let obj = response.data;
    let carddata = obj.transactionLimits;

    return carddata;
  }
  if (obj.length == 0) {
    console.log("limit no set");
  } else {
    console.log("No cardlimit data found or Internal Server Error!");
    toast.error("Something went Wrong");
    return null;
  }
};

export const setcardpin = async (cardHashId, encodedPin, walletHashid, customerHashId) => {
  debugger;

  const response = await Axios.get(
    sessionStorage.getItem("baseUrl") + "/expense/setpincard",
    {
      params: {
        wallethashId: walletHashid,
        customerhashId: customerHashId,
        cardhashId: cardHashId,
        pin: encodedPin,
      },
    }
  );
  let obj = response.data;
  if (response.status === 200 && response.data) {
    console.log("Data found:", response.data);
    let obj = response.data;

    console.log("set PIN response", obj);

    return obj;
  }
{
    toast.error("Unable to set pin, please try again!");
    return null;
  }
};

export const addcard = async (nameoncard, cardtype) => {
  debugger;

  var walletHashid = sessionStorage.getItem("walletHashId");
  var customerHashId = sessionStorage.getItem("customerHashId");
  var cardhashIdexist = sessionStorage.getItem("primaryCardHashid");
  if (cardhashIdexist) {
    var primarycardhashid = sessionStorage.getItem("primaryCardHashid");
    var cardissuanceAction = "ADD_ON";
  } else {
    var primarycardhashid = "";
    var cardissuanceAction = "NEW";
  }
  const response = await Axios.get(
    sessionStorage.getItem("baseUrl") + "/expense/addcard",
    {
      params: {
        wallethashId: walletHashid,
        customerhashId: customerHashId,
        nameOnCard: nameoncard,
        cardType: cardtype,
        primarycardHashid: primarycardhashid,
        cardIssuanceAction: cardissuanceAction,
      },
    }
  );
  let obj = response.data;
  if (response.status === 200 && response.data) {
    console.log("Add card Response", response.data);
    let obj = response.data;
    console.log(obj);
    if (obj.status == "BAD_REQUEST") {
      toast.error(obj.message);
    } else {
      toast.success(obj.cardActivationStatus + "Card Created successfully");
    }

    return obj;
  }
  if (obj.length == 0) {
    //toast.error("No invoice found")
    console.log("Card Add failed");
  } else {
    console.log("No unmaskedcard number not found or Internal Server Error!");
    toast.error("Something went Wrong");
    return null;
  }
};

export const addSpendControls = async (cardHashId, walletHashid, customerHashId, enterDailyLimit, enterMonthlyLimit, enterTransactionPerLimit) => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/expense/setCardlimit",
      {
        params: {
          cardHashId,
          walletHashid,
          customerHashId,
          enterDailyLimit,
          enterMonthlyLimit,
          enterTransactionPerLimit,
        },
      }
    );

    if (response.status === 200 && response.data) {
      console.log("Set card limit response:", response.data);
      const obj = response.data;

      if (obj.success) {
        toast.success(obj.message);
      } else {
        toast.error("Some error occurred at card limit set");
      }

      return obj;
    }
  } catch (error) {
    console.error("Error in addSpendControls:", error);
    toast.error("Something went wrong");
    return null;
  }
};

export const listcardsdispatch = (walletHashid, customerHashId) => async (dispatch) => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/expense/listcards",
      {
        params: {
          wallethashId: walletHashid,
          customerhashId: customerHashId,
        },
      }
    );

    let obj = response?.data;
    if (obj?.message === "No card has been added yet.") {
      dispatch({ type: "NO_CARDS_ADDED", payload: obj?.message });
      return;
    }

    if (response?.status === 200 && response?.data) {
      let cardData = obj?.content;
      dispatch({ type: "LIST_CARDS", payload: cardData });
    } else {
      console.log("No Invoice found or Internal Server Error!");
      toast.error("Something went wrong");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to retrieve card data. Please try again later.");
  }
};


export const addVirtualCardApi = (walletHashid, customerHashId, contactName, email) =>
  async (dispatch) => {
    try {
      dispatch(openLoader());

      // API call to add virtual card
      const response = await axiosInstance.post(
        `${sessionStorage.getItem("baseUrl")}/expense/addVirtualCard`,
        null, // No body, params are passed in the config
        {
          params: {
            wallethashId: walletHashid,
            customerhashId: customerHashId,
            contactName,
            email,
          },
        }
      );

      const obj = response.data;

      if (obj?.status !== "BAD_REQUEST") {
        toast.success("Virtual Card added successfully!");
        // Now dispatch listcards action separately
        //dispatch(listcardsdispatch(walletHashid, customerHashId));
      }

      dispatch(closeLoader());
    } catch (error) {
      console.error(error);
      toast.error("Not able to add virtual card. Please try again later.");
      dispatch(closeLoader());
    }
  };


  
export const temporaryBlockCardApi = async (walletHashid, customerHashId, cardHashId) => {
    try {
      const response = await axios.post(
        `${sessionStorage.getItem("baseUrl")}/expense/temporaryBlock`,
        {
          wallethashId: walletHashid,
          customerhashId: customerHashId,
          cardhashId: cardHashId,
        }
      );
    
      if (response?.status === 200 && response?.data) {
        const responseData = response.data;
  
        if (responseData?.message === "Card is successfully locked") {
          return responseData.message;
        }
        } else {
        console.error("Unexpected response:", response);
        toast.error("Something went wrong while blocking the card.");
        return null;
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error("An error occurred. Please try again.");
      return null;
    }
  };

  export const permanentBlockCardApi = async (walletHashid, customerHashId, cardHashId, selectedReason) => {
    try {
      const response = await axios.post(
        `${sessionStorage.getItem("baseUrl")}/expense/permanentBlock`,
        {
          wallethashId: walletHashid,
          customerhashId: customerHashId,
          cardhashId: cardHashId,
          selectedReason: selectedReason
        }
      );
    
      if (response?.status === 200 && response?.data) {
        const responseData = response.data;
  
        if (responseData?.status === "Success") {
          return responseData?.status;
        }
        } else {
        console.error("Unexpected response:", response);
        toast.error("Something went wrong while blocking the card.");
        return null;
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error("An error occurred. Please try again.");
      return null;
    }
  };



  export const activeCardApi = async (walletHashid, customerHashId, cardHashId) => {
    try {
      const response = await axios.post(
        `${sessionStorage.getItem("baseUrl")}/expense/activeCard`,
        {
          wallethashId: walletHashid,
          customerhashId: customerHashId,
          cardhashId: cardHashId,
        }
      );
    
      if (response?.status === 200 && response?.data) {
        const responseData = response.data;
        if (responseData?.message === "Bad Request: Activation not allowed for 24 hours from issuance") {
          return "Wait";
        }  
        if (responseData?.status === "Active") {
          return responseData?.status;
        }
        } else {
        console.error("Unexpected response:", response);
        toast.error("Something went wrong while blocking the card.");
        return null;
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error("An error occurred. Please try again.");
      return null;
    }
  };

  export const temporaryUnBlockCardApi = async (walletHashid, customerHashId, cardHashId) => {
    try {
      const response = await axios.post(
        `${sessionStorage.getItem("baseUrl")}/expense/temporaryUnBlock`,
        {
          wallethashId: walletHashid,
          customerhashId: customerHashId,
          cardhashId: cardHashId,
        }
      );
    
      if (response?.status === 200 && response?.data) {
        const responseData = response.data;
  
        if (responseData?.message === "Card is successfully unlocked") {
          return responseData.message;
        }
        } else {
        console.error("Unexpected response:", response);
        toast.error("Something went wrong while blocking the card.");
        return null;
      }
    } catch (error) {
      console.error("Error during API call:", error);
      toast.error("An error occurred. Please try again.");
      return null;
    }
  };


  
export const permanentBlockCards = async (walletHashid, customerHashId) => {

  const response = await Axios.get(
    sessionStorage.getItem("baseUrl") + "/expense/listcards",
    {
      params: {
        wallethashId: walletHashid,
        customerhashId: customerHashId,
      },
    }
  );
  let obj = response?.data;
  if (obj?.message == "No card has been added yet.") {
    return obj?.message;
  } 
  if (response?.status === 200 && response?.data) {
    console.log("Data found:", response?.data);
    let obj = response?.data;
    let carddata = obj?.content;
    return carddata;
  }
  else {
    console.log("No Invoice found or Internal Server Error!");
    toast.error("Something went Wrong");
    return null;
  }
};

export const createPhysicalCard = async (updatedFields) => { 
  const params = {
    cardHolderName: updatedFields.cardHolderName,
    Address1: updatedFields.Address1,
    Address2: updatedFields.Address2,
    City: updatedFields.City,
    State: updatedFields.State,
    postalCode: updatedFields.postalCode,
    Country: updatedFields.Country,
    modeofDelivery: updatedFields.modeofDelivery,
    walletHashid: updatedFields.walletHashid,
    customerHashId: updatedFields.customerHashId,
    contactName: updatedFields.contactName,
    email: updatedFields.email
  };

  console.log("Request Params:", params);

  const response = await Axios.get(
    sessionStorage.getItem("baseUrl") + "/expense/createphysicalCard",
    { params }
  );

  console.log("Response Data:", response.data);

  if (response.data.length === 0) {
    toast.error("Something went wrong");
  }
  if (response.data.statusText === "Internal Server Error") {
    toast.error("Internal Server Error");
  }
  if (response.data.status === "BAD_REQUEST") {
    toast.error(response.data.message);
  } else {
    toast.success(response.data.message);
  }

  return response.data;
};
