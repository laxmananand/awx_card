import React, { useState, useEffect } from "react";
import Axios from "axios";
import { toast } from "react-toastify";

export const GetApplicantBusinessDetails = async (brn) => {
  //For preventing form failures
  let data = sessionStorage.getItem("applicantDetailsPost");
  try {
    let obj = null;

    if (!data) {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetApplicantBusinessDetails",
        {
          params: {
            businessRegistrationNumber: brn,
          },
        }
      );
      obj = response.data;
    } else {
      obj = JSON.parse(data);
    }

    // Professional Details
    if (obj.hasOwnProperty("applicantPosition")) {
      document.getElementById("applicantPosition").value = obj.applicantPosition;
    }

    if (obj.hasOwnProperty("applicantSharePercentage")) {
      document.getElementById("applicantSharePercentage").value = obj.applicantSharePercentage;
    }

    // Address Details
    if (obj.hasOwnProperty("applicantAddress1")) {
      document.getElementById("applicantAddressLine1").value = obj.applicantAddress1;
    }

    if (obj.hasOwnProperty("applicantAddress2")) {
      document.getElementById("applicantAddressLine2").value = obj.applicantAddress2;
    }

    if (obj.hasOwnProperty("applicantCity")) {
      document.getElementById("applicantCity").value = obj.applicantCity;
    }

    if (obj.hasOwnProperty("applicantState")) {
      document.getElementById("applicantState").value = obj.applicantState;
    }

    if (obj.hasOwnProperty("applicantPostcode")) {
      document.getElementById("applicantPostcode").value = obj.applicantPostcode;
    }

    if (obj.hasOwnProperty("applicantCountry")) {
      document.getElementById("applicantCountry").value = obj.applicantCountry;
    }

    // Contact Details
    if (obj.hasOwnProperty("applicantCountryCode")) {
      document.getElementById("applicantCountryCode").value = obj.applicantCountryCode;
    }

    if (obj.hasOwnProperty("applicantContactNumber")) {
      document.getElementById("applicantContactNo").value = obj.applicantContactNumber;
    }

    if (obj.hasOwnProperty("applicantEmail")) {
      document.getElementById("applicantEmail").value = obj.applicantEmail;
    }

    // KYC Details
    if (obj.hasOwnProperty("applicantFirstName")) {
      document.getElementById("applicantFirstName").value = obj.applicantFirstName;
    }

    if (obj.hasOwnProperty("applicantMiddleName")) {
      document.getElementById("applicantMiddleName").value = obj.applicantMiddleName;
    }

    if (obj.hasOwnProperty("applicantLastName")) {
      document.getElementById("applicantLastName").value = obj.applicantLastName;
    }

    if (obj.hasOwnProperty("applicantNationality")) {
      document.getElementById("applicantNationality").value = obj.applicantNationality;
    }

    if (obj.hasOwnProperty("applicantDOB")) {
      var DOB = obj.applicantDOB.slice(0, 10);
      document.getElementById("applicantDateOfBirth").value = DOB;
    }

    if (obj.hasOwnProperty("applicantKycMode")) {
      document.getElementById("applicantKycMode").value = obj.applicantKycMode;
      sessionStorage.setItem("applicantKycMode", obj.applicantKycMode);

      var kycMode = obj.applicantKycMode;
      var isResident = document.getElementById("applicantIsResident");
      var verifyModeApplicant = document.getElementById("verifyModeApplicant");
      if (kycMode === "E_KYC") {
        isResident.value = "YES";
        verifyModeApplicant.value = "";
        verifyModeApplicant.style.display = "none";
      } else if (kycMode === "E_DOC_VERIFY") {
        isResident.value = "NO";
        verifyModeApplicant.value = "YES";
        verifyModeApplicant.style.display = "block";
      } else {
        isResident.value = "NO";
        verifyModeApplicant.value = "NO";
        verifyModeApplicant.style.display = "block";
      }
    }

    if (obj.hasOwnProperty("applicantIsResident")) {
      document.getElementById("applicantIsResident").value = obj.applicantIsResident.toUpperCase();
    }

    if (obj.hasOwnProperty("applicantDeclaration")) {
      if (obj.applicantDeclaration.toLowerCase() === "yes") {
        document.getElementById("applicantDeclaration").checked = true;
      }
    }

    if (obj.hasOwnProperty("occupation")) {
      document.getElementById("applicantOccupation").value = obj.occupation;
    }

    document.getElementById("div7").style.width = "80%";
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
};

