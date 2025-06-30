import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, validateEmail } from "../js/sign-in";
import { closeLoader, openLoader } from "../../../@redux/features/common";
import { useDispatch, useSelector } from "react-redux";
import "../css/signIn.css";
import Axios from "axios";
import CryptoJS from "crypto-js";
import { setShowSidebar } from "../../../@redux/features/auth";
import { ThreeDots } from "react-loader-spinner";
Axios.defaults.withCredentials = true;

import * as actions from "../../../@redux/action/onboardingAction";
import ErrorDiv from "../js/errorDiv";

export function SignIn() {
  const [isLoading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [helperTextEmail, setHelperTextEmail] = useState(``);
  const [helperTextPassword, setHelperTextPassword] = useState(``);

  const [rightContentIcon, setRightContentIcon] = useState("");
  const [rightContentIcon2, setRightContentIcon2] = useState(
    "./icons/eye-slash.svg"
  );
  const [notifIcon, setNotifIcon] = useState("error.svg");

  const helperTextRef = useRef();
  const rightContentRef = useRef();
  const businessPasswordRef = useRef();
  const signInRef = useRef();
  const errorSpanRef = useRef();
  const errorDivRef = useRef();
  const errorFrameRef = useRef();
  const navigate = useNavigate();

  let emailRegex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let emailTagRegex = /<.*?>/;

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

  const validateEmail = () => {
    // Check if email is provided
    if (email) {
      // Check if email matches the regex pattern
      if (!emailRegex.test(email)) {
        setHelperTextEmail("Enter a valid email address (e.g. : abc@xyz.com)");
        return false;
      }
      // Check if email contains HTML tags
      else if (emailTagRegex.test(email)) {
        setHelperTextEmail("HTML tags are not allowed in a email address.");
        return false;
      }
      // If both validations pass
      else {
        setHelperTextEmail("");
        return true;
      }
    }
    // If email is not provided
    else {
      setHelperTextEmail("");
      return true;
    }
  };

  const validatePassword = (passwordVal) => {
    // Check if password is provided
    if (passwordVal) {
      // Check if password contains HTML tags
      if (emailTagRegex.test(passwordVal)) {
        setHelperTextPassword("HTML tags are not allowed in the password.");
        return false;
      }
      // If no HTML tags are found
      else {
        setHelperTextPassword("");
        return true;
      }
    }
    // If password is not provided
    else {
      setHelperTextPassword("");
      return false;
    }
  };

  const isEmailValid =
    email && emailRegex.test(email) && !emailTagRegex.test(email);
  const isPasswordValid =
    password && password.length > 0 && !emailTagRegex.test(password);

  const togglePasswordBtn = () => {
    var password2 = businessPasswordRef.current;

    if (password.value != "") {
      if (password2.getAttribute("type") == "password") {
        password2.setAttribute("type", "text");
        setRightContentIcon2("./icons/eye.svg");
      } else {
        password2.setAttribute("type", "password");
        setRightContentIcon2("./icons/eye-slash.svg");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      signInRef.current.click();
    }
  };

  const dispatch = useDispatch();

  const moveToSignup = () => {
    navigate("/sign-up");
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       await dispatch(actions.listCountry());
  //       await dispatch(actions.listNationality());
  //       await dispatch(actions.listCountryCode());
  //     } catch (error) {
  //       console.error("Error fetching lists:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <div className="sign-up">
      <div className="main-div">
        <form className="frame-parent">
          <div className="create-account-wrapper2">
            <div className="welcome-div">
              <h1 className="text-dark">Welcome to </h1>{" "}
              <img src="zoqq.svg" alt="" width={70} />
            </div>
            <div className="welcome-message"> Sign in to continue</div>
          </div>
          <div className="inputs-parent">
            <div className="inputs1">
              <div className="label-frame">
                <div className="label">Label</div>
                <div className="input-frame w-100">
                  <input
                    maxLength={40}
                    className="left-content w-100"
                    placeholder="Business Email"
                    type="email"
                    value={email}
                    onInput={(e) => {
                      setHelperTextEmail("");
                      setEmail(e.target.value);
                    }}
                    onBlur={(e) => validateEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />

                  <div className="right-content" ref={rightContentRef}>
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

            <div className="inputs3">
              <div className="label-frame3">
                <div className="label3">Label</div>
                <div className="input-frame">
                  <input
                    maxLength={255}
                    className="left-content"
                    placeholder="Password"
                    type="password"
                    value={password}
                    ref={businessPasswordRef}
                    onInput={(e) => {
                      setHelperTextPassword("");
                      setPassword(e.target.value);
                    }}
                    onBlur={(e) => validatePassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />

                  <div className="right-content2">
                    <img
                      className="linear-iconseye-slash2"
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

              <a
                href="/forgotpassword"
                className="text-decoration-none color-secondary-70 ms-auto mt-2"
                style={{ fontWeight: "600" }}
              >
                Forgot Password?
              </a>
            </div>
          </div>
          <div className="basic-components-control-ele-parent">
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
              className="btn btn-action w-100 rounded-pill p-l-b d-flex justify-content-center"
              type="button"
              ref={signInRef}
              onClick={() =>
                dispatch(
                  actions.handleSignIn(
                    email,
                    password,
                    emailRegex,
                    emailTagRegex,
                    {
                      setHelperTextEmail,
                      setHelperTextPassword,
                      displayMessage,
                      setLoading,
                      navigate,
                    }
                  )
                )
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {" "}
                  <ThreeDots
                    visible={true}
                    height="30"
                    width="50"
                    color="black"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </>
              ) : (
                <>Sign In</>
              )}
            </button>
          </div>
        </form>
        <div className="sign-up-inner3">
          <div className="frame-group">
            <div className="already-have-an-account-wrapper">
              <b className="already-have-an">Don't have an account yet?</b>
            </div>
            <button
              className="text-button1"
              type="button"
              onClick={moveToSignup}
              disabled={isLoading}
            >
              <img className="linear-iconsarrow-left" alt="" />

              <img className="linear-iconsarrow-left1" alt="" />

              <b className="more color-secondary-70">Create now</b>

              <div className="linear-iconsplaceholder3">
                <div className="vector3"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignIn;
