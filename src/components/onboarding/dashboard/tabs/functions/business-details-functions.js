import React, { useState, useEffect } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const GetCorporateDetailsList = async () => {
  let region = sessionStorage.getItem("region");

  const businessRegistrationNumber = document.getElementById("businessRegistrationNumber").value;

  if (businessRegistrationNumber != "") {
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getBusinessList", {
        params: {
          region: region,
          businessRegistrationNumber: businessRegistrationNumber,
        },
      });

      let obj = response.data;
      let result = obj;

      if (result.length && result.length > 0) {
        return result; // Return the result data
      } else {
        Swal.fire({
          icon: "error",
          text: "No business(s) found for: " + businessRegistrationNumber,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            sessionStorage.setItem("BusinessNumberFromList", "NoneOfThese");
            document.getElementById("businessKybMode").value = "M_KYC";
          }
        });
        return [];
        //toast.error("No business found for the given Business Registration Number");
      }
    } catch (error) {
      sessionStorage.setItem("BusinessNumberFromList", "NoneOfThese");
      document.getElementById("businessKybMode").value = "M_KYC";
      toast.error("Error fetching business details, Please try again later!");
      return [];
    }
  }
};

export const GetCorporateDetails = async (brn) => {
  let region = sessionStorage.getItem("region");

  if (brn != "") {
    sessionStorage.setItem("businessRegistrationNumber", brn);
    document.getElementById("closeModalBtn").click();

    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getBusinessDetails", {
        params: {
          region: region,
          businessRegistrationNumber: brn,
        },
      });

      let obj = response.data;
      if (obj) {
        var BusinessDetails = obj.businessDetails;
        if (BusinessDetails) {
          document.getElementById("businessRegistrationNumber").value = brn;

          document.getElementById("businessName").value = BusinessDetails.businessName;
          sessionStorage.setItem("businessName", BusinessDetails.businessName);

          sessionStorage.setItem("searchId", BusinessDetails.additionalInfo.searchId);

          if (BusinessDetails.businessType) {
            document.getElementById("businessType").value = BusinessDetails.businessName;
          }

          if (BusinessDetails.tradeName) {
            document.getElementById("tradeName").value = BusinessDetails.businessName;
          }
          if (BusinessDetails.settlorName) {
            document.getElementById("settlorName").value = BusinessDetails.businessName;
          }

          if (BusinessDetails.trusteeName) {
            document.getElementById("trusteeName").value = BusinessDetails.trusteeName;
          }

          if (BusinessDetails.addresses) {
            var address = BusinessDetails.addresses;
            if (address.registeredAddress) {
              document.getElementById("registrationAddress_1").value = address.registeredAddress.addressLine1;
              document.getElementById("registrationAddress_2").value = address.registeredAddress.addressLine2;

              if (address.registeredAddress.city != "null") {
                document.getElementById("registrationCity").value = address.registeredAddress.city;
              }
              if (address.registeredAddress.state != "null") {
                document.getElementById("registrationState").value = address.registeredAddress.state;
              }

              document.getElementById("registrationPostCode").value = address.registeredAddress.postcode;
              document.getElementById("registrationCountry").value = address.registeredAddress.country;
            }
            if (address.businessAddress) {
              document.getElementById("businessAddress_1").value = address.businessAddress.addressLine1;
              document.getElementById("businessAddress_2").value = address.businessAddress.addressLine2;

              if (address.businessAddress.city != "null") {
                document.getElementById("businessCity").value = address.businessAddress.city;
              }
              if (address.businessAddress.state != "null") {
                document.getElementById("businessState").value = address.businessAddress.state;
              }

              document.getElementById("businessPostCode").value = address.businessAddress.postcode;
              document.getElementById("businessCountry").value = address.businessAddress.country;
            }
          }

          if (BusinessDetails.additionalInfo) {
            var sameBusinessAddress = BusinessDetails.additionalInfo.isSameBusinessAddress;
            var checkbox = document.getElementById("isSameBusinessAddress");
            if (sameBusinessAddress == "yes") {
              // This function will be called when the checkbox's value changes
              checkbox.checked = "true";
              document.getElementById("businessAddress_1").value =
                document.getElementById("registrationAddress_1").value;
              document.getElementById("businessAddress_2").value =
                document.getElementById("registrationAddress_2").value;
              document.getElementById("businessCity").value = document.getElementById("registrationCity").value;
              document.getElementById("businessState").value = document.getElementById("registrationState").value;
              document.getElementById("businessPostCode").value = document.getElementById("registrationPostCode").value;
              document.getElementById("businessCountry").value = document.getElementById("registrationCountry").value;
            } else {
              checkbox.checked = "false";
              document.getElementById("businessAddress_1").value = "";
              document.getElementById("businessAddress_2").value = "";
              document.getElementById("businessCity").value = "";
              document.getElementById("businessState").value = "";
              document.getElementById("businessPostCode").value = "";
              document.getElementById("businessCountry").value = "";
            }
          }
        }
      } else {
        toast.error("No results found");
      }
    } catch (error) {
      console.log("Error fetching business details: " + error.message);
    }
  } else {
    toast.error("No option selected.");
    document.getElementById("closeModalBtn").click();
  }
};