export const PostContactDetails = async () => {
  var businessRegistrationNumber = sessionStorage.getItem("businessRegistrationNumber");

  // //Professional Details
  var applicantPosition = document.getElementById("applicantPosition").value;
  var applicantSharePercentage = document.getElementById("applicantSharePercentage").value;

  // //Address Details
  var applicantAddress1 = document.getElementById("applicantAddressLine1").value;
  var applicantAddress2 = document.getElementById("applicantAddressLine2").value;
  var applicantCity = document.getElementById("applicantCity").value;
  var applicantState = document.getElementById("applicantState").value;
  var applicantPostcode = document.getElementById("applicantPostcode").value;
  var applicantCountry = document.getElementById("applicantCountry").value;

  // Contact Details
  var applicantCountryCode = document.getElementById("applicantCountryCode").value;
  var applicantContactNumber = document.getElementById("applicantContactNo").value;
  var applicantEmail = document.getElementById("applicantEmail").value;

  // KYC Details
  var applicantFirstName = document.getElementById("applicantFirstName").value;
  var applicantMiddleName = document.getElementById("applicantMiddleName").value;
  var applicantLastName = document.getElementById("applicantLastName").value;
  var applicantNationality = document.getElementById("applicantNationality").value;
  var applicantDateOfBirth = document.getElementById("applicantDateOfBirth").value;
  var applicantKycMode = document.getElementById("applicantKycMode").value;
  var applicantIsResident = document.getElementById("applicantIsResident").value;

  var region = sessionStorage.getItem("region");
  var occupation = document.getElementById("applicantOccupation")?.value;
  var applicantDeclaration = document.getElementById("applicantDeclaration");

  //Applicant KYC Details validations
  if (applicantFirstName == "") {
    toast.warn("First Name must not be empty");
  } else if (applicantLastName == "") {
    toast.warn("Last Name must not be empty");
  } else if (applicantNationality == "") {
    toast.warn("Nationality must not be empty");
  } else if (applicantDateOfBirth == "") {
    toast.warn("Date Of Birth must not be empty");
  } else if (applicantKycMode == "") {
    toast.warn("Kyc Mode must not be empty");
  }

  //Applicant Professional details validations
  else if (applicantPosition == "") {
    toast.warn("Applicant Position must not be empty");
  }

  //Applicant Address Validations
  else if (applicantAddress1 == "") {
    toast.warn("Applicant Address1 must not be empty");
    // }
    //else if (applicantAddress2 == "") {
    //   toast.warn("Applicant Address2 must not be empty");
    // } else if (applicantState == "") {
    //   toast.warn("Applicant State must not be empty");
  } else if (applicantCity == "") {
    toast.warn("Applicant City must not be empty");
  } else if (applicantPostcode == "") {
    toast.warn("Applicant Postcode must not be empty");
  } else if (applicantCountry == "") {
    toast.warn("Applicant Country must not be empty");
  }

  //Applicant contact details validations
  else if (applicantCountryCode == "") {
    toast.warn("Applicant Country Code must not be empty");
  } else if (applicantContactNumber == "") {
    toast.warn("Applicant Contact Number must not be empty");
  } else if (applicantEmail == "") {
    toast.warn("Applicant Email must not be empty");
  } else if (region === "CA" && occupation === "") {
    toast.warn("Applicant Occupation must not be empty");
  } else if (region === "CA" && !applicantDeclaration?.checked) {
    toast.warn("Applicant Declaration must be checked before proceeding!");
  } else {
    try {
      document.getElementById("button-text-ekyc").style.display = "none";
      document.getElementById("button-loader-ekyc").style.display = "flex";

      let params = {
        businessRegistrationNumber: businessRegistrationNumber,
        email: sessionStorage.getItem("lastemail"),
        applicantFirstName: applicantFirstName,
        applicantMiddleName: applicantMiddleName,
        applicantLastName: applicantLastName,
        applicantNationality: applicantNationality,
        applicantDateOfBirth: applicantDateOfBirth,
        applicantKycMode: applicantKycMode,
        applicantIsResident: applicantIsResident,
        applicantPosition: applicantPosition,
        applicantSharePercentage: applicantSharePercentage,
        applicantAddress1: applicantAddress1,
        applicantAddress2: applicantAddress2,
        applicantCity: applicantCity,
        applicantState: applicantState,
        applicantPostcode: applicantPostcode,
        applicantCountry: applicantCountry,
        applicantCountryCode: applicantCountryCode,
        applicantContactNumber: applicantContactNumber,
        applicantEmail: applicantEmail,
        region: sessionStorage.getItem("region"),
      };

      if (region === "CA") {
        if (occupation !== "") {
          params.occupation = occupation;
        }

        if (applicantDeclaration.checked) {
          params.applicantDeclaration = "yes";
        }
      }

      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/postApplicantContactDetails",
        {
          params: params,
        }
      );

      let obj = response.data;
      if (obj.status == "SUCCESS") {
        try {
          const response2 = await Axios.get(
            sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetApplicantBusinessDetails",
            {
              params: {
                businessRegistrationNumber: businessRegistrationNumber,
              },
            }
          );
          let obj2 = response2.data;
          sessionStorage.setItem("applicantDetailsPost", JSON.stringify(obj2));
          toast.success("Applicant Contact Details Submitted");

          document.getElementById("button-text-ekyc").style.display = "flex";
          document.getElementById("button-loader-ekyc").style.display = "none";

          document.getElementById("submitContactDetails").style.display = "none";
          document.getElementById("updateContactDetails").style.display = "";
          document.getElementById("div7").style.width = "80%";

          sessionStorage.setItem("lastScreenCompleted", 4);
          sessionStorage.setItem("userStatus", "N");

          var searchId = sessionStorage.getItem("searchId");
          var kybMode = sessionStorage.getItem("BusinessNumberFromList");

          if (!(searchId?.trim() && kybMode?.trim() === "NoneOfThese")) {
            // Code will execute if any of the conditions is true
            document.getElementById("MKYCopenAlertModalBtn").click();
          } else {
            // Code will execute if both searchId and kybMode have values
            document.getElementById("openAlertModalBtn").click();
          }
        } catch (error) {
          toast.success("Applicant Contact Details Submitted");

          document.getElementById("button-text-ekyc").style.display = "flex";
          document.getElementById("button-loader-ekyc").style.display = "none";

          document.getElementById("submitContactDetails").style.display = "none";
          document.getElementById("updateContactDetails").style.display = "";
          document.getElementById("div7").style.width = "80%";

          sessionStorage.setItem("lastScreenCompleted", 4);
          sessionStorage.setItem("userStatus", "N");

          var searchId = sessionStorage.getItem("searchId");
          var kybMode = sessionStorage.getItem("BusinessNumberFromList");

          if (!(searchId?.trim() && kybMode?.trim() === "NoneOfThese")) {
            // Code will execute if searchId is empty or kybMode is "NoneOfThese"
            document.getElementById("MKYCopenAlertModalBtn").click();
          } else {
            // Code will execute if both searchId and kybMode have values
            document.getElementById("openAlertModalBtn").click();
          }
        }
      } else {
        toast.error("Submission Failed: " + obj.message);
        document.getElementById("button-text-ekyc").style.display = "flex";
        document.getElementById("button-loader-ekyc").style.display = "none";
        document.getElementById("submitContactDetails").style.display = "";
        document.getElementById("updateContactDetails").style.display = "none";
      }
    } catch (error) {
      toast.error("Something went wrong: " + error);
      document.getElementById("button-text-ekyc").style.display = "flex";
      document.getElementById("button-loader-ekyc").style.display = "none";
      document.getElementById("submitContactDetails").style.display = "";
      document.getElementById("updateContactDetails").style.display = "none";
    }
  }
};

