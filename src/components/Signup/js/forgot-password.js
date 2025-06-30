import Axios from "axios";

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

export const resetPassword = async () => {
  var email = sessionStorage.getItem("resetEmail");
  var code = document.getElementById("verificationCode").value;
  var password = document.getElementById("newPassword").value;
  var confirmPassword = document.getElementById("confirmNewPassword").value;

  var span = document.getElementById("errorMessage");

  if (email == "" && code == "" && password == "" && confirmPassword == "") {
    span.style.display = "block";
    span.innerText = "Please fill the form to continue";
  } else if (email == "") {
    span.style.display = "block";
    span.innerText = "Email Address not found";
  } else if (code == "") {
    span.style.display = "block";
    span.innerText = "OTP must not be empty";
  } else if (password == "") {
    span.style.display = "block";
    span.innerText = "Password must not be empty";
  } else if (confirmPassword == "") {
    span.style.display = "block";
    span.innerText = "Confirm Password must not be empty";
  } else if (confirmPassword != password) {
    span.style.display = "block";
    span.innerText = "Confirm Password must not be empty";
  } else {
    span.style.display = "none";
    span.innerText = "";

    var buttonText = document.getElementById("button-text2");
    var buttonLoader = document.getElementById("button-loader2");

    buttonText.style.display = "none";
    buttonLoader.style.display = "flex";

    var verificationCode = code.replace(/[\s-]/g, "");

    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/resetpassword", {
      params: {
        email: email,
        code: verificationCode,
        password: password,
      },
    });

    let obj = response.data;
    console.log(obj);

    buttonText.style.display = "flex";
    buttonLoader.style.display = "none";

    if (obj.ResponseMetadata && obj.ResponseMetadata.HTTPStatusCode == 200) {
      span.style.display = "block";
      span.innerText = "Password reset successful, please sign-in again!";
      span.style.color = "green";

      setTimeout(() => {
        window.open("/", "_self");
      }, 2500);
    } else if (obj.errorCode) {
      if (obj.errorCode === "CodeMismatchException") {
        span.style.display = "block";
        span.innerText = "Invalid verification code provided, please try again.";
        span.style.color = "brown";
      } else if (obj.errorCode == "UserNotFoundException") {
        span.style.display = "block";
        span.innerText =
          "WE ARE SURE THE ENTERED EMAIL IS NOT REGISTERED WITH US, PLEASE ENTER THE CORRECT REGISTERED EMAIL";
        span.style.color = "brown";

        setTimeout(() => {
          location.reload();
        }, 2500);
      } else if (obj.errorCode == "ExpiredCodeException") {
        span.style.display = "block";
        span.innerText = "THE OTP HAS EXPIRED, PLEASE TRY WITH A NEW ONE!";
        span.style.color = "brown";

        setTimeout(() => {
          location.reload();
        }, 2500);
      } else {
        let msg = obj.msg;
        let errorMessage = msg.includes("operation: ")
          ? msg.split("operation: ")[1]
          : "Something went wrong, please try again later!";

        span.style.display = "block";
        span.innerText = errorMessage;
        span.style.color = "brown";
      }
    }
  }
};

export const sentOTP = async () => {
  var email = document.getElementById("registeredEmail").value;

  var span = document.getElementById("errorMessage");

  if (email == "") {
    span.style.display = "block";
    span.innerText = "Email address must not be empty";
  } else {
    span.style.display = "none";
    span.innerText = "";

    var buttonText = document.getElementById("button-text");
    var buttonLoader = document.getElementById("button-loader");

    buttonText.style.display = "none";
    buttonLoader.style.display = "flex";

    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/sendOTP", {
      params: {
        email: email,
      },
    });

    let obj = response.data;
    console.log(obj);

    buttonText.style.display = "flex";
    buttonLoader.style.display = "none";

    if (obj.ResponseMetadata && obj.ResponseMetadata.HTTPStatusCode == 200) {
      sessionStorage.setItem("resetEmail", email);
      span.style.display = "block";
      span.innerText = "OTP sent to registered email!";
      span.style.color = "green";

      return obj;
    } else if (obj.errorCode) {
      if (obj.errorCode == "UserNotFoundException") {
        span.style.display = "block";
        span.innerText =
          "WE ARE SURE THE ENTERED EMAIL IS NOT REGISTERED WITH US, PLEASE ENTER THE CORRECT REGISTERED EMAIL";
        span.style.color = "brown";

        return obj;
      } else {
        span.style.display = "block";
        span.innerText = "Something went wrong, please try again later!";
        span.style.color = "brown";

        return obj;
      }
    }
  }
};
