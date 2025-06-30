import React from "react";
import Axios from "axios";

export const toggleBackground = (event) => {
  var optionLabel = event.target.parentNode;
  var span = optionLabel.querySelector("span");
  var icon = optionLabel.querySelector("img");
  optionLabel.classList.toggle("option2");
  span.classList.toggle("label");
};

export const submitFeatures = () => {
  const optionElements = document.querySelectorAll("div.option");
  const freelancerValues = [];
  var span = document.getElementById("errorMessage");
  const option3Elements = [];

  optionElements.forEach((element) => {
    if (element.classList.contains("option2")) {
    } else {
      option3Elements.push(element);
    }
  });

  if (option3Elements.length > 0) {
    span.style.display = "none";
    span.innerText = "";

    option3Elements.forEach((option3Element) => {
      const freelancerCheckbox = option3Element.querySelector("span");

      if (freelancerCheckbox) {
        const freelancerValue = freelancerCheckbox.innerText;
        freelancerValues.push(freelancerValue);
      } else {
        console.log("Freelancer checkbox not found in one of the elements.");
      }
    });

    console.log("Freelancer Values Array:", freelancerValues);
    if (freelancerValues.length != 0) {
      span.style.display = "block";
      span.innerText = "";
      span.style.color = "green";
      setTimeout(() => {
        window.location.href = "/subscription";
      }, 2000);
    }
  } else {
    span.style.display = "block";
    span.innerText = "No options selected. Please select an option and try again.";
    span.style.fontWeight = "500";
  }
};

export const fetchUserPersonaFeatures = async (userPersona) => {
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/userpersonafeatures", {
      params: {
        userPersona: userPersona,
      },
    });
    let obj = response.data;
    return obj;
  } catch (error) {
    console.log("Something went wrong: " + error);
  }
};
