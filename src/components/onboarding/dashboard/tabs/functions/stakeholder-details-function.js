import React, { useState, useEffect } from "react";
import Axios from "axios";
import { toast } from "react-toastify";

export const FillStakeholderDetails = async (brn) => {
  if (brn != "") {
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getBusinessDetails", {
        params: {
          region: "SG",
          businessRegistrationNumber: brn,
        },
      });

      let obj = response.data;
      if (obj) {
        var BusinessDetails = obj.businessDetails;
        if (BusinessDetails) {
          var stakeholders = BusinessDetails.stakeholders;
          sessionStorage.setItem("stakeholderDataset", JSON.stringify(stakeholders));
          return stakeholders;
          // var StakeholderFirst = stakeholders[0];
          // if (StakeholderFirst.hasOwnProperty("stakeholderDetails")) {
          //   var data = StakeholderFirst.stakeholderDetails;
          //   if (data.hasOwnProperty("firstName")) {
          //     document.getElementById("firstNameStakeholder").value = data.firstName;
          //   }

          //   if (data.hasOwnProperty("middleName")) {
          //     document.getElementById("middleNameStakeholder").value = data.middleName;
          //   }

          //   if (data.hasOwnProperty("lastName")) {
          //     document.getElementById("lastNameStakeholder").value = data.lastName;
          //   }

          //   if (data.hasOwnProperty("nationality")) {
          //     document.getElementById("nationalityStakeholder").value = data.nationality;
          //   }

          //   if (data.hasOwnProperty("dateOfBirth")) {
          //     document.getElementById("dateOfBirthStakeholder").value = data.dateOfBirth;
          //   }
          //   document.getElementById("div7").style.width = "43%";

          //   // Continue checking and setting values for other fields...

          //   // Contact Details
          //   if (data.hasOwnProperty("contactDetails")) {
          //     var ContactDetails = data.contactDetails;
          //     if (ContactDetails.hasOwnProperty("contactNumber")) {
          //       document.getElementById("contactNoStakeholder").value = ContactDetails.contactNumber;
          //     }

          //     if (ContactDetails.hasOwnProperty("email")) {
          //       document.getElementById("emailStakeholder").value = ContactDetails.emailStakeholder;
          //     }
          //     document.getElementById("div7").style.width = "46%";
          //   }

          //   // Professional Details
          //   if (data.hasOwnProperty("professionalDetails")) {
          //     var ProfessionalDetails = data.professionalDetails[0];

          //     if (ProfessionalDetails.hasOwnProperty("position")) {
          //       document.getElementById("positionStakeholder").value = ProfessionalDetails.position;
          //     }

          //     if (ProfessionalDetails.hasOwnProperty("sharePercentage")) {
          //       document.getElementById("sharePercentageStakeholder").value = ProfessionalDetails.sharePercentage;
          //     }
          //     document.getElementById("div7").style.width = "49%";
          //   }

          //   // Stakeholder Address Details
          //   if (data.hasOwnProperty("address")) {
          //     var StakeholderAddress = data.address;
          //     if (StakeholderAddress.hasOwnProperty("addressLine1")) {
          //       document.getElementById("addressLine1Stakeholder").value = StakeholderAddress.addressLine1;
          //     }

          //     if (StakeholderAddress.hasOwnProperty("addressLine2")) {
          //       document.getElementById("addressLine2Stakeholder").value = StakeholderAddress.addressLine2;
          //     }

          //     if (StakeholderAddress.hasOwnProperty("city")) {
          //       document.getElementById("cityStakeholder").value = StakeholderAddress.city;
          //     }

          //     if (StakeholderAddress.hasOwnProperty("state")) {
          //       document.getElementById("stateStakeholder").value = StakeholderAddress.state;
          //     }

          //     if (StakeholderAddress.hasOwnProperty("postcode")) {
          //       document.getElementById("postcodeStakeholder").value = StakeholderAddress.postcode;
          //     }

          //     if (StakeholderAddress.hasOwnProperty("country")) {
          //       document.getElementById("countryStakeholder").value = StakeholderAddress.country;
          //     }
          //     document.getElementById("div7").style.width = "53%";
          //   }
          // }
          // // Business Partner Details
          // if (StakeholderFirst.hasOwnProperty("businessPartner")) {
          //   document.getElementById("businessNameStakeholder").value = StakeholderFirst.businessPartner;
          // }
          // if (StakeholderFirst.hasOwnProperty("businessRegistrationNumber")) {
          //   document.getElementById("businessRegistrationNumberStakeholder").value =
          //     StakeholderFirst.businessRegistrationNumber;
          // }
          // if (StakeholderFirst.hasOwnProperty("businessType")) {
          //   document.getElementById("businessTypeStakeholder").value = StakeholderFirst.businessType;
          // }
          // if (StakeholderFirst.hasOwnProperty("entityType")) {
          //   document.getElementById("businessEntityTypeStakeholder").value = StakeholderFirst.entityType;
          // }
          // if (StakeholderFirst.hasOwnProperty("registeredCountry")) {
          //   document.getElementById("registeredCountryStakeholder").value = StakeholderFirst.registeredCountry;
          // }

          // document.getElementById("div7").style.width = "56%";

          // Business Partner Address Details - to be added when proper response is available
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerAddress1")) {
          //   document.getElementById("addressLine1BusinessPartner").value = StakeholderFirst.stakeholderPartnerAddress1;
          // }
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerAddress2")) {
          //   document.getElementById("addressLine2BusinessPartner").value = StakeholderFirst.stakeholderPartnerAddress2;
          // }
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerCity")) {
          //   document.getElementById("cityBusinessPartner").value = StakeholderFirst.stakeholderPartnerCity;
          // }
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerState")) {
          //   document.getElementById("stateBusinessPartner").value = StakeholderFirst.stakeholderPartnerState;
          // }
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerPostcode")) {
          //   document.getElementById("postcodeBusinessPartner").value = StakeholderFirst.stakeholderPartnerPostcode;
          // }
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerCountry")) {
          //   document.getElementById("countryBusinessPartner").value = StakeholderFirst.stakeholderPartnerCountry;
          // }

          // document.getElementById("div7").style.width = "60%";
        }
      } else {
        toast.error("No results found");
        return [];
      }
    } catch (error) {
      console.log("Error fetching stakeholder details: " + error.message);
      return [];
    }
  } else {
    toast.error("Business Registration Number not found");
    return [];
  }
};