export const PatchContactDetails = async () => {
  var businessRegistrationNumber = sessionStorage.getItem("businessRegistrationNumber");

  //Professional Details
  var applicantPosition = document.getElementById("applicantPosition").value;
  var applicantSharePercentage = document.getElementById("applicantSharePercentage").value;

  //Address Details
  var applicantAddress1 = document.getElementById("applicantAddressLine1").value;
  var applicantAddress2 = document.getElementById("applicantAddressLine2").value;
  var applicantCity = document.getElementById("applicantCity").value;
  var applicantState = document.getElementById("applicantState").value;
  var applicantPostcode = document.getElementById("applicantPostcode").value;
  var applicantCountry = document.getElementById("applicantCountry").value;

  //Contact Details
  var applicantCountryCode = document.getElementById("applicantCountryCode").value;
  var applicantContactNumber = document.getElementById("applicantContactNo").value;
  var applicantEmail = document.getElementById("applicantEmail").value;

  //KYC Details
  var applicantFirstName = document.getElementById("applicantFirstName").value;
  var applicantMiddleName = document.getElementById("applicantMiddleName").value;
  var applicantLastName = document.getElementById("applicantLastName").value;
  var applicantNationality = document.getElementById("applicantNationality").value;
  var applicantDateOfBirth = document.getElementById("applicantDateOfBirth").value;
  var applicantKycMode = document.getElementById("applicantKycMode").value;
  var applicantIsResident = document.getElementById("applicantIsResident").value;

  let region = sessionStorage.getItem("region");
  var applicantOccupation = document.getElementById("applicantOccupation")?.value;
  var applicantDeclaration = document.getElementById("applicantDeclaration")?.checked;

  let params = {};

  if (applicantFirstName == "") {
    toast.warn("First Name must not be empty");
  } else if (applicantLastName == "") {
    toast.warn("Last Name must not be empty");
  } else if (applicantNationality == "") {
    toast.warn("Nationality must not be empty");
  } else if (applicantDateOfBirth == "") {
    toast.warn("Date Of Birth must not be empty");
  } else if (applicantKycMode == "") {
    toast.warn("Kyc Mode must not be empty");
  } else if (applicantPosition == "") {
    toast.warn("Applicant Position must not be empty");
  } else if (applicantAddress1 == "") {
    toast.warn("Applicant Address1 must not be empty");
  } else if (applicantPostcode == "") {
    toast.warn("Applicant Postcode must not be empty");
  } else if (applicantCountry == "") {
    toast.warn("Applicant Country must not be empty");
  } else if (applicantCountryCode == "") {
    toast.warn("Applicant Country Code must not be empty");
  } else if (applicantContactNumber == "") {
    toast.warn("Applicant Contact Number must not be empty");
  } else if (applicantEmail == "") {
    toast.warn("Applicant Email must not be empty");
  } else if (region === "CA" && applicantOccupation === "") {
    toast.warn("Applicant Occupation must not be empty");
  } else if (region === "CA" && !applicantDeclaration) {
    toast.warn("Applicant Declaration must be checked before proceeding!");
  } else {
    try {
      params = {
        businessRegistrationNumber: businessRegistrationNumber,
        applicantFirstName: applicantFirstName,
        applicantMiddleName: applicantMiddleName,
        applicantLastName: applicantLastName,
        applicantNationality: applicantNationality,
        applicantDateOfBirth: applicantDateOfBirth,
        applicantKycMode: applicantKycMode,
        applicantIsResident: applicantIsResident,
        applicantPosition: applicantPosition,
        applicantSharePercentage: applicantSharePercentage,
        applicantAddress1: applicantAddress1,
        applicantAddress2: applicantAddress2,
        applicantCity: applicantCity,
        applicantState: applicantState,
        applicantPostcode: applicantPostcode,
        applicantCountry: applicantCountry,
        applicantCountryCode: applicantCountryCode,
        applicantContactNumber: applicantContactNumber,
        applicantEmail: applicantEmail,
        region: region,
      };

      if (region === "CA") {
        params.applicantOccupation = applicantOccupation;

        if (applicantDeclaration) {
          params.applicantDeclaration = "yes";
        } else {
          params.applicantDeclaration = "no";
        }
      }

      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/patchApplicantContactDetails",
        {
          params: params,
        }
      );

      let obj = response.data;
      if (obj.status == "SUCCESS") {
        try {
          const response2 = await Axios.get(
            sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetApplicantBusinessDetails",
            {
              params: {
                businessRegistrationNumber: businessRegistrationNumber,
              },
            }
          );
          let obj2 = response2.data;
          sessionStorage.setItem("applicantDetailsPost", JSON.stringify(obj2));
          toast.success("Applicant Details Updated");
        } catch (error) {
          toast.success("Applicant Details Updated");
        }
      } else {
        toast.error("Update Failed: " + obj.message);
      }
    } catch (error) {
      toast.error("Something went wrong: " + error);
    }
  }
};

