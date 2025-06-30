import React, { useEffect, useState, useRef } from "react";
import * as functions from "../js/sign-up-verification.js";
import { logout } from "../js/logout-function.js";
import "../css/signUpVerification.css";
import { useNavigate } from "react-router-dom";
import { closeLoader, openLoader } from "../../../@redux/features/common.js";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import CryptoJS from "crypto-js";
import OtpInput from "../pages/OtpInput.js";
import { PulseLoader } from "react-spinners";
import * as actions from "../../../@redux/action/onboardingAction.js";
import { setShowSidebar } from "../../../@redux/features/auth.js";
import { CustomOTP } from "./../../structure/NewStructures/CustomOTP";

Axios.defaults.withCredentials = true;

export default function Verification() {
  const [notifIcon, setNotifIcon] = useState("error.svg");
  const [email, setEmail] = useState(sessionStorage.getItem("lastemail"));
  const [otp, setOtp] = useState("");

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  useEffect(() => {
    if (!email) {
      logout();
    }
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userCognitoDetails = useSelector(
    (state) => state.onboarding.UserCognitoDetails
  );
  useEffect(() => {
    if (userCognitoDetails?.UserStatus === "CONFIRMED") {
      dispatch(setShowSidebar(false));
      navigate("/2FA");
    }
  });

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
  const errorSpanRef = useRef();
  const errorDivRef = useRef();
  const errorFrameRef = useRef();

  const [isLoading, setLoading] = useState(false);

  const now = new Date();
  const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}:${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}:${now.getFullYear().toString().slice(-2)}:${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const otpInputRef = useRef();

  const handleClearOtp = () => {
    if (otpInputRef.current) {
      otpInputRef.current.clearOtpInputs();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleVerification();
    }
  };

  const restrictInput = (event) => {
    const input = event.target;

    let value = input.value;

    if (value.length > 1) {
      value = value.slice(0, 1);
      input.value = value;
    }
  };

  let url = window.location;
  let params = url?.search;
  let query = params?.split("?");

  // Example of getting a specific parameter value
  let queryName = query[1];

  const handleVerification = async () => {
    var code = otp;
    var email = sessionStorage.getItem("lastemail");
    var verificationCode = (code || "").replace(/[\s-]/g, "");

    if (!code) {
      displayMessage("Please enter a valid code to continue", "error");
      return;
    } else if (verificationCode.length < 6) {
      displayMessage("Please enter a valid code to continue", "error");
      return;
    } else if (!email) {
      displayMessage(
        "Oops! We couldn't find your email. Please sign-in again.",
        "error"
      );
      return;
    } else {
      displayMessage("", "reset");

      setLoading(true);

      let obj = await dispatch(actions.VerifyUser(email, verificationCode));

      if (obj.errorCode) {
        handleClearOtp();

        setLoading(false);

        switch (obj.errorCode) {
          case "CodeMismatchException":
            displayMessage(
              "Invalid verification code. Please enter the correct verification code and try again.",
              "error"
            );
            break;
          case "ResourceNotFoundException":
            displayMessage(
              "There is some configuration issues, please contact your admin",
              "error"
            );
            break;
          case "NotAuthorizedException":
            let errorMessage = obj.msg.split("operation:")[1].trim();
            displayMessage(errorMessage, "error");
            if (
              errorMessage ===
              "User cannot be confirmed. Current status is CONFIRMED"
            ) {
              setTimeout(() => {
                window.location.href = "/2fa";
              }, 1500);
            }
            break;

          case "ExpiredCodeException":
            let message = obj.msg.split("operation:")[1].trim();
            displayMessage(message, "error");
            break;

          default:
            displayMessage(
              "Something went wrong, please try again later.",
              "error"
            );
        }
      } else if (obj.ResponseMetadata.HTTPStatusCode === 200) {
        if (queryName === "reset-password") {
          window.location.href = `/forgotpassword?email=${email}`;
        } else {
          CreateSession(email, obj?.ResponseMetadata?.RequestId);
        }
      } else {
        displayMessage(
          "Something went wrong, please try again later.",
          "error"
        );
      }
    }
  };

  const CreateSession = async (email, accessToken) => {
    //Encrypt session data
    const jsonData = {
      status: "SUCCESS",
      email: email,
      timestamp: formattedDateTime,
      sessionId: accessToken,
    };
    let secretKey = null;

    // Convert JSON object to string
    const jsonString = JSON.stringify(jsonData);

    try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/CommonRoutes/fetchsecretkey"
      );
      let obj = response.data;

      setLoading(false);
      secretKey = obj.secretKey;

      // Encrypt JSON string
      const encryptedData = CryptoJS.AES.encrypt(
        jsonString,
        secretKey
      ).toString();
      sessionStorage.setItem("_session", encryptedData);

      navigate("/2fa");
    } catch (error) {
      displayMessage("Something went wrong, please try again later.", "error");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  const moveToLogin = () => {
    navigate("/");
  };

  const moveBack = () => {
    window.history.back();
  };

  const ResendConfirmation = async () => {
    let email = sessionStorage.getItem("lastemail");
    if (!email) {
      displayMessage(
        "Oops! We couldn't find your email. Please sign-in again.",
        "error"
      );
    } else {
      displayMessage("", "reset");
      setLoading(true);

      let obj = await dispatch(actions.ResendConfirmation(email));

      setLoading(false);

      if (obj.ResponseMetadata.HTTPStatusCode == 200) {
        displayMessage(
          "A new verification code has been sent to your email address. Please check your inbox.",
          "success"
        );
      } else if (obj.errorCode) {
        let message = obj.msg || obj.message;
        let errorMessage = message.split("operation: ")[1];

        displayMessage(errorMessage, "error");
      } else {
        displayMessage(
          "Something went wrong, verification code could not be sent. Please try again later.",
          "error"
        );
      }
    }
  };

  return (
    <>
      <div className="ver-text-button-parent">
        <div className="ver-text-button main-div">
          <img className="ver-linear-iconsarrow-left" alt="" />

          {/* <img className="ver-linear-iconsarrow-left1" loading="lazy" alt="" src="linear-iconsarrow-left.svg" />

          <div className="ver-more-wrapper">
            <b className="ver-more" onClick={moveBack}>
              Back
            </b>
          </div> */}
          <div className="ver-linear-iconsplaceholder">
            <div className="ver-vector"></div>
          </div>
        </div>
        <div className="ver-frame-wrapper main-div">
          <div className="ver-we-have-sent-a-verification-co-parent">
            <span className="ver-we-have-sent">
              We have sent a verification code to your email:{" "}
              <span
                style={{
                  fontSize: "22px",
                  color: "var(--sea-70)",
                  fontWeight: 500,
                }}
              >
                ({`${sessionStorage.getItem("lastemail")}`})
              </span>
            </span>
            <div className="ver-number-inputs">
              <CustomOTP
                otp={otp}
                handleChange={handleChange}
                onEnterPress={handleVerification}
              />
            </div>
            <div className="ver-frame-parent">
              <div className="ver-frame-container">
                <div className="ver-parent">
                  <div className="ver-div6">Didn’t get the code?</div>
                  <a
                    href="#!"
                    className="ver-div7"
                    onClick={ResendConfirmation}
                  >
                    Resend code
                  </a>
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
                className="ver-text-button1"
                type="button"
                onClick={handleVerification}
                disabled={isLoading}
              >
                <div className="ver-linear-iconsplaceholder1">
                  <div className="ver-vector1"></div>
                </div>

                {isLoading ? (
                  <>
                    <PulseLoader size={12} />
                  </>
                ) : (
                  <>
                    <b className="ver-button">Confirm</b>
                  </>
                )}

                <div className="ver-linear-iconsplaceholder2">
                  <div className="ver-vector2"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="ver-frame-div main-div">
          <div className="ver-frame-group">
            <div className="ver-already-have-an-account-wrapper">
              <b className="ver-already-have-an">Already Have an Account?</b>
            </div>
            <button
              className="ver-text-button2"
              type="button"
              onClick={moveToLogin}
            >
              <img className="ver-linear-iconsarrow-left2" alt="" />

              <img className="ver-linear-iconsarrow-left3" alt="" />

              <b className="ver-more1">Sign In</b>
              <div className="ver-linear-iconsplaceholder3">
                <div className="ver-vector3"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