export const NextStakeholderDetails = async (brn, pageNumber) => {
  if (brn != "") {
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getBusinessDetails", {
        params: {
          region: "SG",
          businessRegistrationNumber: brn,
        },
      });

      let obj = response.data;
      if (obj) {
        var BusinessDetails = obj.businessDetails;
        if (BusinessDetails) {
          var stakeholders = BusinessDetails.stakeholders;
          var StakeholderFirst = stakeholders[pageNumber];
          if (StakeholderFirst.hasOwnProperty("stakeholderDetails")) {
            var data = StakeholderFirst.stakeholderDetails;
            if (data.hasOwnProperty("firstName")) {
              document.getElementById("firstNameStakeholder").value = data.firstName;
            }

            if (data.hasOwnProperty("middleName")) {
              document.getElementById("middleNameStakeholder").value = data.middleName;
            }

            if (data.hasOwnProperty("lastName")) {
              document.getElementById("lastNameStakeholder").value = data.lastName;
            }

            if (data.hasOwnProperty("nationality")) {
              document.getElementById("nationalityStakeholder").value = data.nationality;
            }

            if (data.hasOwnProperty("dateOfBirth")) {
              document.getElementById("dateOfBirthStakeholder").value = data.dateOfBirth;
            }
            document.getElementById("div7").style.width = "43%";

            // Continue checking and setting values for other fields...

            // Contact Details
            if (data.hasOwnProperty("contactDetails")) {
              var ContactDetails = data.contactDetails;
              if (ContactDetails.hasOwnProperty("contactNumber")) {
                document.getElementById("contactNoStakeholder").value = ContactDetails.contactNumber;
              }

              if (ContactDetails.hasOwnProperty("email")) {
                document.getElementById("emailStakeholder").value = ContactDetails.emailStakeholder;
              }
              document.getElementById("div7").style.width = "46%";
            }

            // Professional Details
            if (data.hasOwnProperty("professionalDetails")) {
              var ProfessionalDetails = data.professionalDetails[0];

              if (ProfessionalDetails.hasOwnProperty("position")) {
                document.getElementById("positionStakeholder").value = ProfessionalDetails.position;
              }

              if (ProfessionalDetails.hasOwnProperty("sharePercentage")) {
                document.getElementById("sharePercentageStakeholder").value = ProfessionalDetails.sharePercentage;
              }
              document.getElementById("div7").style.width = "49%";
            }

            // Stakeholder Address Details
            if (data.hasOwnProperty("address")) {
              var StakeholderAddress = data.address;
              if (StakeholderAddress.hasOwnProperty("addressLine1")) {
                document.getElementById("addressLine1Stakeholder").value = StakeholderAddress.addressLine1;
              }

              if (StakeholderAddress.hasOwnProperty("addressLine2")) {
                document.getElementById("addressLine2Stakeholder").value = StakeholderAddress.addressLine2;
              }

              if (StakeholderAddress.hasOwnProperty("city")) {
                document.getElementById("cityStakeholder").value = StakeholderAddress.city;
              }

              if (StakeholderAddress.hasOwnProperty("state")) {
                document.getElementById("stateStakeholder").value = StakeholderAddress.state;
              }

              if (StakeholderAddress.hasOwnProperty("postcode")) {
                document.getElementById("postcodeStakeholder").value = StakeholderAddress.postcode;
              }

              if (StakeholderAddress.hasOwnProperty("country")) {
                document.getElementById("countryStakeholder").value = StakeholderAddress.country;
              }
              document.getElementById("div7").style.width = "53%";
            }
          }
          // Business Partner Details
          if (StakeholderFirst.hasOwnProperty("businessPartner")) {
            document.getElementById("businessNameStakeholder").value = StakeholderFirst.businessPartner;
          }
          if (StakeholderFirst.hasOwnProperty("businessRegistrationNumber")) {
            document.getElementById("businessRegistrationNumberStakeholder").value =
              StakeholderFirst.businessRegistrationNumber;
          }
          if (StakeholderFirst.hasOwnProperty("businessType")) {
            document.getElementById("businessTypeStakeholder").value = StakeholderFirst.businessType;
          }
          if (StakeholderFirst.hasOwnProperty("entityType")) {
            document.getElementById("businessEntityTypeStakeholder").value = StakeholderFirst.entityType;
          }
          if (StakeholderFirst.hasOwnProperty("registeredCountry")) {
            document.getElementById("registeredCountryStakeholder").value = StakeholderFirst.registeredCountry;
          }

          document.getElementById("div7").style.width = "56%";

          // Business Partner Address Details - to be added when proper response is available
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerAddress1")) {
          //   document.getElementById("addressLine1BusinessPartner").value = StakeholderFirst.stakeholderPartnerAddress1;
          // }
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerAddress2")) {
          //   document.getElementById("addressLine2BusinessPartner").value = StakeholderFirst.stakeholderPartnerAddress2;
          // }
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerCity")) {
          //   document.getElementById("cityBusinessPartner").value = StakeholderFirst.stakeholderPartnerCity;
          // }
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerState")) {
          //   document.getElementById("stateBusinessPartner").value = StakeholderFirst.stakeholderPartnerState;
          // }
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerPostcode")) {
          //   document.getElementById("postcodeBusinessPartner").value = StakeholderFirst.stakeholderPartnerPostcode;
          // }
          // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerCountry")) {
          //   document.getElementById("countryBusinessPartner").value = StakeholderFirst.stakeholderPartnerCountry;
          // }

          // document.getElementById("div7").style.width = "60%";
        }
      } else {
        toast.error("No results found");
      }
    } catch (error) {
      console.log("Error fetching stakeholder details: " + error.message);
    }
  } else {
    toast.error("Business Registration Number not found");
  }
};

//POST calls

