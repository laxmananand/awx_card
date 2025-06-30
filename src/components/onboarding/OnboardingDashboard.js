import React, { useState, useEffect } from "react";
import Modal from "./dashboard/tabs/modals/CorporateDetailsModal.js";
import CustomInput from "../structure/NewStructures/CustomInput.js";
import "../structure/NewStructures/new-structure.css";
import CustomSelect from "../structure/NewStructures/CustomSelect.js";
import { useSelector, useDispatch } from "react-redux";
import { openLoader, closeLoader } from "../../@redux/features/common.js";
import * as utilities from "../onboarding/dashboard/tabs/functions/utility-details-function.js";
import CustomDatePicker from "../structure/NewStructures/CustomDatePicker.js";
import YearPicker from "../structure/NewStructures/CustomDatePicker.js";
import CustomDatepicker from "../structure/NewStructures/CustomDatePicker.js";
import { format } from "date-fns";
import "../structure/NewStructures/new-structure.css";

const regionMapping = {
  SG: "Singapore",
  HK: "Hong Kong",
  US: "United States",
  UK: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  EU: "European Union",
};

const Header = () => {
  const imgSuccess = "/check.png";
  const imgWarning = "/warning.png";

  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [img5, setImg5] = useState("");
  return (
    <>
      <div className="header-container">
        <ul className="d-flex justify-content-between">
          <li className="">
            <div className="rounded-circle">
              <img src={img1} alt="" width={15} className="" />
            </div>
            General Details
          </li>
          <li className="">
            <div className="rounded-circle">
              <img src={img2} alt="" width={15} />
            </div>
            Business Details
          </li>
          <li className="">
            <div className="rounded-circle">
              <img src={img3} alt="" width={15} />
            </div>
            Shareholder Details
          </li>
          <li className="">
            <div className="rounded-circle">
              <img src={img4} alt="" width={15} />
            </div>
            Applicant Details
          </li>
          <li className="">
            <div className="rounded-circle">
              <img src={img5} alt="" width={15} />
            </div>
            KYB Details
          </li>
        </ul>
      </div>
    </>
  );
};

