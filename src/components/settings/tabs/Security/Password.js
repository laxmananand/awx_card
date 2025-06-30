import { Input, InputAdornment, InputLabel, TextField } from '@mui/material'
import React, { useEffect, useState, useRef } from 'react'
import { sentOTP, validateEmail, restrictInput, validatePassword, matchPasswords, resetPassword } from "../../jsFile/SecurityJs/resetPassword.js";
import "../../../Signup/css/signIn.css"
import OtpInput from 'react-otp-input';
import "../../css/settings.css"
import {setActiveTabPassword} from "../../../../@redux/features/settings.js"
import { useDispatch, useSelector } from "react-redux";



export function Password() {

  const ActiveTabPassword = useSelector(state => state.settings.activeTabPassword);
 


 
  return (
    <div className='row '>
      <div className='col-6 my-5 mx-auto p-5 rounded-5 shadow'>
        <div className="title">
        {ActiveTabPassword === 1 ? (
        <>
         <div className="sign-up1 w-100 h4">Would you like to reset your password?</div>
         <div className="label-text small">Kindly click on the 'GET OTP' button to initiate the password reset process.</div>
        </>
       ) : (
        <>
        <div className="sign-up1 w-100 h4">Reset Password</div>
        <div className="label-text small">Kindly input the OTP below, followed by setting up a new password.</div>
        </>
         )}
        </div>
        <br></br>

        <div className="fields">
        {/* {showComponent ? <EmailComponent onButtonClick={handleSwitch} /> : <RestComponent />} */}
         {ActiveTabPassword === 1 && <EmailComponent />}
         {ActiveTabPassword === 2 && <RestComponent/>}

        </div>
      </div>
    </div>
  );
}
export default Password;


function EmailComponent () {
  const lastEmail = sessionStorage.getItem("lastemail");
  const dispatch = useDispatch()

  const handleSwitch = async () => {
    try {
      const sendOtp = await sentOTP();
      let obj = sendOtp;

      if (obj.ResponseMetadata && obj.ResponseMetadata.HTTPStatusCode == 200) {
        dispatch(setActiveTabPassword(2));

      } else {
        // Handle the case where sendOTP status is not SUCCESS
        console.error("Error: OTP not sent successfully. Status:", obj.errorCode);
        // You might want to set an error state or show a message to the user
      }
    } catch (error) {
      // Handle errors if the promise is rejected
      console.error("Error sending OTP:", error);
      // You might want to set an error state or show a message to the user
    }
  };

  return (
    <>
      <div className="stroke-1">
        <div className="inputicontextdefault1">

          <InputLabel htmlFor="email">Registered Email Id</InputLabel>
          <Input
            id='email'
            variant='standard'
            className='w-100 mb-3'
            label="Registered Email Id"
            style={{ fontWeight: "500", fontSize: "18px" }}
            value={lastEmail}
            startAdornment={<InputAdornment position="start"> <img className="job-icon" alt="" src="/signup/Signup/public/job.svg" /></InputAdornment>}
          />
        </div>
      </div>

      <div className="stroke-3">
        <button className="btn btn-action p-l-m rounded-pill shadow w-100 text-center d-flex justify-content-center" type="button" id="button-main" onClick={handleSwitch}>
          <div id="button-text" style={{ marginLeft: "inherit", width: "100px" }}>
            <div className="text-nowrap">GET OTP</div>
          </div>
          <div id="button-loader" style={{ marginLeft: "inherit" }}>
            <img className="google-icon" alt="" src="/signup/Signup/public/loader.gif" />
          </div>
        </button>
      </div>
    </>
  );
};