export const PostStakeholderAddressDetails = async () => {
  //Stakeholder Details
  let businessPartnerRequire = document.getElementById("businessPartnerRequire").value;
  var brn = sessionStorage.getItem("businessRegistrationNumber") || sessionStorage.getItem("internalBusinessId");
  var firstNameStakeholder = document.getElementById("firstNameStakeholder").value;
  var middleNameStakeholder = document.getElementById("middleNameStakeholder").value;
  var lastNameStakeholder = document.getElementById("lastNameStakeholder").value;
  var nationalityStakeholder = document.getElementById("nationalityStakeholder").value;
  var dateOfBirthStakeholder = document.getElementById("dateOfBirthStakeholder").value;
  var kycModeStakeholder = document.getElementById("kycModeStakeholder").value;
  var isResidentStakeholder = document.getElementById("isResidentStakeholder").value;
  var verifyModeStakeholder = document.getElementById("verifyModeStakeholder").value;

  //Contact Details
  var contactNoStakeholder = document.getElementById("contactNoStakeholder").value;
  var emailStakeholder = document.getElementById("emailStakeholder").value;

  //Professional Details
  var positionStakeholder = document.getElementById("positionStakeholder").value;
  var sharePercentageStakeholder = document.getElementById("sharePercentageStakeholder").value;

  //Stakeholder Address Details
  var addressLine1Stakeholder = document.getElementById("addressLine1Stakeholder").value;
  var addressLine2Stakeholder = document.getElementById("addressLine2Stakeholder").value;
  var cityStakeholder = document.getElementById("cityStakeholder").value;
  var stateStakeholder = document.getElementById("stateStakeholder").value;
  var postcodeStakeholder = document.getElementById("postcodeStakeholder").value;
  var countryStakeholder = document.getElementById("countryStakeholder").value;

  //Business Partner Details
  var businessNameStakeholder = document.getElementById("businessNameStakeholder").value;
  var businessRegistrationNumberStakeholder = document.getElementById("businessRegistrationNumberStakeholder").value;
  var businessTypeStakeholder = document.getElementById("businessTypeStakeholder").value;
  var businessEntityTypeStakeholder = document.getElementById("businessEntityTypeStakeholder").value;
  var registeredCountryStakeholder = document.getElementById("registeredCountryStakeholder").value;

  //Business Partner Address Details
  var addressLine1BusinessPartner = document.getElementById("addressLine1BusinessPartner").value;
  var addressLine2BusinessPartner = document.getElementById("addressLine2BusinessPartner").value;
  var cityBusinessPartner = document.getElementById("cityBusinessPartner").value;
  var stateBusinessPartner = document.getElementById("stateBusinessPartner").value;
  var postcodeBusinessPartner = document.getElementById("postcodeBusinessPartner").value;
  var countryBusinessPartner = document.getElementById("countryBusinessPartner").value;

  var businessDetailsPost = sessionStorage.getItem("BusinessDetailsPost");
  let businessDetails = JSON.parse(businessDetailsPost);
  let businessKybMode = businessDetails.businessKybMode;

  if (firstNameStakeholder == "") {
    toast.warn("firstNameStakeholder must not be empty");
  } else if (lastNameStakeholder == "") {
    toast.warn("lastNameStakeholder must not be empty");
  } else if (nationalityStakeholder == "") {
    toast.warn("nationalityStakeholder must not be empty");
  } else if (kycModeStakeholder == "") {
    toast.warn("kycModeStakeholder must not be empty");
  } else if (emailStakeholder == "") {
    toast.warn("Email must not be empty");
  } else if (positionStakeholder == "") {
    toast.warn("Stakeholder Position must not be empty");
  } else if (addressLine1Stakeholder == "") {
    toast.warn("Address Line 1 must not be empty");
  } else if (postcodeStakeholder == "") {
    toast.warn("Postcode must not be empty");
  } else if (countryStakeholder == "") {
    toast.warn("Country must not be empty");
  } else if (dateOfBirthStakeholder == "") {
    toast.warn("Date of Birth must not be empty");
  } else {
    try {
      if (isResidentStakeholder == "NO" && verifyModeStakeholder == "NO") {
        kycModeStakeholder = "MANUAL_KYC";
      }

      sessionStorage.setItem("stakeholderKycMode", kycModeStakeholder);

      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/PostBusinessPartnerAddressDetails",
        {
          params: {
            businessRegistrationNumber: brn,
            email: sessionStorage.getItem("lastemail"),
            firstNameStakeholder: firstNameStakeholder,
            middleNameStakeholder: middleNameStakeholder,
            lastNameStakeholder: lastNameStakeholder,
            nationalityStakeholder: nationalityStakeholder,
            dateOfBirthStakeholder: dateOfBirthStakeholder,
            kycModeStakeholder: kycModeStakeholder,
            isResidentStakeholder: isResidentStakeholder,

            //Contact Details
            contactNoStakeholder: contactNoStakeholder,
            emailStakeholder: emailStakeholder,

            //Professional Details
            positionStakeholder: positionStakeholder,
            sharePercentageStakeholder: sharePercentageStakeholder,

            //Stakeholder Address Details
            addressLine1Stakeholder: addressLine1Stakeholder,
            addressLine2Stakeholder: addressLine2Stakeholder,
            cityStakeholder: cityStakeholder,
            stateStakeholder: stateStakeholder,
            postcodeStakeholder: postcodeStakeholder,
            countryStakeholder: countryStakeholder,

            //Business Partner
            businessNameStakeholder: businessNameStakeholder,
            businessRegistrationNumberStakeholder: businessRegistrationNumberStakeholder,
            businessTypeStakeholder: businessTypeStakeholder,
            businessEntityTypeStakeholder: businessEntityTypeStakeholder,
            registeredCountryStakeholder: registeredCountryStakeholder,

            //Business Partner Address
            addressLine1BusinessPartner: addressLine1BusinessPartner,
            addressLine2BusinessPartner: addressLine2BusinessPartner,
            cityBusinessPartner: cityBusinessPartner,
            stateBusinessPartner: stateBusinessPartner,
            postcodeBusinessPartner: postcodeBusinessPartner,
            countryBusinessPartner: countryBusinessPartner,

            businessPartnerRequire: businessPartnerRequire,
            businessKybMode: businessKybMode,
          },
        }
      );

      let obj = response.data;
      if (obj.status == "SUCCESS") {
        try {
          const response2 = await Axios.get(
            sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetStakeholderDetails",
            {
              params: {
                businessRegistrationNumber: brn,
              },
            }
          );

          let obj2 = response2.data;
          sessionStorage.setItem("stakeholderDetailsPost", JSON.stringify(obj2));
          toast.success("Stakeholder Address Details Submitted");
          document.getElementById("submitStakeholderDetails").style.display = "none";
          document.getElementById("updateStakeholderDetails").style.display = "";
          sessionStorage.setItem("lastScreenCompleted", 3);
          sessionStorage.setItem("userStatus", "N");

          //Setting SlNo after POST
          let obj = JSON.parse(sessionStorage.getItem("stakeholderDetailsPost"));
          if (businessPartnerRequire === "yes") {
            let businessName = document.getElementById("businessNameStakeholder")?.value;
            let slNo = document.getElementById("slNo");
            for (var i = 0; i < obj.length; i++) {
              if (businessName === obj[i].stakeholderBusinessName) {
                slNo.value = obj[i].slNo;
              }
            }
          } else {
            let stakeholderEmail = document.getElementById("emailStakeholder")?.value;
            let slNo = document.getElementById("slNo");
            for (var i = 0; i < obj.length; i++) {
              if (stakeholderEmail === obj[i].stakeholderEmail) {
                slNo.value = obj[i].slNo;
              }
            }
          }
        } catch (error) {
          toast.success("Stakeholder Address Details Submitted");
          document.getElementById("submitStakeholderDetails").style.display = "none";
          document.getElementById("updateStakeholderDetails").style.display = "";
        }
      } else {
        toast.error("Submission failed: " + obj.message);
        document.getElementById("submitStakeholderDetails").style.display = "";
        document.getElementById("updateStakeholderDetails").style.display = "none";
      }
    } catch (error) {
      console.log("Something went wrong: " + error);
      document.getElementById("submitStakeholderDetails").style.display = "";
      document.getElementById("updateStakeholderDetails").style.display = "none";
    }
  }
};

