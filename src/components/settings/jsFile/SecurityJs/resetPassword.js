import Axios, { AxiosError } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// reset password
export const resetPassword = async (formData) => {
  var email = formData?.email;
  var code = formData?.otp;
  var password = formData?.password;
  var confirmPassword = formData?.confirmPassword;

  var buttonText = document.getElementById("button-textTwo");
  var buttonLoader = document.getElementById("button-loaderTwo");

  buttonText.style.display = "none";
  buttonLoader.style.display = "flex";


    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SettingsRoutes/resetPassword", {
      params: {
        email: email,
        code: code,
        password: password
      },
    });

    let obj = response.data;
    console.log(obj);
     
    buttonText.style.display = "flex";
    buttonLoader.style.display = "none";

    if (obj.ResponseMetadata && obj.ResponseMetadata.HTTPStatusCode == 200) {
      toast.success("Password updated successfully!");

    return obj;
    } else if (obj.errorCode) {
      if (obj.errorCode === "CodeMismatchException") {
        toast.error("Oops! The OTP you provided is invalid.")

      } else if (obj.errorCode == "ExpiredCodeException") {
        toast.error("The provided OTP has expired! Please request a new one.");
        
      } else {
        let msg = obj.msg;
        let errorMessage = msg.includes("operation: ")
          ? msg.split("operation: ")[1]
          : "Something went wrong, please try again later!";

       toast.error(errorMessage);
      }
      return obj;
    }
};

// Send Otp

export const sentOTP = async () => {

    const email = sessionStorage.getItem("lastemail")
    
      var buttonText = document.getElementById("button-text");
      var buttonLoader = document.getElementById("button-loader");
  
      buttonText.style.display = "none";
      buttonLoader.style.display = "flex";
  
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SettingsRoutes/sendOTP", {
        params: {
          email: email,
        },});
  
      let obj = response.data;
      console.log(obj);
  
      buttonText.style.display = "flex";
      buttonLoader.style.display = "none";
  
      if (obj.ResponseMetadata && obj.ResponseMetadata.HTTPStatusCode == 200) {
        sessionStorage.setItem("resetEmail", email);
        toast.success("OTP successfully sent to registered email!")
        return obj;
      }
      else if (obj.errorCode && obj.message.includes("Attempt limit exceeded, please try after some time.")){
        
        toast.error("Attempt limit exceeded! Please try again later.")
  
          return obj;
      }
      else if (obj.errorCode) {
        
          toast.error("Something went wrong, please try again later!");
  
          return obj;
        }
       else{

        toast.error("Something went wrong, please try again later!");

  
          return obj;
      }
  };


  export const restrictInput = () => {
    var code = document.getElementById("verificationCode");
    const inputValue = code.value.replace(/\D/g, "").slice(0, 6);
    const formattedValue = inputValue.replace(/(\d{3})(\d{3})/, (_, part1, part2) => `${part1} - ${part2}`);
    code.value = formattedValue;
  };
  
  export const matchPasswords = () => {
    var password = document.getElementById("newPassword");
    var confirmPassword = document.getElementById("confirmNewPassword");
    var span = document.getElementById("errorMessage");
  
    if (password.value != "" && confirmPassword.value != "") {
      if (password.value == confirmPassword.value) {
        span.style.display = "block";
        span.innerText = "Passwords matched!";
        span.style.color = "green";
      } else if (password.value != confirmPassword.value) {
        span.style.display = "block";
        span.innerText = "Passwords do not match!";
        span.style.color = "brown";
      } else {
        span.style.display = "none";
        span.innerText = "";
      }
    } else {
      span.style.display = "none";
      span.innerText = "";
    }
  };
  
  export const validateEmail = () => {
    var email = document.getElementById("registeredEmail").value;
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
  
  export const validatePassword = () => {
    const passwordInput = document.getElementById("newPassword");
    const errorElement = document.getElementById("errorMessage"); // Assuming you have an element to display password error messages
  
    const password = passwordInput.value;
  
    // Define password format rules
    const minLength = 8; // Minimum length requirement
    const hasUpperCase = /[A-Z]/.test(password); // At least one uppercase letter
    const hasLowerCase = /[a-z]/.test(password); // At least one lowercase letter
    const hasDigit = /\d/.test(password); // At least one digit
    const hasSpecialChar = /[!@#$%^&*]/.test(password); // At least one special character
  
    if (password.length == 0) {
      errorElement.innerText = "";
      errorElement.style.display = "none";
    } // Check if the password adheres to the format rules
    else if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasDigit || !hasSpecialChar) {
      // Display an error message and add error styling to the input
      errorElement.innerText =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character. (Example Password: Abc@2001)";
      errorElement.style.display = "block";
    } else {
      // Password format is valid, clear any error message and remove the error styling
      // Display an error message and add error styling to the input
      errorElement.innerText = "";
      errorElement.style.display = "none";
    }
  };
  