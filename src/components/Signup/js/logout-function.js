import Axios from "axios";
import { useNavigate } from "react-router-dom";

// Create an Axios instance
const axiosInstance = Axios.create({
  baseURL: sessionStorage.getItem("baseUrl"),
  withCredentials: true,
});

// Add request interceptor to attach "region" and "_cookie" to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const region = sessionStorage.getItem("region"); // Get region from session storage
    const _cookie = sessionStorage.getItem("_cookie"); // Get _cookie from session storage if available

    config.params = config.params || {};
    config.params.region = region; // Attach the region as a query param

    if (_cookie) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `${_cookie}`; // Attach _cookie in Authorization header
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const logout = async () => {
  let email =
    sessionStorage.getItem("lastemail") || sessionStorage.getItem("resetEmail");

  if (!email) {
    console.log("Email not found for the current session.");
    sessionStorage.clear();
    window.location.href = "/";
    return;
  }

  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/logout",
      {
        params: { email: email },
      }
    );

    let obj = response.data;
    if (obj.status === "SUCCESS") {
      console.log(obj.message);
      sessionStorage.clear();
      window.location.href = "/";
      return;
    } else {
      console.log(obj.message);
      sessionStorage.clear();
      window.location.href = "/";
      return;
    }
  } catch (error) {
    console.log("Logout error: ", error);
    sessionStorage.clear();
    window.location.href = "/";
    return;
  }
};
