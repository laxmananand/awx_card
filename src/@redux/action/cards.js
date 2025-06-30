import { toast } from "react-toastify";
import axios from "axios";
import { setCardsList, setSensitivecarddetails,setSelecdedCard } from "../features/cards";
import { useDispatch, useSelector } from "react-redux";

export const listcards_awx =
  (
    authToken,
    awxAccountId,
    {
      card_status,
      cardholder_id,
      from_created_at,
      nick_name,
      page_num,
      page_size,
      to_created_at,
    } = {}
  ) =>
  async (dispatch, getState) => {
    // const dispatch = useDispatch();

    debugger;
    try {
      const params = {};

      if (card_status) params.card_status = card_status;
      if (cardholder_id) params.cardholder_id = cardholder_id;
      if (from_created_at) params.from_created_at = from_created_at;
      if (nick_name) params.nick_name = nick_name;
      if (page_num) params.page_num = page_num;
      if (page_size) params.page_size = page_size;
      if (to_created_at) params.to_created_at = to_created_at;
      const response = await axios.get(
        sessionStorage.getItem("baseUrl") + "/expense/listcardsAWX",
        {
          headers: {
            awxAccountId: awxAccountId,
            Authorization: `Bearer ${authToken}`,
          },
          params,
        }
      );

      let obj = response?.data;
      if (obj?.message === "No card has been added yet.") {
        return obj?.message;
      }

      if (response?.status === 200 && response?.data) {
        console.log("Data found:", response?.data);
        let carddata = obj;
        dispatch(setCardsList(carddata));
        return carddata;
      } else {
        console.log("No Cards found or Internal Server Error!");
        toast.error("Something went Wrong");
        dispatch(setCardsList([]));
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to retrieve card data. Please try again later.");
      return null;
    }
  };

export const getsensitavecarddata_awx=
  (authToken, card_id,awxAccountId) => async (dispatch, getState) => {
    debugger;
    try {
      const params = {};
      if (card_id) params.card_id = card_id;
      const response = await axios.get(
        sessionStorage.getItem("baseUrl") + "/expense/getsensitavecarddata_awx",
        {
          headers: {
            awxAccountId: awxAccountId,
            Authorization: `Bearer ${authToken}`,
          },
          params,
        }
      );

      let obj = response?.data;
      if (obj?.message === "No card details has been found.") {
        return obj?.message;
      }

      if (response?.status === 200 && obj) {
        console.log("Data found:", obj);
        dispatch(setSensitivecarddetails(obj));
        return obj;
      } else {
        console.log("No Cards found or Internal Server Error!");
        toast.error("Something went Wrong");
        dispatch(setSensitivecarddetails({}));
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to retrieve sensetive card info. Please try again later.");
      return null;
    }
  };

  export const getCardDetailS_awx =
  (authToken, card_id,awxAccountId) => async (dispatch, getState) => {
    debugger;
    try {
      const params = {};
      if (card_id) params.card_id = card_id;
      const response = await axios.get(
        sessionStorage.getItem("baseUrl") + "/expense/getcarddata_awx",
        {
          headers: {
            awxAccountId: awxAccountId,
            Authorization: `Bearer ${authToken}`,
          },
          params,
        }
      );

      let obj = response?.data;
      if (obj?.message === "No card details has been found.") {
        return obj?.message;
      }

      if (response?.status === 200 && obj) {
        console.log("Data found:", obj);
        dispatch(setSelecdedCard(obj));
        return obj;
      } else {
        console.log("No Cards found or Internal Server Error!");
        toast.error("Something went Wrong");
        dispatch(setSelecdedCard({}));
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to retrieve card info. Please try again later.");
      return null;
    }
  };

export const createCard_awx =
  (authToken, payload,accountId) => async (dispatch, getState) => {
    debugger;
    console.log("payload in action: " + payload);
    try {
      const requestPayload = {
        authorization_controls: {
          allowed_transaction_count: "MULTIPLE",
          transaction_limits: {
            currency: payload?.currency,
            limits: [
              {
                amount: 10000,
                interval: "PER_TRANSACTION",
              },
            ],
          },
        },
        created_by: payload?.name_on_card, // or use payload.created_by if available
        form_factor: "VIRTUAL",
        request_id: crypto.randomUUID(), // or use any unique ID generator
        cardholder_id: payload?.cardholder_id,
        program: {
          purpose: payload?.useType?.toUpperCase() || "COMMERCIAL",
        },
        is_personalized: false,
      };

      const response = await axios.post(
        sessionStorage.getItem("baseUrl") + "/expense/createCard_awx",
        requestPayload,
        {
          headers: {
            awxAccountId: accountId,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      let obj = response?.data;

      if (response?.status === 200 && response.data.card_id) {
        console.log("card created:", obj);
        dispatch(listcards_awx(authToken,accountId));
        toast.success("Card created successfully!");
        return obj;
      } else {
        console.log("Card not created!");
        toast.error("Something went Wrong");
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create card . Please try again later.");
      return null;
    }
  };

export const updateCard_awx =
  (authToken, payload, card_id,awxAccountId) => async (dispatch, getState) => {
    debugger
    const {
      enterDailyLimit,
      enterMonthlyLimit,
      enterTransactionPerLimit,
      nameoncard,
      nickname,
      currency,
    } = payload;
    const limits = [];
    if (enterDailyLimit) {
      limits.push({ amount: Number(enterDailyLimit), interval: "DAILY" });
    }
    if (enterMonthlyLimit) {
      limits.push({ amount: Number(enterMonthlyLimit), interval: "MONTHLY" });
    }
    if (enterTransactionPerLimit) {
      limits.push({
        amount: Number(enterTransactionPerLimit),
        interval: "PER_TRANSACTION",
      });
    }

    const payload_awx = {
      // authorization_controls: {
      //   transaction_limits: {
      //     currency: currency,
      //     limits,
      //   },
      // },
      // created_by: nameoncard,
      // nick_name: nickname,
    };

    if (nameoncard) {
      payload_awx.created_by = nameoncard;
    }
    
    if (nickname) {
      payload_awx.nick_name = nickname;
    }
    
    const transaction_limits = {};
    if (currency) {
      transaction_limits.currency = currency;
    }
    if (limits && limits.length > 0) {
      transaction_limits.limits = limits;
    }
    
    if (Object.keys(transaction_limits).length > 0) {
      payload_awx.authorization_controls = {
        transaction_limits
      };
    }

    try {
      const response = await axios.post(
        `${sessionStorage.getItem(
          "baseUrl"
        )}/expense/updateCard_awx/${card_id}`,
        payload_awx,
        {
          headers: {
            awxAccountId: awxAccountId,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      let obj = response?.data;

      if (response?.status === 200) {
        console.log("card update data:", obj);
        dispatch(listcards_awx(authToken,awxAccountId));
        toast.success("Card updated successfully!");
        return obj;
      } else {
        console.log("Card not updated!");
        toast.error("Something went Wrong");
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update card . Please try again later.");
      return null;
    }
  };
