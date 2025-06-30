import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import "./branding.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/structure/Loader";
import { logout } from "./components/Signup/js/logout-function";
import AppRouter from "./AppRouter";
import axios from "axios";
import { setPlatform } from "./@redux/features/common";
import { GenerateAuthToken } from "./@redux/action/auth";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before logout

const App = () => {
  const dispatch = useDispatch();

  axios.defaults.withCredentials = true;
  const fonts = useSelector((state) => state.settings.branding?.fonts);

  useEffect(() => {
    if (fonts) {
      const root = document.documentElement;
      const rootStyles = root?.style;
      rootStyles?.setProperty("--font", fonts);
    }
  }, [fonts]);

  // const complianceStatus = useSelector((state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus);
  // const customerHashId = useSelector((state) => state.onboarding?.UserOnboardingDetails?.customerHashId);

  // useEffect(() => {
  //   //const intervalId = setInterval(() => {
  //   if (complianceStatus?.toLowerCase() === "completed" && customerHashId) {
  //     dispatch(getSubscription(customerHashId));
  //     //dispatch(getbrandingDetails());
  //     //clearInterval(intervalId);
  //   }
  //   //}, 1000);
  // }, [complianceStatus, customerHashId]);

  // Session timeout in case of Inactivity - Added by pabitra
  const timeoutIdRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  useEffect(() => {
    const startSessionTimeout = () => {
      warningTimeoutRef.current = setTimeout(() => {
        const currentUrl = window.location.pathname;

        if (["/", "/sign-up", "/forgotpassword"].includes(currentUrl)) {
          return;
        }

        Swal.fire({
          icon: "warning",
          text: "Your session is about to expire. Click Continue to resume or Logout to exit.",
          showDenyButton: true,
          confirmButtonText: "Logout",
          denyButtonText: "Continue",
        }).then((result) => {
          if (result.isConfirmed) {
            logout();
          } else if (result.isDenied) {
            resetSessionTimeout();
          }
        });
      }, SESSION_TIMEOUT - WARNING_TIME);

      timeoutIdRef.current = setTimeout(() => {
        logout();
      }, SESSION_TIMEOUT);
    };

    const resetSessionTimeout = () => {
      clearTimeout(timeoutIdRef.current);
      clearTimeout(warningTimeoutRef.current);
      startSessionTimeout();
    };

    const clearSessionTimeout = () => {
      clearTimeout(timeoutIdRef.current);
      clearTimeout(warningTimeoutRef.current);
    };

    const activityListener = () => {
      resetSessionTimeout();
    };

    window.addEventListener("mousemove", activityListener);
    window.addEventListener("keypress", activityListener);

    startSessionTimeout();

    return () => {
      clearSessionTimeout();
      window.removeEventListener("mousemove", activityListener);
      window.removeEventListener("keypress", activityListener);
    };
  }, []);

  // Session Timeout Code ends here

  //Setting base-url according to different types of portals
  if (location.hostname === "zoqq.vercel.app") {
    sessionStorage.setItem("baseUrl", process.env.VITE_BASE_URL_PROXY);
  } else {
    sessionStorage.setItem("baseUrl", process.env.VITE_BASE_URL);
  }

  //Test for automated sandbox and production deployment

  useEffect(() => {
    if (location.host?.includes("localhost")) {
      dispatch(setPlatform("awx"));
    } else if (location.host?.includes("awx")) {
      dispatch(setPlatform("awx"));
    } else {
      dispatch(setPlatform("nium"));
    }
  }, []);

  useEffect(() => {
    // Call the function initially
    dispatch(GenerateAuthToken());

    // Set interval to call it every 20 minutes (20 * 60 * 1000 ms)
    const interval = setInterval(() => {
      dispatch(GenerateAuthToken());
    }, 20 * 60 * 1000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ToastContainer />
      <Loader />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;
