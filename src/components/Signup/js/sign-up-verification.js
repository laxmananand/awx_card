import React from "react";
import Axios from "axios";
import CryptoJS from "crypto-js";

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

export const restrictInput = () => {
  var code = document.getElementById("verificationCode");
  const inputValue = code.value.replace(/\D/g, "").slice(0, 6);
  const formattedValue = inputValue.replace(/(\d{3})(\d{3})/, (_, part1, part2) => `${part1} - ${part2}`);
  code.value = formattedValue;
};

export const confirmSignup = async () => {
  var code = document.getElementById("verificationCode");
  var span = document.getElementById("errorMessage");
  var email = sessionStorage.getItem("lastemail");

  var verificationCode = code.value.replace(/[\s-]/g, "");

  if (code.value == "") {
    span.style.display = "block";
    span.innerText = "Please enter your OTP to continue";
  } else {
    span.style.display = "none";
    span.innerText = "";

    var buttonText = document.getElementById("button-text");
    var buttonLoader = document.getElementById("button-loader");

    buttonText.style.display = "none";
    buttonLoader.style.display = "flex";

    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/confirmSignup", {
      params: {
        email: email,
        code: verificationCode,
      },
    });

    let obj = response.data;
    console.log(obj);

    buttonText.style.display = "flex";
    buttonLoader.style.display = "none";

    if (obj.errorCode) {
      if (obj.errorCode == "CodeMismatchException") {
        span.style.display = "block";
        span.innerText = "Invalid OTP. Please enter the correct OTP and try again.";
      } else if (obj.errorCode == "ResourceNotFoundException") {
        span.style.display = "block";
        span.innerText = "There is some configuration issues, please contact your admin";
      } else if (obj.errorCode == "NotAuthorizedException") {
        span.style.display = "block";
        let errorMessage = obj.msg.split("operation:")[1].trim();
        span.innerText = errorMessage;

        if (errorMessage === "User cannot be confirmed. Current status is CONFIRMED") {
          setTimeout(() => {
            window.location.href = "/2fa";
          }, 1500);
        }
      }
    } else if (obj.ResponseMetadata.HTTPStatusCode === 200) {
      span.style.display = "block";
      span.innerText = "";
      span.style.color = "green";
      CreateSession(email, obj?.ResponseMetadata?.RequestId);
    } else {
      span.style.display = "block";
      span.innerText = "Something went wrong, please try again later.";
    }
  }
};

export const resendConfirmation = async () => {
  var span = document.getElementById("errorMessage");
  var email = sessionStorage.getItem("lastemail");

  if (email == "") {
    span.style.display = "block";
    span.innerText = "Email not found, please log-in again.";
  } else {
    span.style.display = "none";
    span.innerText = "";

    var buttonText = document.getElementById("button-text");
    var buttonLoader = document.getElementById("button-loader");

    buttonText.style.display = "none";
    buttonLoader.style.display = "flex";

    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/resendConfirmation", {
      params: {
        email: email,
      },
    });

    let obj = response.data;
    console.log(obj);

    buttonText.style.display = "flex";
    buttonLoader.style.display = "none";

    if (obj.ResponseMetadata.HTTPStatusCode == 200) {
      span.style.display = "block";
      span.innerText = "New OTP sent to your registered email.";
      span.style.color = "green";
    } else if (obj.errorCode) {
      if (obj.errorCode == "ResourceNotFoundException") {
        span.style.display = "block";
        span.innerText = "There is some configuration issues, please contact your admin";
      }
    } else {
      span.style.display = "block";
      span.innerText = "Something went wrong, OTP could not be sent. Please try again later.";
    }
  }
};

export const CreateSession = async (email, accessToken) => {
  //Encrypt session data
  const jsonData = {
    status: "SUCCESS",
    email: email,
    timestamp: formattedDateTime,
    sessionId: accessToken,
  };
  let secretKey = null;

  // Convert JSON object to string
  const jsonString = JSON.stringify(jsonData);

  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/CommonRoutes/fetchsecretkey");
    let obj = response.data;
    secretKey = obj.secretKey;

    // Encrypt JSON string
    const encryptedData = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
    sessionStorage.setItem("_session", encryptedData);

    window.location.href = "/2fa";
  } catch (error) {
    console.log("Error generating secret key");
    window.location.href = "/2fa";
  }
};