//Submit to NIUM - EKYC
export const PostEKYC = async () => {
  var brn = sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber");
  var region = sessionStorage.getItem("region");

  // if (sessionStorage.getItem("region") ) {
  //   region = sessionStorage.getItem("region");
  // }

  const complianceStatus = sessionStorage.getItem("complianceStatus") || "";
  const customerHashId = sessionStorage.getItem("customerHashId") || "";
  const clientId = sessionStorage.getItem("clientId") || "";

  const params = {
    businessRegistrationNumber: brn,
    name: document.getElementById("tCname").value,
    versionId: document.getElementById("tCversion").value,
    accept: "true",
    region: region,
  };

  if (complianceStatus) {
    params.complianceStatus = complianceStatus;
    if (complianceStatus === "ERROR" || complianceStatus === "REJECT") {
      params.customerHashId = customerHashId;
      params.clientId = clientId;
    }
  }

  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/OnboardEKYCUser", {
      params: params,
    });

    let obj = response.data;
    if (obj.status == "BAD_REQUEST") {
      return obj;
    } else if (obj.clientId != "" || obj.customerHashId != "") {
      sessionStorage.setItem("Onboarding response: ", JSON.stringify(obj));

      //When onboarding succeeds, setting up important details
      sessionStorage.setItem("clientId", obj.clientId);
      sessionStorage.setItem("caseId", obj.caseId);
      sessionStorage.setItem("complianceStatus", obj.status);
      sessionStorage.setItem("customerHashId", obj.customerHashId);
      sessionStorage.setItem("walletHashId", obj.walletHashId);
      sessionStorage.setItem("kycUrl", obj.redirectUrl);

      return obj;
    } else {
      return obj;
    }
  } catch (error) {
    return error;
  }
};

