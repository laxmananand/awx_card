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

export const signIn = async () => {
  var email = document.getElementById("businessEmail").value;
  var password = document.getElementById("businessPassword").value;

  var span = document.getElementById("errorMessage");

  if (email == "" && password == "") {
    span.style.display = "block";
    span.innerText = "Please fill the form to continue";
  } else if (email == "") {
    span.style.display = "block";
    span.innerText = "Email address cannot be empty";
  } else if (password == "") {
    span.style.display = "block";
    span.innerText = "Password cannot be empty";
  } else {
    span.style.display = "none";
    span.innerText = "";

    var buttonText = document.getElementById("button-text");
    var buttonLoader = document.getElementById("button-loader");

    buttonText.style.display = "none";
    buttonLoader.style.display = "flex";

    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/login", {
      params: {
        email: email,
        password: password,
      },
    });

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
        sessionStorage.setItem("lastemail", email);
        span.style.display = "block";
        span.innerText = "Email-id not verified, please verify first!";
        setTimeout(() => {
          window.location.href = "/verification";
        }, 2000);
      } else if (obj.errorCode == "NotAuthorizedException") {
        span.style.display = "block";
        span.innerText = "Invalid email or password. Please try again.";
      } else if (obj.errorCode == "ResourceNotFoundException") {
        span.style.display = "block";
        span.innerText = "There is some configuration issues, please contact your admin";
      } else if (obj.errorCode == "UserNotFoundException") {
        span.style.display = "block";
        span.innerText =
          "WE ARE SURE THE ENTERED EMAIL IS NOT REGISTERED WITH US, PLEASE ENTER THE CORRECT REGISTERED EMAIL";
      } else if (obj.errorCode == "UserLambdaValidationException") {
        span.style.display = "block";
        span.innerText = "WE ARE SURE THE ENTERED EMAIL IS NOT REGISTERED WITH US, PLEASE SIGN-UP TO CONTINUE.";
      } else if (obj.errorCode == "PasswordResetRequiredException") {
        span.style.display = "block";
        span.innerText = "Password Reset Required";
      } else if (obj.challengeName != null && obj.challengeName == "NEW_PASSWORD_REQUIRED") {
        span.style.display = "block";
        span.innerText = "NEW PASSWORD REQUIRED";
      } else {
        span.style.display = "block";
        span.innerText = "Something went wrong, please try again later!";
      }
    }
  }
};

export const validateEmail = () => {
  var email = document.getElementById("businessEmail").value;
  var span = document.getElementById("errorMessage");

  // Regular expression pattern for validating an email address
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email != "") {
    // Call the validateEmail function to check if the entered email is valid
    const isValidEmail = emailPattern.test(email);

    if (isValidEmail) {
      // The email is valid, you can proceed with further actions
      span.style.display = "none";
      span.innerText = "";
    } else {
      // The email is not valid, show an error message or take appropriate action
      span.style.display = "block";
      span.innerText = "Email address format is wrong, correct format eg. abc@xyz.com";
    }
  } else {
    span.style.display = "none";
    span.innerText = "";
  }
};

export const CreateSession = async (email, obj) => {
  //Encrypt session data
  const jsonData = {
    status: "SUCCESS",
    email: email,
    timestamp: formattedDateTime,
    sessionId: obj?.authenticationResult?.accessToken,
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
