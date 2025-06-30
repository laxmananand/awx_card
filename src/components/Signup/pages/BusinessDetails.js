import React, { useEffect, useState, useRef } from "react";
import * as functions from "../js/business-details.js";
import ContentLoader from "react-content-loader";
import { useDispatch, useSelector } from "react-redux";
import { openLoader, closeLoader } from "../../../@redux/features/common.js";
import Select from "react-select";
import { logout } from "../js/logout-function.js";
import "../css/businessDetails.css";
import Axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import * as actions from "../../../@redux/action/onboardingAction.js";

Axios.defaults.withCredentials = true;

const customStyles2 = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "none" : "none",
    boxShadow: state.isFocused ? "none" : "none",
  }),
  option: (provided, state) => ({
    ...provided,
    fontFamily: "DM Sans",
    justifyContent: "start !important",
    display: "flex !important",
    alignItems: "center !important",
    fontSize: "15px !important",
    padding: "5px 20px !important",
    gap: "15px !important",
  }),
  menu: (provided, state) => ({
    ...provided,
  }),
};

export default function BusinessDetails() {
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [region, setRegion] = useState("");

  const [countryName, setCountryName] = useState(null);

  const [notifIcon, setNotifIcon] = useState("error.svg");

  const errorDivRef = useRef();
  const errorFrameRef = useRef();
  const errorSpanRef = useRef();

  const navigate = useNavigate();

  const displayMessage = (message, type) => {
    let errorDiv = errorDivRef.current;
    let errorFrame = errorFrameRef.current;
    let span = errorSpanRef.current;

    if (type === "success") {
      errorDiv.style.display = "flex";
      errorFrame.style.border = "1.5px solid green";
      setNotifIcon("success.svg");
      span.innerText = message;
      span.style.color = "green";
    } else if (type === "error") {
      errorDiv.style.display = "flex";
      errorFrame.style.border = "1.5px solid brown";
      setNotifIcon("error.svg");
      span.innerText = message;
      span.style.color = "brown";
    } else {
      errorDiv.style.display = "none";
    }
  };

  const listCountry = useSelector((state) => state.onboarding?.ListCountryZOQQ);

  // const options = countryList.map((flag) => ({
  //   value: flag.ISOcc_2char,
  //   label: (
  //     <div>
  //       <img src={`/flags/${flag.ISOcc_2char.toLowerCase()}.svg`} alt="" width={30} style={{ marginRight: "10px" }} />
  //       {`${flag.country_name}`}
  //     </div>
  //   ),
  // }));

  const handleBusinessDetails = async () => {
    if (!fullName && !businessName && !countryName) {
      displayMessage("Please fill the form to continue.", "error");
    } else if (!fullName) {
      displayMessage("Person's Name must not be empty.", "error");
    } else if (!businessName) {
      displayMessage("Business Name must not be empty.", "error");
    } else if (!countryName) {
      displayMessage("Business Registered Country must not be empty.", "error");
    } else if (region == "US" || region == "EU" || region == "AU") {
      displayMessage(
        "Registration from your selected country is not available at the moment. Please select another registered country.",
        "error"
      );
    } else {
      try {
        setLoading(true);

        let params = {
          email: sessionStorage.getItem("lastemail"),
          personName: fullName,
          businessName: businessName,
          countryName: countryName,
          type: "insert",
        };

        let obj = await dispatch(actions.HandleBusinessDetails(params));

        setLoading(false);
        if (obj.ResponseMetadata?.HTTPStatusCode == 200) {
          navigate("/account-setup");
        } else {
          setLoading(false);
          if (obj.errorCode) {
            let message = obj.msg || obj.message;
            let errorMessage = message.split("operation: ")[1];
            displayMessage(errorMessage, "error");
          } else {
            displayMessage(
              "Something went wrong, please try again later!",
              "error"
            );
          }
        }
      } catch (error) {
        setLoading(false);
        displayMessage(
          "Something went wrong, please try again later!",
          "error"
        );
      }
    }
  };

  const goBack = () => {
    window.history.back();
  };

  const handleCountryCodeChange = (selectedOption) => {
    setCountryCodeValues(selectedOption);
  };

  const restrictInput = (value) => {
    return value.replace(/[^a-zA-Z\s]/g, "").slice(0, 35);
  };

  const restrictInputAlphaNumeric = (value) => {
    return value.replace(/[^a-zA-Z0-9\s]/g, "").slice(0, 35);
  };

  return (
    <>
      <div className="biz-sign-up">
        <div className="biz-f-r-a-m-e-a-parent">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <b style={{ color: "#327E9D" }} onClick={goBack}>
                {" "}
                <img loading="lazy" alt="" src="linear-iconsarrow-left.svg" />
                Back
              </b>
            </div>
          </div>
          <div className="biz-f-r-a-m-e-a">
            <div className="biz-progress">
              <img
                className="biz-progress-child"
                loading="lazy"
                alt=""
                src="line-26.svg"
              />

              <img
                className="biz-progress-item"
                loading="lazy"
                alt=""
                src="line-26.svg"
              />

              <img
                className="biz-progress-inner"
                loading="lazy"
                alt=""
                src="line-27.svg"
              />
            </div>
          </div>
          <div className="biz-complete">1/3 Complete</div>
        </div>

        <div className="biz-frame-parent main-div">
          <div className="biz-frame-wrapper">
            <form className="biz-business-details-parent">
              <h1 className="biz-business-details d-flex flex-column text-center gap-2">
                <span
                  style={{
                    fontSize: "23px",
                    fontWeight: 600,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Tell Us About Your Business
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    letterSpacing: "-0.5px",
                    opacity: "50%",
                  }}
                >
                  Let's get started with some details:{" "}
                </span>
              </h1>
              <div className="biz-inputs">
                <div className="biz-inputs1">
                  <div className="biz-label-frame">
                    <div className="biz-label">Label</div>
                    <div className="biz-input-frame">
                      <input
                        maxLength={60}
                        className="biz-left-content"
                        placeholder="Applicant's Full name as per ID"
                        type="text"
                        value={fullName}
                        onInput={(e) => {
                          const restrictedValue = restrictInput(e.target.value);
                          setFullName(restrictedValue);
                        }}
                      />

                      <div className="biz-right-content">
                        <div className="biz-add-on">Add-on</div>
                        <img className="biz-linear-iconseye-slash" alt="" />

                        <img className="biz-payments-visa" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="biz-inputs2">
                  <div className="biz-label-frame1">
                    <div className="biz-label1">Label</div>
                    <div className="biz-input-frame1">
                      <input
                        maxLength={60}
                        className="biz-left-content1"
                        placeholder="Business Name"
                        type="text"
                        value={businessName}
                        onInput={(e) => {
                          const restrictedValue = restrictInputAlphaNumeric(
                            e.target.value
                          );
                          setBusinessName(restrictedValue);
                        }}
                      />

                      <div className="biz-right-content1">
                        <div className="biz-add-on1">Add-on</div>
                        <img className="biz-linear-iconseye-slash1" alt="" />
                        <img className="biz-payments-visa1" alt="" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="biz-dropdown">
                  <div className="biz-label-frame2">
                    <div className="biz-label2">Label</div>
                    <div className="biz-input-frame2">
                      <div className="biz-left-content2">
                        <select
                          id="country"
                          className="country-select"
                          value={countryName}
                          onChange={(e) => setCountryName(e.target.value)}
                        >
                          <option value="">Business Registered Country</option>
                          {listCountry &&
                            listCountry.map((country, index) => (
                              <option
                                key={index}
                                value={country.ISOcc_2char}
                                data-region={country.region}
                              >
                                {country.country_name}
                              </option>
                            ))}
                        </select>

                        {/* <Select
                  name="countryCode"
                  id="countryCode"
                  className=""
                  options={options}
                  styles={customStyles2}
                  value={countryCodeValues}
                  onChange={handleCountryCodeChange}
                  ref={countryCodeRef}
                  placeholder="Business Registered Country..."
                ></Select> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="inputs1"
                style={{ display: "none" }}
                ref={errorDivRef}
              >
                <div className="label-frame">
                  <div className="input-frame error-div" ref={errorFrameRef}>
                    <div className="left-content error-message">
                      <img src={notifIcon} alt="" width={20} />
                      <span ref={errorSpanRef}>
                        Something went wrong, please try again later.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                disabled={isLoading}
                className="biz-text-button"
                type="button"
                onClick={handleBusinessDetails}
              >
                <div className="biz-linear-iconsplaceholder1">
                  <div className="biz-vector1"></div>
                </div>
                {isLoading ? (
                  <>
                    <PulseLoader size={12} />
                  </>
                ) : (
                  <>
                    <b className="biz-button">Continue</b>
                  </>
                )}

                <div className="biz-linear-iconsplaceholder2">
                  <div className="biz-vector2"></div>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
