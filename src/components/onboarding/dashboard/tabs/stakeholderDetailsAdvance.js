import React, { useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import "./css/stakeholder-details.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../@redux/action/onboardingAction.js";
import { ScaleLoader } from "react-spinners";
import * as restrictions from "../tabs/functions/restrictInput.js";
import { setBusinessKybMode } from "../../../../@redux/features/onboardingFeatures.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { preventFutureDates } from "./../../../validation";
import { useNavigate } from "react-router-dom";

export const validations = {
  alpha: (value, name) => {
    const alphaRegex = /^[A-Za-z \-']+$/;
    if (value && !alphaRegex.test(value)) {
      toast.error(
        `${name} must contain only alphabetic characters. Example: "John"`
      );
    }
  },
  numeric: (value, name) => {
    const numericRegex = /^[0-9]+$/;
    if (value && !numericRegex.test(value)) {
      toast.error(
        `${name} must contain only numeric characters. Example: "12345"`
      );
    }
  },
  alphanumeric: (value, name) => {
    const alphanumericRegex = /^[A-Za-z0-9]+$/;
    if (value && !alphanumericRegex.test(value)) {
      toast.error(
        `${name} must contain only alphanumeric characters. Example: "John123"`
      );
    }
  },
  email: (value, name) => {
    const emailRegex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      toast.error(
        `${name} must be a valid email address. Example: "john.doe@example.com"`
      );
    }
  },
  address: (value, name) => {
    const addressRegex = /^[A-Za-z0-9 ,.\-\/'&#@]*$/;
    if (value && !addressRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, numbers, spaces, commas, periods, hyphens, and slashes.`
      );
    }
  },
  city: (value, name) => {
    const cityRegex = /^[a-zA-Z\s\-']+$/;
    if (value && !cityRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, spaces, hyphens, and apostrophes.`
      );
    }
  },
  state: (value, name) => {
    const stateRegex = /^[a-zA-Z\s\-']+$/;
    if (value && !stateRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, spaces, hyphens, and apostrophes.`
      );
    }
  },
  postalCode: (value, name) => {
    const postalCodeRegex = /^[a-zA-Z0-9\s\-]+$/;
    if (value && !postalCodeRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, numbers, spaces, and hyphens.`
      );
    }
  },
};

function stakeholderDetailsAdvance() {
  const list = ["progress", "pending", "approve"];
  const [status, setStatus] = useState(list[0]);
  const [btnLoader, setBtnLoader] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();
  const individualRef = useRef(null);
  const corporateRef = useRef(null);

  const [businessPartner, setBusinessPartner] = useState(null);
  const [businessPartnerRequire, setBusinessPartnerRequire] = useState(null);
  const [region, setRegion] = useState(sessionStorage.getItem("region"));

  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prevState) => !prevState);
  };

  var internalBusinessId = useSelector(
    (state) => state.onboarding?.UserStatusObj?.internalBusinessId
  );
  var lastScreenCompleted = Number(
    useSelector((state) => state.onboarding?.UserStatusObj?.lastScreenCompleted)
  );
  var userStatus = useSelector(
    (state) => state.onboarding?.UserStatusObj?.userStatus
  );
  var businessType = useSelector(
    (state) => state.onboarding?.BusinessCorporationDetails?.businessType
  );
  var stakeholderDetailsObj = useSelector(
    (state) => state.onboarding?.StakeholderDetails
  );

  useEffect(() => {
    console.log("Stakeholer details updated!");
  }, [stakeholderDetailsObj]);

  var businessDetailsNIUMObj = useSelector(
    (state) => state.onboarding?.businessDetailsNIUMObj
  );
  var businessKybMode = useSelector(
    (state) => state.onboarding?.BusinessCorporationDetails?.businessKybMode
  );

  var position = useSelector((state) => state.onboarding?.PositionValues);
  var businessTypeValues = useSelector(
    (state) => state.onboarding?.BusinessTypeValues
  );
  var listCountry = useSelector((state) => state.onboarding?.ListCountry);
  var listNationality = useSelector(
    (state) => state.onboarding?.ListNationality
  );

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalityStakeholder, setNationalityStakeholder] = useState(null);
  const [dobStakeholder, setDobStakeholder] = useState("");
  const [contactNoStakeholder, setContactNoStakeholder] = useState("");
  const [emailStakeholder, setEmailStakeholder] = useState("");
  const [positionStakeholder, setPositionStakeholder] = useState(null);
  const [sharePercentage, setSharePercentage] = useState(0);

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState(null);

  const [businessName, setBusinessName] = useState("");
  const [brnPartner, setBrnPartner] = useState("");
  const [sharePercentagePartner, setSharePercentagePartner] = useState(0);
  const [businessEntityTypePartner, setBusinessEntityTypePartner] =
    useState(null);
  const [registeredCountryPartner, setRegisteredCountryPartner] =
    useState(null);

  const [addressLine1Partner, setAddressLine1Partner] = useState("");
  const [addressLine2Partner, setAddressLine2Partner] = useState("");
  const [cityPartner, setCityPartner] = useState("");
  const [statePartner, setStatePartner] = useState("");
  const [postcodePartner, setPostcodePartner] = useState("");
  const [countryPartner, setCountryPartner] = useState(null);

  const [slNo, setSlno] = useState(null);
  const [isResident, setIsResident] = useState(null);

  const [submitBtnShow, setSubmitBtnShow] = useState(true);

  useEffect(() => {
    const SetPage = async () => {
      if (Number(lastScreenCompleted) >= 3) {
        setTotalPages(stakeholderDetailsObj.length);
      } else {
        if (businessKybMode === "E_KYB") {
          setTotalPages(
            businessDetailsNIUMObj?.businessDetails?.stakeholders.length
          );
        }
      }

      if (Number(lastScreenCompleted) >= 3) {
        if (userStatus && userStatus == "C") {
          setStatus(list[2]);
        } else {
          setStatus(list[1]);
        }
      }

      if (Number(lastScreenCompleted) >= 3) {
        setSubmitBtnShow(false);
      } else if (Number(lastScreenCompleted) < 3) {
        setSubmitBtnShow(true);
      } else {
        setSubmitBtnShow("hide");
      }

      FillStakeholderDetails(0);
    };

    SetPage();
  }, []);

  const FillStakeholderDetails = (index) => {
    let obj;
    if (Number(lastScreenCompleted) >= 3) {
      obj = stakeholderDetailsObj;

      if (obj.status === "BAD_REQUEST") {
        return;
      }

      var data = obj[index];

      if (data.stakeholderPartner && data.stakeholderPartner == "yes") {
        corporateRef.current.click();
      } else {
        individualRef.current.click();
      }

      // Check if the keys are present and set form field values accordingly
      if (data.hasOwnProperty("stakeholderFirstName")) {
        setFirstName(data.stakeholderFirstName);
      }

      if (data.hasOwnProperty("stakeholderMiddleName")) {
        setMiddleName(data.stakeholderMiddleName);
      }

      if (data.hasOwnProperty("stakeholderLastName")) {
        setLastName(data.stakeholderLastName);
      }

      if (data.hasOwnProperty("stakeholderNationality")) {
        setNationalityStakeholder(data.stakeholderNationality);
      }

      if (data.hasOwnProperty("stakeholderDateOfBirth")) {
        setDobStakeholder(dayjs(data.stakeholderDateOfBirth));
      }

      if (data.hasOwnProperty("stakeholderResident")) {
        setIsResident(data.stakeholderResident);
      }

      // Continue checking and setting values for other fields...

      // Contact Details
      if (data.hasOwnProperty("stakeholderContactNumber")) {
        setContactNoStakeholder(data.stakeholderContactNumber);
      }

      if (data.hasOwnProperty("stakeholderEmail")) {
        setEmailStakeholder(data.stakeholderEmail);
      }

      // Professional Details
      if (data.hasOwnProperty("stakeholderPosition")) {
        setPositionStakeholder(data.stakeholderPosition);
      }

      if (data.hasOwnProperty("stakeholderSharePercentage")) {
        handleSharePercentage(Number(data.stakeholderSharePercentage));
      }

      // Stakeholder Address Details
      if (data.hasOwnProperty("stakeholderAddress1")) {
        setAddress1(data.stakeholderAddress1);
      }

      if (data.hasOwnProperty("stakeholderAddress2")) {
        setAddress2(data.stakeholderAddress2);
      }

      if (data.hasOwnProperty("stakeholderCity")) {
        setCity(data.stakeholderCity);
      }

      if (data.hasOwnProperty("stakeholderState")) {
        setState(data.stakeholderState);
      }

      if (data.hasOwnProperty("stakeholderPostcode")) {
        setPostcode(data.stakeholderPostcode);
      }

      if (data.hasOwnProperty("stakeholderCountry")) {
        setCountry(data.stakeholderCountry);
      }

      // Business Partner Details
      if (data.hasOwnProperty("stakeholderBusinessName")) {
        setBusinessName(data.stakeholderBusinessName);
      }
      if (data.hasOwnProperty("stakeholderBusinessRegistrationNumber")) {
        setBrnPartner(data.stakeholderBusinessRegistrationNumber);
      }
      if (data.hasOwnProperty("stakeholderPartnerSharePercentage")) {
        setSharePercentagePartner(
          Number(data.stakeholderPartnerSharePercentage)
        );
      }
      if (data.hasOwnProperty("stakeholderBusinessEntityType")) {
        setBusinessEntityTypePartner(data.stakeholderBusinessEntityType);
      }
      if (data.hasOwnProperty("stakeholderRegisteredCountry")) {
        setRegisteredCountryPartner(data.stakeholderRegisteredCountry);
      }

      // Business Partner Address Details
      if (data.hasOwnProperty("stakeholderPartnerAddress1")) {
        setAddressLine1Partner(data.stakeholderPartnerAddress1);
      }
      if (data.hasOwnProperty("stakeholderPartnerAddress2")) {
        setAddressLine2Partner(data.stakeholderPartnerAddress2);
      }
      if (data.hasOwnProperty("stakeholderPartnerCity")) {
        setCityPartner(data.stakeholderPartnerCity);
      }
      if (data.hasOwnProperty("stakeholderPartnerState")) {
        setStatePartner(data.stakeholderPartnerState);
      }
      if (data.hasOwnProperty("stakeholderPartnerPostcode")) {
        setPostcodePartner(data.stakeholderPartnerPostcode);
      }
      if (data.hasOwnProperty("stakeholderPartnerCountry")) {
        setCountryPartner(data.stakeholderPartnerCountry);
      }
      if (data.hasOwnProperty("slNo")) {
        setSlno(data.slNo);
      }

      if (
        (region === "EU" || region === "US" || region === "UK") &&
        (businessKybMode === "E_KYB" || businessKybMode === "E_KYC")
      ) {
        setIsResident(
          data.stakeholderResident ? data.stakeholderResident : "YES"
        );
      }
    } else {
      obj = businessDetailsNIUMObj?.businessDetails?.stakeholders;

      if (obj) {
        var StakeholderFirst = obj[index];

        if (
          StakeholderFirst.hasOwnProperty("stakeholderDetails") &&
          (!StakeholderFirst.hasOwnProperty("businessPartner") ||
            StakeholderFirst.businessPartner === "null")
        ) {
          individualRef.current.click();
        } else if (
          StakeholderFirst.hasOwnProperty("businessPartner") &&
          StakeholderFirst.businessPartner !== "null" &&
          !StakeholderFirst.hasOwnProperty("stakeholderDetails")
        ) {
          corporateRef.current.click();
        }

        if (StakeholderFirst.hasOwnProperty("stakeholderDetails")) {
          var data = StakeholderFirst.stakeholderDetails;
          if (data.hasOwnProperty("firstName")) {
            if (data.firstName !== "null") {
              setFirstName(data.firstName);
            }
          }

          if (data.hasOwnProperty("middleName")) {
            if (data.middleName !== "null") {
              setMiddleName(data.middleName);
            }
          }

          if (data.hasOwnProperty("lastName")) {
            if (data.lastName !== "null") {
              setLastName(data.lastName);
            }
          }

          if (data.hasOwnProperty("nationality")) {
            if (data.nationality !== "null") {
              setNationalityStakeholder(data.nationality);
            }
          }

          if (data.hasOwnProperty("dateOfBirth")) {
            if (data.dateOfBirth !== "null") {
              setDobStakeholder(dayjs(data.dateOfBirth));
            }
          }

          // Continue checking and setting values for other fields...

          // Contact Details
          if (data.hasOwnProperty("contactDetails")) {
            var ContactDetails = data.contactDetails;
            if (ContactDetails && ContactDetails != null) {
              if (ContactDetails.hasOwnProperty("contactNumber")) {
                if (ContactDetails.contactNumber !== "null") {
                  setContactNoStakeholder(ContactDetails.contactNumber);
                }
              }

              if (ContactDetails.hasOwnProperty("email")) {
                if (ContactDetails.email !== "null") {
                  setEmailStakeholder(ContactDetails.emailStakeholder);
                }
              }
            }
          }

          // Professional Details
          if (data.hasOwnProperty("professionalDetails")) {
            var ProfessionalDetails = data.professionalDetails[0];

            if (ProfessionalDetails.hasOwnProperty("position")) {
              if (ProfessionalDetails.position !== "null") {
                setPositionStakeholder(ProfessionalDetails.position);
              }
            }

            if (ProfessionalDetails.hasOwnProperty("sharePercentage")) {
              if (ProfessionalDetails.sharePercentage !== "null") {
                handleSharePercentage(
                  Number(ProfessionalDetails.sharePercentage)
                );
              }
            }
          }

          // Stakeholder Address Details
          if (data.hasOwnProperty("address")) {
            var StakeholderAddress = data.address;
            if (StakeholderAddress.hasOwnProperty("addressLine1")) {
              if (StakeholderAddress.addressLine1 !== "null") {
                setAddress1(StakeholderAddress.addressLine1);
              }
            }

            if (StakeholderAddress.hasOwnProperty("addressLine2")) {
              if (StakeholderAddress.addressLine2 !== "null") {
                setAddress2(StakeholderAddress.addressLine2);
              }
            }

            if (StakeholderAddress.hasOwnProperty("city")) {
              if (StakeholderAddress.city !== "null") {
                setCity(StakeholderAddress.city);
              }
            }

            if (StakeholderAddress.hasOwnProperty("state")) {
              if (StakeholderAddress.state !== "null") {
                setState(StakeholderAddress.state);
              }
            }

            if (StakeholderAddress.hasOwnProperty("postcode")) {
              if (StakeholderAddress.postcode !== "null") {
                setPostcode(StakeholderAddress.postcode);
              }
            }

            if (StakeholderAddress.hasOwnProperty("country")) {
              if (StakeholderAddress.country !== "null") {
                setCountry(StakeholderAddress.country);
              }
            }
          }
        }

        // Business Partner Details
        // if (StakeholderFirst.hasOwnProperty("businessPartner")) {

        //   if (StakeholderFirst.businessPartner !== "null") {
        //     setBusinessName(StakeholderFirst.businessPartner);
        //   }

        // if (StakeholderFirst.hasOwnProperty("businessRegistrationNumber")) {
        //   if (StakeholderFirst.businessRegistrationNumber !== "null") {
        //     setBrnPartner(StakeholderFirst.businessRegistrationNumber);
        //   }
        // }
        // if (StakeholderFirst.hasOwnProperty("businessType")) {
        //   if (StakeholderFirst.businessType !== "null") {
        //     //setBusinessTypePartner(StakeholderFirst.businessType);
        //   }
        // }
        // if (StakeholderFirst.hasOwnProperty("entityType")) {
        //   if (StakeholderFirst.entityType !== "null") {
        //     setBusinessEntityTypePartner(StakeholderFirst.entityType);
        //   }
        // }
        // if (StakeholderFirst.hasOwnProperty("registeredCountry")) {
        //   if (StakeholderFirst.registeredCountry !== "null") {
        //     setRegisteredCountryPartner(StakeholderFirst.registeredCountry);
        //   }
        // }}

        //Business Partner Address Details - to be added when proper response is available
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
      } else {
        individualRef.current.click();
      }
    }
  };

  const handleSharePercentage = (value) => {
    let inputValue = value;

    // Ensure the input is a number and within the range [0, 100]
    if (/^\d+$/.test(inputValue)) {
      inputValue = Math.min(100, parseInt(inputValue, 10)); // Limit to a maximum of 100
    } else {
      // Handle non-numeric input (you can display an error message here)
      inputValue = "";
    }

    setSharePercentage(inputValue);
  };

  const handleSharePercentagePartner = (value) => {
    let inputValue = value;

    // Ensure the input is a number and within the range [0, 100]
    if (/^\d+$/.test(inputValue)) {
      inputValue = Math.min(100, parseInt(inputValue, 10)); // Limit to a maximum of 100
    } else {
      // Handle non-numeric input (you can display an error message here)
      inputValue = "";
    }

    setSharePercentagePartner(inputValue);
  };

  const resetStates = () => {
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setNationalityStakeholder("");
    setDobStakeholder("");
    setContactNoStakeholder("");
    setEmailStakeholder("");
    setPositionStakeholder("");
    setSharePercentage(0);

    setAddress1("");
    setAddress2("");
    setCity("");
    setState("");
    setPostcode("");
    setCountry("");

    setBusinessName("");
    setBrnPartner("");
    //setBusinessTypePartner("");
    setBusinessEntityTypePartner("");
    setRegisteredCountryPartner("");

    setAddressLine1Partner("");
    setAddressLine2Partner("");
    setCityPartner("");
    setStatePartner("");
    setPostcodePartner("");
    setCountryPartner("");

    setIsResident("");
  };

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = async (pageNumber) => {
    let obj = {};
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      resetStates();
      //FillStakeholderDetails(pageNumber - 1); // Adjust for zero-based array

      if (lastScreenCompleted >= 3) {
        obj = stakeholderDetailsObj;
        if (obj[pageNumber - 1]) {
          FillStakeholderDetails(pageNumber - 1); // Adjust for zero-based array
          if (userStatus && userStatus == "C") {
            setStatus(list[2]);
          } else {
            setStatus(list[1]);
          }
          setSubmitBtnShow(false);
        } else {
          resetStates();
          setStatus(list[0]);
          setSubmitBtnShow(true);
        }
      } else {
        obj = businessDetailsNIUMObj;
        if (obj[pageNumber - 1]) {
          FillStakeholderDetails(pageNumber - 1); // Adjust for zero-based array
        } else {
        }
      }
    }
  };

  const handlePrevClick = async () => {
    let obj = {};
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      resetStates();
      //FillStakeholderDetails(currentPage - 2); // Adjust for zero-based array

      if (lastScreenCompleted >= 3) {
        obj = stakeholderDetailsObj;
        if (obj[currentPage - 2]) {
          FillStakeholderDetails(currentPage - 2); // Adjust for zero-based array
          if (userStatus && userStatus == "C") {
            setStatus(list[2]);
          } else {
            setStatus(list[1]);
          }
          setSubmitBtnShow(false);
        } else {
          resetStates();
          setStatus(list[0]);
          setSubmitBtnShow(true);
        }
      } else {
        obj = businessDetailsNIUMObj;
        if (obj[currentPage - 2]) {
          FillStakeholderDetails(currentPage - 2); // Adjust for zero-based array
        } else {
          resetStates();
        }
      }
    }
  };

  const handleNextClick = async () => {
    let obj = {};

    if (currentPage < totalPages) {
      resetStates();
      setCurrentPage(currentPage + 1);
      if (lastScreenCompleted >= 3) {
        obj = stakeholderDetailsObj;
        if (obj[currentPage]) {
          FillStakeholderDetails(currentPage); // Adjust for zero-based array
          if (userStatus && userStatus == "C") {
            setStatus(list[2]);
          } else {
            setStatus(list[1]);
          }
          setSubmitBtnShow(false);
        } else {
          resetStates();
          setStatus(list[0]);
          setSubmitBtnShow(true);
        }
      } else {
        obj = businessDetailsNIUMObj;
        if (obj[currentPage]) {
          FillStakeholderDetails(currentPage); // Adjust for zero-based array
        } else {
          resetStates();
        }
      }
    }
  };

  const generatePaginationLinks = () => {
    const maxPages = Math.min(totalPages, 10); // Restrict to a maximum of 10 pages
    return Array.from({ length: maxPages }, (_, i) => i + 1).map((i) => (
      <li
        key={i}
        className={`page-number ${currentPage === i ? "active" : ""}`}
      >
        <a href="#!" onClick={() => handlePageClick(i)}>
          {i}
        </a>
      </li>
    ));
  };

  const AddMoreStakeholder = () => {
    if (currentPage === totalPages) {
      resetStates();
      setStatus(list[0]);
      setSubmitBtnShow(true);
      setTotalPages(totalPages + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBusinessPartnerRequirement = (value) => {
    setBusinessPartnerRequire(value);
    var businessPartnerRequire = value;
    if (businessPartnerRequire == "yes") {
      setBusinessPartner("yes");
    } else if (businessPartnerRequire == "no") {
      setBusinessPartner("no");
    } else {
      setBusinessPartner(null);
    }
  };

  const maxDate = dayjs().subtract(18, "years");

  const preventFutureDates = (date) => {
    const currentDate = dayjs();
    const minAllowedDate = currentDate.subtract(18, "years"); // 18 years ago from today

    // Convert the input date to a Day.js object if it's not already
    const selectedDate = dayjs(date);

    if (selectedDate.isAfter(minAllowedDate)) {
      toast.error(
        `The selected date indicates an age below 18 years. Please select a date on or before ${minAllowedDate.format(
          "DD/MM/YYYY"
        )}.`
      );
      setDobStakeholder(""); // Clear the date if it's invalid
    }
  };

  const handleSubmitStakeholder = async () => {
    //Stakeholder Validations
    if (businessPartnerRequire === "no" && firstName == "") {
      toast.warn("Stareholder's First Name must not be empty");
    } else if (businessPartnerRequire === "no" && lastName == "") {
      toast.warn("Stareholder's Last Name must not be empty");
    } else if (
      businessPartnerRequire === "no" &&
      nationalityStakeholder == ""
    ) {
      toast.warn("Stareholder's Nationality must not be empty");
    } else if (businessPartnerRequire === "no" && dobStakeholder == "") {
      toast.warn("Shareholder's Date of Birth must not be empty");
    } else if (businessPartnerRequire === "no" && emailStakeholder == "") {
      toast.warn("Shareholder's Email must not be empty");
    } else if (businessPartnerRequire === "no" && positionStakeholder == "") {
      toast.warn("Stakeholder's Position must not be empty");
    } else if (businessPartnerRequire === "no" && kycModeStakeholder == "") {
      toast.warn("Stareholder's KYB mode must not be empty");
    } else if (
      businessPartnerRequire === "no" &&
      (region === "AU" || region === "US" || region === "UK") &&
      !isResident
    ) {
      toast.warn("Stareholder's Residence mode must not be empty");
    } else if (businessPartnerRequire === "no" && address1 == "") {
      toast.warn("Address Line 1 must not be empty");
    } else if (businessPartnerRequire === "no" && postcode == "") {
      toast.warn("Postcode must not be empty");
    } else if (businessPartnerRequire === "no" && !country) {
      toast.warn("Country must not be empty");
    }

    //Business Partner Validations
    else if (businessPartnerRequire === "yes" && !businessName) {
      toast.warn("Business Partner's Business Name must not be empty");
    } else if (businessPartnerRequire === "yes" && !brnPartner) {
      toast.warn("Business Partner's Registration Number must not be empty");
    } else if (businessPartnerRequire === "yes" && !sharePercentagePartner) {
      toast.warn("Business Partner's Share Percentage must not be 0");
    } else if (businessPartnerRequire === "yes" && !businessEntityTypePartner) {
      toast.warn("Business Partner's Entity Type must not be empty");
    } else if (businessPartnerRequire === "yes" && !registeredCountryPartner) {
      toast.warn("Business Partner's Registered Country must not be empty");
    } else {
      if (contactNoStakeholder && contactNoStakeholder.length < 7) {
        toast.warn("Contact Number cannot be less than 7 digits.");
        return;
      }

      const body = {
        businessRegistrationNumber: internalBusinessId?.trim(),
        email: sessionStorage.getItem("lastemail")?.trim(),
        businessKybMode: businessKybMode,
      };

      if (businessPartnerRequire === "no") {
        body.firstNameStakeholder = firstName?.trim();
        body.middleNameStakeholder = middleName?.trim();
        body.lastNameStakeholder = lastName?.trim();
        body.nationalityStakeholder = nationalityStakeholder;
        body.dateOfBirthStakeholder = dobStakeholder;

        //KYC Details
        if (region === "AU" || region === "US" || region === "UK") {
          body.isResidentStakeholder = isResident;
          if (isResident === "YES") {
            body.kycModeStakeholder = "E_KYC";
          } else {
            body.kycModeStakeholder = "MANUAL_KYC";
          }
        } else {
          body.kycModeStakeholder =
            businessKybMode === "M_KYB" ? "MANUAL_KYC" : "E_KYC";
          body.isResidentStakeholder =
            businessKybMode === "M_KYB" ? "NO" : "YES";
        }

        //Contact Details
        body.contactNoStakeholder = contactNoStakeholder;
        body.emailStakeholder = emailStakeholder?.trim();

        //Professional Details
        body.positionStakeholder = positionStakeholder;
        body.sharePercentageStakeholder = sharePercentage;

        //Stakeholder Address Details
        body.addressLine1Stakeholder = address1?.trim();
        body.addressLine2Stakeholder = address2?.trim();
        body.cityStakeholder = city?.trim();
        body.stateStakeholder = state?.trim();
        body.postcodeStakeholder = postcode?.trim();
        body.countryStakeholder = country?.trim();

        body.businessPartnerRequire = "no";
      } else if (businessPartnerRequire === "yes") {
        //Business Partner
        body.businessNameStakeholder = businessName?.trim();
        body.businessRegistrationNumberStakeholder = brnPartner?.trim();
        body.stakeholderPartnerSharePercentage = sharePercentagePartner;
        body.businessEntityTypeStakeholder = businessEntityTypePartner;
        body.registeredCountryStakeholder = registeredCountryPartner;

        body.businessPartnerRequire = "yes";
      }

      setBtnLoader(true);
      let obj = await dispatch(actions.PostStakeholderDetails(body));
      if (obj.status === "SUCCESS") {
        setSubmitBtnShow(false);
        setBtnLoader(false);
      }
    }
  };
  const handleUpdateStakeholder = async () => {
    //Stakeholder fields validations
    if (businessPartnerRequire === "no" && firstName == "") {
      toast.warn("Stareholder's First Name must not be empty");
    } else if (businessPartnerRequire === "no" && lastName == "") {
      toast.warn("Stareholder's Last Name must not be empty");
    } else if (
      businessPartnerRequire === "no" &&
      nationalityStakeholder == ""
    ) {
      toast.warn("Stareholder's Nationality must not be empty");
    } else if (businessPartnerRequire === "no" && kycModeStakeholder == "") {
      toast.warn("Stareholder's KYB mode must not be empty");
    } else if (businessPartnerRequire === "no" && emailStakeholder == "") {
      toast.warn("Shareholder's Email must not be empty");
    } else if (businessPartnerRequire === "no" && positionStakeholder == "") {
      toast.warn("Stakeholder's Position must not be empty");
    } else if (businessPartnerRequire === "no" && dobStakeholder == "") {
      toast.warn("Shareholder's Date of Birth must not be empty");
    } else if (businessPartnerRequire === "no" && address1 == "") {
      toast.warn("Address Line 1 must not be empty");
    } else if (businessPartnerRequire === "no" && postcode == "") {
      toast.warn("Postcode must not be empty");
    } else if (businessPartnerRequire === "no" && country == "") {
      toast.warn("Country must not be empty");
    }

    //Business Partner fields validations
    else if (businessPartnerRequire === "yes" && businessName == "") {
      toast.warn("Business Partner's Business Name must not be empty");
    } else if (businessPartnerRequire === "yes" && brnPartner == "") {
      toast.warn("Business Partner's Registration Number must not be empty");
    } else if (
      businessPartnerRequire === "yes" &&
      businessEntityTypePartner == ""
    ) {
      toast.warn("Business Partner's Entity Type must not be empty");
    } else if (
      businessPartnerRequire === "yes" &&
      registeredCountryPartner == ""
    ) {
      toast.warn("Business Partner's Registered Country must not be empty");
    } else if (slNo == "") {
      toast.warn("Sl no. not found");
    } else {
      const body = {
        businessRegistrationNumber: internalBusinessId?.trim(),
        email: sessionStorage.getItem("lastemail")?.trim(),
        businessKybMode: businessKybMode,
        slNo: slNo?.trim(),
      };

      if (businessPartnerRequire === "no") {
        body.firstNameStakeholder = firstName?.trim();
        body.middleNameStakeholder = middleName?.trim();
        body.lastNameStakeholder = lastName?.trim();
        body.nationalityStakeholder = nationalityStakeholder;
        body.dateOfBirthStakeholder = dobStakeholder;
        body.kycModeStakeholder =
          businessKybMode === "M_KYB" ? "MANUAL_KYC" : "E_KYC";
        body.isResidentStakeholder = businessKybMode === "M_KYB" ? "NO" : "YES";

        //Contact Details
        body.contactNoStakeholder = contactNoStakeholder;
        body.emailStakeholder = emailStakeholder?.trim();

        //Professional Details
        body.positionStakeholder = positionStakeholder;
        body.sharePercentageStakeholder = sharePercentage;

        //Stakeholder Address Details
        body.addressLine1Stakeholder = address1?.trim();
        body.addressLine2Stakeholder = address2?.trim();
        body.cityStakeholder = city?.trim();
        body.stateStakeholder = state?.trim();
        body.postcodeStakeholder = postcode?.trim();
        body.countryStakeholder = country?.trim();

        body.businessPartnerRequire = "no";
      } else if (businessPartnerRequire === "yes") {
        //Business Partner
        body.businessNameStakeholder = businessName?.trim();
        body.businessRegistrationNumberStakeholder = brnPartner?.trim();
        //body.businessTypeStakeholder = businessTypePartner || null;
        body.businessEntityTypeStakeholder = businessEntityTypePartner;
        body.registeredCountryStakeholder = registeredCountryPartner;
        body.businessPartnerRequire = "yes";
      }

      await dispatch(actions.PatchStakeholderDetails(body, { setBtnLoader }));
    }
  };

  const handleDeleteStakeholder = async () => {
    //Stakeholder fields validations
    if (!slNo) {
      toast.warn("Sl no. not found for the current shareholder.");
    } else {
      const body = {
        businessRegistrationNumber: internalBusinessId?.trim(),
        slNo: slNo?.trim(),
      };

      await dispatch(
        actions.DeleteStakeholderDetails(body, { setBtnLoader, navigate })
      );
    }
  };

  const restrictInput = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, ""); // Remove all non-numeric characters

    if (numericValue.length <= 15) {
      setContactNoStakeholder(numericValue);
    } else {
      setContactNoStakeholder(numericValue.slice(0, 15)); // Ensure the length does not exceed 15
    }
  };

  return (
    <>
      <div id="stakeholderNoDiv" className="center-div">
        Major Shareholder/UBO -
        <span id="stakeholderNo" className="mx-2">
          {currentPage}
        </span>
      </div>

      <>
        <div className="accordion" id="accordionExample2">
          {/* <div style={{ fontSize: "12px", marginLeft: "1.75em" }}>
              {"(Only shareholders/UBOs with a minimum of 25% stake are applicable)**"}
            </div> */}

          <div
            className="accordion-item border-0 w-80 mb-3"
            style={{ padding: "0.75rem 2.25rem" }}
          >
            <div
              className="d-flex align-items-center gap-3"
              style={{ fontSize: "15px" }}
            >
              <label
                className="form-label"
                style={{ textTransform: "uppercase", fontSize: "medium" }}
              >
                Please select the type of shareholder:
              </label>

              <input
                maxLength={255}
                type="hidden"
                id="businessPartnerRequire"
                value={businessPartnerRequire}
              />
              <div className="radio-group">
                <div
                  className={
                    !firstName && !businessName
                      ? ""
                      : !firstName && businessName
                      ? "d-none"
                      : ""
                  }
                >
                  <input
                    maxLength={255}
                    className="radio-input"
                    name="radio-group"
                    id="radio1"
                    type="radio"
                    value="no"
                    onClick={(e) => {
                      handleBusinessPartnerRequirement(e.target.value);
                    }}
                    ref={individualRef}
                  />
                  <label className="radio-label" for="radio1">
                    <span className="radio-inner-circle"></span>
                    INDIVIDUAL
                  </label>
                </div>
                <div
                  className={
                    !firstName && !businessName
                      ? ""
                      : firstName && !businessName
                      ? "d-none"
                      : ""
                  }
                >
                  <input
                    maxLength={255}
                    className="radio-input"
                    name="radio-group"
                    id="radio2"
                    type="radio"
                    value="yes"
                    onClick={(e) => {
                      handleBusinessPartnerRequirement(e.target.value);
                    }}
                    ref={corporateRef}
                  />
                  <label className="radio-label" for="radio2">
                    <span className="radio-inner-circle"></span>
                    CORPORATE
                  </label>
                </div>
              </div>
            </div>
          </div>
          <input maxLength={255} type="hidden" id="slNo" value={slNo} />

          {businessPartner === "no" ? (
            <>
              <div
                className="accordion-item border-0"
                id="stakeholderDetailsDiv"
              >
                <button
                  className="accordion1 border-0"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOneSH"
                  aria-expanded="true"
                  aria-controls="collapseOneSH"
                >
                  <div className={status + " rounded-circle"}>
                    <div className="file-zip-parent">
                      <ReactSVG
                        src="accounts/kybDetails/advance/perDet.svg"
                        beforeInjection={(svg) => {
                          svg.setAttribute("style", "stroke: yellow");
                          const paths = svg.querySelectorAll("path");
                          paths.forEach((path) => {
                            path.setAttribute(
                              "stroke",
                              status === "pending"
                                ? "#E0990C"
                                : status == "progress"
                                ? "#299E58"
                                : "#099cbc"
                            );
                          });
                        }}
                        className="file-zip-icon"
                      />
                      <img
                        className="edit-circle-icon1"
                        alt=""
                        src={"accounts/" + status + ".svg"}
                      />
                    </div>
                  </div>

                  <div className="title4">
                    <div className="add-details-to1">
                      Major Shareholder Details
                      <span className="mx-1" style={{ color: "red" }}>
                        *
                      </span>
                    </div>
                    <div className={"bg-" + status + " text-start"}>
                      {status === "pending"
                        ? "Submitted"
                        : status == "progress"
                        ? "Not Started"
                        : "Approved"}
                    </div>
                  </div>
                  <div className="icon-open2">
                    <div className="chevron-up1">
                      <img className="arrow-icon15" alt="" src="arrow2.svg" />
                    </div>
                  </div>
                </button>
                <div
                  id="collapseOneSH"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingOneSH"
                  data-bs-parent="#accordionExample2"
                >
                  <form className="form">
                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-33 me-2 pb-0">
                        <input
                          maxLength={255}
                          type="text"
                          name="First Name"
                          className="form-input my-0 pb-0"
                          value={firstName}
                          onInput={(e) => {
                            restrictions.restrictInputPersonName(e);
                            setFirstName(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.alpha(e.target.value, e.target.name)
                          }
                        />
                        <label
                          htmlFor="businesstype"
                          className="form-input-label ps-1"
                        >
                          First Name
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                      <div className="input-group w-33 ms-2 pb-0">
                        <input
                          maxLength={255}
                          type="text"
                          name="Middle Name"
                          className="form-input my-0 pb-0"
                          value={middleName}
                          onInput={(e) => {
                            restrictions.restrictInputPersonName(e);
                            setMiddleName(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.alpha(e.target.value, e.target.name)
                          }
                        />
                        <label
                          htmlFor="businesstype"
                          className="form-input-label ps-1"
                        >
                          Middle Name
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                      <div className="input-group w-33 ms-2 pb-0">
                        <input
                          maxLength={255}
                          type="text"
                          id="Last Name"
                          className="form-input my-0 pb-0"
                          value={lastName}
                          onInput={(e) => {
                            restrictions.restrictInputPersonName(e);
                            setLastName(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.alpha(e.target.value, e.target.name)
                          }
                        />
                        <label
                          htmlFor="businesstype"
                          className="form-input-label ps-1"
                        >
                          Last Name
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                    </div>

                    {/* New implementation for isResident and kycMode for stakeholder */}
                    <div className="d-none">
                      <input
                        maxLength={255}
                        type="hidden"
                        id="kycModeStakeholder"
                        value={
                          businessKybMode === "M_KYB" ? "MANUAL_KYC" : "E_KYC"
                        }
                      />
                      <input
                        maxLength={255}
                        type="hidden"
                        id="isResidentStakeholder"
                        value={businessKybMode === "M_KYB" ? "NO" : "YES"}
                      />
                      <input
                        maxLength={255}
                        type="hidden"
                        id="verifyModeStakeholder"
                        value={businessKybMode === "M_KYB" ? "NO" : "YES"}
                      />
                    </div>

                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-50 me-2 pb-0">
                        <select
                          id="nationalityStakeholder"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={nationalityStakeholder}
                          onChange={(e) =>
                            setNationalityStakeholder(e.target.value)
                          }
                        >
                          <option value=""></option>
                          {listNationality.map((item) => {
                            return (
                              <option value={item.ISOcc_2char}>
                                {item.nationality}
                              </option>
                            );
                          })}
                        </select>
                        <label
                          htmlFor="country"
                          className="form-input-label ps-1"
                        >
                          Nationality
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                      <div
                        className="input-group w-50 ms-2 pb-0"
                        onBlur={() => preventFutureDates(dobStakeholder)}
                      >
                        {/* <input
                          maxLength={255}
                          id="dateOfBirthStakeholder"
                          type="date"
                          max={getCurrentDate()}
                          onChange={(e) => {
                            preventFutureDates(e);
                          }}
                          value={dobStakeholder}
                          name="country"
                          className="form-input my-0 pb-0"
                        /> */}

                        <DatePicker
                          views={["year", "month", "day"]}
                          format="DD/MM/YYYY"
                          onChange={(newDate) => {
                            setDobStakeholder(newDate.format("YYYY-MM-DD"));
                          }}
                          className="form-input my-0 pb-0 date-picker"
                          value={dobStakeholder}
                          disableFuture
                          sx={{
                            "& .MuiOutlinedInput-input": {
                              padding: "25px 0 10px 5px",
                            },
                          }}
                          maxDate={maxDate}
                        />
                        <label
                          htmlFor="country"
                          className="form-input-label ps-1"
                        >
                          Date Of Birth
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-50 me-2 pb-0">
                        <input
                          maxLength={255}
                          type="number"
                          name="Contact Number"
                          className="form-input my-0 pb-0"
                          value={contactNoStakeholder}
                          onInput={(e) => restrictInput(e)}
                          onBlur={(e) => {
                            if (e.target.value && e.target.value?.length < 7) {
                              toast.warn(
                                "Contact number cannot be less that 7 digits."
                              );
                              return;
                            } else {
                              validations.numeric(
                                e.target.value,
                                e.target.name
                              );
                            }
                          }}
                          onKeyDown={(e) => {
                            const exceptThisSymbols = ["e", "E", "+", "-", "."];
                            exceptThisSymbols.includes(e.key) &&
                              e.preventDefault();
                          }}
                        />
                        <label
                          htmlFor="businesstype"
                          className="form-input-label ps-1"
                        >
                          Contact Number{" "}
                          <span style={{ fontSize: "12.5px" }}>
                            (with country code)
                          </span>
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                      <div className="input-group w-50 ms-2 pb-0">
                        <input
                          maxLength={40}
                          type="text"
                          name="Email"
                          className="form-input my-0 pb-0"
                          onInput={(e) => {
                            setEmailStakeholder(e.target.value);
                          }}
                          onBlur={(e) => {
                            validations.email(e.target.value, e.target.name);
                          }}
                          value={emailStakeholder}
                        />
                        <label
                          htmlFor="businesstype"
                          className="form-input-label ps-1"
                        >
                          Email
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                    </div>

                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-50 me-2 pb-0">
                        <select
                          id="positionStakeholder"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={positionStakeholder}
                          onChange={(e) =>
                            setPositionStakeholder(e.target.value)
                          }
                        >
                          <option value=""></option>
                          {position.map((item) => {
                            return (
                              <option value={item.code}>
                                {item.description}
                              </option>
                            );
                          })}
                        </select>
                        <label
                          htmlFor="country"
                          className="form-input-label ps-1"
                        >
                          Position
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                      <div className="input-group w-50 ms-2 pb-0">
                        <input
                          maxLength={255}
                          type="number"
                          id="sharePercentageStakeholder"
                          className="form-input my-0 pb-0"
                          value={sharePercentage}
                          onInput={(e) => handleSharePercentage(e.target.value)}
                          onKeyDown={(e) => {
                            const exceptThisSymbols = ["e", "E", "+", "-", "."];
                            exceptThisSymbols.includes(e.key) &&
                              e.preventDefault();
                          }}
                        />
                        <label
                          htmlFor="businesstype"
                          className="form-input-label ps-1"
                        >
                          Share Percentage
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                    </div>

                    <div className="d-flex align-self-stretch">
                      {region === "AU" || region === "US" || region === "UK" ? (
                        <>
                          <div className="input-group w-50 me-2 pb-0">
                            <select
                              id="isResidentStakeholder"
                              name="country"
                              className="form-input my-0 pb-0"
                              value={isResident}
                              onChange={(e) => setIsResident(e.target.value)}
                            >
                              <option value=""></option>
                              <option value="YES">YES</option>

                              <option value="NO">NO</option>
                            </select>
                            <label
                              htmlFor="country"
                              className="form-input-label ps-1"
                            >
                              Are you a resident of{" "}
                              {region === "AU"
                                ? "Australia"
                                : region === "UK"
                                ? "United Kingdom"
                                : region === "US"
                                ? "United States"
                                : ""}
                              ?
                              <span className="mx-1" style={{ color: "red" }}>
                                *
                              </span>
                            </label>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              <div
                className="accordion-item border-0"
                id="stakeholderAddressDiv"
              >
                <button
                  className="accordion1 border-0"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFourSH"
                  aria-expanded="true"
                  aria-controls="collapseFourSH"
                >
                  <div className={status + " rounded-circle"}>
                    <div className="file-zip-parent">
                      <ReactSVG
                        src="accounts/kybDetails/advance/stakeDet.svg"
                        beforeInjection={(svg) => {
                          svg.setAttribute("style", "stroke: yellow");
                          const paths = svg.querySelectorAll("path");
                          paths.forEach((path) => {
                            path.setAttribute(
                              "stroke",
                              status === "pending"
                                ? "#E0990C"
                                : status == "progress"
                                ? "#299E58"
                                : "#099cbc"
                            );
                          });
                        }}
                        className="file-zip-icon"
                      />
                      <img
                        className="edit-circle-icon1"
                        alt=""
                        src={"accounts/" + status + ".svg"}
                      />
                    </div>
                  </div>
                  <div className="title4">
                    <div className="add-details-to1">
                      Major Shareholder Address Details
                      <span
                        className="mx-1"
                        style={{ color: "red" }}
                        id="StakeholderAddressDetailsLabel"
                      >
                        *
                      </span>
                    </div>
                    <div className={"bg-" + status + " text-start"}>
                      {status === "pending"
                        ? "Submitted"
                        : status == "progress"
                        ? "Not Started"
                        : "Approved"}
                    </div>
                  </div>
                  <div className="icon-open2">
                    <div className="chevron-up1">
                      <img className="arrow-icon15" alt="" src="arrow2.svg" />
                    </div>
                  </div>
                </button>
                <div
                  id="collapseFourSH"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFourSH"
                  data-bs-parent="#accordionExample2"
                >
                  <form className="form">
                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-50 me-2 pb-0">
                        <input
                          maxLength={255}
                          type="text"
                          name="Address Line 1"
                          className="form-input my-0 pb-0"
                          value={address1}
                          onInput={(e) => {
                            restrictions.restrictInputAddress(e);
                            setAddress1(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.address(e.target.value, e.target.name)
                          }
                        />
                        <label
                          htmlFor="username"
                          className="form-input-label ps-1"
                        >
                          Address 1
                          <span
                            className="mx-1"
                            style={{ color: "red" }}
                            id="stakeholderAddress1Label"
                          >
                            *
                          </span>
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                      <div className="input-group w-50 ms-2 pb-0">
                        <input
                          maxLength={255}
                          type="text"
                          name="Address Line 2"
                          className="form-input my-0 pb-0"
                          value={address2}
                          onInput={(e) => {
                            restrictions.restrictInputAddress(e);
                            setAddress2(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.address(e.target.value, e.target.name)
                          }
                        />
                        <label
                          htmlFor="businessname"
                          className="form-input-label ps-1"
                        >
                          Address 2
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-50 me-2 pb-0">
                        <input
                          maxLength={255}
                          type="text"
                          name="City"
                          className="form-input my-0 pb-0"
                          value={city}
                          onInput={(e) => {
                            restrictions.restrictInputCity(e);
                            setCity(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.city(e.target.value, e.target.name)
                          }
                        />
                        <label
                          htmlFor="businesstype"
                          className="form-input-label ps-1"
                        >
                          City
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                      <div className="input-group w-50 ms-2 pb-0">
                        <input
                          maxLength={255}
                          type="text"
                          name="State"
                          className="form-input my-0 pb-0"
                          value={state}
                          onInput={(e) => {
                            restrictions.restrictInputCity(e);
                            setState(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.state(e.target.value, e.target.name)
                          }
                        />
                        <label
                          htmlFor="tradename"
                          className="form-input-label ps-1"
                        >
                          State
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                    </div>
                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-50 me-2 pb-0">
                        <input
                          maxLength={255}
                          type="text"
                          name="Postal Code"
                          className="form-input my-0 pb-0"
                          value={postcode}
                          onInput={(e) => {
                            restrictions.restrictInputPostcode(e);
                            setPostcode(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.postalCode(
                              e.target.value,
                              e.target.name
                            )
                          }
                        />
                        <label
                          htmlFor="businesstype"
                          className="form-input-label ps-1"
                        >
                          Postal Code
                          <span
                            className="mx-1"
                            style={{ color: "red" }}
                            id="stakeholderPostcodeLabel"
                          >
                            *
                          </span>
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                      <div className="input-group w-50 ms-2 pb-0">
                        <select
                          id="countryStakeholder"
                          name="Country"
                          className="form-input my-0 pb-0"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          <option value=""></option>
                          {listCountry.map((item) => {
                            return (
                              <option value={item.code}>
                                {item.description}
                              </option>
                            );
                          })}
                        </select>
                        <label
                          htmlFor="country"
                          className="form-input-label ps-1"
                        >
                          Country
                          <span
                            className="mx-1"
                            style={{ color: "red" }}
                            id="stakeholderCountryLabel"
                          >
                            *
                          </span>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </>
          ) : businessPartner === "yes" ? (
            <>
              <div
                className="accordion-item border-0"
                id="businessPartnerDetailsDiv"
              >
                <button
                  className="accordion1 border-0"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFiveSH"
                  aria-expanded="true"
                  aria-controls="collapseFiveSH"
                >
                  <div className={status + " rounded-circle"}>
                    <div className="file-zip-parent">
                      <ReactSVG
                        src="accounts/kybDetails/advance/busPar.svg"
                        beforeInjection={(svg) => {
                          svg.setAttribute("style", "stroke: yellow");
                          const paths = svg.querySelectorAll("path");
                          paths.forEach((path) => {
                            path.setAttribute(
                              "stroke",
                              status === "pending"
                                ? "#E0990C"
                                : status == "progress"
                                ? "#299E58"
                                : "#099cbc"
                            );
                          });
                        }}
                        className="file-zip-icon"
                      />
                      <img
                        className="edit-circle-icon1"
                        alt=""
                        src={"accounts/" + status + ".svg"}
                      />
                    </div>
                  </div>
                  <div className="title4">
                    <div className="add-details-to1">
                      Business Partner
                      <span className="mx-1" style={{ color: "red" }}>
                        *
                      </span>
                    </div>
                    <div className={"bg-" + status + " text-start"}>
                      {status === "pending"
                        ? "Submitted"
                        : status == "progress"
                        ? "Not Started"
                        : "Approved"}
                    </div>
                  </div>
                  <div className="icon-open2">
                    <div className="chevron-up1">
                      <img className="arrow-icon15" alt="" src="arrow2.svg" />
                    </div>
                  </div>
                </button>
                <div
                  id="collapseFiveSH"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingFiveSH"
                  data-bs-parent="#accordionExample2"
                >
                  <form className="form">
                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-50 me-2 pb-0">
                        <input
                          maxLength={255}
                          type="text"
                          name="Business Name"
                          className="form-input my-0 pb-0"
                          value={businessName}
                          onInput={(e) => {
                            restrictions.restrictInputName(e, 40);
                            setBusinessName(e.target.value);
                          }}
                        />
                        <label
                          htmlFor="businesstype"
                          className="form-input-label ps-1"
                        >
                          Business Name
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                      <div className="input-group w-50 ms-2 pb-0">
                        <input
                          maxLength={255}
                          type="text"
                          name="Partner's Business Registration Number"
                          className="form-input my-0 pb-0"
                          value={brnPartner}
                          onInput={(e) => {
                            restrictions.restrictInputBRN(e);
                            setBrnPartner(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.alphanumeric(
                              e.target.value,
                              e.target.name
                            )
                          }
                        />
                        <label
                          htmlFor="businesstype"
                          className="form-input-label ps-1"
                        >
                          Partner's Business Registration Number
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                        <img
                          className="cross-circle-icon1"
                          alt=""
                          src="cross-circle1.svg"
                        />
                      </div>
                    </div>

                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-50 me-2 pb-0">
                        <input
                          maxLength={3}
                          type="number"
                          id="businessPartnerSharePercentage"
                          className="form-input my-0 pb-0"
                          value={sharePercentagePartner}
                          onInput={(e) =>
                            handleSharePercentagePartner(e.target.value)
                          }
                          onKeyDown={(e) => {
                            const exceptThisSymbols = ["e", "E", "+", "-", "."];
                            exceptThisSymbols.includes(e.key) &&
                              e.preventDefault();
                          }}
                        />
                        <label
                          htmlFor="country"
                          className="form-input-label ps-1"
                        >
                          Share Percentage
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                      <div className="input-group w-50 ms-2 pb-0">
                        <select
                          id="businessEntityTypeStakeholder"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={businessEntityTypePartner}
                          onChange={(e) =>
                            setBusinessEntityTypePartner(e.target.value)
                          }
                        >
                          <option value=""></option>
                          {position.map((item) => {
                            return (
                              <option value={item.code}>
                                {item.description}
                              </option>
                            );
                          })}
                        </select>
                        <label
                          htmlFor="country"
                          className="form-input-label ps-1"
                        >
                          Business Entity Type
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                    </div>

                    <div id="legalDetailsDiv" style={{ display: "contents" }}>
                      <span
                        className="header-title"
                        style={{ fontSize: "18px" }}
                      >
                        Legal Details
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </span>
                      <div className="d-flex align-self-stretch">
                        <div className="input-group w-50 me-2 pb-0">
                          <select
                            id="registeredCountryStakeholder"
                            name="country"
                            className="form-input my-0 pb-0"
                            value={registeredCountryPartner}
                            onChange={(e) =>
                              setRegisteredCountryPartner(e.target.value)
                            }
                          >
                            <option value=""></option>
                            {listCountry.map((item) => {
                              return (
                                <option value={item.code}>
                                  {item.description}
                                </option>
                              );
                            })}
                          </select>
                          <label
                            htmlFor="country"
                            className="form-input-label ps-1"
                          >
                            Registered Country
                            <span className="mx-1" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </>

      <div id="accessDivs" className="mt-5 d-flex flex-column gap-5">
        <div
          id="buttons-div"
          style={{ width: "840px", paddingLeft: "50px" }}
          className="d-flex align-items-center justify-content-between"
        >
          <div className="d-flex justify-content-center align-items-center gap-3">
            {!submitBtnShow ? (
              <>
                <button
                  onClick={() => {
                    handleDeleteStakeholder();
                  }}
                  type="button"
                  className={`expandable-button ${
                    expanded ? "expanded" : "collapsed"
                  }`}
                  id={"deleteStakeholderDetails"}
                  onMouseEnter={handleToggle}
                  onMouseLeave={handleToggle}
                >
                  {btnLoader ? (
                    <ScaleLoader height={20} width={5} color={"white"} />
                  ) : (
                    <>
                      <img
                        className="check-double-icon"
                        alt=""
                        src={"/payments/delete.svg"}
                        width={30}
                      />
                      {expanded && <div className="label7">Delete</div>}
                    </>
                  )}
                </button>
              </>
            ) : (
              <></>
            )}

            {Number(lastScreenCompleted) >= 1 &&
              Number(lastScreenCompleted) !== 8 && (
                <>
                  {currentPage === totalPages && (
                    <div
                      id="addMoreStakeholder"
                      className=""
                      style={{ fontSize: "15px" }}
                    >
                      <a href="#!" onClick={AddMoreStakeholder}>
                        + Add more stakeholders
                      </a>
                    </div>
                  )}
                </>
              )}
          </div>

          {submitBtnShow !== "hide" && (
            <button
              onClick={
                submitBtnShow
                  ? handleSubmitStakeholder
                  : handleUpdateStakeholder
              }
              type="button"
              className={submitBtnShow ? "submit-btn" : "update-btn"}
              id={
                submitBtnShow
                  ? "submitStakeholderDetails"
                  : "updateStakeholderDetails"
              }
            >
              {btnLoader ? (
                <ScaleLoader
                  height={20}
                  width={5}
                  color={submitBtnShow ? "white" : "black"}
                />
              ) : (
                <>
                  <img
                    className="check-double-icon"
                    alt=""
                    src={
                      submitBtnShow
                        ? "/onboarding/submit-icon.svg"
                        : "/auth/update-icon.svg"
                    }
                  />
                  <div className="label7">
                    {submitBtnShow ? "Submit" : "update"}
                  </div>
                </>
              )}
            </button>
          )}
        </div>

        <div id="stakeholderIndexDiv" className="center-div">
          <ul className="pagination-block">
            <li>
              <a
                href="#!"
                className="prev cursor-pointer"
                id="prevBtn"
                onClick={handlePrevClick}
                style={{
                  color:
                    currentPage > 1 ? "var(--accent-blue-100)" : "darkgrey",
                }}
              >
                &#8249; Prev
              </a>
            </li>

            {generatePaginationLinks()}
            <li>
              <a
                href="#!"
                className="next cursor-pointer"
                id="nextBtn"
                onClick={handleNextClick}
                style={{
                  color:
                    currentPage < totalPages
                      ? "var(--accent-blue-100)"
                      : "darkgrey",
                }}
              >
                Next &#8250;
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default stakeholderDetailsAdvance;
