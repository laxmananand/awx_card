import axios from "axios";
import {
  setAuthState,
  setAWXAccountId,
  setCodeChallenge,
} from "../features/auth";
import { setAuthToken, setAuthTokenTimestamp } from "../features/common";
import axiosInstance from "./../axiosInstance";
import { toast } from "react-toastify";
import {
  setActivated,
  setComplianceStatus,
  setCustomerDetailsNIUMObj,
  setRFIDetails,
} from "../features/onboardingFeatures";
import { FetchDetails } from "./onboardingAction";
import { setCardsList } from "../features/cards";

export const loginAPI = (email, password) => async (dispatch, getState) => {
  try {
    const response = await axios.get(
      env.process.backend_url + "/SignupRoutes/login",
      {
        params: {
          email: email,
          password: password,
        },
      }
    );

    let obj = response.data;

    if (obj.authenticationResult) {
      if (obj?.authenticationResult?.accessToken) {
        sessionStorage.setItem("lastemail", email);
        CreateSession(email, obj);
      }
    } else if (obj.errorCode) {
      buttonText.style.display = "flex";
      buttonLoader.style.display = "none";
      if (obj.errorCode == "UserNotConfirmedException") {
        dispatch(setAuthState({ lastemail: email }));
        dispatch(
          setAuthState({
            loginErrorMessage: "Email-id not verified, please verify first!",
          })
        );
        setTimeout(() => {
          window.location.href = "/verification";
        }, 2000);
      } else if (obj.errorCode == "NotAuthorizedException") {
        span.style.display = "block";
        span.innerText = "Invalid email or password. Please try again.";
      } else if (obj.errorCode == "ResourceNotFoundException") {
        span.style.display = "block";
        span.innerText =
          "There is some configuration issues, please contact your admin";
      } else if (obj.errorCode == "UserNotFoundException") {
        span.style.display = "block";
        span.innerText =
          "WE ARE SURE THE ENTERED EMAIL IS NOT REGISTERED WITH US, PLEASE ENTER THE CORRECT REGISTERED EMAIL";
      } else if (obj.errorCode == "UserLambdaValidationException") {
        span.style.display = "block";
        span.innerText =
          "WE ARE SURE THE ENTERED EMAIL IS NOT REGISTERED WITH US, PLEASE SIGN-UP TO CONTINUE.";
      } else if (obj.errorCode == "PasswordResetRequiredException") {
        span.style.display = "block";
        span.innerText = "Password Reset Required";
      } else if (
        obj.challengeName != null &&
        obj.challengeName == "NEW_PASSWORD_REQUIRED"
      ) {
        span.style.display = "block";
        span.innerText = "NEW PASSWORD REQUIRED";
      } else {
        span.style.display = "block";
        span.innerText = "Something went wrong, please try again later!";
      }
    }
  } catch {
    alert("Login failed");
  }
};

export const GenerateAuthToken = () => async (dispatch, getState) => {
  const { authToken, authTokenTimestamp } = getState().common;

  const now = Date.now();
  const tokenAgeMinutes = (now - authTokenTimestamp) / (1000 * 60);

  // If token exists and is less than 25 minutes old, skip fetching
  if (authToken && tokenAgeMinutes < 25) {
    return authToken;
  }

  try {
    const response = await axios.post(
      process.env.VITE_BASE_URL + "/awx/generateAuthToken"
    );
    if (response.data?.apiToken) {
      dispatch(setAuthToken(response.data.apiToken)); // Save API token to Redux
      dispatch(setAuthTokenTimestamp(now)); // Set timestamp
      return response.data.apiToken;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching API token:", error);
    return error;
  } finally {
  }
};

export const CreateAccountAWX =
  ({ email, businessName, tC, dataUsage, authToken }) =>
  async (dispatch, getState) => {
    const accountId = getState().auth.awxAccountId;
    if (accountId) {
      return { id: accountId };
    }

    if (!email) {
      toast.error("Enter your business email to continue.");
      return;
    }

    if (!businessName) {
      toast.error("Enter your business name to continue.");
      return;
    }

    try {
      const body = { email, businessName, tC, dataUsage, authToken };

      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + "/awx/createAccountAWX",
        body
      );
      let obj = response.data;
      if (obj.id) {
        console.log("account-id", obj.id);
        dispatch(setAWXAccountId(obj.id));
        await dispatch(
          UpdateUserAWX({
            email,
            accountId: obj.id,
            lastScreenCompleted: 1,
            userStatus: "N",
          })
        );
        //toast.success("Your account created successfully.");
      }
      return obj;
    } catch (error) {
      console.log("Something went wrong: ", error);
      return error;
    }
  };