//General Details Starts
export const GetBusinessCorporationDetails = async (brn) => {
  let region = sessionStorage.getItem("region");

  //For preventing form failures
  let data = sessionStorage.getItem("BusinessDetailsPost");
  try {
    let obj = null;

    if (!data) {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getBusinessIncorporationDetails",
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
    //Filling Data when it's available
    document.getElementById("businessRegistrationNumber").value = obj.internalBusinessId;
    document.getElementById("businessRegistrationNumber").setAttribute("readonly", "true");
    document.getElementById("businessName").value = obj.businessName;
    sessionStorage.setItem("businessName", obj.businessName);
    document.getElementById("businessType").value = obj.businessType;
    sessionStorage.setItem("businessType", obj.businessType);

    if (obj.tradeName) {
      document.getElementById("tradeName").value = obj.tradeName;
    }

    if (obj.settlorName) {
      document.getElementById("settlorName").value = obj.settlorName;
    }

    if (obj.trusteeName) {
      document.getElementById("trusteeName").value = obj.trusteeName;
    }

    if (obj.businessType.toLowerCase() == "partnership") {
      document.getElementById("partnerName").value = obj.partnerName;
      document.getElementById("partnerState").value = obj.partnerState;
      document.getElementById("partnerCountry").value = obj.partnerCountry;
    } else if (obj.businessType.toLowerCase() == "association") {
      document.getElementById("associationName").value = obj.associationName;
      document.getElementById("associationNumber").value = obj.associationNumber;
      document.getElementById("associationChairPerson").value = obj.associationChairPerson;
    } else {
      document.getElementById("partnerName").value = "";
      document.getElementById("partnerState").value = "";
      document.getElementById("partnerCountry").value = "";
      document.getElementById("associationName").value = "";
      document.getElementById("associationNumber").value = "";
      document.getElementById("associationChairPerson").value = "";
    }

    document.getElementById("div7").style.width = "7%";
    // Address Details Implementation
    var regKeys = [];
    var businessKeys = [];

    for (var key in obj) {
      if (key.startsWith("reg")) {
        regKeys.push(key);
      } else if (key.startsWith("business")) {
        businessKeys.push(key);
      }
    }
    //Registered Address
    if (regKeys.length != 0) {
      document.getElementById("registrationAddress_1").value = obj.registrationAddress_1;

      document.getElementById("registrationAddress_2").value = obj.registrationAddress_2 || "";

      document.getElementById("registrationCity").value = obj.registrationCity || "";
      document.getElementById("registrationState").value = obj.registrationState || "";
      document.getElementById("registrationPostCode").value = obj.registrationPostCode;
      document.getElementById("registrationCountry").value = obj.registrationCountry;
    } else {
      document.getElementById("registrationAddress_1").value = "";
      document.getElementById("registrationAddress_2").value = "";
      document.getElementById("registrationCity").value = "";
      document.getElementById("registrationState").value = "";
      document.getElementById("registrationPostCode").value = "";
      document.getElementById("registrationCountry").value = "";
    }

    document.getElementById("div7").style.width = "14%";

    if (obj.sameBusinessAddress) {
      if (obj.sameBusinessAddress == "yes") {
        var isSameBusinessAddress = document.getElementById("isSameBusinessAddress");
        isSameBusinessAddress.checked = true;
        document.getElementById("businessAddress_1").value = obj.registrationAddress_1;
        document.getElementById("businessAddress_2").value = obj.registrationAddress_2 || "";
        document.getElementById("businessCity").value = obj.registrationCity || "";
        document.getElementById("businessState").value = obj.registrationState || "";
        document.getElementById("businessPostCode").value = obj.registrationPostCode;
        document.getElementById("businessCountry").value = obj.registrationCountry;
      } else if (obj.sameBusinessAddress == "no" && businessKeys.length != 0) {
        var isSameBusinessAddress = document.getElementById("isSameBusinessAddress");
        isSameBusinessAddress.checked = false;
        document.getElementById("businessAddress_1").value = obj.businessAddress_1;
        document.getElementById("businessAddress_2").value = obj.businessAddress_2 || "";
        document.getElementById("businessCity").value = obj.businessCity || "";
        document.getElementById("businessState").value = obj.businessState || "";
        document.getElementById("businessPostCode").value = obj.businessPostCode;
        document.getElementById("businessCountry").value = obj.businessCountry;
      } else {
        //Business Address
        document.getElementById("businessAddress_1").value = "";
        document.getElementById("businessAddress_2").value = "";
        document.getElementById("businessCity").value = "";
        document.getElementById("businessState").value = "";
        document.getElementById("businessPostCode").value = "";
        document.getElementById("businessCountry").value = "";
      }
    }

    if (obj.businessKybMode && obj.businessKybMode === "M_KYC") {
      document.getElementById("businessKybMode").value = obj.businessKybMode;
      sessionStorage.setItem("BusinessNumberFromList", "NoneOfThese");
    } else {
      document.getElementById("businessKybMode").value = "E_KYC";
      sessionStorage.setItem("BusinessNumberFromList", obj.internalBusinessId);
    }

    document.getElementById("div7").style.width = "20%";
  } catch (error) {
    console.log("Something went wrong: " + error);
  }
};

export const PostBusinessAddressDetails = async () => {
  let region = sessionStorage.getItem("region");

  var businessRegistrationNumber = document.getElementById("businessRegistrationNumber").value;
  sessionStorage.setItem("businessRegistrationNumber", businessRegistrationNumber);

  var businessName = document.getElementById("businessName").value;
  var businessType = document.getElementById("businessType").value;
  var tradeName = document.getElementById("tradeName").value;
  var settlorName = document.getElementById("settlorName").value;
  var trusteeName = document.getElementById("trusteeName").value;

  var partnerName = document.getElementById("partnerName").value;
  var partnerState = document.getElementById("partnerState").value;
  var partnerCountry = document.getElementById("partnerCountry").value;
  var associationName = document.getElementById("associationName").value;
  var associationNumber = document.getElementById("associationNumber").value;
  var associationChairPerson = document.getElementById("associationChairPerson").value;

  //Registered Address
  var registrationAddress_1 = document.getElementById("registrationAddress_1").value;
  var registrationAddress_2 = document.getElementById("registrationAddress_2").value;
  var registrationCity = document.getElementById("registrationCity").value;
  var registrationState = document.getElementById("registrationState").value;
  var registrationPostCode = document.getElementById("registrationPostCode").value;
  var registrationCountry = document.getElementById("registrationCountry").value;

  var sameBusinessAddress = "";
  var isSameBusinessAddress = document.getElementById("isSameBusinessAddress");

  if (isSameBusinessAddress.checked) {
    sameBusinessAddress = "yes";
  } else {
    sameBusinessAddress = "no";
  }

  //Business Address
  var businessAddress_1 = document.getElementById("businessAddress_1").value;
  var businessAddress_2 = document.getElementById("businessAddress_2").value;
  var businessCity = document.getElementById("businessCity").value;
  var businessState = document.getElementById("businessState").value;
  var businessPostCode = document.getElementById("businessPostCode").value;
  var businessCountry = document.getElementById("businessCountry").value;

  var businessKybMode = document.getElementById("businessKybMode").value;

  if (businessRegistrationNumber == "") {
    toast.warn("Business Registration Number Must Not Be Empty.");
  } else if (businessName == "") {
    toast.warn("Business Name Must Not Be Empty.");
  } else if (businessType == "") {
    toast.warn("Business Type Must Not Be Empty.");
  } else if (businessType == "ASSOCIATION" && associationName == "") {
    toast.warn("Association Name Cannot Be Empty");
  } else if (businessType == "ASSOCIATION" && associationNumber == "") {
    toast.warn("Association Number Cannot Be Empty");
  } else if (businessType == "ASSOCIATION" && associationChairPerson == "") {
    toast.warn("Association ChairPerson Cannot Be Empty");
  }

  //Registered Address Details exception handling
  else if (registrationAddress_1 == "") {
    toast.warn("Address 1 Must Not Be Empty!");
  } else if (registrationPostCode == "") {
    toast.warn("Post Code Must Not Be Empty!");
  } else if (registrationCountry == "") {
    toast.warn("Country Must Not Be Empty!");
  }

  //Business Address Details exception handling
  else if (sameBusinessAddress == "yes" && businessAddress_1 == "") {
    toast.warn("Address 1 Must Not Be Empty!");
  } else if (sameBusinessAddress == "yes" && businessPostCode == "") {
    toast.warn("Post Code Must Not Be Empty!");
  } else if (sameBusinessAddress == "yes" && businessCountry == "") {
    toast.warn("Country Must Not Be Empty!");
  } else if ((region === "UK" || region === "HK") && tradeName === "") {
    toast.warn("Trade Name Must Not Be Empty!");
  }

  //When no expection found, triggering the API
  else {
    try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/postBusinessAddressDetails",
        {
          params: {
            email: sessionStorage.getItem("lastemail"),
            businessRegistrationNumber: businessRegistrationNumber,
            businessName: businessName,
            businessType: businessType,
            tradeName: tradeName,
            settlorName: settlorName,
            trusteeName: trusteeName,
            partnerName: partnerName,
            partnerState: partnerState,
            partnerCountry: partnerCountry,
            associationName: associationName,
            associationNumber: associationNumber,
            associationChairPerson: associationChairPerson,

            //Registered Address as params - temporary
            registrationAddress_1: registrationAddress_1,
            registrationAddress_2: registrationAddress_2,
            registrationCity: registrationCity,
            registrationState: registrationState,
            registrationPostCode: registrationPostCode,
            registrationCountry: registrationCountry,
            sameBusinessAddress: sameBusinessAddress,

            //Registered Address as params - temporary
            businessAddress_1: businessAddress_1,
            businessAddress_2: businessAddress_2,
            businessCity: businessCity,
            businessState: businessState,
            businessPostCode: businessPostCode,
            businessCountry: businessCountry,

            businessKybMode: businessKybMode,
          },
        }
      );

      let obj = response.data;
      if (obj.status == "SUCCESS") {
        try {
          const response2 = await Axios.get(
            sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getBusinessIncorporationDetails",
            {
              params: {
                businessRegistrationNumber: businessRegistrationNumber,
              },
            }
          );
          let obj2 = response2.data;
          sessionStorage.setItem("BusinessDetailsPost", JSON.stringify(obj2));

          toast.success("General Details Submitted");
          document.getElementById("submitBusinessAddress").style.display = "none";
          document.getElementById("updateBusinessAddress").style.display = "";
          document.getElementById("div7").style.width = "20%";
          sessionStorage.setItem("internalBusinessId", businessRegistrationNumber);
          sessionStorage.setItem("lastScreenCompleted", 1);
          sessionStorage.setItem("userStatus", "N");
        } catch (error) {
          toast.success("General Details Submitted");
          document.getElementById("submitBusinessAddress").style.display = "none";
          document.getElementById("updateBusinessAddress").style.display = "";
          document.getElementById("div7").style.width = "20%";
          sessionStorage.setItem("internalBusinessId", businessRegistrationNumber);
          sessionStorage.setItem("lastScreenCompleted", 1);
          sessionStorage.setItem("userStatus", "N");
        }
      } else {
        toast.error("Submission Failed: " + obj.message);
        document.getElementById("submitBusinessAddress").style.display = "";
        document.getElementById("updateBusinessAddress").style.display = "none";
      }
    } catch (error) {
      toast.error("Something went wrong: " + error);
      document.getElementById("submitBusinessAddress").style.display = "";
      document.getElementById("updateBusinessAddress").style.display = "none";
    }
  }
};

