import React from "react";
import Axios from "axios";

export const chooseSubscription = (event) => {
  var parentElem = event.target.parentNode;
  var selectedOption = parentElem.querySelector("div");
  var buttonText = parentElem.querySelector("div#button-text");
  var buttonLoader = parentElem.querySelector("div#button-loader");

  buttonText.style.display = "none";

  buttonLoader.style.display = "flex";

  setTimeout(() => {
    buttonText.style.display = "flex";

    buttonLoader.style.display = "none";
    window.location.href = "/dashboard";
  }, 2000);
};

export const getSubscriptionPlanDetails = async () => {
  const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/listSubscriptionPlanDetails");
  let obj = response.data;

  return obj;
};
