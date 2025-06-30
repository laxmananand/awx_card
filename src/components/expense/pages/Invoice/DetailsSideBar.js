import React from "react";
import { Createinvoicedoc } from "../../js/invoices-function";

function DetailsSideBar({ detailsfields, url }) {
  debugger;
  const itemsArrayLength = detailsfields || [];
  const reallength = itemsArrayLength.length;

  const calculatepayable = () => {
    var total = parseFloat(itemsArrayLength.Subtotal);
    var discount = parseFloat(itemsArrayLength.Discount);
    var tax = parseFloat(itemsArrayLength.Tax);
    var discountedamount = total - discount;
    var payable = discountedamount + tax;
    return payable;
  };
  return (
    <div>
      <h5>{reallength} ITEM ADDED</h5>

      <div className="d-flex justify-content-between my-3 fw-600">
        <div className="me-5 opacity-75">Subtotal:</div>
        <div className="ms-5 text-secondary">
          {itemsArrayLength.Subtotal} SGD
        </div>
      </div>

      <div className="d-flex justify-content-between my-3 fw-600">
        <div className="opacity-75">Discount:</div>
        <div className="text-success">- {itemsArrayLength.Discount} SGD</div>
      </div>
      <div className="d-flex justify-content-between my-3 fw-600">
        <div className="opacity-75">Tax:</div>
        <div className="text-danger">+ {itemsArrayLength.Tax} SGD</div>
      </div>

      <hr />

      <div className="d-flex justify-content-between my-3 fw-600">
        <div className="opacity-75">Total Amount:</div>
        <div className="text-primary">{calculatepayable()} SGD</div>
      </div>

      {/* <button className='btn fw-500 blue100 border me-2 py-2 rounded-4' onClick={togglePreview}>
                    Preview
                    <img src='/expense/preview.svg' className='me-2' />
                </button> */}
      <div>
        <iframe
          src={url}
          width="100%"
          height="400"
          className="border"
          title="Preview"
        ></iframe>
      </div>
    </div>
  );
}

export default DetailsSideBar;