export const PatchBusinessAddressDetails = async () => {
  let region = sessionStorage.getItem("region");

  var businessRegistrationNumber = document.getElementById("businessRegistrationNumber").value;
  var businessName = document.getElementById("businessName").value;
  var businessType = document.getElementById("businessType").value;
  var tradeName = document.getElementById("tradeName").value;
  var settlorName = document.getElementById("settlorName").value;
  var trusteeName = document.getElementById("trusteeName").value;

  var partnerName = document.getElementById("partnerName").value;
  var partnerState = document.getElementById("partnerState").value;
  var partnerCountry = document.getElementById("partnerCountry").value;
  var associationName = document.getElementById("associationName").value;
  var associationNumber = document.getElementById("associationNumber").value;
  var associationChairPerson = document.getElementById("associationChairPerson").value;

  //Registered Address
  var registrationAddress_1 = document.getElementById("registrationAddress_1").value;
  var registrationAddress_2 = document.getElementById("registrationAddress_2").value;
  var registrationCity = document.getElementById("registrationCity").value;
  var registrationState = document.getElementById("registrationState").value;
  var registrationPostCode = document.getElementById("registrationPostCode").value;
  var registrationCountry = document.getElementById("registrationCountry").value;

  var sameBusinessAddress = "";
  var isSameBusinessAddress = document.getElementById("isSameBusinessAddress");

  if (isSameBusinessAddress.checked) {
    sameBusinessAddress = "yes";
  } else {
    sameBusinessAddress = "no";
  }

  //Business Address
  var businessAddress_1 = document.getElementById("businessAddress_1").value;
  var businessAddress_2 = document.getElementById("businessAddress_2").value;
  var businessCity = document.getElementById("businessCity").value;
  var businessState = document.getElementById("businessState").value;
  var businessPostCode = document.getElementById("businessPostCode").value;
  var businessCountry = document.getElementById("businessCountry").value;

  if (businessRegistrationNumber == "") {
    toast.warn("Business Registration Number Must Not Be Empty.");
  } else if (businessName == "") {
    toast.warn("Business Name Must Not Be Empty.");
  } else if (businessType == "") {
    toast.warn("Business Type Must Not Be Empty.");
  } else if (businessType == "ASSOCIATION" && associationName == "") {
    toast.warn("Association Name Cannot Be Empty");
  } else if (businessType == "ASSOCIATION" && associationNumber == "") {
    toast.warn("Association Number Cannot Be Empty");
  } else if (businessType == "ASSOCIATION" && associationChairPerson == "") {
    toast.warn("Association ChairPerson Cannot Be Empty");
  }

  //Registered Address Details exception handling
  else if (registrationAddress_1 == "") {
    toast.warn("Address 1 Must Not Be Empty!");
  } else if (registrationPostCode == "") {
    toast.warn("Post Code Must Not Be Empty!");
  } else if (registrationCountry == "") {
    toast.warn("Country Must Not Be Empty!");
  }

  //Business Address Details exception handling
  else if (sameBusinessAddress == "yes" && businessAddress_1 == "") {
    toast.error("Address 1 Must Not Be Empty!");
  } else if (sameBusinessAddress == "yes" && businessPostCode == "") {
    toast.error("Post Code Must Not Be Empty!");
  } else if (sameBusinessAddress == "yes" && businessCountry == "") {
    toast.error("Country Must Not Be Empty!");
  }

  //When no expection found, triggering the API
  else {
    try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/patchBusinessAddressDetails",
        {
          params: {
            businessRegistrationNumber: businessRegistrationNumber,

            businessName: businessName,
            businessType: businessType,
            tradeName: tradeName,
            settlorName: settlorName,
            trusteeName: trusteeName,
            partnerName: partnerName,
            partnerState: partnerState,
            partnerCountry: partnerCountry,
            associationName: associationName,
            associationNumber: associationNumber,
            associationChairPerson: associationChairPerson,

            //Registered Address as params - temporary
            registrationAddress_1: registrationAddress_1,
            registrationAddress_2: registrationAddress_2,
            registrationCity: registrationCity,
            registrationState: registrationState,
            registrationPostCode: registrationPostCode,
            registrationCountry: registrationCountry,
            sameBusinessAddress: sameBusinessAddress,

            //Registered Address as params - temporary
            businessAddress_1: businessAddress_1,
            businessAddress_2: businessAddress_2,
            businessCity: businessCity,
            businessState: businessState,
            businessPostCode: businessPostCode,
            businessCountry: businessCountry,
          },
        }
      );

      let obj = response.data;
      if (obj.status == "SUCCESS") {
        try {
          const response2 = await Axios.get(
            sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getBusinessIncorporationDetails",
            {
              params: {
                businessRegistrationNumber: businessRegistrationNumber,
              },
            }
          );
          let obj2 = response2.data;
          sessionStorage.setItem("BusinessDetailsPost", JSON.stringify(obj2));
          toast.success("General Details Updated");
        } catch (error) {
          toast.success("General Details Updated");
        }
      } else {
        toast.error("Updated Failed: " + obj.message);
      }
    } catch (error) {
      toast.error("Something went wrong: " + error.message);
    }
  }
};

