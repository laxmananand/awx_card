import React, { useEffect, useState } from "react";
import CustomSelect from "../../../structure/CustomSelect";
import { DatePicker } from "@mui/x-date-pickers";
import CustomDate from "../../../structure/CustomDate";
import { TextField } from "@mui/material";
import NumberField from "../../../structure/NumberField";

import {
  symbol,
  getRate,
  convertAmount,
  flag,
} from "../../../../data/accounts/globalAccounts";
import "../../../accounts/css/accounts.css";
import Loader from "../../../Signup/assets/Signup/public/loader.gif";
import getSymbolFromCurrency from "currency-symbol-map";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrencyList,
  recentConversionData,
} from "../../../../@redux/action/accounts";
import "../../../accounts/css/accounts.css";
import Select from "react-select";
import { Link } from "react-router-dom";
import { BiLock } from "react-icons/bi";

function Form() {
  const currencies = useSelector((state) => state.accounts.currencyList);
  const dispatch = useDispatch();
  const custHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );

  // AWX Account ID / Business ID
  const awxAccountId = useSelector((state) => state.auth.awxAccountId) || "";
  
  const platform = useSelector((state)=>state.common.platform) || "";

  const authToken = useSelector((state)=> state.auth.authCode) || "";


  const options = currencies.map((currency) => ({
    value: currency.name,
    label: (
      <div>
        <img  src={`/Rounded_Flags/${currency.name.toLowerCase().slice(0, 2)}.svg`} alt={currency.name} width={30} />
        <> </>
        <strong>{currency.name}</strong>
      </div>
    ),
  }));

  const currencies2 = [
    { value: "USD", label: "USD" },
    { value: "SGD", label: "SGD" },
    { value: "EUR", label: "EUR" },
    { value: "HKD", label: "HKD" },
    { value: "AUD", label: "AUD" },
    { value: "GBP", label: "GBP" },
  ];

  const options2 = currencies2.map((currency) => ({
    value: currency.value,
    label: (
      <div>
        <img src={flag[currency.value]} alt={currency.value} width={30} />
        <> </>
        <strong>{currency.value}</strong>
      </div>
    ),
  }));

  // //flags with currency
  // const SingleValue = ({ options2 }) => (
  //   <div style={{ display: 'flex', alignItems: 'center' }}>
  //     <img
  //       width="24px"
  //       height="24px"
  //       src={flag[data.value]}
  //       alt={data.value}
  //       className="rounded-circle"
  //       style={{ marginRight: '8px' }}
  //     />
  //     {data.label}
  //   </div>
  // );
      
  // get Currency List call
  useEffect(() => {
    if (platform === "awx" && awxAccountId) {
      dispatch(getCurrencyList(awxAccountId));
    } else if (custHashId) {
      dispatch(getCurrencyList(custHashId));
    }
  }, [platform, custHashId, awxAccountId]);

  const defaultConvertFrom = options.find((option) => option.value === "USD");
  const defaultConvertTo = options.find((option) => option.value === "SGD");

  const [convertFrom, setConvertFrom] = useState(options);
  const [convertTo, setConvertTo] = useState(options);
  const [fromVal, setFromVal] = useState("USD");
  const [toVal, setToVal] = useState("SGD");
  const [currentBal, setCurrentBal] = useState();
  const [currentBal2, setCurrentBal2] = useState();
  const [fxFees, setFxFees] = useState(0);
  const [currRate, setCurrRate] = useState(0);
  const [fromAmount, setFromAmount] = useState();
  const [toAmount, setToAmount] = useState();
  // const [currencies, setCurrencies] = useState([]);
  const [type, setType] = useState("");
  const [quoteId, setQuoteID] = useState("")

  const subStatus = useSelector((state) => state.subscription?.data?.status) || "";
  const complianceStatus = useSelector((state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus) || "";

  useEffect(() => {
    if (fromAmount && fromVal) {
      setToAmount(fromAmount * currRate);
    } else if (fromAmount == "") {
      setToAmount(0);
    }
  }, [fromAmount, fromVal, currRate]);

  useEffect(() => {
    const innerFunc = async () => {
      setCurrRate("---");
      setFxFees("---");
      const data = await getRate(100, fromVal, toVal, platform, awxAccountId, authToken);
      if(platform==="awx"){
        setCurrRate(Number(data[0]?.netExchangeRate));
        setQuoteID(data[0]?.id)
      }
      else{
        setCurrRate(Number(data?.netExchangeRate));
        setFxFees(Number(data?.markupRate));
      }
    };

    if (fromVal && toVal) {
      innerFunc();
    }
  }, [fromVal, toVal]);

  useEffect(() => {
    if (currRate) setToAmount(fromAmount * currRate);
  }, [currRate]);

  useEffect(() => {
    const opt = options.filter((option) => option.value !== fromVal);
    setConvertTo(opt);
  }, [fromVal]);

  useEffect(() => {
    const opt = options.filter((option) => option.value !== toVal);
    setConvertFrom(opt);
  }, [toVal]);

  useEffect(() => {
    currencies?.map((currency) => {
      if (currency.name === fromVal)
        setCurrentBal(getSymbolFromCurrency(currency.name) + " " + currency.balance);
    });
  }, [fromVal, currencies]);

  useEffect(() => {
    currencies?.map((currency) => {
      if (currency.name === toVal)
        setCurrentBal2(getSymbolFromCurrency(currency.name) + " " + currency.balance);
    });
  }, [toVal, currencies]);

  // convert amount button
  const convertAmountButton = async (e) => {
    e.preventDefault();

    if(platform==="awx"){
    const formData = { fromAmount, fromVal, toVal, quoteId };
    console.log(formData);

    const result = await convertAmount(formData, awxAccountId, platform, authToken);
    console.log(result);

    if(result){
      dispatch(getCurrencyList(awxAccountId));
      dispatch(recentConversionData(awxAccountId));
    }
  }
  else{
    const formData = { fromAmount, fromVal, toVal };
    console.log(formData);

    const result = await convertAmount(formData, custHashId, platform, authToken);
    console.log(result);

    if (result.hasOwnProperty("systemReferenceNumber")) {
      dispatch(getCurrencyList(custHashId));
      dispatch(recentConversionData(custHashId));
    }
  }
  };

  useEffect(() => {
    if (fromVal === toVal) {
      setToVal(null);
    }
  }, [fromVal]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "15px",
      width: "130px",
    }),
    indicatorSeparator: () => null,
    menu: (provided) => ({
      ...provided,
      width: "130px",
      borderRadius: "15px",
      maxHeight: 150,
      overflowY: "auto",
    }),
    menuList: (provided) => ({
      ...provided,
      width: "130px",
      borderRadius: "15px",
      maxHeight: 150, // Ensure the menu list also matches the dropdown menu width
      overflowY: "auto",
    }),
  };

  // // Define a useEffect hook to monitor changes in fromAmount and update toAmount accordingly
  // useEffect(() => {
  //   // Check if fromAmount is zero and update toAmount accordingly
  //   if (fromAmount === 0) {
  //     setToAmount(0);
  //   }
  // }, [fromAmount]);

  if (
    !complianceStatus ||
    complianceStatus !== "COMPLETED" ||
    subStatus !== "active"
  ) {
    return (
      <form className="row mt-4">
        <label className="mb-2" style={{ fontSize: "20px", fontWeight: 500 }}>
          Convert
        </label>
        <div className="col-12 d-flex border-bottom mb-1">
          <div className="input-group containertext w-75 h-100 d-flex">
            <NumberField
              className="flex-fill"
              setValue={setFromAmount}
              defaultValue={fromAmount}
              placeholder={0}
            />
            <p className="m-auto me-2" style={{ fontSize: "18px" }}>
              {getSymbolFromCurrency(fromVal)}
            </p>
          </div>
          <div className="input-group containertext w-25 h-100 d-flex flex-nowrap">
            <div className="border-start my-2 w-100">
              <Select
                className="bg-transparent my-auto border-0 fw-bold pe-4 ps-2"
                value={options2.find((option) => option.value === fromVal)}
                onChange={(selectedOption) => setFromVal(selectedOption.value)}
                options={options2}
                styles={customStyles}
                isSearchable={true}
                // defaultValue={{value: 'USD', label: 'USD' }}
              />
            </div>
          </div>
        </div>

        {toVal && fromAmount && fromVal && (
          <div className="d-flex justify-content-around my-4 animation">
            {/* <div>
              <p className="m-0 d-flex flex-column justify-content-center align-items-center">
                <span className="grey1">Fx fees</span>
                <span>
                  {fxFees} {fromVal}
                </span>
              </p>
            </div> */}
            <div>
              <p className="m-0 d-flex flex-column justify-content-center align-items-center">
                <span className="grey1">Exchange rate</span>
                <span>
                  {currRate} {fromVal} / {toVal}
                </span>
              </p>
            </div>
          </div>
        )}

        <label
          className="mb-2"
          style={{ marginTop: "50px", fontSize: "20px", fontWeight: 500 }}
        >
          To
        </label>
        <div className="col-12 d-flex border-bottom mb-1">
          <div className="input-group containertext w-75 h-100">
            <TextField
              readOnly={true}
              className="flex-fill"
              value={toAmount ? toAmount : 0}
              sx={{
                "& input": {
                  fontWeight: 500,
                  fontSize: "16px",
                },
              }}
            />
            <p className="m-auto me-2" style={{ fontSize: "18px" }}>
              {getSymbolFromCurrency(toVal)}
            </p>
          </div>
          <div className="input-group containertext w-25 h-100 d-flex flex-nowrap">
            <div className="border-start my-2 w-100">
              <Select
                className="bg-transparent my-auto border-0 fw-bold pe-4 ps-2 w-10"
                value={
                  toVal && options2.find((option) => option.value === toVal)
                }
                onChange={(selectedOption) => setToVal(selectedOption.value)}
                options={options2.filter((item) => item.value !== fromVal)}
                styles={customStyles}
                isSearchable={false}
                // defaultValue={{value: 'SGD', label: 'SGD' }}
              />
            </div>
          </div>
        </div>

        <div
          className="border d-flex flex-column w-75 h-100 py-3 justify-content-center align-items-center rounded-5 blueHover position-relative"
          style={{ marginTop: "30px", marginLeft: "50px" }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: "20px",
              marginLeft: "-30px",
              position: "relative",
            }}
          >
            Convert
          </span>
          <div
            className="position-absolute w-100 h-100 text-center opacity-75 rounded-5"
            style={{ background: "#d4ba48" }}
          ></div>
          <div className="position-absolute w-100 h-100 text-center d-flex flex-column justify-content-center align-items-center text-black rounded-4">
            <img
              src="/locked.svg"
              style={{
                marginTop: "5px",
                marginLeft: "90px",
                height: "35px",
                position: "relative",
              }}
              width={80}
            />
          </div>
        </div>
      </form>
    );
  } else {
    return (
      <form className="row mt-4">
        <label className="mb-2" style={{ fontSize: "20px", fontWeight: 500 }}>
          Convert
        </label>
        <div className="col-12 d-flex border-bottom mb-1">
          <div className="input-group containertext w-75 h-100 d-flex">
            <NumberField
              className="flex-fill"
              setValue={setFromAmount}
              defaultValue={fromAmount}
              placeholder={0}
            />
            <p className="m-auto me-2" style={{ fontSize: "18px" }}>
              {getSymbolFromCurrency(fromVal)}
            </p>
          </div>
          <div className="input-group containertext w-25 h-100 d-flex flex-nowrap">
            <div className="border-start my-2 w-100">
              <Select
                className="bg-transparent my-auto border-0 fw-bold pe-4 ps-2"
                value={options.find((option) => option.value === fromVal)}
                onChange={(selectedOption) => setFromVal(selectedOption.value)}
                options={options}
                styles={customStyles}
                isSearchable={true}
              />
            </div>
          </div>
        </div>

        <p className="mb-4">
          <span className="grey1" style={{ fontWeight: 500, fontSize: "18px" }}>
            Current balance:{" "}
          </span>
          <span style={{ fontSize: "18px" }}>
            {fromVal ? currentBal : "0.00"} {fromVal}{" "}
          </span>
        </p>

        {toVal && fromAmount && fromVal && (
          <div className="d-flex justify-content-around my-4 animation">
            {/* <div>
              <p className="m-0 d-flex flex-column justify-content-center align-items-center">
                <span className="grey1">Fx fees</span>
                <span>
                  {fxFees} {fromVal}
                </span>
              </p>
            </div> */}
            <div>
              <p className="m-0 d-flex flex-column justify-content-center align-items-center">
                <span className="grey1">Exchange rate</span>
                <span>
                  {currRate} {fromVal} / {toVal}
                </span>
              </p>
            </div>
          </div>
        )}

        <label
          className="mb-2"
          style={{ marginTop: "20px", fontSize: "20px", fontWeight: 500 }}
        >
          To
        </label>
        <div className="col-12 d-flex border-bottom mb-1">
          <div className="input-group containertext w-75 h-100">
            <TextField
              readOnly={true}
              className="flex-fill"
              value={toAmount ? toAmount : 0}
              sx={{
                "& input": {
                  fontWeight: 500,
                  fontSize: "16px",
                },
              }}
            />
            <p className="m-auto me-2" style={{ fontSize: "18px" }}>
              {getSymbolFromCurrency(toVal)}
            </p>
          </div>
          <div className="input-group containertext w-25 h-100 d-flex flex-nowrap">
            <div className="border-start my-2 w-100">
              <Select
                className="bg-transparent my-auto border-0 fw-bold pe-4 ps-2"
                value={
                  toVal && options.find((option) => option.value === toVal)
                }
                onChange={(selectedOption) => setToVal(selectedOption.value)}
                options={options.filter((item) => item.value !== fromVal)}
                styles={customStyles}
                isSearchable={true}
              />
            </div>
          </div>
        </div>
        {toVal && (
          <p className="mb-4">
            <span
              className="grey1"
              style={{ fontWeight: 500, fontSize: "18px" }}
            >
              Current balance:{" "}
            </span>
            <span style={{ fontSize: "18px" }}>
              {currentBal2} {toVal}
            </span>
          </p>
        )}

<div className="d-flex flex-column justify-content-center align-items-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            Swal.fire({
              title: "Confirm Fund Transfer",
              html: `
              <div style="display: flex;
                 width: 100%;
                 justify-content: space-between;
                 align-items: center;
                 padding: 5px 50px;
                 font-weight:bold;">
              
                  <span style="color: red; text-align: left; font-size: 18px; width:30%">
                    -${Math.abs(fromAmount||0)} ${fromVal}
                  </span>
                  
                  <img src="/exchange_2.svg" className="p-2 rounded-3" style="width: 30px; height: 40px; position: relative" />
                  
                  <span style="color: green; text-align: right; font-size: 18px; width:30%">
                    +${Math.abs(toAmount||0)} ${toVal}
                  </span>
                          
              </div>
            `,
              // icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes, proceed!",
              cancelButtonText: "No, cancel!",
              reverseButtons: true,
              closeButton: true,
              confirmButtonColor: "var(--sun-50)",
              cancelButtonColor: "#C41E3A",
              customClass: {
                title: "swal-title",
                popup: 'custom-swal-popup'
              },
              didOpen: () => {
                document.querySelector('.swal2-popup').style.transition = 'all 1s ease-in-out'; // Set transition speed
              },
              willOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();
                const closeButton = document.querySelector(".swal2-close");

                if (confirmButton) {
                  confirmButton.style.borderRadius = "50px"; // Adjust the value as needed
                  confirmButton.style.color = "black";
                }

                if (cancelButton) {
                  cancelButton.style.borderRadius = "50px"; // Adjust the value as needed
                  // cancelButton.style.color = "black"
                }

                if (closeButton) {
                  closeButton.style.borderRadius = "50px"; // Adjust the value as needed
                }
              },
            }).then(async (result) => {
              if (result.isConfirmed) {
                await convertAmountButton(e);
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                return;
              }
            });
          }}
          // style={{ marginTop: "10px", backgroundColor: "var(--main-color)" }}
          className="w-75 btn py-2 fw-500 btn-action rounded-5"
          style={{ marginTop: "5px" }}
          id="conversionButton"
        >
          <div id="button-textTwo">
            <div
              className="addAccountButtonText"
              style={{
                marginLeft: "-85px",
                fontWeight: "700",
                fontSize: "18px",
              }}
            >
              Convert
            </div>
          </div>
          <div
            id="button-loaderTwo"
            style={{ marginLeft: "-20px", fontWeight: "700", fontSize: "20px" }}
          >
            <img className="addAccountButtonLoader" alt="" src={Loader} />
          </div>
        </button>
        </div>
      </form>
    );
  }
}
export default Form;