export const PostBusinessPartnerAddressDetails = async () => {
  //Stakeholder Details
  let businessPartnerRequire = document.getElementById("businessPartnerRequire").value;

  var brn = sessionStorage.getItem("businessRegistrationNumber") || sessionStorage.getItem("internalBusinessId");
  var firstNameStakeholder = document.getElementById("firstNameStakeholder").value;
  var middleNameStakeholder = document.getElementById("middleNameStakeholder").value;
  var lastNameStakeholder = document.getElementById("lastNameStakeholder").value;
  var nationalityStakeholder = document.getElementById("nationalityStakeholder").value;
  var dateOfBirthStakeholder = document.getElementById("dateOfBirthStakeholder").value;
  var kycModeStakeholder = document.getElementById("kycModeStakeholder").value;
  var isResidentStakeholder = document.getElementById("isResidentStakeholder").value;

  //Contact Details
  var contactNoStakeholder = document.getElementById("contactNoStakeholder").value;
  var emailStakeholder = document.getElementById("emailStakeholder").value;

  //Professional Details
  var positionStakeholder = document.getElementById("positionStakeholder").value;
  var sharePercentageStakeholder = document.getElementById("sharePercentageStakeholder").value;

  //Stakeholder Address Details
  var addressLine1Stakeholder = document.getElementById("addressLine1Stakeholder").value;
  var addressLine2Stakeholder = document.getElementById("addressLine2Stakeholder").value;
  var cityStakeholder = document.getElementById("cityStakeholder").value;
  var stateStakeholder = document.getElementById("stateStakeholder").value;
  var postcodeStakeholder = document.getElementById("postcodeStakeholder").value;
  var countryStakeholder = document.getElementById("countryStakeholder").value;

  //Business Partner Details
  var businessNameStakeholder = document.getElementById("businessNameStakeholder").value;
  var businessRegistrationNumberStakeholder = document.getElementById("businessRegistrationNumberStakeholder").value;
  var businessTypeStakeholder = document.getElementById("businessTypeStakeholder").value;
  var businessEntityTypeStakeholder = document.getElementById("businessEntityTypeStakeholder").value;
  var registeredCountryStakeholder = document.getElementById("registeredCountryStakeholder").value;

  //Business Partner Address Details
  var addressLine1BusinessPartner = document.getElementById("addressLine1BusinessPartner").value;
  var addressLine2BusinessPartner = document.getElementById("addressLine2BusinessPartner").value;
  var cityBusinessPartner = document.getElementById("cityBusinessPartner").value;
  var stateBusinessPartner = document.getElementById("stateBusinessPartner").value;
  var postcodeBusinessPartner = document.getElementById("postcodeBusinessPartner").value;
  var countryBusinessPartner = document.getElementById("countryBusinessPartner").value;

  var businessDetailsPost = sessionStorage.getItem("BusinessDetailsPost");
  let businessDetails = JSON.parse(businessDetailsPost);
  let businessKybMode = businessDetails.businessKybMode;

  // if (firstNameStakeholder == "") {
  //   toast.warn("firstNameStakeholder must not be empty");
  // } else if (lastNameStakeholder == "") {
  //   toast.warn("lastNameStakeholder must not be empty");
  // } else if (nationalityStakeholder == "") {
  //   toast.warn("nationalityStakeholder must not be empty");
  // } else if (kycModeStakeholder == "") {
  //   toast.warn("kycModeStakeholder must not be empty");
  // } else if (emailStakeholder == "") {
  //   toast.warn("Email must not be empty");
  // } else if (positionStakeholder == "") {
  //   toast.warn("Stakeholder Position must not be empty");
  // } else if (dateOfBirthStakeholder == "") {
  //   toast.warn("Date of Birth must not be empty");
  // }
  // else if (addressLine1Stakeholder == "") {
  //   toast.warn("Address Line 1 must not be empty");
  // } else if (postcodeStakeholder == "") {
  //   toast.warn("Postcode must not be empty");
  // } else if (countryStakeholder == "") {
  //   toast.warn("Country must not be empty");
  // } else

  if (businessNameStakeholder == "") {
    toast.warn("businessNameStakeholder must not be empty");
  } else if (businessRegistrationNumberStakeholder == "") {
    toast.warn("businessRegistrationNumberStakeholder must not be empty");
  } else if (businessEntityTypeStakeholder == "") {
    toast.warn("businessEntityTypeStakeholder must not be empty");
  } else if (registeredCountryStakeholder == "") {
    toast.warn("registeredCountryStakeholder must not be empty");
  } else if (addressLine1BusinessPartner == "") {
    toast.warn("addressLine1BusinessPartner must not be empty");
  } else if (postcodeBusinessPartner == "") {
    toast.warn("postcodeBusinessPartner must not be empty");
  } else if (countryBusinessPartner == "") {
    toast.warn("countryBusinessPartner must not be empty");
  } else {
    try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/PostBusinessPartnerAddressDetails",
        {
          params: {
            businessRegistrationNumber: brn,
            email: sessionStorage.getItem("lastemail"),
            firstNameStakeholder: firstNameStakeholder,
            middleNameStakeholder: middleNameStakeholder,
            lastNameStakeholder: lastNameStakeholder,
            nationalityStakeholder: nationalityStakeholder,
            dateOfBirthStakeholder: dateOfBirthStakeholder,
            kycModeStakeholder: kycModeStakeholder,
            isResidentStakeholder: isResidentStakeholder,

            //Contact Details
            contactNoStakeholder: contactNoStakeholder,
            emailStakeholder: emailStakeholder,

            //Professional Details
            positionStakeholder: positionStakeholder,
            sharePercentageStakeholder: sharePercentageStakeholder,

            //Stakeholder Address Details
            addressLine1Stakeholder: addressLine1Stakeholder,
            addressLine2Stakeholder: addressLine2Stakeholder,
            cityStakeholder: cityStakeholder,
            stateStakeholder: stateStakeholder,
            postcodeStakeholder: postcodeStakeholder,
            countryStakeholder: countryStakeholder,

            //Business Partner
            businessNameStakeholder: businessNameStakeholder,
            businessRegistrationNumberStakeholder: businessRegistrationNumberStakeholder,
            businessTypeStakeholder: businessTypeStakeholder,
            businessEntityTypeStakeholder: businessEntityTypeStakeholder,
            registeredCountryStakeholder: registeredCountryStakeholder,

            //Business Partner Address
            addressLine1BusinessPartner: addressLine1BusinessPartner,
            addressLine2BusinessPartner: addressLine2BusinessPartner,
            cityBusinessPartner: cityBusinessPartner,
            stateBusinessPartner: stateBusinessPartner,
            postcodeBusinessPartner: postcodeBusinessPartner,
            countryBusinessPartner: countryBusinessPartner,
            businessPartnerRequire: businessPartnerRequire,

            businessKybMode: businessKybMode,
          },
        }
      );

      let obj = response.data;
      if (obj.status == "SUCCESS") {
        try {
          const response2 = await Axios.get(
            sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetStakeholderDetails",
            {
              params: {
                businessRegistrationNumber: brn,
              },
            }
          );

          let obj2 = response2.data;
          sessionStorage.setItem("stakeholderDetailsPost", JSON.stringify(obj2));
          toast.success("Business Partner Details Submitted");
          document.getElementById("submitStakeholderDetails").style.display = "none";
          document.getElementById("updateStakeholderDetails").style.display = "";
          document.getElementById("div7").style.width = "60%";
          sessionStorage.setItem("lastScreenCompleted", 3);
          sessionStorage.setItem("userStatus", "N");

          //Setting SlNo after POST
          let obj = JSON.parse(sessionStorage.getItem("stakeholderDetailsPost"));
          if (businessPartnerRequire === "yes") {
            let businessName = document.getElementById("businessNameStakeholder")?.value;
            let slNo = document.getElementById("slNo");
            for (var i = 0; i < obj.length; i++) {
              if (businessName === obj[i].stakeholderBusinessName) {
                slNo.value = obj[i].slNo;
              }
            }
          } else {
            let stakeholderEmail = document.getElementById("emailStakeholder")?.value;
            let slNo = document.getElementById("slNo");
            for (var i = 0; i < obj.length; i++) {
              if (stakeholderEmail === obj[i].stakeholderEmail) {
                slNo.value = obj[i].slNo;
              }
            }
          }
        } catch (error) {
          toast.success("Business Partner Details Submitted");
          document.getElementById("submitStakeholderDetails").style.display = "none";
          document.getElementById("updateStakeholderDetails").style.display = "";
          document.getElementById("div7").style.width = "60%";
          sessionStorage.setItem("lastScreenCompleted", 3);
          sessionStorage.setItem("userStatus", "N");
        }
      } else {
        toast.error("Submission failed: " + obj.message);
        document.getElementById("submitStakeholderDetails").style.display = "";
        document.getElementById("updateStakeholderDetails").style.display = "none";
        document.getElementById("div7").style.width = "50%";
      }
    } catch (error) {
      console.log("Something went wrong: " + error);
      document.getElementById("submitStakeholderDetails").style.display = "";
      document.getElementById("updateStakeholderDetails").style.display = "none";
      document.getElementById("div7").style.width = "50%";
    }
  }
};

