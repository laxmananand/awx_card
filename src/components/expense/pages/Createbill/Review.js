import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createbill } from "../../js/bills-functions";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setTransferFields,
  setCurrentState,
  setReviewFields,
} from "../../../../@redux/features/expence";
import { useNavigate } from "react-router-dom";
import { listbeneficiaries } from "../../../../@redux/action/payments";
import CreateNewBeneficiary from "../../../payments/pages/Beneficiaries/CreateNewBeneficiary";
import { fetchexcahngerate } from "../../../../@redux/action/payments";
import { sendMoney } from "../../../payments/js/ListBeneficiaries";
import { updateBill } from "../../../../@redux/action/expence";
import dayjs from "dayjs";

const options = [
  { value: "USD", label: "$" },
  { value: "SGD", label: "S$" },
  { value: "GBP", label: "£" },
  { value: "AUD", label: "A$" },
  { value: "EURO", label: "€" },
  { value: "HKD", label: "HK$" },
];

function Review() {
  const [isLoading, setIsLoading] = useState(false);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  let currentState = useSelector((state) => state.expence.currentState);
  let apiData = useSelector((state) => state.expence.apiData);
  let transferFields = useSelector((state) => state.expence.transferFields);
  let reviewFields = useSelector((state) => state.expence.reviewFields);

  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleCreateBill = async () => {
    //setIsLoading(true);

    // const url = `/payments/beneficiaries?name=${encodeURIComponent(
    //   reviewFields.RecipientName
    // )}&accountNumber=${encodeURIComponent(
    //   reviewFields.RecipientAccountNumber
    // )}`;

    const rowData = {
      imgUrl: reviewFields?.Imageurl,
      recipientName: reviewFields?.RecipientName,
      recipientAccountnumber: reviewFields?.RecipientAccountNumber,
      id: reviewFields?.Billnumber,
      status: "P",
      createdBy: reviewFields?.Createdby,
      dueDate: reviewFields?.Duedate,
      amount: reviewFields?.TotalAmount,
      currency: reviewFields?.currency,
      description: reviewFields?.Description,
      sourceOfFund: reviewFields?.SourceofFunds,
      date: reviewFields?.Billdate,
    };

    //console.log("selectedRowData", selectedRowData);

    // setTimeout(() => {
    //   setIsLoading(false);
    //   navigate("/expense/bills/payments", { state: { selectedRowData } });
    // }, 1000);

    setSelectedRowData(rowData);
  };

  useEffect(() => {
    handleCreateBill();
  }, []);

  //Bill Payment Methods
  const [payload, setPayload] = useState({});
  const customerHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );
  const beneficiaries = useSelector((state) => state.payments.beneficiaryList);
  const exchangeRate = useSelector((state) => state.payments.exchangeRate);
  const auditId = useSelector((state) => state.payments.auditId);
  const fxRate = useSelector((state) => state.payments.fxRate);
  const holdExpiryAt = useSelector((state) => state.payments.holdExpiryAt);
  var company = useSelector(
    (state) => state.onboarding.UserStatusObj.internalBusinessId
  );
  const [showComponent, setShowComponent] = useState(null);

  //const { selectedRowData } = location.state || {};

  const [accountNumberExists, setAccountNumberExists] = useState(false);
  const [matchedBeneficiary, setMatchedBeneficiary] = useState();
  const [responseReferenceNumber, setResponseReferenceNumber] = useState(null); // State for handling response
  const [redirect, setRedirect] = useState("false");

  useEffect(() => {
    dispatch(listbeneficiaries(customerHashId));
  }, [accountNumberExists]);

  useEffect(() => {
    if (matchedBeneficiary) {
      dispatch(
        fetchexcahngerate(
          selectedRowData?.sourceOfFund,
          selectedRowData?.currency,
          customerHashId
        )
      );
    }
  }, [matchedBeneficiary]);

  useEffect(() => {
    if (!selectedRowData?.recipientAccountnumber || !beneficiaries) {
      setMatchedBeneficiary(null);
      setAccountNumberExists(false);
      return;
    }

    const foundBeneficiary = beneficiaries.find(
      (beneficiary) =>
        beneficiary?.beneficiaryAccountNumber ===
        selectedRowData?.recipientAccountnumber
    );

    setMatchedBeneficiary(foundBeneficiary || null);
    setAccountNumberExists(Boolean(foundBeneficiary));
  }, [selectedRowData, beneficiaries]);

  useEffect(() => {
    setPayload({
      beneficiaryid: matchedBeneficiary?.beneficiaryHashId,
      beneficiaryAccountNumber: selectedRowData?.recipientAccountnumber,
      destinationCurrency: selectedRowData?.currency,
      source_currency: selectedRowData?.sourceOfFund,
      customerComments: selectedRowData?.description,
      audit_id: auditId, // Using auditId from Redux store
      source_amount: selectedRowData?.amount,
      purposeCode: "IR007",
      sourceOfFunds: "Corporate Account",
    });
  }, [exchangeRate, matchedBeneficiary, auditId]);

  const handlePayBill = () => {
    setIsLoading(true);
    if (payload && customerHashId) {
      sendMoney(payload, customerHashId)
        .then((response) => {
          setIsLoading(false);
          if (response.system_reference_number) {
            const body = {
              id: selectedRowData.id,
              companyId: company,
              // status: "c",
              status: "R",
              transferReferenceNumber: response.system_reference_number,
            };
            dispatch(updateBill(body));
            console.log(response.message);
            setResponseReferenceNumber(response.system_reference_number);
            console.log(response.system_reference_number);
            setRedirect(true);
            setCurrentState("response");
          } else {
            handleResponseError(response);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error sending money:", error);
        });
    }
  };

  const handleResponseError = (response) => {
    if (response.status === "BAD_REQUEST") {
      console.log(response.errors[0]);
    } else if (response.status === "INTERNAL_SERVER_ERROR") {
      console.log(response.message);
    } else if (response.status === "404") {
      console.log(response.error);
    }
  };

  const goBack = () => {
    // Use navigate with the state from the location history
    if (location.state && location.state.from) {
      // navigate(location.state.from);
      navigate(location.pathname, { state: null });
    } else {
      // Fallback to a default route if no state.from is available
      navigate("/expense/bills"); // Replace with your default route
    }
  };

  return (
    <div>
      {
        <style>
          {`.blinking-text {
              animation: fade-animation 1.5s ease-in-out infinite;
              color: #ff; /* Set the text color */
              }

              @keyframes fade-animation {
                0%, 100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0;
                }`}
        </style>
      }
      <div
        className="opacity-50 m-3"
        onClick={() => dispatch(setCurrentState(1))}
        role="button"
      >
        <img src="/arrows/arrowLeft.svg" width={10} />
        &nbsp; back
      </div>

      <div className="d-flex align-items-center my-4">
        <p className="m-0 mx-3 blue100 fw-normal">1. Bill</p>
        <img src="/payments/lineH.svg" />
        <p className="m-0 mx-3 blue100 fw-normal">2. Transfer</p>
        <img src="/payments/lineH.svg" />
        <p className="m-0 mx-3 blue100 fw-500">3. Review</p>
      </div>

      {/* <div className="border my-3 py-4 px-5 rounded-5 d-flex flex-column">
        <p className="w-100 text-center fw-bold text-uppercase fw-bold fs-5 opacity-75 pb-2">
          Review your bill
        </p>
        <div className="d-flex justify-content-between">
          <p className="fw-normal">Bill Number:</p>
          <p>{reviewFields.Billnumber}</p>
        </div>
        <div className="d-flex justify-content-between">
          <p className="fw-normal">Billing date:</p>
          <p>{reviewFields.Billdate}</p>
        </div>
        <div className="d-flex justify-content-between">
          <p className="fw-normal">Due date:</p>
          <p>{reviewFields.Duedate}</p>
        </div>

        <hr />

        <div className="d-flex justify-content-between fw-normal">
          <p>Rcipient Name:</p>
          <p>{reviewFields.RecipientName}</p>
        </div>

        <div className="d-flex justify-content-between fw-normal">
          <p>Recipient Account Number:</p>
          <p>{reviewFields.RecipientAccountNumber}</p>
        </div>

        <div className="d-flex justify-content-between fw-normal">
          <p>Source of fund:</p>
          <p>{reviewFields.SourceofFunds}</p>
        </div>
        <div className="d-flex justify-content-between fw-normal">
          <p>Description:</p>
          <p>{reviewFields.Description}</p>
        </div>
        <div className="d-flex justify-content-between fw-normal">
          <p>Notify:</p>
          <p>No</p>
        </div>

        <hr />

        <div className="d-flex justify-content-between fw-normal">
          <p>Total Amount (inclusive of all taxes):</p>
          <p className="fw-500">
            {options.find((item) => item.value === reviewFields.currency)
              ?.label || reviewFields.currency}
            {reviewFields.TotalAmount}
          </p>
        </div>
        <div
          className="d-flex justify-content-between fw-normal opacity-75"
          style={{ fontSize: "14px" }}
        >
          <p>Created By:</p>
          <p>{reviewFields.Createdby}</p>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <div className="d-flex align-items-center gap-2">
          <button className="btn fw-500 green100 border me-2 py-2 rounded-4">
            Save as Draft
            <img src="/payments/save.svg" className="ms-1" />
          </button>
          <button className="btn fw-500 yellow100 border me-2 py-2 rounded-4">
            Delete
            <img src="/payments/delete.svg" className="ms-1" />
          </button>
        </div>

        <div>
          <button
            // to="/expense/bills"
            type="button"
            className="btn bg-green100 text-white border w-100 d-flex align-items-center justify-content-center py-2 fw-500 rounded-4 px-4"
            onClick={handleCreateBill}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="blinking-text">Paying Bill...</span>
              </>
            ) : (
              "Pay Bill ➤"
            )}{" "}
          </button>
        </div>
      </div> */}

      <div className="d-flex flex-column gap-2 align-self-stretch">
        {/* <div className="d-flex justify-content-center align-self-center w-50 text-center ">
          <p className="mt-3 fs-3 justify">Preview</p>
        </div> */}

        <div className="d-flex flex-column w-100 m-2 mt-2 mb-3 shadow rounded-5 align-self-center border">
          <div className="d-flex flex-column">
            <div className=" d-flex flex-column p-5">
              <div className="d-flex flex-row justify-content-between w-100 border-bottom">
                <div className="text-primary ">
                  <p>Recipient Name:</p>
                </div>
                <div>
                  {selectedRowData?.recipientName ||
                    matchedBeneficiary?.beneficiaryName}
                </div>
              </div>

              {selectedRowData?.recipientAccountnumber && (
                <div className="d-flex flex-row  mt-3 justify-content-between w-100 border-bottom">
                  <div className="text-primary">
                    <p>Recipient Account Number :</p>
                  </div>
                  <div className="">
                    {selectedRowData?.recipientAccountnumber}
                  </div>
                </div>
              )}

              <div className="d-flex flex-row  mt-3 justify-content-between w-100 border-bottom">
                <div className="text-primary">
                  <p>Billing Amount :</p>
                </div>
                <div className="">
                  {selectedRowData?.amount} {selectedRowData?.currency}
                </div>
              </div>

              <div className="d-flex flex-row  mt-3 justify-content-between w-100 border-bottom">
                <div className="text-primary">
                  <p>Fund transferred from :</p>
                </div>
                <div className="">
                  {selectedRowData?.sourceOfFund} {"Account"}
                </div>
              </div>

              <div className="d-flex flex-row  mt-3 justify-content-between w-100 border-bottom">
                <div className="text-primary">
                  <p>Bill creation date :</p>
                </div>
                <div className="">
                  {selectedRowData?.createdAt || selectedRowData?.date}
                </div>
              </div>

              <div className="d-flex flex-row  mt-3 justify-content-between w-100 border-bottom">
                <div className="text-primary">
                  <p>Due Date :</p>
                </div>
                <div className="">{selectedRowData?.dueDate}</div>
              </div>

              <div className="d-flex flex-row  mt-3 justify-content-between w-100 border-bottom">
                <div className="text-primary">
                  <p>Created by :</p>
                </div>
                <div className="">{selectedRowData?.createdBy}</div>
              </div>

              <div className="d-flex flex-row  mt-3 justify-content-between w-100 border-bottom">
                <div className="text-primary">
                  <p>Status :</p>
                </div>
                <div className="">
                  {selectedRowData?.status === "D"
                    ? "Draft"
                    : selectedRowData?.status === "P"
                    ? "Pending"
                    : selectedRowData?.status === "C"
                    ? "Completed"
                    : selectedRowData?.status === "O"
                    ? "Overdue"
                    : selectedRowData?.status === "R"
                    ? "Requested"
                    : "Unknown"}
                </div>
              </div>

              <div className="d-flex flex-row  mt-3 justify-content-between w-100 border-bottom">
                <div className="text-primary">
                  <p>Bill description :</p>
                </div>
                <div className="">{selectedRowData?.description}</div>
              </div>

              {fxRate && (
                <div className="d-flex flex-row my-3 justify-content-between w-100 border-bottom">
                  <div className="text-primary">
                    <p>Fx Rate :</p>
                  </div>
                  <div className="d-flex flex-column align-items-end">
                    {fxRate}

                    <span
                      className="opacity-75 mb-3"
                      style={{ fontSize: "14px" }}
                    >
                      expiry at{" "}
                      {dayjs(holdExpiryAt?.slice(0, 10)).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-center ">
              {accountNumberExists ? (
                responseReferenceNumber ? (
                  <button
                    type="button"
                    className="btn btn-success rounded-pill w-50 d-flex justify-content-center mb-4 fw-500"
                    onClick={goBack}
                  >
                    Done
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-warning rounded-pill w-50 d-flex justify-content-center mb-4 fw-500 py-2"
                    onClick={handlePayBill}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <div className="d-flex gap-2 align-items-center">
                        Pay Bill{" "}
                        <img src="/expense/pay-bill.svg" alt="" width={30} />
                      </div>
                    )}
                  </button>
                )
              ) : (
                <div className="mb-4">
                  <CreateNewBeneficiary customerHashId={customerHashId} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;
