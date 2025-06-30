import React, { useEffect, useRef, useState } from "react";
import { ReactSVG } from "react-svg";
import ContentLoader from "react-content-loader";
import * as functions from "./functions/applicant-details-function.js";
import Alert from "./modals/Alert.js";
import AlertMKYC from "./modals/AlertMKYC.js";
import { useDispatch, useSelector } from "react-redux";
import "./css/applicant-details.css";
import { toast } from "react-toastify";
import * as actions from "../../../../@redux/action/onboardingAction.js";
import { ScaleLoader } from "react-spinners";
import * as restrictions from "../tabs/functions/restrictInput.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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

function ApplicantDetails() {
  const list = ["progress", "pending", "approve"];
  const [status, setStatus] = useState(list[0]);
  const [btnLoader, setBtnLoader] = useState(false);
  const dispatch = useDispatch();

  const [region, setRegion] = useState(sessionStorage.getItem("region"));

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isResident, setIsResident] = useState(null);
  const [verifyMode, setVerifyMode] = useState(null);
  const [nationality, setNationality] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [birthCountry, setBirthCountry] = useState(null);

  const [position, setPosition] = useState(null);
  const [sharePercentage, setSharePercentage] = useState(0);

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState(null);

  const [email, setEmail] = useState("");
  const [countryCode, setCountryCodeValues] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [occupation, setOccupation] = useState(null);
  const [applicantDeclaration, setApplicantDeclaration] = useState(false);

  var listNationality = useSelector(
    (state) => state.onboarding?.ListNationality
  );
  var listCountryCode = useSelector(
    (state) => state.onboarding?.ListCountryCode
  );
  var listCountry = useSelector((state) => state.onboarding?.ListCountry);
  var listPosition = useSelector((state) => state.onboarding?.PositionValues);
  var listOccupation = useSelector(
    (state) => state.onboarding?.OccupationValues
  );

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
  var applicantBusinessDetailsObj = useSelector(
    (state) => state.onboarding?.ApplicantBusinessDetails
  );
  var businessDetailsNIUMObj = useSelector(
    (state) => state.onboarding?.businessDetailsNIUMObj
  );
  var businessKybMode = useSelector(
    (state) => state.onboarding?.BusinessCorporationDetails?.businessKybMode
  );

  let searchId;
  if (lastScreenCompleted >= 2) {
    searchId = useSelector(
      (state) =>
        state.onboarding?.AdditionalBusinessCorporationDetails?.searchId
    );
  } else {
    searchId = useSelector(
      (state) =>
        state.onboarding?.businessDetailsNIUMObj?.businessDetails
          ?.additionalInfo?.searchId
    );
  }

  var UserCognitoDetails = useSelector(
    (state) => state.onboarding?.UserCognitoDetails
  );

  useEffect(() => {
    const SetPage = async () => {
      if (Number(lastScreenCompleted) >= 4) {
        if (userStatus && userStatus == "C") {
          setStatus(list[2]);
        } else {
          setStatus(list[1]);
        }
      }

      if (Number(lastScreenCompleted) === 4 && userStatus === "N") {
        if (businessKybMode === "E_KYB" || businessKybMode === "E_KYC") {
          document.getElementById("openAlertModalBtn").click();
        } else if (businessKybMode === "M_KYB" || businessKybMode === "M_KYC") {
          document.getElementById("MKYCopenAlertModalBtn").click();
        }
      }

      FillApplicantDetails();
    };

    SetPage();
  }, []);

  const FillApplicantDetails = () => {
    let obj = {};
    if (Number(lastScreenCompleted) >= 4) {
      obj = applicantBusinessDetailsObj;
      if (obj.status === "BAD_REQUEST") {
        return;
      }
      // Professional Details
      if (obj.hasOwnProperty("applicantPosition")) {
        setPosition(obj.applicantPosition);
      }

      if (obj.hasOwnProperty("applicantSharePercentage")) {
        handleSharePercentage(Number(obj.applicantSharePercentage));
      }

      // Address Details
      if (obj.hasOwnProperty("applicantAddress1")) {
        setAddress1(obj.applicantAddress1);
      }

      if (obj.hasOwnProperty("applicantAddress2")) {
        setAddress2(obj.applicantAddress2);
      }

      if (obj.hasOwnProperty("applicantCity")) {
        setCity(obj.applicantCity);
      }

      if (obj.hasOwnProperty("applicantState")) {
        setState(obj.applicantState);
      }

      if (obj.hasOwnProperty("applicantPostcode")) {
        setPostcode(obj.applicantPostcode);
      }

      if (obj.hasOwnProperty("applicantCountry")) {
        setCountry(obj.applicantCountry);
      }

      // Contact Details
      if (obj.hasOwnProperty("applicantCountryCode")) {
        setCountryCodeValues(obj.applicantCountryCode);
      }

      if (obj.hasOwnProperty("applicantContactNumber")) {
        setContactNumber(obj.applicantContactNumber);
      }

      if (obj.hasOwnProperty("applicantEmail")) {
        setEmail(obj.applicantEmail);
      }

      // KYC Details
      if (obj.hasOwnProperty("applicantFirstName")) {
        setFirstName(obj.applicantFirstName);
      }

      if (obj.hasOwnProperty("applicantMiddleName")) {
        setMiddleName(obj.applicantMiddleName);
      }

      if (obj.hasOwnProperty("applicantLastName")) {
        setLastName(obj.applicantLastName);
      }

      if (obj.hasOwnProperty("applicantNationality")) {
        setNationality(obj.applicantNationality);
      }

      if (obj.hasOwnProperty("applicantDOB")) {
        var DOB = dayjs(obj.applicantDOB.slice(0, 10));
        setDateOfBirth(DOB);
      }

      if (obj.hasOwnProperty("applicantKycMode")) {
        var kycMode = obj.applicantKycMode;

        if (kycMode === "E_KYC") {
          setIsResident("YES");
          setVerifyMode(null);
        } else if (kycMode === "E_DOC_VERIFY") {
          setIsResident("NO");
          setVerifyMode("YES");
        } else {
          setIsResident("NO");
          setVerifyMode("NO");
        }
      }

      if (obj.hasOwnProperty("applicantDeclaration")) {
        if (obj.applicantDeclaration.toLowerCase() === "yes") {
          setApplicantDeclaration(true);
          document.getElementById("applicantDeclaration").checked = true;
        }
      }

      if (obj.hasOwnProperty("occupation")) {
        setOccupation(obj.occupation);
      }

      if (obj.hasOwnProperty("birthCountry")) {
        setBirthCountry(obj.birthCountry);
      }
    } else {
      obj = UserCognitoDetails;

      const nameAttribute = obj.userAttributes.find(
        (attr) => attr.name === "custom:contactName"
      );
      if (nameAttribute) {
        const names = nameAttribute.value.split(" ");

        if (names.length === 2) {
          setFirstName(names[0]);
          setLastName(names[1]);
          setMiddleName("");
        } else if (names.length > 2) {
          setFirstName(names[0]);
          setLastName(names[names.length - 1]);
          setMiddleName(names.slice(1, -1).join(" "));
        } else {
          setFirstName(names[0]);
        }
      }

      const email = obj.userAttributes.find((attr) => attr.name === "email");
      setEmail(email?.value || "");

      const cc = obj.userAttributes.find(
        (attr) => attr.name === "custom:isd_code"
      );
      let countryCode = cc?.value || "";

      // Default Country Code
      let detectedCountry = "";

      // Function to check if the ISD code belongs to Canada
      const canadianAreaCodes = [
        "204",
        "226",
        "236",
        "249",
        "250",
        "289",
        "306",
        "343",
        "365",
        "387",
        "403",
        "416",
        "418",
        "431",
        "437",
        "438",
        "450",
        "506",
        "514",
        "519",
        "548",
        "579",
        "581",
        "587",
        "604",
        "613",
        "639",
        "647",
        "672",
        "705",
        "709",
        "742",
        "778",
        "780",
        "782",
        "807",
        "819",
        "825",
        "867",
        "873",
        "902",
        "905",
      ];

      if (countryCode === "1") {
        // Extract area code from phone number
        const phoneNumber =
          obj.userAttributes.find((attr) => attr.name === "phone_number")
            ?.value || "";

        const areaCode = phoneNumber?.replace("+1", "").trim().substring(0, 3);

        // Check if the area code belongs to Canada
        detectedCountry = canadianAreaCodes.includes(areaCode) ? "CA" : "US";
      } else {
        // Fallback to listCountryCode lookup if not +1
        for (let i = 0; i < listCountryCode.length; i++) {
          if (listCountryCode[i].ISD_country_code === countryCode) {
            detectedCountry = listCountryCode[i].ISOcc_2char;
          }
        }
      }

      // Set the detected country code
      setCountryCodeValues(detectedCountry);

      const phoneNumber = obj.userAttributes.find(
        (attr) => attr.name === "phone_number"
      );
      setContactNumber(Number(phoneNumber?.value?.slice(-10)) || "");
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

  const phoneNumberInput = (event) => {
    // Limit the input to numbers only
    const input = event.target.value.replace(/\D/g, "");

    // Limit the length to a maximum of 10 digits
    const maxDigits = 15;
    const formattedInput = input.slice(0, maxDigits);

    // Update the input value with the formatted phone number
    setContactNumber(formattedInput);
  };

  const setCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();

    // Add leading zero if month or day is less than 10
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    // Return date in the format "YYYY-MM-DD"
    return `${year}-${month}-${day}`;
  };

  // Get the current date in the format "YYYY-MM-DD"
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
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
      setDateOfBirth(""); // Clear the date if it's invalid
    }
  };

  const preventFutureDates2 = (event) => {
    let currentDate = getCurrentDate();
    if (event.target.value > currentDate) {
      toast.error("Please select a date on or before " + currentDate);
      setBirthCountry("");
    } else {
      setBirthCountry(event.target.value);
    }
  };

  const submitApplicantDetails = async () => {
    //Applicant KYC Details validations
    if (!firstName) {
      toast.warn("Applicant's First Name must not be empty");
    } else if (!lastName) {
      toast.warn("Applicant's Last Name must not be empty");
    } else if (!isResident) {
      toast.warn("Please select your residence type...");
    } else if (isResident === "NO" && !verifyMode) {
      toast.warn("Please select your verification type...");
    } else if (!nationality) {
      toast.warn("Applicant's Nationality must not be empty");
    } else if (!dateOfBirth) {
      toast.warn("Applicant's Date Of Birth must not be empty");
    }

    //Applicant Professional details validations
    else if (!position) {
      toast.warn("Applicant's Position must not be empty");
    } else if (!sharePercentage) {
      toast.warn("Applicant's Share-percentage must not be empty");
    }

    //Applicant Address Validations
    else if (!address1) {
      toast.warn("Applicant's Address Line-1 must not be empty");
    } else if (!city) {
      toast.warn("Applicant's City must not be empty");
    } else if (
      (region === "EU" || region === "CA" || region === "HK") &&
      !state
    ) {
      toast.warn("Applicant's State must not be empty");
    } else if (!postcode) {
      toast.warn("Applicant's Postcode must not be empty");
    } else if (postcode.length < 3 || postcode.length > 10) {
      toast.warn(
        "Applicant's Postcode must be between 3 to 10 characters in length"
      );
    } else if (!country) {
      toast.warn("Applicant's Country must not be empty");
    }

    //Applicant contact details validations
    else if (!countryCode) {
      toast.warn("Applicant's Country Code must not be empty");
    } else if (!contactNumber) {
      toast.warn("Applicant's Contact Number must not be empty");
    } else if (contactNumber?.length < 7) {
      toast.warn("Applicant's Contact Number must not be less than 7 digits.");
    } else if (!email) {
      toast.warn("Applicant's Email must not be empty");
    } else if (region === "CA" && !occupation) {
      toast.warn("Applicant's Occupation must not be empty");
    } else if (region === "CA" && !applicantDeclaration) {
      toast.warn("Applicant's Declaration must be checked before proceeding!");
    } else if (region === "EU" && !birthCountry) {
      toast.warn("Birth Country must not be empty");
    } else {
      let params = {
        businessRegistrationNumber: internalBusinessId?.trim(),
        email: sessionStorage.getItem("lastemail")?.trim(),
        applicantFirstName: firstName?.trim(),
        applicantMiddleName: middleName?.trim(),
        applicantLastName: lastName?.trim(),
        applicantNationality: nationality,
        applicantDateOfBirth: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateOfBirth)
          ? dateOfBirth
          : dateOfBirth.format("YYYY-MM-DD"),
        applicantKycMode:
          isResident === "YES"
            ? "E_KYC"
            : isResident === "NO" && verifyMode === "NO"
            ? "MANUAL_KYC"
            : isResident === "NO" && verifyMode === "YES"
            ? "E_DOC_VERIFY"
            : "MANUAL_KYC",
        applicantIsResident: isResident,
        applicantPosition: position,
        applicantSharePercentage: sharePercentage,
        applicantAddress1: address1?.trim(),
        applicantAddress2: address2?.trim(),
        applicantCity: city?.trim(),
        applicantState: state?.trim(),
        applicantPostcode: postcode?.trim(),
        applicantCountry: country,
        applicantCountryCode: countryCode,
        applicantContactNumber: contactNumber,
        applicantEmail: email?.trim(),
        region: region,
      };

      if (region === "CA") {
        params.occupation = occupation;

        params.applicantDeclaration = "yes";
      }

      if (region === "EU") {
        if (birthCountry !== "") {
          params.birthCountry = birthCountry;
        }
      }

      setBtnLoader(true);
      const submitDetails = await dispatch(
        actions.PostApplicantDetails(params)
      );

      if (submitDetails && submitDetails.status === "SUCCESS") {
        setBtnLoader(false);
        if (businessKybMode === "E_KYB" || businessKybMode === "E_KYC") {
          document.getElementById("openAlertModalBtn").click();
        } else if (businessKybMode === "M_KYB" || businessKybMode === "M_KYC") {
          document.getElementById("MKYCopenAlertModalBtn").click();
        }
      }
    }
  };

  const updateApplicantDetails = async () => {
    //Applicant KYC Details validations
    if (!firstName) {
      toast.warn("Applicant's First Name must not be empty");
    } else if (!lastName) {
      toast.warn("Applicant's Last Name must not be empty");
    } else if (!isResident) {
      toast.warn("Please select your residence type...");
    } else if (isResident === "NO" && !verifyMode) {
      toast.warn("Please select your verification type...");
    } else if (!nationality) {
      toast.warn("Applicant's Nationality must not be empty");
    } else if (!dateOfBirth) {
      toast.warn("Applicant's Date Of Birth must not be empty");
    }

    //Applicant Professional details validations
    else if (!position) {
      toast.warn("Applicant's Position must not be empty");
    } else if (region === "CA" && !sharePercentage) {
      toast.warn("Applicant's Share-percentage must not be empty");
    }

    //Applicant Address Validations
    else if (!address1) {
      toast.warn("Applicant's Address Line-1 must not be empty");
    } else if (!city) {
      toast.warn("Applicant's City must not be empty");
    } else if (
      (region === "EU" || region === "CA" || region === "HK") &&
      !state
    ) {
      toast.warn("Applicant's State must not be empty");
    } else if (!postcode) {
      toast.warn("Applicant's Postcode must not be empty");
    } else if (!country) {
      toast.warn("Applicant's Country must not be empty");
    }

    //Applicant contact details validations
    else if (!countryCode) {
      toast.warn("Applicant's Country Code must not be empty");
    } else if (!contactNumber) {
      toast.warn("Applicant's Contact Number must not be empty");
    } else if (!email) {
      toast.warn("Applicant's Email must not be empty");
    } else if (region === "CA" && !occupation) {
      toast.warn("Applicant's Occupation must not be empty");
    } else if (region === "CA" && !applicantDeclaration) {
      toast.warn("Applicant's Declaration must be checked before proceeding!");
    } else if (region === "EU" && !birthCountry) {
      toast.warn("Birth Country must not be empty");
    } else {
      let params = {
        businessRegistrationNumber: internalBusinessId,
        email: sessionStorage.getItem("lastemail"),
        applicantFirstName: firstName,
        applicantMiddleName: middleName,
        applicantLastName: lastName,
        applicantNationality: nationality,
        applicantDateOfBirth: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateOfBirth)
          ? dateOfBirth
          : dateOfBirth.format("YYYY-MM-DD"),
        applicantKycMode:
          isResident === "YES"
            ? "E_KYC"
            : isResident === "NO" && verifyMode === "NO"
            ? "MANUAL_KYC"
            : isResident === "NO" && verifyMode === "YES"
            ? "E_DOC_VERIFY"
            : "MANUAL_KYC",
        applicantIsResident: isResident,
        applicantPosition: position,
        applicantSharePercentage: sharePercentage,
        applicantAddress1: address1,
        applicantAddress2: address2,
        applicantCity: city,
        applicantState: state,
        applicantPostcode: postcode,
        applicantCountry: country,
        applicantCountryCode: countryCode,
        applicantContactNumber: contactNumber,
        applicantEmail: email,
        region: region,
      };

      if (region === "CA") {
        params.applicantOccupation = occupation;

        params.applicantDeclaration = "yes";
      }

      if (region === "EU") {
        if (birthCountry !== "") {
          params.birthCountry = birthCountry;
        }
      }

      setBtnLoader(true);
      let obj = await dispatch(actions.PatchApplicantDetails(params));
      if (obj.status === "SUCCESS") {
        setBtnLoader(false);
      }
    }
  };

  return (
    <>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item border-0">
          <button
            className="accordion1 border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            <div className={status}>
              <div className="file-zip-parent">
                <ReactSVG
                  src="/onboarding/accounts/applicationReview/kycDet.svg"
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
                  src={"/onboarding/accounts/" + status + ".svg"}
                />
              </div>
            </div>
            <div className="title4">
              <div className="add-details-to1">
                Applicant KYC Details
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
            id="collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <form className="form">
              <div className="d-flex align-self-stretch">
                <div className="input-group w-33 me-2 pb-0">
                  <input
                    maxLength={255}
                    name="Applicant First Name"
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
                  <label htmlFor="country" className="form-input-label ps-1">
                    First Name
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
                <div className="input-group w-33 ms-2 pb-0">
                  <input
                    maxLength={255}
                    name="Applicant Middle Name"
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
                  <label htmlFor="country" className="form-input-label ps-1">
                    Middle Name
                  </label>
                </div>
                <div className="input-group w-33 ms-2 pb-0">
                  <input
                    maxLength={255}
                    name="Applicant Last Name"
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
                  <label htmlFor="country" className="form-input-label ps-1">
                    Last Name
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
              </div>

              <div className="d-flex align-self-stretch">
                <div className="input-group w-50 me-2 pb-0">
                  <select
                    id="applicantIsResident"
                    name="country"
                    className="form-input my-0 pb-0"
                    value={isResident}
                    onChange={(e) => setIsResident(e.target.value)}
                  >
                    <option value=""></option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                  <label htmlFor="country" className="form-input-label ps-1">
                    Are you a resident of{" "}
                    {region === "AU"
                      ? "Australia"
                      : region === "CA"
                      ? "Canada"
                      : region === "EU"
                      ? "European Union"
                      : region === "HK"
                      ? "Hong Kong"
                      : region === "JP"
                      ? "Japan"
                      : region === "NZ"
                      ? "New Zealand"
                      : region === "SG"
                      ? "Singapore"
                      : region === "UK"
                      ? "United Kingdom"
                      : region === "US"
                      ? "United States"
                      : "Unknown"}
                    ?
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>

                {isResident === "YES" ? (
                  <></>
                ) : (
                  <>
                    <div
                      className="input-group w-50 ms-2 pb-0"
                      id="verifyModeApplicantDiv"
                    >
                      <select
                        id="verifyModeApplicant"
                        className="form-input my-0 pb-0"
                        value={verifyMode}
                        onChange={(e) => setVerifyMode(e.target.value)}
                      >
                        <option value=""></option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                      <label
                        htmlFor="businesstype"
                        className="form-input-label ps-1"
                      >
                        Do You Want To Verify with Live Photograph?
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </label>
                    </div>
                  </>
                )}

                <input
                  maxLength={255}
                  id="applicantKycMode"
                  type="hidden"
                  value={
                    isResident === "YES"
                      ? "E_KYC"
                      : isResident === "NO" && verifyMode === "NO"
                      ? "MANUAL_KYC"
                      : isResident === "NO" && verifyMode === "YES"
                      ? "E_DOC_VERIFY"
                      : ""
                  }
                />
              </div>

              <div className="d-flex align-self-stretch">
                <div className="input-group w-50 me-2 pb-0">
                  <select
                    id="applicantNationality"
                    name="country"
                    className="form-input my-0 pb-0"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
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
                  <label htmlFor="country" className="form-input-label ps-1">
                    Nationality
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
                <div
                  className="input-group w-50 ms-2 pb-0"
                  onBlur={() => preventFutureDates(dateOfBirth)}
                >
                  {/* <input
                    maxLength={255}
                    id="applicantDateOfBirth"
                    type="date"
                    name="country"
                    className="form-input my-0 pb-0"
                    max={setCurrentDate()}
                    onChange={(event) => {
                      preventFutureDates(event);
                    }}
                    value={dateOfBirth}
                  /> */}
                  <DatePicker
                    views={["year", "month", "day"]}
                    format="DD/MM/YYYY"
                    onChange={(newDate) => {
                      setDateOfBirth(newDate.format("YYYY-MM-DD"));
                    }}
                    className="form-input my-0 pb-0 date-picker"
                    value={dateOfBirth}
                    disableFuture
                    sx={{
                      "& .MuiOutlinedInput-input": {
                        padding: "25px 0 10px 5px",
                      },
                    }}
                    maxDate={maxDate}
                  />
                  <label htmlFor="country" className="form-input-label ps-1">
                    Date Of Birth
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
              </div>

              {region === "EU" ? (
                <>
                  <div className="d-flex align-self-stretch">
                    <div className="input-group w-50 me-2 pb-0">
                      <select
                        id="applicantBirthCountry"
                        className="form-input my-0 pb-0"
                        onChange={(event) => {
                          setBirthCountry(event.target.value);
                        }}
                        value={birthCountry}
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
                        Birth Country
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </form>
          </div>
        </div>

        <div className="accordion-item border-0">
          <button
            className="accordion1 border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
          >
            <div className={status}>
              <div className="file-zip-parent">
                <ReactSVG
                  src="/onboarding/accounts/applicationReview/appProDet.svg"
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
                  src={"/onboarding/accounts/" + status + ".svg"}
                />
              </div>
            </div>
            <div className="title4">
              <div className="add-details-to1">
                Applicant Professional Details
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
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#accordionExample"
          >
            <form className="form">
              <div className="d-flex align-self-stretch">
                <div className="input-group w-50 me-2 pb-0">
                  <select
                    id="applicantPosition"
                    name="country"
                    className="form-input my-0 pb-0"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  >
                    <option value=""></option>
                    {listPosition.map((item) => {
                      return (
                        <option value={item.code}>{item.description}</option>
                      );
                    })}
                  </select>
                  <label htmlFor="country" className="form-input-label ps-1">
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
                    id="applicantSharePercentage"
                    className="form-input my-0 pb-0"
                    value={sharePercentage}
                    onInput={(e) => handleSharePercentage(e.target.value)}
                    onKeyDown={(e) => {
                      const exceptThisSymbols = ["e", "E", "+", "-", "."];
                      exceptThisSymbols.includes(e.key) && e.preventDefault();
                    }}
                  />
                  <label
                    htmlFor="businesstype"
                    className="form-input-label ps-1"
                  >
                    Share Percentage{" "}
                    {region === "CA" && <span className="text-danger">*</span>}
                  </label>
                  <img
                    className="cross-circle-icon1"
                    alt=""
                    src="cross-circle1.svg"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="accordion-item border-0">
          <button
            className="accordion1 border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseThree"
            aria-expanded="true"
            aria-controls="collapseThree"
          >
            <div className={status}>
              <div className="file-zip-parent">
                <ReactSVG
                  src="/onboarding/accounts/applicationReview/appAdd.svg"
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
                  src={"/onboarding/accounts/" + status + ".svg"}
                />
              </div>
            </div>
            <div className="title4">
              <div className="add-details-to1">
                Applicant Address Details
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
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <form className="form">
              <div className="d-flex align-self-stretch">
                <div className="input-group w-50 me-2 pb-0">
                  <input
                    maxLength={255}
                    type="text"
                    name="Applicant Address Line-1"
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
                  <label htmlFor="username" className="form-input-label ps-1">
                    Address 1
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
                    name="Applicant Address Line-2"
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
                    name="Applicant City"
                    className="form-input my-0 pb-0"
                    value={city}
                    onChange={(e) => {
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
                    name="Applicant State"
                    className="form-input my-0 pb-0"
                    value={state}
                    onChange={(e) => {
                      restrictions.restrictInputCity(e);
                      setState(e.target.value);
                    }}
                    onBlur={(e) =>
                      validations.state(e.target.value, e.target.name)
                    }
                  />
                  <label htmlFor="tradename" className="form-input-label ps-1">
                    State{" "}
                    {region === "CA" && <span className="text-danger">*</span>}
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
                    name="Applicant Postal Code"
                    className="form-input my-0 pb-0"
                    value={postcode}
                    onChange={(e) => {
                      restrictions.restrictInputPostcode(e);
                      setPostcode(e.target.value);
                    }}
                    onBlur={(e) =>
                      validations.postalCode(e.target.value, e.target.name)
                    }
                  />
                  <label
                    htmlFor="businesstype"
                    className="form-input-label ps-1"
                  >
                    Postal Code
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
                  <select
                    id="applicantCountry"
                    name="country"
                    className="form-input my-0 pb-0"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value=""></option>
                    {listCountry.map((item) => {
                      return (
                        <option value={item.code}>{item.description}</option>
                      );
                    })}
                  </select>
                  <label htmlFor="country" className="form-input-label ps-1">
                    Country
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="accordion-item border-0">
          <button
            className="accordion1 border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseFour"
            aria-expanded="true"
            aria-controls="collapseFour"
          >
            <div className={status}>
              <div className="file-zip-parent">
                <ReactSVG
                  src="/onboarding/accounts/applicationReview/appConDet.svg"
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
                  src={"/onboarding/accounts/" + status + ".svg"}
                />
              </div>
            </div>
            <div className="title4">
              <div className="add-details-to1">
                Applicant Contact Details
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
            id="collapseFour"
            className="accordion-collapse collapse"
            aria-labelledby="headingFour"
            data-bs-parent="#accordionExample"
          >
            <form className="form">
              <div className="d-flex align-self-stretch">
                <div className="input-group w-100 pb-0">
                  <input
                    maxLength={40}
                    type="email"
                    name="Applicant Email"
                    className="form-input my-0 pb-0"
                    value={email}
                    onInput={(e) => {
                      setEmail(e.target.value);
                    }}
                    onBlur={(e) => {
                      validations.email(e.target.value, e.target.name);
                    }}
                    disabled
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
                    id="applicantCountryCode"
                    name="country"
                    className="form-input my-0 pb-0"
                    value={countryCode}
                    onChange={(e) => setCountryCodeValues(e.target.value)}
                  >
                    <option value=""></option>
                    {listCountryCode.map((item) => {
                      return (
                        <option value={item.ISOcc_2char}>
                          {item.country_name} (+{item.ISD_country_code})
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor="country" className="form-input-label ps-1">
                    Country Code
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
                <div className="input-group w-50 ms-2 pb-0">
                  <input
                    maxLength={255}
                    type="number"
                    name="Applicant Contact Number"
                    className="form-input my-0 pb-0"
                    value={contactNumber}
                    onInput={(e) => {
                      phoneNumberInput(e);
                    }}
                    onBlur={(e) => {
                      if (e.target.value && e.target.value?.length < 7) {
                        toast.warn(
                          "Applicant's contact number cannot be less that 7 digits."
                        );
                        return;
                      } else {
                        validations.numeric(e.target.value, e.target.name);
                      }
                    }}
                    onKeyDown={(e) => {
                      const exceptThisSymbols = ["e", "E", "+", "-", "."];
                      exceptThisSymbols.includes(e.key) && e.preventDefault();
                    }}
                  />
                  <label
                    htmlFor="businesstype"
                    className="form-input-label ps-1"
                  >
                    Contact Number
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
            </form>
          </div>
        </div>

        {region === "CA" ? (
          <>
            <div className="accordion-item border-0">
              <button
                className="accordion1 border-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFive"
                aria-expanded="true"
                aria-controls="collapseFive"
              >
                <div className={status}>
                  <div className="file-zip-parent">
                    <ReactSVG
                      src="/onboarding/accounts/applicationReview/appConDet.svg"
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
                      src={"/onboarding/accounts/" + status + ".svg"}
                    />
                  </div>
                </div>
                <div className="title4">
                  <div className="add-details-to1">
                    Applicant Additional Details
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
                id="collapseFive"
                className="accordion-collapse collapse"
                aria-labelledby="headingFive"
                data-bs-parent="#accordionExample"
              >
                <form className="form">
                  <div className="d-flex align-self-stretch">
                    <div className="input-group w-100 me-2 pb-0">
                      <select
                        id="applicantOccupation"
                        name="country"
                        className="form-input my-0 pb-0"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                      >
                        <option value=""></option>
                        {listOccupation.map((item) => {
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
                        Occupation
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="align-self-stretch">
                    Applicant Declaration:
                    <div>
                      <label>
                        <div>
                          <input
                            maxLength={255}
                            type="checkbox"
                            id="applicantDeclaration"
                            value={applicantDeclaration}
                            onChange={(e) =>
                              setApplicantDeclaration(e.target.checked)
                            }
                          />
                          <span>By checking this box, I verify that:</span>
                        </div>
                        <ul>
                          <li>
                            The list of UBOs and their details provided are
                            complete and verified by me.
                          </li>
                          <li>
                            The list of directors and their details provided are
                            complete and verified by me.
                          </li>
                          <li>
                            All other information provided by me is complete and
                            verified.
                          </li>
                        </ul>
                      </label>
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

      <Alert />
      <AlertMKYC />

      <div
        id="buttons-div"
        style={{
          width: "840px",
          display:
            lastScreenCompleted < 8 || userStatus !== "C" ? "flex" : "none",
          justifyContent: "end",
          gap: "15px",
        }}
      >
        {lastScreenCompleted >= 4 ? (
          <>
            <button
              className="update-btn"
              type="button"
              id="updateContactDetails"
              onClick={() => updateApplicantDetails()}
            >
              {btnLoader ? (
                <>
                  {" "}
                  <ScaleLoader height={20} width={5} color="black" />
                </>
              ) : (
                <>
                  <img
                    className="check-double-icon"
                    alt=""
                    src="/auth/update-icon.svg"
                  />
                  <div className="label7 submitBtn">Update</div>
                </>
              )}
            </button>
          </>
        ) : lastScreenCompleted >= 1 ? (
          <>
            <button
              className="submit-btn"
              type="button"
              id="submitContactDetails"
              onClick={() => submitApplicantDetails()}
            >
              <>
                {btnLoader ? (
                  <>
                    {" "}
                    <ScaleLoader height={20} width={5} color="white" />
                  </>
                ) : (
                  <>
                    <img
                      className="check-double-icon"
                      alt=""
                      src="/onboarding/submit-icon.svg"
                    />
                    <div className="label7 submitBtn mx-2">Submit</div>
                  </>
                )}
              </>
            </button>
          </>
        ) : (
          <></>
        )}

        <button
          className="update-btn d-none"
          type="button"
          id="submitEKYCDetails"
          onClick={functions.PostEKYC}
        >
          <img
            className="check-double-icon"
            alt=""
            src="/onboarding/submit-icon.svg"
          />
          <div className="label7 submitBtn">ONBOARD USER</div>
        </button>
      </div>
    </>
  );
}

export default ApplicantDetails;