//PATCH calls
export const PatchStakeholderAddressDetails = async () => {
  //Stakeholder Details
  let businessPartnerRequire = document.getElementById("businessPartnerRequire").value;

  var brn = sessionStorage.getItem("businessRegistrationNumber") || sessionStorage.getItem("internalBusinessId");
  var firstNameStakeholder = document.getElementById("firstNameStakeholder").value;
  var middleNameStakeholder = document.getElementById("middleNameStakeholder").value;
  var lastNameStakeholder = document.getElementById("lastNameStakeholder").value;
  var nationalityStakeholder = document.getElementById("nationalityStakeholder").value;
  var dateOfBirthStakeholder = document.getElementById("dateOfBirthStakeholder").value;
  var kycModeStakeholder = document.getElementById("kycModeStakeholder").value;
  var isResidentStakeholder = document.getElementById("isResidentStakeholder").value;

  //Contact Details
  var contactNoStakeholder = document.getElementById("contactNoStakeholder").value;
  var emailStakeholder = document.getElementById("emailStakeholder").value;

  //Professional Details
  var positionStakeholder = document.getElementById("positionStakeholder").value;
  var sharePercentageStakeholder = document.getElementById("sharePercentageStakeholder").value;

  //Stakeholder Address Details
  var addressLine1Stakeholder = document.getElementById("addressLine1Stakeholder").value;
  var addressLine2Stakeholder = document.getElementById("addressLine2Stakeholder").value;
  var cityStakeholder = document.getElementById("cityStakeholder").value;
  var stateStakeholder = document.getElementById("stateStakeholder").value;
  var postcodeStakeholder = document.getElementById("postcodeStakeholder").value;
  var countryStakeholder = document.getElementById("countryStakeholder").value;

  //Business Partner Details
  var businessNameStakeholder = document.getElementById("businessNameStakeholder").value;
  var businessRegistrationNumberStakeholder = document.getElementById("businessRegistrationNumberStakeholder").value;
  var businessTypeStakeholder = document.getElementById("businessTypeStakeholder").value;
  var businessEntityTypeStakeholder = document.getElementById("businessEntityTypeStakeholder").value;
  var registeredCountryStakeholder = document.getElementById("registeredCountryStakeholder").value;

  //Business Partner Address Details
  var addressLine1BusinessPartner = document.getElementById("addressLine1BusinessPartner").value;
  var addressLine2BusinessPartner = document.getElementById("addressLine2BusinessPartner").value;
  var cityBusinessPartner = document.getElementById("cityBusinessPartner").value;
  var stateBusinessPartner = document.getElementById("stateBusinessPartner").value;
  var postcodeBusinessPartner = document.getElementById("postcodeBusinessPartner").value;
  var countryBusinessPartner = document.getElementById("countryBusinessPartner").value;

  var businessDetailsPost = sessionStorage.getItem("BusinessDetailsPost");
  let businessDetails = JSON.parse(businessDetailsPost);
  let businessKybMode = businessDetails.businessKybMode;

  let slNo = document.getElementById("slNo").value;

  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/PatchBusinessPartnerAddressDetails",
      {
        params: {
          businessRegistrationNumber: brn,
          email: sessionStorage.getItem("lastemail"),

          //Stakeholder KYC Details
          firstNameStakeholder: firstNameStakeholder,
          middleNameStakeholder: middleNameStakeholder,
          lastNameStakeholder: lastNameStakeholder,
          nationalityStakeholder: nationalityStakeholder,
          dateOfBirthStakeholder: dateOfBirthStakeholder,
          kycModeStakeholder: kycModeStakeholder,
          isResidentStakeholder: isResidentStakeholder,

          //Contact Details
          contactNoStakeholder: contactNoStakeholder,
          emailStakeholder: emailStakeholder,

          //Professional Details
          positionStakeholder: positionStakeholder,
          sharePercentageStakeholder: sharePercentageStakeholder,

          //Stakeholder Address Details
          addressLine1Stakeholder: addressLine1Stakeholder,
          addressLine2Stakeholder: addressLine2Stakeholder,
          cityStakeholder: cityStakeholder,
          stateStakeholder: stateStakeholder,
          postcodeStakeholder: postcodeStakeholder,
          countryStakeholder: countryStakeholder,

          //Business Partner
          businessNameStakeholder: businessNameStakeholder,
          businessRegistrationNumberStakeholder: businessRegistrationNumberStakeholder,
          businessTypeStakeholder: businessTypeStakeholder,
          businessEntityTypeStakeholder: businessEntityTypeStakeholder,
          registeredCountryStakeholder: registeredCountryStakeholder,

          //Business Partner Address
          addressLine1BusinessPartner: addressLine1BusinessPartner,
          addressLine2BusinessPartner: addressLine2BusinessPartner,
          cityBusinessPartner: cityBusinessPartner,
          stateBusinessPartner: stateBusinessPartner,
          postcodeBusinessPartner: postcodeBusinessPartner,
          countryBusinessPartner: countryBusinessPartner,
          businessPartnerRequire: businessPartnerRequire,

          businessKybMode: businessKybMode,

          slNo: slNo,
        },
      }
    );

    let obj = response.data;
    if (obj.status == "SUCCESS") {
      try {
        const response2 = await Axios.get(
          sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetStakeholderDetails",
          {
            params: {
              businessRegistrationNumber: brn,
            },
          }
        );

        let obj2 = response2.data;
        sessionStorage.setItem("stakeholderDetailsPost", JSON.stringify(obj2));
        toast.success("Stakeholder Details Updated");
      } catch (error) {
        toast.success("Stakeholder Details Updated");
      }
    } else {
      toast.error("Update failed: " + obj.message);
    }
  } catch (error) {
    toast.error("Something went wrong: " + error);
  }
};

