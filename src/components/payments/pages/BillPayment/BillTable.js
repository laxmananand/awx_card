import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../../structure/BreadCrumbs";
import { useDispatch } from "react-redux";
import TestForm from "../Beneficiaries/Form";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { listbeneficiaries } from "../../../../@redux/action/payments";
import CreateNewBeneficiary from "../Beneficiaries/CreateNewBeneficiary";
import { fetchexcahngerate } from "../../../../@redux/action/payments";
import { sendMoney } from "../../js/ListBeneficiaries";
import { setIsLoading } from "../../../../@redux/features/payments";
import { updateBill } from "../../../../@redux/action/expence";
import dayjs from "dayjs";

export default function DataTable() {
  const navigate = useNavigate();
  const location = useLocation();

  const [payload, setPayload] = useState({});
  const customerHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );
  const beneficiaries = useSelector((state) => state.payments.beneficiaryList);
  const exchangeRate = useSelector((state) => state.payments.exchangeRate);
  const auditId = useSelector((state) => state.payments.auditId);
  const fxRate = useSelector((state) => state.payments.fxRate);
  const holdExpiryAt = useSelector((state) => state.payments.holdExpiryAt);
  const isLoading = useSelector((state) => state.payments.isLoading);
  var company = useSelector(
    (state) => state.onboarding.UserStatusObj.internalBusinessId
  );
  const [showComponent, setShowComponent] = useState(null);

  const dispatch = useDispatch();

  const { selectedRowData } = location.state || {};

  const [accountNumberExists, setAccountNumberExists] = useState(false);
  const [matchedBeneficiary, setMatchedBeneficiary] = useState();
  const [responseReferenceNumber, setResponseReferenceNumber] = useState(null); // State for handling response
  const [redirect, setRedirect] = useState("false");
  const [currentState, setCurrentState] = useState("preview");

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

  // if (!selectedRowData) {
  //   return <div>No data available</div>;
  //   //navigate("/expense/bills");
  // }

  const goBack = () => {
    // debugger
    // // Use navigate with the state from the location history
    // if (location.state && location.state.from) {
    //   // navigate(location.state.from);
    //   navigate(location.pathname, { state: null });
    // } else {
      // Fallback to a default route if no state.from is available
      navigate("/expense/bills"); // Replace with your default route
    // }
  };

  const handlePayBill = () => {
    dispatch(setIsLoading(true));
    if (payload && customerHashId) {
      sendMoney(payload, customerHashId)
        .then((response) => {
          dispatch(setIsLoading(false));
          if (response.system_reference_number) {
            const body = {
              id: selectedRowData.id,
              companyId: company,
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
          dispatch(setIsLoading(false));
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

  return (
    <div className="d-flex flex-column gap-2 align-self-stretch">
      <BreadCrumbs
        data={{
          name: "Bill Payment",
          img: "/arrows/arrowLeft.svg",
          backurl: "/payments/bills",
          // onBack: { goBack },
          info: true,
        }}
      />

      <div className="d-flex flex-column gap-2 align-self-stretch">
        <div className="d-flex justify-content-center align-self-center w-50 text-center ">
          <p className="mt-3 fs-3 justify">Preview</p>
        </div>

        <div className="d-flex flex-column  w-50 m-2 mt-2 mb-3 shadow rounded-5 align-self-center border">
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
                  <p>Fund transfer from :</p>
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
              {
                responseReferenceNumber &&(
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
                )
              }

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
