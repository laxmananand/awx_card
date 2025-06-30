import { ThreeDots } from "react-loader-spinner";
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import "../css/otpinput.css";
import "animate.css";

const OtpInput = forwardRef((props, ref) => {
  const { onEnterPress } = props;

  const [inputs, setInputs] = useState([]);
  const [verifyBtnDisabled, setVerifyBtnDisabled] = useState(true);

  useEffect(() => {
    const form = document.querySelector("#otp-form2");
    const otpInputs = form.querySelectorAll(".otp-otp-input2");
    setInputs(otpInputs);
  }, []);

  const isAllInputFilled = () => {
    return Array.from(inputs).every((item) => item.value);
  };

  const getOtpText = () => {
    let text = "";
    inputs.forEach((input) => {
      text += input.value;
    });
    return text;
  };

  const verifyOTP = () => {
    if (isAllInputFilled()) {
      const text = getOtpText();
      sessionStorage.setItem("reset-otp", text);
      setVerifyBtnDisabled(false);
    } else {
      setVerifyBtnDisabled(true);
    }
  };

  const toggleFilledClass = (field) => {
    if (field.value) {
      field.classList.add("otp-filled");
    } else {
      field.classList.remove("otp-filled");
    }
  };

  const handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;

    // Check if the input value is a digit using a regular expression
    if (!/^\d$/.test(value)) {
      target.value = ""; // Clear the input if it's not a digit
      return;
    }

    if (value && value.length > 1) {
      target.value = value.charAt(0);
      return;
    }

    toggleFilledClass(target);

    if (target.nextElementSibling) {
      target.nextElementSibling.focus();
    }

    verifyOTP();
  };

  const handlePaste = (e, currentIndex) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    inputs.forEach((item, index) => {
      if (index >= currentIndex && text[index - currentIndex]) {
        item.focus();
        item.value = text[index - currentIndex] || "";
        toggleFilledClass(item);
        verifyOTP();
      }
    });
  };

  const handleKeyDown = (e, currentIndex) => {
    if (e.keyCode === 8) {
      e.preventDefault();
      sessionStorage.removeItem("reset-otp");
      inputs[currentIndex].value = "";
      toggleFilledClass(inputs[currentIndex]);
      if (inputs[currentIndex - 1]) {
        inputs[currentIndex - 1].focus();
      }
    } else if (e.keyCode === 13) {
      e.preventDefault();
      if (isAllInputFilled()) {
        onEnterPress();
      }
    } else {
      if (inputs[currentIndex].value && inputs[currentIndex + 1]) {
        inputs[currentIndex + 1].focus();
      }
    }
  };

  const clearOtpInputs = () => {
    inputs.forEach((input) => {
      input.value = "";
      input.classList.remove("otp-filled");
    });
    setVerifyBtnDisabled(true);
    sessionStorage.removeItem("reset-otp");
  };

  useImperativeHandle(ref, () => ({
    clearOtpInputs,
  }));

  return (
    <>
      <div className="otp-container">
        <form id="otp-form2">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="number"
              className="otp-otp-input2"
              maxLength="1"
              onInput={handleInputChange}
              onPaste={(e) => handlePaste(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </form>
      </div>
    </>
  );
});

import { useDispatch } from "react-redux";
import * as actions from "../../../@redux/action/onboardingAction";

const OtpCheck = ({
  isLoading,
  close,
  setLoading,
  Reset2Fa,
  OpenOTPCheckModal,
}) => {
  const otpInputRef = useRef();
  const dispatch = useDispatch();
  const [helperColor, setHelperColor] = useState(null);
  const [helperText, setHelperText] = useState(null);
  const [resendCode, setResendCode] = useState(false);

  const handleClearOtp = () => {
    if (otpInputRef.current) {
      otpInputRef.current.clearOtpInputs();
    }
  };

  const VerifyCode = async () => {
    let email = sessionStorage.getItem("lastemail");
    let otp = sessionStorage.getItem("reset-otp");

    if (!email) {
      setHelperColor("text-danger");
      setHelperText(["Email not found, please sign-in again!", ""]);

      // setHelperText(null);
      return;
    }

    if (!otp) {
      setHelperColor("text-danger");
      setHelperText(["Please enter your OTP to continue!", ""]);

      // setHelperText(null);
      return;
    }

    if (otp.length < 6) {
      setHelperColor("text-danger");
      setHelperText(["Entered OTP must be 6-digits in length!", ""]);

      // setHelperText(null);
      return;
    }

    try {
      let params = {
        email: email,
        otp: otp,
      };
      let response = await dispatch(
        actions.VerifyResetOTP(params, { setLoading })
      );
      if (response?.message?.includes("successful")) {
        setHelperColor("text-success");
        setHelperText([
          "OTP verified successfully: ",
          "Resetting your 2FA information...",
        ]);

        setTimeout(() => {
          close();
          Reset2Fa();
        }, 2500);
      } else {
        setHelperColor("text-danger");
        setHelperText([
          response?.message + ". Re-send code and try again...",
          "",
        ]);

        if (
          response?.message?.toLowerCase().includes("expired") ||
          response?.message?.toLowerCase().includes("incorrect")
        ) {
          setResendCode(true);
        } else {
          setResendCode(false);
        }
        handleClearOtp();
      }
    } catch (error) {
      setHelperColor("text-danger");
      setHelperText(["Something went wrong: INTERNAL_SERVER_ERROR", ""]);
      console.log("Error at OpenOTPCheckModal: ", error);

      // setHelperText(null);
      handleClearOtp();
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <>
      <div className="otp-check-modal border p-2 bg-white rounded-4 shadow">
        <div className="otp-check-header text-uppercase fs-6 fw-bold mt-2 d-flex justify-content-between align-items-center px-2">
          <div></div>
          Verify OTP (One-Time Password)
          <div onClick={() => close()} className="cross">
            ❌
          </div>
        </div>

        <hr />
        <div className="otp-check-body d-flex flex-column gap-5 align-items-center">
          <span className="text-start px-3">
            <span className="opacity-75">
              An email has been sent to you with a verification code, please
              enter it below to continue.{" "}
            </span>

            <span className="text-danger opacity-100 fw-bold">
              (Note: The OTP is valid for only 5 minutes.)**
            </span>
          </span>

          <OtpInput ref={otpInputRef} onEnterPress={VerifyCode} />

          <div className="d-flex align-items-center justify-content-center flex-column gap-2 w-100">
            <button
              disabled={isLoading}
              className="otp-check-button my-2 text-center w-75 d-flex align-items-center justify-content-center"
              type="button"
              onClick={VerifyCode}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {isLoading ? (
                <>
                  {" "}
                  <ThreeDots
                    visible={true}
                    height="25"
                    width="30"
                    color={isHovered ? "white" : "black"}
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </>
              ) : (
                <>Verify & Update 🚀</>
              )}
            </button>

            {helperText ? (
              <div className="d-flex flex-column gap-1 align-items-center fw-500 mb-3">
                <span className={`${helperColor} opacity-100`}>
                  {helperText[0]}{" "}
                  <span className="animate__animated animate__flash animate__infinite">
                    {helperText[1]}
                  </span>
                </span>

                {resendCode ? (
                  <span
                    className="w-100 text-center text-secondary text-decoration-underline"
                    onClick={() => {
                      close();
                      OpenOTPCheckModal();
                    }}
                  >
                    Re-send verification code
                  </span>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpCheck;
