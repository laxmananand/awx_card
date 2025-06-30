import { MenuItem, TextField, debounce } from "@mui/material";
import React, { useEffect, useState } from "react";
import { listcountry } from "../../js/common";
import { listmobcountrycode } from "../../js/common";
import { fetchCurrency } from "../../js/ListBeneficiaries";
import { editBeneficiary } from "../../js/ListBeneficiaries";
import { ToastContainer, toast } from "react-toastify";
import { ConfirmPayee } from "../../js/ListBeneficiaries";
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
} from "../../../../@redux/action/payments";
import "../../css/CountryDropdown.css";
import CustomTextField from "../../../structure/CustomText";
import CustomSelect from "../../../structure/CustomSelect";
import NumberField from "../../../structure/NumberField";
// import { useSelector } from "react-redux";

const beneficiaryacctype = ["Individual", "Corporate"];
const payoutMethod = ["LOCAL", "SWIFT", "WALLET"];
const routingCodeType1 = [
  "SWIFT",
  "IFSC",
  "SORT CODE",
  "ACH CODE",
  "BRANCH CODE",
  "BSB CODE",
  "BANK CODE",
];

function BasicInfo({
  data,
  basicInfo,
  setBasicInfo,
  setCurrentState,
  customerHashId,
}) {
  const [isBusiness, setIsBusiness] = useState(false);
  const [countryList, setcountryList] = useState([]);
  const [mobcountrycode, setmobcountrycode] = useState([]);

  useEffect(() => {
    if (data?.beneficiaryAccountType == "Individual") {
      setIsBusiness(false);
      setBasicInfo({ ...basicInfo, beneficiaryAccountType: "Individual" });
    }
    if (data?.beneficiaryAccountType == "Corporate") {
      setIsBusiness(true);
      setBasicInfo({ ...basicInfo, beneficiaryAccountType: "Corporate" });
    }
  }, [data?.beneficiaryHashId]);

  useEffect(() => {
    listcountry().then((response) => {
      // console.log(response.result);
      setcountryList(response.result);
    });
    listmobcountrycode().then((response) => {
      // console.log(response.result);
      setmobcountrycode(response.result);
    });
  }, []);
  const handleNameChange = (e) => {
    const beneficiaryName = e.target.value;
    setBasicInfo({ ...basicInfo, beneficiaryName: beneficiaryName });
  };

  const handleEmailChange = (e) => {
    setBasicInfo({ ...basicInfo, beneficiaryEmail: e.target.value });
  };

  const handlemobcountrycodeChange = (e) => {
    setBasicInfo({
      ...basicInfo,
      beneficiaryContactCountryCode: e.target.value,
    });
  };

  const handlephoneChange = (e) => {
    setBasicInfo({
      ...basicInfo,
      beneficiaryContactNumber: e.target.value,
    });
  };
  const handleAddressChange = (e) => {
    setBasicInfo({ ...basicInfo, beneficiaryAddress: e.target.value });
  };

  const handlebeneficiaryCountryCodeChange = (e) => {
    setBasicInfo({ ...basicInfo, beneficiaryCountryCode: e });
  };
  const handlebeneficiaryStateChange = (e) => {
    setBasicInfo({ ...basicInfo, beneficiaryState: e.target.value });
  };
  const handlebeneficiaryCityChange = (e) => {
    setBasicInfo({ ...basicInfo, beneficiaryCity: e.target.value });
  };
  const handlebeneficiaryPostcodeChange = (e) => {
    setBasicInfo({ ...basicInfo, beneficiaryPostcode: e.target.value });
  };
  const redirecttoaccinfo = () => {
    setCurrentState("account");
  };
  //   useEffect(() => {
  //     if (!isBusiness) {
  //       setBasicInfo({ ...basicInfo, beneficiaryAccountType: "Individual" });
  //     } else {
  //       setBasicInfo({ ...basicInfo, beneficiaryAccountType: "Corporate" });
  //     }
  //   }, []);
  const countryOptions = useSelector((state) => state.payments.countryList);

  return (
    <>
      <h5 className="text-dark">{isBusiness ? "Business" : "Personal"} Info</h5>

      <form
        className="overflow-auto border py-3 px-4 rounded-4"
        // style={{ maxHeight: "50vh" }}
        onSubmit={(e) => {
          e.preventDefault();
          // {() => setCurrentState("account")}
          redirecttoaccinfo();
        }}
      >
       <div className="d-flex">
          <div className="d-flex border-bottom mb-4 w-50 me-1">
            <div className="d-flex">
              <img src="/payments/name.svg" width={40} className="border-end my-auto px-2" />
            </div>
            <div className="input-group containertext w-100 h-100">
              <CustomTextField
                id="name"
                label={isBusiness ? "Business Name" : "Name"}
                value={data?.beneficiaryName}
                onChange={handleNameChange}
                style={{ border: "none" }}
              />
            </div>
          </div>

          <div className="d-flex border-bottom mb-4 w-50 ms-1">
            <div className="d-flex">
              <img src="/payments/email.svg" width={40} className="border-end my-auto px-2" />
            </div>
            <div className="input-group containertext w-100 h-100">
              <CustomTextField
                id="email"
                label={isBusiness ? "Business Email" : "Email"}
                value={data?.beneficiaryEmail}
                onChange={handleEmailChange}
                style={{ border: "none" }}
              />
            </div>
          </div>
        </div>

        <div className="d-flex">
          {!isBusiness && (
            <div className="d-flex mb-4 w-100 me-1">
              <div className="d-flex w-50 border-bottom">
                <img src="/payments/phone.svg" width={40} className="border-end my-auto px-2" />
                <TextField
                  select
                  id="selectBox1"
                  label="Country Code"
                  className="w-100 me-1 text-start"
                  value={data?.beneficiaryContactCountryCode}
                  onChange={handlemobcountrycodeChange}
                >
                  <MenuItem value="" disabled selected>
                    Country Code
                  </MenuItem>
                  {mobcountrycode.map((country) => (
                    <MenuItem key={country?.ISO_country_code} value={country?.ISD_country_code}>
                      + {country?.ISD_country_code} {country?.country_name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="w-50 ms-1 border-bottom">
                <CustomTextField
                  id="phone"
                  label="Phone"
                  className="w-100 ms-1"
                  value={data?.beneficiaryContactNumber}
                  onChange={handlephoneChange}
                  style={{ border: "none" }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="d-flex border-bottom mb-4">
          <LiaAddressCard size={40} className="text-dark opacity-50 px-2 border-end" />

          <div className="input-group containertext w-100 h-100">
            <CustomTextField
              id="beneficiaryAddress"
              label="Address"
              value={data?.beneficiaryAddress}
              onChange={handleAddressChange}
              style={{ border: "none", width: "100%" }}
            />
          </div>
        </div>

        <div className="d-flex">
          <div className="d-flex border-bottom mb-4 w-100 me-1">
            {/* <div className="d-flex">
              <img
                src="/payments/iban.svgk"
                width={40}
                className="border-end my-auto px-2"
              />
            </div> */}
            <BsGlobeAmericas size={40} className="text-dark opacity-50 px-2 border-end" />

            <div className="input-group containertext w-100 h-100">
              {/* <CustomSelect placeholder="Country" /> */}
              {/* <TextField
                                select
                id="selectBox"
                className="w-100 text-start"
                label="Country"
                value={basicInfo?.beneficiaryCountryCode}
                onChange={handlebeneficiaryCountryCodeChange}
              >
                <MenuItem value="" disabled selected>
                  Country
                </MenuItem>
                {countryList.map((country) => (
                  <MenuItem
                    key={country.ISO_country_code}
                    value={country.ISOcc_2char}
                  >
                    {country.country_name}
                  </MenuItem>
                ))}
              </TextField> */}
              <CustomSelect
                className="w-100 h-100"
                placeholder="Select Country"
                options={countryOptions}
                value={countryOptions.find((item) => item.value == data?.beneficiaryCountryCode)}
                setValue={handlebeneficiaryCountryCodeChange}
              />
            </div>
          </div>

          <div className="d-flex border-bottom mb-4 w-100 mx-1">
            {/* <div className="d-flex">
              <img
                src="/payments/iban.svg"
                width={40}
                className="border-end my-auto px-2"
              />
            </div> */}
            <TbMap2 size={40} className="border-end my-auto px-2 text-dark opacity-50" />
            <div className="input-group containertext w-100 h-100">
              {/* <CustomSelect placeholder="State" /> */}
              <CustomTextField
                id="beneficiaryState"
                label="State"
                value={data?.beneficiaryState}
                onChange={handlebeneficiaryStateChange}
                style={{ border: "none" }}
              />
            </div>
          </div>

          <div className="d-flex border-bottom mb-4 w-100 ms-1">
            <TbBuildingEstate size={40} className="border-end my-auto px-2 text-dark opacity-50" />
            <div className="input-group containertext w-100 h-100">
              <CustomTextField
                id="beneficiaryCity"
                label="City"
                value={data?.beneficiaryCity}
                onChange={handlebeneficiaryCityChange}
                style={{ border: "none" }}
              />
            </div>
          </div>
        </div>

        <div className="d-flex">
          <div className="d-flex border-bottom mb-4 w-100 me-1">
            <PiSignpostDuotone size={40} className="border-end my-auto px-2 text-dark opacity-50" />

            <div className="input-group containertext w-100 h-100">
              <CustomTextField
                id="beneficiaryPostcode"
                className="w-100"
                label="Postcode"
                value={data?.beneficiaryPostcode}
                onChange={handlebeneficiaryPostcodeChange}
                style={{ border: "none" }}
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn bg-green100 fw-500 text-white py-3 w-100 mt-3"
        >
          Next
        </button>
      </form>
    </>
  );
}

function AccountInfo({
  data,
  basicInfo,
  setCurrentState,
  customerHashId,
  setBasicInfo,
}) {
  const [isBusiness, setIsBusiness] = useState(false);
  const [currency, setcurrency] = useState([]);
  const [countryList, setcountryList] = useState([]);
  const navigate = useNavigate();
  const paymentMethodOptions = useSelector(
    (state) => state.payments.payoutMethodOptions
  );

  const [cond1, setCond1] = useState(false);
  const [cond2, setCond2] = useState(false);
  const [destinationCountry, setDestinationCountry] = useState("");
  const [destinationCurrency, setDestinationCurrency] = useState("");

  const [bankName, setBankName] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [listBankName, setListBankName] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectroutingcodeType, setselectroutingcodeType] = useState("");

  const [selectedValue, setSelectedValue] = useState("");
  const [isAllValuesSame, setIsAllValuesSame] = useState(true);
  const [isAllpayoutSame, setIsAllpayoutSame] = useState(true);
  const [routingCodeType, setRoutingCodeType] = useState();
  const countryOptions = useSelector((state) => state.payments.countryList);
  const currencyOptions = useSelector((state) => state.payments.currencyList);

  const [PayoutMethod, setPayoutMethod] = useState([]);
  const [query, setQuery] = useState("");
  const [bankListOptions, setBankListOptions] = useState([]);
  const [formData, setFormData] = useState({
    destinationCountry: basicInfo?.destinationCountry,
    destinationCurrency: basicInfo?.destinationCurrency,
    beneficiaryAccountType: basicInfo?.beneficiaryAccountType,
  });

  useEffect(() => {
    if (selectedBank) {
      setBasicInfo({
        ...basicInfo,
        beneficiaryBankName: selectedBank,
        routingCodeValue1: "",
      });
    }
  }, [selectedBank]);
  useEffect(() => {
    setBankListOptions(
      listBankName?.map((bank) => ({
        label: bank?.bankName,
        value: bank?.routingCodeValue,
      }))
    );
  }, [listBankName]);

  // useEffect(() => {
  //   listCountrycurrency().then((response) => {
  //     // console.log(response.List);
  //     setcountryList(response.List);
  //   });
  // }, []);
  React.useEffect(() => {
    dispatch(getCurrencyAndCountry());
  }, []);

  const handledestinationCountryChange = (e) => {
  
    // console.log(e.target, "destinationcountry");
    setCond1(Boolean(e));
    setBasicInfo({ ...basicInfo, destinationCountry: e });
    setDestinationCountry(e);
    setFormData({ ...formData, destinationCountry: e });
  };

  const handledestinationCurrencyChange = async (e) => {
    const currency = e;
    setBasicInfo({ ...basicInfo, destinationCurrency: currency });
    setCond2(Boolean(currency));
    setDestinationCurrency(currency);
    setFormData({ ...formData, destinationCurrency: currency });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const inner = async () => {
      // alert(customerHashId);
      const Result = await beneficiaryValidationSchema(
        basicInfo?.paymentMethod,
        basicInfo?.destinationCurrency,
        customerHashId
      );

      setRoutingCodeType(Result[0]);
      setBasicInfo({ ...basicInfo, routingCodeType1: Result[0] });
    };
    if (
      basicInfo?.paymentMethod &&
      paymentMethodOptions?.length > 0 &&
      (!basicInfo?.paymentMethod ||
        paymentMethodOptions.find(
          (item) => item.value == basicInfo?.paymentMethod
        ) === basicInfo?.paymentMethod)
    )
      inner();
  }, [basicInfo?.paymentMethod, paymentMethodOptions?.length]);

  useEffect(() => {
    const inner = async () => {
      try {
        dispatch(getPayoutMethod({ ...basicInfo, customerHashId }));
        const result = await fetchSupportedCorridors(formData);
        // console.log(result);
        if (result === undefined) {
          setPayoutMethod([]);
          setBasicInfo({ ...basicInfo, payoutMethod: "" });
        } else {
          setPayoutMethod(result);
          setBasicInfo({ ...basicInfo, payoutMethod: result });
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    if (basicInfo?.destinationCountry && basicInfo?.destinationCurrency)
      inner();
  }, [formData]);

  const handleRoutingTypeChange = (e) => {
    setselectroutingcodeType(e.target.value);
    setBasicInfo({ ...basicInfo, routingCodeType1: e.target.value });
  };
  const handleRoutingvalueChange = (e) => {
    setBasicInfo({ ...basicInfo, routingCodeValue1: e.target.value });
  };
  const handleAccountnumberChange = (e) => {
    setBasicInfo({ ...basicInfo, beneficiaryAccountNumber: e.target.value });
  };
  const handlebankchanges = (e) => {
    setQuery(e);
    debouncedGetData(e);
  };

  const getbank = (query) => {
    if (query)
      banklist(
        query,
        data?.destinationCurrency,
        data?.destinationCountry,
        data?.routingCodeType1
      )
        .then((res) => {
          setListBankName(res);
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const debounce = (getbank, timeout = 500) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        getbank.apply(this, args);
      }, timeout);
    };
  };
  const debouncedGetData = debounce(getbank, 500);

  const banklist = (
    query,
    destinationCurrency,
    destinationCountry,
    selectroutingcodeType
  ) => {
    const response = fetchBank(
      query,
      destinationCurrency,
      destinationCountry,
      selectroutingcodeType
    );
    return response;
  };

  return (
    <>
      <h5 className="text-dark mb-3">Account Info</h5>

      <form
        className="border py-3 px-2 rounded-4"
        onSubmit={async (e) => {
          e.preventDefault();
          // console.warn(basicInfo);
          //   addbeneficiry(customerHashId);
          await editBeneficiary(basicInfo, customerHashId);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }}
      >
        <div className="d-flex">
          <div className="d-flex border-bottom mb-4 w-100 ms-1">
            <BsGlobeAmericas
              size={40}
              className="text-dark opacity-50 px-2 border-end"
            />

            <div className="input-group containertext w-100 h-100">
              <CustomSelect
                className="w-100 h-100"
                placeholder="Select Country"
                options={countryOptions}
                value={countryOptions.find(
                  (item) => item.value == data?.destinationCountry
                )}
                setValue={handledestinationCountryChange}
              />
            </div>
          </div>

          <div className="d-flex border-bottom mb-4 w-100 ms-1">
            <BsCurrencyBitcoin
              size={40}
              className="border-end my-auto px-2 text-dark opacity-50"
            />

            <div className="input-group containertext w-100 h-100">
              <CustomSelect
                className="w-100 h-100"
                placeholder="Select Currency"
                options={currencyOptions}
                value={countryOptions.find(
                  (item) => item.value == data?.destinationCurrency
                )}
                setValue={handledestinationCurrencyChange}
              />
            </div>
          </div>
        </div>

        {data?.destinationCountry && data?.destinationCurrency && (
          <div className="d-flex">
            <div className="d-flex border-bottom mb-4 w-100 ms-1 align-items-center">
              <RiSecurePaymentLine
                size={40}
                className="text-dark opacity-50 px-2 border-end"
              />

              <div className="input-group containertext w-100">
                <TextField
                  select
                  label="Payment Method"
                  id="selectBox"
                  className="custom-select text-start"
                  onChange={(e) => {
                    setBasicInfo((prevState) => ({
                      ...prevState,
                      payoutMethod: e.target.value,
                    }));
                  }}
                  // onChange={handlePaymentMethodChange}
                  value={data?.payoutMethod || PayoutMethod}
                >
                  {paymentMethodOptions?.map((item, index) => (
                    <MenuItem
                      key={index}
                      value={item.value}
                      selected={item.value == data?.payoutMethod}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>

            <div className="d-flex border-bottom mb-4 w-100 ms-1">
              <BsCodeSlash
                size={40}
                className="border-end my-auto px-2 text-dark opacity-50"
              />

              <div className="input-group containertext w-100 h-100">
                <TextField
                  label="Routing Code Type"
                  id="routingCodeType1"
                  className="custom-select text-start"
                  // onChange={handleRoutingTypeChange}
                  value={data?.routingCodeType1}
                  InputProps={{ readOnly: true }}
                >
                  {routingCodeType?.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
          </div>
        )}

        {data?.destinationCountry &&
          data?.destinationCurrency &&
          data?.routingCodeType1 && (
            <div className="">
              <div className="d-flex border-bottom mb-4 w-100 ms-1 align-items-center">
                <BsBank
                  size={40}
                  className="text-dark opacity-50 px-2 border-end"
                />

                <div className="input-group containertext w-100">
                  <Select
                    placeholder="Bank Name"
                    className="text-dark w-100 text-start"
                    options={bankListOptions}
                    onInputChange={handlebankchanges}
                    onChange={(option) => {
                      setSelectedBank(option.label);
                      setBankName(option.value);
                    }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: "none",
                        boxShadow: "none",
                        "&:hover": {
                          border: "none",
                        },
                      }),
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 2,
                      }),
                    }}
                    value={
                      bankListOptions?.length > 0
                        ? bankListOptions?.find(
                            (bank) => bank.label == bankName
                          )
                        : {
                            label: data?.beneficiaryBankName,
                            value: data?.routingCodeValue1,
                          }
                    }
                  />
                </div>
              </div>

              {data?.beneficiaryBankName?.length > 0 && (
                <div className="d-flex">
                  <div className="d-flex border-bottom mb-4 w-100 me-1">
                    <RxValue
                      size={40}
                      className="border-end my-auto px-2 text-dark opacity-50"
                    />

                    <div className="input-group containertext w-100 h-100">
                      <TextField
                        select
                        label="Routing Code Value"
                        className="border-0 w-100 text-start"
                        value={data?.routingCodeValue1}
                        onChange={handleRoutingvalueChange}
                      >
                        <MenuItem value="" disabled selected>
                          Routing Code Value
                        </MenuItem>
                        {bankName?.map((bank) => (
                          <MenuItem
                            value={bank}
                            key={bank}
                            selected={bank == data?.routingCodeValue1}
                          >
                            {bank}
                          </MenuItem>
                        ))}

                        {bankName.length == 0 && data?.routingCodeValue1 && (
                          <MenuItem value={data?.routingCodeValue1}>
                            {data?.routingCodeValue1}
                          </MenuItem>
                        )}
                      </TextField>
                    </div>
                  </div>
                  <div className="d-flex border-bottom mb-4 w-100 ms-1">
                    <BsHash
                      size={40}
                      className="border-end my-auto px-2 text-dark opacity-50"
                    />
                    <div className="input-group containertext w-100 h-100 ms-1">
                      <CustomTextField
                        id="accountno"
                        label="Account Number"
                        className="w-100"
                        value={data?.beneficiaryAccountNumber}
                        onChange={handleAccountnumberChange}
                        style={{ border: "none" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        <div className="d-flex mt-3">
          <button
            className="btn bg-blue100 fw-500 text-white py-3 w-100 mt-3 me-2"
            onClick={(e) => {
              e.preventDefault();
              setCurrentState("basic");
            }}
          >
            Back
          </button>
          <button
            className="btn bg-yellow100 fw-500 text-white py-3 w-100 mt-3 ms-2"
            // onClick={() => console.warn(basicInfo)}
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </>
  );
}

function EditBeneficiary({ data, customerHashId = null }) {
  //
  const [currentState, setCurrentState] = useState("basic");
  const [basicInfo, setBasicInfo] = useState(data);

  // useEffect(() => {
  //   console.log(basicInfo, "lkl");
  // }, [basicInfo]);

  return (
    <>
      {/* Button trigger modal */}
      <button
        type="button"
        className="btn bg-yellow100 py-3 text-white border w-100 rounded-3 d-flex align-items-center justify-content-center py-2 fw-500"
        data-bs-toggle="modal"
        data-bs-target="#EditAccountModal"
      >
        <CiEdit size={40} className="me-2" />
        Edit Beneficiary
      </button>
      {/* Modal */}
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
              <h5 className="text-dark">Editing Beneficiaries</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="editBeneficiaryClose"
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
                data={data}
                basicInfo={basicInfo}
                setBasicInfo={setBasicInfo}
                setCurrentState={setCurrentState}
                customerHashId={customerHashId}
              />
            ) : (
              <AccountInfo
                data={data}
                basicInfo={basicInfo}
                setCurrentState={setCurrentState}
                customerHashId={customerHashId}
                setBasicInfo={setBasicInfo}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EditBeneficiary;
