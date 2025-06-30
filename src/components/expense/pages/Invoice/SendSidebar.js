import React from "react";
import { useState } from "react";

function SendSidebar(sendfields) {
  var sendfieldsoriginal = sendfields.sendfields || {};
  console.log(sendfieldsoriginal);
  const [showPreview, setShowPreview] = useState(false);
  const [previewClicked, setPreviewClicked] = useState(true);
  const togglePreview = () => {
    setShowPreview(!showPreview);
    setPreviewClicked(false);
  };
  const pdfURL = sessionStorage.getItem("pdfURL");
  const calculatepayable = () => {
    var total = parseFloat(sendfieldsoriginal.Subtotal);
    var discount = parseFloat(sendfieldsoriginal.Discount);
    var tax = parseFloat(sendfieldsoriginal.Tax);
    var discountedamount = total - discount;
    var payable = discountedamount + tax;
    return payable;
  };
  return (
    <div>
      <h5>{sendfieldsoriginal.length} ITEM ADDED</h5>

      <div className="d-flex justify-content-between my-3">
        <div className="me-5 fw-normal">Invoice:</div>
        <div className="ms-5 text-secondary fw-500">
          {sendfieldsoriginal.Invoicenumber}
        </div>
      </div>

      <div className="d-flex justify-content-between my-3">
        <div className="fw-normal">Due on:</div>
        <div className="text-secondary fw-500">
          {sendfieldsoriginal.dueDate}
        </div>
      </div>

      <hr />

      <div className="d-flex justify-content-between my-3 fw-normal">
        <div className="me-5">Subtotal:</div>
        <div className="ms-5 text-secondary fw-600">
          {sendfieldsoriginal.Subtotal} SGD
        </div>
      </div>

      <div className="d-flex justify-content-between my-3 fw-normal">
        <div>Discount:</div>
        <div className="text-success fw-600">
          - {sendfieldsoriginal.Discount} SGD
        </div>
      </div>
      <div className="d-flex justify-content-between my-3 fw-normal">
        <div>Tax:</div>
        <div className="text-danger fw-600">+ {sendfieldsoriginal.Tax} SGD</div>
      </div>

      <hr />

      <div className="d-flex justify-content-between my-3 fw-normal">
        <div>Total Amount:</div>
        <div className="fw-600 text-primary">{calculatepayable()}</div>
      </div>
      {previewClicked && (
        <button
          className="btn fw-500 blue100 border me-2 py-2 rounded-4"
          onClick={togglePreview}
        >
          Preview
          <img src="/expense/preview.svg" className="me-2" />
        </button>
      )}

      <div>
        {showPreview && (
          <iframe
            src={pdfURL}
            width="100%"
            height="400"
            title="Preview"
          ></iframe>
        )}
      </div>
    </div>
  );
}

export default SendSidebar;
