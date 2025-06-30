import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import Password from "./Security/Password";
import TwoFA from "./Security/TwoFA";
import LogoutAllDevice from "./Security/LogoutAllDevice";
import { useLocation } from "react-router-dom";

function Security() {
  const [currentState, setCurrentState] = useState("2FASetup");

  return (
    <div className="bg-white" style={{ minHeight: "100vh" }}>
      <BreadCrumbs
        data={{
          name: "Security",
          img: "/arrows/arrowLeft.svg",
          backurl: "/dashboard",
          info: true,
        }}
      />

      <div className="d-flex justify-content-between">
        <button
          onClick={() => setCurrentState("password")}
          className={
            "btn border w-100 text-center m-3 p-3 rounded-4 d-flex align-items-center" +
            (currentState === "password" ? " fw-600 blue100" : " fw-500")
          }
        >
          <img
            className="me-2"
            src={
              "/settings/security/" +
              (currentState === "password" ? "password.svg" : "password_o.svg")
            }
          />
          RESET PASSWORD
        </button>
        <button
          onClick={() => setCurrentState("2FASetup")}
          className={
            "btn border w-100 text-center m-3 p-3 rounded-4 d-flex align-items-center" +
            (currentState === "2FASetup" ? " fw-600 blue100" : " fw-500")
          }
        >
          <img
            className="me-2"
            src={
              "/settings/security/" +
              (currentState === "2FASetup" ? "2FASetup.svg" : "2FASetup_o.svg")
            }
          />
          TWO-STEP VERIFICATION
        </button>
        {/* <button onClick={() => setCurrentState("logoutAllDevice")} className={'btn border w-100 text-center m-3 p-3 rounded-4 d-flex align-items-center' + ((currentState === "logoutAllDevice") ? " fw-600 blue100" : " fw-500")}>
                    <img className='me-2' src={"/settings/security/" + ((currentState === "logoutAllDevice") ? "logoutAllDevice.svg" : "logoutAllDevice_o.svg")} />
                    LOG OUT OF ALL DEVICES
                </button> */}
      </div>

      {currentState === "password" ? (
        <Password />
      ) : currentState === "2FASetup" ? (
        <TwoFA />
      ) : currentState === "logoutAllDevice" ? (
        <LogoutAllDevice />
      ) : (
        <Password />
      )}
    </div>
  );
}

export default Security;