//General Details End

//Business Details Starts
export const GetAdditionalBusinessCorporationDetails = async (brn) => {
  let region = sessionStorage.getItem("region");

  try {
    //Fetching data from the session
    let data = sessionStorage.getItem("additionalBusinessDetailsPost");

    //Checking if the data is available or not
    if (data == null) {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getAdditionalBusinessDetails",
        {
          params: {
            businessRegistrationNumber: brn,
          },
        }
      );

      if (response.data) {
        sessionStorage.setItem("additionalBusinessDetailsPost", JSON.stringify(response.data));
      }
    }

    let obj = "";
    let sessionData = sessionStorage.getItem("additionalBusinessDetailsPost");

    if (sessionData) {
      obj = JSON.parse(sessionData);
    }

    var returnObj = {};

    if (obj.hasOwnProperty("regCountry")) {
      document.getElementById("registeredCountry").value = obj.regCountry;
    }

    if (obj.hasOwnProperty("registeredDate")) {
      document.getElementById("registeredDate").value = obj.registeredDate;
    }
    // document.getElementById("submitLegalDetails");

    if (obj.hasOwnProperty("listedExchange")) {
      document.getElementById("listedExchange").value = obj.listedExchange;
    }

    if (obj.hasOwnProperty("regType")) {
      document.getElementById("registrationType").value = obj.regType;
    }

    if (obj.hasOwnProperty("legislationName")) {
      document.getElementById("legislationName").value = obj.legislationName;
    }

    if (obj.hasOwnProperty("legislationType")) {
      document.getElementById("legislationType").value = obj.legislationType;
    }

    document.getElementById("div7").style.width = "24%";

    if (obj.hasOwnProperty("website")) {
      document.getElementById("website").value = obj.website;
    }

    document.getElementById("div7").style.width = "28%";

    if (obj.hasOwnProperty("country")) {
      document.getElementById("taxCountry").value = obj.country;
    }

    if (obj.hasOwnProperty("taxNumber")) {
      document.getElementById("taxNumber").value = obj.taxNumber;
    }

    document.getElementById("div7").style.width = "32%";

    if (obj.hasOwnProperty("regulatedTrustType")) {
      document.getElementById("regulatedTrustType").value = obj.regulatedTrustType;
    }

    if (obj.hasOwnProperty("unregulatedTrustType")) {
      document.getElementById("unregulatedTrustType").value = obj.unregulatedTrustType;
    }

    if (obj.hasOwnProperty("searchId")) {
      document.getElementById("searchId").value = obj.searchId;
      sessionStorage.setItem("searchId", obj.searchId);
    }

    document.getElementById("div7").style.width = "36%";

    if (obj.hasOwnProperty("totalEmployees")) {
      document.getElementById("totalEmployees").value = obj.totalEmployees;
    }

    if (obj.hasOwnProperty("annualTurnover")) {
      document.getElementById("annualTurnover").value = obj.annualTurnover;
    }

    if (obj.hasOwnProperty("industrySector")) {
      document.getElementById("industrySector").value = obj.industrySector;
    }

    if (obj.hasOwnProperty("countryOfOperation")) {
      //var countryOfOperationValues = obj.countryOfOperation;
      //document.getElementById("countryOfOperation").val(countryOfOperationValues.split(","));
      returnObj.countryOfOperation = obj.countryOfOperation;
    }

    if (obj.hasOwnProperty("travelRestrictedCountry")) {
      document.getElementById("travelRestrictedCountry").value = obj.travelRestrictedCountry;
    }

    if (obj.hasOwnProperty("restrictedCountry")) {
      document.getElementById("restrictedCountries").value = obj.restrictedCountry;
    }

    if (obj.hasOwnProperty("ofacLicencePresent")) {
      document.getElementById("ofacLicencePresent").value = obj.ofacLicencePresent;
    }

    //Intended Use of Account
    if (obj.hasOwnProperty("transactionCountries")) {
      //document.getElementById("transactionCountries").value = obj.transactionCountries;
      returnObj.transactionCountries = obj.transactionCountries;
    }

    //Transaction Countries
    if (obj.hasOwnProperty("intendedUseOfAccount")) {
      document.getElementById("intendedUseOfAccount").value = obj.intendedUseOfAccount;
    }

    document.getElementById("div7").style.width = "40%";

    if (obj.hasOwnProperty("description")) {
      document.getElementById("businessDescription").value = obj.description;
    }

    return JSON.stringify(returnObj);
    //Filling Data when it's available
  } catch (error) {
    console.log("Something went wrong: " + error);
  }
};

