import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import ContentLoader from "react-content-loader";
import * as functions from "./functions/business-details-functions.js";
import * as utilities from "./functions/utility-details-function.js";
import Select from "react-select";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./css/business-details.css";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import {
  setRegisteredCountry,
  setSearchId,
} from "../../../../@redux/features/onboardingFeatures.js";
import * as actions from "../../../../@redux/action/onboardingAction.js";
import { ScaleLoader } from "react-spinners";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const customStyles = {
  control: (provided, state) => ({
    // Styles for the control (not focused)
    ...provided,
    border: state.isFocused ? "none" : "none",
    boxShadow: state.isFocused ? "none" : "none",
    // You can apply additional styles as needed
  }),
};

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      toast.error(
        `${name} must be a valid email address. Example: "john.doe@example.com"`
      );
    }
  },

  name: (value, name) => {
    const nameRegex = /^[a-zA-Z0-9\s,.'\-\/]+$/;
    if (value && !nameRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, numbers, spaces, commas, periods, hyphens, and slashes.`
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

  website: (value, name) => {
    const websiteRegex =
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9#-._~:\/?[\]@!$&'()*+,;=]*)?$/;
    if (value && !websiteRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed format: www.sample.com or https://www.sample.com`
      );
    }
  },
};

const fetchIpToken = async () => {
  try {
    const response = await axios.get(
      `${sessionStorage.getItem("baseUrl")}/CommonRoutes/fetchIpAddress`
    );
    const obj = response.data;

    if (obj.env || obj.token) {
      try {
        const request = await fetch(
          `https://ipinfo.io/json?token=${obj.token}`
        );
        const obj2 = await request.json();

        return {
          ip: obj2.ip,
          country: obj2.country,
        };
      } catch (error) {
        if (
          error.message.includes("Network Error") ||
          error.message.includes("ERR_BLOCKED_BY_CLIENT")
        ) {
          // toast.error(
          //   "Failed to Retrieve Information: It appears your browser is blocking certain features. Please disable any restrictive settings or extensions and try again."
          // );

          Swal.fire({
            title: "Blocker(s) detected",
            text: "It appears your browser is blocking certain features. Please disable any restrictive settings or extensions and try again.",
            icon: "error",
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });
        } else {
          console.log("Failed to Retrieve IP Information:", error);
        }

        const region = sessionStorage.getItem("region");

        let obj = {
          AU: "1.159.255.255", // Sample IP for Australia
          EU: "1.179.127.255", // Sample IP for Europe
          HK: "1.118.255.255", // Sample IP for Hong Kong
          SG: "1.21.224.0	", // Sample IP for Singapore
          UK: "101.61.255.255", // Sample IP for the United Kingdom
          US: "100.42.19.255", // Sample IP for the United States
          CA: "100.42.19.255", // Sample IP for Canada
        };

        return {
          ip: obj[region],
          country: region,
        };
      }
    } else {
      console.log("Environment or token is missing.");
      return null;
    }
  } catch (error) {
    console.log("Failed to fetch IP token:", error);
    return {
      message: "Failed to fetch ip-token and environment",
      status: "BAD_REQUEST",
    };
  }
};

