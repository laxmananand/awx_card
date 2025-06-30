import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Header() {
  const [finalKycStatus, setFinalKycStatus] = useState("PENDING");
  const [complianceStatus, setComplianceStatus] = useState("IN_PROGRESS");
  const [subscription, setSubscription] = useState("inactive");
  const subStatus = useSelector((state) => state.subscription?.data?.status);
  useEffect(() => {
    if (
      finalKycStatus &&
      complianceStatus &&
      complianceStatus != "" &&
      finalKycStatus != ""
    ) {
      setComplianceStatus(sessionStorage.getItem("complianceStatus"));
      setFinalKycStatus(sessionStorage.getItem("finalKycStatus"));
      setSubscription(subStatus);
    }
  }, [finalKycStatus, complianceStatus, subStatus, subscription]);

  return (
    <>
      {complianceStatus === "IN_PROGRESS" ? (
        <>
          <div
            className="p-3 m-3 rounded-3 d-flex align-items-center"
            style={{ backgroundColor: "var(--accent-blue-10)" }}
          >
            <img className="mx-2" src="/bell.png" width="25" alt="" />
            <h6 className="me-auto my-0 ms-2">
              {sessionStorage.getItem("contactName")
                ? `Congrats ${
                    sessionStorage.getItem("contactName").split(" ")[0]
                  }! Application submitted.`
                : "Congratulations! Application submitted."}
              <Link to="/onboarding/Home" style={{ textDecoration: "none" }}>
                {" "}
                Complete Your KYC Now
              </Link>
              {", To Unlock The Full Potential Of Zoqq."}
            </h6>
          </div>
        </>
      ) : complianceStatus === "ACTION_REQUIRED" ? (
        <>
          <div
            className="p-3 m-3 rounded-3 d-flex align-items-center"
            style={{ backgroundColor: "var(--accent-blue-10)" }}
          >
            <img className="mx-2" src="/bell.png" width="25" alt="" />
            <h6 className="me-auto my-0 ms-2">
              {sessionStorage.getItem("contactName")
                ? `Congrats ${
                    sessionStorage.getItem("contactName").split(" ")[0]
                  }! Your application is submitted and
              currently under review by our compliance team. Kindly await further updates.`
                : `Congrats! Your application is submitted and
              currently under review by our compliance team. Kindly await further updates.`}
            </h6>
          </div>
        </>
      ) : complianceStatus == "RFI_REQUESTED" ? (
        <>
          <div style={{ padding: "15px" }}>
            <div
              className="d-flex align-items-center"
              style={{
                backgroundColor: "var(--bs-gray-400)",
                borderRadius: "15px",
                padding: "15px",
              }}
            >
              <img className="mx-2" src="/bell.png" width="25" alt="" /> PLEASE
              PROVIDE SOME MORE INFORMATION FOR ADDITIONAL VERIFICATION,
              <Link to="/onboarding/rfi" className="mx-1">
                CHECK DETAILS
              </Link>
            </div>
          </div>
        </>
      ) : complianceStatus == "COMPLETED" ? (
        <>
          {subscription === "inactive" ? (
            <>
              <div style={{ padding: "15px" }}>
                <div
                  className="d-flex align-items-center"
                  style={{
                    backgroundColor: "var(--bs-gray-400)",
                    borderRadius: "15px",
                    padding: "15px",
                  }}
                >
                  <img className="mx-2" src="/bell.png" width="25" alt="" />{" "}
                  Unlock Seamless Payments,
                  <Link to="/settings/subscription" className="mx-1">
                    Subscribe Now
                  </Link>
                  and Explore Limitless Possibilities!
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      ) : complianceStatus == "RFI_RESPONDED" ? (
        <>
          <div style={{ padding: "15px" }}>
            <div
              className="d-flex align-items-center"
              style={{
                backgroundColor: "var(--bs-gray-400)",
                borderRadius: "15px",
                padding: "15px",
              }}
            >
              <img className="mx-2" src="/bell.png" width="25" alt="" /> Your
              response to the RFI has been received. Kindly await further
              updates.
            </div>
          </div>
        </>
      ) : complianceStatus == "ERROR" ? (
        <>
          <div style={{ padding: "15px" }}>
            <div
              className="d-flex align-items-center"
              style={{
                backgroundColor: "brown",
                borderRadius: "15px",
                padding: "15px",
                color: "white",
              }}
            >
              <img className="mx-2" src="/bell.png" width="25" alt="" /> Whoops!
              It seems there's a slight hiccup. Some details need a second look.
              <Link
                to="/onboarding/Home"
                className="mx-2"
                style={{ color: "cornsilk" }}
              >
                {" "}
                Head back to the onboarding form and fix those hiccups?
              </Link>
            </div>
          </div>
        </>
      ) : complianceStatus == "REJECT" ? (
        <>
          <div style={{ padding: "15px" }}>
            <div
              className="d-flex align-items-center"
              style={{
                backgroundColor: "brown",
                borderRadius: "15px",
                padding: "15px",
                color: "white",
              }}
            >
              <img className="mx-2" src="/bell.png" width="25" alt="" /> Your
              submission has been rejected.
              <Link
                to="/onboarding/Home"
                className="mx-2"
                style={{ color: "cornsilk" }}
              >
                {" "}
                Please review
              </Link>{" "}
              and address the issues before resubmitting.
            </div>
          </div>
        </>
      ) : complianceStatus === "INITIATED" ? (
        <>
          <div
            className="p-3 m-3 rounded-3 d-flex align-items-center"
            style={{ backgroundColor: "var(--accent-blue-10)" }}
          >
            <img className="mx-2" src="/bell.png" width="25" alt="" />
            <h6 className="me-auto my-0 ms-2">
              {sessionStorage.getItem("contactName")
                ? `Congrats ${
                    sessionStorage.getItem("contactName").split(" ")[0]
                  }! Your eKYC process has been initiated. Please await further updates on your compliance process.`
                : "Congratulations! Your eKYC process has been initiated. Please await further updates on your compliance process."}
              <Link to="/onboarding/Home" style={{ textDecoration: "none" }}>
                {" Check KYB Details >>"}
              </Link>
            </h6>
          </div>
        </>
      ) : (
        <>
          <div className="bg-yellow10 p-3 m-3 rounded-3 d-flex align-items-center">
            <img src="/lock_1.svg" />
            <h6 className="me-auto my-0 ms-2">
              Add business details to Activate Your Account and unlock all the
              features
            </h6>
            <Link to="/onboarding/Home">
              <button
                className="btn bg-white yellow100 ms-3 fw-500"
                style={{ letterSpacing: "0.5px" }}
              >
                ACTIVATE ACCOUNT
              </button>
            </Link>
          </div>
        </>
      )}
    </>
  );
}

export default Header;
