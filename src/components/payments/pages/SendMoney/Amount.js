import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as paymentreducer from "../../../../@redux/features/payments";
import * as paymentaction from "../../../../@redux/action/payments";

export const fullform = {
  USD: "US Dollar",
  SGD: "Singapore Dollar",
  GBP: "Great Britain Pound",
  EUR: "Euro",
  HKD: "Hong Kong Dollar",
  AUD: "Australian Dollar",
  INR: "Indian Rupee",
  PKR: "Pakistani Rupee",
  LKR: "Sri Lankan Rupee",
  NPR: "Nepalese Rupee",
  BDT: "Bangladeshi Taka",
  PHP: "Philippine Peso",
  THB: "Thai Baht",
  VND: "Vietnamese Dong",
  KRW: "South Korean Won",
  DKK: "Danish Krone",
  NOK: "Norwegian Krone",
  SEK: "Swedish Krona",
  TRY: "Turkish Lira",
  ARS: "Argentine Peso",
  BRL: "Brazilian Real",
  CLP: "Chilean Peso",
  COP: "Colombian Peso",
  MXN: "Mexican Peso",
  PEN: "Peruvian Sol",
  UYU: "Uruguayan Peso",
  CNY: "Chinese Yuan",
  TWD: "New Taiwan Dollar",
  JPY: "Japanese Yen",
  IDR: "Indonesian Rupiah",
  MYR: "Malaysian Ringgit",
  AED: "United Arab Emirates Dirham",
};

export const flags = {
  USD: "/flags/us.svg", // United States Dollar
  SGD: "/flags/sg.svg", // Singapore Dollar
  GBP: "/flags/gb.svg", // Great Britain Pound
  EUR: "/flags/eu.svg", // Euro
  HKD: "/flags/hk.svg", // Hong Kong Dollar
  AUD: "/flags/au.svg", // Australian Dollar
  INR: "/flags/in.svg", // Indian Rupee
  PKR: "/flags/pk.svg", // Pakistani Rupee
  LKR: "/flags/lk.svg", // Sri Lankan Rupee
  NPR: "/flags/np.svg", // Nepalese Rupee
  BDT: "/flags/bd.svg", // Bangladeshi Taka
  PHP: "/flags/ph.svg", // Philippine Peso
  THB: "/flags/th.svg", // Thai Baht
  VND: "/flags/vn.svg", // Vietnamese Dong
  KRW: "/flags/kr.svg", // South Korean Won
  DKK: "/flags/dk.svg", // Danish Krone
  NOK: "/flags/no.svg", // Norwegian Krone
  SEK: "/flags/se.svg", // Swedish Krona
  TRY: "/flags/tr.svg", // Turkish Lira
  ARS: "/flags/ar.svg", // Argentine Peso
  BRL: "/flags/br.svg", // Brazilian Real
  CLP: "/flags/cl.svg", // Chilean Peso
  COP: "/flags/co.svg", // Colombian Peso
  MXN: "/flags/mx.svg", // Mexican Peso
  PEN: "/flags/pe.svg", // Peruvian Sol
  UYU: "/flags/uy.svg", // Uruguayan Peso
  CNY: "/flags/cn.svg", // Chinese Yuan
  TWD: "/flags/tw.svg", // New Taiwan Dollar
  JPY: "/flags/jp.svg", // Japanese Yen
  IDR: "/flags/id.svg", // Indonesian Rupiah
  MYR: "/flags/my.svg", // Malaysian Ringgit
  AED: "/flags/ae.svg",
};

