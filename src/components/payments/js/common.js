import Axios from "axios";
import { useState } from "react";

export const listcountry = async () => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/CommonRoutes/listCountry"
    );
    let obj = response.data;
    return obj;
  } catch (error) {
    console.error("Error fetching countryList:", error);
    return [];
  }
};

export const listmobcountrycode = async () => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/CommonRoutes/listCountryCode"
    );
    let obj = response.data;
    return obj;
  } catch (error) {
    console.error("Error fetching mobilecountryList:", error);
    return [];
  }
};
