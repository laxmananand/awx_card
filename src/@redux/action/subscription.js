import axios from "axios";
import { toast } from "react-toastify";
import {
  addInvoices,
  setClientSecret,
  setInvoices,
  setPaymentMethod,
  setPlanDetails,
  setSubscriptionData,
} from "../features/subscription";
import { closeLoader, openLoader } from "../features/common";
import axiosInstance from "../axiosInstance";

export const getSubscription =
  (loader = true) =>
  async (dispatch, getState) => {
    const platform = getState().common.platform;
    const subsData = getState().subscription.data;
    if (subsData) {
      return subsData;
    }
    try {
      if (loader) dispatch(openLoader());
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + `/stripe/get-subscription-details`
      );
      let obj = response.data;
      console.log(obj);

      if (obj.status === "BAD_REQUEST") {
        toast.error(obj.message);
      } else {
        if (platform === "awx") {
          dispatch(
            setSubscriptionData({
              isEligible: false,
              currentPeriodStart: "1743841034",
              amount: "5000",
              planType: "Pro",
              updatedBy: sessionStorage.getItem("lastemail"),
              updatedAt: "1744103886",
              cancelAt: "",
              cancellationReason: "",
              currentPeriodEnd: "1746433034",
              sessionId: "",
              currency: "usd",
              subscribedBy: sessionStorage.getItem("lastemail"),
              subscriptionId: "sub_1Qp3nKIpjTnf51btAtqYUD5d",
              customerId: "cus_QwaRzCit9cCVSJ",
              startDate: "1738743434",
              status: "active",
            })
          );
          //dispatch(setSubscriptionData(obj));
        } else {
          //dispatch(setSubscriptionData(obj));

          dispatch(
            setSubscriptionData({
              isEligible: false,
              currentPeriodStart: "1743841034",
              amount: "5000",
              planType: "Pro",
              updatedBy: sessionStorage.getItem("lastemail"),
              updatedAt: "1744103886",
              cancelAt: "",
              cancellationReason: "",
              currentPeriodEnd: "1746433034",
              sessionId: "",
              currency: "usd",
              subscribedBy: sessionStorage.getItem("lastemail"),
              subscriptionId: "sub_1Qp3nKIpjTnf51btAtqYUD5d",
              customerId: "cus_QwaRzCit9cCVSJ",
              startDate: "1738743434",
              status: "active",
            })
          );
        }
      }
    } catch (error) {
      console.error("Error fetching subscription!", error);
    } finally {
      if (loader) dispatch(closeLoader());
    }
  };

export const createCheckoutSessionV2 =
  (priceId, setIsLoading, navigate) => async (dispatch, getState) => {
    dispatch(openLoader());
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        `${sessionStorage.getItem("baseUrl")}/stripe/create-session`,
        {
          priceId,
        }
      );
      if (response.data.status === "BAD_REQUEST") {
        toast.error(response.data.message);
        navigate("/settings/subscription");
      }
      dispatch(setClientSecret(response.data.clientSecret));
    } catch (error) {
      console.error("Error creating session!", error);
    } finally {
      dispatch(closeLoader());
      setIsLoading(false);
    }
  };

export const getSubscriptionPlanDetails = () => async (dispatch, getState) => {
  try {
    dispatch(openLoader());
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/listSubscriptionPlanDetails"
    );
    let obj = response.data;
    dispatch(setPlanDetails(obj));
    dispatch(closeLoader());
  } catch {
    toast.error(
      "Not able to fetch features of our subscription. Please come back later."
    );
    dispatch(closeLoader());
  }
};

export const changeSubscriptionPlanAPI =
  (newPlanId) => async (dispatch, getState) => {
    try {
      dispatch(openLoader());
      const response = await axiosInstance.put(
        sessionStorage.getItem("baseUrl") + "/stripe/change-plan",
        {
          newPlanId,
        }
      );
      let obj = response.data;
      if (obj?.status !== "BAD_REQUEST") dispatch(setSubscriptionData(obj));
      dispatch(closeLoader());
    } catch {
      toast.error(
        "Not able to change plan now, Please try again later or Contact Admin."
      );
      dispatch(closeLoader());
    }
  };

