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

// Create an Axios instance
const axiosInstance = Axios.create({
  baseURL: sessionStorage.getItem("baseUrl"),
  withCredentials: true,
});

// Add request interceptor to attach "region" and "_cookie" to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const region = sessionStorage.getItem("region"); // Get region from session storage
    const _cookie = sessionStorage.getItem("_cookie"); // Get _cookie from session storage if available

    config.params = config.params || {};
    config.params.region = region; // Attach the region as a query param

    if (_cookie) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `${_cookie}`; // Attach _cookie in Authorization header
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

export function ForgotPassword() {
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [email, setEmail] = useState(null);
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

  useEffect(() => {
    let url = window.location;
    let params = new URLSearchParams(url.search);
    let query = params.get("email");

    setEmail(query);
  }, []);

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
    var span = helperTextConfirmPasswordRef.current;

    if (password && confirmPasswordVal) {
      if (password == confirmPasswordVal) {
        span.style.display = "block";
        span.innerText = "Passwords match. You're good to go! ✔️";
        span.style.color = "green";
      } else if (password != confirmPasswordVal) {
        span.style.display = "block";
        span.innerText =
          "Uh-oh! Passwords don't match. Give it another shot. ❌";
        span.style.color = "brown";
      } else {
        span.style.display = "none";
        span.innerText = "";
      }
    } else {
      span.style.display = "none";
      span.innerText = "";
    }
  };

  const matchPasswords2 = (passwordVal) => {
    var span = helperTextConfirmPasswordRef.current;

    if (confirmPassword && passwordVal) {
      if (confirmPassword == passwordVal) {
        span.style.display = "block";
        span.innerText = "Passwords match. You're good to go! ✔️";
        span.style.color = "green";
      } else if (confirmPassword != passwordVal) {
        span.style.display = "block";
        span.innerText =
          "Uh-oh! Passwords don't match. Give it another shot. ❌";
        span.style.color = "brown";
      } else {
        span.style.display = "none";
        span.innerText = "";
      }
    } else {
      span.style.display = "none";
      span.innerText = "";
    }
  };

  const handleKeyDownSendOtp = (event) => {
    if (event.key === "Enter") {
      HandleSendOTP();
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

    if (!otp) {
      // errorDiv.style.display = "flex";
      // span.innerText = "Email is required.";
      // span.style.color = "brown";

      setHelperOtpText("Enter your OTP to continue.");
      return false;
    }

    if (!otpRegex.test(otp)) {
      // errorDiv.style.display = "flex";
      // span.innerText = "Email format is invalid (Ex - work@companyname.com).";
      // span.style.color = "brown";

      setHelperOtpText("Enter a valid OTP.");
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

      setLoading(true);

      try {
        const response = await axiosInstance.get(
          sessionStorage.getItem("baseUrl") + "/SignupRoutes/resetpassword",
          {
            params: {
              email: email,
              code: otp,
              password: password,
            },
          }
        );

        let obj = response.data;

        if (obj.status === "UNAUTHORIZED_ACCESS") {
          Swal.fire({
            title: "Unauthorized Access",
            text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
            icon: "error",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              logout();
            } else {
              setTimeout(() => {
                logout();
              }, 1500);
            }
          });

          return;
        }

        setLoading(false);

        if (
          obj.ResponseMetadata &&
          obj.ResponseMetadata.HTTPStatusCode == 200
        ) {
          displayMessage(
            "Password reset successful. Please login to continue.",
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
      displayMessage(
        "To proceed, please provide a valid email address...",
        "error"
      );
    }
    // Test the email against the pattern and return true if it matches, false otherwise
    else if (!emailRegex.test(email)) {
      displayMessage(
        `Please provide a valid email: "work1@company.com"`,
        "error"
      );
    } else {
      displayMessage(``, "reset");
      setLoading(true);

      try {
        const fetchUser = await axiosInstance.get(
          sessionStorage.getItem("baseUrl") +
            "/SignupRoutes/getcognitouserinfo",
          {
            params: {
              email: email,
            },
          }
        );

        let fetchUserDetails = fetchUser.data;

        if (fetchUserDetails.status === "UNAUTHORIZED_ACCESS") {
          Swal.fire({
            title: "Unauthorized Access",
            text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
            icon: "error",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              logout();
            } else {
              setTimeout(() => {
                logout();
              }, 1500);
            }
          });

          return;
        }

        if (fetchUserDetails.errorCode) {
          setLoading(false);
          if (fetchUserDetails.errorCode == "UserNotFoundException") {
            displayMessage(
              "Please provide a registered email address...",
              "error"
            );
          } else {
            setLoading(false);
            let msg = fetchUserDetails.message;
            let msgSplit = msg.split("operation:");
            let errorMsg = msgSplit[1];

            displayMessage(`${errorMsg}`, "error");
          }
        } else if (fetchUserDetails.UserStatus == "CONFIRMED") {
          const response = await axiosInstance.get(
            sessionStorage.getItem("baseUrl") + "/SignupRoutes/sendOTP",
            {
              params: {
                email: email,
              },
            }
          );

          let obj = response.data;

          if (obj.status === "UNAUTHORIZED_ACCESS") {
            Swal.fire({
              title: "Unauthorized Access",
              text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
              icon: "error",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                logout();
              } else {
                setTimeout(() => {
                  logout();
                }, 1500);
              }
            });

            return;
          }

          setLoading(false);

          if (
            obj.ResponseMetadata &&
            obj.ResponseMetadata.HTTPStatusCode == 200
          ) {
            sessionStorage.setItem("resetEmail", email);
            displayMessage(
              "Look out for the unique code we've sent to your email for verification.",
              "success"
            );
            mainDivRef.current.style.paddingTop = "100px";
            setActiveSection(true);
            setEmailDisable(true);
          } else if (obj.errorCode) {
            let msg = obj.message || obj.msg;
            let msgSplit = msg.split("operation:");
            let errorMsg = msgSplit[1];

            displayMessage(`${errorMsg}`, "error");
          }
        } else if (fetchUserDetails.UserStatus == "UNCONFIRMED") {
          sessionStorage.setItem("lastemail", email);

          displayMessage(
            "Email-id not verified, please verify first!",
            "error"
          );
          setTimeout(() => {
            navigate("/verification?reset-password");
          }, 1500);
        }
      } catch (error) {
        setLoading(false);
        displayMessage(
          "Something went wrong, please try again later!",
          "error"
        );
        return;
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

  const [emailDisable, setEmailDisable] = useState(false);
  return (
    <div className="fp-sign-up2" ref={mainDivRef}>
      <form className="fp-frame-parent" onSubmit={(e) => e.preventDefault()}>
        <div className="fp-create-account-wrapper">
          <h1 className="fp-create-account">Reset Your Password</h1>
        </div>
        <div className="fp-inputs-parent">
          <div className="fp-inputs1">
            <div className="fp-label-frame">
              <div className="fp-label">Label</div>
              <div className="fp-input-frame">
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
                  onKeyDown={handleKeyDownSendOtp}
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

          {activeSection ? (
            <>
              <div className="fp-inputs1">
                <div className="fp-label-frame">
                  <div className="fp-label">Label</div>
                  <div className="fp-input-frame">
                    <input
                      className="fp-left-content"
                      placeholder="Enter OTP"
                      type="number"
                      value={otp}
                      onInput={(e) => {
                        setHelperOtpText(``);
                        restrictInputOtp();
                        setOtp(e.target.value);
                      }}
                      ref={otpRef}
                      onKeyDown={handleKeyDownResetPassword}
                    />

                    <div className="fp-right-content" ref={rightContentRef}>
                      <img src={rightContentIcon} alt="" width={20} />
                    </div>
                  </div>
                </div>
                {helperOtpText ? (
                  <>
                    <div className="helper-text">
                      <img src="/error.svg" alt="" width={18} />
                      {helperOtpText}
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
                      placeholder="Create a strong password"
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
                      placeholder="Confirm Your Password"
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
          ) : (
            <></>
          )}
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

          {!activeSection ? (
            <>
              <button
                className="fp-text-button"
                type="button"
                ref={SendOTPRef}
                onClick={HandleSendOTP}
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
                    <b className="fp-button1">Send OTP</b>
                  </>
                )}

                <div className="fp-linear-iconsplaceholder2">
                  <div className="fp-vector2"></div>
                </div>
              </button>
            </>
          ) : (
            <>
              <span className="d-flex align-items-center justify-content-center w-100 fw-bold">
                Didn't receive the OTP?{" "}
                <Link
                  to="#!"
                  onClick={HandleSendOTP}
                  className="mx-1 text-decoration-none"
                  style={{ fontWeight: 600 }}
                >
                  Resend OTP
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
          )}
        </div>
      </form>
      <div className="fp-sign-up-inner2">
        <div className="fp-frame-group">
          <div className="fp-already-have-an-account-wrapper">
            <b className="fp-already-have-an">Already Have an Account?</b>
          </div>
          <button
            className="fp-text-button1"
            type="button"
            onClick={moveToLogin}
          >
            <img className="fp-linear-iconsarrow-left" alt="" />

            <img className="fp-linear-iconsarrow-left1" alt="" />

            <b className="fp-more">Sign In</b>
            <div className="fp-linear-iconsplaceholder3">
              <div className="fp-vector3"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