export const PatchBusinessPartnerAddressDetails = async () => {
  //Stakeholder Details
  let businessPartnerRequire = document.getElementById("businessPartnerRequire").value;

  var brn = sessionStorage.getItem("businessRegistrationNumber") || sessionStorage.getItem("internalBusinessId");
  var firstNameStakeholder = document.getElementById("firstNameStakeholder").value;
  var middleNameStakeholder = document.getElementById("middleNameStakeholder").value;
  var lastNameStakeholder = document.getElementById("lastNameStakeholder").value;
  var nationalityStakeholder = document.getElementById("nationalityStakeholder").value;
  var dateOfBirthStakeholder = document.getElementById("dateOfBirthStakeholder").value;
  var kycModeStakeholder = document.getElementById("kycModeStakeholder").value;
  var isResidentStakeholder = document.getElementById("isResidentStakeholder").value;

  //Contact Details
  var contactNoStakeholder = document.getElementById("contactNoStakeholder").value;
  var emailStakeholder = document.getElementById("emailStakeholder").value;

  //Professional Details
  var positionStakeholder = document.getElementById("positionStakeholder").value;
  var sharePercentageStakeholder = document.getElementById("sharePercentageStakeholder").value;

  //Stakeholder Address Details
  var addressLine1Stakeholder = document.getElementById("addressLine1Stakeholder").value;
  var addressLine2Stakeholder = document.getElementById("addressLine2Stakeholder").value;
  var cityStakeholder = document.getElementById("cityStakeholder").value;
  var stateStakeholder = document.getElementById("stateStakeholder").value;
  var postcodeStakeholder = document.getElementById("postcodeStakeholder").value;
  var countryStakeholder = document.getElementById("countryStakeholder").value;

  //Business Partner Details
  var businessNameStakeholder = document.getElementById("businessNameStakeholder").value;
  var businessRegistrationNumberStakeholder = document.getElementById("businessRegistrationNumberStakeholder").value;
  var businessTypeStakeholder = document.getElementById("businessTypeStakeholder").value;
  var businessEntityTypeStakeholder = document.getElementById("businessEntityTypeStakeholder").value;
  var registeredCountryStakeholder = document.getElementById("registeredCountryStakeholder").value;

  //Business Partner Address Details
  var addressLine1BusinessPartner = document.getElementById("addressLine1BusinessPartner").value;
  var addressLine2BusinessPartner = document.getElementById("addressLine2BusinessPartner").value;
  var cityBusinessPartner = document.getElementById("cityBusinessPartner").value;
  var stateBusinessPartner = document.getElementById("stateBusinessPartner").value;
  var postcodeBusinessPartner = document.getElementById("postcodeBusinessPartner").value;
  var countryBusinessPartner = document.getElementById("countryBusinessPartner").value;

  var businessDetailsPost = sessionStorage.getItem("BusinessDetailsPost");
  let businessDetails = JSON.parse(businessDetailsPost);
  let businessKybMode = businessDetails.businessKybMode;

  let slNo = document.getElementById("slNo").value;

  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/PatchBusinessPartnerAddressDetails",
      {
        params: {
          businessRegistrationNumber: brn,
          email: sessionStorage.getItem("lastemail"),
          firstNameStakeholder: firstNameStakeholder,
          middleNameStakeholder: middleNameStakeholder,
          lastNameStakeholder: lastNameStakeholder,
          nationalityStakeholder: nationalityStakeholder,
          dateOfBirthStakeholder: dateOfBirthStakeholder,
          kycModeStakeholder: kycModeStakeholder,
          isResidentStakeholder: isResidentStakeholder,

          //Contact Details
          contactNoStakeholder: contactNoStakeholder,
          emailStakeholder: emailStakeholder,

          //Professional Details
          positionStakeholder: positionStakeholder,
          sharePercentageStakeholder: sharePercentageStakeholder,

          //Stakeholder Address Details
          addressLine1Stakeholder: addressLine1Stakeholder,
          addressLine2Stakeholder: addressLine2Stakeholder,
          cityStakeholder: cityStakeholder,
          stateStakeholder: stateStakeholder,
          postcodeStakeholder: postcodeStakeholder,
          countryStakeholder: countryStakeholder,

          //Business Partner
          businessNameStakeholder: businessNameStakeholder,
          businessRegistrationNumberStakeholder: businessRegistrationNumberStakeholder,
          businessTypeStakeholder: businessTypeStakeholder,
          businessEntityTypeStakeholder: businessEntityTypeStakeholder,
          registeredCountryStakeholder: registeredCountryStakeholder,

          //Business Partner Address
          addressLine1BusinessPartner: addressLine1BusinessPartner,
          addressLine2BusinessPartner: addressLine2BusinessPartner,
          cityBusinessPartner: cityBusinessPartner,
          stateBusinessPartner: stateBusinessPartner,
          postcodeBusinessPartner: postcodeBusinessPartner,
          countryBusinessPartner: countryBusinessPartner,
          businessPartnerRequire: businessPartnerRequire,

          businessKybMode: businessKybMode,
          slNo: slNo,
        },
      }
    );

    let obj = response.data;
    if (obj.status == "SUCCESS") {
      try {
        const response2 = await Axios.get(
          sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetStakeholderDetails",
          {
            params: {
              businessRegistrationNumber: brn,
            },
          }
        );

        let obj2 = response2.data;
        sessionStorage.setItem("stakeholderDetailsPost", JSON.stringify(obj2));
        toast.success("Stakeholder Details Updated");
      } catch (error) {
        toast.success("Stakeholder Details Updated");
      }
    } else {
      toast.error("Update failed: " + obj.message);
    }
  } catch (error) {
    toast.error("Something went wrong: " + error);
  }
};

