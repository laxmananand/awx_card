import { MenuItem, TextField, debounce } from "@mui/material";
import React, { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import {
  BsBank,
  BsCodeSlash,
  BsCurrencyBitcoin,
  BsGlobeAmericas,
  BsHash,
  BsPlus,
} from "react-icons/bs";
import { TbBuildingEstate, TbMap2 } from "react-icons/tb";
import { PiSignpostDuotone } from "react-icons/pi";
import { LiaAddressCard } from "react-icons/lia";
import { MdManageAccounts, MdPayment } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { RxValue } from "react-icons/rx";
import Select from "react-select";
import { useHref, useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import {
  getPayoutMethod,
  getCurrencyAndCountry,
  getBankName,
  listbeneficiaries, updateBeneficiary, fetchDetails
} from "../../../../@redux/action/payments";
import "../../css/CountryDropdown.css";
import CustomTextField from "../../../structure/CustomText";
import CustomSelect from "../../../structure/CustomSelect";
import CustomSelectNew from "../../../structure/CustomSelect";
import NumberField from "../../../structure/NumberField";
import { setSelectedBeneficiary } from "../../../../@redux/features/payments";

function BasicInfo({
  formData,
  selectedBeneficiary,
  setFormData,
  countryList,
  phoneCodeList,
  setCurrentState,
}) {
  const [isBusiness, setIsBusiness] = useState(false);
  const [mailError, setMailError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [phError, setPhError] = useState(false);
  const [stateError, setStateError] = useState(false);

  const [cityError, setCityError] = useState(false);
  const [postCodeError, setPostCodeError] = useState(false);


  React.useEffect(() => {
    if (formData?.beneficiaryAccountType == "Individual") {
      setIsBusiness(false);
    } else {
      setIsBusiness(true);
    }
  }, [formData?.beneficiaryHashId]);
  const redirecttoaccinfo = () => {
    setCurrentState("account");
  };
  const handleNameChange = (e) => {
    setFormData({ ...formData, beneficiaryName: e.target.value });
  };
  const handleEmailChange = (e) => {
    // const { value } = e.target;   
    // const emailPattern ="^([a-zA-Z0-9+_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,63})$";
    // setIsValidEmail(emailPattern.match(value));
    setFormData({ ...formData, beneficiaryEmail: e.target.value });
    if (e.target.validity.valid) {
      setMailError(false);
    } else {
      setMailError(true);
    }


  };
  const handlemobcountrycodeChange = (e) => {
    setFormData({
      ...formData,
      beneficiaryContactCountryCode: e
    });
  };

  const handlephoneChange = (e) => {
    setFormData({
      ...formData,
      beneficiaryContactNumber: e.target.value,
    });
    if (e.target.value.length < 17 && e.target.value.length > 9) {
      setPhError(false);
    } else {
      setPhError(true);
    }
  };
  const handleAddressChange = (e) => {
    setFormData({ ...formData, beneficiaryAddress: e.target.value });
    if (e.target.value.length < 200) {
      setNameError(false);
    } else {
      setNameError(true);
    }
  };

  const handlebeneficiaryCountryCodeChange = (e) => {
    setFormData({ ...formData, beneficiaryCountryCode: e });
  };
  const handlebeneficiaryStateChange = (e) => {
    setFormData({ ...formData, beneficiaryState: e.target.value });
    if (e.target.value.length < 200) {
      setStateError(false);
    } else {
      setStateError(true);
    }
  };
  const handlebeneficiaryCityChange = (e) => {
    setFormData({ ...formData, beneficiaryCity: e.target.value });
    if (e.target.value.length < 200) {
      setCityError(false);
    } else {
      setCityError(true);
    }
  };
  const handlebeneficiaryPostcodeChange = (e) => {
    setFormData({ ...formData, beneficiaryPostcode: e.target.value });
    if (e.target.value.length < 200) {
      setPostCodeError(false);
    } else {
      setPostCodeError(true);
    }
  };

  return (
    <>
      <h5 className="text-dark">{isBusiness ? "Business" : "Personal"} Info</h5>

      <form
        className="overflow-auto border py-3 px-4 rounded-4"
        // style={{ maxHeight: "50vh" }}
        onSubmit={(e) => {
          e.preventDefault();
          redirecttoaccinfo();
        }}
      >
        <div className="d-flex">
          <div className="d-flex border-bottom mb-4 w-50 me-1">
            <div className="d-flex">
              <img
                src="/payments/name.svg"
                width={40}
                className="border-end my-auto px-2"
              />
            </div>
            <div className="input-group containertext w-100 h-100">
              <CustomTextField
                id="name"
                required
                label={isBusiness ? "Business Name" : "Name"}
                value={formData?.beneficiaryName}
                onChange={handleNameChange}
                style={{ border: "none" }}
                // readOnly
              />
            </div>
          </div>

          <div className="d-flex border-bottom mb-4 w-50 ms-1">
            <div className="d-flex">
              <img
                src="/payments/email.svg"
                width={40}
                className="border-end my-auto px-2"
              />
            </div>
            <div className="input-group containertext w-100 h-100">
              {/* <CustomTextField
                id="email"
                label={isBusiness ? "Business Email" : "Email"}
                value={formData?.beneficiaryEmail}
                onChange={handleEmailChange}
                style={{ border: "none" }}
                error={!isValidEmail}
               /> */}

              <TextField

                label={isBusiness ? "Business Email" : "Email"}
                value={formData?.beneficiaryEmail}
                onChange={handleEmailChange}
                inputProps={{
                  pattern: "^([a-zA-Z0-9+_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,63})$",
                }}
                error={mailError}
                helperText={
                  mailError ? "Beneficiary should have a valid email address." : ""
                }
              />
            </div>
          </div>
        </div>

        <div className="d-flex">
          {/* {!isBusiness && ( */}
            <div className="d-flex mb-4 w-100 me-1">
              <div className="d-flex w-50 border-bottom">
                <img
                  src="/payments/phone.svg"
                  width={40}
                  className="border-end my-auto px-2"
                />
                <CustomSelect
                  className="w-100 h-100"
                  placeholder="Contact Country Code"
                  options={phoneCodeList}
                  value={phoneCodeList.find(
                    (item) =>
                      item.value == formData?.beneficiaryContactCountryCode
                  )}
                  setValue={handlemobcountrycodeChange}
                />
              </div>

              {/* <CustomSelect
                className="w-100 h-100"
                placeholder="Select Country"
                options={countryList}
                value={countryList.find(
                  (item) => item.value == formData?.beneficiaryCountryCode
                )}
                setValue={handlebeneficiaryCountryCodeChange}
              /> */}


              <div className="w-50 ms-1 border-bottom">
                <TextField
                  id="phone"
                  label="Contact Number"
                  className="w-100 ms-1"
                  value={formData?.beneficiaryContactNumber}
                  onChange={handlephoneChange}
                  style={{ border: "none" }}
                  inputProps={{
                    pattern: "^[0-9]{1,17}$",
                    maxLength: 17
                  }}
                  error={phError}
                  helperText={
                    phError ? "Length of Contact Number should not be less than 9 digits & should not be more than 17 digits." : ""
                  }
                />
              </div>
            </div>
           {/* )} */}
        </div>

        <div className="d-flex border-bottom mb-4">
          <LiaAddressCard
            size={40}
            className="text-dark opacity-50 px-2 border-end"
          />

          <div className="input-group containertext w-100 h-100">
            <TextField
              id="beneficiaryAddress"
              label="Address"
              value={formData?.beneficiaryAddress}
              onChange={handleAddressChange}
              style={{ border: "none", width: "100%" }}
              inputProps={{
                // pattern: "^[0-9]{1,17}$",
                maxLength: 200
              }}
              error={nameError}
              helperText={
                nameError ? "Length of Address should not be more than 200 characters." : ""
              }
            />
          </div>
        </div>

        <div className="d-flex">
          <div className="d-flex border-bottom mb-4 w-100 me-1">
            <BsGlobeAmericas
              size={40}
              className="text-dark opacity-50 px-2 border-end"
            />

            <div className="input-group containertext w-100 h-100">
              {/* <CustomSelect placeholder="Country" /> */}

              <CustomSelect
                required
                className="w-100 h-100"
                placeholder="Beneficiary Country"
                options={countryList}
                value={countryList.find(
                  (item) => item.value == formData?.beneficiaryCountryCode
                )}
                setValue={handlebeneficiaryCountryCodeChange}
              />
            </div>
          </div>

          <div className="d-flex border-bottom mb-4 w-100 mx-1">
            <TbMap2
              size={40}
              className="border-end my-auto px-2 text-dark opacity-50"
            />
            <div className="input-group containertext w-100 h-100">
              <TextField
                id="beneficiaryState"
                label="State"
                value={formData?.beneficiaryState}
                onChange={handlebeneficiaryStateChange}
                style={{ border: "none" }}
                inputProps={{
                  // pattern: "^[0-9]{1,17}$",
                  maxLength: 50
                }}
                error={stateError}
                helperText={
                  stateError ? "Length of State should not be more than 50 characters." : ""
                }
              />
            </div>
          </div>

          <div className="d-flex border-bottom mb-4 w-100 ms-1">
            <TbBuildingEstate
              size={40}
              className="border-end my-auto px-2 text-dark opacity-50"
            />
            <div className="input-group containertext w-100 h-100">
              <TextField
                id="beneficiaryCity"
                label="City"
                value={formData?.beneficiaryCity}
                onChange={handlebeneficiaryCityChange}
                style={{ border: "none" }}
                inputProps={{
                  // pattern: "^[0-9]{1,17}$",
                  maxLength: 50
                }}
                error={cityError}
                helperText={
                  cityError ? "Length of city should not be more than 50 characters." : ""
                }
              />
            </div>
          </div>
        </div>

        <div className="d-flex">
          <div className="d-flex border-bottom mb-4 w-100 me-1">
            <PiSignpostDuotone
              size={40}
              className="border-end my-auto px-2 text-dark opacity-50"
            />

            <div className="input-group containertext w-100 h-100">
              <TextField
                id="beneficiaryPostcode"
                className="w-100"
                label="Postcode"
                value={formData?.beneficiaryPostcode}
                onChange={handlebeneficiaryPostcodeChange}
                style={{ border: "none" }}
                inputProps={{
                  // pattern: "^[0-9]{1,17}$",
                  maxLength: 15
                }}
                error={postCodeError}
                helperText={
                  postCodeError ? "Length of Post Code should not be more than 15 characters." : ""
                }
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-action border w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500"
        >
          Next
        </button>
      </form>
    </>
  );
}

function AccountInfo({
  formData,
  setFormData,
  countryList,
  currencyList,
  setCurrentState,
  selectedBeneficiary,
  customerHashId
}) {
  const dispatch = useDispatch();
  const bankNameList = useSelector((state) => state.payments.bankNameList);
  const [isTextField, setIsTextField] = useState(false);
  const bankNameWithValue = useSelector(
    (state) => state.payments.bankNameWithValue
  );
  const [routingCodeValueOptions, setRoutingCodeValueOptions] = React.useState(
    []
  );
  const isLoading = useSelector((state) => state.payments.isLoading);

  useEffect(() => {
    // for (var i = 0; i < routingCodeValueOptions.length; i++) {
    console.log(routingCodeValueOptions, "routingCodeValueOptions");
    // }
  }, [formData?.beneficiaryBankName]);

  const debounce = (getbank, timeout = 1000) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        getbank.apply(this, args);
      }, timeout);
    };
  };

  const handlebankchanges = debounce((value) => {
    const body = {
      currencyCode: formData?.destinationCurrency,
      searchValue: value,
      countryCode: formData?.destinationCountry,
      routingCodeType: formData?.routingCodeType1,
    };
    if (value !== "") dispatch(getBankName(body));
  });
  const setbankname = (e) => {
    setIsTextField(false);
    setFormData((prev) => ({ ...prev, beneficiaryBankName: e }));
    setFormData((prev) => ({ ...prev, routingCodeValue1: "" }));
  };
  const setroutingcodevalue = (e) => {
    setFormData((prev) => ({ ...prev, routingCodeValue1: e }));
  };
  const handleroutingcodevalue = (e) => {
    setFormData((prev) => ({ ...prev, routingCodeValue1: e }));
  };
  const handleAccountnumberChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      beneficiaryAccountNumber: e.target.value,
    }));
  };
  const onsubmit = async (e) => {
    e.preventDefault();
    let changedData = {};

    if (!formData?.routingCodeValue1) {
      toast.error(formData?.routingCodeType1 +" value is required");
      // Handle error: Show an error message or take appropriate action
  } 

  else{
    for (const key in formData) {
      if (
        selectedBeneficiary.hasOwnProperty(key) &&
        formData[key] !== selectedBeneficiary[key]
      ) {
        changedData[key] = formData[key];
      }
    }
  
  // Ensure 'beneficiaryName' is always included
  changedData["beneficiaryName"] = formData["beneficiaryName"] ? formData["beneficiaryName"] : selectedBeneficiary["beneficiaryName"];
  changedData["beneficiaryCountryCode"] = formData["beneficiaryCountryCode"] ? formData["beneficiaryCountryCode"] : selectedBeneficiary["beneficiaryCountryCode"];
  
    // for (const key in selectedBeneficiary) {
    //   if (key == "beneficiaryCountryCode") {
    //     changedData[key] = selectedBeneficiary[key];
    //   }
    // }
    try {
  
      await dispatch(updateBeneficiary(changedData, selectedBeneficiary?.beneficiaryHashId));
      setFormData({});
      dispatch(fetchDetails(selectedBeneficiary?.beneficiaryHashId, customerHashId));
      dispatch(listbeneficiaries(customerHashId));
      setCurrentState("basic");
      document.getElementById("editBeneficiaryClose").click();
    } catch (error) {
      console.error("Error updating beneficiary:", error);
    }

  }

  };

  React.useEffect(() => {
    if (formData?.beneficiaryBankName) {
      setRoutingCodeValueOptions(
        bankNameWithValue?.find(
          (item) => item.name == formData?.beneficiaryBankName
        )?.option
      );
    }
  }, [formData?.beneficiaryBankName]);

  return (
    <>
      <h5 className="text-dark mb-3">Account Info</h5>

      <form className="border py-3 px-2 rounded-4" onSubmit={onsubmit}>
        <div className="d-flex">
          <div className="d-flex border-bottom mb-4 w-100 ms-1">
            <BsGlobeAmericas
              size={40}
              className="text-dark opacity-50 px-2 border-end"
            />

            <div className="input-group containertext w-100 h-100">
              <CustomTextField
                required
                id="name"
                label="Destination Country"
                value={formData?.destinationCountry}
                // onChange={handleNameChange}
                style={{ border: "none" }}
                readOnly
              />
            </div>
          </div>

          <div className="d-flex border-bottom mb-4 w-100 ms-1">
            <BsCurrencyBitcoin
              size={40}
              className="border-end my-auto px-2 text-dark opacity-50"
            />

            <div className="input-group containertext w-100 h-100">
              <TextField
                required
                id="name"
                label="Destination Currency"
                value={formData?.destinationCurrency}
                // onChange={handleNameChange}
                style={{ border: "none" }}
                readOnly
              />
            </div>
          </div>
        </div>

        {formData?.destinationCountry && formData?.destinationCurrency && (
          <div className="d-flex">
            <div className="d-flex border-bottom mb-4 w-100 ms-1 align-items-center">
              <RiSecurePaymentLine
                size={40}
                className="text-dark opacity-50 px-2 border-end"
              />

              <div className="input-group containertext w-100">
                <TextField
                  required
                  id="name"
                  label="Payment Method"
                  value={formData?.payoutMethod}
                  // onChange={handleNameChange}
                  style={{ border: "none" }}
                  readOnly
                />
              </div>
            </div>

            <div className="d-flex border-bottom mb-4 w-100 ms-1">
              <BsCodeSlash
                size={40}
                className="border-end my-auto px-2 text-dark opacity-50"
              />

              <div className="input-group containertext w-100 h-100">
                <TextField
                  required
                  label="Routing Code Type"
                  id="routingCodeType1"
                  className="custom-select text-start"
                  // onChange={handleRoutingTypeChange}
                  value={formData?.routingCodeType1}
                  InputProps={{ readOnly: true }}
                ></TextField>
              </div>
            </div>
          </div>
        )}

        {formData?.destinationCountry &&
          formData?.destinationCurrency &&
          formData?.routingCodeType1 && (
            <div className="">
              <div className="d-flex border-bottom mb-4 w-100 ms-1 align-items-center">
                <BsBank
                  size={40}
                  className="text-dark opacity-50 px-2 border-end"
                />

                <div className="input-group containertext w-100">
                  <CustomSelect
                    required
                    className="w-100 h-100"
                    placeholder="Bank Name"
                    options={bankNameList}
                    value={{
                      label: formData?.beneficiaryBankName,
                      value: formData?.beneficiaryBankName,
                    }}
                    setValue={setbankname}
                    onInputChange={handlebankchanges}
                  />
                </div>
              </div>

              {formData?.beneficiaryBankName?.length > 0 && (
                <div className="d-flex">
                  <div className="d-flex border-bottom mb-4 w-100 me-1">
                    <RxValue
                      size={40}
                      className="border-end my-auto px-2 text-dark opacity-50"
                    />

                    <div className="input-group containertext w-100 h-100">
                      {
                      routingCodeValueOptions?.length === 1 &&
                      routingCodeValueOptions[0]?.value == "{}" ? (
                        <CustomTextField
                          required
                          id="routingCodeValue1"
                          className="w-100"
                          label={formData?.routingCodeType1 + " code"}
                          value={formData?.routingCodeValue1}
                          onChange={handleroutingcodevalue}
                          style={{ border: "none" }}
                        />
                      ) : (
                        <CustomSelectNew
                          required
                          setIsTextField={setIsTextField}
                          isTextField={isTextField}
                          className="w-100 h-100"
                          placeholder={formData?.routingCodeType1 + " code"}
                          label={formData?.routingCodeType1 + " code"}
                          options={routingCodeValueOptions}
                          value={{
                            label: formData?.routingCodeValue1,
                            value: formData?.routingCodeValue1,
                          }}
                          setValue={setroutingcodevalue}
                        // onInputChange={handleroutingcodevalue}
                        />
                      )}
                    </div>
                  </div>
                  <div className="d-flex border-bottom mb-4 w-100 ms-1">
                    <BsHash
                      size={40}
                      className="border-end my-auto px-2 text-dark opacity-50"
                    />
                    <div className="input-group containertext w-100 h-100 ms-1">
                      <CustomTextField
                        required
                        id="accountno"
                        label="Account Number"
                        className="w-100"
                        value={formData?.beneficiaryAccountNumber}
                        onChange={handleAccountnumberChange}
                        style={{ border: "none" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        <div className="d-flex mt-3 gap-5">
          <button
            className="btn btn-action border w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500"
            onClick={(e) => {
              e.preventDefault();
              setCurrentState("basic");
            }}
          >
            Back
          </button>
          <button
            className="btn btn-action border w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500"
            // onClick={() => console.warn(basicInfo)}
            disabled={isLoading} // Disable the button when loading
            type="submit"
          >
            {isLoading ? (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            "Update"
          )}
            
          </button>
        </div>
      </form>
    </>
  );
}

function EditBeneficiarynew({ data, customerHashId = null }) {
  const [currentState, setCurrentState] = useState("basic");
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(fetchDetails(data?.beneficiaryHashId, customerHashId));
  }, [data?.beneficiaryHashId]);
  const selectedBeneficiary = useSelector(
    (state) => state.payments.selectedBeneficiary
  );

  const upperCamelCase = (str) => {
    // Split the string into words
    const words = str.split(" ");
    // Capitalize the first letter of each word
    const capitalizeWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    // Join the words back together with a space
    return capitalizeWords.join(" ");
  };
  useEffect(() => {
    //setSelectedBeneficiary({});
    if (selectedBeneficiary) {
      const {
        beneficiaryName,
        beneficiaryContactCountryCode,
        beneficiaryContactNumber,
        beneficiaryEmail,
        beneficiaryAddress,
        beneficiaryCountryCode,
        beneficiaryState,
        beneficiaryCity,
        beneficiaryPostcode,
        destinationCountry,
        destinationCurrency,
        beneficiaryBankName,
        beneficiaryAccountNumber,
        routingCodeType1,
        routingCodeValue1,
        payoutMethod,
      } = selectedBeneficiary;
      const extractedData = {
        beneficiaryName,
        beneficiaryContactCountryCode,
        beneficiaryContactNumber,
        beneficiaryEmail,
        beneficiaryAddress,
        beneficiaryCountryCode,
        beneficiaryState,
        beneficiaryCity,
        beneficiaryPostcode,
        destinationCountry,
        destinationCurrency,
        beneficiaryBankName,
        beneficiaryAccountNumber,
        routingCodeType1,
        routingCodeValue1,
        payoutMethod,
      };
      setFormData(extractedData);
    }
  }, [selectedBeneficiary]);


  const countryList = useSelector((state) => state.payments.countryList);
  const currencyList = useSelector((state) => state.payments.currencyList);
  const phoneCodeList = useSelector((state) => state.payments.phoneCodeList);

  return (
    <div
      className="modal fade"
      id="EditAccountModal"
      tabIndex={-1}
      aria-labelledby="EditAccountModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content p-5 text-center">
          <div className="d-flex justify-content-between my-2">
            {/* <h5 className="text-dark">
              Editing {upperCamelCase(data?.beneficiaryName)}'s Details
            </h5> */}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="editBeneficiaryClose"
              //onClick={() => setFormData({})}
            />
          </div>

          <div className="d-flex my-2">
            <img
              src="/payments/createBeneficiaries.svg"
              className="mx-auto"
            />
          </div>

          {currentState === "basic" ? (
            <BasicInfo
              formData={formData}
              selectedBeneficiary={selectedBeneficiary}
              setFormData={setFormData}
              countryList={countryList}
              phoneCodeList={phoneCodeList}
              setCurrentState={setCurrentState}
            />
          ) : (
            <AccountInfo
              formData={formData}
              setFormData={setFormData}
              countryList={countryList}
              currencyList={currencyList}
              setCurrentState={setCurrentState}
              selectedBeneficiary={selectedBeneficiary}
              customerHashId={customerHashId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditBeneficiarynew;
