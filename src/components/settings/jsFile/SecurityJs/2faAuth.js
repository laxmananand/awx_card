import { asyncThunkCreator } from "@reduxjs/toolkit";
import Axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
Axios.defaults.withCredentials = true;


// Get Cognito user

export const getCognitoUser = async () => {
    let email = sessionStorage.getItem("lastemail");
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SettingsRoutes/getCognitoUser", {
        params: {
          email: email,
        },
      });
      let obj = response.data;
      if (obj.ResponseMetadata.HTTPStatusCode == 200 && obj.userAttributes) {
        let userAttr = obj.userAttributes;
        let enable_fa = "";
        let fa_secretKey = "";
  
        for (var i = 0; i < userAttr.length; i++) {
          let item = userAttr[i];
  
          if (item.name == "custom:fa_secretkey") {
            fa_secretKey = item.value;
          }
  
          if (item.name == "custom:enable_fa") {
            enable_fa = item.value;
          }
        }
  
        if (enable_fa !== "" && fa_secretKey !== "") {
          return JSON.stringify({
            faSecretKey: fa_secretKey,
            enable_fa: enable_fa,
            status: "SUCCESS",
          });
          // buttonText.style.display = "flex";
          // buttonLoader.style.display = "none";
          // setTimeout(() => {
          //   window.location.href = "/2fa";
          // }, 1000);
        } else {
          return JSON.stringify({
            message: "Two-factor information not available",
            status: "NO_INFORMATION_AVAILABLE",
          });
  
          // sessionStorage.setItem("contactName", name);
          // sessionStorage.setItem("region", country_name);
          // fetchonboardingdetails();
        }
      } else if (obj.errorCode) {
        return JSON.stringify({
          message: obj.msg,
          status: "BAD_REQUEST",
        });
      }
    } catch (error) {
      return JSON.stringify({
        message: "Something went wrong: " + error,
        status: "BAD_REQUEST",
      });
    }
  };

// Generate QR code
  export const generateQR = async () => {
    let email = sessionStorage.getItem("lastemail");
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SettingsRoutes/generate2faQR", {
        params: {
          email: email,
        },
      });
      let obj = response.data;
      return obj;
    } catch (error) {
      return JSON.stringify({
        message: "Something went wrong: " + error,
        status: "BAD_REQUEST",
      });
    }
  };
  
  // Verify OR Code
  export const verifyQRCode = async (formData) => {
    var otp = formData?.otp;
    var secretKey = formData?.secretKey;
    var email = sessionStorage.getItem("lastemail");
  
    if(otp.length<6){
      Swal.fire({
        title: `Please provide the six-digit code for verification.`,
        icon: "warning",
        confirmButtonColor: "var(--main-color)",
        customClass: {
          title: 'swal-titleSettings'
        }
      }).then(() => {
        return;
      });
    }
    else if (otp && otp !== "" && secretKey && secretKey !== "") {
      try {
        const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SettingsRoutes/verify2faQR", {
          params: {
            otp: otp,
            secretKey: secretKey,
            email: email,
          },
        });
        let obj = response.data;
        if (obj.status === "SUCCESS") {
          Swal.fire({
            title: obj.message,
            icon: "success",
            confirmButtonColor: "var(--main-color)",
            customClass: {
              title: 'swal-titleSettings'
            }
          }).then(() => {
            UpdateSession(sessionStorage.getItem("lastemail"));
          });
          return obj;
        } else {
          Swal.fire({
            title: `${obj.message} Please enter correct OTP.`,
            icon: "error",
            confirmButtonColor: "var(--main-color)",
            customClass: {
              title: 'swal-titleSettings'
            }
          }).then(() => {
            return;
          });
          return obj;
        }
      } catch (error) {
        Swal.fire({
          text: `Something went wrong, please try again later.`,
          icon: "error",
          confirmButtonColor: "var(--main-color)",
          customClass: {
            title: 'swal-titleSettings'
          }
        }).then(() => {
          return;
        });
        return error;
      }
    } else {
      Swal.fire({
        text: `Secret Key not found. Please contact your admin.`,
        icon: "error",
        confirmButtonColor: "var(--main-color)",
        customClass: {
          title: 'swal-titleSettings'
        }
      }).then(() => {
        return;
      });
      return [];
    }
  };

  //disable 2FA
  export const diable2FA = async () => {
    let email = sessionStorage.getItem("lastemail");
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SettingsRoutes/disable2FA", {
        params: {
          email: email,
        },
      });
      let obj = response.data;
      if (obj?.status === "SUCCESS"){
      return obj;
    } else{
      toast.error(obj?.message);
      return obj;
    }
  }
    catch (error) {
      return JSON.stringify({
        message: "Something went wrong: " + error,
        status: "BAD_REQUEST",
      });
    }
  };