const GeneralDetails = ({ listCountry, businessTypeList }) => {
  const dispatch = useDispatch();

  const [response, setResponse] = useState([]);
  const [brn, setBRN] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [tradeName, setTradeName] = useState("");

  //Address Details Starts
  const [regAddress1, setRegAddress1] = useState("");
  const [regAddress2, setRegAddress2] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regState, setRegState] = useState("");
  const [regPostcode, setRegPostcode] = useState("");
  const [regCountry, setRegCountry] = useState("");

  const [bizAddress1, setBizAddress1] = useState("");
  const [bizAddress2, setBizAddress2] = useState("");
  const [bizCity, setBizCity] = useState("");
  const [bizState, setBizState] = useState("");
  const [bizPostcode, setBizPostcode] = useState("");
  const [bizCountry, setBizCountry] = useState("");

  const handleRegAddress1 = (event) => {
    setRegAddress1(event.target.value);
  };
  const handleRegAddress2 = (event) => {
    setRegAddress2(event.target.value);
  };
  const handleRegCity = (event) => {
    setRegCity(event.target.value);
  };
  const handleRegState = (event) => {
    setRegState(event.target.value);
  };
  const handleRegPostcode = (event) => {
    setRegPostcode(event.target.value);
  };
  const handleRegCountry = (event) => {
    setRegCountry(event.value);
  };
  const handleBizAddress1 = (event) => {
    setBizAddress1(event.target.value);
  };
  const handleBizAddress2 = (event) => {
    setBizAddress2(event.target.value);
  };
  const handleBizCity = (event) => {
    setBizCity(event.target.value);
  };
  const handleBizState = (event) => {
    setBizState(event.target.value);
  };
  const handleBizPostcode = (event) => {
    setBizPostcode(event.target.value);
  };
  const handleBizCountry = (event) => {
    setBizCountry(event.value);
  };
  //Address Details Ends

  //Partnership && Association Details Starts
  const [partnerName, setPartnerName] = useState("");
  const [partnerState, setPartnerState] = useState("");
  const [partnerCountry, setPartnerCountry] = useState("");
  const [associationName, setAssociationName] = useState("");
  const [associationNumber, setAssociationNumber] = useState("");
  const [associationChairPerson, setAssociationChairPerson] = useState("");

  const handlePartnerName = (event) => {
    setPartnerName(event.target.value);
  };
  const handlePartnerState = (event) => {
    setPartnerState(event.target.value);
  };
  const handlePartnerCountry = (event) => {
    setPartnerCountry(event.value);
  };
  const handleAssociationName = (event) => {
    setAssociationName(event.target.value);
  };
  const handleAssociationNumber = (event) => {
    setAssociationNumber(event.target.value);
  };
  const handleAssociationChairPerson = (event) => {
    setAssociationChairPerson(event.target.value);
  };

  //Partnership && Association Details Ends

  //Business Type Change logic starts
  const [selectedBusinessTypeValue, setBusinessTypeSelectedValue] = useState("");

  const handleBusinessTypeChange = (selectedOption) => {
    setBusinessTypeSelectedValue(selectedOption.value);
  };

  useEffect(() => {
    console.log("Business Type changed: " + selectedBusinessTypeValue);
  }, [selectedBusinessTypeValue]);
  //Business Type Change logic starts

  useEffect(() => {}, [listCountry, businessTypeList]);

  const handleBRNChange = async (event) => {
    setBRN(event.target.value);
    return;
    var internalBusinessId = sessionStorage.getItem("internalBusinessId");
    if (internalBusinessId) {
      return;
    } else {
      const businessRegistrationNumber = document.getElementById("businessRegistrationNumber").value;

      if (businessRegistrationNumber != "") {
        document.getElementById("brn-loader").style.display = "block";
        try {
          const result = await functions.GetCorporateDetailsList();
          if (result.status != "BAD_REQUEST") {
            document.getElementById("brn-loader").style.display = "none";
            setResponse(result);
          } else {
            toast.error("Error in fetching business list: " + result.message);
          }
        } catch (error) {
          console.log("Error in fetching business list: " + error);
        }
      }
    }
  };

  const handleBusinessName = (event) => {
    sessionStorage.setItem("businessName", event.target.value);
    setBusinessName(event.target.value);
  };

  const handleTradeName = (event) => {
    setTradeName(event.target.value);
  };

  return (
    <>
      {response && <Modal response={response} />}

      <div className="section-header">
        {" "}
        <h1>General Details</h1>
        <button type="button" className="button-base outline-button">
          Save as draft
        </button>
      </div>

      <div className="accordion accordion-flush d-flex flex-column" id="accordionFlushExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingOne">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseOne"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
            >
              Business Incorporation Details
              <span className="mx-1" style={{ color: "red" }}>
                *
              </span>
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingOne"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <form action="#!" className="form-new">
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="businessRegistrationNumber"
                    placeholder="Enter your business registration number..."
                    value={brn}
                    onChange={handleBRNChange}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Business Registration Number"
                    helperText=""
                    required
                  />

                  <CustomInput
                    type="text"
                    id="businessName"
                    placeholder="Enter your business name..."
                    value={businessName}
                    onChange={handleBusinessName}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Business Name"
                    helperText=""
                    required
                  />
                </div>

                <div className="group-row-2">
                  <CustomSelect
                    id="businessType"
                    options={businessTypeList}
                    value={selectedBusinessTypeValue}
                    onChange={handleBusinessTypeChange}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Business Type" // Label for the select
                    helperText="" // Helper text
                    required
                  />

                  <CustomInput
                    type="text"
                    id="tradeName"
                    placeholder="Enter your business' trade name..."
                    value={tradeName}
                    onChange={handleTradeName}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Trade Name"
                    helperText=""
                  />
                </div>

                {selectedBusinessTypeValue === "PARTNERSHIP" ? (
                  <>
                    <div>
                      <h5>Partnership Details</h5>
                      <hr />

                      <div className="group-row-2">
                        <CustomInput
                          type="text"
                          id="partnerName"
                          placeholder="Enter the complete name of the partner (if any)..."
                          value={partnerName}
                          onChange={handlePartnerName}
                          className="custom-input-class full-width"
                          style={{}}
                          label="Partner Name"
                          helperText=""
                        />
                        <CustomInput
                          type="text"
                          id="partnerState"
                          placeholder="Enter the country where the partnership is established (if any)..."
                          value={partnerState}
                          onChange={handlePartnerState}
                          className="custom-input-class full-width"
                          style={{}}
                          label="Partner's State"
                          helperText=""
                        />
                      </div>

                      <div className="group-row-2">
                        <CustomSelect
                          id="businessType"
                          options={listCountry}
                          value={partnerCountry}
                          onChange={handlePartnerCountry}
                          className="custom-select-class full-width" // Custom classname
                          style={{}} // Custom inline styles
                          label="Partner Country" // Label for the select
                          helperText="" // Helper text
                        />
                      </div>
                    </div>
                  </>
                ) : selectedBusinessTypeValue === "ASSOCIATION" ? (
                  <>
                    <div>
                      <h5>Association Details</h5>
                      <hr />

                      <div className="group-row-3">
                        <CustomInput
                          type="text"
                          id="associationName"
                          placeholder="Enter the complete name of the association..."
                          value={associationName}
                          onChange={handleAssociationName}
                          className="custom-input-class full-width"
                          style={{}}
                          label="Association Name"
                          helperText=""
                        />
                        <CustomInput
                          type="text"
                          id="associationNumber"
                          placeholder="The number of the association that an applicable state or territory issues."
                          value={associationNumber}
                          onChange={handleAssociationNumber}
                          className="custom-input-class full-width"
                          style={{}}
                          label="Association Number"
                          helperText=""
                        />
                      </div>

                      <div className="group-row-2">
                        <CustomInput
                          type="text"
                          id="associationChairPerson"
                          placeholder="The complete name of an association chairperson, secretary, or treasurer..."
                          value={associationChairPerson}
                          onChange={handleAssociationChairPerson}
                          className="custom-input-class full-width"
                          style={{}}
                          label="Association Chairperson"
                          helperText=""
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </form>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseTwo"
              aria-expanded="false"
              aria-controls="flush-collapseTwo"
            >
              Registered Address Details
              <span className="mx-1" style={{ color: "red" }}>
                *
              </span>
            </button>
          </h2>
          <div
            id="flush-collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingTwo"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <form className="form-new" action="#!">
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="registrationAddress_1"
                    required
                    placeholder="Street address, P.O. box, company name, c/o..."
                    value={regAddress1}
                    onChange={handleRegAddress1}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Address 1"
                    helperText=""
                  />
                  <CustomInput
                    type="text"
                    id="registrationAddress_2"
                    placeholder="Apartment, suite, unit, building, floor, etc..."
                    value={regAddress2}
                    onChange={handleRegAddress2}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Address 2"
                    helperText=""
                  />
                </div>
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="registrationCity"
                    placeholder="City or locality..."
                    value={regCity}
                    onChange={handleRegCity}
                    className="custom-input-class full-width"
                    style={{}}
                    label="City"
                    helperText=""
                  />
                  <CustomInput
                    type="text"
                    id="registrationState"
                    placeholder="State, province, or region..."
                    value={regState}
                    onChange={handleRegState}
                    className="custom-input-class full-width"
                    style={{}}
                    label="State"
                    helperText=""
                  />
                </div>
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="registrationPostCode"
                    required
                    placeholder="Postal code or ZIP code..."
                    value={regPostcode}
                    onChange={handleRegPostcode}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Postal Code"
                    helperText=""
                  />
                  <CustomSelect
                    id="registrationCountry"
                    required
                    value={regCountry}
                    onChange={handleRegCountry}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Country" // Label for the select
                    helperText="" // Helper text
                    options={listCountry}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseThree"
              aria-expanded="false"
              aria-controls="flush-collapseThree"
            >
              Business Address Details
              <span className="mx-1" style={{ color: "red" }}>
                *
              </span>
            </button>
          </h2>
          <div
            id="flush-collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingThree"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <form action="#!" className="form-new">
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="businessAddress_1"
                    required
                    placeholder="Street address, P.O. box, company name, c/o..."
                    value={bizAddress1}
                    onChange={handleBizAddress1}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Address 1"
                    helperText=""
                  />
                  <CustomInput
                    type="text"
                    id="businessAddress_2"
                    placeholder="Apartment, suite, unit, building, floor, etc...."
                    value={bizAddress2}
                    onChange={handleBizAddress2}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Address 2"
                    helperText=""
                  />
                </div>
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="businessCity"
                    placeholder="City or locality..."
                    value={bizCity}
                    onChange={handleBizCity}
                    className="custom-input-class full-width"
                    style={{}}
                    label="City"
                    helperText=""
                  />
                  <CustomInput
                    type="text"
                    id="businessState"
                    placeholder="State, province, or region..."
                    value={bizState}
                    onChange={handleBizState}
                    className="custom-input-class full-width"
                    style={{}}
                    label="State"
                    helperText=""
                  />
                </div>
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="businessPostCode"
                    required
                    placeholder="Postal code or ZIP code..."
                    value={bizPostcode}
                    onChange={handleBizPostcode}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Postal Code"
                    helperText=""
                  />
                  <CustomSelect
                    id="businessCountry"
                    value={bizCountry}
                    onChange={handleBizCountry}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Country" // Label for the select
                    helperText="" // Helper text required
                    required
                    options={listCountry}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const BusinessDetails = ({
  listCountry,
  TotalEmployeesList,
  AnnualTurnoverList,
  IndustrySectorList,
  IntendedUseOfAccountList,
}) => {
  const [regCountry, setRegCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [registeredDate, setRegisteredDate] = useState(null);

  const [totalEmployees, setTotalEmployees] = useState("");
  const [annualTurnover, setAnnualTurnover] = useState("");
  const [industrySector, setIndustrySector] = useState("");
  const [intendedUseOfAccount, setIntendedUseOfAccount] = useState("");
  const [countryOfOperation, setCountryOfOperation] = useState([]);
  const [transactionCountries, setTransactionCountries] = useState([]);

  const handleCountries = () => {
    console.log(countryOfOperation);
  };

  return (
    <>
      <div className="section-header">
        {" "}
        <h1>Business Details</h1>
        <button type="button" className="button-base outline-button" onClick={handleCountries}>
          Save as draft
        </button>
      </div>

      <div className="accordion accordion-flush d-flex flex-column" id="accordionFlushExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingOne">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseOne"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
            >
              Legal Details
              <span className="mx-1" style={{ color: "red" }}>
                *
              </span>
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingOne"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <form action="#!" className="form-new">
                <div className="group-row-2">
                  <CustomSelect
                    id="registeredCountry"
                    options={listCountry}
                    value={regCountry}
                    onChange={setRegCountry}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Registered Country" // Label for the select
                    helperText="" // Helper text
                    required
                    isMulti="false"
                  />

                  <CustomDatepicker
                    selectedDate={registeredDate}
                    onDateChange={setRegisteredDate}
                    label="Registered Date"
                    helperText=""
                    required
                  />
                </div>

                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="website"
                    placeholder="Enter your business' website..."
                    value={website}
                    onChange={setWebsite}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Website"
                    helperText=""
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseTwo"
              aria-expanded="false"
              aria-controls="flush-collapseTwo"
            >
              Risk Assessment Information
              <span className="mx-1" style={{ color: "red" }}>
                *
              </span>
            </button>
          </h2>
          <div
            id="flush-collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingTwo"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <form className="form-new" action="#!">
                <div className="group-row-2">
                  <CustomSelect
                    id="totalEmployees"
                    required
                    value={totalEmployees}
                    onChange={setTotalEmployees}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Total Employees" // Label for the select
                    helperText="" // Helper text
                    options={TotalEmployeesList}
                    isMulti="false"
                  />

                  <CustomSelect
                    id="annualTurnover"
                    required
                    value={annualTurnover}
                    onChange={setAnnualTurnover}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Annual Turnover" // Label for the select
                    helperText="" // Helper text
                    options={AnnualTurnoverList}
                    isMulti="false"
                  />
                </div>

                <div className="group-row-2">
                  <CustomSelect
                    id="industrySector"
                    required
                    value={industrySector}
                    onChange={setIndustrySector}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Industry Sector" // Label for the select
                    helperText="" // Helper text
                    options={IndustrySectorList}
                    isMulti="false"
                  />

                  <CustomSelect
                    id="intendedUseOfAccount"
                    required
                    value={intendedUseOfAccount}
                    onChange={setIntendedUseOfAccount}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Intended Use Of Account" // Label for the select
                    helperText="" // Helper text
                    options={IntendedUseOfAccountList}
                    isMulti="false"
                  />
                </div>

                <div className="group-row-2">
                  <CustomSelect
                    id="countryOfOperation"
                    required
                    value={countryOfOperation}
                    onChange={setCountryOfOperation}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Country Of Operation" // Label for the select
                    helperText="" // Helper text
                    options={listCountry}
                    isMulti={true}
                  />

                  <CustomSelect
                    id="transactionCountries"
                    required
                    value={transactionCountries}
                    onChange={setTransactionCountries}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Country" // Label for the select
                    helperText="" // Helper text
                    options={listCountry}
                    isMulti={true}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const StakeholderDetails = ({ listCountry }) => {
  return <>Stakeholder Details</>;
};

const ApplicantDetails = ({ listCountry }) => {
  const [regionName, setRegionName] = useState("");

  useEffect(() => {
    const regionCode = sessionStorage.getItem("region");
    if (regionCode && regionMapping[regionCode]) {
      setRegionName(regionMapping[regionCode]);
    } else {
      setRegionName("Unknown Region");
    }
  }, []);

  const [applicantFirstName, setApplicantFirstName] = useState("");
  const [applicantMiddleName, setApplicantMiddleName] = useState("");
  const [applicantLastName, setApplicantLastName] = useState("");

  const [applicantKycMode, setApplicantKycMode] = useState("");
  const [applicantIsResident, setApplicantIsResident] = useState("");
  const [verifyModeApplicant, setVerifyModeApplicant] = useState("");

  const [verificationDisplay, setVerificationDisplay] = useState(false);

  const handleApplicantIsResident = (selectedOption) => {
    setApplicantIsResident(selectedOption.value);

    if (selectedOption.value === "yes") {
      setApplicantKycMode("E_KYC");
    }
  };

  const handleVerifyModeApplicant = (selectedOption) => {
    setVerifyModeApplicant(selectedOption.value);

    if (selectedOption.value === "yes") {
      setApplicantKycMode("E_DOC_VERIFY");
    } else {
      setApplicantKycMode("MANUAL_KYC");
    }
  };

  useEffect(() => {
    if (applicantIsResident === "no") {
      setVerificationDisplay(true);
    }
  }, [applicantIsResident, verificationDisplay]);

  const options = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];
  return (
    <>
      {/* {response && <Modal response={response} />} */}

      <div className="section-header">
        {" "}
        <h1>Applicant Details</h1>
        <button type="button" className="button-base outline-button">
          Save as draft
        </button>
      </div>

      <div className="accordion accordion-flush d-flex flex-column" id="accordionFlushExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingOne">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseOne"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
            >
              Applicant KYC Details
              <span className="mx-1" style={{ color: "red" }}>
                *
              </span>
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingOne"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <form action="#!" className="form-new">
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="applicantFirstName"
                    placeholder="Enter first name..."
                    value={applicantFirstName}
                    onChange={setApplicantFirstName}
                    className="custom-input-class full-width"
                    style={{}}
                    label="First Name"
                    helperText=""
                    required
                  />

                  <CustomInput
                    type="text"
                    id="applicantMiddleName"
                    placeholder="Enter middle name..."
                    value={applicantMiddleName}
                    onChange={setApplicantMiddleName}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Middle Name"
                    helperText=""
                  />

                  <CustomInput
                    type="text"
                    id="applicantLastName"
                    placeholder="Enter last name..."
                    value={applicantLastName}
                    onChange={setApplicantLastName}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Last Name"
                    helperText=""
                    required
                  />
                </div>

                <div className="group-row-2">
                  <input type="hidden" id="applicantKycMode" value={applicantKycMode} />

                  <CustomSelect
                    id="applicantIsResident"
                    options={options}
                    value={applicantIsResident}
                    onChange={handleApplicantIsResident}
                    className="custom-select-class full-width" // Custom classname
                    style={{ width: "50%" }} // Custom inline styles
                    label={`Are you a resident of ${regionName}?`} // Label for the select
                    helperText="" // Helper text
                    required
                    isMulti="false"
                  />

                  {verificationDisplay ? (
                    <>
                      {" "}
                      <CustomSelect
                        id="verifyModeApplicant"
                        options={options}
                        value={verifyModeApplicant}
                        onChange={handleVerifyModeApplicant}
                        className="custom-select-class full-width" // Custom classname
                        style={{}} // Custom inline styles
                        label={`Do You Want To Verify with Live Photograph?`} // Label for the select
                        helperText="" // Helper text
                        required
                        isMulti="false"
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseTwo"
              aria-expanded="false"
              aria-controls="flush-collapseTwo"
            >
              Registered Address Details
              <span className="mx-1" style={{ color: "red" }}>
                *
              </span>
            </button>
          </h2>
          <div
            id="flush-collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingTwo"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <form className="form-new" action="#!">
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="registrationAddress_1"
                    required
                    placeholder="Street address, P.O. box, company name, c/o..."
                    value={regAddress1}
                    onChange={handleRegAddress1}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Address 1"
                    helperText=""
                  />
                  <CustomInput
                    type="text"
                    id="registrationAddress_2"
                    placeholder="Apartment, suite, unit, building, floor, etc..."
                    value={regAddress2}
                    onChange={handleRegAddress2}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Address 2"
                    helperText=""
                  />
                </div>
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="registrationCity"
                    placeholder="City or locality..."
                    value={regCity}
                    onChange={handleRegCity}
                    className="custom-input-class full-width"
                    style={{}}
                    label="City"
                    helperText=""
                  />
                  <CustomInput
                    type="text"
                    id="registrationState"
                    placeholder="State, province, or region..."
                    value={regState}
                    onChange={handleRegState}
                    className="custom-input-class full-width"
                    style={{}}
                    label="State"
                    helperText=""
                  />
                </div>
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="registrationPostCode"
                    required
                    placeholder="Postal code or ZIP code..."
                    value={regPostcode}
                    onChange={handleRegPostcode}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Postal Code"
                    helperText=""
                  />
                  <CustomSelect
                    id="registrationCountry"
                    required
                    value={regCountry}
                    onChange={handleRegCountry}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Country" // Label for the select
                    helperText="" // Helper text
                    options={listCountry}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseThree"
              aria-expanded="false"
              aria-controls="flush-collapseThree"
            >
              Business Address Details
              <span className="mx-1" style={{ color: "red" }}>
                *
              </span>
            </button>
          </h2>
          <div
            id="flush-collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="flush-headingThree"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <form action="#!" className="form-new">
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="businessAddress_1"
                    required
                    placeholder="Street address, P.O. box, company name, c/o..."
                    value={bizAddress1}
                    onChange={handleBizAddress1}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Address 1"
                    helperText=""
                  />
                  <CustomInput
                    type="text"
                    id="businessAddress_2"
                    placeholder="Apartment, suite, unit, building, floor, etc...."
                    value={bizAddress2}
                    onChange={handleBizAddress2}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Address 2"
                    helperText=""
                  />
                </div>
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="businessCity"
                    placeholder="City or locality..."
                    value={bizCity}
                    onChange={handleBizCity}
                    className="custom-input-class full-width"
                    style={{}}
                    label="City"
                    helperText=""
                  />
                  <CustomInput
                    type="text"
                    id="businessState"
                    placeholder="State, province, or region..."
                    value={bizState}
                    onChange={handleBizState}
                    className="custom-input-class full-width"
                    style={{}}
                    label="State"
                    helperText=""
                  />
                </div>
                <div className="group-row-2">
                  <CustomInput
                    type="text"
                    id="businessPostCode"
                    required
                    placeholder="Postal code or ZIP code..."
                    value={bizPostcode}
                    onChange={handleBizPostcode}
                    className="custom-input-class full-width"
                    style={{}}
                    label="Postal Code"
                    helperText=""
                  />
                  <CustomSelect
                    id="businessCountry"
                    value={bizCountry}
                    onChange={handleBizCountry}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Country" // Label for the select
                    helperText="" // Helper text required
                    required
                    options={listCountry}
                  />
                </div>
              </form>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

const KYBDetails = ({ listCountry }) => {
  return <>KYB Details</>;
};

export const OnboardingDashboard = () => {
  const [region, setRegion] = useState(sessionStorage.getItem("region"));
  const [lastScreenCompleted, setLastScreenCompleted] = useState(4);
  const [listCountry, setListCountry] = useState([]);
  const [businessTypeList, setBusinessTypeList] = useState([]);
  const [TotalEmployeesList, setTotalEmployeesList] = useState([]);
  const [AnnualTurnoverList, setAnnualTurnoverList] = useState([]);
  const [IndustrySectorList, setIndustrySectorList] = useState([]);
  const [IntendedUseOfAccountList, setIntendedUseOfAccountList] = useState([]);

  const handlePrev = () => {
    setLastScreenCompleted((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setLastScreenCompleted((prev) => Math.min(prev + 1, 5));
  };

  useEffect(() => {
    const SetPage = async () => {
      const countryListApi = await utilities.FetchEnumValues("countryName", region);
      const businessTypeApi = await utilities.FetchEnumValues("businessType", region);

      const totalEmployeesApi = await utilities.FetchEnumValues("totalEmployees", region);
      const annualTurnoverApi = await utilities.FetchEnumValues("annualTurnover", region);
      const industrySectorApi = await utilities.FetchEnumValues("industrySector", region);
      const intendedUseOfAccountApi = await utilities.FetchEnumValues("intendedUseOfAccount", region);

      if (countryListApi.length > 0) {
        // Convert the API response into the desired format
        const transformedResponse = countryListApi.map((item) => ({
          value: item.code,
          label: item.description,
        }));

        setListCountry(transformedResponse);
      } else {
        console.log("Country List Could Not Be Generated");
      }

      if (businessTypeApi.length > 0) {
        // Convert the API response into the desired format
        const transformedResponse2 = businessTypeApi.map((item) => ({
          value: item.code,
          label: item.description,
        }));

        setBusinessTypeList(transformedResponse2);
      } else {
        console.log("Unable to generate Business Type dropdown");
      }

      if (totalEmployeesApi.length > 0) {
        // Convert the API response into the desired format
        const transformedResponse3 = totalEmployeesApi.map((item) => ({
          value: item.code,
          label: item.description,
        }));

        setTotalEmployeesList(transformedResponse3);
      } else {
        console.log("Unable to generate Total Employees dropdown");
      }

      if (annualTurnoverApi.length > 0) {
        // Convert the API response into the desired format
        const transformedResponse4 = annualTurnoverApi.map((item) => ({
          value: item.code,
          label: item.description,
        }));

        setAnnualTurnoverList(transformedResponse4);
      } else {
        console.log("Unable to generate Annual Turnover dropdown");
      }

      if (industrySectorApi.length > 0) {
        // Convert the API response into the desired format
        const transformedResponse5 = industrySectorApi.map((item) => ({
          value: item.code,
          label: item.description,
        }));

        setIndustrySectorList(transformedResponse5);
      } else {
        console.log("Unable to generate Industry Sector dropdown");
      }

      if (intendedUseOfAccountApi.length > 0) {
        // Convert the API response into the desired format
        const transformedResponse6 = intendedUseOfAccountApi.map((item) => ({
          value: item.code,
          label: item.description,
        }));

        setIntendedUseOfAccountList(transformedResponse6);
      } else {
        console.log("Unable to generate Intended Use Of Account dropdown");
      }

      // var internalBusinessId = sessionStorage.getItem("internalBusinessId");
      // if (internalBusinessId) {
      //   var lastScreenCompleted = sessionStorage.getItem("lastScreenCompleted");
      //   var userStatus = sessionStorage.getItem("userStatus");

      //   if (Number(lastScreenCompleted) >= 1) {
      //     document.querySelectorAll(".submit-btn").forEach((item) => {
      //       item.style.display = "none";
      //     });

      //     document.querySelectorAll(".update-btn").forEach((item) => {
      //       item.style.display = "flex";
      //     });
      //   }

      //   if (Number(lastScreenCompleted) > 1) {
      //     if (userStatus && userStatus == "C") {
      //       setStatus(list[2]);
      //     } else {
      //       setStatus(list[1]);
      //     }
      //   }
      //   await functions.GetBusinessCorporationDetails(internalBusinessId);
      // }
    };

    SetPage();
  }, []);

  useEffect(() => {}, [lastScreenCompleted, listCountry, businessTypeList]);
  return (
    <div className="p-3">
      <Header />

      <div className="p-3" style={{ minHeight: "120vh", overflowY: "auto" }}>
        {lastScreenCompleted === 1 ? (
          <GeneralDetails listCountry={listCountry} businessTypeList={businessTypeList} />
        ) : lastScreenCompleted === 2 ? (
          <BusinessDetails
            listCountry={listCountry}
            TotalEmployeesList={TotalEmployeesList}
            AnnualTurnoverList={AnnualTurnoverList}
            IndustrySectorList={IndustrySectorList}
            IntendedUseOfAccountList={IntendedUseOfAccountList}
          />
        ) : lastScreenCompleted === 3 ? (
          <StakeholderDetails listCountry={listCountry} />
        ) : lastScreenCompleted === 4 ? (
          <ApplicantDetails listCountry={listCountry} />
        ) : (
          <KYBDetails listCountry={listCountry} />
        )}

        <div className="button-container">
          {lastScreenCompleted === 1 ? (
            <>
              <button type="button" className="button-base secondary-button" onClick={handleNext}>
                Next: Business Details
              </button>
            </>
          ) : lastScreenCompleted === 2 ? (
            <>
              {" "}
              <button type="button" className="button-base primary-button" onClick={handlePrev}>
                {" "}
                Previous: General Details
              </button>
              <button type="button" className="button-base secondary-button" onClick={handleNext}>
                Next: Shareholder Details{" "}
              </button>
            </>
          ) : lastScreenCompleted === 3 ? (
            <>
              <button type="button" className="button-base primary-button" onClick={handlePrev}>
                {" "}
                Previous: Business Details
              </button>
              <button type="button" className="button-base secondary-button" onClick={handleNext}>
                Next: Applicant Details
              </button>
            </>
          ) : lastScreenCompleted === 4 ? (
            <>
              {" "}
              <button type="button" className="button-base primary-button" onClick={handlePrev}>
                {" "}
                Previous: Shareholder Details
              </button>
              <button type="button" className="button-base secondary-button" onClick={handleNext}>
                Next: KYB Details
              </button>
            </>
          ) : (
            <>
              <button type="button" className="button-base primary-button" onClick={handlePrev}>
                {" "}
                Previous: Applicant Details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingDashboard;