//GET Calls
//Stakeholder Details
export const GetStakeholderDetails = async (brn) => {
  //For preventing form failures
  let data = sessionStorage.getItem("stakeholderDatasetPost");
  try {
    let obj = null;

    if (!data) {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetStakeholderDetails", {
        params: {
          businessRegistrationNumber: brn,
        },
      });

      obj = response.data;
    } else {
      obj = JSON.parse(data);
      sessionStorage.setItem("stakeholderDatasetPost", JSON.stringify(obj));
    }

    return obj;
  } catch (error) {
    console.error("Something went wrong: " + error);
    return [];
  }
};

export const SetStakeholderDetailsWithPage = async (currentStakeholder) => {
  var StakeholderFirst = currentStakeholder;
  if (StakeholderFirst.hasOwnProperty("stakeholderDetails")) {
    var data = StakeholderFirst.stakeholderDetails;
    if (data.hasOwnProperty("firstName")) {
      if (data.firstName !== "null") {
        document.getElementById("firstNameStakeholder").value = data.firstName;
      }
    }

    if (data.hasOwnProperty("middleName")) {
      if (data.middleName !== "null") {
        document.getElementById("middleNameStakeholder").value = data.middleName;
      }
    }

    if (data.hasOwnProperty("lastName")) {
      if (data.lastName !== "null") {
        document.getElementById("lastNameStakeholder").value = data.lastName;
      }
    }

    if (data.hasOwnProperty("nationality")) {
      if (data.nationality !== "null") {
        document.getElementById("nationalityStakeholder").value = data.nationality;
      }
    }

    if (data.hasOwnProperty("dateOfBirth")) {
      if (data.dateOfBirth !== "null") {
        document.getElementById("dateOfBirthStakeholder").value = data.dateOfBirth;
      }
    }

    // Continue checking and setting values for other fields...

    // Contact Details
    if (data.hasOwnProperty("contactDetails")) {
      var ContactDetails = data.contactDetails;
      if (ContactDetails && ContactDetails != null) {
        if (ContactDetails.hasOwnProperty("contactNumber")) {
          if (ContactDetails.contactNumber !== "null") {
            document.getElementById("contactNoStakeholder").value = ContactDetails.contactNumber;
          }
        }

        if (ContactDetails.hasOwnProperty("email")) {
          if (ContactDetails.email !== "null") {
            document.getElementById("emailStakeholder").value = ContactDetails.emailStakeholder;
          }
        }
      }
    }

    // Professional Details
    if (data.hasOwnProperty("professionalDetails")) {
      var ProfessionalDetails = data.professionalDetails[0];

      if (ProfessionalDetails.hasOwnProperty("position")) {
        if (ProfessionalDetails.position !== "null") {
          document.getElementById("positionStakeholder").value = ProfessionalDetails.position;
        }
      }

      if (ProfessionalDetails.hasOwnProperty("sharePercentage")) {
        if (ProfessionalDetails.sharePercentage !== "null") {
          document.getElementById("sharePercentageStakeholder").value = ProfessionalDetails.sharePercentage;
        }
      }
    }

    // Stakeholder Address Details
    if (data.hasOwnProperty("address")) {
      var StakeholderAddress = data.address;
      if (StakeholderAddress.hasOwnProperty("addressLine1")) {
        if (StakeholderAddress.addressLine1 !== "null") {
          document.getElementById("addressLine1Stakeholder").value = StakeholderAddress.addressLine1;
        }
      }

      if (StakeholderAddress.hasOwnProperty("addressLine2")) {
        if (StakeholderAddress.addressLine2 !== "null") {
          document.getElementById("addressLine2Stakeholder").value = StakeholderAddress.addressLine2;
        }
      }

      if (StakeholderAddress.hasOwnProperty("city")) {
        if (StakeholderAddress.city !== "null") {
          document.getElementById("cityStakeholder").value = StakeholderAddress.city;
        }
      }

      if (StakeholderAddress.hasOwnProperty("state")) {
        if (StakeholderAddress.state !== "null") {
          document.getElementById("stateStakeholder").value = StakeholderAddress.state;
        }
      }

      if (StakeholderAddress.hasOwnProperty("postcode")) {
        if (StakeholderAddress.postcode !== "null") {
          document.getElementById("postcodeStakeholder").value = StakeholderAddress.postcode;
        }
      }

      if (StakeholderAddress.hasOwnProperty("country")) {
        if (StakeholderAddress.country !== "null") {
          document.getElementById("countryStakeholder").value = StakeholderAddress.country;
        }
      }
    }
  }
  // Business Partner Details
  if (StakeholderFirst.hasOwnProperty("businessPartner")) {
    if (StakeholderFirst.businessPartner !== "null") {
      document.getElementById("businessNameStakeholder").value = StakeholderFirst.businessPartner;
    }
  }
  if (StakeholderFirst.hasOwnProperty("businessRegistrationNumber")) {
    if (StakeholderFirst.businessRegistrationNumber !== "null") {
      document.getElementById("businessRegistrationNumberStakeholder").value =
        StakeholderFirst.businessRegistrationNumber;
    }
  }
  if (StakeholderFirst.hasOwnProperty("businessType")) {
    if (StakeholderFirst.businessType !== "null") {
      document.getElementById("businessTypeStakeholder").value = StakeholderFirst.businessType;
    }
  }
  if (StakeholderFirst.hasOwnProperty("entityType")) {
    if (StakeholderFirst.entityType !== "null") {
      document.getElementById("businessEntityTypeStakeholder").value = StakeholderFirst.entityType;
    }
  }
  if (StakeholderFirst.hasOwnProperty("registeredCountry")) {
    if (StakeholderFirst.registeredCountry !== "null") {
      document.getElementById("registeredCountryStakeholder").value = StakeholderFirst.registeredCountry;
    }
  }

  // Business Partner Address Details - to be added when proper response is available
  // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerAddress1")) {
  //   document.getElementById("addressLine1BusinessPartner").value = StakeholderFirst.stakeholderPartnerAddress1;
  // }
  // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerAddress2")) {
  //   document.getElementById("addressLine2BusinessPartner").value = StakeholderFirst.stakeholderPartnerAddress2;
  // }
  // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerCity")) {
  //   document.getElementById("cityBusinessPartner").value = StakeholderFirst.stakeholderPartnerCity;
  // }
  // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerState")) {
  //   document.getElementById("stateBusinessPartner").value = StakeholderFirst.stakeholderPartnerState;
  // }
  // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerPostcode")) {
  //   document.getElementById("postcodeBusinessPartner").value = StakeholderFirst.stakeholderPartnerPostcode;
  // }
  // if (StakeholderFirst.hasOwnProperty("stakeholderPartnerCountry")) {
  //   document.getElementById("countryBusinessPartner").value = StakeholderFirst.stakeholderPartnerCountry;
  // }
};