function RestComponent () {
  const [imgSrc, setImgSrc] = useState("/icons/eye-slash.svg");
  const [imgSrc2, setImgSrc2] = useState("/icons/eye-slash.svg");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [helperTextConfirmPassword, setHelperTextConfirmPassword] = useState("");
  const [helperTextPassword, setHelperTextPassword] = useState("");
  const [helperTextOtp, setHelperTextOtp] = useState("");

  const confirmPasswordRef = useRef(null);
  const businessPasswordRef = useRef(null);
  const [passwordFormatToggle, setPasswordFormatToggle] = useState(false);
  const dispatch = useDispatch()


  const showPassword = () => {
    var password = document.getElementById("newPassword");

    if (password.value != "") {
      if (password.getAttribute("type") == "password") {
        password.setAttribute("type", "text");
        setImgSrc("/icons/eye.svg");
      } else {
        password.setAttribute("type", "password");
        setImgSrc("/icons/eye-slash.svg");
      }
    }
  };

  const showConfirmPassword = () => {
    var password = document.getElementById("confirmNewPassword");

    if (password.value != "") {
      if (password.getAttribute("type") == "password") {
        password.setAttribute("type", "text");
        setImgSrc2("/icons/eye.svg");
      } else {
        password.setAttribute("type", "password");
        setImgSrc2("/icons/eye-slash.svg");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("button-main2").click();
    }
  };

  const handleCopyPaste = (e) => {
    e.preventDefault();
  };

const uppercaseRef = useRef(null);
const lowercaseRef = useRef(null);
const minLengthRef = useRef(null);
const specialCharRef = useRef(null);
const numberRef = useRef(null);

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

    const allConditionsMet =
      isValidUppercase &&
      isValidLowercase &&
      isValidNumber &&
      isValidSpecialChar &&
      isValidMinLength;

    if (uppercaseRef.current) {
      uppercaseRef.current.style.color = isValidUppercase ? "#2a852f" : "";
    }

    if (lowercaseRef.current) {
      lowercaseRef.current.style.color = isValidLowercase ? "#2a852f" : "";
    }

    if (minLengthRef.current) {
      minLengthRef.current.style.color = isValidMinLength ? "#2a852f" : "";
    }

    if (specialCharRef.current) {
      specialCharRef.current.style.color = isValidSpecialChar ? "#2a852f" : "";
    }

    if (numberRef.current) {
      numberRef.current.style.color = isValidNumber ? "#2a852f" : "";
    }

    if (allConditionsMet) {
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

    const allConditionsMet =
      isValidUppercase &&
      isValidLowercase &&
      isValidNumber &&
      isValidSpecialChar &&
      isValidMinLength;

    if (uppercaseRef.current) {
      uppercaseRef.current.style.color = isValidUppercase ? "#2a852f" : "";
    }

    if (lowercaseRef.current) {
      lowercaseRef.current.style.color = isValidLowercase ? "#2a852f" : "";
    }

    if (minLengthRef.current) {
      minLengthRef.current.style.color = isValidMinLength ? "#2a852f" : "";
    }

    if (specialCharRef.current) {
      specialCharRef.current.style.color = isValidSpecialChar ? "#2a852f" : "";
    }

    if (numberRef.current) {
      numberRef.current.style.color = isValidNumber ? "#2a852f" : "";
    }

    if (allConditionsMet) {
      setPasswordFormatToggle(false);
    }

    matchPasswords(passwordVal);
  };

  const matchPasswords = (confirmPasswordVal) => {
    if (password && confirmPasswordVal) {
      if (password == confirmPasswordVal) {
        
        setHelperTextConfirmPassword("");
      } else if (password != confirmPasswordVal) {
        setHelperTextConfirmPassword(
          "Passwords don't match. Give it another shot. ❌"
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
        setHelperTextConfirmPassword("");
      } else if (confirmPassword != passwordVal) {
        setHelperTextConfirmPassword(
          "Passwords don't match. Give it another shot. ❌"
        );
      } else {
        setHelperTextConfirmPassword("");
      }
    } else {
      setHelperTextConfirmPassword("");
    }
  };

 

  const updatePassword = async () => {

    const lastEmail = sessionStorage.getItem("lastemail");

    let passwordRegex =
    /^(?!\s+)(?!.*\s+$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$^*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ])[A-Za-z0-9$^*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]{8,64}$/;

    let tagRegex = /<.*?>/;

    if(!lastEmail){
      setHelperTextConfirmPassword("Email not found!");
      return false;
    }

    else if(otp == "" && password == "" && confirmPassword == "") {
      setHelperTextConfirmPassword("Please fill the form to continue.");
      setHelperTextOtp("")
      setHelperTextPassword("")
      return false;
    } 

    else if(!otp || otp.length < 6){
      setHelperTextOtp("Enter the valid otp to continue.")
    }
    
    else if (!password) {
      setHelperTextPassword("Enter a strong password to continue.");
      setHelperTextOtp("")
      return false;
    }

    else if (!passwordRegex.test(password)) {
      setHelperTextPassword("Enter a valid password. (e.g. : Twelve@12345)");
      return false;
    }

    else if (tagRegex.test(password)) {
      setHelperTextPassword("HTML Tags are not allowed in password.");
      return false;
    }

    else if (!confirmPassword) {
      setHelperTextConfirmPassword("Confirm your password to continue.");
      setHelperTextPassword("")
      return false;
    }

    else if (!passwordRegex.test(confirmPassword)) {
      setHelperTextConfirmPassword(
        "Confirm Password is invalid (e.g. : Twelve@123)."
      );
      return false;
    }

    else if (tagRegex.test(confirmPassword)) {
      setHelperTextConfirmPassword(
        "HTML Tags are not allowed in confirm password."
      );
      return false;
    }

    else if (password !== confirmPassword) {
      setHelperTextConfirmPassword(
        "Your entered password and confirm password do not match, please check again!"
      );
      return false;
    }

    else{
       // If all validations pass, prepare data for password reset
    const formData = { email: lastEmail, otp, password, confirmPassword };
    const obj = await resetPassword(formData);

    // Handle response
    if (obj?.errorCode === "CodeMismatchException") {
        dispatch(setActiveTabPassword(2));
    } else {
        dispatch(setActiveTabPassword(1));
    }
    }

   
  };

  

  return (
    <>
     <div className="stroke-1 my-3 mt-0">
     <div className="inputicontextdefault1 d-flex align-items-center">

         <OtpInput
               id="otpVerify"
               onChange={(otp) => {
                // Filter out non-numeric characters
                const numericOtp = otp.replace(/\D/g, '');
                setOtp(numericOtp);
            }}
                value={otp}
                numInputs={6}
                type="text"
                renderInput={(props, index) => (
                <input
                  autoFocus={index === 0} // Only autofocus the first input box
                  {...props}
                  key={index}
                  style={{ 
                    display: "inline-block",
                    width: "40px",
                    height: "40px",
                    marginRight: "10px",
                    textAlign: "center",
                    fontSize: "18px",
                    border: "2px solid #8f9096",
                    borderRadius: "50px",
                    background: "rgb(232, 232, 232)",
                }}
                />
               )}
            />

          </div>
          {helperTextOtp && (
                <div className="helper-text" style={{fontSize:"14px"}}>{helperTextOtp}</div>
        )}
        </div>

      <div className="stroke-1 my-3 mt-4">
        <div className="inputicontextdefault1 d-flex align-items-center">
          <Input
            variant='standard'
            type="password"
            id="newPassword"
            name="password"
            placeholder="New Password"
            className="containertext1 w-100 me-2"
            value={password}
            onInput={(e) => {
              setHelperTextPassword("");
              handlePassword(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            ref={businessPasswordRef}
            startAdornment={<InputAdornment position="start"> <img className="job-icon" alt="" src="/signup/Signup/public/lock.svg" /> </InputAdornment>}
          />
          <div className="right-content2" style={{width:"0px"}}>
                    <img
                      className="linear-iconseye-slash2"
                      alt=""
                      src={imgSrc}
                      onClick={showPassword}
                      style={{height:"20px"}} 
                    />
                  </div>
        </div>
        {helperTextPassword && (
                <div className="helper-text" style={{fontSize:"14px"}}>{helperTextPassword}</div>
        )}
      </div>

      <div className="stroke-1 my-3 mt-4">
        <div className="inputicontextdefault1 d-flex align-items-center">

          <div className="divider1"></div>
          <Input
            variant='standard'
            type="password"
            id="confirmNewPassword"
            name="password"
            placeholder="Confirm Password"
            className="containertext1 w-100 me-2"
            value = {confirmPassword}
            ref={confirmPasswordRef}
            maxLength={64}
            onInput={(e) => {
              setHelperTextConfirmPassword("");
              handleConfirmPassword(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onCopy={handleCopyPaste}
            onPaste={handleCopyPaste}
            onCut={handleCopyPaste}
            startAdornment={<InputAdornment position="start"> <img className="job-icon" alt="" src="/signup/Signup/public/lock.svg" /> </InputAdornment>}
          />
          <div className="right-content2" style={{width:"0px"}}>
                    <img
                      className="linear-iconseye-slash2"
                      alt=""
                      src={imgSrc2}
                      onClick={showConfirmPassword}
                      style={{height:"20px"}} 
                    />
                  </div>
        </div>
      </div>

      {helperTextConfirmPassword && (
                <div className="helper-text" style={{fontSize:"14px"}}>{helperTextConfirmPassword}</div>
              )}
        <br/>
            {passwordFormatToggle ? (
              <>
                <div
                  className=""
                  style={{
                    fontSize: "14px",
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
                  <span ref={minLengthRef}>Between 8-64 characters, </span>
                  <span ref={specialCharRef}>
                    at least one special character,{" "}
                  </span>
                  <span ref={numberRef}>at least one number (0-9).</span>
                </div>
              </>
            ) : (
              <></>
            )}

      <div className="stroke-3 mt-3">
        <button className="btn btn-action p-l-m rounded-pill shadow w-100 text-center d-flex justify-content-center" type="button" id="button-main2" onClick={updatePassword} style={{ cursor: "pointer" }}>
          <div id="button-textTwo" style={{ marginLeft: "inherit", width: "100px" }}>
            <div className="text-nowrap">Reset Password</div>
          </div>
          <div id="button-loaderTwo" style={{ marginLeft: "inherit" }}>
            <img className="google-icon" alt="" src="/signup/Signup/public/loader.gif" />
          </div>
        </button>
        </div>
      {/* Centered "Back" button */}
    <div className="d-flex justify-content-center align-items-center">
    <button 
        type="button" 
        className="btn mt-2 d-flex justify-content-center align-items-center" 
        onClick={() => { dispatch(setActiveTabPassword(1)) }}
        style={{ cursor: "pointer" }}
    >
        <img style={{ width: "22px" }} src="/back2.png" alt="Back icon" />
        <span style={{ fontWeight: 700, marginLeft: "2px", fontSize: "16px" }}>Back</span>
    </button>
    </div>
      
    </>
  );
};