export const FillAdditionalBusinessDetails = async (brn) => {
  let region = sessionStorage.getItem("region");

  if (brn != "") {
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getBusinessDetails", {
        params: {
          region: region,
          businessRegistrationNumber: brn,
        },
      });

      let obj = response.data;
      if (obj) {
        var BusinessDetails = obj.businessDetails;
        if (BusinessDetails) {
          if (BusinessDetails.legalDetails) {
            var legalDetails = BusinessDetails.legalDetails;
            document.getElementById("registeredDate").value = legalDetails.registeredDate;
            document.getElementById("registeredCountry").value = legalDetails.registeredCountry;
          }
          if (BusinessDetails.website && BusinessDetails.website != "null") {
            document.getElementById("website").value = BusinessDetails.website;
          }

          if (BusinessDetails.additionalInfo) {
            var additionalInfo = BusinessDetails.additionalInfo;
            document.getElementById("searchId").value = additionalInfo.searchId;
            sessionStorage.setItem("searchId", additionalInfo.searchId);
            //document.getElementById("companyStatus").value = additionalInfo.companyStatus;
          }
        }
        var riskAssessmentInfo = obj.riskAssessmentInfo;
        if (riskAssessmentInfo) {
          if (riskAssessmentInfo.annualTurnover != "NA" || riskAssessmentInfo.annualTurnover != "null") {
            document.getElementById("annualTurnover").value = riskAssessmentInfo.annualTurnover;
          }

          if (riskAssessmentInfo.totalEmployees != "NA" || riskAssessmentInfo.totalEmployees != "null") {
            document.getElementById("totalEmployees").value = riskAssessmentInfo.totalEmployees;
          }
        }
      } else {
        toast.error("No results found");
      }
    } catch (error) {
      console.log("Error fetching business details: " + error.message);
    }
  } else {
    toast.error("Business Registration Number not found");
  }
};

