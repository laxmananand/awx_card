import React from "react";
import Axios from "axios";

export const toggleBackground = (event) => {
  var optionLabel = event.target.parentNode;
  optionLabel.classList.toggle("option3", event.target.checked);
};

export const submitPersona = () => {
  const option3Elements = document.querySelectorAll(".option3");
  const freelancerValues = [];
  var span = document.getElementById("errorMessage");

  if (option3Elements.length > 0) {
    span.style.display = "none";
    span.innerText = "";

    option3Elements.forEach((option3Element) => {
      const freelancerCheckbox = option3Element.querySelector("input[name='Freelancer']");

      if (freelancerCheckbox) {
        const freelancerValue = freelancerCheckbox.value;
        freelancerValues.push(freelancerValue);
      } else {
        console.log("Freelancer checkbox not found in one of the elements.");
      }
    });

    console.log("Freelancer Values Array:", freelancerValues);
    sessionStorage.setItem("UserPersona", freelancerValues);
    if (freelancerValues.length != 0) {
      span.style.display = "block";
      span.innerText = "";
      span.style.color = "green";
      setTimeout(() => {
        window.location.href = "/account-setup-2";
      }, 2000);
    }
  } else {
    span.style.display = "block";
    span.innerText = "No option(s) selected. Please select an option and try again.";
    span.style.color = "brown";
    span.style.fontWeight = "500";
  }
};

export const fetchUserPersonaDetails = async () => {
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/userpersonadetails");
    let obj = response.data;
    return obj;
  } catch (error) {
    console.log("Something went wrong: " + error);
  }
};
