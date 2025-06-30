import React, { useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import "./css/stakeholder-details.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../@redux/action/onboardingAction.js";
import * as restrictions from "../tabs/functions/restrictInput.js";
import { setBusinessKybMode } from "../../../../@redux/features/onboardingFeatures.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { preventFutureDates } from "./../../../validation";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Modal,
  MenuItem,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ClipLoader } from "react-spinners";

import CustomInput from "./../../../structure/NewStructures/CustomInput";
import CustomSelect from "./../../../structure/NewStructures/CustomSelect";
import CustomDatepicker from "./../../../structure/NewStructures/CustomDatePicker";
import { blueGrey } from "@mui/material/colors";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 800,
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
  maxHeight: 600,
  overflowY: "scroll",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blueGrey[700],
    color: theme.palette.common.white,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    width: 40,
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
  const [dobStakeholder, setDobStakeholder] = useState(null);
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

  const [rows, setRows] = useState([]);
  const [activeRow, setActiveRow] = useState({});

  useEffect(() => {
    const SetPage = async () => {
      if (Number(lastScreenCompleted) >= 3) {
        setRows(stakeholderDetailsObj);
        setTotalPages(stakeholderDetailsObj.length);
      } else {
        if (businessKybMode === "E_KYB") {
          setRows(businessDetailsNIUMObj?.businessDetails?.stakeholders);

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

      //FillStakeholderDetails(0);
    };

    SetPage();
  }, [stakeholderDetailsObj]);

  const FillStakeholderDetails = ({ row }) => {
    let obj = row;
    if (Number(lastScreenCompleted) >= 3) {
      //obj = stakeholderDetailsObj;

      if (obj.status === "BAD_REQUEST") {
        return;
      }

      var data = row;

      // Check if the keys are present and set form field values accordingly
      if (data.hasOwnProperty("stakeholderPartner")) {
        setBusinessPartner(data.stakeholderPartner);
      }

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
        setDobStakeholder(data.stakeholderDateOfBirth);
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
      var StakeholderFirst = obj;

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

        // if (data.hasOwnProperty("nationality")) {
        //   if (data.nationality !== "null") {
        //     setNationalityStakeholder(data.nationality);
        //   }
        // }

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

          // if (ProfessionalDetails.hasOwnProperty("position")) {
          //   if (ProfessionalDetails.position !== "null") {
          //     setPositionStakeholder(ProfessionalDetails.position);
          //   }
          // }

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

          // if (StakeholderAddress.hasOwnProperty("country")) {
          //   if (StakeholderAddress.country !== "null") {
          //     setCountry(StakeholderAddress.country);
          //   }
          // }
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
    } else if (
      businessPartnerRequire === "no" &&
      region === "CA" &&
      (!sharePercentage || Number(sharePercentage) <= 0)
    ) {
      toast.warn("Stakeholder's Share-percentage must be greater than 0");
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
    } else if (
      businessPartnerRequire === "no" &&
      (region === "EU" || region === "CA" || region === "HK") &&
      city == ""
    ) {
      toast.warn("City must not be empty");
    } else if (
      businessPartnerRequire === "no" &&
      (region === "EU" || region === "CA" || region === "HK") &&
      state == ""
    ) {
      toast.warn("State must not be empty");
    } else if (businessPartnerRequire === "no" && postcode == "") {
      toast.warn("Postcode must not be empty");
    } else if (
      (businessPartnerRequire === "no" && postcode.length < 3) ||
      postcode.length > 10
    ) {
      toast.warn("Postcode must be between 3 to 10 characters in length");
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
        body.nationalityStakeholder = nationalityStakeholder?.value;
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
        body.positionStakeholder = positionStakeholder?.value;
        body.sharePercentageStakeholder = sharePercentage;

        //Stakeholder Address Details
        body.addressLine1Stakeholder = address1?.trim();
        body.addressLine2Stakeholder = address2?.trim();
        body.cityStakeholder = city?.trim();
        body.stateStakeholder = state?.trim();
        body.postcodeStakeholder = postcode?.trim();
        body.countryStakeholder = country?.value;

        body.businessPartnerRequire = "no";
      } else if (businessPartnerRequire === "yes") {
        //Business Partner
        body.businessNameStakeholder = businessName?.trim();
        body.businessRegistrationNumberStakeholder = brnPartner?.trim();
        body.stakeholderPartnerSharePercentage = sharePercentagePartner;
        body.businessEntityTypeStakeholder = businessEntityTypePartner?.value;
        body.registeredCountryStakeholder = registeredCountryPartner?.value;

        body.businessPartnerRequire = "yes";
      }

      setBtnLoader(true);
      await dispatch(
        actions.PostStakeholderDetails({
          body,
          setSubmitBtnShow,
          setBtnLoader,
          navigate,
        })
      );
      // if (obj.status === "SUCCESS") {
      //   setSubmitBtnShow(false);
      //   setBtnLoader(false);
      // }
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
    } else if (
      businessPartnerRequire === "no" &&
      region === "CA" &&
      (!sharePercentage || Number(sharePercentage) <= 0)
    ) {
      toast.warn("Stakeholder's Share-percentage must be greater than 0");
    } else if (businessPartnerRequire === "no" && dobStakeholder == "") {
      toast.warn("Shareholder's Date of Birth must not be empty");
    } else if (businessPartnerRequire === "no" && address1 == "") {
      toast.warn("Address Line 1 must not be empty");
    } else if (
      businessPartnerRequire === "no" &&
      (region === "EU" || region === "CA" || region === "HK") &&
      city == ""
    ) {
      toast.warn("City must not be empty");
    } else if (
      businessPartnerRequire === "no" &&
      (region === "EU" || region === "CA" || region === "HK") &&
      state == ""
    ) {
      toast.warn("State must not be empty");
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
      sharePercentagePartner <= 0
    ) {
      toast.warn(
        "Business Partner's SharePercentage must not be equal to or less than 0"
      );
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
        body.nationalityStakeholder = nationalityStakeholder?.value;
        console.log("Update Stakeholder: ", dobStakeholder);
        body.dateOfBirthStakeholder = dobStakeholder;
        body.kycModeStakeholder =
          businessKybMode === "M_KYB" ? "MANUAL_KYC" : "E_KYC";
        body.isResidentStakeholder = businessKybMode === "M_KYB" ? "NO" : "YES";

        //Contact Details
        body.contactNoStakeholder = contactNoStakeholder;
        body.emailStakeholder = emailStakeholder?.trim();

        //Professional Details
        body.positionStakeholder = positionStakeholder?.value;
        body.sharePercentageStakeholder = sharePercentage;

        //Stakeholder Address Details
        body.addressLine1Stakeholder = address1?.trim();
        body.addressLine2Stakeholder = address2?.trim();
        body.cityStakeholder = city?.trim();
        body.stateStakeholder = state?.trim();
        body.postcodeStakeholder = postcode?.trim();
        body.countryStakeholder = country?.value;

        body.businessPartnerRequire = "no";
      } else if (businessPartnerRequire === "yes") {
        //Business Partner
        body.businessNameStakeholder = businessName?.trim();
        body.businessRegistrationNumberStakeholder = brnPartner?.trim();
        body.stakeholderPartnerSharePercentage = sharePercentagePartner || 0;
        body.businessEntityTypeStakeholder = businessEntityTypePartner?.value;
        body.registeredCountryStakeholder = registeredCountryPartner?.value;
        body.businessPartnerRequire = "yes";
      }

      await dispatch(
        actions.PatchStakeholderDetails(body, { setBtnLoader, navigate })
      );
    }
  };

  const handleDeleteStakeholder = async (index) => {
    //Stakeholder fields validations
    if (!index) {
      toast.warn("Sl no. not found for the current shareholder.");
    } else {
      const body = {
        businessRegistrationNumber: internalBusinessId?.trim(),
        slNo: index?.trim(),
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const HoverButton = () => {
    return (
      <button
        className="expandable-button bg-dark mx-auto my-3"
        onClick={() => {
          setViewType("new");
          setSubmitBtnShow(true);
          handleBusinessPartnerRequirement("no");
          setActiveRow({});
          resetStates();
          handleOpen();
        }}
      >
        <img src={"/icons/add-white.svg"} alt="Icon" className="icon" />
        <span className="text text-uppercase fw-500">Add new stakeholder</span>
      </button>
    );
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

  const [viewType, setViewType] = useState("new");

  return (
    <>
      <h3 className="w-100 text-center my-3">
        Major Shareholder/Business Partner Details
      </h3>
      <p
        style={{
          fontSize: "14px",
          color: "red",
          fontWeight: 500,
          width: "100%",
          textAlign: "center",
        }}
      >
        (Note: Ensure the provided list of Shareholders and Business Partners is
        reviewed and updated for accuracy before proceeding with the next
        steps.)**
      </p>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell
                style={{
                  textAlign: "start",
                  width: "20rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                Shareholder/Business Partner Name
              </StyledTableCell>
              <StyledTableCell
                align="right"
                style={{ fontWeight: 500, textTransform: "uppercase" }}
              >
                Shareholder Type
              </StyledTableCell>
              <StyledTableCell
                align="right"
                style={{ fontWeight: 500, textTransform: "uppercase" }}
              >
                View/Edit
              </StyledTableCell>
              <StyledTableCell
                align="right"
                style={{ fontWeight: 500, textTransform: "uppercase" }}
              >
                Delete
              </StyledTableCell>
            </TableRow>
          </TableHead>
          {Number(lastScreenCompleted) >= 3 ? (
            <TableBody>
              {rows.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    style={{
                      textAlign: "start",
                      width: "20rem",
                      fontWeight: 500,
                    }}
                  >
                    {row.stakeholderPartner === "no"
                      ? `${row.stakeholderFirstName}  ${
                          row?.stakeholderMiddleName || ""
                        } ${row.stakeholderLastName}`
                      : `${row.stakeholderBusinessName}`}
                  </StyledTableCell>
                  <StyledTableCell align="right" style={{ fontWeight: 500 }}>
                    {row.stakeholderPartner === "no"
                      ? `INDIVIDUAL`
                      : `CORPORATE`}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      className="d-flex align-items-center justify-content-center gap-3 mx-auto py-2 px-4"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        resetStates();
                        setBusinessPartnerRequire(row?.stakeholderPartner);
                        setSubmitBtnShow(false);
                        setActiveRow(row);
                        setViewType("view");
                        FillStakeholderDetails({ row });
                        handleOpen();
                      }}
                    >
                      <img src="/auth/eye-white.svg" alt="" width={25} />
                      View
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      className="d-flex align-items-center justify-content-center gap-2 mx-auto py-2 px-3"
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteStakeholder(row?.slNo)}
                      style={{ width: "8rem" }}
                      disabled={lastScreenCompleted < 8 ? false : true}
                    >
                      {btnLoader ? (
                        <>
                          <ClipLoader color={`#fff`} size={25} />
                        </>
                      ) : (
                        <>
                          <img src="/payments/delete.svg" alt="" width={25} />
                          Delete
                        </>
                      )}
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}

              {lastScreenCompleted < 8 ? (
                <StyledTableRow key={`addNewStakeholder`}>
                  <StyledTableCell
                    colSpan={4}
                    className="text-uppercase fw-500"
                  >
                    <HoverButton />
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                <></>
              )}
            </TableBody>
          ) : (
            <TableBody>
              {rows.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    style={{
                      textAlign: "start",
                      width: "20rem",
                      fontWeight: 500,
                    }}
                  >
                    {row.entityType === "INDIVIDUAL"
                      ? `${row?.stakeholderDetails?.firstName}  ${
                          row?.stakeholderDetails?.middleName || ""
                        } ${row?.stakeholderDetails?.lastName}`
                      : `${row?.businessName || "Business Name Not Found"}`}
                  </StyledTableCell>
                  <StyledTableCell align="right" style={{ fontWeight: 500 }}>
                    {row.entityType === "INDIVIDUAL"
                      ? `INDIVIDUAL`
                      : `CORPORATE`}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      className="d-flex align-items-center justify-content-center gap-2 mx-auto py-2 px-4"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        resetStates();
                        setBusinessPartnerRequire(
                          row?.entityType === "INDIVIDUAL" ? "no" : "yes"
                        );
                        setBusinessPartner(
                          row?.entityType === "INDIVIDUAL" ? "no" : "yes"
                        );
                        setSubmitBtnShow(true);
                        setActiveRow(
                          row?.entityType === "INDIVIDUAL"
                            ? row.stakeholderDetails
                            : row.businessPartner
                        );
                        setViewType("view");
                        FillStakeholderDetails({ row });
                        handleOpen();
                      }}
                    >
                      <img src="/onboarding/edit-icon2.svg" alt="" width={25} />
                      Update
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      className="d-flex align-items-center justify-content-center gap-2 mx-auto py-2 px-3"
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteStakeholder(row?.slNo)}
                      style={{ width: "8rem" }}
                      disabled
                    >
                      {btnLoader ? (
                        <>
                          <ClipLoader color={`#fff`} size={25} />
                        </>
                      ) : (
                        <>
                          <img src="/payments/delete.svg" alt="" width={25} />
                          Delete
                        </>
                      )}
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}

              <StyledTableRow key={`addNewStakeholder`}>
                <StyledTableCell colSpan={4} className="text-uppercase fw-500">
                  <HoverButton />
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <div>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <>
              <>
                {viewType === "new" ? (
                  <>
                    <div className="accordion-item border-0 w-80 mb-3">
                      <div
                        className="d-flex align-items-center gap-3"
                        style={{ fontSize: "15px" }}
                      >
                        <label
                          className="form-label"
                          style={{
                            textTransform: "uppercase",
                            fontSize: "medium",
                          }}
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
                                handleBusinessPartnerRequirement(
                                  e.target.value
                                );
                              }}
                              ref={individualRef}
                              defaultChecked
                            />
                            <label className="radio-label" htmlFor="radio1">
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
                                handleBusinessPartnerRequirement(
                                  e.target.value
                                );
                              }}
                              ref={corporateRef}
                            />
                            <label className="radio-label" htmlFor="radio2">
                              <span className="radio-inner-circle"></span>
                              CORPORATE
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <input
                  maxLength={255}
                  type="hidden"
                  id="slNo"
                  value={slNo ? slNo : ""}
                />

                {businessPartner === "no" ? (
                  <>
                    <form className="form">
                      <h5>Major Shareholder Details</h5>

                      <hr />
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <CustomInput
                          maxLength={255}
                          label="First Name"
                          name="First Name"
                          value={firstName}
                          onInput={(e) => {
                            restrictions.restrictInputPersonName(e);
                            setFirstName(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.alpha(e.target.value, e.target.name)
                          }
                          className="custom-input-class full-width"
                          required
                        />

                        <CustomInput
                          maxLength={255}
                          type="text"
                          name="Middle Name"
                          label="Middle Name"
                          className="custom-input-class full-width"
                          value={middleName}
                          onInput={(e) => {
                            restrictions.restrictInputPersonName(e);
                            setMiddleName(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.alpha(e.target.value, e.target.name)
                          }
                        />

                        <CustomInput
                          maxLength={255}
                          type="text"
                          name="Last Name"
                          label="Last Name"
                          className="custom-input-class full-width"
                          value={lastName}
                          onInput={(e) => {
                            restrictions.restrictInputPersonName(e);
                            setLastName(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.alpha(e.target.value, e.target.name)
                          }
                          required
                        />
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

                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <CustomSelect
                          id="nationalityStakeholder"
                          label="Nationality"
                          className="custom-select-class full-width"
                          value={nationalityStakeholder}
                          onChange={setNationalityStakeholder}
                          options={listNationality?.map((item) => ({
                            value: item.ISOcc_2char,
                            label: item.nationality,
                          }))}
                          required
                        />

                        <CustomDatepicker
                          selectedDate={dobStakeholder}
                          onDateChange={setDobStakeholder}
                          label="Date Of Birth"
                          helperText={``}
                          required
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <CustomInput
                          maxLength={255}
                          type="text"
                          name="Contact Number"
                          label="Contact Number (with country code)"
                          className="custom-input-class full-width"
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

                        <CustomInput
                          maxLength={40}
                          type="text"
                          name="Email"
                          label="Shareholder Email"
                          className="custom-input-class full-width"
                          onInput={(e) => {
                            setEmailStakeholder(e.target.value);
                          }}
                          onBlur={(e) => {
                            validations.email(e.target.value, e.target.name);
                          }}
                          value={emailStakeholder}
                          required
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <CustomSelect
                          id="positionStakeholder"
                          label="Stakeholder Position"
                          className="custom-select-class full-width"
                          value={positionStakeholder}
                          onChange={setPositionStakeholder}
                          options={position?.map((item) => ({
                            value: item.code,
                            label: item.description,
                          }))}
                          required
                        />

                        <CustomInput
                          maxLength={3}
                          type="number"
                          id="sharePercentageStakeholder"
                          className="custom-input-class full-width"
                          value={sharePercentage}
                          onInput={(e) => handleSharePercentage(e.target.value)}
                          onKeyDown={(e) => {
                            const exceptThisSymbols = ["e", "E", "+", "-", "."];
                            exceptThisSymbols.includes(e.key) &&
                              e.preventDefault();
                          }}
                          label="Stakeholder Share-percentage"
                          required={region === "CA"}
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-between gap-3">
                        {region === "AU" ||
                        region === "US" ||
                        region === "UK" ? (
                          <>
                            <div className="input-group w-50 me-2 pb-0">
                              <CustomSelect
                                id="isResidentStakeholder"
                                name="country"
                                value={isResident}
                                onChange={setIsResident}
                                options={[
                                  { label: "NO", value: "NO" },
                                  { label: "YES", value: "YES" },
                                ]}
                                required
                                className={`custom-select-class fullWidth`}
                                label={`Are you a resident of
                                ${
                                  region === "AU"
                                    ? "Australia"
                                    : region === "UK"
                                    ? "United Kingdom"
                                    : region === "US"
                                    ? "United States"
                                    : ""
                                }
                                ?`}
                              />
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </form>

                    <hr />

                    <form className="form">
                      <h5>Major Shareholder Address Details</h5>
                      <hr />
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <CustomInput
                          maxLength={255}
                          type="text"
                          name="Address Line 1"
                          label="Address Line 1"
                          className="custom-input-class full-width"
                          value={address1}
                          onInput={(e) => {
                            restrictions.restrictInputAddress(e);
                            setAddress1(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.address(e.target.value, e.target.name)
                          }
                          required
                        />
                        <CustomInput
                          maxLength={255}
                          type="text"
                          name="Address Line 2"
                          label="Address Line 2"
                          className="custom-input-class full-width"
                          value={address2}
                          onInput={(e) => {
                            restrictions.restrictInputAddress(e);
                            setAddress2(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.address(e.target.value, e.target.name)
                          }
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <CustomInput
                          maxLength={255}
                          type="text"
                          name="City"
                          label="City"
                          className="custom-input-class full-width"
                          value={city}
                          onInput={(e) => {
                            restrictions.restrictInputCity(e);
                            setCity(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.city(e.target.value, e.target.name)
                          }
                          required={
                            region === "EU" ||
                            region === "CA" ||
                            region === "HK"
                          }
                        />

                        <CustomInput
                          maxLength={255}
                          type="text"
                          name="State"
                          label="State"
                          className="custom-input-class full-width"
                          value={state}
                          onInput={(e) => {
                            restrictions.restrictInputCity(e);
                            setState(e.target.value);
                          }}
                          onBlur={(e) =>
                            validations.state(e.target.value, e.target.name)
                          }
                          required={
                            region === "EU" ||
                            region === "CA" ||
                            region === "HK"
                          }
                        />
                      </div>
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <CustomInput
                          maxLength={255}
                          type="text"
                          name="Postal Code"
                          label="Postal Code"
                          className="custom-input-class full-width"
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
                          required
                        />

                        <CustomSelect
                          id="countryStakeholder"
                          label="Country"
                          className="custom-select-class full-width"
                          value={country}
                          onChange={setCountry}
                          required
                          options={listCountry?.map((item) => ({
                            label: item.description,
                            value: item.code,
                          }))}
                        />
                      </div>
                    </form>
                  </>
                ) : businessPartner === "yes" ? (
                  <>
                    <form className="form">
                      <h5>Business Partner Details</h5>

                      <hr />
                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <CustomInput
                          maxLength={255}
                          type="text"
                          name="Business Name"
                          label="Business Name"
                          className="custom-input-class full-width"
                          value={businessName}
                          onInput={(e) => {
                            restrictions.restrictInputName(e, 40);
                            setBusinessName(e.target.value);
                          }}
                          required
                        />

                        <CustomInput
                          maxLength={255}
                          type="text"
                          name="Partner's Business Registration Number"
                          label="Partner's Business Registration Number"
                          className="custom-input-class full-width"
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
                          required
                        />
                      </div>

                      <div className="d-flex align-items-center justify-content-between gap-3">
                        <CustomInput
                          maxLength={3}
                          type="number"
                          id="businessPartnerSharePercentage"
                          label="Share Percentage"
                          className="custom-input-class full-width"
                          value={sharePercentagePartner}
                          onInput={(e) =>
                            handleSharePercentagePartner(e.target.value)
                          }
                          onKeyDown={(e) => {
                            const exceptThisSymbols = ["e", "E", "+", "-", "."];
                            exceptThisSymbols.includes(e.key) &&
                              e.preventDefault();
                          }}
                          required
                        />
                        <CustomSelect
                          id="businessEntityTypeStakeholder"
                          label="Business Entity Type"
                          className="custom-select-class full-width"
                          value={businessEntityTypePartner}
                          onChange={setBusinessEntityTypePartner}
                          options={position?.map((item) => ({
                            label: item.description,
                            value: item.code,
                          }))}
                          required
                        />
                      </div>

                      <hr />

                      <div id="legalDetailsDiv">
                        <h5>Legal Details</h5>
                        <hr />

                        <div className="d-flex align-items-center justify-content-between gap-3">
                          <CustomSelect
                            id="registeredCountryStakeholder"
                            label="Registered Country"
                            className="custom-select-class w-50"
                            value={registeredCountryPartner}
                            onChange={setRegisteredCountryPartner}
                            options={listCountry?.map((item) => ({
                              label: item.description,
                              value: item.code,
                            }))}
                            required={true}
                          />
                        </div>
                      </div>
                    </form>
                  </>
                ) : (
                  <></>
                )}
              </>

              <div
                id="accessDivs"
                className={`mt-5 d-flex flex-column gap-5 ${
                  lastScreenCompleted < 8 || userStatus !== "C" ? "" : "d-none"
                }`}
              >
                <div
                  id="buttons-div"
                  style={{ width: "100%", paddingLeft: "50px" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex justify-content-center align-items-center gap-3"></div>

                  {submitBtnShow !== "hide" && (
                    <Button
                      variant="contained"
                      onClick={
                        submitBtnShow
                          ? handleSubmitStakeholder
                          : handleUpdateStakeholder
                      }
                      type="button"
                      className={`rounded-pill ${
                        submitBtnShow ? "submit-btn" : "update-btn"
                      }`}
                      id={
                        submitBtnShow
                          ? "submitStakeholderDetails"
                          : "updateStakeholderDetails"
                      }
                    >
                      {btnLoader ? (
                        <ClipLoader size={25} color={`#fff`} />
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
                            width={25}
                          />
                          <div className="label7">
                            {submitBtnShow ? "Submit" : "update"}
                          </div>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </>
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default stakeholderDetailsAdvance;