export const PostRiskAssessmentInfo = async (selectedCopValues, selectedTCValues) => {
  let region = sessionStorage.getItem("region");

  var registeredCountry = document.getElementById("registeredCountry").value;
  var registeredDate = document.getElementById("registeredDate").value;

  //validations for listedExchange
  let businessDetails = sessionStorage.getItem("BusinessDetailsPost");
  let businessType = JSON.parse(businessDetails).businessType;
  let listedExchange = null;

  if (businessType === "PUBLIC_COMPANY") {
    listedExchange = document.getElementById("listedExchange").value;
  }

  var registrationType = document.getElementById("registrationType").value;
  var legislationName = document.getElementById("legislationName").value;
  var legislationType = document.getElementById("legislationType").value;
  var website = document.getElementById("website").value;
  var taxCountry = document.getElementById("taxCountry").value;
  var taxNumber = document.getElementById("taxNumber").value;
  var regulatedTrustType = document.getElementById("regulatedTrustType").value;
  var unregulatedTrustType = document.getElementById("unregulatedTrustType").value;
  var searchId = document.getElementById("searchId").value;

  var totalEmployees = document.getElementById("totalEmployees").value;
  var annualTurnover = document.getElementById("annualTurnover").value;
  var industrySector = document.getElementById("industrySector").value;

  //var countryOfOperation = document.getElementById("countryOfOperation").value;
  var countryOfOperation = selectedCopValues;

  var travelRestrictedCountry = document.getElementById("travelRestrictedCountry").value;
  var restrictedCountries = document.getElementById("restrictedCountries").value;
  var ofacLicencePresent = document.getElementById("ofacLicencePresent").value;

  //var transactionCountries = document.getElementById("transactionCountries").value;
  var transactionCountries = selectedTCValues;
  var intendedUseOfAccount = document.getElementById("intendedUseOfAccount").value;

  let businessDetailsPost = JSON.parse(sessionStorage.getItem("BusinessDetailsPost"));
  let businessKybMode = businessDetailsPost.businessKybMode;

  let businessDescription = document.getElementById("businessDescription")?.value;

  if (registeredCountry == "") {
    toast.warn("Registered Country Must Not Be Empty");
  } else if (registeredDate == "") {
    toast.warn("Registered Date Must Not Be Empty");
    // } else if (sessionStorage.getItem("businessType").toLowerCase() == "public_company" && listedExchange == "") {
    //   toast.warn("Listed Exchange Must Not Be Empty");
    // } else if (sessionStorage.getItem("businessType").toLowerCase() == "trust" && unregulatedTrustType == "") {
    //   toast.warn("Unregulated Trust Type Must Not Be Empty");
    //
  } else if (totalEmployees == "") {
    toast.warn("Total Employees Must Not Be Empty");
  } else if (annualTurnover == "") {
    toast.warn("Annual Turnover Must Not Be Empty");
  } else if (industrySector == "") {
    toast.warn("Industry Sector Must Not Be Empty");
  } else if (countryOfOperation == "") {
    toast.warn("Country Of Operation Must Not Be Empty");
  } else if (transactionCountries == "") {
    toast.warn("Transaction Countries Must Not Be Empty");
  } else if (intendedUseOfAccount == "") {
    toast.warn("Intended Use Of Account Must Not Be Empty");
  } else if (region === "CA" && businessDescription == "") {
    toast.warn("Business Description Must Not Be Empty.");
  } else {
    let body = {
      businessRegistrationNumber: sessionStorage.getItem("businessRegistrationNumber"),
      email: sessionStorage.getItem("lastemail"),
      registeredCountry: registeredCountry,
      registeredDate: registeredDate,
      listedExchange: listedExchange,
      registrationType: registrationType,
      legislationName: legislationName,
      legislationType: legislationType,
      website: website,
      taxCountry: taxCountry,
      taxNumber: taxNumber,
      regulatedTrustType: regulatedTrustType,
      unregulatedTrustType: unregulatedTrustType,
      totalEmployees: totalEmployees,
      annualTurnover: annualTurnover,
      industrySector: industrySector,
      countryOfOperation: countryOfOperation,
      travelRestrictedCountry: travelRestrictedCountry,
      restrictedCountries: restrictedCountries,
      ofacLicencePresent: ofacLicencePresent,
      searchId: searchId,
      transactionCountries: transactionCountries,
      intendedUseOfAccount: intendedUseOfAccount,
      businessType: businessType,
      businessKybMode: businessKybMode,
      region: region,
    };

    if (region === "CA") {
      body.businessDescription = businessDescription;
    }

    try {
      const response = await Axios.post(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/postRiskAssessmentInfo",
        body
      );

      let obj = response.data;
      if (obj.status == "SUCCESS") {
        try {
          const response2 = await Axios.get(
            sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getAdditionalBusinessDetails",
            {
              params: {
                businessRegistrationNumber: sessionStorage.getItem("businessRegistrationNumber"),
              },
            }
          );

          let obj2 = response2.data;
          sessionStorage.setItem("additionalBusinessDetailsPost", JSON.stringify(obj2));
          toast.success("Business Details Submitted");
          document.getElementById("submitRiskAssessmentInfo").style.display = "none";
          document.getElementById("updateRiskAssessmentInfo").style.display = "";
          document.getElementById("div7").style.width = "40%";
          sessionStorage.setItem("lastScreenCompleted", 2);
          sessionStorage.setItem("userStatus", "N");
        } catch (error) {
          toast.success("Business Details Submitted");
          document.getElementById("submitRiskAssessmentInfo").style.display = "none";
          document.getElementById("updateRiskAssessmentInfo").style.display = "";
          document.getElementById("div7").style.width = "40%";
          sessionStorage.setItem("lastScreenCompleted", 2);
          sessionStorage.setItem("userStatus", "N");
        }
      } else {
        toast.error("Submission Failed: " + obj.message);
        document.getElementById("submitRiskAssessmentInfo").style.display = "";
        document.getElementById("updateRiskAssessmentInfo").style.display = "none";
      }
    } catch (error) {
      toast.error("Something went wrong: " + error);
      document.getElementById("submitRiskAssessmentInfo").style.display = "";
      document.getElementById("updateRiskAssessmentInfo").style.display = "none";
    }
  }
};