export const cancelSubscriptionPlanAPI = () => async (dispatch, getState) => {
  try {
    dispatch(openLoader());
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/stripe/cancel-plan"
    );
    let obj = response.data;
    if (obj?.status !== "BAD_REQUEST") {
      dispatch(setSubscriptionData(obj));
      toast.success("Subscription Cancelled");
    }
    dispatch(closeLoader());
  } catch {
    toast.error(
      "Not able to cancel plan now, Please try again later or Contact Admin."
    );
    dispatch(closeLoader());
  }
};

export const getStripeInvoicesAPI =
  (startingAfter) => async (dispatch, getState) => {
    try {
      dispatch(openLoader());
      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + `/stripe/get-all-invoices`,
        { startingAfter }
      );
      let obj = response.data;
      if (obj?.status !== "BAD_REQUEST") {
        if (startingAfter) dispatch(addInvoices(obj));
        else dispatch(setInvoices(obj));
      }
      dispatch(closeLoader());
    } catch {
      toast.error("Not able to fetch invoices now, Please try again later.");
      dispatch(closeLoader());
    }
  };

export const getStripePaymentMethodsAPI = () => async (dispatch, getState) => {
  try {
    dispatch(openLoader());
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + `/stripe/get-payment-method`
    );
    let obj = response.data;
    if (obj?.status !== "BAD_REQUEST" && Array.isArray(obj)) {
      dispatch(setPaymentMethod(obj));
    } else {
      toast.error(obj.message);
    }
    dispatch(closeLoader());
  } catch {
    toast.error(
      "Not able to fetch payment methods now, Please try again later."
    );
    dispatch(closeLoader());
  }
};

export const addStripePaymentMethodAPI =
  (paymentMethodId, closeRef) => async (dispatch, getState) => {
    try {
      dispatch(openLoader());
      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + `/stripe/add-payment-method`,
        {
          paymentMethodId,
        }
      );
      let obj = response.data;
      if (obj?.status !== "BAD_REQUEST" && Array.isArray(obj)) {
        dispatch(setPaymentMethod(obj));
        toast.success("New Payment Method Added");
        closeRef.current.click();
      } else {
        toast.error(obj.message);
      }
      dispatch(closeLoader());
    } catch {
      toast.error(
        "Not able to add payment method now, Please try again later."
      );
      dispatch(closeLoader());
    }
  };

export const removeStripePaymentMethodAPI =
  (paymentMethodId) => async (dispatch, getState) => {
    try {
      dispatch(openLoader());
      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + `/stripe/remove-payment-method`,
        {
          paymentMethodId,
        }
      );
      let obj = response.data;
      if (obj?.status !== "BAD_REQUEST" && Array.isArray(obj)) {
        dispatch(setPaymentMethod(obj));
        toast.success("One Payment Method Removed Successfully");
      } else {
        toast.error(obj.message);
      }
      dispatch(closeLoader());
    } catch {
      toast.error(
        "Not able to add payment method now, Please try again later."
      );
      dispatch(closeLoader());
    }
  };

export const setDefaultStripePaymentMethodAPI =
  (paymentMethodId) => async (dispatch, getState) => {
    try {
      dispatch(openLoader());
      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") +
          `/stripe/set-default-payment-method`,
        {
          paymentMethodId,
        }
      );
      let obj = response.data;
      if (obj?.status !== "BAD_REQUEST" && Array.isArray(obj)) {
        dispatch(setPaymentMethod(obj));
        toast.success("Payment Method set to deafult");
      } else {
        toast.error(obj.message);
      }
      dispatch(closeLoader());
    } catch {
      toast.error(
        "Not able to change default payment method now, Please try again later."
      );
      dispatch(closeLoader());
    }
  };

export const preventCancelSubscriptionPlanAPI =
  () => async (dispatch, getState) => {
    try {
      dispatch(openLoader());
      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") + "/stripe/prevent-cancelation"
      );
      let obj = response.data;
      if (obj?.status !== "BAD_REQUEST") {
        dispatch(setSubscriptionData(obj.data));
        toast.success("Subscription Re-Activated");
      }
      dispatch(closeLoader());
    } catch {
      toast.error("Not able to re-activate plan now, Please try again later.");
      dispatch(closeLoader());
    }
  };