export const AuthorizeElements =
  ({ accountId, codeChallenge, authToken, setLoading }) =>
  async (dispatch, getState) => {
    const authCode = getState().auth.codeChallenge;
    if (authCode) {
      return { authorization_code: authCode };
    }

    if (!accountId) {
      toast.error("Account Id not found.");
      return;
    }

    if (!codeChallenge) {
      toast.error("Code challenge not found.");
      return;
    }

    try {
      const body = { accountId, codeChallenge, authToken };

      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + "/awx/authorizeAccountAWX",
        body
      );
      let obj = response.data;
      if (obj.authorization_code) {
        toast.success("Account authorization successful.");
        dispatch(setCodeChallenge(obj.authorization_code));
      }
      return obj;
    } catch (error) {
      console.log("Something went wrong: ", error);
      return error;
    } finally {
    }
  };

export const UpdateUserAWX =
  ({ email, accountId, lastScreenCompleted, userStatus }) =>
  async (dispatch, getState) => {
    if (!email || !accountId || !lastScreenCompleted || !userStatus) {
      toast.error(
        "Some error ocurred while fetching your account details, please try again later."
      );
      return;
    }

    try {
      const body = { email, accountId, lastScreenCompleted, userStatus };

      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + "/awx/updateUserAWX",
        body
      );
      let obj = response.data;

      if (obj.statusCode === 200) {
        await dispatch(FetchDetails());
      }

      return obj;
    } catch (error) {
      console.log("Something went wrong while updating user: ", { ...error });
      return error;
    }
  };

const mapNiumToAwxCompliance = (status) => {
  switch (status) {
    case "CREATED":
      return "INITIATED";
    case "SUBMITTED":
      return "INITIATED";
    case "INITIATED":
      return "INITIATED";
    case "ACTION_REQUIRED":
      return "RFI_REQUESTED";
    case "ANSWERED":
      return "RFI_RESPONDED";
    case "CLOSED":
      return "RFI_RESPONDED";
    case "ACTIVE":
      return "COMPLETED";
    case "SUSPENDED":
      return "REJECT";
    default:
      return status; // fallback to original if unmapped
  }
};

export const fetchAccountAWX =
  (accountId, authToken) => async (dispatch, getState) => {
    // let customerDetails = getState().onboarding.CustomerDetailsNIUM;

    // if (customerDetails) {
    //   dispatch(
    //     setCustomerDetailsNIUMObj({
    //       ...customerDetails,
    //       complianceStatus:
    //         accountId === process.env.VITE_awxAccountId
    //           ? "RFI_REQUESTED"
    //           : mapNiumToAwxCompliance(customerDetails.status),
    //     })
    //   );
    //   dispatch(
    //     setComplianceStatus(
    //       accountId === process.env.VITE_awxAccountId
    //         ? "RFI_REQUESTED"
    //         : mapNiumToAwxCompliance(customerDetails.status)
    //     )
    //   );

    //   return customerDetails;
    // }

    if (!authToken) {
      const apiToken = await dispatch(GenerateAuthToken());
      authToken = apiToken;
    }

    try {
      const body = { accountId, authToken };

      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + "/awx/getAccountAWX",
        body
      );
      let obj = response.data;

      if (obj.id === accountId) {
        const rfiDetails = await dispatch(
          fetchAccountRFIAWX(accountId, authToken)
        );
        if (rfiDetails.items && rfiDetails.items.length > 0) {
          const kycItems = rfiDetails.items.filter(
            (item) => item.type === "KYC" || item.type === "KYC_ONGOING"
          );

          const closedKyc = kycItems.find((item) => item.status === "CLOSED");

          let defaultRfiStatus = null;

          if (closedKyc) {
            defaultRfiStatus = closedKyc.status;
          } else {
            // Try to find a "pending" or "in_progress" one if no CLOSED
            const preferredKyc = kycItems.find((item) =>
              ["ACTION_REQUIRED", "ANSWERED"].includes(item.status)
            );

            defaultRfiStatus =
              preferredKyc?.status ?? kycItems[0]?.status ?? obj.status;
          }

          const mappedComplianceStatus =
            obj.status === "ACTIVE" && closedKyc
              ? mapNiumToAwxCompliance("ACTIVE")
              : mapNiumToAwxCompliance(defaultRfiStatus);

          dispatch(
            setCustomerDetailsNIUMObj({
              ...obj,
              complianceStatus: mappedComplianceStatus,
            })
          );
          dispatch(setComplianceStatus(mappedComplianceStatus));
        } else {
          const mappedComplianceStatus = mapNiumToAwxCompliance(obj.status);
          dispatch(
            setCustomerDetailsNIUMObj({
              ...obj,
              complianceStatus: mappedComplianceStatus,
            })
          );
          dispatch(setComplianceStatus(mappedComplianceStatus));
        }
      }

      return obj;
    } catch (error) {
      console.log("Something went wrong: ", error);
      return error;
    }
  };

