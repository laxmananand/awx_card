import Axios from "axios";

export const signUp = async () => {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirmPassword").value;
  var countrycode = document.getElementById("countrycode").value;
  var phoneNumber = document.getElementById("phoneNumber").value;

  var span = document.getElementById("errorMessage");

  if (email == "" && password == "" && confirmPassword == "" && countrycode == "" && phoneNumber == "") {
    span.style.display = "block";
    span.innerText = "Please fill the form to continue";
    span.style.color = "brown";
  } else if (email == "") {
    span.style.display = "block";
    span.innerText = "Email address must not be empty";
    span.style.color = "brown";
  } else if (password == "") {
    span.style.display = "block";
    span.innerText = "Password must not be empty";
    span.style.color = "brown";
  } else if (confirmPassword == "") {
    span.style.display = "block";
    span.innerText = "Confirm Password must not be empty";
    span.style.color = "brown";
  } else if (countrycode == "") {
    span.style.display = "block";
    span.innerText = "Country Code must not be empty";
    span.style.color = "brown";
  } else if (phoneNumber == "") {
    span.style.display = "block";
    span.innerText = "Phone Number must not be empty";
    span.style.color = "brown";
  } else if (password !== confirmPassword) {
    span.style.display = "block";
    span.innerText = "Passwords do not match, please check again!";
    span.style.color = "brown";
  } else {
    span.style.display = "none";
    span.innerText = "";

    var buttonText = document.getElementById("button-text");
    var buttonLoader = document.getElementById("button-loader");

    buttonText.style.display = "none";
    buttonLoader.style.display = "flex";

    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/signup", {
      params: {
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        countrycode: countrycode,
      },
    });

    let obj = response.data;
    console.log(obj);

    buttonText.style.display = "flex";
    buttonLoader.style.display = "none";

    if (obj.UserConfirmed == false) {
      sessionStorage.setItem("lastemail", email);
      span.style.display = "block";
      span.innerText = "";
      span.style.color = "green";

      sessionStorage.setItem("countryCode", countrycode);
      sessionStorage.setItem("phoneNumber", phoneNumber);

      setTimeout(() => {
        window.location.href = "/verification";
      }, 1000);
    } else if (obj.errorCode) {
      if (obj.errorCode == "UsernameExistsException") {
        span.style.display = "block";
        span.innerText = "Email-id already exists, please re-check your email.";
        span.style.color = "brown";
      } else if (obj.errorCode == "InvalidPasswordException") {
        span.style.display = "block";
        span.innerText = "Invalid password format. Please re-check your password.";
        span.style.color = "brown";
      } else if (obj.errorCode == "InvalidParameterException") {
        span.style.display = "block";
        span.innerText = "Something went wrong! Please try again later.";
        span.style.color = "brown";
      } else if (obj.errorCode == "ResourceNotFoundException") {
        span.style.display = "block";
        span.innerText =
          "WE ARE SURE THE ENTERED EMAIL IS NOT REGISTERED WITH US, PLEASE ENTER THE CORRECT REGISTERED EMAIL";
        span.style.color = "brown";
      } else {
        span.style.display = "block";
        span.innerText = "Something went wrong, please try again later!";
        span.style.color = "brown";
      }
    }
  }
};

export const showPassword = () => {
  var password = document.getElementById("password");

  if (password.value != "") {
    if (password.getAttribute("type") == "password") {
      password.setAttribute("type", "text");
    } else {
      password.setAttribute("type", "password");
    }
  }
};

export const showConfirmPassword = () => {
  var confirmPassword = document.getElementById("confirmPassword");

  if (confirmPassword.value != "") {
    if (confirmPassword.getAttribute("type") == "password") {
      confirmPassword.setAttribute("type", "text");
    } else {
      confirmPassword.setAttribute("type", "password");
    }
  }
};

export const matchPasswords = () => {
  var password = document.getElementById("password");
  var confirmPassword = document.getElementById("confirmPassword");
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
  var email = document.getElementById("email").value;
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
      span.style.color = "brown";
    }
  } else {
    span.style.display = "none";
    span.innerText = "";
  }
};

export const restrictInput = () => {
  var phoneNumber = document.getElementById("phoneNumber");
  var errorElement = document.getElementById("errorMessage"); // Assuming you have an element to display error messages

  // Get the current input value and remove any non-numeric characters
  const inputValue = phoneNumber.value.replace(/\D/g, "");

  // Define the desired phone number length range
  const minLength = 8;
  const maxLength = 10;

  if (inputValue.length == 0) {
    errorElement.innerText = "";
    errorElement.style.display = "none";
  } else if (inputValue.length < minLength) {
    // Input is too short, display an error message
    errorElement.innerText = "Phone number is too short, minimum length should be 8.";
    errorElement.style.display = "block";
  } else {
    errorElement.innerText = "";
    errorElement.style.display = "none";
  }

  if (inputValue.length > maxLength) {
    phoneNumber.value = inputValue.slice(0, maxLength);
  }
};

export const listCountry = async () => {
  const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/CommonRoutes/listCountryCode");
  let obj = response.data;

  var List = obj.result;
  if (obj.result) {
    // var select = document.getElementById("countrycode");

    // List.forEach((item) => {
    //   var option = document.createElement("option");
    //   option.value = item.ISD_country_code;
    //   option.text = item.country_name + " (+" + item.ISD_country_code + ")";
    //   select.appendChild(option);
    // });
    return List;
  } else {
    document.getElementById("errorMessage").style.display = "block";
    document.getElementById("errorMessage").innerText =
      "Something went wrong, unable to load mobile country-code list.";
    return [];
  }
};
