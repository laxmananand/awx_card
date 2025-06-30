import { Input, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listbeneficiaries } from "../../../../@redux/action/payments";
// import { useSelector } from "react-redux";
import "../../css/sendmoney.css";
import BeneficiaryForm from "../Beneficiaries/Form";
import { setPayload } from "../../../../@redux/features/payments";
import * as paymentreducer from "../../../../@redux/features/payments";
function Recipient({
  customerHashId,
  beneficiaries,
  setCurrentState,
  beneficiaryName,
  beneficiaryHashId,
  payoutMethod,
  beneficiaryAccountNumber,
  // setSelectedBeneficiary,
}) {
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const [payoutFilter, setPayoutFilter] = useState("local"); // State to store payout method ('swift' or 'local')
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]); // State to store filtered beneficiaries
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [formData, setFormData] = useState({}); // State to hold data for the Form
  const clearFormData = () => {
    setFormData({});
    setShowForm(false);
  };

    const platform = useSelector((state) => state.common.platform);
  

  // UseEffect to filter beneficiaries based on payout method and search term
  useEffect(() => {
    // First, filter beneficiaries by payout method
    const filteredByPayout = beneficiaries?.filter(
      (beneficiary) =>
        beneficiary?.payoutMethod?.toLowerCase() === payoutFilter.toLowerCase()
    );

    // Then filter the beneficiaries based on the search term
    const filteredWithSearch = filteredByPayout?.filter((beneficiary) =>
      beneficiary.beneficiaryName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    // Update the filtered beneficiaries state
    setFilteredBeneficiaries(filteredWithSearch);
  }, [payoutFilter, searchTerm, beneficiaries]); // Dependencies: payoutFilter, searchTerm, and beneficiaries

  const dispatch = useDispatch();

  const [next, setNext] = useState(false);

  const navigate = useNavigate();

  const handleButtonClick = () => {
    if(platform === "awx"){
      // setCurrentState("awx")
      navigate('/payments/beneficiaries'); // 👉 Navigate to the route

    }
    else
   { // You can populate formData with default values or any other data you need
    setFormData({
      name: beneficiaryName || "", // Example data
      accountNumber: beneficiaryAccountNumber || "",
      // Add other fields as necessary
    });
    setShowForm(!showForm); // Show the form
    }
  };

  const handlePayClick = (beneficiary) => {

    if (platform === "awx"){
      setCurrentState("awx");
      dispatch(paymentreducer.setPayload({
        beneficiary_id : beneficiary.beneficiaryHashId
      }))

    }

    else{

      dispatch(paymentreducer.setSelectedBeneficiary(beneficiary)); // Set the selected beneficiary
      setCurrentState("amount"); // Assuming setCurrentState is available
      dispatch(
        paymentreducer.setPayload({
          destinationCurrency: beneficiary?.destinationCurrency,
          destinationCountry: beneficiary?.destinationCountry,
          customerType: "CORPORATE",
          beneficiaryAccountType: beneficiary?.beneficiaryAccountType,
          payoutMethod: beneficiary?.payoutMethod,
          routingCodeType: beneficiary?.routingCodeType1,
          id: beneficiary?.beneficiaryHashId,
          sourceOfFunds: "Corporate Account",
        })
  
      );

    }
  };

  return (
    <>
      <div
        className="recipient-main d-flex flex-column align-items-start justify-content-start gap-4"
        style={{ height: "100vh", padding: "3.5rem 18rem" }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "600",
              lineHeight: "40px",
              letterSpacing: "-0.5px",
            }}
          >
            Who are you transferring to?
          </h1>
        </div>
        {/* For existing beneficiary */}
        <div className="accordion shadow" style={{ width: "100%" }}>
          <div className="accordion-item">
            <div className="accordion-header">
              <button
                className="accordion-button collapsed fw-500"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                <div className="d-flex align-items-center gap-4">
                  <img
                    src="/payments/recipient.png"
                    alt="beneficiaries icon"
                    width={50}
                  />

                  <div className="d-flex flex-column align-items-start gap-1">
                    <h4
                      className="fw-bold"
                      style={{
                        fontSize: "20px !important",
                        letterSpacing: "-0.5px",
                        marginBottom: "0",
                      }}
                    >
                      Existing recipient
                    </h4>

                    <span
                      className="fw-bold"
                      style={{
                        fontSize: "13px",
                        opacity: "50%",
                        paddingRight: 10,
                      }}
                    >
                      Pick someone from your contact list to get started
                    </span>
                  </div>
                </div>
              </button>
            </div>
            <div
              id="collapseOne"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body d-flex flex-column gap-3">
                {/* search option */}
                <div className="mb-3 d-flex align-items-center justify-content-start w-100 p-2 gap-3 border rounded-5">
                  <img src="/search.svg" alt="search" width={35} />
                  <input
                    type="text"
                    className="search-box"
                    placeholder="Search beneficiaries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
                  />
                </div>
                {/* Toggle Payout Method Options */}
                <div className="d-flex justify-content-center mb-3 gap-3">
                  <button
                    className="btn btn-action w-50 rounded-5 d-flex align-items-center justify-content-center py-2 fw-600"
                    onClick={() => setPayoutFilter("local")}
                  >
                    Local Payout
                  </button>
                  <button
                    className="btn btn-secondary w-50 rounded-5 d-flex align-items-center justify-content-center py-2 fw-600"
                    onClick={() => setPayoutFilter("swift")}
                  >
                    Swift Payout
                  </button>
                </div>
                <div
                  className="d-flex flex-column beneficiary-list"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {filteredBeneficiaries &&
                  filteredBeneficiaries?.length > 0 ? (
                    filteredBeneficiaries?.map((beneficiary, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center justify-content-between mb-3"
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className={`border rounded-circle fw-bold text-white ${
                              [
                                "bg-dark",
                                "bg-primary",
                                "bg-success",
                                "bg-danger",
                                "bg-secondary",
                              ][Math.floor(Math.random() * 5)]
                            }`}
                            style={{
                              padding: "10px 16px",
                              fontSize: "20px",
                              marginRight: "10px",
                            }}
                          >
                            {beneficiary.beneficiaryName
                              ?.slice(0, 1)
                              ?.toUpperCase() || "NaN"}
                          </div>
                          <div>
                            <span className="fw-bold">
                              {beneficiary.beneficiaryName}
                            </span>
                            <br />
                            <span
                              className="text-muted"
                              style={{ fontSize: "12px" }}
                            >
                              {beneficiary.beneficiaryAccountNumber} -{" "}
                              {beneficiary.destinationCurrency} -{" "}
                              {beneficiary.routingCodeType1} -{" "}
                              {beneficiary.routingCodeValue1}
                            </span>
                          </div>
                        </div>
                        {/* Pay Button */}
                        <button
                          // className="btn btn-primary"
                          className="btn btn-action w-80 rounded-5 d-flex align-items-center justify-content-center py-2 fw-600"
                          onClick={() => handlePayClick(beneficiary)}
                        >
                          {/* setCurrentState("amount")}> */}
                          Pay
                        </button>
                      </div>
                    ))
                  ) : (
                    <div>No beneficiaries found.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* For new beneficiary */}
        <div
          className="shadow"
          style={{
            width: "100%",
            cursor: "pointer",
            borderRadius: "12px",
            border: "2px solid lightgrey",
          }}
        >
          <div
            className="d-flex align-items-center gap-4"
            style={{ padding: "1.5rem 2.25rem" }}
          >
            <img
              src="/payments/add_new.svg"
              alt="beneficiaries icon"
              width={50}
            />

            <div className="text-start" onClick={handleButtonClick}>
              <h4
                className="fw-bold"
                style={{
                  fontSize: "20px !important",
                  letterSpacing: "-0.5px",
                  marginBottom: "0",
                }}
              >
                Someone New
              </h4>

              <span
                className="fw-bold"
                style={{ fontSize: "13px", opacity: "50%", paddingRight: 15 }}
              >
                Start with transfer details and provide recipient information
                later
              </span>
            </div>
          </div>
          {/* Conditionally render the Form component */}
          {showForm && (
            <div className="modal-dialog modal-lg">
              <div className="d-flex flex-column modal-content py-3 px-4 gap-4 text-center text-dark">
                <div className="d-flex flex-row p-2 justify-content-between align-items-center border-bottom border-warning">
                  <h4 className="fw-bold">Add beneficiary</h4>
                  <button
                    id="closeModalButton"
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={clearFormData}
                  ></button>
                </div>
                <BeneficiaryForm
                  customerHashId={customerHashId}
                  formData={formData}
                  setFormData={setFormData}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Recipient;
