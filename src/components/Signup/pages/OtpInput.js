import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import "../css/otpinput.css";

const OtpInput = forwardRef((props, ref) => {
  const { onEnterPress } = props;

  const [inputs, setInputs] = useState([]);
  const [verifyBtnDisabled, setVerifyBtnDisabled] = useState(true);

  useEffect(() => {
    const form = document.querySelector("#otp-form");
    const otpInputs = form.querySelectorAll(".otp-otp-input");
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
      sessionStorage.setItem("otp", text);
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
      sessionStorage.removeItem("otp");
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
    sessionStorage.removeItem("otp");
  };

  useImperativeHandle(ref, () => ({
    clearOtpInputs,
  }));

  return (
    <>
      <div className="otp-container">
        <form id="otp-form">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="number"
              className="otp-otp-input"
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

export default OtpInput;