function Amount({
  currency,
  setCurrentState,
  // selectedBeneficiary,
  setSelectedBeneficiary,
}) {
  const [isInternational, setIsInternational] = useState(true);
  const location = useLocation();
  const [state, setState] = useState("LOCAL");
  const dispatch = useDispatch();

  const payload = useSelector((state) => state.payments?.payload);
  const selectedBeneficiary = useSelector(
    (state) => state.payments?.selectedBeneficiary
  );
  const exchangeRate = useSelector((state) => state.payments?.exchangeRate);
  let customerHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );

  let fxRate = useSelector((state) => state.payments?.fxRate);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  useEffect(() => {
    if (
      (payload?.destinationCurrency && payload?.destinationCountry) ||
      payload?.customerType ||
      payload?.beneficiaryAccountType ||
      payload?.payoutMethod ||
      payload?.routingCodeType
    ) {
      const formdata = {
        destinationCurrency: payload?.destinationCurrency,
        destinationCountry: payload?.destinationCountry,
        beneficiaryAccountType: payload?.beneficiaryAccountType,
        payoutMethod: payload?.payoutMethod,
        routingCodeType: payload?.routingCodeType,
      };

      dispatch(paymentaction.fetchsupportedcorridorv3(formdata));
    }
  }, [selectedBeneficiary]);

  useEffect(() => {
    if (!payload?.sourceCurrency) {
      dispatch(
        paymentreducer.setPayload({
          ...payload,
          sourceCurrency: "SGD", // Set to SGD if sourceCurrency is empty or undefined
        })
      );
    }
  }, [selectedBeneficiary]);

  useEffect(() => {
    if (payload?.sourceCurrency && payload?.destinationCurrency)
      dispatch(
        paymentaction.fetchexcahngerate(
          payload?.sourceCurrency,
          payload?.destinationCurrency,
          customerHashId
        )
      );
  }, [payload?.sourceCurrency]);

  useEffect(() => {
    if (payload?.fxrate)
      updateConvertedAmount(
        payload?.sourceAmount,
        payload?.sourceCurrency,
        payload?.fxrate,
        exchangeRate?.markup_rate
      );
  }, [payload?.sourceAmount, payload?.sourceCurrency, payload?.fxrate]);
  const updateConvertedAmount = (s_amt, s_cur, fxrate, markup_rate) => {
    if (s_amt && s_cur && fxrate && markup_rate) {
      const sourceAmount = parseFloat(s_amt);
      if (sourceAmount && fxrate) {
        const calculatedAmount = (
          sourceAmount *
          (fxrate - markup_rate)
        ).toFixed(3);
        dispatch(
          paymentreducer.setPayload({
            ...payload,
            destinationAmount: calculatedAmount,
          })
        );
      }
    }
  };

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      setState(hash.slice(1));
    }
  }, [state]);

  const nextStep = () => {
    setCurrentState("overview");
  };

  const handleCurrencyChange = (value) => {
    dispatch(
      paymentreducer.setPayload({
        ...payload,
        sourceCurrency: value,
      })
    );
  };

  const handleAmountChange = (e) => {
    dispatch(
      paymentreducer.setPayload({
        ...payload,
        sourceAmount: e.target.value,
      })
    );
  };

  const listCountry = useSelector((state) => state.onboarding?.ListCountryZOQQ);
  const isLoading = useSelector((state) => state.payments?.isLoading);

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check that all required fields are filled
    if (
      !payload.sourceAmount ||
      !payload.sourceCurrency ||
      !selectedBeneficiary.destinationCurrency
    ) {
      alert("Please fill in all required fields."); // Display an error message if required fields are missing
      return; // Stop the function if required fields are missing
    }

    // Proceed to the next state
    setCurrentState("additionalinfo");
  };

  return (
    <div
      className="amount-main d-flex flex-column"
      style={{
        alignItems: "center",
        minHeight: "100vh",
        gap: "3.5rem",
        padding: "3.5rem 18rem",
      }}
    >
      <div
        className="border rounded-3 shadow"
        style={{ width: "100%", padding: "1.2rem 2.25rem" }}
      >
        <div className="d-flex align-items-center gap-4">
          <img src="/payments/banks.svg" alt="banks icon" width={60} />
          <div className="d-flex flex-column align-items-start gap-1">
            <h4 className="m-0 fw-bold">
              {selectedBeneficiary?.beneficiaryBankName}
            </h4>

            <span
              className="fw-500"
              style={{ fontSize: "15px", color: "rgba(0,0,0,0.5)" }}
            >
              {
                listCountry.find(
                  (country) =>
                    country.ISOcc_2char ===
                    selectedBeneficiary?.destinationCountry
                )?.country_name
              }{" "}
              {" • "}
              {selectedBeneficiary?.destinationCurrency} {" • "}
              {selectedBeneficiary?.payoutMethod} {" • "}
              {selectedBeneficiary?.routingCodeType1} {" • "}
              {`●●●●●${selectedBeneficiary?.beneficiaryAccountNumber?.slice(
                -4
              )}`}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-100">
        <Box
          className="amount-box border rounded-3 shadow p-5"
          style={{
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <div className="d-flex flex-column align-items-start">
            <span className="fw-500 text-secondary mb-3">You send</span>
            <div className="d-flex flex-row w-100">
              <TextField
                required
                type="text"
                placeholder="Enter Amount"
                className="px-4 you-send-input"
                value={payload?.sourceAmount}
                style={{
                  borderTopLeftRadius: "6px",
                  borderBottomLeftRadius: "6px",
                  border: "1px solid lightgrey",
                  borderRight: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  width: "68%",
                }}
                onInput={(e) => handleAmountChange(e)}
              />

              <TextField
                select
                required
                value={payload?.sourceCurrency}
                id="Currency"
                className="text-start"
                style={{
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  border: "1px solid lightgrey",
                  width: "32%",
                }}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                defaultValue="SGD"
              >
                {currency?.length != 0 &&
                  currency?.map((currency) => {
                    {
                      return (
                        <MenuItem
                          key={currency.curSymbol}
                          value={currency.curSymbol}
                          selected={
                            payload?.sourceCurrency == currency.curSymbol
                          }
                          style={{
                            fontSize: "18px",
                            padding: "1rem 2rem",
                            fontWeight: "600",
                            opacity: "75%",
                          }}
                        >
                          <div className="d-flex align-items-center justify-content-start gap-3 ">
                            <img
                              src={flags[currency?.curSymbol]}
                              alt=""
                              style={{
                                width: "40px",
                                height: "25px",
                                objectFit: "cover",
                              }}
                              className="border rounded-2 amount-image"
                            />

                            <span className="d-flex flex-column align-items-start">
                              <p
                                className="m-0 fw-bold"
                                style={{ fontSize: "15px" }}
                              >
                                {currency?.curSymbol}
                              </p>
                              <p
                                className="m-0 fw-500 opacity-50"
                                style={{ fontSize: "13.5px" }}
                              >
                                {currency?.balance} {currency?.curSymbol}
                              </p>
                            </span>
                          </div>
                        </MenuItem>
                      );
                    }
                  })}
              </TextField>
            </div>

            <div
              className="mx-4 border-start w-100"
              style={{ height: "5rem", borderColor: "lightgray" }}
            ></div>

            <div
              className="w-100 d-flex align-items-center justify-content-start gap-3"
              style={{ margin: "0.5rem 0 0 0.5rem" }}
            >
              <img src="/payments/send-paper.svg" alt="" width={25} />
              <h5 className="m-0 ms-3 fw-bold opacity-50">Transfer Method</h5>
            </div>

            <div
              className="d-flex flex-column border-start gap-3 py-2 px-3 w-100"
              style={{ margin: "0.5rem 0 0 1.5rem", height: "15rem" }}
            >
              <div className="mx-4 p-2 border rounded-3">
                <div className="border-start border-5 border-primary">
                  <div className="d-flex flex-column gap-5 py-2 px-3">
                    <div className="d-flex flex-column align-items-start">
                      <h5 className="fw-bold mb-1">
                        {selectedBeneficiary?.payoutMethod}
                      </h5>
                      {/* {payload?.maximumAmount && ( */}
                      <div className="d-flex flex-row">
                        <span
                          className="opacity-50 p-1"
                          tabindex="0"
                          data-bs-toggle="popover"
                          data-bs-trigger="hover focus"
                          data-bs-content="Disabled popover"
                        >
                          {selectedBeneficiary?.payoutMethod} transfer
                        </span>

                        {(payload?.maximumAmount || payload?.minimumAmount) && (
                          <button
                            type="button"
                            className="btn btn-link p-0"
                            data-toggle="tooltip"
                            data-placement="top"
                            title={
                              payload?.minimumAmount && payload?.maximumAmount
                                ? `Transfer limits: ${payload?.minimumAmount} - ${payload?.maximumAmount} ${payload?.destinationCurrency}`
                                : payload.maximumAmount
                                ? `Maximum transfer limit: ${payload?.maximumAmount} ${payload?.destinationCurrency}`
                                : `Minimum transfer limit: ${payload?.minimumAmount} ${payload?.destinationCurrency}`
                            }
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              marginLeft: "4px",
                              cursor: "pointer",
                              fontSize: "inherit",
                            }}
                            aria-label="Transfer limit info"
                          >
                            🛈
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="d-flex flex-column align-items-start gap-2">
                        <p className="mb-0 opacity-50 fw-500">Transfer fee</p>
                        <p className="mb-0 opacity-75 fw-500">
                          {isLoading
                            ? "loading..."
                            : payload?.fxrate - exchangeRate?.markup_rate}{" "}
                        </p>
                      </span>
                      {payload?.deliveryTAT && (
                        <span className="d-flex flex-column align-items-start gap-2">
                          <p className="mb-0 opacity-50 fw-500">Speed</p>
                          <p className="mb-0 opacity-75 fw-500">
                            {payload?.deliveryTAT === "REALTIME"
                              ? "Immediate"
                              : payload?.deliveryTAT === "T0"
                              ? "By end of day"
                              : payload?.deliveryTAT === "T1"
                              ? "Within one day"
                              : "1-2 business days"}
                          </p>
                        </span>
                      )}

                      {payload?.maximumAmount && (
                        <span className="d-flex flex-column align-items-start gap-2">
                          <p className="mb-0 opacity-50 fw-500">
                            Transfer limit
                          </p>
                          <p className="mb-0 opacity-75 fw-500">
                            Up to {payload?.maximumAmount}{" "}
                            {payload?.destinationCurrency}
                          </p>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column">
            <div
              className="w-100 d-flex align-items-center justify-content-start gap-2"
              style={{ margin: "0.5rem 0 0 0.5rem" }}
            >
              <img src="/payments/bank-icon.svg" alt="" width={30} />
              <span className="fw-500 text-secondary mb-0">Recipient Gets</span>
            </div>
            <div className="d-flex flex-row w-100 ps-5 py-3">
              <TextField
                type="text"
                placeholder="Recipient gets..."
                className="px-4 you-send-input"
                value={
                  isLoading
                    ? "loading..."
                    : payload?.destinationAmount || "0.00"
                }
                style={{
                  borderTopLeftRadius: "6px",
                  borderBottomLeftRadius: "6px",
                  border: "1px solid lightgrey",
                  borderRight: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  width: "68%",
                }}
                readOnly={true}
              />
              <TextField
                required
                defaultValue={payload?.destinationCurrency}
                id="Currency"
                className="text-start"
                style={{
                  borderTopRightRadius: "6px",
                  borderBottomRightRadius: "6px",
                  border: "1px solid lightgrey",
                  width: "32%",
                  fontSize: "18px !important",
                  opacity: "0.75 !important",
                  fontWeight: "600 !important",
                }}
                InputProps={{
                  readOnly: true, // Makes the TextField read-only
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src={flags[payload?.destinationCurrency]} // Your flag source here
                        alt={`${payload?.destinationCurrency} flag`} // Alt text for accessibility
                        width={30} // Width of the flag image
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="d-flex flex-row mt-5 gap-2 w-100 justify-content-end amount-buttons">
              <button
                className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
                variant="contained"
              >
                Continue
              </button>
              <button
                className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
                onClick={() => {
                  dispatch(paymentreducer.resetPayload());
                  dispatch(paymentreducer.setSelectedBeneficiary({}));
                  setCurrentState("recipient");
                }}
                variant="outlined"
              >
                Back
              </button>
            </div>
          </div>
        </Box>
      </form>
    </div>
  );
}

export default Amount;
