import React, { useEffect, useState } from "react";
import { BiCross } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { Link } from "react-router-dom";
import { fetchtransactionstatus } from "../../js/ListBeneficiaries";
import { Button } from "@mui/material";
import { flags } from "./OverView";
import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as paymentreducer from "../../../../@redux/features/payments";
const steps = ["Created", "Funded", "Processing", "Sent"];

function Response({
  setCurrentState,
  // selectedBeneficiary,
  setSelectedBeneficiary,
}) {
  // useEffect(() => {
  //   // transactionstatus(systemReferenceNumber, customerHashId);
  //   console.log(systemReferenceNumber);
  // }, [systemReferenceNumber, customerHashId]);

  // const transactionstatus = async (system_reference_number, customerHashId) => {

  //   const response = await fetchtransactionstatus(
  //     system_reference_number,
  //     customerHashId
  //   );
  //   console.log(response.data);
  // };

  const dispatch = useDispatch();
  const payload = useSelector((state) => state.payments?.payload);
  const listCountry = useSelector((state) => state.onboarding?.ListCountryZOQQ);
  let tnxrefid = useSelector((state) => state.payments?.sendMoneyRes);
  let customerHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );
  const selectedBeneficiary = useSelector(
    (state) => state.payments?.selectedBeneficiary
  );

  const platform = useSelector((state) => state.common.platform);

  const handleClick = () => {
    dispatch(paymentreducer.setIsSuccess(null));
    dispatch(paymentreducer.resetPayload());
    dispatch(paymentreducer.resetSetSendMoneyRes());
    dispatch(paymentreducer.setSelectedBeneficiary({}));
  };

  if (platform == "awx") {
    return (
      <div
        className="response-container d-flex flex-column justify-content-center align-items-center mx-auto"
        style={{ width: "900px", minHeight: "100vh" }}>
        <div className="p-3 w-100 mb-2 d-flex flex-column align-items-center">
          {tnxrefid?.id ? (
            <>
              <h2 className="fw-600">{tnxrefid?.status}</h2>
              <div
                style={{ fontSize: "13px" }}
                className="d-flex align-items-center justify-content-center gap-1">
                <p className="opacity-75">Reference ID:</p>{" "}
                <p className="text-secondary fw-600">{tnxrefid?.id}</p>
              </div>
            </>
          ) : (
            <h2 className="fw-600">{tnxrefid?.status}</h2>
          )}

          {/* <Button
          variant="outlined"
          color="secondary"
          className="py-2 fw-600 border-2 px-4"
          style={{ fontSize: "14px" }}>
          Download confirmation letter
        </Button> */}
        </div>

        {/* <div className="card shadow mx-5 py-4 rounded-4 w-100 mb-5">
        <Stepper activeStep={2} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <p className="fw-600 mt-1 mb-0">{label}</p>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div> */}

        <div className="card shadow mx-2 p-2 rounded-4 w-100 mb-3 p-5">
          <div>
            <p className="mb-1 opacity-75 fw-500">You have send</p>
            <h3 className="mb-0 fw-600">
              {tnxrefid?.source_amount}{" "}
              {tnxrefid?.source_currency}{" "}
              <img
                src={flags[tnxrefid?.source_currency]}
                alt=""
                width={35}
              />
            </h3>
          </div>
        </div>

        <div className="card shadow mx-5 p-3 rounded-4 w-100">
          <div className="card-body">
            <div className="mb-5">
              <div>
                <p className="mb-1 opacity-75 fw-500">Recipient will receive</p>
                <h3 className="mb-0 fw-600">
                  {tnxrefid?.amount_beneficiary_receives}{" "} {tnxrefid?.beneficiary?.bank_details?.account_currency}
                  <img
                    src={
                      flags[tnxrefid?.beneficiary.bank_details.account_currency]
                    }
                    alt=""
                    width={35}
                  />
                </h3>
              </div>

              {/* <p className="fw-500 mb-1 opacity-75">Recipient</p>
            <h3 className="fw-600 mb-1">
              {tnxrefid?.beneficiary.bank_details.account_name}
            </h3> */}
              {/* <p className="fw-500 mb-1 opacity-75">
            {tnxrefid?.beneficiary?.bank_details?.account_name} will receive {tnxrefid?.amount_beneficiary_receives} {tnxrefid?.beneficiary?.bank_details?.account_currency}
            </p> */}
              {/* <p className="fw-500 opacity-75">
              {
                listCountry.find(
                  (country) =>
                    country.ISOcc_2char ===
                    tnxrefid?.beneficiary.bank_details.bank_country_code
                )?.country_name
              }
            </p> */}
            </div>
            <hr />
            <div
              className="d-flex flex-column gap-1 opacity-75 mt-4"
              style={{ fontSize: "14px" }}>
              {/* <div className="row mb-2">
              <div className="col-6">
                {selectedBeneficiary?.routingCodeType1} Routing number
              </div>
              <div className="col-6 text-end">
                {selectedBeneficiary?.routingCodeValue1}
              </div>
            </div> */}
              <div className="row mb-2">
                <div className="col-6">Account number</div>
                <div className="col-6 text-end">
                  {tnxrefid?.beneficiary.bank_details.account_number}
                </div>
              </div>
              {/* <div className="row mb-2">
              <div className="col-6">Reference</div>
              <div className="col-6 text-end">Airship Repair</div>
            </div> */}
              {/* <div className="row mb-2">
              <div className="col-6">Purpose</div>
              <div className="col-6 text-end">Business expenses</div>
            </div> */}
              <div className="row">
                <div className="col-6">Transfer creation date</div>
                <div className="col-6 text-end">{tnxrefid?.transfer_date}</div>
              </div>

              <div className="row">
                <div className="col-6">Payment Method</div>
                <div className="col-6 text-end">{tnxrefid?.transfer_method}</div>
              </div>

              <div className="row">
                <div className="col-6">Fees</div>
                <div className="col-6 text-end">{tnxrefid?.fee_amount}{tnxrefid?.fee_currency}</div>
              </div>

              <div className="row">
                <div className="col-6">Fees paid by </div>
                <div className="col-6 text-end">{tnxrefid?.fee_paid_by}</div>
              </div>
            </div>
          </div>
        </div>

        {tnxrefid?.id ? (
          <>
            <div className="d-flex flex-row gap-3 mt-3">
              <button
                variant="contained"
                className="btn btn-action w-100 rounded-5 align-items-center justify-content-center py-2 fw-500 "
                onClick={() => {
                  setCurrentState("recipient");
                  dispatch(paymentreducer.resetPayload());
                  dispatch(paymentreducer.resetSetSendMoneyRes());
                  // dispatch(paymentreducer.setSelectedBeneficiary({}));
                  dispatch(paymentreducer.setIsSuccess(false));
                }}>
                MAKE ANOTHER TRANSACTION
              </button>
              <Link
                // to="/payments/transactions"
                className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 py-2 fw-500"
                // onClick={handleClick}
                >
                MANAGE TRANSACTIONS
              </Link>
            </div>

            {/* <button
            variant="contained"
            className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
            onClick={() => setCurrentState("additionalinfo")}>
            Track Payment
          </button> */}
          </>
        ) : (
          <button
            variant="contained"
            className="btn btn-action mt-3 w-100 rounded-5 align-items-center justify-content-center py-2 fw-600"
            onClick={() => {
              setCurrentState("recipient");
              dispatch(paymentreducer.resetPayload());
              dispatch(paymentreducer.resetSetSendMoneyRes());
              // dispatch(paymentreducer.setSelectedBeneficiary({}));
              dispatch(paymentreducer.setIsSuccess(false));
            }}>
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="response-container d-flex flex-column justify-content-center align-items-center mx-auto"
      style={{ width: "900px", minHeight: "100vh" }}>
      <div className="p-3 w-100 mb-2 d-flex flex-column align-items-center">
        {tnxrefid?.systemReferenceNumber ? (
          <>
            <h2 className="fw-600">{tnxrefid?.message}</h2>
            <div
              style={{ fontSize: "13px" }}
              className="d-flex align-items-center justify-content-center gap-1">
              <p className="opacity-75">Reference ID:</p>{" "}
              <p className="text-secondary fw-600">
                {tnxrefid?.systemReferenceNumber}
              </p>
            </div>
          </>
        ) : (
          <h2 className="fw-600">{tnxrefid?.message}</h2>
        )}

        {/* <Button
          variant="outlined"
          color="secondary"
          className="py-2 fw-600 border-2 px-4"
          style={{ fontSize: "14px" }}>
          Download confirmation letter
        </Button> */}
      </div>

      {/* <div className="card shadow mx-5 py-4 rounded-4 w-100 mb-5">
        <Stepper activeStep={2} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <p className="fw-600 mt-1 mb-0">{label}</p>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div> */}

      <div className="card shadow mx-2 p-2 rounded-4 w-100 mb-3 p-5">
        <div>
          <p className="mb-1 opacity-75 fw-500">You have send</p>
          <h3 className="mb-0 fw-600">
            {payload?.destinationAmount} {payload?.destinationCurrency}{" "}
            <img src={flags[payload?.destinationCurrency]} alt="" width={35} />
          </h3>
        </div>
      </div>

      <div className="card shadow mx-5 p-3 rounded-4 w-100">
        <div className="card-body">
          <div className="mb-5">
            <p className="fw-500 mb-1 opacity-75">Recipient</p>
            <h3 className="fw-600 mb-1">
              {selectedBeneficiary?.beneficiaryName}
            </h3>
            <p className="fw-500 opacity-75">
              {
                listCountry.find(
                  (country) =>
                    country.ISOcc_2char ===
                    selectedBeneficiary?.destinationCountry
                )?.country_name
              }
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
            {/* <div className="row mb-2">
              <div className="col-6">Reference</div>
              <div className="col-6 text-end">Airship Repair</div>
            </div> */}
            {/* <div className="row mb-2">
              <div className="col-6">Purpose</div>
              <div className="col-6 text-end">Business expenses</div>
            </div> */}
            <div className="row">
              <div className="col-6">Transfer date</div>
              <div className="col-6 text-end">
                {new Date().toISOString().split("T")[0]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {tnxrefid?.systemReferenceNumber ? (
        <>
          <div className="d-flex flex-row gap-3 mt-3">
            <button
              variant="contained"
              className="btn btn-action w-100 rounded-5 align-items-center justify-content-center py-2 fw-500 "
              onClick={() => {
                setCurrentState("recipient");
                dispatch(paymentreducer.resetPayload());
                dispatch(paymentreducer.resetSetSendMoneyRes());
                dispatch(paymentreducer.setSelectedBeneficiary({}));
                dispatch(paymentreducer.setIsSuccess(false));
              }}>
              MAKE ANOTHER TRANSACTION
            </button>
            <Link
              to="/payments/transactions"
              className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 py-2 fw-500"
              onClick={handleClick}>
              MANAGE TRANSACTIONS
            </Link>
          </div>

          {/* <button
            variant="contained"
            className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
            onClick={() => setCurrentState("additionalinfo")}>
            Track Payment
          </button> */}
        </>
      ) : (
        <button
          variant="contained"
          className="btn btn-action mt-3 w-100 rounded-5 align-items-center justify-content-center py-2 fw-600"
          onClick={() => {
            setCurrentState("recipient");
            dispatch(paymentreducer.resetPayload());
            dispatch(paymentreducer.resetSetSendMoneyRes());
            dispatch(paymentreducer.setSelectedBeneficiary({}));
            dispatch(paymentreducer.setIsSuccess(false));
          }}>
          Retry
        </button>
      )}
    </div>
  );
}

export default Response;
