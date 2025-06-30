import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./../css/subscription.css";
import CompareAllPlans from "./CompareAllPlans";
import * as functions from "../js/subscription.js";
import { logout } from "../js/logout-function";

export default function Verification() {
  return (
    <div className="bg-blue10 pb-5">
      <div className="bg-white p-3 d-flex" style={{ width: "100vw" }}>
        <Link to="/">
          <img src="/zoqq.svg" width={100} />
        </Link>

        <div className="d-flex justify-content-center flex-fill">
          <p className="mx-2 p-2 my-auto">Business Details</p>
          <p className="mx-2 p-2 my-auto">Account Setup</p>
          <p className="mx-2 p-2 my-auto">Explore Zoqq</p>
        </div>
      </div>
      <CompareAllPlans />
    </div>
  );
}