export const FetchCognitoDetails = async () => {
  var email = sessionStorage.getItem("lastemail");
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/getcognitouserinfo", {
      params: {
        email: email,
      },
    });

    let data = response.data;
    let userAttr = data.userAttributes;
    if (userAttr.length > 0) {
      const contactName = userAttr.find((attr) => attr.name === "custom:contactName");
      const countryCode = userAttr.find((attr) => attr.name === "custom:isd_code");
      const phoneNumber = userAttr.find((attr) => attr.name === "phone_number");
      const email = userAttr.find((attr) => attr.name === "email");

      if (contactName || countryCode || phoneNumber || email) {
        var contactNameValue = "";

        if (contactName) {
          contactNameValue = contactName.value;
        }

        var countryCodeValue = "";
        if (countryCode) {
          countryCodeValue = countryCode.value;
        }

        var phoneNumberValue = "";
        if (phoneNumber) {
          phoneNumberValue = phoneNumber.value;
        }

        var emailValue = "";
        if (email) {
          emailValue = email.value;
        }

        var firstNameApplicant = document.getElementById("applicantFirstName");
        var middleNameApplicant = document.getElementById("applicantMiddleName");
        var lastNameApplicant = document.getElementById("applicantLastName");
        var emailApplicant = document.getElementById("applicantEmail");
        var countryCodeApplicant = document.getElementById("applicantCountryCode");
        var phoneNumberApplicant = document.getElementById("applicantContactNo");

        if (
          firstNameApplicant &&
          middleNameApplicant &&
          lastNameApplicant &&
          emailApplicant &&
          countryCodeApplicant &&
          phoneNumberApplicant
        ) {
          //Setting name
          // Split the input string into an array of names
          var names = contactNameValue.split(" ");

          // Extract the first and last names
          var firstName = names.shift(); // Remove and get the first name
          var lastName = names.pop(); // Remove and get the last name

          // Join any remaining names as the middle name
          var middleName = names.join(" ");

          // Set the values in the respective fields
          firstNameApplicant.value = firstName;
          if (lastName) {
            lastNameApplicant.value = lastName;
          }

          // If middle name exists, set it
          if (middleName) {
            middleNameApplicant.value = middleName;
          }

          //Setting email
          emailApplicant.value = emailValue;

          //Setting country code
          // Loop through the options and set the selected option
          for (var i = 0; i < countryCodeApplicant.options.length; i++) {
            if (countryCodeApplicant.options[i].getAttribute("data-country-code") === countryCodeValue) {
              countryCodeApplicant.selectedIndex = i;
              break; // Exit the loop once the option is found
            }
          }

          //Setting phone number
          var phone = phoneNumberValue;
          var extractedPhoneNumber = phone.substring(countryCodeValue.length + 1);
          phoneNumberApplicant.value = extractedPhoneNumber;
        }
      }
    } else {
      console.log("No results found for the following email: " + email);
    }
  } catch (error) {
    console.log("Something went wrong: ", error);
  }
};

