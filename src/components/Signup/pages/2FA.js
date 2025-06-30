import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";
import ContentLoader from "react-content-loader";
import Select from "react-select";
import { toast } from "react-toastify";
import "../css/twoFA.css";
import { useDispatch } from "react-redux";
import { openLoader, closeLoader } from "../../../@redux/features/common.js";
import * as functions from "../js/twoFA-function.js";
import qrcode from "qrcode";
import clipboardCopy from "clipboard-copy";
import { logout } from "../js/logout-function.js";
import Swal from "sweetalert2";
import Axios from "axios";
import OtpInput from "./OtpInput.js";
import { ThreeDots } from "react-loader-spinner";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { CustomOTP } from "../../structure/NewStructures/CustomOTP.js";

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

Axios.defaults.withCredentials = true;

import * as actions from "../../../@redux/action/onboardingAction";
import OtpCheck from "../js/OtpCheck.js";

export const twoFactorAuth = () => {
  const [isLoading, setLoading] = useState(false);
  const [active2fa, setActive2fa] = useState(false);
  const [barData, setBarData] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [qrCodeUrl, setQRCodeUrl] = useState("");
  const [screenLoader, setScreenLoader] = useState(true);

  const [notifIcon, setNotifIcon] = useState("error.svg");

  const errorSpanRef = useRef(null);
  const errorDivRef = useRef(null);
  const errorFrameRef = useRef(null);

  const errorSpanRef2 = useRef(null);
  const errorDivRef2 = useRef(null);
  const errorFrameRef2 = useRef(null);

  const Submit2FaButtonRef = useRef();

  const now = new Date();
  const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}:${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}:${now.getFullYear().toString().slice(-2)}:${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputFields, setInputFields] = useState([]);

  const otpInputRef = useRef();

  const handleClearOtp = () => {
    if (otpInputRef.current) {
      otpInputRef.current.clearOtpInputs();
    }
  };

  const displayMessage = (message, type) => {
    let errorDiv = errorDivRef.current || errorDivRef2.current;
    let errorFrame = errorFrameRef.current || errorFrameRef2.current;
    let span = errorSpanRef.current || errorSpanRef2.current;

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

  const getcognitouserinfo = async () => {
    let email = sessionStorage.getItem("lastemail");

    if (!email) {
      return JSON.stringify({
        status: "EmailNotFoundException",
        message: "Email not found, please sign-in again!",
      });
    }

    try {
      let obj = await dispatch(actions.FetchCognitoDetails());

      if (obj.ResponseMetadata.HTTPStatusCode == 200 && obj.userAttributes) {
        let userAttr = obj.userAttributes;
        let enable_fa = "";
        let fa_secretKey = "";

        for (var i = 0; i < userAttr.length; i++) {
          let item = userAttr[i];

          if (item.name == "custom:fa_secretkey") {
            fa_secretKey = item.value;
          }

          if (item.name == "custom:enable_fa") {
            enable_fa = item.value;
          }
        }

        if (enable_fa && enable_fa === "P") {
          return JSON.stringify({
            faSecretKey: fa_secretKey,
            enable_fa: enable_fa,
            status: "SUCCESS",
          });
        } else if (enable_fa && enable_fa === "N") {
          return JSON.stringify({
            faSecretKey: fa_secretKey,
            enable_fa: enable_fa,
            status: "SUCCESS",
          });
        } else if (enable_fa && enable_fa === "Y") {
          return JSON.stringify({
            faSecretKey: fa_secretKey,
            enable_fa: enable_fa,
            status: "SUCCESS",
          });
        } else if (enable_fa && enable_fa === "NA") {
          return JSON.stringify({
            faSecretKey: fa_secretKey,
            enable_fa: enable_fa,
            status: "SUCCESS",
          });
        } else {
          return JSON.stringify({
            message: "Two-factor information not available",
            status: "NO_INFORMATION_AVAILABLE",
          });
        }
      } else if (obj.errorCode) {
        return JSON.stringify({
          message: obj.msg,
          status: "BAD_REQUEST",
        });
      }
    } catch (error) {
      return JSON.stringify({
        message: "Something went wrong: " + error,
        status: "BAD_REQUEST",
      });
    }
  };

  const FetchDetails = async () => {
    var lastemail = sessionStorage.getItem("lastemail");

    if (lastemail) {
      try {
        let obj = await dispatch(actions.FetchDetails());

        //setLoading(false);

        if (obj.status !== "BAD_REQUEST") {
          //Redirect to dashboard page if form filling is done
          navigate("/dashboard");
        } else if (obj.status === "BAD_REQUEST") {
          //Redirect to account setup page if form filling has not been started
          navigate("/account-setup");
        }
      } catch (error) {
        setTimeout(() => {
          navigate("/");
        }, 1500);

        return;
      }
    } else {
      setTimeout(() => {
        navigate("/");
      }, 1500);

      return;
    }
  };

  const [showVerificationType, setShowVerificationType] = useState(true);

  useEffect(() => {
    const setPage = async () => {
      setLoading(true);

      const twoFaDetails = await getcognitouserinfo();
      let obj = JSON.parse(twoFaDetails);

      //Generate the QR before anything else
      const generateQR = await dispatch(actions.generateQR());
      let obj2 = JSON.parse(generateQR);
      if (obj2.barData && obj2.secretKey) {
        setBarData(obj2.barData);
        setSecretKey(obj2.secretKey);
      } else {
      }

      //When 2FA is active for a user
      if (obj.status === "SUCCESS") {
        setShowVerificationType(false);
        if (obj.enable_fa === "P") {
          setScreenLoader(false);
          setLoading(false);

          setActive2fa("P");
        } else if (obj.enable_fa === "N") {
          setScreenLoader(false);
          setLoading(false);

          setActive2fa(false);
        } else if (obj.enable_fa === "Y") {
          setScreenLoader(false);
          setLoading(false);
          setActive2fa(true);
          setSecretKey(obj.faSecretKey);
        } else if (obj.enable_fa === "NA") {
          GetCognitoUserInfo2();
        }
      } else {
        setShowVerificationType(true);
        setLoading(false);
        setScreenLoader(false);

        //When 2FA is in-active for a user
        if (obj.status === "NO_INFORMATION_AVAILABLE") {
        } else {
          if (obj.status === "EmailNotFoundException") {
            let msg = obj?.msg || obj?.message;
            let split =
              msg?.split("operation: ")[1] ||
              "Something went wrong, please sign-in again.";
            displayMessage(split, "error");

            setTimeout(() => {
              //logout();
            }, 1500);
          }
        }

        setActive2fa(false);
      }
    };
    setPage();
  }, []);

  const copyToClipboard = () => {
    if (secretKey) {
      clipboardCopy(secretKey); // Copy the barData to clipboard
      alert("Copied to clipboard!");
    }
  };

  const Reset2Fa = async () => {
    setLoading(true);
    let email = sessionStorage.getItem("lastemail");
    try {
      const response = await dispatch(actions.Reset2Fa(email));
      let obj = response;
      setLoading(false);
      if (obj.status === "SUCCESS") {
        // Swal.fire({
        //   icon: "success",
        //   title: "2FA Reset Successful",
        //   text: "Please click OK to continue.",
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     navigate(0);
        //   }
        // });
        displayMessage("2FA Reset Successful", "success");
        setTimeout(() => {
          navigate(0);
        }, 1500);
      } else {
        // Swal.fire({
        //   icon: "error",
        //   title: "Failed to reset your 2FA details. Please try again later! ",
        //   text: "Error: " + obj.message,
        // });
        displayMessage(
          "Failed to reset your 2FA details. Please try again later!",
          "error"
        );
      }
    } catch (error) {
      setLoading(false);
      // Swal.fire({
      //   icon: "error",
      //   title: "INTERNAL SERVER ERROR",
      //   text: "Something went wrong, please try again later!",
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     logout();
      //   }
      // });
      displayMessage("Network error, please try again later!", "error");
      setTimeout(() => {
        navigate(0);
      }, 1500);
    }
  };

  const moveBack = () => {
    window.history.back();
  };

  const restrictInput = (event) => {
    const input = event.target;

    let value = input.value;

    if (value.length > 1) {
      value = value.slice(0, 1);
      input.value = value;
    }
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
          GetCognitoUserInfo2();
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

  const GetCognitoUserInfo2 = async () => {
    let email = sessionStorage.getItem("lastemail");
    if (email) {
      setLoading(true);

      try {
        let obj = await dispatch(actions.FetchCognitoDetails());
        if (obj.ResponseMetadata.HTTPStatusCode == 200 && obj.userAttributes) {
          let userAttr = obj.userAttributes;
          let name = "";
          let phone_number = "";
          let country_code = "";
          let country_name = "";
          let business_name = "";
          let enable_fa = "";
          let fa_secretKey = "";

          for (var i = 0; i < userAttr.length; i++) {
            let item = userAttr[i];
            if (item.name == "custom:contactName") {
              name = item.value;
            }

            if (item.name == "custom:countryName") {
              country_name = item.value;
            }

            if (item.name == "custom:businessName") {
              business_name = item.value;
            }

            if (item.name == "phone_number") {
              phone_number = item.value;
            }

            if (item.name == "custom:isd_code") {
              country_code = item.value;
            }

            if (item.name == "custom:fa_secretkey") {
              fa_secretKey = item.value;
            }

            if (item.name == "custom:enable_fa") {
              enable_fa = item.value;
            }
          }

          sessionStorage.setItem("contactName", name);
          sessionStorage.setItem("region", country_name);

          if (enable_fa && enable_fa === "NA") {
            if (!name || !business_name || !country_name) {
              setLoading(false);
              navigate("/business-details");
            } else {
              FetchDetails();
            }
          } else if (enable_fa && enable_fa === "P") {
            setLoading(false);
            if (!name || !business_name || !country_name) {
              setLoading(false);
              navigate("/business-details");
            } else {
              FetchDetails();
            }
          } else if (enable_fa && enable_fa === "N" && !fa_secretKey) {
            setLoading(false);
            displayMessage(
              "Failed to update your authenticator details, please try again!",
              "error"
            );

            setTimeout(() => {
              navigate(0);
            }, 1000);

            return;
          } else if (name == "" && business_name == "") {
            setLoading(false);
            navigate("/business-details");
          } else {
            FetchDetails();
          }
        } else if (obj.errorCode) {
          setLoading(false);
          let msg = obj.msg || obj.message;
          let msgSplit = msg.split("operation:");
          let errorMsg = msgSplit[1];

          displayMessage(`Failed to update 2FA Details. ${errorMsg}`, "error");
          setTimeout(() => {
            navigate(0);
          }, 1500);
          return;
        }
      } catch (error) {
        setLoading(false);

        displayMessage(
          `Something went wrong, please try again later!`,
          "error"
        );
        return;
      }
    } else {
      displayMessage(`Email not found, please sign-in again`, "error");

      setTimeout(() => {
        navigate("/");
      }, 1500);

      return;
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
          GetCognitoUserInfo2();
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

  const UpdateSession = async (email) => {
    let loginStatus = "SUCCESS";
    try {
      const requestBody = {
        email: email,
        loginStatus: loginStatus,
        timestamp: formattedDateTime,
      };

      getcognitouserinfo2();
    } catch (error) {}
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
      <div
        style={{
          display: "flex",
          gridGap: "40px",
          marginTop: "40px",
          flexDirection: "column",
        }}
      >
        <div className="header-text" style={{ padding: "30px" }}>
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
              {/* <div className="inputs1 screen-1" style={{ display: "none" }} ref={errorDivRef}>
                <div className="label-frame">
                  <div className="input-frame error-div" ref={errorFrameRef}>
                    <div className="left-content error-message">
                      <img src={notifIcon} alt="" width={20} />
                      <span ref={errorSpanRef}>Something went wrong, please try again later.</span>
                    </div>
                  </div>
                </div>
              </div> */}

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
                  <>Verify</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="twoFA-frame-wrapper">
          <div className="twoFA-frame-parent">
            <div className="twoFA-frame-container">
              <div className="twoFA-parent two-fa-lost">
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
  const Screen2 = () => {
    return (
      <>
        <div className="header-text" style={{ padding: "30px" }}>
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
            <QRCodeComponent barData={barData} />
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
                  <>Submit</>
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const [getOtp, setGetOtp] = useState(true);
  const [email, setEmail] = useState(sessionStorage.getItem("lastemail"));

  const GetOtp = async () => {
    try {
      let params = { email };
      let response = await dispatch(
        actions.SendResetOTP(params, { setLoading })
      );
      if (response?.message?.includes("successful")) {
        displayMessage("OTP sent to the registered email...", "success");
        setGetOtp(false);
      }
    } catch (error) {
      setGetOtp(true);
      console.log("Error at GetOtp: ", error);
      displayMessage("Failed to send OTP to the registered email...", "error");
    }
  };

  const Screen3 = () => {
    const [getOtpCode, setGetOtpCode] = useState("");
    const handleGetOTPchange = (newValue) => {
      setGetOtpCode(newValue);
    };

    const VerifyOtp = async () => {
      let otp = getOtpCode;

      if (!email) {
        displayMessage("Email not found, please sign-in again!", "error");
        return;
      }

      if (!otp) {
        displayMessage("Please enter your OTP to continue!", "error");
        return;
      }

      if (otp.length < 6) {
        displayMessage("Entered OTP must be 6-digits in length!", "error");
        return;
      }

      try {
        let params = {
          email,
          otp,
        };
        let response = await dispatch(
          actions.VerifyResetOTP(params, { setLoading })
        );
        if (response?.message?.includes("successful")) {
          displayMessage(
            "OTP verified successfully... Signing you in...",
            "success"
          );
          GetCognitoUserInfo2();
        } else {
          displayMessage(
            response?.message + ". Re-send code and try again...",
            "error"
          );

          handleClearOtp();
        }
      } catch (error) {
        displayMessage("Something went wrong: INTERNAL_SERVER_ERROR", "error");
        console.log("Error at VerifyOtp: ", error);
        handleClearOtp();
      }
    };
    return (
      <>
        <div className="header-text" style={{ padding: "30px" }}>
          <div
            className="twoFA-we-have-sent d-flex flex-column gap-3 align-items-center"
            style={{
              letterSpacing: "0",
              fontSize: "25px !important",
              color: "black",
            }}
          >
            {getOtp ? (
              <>
                <div
                  style={{
                    background: "#add8e64a",
                    borderRadius: "50%",
                    padding: "20px",
                  }}
                >
                  <img src="/send-email.svg" alt="Send email" width={65} />
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    background: "#add8e64a",
                    borderRadius: "50%",
                    padding: "20px",
                  }}
                >
                  <img src="/auth/otp-icon.png" alt="OTP icon" width={80} />
                </div>
              </>
            )}
            OTP Verification
          </div>

          <div
            className="otp-heading"
            style={{
              letterSpacing: "0",
              fontSize: "18px !important",
              color: "gray",
              textAlign: "center",
              padding: "25px 110px",
            }}
          >
            {getOtp ? (
              <span style={{ fontSize: "16px" }}>
                We will send you an <strong>OTP (One-Time Password)</strong> on
                this email address
              </span>
            ) : (
              <span style={{ fontSize: "16px" }}>
                Enter the OTP (One-Time Password) send to{" "}
                <strong>{sessionStorage.getItem("lastemail")}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="twoFA-frame-wrapper">
          <div className="twoFA-we-have-sent-a-verification-co-parent">
            <div className="twoFA-number-inputs">
              {getOtp ? (
                <>
                  <div className="w-100 d-flex justify-content-start align-items-center gap-2 border-bottom pb-3 px-5 get-otp-input-div">
                    <img src="/email.png" alt="" width={35} />
                    <input
                      type="text"
                      defaultValue={email}
                      readOnly
                      className="get-otp-input"
                    />
                  </div>
                </>
              ) : (
                <>
                  <CustomOTP
                    otp={getOtpCode}
                    handleChange={handleGetOTPchange}
                    onEnterPress={VerifyOtp}
                  />
                </>
              )}
            </div>

            <div className="twoFA-frame-parent w-100">
              {getOtp ? (
                <></>
              ) : (
                <div className="d-flex gap-2 align-items-center justify-content-center w-100">
                  Didn't receive the OTP?{" "}
                  <a href="#!" onClick={GetOtp} className="fw-bold">
                    RESEND OTP
                  </a>
                </div>
              )}
              <button
                disabled={isLoading}
                className="btn btn-action p-l-b rounded-pill w-100"
                type="button"
                onClick={getOtp ? GetOtp : VerifyOtp}
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
                  <>{getOtp ? <>Get OTP</> : <>Verify OTP</>}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const [selectedValue, setSelectedValue] = useState(null);

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
  };

  const Screen4 = () => {
    return (
      <>
        <div className="header-text" style={{ padding: "30px" }}>
          <div
            className="twoFA-we-have-sent d-flex flex-column gap-3 align-items-center"
            style={{
              letterSpacing: "0",
              fontSize: "25px !important",
              color: "black",
            }}
          >
            <>
              <div
                style={{
                  background: "#add8e64a",
                  borderRadius: "50%",
                  padding: "20px",
                }}
              >
                <img src="/secure.svg" alt="Send email" width={45} />
              </div>
            </>
            Keep Your Account Secure
          </div>

          <div
            className="two-fa-header"
            style={{
              letterSpacing: "0",
              fontSize: "18px !important",
              color: "gray",
              textAlign: "center",
              padding: "25px 120px",
            }}
          >
            <span style={{ fontSize: "14px" }}>
              At Zoqq, we recommend enabling 2-Step Verification for enhanced
              account security.
            </span>
          </div>
        </div>

        <div className="twoFA-frame-wrapper">
          <div className="twoFA-we-have-sent-a-verification-co-parent">
            <div className="twoFA-number-inputs justify-content-start">
              <FormControl>
                <FormLabel id="demo-customized-radios">
                  <span className="fw-bold text-secondary">
                    Which method would you like to use?
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
                  />
                  <FormControlLabel
                    value="2FA"
                    control={<BpRadio />}
                    label={
                      <span
                        className="fw-500 opacity-50"
                        style={{ fontSize: "14px !important" }}
                      >
                        2FA via authenticator app (Google Authenticator, Authy,
                        etc).
                      </span>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </div>

            <div className="twoFA-frame-parent w-100">
              <button
                disabled={isLoading}
                className="btn btn-action p-l-b rounded-pill w-100"
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
                  <>Submit</>
                )}
              </button>

              <a
                href="#!"
                className="text-primary fw-600 text-center w-100 pe-auto text-decoration-none"
                onClick={SkipVerifyMethod}
              >
                Skip 2-Step Verification ≫
              </a>
            </div>
          </div>
        </div>
      </>
    );
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
      setShowVerificationType(false);
      if (selectedValue === "OTP") {
        setActive2fa("P");
      } else if (selectedValue === "2FA") {
        setActive2fa(false);
      } else {
        setShowVerificationType(false);
        setActive2fa(false);
      }
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
      navigate("/business-details");
    } else {
      displayMessage(
        "Failed to Update your 2-Step Verification Method, please try again...",
        "error"
      );
    }
  };

  return (
    <>
      <div className="twoFA-text-button-parent">
        <div className="twoFA-text-button">
          <div className="twoFA-more-wrapper">
            <b className="twoFA-more" onClick={() => logout()}>
              Logout{" "}
              <img
                className="twoFA-linear-iconsarrow-left1"
                loading="lazy"
                alt=""
                src="./icons/log out.svg"
              />
            </b>
          </div>

          <div className="twoFA-linear-iconsplaceholder">
            <div className="twoFA-vector"></div>
          </div>
        </div>

        {screenLoader ? (
          <div
            className="twoFA-frame-parent w-100 align-items-center loader-div"
            style={{ padding: "5rem" }}
          >
            <img
              src="/Screen_Loader.gif"
              alt=""
              style={{ width: "60%" }}
              className="loader-img"
            />
            <h5 className="fs-6 fw-bold loader-header">
              Please wait while we're fetching/updating your 2-Step verification
              details.
            </h5>
          </div>
        ) : (
          <>
            <div className="main-div w-100 mt-3">
              {showVerificationType ? (
                <Screen4 />
              ) : (
                <>
                  {active2fa === "P" ? (
                    <Screen3 />
                  ) : active2fa ? (
                    <Screen1 />
                  ) : (
                    <Screen2 />
                  )}
                </>
              )}
            </div>

            <div
              className="twoFA-frame-parent w-100 justify-content-center footer"
              style={{ padding: "2rem 8rem" }}
            >
              <div
                className="inputs1 screen-2"
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
            </div>
          </>
        )}
      </div>

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
  );
};

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

export default twoFactorAuth;
