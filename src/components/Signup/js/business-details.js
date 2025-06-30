import React from "react";
import Axios from "axios";

export const listMobileCountryCode = async () => {
  const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/CommonRoutes/listCountryCode");
  let obj = response.data;

  var List = obj.result;
  if (obj.result) {
    // var select = document.getElementById("countryCode");

    // List.forEach((item) => {
    //   var option = document.createElement("option");
    //   option.value = item.ISD_country_code;
    //   option.text = item.country_name + " ( + " + item.ISD_country_code + " )";
    //   select.appendChild(option);
    // });

    return obj.result;
  } else {
    return [];
  }
};

export const listCountry = async () => {
  const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/CommonRoutes/listCountry");
  let obj = response.data;

  var List = obj.result;
  if (obj.result) {
    // var select = document.getElementById("countryName");

    // List.forEach((item) => {
    //   var option = document.createElement("option");
    //   option.value = item.ISOcc_2char;
    //   option.text = item.country_name;
    //   option.setAttribute("data-country-code", item.ISD_country_code);
    //   select.appendChild(option);
    // });

    return obj.result;
  } else {
    return [];
  }
};

export const GetCognitoUserInfo = async () => {
  var email = sessionStorage.getItem("lastemail");
  var phoneNumber = sessionStorage.getItem("phoneNumber");
  var countryCode = sessionStorage.getItem("countryCode");

  if (phoneNumber && countryCode) {
    var countryCodesSelect = document.getElementById("countryCode");

    // Loop through the options in the select element
    for (var i = 0; i < countryCodesSelect.options.length; i++) {
      var option = countryCodesSelect.options[i];
      if (option.value == countryCode) {
        option.selected = true; // Set the option as selected
        break; // Exit the loop once the matching option is found
      }
    }

    document.getElementById("phoneNumber").value = phoneNumber;
    var countryCodeValue = countryCodesSelect.value;
  } else {
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/getcognitouserinfo", {
        params: {
          email: email,
        },
      });
      let obj = response.data;
      if (obj.ResponseMetadata.HTTPStatusCode == 200 && obj.userAttributes) {
        let userAttr = obj.userAttributes;
        let phone_number = "";
        let country_code = "";

        for (var i = 0; i < userAttr.length; i++) {
          let item = userAttr[i];

          if (item.name == "phone_number") {
            phone_number = item.value;
          }

          if (item.name == "custom:isd_code") {
            country_code = item.value;
          }
        }

        if (phone_number !== "" && country_code !== "") {
          document.getElementById("countryCode").value = country_code;
          document.getElementById("phoneNumber").value = phone_number.split("+")[1];
        } else {
        }
      } else if (obj.errorCode) {
      }
    } catch (error) {
      console.log("Something went wrong: " + error);
    }
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

export const submitBusinessDetails = async () => {
  var personName = document.getElementById("personName").value;
  var businessName = document.getElementById("businessName").value;
  var countryCode = document.getElementById("countryCode").value;
  var countryName = document.getElementById("countryName").value;
  var phoneNumber = document.getElementById("phoneNumber").value;

  var span = document.getElementById("errorMessage");
  if (personName == "" && businessName == "" && countryCode == "" && countryName == "" && phoneNumber == "") {
    span.style.display = "block";
    span.innerText = "Please fill the form to continue.";
  } else if (personName === "") {
    span.style.display = "block";
    span.innerText = "Person's Name must not be empty.";
  } else if (businessName === "") {
    span.style.display = "block";
    span.innerText = "Business Name must not be empty.";
  } else if (countryCode === "") {
    span.style.display = "block";
    span.innerText = "Country Code must not be empty.";
  } else if (countryName === "") {
    span.style.display = "block";
    span.innerText = "Country Name must not be empty.";
  } else if (phoneNumber === "") {
    span.style.display = "block";
    span.innerText = "Phone Number must not be empty.";
  } else {
    try {
      document.getElementById("buttonText").style.display = "none";
      document.getElementById("buttonLoader").style.display = "flex";

      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/updatecognitoattributes", {
        params: {
          email: sessionStorage.getItem("lastemail"),
          personName: personName,
          businessName: businessName,
          countryCode: countryCode,
          countryName: countryName,
          phoneNumber: phoneNumber,
        },
      });
      let obj = response.data;
      if (obj.ResponseMetadata?.HTTPStatusCode == 200) {
        span.style.display = "block";
        span.innerText = "";
        span.style.color = "green";
        document.getElementById("buttonText").style.display = "flex";
        document.getElementById("buttonLoader").style.display = "none";
        sessionStorage.setItem("countryCodeCognito", countryCode);

        setTimeout(() => {
          window.location.href = "/account-setup";
        }, 2000);
      } else {
        document.getElementById("buttonText").style.display = "flex";
        document.getElementById("buttonLoader").style.display = "none";
        if (obj.errorCode) {
          span.style.display = "block";
          span.innerText = obj.msg;
          span.style.color = "brown";
        } else {
          span.style.display = "block";
          span.innerText = "Something went wrong, please try again later!";
          span.style.color = "brown";
        }
      }
    } catch (error) {
      console.log("Something went wrong: " + error);
    }
  }
};