function businessDetails() {
  const dispatch = useDispatch();
  const list = ["progress", "pending", "approve"];
  const [btnLoader, setBtnLoader] = useState(false);

  const [status, setStatus] = useState(list[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const [region, setRegion] = useState(sessionStorage.getItem("region"));
  const cognitoDetails = useSelector(
    (state) => state.onboarding?.UserCognitoDetails
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
  var additionalBusinessCorporationDetails = useSelector(
    (state) => state.onboarding?.AdditionalBusinessCorporationDetails
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

  var registeredCountry = useSelector(
    (state) => state.onboarding?.registeredCountry
  );

  var listedExchange = useSelector(
    (state) => state.onboarding?.ListedExchangeValues
  );
  var totalEmployees = useSelector(
    (state) => state.onboarding?.TotalEmployeesValues
  );
  var annualTurnover = useSelector(
    (state) => state.onboarding?.AnnualTurnoverValues
  );
  var industrySector = useSelector(
    (state) => state.onboarding?.IndustrySectorValues
  );
  var intendedUseOfAccount = useSelector(
    (state) => state.onboarding?.IntendedUseOfAccountValues
  );
  var listCountry = useSelector((state) => state.onboarding?.ListCountry);

  var monthlyTransactionVolumeList = useSelector(
    (state) => state.onboarding?.monthlyTransactionVolume
  );
  var monthlyTransactionsList = useSelector(
    (state) => state.onboarding?.monthlyTransactions
  );
  var averageTransactionValueList = useSelector(
    (state) => state.onboarding?.averageTransactionValue
  );

  useEffect(() => {
    if (listCountry && listCountry.length > 0) {
      const values = listCountry.map((item) => ({
        label: item.description,
        value: item.code,
      }));
      setOptions(values);
    }
  }, [listCountry]);

  var unregulatedTrustType = useSelector(
    (state) => state.onboarding?.UnregulatedTrustTypeValues
  );

  const [registeredDate, setRegisteredDate] = useState("");
  const [listedExchangeValue, setListedExchange] = useState(null);
  const [website, setWebsite] = useState("");
  const [businessDesc, setBusinessDesc] = useState("");
  const [regulatedTrust, setRegulatedTrust] = useState("");
  const [unregulatedTrust, setUnregulatedTrust] = useState(null);

  const [TotalEmployeesValues, setTotalEmployeesValues] = useState(null);
  const [AnnualTurnoverValues, setAnnualTurnoverValues] = useState(null);
  const [IndustrySectorValues, setIndustrySectorValues] = useState(null);
  const [IntendedUseOfAccountValues, setIntendedUseOfAccountValues] =
    useState(null);

  const [taxCountry, setTaxCountry] = useState(null);
  const [taxNumber, setTaxNumber] = useState("");

  //Fetching values from general details page

  useEffect(() => {
    if (Number(lastScreenCompleted) >= 2) {
      if (userStatus && userStatus == "C") {
        setStatus(list[2]);
      } else {
        setStatus(list[1]);
      }
    }

    fillAdditionalBusinessDetails();
  }, []);

  const fillAdditionalBusinessDetails = () => {
    let obj;
    if (lastScreenCompleted && lastScreenCompleted >= 2) {
      obj = additionalBusinessCorporationDetails;
      if (obj.status === "BAD_REQUEST") {
        return;
      }

      //Filling Data when it's available
      if (obj.hasOwnProperty("regCountry")) {
        dispatch(setRegisteredCountry(obj.regCountry));
      }

      if (obj.hasOwnProperty("registeredDate")) {
        setRegisteredDate(dayjs(obj.registeredDate));
      }

      if (obj.hasOwnProperty("listedExchange")) {
        setListedExchange(obj.listedExchange);
      }

      // if (obj.hasOwnProperty("regType")) {
      //   document.getElementById("registrationType").value = obj.regType;
      // }

      // if (obj.hasOwnProperty("legislationName")) {
      //   document.getElementById("legislationName").value = obj.legislationName;
      // }

      // if (obj.hasOwnProperty("legislationType")) {
      //   document.getElementById("legislationType").value = obj.legislationType;
      // }

      if (obj.hasOwnProperty("website")) {
        setWebsite(obj.website);
      }

      if (obj.hasOwnProperty("country")) {
        setTaxCountry(obj.country);
      }

      if (obj.hasOwnProperty("taxNumber")) {
        setTaxNumber(obj.taxNumber);
      }

      if (obj.hasOwnProperty("regulatedTrustType")) {
        setRegulatedTrust(obj.regulatedTrustType);
      }

      if (obj.hasOwnProperty("unregulatedTrustType")) {
        setUnregulatedTrust(obj.unregulatedTrustType);
      }

      if (obj.hasOwnProperty("searchId")) {
        dispatch(setSearchId(obj.searchId));
      }

      if (obj.hasOwnProperty("totalEmployees")) {
        setTotalEmployeesValues(obj.totalEmployees);
      }

      if (obj.hasOwnProperty("annualTurnover")) {
        setAnnualTurnoverValues(obj.annualTurnover);
      }

      if (obj.hasOwnProperty("industrySector")) {
        setIndustrySectorValues(obj.industrySector);
      }

      if (obj.hasOwnProperty("countryOfOperation")) {
        let cop = obj?.countryOfOperation?.split(",") || [];

        // Create an array of options for the countryOfOperation Select
        const countryOptions = cop
          .map((country) => {
            const trimmedCountry = country.trim();
            if (trimmedCountry !== "") {
              const countryList = listCountry;

              const foundCountry = countryList.find(
                (item) => item.code === trimmedCountry
              );

              if (foundCountry) {
                return {
                  value: foundCountry.code,
                  label: foundCountry.description,
                };
              }
            }
            return null;
          })
          .filter(Boolean);

        handleCopChange(countryOptions);
      }

      // if (obj.hasOwnProperty("travelRestrictedCountry")) {
      //   document.getElementById("travelRestrictedCountry").value = obj.travelRestrictedCountry;
      // }

      // if (obj.hasOwnProperty("restrictedCountry")) {
      //   document.getElementById("restrictedCountries").value = obj.restrictedCountry;
      // }

      // if (obj.hasOwnProperty("ofacLicencePresent")) {
      //   document.getElementById("ofacLicencePresent").value = obj.ofacLicencePresent;
      // }

      //Transaction Countries
      if (obj.hasOwnProperty("transactionCountries")) {
        let tc = obj?.transactionCountries?.split(",") || [];
        // Create an array of options for the transactionCountries Select
        const transactionCountryOptions = tc
          .map((country) => {
            const trimmedCountry = country.trim();
            if (trimmedCountry !== "") {
              const countryList = listCountry;

              const foundCountry = countryList.find(
                (item) => item.code === trimmedCountry
              );

              if (foundCountry) {
                return {
                  value: foundCountry.code,
                  label: foundCountry.description,
                };
              }
            }
            return null;
          })
          .filter(Boolean);
        handleTCChange(transactionCountryOptions);
      }

      //Intended Use of Account
      if (obj.hasOwnProperty("intendedUseOfAccount")) {
        setIntendedUseOfAccountValues(obj.intendedUseOfAccount);
      }

      if (obj.hasOwnProperty("description")) {
        setBusinessDesc(obj.description);
      }

      if (region === "EU") {
        if (obj.hasOwnProperty("topTransactionCountriesCredit")) {
          let cop = obj?.topTransactionCountriesCredit?.split(",") || [];

          // Create an array of options for the countryOfOperation Select
          const countryOptions = cop
            .map((country) => {
              const trimmedCountry = country.trim();
              if (trimmedCountry !== "") {
                const countryList = listCountry;

                const foundCountry = countryList.find(
                  (item) => item.code === trimmedCountry
                );

                if (foundCountry) {
                  return {
                    value: foundCountry.code,
                    label: foundCountry.description,
                  };
                }
              }
              return null;
            })
            .filter(Boolean);

          setTopTransactionCountriesCredit(countryOptions);
        }

        if (obj.hasOwnProperty("topTransactionCountriesDebit")) {
          let cop = obj?.topTransactionCountriesDebit?.split(",") || [];

          // Create an array of options for the countryOfOperation Select
          const countryOptions = cop
            .map((country) => {
              const trimmedCountry = country.trim();
              if (trimmedCountry !== "") {
                const countryList = listCountry;

                const foundCountry = countryList.find(
                  (item) => item.code === trimmedCountry
                );

                if (foundCountry) {
                  return {
                    value: foundCountry.code,
                    label: foundCountry.description,
                  };
                }
              }
              return null;
            })
            .filter(Boolean);

          setTopTransactionCountriesDebit(countryOptions);
        }

        if (obj.hasOwnProperty("averageTransactionValueCredit")) {
          setAverageTransactionValueCredit(obj.averageTransactionValueCredit);
        }

        if (obj.hasOwnProperty("averageTransactionValueDebit")) {
          setAverageTransactionValueDebit(obj.averageTransactionValueDebit);
        }

        if (obj.hasOwnProperty("intendedUses")) {
          setIntendedUses(obj.intendedUses);
        }

        if (obj.hasOwnProperty("monthlyTransactionVolumeDebit")) {
          setMonthlyTransactionVolumeDebit(obj.monthlyTransactionVolumeDebit);
        }

        if (obj.hasOwnProperty("monthlyTransactionVolumeCredit")) {
          setMonthlyTransactionVolumeCredit(obj.monthlyTransactionVolumeCredit);
        }

        if (obj.hasOwnProperty("monthlyTransactionsDebit")) {
          setMonthlyTransactionsDebit(obj.monthlyTransactionsDebit);
        }

        if (obj.hasOwnProperty("monthlyTransactionsCredit")) {
          setMonthlyTransactionsCredit(obj.monthlyTransactionsCredit);
        }

        if (obj.hasOwnProperty("topBeneficiaries")) {
          setTopBeneficiariesDebit(obj.topBeneficiaries);
        }

        if (obj.hasOwnProperty("topRemitters")) {
          setTopBeneficiariesCredit(obj.topRemitters);
        }
      }

      //IP Information Fill
      if (obj.hasOwnProperty("countryIp")) {
        setCountryIP(obj.countryIp);
      }

      if (obj.hasOwnProperty("ipAddress")) {
        setIpAddress(obj.ipAddress);
      }

      if (obj.hasOwnProperty("sessionId")) {
        setSessionId(obj.sessionId);
      }

      if (obj.hasOwnProperty("deviceInfo")) {
        setDeviceInfo(obj.deviceInfo);
      }
    } else {
      if (businessKybMode === "E_KYB" || businessKybMode === "E_KYC") {
        obj = businessDetailsNIUMObj;
        var BusinessDetails = obj.businessDetails;
        if (BusinessDetails) {
          if (BusinessDetails.legalDetails) {
            var legalDetails = BusinessDetails.legalDetails;
            setRegisteredDate(dayjs(legalDetails.registeredDate));
            dispatch(setRegisteredCountry(legalDetails.registeredCountry));
          }
          if (BusinessDetails.website && BusinessDetails.website != "null") {
            setWebsite(BusinessDetails.website);
          }

          if (BusinessDetails.additionalInfo) {
            var additionalInfo = BusinessDetails.additionalInfo;
            dispatch(setSearchId(additionalInfo.searchId));
            //document.getElementById("companyStatus").value = additionalInfo.companyStatus;
          }
        }
        var riskAssessmentInfo = obj.riskAssessmentInfo;
        if (riskAssessmentInfo) {
          if (
            riskAssessmentInfo.annualTurnover != "NA" ||
            riskAssessmentInfo.annualTurnover != "null"
          ) {
            setAnnualTurnoverValues(riskAssessmentInfo.annualTurnover);
          }

          if (
            riskAssessmentInfo.totalEmployees != "NA" ||
            riskAssessmentInfo.totalEmployees != "null"
          ) {
            setTotalEmployeesValues(riskAssessmentInfo.totalEmployees);
          }
        }
      } else {
        let userAttr = cognitoDetails?.userAttributes;

        // Find the attribute where the Name is "custom:countryName"
        let regCountryAttr = userAttr?.find(
          (attr) => attr.name === "custom:countryName"
        );

        // Extract the Value from the found attribute
        let regCountry = regCountryAttr?.value;

        // Dispatch the value
        dispatch(setRegisteredCountry(regCountry));
      }
    }
  };

  const [copValues, setCopValues] = useState([]);

  const handleCopChange = (selectedOptions) => {
    setCopValues(selectedOptions);
  };

  const selectedCopValues = copValues.map((option) => option.value).join(", ");

  const [tCValues, setTCValues] = useState([]);

  const handleTCChange = (selectedOptions) => {
    setTCValues(selectedOptions);
  };

  const selectedTCValues = tCValues.map((option) => option.value).join(", ");

  const preventFutureDates = (date) => {
    const currentDate = dayjs();
    if (date.isAfter(currentDate)) {
      toast.error(
        `Please select a date on or before ${currentDate.format("DD/MM/YYYY")}`
      );
      setRegisteredDate("");
    }
  };

  const handleRegisteredCountry = (e) => {
    const restrictedCountries = [
      "AF",
      "YE",
      "SY",
      "SD",
      "SS",
      "SO",
      "RU",
      "MM",
      "LY",
      "KP",
      "IQ",
      "IR",
      "GW",
      "ER",
      "CF",
      "BI",
      "BY",
      "CU",
      "CN",
      "IN",
      "BR",
      "JP",
      "ZA",
      "MY",
    ];
    const highRiskCountries = [
      "ZW",
      "VE",
      "VU",
      "UG",
      "TR",
      "TT",
      "SN",
      "PH",
      "PA",
      "PK",
      "NI",
      "MA",
      "ML",
      "LB",
      "JO",
      "JM",
      "HT",
      "BB",
      "CD",
      "BZ",
      "KY",
      "KH",
      "BF",
      "BO",
    ];

    const country = e.target.value;

    if (restrictedCountries.includes(country)) {
      // country is in restrictedCountries
      toast.error(
        `Sorry, but currently we're not offering onboarding for your selected country: ${e.target.selectedOptions[0].innerText}`
      );

      dispatch(setRegisteredCountry(null));
    } else if (highRiskCountries.includes(country)) {
      // country is in highRiskCountries
      toast.warn(
        `Selected country: ${e.target.selectedOptions[0].innerText}, comes under High-Risk. Please proceed with caution.`
      );
    }
    dispatch(setRegisteredCountry(e.target.value));
  };

  const submitAdditionalBusinessDetails = async () => {
    if (!registeredCountry) {
      toast.warn("Registered Country Must Not Be Empty");
    } else if (!registeredDate) {
      toast.warn("Registered Date Must Not Be Empty");
    } else if (
      businessType.toLowerCase() == "public_company" &&
      !listedExchangeValue
    ) {
      toast.warn("Listed Exchange Must Not Be Empty");
    } else if (businessType.toLowerCase() == "trust" && !unregulatedTrust) {
      toast.warn("Unregulated Trust Type Must Not Be Empty");
    } else if (!TotalEmployeesValues) {
      toast.warn("Total Employees Must Not Be Empty");
    } else if (!AnnualTurnoverValues) {
      toast.warn("Annual Turnover Must Not Be Empty");
    } else if (!IndustrySectorValues) {
      toast.warn("Industry Sector Must Not Be Empty");
    } else if (!selectedCopValues) {
      toast.warn("Country Of Operation Must Not Be Empty");
    } else if (!selectedTCValues) {
      toast.warn("Transaction Countries Must Not Be Empty");
    } else if (!IntendedUseOfAccountValues && region !== "EU") {
      toast.warn("Intended Use Of Account Must Not Be Empty");
    } else if (region === "CA" && !businessDesc) {
      toast.warn("Business Description Must Not Be Empty.");
    } else if ((region === "EU" || region === "CA") && !taxCountry) {
      toast.warn("Tax Country Must Not Be Empty.");
    } else if ((region === "EU" || region === "CA") && !taxNumber) {
      toast.warn("Tax Number Must Not Be Empty.");
    } else if (region === "EU" && !monthlyTransactionVolumeDebit) {
      toast.warn("Debit: Monthly Transaction Volume Must Not Be Empty.");
    } else if (region === "EU" && !monthlyTransactionsDebit) {
      toast.warn("Debit: Monthly Transactions Must Not Be Empty.");
    } else if (region === "EU" && !averageTransactionValueDebit) {
      toast.warn("Debit: Average Transaction Value Must Not Be Empty.");
    } else if (region === "EU" && !topTransactionCountriesDebit) {
      toast.warn("Debit: Top Transaction Countries Must Not Be Empty.");
    } else if (region === "EU" && !topBeneficiariesDebit) {
      toast.warn("Debit: Top Beneficiaries Debit Must Not Be Empty.");
    } else if (region === "EU" && !monthlyTransactionVolumeCredit) {
      toast.warn("Credit: Monthly Transaction Volume Must Not Be Empty.");
    } else if (region === "EU" && !monthlyTransactionsCredit) {
      toast.warn("Credit: Monthly Transactions Must Not Be Empty.");
    } else if (region === "EU" && !averageTransactionValueCredit) {
      toast.warn("Credit: Average Transaction Value Must Not Be Empty.");
    } else if (region === "EU" && !topTransactionCountriesCredit) {
      toast.warn("Credit: Top Transaction Countries Must Not Be Empty.");
    } else if (region === "EU" && !topBeneficiariesCredit) {
      toast.warn("Credit: Top Beneficiaries Must Not Be Empty.");
    } else if (region === "EU" && !intendedUses) {
      toast.warn("Intended Uses Must Not Be Empty.");
    } else if (!countryIP) {
      toast.warn("Country IP Must Not Be Empty.");
    } else if (!deviceInfo) {
      toast.warn("Device Info Must Not Be Empty.");
    } else if (!ipAddress) {
      toast.warn("IP Address Must Not Be Empty.");
    } else if (!sessionId) {
      toast.warn("Session Id Must Not Be Empty.");
    } else {
      let body = {
        businessRegistrationNumber: internalBusinessId?.trim(),
        email: sessionStorage.getItem("lastemail")?.trim(),
        registeredCountry: registeredCountry,
        registeredDate: registeredDate
          ? dayjs(registeredDate).format("YYYY-MM-DD")
          : "",

        listedExchange: listedExchangeValue,
        // registrationType: registrationType,
        // legislationName: legislationName,
        // legislationType: legislationType,
        website: website?.trim(),
        // taxCountry: taxCountry,
        // taxNumber: taxNumber,
        regulatedTrustType: regulatedTrust,
        unregulatedTrustType: unregulatedTrust,
        totalEmployees: TotalEmployeesValues,
        annualTurnover: AnnualTurnoverValues,
        industrySector: IndustrySectorValues,
        countryOfOperation: selectedCopValues,
        // travelRestrictedCountry: travelRestrictedCountry,
        // restrictedCountries: restrictedCountries,
        // ofacLicencePresent: ofacLicencePresent,
        searchId: searchId?.trim(),
        transactionCountries: selectedTCValues,
        intendedUseOfAccount: IntendedUseOfAccountValues,
        businessType: businessType,
        businessKybMode: businessKybMode,
        region: region,
        countryIP: countryIP,
        deviceInfo: deviceInfo,
        ipAddress: ipAddress,
        sessionId: sessionId,
      };

      if (region === "CA") {
        body.businessDescription = businessDesc?.trim();
        body.taxNumber = taxNumber?.trim();
        body.taxCountry = taxCountry;
      }

      if (region === "EU") {
        body.monthlyTransactionVolumeDebit = monthlyTransactionVolumeDebit;
        body.monthlyTransactionsDebit = monthlyTransactionsDebit;
        body.averageTransactionValueDebit = averageTransactionValueDebit;
        body.topTransactionCountriesDebit = topTransactionCountriesDebit
          .map((country) => country.value)
          .join(", ");
        body.topBeneficiariesDebit = topBeneficiariesDebit;
        body.monthlyTransactionVolumeCredit = monthlyTransactionVolumeCredit;
        body.monthlyTransactionsCredit = monthlyTransactionsCredit;
        body.averageTransactionValueCredit = averageTransactionValueCredit;
        body.topTransactionCountriesCredit = topTransactionCountriesCredit
          .map((country) => country.value)
          .join(", ");
        body.topBeneficiariesCredit = topBeneficiariesCredit;
        body.intendedUses = intendedUses;
        body.taxCountry = taxCountry;
        body.taxNumber = taxNumber?.trim();
      }

      //setBtnLoader(true);
      let obj = await dispatch(
        actions.PostRiskAssessmentInfo(body, { setBtnLoader })
      );
      if (obj.status === "SUCCESS") {
        setBtnLoader(false);
      }
    }
  };

  const updateAdditionalBusinessDetails = async () => {
    if (!registeredCountry) {
      toast.warn("Registered Country Must Not Be Empty");
    } else if (!registeredDate) {
      toast.warn("Registered Date Must Not Be Empty");
    } else if (
      businessType.toLowerCase() == "public_company" &&
      !listedExchangeValue
    ) {
      toast.warn("Listed Exchange Must Not Be Empty");
    } else if (businessType.toLowerCase() == "trust" && !unregulatedTrust) {
      toast.warn("Unregulated Trust Type Must Not Be Empty");
    } else if (!TotalEmployeesValues) {
      toast.warn("Total Employees Must Not Be Empty");
    } else if (!AnnualTurnoverValues) {
      toast.warn("Annual Turnover Must Not Be Empty");
    } else if (!IndustrySectorValues) {
      toast.warn("Industry Sector Must Not Be Empty");
    } else if (!selectedCopValues) {
      toast.warn("Country Of Operation Must Not Be Empty");
    } else if (!selectedTCValues) {
      toast.warn("Transaction Countries Must Not Be Empty");
    } else if (!IntendedUseOfAccountValues && region !== "EU") {
      toast.warn("Intended Use Of Account Must Not Be Empty");
    } else if (region === "CA" && !businessDesc) {
      toast.warn("Business Description Must Not Be Empty.");
    } else if ((region === "EU" || region === "CA") && !taxCountry) {
      toast.warn("Tax Country Must Not Be Empty.");
    } else if ((region === "EU" || region === "CA") && !taxNumber) {
      toast.warn("Tax Number Must Not Be Empty.");
    } else if (region === "EU" && !monthlyTransactionVolumeDebit) {
      toast.warn("Debit: Monthly Transaction Volume Must Not Be Empty.");
    } else if (region === "EU" && !monthlyTransactionsDebit) {
      toast.warn("Debit: Monthly Transactions Must Not Be Empty.");
    } else if (region === "EU" && !averageTransactionValueDebit) {
      toast.warn("Debit: Average Transaction Value Must Not Be Empty.");
    } else if (region === "EU" && !topTransactionCountriesDebit) {
      toast.warn("Debit: Top Transaction Countries Must Not Be Empty.");
    } else if (region === "EU" && !topBeneficiariesDebit) {
      toast.warn("Debit: Top Beneficiaries Debit Must Not Be Empty.");
    } else if (region === "EU" && !monthlyTransactionVolumeCredit) {
      toast.warn("Credit: Monthly Transaction Volume Must Not Be Empty.");
    } else if (region === "EU" && !monthlyTransactionsCredit) {
      toast.warn("Credit: Monthly Transactions Must Not Be Empty.");
    } else if (region === "EU" && !averageTransactionValueCredit) {
      toast.warn("Credit: Average Transaction Value Must Not Be Empty.");
    } else if (region === "EU" && !topTransactionCountriesCredit) {
      toast.warn("Credit: Top Transaction Countries Must Not Be Empty.");
    } else if (region === "EU" && !topBeneficiariesCredit) {
      toast.warn("Credit: Top Beneficiaries Must Not Be Empty.");
    } else if (region === "EU" && !intendedUses) {
      toast.warn("Intended Uses Must Not Be Empty.");
    } else if (!countryIP) {
      toast.warn("Country IP Must Not Be Empty.");
    } else if (!deviceInfo) {
      toast.warn("Device Info Must Not Be Empty.");
    } else if (!ipAddress) {
      toast.warn("IP Address Must Not Be Empty.");
    } else if (!sessionId) {
      toast.warn("Session Id Must Not Be Empty.");
    } else {
      let body = {
        businessRegistrationNumber: internalBusinessId?.trim(),
        email: sessionStorage.getItem("lastemail")?.trim(),
        registeredCountry: registeredCountry,
        registeredDate: registeredDate
          ? dayjs(registeredDate).format("YYYY-MM-DD")
          : "",

        listedExchange: listedExchangeValue,
        // registrationType: registrationType,
        // legislationName: legislationName,
        // legislationType: legislationType,
        website: website?.trim(),
        // taxCountry: taxCountry,
        // taxNumber: taxNumber,
        regulatedTrustType: regulatedTrust,
        unregulatedTrustType: unregulatedTrust,
        totalEmployees: TotalEmployeesValues,
        annualTurnover: AnnualTurnoverValues,
        industrySector: IndustrySectorValues,
        countryOfOperation: selectedCopValues,
        // travelRestrictedCountry: travelRestrictedCountry,
        // restrictedCountries: restrictedCountries,
        // ofacLicencePresent: ofacLicencePresent,
        searchId: searchId,
        transactionCountries: selectedTCValues,
        intendedUseOfAccount: IntendedUseOfAccountValues,
        businessType: businessType,
        businessKybMode: businessKybMode,
        region: region?.trim(),
        countryIP: countryIP,
        deviceInfo: deviceInfo,
        ipAddress: ipAddress,
        sessionId: sessionId,
      };

      if (region === "CA") {
        body.businessDescription = businessDesc?.trim();
        body.taxNumber = taxNumber?.trim();
        body.taxCountry = taxCountry;
        body.taxNumber = taxNumber?.trim();
      }

      if (region === "EU") {
        body.monthlyTransactionVolumeDebit = monthlyTransactionVolumeDebit;
        body.monthlyTransactionsDebit = monthlyTransactionsDebit;
        body.averageTransactionValueDebit = averageTransactionValueDebit;
        body.topTransactionCountriesDebit = topTransactionCountriesDebit
          .map((country) => country.value)
          .join(", ");
        body.topBeneficiariesDebit = topBeneficiariesDebit;
        body.monthlyTransactionVolumeCredit = monthlyTransactionVolumeCredit;
        body.monthlyTransactionsCredit = monthlyTransactionsCredit;
        body.averageTransactionValueCredit = averageTransactionValueCredit;
        body.topTransactionCountriesCredit = topTransactionCountriesCredit
          .map((country) => country.value)
          .join(", ");
        body.topBeneficiariesCredit = topBeneficiariesCredit;
        body.intendedUses = intendedUses;

        body.taxCountry = taxCountry;
        body.taxNumber = taxNumber?.trim();
      }

      setBtnLoader(true);
      let obj = await dispatch(actions.PatchRiskAssessmentInfo(body));
      if (obj.status === "SUCCESS") {
        setBtnLoader(false);
      }
    }
  };

  //Debit
  const [monthlyTransactionVolumeDebit, setMonthlyTransactionVolumeDebit] =
    useState(null);
  const [monthlyTransactionsDebit, setMonthlyTransactionsDebit] =
    useState(null);
  const [averageTransactionValueDebit, setAverageTransactionValueDebit] =
    useState(null);
  const [topTransactionCountriesDebit, setTopTransactionCountriesDebit] =
    useState(null);
  const [topBeneficiariesDebit, setTopBeneficiariesDebit] = useState("");

  //Intended Uses
  const [intendedUses, setIntendedUses] = useState(null);

  //Credit
  const [monthlyTransactionVolumeCredit, setMonthlyTransactionVolumeCredit] =
    useState(null);
  const [monthlyTransactionsCredit, setMonthlyTransactionsCredit] =
    useState(null);
  const [averageTransactionValueCredit, setAverageTransactionValueCredit] =
    useState(null);
  const [topTransactionCountriesCredit, setTopTransactionCountriesCredit] =
    useState(null);
  const [topBeneficiariesCredit, setTopBeneficiariesCredit] = useState("");

  const [countryIP, setCountryIP] = useState("");
  const [deviceInfo, setDeviceInfo] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const initializeData = async () => {
      if (isNaN(lastScreenCompleted) || lastScreenCompleted < 2) {
        const fetchVal = await fetchIpToken();
        if (fetchVal) {
          setCountryIP(fetchVal.country);
          setIpAddress(fetchVal.ip);
        }

        setDeviceInfo(navigator.userAgent);
        setSessionId(sessionStorage.getItem("_session"));
      }
    };

    initializeData();
  }, []);

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
                  src="/onboarding/accounts/businessDetails/legDet.svg"
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
                Legal Details
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
                <img
                  className="arrow-icon15"
                  alt=""
                  src="/onboarding/arrow2.svg"
                />
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
                <div className="input-group w-50 me-2 pb-0">
                  <select
                    id="registeredCountry"
                    name="country"
                    className="form-input my-0 pb-0"
                    onChange={(e) => {
                      handleRegisteredCountry(e);
                    }}
                    value={registeredCountry}
                  >
                    <option value=""></option>
                    {listCountry.map((item) => {
                      return (
                        <option value={item.code}>{item.description}</option>
                      );
                    })}
                  </select>
                  <label htmlFor="country" className="form-input-label ps-1">
                    Registered Country
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
                <div
                  className="input-group w-50 ms-2 pb-0"
                  onBlur={() => preventFutureDates(registeredDate)}
                >
                  {/* <input
                    maxLength={255}
                    type="date"
                    max={getCurrentDate()}
                    id="registeredDate"
                    name="country"
                    onBlur={(e) => {
                      preventFutureDates(e);
                    }}
                    onChange={(e) => setRegisteredDate(e.target.value)}
                    className="form-input my-0 pb-0"
                    value={registeredDate}
                  /> */}

                  <DatePicker
                    views={["year", "month", "day"]}
                    format="DD/MM/YYYY"
                    onChange={(newDate) => {
                      setRegisteredDate(newDate);
                    }}
                    className="form-input my-0 pb-0 date-picker"
                    value={registeredDate}
                    disableFuture
                    sx={{
                      "& .MuiOutlinedInput-input": {
                        padding: "25px 0 10px 5px",
                      },
                    }}
                  />
                  <label htmlFor="country" className="form-input-label ps-1">
                    Registered Date
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
              </div>

              <div className="d-flex align-self-stretch">
                {businessType === "PUBLIC_COMPANY" ? (
                  <>
                    <div
                      className="input-group w-100 me-2"
                      id="listedExchangeDiv"
                    >
                      <select
                        id="listedExchange"
                        name="country"
                        className="form-input my-0 pb-0"
                        onChange={(e) => setListedExchange(e.target.value)}
                        value={listedExchangeValue}
                      >
                        <option value="">Select Exchange</option>
                        {listedExchange.map((item) => {
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
                        Listed Exchange
                        <span
                          className="mx-1"
                          style={{ color: "red" }}
                          id="listedExchangeLabel"
                        ></span>
                      </label>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className="input-group w-100 ms-2">
                  <input
                    maxLength={255}
                    type="text"
                    name="Website"
                    className="form-input my-0 pb-0"
                    onInput={(e) => setWebsite(e.target.value)}
                    value={website}
                    onBlur={(e) =>
                      validations.website(e.target.value, e.target.name)
                    }
                  />
                  <label
                    htmlFor="businesstype"
                    className="form-input-label ps-1"
                  >
                    Website
                  </label>
                  <img
                    className="cross-circle-icon1"
                    alt=""
                    src="/onboarding/cross-circle1.svg"
                  />
                </div>
              </div>

              {region === "CA" ? (
                <>
                  <div className="d-flex align-self-stretch">
                    <div
                      style={{
                        display: "grid",
                        gridGap: "15px",
                        width: " 100%",
                      }}
                    >
                      <label htmlFor="country">
                        Business Description
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </label>
                      <textarea
                        id="businessDescription"
                        className="business-desc"
                        placeholder="A short summary highlighting your business's core activities..."
                        maxLength={65535}
                        value={businessDesc}
                        onInput={(e) => {
                          setBusinessDesc(e.target.value);
                        }}
                        onBlur={(e) =>
                          validations.name(e.target.value, e.target.name)
                        }
                      ></textarea>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </form>
          </div>
        </div>

        {businessType === "TRUST" ? (
          <>
            <div className="accordion-item border-0" id="regulatoryDetailsDiv">
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
                      src="/onboarding/accounts/businessDetails/regDet.svg"
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
                    Regulatory Details
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
                    <img
                      className="arrow-icon15"
                      alt=""
                      src="/onboarding/arrow2.svg"
                    />
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
                        maxLength={255}
                        type="text"
                        id="regulatedTrustType"
                        className="form-input my-0 pb-0"
                        value={regulatedTrust}
                        onInput={(e) => setRegulatedTrust(e.target.value)}
                      />
                      <label
                        htmlFor="businesstype"
                        className="form-input-label ps-1"
                      >
                        Regulated Trust Type
                      </label>
                      <img
                        className="cross-circle-icon1"
                        alt=""
                        src="/onboarding/cross-circle1.svg"
                      />
                    </div>
                  </div>
                  <div className="d-flex align-self-stretch">
                    <div className="input-group w-100 pb-0">
                      <select
                        id="unregulatedTrustType"
                        name="country"
                        className="form-input my-0 pb-0"
                        value={unregulatedTrust}
                        onChange={(e) => setUnregulatedTrust(e.target.value)}
                      >
                        <option value=""></option>
                        {unregulatedTrustType.map((item) => {
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
                        Unregulated Trust Type
                        <span
                          className="mx-1"
                          style={{ color: "red" }}
                          id="unregulatedTrustTypeLabel"
                        >
                          *
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="d-flex align-self-stretch d-none">
                    <div className="input-group w-50 me-2 pb-0">
                      <input
                        maxLength={255}
                        id="searchId"
                        name="country"
                        className="form-input my-0 pb-0"
                        value={searchId}
                      />
                      <label
                        htmlFor="country"
                        className="form-input-label ps-1"
                      >
                        Search Id
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
                  src="/onboarding/accounts/businessDetails/riskAssInfo.svg"
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
                Risk Assessment Info
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
                <img
                  className="arrow-icon15"
                  alt=""
                  src="/onboarding/arrow2.svg"
                />
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
                <div className="input-group w-50 me-2 pb-0">
                  <select
                    id="totalEmployees"
                    name="country"
                    className="form-input my-0 pb-0"
                    value={TotalEmployeesValues}
                    onChange={(e) => setTotalEmployeesValues(e.target.value)}
                  >
                    <option value=""></option>
                    {totalEmployees.map((item) => {
                      return (
                        <option value={item.code}>{item.description}</option>
                      );
                    })}
                  </select>
                  <label htmlFor="country" className="form-input-label ps-1">
                    Total Employees
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
                <div className="input-group w-50 ms-2 pb-0">
                  <select
                    id="annualTurnover"
                    name="country"
                    className="form-input my-0 pb-0"
                    value={AnnualTurnoverValues}
                    onChange={(e) => setAnnualTurnoverValues(e.target.value)}
                  >
                    <option value=""></option>
                    {annualTurnover.map((item) => {
                      return (
                        <option value={item.code}>{item.description}</option>
                      );
                    })}
                  </select>
                  <label htmlFor="country" className="form-input-label ps-1">
                    Annual Turnover
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
              </div>
              <div className="d-flex align-self-stretch">
                <div className="input-group w-100 me-2 pb-0">
                  <select
                    id="industrySector"
                    name="country"
                    className="form-input my-0 pb-0"
                    value={IndustrySectorValues}
                    onChange={(e) => setIndustrySectorValues(e.target.value)}
                  >
                    <option value=""></option>
                    {industrySector
                      .filter((item) => {
                        // Convert the description to lowercase and check if it includes "adult" or "crypto"
                        const lowerCaseDescription =
                          item.description.toLowerCase();
                        return (
                          !lowerCaseDescription.includes("adult") &&
                          !lowerCaseDescription.includes("crypto") &&
                          !lowerCaseDescription.includes("gambling") &&
                          !lowerCaseDescription.includes("tobacco") &&
                          !lowerCaseDescription.includes("dating")
                        );
                      })
                      .map((item) => {
                        return (
                          <option key={item.code} value={item.code}>
                            {item.description}
                          </option>
                        );
                      })}
                  </select>
                  <label htmlFor="country" className="form-input-label ps-1">
                    Industry Sector
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
              </div>

              {/* Country of operation */}
              <div className="d-flex align-self-stretch my-3">
                <div className="input-group w-100 ms-2 pb-0">
                  <Select
                    id="countryOfOperation"
                    name="country"
                    className="form-input my-0 pb-0"
                    value={copValues}
                    options={options}
                    styles={customStyles}
                    isMulti
                    onChange={handleCopChange}
                  ></Select>
                  <label htmlFor="country" className="form-input-label ps-1">
                    Country(ies) of Operation (select as many as needed, one at
                    a time)
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
              </div>

              {/* Hiding travel restricted country and restricted countries */}
              <div className="d-flex align-self-stretch d-none">
                <div className="input-group w-50 me-2 pb-0">
                  <select
                    id="travelRestrictedCountry"
                    name="country"
                    className="form-input my-0 pb-0"
                  >
                    <option value=""></option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                  <label htmlFor="country" className="form-input-label ps-1">
                    Travel Restricted Country
                  </label>
                </div>
                <div className="input-group w-50 ms-2 pb-0">
                  <select
                    id="restrictedCountries"
                    name="country"
                    className="form-input my-0 pb-0"
                  ></select>
                  <label htmlFor="country" className="form-input-label ps-1">
                    Restricted Countries
                  </label>
                </div>
              </div>
              {/* Hiding travel restricted country and restricted countries */}

              {region === "EU" ? (
                <></>
              ) : (
                <>
                  <div className="d-flex align-self-stretch">
                    <div className="input-group w-50 me-2 pb-0 d-none">
                      <select
                        id="ofacLicencePresent"
                        className="form-input my-0 pb-0"
                      >
                        <option value=""></option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                      <label
                        htmlFor="businesstype"
                        className="form-input-label ps-1"
                      >
                        OFAC Licence
                      </label>
                      <img
                        className="cross-circle-icon1"
                        alt=""
                        src="/onboarding/cross-circle1.svg"
                      />
                    </div>
                    <div className="input-group w-100 pb-0">
                      <select
                        id="intendedUseOfAccount"
                        name="country"
                        className="form-input my-0 pb-0"
                        value={IntendedUseOfAccountValues}
                        onChange={(e) =>
                          setIntendedUseOfAccountValues(e.target.value)
                        }
                      >
                        <option value=""></option>
                        {intendedUseOfAccount.map((item) => {
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
                        Intended Use of Account
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="d-flex align-self-stretch my-3">
                <div className="input-group w-100 me-2 pb-0">
                  <Select
                    id="transactionCountries"
                    name="country"
                    className="form-input my-0 pb-0"
                    options={options}
                    styles={customStyles}
                    isMulti
                    value={tCValues}
                    onChange={handleTCChange}
                  ></Select>
                  <label htmlFor="country" className="form-input-label ps-1">
                    Transaction Countries (select as many as needed, one at a
                    time)
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        {region === "CA" && (
          <>
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
                      src="/onboarding/accounts/businessDetails/taxDet.svg"
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
                    Tax Details
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
                    <img
                      className="arrow-icon15"
                      alt=""
                      src="/onboarding/arrow2.svg"
                    />
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
                      <select
                        id="taxCountry"
                        name="country"
                        className="form-input my-0 pb-0"
                        value={taxCountry}
                        onChange={(e) => setTaxCountry(e.target.value)}
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
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </label>
                    </div>
                    <div className="input-group w-50 ms-2 pb-0">
                      <input
                        maxLength={255}
                        type="text"
                        name="Tax Number"
                        className="form-input my-0 pb-0"
                        value={taxNumber}
                        onInput={(e) => setTaxNumber(e.target.value)}
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
                        Tax Number
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </label>
                      <img
                        className="cross-circle-icon1"
                        alt=""
                        src="/onboarding/cross-circle1.svg"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {region === "EU" ? (
          <>
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
                      src="/onboarding/accounts/businessDetails/taxDet.svg"
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
                    Tax Details
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
                    <img
                      className="arrow-icon15"
                      alt=""
                      src="/onboarding/arrow2.svg"
                    />
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
                      <select
                        id="taxCountry"
                        name="country"
                        className="form-input my-0 pb-0"
                        value={taxCountry}
                        onChange={(e) => setTaxCountry(e.target.value)}
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
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </label>
                    </div>
                    <div className="input-group w-50 ms-2 pb-0">
                      <input
                        maxLength={255}
                        type="text"
                        name="Tax Number"
                        className="form-input my-0 pb-0"
                        value={taxNumber}
                        onInput={(e) => setTaxNumber(e.target.value)}
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
                        Tax Number
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </label>
                      <img
                        className="cross-circle-icon1"
                        alt=""
                        src="/onboarding/cross-circle1.svg"
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
                data-bs-target="#collapseSix"
                aria-expanded="true"
                aria-controls="collapseSix"
              >
                <div className={status}>
                  <div className="file-zip-parent">
                    <ReactSVG
                      src="/onboarding/accounts/businessDetails/riskAssInfo.svg"
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
                    Expected Account Usage
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
                    <img
                      className="arrow-icon15"
                      alt=""
                      src="/onboarding/arrow2.svg"
                    />
                  </div>
                </div>
              </button>
              <div
                id="collapseSix"
                className="accordion-collapse collapse"
                aria-labelledby="headingSix"
                data-bs-parent="#accordionExample"
              >
                <form className="form">
                  <div className="debit w-100 d-flex flex-column gap-3">
                    <h3 className="w-100 my-2 text-dark-75">Debit</h3>
                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-50 me-2 pb-0">
                        <select
                          id="monthlyTransactionVolume"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={monthlyTransactionVolumeDebit}
                          onChange={(e) => {
                            setMonthlyTransactionVolumeDebit(e.target.value);
                          }}
                        >
                          <option value=""></option>
                          {monthlyTransactionVolumeList.map((item) => {
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
                          Monthly Transaction Volume
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                      <div className="input-group w-50 ms-2 pb-0">
                        <select
                          id="annualTurnover"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={monthlyTransactionsDebit}
                          onChange={(e) =>
                            setMonthlyTransactionsDebit(e.target.value)
                          }
                        >
                          <option value=""></option>
                          {monthlyTransactionsList.map((item) => {
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
                          Monthly Transactions
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-100 me-2 pb-0">
                        <select
                          id="averageTransactionValue"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={averageTransactionValueDebit}
                          onChange={(e) =>
                            setAverageTransactionValueDebit(e.target.value)
                          }
                        >
                          <option value=""></option>
                          {averageTransactionValueList.map((item) => {
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
                          Average Transaction Value
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Country of operation */}
                    <div className="d-flex align-self-stretch ">
                      <div className="input-group w-100 me-2 pb-0">
                        <Select
                          id="topTransactionCountries"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={topTransactionCountriesDebit}
                          options={listCountry.map((item) => {
                            return {
                              label: item.description,
                              value: item.code,
                            };
                          })}
                          styles={customStyles}
                          isMulti
                          onChange={(selectedOption) =>
                            setTopTransactionCountriesDebit(selectedOption)
                          }
                        ></Select>
                        <label
                          htmlFor="country"
                          className="form-input-label ps-1"
                        >
                          Top Transaction Countries (select as many as needed,
                          one at a time)
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="d-flex align-self-stretch ">
                      <div className="input-group w-100 me-2 pb-0">
                        {/* <Select
                          id="topBeneficiaries"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={topBeneficiariesDebit}
                          options={listCountry.map((item) => {
                            return {
                              label: item.description,
                              value: item.code,
                            };
                          })}
                          styles={customStyles}
                          isMulti
                          onChange={(selectedOption) => setTopBeneficiariesDebit(selectedOption)}
                        ></Select> */}

                        <input
                          maxLength={255}
                          type="text"
                          id="topBeneficiaries"
                          className="form-input my-0 pb-0"
                          value={topBeneficiariesDebit}
                          onInput={(e) =>
                            setTopBeneficiariesDebit(e.target.value)
                          }
                          multiple
                        />
                        <label
                          htmlFor="country"
                          className="form-input-label ps-1"
                        >
                          Top Beneficiaries
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="credit w-100 d-flex flex-column gap-3">
                    <h3 className="w-100 my-2 text-dark-75">Credit</h3>
                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-50 me-2 pb-0">
                        <select
                          id="monthlyTransactionVolume"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={monthlyTransactionVolumeCredit}
                          onChange={(e) =>
                            setMonthlyTransactionVolumeCredit(e.target.value)
                          }
                        >
                          <option value=""></option>
                          {monthlyTransactionVolumeList.map((item) => {
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
                          Monthly Transaction Volume
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                      <div className="input-group w-50 ms-2 pb-0">
                        <select
                          id="annualTurnover"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={monthlyTransactionsCredit}
                          onChange={(e) =>
                            setMonthlyTransactionsCredit(e.target.value)
                          }
                        >
                          <option value=""></option>
                          {monthlyTransactionsList.map((item) => {
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
                          Monthly Transactions
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-100 me-2 pb-0">
                        <select
                          id="averageTransactionValue"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={averageTransactionValueCredit}
                          onChange={(e) =>
                            setAverageTransactionValueCredit(e.target.value)
                          }
                        >
                          <option value=""></option>
                          {averageTransactionValueList.map((item) => {
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
                          Average Transaction Value
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Country of operation */}
                    <div className="d-flex align-self-stretch ">
                      <div className="input-group w-100 me-2 pb-0">
                        <Select
                          id="topTransactionCountries"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={topTransactionCountriesCredit}
                          options={listCountry.map((item) => {
                            return {
                              label: item.description,
                              value: item.code,
                            };
                          })}
                          styles={customStyles}
                          isMulti
                          onChange={(selectedOption) =>
                            setTopTransactionCountriesCredit(selectedOption)
                          }
                        ></Select>
                        <label
                          htmlFor="country"
                          className="form-input-label ps-1"
                        >
                          Top Transaction Countries
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="d-flex align-self-stretch ">
                      <div className="input-group w-100 me-2 pb-0">
                        {/* <Select
                          id="topBeneficiaries"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={topBeneficiariesCredit}
                          options={listCountry.map((item) => {
                            return {
                              label: item.description,
                              value: item.code,
                            };
                          })}
                          styles={customStyles}
                          isMulti
                          onChange={(selectedOption) => setTopBeneficiariesCredit(selectedOption)}
                        ></Select> */}

                        <input
                          maxLength={255}
                          name="topBeneficiares"
                          className="form-input my-0 pb-0"
                          value={topBeneficiariesCredit}
                          onInput={(e) =>
                            setTopBeneficiariesCredit(e.target.value)
                          }
                          onBlur={(e) =>
                            validations.name(e.target.value, e.target.name)
                          }
                        />
                        <label
                          htmlFor="country"
                          className="form-input-label ps-1"
                        >
                          Top Beneficiaries
                          <span className="mx-1" style={{ color: "red" }}>
                            *
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="intended-uses w-100">
                    <h3 className="w-100 my-2 text-dark-75">Intended Uses</h3>
                    <div className="d-flex align-self-stretch">
                      <div className="input-group w-100 me-2 pb-0">
                        <select
                          id="intendedUses"
                          name="country"
                          className="form-input my-0 pb-0"
                          value={intendedUses}
                          onChange={(e) => setIntendedUses(e.target.value)}
                        >
                          <option value=""></option>
                          {intendedUseOfAccount.map((item) => {
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
                          Intended Uses
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

      <div className="accordion-item border-0 d-none">
        <button
          className="accordion1 border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseNine"
          aria-expanded="true"
          aria-controls="collapseNine"
        >
          <div className={status}>
            <div className="file-zip-parent">
              <ReactSVG
                src="/onboarding/accounts/businessDetails/riskAssInfo.svg"
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
              Device Details
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
              <img
                className="arrow-icon15"
                alt=""
                src="/onboarding/arrow2.svg"
              />
            </div>
          </div>
        </button>
        <div
          id="collapseNine"
          className="accordion-collapse collapse"
          aria-labelledby="headingNine"
          data-bs-parent="#accordionExample"
        >
          <form className="form">
            <div className="d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <input
                  id="countryIP"
                  name="countryIP"
                  className="form-input my-0 pb-0"
                  value={countryIP}
                  onChange={(e) => setCountryIP(e.target.value)}
                />
                <label htmlFor="country" className="form-input-label ps-1">
                  Country IP
                  <span className="mx-1" style={{ color: "red" }}>
                    *
                  </span>
                </label>
              </div>
              <div className="input-group w-50 ms-2 pb-0">
                <input
                  id="deviceInfo"
                  name="deviceInfo"
                  className="form-input my-0 pb-0"
                  value={deviceInfo}
                  onChange={(e) => setDeviceInfo(e.target.value)}
                />
                <label htmlFor="country" className="form-input-label ps-1">
                  Device Info
                  <span className="mx-1" style={{ color: "red" }}>
                    *
                  </span>
                </label>
              </div>
            </div>

            <div className="d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <input
                  id="ipAddress"
                  name="deviceInfo"
                  className="form-input my-0 pb-0"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                />
                <label htmlFor="country" className="form-input-label ps-1">
                  IP Address
                  <span className="mx-1" style={{ color: "red" }}>
                    *
                  </span>
                </label>
              </div>
              <div className="input-group w-50 ms-2 pb-0">
                <input
                  id="sessionId"
                  name="deviceInfo"
                  className="form-input my-0 pb-0"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                />
                <label htmlFor="country" className="form-input-label ps-1">
                  Session ID
                  <span className="mx-1" style={{ color: "red" }}>
                    *
                  </span>
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>

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
        {lastScreenCompleted >= 2 ? (
          <>
            <button
              id="updateRiskAssessmentInfo"
              className="update-btn"
              type="button"
              onClick={() => {
                updateAdditionalBusinessDetails();
              }}
            >
              {btnLoader ? (
                <>
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
              id="submitRiskAssessmentInfo"
              className="submit-btn"
              type="button"
              onClick={() => {
                submitAdditionalBusinessDetails();
              }}
            >
              {btnLoader ? (
                <>
                  <ScaleLoader height={20} width={5} color="white" />
                </>
              ) : (
                <>
                  <img
                    className="check-double-icon"
                    alt=""
                    src="/onboarding/submit-icon.svg"
                  />
                  <div className="label7 submitBtn">Submit</div>
                </>
              )}
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default businessDetails;
