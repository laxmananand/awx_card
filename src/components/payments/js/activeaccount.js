import React from "react";

function activeaccount() {
  return (
    <div className="bg-white m-3 pb-3 border">
      <div className="d-flex align-items-center bg-white p-4">
        <img src="/refresh.svg" />
        <h4 className="m-0 ms-2">Active Account</h4>
      </div>

      <div className="d-flex justify-content-center">
        <div>
          <img src="/lock_3.svg" className=" border p-3 bg-grey" />
        </div>
      </div>

      <p className="text-center pb-5 mb-5 mt-2 p-3">
        <span className="fw-normal">
          You don't have any transaction history yet.
          <br />
          To start making money transfers, you need to{" "}
        </span>
        <a href="#" className="blue100">
          Activate Your Account
        </a>
        <span className="fw-normal"> first.</span>
      </p>
    </div>
  );
}
export default activeaccount;
