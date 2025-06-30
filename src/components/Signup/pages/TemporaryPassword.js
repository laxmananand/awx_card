import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as functions from "../js/forgot-password.js";
import "../css/forgot-password.css";
import { useDispatch } from "react-redux";
import { closeLoader, openLoader } from "../../../@redux/features/common";
import Axios from "axios";
import Swal from "sweetalert2";
import { logout } from "../../Signup/js/logout-function.js";
import { ThreeDots } from "react-loader-spinner";
import * as actions from "../../../@redux/action/onboardingAction.js";

export const validatePassword = () => {
  const passwordInput = document.getElementById("password");
  const errorElement = document.getElementById("errorMessage"); // Assuming you have an element to display password error messages

  const password = passwordInput.value;

  // Define password format rules
  const minLength = 8; // Minimum length requirement
  const hasUpperCase = /[A-Z]/.test(password); // At least one uppercase letter
  const hasLowerCase = /[a-z]/.test(password); // At least one lowercase letter
  const hasDigit = /\d/.test(password); // At least one digit
  const hasSpecialChar = /[!@#$%^&*]/.test(password); // At least one special character

  if (password.length == 0) {
    errorElement.innerText = "";
    errorElement.style.display = "none";
  } // Check if the password adheres to the format rules
  else if (
    password.length < minLength ||
    !hasUpperCase ||
    !hasLowerCase ||
    !hasDigit ||
    !hasSpecialChar
  ) {
    // Display an error message and add error styling to the input
    errorElement.innerText =
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character. (Example Password: Abc@2001)";
    errorElement.style.display = "block";
  } else {
    // Password format is valid, clear any error message and remove the error styling
    // Display an error message and add error styling to the input
    errorElement.innerText = "";
    errorElement.style.display = "none";
  }
};

export function TemporaryPassword() {
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [email, setEmail] = useState(sessionStorage.getItem("lastemail") || "");
  const [helperTextEmail, setHelperTextEmail] = useState(``);
  const [helperOtpText, setHelperOtpText] = useState("");
  const [helperTextPassword, setHelperTextPassword] = useState("");
  const [helperTextConfirmPassword, setHelperTextConfirmPassword] =
    useState("");

  const [rightContentIcon, setRightContentIcon] = useState("");
  const [rightContentIcon2, setRightContentIcon2] = useState(
    "./icons/eye-slash.svg"
  );
  const [rightContentIcon3, setRightContentIcon3] = useState(
    "./icons/eye-slash.svg"
  );
  const [notifIcon, setNotifIcon] = useState("error.svg");
  const [otp, setOtp] = useState("");
  const [activeSection, setActiveSection] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const helperTextRef = useRef();
  const helperOtpTextRef = useRef();
  const rightContentRef = useRef();
  const businessPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const resetPasswordRef = useRef();
  const errorSpanRef = useRef();
  const errorDivRef = useRef();
  const errorFrameRef = useRef();
  const helperTextConfirmPasswordRef = useRef();
  const otpRef = useRef();
  const SendOTPRef = useRef();
  const emailRef = useRef();
  const mainDivRef = useRef();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const now = new Date();
  const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}:${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}:${now.getFullYear().toString().slice(-2)}:${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const ValidateEmail = (emailVal) => {
    setEmail(emailVal);
    // Regular expression pattern for validating email addresses
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the pattern and return true if it matches, false otherwise
    if (emailVal) {
      if (emailPattern.test(emailVal)) {
        setHelperTextEmail(``);
      } else {
        setHelperTextEmail(`Please provide a valid email: "work1@company.com"`);
      }
    } else {
      setHelperTextEmail(``);
    }
  };

  const togglePasswordBtn = () => {
    var password2 = businessPasswordRef.current;

    if (password2.value != "") {
      if (password2.getAttribute("type") == "password") {
        password2.setAttribute("type", "text");
        setRightContentIcon2("./icons/eye.svg");
      } else {
        password2.setAttribute("type", "password");
        setRightContentIcon2("./icons/eye-slash.svg");
      }
    }
  };

  const toggleConfirmPasswordBtn = () => {
    var password2 = confirmPasswordRef.current;

    if (confirmPassword.value != "") {
      if (password2.getAttribute("type") == "password") {
        password2.setAttribute("type", "text");
        setRightContentIcon3("./icons/eye.svg");
      } else {
        password2.setAttribute("type", "password");
        setRightContentIcon3("./icons/eye-slash.svg");
      }
    }
  };

  const matchPasswords = (confirmPasswordVal) => {
    if (password && confirmPasswordVal) {
      if (password == confirmPasswordVal) {
        //displayMessage("Passwords match. You're good to go! ✔️", "success");
        setHelperTextConfirmPassword("");
      } else if (password != confirmPasswordVal) {
        setHelperTextConfirmPassword(
          "Uh-oh! Passwords don't match. Give it another shot. ❌"
        );
      } else {
        setHelperTextConfirmPassword("");
      }
    } else {
      setHelperTextConfirmPassword("");
    }
  };

  const matchPasswords2 = (passwordVal) => {
    if (confirmPassword && passwordVal) {
      if (confirmPassword == passwordVal) {
        //displayMessage("Passwords match. You're good to go! ✔️", "success");
        setHelperTextConfirmPassword("");
      } else if (confirmPassword != passwordVal) {
        setHelperTextConfirmPassword(
          "Uh-oh! Passwords don't match. Give it another shot. ❌"
        );
      } else {
        setHelperTextConfirmPassword("");
      }
    } else {
      setHelperTextConfirmPassword("");
    }
  };

  const handleKeyDownResetPassword = (event) => {
    if (event.key === "Enter") {
      HandleResetPassword();
    }
  };

  const moveToLogin = () => {
    navigate("/");
  };

  const uppercaseRef = useRef(null);
  const lowercaseRef = useRef(null);
  const minLengthRef = useRef(null);
  const specialCharRef = useRef(null);
  const numberRef = useRef(null);

  const [passwordFormatToggle, setPasswordFormatToggle] = useState(false);

  let emailRegex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let otpRegex = /^\d{6}$/;
  let tagRegex = /<.*?>/;
  let passwordRegex =
    /^(?!\s+)(?!.*\s+$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$^*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ])[A-Za-z0-9$^*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]{8,64}$/;

  const handlePassword = (passwordVal) => {
    setPassword(passwordVal);

    if (passwordVal) {
      setPasswordFormatToggle(true);
    } else {
      setPasswordFormatToggle(false);
    }

    const uppercasePattern = /[A-Z]/;
    const lowercasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;
    const specialCharPattern = /[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]/;
    const minLengthPattern = /^.{8,64}$/;

    const isValidUppercase = uppercasePattern.test(passwordVal);
    const isValidLowercase = lowercasePattern.test(passwordVal);
    const isValidNumber = numberPattern.test(passwordVal);
    const isValidSpecialChar = specialCharPattern.test(passwordVal);
    const isValidMinLength = minLengthPattern.test(passwordVal);

    if (uppercaseRef.current) {
      //uppercaseRef.current.childNodes[0].src = isValidUppercase ? "check.png" : "warning.png";
      uppercaseRef.current.style.color = isValidUppercase ? "#327e9d" : "";
    }

    if (lowercaseRef.current) {
      //lowercaseRef.current.childNodes[0].src = isValidLowercase ? "check.png" : "warning.png";
      lowercaseRef.current.style.color = isValidLowercase ? "#327e9d" : "";
    }

    if (minLengthRef.current) {
      //minLengthRef.current.childNodes[0].src = isValidMinLength ? "check.png" : "warning.png";
      minLengthRef.current.style.color = isValidMinLength ? "#327e9d" : "";
    }

    if (specialCharRef.current) {
      //specialCharRef.current.childNodes[0].src = isValidSpecialChar ? "check.png" : "warning.png";
      specialCharRef.current.style.color = isValidSpecialChar ? "#327e9d" : "";
    }

    if (numberRef.current) {
      //numberRef.current.childNodes[0].src = isValidNumber ? "check.png" : "warning.png";
      numberRef.current.style.color = isValidNumber ? "#327e9d" : "";
    }

    const isPasswordValid =
      isValidUppercase &&
      isValidLowercase &&
      isValidNumber &&
      isValidSpecialChar &&
      isValidMinLength;

    if (isPasswordValid) {
      setPasswordFormatToggle(false);
    }

    if (confirmPassword) {
      matchPasswords2(passwordVal);
    }
  };

  const handleConfirmPassword = (passwordVal) => {
    setConfirmPassword(passwordVal);

    if (passwordVal) {
      setPasswordFormatToggle(true);
    } else {
      setPasswordFormatToggle(false);
    }

    const uppercasePattern = /[A-Z]/;
    const lowercasePattern = /[a-z]/;
    const numberPattern = /[0-9]/;
    const specialCharPattern = /[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]/;
    const minLengthPattern = /^.{8,64}$/;

    const isValidUppercase = uppercasePattern.test(passwordVal);
    const isValidLowercase = lowercasePattern.test(passwordVal);
    const isValidNumber = numberPattern.test(passwordVal);
    const isValidSpecialChar = specialCharPattern.test(passwordVal);
    const isValidMinLength = minLengthPattern.test(passwordVal);

    if (uppercaseRef.current) {
      //uppercaseRef.current.childNodes[0].src = isValidUppercase ? "check.png" : "warning.png";
      uppercaseRef.current.style.color = isValidUppercase ? "#327e9d" : "";
    }

    if (lowercaseRef.current) {
      //lowercaseRef.current.childNodes[0].src = isValidLowercase ? "check.png" : "warning.png";
      lowercaseRef.current.style.color = isValidLowercase ? "#327e9d" : "";
    }

    if (minLengthRef.current) {
      //minLengthRef.current.childNodes[0].src = isValidMinLength ? "check.png" : "warning.png";
      minLengthRef.current.style.color = isValidMinLength ? "#327e9d" : "";
    }

    if (specialCharRef.current) {
      // specialCharRef.current.childNodes[0].src = isValidSpecialChar ? "check.png" : "warning.png";
      specialCharRef.current.style.color = isValidSpecialChar ? "#327e9d" : "";
    }

    if (numberRef.current) {
      //numberRef.current.childNodes[0].src = isValidNumber ? "check.png" : "warning.png";
      numberRef.current.style.color = isValidNumber ? "#327e9d" : "";
    }
    const isPasswordValid =
      isValidUppercase &&
      isValidLowercase &&
      isValidNumber &&
      isValidSpecialChar &&
      isValidMinLength;

    if (isPasswordValid) {
      setPasswordFormatToggle(false);
    }

    matchPasswords(passwordVal);
  };

  const HandleResetPassword = async () => {
    console.log(email);
    if (!email) {
      // errorDiv.style.display = "flex";
      // span.innerText = "Email is required.";
      // span.style.color = "brown";

      setHelperTextEmail("Enter your email to continue.");
      return false;
    }

    if (!emailRegex.test(email)) {
      // errorDiv.style.display = "flex";
      // span.innerText = "Email format is invalid (Ex - work@companyname.com).";
      // span.style.color = "brown";

      setHelperTextEmail("Enter a valid email (e.g. : abc@xyz.com).");
      return false;
    }

    if (tagRegex.test(email)) {
      setHelperTextEmail("HTML Tags are not allowed in a email address.");
      return false;
    }

    if (!tempPassword) {
      // errorDiv.style.display = "flex";
      // span.innerText = "Email is required.";
      // span.style.color = "brown";

      setHelperTextTempPassword("Enter your temporary password to continue.");
      return false;
    }

    if (!passwordRegex.test(tempPassword)) {
      // errorDiv.style.display = "flex";
      // span.innerText = "Email format is invalid (Ex - work@companyname.com).";
      // span.style.color = "brown";

      setHelperTextTempPassword("Enter a valid temporary password.");
      return false;
    }

    if (tagRegex.test(tempPassword)) {
      setHelperTextTempPassword(
        "HTML Tags are not allowed in temporary password."
      );
      return false;
    }

    if (!password) {
      // errorDiv.style.display = "flex";
      // span.innerText = "Password is required.";
      // span.style.color = "brown";

      setHelperTextPassword("Enter a strong password to continue.");

      return false;
    }

    if (!passwordRegex.test(password)) {
      // errorDiv.style.display = "flex";
      // span.innerText = "Password format is invalid. Ex-AbEc@123";
      // span.style.color = "brown";

      setHelperTextPassword("Enter a valid password. (e.g. : Twelve@12345)");
      return false;
    }

    if (tagRegex.test(password)) {
      setHelperTextPassword("HTML Tags are not allowed in password.");
      return false;
    }

    if (!confirmPassword) {
      // errorDiv.style.display = "flex";
      // span.innerText = "Confirm Password is required.";
      // span.style.color = "brown";

      setHelperTextConfirmPassword("Confirm your password to continue.");
      return false;
    }

    if (!passwordRegex.test(confirmPassword)) {
      // errorDiv.style.display = "flex";
      // span.innerText = "Confirm Password format is invalid. Ex - xYzE@789";
      // span.style.color = "brown";

      setHelperTextConfirmPassword(
        "Confirm Password is invalid (e.g. : Twelve@123)."
      );
      return false;
    }

    if (tagRegex.test(confirmPassword)) {
      setHelperTextConfirmPassword(
        "HTML Tags are not allowed in confirm password."
      );
      return false;
    }

    if (password !== confirmPassword) {
      // errorDiv.style.display = "flex";
      // span.innerText = "Passwords do not match, please check again!";
      // span.style.color = "brown";

      setHelperTextConfirmPassword(
        "Your entered password and confirm password do not match, please check again!"
      );
      return false;
    } else {
      displayMessage("", "reset");

      try {
        let params = {
          username: email,
          tempPassword: tempPassword,
          newPassword: confirmPassword,
        };

        let obj = await dispatch(
          actions.ResetTemporaryPassword(params, { setLoading })
        );

        if (
          obj.ResponseMetadata &&
          obj.ResponseMetadata.HTTPStatusCode == 200
        ) {
          displayMessage(
            "Password reset successful. Please sign-in to continue...",
            "success"
          );

          setTimeout(() => {
            logout();
          }, 1500);
        } else if (obj.errorCode) {
          let msg = obj.message || obj.msg;
          let errorMessage = msg.includes("operation: ")
            ? msg.split("operation: ")[1]
            : "Something went wrong, please try again later!";

          displayMessage(errorMessage, "error");
        }
      } catch (error) {
        setLoading(false);
        displayMessage(
          "Something went wrong, please try again later!",
          "error"
        );
        return false;
      }
    }
  };

  const restrictInputOtp = () => {
    var code = otpRef.current;
    const inputValue = code.value.replace(/\D/g, "").slice(0, 6);
    code.value = inputValue;
  };

  const HandleSendOTP = async () => {
    if (!email) {
      setHelperTextEmail("To proceed, please provide a valid email address...");
    }
    // Test the email against the pattern and return true if it matches, false otherwise
    else if (!emailRegex.test(email)) {
      setHelperTextEmail(`Please provide a valid email: "work1@company.com"`);
    } else {
      displayMessage(``, "reset");

      try {
        let phone = sessionStorage.getItem("phone_number");
        let params = { phoneNumber: phone, email: email };

        let obj = await dispatch(
          actions.ResendTemporaryPassword(params, { setLoading })
        );
        if (
          obj.response?.ResponseMetadata &&
          obj.response?.ResponseMetadata?.HTTPStatusCode == 200
        ) {
          displayMessage(
            "We've sent you a temporary password. Please check your email and reset your password.",
            "success"
          );
        } else if (obj.errorCode) {
          let msg = obj.message || obj.msg;
          let errorMessage = msg.includes("operation: ")
            ? msg.split("operation: ")[1]
            : "Something went wrong, please try again later!";

          displayMessage(errorMessage, "error");
        }
      } catch (error) {
        setLoading(false);
        displayMessage(
          "Something went wrong, please try again later!",
          "error"
        );
        return false;
      }
    }
  };

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

  useEffect(() => {}, [activeSection]);

  const handleCopyPaste = (e) => {
    e.preventDefault();
  };

  const [emailDisable, setEmailDisable] = useState(true);

  const [tempPassword, setTempPassword] = useState("");
  let tempPasswordRef = useRef();
  const [helperTextTempPassword, setHelperTextTempPassword] = useState("");

  return (
    <div
      className="fp-sign-up2"
      ref={mainDivRef}
      style={{
        padding:
          "8rem var(--padding-2xl) var(--padding-21xl) var(--padding-xl) !important",
      }}
    >
      <form className="fp-frame-parent" onSubmit={(e) => e.preventDefault()}>
        <div className="fp-create-account-wrapper">
          <h1 className="fp-create-account">Reset Your Password</h1>
        </div>
        <div className="fp-inputs-parent">
          <div className="fp-inputs1">
            <div className="fp-label-frame">
              <div className="fp-label">Label</div>
              <div
                className={
                  emailDisable ? "fp-input-frame disabled" : "fp-input-frame"
                }
              >
                <input
                  className="fp-left-content"
                  placeholder="Business Email"
                  type="email"
                  value={email}
                  onInput={(e) => {
                    setHelperTextEmail(``);
                    setEmail(e.target.value);
                  }}
                  onBlur={(e) => {
                    ValidateEmail(e.target.value);
                  }}
                  ref={emailRef}
                  onKeyDown={handleKeyDownResetPassword}
                  maxLength="255"
                  readOnly={emailDisable}
                />

                <div className="fp-right-content" ref={rightContentRef}>
                  <img src={rightContentIcon} alt="" width={20} />
                </div>
              </div>
            </div>
            {helperTextEmail ? (
              <>
                <div className="helper-text">
                  <img src="/error.svg" alt="" width={18} />
                  {helperTextEmail}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>

          <>
            <div className="fp-inputs3">
              <div className="fp-label-frame3">
                <div className="fp-label3">Label</div>
                <div className="fp-input-frame3">
                  <input
                    className="fp-left-content3"
                    placeholder="Enter your temporary password..."
                    type="text"
                    value={tempPassword}
                    ref={tempPasswordRef}
                    onInput={(e) => {
                      setHelperTextTempPassword(``);
                      setTempPassword(e.target.value);
                    }}
                    onBlur={(e) => {
                      if (
                        e.target.value &&
                        !passwordRegex.test(e.target.value)
                      ) {
                        setHelperTextTempPassword(
                          "Please enter a valid temporary password."
                        );
                      }
                    }}
                    onKeyDown={handleKeyDownResetPassword}
                    maxLength={64}
                  />

                  <div className="fp-right-content1">
                    {/* <img
                      className="fp-linear-iconseye-slash2"
                      alt=""
                      src={rightContentIcon2}
                      onClick={togglePasswordBtn}
                    /> */}
                  </div>
                </div>
              </div>
              {helperTextTempPassword ? (
                <>
                  <div className="helper-text">
                    <img src="/error.svg" alt="" width={18} />
                    {helperTextTempPassword}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>

            <div className="fp-inputs3">
              <div className="fp-label-frame3">
                <div className="fp-label3">Label</div>
                <div className="fp-input-frame3">
                  <input
                    className="fp-left-content3"
                    placeholder="Create a strong password..."
                    type="password"
                    value={password}
                    ref={businessPasswordRef}
                    onInput={(e) => {
                      setHelperTextPassword(``);
                      handlePassword(e.target.value);
                    }}
                    onKeyDown={handleKeyDownResetPassword}
                    maxLength={64}
                  />

                  <div className="fp-right-content1">
                    <img
                      className="fp-linear-iconseye-slash2"
                      alt=""
                      src={rightContentIcon2}
                      onClick={togglePasswordBtn}
                    />
                  </div>
                </div>
              </div>
              {helperTextPassword ? (
                <>
                  <div className="helper-text">
                    <img src="/error.svg" alt="" width={18} />
                    {helperTextPassword}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>

            <div className="fp-inputs3">
              <div className="fp-label-frame3">
                <div className="fp-label3">Label</div>
                <div className="fp-input-frame3">
                  <input
                    className="fp-left-content3"
                    placeholder="Confirm Your Password..."
                    type="password"
                    value={confirmPassword}
                    ref={confirmPasswordRef}
                    onInput={(e) => {
                      setHelperTextConfirmPassword(``);
                      handleConfirmPassword(e.target.value);
                    }}
                    onCopy={handleCopyPaste}
                    onPaste={handleCopyPaste}
                    onCut={handleCopyPaste}
                    onKeyDown={handleKeyDownResetPassword}
                    maxLength={64}
                  />

                  <div className="fp-right-content2">
                    <img
                      className="fp-linear-iconseye-slash2"
                      alt=""
                      src={rightContentIcon3}
                      onClick={toggleConfirmPasswordBtn}
                    />
                  </div>
                </div>
              </div>
              {helperTextConfirmPassword ? (
                <>
                  <div className="helper-text">
                    <img src="/error.svg" alt="" width={18} />
                    {helperTextConfirmPassword}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>

            {passwordFormatToggle ? (
              <>
                <div
                  className=""
                  style={{
                    fontSize: "12px",
                    textAlign: "left",
                    padding: "0 10px",
                    fontWeight: "600",
                  }}
                  id="passwordFormatDiv"
                >
                  A password must contain,{" "}
                  <span ref={uppercaseRef}>
                    at least one uppercase letter (A-Z),{" "}
                  </span>
                  <span ref={lowercaseRef}>
                    at least one lowercase letter (a-z),{" "}
                  </span>
                  <span ref={minLengthRef}>Between 8-256 characters, </span>
                  <span ref={specialCharRef}>
                    at least one special character,{" "}
                  </span>
                  <span ref={numberRef}>at least one number (0-9).</span>
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        </div>

        <div className="fp-basic-components-control-ele-parent">
          <div
            className="fp-inputs1"
            style={{ display: "none" }}
            ref={errorDivRef}
          >
            <div className="fp-label-frame">
              <div className="fp-input-frame fp-error-div" ref={errorFrameRef}>
                <div className="fp-left-content fp-error-message">
                  <img src={notifIcon} alt="" width={20} />
                  <span ref={errorSpanRef}>
                    Something went wrong, please try again later.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <>
            <span className="d-flex align-items-center justify-content-center w-100">
              Didn't receive the temporary password?{" "}
              <Link
                to="#!"
                onClick={HandleSendOTP}
                className="mx-1 text-decoration-none text-success"
                style={{ fontWeight: 600 }}
              >
                Re-send
              </Link>
            </span>
            <button
              className="fp-text-button"
              type="button"
              ref={resetPasswordRef}
              onClick={HandleResetPassword}
            >
              <div className="fp-linear-iconsplaceholder1">
                <div className="fp-vector1"></div>
              </div>

              {isLoading ? (
                <>
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
                <>
                  <b className="fp-button1">Reset Password</b>
                </>
              )}

              <div className="fp-linear-iconsplaceholder2">
                <div className="fp-vector2"></div>
              </div>
            </button>
          </>
        </div>
      </form>
      <div className="fp-sign-up-inner2">
        <div className="fp-frame-group">
          <div className="fp-already-have-an-account-wrapper">
            <b className="fp-already-have-an">
              Already Reset Your Temporary Password?
            </b>
          </div>
          <button
            className="fp-text-button1"
            type="button"
            onClick={moveToLogin}
          >
            <img className="fp-linear-iconsarrow-left" alt="" />

            <img className="fp-linear-iconsarrow-left1" alt="" />

            <b className="fp-more">Sign-In</b>
            <div className="fp-linear-iconsplaceholder3">
              <div className="fp-vector3"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemporaryPassword;
