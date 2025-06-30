import { asyncThunkCreator } from "@reduxjs/toolkit";
import Axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
Axios.defaults.withCredentials = true;

//Current date and time logic
const now = new Date();

// Get the individual components of the date and time
const day = String(now.getDate()).padStart(2, "0"); // Day (2 digits)
const month = String(now.getMonth() + 1).padStart(2, "0"); // Month (2 digits, months are zero-based)
const year = String(now.getFullYear()).slice(-2); // Year (2 digits)
const hours = String(now.getHours()).padStart(2, "0"); // Hours (2 digits)
const minutes = String(now.getMinutes()).padStart(2, "0"); // Minutes (2 digits)

// Concatenate the components in the desired format
const formattedDateTime = `${day}:${month}:${year}:${hours}:${minutes}`;

export const getcognitouserinfo = async () => {
  let email = sessionStorage.getItem("lastemail");
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/getcognitouserinfo", {
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

export const generateQR = async () => {
  let email = sessionStorage.getItem("lastemail");
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/generateQR", {
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

export const verifyQRCode = async (secret) => {
  var otp = document.getElementById("otpVerify").value;
  var secretKey = secret;
  var email = sessionStorage.getItem("lastemail");

  if (otp && otp !== "" && secretKey && secretKey !== "") {
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/verifyQR", {
        params: {
          otp: otp,
          secretKey: secretKey,
          email: email,
        },
      });
      let obj = response.data;
      if (obj.status === "SUCCESS") {
        //toast.success(obj.message);

        Swal.fire({
          text: obj.message,
          icon: "success",
        }).then(() => {
          UpdateSession(sessionStorage.getItem("lastemail"));
        });
      } else {
        //toast.error(obj.message);
        Swal.fire({
          text: `${obj.message} Please enter correct OTP.`,
          icon: "warning",
        }).then(() => {
          return;
        });
      }
    } catch (error) {
      Swal.fire({
        text: `Something went wrong, please try again later.`,
        icon: "error",
      }).then(() => {
        return;
      });
    }
  } else {
    Swal.fire({
      text: `Secret Key not found. Please contact your admin.`,
      icon: "warning",
    }).then(() => {
      return;
    });
  }
};

export const getcognitouserinfo2 = async () => {
  let email = sessionStorage.getItem("lastemail");

  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/getcognitouserinfo", {
      params: {
        email: email,
      },
    });
    let obj = response.data;
    if (obj.ResponseMetadata.HTTPStatusCode == 200 && obj.userAttributes) {
      let userAttr = obj.userAttributes;
      let name = "";
      let phone_number = "";
      let country_code = "";
      let country_name = "";
      let business_name = "";
      let enable_fa = "";
      let fa_secretKey = "";

      for (var i = 0; i < userAttr.length; i++) {
        let item = userAttr[i];
        if (item.name == "custom:contactName") {
          name = item.value;
        }

        if (item.name == "custom:countryName") {
          country_name = item.value;
        }

        if (item.name == "custom:businessName") {
          business_name = item.value;
        }

        if (item.name == "phone_number") {
          phone_number = item.value;
        }

        if (item.name == "custom:isd_code") {
          country_code = item.value;
        }

        if (item.name == "custom:fa_secretkey") {
          fa_secretKey = item.value;
        }

        if (item.name == "custom:enable_fa") {
          enable_fa = item.value;
        }
      }

      sessionStorage.setItem("contactName", name);
      sessionStorage.setItem("region", country_name);
      if ((enable_fa !== "" && enable_fa === "N") || fa_secretKey === "") {
        toast.error("2FA update failed, please try again!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (name == "" && business_name == "") {
        setTimeout(() => {
          window.location.href = "/business-details";
        }, 1000);
      } else {
        fetchonboardingdetails();
      }
    } else if (obj.errorCode) {
    }
  } catch (error) {
    console.log("Something went wrong: " + error);
  }
};

export const fetchonboardingdetails = async () => {
  var lastemail = sessionStorage.getItem("lastemail");
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/getuserstatus", {
      params: {
        email: lastemail,
      },
    });

    let obj = response.data;

    if (obj.status !== "BAD_REQUEST") {
      if (obj.internalBusinessId != "") {
        sessionStorage.setItem("internalBusinessId", obj.internalBusinessId);
        sessionStorage.setItem("businessRegistrationNumber", obj.internalBusinessId);
      }

      if (obj.lastScreenCompleted != "") {
        sessionStorage.setItem("lastScreenCompleted", obj.lastScreenCompleted);
      }

      if (obj.userStatus != "") {
        sessionStorage.setItem("userStatus", obj.userStatus);
      }

      //Redirect to account setup page if form filling has started
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } else if (obj.status === "BAD_REQUEST") {
      //Redirect to account setup page if form filling has not been started
      setTimeout(() => {
        window.location.href = "/account-setup";
      }, 1000);
    }
  } catch (error) {
    console.error("Something went wrong: ", error);
  }
};

export const verifyQRCode2 = async (secret) => {
  var otp = document.getElementById("auth-input").value;
  var secretKey = secret;

  if (otp && otp !== "" && secretKey && secretKey !== "") {
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/verifyQR2", {
        params: {
          otp: otp,
          secretKey: secretKey,
        },
      });
      let obj = response.data;
      if (obj.status === "SUCCESS") {
        //toast.success(obj.message);

        Swal.fire({
          text: obj.message,
          icon: "success",
        }).then(() => {
          UpdateSession(sessionStorage.getItem("lastemail"));
        });
      } else {
        //toast.error(obj.message);
        Swal.fire({
          text: `${obj.message} Please enter correct OTP.`,
          icon: "warning",
        }).then(() => {
          return;
        });
      }
    } catch (error) {
      Swal.fire({
        text: `Something went wrong, please try again later.`,
        icon: "error",
      }).then(() => {
        return;
      });
    }
  } else {
    Swal.fire({
      text: `Secret Key not found. Please contact your admin.`,
      icon: "warning",
    }).then(() => {
      return;
    });
  }
};

export const UpdateSession = async (email) => {
  let loginStatus = "SUCCESS";
  try {
    const requestBody = {
      email: email,
      loginStatus: loginStatus,
      timestamp: formattedDateTime,
    };

    getcognitouserinfo2();
  } catch (error) {}
};

export const Reset2Fa = async (email) => {
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/reset2fa", {
      params: { email: email },
    });
    let obj = response.data;
    if (obj?.ResponseMetadata?.HTTPStatusCode === 200) {
      return { status: "SUCCESS", message: "2FA RESET SUCCESSFULLY!" };
    } else {
      return { status: "ERROR", message: "2FA RESET FAILED!" };
    }
  } catch (error) {
    return { status: "BAD_REQUEST", message: "NETWORK ERROR!" };
  }
};
