import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";
import { ReactSVG } from "react-svg";
import * as functions from "./functions/business-details-functions.js";
import * as utilities from "./functions/utility-details-function.js";
import Modal from "./modals/CorporateDetailsModal.js";
import { toast } from "react-toastify";
import ContentLoader from "react-content-loader";
import "./css/general.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setBRN,
  setBusinessType,
  setBusinessKybMode,
  setBusinessName,
  setSearchId,
} from "../../../../@redux/features/onboardingFeatures.js";
import * as actions from "../../../../@redux/action/onboardingAction.js";
import CustomModal from "../../../structure/NewStructures/CustomModal.js";
import { ScaleLoader } from "react-spinners";
import * as restrictions from "../tabs/functions/restrictInput.js";

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
    const alphanumericRegex = /^[A-Za-z0-9 ]+$/;
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
};

function BusinessIncorporationDetails({ businessTypes, listCountry }) {
  const dispatch = useDispatch();
  const [btnLoader, setBtnLoader] = useState(false);
  const [response, setResponse] = useState([]);
  const [modalIsOpen, setModalOpen] = useState(false);
  const [region, setRegion] = useState(sessionStorage.getItem("region"));

  const list = ["progress", "pending", "approve"];
  const [status, setStatus] = useState();

  var internalBusinessId = useSelector(
    (state) => state.onboarding?.UserStatusObj?.internalBusinessId
  );
  var lastScreenCompleted = useSelector(
    (state) => state.onboarding?.UserStatusObj?.lastScreenCompleted
  );
  var userStatus = useSelector(
    (state) => state.onboarding?.UserStatusObj?.userStatus
  );

  let brn = useSelector((state) => state.onboarding?.brn);
  let userAttr = useSelector(
    (state) => state.onboarding?.UserCognitoDetails?.userAttributes
  );

  useEffect(() => {
    let businessName =
      userAttr &&
      userAttr.find((item) => item.name === "custom:businessName")?.value;

    if (businessName) {
      dispatch(setBusinessName(businessName));
    }
  }, [userAttr]);

  let businessType = useSelector((state) => state.onboarding?.businessType);
  let businessKybMode = useSelector(
    (state) => state.onboarding?.businessKybMode
  );
  let businessName = useSelector((state) => state.onboarding?.businessName);
  const [togglePartnerAssoc, setTogglePartnerAssoc] = useState("none");
  const [tradeName, setTradeName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerState, setPartnerState] = useState("");
  const [partnerCountry, setPartnerCountry] = useState(null);
  const [associationName, setAssociationName] = useState("");
  const [associationNumber, setAssociationNumber] = useState("");
  const [associationChairperson, setAssociationChairperson] = useState("");

  const [regAddress1, setRegAddress1] = useState("");
  const [regAddress2, setRegAddress2] = useState("");
  const [regState, setRegState] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regPostcode, setRegPostcode] = useState("");
  const [regCountry, setRegCountry] = useState(null);

  const [showBusinessAddress, setShowBusinessAddress] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const [businessAddress1, setBusinessAddress1] = useState("");
  const [businessAddress2, setBusinessAddress2] = useState("");
  const [businessState, setBusinessState] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [businessPostcode, setBusinessPostcode] = useState("");
  const [businessCountry, setBusinessCountry] = useState(null);

  useEffect(() => {
    const SetPage = async () => {
      if (internalBusinessId) {
        if (Number(lastScreenCompleted) >= 1) {
          if (userStatus && userStatus == "C") {
            setStatus(list[2]);
          } else {
            setStatus(list[1]);
          }
        }
        fillBusinessDetails();
      }
    };

    setStatus(list[0]);

    SetPage();
  }, [businessTypes, listCountry, lastScreenCompleted]);

  const [loadingList, setLoadingList] = useState(false);
  //Debounced state implementation
  const debouncedSetStateRef = useRef(null);

  const DEBOUNCE_TIME = 0;

  const handleBRNChange = async (brnValue) => {
    if (internalBusinessId) {
      return;
    } else {
      clearTimeout(debouncedSetStateRef.current);

      if (brnValue.length < 6) {
        toast.error(
          "Business Registration Number should be between 6-30 digits long."
        );
        return;
      }

      debouncedSetStateRef.current = setTimeout(async () => {
        const businessRegistrationNumber = brnValue;

        if (businessRegistrationNumber) {
          setLoadingList(true);

          const FetchOnboardingDetails = await dispatch(
            actions.FetchOnboardingDetails(businessRegistrationNumber)
          );
          if (FetchOnboardingDetails) {
            if (FetchOnboardingDetails.internalBusinessId) {
              setLoadingList(false);
              toast.error(
                `Business Registration Number: ${businessRegistrationNumber} already exists, please try again with a new one...`
              );
              setBRN("");
              return;
            }

            try {
              const result = await dispatch(
                actions.GetCorporateDetailsList(
                  businessRegistrationNumber,
                  region
                )
              );

              setLoadingList(false);
              if (result.status !== "BAD_REQUEST") {
                setResponse(result);
                setModalOpen(true);
              } else {
                toast.error(
                  "Error in fetching business list: " + result.message
                );
              }
            } catch (error) {
              setLoadingList(false);
              toast.error("Error in fetching business list: " + error.message);
            }
          }
        }
      }, DEBOUNCE_TIME);
    }
  };

  const handleBusinessTypeChange = (selectedOption) => {
    dispatch(setBusinessType(selectedOption));
    if (selectedOption == "PARTNERSHIP") {
      setTogglePartnerAssoc("PARTNERSHIP");
    } else if (selectedOption == "ASSOCIATION") {
      setTogglePartnerAssoc("ASSOCIATION");
    } else {
      setTogglePartnerAssoc("none");
    }
  };

  const handleBRN = (e) => {
    var input = e.target;
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, "");
    restrictions.restrictInputBRN(e);
    dispatch(setBRN(input.value));
    //handleBRNChange(e.target.value);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  let businessDetailsObj = useSelector(
    (state) => state.onboarding?.BusinessCorporationDetails
  );
  let businessDetailsNIUMObj = useSelector(
    (state) => state.onboarding?.businessDetailsNIUMObj
  );

  useEffect(() => {
    fillBusinessDetails();
  }, [businessDetailsNIUMObj]);

  const fillBusinessDetails = () => {
    let obj;
    if (lastScreenCompleted && lastScreenCompleted >= 1) {
      obj = businessDetailsObj;

      if (obj.status === "BAD_REQUEST") {
        return;
      }
      //Filling Data when it's available
      dispatch(setBRN(obj.internalBusinessId));
      dispatch(setBusinessName(obj.businessName));
      dispatch(setBusinessType(obj.businessType));

      if (obj.tradeName) {
        setTradeName(obj.tradeName);
      }

      if (obj.businessType.toLowerCase() == "partnership") {
        setPartnerName(obj.partnerName);
        setPartnerState(obj.partnerState);
        setPartnerCountry(obj.partnerCountry);
      } else if (obj.businessType.toLowerCase() == "association") {
        setAssociationName(obj.associationName);
        setAssociationNumber(obj.associationNumber);
        setAssociationChairperson(obj.associationChairPerson);
      }

      if (obj.businessKybMode) {
        dispatch(setBusinessKybMode(obj.businessKybMode));
      }

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
        setRegAddress1(obj.registrationAddress_1);
        setRegAddress2(obj.registrationAddress_2 || "");
        setRegCity(obj.registrationCity || "");
        setRegState(obj.registrationState || "");
        setRegPostcode(obj.registrationPostCode);
        setRegCountry(obj.registrationCountry);
      }

      if (businessKeys.length != 0) {
        setBusinessAddress1(obj.businessAddress_1);
        setBusinessAddress2(obj.businessAddress_2 || "");
        setBusinessCity(obj.businessCity || "");
        setBusinessState(obj.businessState || "");
        setBusinessPostcode(obj.businessPostCode);
        setBusinessCountry(obj.businessCountry);
      }

      if (obj.sameBusinessAddress) {
        if (obj.sameBusinessAddress == "yes") {
          setShowBusinessAddress(false);
          setIsChecked(true);
        } else {
          setShowBusinessAddress(true);
          setIsChecked(false);
        }
      }
    } else {
      obj = businessDetailsNIUMObj;
      var BusinessDetails = obj.businessDetails;
      if (BusinessDetails) {
        dispatch(setBRN(brn));
        dispatch(setBusinessName(BusinessDetails.businessName));
        dispatch(setSearchId(BusinessDetails.additionalInfo.searchId));

        if (BusinessDetails.businessType) {
          dispatch(setBusinessType(BusinessDetails.businessName));
        }
        if (BusinessDetails.tradeName) {
          setTradeName(BusinessDetails.tradeName);
        }

        if (BusinessDetails.addresses) {
          var address = BusinessDetails.addresses;
          if (address.registeredAddress) {
            setRegAddress1(address.registeredAddress.addressLine1);
            setRegAddress2(address.registeredAddress.addressLine2);

            if (
              address.registeredAddress.city &&
              address.registeredAddress.city != "null"
            ) {
              setRegCity(address.registeredAddress.city);
            }
            if (
              address.registeredAddress.state &&
              address.registeredAddress.state != "null"
            ) {
              setRegState(address.registeredAddress.state);
            }

            setRegPostcode(address.registeredAddress.postcode);
            setRegCountry(address.registeredAddress.country);
          }
        }

        if (BusinessDetails.additionalInfo) {
          var sameBusinessAddress =
            BusinessDetails.additionalInfo.isSameBusinessAddress;
          var address = BusinessDetails.addresses;
          setIsChecked(sameBusinessAddress === "yes" ? true : false);

          if (sameBusinessAddress === "yes") {
            setShowBusinessAddress(false);

            setBusinessAddress1(address.registeredAddress.addressLine1);
            setBusinessAddress2(address.registeredAddress.addressLine2);

            if (
              address.registeredAddress.city &&
              address.registeredAddress.city != "null"
            ) {
              setBusinessCity(address.registeredAddress.city);
            }
            if (
              address.registeredAddress.state &&
              address.registeredAddress.state != "null"
            ) {
              setBusinessState(address.registeredAddress.state);
            }

            setBusinessPostcode(address.registeredAddress.postcode);
            setBusinessCountry(address.registeredAddress.country);
          } else if (sameBusinessAddress === "no") {
            setShowBusinessAddress(true);

            if (address.businessAddress) {
              setBusinessAddress1(address.businessAddress.addressLine1);
              setBusinessAddress2(address.businessAddress.addressLine2);

              if (
                address.businessAddress.city &&
                address.businessAddress.city != "null"
              ) {
                setBusinessCity(address.businessAddress.city);
              }

              if (
                address.businessAddress.state &&
                address.businessAddress.state != "null"
              ) {
                setBusinessState(address.businessAddress.state);
              }
              setBusinessPostcode(address.businessAddress.postcode);
              setBusinessCountry(address.businessAddress.country);
            }
          } else {
            setShowBusinessAddress(true);
            setBusinessAddress1("");
            setBusinessAddress2("");
            setBusinessState("");
            setBusinessCity("");
            setBusinessPostcode("");
            setBusinessCountry(null);
          }
        }
      }
    }
  };

  const ModalContent = () => {
    const [searchInput, setSearchInput] = useState("");
    const [FetchingData, setFetchingData] = useState(false);
    const [dataLoader, setDataLoader] = useState(false);
    const [LoaderText, setLoaderText] = useState(
      "Fetching your business details, please wait..."
    );

    // Filtered response based on search input
    const filteredResponse = response.filter(
      (eachData) =>
        eachData.businessName
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        eachData.businessRegistrationNumber
          .toLowerCase()
          .includes(searchInput.toLowerCase())
    );

    const handleOptionClick = async (brn) => {
      setDataLoader(true); // Start loader at the beginning
      try {
        dispatch(setBusinessKybMode("E_KYB"));

        const obj = await dispatch(
          actions.GetCorporateDetailsNIUM(region, brn)
        );

        if (obj?.results?.businessDetails?.length > 0) {
          // Business details were successfully retrieved
          setDataLoader(false);
        } else {
          // Handle case where business details are empty or missing
          setDataLoader(false);
          console.warn("No business details found.");
        }
      } catch (error) {
        console.error("Error fetching corporate details:", error);
        setDataLoader(false); // Ensure loader is stopped on error
      } finally {
        handleCloseModal(); // Close modal regardless of success or error
      }
    };

    return (
      <>
        {FetchingData ? (
          <>
            <div
              className="p-3 d-flex flex-column align-items-center justify-content-center gap-5"
              style={{ height: "500px" }}
            >
              <ScaleLoader size={50} color="black" />
              {LoaderText}
            </div>
          </>
        ) : (
          <>
            <div className="arrange-modal-content">
              {filteredResponse.length > 0 ? (
                <>
                  <div className="p-3" style={{ flex: "0 0 auto" }}>
                    <div className="search-main-div">
                      <input
                        maxLength={255}
                        type="text"
                        placeholder="Search businesses..."
                        className="search-input"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                      <img
                        src="/search.svg"
                        alt=""
                        width={30}
                        className="search-img"
                      />
                    </div>
                  </div>

                  {dataLoader ? (
                    <>
                      <div
                        className="p-3 d-flex flex-column align-items-center justify-content-center gap-5"
                        style={{ height: "500px" }}
                      >
                        <ScaleLoader size={50} color="black" />
                        {LoaderText}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="corporate-list-div">
                        {filteredResponse.map((eachData, key) => (
                          <>
                            <div
                              type="button"
                              className="corporate-list"
                              name="corporateList"
                              data-value={eachData.businessRegistrationNumber}
                              key={key}
                              onClick={() =>
                                handleOptionClick(
                                  eachData.businessRegistrationNumber
                                )
                              }
                            >
                              <img
                                className=""
                                src={`/business/${
                                  eachData.businessType?.includes("SOLE")
                                    ? "sole"
                                    : eachData.businessType?.includes("PRIVATE")
                                    ? "private"
                                    : eachData.businessType?.includes("PUBLIC")
                                    ? "public"
                                    : eachData.businessType?.includes(
                                        "PARTNERSHIP"
                                      )
                                    ? "partnership"
                                    : "others"
                                }.png`}
                                alt=""
                                width={40}
                              />

                              <div className="business-label-div">
                                <div className="business-label">
                                  {" "}
                                  {eachData.businessName} (
                                  {eachData.businessRegistrationNumber})
                                </div>
                                <div className="business-label-info"></div>
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="no-result-div">
                  <img src="/no-result.gif" alt="" />
                </div>
              )}

              <div className="buttons-div" style={{ padding: 0 }}>
                <button
                  type="button"
                  className="submit-btn w-100 rounded-3"
                  onClick={() => {
                    dispatch(setBusinessKybMode("M_KYB"));
                    handleCloseModal();
                  }}
                >
                  Click here if you cannot find your business from the above
                  list......
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const copyAddress = (checkbox) => {
    setIsChecked(checkbox.target.checked);
    if (checkbox.target.checked) {
      setShowBusinessAddress(false);
      setBusinessAddress1(regAddress1);
      setBusinessAddress2(regAddress2);
      setBusinessState(regState);
      setBusinessCity(regCity);
      setBusinessPostcode(regPostcode);
      setBusinessCountry(regCountry);
    } else {
      setShowBusinessAddress(true);
      setBusinessAddress1("");
      setBusinessAddress2("");
      setBusinessState("");
      setBusinessCity("");
      setBusinessPostcode("");
      setBusinessCountry(null);
    }
  };

  const submitBusinessAddressDetails = async () => {
    let sameBusinessAddress;

    if (isChecked) {
      sameBusinessAddress = "yes";
    } else {
      sameBusinessAddress = "no";
    }

    //Business Details validation check
    if (!brn) {
      toast.warn("Business Registration Number Must Not Be Empty.");
    } else if (!businessName) {
      toast.warn("Business Name Must Not Be Empty.");
    } else if (!businessType) {
      toast.warn("Business Type Must Not Be Empty.");
    } else if (businessType == "ASSOCIATION" && associationName == "") {
      toast.warn("Association Name Cannot Be Empty");
    } else if (businessType == "ASSOCIATION" && associationNumber == "") {
      toast.warn("Association Number Cannot Be Empty");
    } else if (businessType == "ASSOCIATION" && associationChairperson == "") {
      toast.warn("Association ChairPerson Cannot Be Empty");
    } else if (region === "UK" || (region === "HK" && !tradeName)) {
      toast.warn("Trade Name Must Not Be Empty!");
    } else if (
      region === "EU" &&
      businessType !== "ASSOCIATION" &&
      businessType !== "SOLE_TRADER" &&
      businessType !== "TRUST" &&
      !tradeName
    ) {
      toast.warn("Trade Name Must Not Be Empty!");
    }

    //Registered Address Details exception handling
    else if (!regAddress1) {
      toast.warn("Registered Address 1 Must Not Be Empty!");
    } else if (
      (region === "EU" || region === "CA" || region === "HK") &&
      !regCity
    ) {
      toast.warn("Registered City Must Not Be Empty!");
    } else if (
      (region === "EU" || region === "CA" || region === "HK") &&
      !regState
    ) {
      toast.warn("Registered State Must Not Be Empty!");
    } else if (!regPostcode) {
      toast.warn("Registered Post Code Must Not Be Empty!");
    } else if (regPostcode.length < 3 || regPostcode.length > 10) {
      toast.warn(
        "Registered Postcode must be between 3 to 10 characters in length"
      );
    } else if (!regCountry) {
      toast.warn("Registered Country Must Not Be Empty!");
    }

    //Business Address Details exception handling
    else if (sameBusinessAddress == "no" && !businessAddress1) {
      toast.warn("Business Address 1 Must Not Be Empty!");
    } else if (
      sameBusinessAddress == "no" &&
      (region === "EU" || region === "CA" || region === "HK") &&
      !businessCity
    ) {
      toast.warn("Business City Must Not Be Empty!");
    } else if (
      sameBusinessAddress == "no" &&
      (region === "EU" || region === "CA" || region === "HK") &&
      !businessState
    ) {
      toast.warn("Business State Must Not Be Empty!");
    } else if (sameBusinessAddress == "no" && !businessPostcode) {
      toast.warn("Business Post Code Must Not Be Empty!");
    } else if (
      (sameBusinessAddress == "no" && businessPostcode.length < 3) ||
      businessPostcode.length > 10
    ) {
      toast.warn(
        "Business Postcode must be between 3 to 10 characters in length"
      );
    } else if (sameBusinessAddress == "no" && !businessCountry) {
      toast.warn("Business Country Must Not Be Empty!");
    }

    //When no expection found, triggering the API
    else {
      let requestBody = {
        email: sessionStorage.getItem("lastemail")?.trim(),
        businessRegistrationNumber: brn?.trim(),
        businessName: businessName?.trim(),
        businessType: businessType?.trim(),
        tradeName: tradeName?.trim(),

        partnerName: partnerName?.trim(),
        partnerState: partnerState?.trim(),
        partnerCountry: partnerCountry?.trim(),

        associationName: associationName?.trim(),
        associationNumber: associationNumber?.trim(),
        associationChairPerson: associationChairperson?.trim(),

        //Registered Address as params - temporary
        registrationAddress_1: regAddress1?.trim(),
        registrationAddress_2: regAddress2?.trim(),
        registrationCity: regCity?.trim(),
        registrationState: regState?.trim(),
        registrationPostCode: regPostcode?.trim(),
        registrationCountry: regCountry?.trim(),
        sameBusinessAddress: sameBusinessAddress?.trim(),

        //Registered Address as params - temporary
        businessAddress_1: businessAddress1?.trim(),
        businessAddress_2: businessAddress2?.trim(),
        businessCity: businessCity?.trim(),
        businessState: businessState?.trim(),
        businessPostCode: businessPostcode?.trim(),
        businessCountry: businessCountry?.trim(),

        businessKybMode: businessKybMode?.trim(),
      };

      setBtnLoader(true);
      let obj = await dispatch(actions.PostBusinessAddressDetails(requestBody));
      if (obj?.status === "SUCCESS") {
        setBtnLoader(false);
      } else {
        setBtnLoader(false);
      }
    }
  };

  const updateBusinessAddressDetails = async () => {
    let sameBusinessAddress;

    if (isChecked) {
      sameBusinessAddress = "yes";
    } else {
      sameBusinessAddress = "no";
    }

    //Business Details validation check
    if (!internalBusinessId) {
      toast.warn("Business Registration Number Must Not Be Empty.");
    } else if (!businessName) {
      toast.warn("Business Name Must Not Be Empty.");
    } else if (!businessType) {
      toast.warn("Business Type Must Not Be Empty.");
    } else if (businessType == "ASSOCIATION" && associationName == "") {
      toast.warn("Association Name Cannot Be Empty");
    } else if (businessType == "ASSOCIATION" && associationNumber == "") {
      toast.warn("Association Number Cannot Be Empty");
    } else if (businessType == "ASSOCIATION" && associationChairperson == "") {
      toast.warn("Association ChairPerson Cannot Be Empty");
    } else if (region === "UK" || (region === "HK" && !tradeName)) {
      toast.warn("Trade Name Must Not Be Empty!");
    } else if (
      region === "EU" &&
      businessType !== "ASSOCIATION" &&
      businessType !== "SOLE_TRADER" &&
      businessType !== "TRUST" &&
      !tradeName
    ) {
      toast.warn("Trade Name Must Not Be Empty!");
    }

    //Registered Address Details exception handling
    else if (!regAddress1) {
      toast.warn("Registered Address 1 Must Not Be Empty!");
    } else if (
      (region === "EU" || region === "CA" || region === "HK") &&
      !regCity
    ) {
      toast.warn("Registered City Must Not Be Empty!");
    } else if (
      (region === "EU" || region === "CA" || region === "HK") &&
      !regState
    ) {
      toast.warn("Registered State Must Not Be Empty!");
    } else if (!regPostcode) {
      toast.warn("Registered Post Code Must Not Be Empty!");
    } else if (!regCountry) {
      toast.warn("Registered Country Must Not Be Empty!");
    }

    //Business Address Details exception handling
    else if (sameBusinessAddress == "no" && !businessAddress1) {
      toast.warn("Business Address 1 Must Not Be Empty!");
    } else if (
      sameBusinessAddress == "no" &&
      (region === "EU" || region === "CA" || region === "HK") &&
      !businessCity
    ) {
      toast.warn("Business City Must Not Be Empty!");
    } else if (
      sameBusinessAddress == "no" &&
      (region === "EU" || region === "CA" || region === "HK") &&
      !businessState
    ) {
      toast.warn("Business State Must Not Be Empty!");
    } else if (sameBusinessAddress == "no" && !businessPostcode) {
      toast.warn("Business Post Code Must Not Be Empty!");
    } else if (sameBusinessAddress == "no" && !businessCountry) {
      toast.warn("Business Country Must Not Be Empty!");
    }

    //When no expection found, triggering the API
    else {
      let requestBody = {
        businessRegistrationNumber: internalBusinessId?.trim(),
        businessName: businessName?.trim(),
        businessType: businessType?.trim(),
        tradeName: tradeName?.trim(),

        partnerName: partnerName?.trim(),
        partnerState: partnerState?.trim(),
        partnerCountry: partnerCountry?.trim(),

        associationName: associationName?.trim(),
        associationNumber: associationNumber?.trim(),
        associationChairPerson: associationChairperson?.trim(),

        //Registered Address as params - temporary
        registrationAddress_1: regAddress1?.trim(),
        registrationAddress_2: regAddress2?.trim(),
        registrationCity: regCity?.trim(),
        registrationState: regState?.trim(),
        registrationPostCode: regPostcode?.trim(),
        registrationCountry: regCountry?.trim(),
        sameBusinessAddress: sameBusinessAddress?.trim(),

        //Registered Address as params - temporary
        businessAddress_1: businessAddress1?.trim(),
        businessAddress_2: businessAddress2?.trim(),
        businessCity: businessCity?.trim(),
        businessState: businessState?.trim(),
        businessPostCode: businessPostcode?.trim(),
        businessCountry: businessCountry?.trim(),
      };

      setBtnLoader(true);
      let obj = await dispatch(
        actions.PatchBusinessAddressDetails(requestBody)
      );
      if (obj?.status === "SUCCESS") {
        setBtnLoader(false);
      } else {
        setBtnLoader(false);
      }
    }
  };

  return (
    <>
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
                src="/onboarding/accounts/general/busIncorpDet.svg"
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
              Business Incorporation Details
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
            <div className="form-item-block d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <input
                  maxLength={255}
                  type="text"
                  name="Business Registration Number"
                  className="form-input my-0 pb-0"
                  onInput={(e) => handleBRN(e)}
                  // onBlur={handleBRNChange}
                  onBlur={(e) => {
                    validations.alphanumeric(e.target.value, e.target.name);
                    handleBRNChange(e.target.value);
                  }}
                  required
                  value={brn}
                />

                {loadingList ? (
                  <>
                    <span
                      name="brn-loader"
                      className="blink"
                      style={{
                        width: "23%",
                        fontSize: "12px",
                        position: "absolute",
                        top: "70%",
                        right: "0",
                        transform: "translateY(-50%)",
                      }}
                    >
                      Loading list.....
                    </span>
                  </>
                ) : (
                  <></>
                )}

                {response && (
                  <CustomModal
                    isOpen={modalIsOpen}
                    handleClose={handleCloseModal}
                    children={<ModalContent />}
                    headerText="All Businesses"
                  />
                )}

                <label htmlFor="businessIN" className="form-input-label ps-1">
                  Business Registration Number
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
              <div className="input-group w-50 ms-2 pb-0">
                <input
                  maxLength={255}
                  type="text"
                  name="Business Name"
                  className="form-input my-0 pb-0"
                  onInput={(e) => {
                    restrictions.restrictInputBRN(e, 40);
                    dispatch(setBusinessName(e.target.value));
                  }}
                  onBlur={(e) =>
                    validations.alphanumeric(e.target.value, e.target.name)
                  }
                  value={businessName}
                  required
                />
                <label htmlFor="businessname" className="form-input-label ps-1">
                  Business Name
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
            <div className="form-item-block d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <select
                  name="businessType"
                  className="form-input my-0 pb-0"
                  onChange={(e) => handleBusinessTypeChange(e.target.value)}
                  value={businessType}
                >
                  <option value=""></option>
                  {businessTypes &&
                    businessTypes.map((item) => (
                      <option value={item.code}>{item.description}</option>
                    ))}
                </select>
                <label htmlFor="country" className="form-input-label ps-1">
                  Business Type
                  <span className="mx-1" style={{ color: "red" }}>
                    *
                  </span>
                </label>
              </div>
              <div className="input-group w-50 ms-2 pb-0">
                <input
                  maxLength={255}
                  type="text"
                  name="Trade Name"
                  className="form-input my-0 pb-0"
                  value={tradeName}
                  onInput={(e) => {
                    restrictions.restrictInputName(e, 40);
                    setTradeName(e.target.value);
                  }}
                  onBlur={(e) =>
                    validations.address(e.target.value, e.target.name)
                  }
                />
                <label htmlFor="country" className="form-input-label ps-1">
                  Trade Name{" "}
                  {(region === "EU" &&
                    businessType !== "ASSOCIATION" &&
                    businessType !== "SOLE_TRADER" &&
                    businessType !== "TRUST") ||
                  region === "HK" ||
                  region === "UK" ? (
                    <>
                      <span className="mx-1" style={{ color: "red" }}>
                        *
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </label>
              </div>
            </div>

            {togglePartnerAssoc === "PARTNERSHIP" ? (
              <>
                <div name="Partner shipDiv" style={{ display: "contents" }}>
                  <div className="header-title">
                    Partnership Details
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </div>
                  <div className="form-item-block d-flex align-self-stretch">
                    <div className="input-group w-50 me-2 pb-0">
                      <input
                        maxLength={255}
                        type="text"
                        name="Partner Name"
                        className="form-input my-0 pb-0"
                        value={partnerName}
                        onInput={(e) => {
                          restrictions.restrictInputName(e);
                          setPartnerName(e.target.value);
                        }}
                        onBlur={(e) =>
                          validations.name(e.target.value, e.target.name)
                        }
                      />
                      <label
                        htmlFor="businesstype"
                        className="form-input-label ps-1"
                      >
                        Partner Name
                      </label>
                      <img
                        className="cross-circle-icon1"
                        alt=""
                        src="/onboarding/cross-circle1.svg"
                      />
                    </div>
                    <div className="input-group w-50 ms-2 pb-0">
                      <input
                        maxLength={255}
                        type="text"
                        name="Partner State"
                        className="form-input my-0 pb-0"
                        value={partnerState}
                        onInput={(e) => {
                          restrictions.restrictInputName(e);
                          setPartnerState(e.target.value);
                        }}
                        onBlur={(e) =>
                          validations.state(e.target.value, e.target.name)
                        }
                      />
                      <label
                        htmlFor="trusteename"
                        className="form-input-label ps-1"
                      >
                        Partner State
                      </label>
                      <img
                        className="cross-circle-icon1"
                        alt=""
                        src="/onboarding/cross-circle1.svg"
                      />
                    </div>
                  </div>

                  <div className="form-item-block d-flex align-self-stretch">
                    <div className="input-group w-50 me-2 pb-0">
                      <select
                        name="Partner Country"
                        className="form-input my-0 pb-0"
                        value={partnerCountry}
                        onInput={(e) => setPartnerCountry(e.target.value)}
                      >
                        <option value=""></option>
                        {listCountry &&
                          listCountry.map((item) => (
                            <option value={item.code}>
                              {item.description}
                            </option>
                          ))}
                      </select>
                      <label
                        htmlFor="country"
                        className="form-input-label ps-1"
                      >
                        Partner Country
                      </label>
                    </div>
                  </div>
                </div>
              </>
            ) : togglePartnerAssoc === "ASSOCIATION" ? (
              <>
                <div name="Association Div" style={{ display: "contents" }}>
                  <div className="header-title">
                    Association Details
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </div>
                  <div className="form-item-block d-flex align-self-stretch">
                    <div className="input-group w-50 me-2 pb-0">
                      <input
                        maxLength={255}
                        type="text"
                        name="Association Name"
                        className="form-input my-0 pb-0"
                        value={associationName}
                        onInput={(e) => {
                          restrictions.restrictInputName(e);
                          setAssociationName(e.target.value);
                        }}
                        onBlur={(e) =>
                          validations.name(e.target.value, e.target.name)
                        }
                      />
                      <label
                        htmlFor="businesstype"
                        className="form-input-label ps-1"
                      >
                        Association Name
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
                    <div className="input-group w-50 ms-2 pb-0">
                      <input
                        maxLength={255}
                        type="text"
                        name="Association Number"
                        className="form-input my-0 pb-0"
                        value={associationNumber}
                        onInput={(e) => {
                          restrictions.restrictInputName(e);
                          setAssociationNumber(e.target.value);
                        }}
                        onBlur={(e) =>
                          validations.alphanumeric(
                            e.target.value,
                            e.target.name
                          )
                        }
                      />
                      <label
                        htmlFor="trusteename"
                        className="form-input-label ps-1"
                      >
                        Association Number
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

                  <div className="form-item-block d-flex align-self-stretch">
                    <div className="input-group w-50 me-2 pb-0">
                      <input
                        maxLength={255}
                        type="text"
                        name="Association Chairperson"
                        className="form-input my-0 pb-0"
                        value={associationChairperson}
                        onInput={(e) => {
                          restrictions.restrictInputName(e);
                          setAssociationChairperson(e.target.value);
                        }}
                        onBlur={(e) =>
                          validations.name(e.target.value, e.target.name)
                        }
                      />
                      <label
                        htmlFor="country"
                        className="form-input-label ps-1"
                      >
                        Association Chairperson
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
                </div>
              </>
            ) : (
              <></>
            )}

            <input
              maxLength={255}
              className="d-none"
              name="businessKybMode"
              value={businessKybMode}
            />
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
                src="/onboarding/accounts/general/regisAdd.svg"
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
              Registered Address
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
          id="collapseTwo"
          className="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample"
        >
          <form className="form">
            <div className="form-item-block d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <input
                  maxLength={255}
                  type="text"
                  name="Registered Address_1"
                  className="form-input my-0 pb-0"
                  required
                  value={regAddress1}
                  onInput={(e) => {
                    restrictions.restrictInputAddress(e);
                    setRegAddress1(e.target.value);
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
                  src="/onboarding/cross-circle1.svg"
                />
              </div>
              <div className="input-group w-50 ms-2 pb-0">
                <input
                  maxLength={255}
                  type="text"
                  name="Registered Address_2"
                  className="form-input my-0 pb-0"
                  value={regAddress2}
                  onInput={(e) => {
                    restrictions.restrictInputAddress(e);
                    setRegAddress2(e.target.value);
                  }}
                  onBlur={(e) =>
                    validations.address(e.target.value, e.target.name)
                  }
                />
                <label htmlFor="businessname" className="form-input-label ps-1">
                  Address 2
                </label>
                <img
                  className="cross-circle-icon1"
                  alt=""
                  src="/onboarding/cross-circle1.svg"
                />
              </div>
            </div>
            <div className="form-item-block d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <input
                  maxLength={255}
                  type="text"
                  name="Registered City"
                  className="form-input my-0 pb-0"
                  value={regCity}
                  onInput={(e) => {
                    restrictions.restrictInputCity(e);
                    setRegCity(e.target.value);
                  }}
                  onBlur={(e) =>
                    validations.city(e.target.value, e.target.name)
                  }
                />
                <label htmlFor="businesstype" className="form-input-label ps-1">
                  City
                  {(region === "EU" || region === "CA" || region === "HK") && (
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  )}
                </label>
                <img
                  className="cross-circle-icon1"
                  alt=""
                  src="/onboarding/cross-circle1.svg"
                />
              </div>
              <div className="input-group w-50 ms-2 pb-0">
                <input
                  maxLength={255}
                  type="text"
                  name="Registered State"
                  className="form-input my-0 pb-0"
                  value={regState}
                  onInput={(e) => {
                    restrictions.restrictInputCity(e);
                    setRegState(e.target.value);
                  }}
                  onBlur={(e) =>
                    validations.state(e.target.value, e.target.name)
                  }
                />
                <label htmlFor="tradename" className="form-input-label ps-1">
                  State
                  {(region === "EU" || region === "CA" || region === "HK") && (
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  )}
                </label>
                <img
                  className="cross-circle-icon1"
                  alt=""
                  src="/onboarding/cross-circle1.svg"
                />
              </div>
            </div>
            <div className="form-item-block d-flex align-self-stretch">
              <div className="input-group w-50 me-2 pb-0">
                <input
                  maxLength={255}
                  type="text"
                  name="Registered PostCode"
                  className="form-input my-0 pb-0"
                  required
                  value={regPostcode}
                  onInput={(e) => {
                    restrictions.restrictInputPostcode(e);
                    setRegPostcode(e.target.value);
                  }}
                  onBlur={(e) =>
                    validations.postalCode(e.target.value, e.target.name)
                  }
                />
                <label htmlFor="businesstype" className="form-input-label ps-1">
                  Postal Code
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
              <div className="input-group w-50 ms-2 pb-0">
                <select
                  name="Registered Country"
                  className="form-input my-0 pb-0"
                  required
                  value={regCountry}
                  onChange={(e) => setRegCountry(e.target.value)}
                >
                  <option value=""></option>
                  {listCountry &&
                    listCountry.map((item) => (
                      <option value={item.code}>{item.description}</option>
                    ))}
                </select>
                <label htmlFor="country" className="form-input-label ps-1">
                  Country
                  <span className="mx-1" style={{ color: "red" }}>
                    *
                  </span>
                </label>
              </div>
            </div>
            <div className="form-item-block d-flex align-self-stretch my-3">
              <input
                maxLength={255}
                type="checkbox"
                name="isSameBusinessAddress"
                className="form-input my-0 pb-0 w15"
                checked={isChecked}
                onChange={(e) => copyAddress(e)}
              />
              <label htmlFor="businesstype" className="form-input-label ps-1">
                Is Business Address same as Registered Address?
              </label>
            </div>
          </form>
        </div>
      </div>

      {showBusinessAddress ? (
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
                    src="/onboarding/accounts/general/busAdd.svg"
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
                  Business Address
                  <span
                    className="mx-1"
                    style={{ color: "red" }}
                    name="businessAddressDetailsLabel"
                  ></span>
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
                <div className="form-item-block d-flex align-self-stretch">
                  <div className="input-group w-50 me-2 pb-0">
                    <input
                      maxLength={255}
                      type="text"
                      name="businessAddress_1"
                      className="form-input my-0 pb-0"
                      value={businessAddress1}
                      onInput={(e) => {
                        restrictions.restrictInputAddress(e);
                        setBusinessAddress1(e.target.value);
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
                      src="/onboarding/cross-circle1.svg"
                    />
                  </div>
                  <div className="input-group w-50 ms-2 pb-0">
                    <input
                      maxLength={255}
                      type="text"
                      name="businessAddress_2"
                      className="form-input my-0 pb-0"
                      value={businessAddress2}
                      onInput={(e) => {
                        restrictions.restrictInputAddress(e);
                        setBusinessAddress2(e.target.value);
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
                      src="/onboarding/cross-circle1.svg"
                    />
                  </div>
                </div>
                <div className="form-item-block d-flex align-self-stretch">
                  <div className="input-group w-50 me-2 pb-0">
                    <input
                      maxLength={255}
                      type="text"
                      name="businessCity"
                      className="form-input my-0 pb-0"
                      value={businessCity}
                      onInput={(e) => {
                        restrictions.restrictInputCity(e);
                        setBusinessCity(e.target.value);
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
                      {(region === "EU" ||
                        region === "CA" ||
                        region === "HK") && (
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      )}
                    </label>
                    <img
                      className="cross-circle-icon1"
                      alt=""
                      src="/onboarding/cross-circle1.svg"
                    />
                  </div>
                  <div className="input-group w-50 ms-2 pb-0">
                    <input
                      maxLength={255}
                      type="text"
                      name="businessState"
                      className="form-input my-0 pb-0"
                      value={businessState}
                      onInput={(e) => {
                        restrictions.restrictInputCity(e);
                        setBusinessState(e.target.value);
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
                      {(region === "EU" ||
                        region === "CA" ||
                        region === "HK") && (
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      )}
                    </label>
                    <img
                      className="cross-circle-icon1"
                      alt=""
                      src="/onboarding/cross-circle1.svg"
                    />
                  </div>
                </div>
                <div className="form-item-block d-flex align-self-stretch">
                  <div className="input-group w-50 me-2 pb-0">
                    <input
                      maxLength={255}
                      type="text"
                      name="businessPostCode"
                      className="form-input my-0 pb-0"
                      value={businessPostcode}
                      onInput={(e) => {
                        restrictions.restrictInputPostcode(e);
                        setBusinessPostcode(e.target.value);
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
                      src="/onboarding/cross-circle1.svg"
                    />
                  </div>
                  <div className="input-group w-50 ms-2 pb-0">
                    <select
                      name="businessCountry"
                      className="form-input my-0 pb-0"
                      value={businessCountry}
                      onChange={(e) => setBusinessCountry(e.target.value)}
                    >
                      <option value=""></option>
                      {listCountry &&
                        listCountry.map((item) => (
                          <option value={item.code}>{item.description}</option>
                        ))}
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
        </>
      ) : (
        <></>
      )}

      <div className="general-details d-none">
        <form className="form">
          <div className="form-item-block d-flex align-self-stretch">
            <div className="input-group w-50 me-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="Business Registration Number"
                className="form-input my-0 pb-0"
                onInput={(e) => handleBRN(e)}
                // onBlur={handleBRNChange}
                onBlur={(e) => {
                  validations.alphanumeric(e.target.value, e.target.name);
                  handleBRNChange(e.target.value);
                }}
                required
                value={brn}
              />

              {loadingList ? (
                <>
                  <span
                    name="brn-loader"
                    className="blink"
                    style={{
                      width: "23%",
                      fontSize: "12px",
                      position: "absolute",
                      top: "70%",
                      right: "0",
                      transform: "translateY(-50%)",
                    }}
                  >
                    Loading list.....
                  </span>
                </>
              ) : (
                <></>
              )}

              {response && (
                <CustomModal
                  isOpen={modalIsOpen}
                  handleClose={handleCloseModal}
                  children={<ModalContent />}
                  headerText="All Businesses"
                />
              )}

              <label htmlFor="businessIN" className="form-input-label ps-1">
                Business Registration Number
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
            <div className="input-group w-50 ms-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="Business Name"
                className="form-input my-0 pb-0"
                onInput={(e) => {
                  restrictions.restrictInputName(e, 40);
                  dispatch(setBusinessName(e.target.value));
                }}
                onBlur={(e) =>
                  validations.alphanumeric(e.target.value, e.target.name)
                }
                value={businessName}
                required
              />
              <label htmlFor="businessname" className="form-input-label ps-1">
                Business Name
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
          <div className="form-item-block d-flex align-self-stretch">
            <div className="input-group w-50 me-2 pb-0">
              <select
                name="businessType"
                className="form-input my-0 pb-0"
                onChange={(e) => handleBusinessTypeChange(e.target.value)}
                value={businessType}
              >
                <option value=""></option>
                {businessTypes &&
                  businessTypes.map((item) => (
                    <option value={item.code}>{item.description}</option>
                  ))}
              </select>
              <label htmlFor="country" className="form-input-label ps-1">
                Business Type
                <span className="mx-1" style={{ color: "red" }}>
                  *
                </span>
              </label>
            </div>
            <div className="input-group w-50 ms-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="Trade Name"
                className="form-input my-0 pb-0"
                value={tradeName}
                onInput={(e) => {
                  restrictions.restrictInputName(e, 40);
                  setTradeName(e.target.value);
                }}
                onBlur={(e) =>
                  validations.address(e.target.value, e.target.name)
                }
              />
              <label htmlFor="country" className="form-input-label ps-1">
                Trade Name{" "}
                {(region === "EU" &&
                  businessType !== "ASSOCIATION" &&
                  businessType !== "SOLE_TRADER" &&
                  businessType !== "TRUST") ||
                region === "HK" ||
                region === "UK" ? (
                  <>
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </label>
            </div>
          </div>

          {togglePartnerAssoc === "PARTNERSHIP" ? (
            <>
              <div name="Partner shipDiv" style={{ display: "contents" }}>
                <div className="header-title">
                  Partnership Details
                  <span className="mx-1" style={{ color: "red" }}>
                    *
                  </span>
                </div>
                <div className="form-item-block d-flex align-self-stretch">
                  <div className="input-group w-50 me-2 pb-0">
                    <input
                      maxLength={255}
                      type="text"
                      name="Partner Name"
                      className="form-input my-0 pb-0"
                      value={partnerName}
                      onInput={(e) => {
                        restrictions.restrictInputName(e);
                        setPartnerName(e.target.value);
                      }}
                      onBlur={(e) =>
                        validations.name(e.target.value, e.target.name)
                      }
                    />
                    <label
                      htmlFor="businesstype"
                      className="form-input-label ps-1"
                    >
                      Partner Name
                    </label>
                    <img
                      className="cross-circle-icon1"
                      alt=""
                      src="/onboarding/cross-circle1.svg"
                    />
                  </div>
                  <div className="input-group w-50 ms-2 pb-0">
                    <input
                      maxLength={255}
                      type="text"
                      name="Partner State"
                      className="form-input my-0 pb-0"
                      value={partnerState}
                      onInput={(e) => {
                        restrictions.restrictInputName(e);
                        setPartnerState(e.target.value);
                      }}
                      onBlur={(e) =>
                        validations.state(e.target.value, e.target.name)
                      }
                    />
                    <label
                      htmlFor="trusteename"
                      className="form-input-label ps-1"
                    >
                      Partner State
                    </label>
                    <img
                      className="cross-circle-icon1"
                      alt=""
                      src="/onboarding/cross-circle1.svg"
                    />
                  </div>
                </div>

                <div className="form-item-block d-flex align-self-stretch">
                  <div className="input-group w-50 me-2 pb-0">
                    <select
                      name="Partner Country"
                      className="form-input my-0 pb-0"
                      value={partnerCountry}
                      onInput={(e) => setPartnerCountry(e.target.value)}
                    >
                      <option value=""></option>
                      {listCountry &&
                        listCountry.map((item) => (
                          <option value={item.code}>{item.description}</option>
                        ))}
                    </select>
                    <label htmlFor="country" className="form-input-label ps-1">
                      Partner Country
                    </label>
                  </div>
                </div>
              </div>
            </>
          ) : togglePartnerAssoc === "ASSOCIATION" ? (
            <>
              <div name="Association Div" style={{ display: "contents" }}>
                <div className="header-title">
                  Association Details
                  <span className="mx-1" style={{ color: "red" }}>
                    *
                  </span>
                </div>
                <div className="form-item-block d-flex align-self-stretch">
                  <div className="input-group w-50 me-2 pb-0">
                    <input
                      maxLength={255}
                      type="text"
                      name="Association Name"
                      className="form-input my-0 pb-0"
                      value={associationName}
                      onInput={(e) => {
                        restrictions.restrictInputName(e);
                        setAssociationName(e.target.value);
                      }}
                      onBlur={(e) =>
                        validations.name(e.target.value, e.target.name)
                      }
                    />
                    <label
                      htmlFor="businesstype"
                      className="form-input-label ps-1"
                    >
                      Association Name
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
                  <div className="input-group w-50 ms-2 pb-0">
                    <input
                      maxLength={255}
                      type="text"
                      name="Association Number"
                      className="form-input my-0 pb-0"
                      value={associationNumber}
                      onInput={(e) => {
                        restrictions.restrictInputName(e);
                        setAssociationNumber(e.target.value);
                      }}
                      onBlur={(e) =>
                        validations.alphanumeric(e.target.value, e.target.name)
                      }
                    />
                    <label
                      htmlFor="trusteename"
                      className="form-input-label ps-1"
                    >
                      Association Number
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

                <div className="form-item-block d-flex align-self-stretch">
                  <div className="input-group w-50 me-2 pb-0">
                    <input
                      maxLength={255}
                      type="text"
                      name="Association Chairperson"
                      className="form-input my-0 pb-0"
                      value={associationChairperson}
                      onInput={(e) => {
                        restrictions.restrictInputName(e);
                        setAssociationChairperson(e.target.value);
                      }}
                      onBlur={(e) =>
                        validations.name(e.target.value, e.target.name)
                      }
                    />
                    <label htmlFor="country" className="form-input-label ps-1">
                      Association Chairperson
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
              </div>
            </>
          ) : (
            <></>
          )}

          <input
            maxLength={255}
            className="d-none"
            name="businessKybMode"
            value={businessKybMode}
          />
        </form>

        <form className="form">
          <div className="form-item-block d-flex align-self-stretch">
            <div className="input-group w-50 me-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="Registered Address_1"
                className="form-input my-0 pb-0"
                required
                value={regAddress1}
                onInput={(e) => {
                  restrictions.restrictInputAddress(e);
                  setRegAddress1(e.target.value);
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
                src="/onboarding/cross-circle1.svg"
              />
            </div>
            <div className="input-group w-50 ms-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="Registered Address_2"
                className="form-input my-0 pb-0"
                value={regAddress2}
                onInput={(e) => {
                  restrictions.restrictInputAddress(e);
                  setRegAddress2(e.target.value);
                }}
                onBlur={(e) =>
                  validations.address(e.target.value, e.target.name)
                }
              />
              <label htmlFor="businessname" className="form-input-label ps-1">
                Address 2
              </label>
              <img
                className="cross-circle-icon1"
                alt=""
                src="/onboarding/cross-circle1.svg"
              />
            </div>
          </div>
          <div className="form-item-block d-flex align-self-stretch">
            <div className="input-group w-50 me-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="Registered City"
                className="form-input my-0 pb-0"
                value={regCity}
                onInput={(e) => {
                  restrictions.restrictInputCity(e);
                  setRegCity(e.target.value);
                }}
                onBlur={(e) => validations.city(e.target.value, e.target.name)}
              />
              <label htmlFor="businesstype" className="form-input-label ps-1">
                City{" "}
                {region === "EU" ? (
                  <>
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </label>
              <img
                className="cross-circle-icon1"
                alt=""
                src="/onboarding/cross-circle1.svg"
              />
            </div>
            <div className="input-group w-50 ms-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="Registered State"
                className="form-input my-0 pb-0"
                value={regState}
                onInput={(e) => {
                  restrictions.restrictInputCity(e);
                  setRegState(e.target.value);
                }}
                onBlur={(e) => validations.state(e.target.value, e.target.name)}
              />
              <label htmlFor="tradename" className="form-input-label ps-1">
                State{" "}
                {region === "EU" ? (
                  <>
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </label>
              <img
                className="cross-circle-icon1"
                alt=""
                src="/onboarding/cross-circle1.svg"
              />
            </div>
          </div>
          <div className="form-item-block d-flex align-self-stretch">
            <div className="input-group w-50 me-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="Registered PostCode"
                className="form-input my-0 pb-0"
                required
                value={regPostcode}
                onInput={(e) => {
                  restrictions.restrictInputPostcode(e);
                  setRegPostcode(e.target.value);
                }}
                onBlur={(e) =>
                  validations.postalCode(e.target.value, e.target.name)
                }
              />
              <label htmlFor="businesstype" className="form-input-label ps-1">
                Postal Code
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
            <div className="input-group w-50 ms-2 pb-0">
              <select
                name="Registered Country"
                className="form-input my-0 pb-0"
                required
                value={regCountry}
                onChange={(e) => setRegCountry(e.target.value)}
              >
                <option value=""></option>
                {listCountry &&
                  listCountry.map((item) => (
                    <option value={item.code}>{item.description}</option>
                  ))}
              </select>
              <label htmlFor="country" className="form-input-label ps-1">
                Country
                <span className="mx-1" style={{ color: "red" }}>
                  *
                </span>
              </label>
            </div>
          </div>
          <div className="form-item-block d-flex align-self-stretch my-3">
            <input
              maxLength={255}
              type="checkbox"
              name="isSameBusinessAddress"
              className="form-input my-0 pb-0 w15"
              checked={isChecked}
              onChange={(e) => copyAddress(e)}
            />
            <label htmlFor="businesstype" className="form-input-label ps-1">
              Is Business Address same as Registered Address?
            </label>
          </div>
        </form>

        <form className="form">
          <div className="form-item-block d-flex align-self-stretch">
            <div className="input-group w-50 me-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="businessAddress_1"
                className="form-input my-0 pb-0"
                value={businessAddress1}
                onInput={(e) => {
                  restrictions.restrictInputAddress(e);
                  setBusinessAddress1(e.target.value);
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
                src="/onboarding/cross-circle1.svg"
              />
            </div>
            <div className="input-group w-50 ms-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="businessAddress_2"
                className="form-input my-0 pb-0"
                value={businessAddress2}
                onInput={(e) => {
                  restrictions.restrictInputAddress(e);
                  setBusinessAddress2(e.target.value);
                }}
                onBlur={(e) =>
                  validations.address(e.target.value, e.target.name)
                }
              />
              <label htmlFor="businessname" className="form-input-label ps-1">
                Address 2
              </label>
              <img
                className="cross-circle-icon1"
                alt=""
                src="/onboarding/cross-circle1.svg"
              />
            </div>
          </div>
          <div className="form-item-block d-flex align-self-stretch">
            <div className="input-group w-50 me-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="businessCity"
                className="form-input my-0 pb-0"
                value={businessCity}
                onInput={(e) => {
                  restrictions.restrictInputCity(e);
                  setBusinessCity(e.target.value);
                }}
                onBlur={(e) => validations.city(e.target.value, e.target.name)}
              />
              <label htmlFor="businesstype" className="form-input-label ps-1">
                City{" "}
                {region === "EU" ? (
                  <>
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </label>
              <img
                className="cross-circle-icon1"
                alt=""
                src="/onboarding/cross-circle1.svg"
              />
            </div>
            <div className="input-group w-50 ms-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="businessState"
                className="form-input my-0 pb-0"
                value={businessState}
                onInput={(e) => {
                  restrictions.restrictInputCity(e);
                  setBusinessState(e.target.value);
                }}
                onBlur={(e) => validations.state(e.target.value, e.target.name)}
              />
              <label htmlFor="tradename" className="form-input-label ps-1">
                State{" "}
                {region === "EU" ? (
                  <>
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </label>
              <img
                className="cross-circle-icon1"
                alt=""
                src="/onboarding/cross-circle1.svg"
              />
            </div>
          </div>
          <div className="form-item-block d-flex align-self-stretch">
            <div className="input-group w-50 me-2 pb-0">
              <input
                maxLength={255}
                type="text"
                name="businessPostCode"
                className="form-input my-0 pb-0"
                value={businessPostcode}
                onInput={(e) => {
                  restrictions.restrictInputPostcode(e);
                  setBusinessPostcode(e.target.value);
                }}
                onBlur={(e) =>
                  validations.postalCode(e.target.value, e.target.name)
                }
              />
              <label htmlFor="businesstype" className="form-input-label ps-1">
                Postal Code
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
            <div className="input-group w-50 ms-2 pb-0">
              <select
                name="businessCountry"
                className="form-input my-0 pb-0"
                value={businessCountry}
                onChange={(e) => setBusinessCountry(e.target.value)}
              >
                <option value=""></option>
                {listCountry &&
                  listCountry.map((item) => (
                    <option value={item.code}>{item.description}</option>
                  ))}
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

      <div
        className="buttons-div"
        style={{
          width: "840px",
          display:
            !lastScreenCompleted ||
            lastScreenCompleted < 8 ||
            userStatus !== "C"
              ? "flex"
              : "none",
          justifyContent: "end",
          gap: "15px",
        }}
      >
        {lastScreenCompleted >= 1 ? (
          <>
            <button
              type="button"
              name="updateBusinessAddress"
              className="update-btn"
              onClick={() => updateBusinessAddressDetails()}
              disabled={btnLoader}
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
        ) : (
          <>
            <button
              type="button"
              name="submitBusinessAddress"
              className="submit-btn"
              onClick={() => submitBusinessAddressDetails()}
              disabled={btnLoader}
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
        )}
      </div>
    </>
  );
}

function General() {
  let listCountry = useSelector((state) => state.onboarding?.ListCountry);
  let businessTypes = useSelector(
    (state) => state.onboarding?.BusinessTypeValues
  );
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="accordion" name="accordionExample">
      {isLoading ? (
        <>
          <ContentLoader
            speed={1}
            width={400}
            height={160}
            viewBox="-20 0 400 160"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          ></ContentLoader>

          <ContentLoader
            speed={1}
            width={400}
            height={160}
            viewBox="-20 0 400 160"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          ></ContentLoader>

          <ContentLoader
            speed={1}
            width={400}
            height={160}
            viewBox="-20 0 400 160"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          ></ContentLoader>
        </>
      ) : (
        <>
          <BusinessIncorporationDetails
            businessTypes={businessTypes}
            listCountry={listCountry}
          />
        </>
      )}
    </div>
  );
}

export default General;
