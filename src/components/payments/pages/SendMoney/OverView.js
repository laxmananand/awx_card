import React, { useEffect, useState } from "react";
// import { sendMoney } from "../../js/ListBeneficiaries";
import * as paymentAction from "../../../../@redux/action/payments";
import { useDispatch, useSelector } from "react-redux";
import { closeLoader, openLoader } from "../../../../@redux/features/common";
import { setIsLoading } from "../../../../@redux/features/payments";
import { Button } from "@mui/material";

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

function OverView({
  setCurrentState,
  // selectedBeneficiary
}) {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.payments?.isLoading);
  const [system_reference_number, setsystem_reference_number] = useState([]);
  const payload = useSelector((state) => state.payments?.payload);
  const platform = useSelector((state) => state.common?.platform);

  const sourceCurrencyList = useSelector(
    (state) => state.payments?.sourceCurrency
  );
  const sourceCurrency = sourceCurrencyList?.find(
    (currency) => currency.curSymbol === payload?.sourceCurrency
  );
  const selectedBeneficiary = useSelector(
    (state) => state.payments?.selectedBeneficiary
  );
  let customerHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );

  const isSuccess = useSelector((state) => state.payments?.isSuccess);

  const handleConfirmTransfer = () => {
    dispatch(paymentAction.sendMoney(payload, customerHashId));
  };
  useEffect(() => {
    if (isSuccess) {
      setCurrentState("response");
    }
  }, [isSuccess]);

  return (
    <div
      className="review-container my-5 border shadow p-4 rounded-4 mx-auto"
      style={{ width: "900px" }}>
      <h2 className="fw-bold mb-4">Review</h2>

      <div className="card mb-2 border-0">
        <div className="card-body">
          <div className="d-flex align-items-center mb-1">
            <img src="/payments/overview/wallet.svg" alt="" width={30} />
            <h5
              className="fw-500 mb-0 ms-2 opacity-75"
              style={{ fontSize: "16px" }}>
              You send
            </h5>
          </div>

          <div
            className="border-start border-2 ms-3 p-4"
            style={{ minHeight: "100px" }}>
            <div className="d-flex align-items-end gap-2 my-2">
              <h2 className="fw-600 mb-0">
                {platform === "awx"
                  ? `${payload?.obj?.values?.source_amount} ${payload?.obj?.values?.source_currency}`
                  : `${payload?.sourceAmount} ${payload?.sourceCurrency}`}{" "}
              </h2>
              <img
                src={
                  flags[
                    platform === "awx"
                      ? payload?.values?.source_currency
                      : payload?.sourceCurrency
                  ]
                }
                alt=""
                width={55}
              />
            </div>

            <div className="d-flex align-items-start gap-1 opacity-75">
              <p className="text-dark">Available balance</p>
              <strong>
                {sourceCurrency?.balance} {payload?.sourceCurrency}
              </strong>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-start my-1">
            <img
              src="/payments/overview/fee.svg"
              alt=""
              style={{ width: "35px" }}
            />
            <h5
              className="fw-500 mb-0 ms-1 opacity-75"
              style={{ fontSize: "16px" }}>
              Transfer fee
            </h5>
          </div>

          <div
            className="border-start border-2 ms-3 p-4 pt-1"
            style={{ minHeight: "50px" }}>
            <h5 className="fw-600" style={{ fontSize: "14.5px" }}>
              {payload?.fxrate}
            </h5>
          </div>

          <div className="d-flex align-items-center">
            <img src="/payments/overview/send.svg" alt="" width={30} />

            <h5
              className="fw-500 mb-0 ms-2 opacity-75"
              style={{ fontSize: "16px" }}>
              Recipient gets
            </h5>
          </div>
        </div>
      </div>

      <div className="review-amount-box card shadow mx-5 p-3 rounded-4">
        <div className="card-body">
          <div className="mb-4">
            <h5 className="fw-500 mb-2 opacity-75" style={{ fontSize: "18px" }}>
              Amount
            </h5>
            <h2 className="fw-bold">
              {payload?.destinationAmount} {payload?.destinationCurrency}{" "}
              <img
                src={flags[payload?.destinationCurrency]}
                alt=""
                width={35}
              />
            </h2>
          </div>
          <div className="my-5">
            <p className="fw-500 mb-1 opacity-75">Recipient</p>
            <h3 className="fw-600 mb-1">
              {selectedBeneficiary?.beneficiaryName}
            </h3>
            <p className="fw-500 opacity-75">
              {selectedBeneficiary?.beneficiaryBankName}
            </p>
          </div>
          <hr />
          <div
            className="d-flex flex-column gap-1 opacity-75 mt-4"
            style={{ fontSize: "14px" }}>
            <div className="row mb-2">
              <div className="col-6">
                {selectedBeneficiary?.routingCodeType1} Routing number
              </div>
              <div className="col-6 text-end">
                {selectedBeneficiary?.routingCodeValue1}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">Account number</div>
              <div className="col-6 text-end">
                {selectedBeneficiary?.beneficiaryAccountNumber}
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-6">Comment</div>
              <div className="col-6 text-end">{payload?.customerComments}</div>
            </div>
            <div className="row mb-2">
              <div className="col-6">Purpose</div>
              <div className="col-6 text-end">{payload?.purposeCode}</div>
            </div>
            <div className="row">
              <div className="col-6">Transfer date</div>
              <div className="col-6 text-end">
                {new Date().toISOString().split("T")[0]}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="review-amount-box d-flex justify-content-end mt-4 mx-5">
        <div className="d-flex gap-2">
          <button
            className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
            onClick={handleConfirmTransfer}
            disabled={isLoading} // Disable the button when loading
          >
            {isLoading ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "CONFIRM THE TRANSFER"
            )}
          </button>
          <button
            className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
            variant="outlined"
            onClick={() => setCurrentState("additionalinfo")}>
            Back
          </button>
          {/* <button className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600" variant="contained" color="primary" onClick={handleConfirmTransfer}>
            Pay
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default OverView;
