import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../Signup/css/twoFA.css";
import { useDispatch, useSelector } from "react-redux";
import qrcode from "qrcode";
import clipboardCopy from "clipboard-copy";
import { logout } from "../../../Signup/js/logout-function.js";
import Axios from "axios";
import OtpInput from "../../../Signup/pages/OtpInput.js";
import { Blocks, ThreeDots } from "react-loader-spinner";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

Axios.defaults.withCredentials = true;

import * as actions from "../../../../@redux/action/onboardingAction.js";
import OtpCheck from "../../../Signup/js/OtpCheck.js";

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  p: "0 15px",
  width: 16,
  height: 16,
  boxShadow:
    "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: "#f5f8fa",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: "#ebf1f5",
    ...theme.applyStyles("dark", {
      backgroundColor: "#30404d",
    }),
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background: "rgba(206,217,224,.5)",
    ...theme.applyStyles("dark", {
      background: "rgba(57,75,89,.5)",
    }),
  },
  ...theme.applyStyles("dark", {
    boxShadow: "0 0 0 1px rgb(16 22 26 / 40%)",
    backgroundColor: "#394b59",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))",
  }),
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#137cbd",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&::before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
});

// Inspired by blueprintjs
function BpRadio(props) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}

function TwoFA() {
  const [type, setType] = useState("");
  const [isLoading, setLoading] = useState(false);
  const faDetails = useSelector(
    (state) => state.onboarding?.UserCognitoDetails?.userAttributes
  );
  const [email, setEmail] = useState(sessionStorage.getItem("lastemail"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let faType = faDetails.find((item) => item.name === "custom:enable_fa");
    if (faType.value) {
      setType(faType.value);
    }
  }, [faDetails]);

  const [barData, setBarData] = useState("");
  const [secretKey, setSecretKey] = useState("");

  useEffect(() => {
    const FetchQRDate = async () => {
      try {
        setLoading(true);
        const generateQR = await dispatch(actions.generateQR());
        let obj2 = JSON.parse(generateQR);

        if (obj2.barData && obj2.secretKey) {
          setLoading(false);
          setBarData(obj2.barData);
          setSecretKey(obj2.secretKey);
        } else {
          setLoading(false);
          console.log("QR data or secret key is missing.");
        }
      } catch (error) {
        setLoading(false);
        console.log("Failed to fetch QR data:", error);
      }
    };

    FetchQRDate();
  }, []);

  const copyToClipboard = () => {
    if (secretKey) {
      clipboardCopy(secretKey); // Copy the barData to clipboard
      alert("Copied to clipboard!");
    }
  };

  const [selectedValue, setSelectedValue] = useState(null);

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
  };

  const HandleVerifyMethod = async () => {
    if (!selectedValue) {
      displayMessage(
        "Please select one of the given verification methods, or kindly skip this skep...",
        "error"
      );
      return;
    }

    let params = { email, type: selectedValue };

    let obj = await dispatch(
      actions.HandleVerificationMethod(params, { setLoading })
    );
    if (obj?.ResponseMetadata?.HTTPStatusCode == 200) {
      //navigate(0);
    } else {
      displayMessage(
        "Failed to Update your 2-Step Verification Method, please try again...",
        "error"
      );
    }
  };

  const SkipVerifyMethod = async () => {
    let params = { email, type: "SKIP" };

    let obj = await dispatch(
      actions.HandleVerificationMethod(params, { setLoading })
    );
    if (obj?.ResponseMetadata?.HTTPStatusCode == 200) {
      //navigate(0);
    } else {
      displayMessage(
        "Failed to Update your 2-Step Verification Method, please try again...",
        "error"
      );
    }
  };

  const otpInputRef = useRef();
  const handleClearOtp = () => {
    if (otpInputRef.current) {
      otpInputRef.current.clearOtpInputs();
    }
  };

  const handleVerification = async () => {
    var code = sessionStorage.getItem("otp");
    var otp = (code || "").replace(/[\s-]/g, "");

    if (otp.length < 6) {
      displayMessage("Please enter a valid 2FA-code to continue...", "error");
      return;
    }

    if (otp && secretKey) {
      try {
        displayMessage("", "reset");

        setLoading(true);

        let obj = await dispatch(actions.handleVerification(otp, secretKey));
        if (obj.status === "SUCCESS") {
          dispatch(actions.FetchCognitoDetails());
          //navigate(0);
        } else {
          //toast.error(`${obj.message} Please enter correct OTP.`);
          displayMessage(`${obj.message}. Please enter correct OTP.`, "error");
          setLoading(false);
          handleClearOtp();
        }
      } catch (error) {
        displayMessage(
          `Something went wrong, please try again later.`,
          "error"
        );
        //toast.error(`Something went wrong, please try again later.`);
        setLoading(false);
        handleClearOtp();
      }
    } else {
      displayMessage(
        `Secret Key not found. There might be some configuration issues. Please sign-in again`,
        "error"
      );
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  const OpenOTPCheckModal = async () => {
    try {
      let params = { email: sessionStorage.getItem("lastemail") };
      let response = await dispatch(
        actions.SendResetOTP(params, { setLoading })
      );
      if (response?.message?.includes("successful")) {
        setModalOpen(true);
      }
    } catch (error) {
      setModalOpen(false);
      console.log("Error at OpenOTPCheckModal: ", error);
    }
  };

  const Screen1 = () => {
    return (
      <div className="d-flex flex-column justify-content-between h-100">
        <div className="header-text">
          <div
            className="twoFA-we-have-sent"
            style={{
              letterSpacing: "0",
              fontSize: "25px !important",
              color: "black",
            }}
          >
            VERIFY YOUR TWO-FACTOR AUTHENTICATION
          </div>

          <div
            style={{
              letterSpacing: "0",
              fontSize: "15px !important",
              color: "gray",
              textAlign: "center",
              padding: "25px",
            }}
          >
            Enter your 6-digit authentication code from your authenticator app
            (Google Authenticator, Authy, Twilio Auth, etc) to verify your
            identity.
          </div>
        </div>

        <div className="twoFA-frame-wrapper">
          <div className="twoFA-we-have-sent-a-verification-co-parent">
            <div className="twoFA-number-inputs">
              <OtpInput ref={otpInputRef} onEnterPress={handleVerification} />
            </div>

            <div className="twoFA-frame-parent">
              <button
                disabled={isLoading}
                className="btn btn-action w-100 rounded-pill p-m-b"
                type="button"
                onClick={handleVerification}
              >
                {isLoading ? (
                  <>
                    {" "}
                    <ThreeDots
                      visible={true}
                      height="25"
                      width="30"
                      color="black"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </>
                ) : (
                  <>VERIFY</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="twoFA-frame-wrapper">
          <div className="twoFA-frame-parent">
            <div className="twoFA-frame-container">
              <div className="twoFA-parent">
                <div className="twoFA-div6">
                  Lost your 2-factor authentication?
                </div>
                <Link
                  to="#!"
                  className="twoFA-div7"
                  onClick={OpenOTPCheckModal}
                >
                  We can help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Setup2Fa = async () => {
    var code = sessionStorage.getItem("otp");
    var otp = (code || "").replace(/[\s-]/g, "");

    if (otp.length < 6) {
      displayMessage("Please enter a valid 2FA-code to continue...", "error");
      return;
    }

    if (otp && secretKey) {
      try {
        displayMessage("", "reset");
        setLoading(true);

        let obj = await dispatch(actions.setup2Fa(otp, secretKey));

        if (obj.status === "SUCCESS") {
          setLoading(false);
          dispatch(actions.FetchCognitoDetails());
          //navigate(0);
        } else {
          setLoading(false);
          displayMessage(`${obj.message}. Please enter correct OTP.`, "error");
          //toast.error(`${obj.message}. Please enter correct OTP.`);
          handleClearOtp();
        }
      } catch (error) {
        setLoading(false);
        displayMessage(
          `Something went wrong, please try again later.`,
          "error"
        );
        handleClearOtp();
        return;
      }
    } else {
      setLoading(false);
      displayMessage(
        `Secret Key not found. There might be some configuration issues.`,
        "error"
      );
      setTimeout(() => {
        navigate("/");
      }, 1500);

      return;
    }
  };
  const Screen2 = () => {
    return (
      <>
        <div className="header-text">
          <div
            className="twoFA-we-have-sent"
            style={{
              letterSpacing: "0",
              fontSize: "25px !important",
              color: "black",
            }}
          >
            SETUP TWO-FACTOR AUTHENTICATION
          </div>

          <div
            style={{
              letterSpacing: "0",
              fontSize: "15px !important",
              color: "gray",
              textAlign: "center",
              padding: "25px",
            }}
          >
            To enable 2-factor authentication for your account{" "}
            <span style={{ color: "black", fontWeight: "600" }}>
              ({sessionStorage.getItem("lastemail")})
            </span>{" "}
            scan the following QR code with your authenticator app (Google
            Authenticator, Authy, Twilio Auth, etc).
          </div>

          <div style={{ textAlign: "center" }}>
            {isLoading ? (
              <>
                <div>
                  <Blocks
                    height="120"
                    width="120"
                    color="#fff"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    visible={true}
                  />
                </div>
              </>
            ) : (
              <>
                <QRCodeComponent barData={barData} />
              </>
            )}

            <div
              className="lable-text"
              style={{
                letterSpacing: "0",
                fontSize: "15px !important",
                color: "gray",
                textAlign: "center",
                padding: "25px",
              }}
            >
              Or copy and paste{" "}
              <Link
                style={{ fontWeight: "600", letterSpacing: "0.3px" }}
                to="#!"
                onClick={copyToClipboard}
              >
                {secretKey}
              </Link>{" "}
              into your authenticator app.
            </div>
          </div>
        </div>

        <div className="twoFA-frame-wrapper">
          <div className="twoFA-we-have-sent-a-verification-co-parent">
            <div className="twoFA-number-inputs">
              <OtpInput ref={otpInputRef} onEnterPress={Setup2Fa} />
            </div>

            <div className="twoFA-frame-parent">
              {/*<div className="inputs1 screen-2" style={{ display: "none" }} ref={errorDivRef2}>
                <div className="label-frame">
                  <div className="input-frame error-div" ref={errorFrameRef2}>
                    <div className="left-content error-message">
                      <img src={notifIcon} alt="" width={20} />
                      <span ref={errorSpanRef2}>Something went wrong, please try again later.</span>
                    </div>
                  </div>
                </div>
              </div>*/}

              <button
                disabled={isLoading}
                className="btn btn-action p-l-b rounded-pill w-100"
                type="button"
                onClick={Setup2Fa}
              >
                {isLoading ? (
                  <>
                    {" "}
                    <ThreeDots
                      visible={true}
                      height="25"
                      width="30"
                      color="black"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </>
                ) : (
                  <>SUBMIT</>
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Reset2Fa = async () => {
    setLoading(true);
    let email = sessionStorage.getItem("lastemail");
    try {
      const response = await dispatch(actions.Reset2Fa(email));
      let obj = response;
      setLoading(false);
      if (obj.status === "SUCCESS") {
        displayMessage("2FA Reset Successful", "success");
        dispatch(actions.FetchCognitoDetails());
      } else {
        displayMessage(
          "Failed to reset your 2FA details. Please try again later!",
          "error"
        );
      }
    } catch (error) {
      setLoading(false);
      displayMessage("Network error, please try again later!", "error");
    }
  };

  let errorDivRef = useRef();
  let errorFrameRef = useRef();
  let errorSpanRef = useRef();
  const [notifIcon, setNotifIcon] = useState("/error.svg");

  const displayMessage = (message, type) => {
    let errorDiv = errorDivRef.current;
    let errorFrame = errorFrameRef.current;
    let span = errorSpanRef.current;

    if (type === "success") {
      errorDiv.style.display = "flex";
      errorFrame.style.border = "1.5px solid green";
      setNotifIcon("/success.svg");
      span.innerText = message;
      span.style.color = "green";
    } else if (type === "error") {
      errorDiv.style.display = "flex";
      errorFrame.style.border = "1.5px solid brown";
      setNotifIcon("/error.svg");
      span.innerText = message;
      span.style.color = "brown";
    } else {
      errorDiv.style.display = "none";
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center px-5 py-3 w-100 mx-auto flex-column">
        <div
          className={`d-flex flex-column align-items-center justify-content-center gap-3 border shadow p-4 rounded-4 ${
            type === "N" || type === "Y" ? "w-100" : "w-75"
          }`}
        >
          <div
            className="twoFA-we-have-sent d-flex flex-column gap-3 align-items-center"
            style={{
              letterSpacing: "0",
              fontSize: "18px !important",
              color: "black",
            }}
          >
            <>
              <div
                style={{
                  background: "#add8e64a",
                  borderRadius: "50%",
                }}
              >
                <img src="/secure.svg" alt="Send email" width={50} />
              </div>
            </>
            Your Security is Our Priority at Zoqq{" "}
          </div>

          <div className="header-text">
            <div
              style={{
                letterSpacing: "0",
                fontSize: "18px !important",
                color: "gray",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "14px" }}>
                {!type || type === "NA"
                  ? "You haven't enabled any 2-Step Verification method yet. Would you like to set it up now?"
                  : type === "P"
                  ? "You currently use OTP (One-Time Password) for 2-Step Verification during login. Would you like to switch to a different method?"
                  : "You have enabled 2-Step Verification using 2FA (Two-Factor Authentication) through an app like Google Authenticator, Authy, or Twilio Auth. Would you like to switch to a different method?"}
              </span>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-start justify-content-center gap-3">
          {type === "Y" || type === "N" ? (
            <>
              <div
                className="d-flex flex-column align-items-center justify-content-center gap-3 border shadow px-5 py-4 rounded-4 mt-5 w-50"
                style={{ height: type === "N" ? "44rem" : "25rem" }}
              >
                <>
                  {type === "Y" ? (
                    <>
                      <Screen1 />
                      <div
                        className="inputs1 screen-2 w-75 mx-auto"
                        style={{ display: "none" }}
                        ref={errorDivRef}
                      >
                        <div className="label-frame">
                          <div
                            className="input-frame error-div"
                            ref={errorFrameRef}
                          >
                            <div className="left-content error-message">
                              <img src={notifIcon} alt="" width={20} />
                              <span ref={errorSpanRef}>
                                Something went wrong, please try again later.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Screen2 />
                      <div
                        className="inputs1 screen-2"
                        style={{ display: "none" }}
                        ref={errorDivRef}
                      >
                        <div className="label-frame">
                          <div
                            className="input-frame error-div"
                            ref={errorFrameRef}
                          >
                            <div className="left-content error-message">
                              <img src={notifIcon} alt="" width={20} />
                              <span ref={errorSpanRef}>
                                Something went wrong, please try again later.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/*<OtpInput ref={otpInputRef} /> */}
                  {modalOpen && (
                    <>
                      <div class="backdrop"></div>
                    </>
                  )}

                  {modalOpen && (
                    <OtpCheck
                      isLoading={isLoading}
                      close={() => setModalOpen(false)}
                      setLoading={setLoading}
                      Reset2Fa={Reset2Fa}
                      OpenOTPCheckModal={OpenOTPCheckModal}
                    />
                  )}
                </>
              </div>
            </>
          ) : (
            <></>
          )}

          <div
            className={
              "d-flex flex-column align-items-center justify-content-start gap-3 border shadow px-5 py-4 rounded-4 mt-5"
            }
            style={{
              height: type === "N" ? "44rem" : "100%",
              width: type === "N" || type === "Y" ? "w-50" : "w-75",
            }}
          >
            <>
              <div className="twoFA-frame-wrapper justify-content-start">
                <div className="twoFA-we-have-sent-a-verification-co-parent w-100">
                  <div className="twoFA-number-inputs justify-content-start">
                    <FormControl className="mt-3">
                      <FormLabel
                        id="demo-customized-radios"
                        sx={{ paddingBottom: "10px" }}
                      >
                        <span className="fw-bold text-secondary">
                          Modify your 2-Step Verification method using the
                          options below.
                        </span>
                      </FormLabel>
                      <RadioGroup
                        value={selectedValue} // Controlled component
                        onChange={handleRadioChange} // onChange event handler
                        aria-labelledby="demo-customized-radios"
                        name="customized-radios"
                      >
                        <FormControlLabel
                          value="OTP"
                          control={<BpRadio />}
                          label={
                            <span
                              className="fw-500 opacity-50"
                              style={{ fontSize: "14px !important" }}
                            >
                              OTP (One-Time Password) via registered email.
                            </span>
                          }
                          disabled={type === "P" ? true : false}
                        />
                        <FormControlLabel
                          value="2FA"
                          control={<BpRadio />}
                          label={
                            <span
                              className="fw-500 opacity-50"
                              style={{ fontSize: "14px !important" }}
                            >
                              2FA via authenticator app (Google Authenticator,
                              Authy, etc).
                            </span>
                          }
                          disabled={type === "N" || type === "Y" ? true : false}
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>

                  <div className="twoFA-frame-parent w-100">
                    <button
                      disabled={isLoading}
                      className="btn btn-action p-l-b rounded-pill w-100 text-uppercase"
                      type="button"
                      onClick={HandleVerifyMethod}
                    >
                      {isLoading ? (
                        <>
                          {" "}
                          <ThreeDots
                            visible={true}
                            height="25"
                            width="30"
                            color="black"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        </>
                      ) : (
                        <>SUBMIT</>
                      )}
                    </button>

                    {!type || type === "NA" ? (
                      <></>
                    ) : (
                      <>
                        <div className="d-flex align-items-center justify-content-center gap-2 w-100 my-3">
                          <div className="w-100 border border-top"></div>
                          <div>OR</div>
                          <div className="w-100 border border-top"></div>
                        </div>

                        <a
                          href="#!"
                          className="text-primary fw-600 text-center w-100 pe-auto text-decoration-none"
                          onClick={SkipVerifyMethod}
                        >
                          Disable 2-Step Verification ≫
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
}

function QRCodeComponent({ barData }) {
  const [qrCodeUrl, setQRCodeUrl] = useState("");

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const dataUri = await qrcode.toDataURL(barData);
        setQRCodeUrl(dataUri);
      } catch (err) {}
    };

    generateQRCode();
  }, [barData]);

  return <>{qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" width={200} />}</>;
}

export default TwoFA;