export const PatchRiskAssessmentInfo = async (selectedCopValues, selectedTCValues) => {
  let region = sessionStorage.getItem("region");

  var registeredCountry = document.getElementById("registeredCountry").value;
  var registeredDate = document.getElementById("registeredDate").value;
  var listedExchange = document.getElementById("listedExchange").value;
  var registrationType = document.getElementById("registrationType").value;
  var legislationName = document.getElementById("legislationName").value;
  var legislationType = document.getElementById("legislationType").value;
  var website = document.getElementById("website").value;
  var taxCountry = document.getElementById("taxCountry").value;
  var taxNumber = document.getElementById("taxNumber").value;
  var regulatedTrustType = document.getElementById("regulatedTrustType").value;
  var unregulatedTrustType = document.getElementById("unregulatedTrustType").value;
  var searchId = document.getElementById("searchId").value;

  var totalEmployees = document.getElementById("totalEmployees").value;
  var annualTurnover = document.getElementById("annualTurnover").value;
  var industrySector = document.getElementById("industrySector").value;
  //var countryOfOperation = document.getElementById("countryOfOperation").value;
  var travelRestrictedCountry = document.getElementById("travelRestrictedCountry").value;
  var restrictedCountries = document.getElementById("restrictedCountries").value;
  var ofacLicencePresent = document.getElementById("ofacLicencePresent").value;

  //var transactionCountries = document.getElementById("transactionCountries").value;
  var intendedUseOfAccount = document.getElementById("intendedUseOfAccount").value;

  var businessDescription = document.getElementById("businessDescription")?.value;

  var countryOfOperation = selectedCopValues;
  var transactionCountries = selectedTCValues;

  if (registeredCountry == "") {
    toast.warn("Registered Country Must Not Be Empty");
  } else if (registeredDate == "") {
    toast.warn("Registered Date Must Not Be Empty");
  } else if (
    sessionStorage.getItem("businessType") &&
    sessionStorage.getItem("businessType").toLowerCase() == "public_company" &&
    listedExchange == ""
  ) {
    toast.warn("Listed Exchange Must Not Be Empty");
  } else if (
    sessionStorage.getItem("businessType") &&
    sessionStorage.getItem("businessType").toLowerCase() == "trust" &&
    unregulatedTrustType == ""
  ) {
    toast.warn("Unregulated Trust Type Must Not Be Empty");
  } else if (totalEmployees == "") {
    toast.warn("Total Employees Must Not Be Empty");
  } else if (annualTurnover == "") {
    toast.warn("Annual Turnover Must Not Be Empty");
  } else if (industrySector == "") {
    toast.warn("Industry Sector Must Not Be Empty");
  } else if (countryOfOperation == "") {
    toast.warn("Country Of Operation Must Not Be Empty");
  } else if (transactionCountries == "") {
    toast.warn("Transaction Countries Must Not Be Empty");
  } else if (intendedUseOfAccount == "") {
    toast.warn("Intended Use Of Account Must Not Be Empty");
  } else if (region === "CA" && businessDescription === "") {
    toast.warn("Business Description Must Not Be Empty");
  } else {
    let body = {
      businessRegistrationNumber: sessionStorage.getItem("businessRegistrationNumber"),
      registeredCountry: registeredCountry,
      registeredDate: registeredDate,
      listedExchange: listedExchange,
      registrationType: registrationType,
      legislationName: legislationName,
      legislationType: legislationType,
      website: website,
      taxCountry: taxCountry,
      taxNumber: taxNumber,
      regulatedTrustType: regulatedTrustType,
      unregulatedTrustType: unregulatedTrustType,
      totalEmployees: totalEmployees,
      annualTurnover: annualTurnover,
      industrySector: industrySector,
      countryOfOperation: countryOfOperation,
      travelRestrictedCountry: travelRestrictedCountry,
      restrictedCountries: restrictedCountries,
      ofacLicencePresent: ofacLicencePresent,
      searchId: searchId,
      transactionCountries: transactionCountries,
      intendedUseOfAccount: intendedUseOfAccount,
      region: region,
    };

    if (region === "CA") {
      body.businessDescription = businessDescription;
    }
    try {
      const response = await Axios.post(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/patchRiskAssessmentInfo",
        body
      );

      let obj = response.data;
      if (obj.status == "SUCCESS") {
        try {
          const response2 = await Axios.get(
            sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getAdditionalBusinessDetails",
            {
              params: {
                businessRegistrationNumber: sessionStorage.getItem("businessRegistrationNumber"),
              },
            }
          );

          let obj2 = response2.data;
          sessionStorage.setItem("additionalBusinessDetailsPost", JSON.stringify(obj2));
          toast.success("Business Details Updated");
          document.getElementById("submitRiskAssessmentInfo").style.display = "none";
          document.getElementById("updateRiskAssessmentInfo").style.display = "";
        } catch (error) {
          toast.success("Business Details Updated");
          document.getElementById("submitRiskAssessmentInfo").style.display = "none";
          document.getElementById("updateRiskAssessmentInfo").style.display = "";
        }
        // toast.success("Business Details Updated");
        // document.getElementById("submitRiskAssessmentInfo").style.display = "none";
        // document.getElementById("updateRiskAssessmentInfo").style.display = "";
      } else {
        toast.error("Update Failed: " + obj.message);
        document.getElementById("submitRiskAssessmentInfo").style.display = "";
        document.getElementById("updateRiskAssessmentInfo").style.display = "none";
      }
    } catch (error) {
      toast.error("Something went wrong: " + error);
      document.getElementById("submitRiskAssessmentInfo").style.display = "";
      document.getElementById("updateRiskAssessmentInfo").style.display = "none";
    }
  }
};
