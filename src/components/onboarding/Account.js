import React from "react";
import "./account.css";
import Dashboard from "./dashboard/dashboard";

function Account() {
  return (
    <div>
      <div className="d-flex" id="onboarding-main-form">
        <div
          className="container-fluid px-0 bg-light clear-left overflow-auto"
          id="main-container"
          style={{ height: "100vh" }}
        >
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default Account;
