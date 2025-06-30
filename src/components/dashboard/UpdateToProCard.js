import React from "react";
import { Link } from "react-router-dom";

function UpdateToProCard({ isActivated }) {
  return (
    <div className={"mx-3 row border p-3 bg-white " + (isActivated ? "m-3" : "h-100")}>
      <div className="h3">
        Update to Pro
        <br />
        <span className="h4">$10.00 / month</span>
      </div>
      <p className="row grey1 fw-normal">
        Open more possibilities of your service with a pro account. More of these features, these and more.
      </p>
      <Link
        to="/settings/subscription"
        className="btn bg-blue10 blue100 fw-500 fs-5 p-0 mt-5 mb-2 py-3  px-2 py-md-0 border d-flex"
      >
        <div className="m-auto py-2">Upgrade to Pro Plan</div>
      </Link>
    </div>
  );
}

export default UpdateToProCard;
