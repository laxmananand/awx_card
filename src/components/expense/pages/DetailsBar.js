import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DetailsBar({
  setShowDetails,
  handleShow,
  handleActive,
  selectedRowData,
}) {
  if (!selectedRowData) {
    return null; // If no row data is selected, don't display the DetailsBar
  }

  const {
    imgUrl,
    recipientName,
    id,
    status,
    createdBy,
    dueDate,
    amount,
    currency,
    description,
    sourceOfFund,
    date,
  } = selectedRowData; // Replace these with the actual properties in your row data

  const navigate = useNavigate();

  const redirectToAnotherPage = () => {
    // navigate('/expense/bills/payments', { state: { selectedRowData } });

    if (selectedRowData) {
      navigate("/payments/bills/payments", { state: { selectedRowData } });
    } else {
      // Handle case where selectedRowData is not available
      console.error("selectedRowData is null or undefined");
      // Optionally, handle this case or display an error message
    }
  };
  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === "Escape") {
        setShowDetails(false); // Call your function when "Esc" is pressed
      }
    }

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  return (
    <>
      <div
        className="position-fixed bg-black w-100 h-100 top-0 opacity-50"
        style={{ width: "100vb" }}
        onClick={() => {
          handleShow(-1);
          handleActive(-1);
          setShowDetails(false);
        }}
      ></div>
      <nav
        className="d-flex bg-white flex-column justify-content-start flex-start p-4 flex-1 border-top-0 position-fixed top-0 h-100 details_bar shadow"
        id="sidebar"
        style={{
          width: "350px",
          right: 0,
          transition: "right 0.3s ease-in-out",
        }}
      >
        <div className="mt-3 position-relative">
          <h6 className="text-nowrap me-5">{id}</h6>
          <button
            type="button"
            className="btn-close btn-sm  position-absolute end-0 top-0 me-2"
            onClick={() => {
              handleShow(-1);
              handleActive(-1);
              setShowDetails(false);
            }}
          />
        </div>

        <div className="border p-3 my-3 rounded-2 bg-yellow10">
          <div className="d-flex align-items-center">
            <div className="yellow100 ms-1 me-4">{recipientName}</div>
            <div
              className={`px-3 py-2 rounded-pill ${
                status?.toUpperCase() === "P"
                  ? "bg-yellow100"
                  : status?.toUpperCase() === "C"
                  ? "bg-green100"
                  : status?.toUpperCase() === "D"
                  ? "bg-blue100"
                  : status?.toUpperCase() === "O"
                  ? "bg-red100"
                  : status?.toUpperCase() === "R"
                  ? "bg-voilet100"
                  : ""} text-black ms-0 me-3`}
            >
              {status === "P" || status === "p"
            ? "Pending"
            : status === "D" || status === "d"
            ? "Draft"
            : status === "O" || status === "o"
            ? "Overdue"
            : status === "C" || status === "c"
            ? "Paid"
            : status.toUpperCase() == "R" || status === "r"
            ? "Payment Processing"
            : status}
            </div>
          </div>
          <hr className="blue100" />
          <div>
            <div className="fw-normal me-5 text-nowrap">{recipientName}</div>
            <div className="grey1 fw-normal mt-2">Creadted BY: {createdBy}</div>
            <div className="grey1 fw-normal mt-2">Due Date: {dueDate}</div>
            <div className="grey1 fw-normal mt-2">
              Desctiption: {description}
            </div>
            <div className="grey1 fw-normal mt-2">
              Sourceof Fund: {sourceOfFund}
            </div>
          </div>
          <hr className="blue100" />
          <div className="text-end">
            {amount} {currency}
          </div>
        </div>

        {status === "P" || status === "O" ? (
          <>
            <button
              className="blue100 btn border fw-500 py-2"
              onClick={() => redirectToAnotherPage()}
            >
              <img src="/expense/edit.svg" />
              &nbsp; Pay
            </button>
          </>
        ) : (
          <></>
        )}

        <div
          className="accordion accordion-flush mt-4"
          id="requestMoneyDetails"
        >
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingOne">
              <button
                className="accordion-button collapsed fw-500 ps-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne"
              >
                GENERAL
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#requestMoneyDetails"
            >
              <div className="d-flex my-3 align-items-center justify-content-between fw-normal">
                <img src="/expense/invoiceNum.svg" />
                <p className="m-0 grey1 flex-fill ms-2">Bill Number:</p>
                <p className="m-0">{id}</p>
              </div>
              <div className="d-flex my-3 align-items-center justify-content-between fw-normal">
                <img src="/expense/invoiceDate.svg" />
                <p className="m-0 grey1 flex-fill ms-2">Bill Date:</p>
                <p className="m-0">{date}</p>
              </div>
              <div className="d-flex my-3 align-items-center justify-content-between fw-normal">
                <img src="/expense/dueDate.svg" />
                <p className="m-0 grey1 flex-fill ms-2">Due Date:</p>
                <p className="m-0">{dueDate}</p>
              </div>
            </div>
          </div>
          {/* <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingTwo">
              <button
                className="accordion-button btn-accordion collapsed fw-500 text-decoration-none ps-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="false"
                aria-controls="flush-collapseTwo"
              >
                CONTROLS
              </button>
            </h2>
            <div
              id="flush-collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingTwo"
              data-bs-parent="#requestMoneyDetails"
            >
              <div className="d-flex my-3 align-items-center justify-content-between fw-normal">
                <img src="/expense/reference.svg" />
                <p className="m-0 grey1 flex-fill ms-2">Reference:</p>
                <p className="m-0">None</p>
              </div>
              <div className="d-flex my-3 align-items-center justify-content-between fw-normal">
                <img src="/expense/budget.svg" />
                <p className="m-0 grey1 flex-fill ms-2">Budget:</p>
                <p className="m-0">None</p>
              </div>
              <div className="d-flex my-3 align-items-center justify-content-between fw-normal">
                <img src="/expense/notify.svg" />
                <p className="m-0 grey1 flex-fill ms-2">Notify:</p>
                <p className="m-0">No</p>
              </div>
            </div>
          </div> */}
        </div>
      </nav>
    </>
  );
}

export default DetailsBar;