export const SetStakeholderDetailsWithPage2 = async (currentStakeholder) => {
  var data = currentStakeholder;
  if (data.hasOwnProperty("stakeholderPartner")) {
    if (data.stakeholderPartner == "no") {
      document.getElementById("radio1").click();
    } else {
      document.getElementById("radio2").click();
    }
  }

  // Check if the keys are present and set form field values accordingly
  if (data.hasOwnProperty("stakeholderFirstName")) {
    document.getElementById("firstNameStakeholder").value = data.stakeholderFirstName;
  }

  if (data.hasOwnProperty("stakeholderMiddleName")) {
    document.getElementById("middleNameStakeholder").value = data.stakeholderMiddleName;
  }

  if (data.hasOwnProperty("stakeholderLastName")) {
    document.getElementById("lastNameStakeholder").value = data.stakeholderLastName;
  }

  if (data.hasOwnProperty("stakeholderNationality")) {
    document.getElementById("nationalityStakeholder").value = data.stakeholderNationality;
  }

  if (data.hasOwnProperty("stakeholderDateOfBirth")) {
    document.getElementById("dateOfBirthStakeholder").value = data.stakeholderDateOfBirth;
  }

  if (data.hasOwnProperty("stakeholderResident")) {
    document.getElementById("isResidentStakeholder").value = data.stakeholderResident;
  }

  // Continue checking and setting values for other fields...

  // Contact Details
  if (data.hasOwnProperty("stakeholderContactNumber")) {
    document.getElementById("contactNoStakeholder").value = data.stakeholderContactNumber;
  }

  if (data.hasOwnProperty("stakeholderEmail")) {
    document.getElementById("emailStakeholder").value = data.stakeholderEmail;
    sessionStorage.setItem("stakeholderemail", data.stakeholderEmail);
  }

  // Professional Details
  if (data.hasOwnProperty("stakeholderPosition")) {
    document.getElementById("positionStakeholder").value = data.stakeholderPosition;
  }

  if (data.hasOwnProperty("stakeholderSharePercentage")) {
    document.getElementById("sharePercentageStakeholder").value = Number(data.stakeholderSharePercentage);
  }

  document.getElementById("div7").style.width = "49%";

  // Stakeholder Address Details
  if (data.hasOwnProperty("stakeholderAddress1")) {
    document.getElementById("addressLine1Stakeholder").value = data.stakeholderAddress1;
  }

  if (data.hasOwnProperty("stakeholderAddress2")) {
    document.getElementById("addressLine2Stakeholder").value = data.stakeholderAddress2;
  }

  if (data.hasOwnProperty("stakeholderCity")) {
    document.getElementById("cityStakeholder").value = data.stakeholderCity;
  }

  if (data.hasOwnProperty("stakeholderState")) {
    document.getElementById("stateStakeholder").value = data.stakeholderState;
  }

  if (data.hasOwnProperty("stakeholderPostcode")) {
    document.getElementById("postcodeStakeholder").value = data.stakeholderPostcode;
  }

  if (data.hasOwnProperty("stakeholderCountry")) {
    document.getElementById("countryStakeholder").value = data.stakeholderCountry;
  }

  // Business Partner Details
  if (data.hasOwnProperty("stakeholderBusinessName")) {
    document.getElementById("businessNameStakeholder").value = data.stakeholderBusinessName;
  }
  if (data.hasOwnProperty("stakeholderBusinessRegistrationNumber")) {
    document.getElementById("businessRegistrationNumberStakeholder").value = data.stakeholderBusinessRegistrationNumber;
  }
  if (data.hasOwnProperty("stakeholderBusinessType")) {
    document.getElementById("businessTypeStakeholder").value = data.stakeholderBusinessType;
  }
  if (data.hasOwnProperty("stakeholderBusinessEntityType")) {
    document.getElementById("businessEntityTypeStakeholder").value = data.stakeholderBusinessEntityType;
  }
  if (data.hasOwnProperty("stakeholderRegisteredCountry")) {
    document.getElementById("registeredCountryStakeholder").value = data.stakeholderRegisteredCountry;
  }

  // Business Partner Address Details
  if (data.hasOwnProperty("stakeholderPartnerAddress1")) {
    document.getElementById("addressLine1BusinessPartner").value = data.stakeholderPartnerAddress1;
  }
  if (data.hasOwnProperty("stakeholderPartnerAddress2")) {
    document.getElementById("addressLine2BusinessPartner").value = data.stakeholderPartnerAddress2;
  }
  if (data.hasOwnProperty("stakeholderPartnerCity")) {
    document.getElementById("cityBusinessPartner").value = data.stakeholderPartnerCity;
  }
  if (data.hasOwnProperty("stakeholderPartnerState")) {
    document.getElementById("stateBusinessPartner").value = data.stakeholderPartnerState;
  }
  if (data.hasOwnProperty("stakeholderPartnerPostcode")) {
    document.getElementById("postcodeBusinessPartner").value = data.stakeholderPartnerPostcode;
  }
  if (data.hasOwnProperty("stakeholderPartnerCountry")) {
    document.getElementById("countryBusinessPartner").value = data.stakeholderPartnerCountry;
  }
  if (data.hasOwnProperty("slNo")) {
    document.getElementById("slNo").value = data.slNo;
  }
};