export const fetchAccountRFIAWX =
  (accountId, authToken) => async (dispatch, getState) => {
    if (!authToken) {
      const apiToken = await dispatch(GenerateAuthToken());
      authToken = apiToken;
    }

    try {
      const body = { accountId, authToken };

      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + "/awx/getAccountRFIAWX",
        body
      );
      let obj = response.data;
      if (obj.items.length > 0) {
        dispatch(setRFIDetails(obj.items));
      }

      return obj;
    } catch (error) {
      console.log("Something went wrong: ", error);
      return error;
    }
  };

export const createCardholderAWX =
  (accountId, authToken, body) => async (dispatch, getState) => {
    if (!authToken) {
      const apiToken = await dispatch(GenerateAuthToken());
      authToken = apiToken;
    }

    try {
      const params = { accountId, authToken };

      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + "/awx/create-cardholder-awx",
        body,
        { params }
      );
      let obj = response.data;

      return obj;
    } catch (error) {
      console.log("Something went wrong: ", error);
      return error;
    }
  };

export const fetchCardholderAWX =
  (accountId, authToken, body) => async (dispatch, getState) => {
    if (!authToken) {
      const apiToken = await dispatch(GenerateAuthToken());
      authToken = apiToken;
    }

    try {
      const params = { accountId, authToken };

      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/awx/fetch-cardholder-awx",
        { params }
      );
      let obj = response.data;

      return obj;
    } catch (error) {
      console.log("Something went wrong: ", error);
      return error;
    }
  };

export const fetchCardDetailsAWX =
  (id, authToken, type) => async (dispatch, getState) => {
    const cards = getState().card?.cardsList;

    // Only run API call if type is "update"
    if (type !== "update" && cards.length > 0) {
      return { items: cards };
    }

    if (!authToken) {
      const apiToken = await dispatch(GenerateAuthToken());
      authToken = apiToken;
    }

    try {
      const params = { id, authToken };

      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/awx/fetch-card-awx",
        { params }
      );
      let obj = response.data;

      if (obj?.items && obj?.items?.length > 0) {
        dispatch(setCardsList(obj?.items));
      }

      return obj;
    } catch (error) {
      console.log("Something went wrong: ", error);
      return error;
    }
  };

export const respondRFIAWX =
  (rfiId, accountId, payload, authToken) => async (dispatch, getState) => {
    if (!authToken) {
      const apiToken = await dispatch(GenerateAuthToken());
      authToken = apiToken;
    }

    try {
      const params = { rfiId, accountId, authToken };
      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + "/awx/respond-rfi-awx",
        payload,
        { params }
      );

      const obj = response.data;

      return obj;
    } catch (error) {
      console.error("Failed to submit RFI:", error);

      return error;
    }
  };

export const DeleteCardholderAWX =
  (cardholderId, authToken) => async (dispatch, getState) => {
    if (!authToken) {
      const apiToken = await dispatch(GenerateAuthToken());
      authToken = apiToken;
    }

    try {
      const params = { cardholderId, authToken };
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/awx/delete-cardholder-awx",
        { params }
      );

      const obj = response.data;

      return obj;
    } catch (error) {
      console.error("Failed to delete cardholder:", error);

      return error;
    }
  };

export const InviteCardholderAWX =
  (email, phoneNumber, cardholderId, authToken) =>
  async (dispatch, getState) => {
    if (!authToken) {
      const apiToken = await dispatch(GenerateAuthToken());
      authToken = apiToken;
    }

    try {
      const params = { email, phoneNumber, cardholderId, authToken };
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/awx/invite-cardholder-awx",
        { params }
      );

      const obj = response.data;

      return obj;
    } catch (error) {
      console.error("Failed to delete cardholder:", error);

      return error;
    }
  };
