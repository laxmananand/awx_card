import React, { useEffect, useState } from "react";

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
    customerName,
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
  console.log(selectedRowData);
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
          <h6 className="text-nowrap me-5">Invoice Details</h6>
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

        <div className="border p-3 my-3 rounded-2 bg-green10">
          <div className="d-flex align-items-center">
            <div className="green100 ms-1 me-4">{id}</div>
            <div
              className={`px-3 py-2 rounded-pill ${
                status === "P"
                  ? "bg-yellow100"
                  : status === "A"
                  ? "bg-green100"
                  : status === "R"
                  ? "bg-red100"
                  : "bg-blue100"
              } text-white ms-0 me-3`}
            >
              {status === "P"
                ? "Pending"
                : status === "A"
                ? "Approved"
                : status === "R"
                ? "Rejected"
                : status}
            </div>
          </div>
          <hr className="green100" />
          <div>
            <div className="my-2 fw-normal">{customerName}</div>
            <div className="grey1 fw-normal">{date}</div>
          </div>
          <hr className="green100" />
          <div className="text-end">
            {amount} {currency}
          </div>
        </div>

        <div className="accordion accordion-flush" id="requestMoneyDetails">
          <div className="accordion-item">
            <h4 className="accordion-header" id="flush-headingTwo">
              <button
                className="accordion-button btn-accordion collapsed fw-500 text-decoration-none border"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="false"
                aria-controls="flush-collapseTwo"
              >
                General Details
              </button>
            </h4>
            <div
              id="flush-collapseTwo"
              className="accordion-collapse collapse show"
              aria-labelledby="flush-headingTwo"
              data-bs-parent="#requestMoneyDetails"
            >
              <div className="d-flex my-3 align-items-center justify-content-between fw-normal">
                <img src="/expense/invoiceNum.svg" />
                <p className="m-0 grey1 flex-fill ms-2">Invoice Number:</p>
                <p className="m-0">{id}</p>
              </div>
              <div className="d-flex my-3 align-items-center justify-content-between fw-normal">
                <img src="/expense/invoiceDate.svg" />
                <p className="m-0 grey1 flex-fill ms-2">Invoice Date:</p>
                <p className="m-0">{date}</p>
              </div>
              <div className="d-flex my-3 align-items-center justify-content-between fw-normal">
                <img src="/expense/dueDate.svg" />
                <p className="m-0 grey1 flex-fill ms-2">Due Date:</p>
                <p className="m-0">{dueDate}</p>
              </div>
              <div className="d-flex my-3 align-items-center justify-content-between fw-normal">
                <img src="/expense/sentBy.svg" />
                <p className="m-0 grey1 flex-fill ms-2">Sent By:</p>
                <p className="m-0">{customerName}</p>
              </div>

              <hr />
            </div>
          </div>
        </div>

        <button className="btn border rounded-4 fw-500 blue100 d-flex justify-content-center align-items-center mt-3">
          <a
            href={imgUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            <img src="/draganddrop.svg" className="me-2" width={30} />
            Download Invoice
          </a>
        </button>

        {/* <button className="btn border rounded-4 fw-500 blue100 d-flex justify-content-center align-items-center mt-3">
          <a
            href={"/expense/invoices/send-email-invoice?img=" + imgUrl}
            rel="noopener noreferrer"
            className="text-decoration-none"
          >
            <img src="/draganddrop.svg" className="me-2" width={30} />
            Send Invoice via email
          </a>
        </button> */}
      </nav>
    </>
  );
}

export default DetailsBar;