export const ShowTCS = async () => {
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetTerms&Conditions");

    let obj = response.data;

    return obj;
  } catch (error) {
    return error;
  }
};

//Submit to NIUM - MKYC
export const PostMKYC = async () => {
  var brn = sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber");
  var region = sessionStorage.getItem("region");

  // if (sessionStorage.getItem("region")) {
  //   region = sessionStorage.getItem("region");
  // }

  const complianceStatus = sessionStorage.getItem("complianceStatus") || "";
  const customerHashId = sessionStorage.getItem("customerHashId") || "";
  const clientId = sessionStorage.getItem("clientId") || "";

  const params = {
    businessRegistrationNumber: brn,
    name: document.getElementById("tCname").value,
    versionId: document.getElementById("tCversion").value,
    accept: "true",
    region: region,
  };

  if (complianceStatus) {
    params.complianceStatus = complianceStatus;
    if (complianceStatus === "ERROR" || complianceStatus === "REJECT") {
      params.customerHashId = customerHashId;
      params.clientId = clientId;
    }
  }
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/OnboardMKYCUser", {
      params: params,
    });

    let obj = response.data;
    if (obj.status == "BAD_REQUEST") {
      return obj;
    } else if (obj.clientId != "" || obj.customerHashId != "") {
      sessionStorage.setItem("Onboarding response: ", JSON.stringify(obj));
      //When onboarding succeeds, setting up important details
      sessionStorage.setItem("clientId", obj.clientId);
      sessionStorage.setItem("caseId", obj.caseId);
      sessionStorage.setItem("complianceStatus", obj.status);
      sessionStorage.setItem("customerHashId", obj.customerHashId);
      sessionStorage.setItem("walletHashId", obj.walletHashId);
      sessionStorage.setItem("kycUrl", obj.redirectUrl);

      return obj;
    } else {
      return obj;
    }
  } catch (error) {
    return error;
  }
};
