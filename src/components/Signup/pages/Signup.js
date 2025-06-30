import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listCountry } from "../js/sign-up";
import Select from "react-select";
import "../css/signUp.css";
import { useDispatch, useSelector } from "react-redux";
import { closeLoader, openLoader } from "../../../@redux/features/common";
import Axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import CustomModal from "../../structure/NewStructures/CustomModal";
import { toast } from "react-toastify";
import * as actions from "../../../@redux/action/onboardingAction";
import { PulseLoader } from "react-spinners";
import { MuiTelInput } from "mui-tel-input";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

Axios.defaults.withCredentials = true;

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 32,
  height: 32,
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
  backgroundColor: "black",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&::before": {
    display: "block",
    width: 32,
    height: 32,
    padding: 5,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "black",
  },
});

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "none" : "none",
    boxShadow: state.isFocused ? "none" : "none",
    width: "160px",
    height: "20px",
    fontWeight: 500,
    fontFamily: "DM Sans",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#4caf50"
      : state.isFocused
      ? "rgb(0,0,0,0.1)"
      : "#fff", // Background color when selected or focused
    color: state.isSelected ? "#fff" : state.isFocused ? "#000" : "#000", // Text color when selected or focused
    fontFamily: "DM Sans",
    "&:hover": {
      backgroundColor: "#f1f1f1", // Background color on hover
      color: "#000", // Text color on hover
    },
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 30px",
    gap: "10px",
    position: "relative",
    zIndex: "99 !important",
    fontWeight: 500,
  }),
  menu: (provided, state) => ({
    ...provided,
    minWidth: "160px",
    fontFamily: "DM Sans",
  }),
};

export function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const [helperTextEmail, setHelperTextEmail] = useState(``);
  const [helperTextCC, setHelperTextCC] = useState(``);
  const [helperTextPhone, setHelperTextPhone] = useState(``);
  const [helperTextPassword, setHelperTextPassword] = useState(``);
  const [helperTextConfirmPassword, setHelperTextConfirmPassword] =
    useState(``);

  const [countryList, setCountryList] = useState([]);
  const [countryCodeValues, setCountryCodeValues] = useState("+65");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [rightContentIcon2, setRightContentIcon2] = useState(
    "./icons/eye-slash.svg"
  );
  const [rightContentIcon3, setRightContentIcon3] = useState(
    "./icons/eye-slash.svg"
  );
  const [notifIcon, setNotifIcon] = useState("error.svg");

  const [passwordFormatToggle, setPasswordFormatToggle] = useState(false);

  const businessPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const signUpRef = useRef(null);
  const inputCheckboxRef = useRef(null);
  const errorSpanRef = useRef(null);
  const errorDivRef = useRef(null);
  const errorFrameRef = useRef(null);
  const helperTextConfirmPasswordRef = useRef(null);

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

  const res = useSelector((state) => state.onboarding?.ListCountryCode);

  useEffect(() => {
    const setPage = async () => {
      if (res.length > 0) {
        console.log(res);
        setCountryList(res);
      } else {
        setLoading(true);
        try {
          await dispatch(actions.listCountry());
          await dispatch(actions.listNationality());
          await dispatch(actions.listCountryCode());
        } catch (error) {
          console.error("Error fetching lists:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    setPage();
  }, [res]);

  const options = countryList.map((flag) => ({
    value: flag.ISD_country_code,
    label: (
      <div>
        <img
          src={`/flags/${flag.ISOcc_2char.toLowerCase()}.svg`}
          alt=""
          style={{
            marginRight: "5px",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "1px solid rgb(0, 0, 0, 0.4)",
          }}
        />
        <> </>
        {`+${flag.ISD_country_code}`}
      </div>
    ),
  }));

  const handleCountryCodeChange = (selectedOption) => {
    setCountryCodeValues(selectedOption);
  };

  const restrictInput = (e) => {
    var phoneNumber = e.target.value;
    // Get the current input value and remove any non-numeric characters
    const inputValue = phoneNumber.replace(/\D/g, "");

    // Define the desired phone number length range
    const maxLength = 15;

    if (inputValue.length > maxLength) {
      phoneNumber.value = inputValue.slice(0, maxLength);
    }

    setPhoneNumber(e.target.value);
  };

  const checkCountryCodeValue = () => {
    if (!countryCodeValues) {
      setHelperTextPhone("Select your mobile country code to continue!");
    } else {
      setHelperTextPhone("");
    }
  };

  const checkPhoneNumberValue = (inputValue) => {
    const minLength = 8;
    if (inputValue.length == 0) {
      setHelperTextPhone("");
    } else if (inputValue.length < minLength) {
      setHelperTextPhone(
        `Phone number must be at least ${minLength} digits long.`
      );
    } else {
      setHelperTextPhone(``);
    }
  };

  const now = new Date();
  const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}:${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}:${now.getFullYear().toString().slice(-2)}:${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  const validateEmail = (emailValue) => {
    if (emailValue) {
      // Check if email matches the regex pattern
      if (!emailRegex.test(emailValue)) {
        setHelperTextEmail("Enter a valid email address (e.g. : abc@xyz.com).");
        return false;
      }
      // Check if email contains HTML tags
      else if (tagRegex.test(emailValue)) {
        setHelperTextEmail("HTML tags are not allowed in a email address.");
        return false;
      }
      // If both validations pass
      else {
        setHelperTextEmail("");
        checkEmail(emailValue);
      }
    }
    // If email is not provided
    else {
      setHelperTextEmail("");
      return true;
    }
  };

  const checkEmail = async (emailValue) => {
    if (emailValue) {
      try {
        setEmailLoading(true);

        const response = await Axios.get(
          sessionStorage.getItem("baseUrl") +
            "/SignupRoutes/getcognitouserinfo",
          {
            params: {
              email: emailValue,
            },
          }
        );
        let obj = response.data;

        setEmailLoading(false);
        if (obj.errorCode) {
        } else if (obj.Username) {
          // helperTextRef.current.style.color = "brown";
          // helperTextRef.current.style.opacity = "1";
          // rightContentRef.current.style.display = "flex";
          // setRightContentIcon("error.svg");
          // setHelperText(`This email is already in use.`);
          // toast.error("This email is already in use.");

          setHelperTextEmail(`This email is already in use.`);
        }
      } catch (error) {
        setEmailLoading(false);
        setHelperTextEmail(``);
      }
    } else {
      setEmailLoading(false);
      setHelperTextEmail(``);
    }
  };

  const togglePasswordBtn = () => {
    var password2 = businessPasswordRef.current;

    if (password != "") {
      if (password2.getAttribute("type") == "password") {
        password2.setAttribute("type", "text");
        setRightContentIcon2("./icons/eye.svg");
      } else {
        password2.setAttribute("type", "password");
        setRightContentIcon2("./icons/eye-slash.svg");
      }
    }
  };

  const togglePasswordBtn2 = () => {
    var password2 = confirmPasswordRef.current;

    if (confirmPassword != "") {
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      signUpRef.current.click();
    }
  };

  const moveToLogin = () => {
    navigate("/");
  };

  let emailRegex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let tagRegex = /<.*?>/;
  let phoneNumberRegex = /^\d+$/;
  let passwordRegex =
    /^(?!\s+)(?!.*\s+$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[$^*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ])[A-Za-z0-9$^*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]{8,64}$/;

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

    if (allConditionsMet) {
      setPasswordFormatToggle(false);
    }

    matchPasswords(passwordVal);
  };

  const handleCopyPaste = (e) => {
    e.preventDefault();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const TCs = () => {
    return (
      <>
        <div style={{ padding: "0", height: "510px" }}>
          <iframe
            src="/TermsOfUse.pdf"
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="Terms and Conditions"
          ></iframe>
        </div>
      </>
    );
  };

  const handleSignUp = async () => {
    const checkbox = isChecked;
    phoneNumber.replace(/[\D\s]/g, "");

    if (!email) {
      setHelperTextEmail("Enter your email to continue.");
      return false;
    }

    if (!emailRegex.test(email)) {
      setHelperTextEmail("Enter a valid email (e.g. : abc@xyz.com).");
      return false;
    }

    if (tagRegex.test(email)) {
      setHelperTextEmail("HTML Tags are not allowed in a email address.");
      return false;
    }

    if (!countryCodeValues) {
      setHelperTextPhone("Enter your country code to continue.");
      return false;
    }

    if (!phoneNumber) {
      setHelperTextPhone("Enter your phone number to continue.");
      return false;
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
      setHelperTextPhone("Enter a valid phone number.");
      return false;
    }
    if (phoneNumber.length < 8) {
      setHelperTextPhone("Phone number must be at least 8 digits long.");
      return false;
    }

    if (!password) {
      setHelperTextPassword("Enter a strong password to continue.");
      return false;
    }

    if (!passwordRegex.test(password)) {
      setHelperTextPassword("Enter a valid password. (e.g. : Twelve@12345)");
      return false;
    }

    if (tagRegex.test(password)) {
      setHelperTextPassword("HTML Tags are not allowed in password.");
      return false;
    }

    if (!confirmPassword) {
      setHelperTextConfirmPassword("Confirm your password to continue.");
      return false;
    }

    if (!passwordRegex.test(confirmPassword)) {
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
      setHelperTextConfirmPassword(
        "Your entered password and confirm password do not match, please check again!"
      );
      return false;
    }

    if (!checkbox) {
      displayMessage(
        "Please accept the terms and conditions to continue.",
        "error"
      );
      return false;
    } else {
      displayMessage("", "reset");

      setLoading(true);

      try {
        let obj = await dispatch(
          actions.SignUp(
            email,
            password,
            phoneNumber,
            countryCodeValues?.slice(1) || countryCodeValues
          )
        );

        setLoading(false);

        if (obj.UserConfirmed === false) {
          sessionStorage.setItem("lastemail", email);
          sessionStorage.setItem(
            "countryCode",
            countryCodeValues?.slice(1) || countryCodeValues
          );
          sessionStorage.setItem("phoneNumber", phoneNumber);
          sessionStorage.setItem("_cookie", obj.UserSub);
          navigate("/verification");
        } else if (obj.errorCode) {
          let msg = obj.msg || obj.message;
          let errorMsg = msg?.split("operation: ")[1];

          switch (obj.errorCode) {
            case "UsernameExistsException":
              setHelperTextEmail(
                "Email-id already exists. Please use a different email."
              );
              break;
            case "InvalidPasswordException":
              setHelperTextPassword(
                "Invalid password format. Please use a stronger password."
              );
              break;
            case "InvalidParameterException":
              displayMessage(
                errorMsg
                  ? errorMsg
                  : "Something went wrong, please try again later!",
                "error"
              );
              break;
            case "ResourceNotFoundException":
              setHelperTextEmail(
                "The entered email is not registered with us. Please use a different email."
              );
              break;
            default:
              displayMessage(
                errorMsg
                  ? errorMsg
                  : "Something went wrong, please try again later!",
                "error"
              );
          }
        }
      } catch (error) {
        console.error("Error occurred during sign up:", error);
        setLoading(false);
        displayMessage("An error occurred. Please try again later.", "error");
      }
    }
  };

  const [isChecked, setIsChecked] = useState(false); // Track the state of the checkbox

  const handleChange = (event) => {
    setIsChecked(event.target.checked); // Update state based on the checked value
    console.log("Checkbox is now:", event.target.checked); // Debugging
  };

  // Inspired by blueprintjs
  function BpCheckbox(props) {
    return (
      <Checkbox
        sx={{ "&:hover": { bgcolor: "transparent" } }}
        disableRipple
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
        inputProps={{ "aria-label": "Checkbox demo" }}
        {...props}
        checked={isChecked} // Bind the state to the checked property
        onChange={handleChange} // Listen for changes to the checkbox
      />
    );
  }

  return (
    <div className="su-sign-up2">
      <div className="main-div">
        <form className="su-frame-parent">
          <div className="su-create-account-wrapper">
            <h2 className="su-create-account">Create Account</h2>
          </div>
          <div className="su-inputs-parent">
            <div className="su-inputs1">
              <div className="su-label-frame">
                <div className="su-label">Label</div>
                <div className="su-input-frame">
                  <input
                    maxLength={40}
                    className="su-left-content"
                    placeholder="Business Email"
                    type="email"
                    value={email}
                    onInput={(e) => {
                      setHelperTextEmail(``);
                      setEmail(e.target.value);
                    }}
                    onBlur={(e) => {
                      validateEmail(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                  />

                  <PulseLoader color="black" loading={emailLoading} size={4} />
                </div>
              </div>
              {helperTextEmail && (
                <div className="helper-text">{helperTextEmail}</div>
              )}
            </div>

            <div className="su-input-mask">
              <div className="su-label-frame1">
                <div className="su-label1">Label</div>
                <div className="su-input-frame15">
                  <div className="su-left-content1">
                    {/*<Select
                      name="countryCode"
                      id="countryCode"
                      className="su-form-input"
                      options={options}
                      styles={customStyles}
                      value={countryCodeValues}
                      onChange={handleCountryCodeChange}
                      onBlur={checkCountryCodeValue}
                    ></Select>
                    <div className="su-textcursor">
                      <input
                        maxLength={15}
                        type="number"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        className="su-containertext1"
                        value={phoneNumber}
                        onInput={(e) => {
                          setHelperTextPhone("");
                          restrictInput(e);
                        }}
                        onBlur={(e) => checkPhoneNumberValue(e.target.value)}
                        onKeyDown={(e) => {
                          const exceptThisSymbols = ["e", "E", "+", "-", "."];
                          exceptThisSymbols.includes(e.key) &&
                            e.preventDefault();
                        }}
                      />
                    </div>*/}
                    <MuiTelInput
                      value={`${countryCodeValues}${phoneNumber}`}
                      onChange={(e) => {
                        if (e) {
                          // Split phone string based on space separator
                          let phone = e.split(" ");
                          // Extract country code (without '+')
                          let cc = phone[0];

                          // Set the extracted country code
                          setCountryCodeValues(cc);

                          // Rejoin the remaining phone number parts (if any) as a single string
                          let phoneWithoutCC = phone.slice(1).join(" ");

                          // Check and limit the length of phoneWithoutCC to a maximum of 15 characters
                          if (phoneWithoutCC.length <= 15) {
                            setPhoneNumber(
                              phoneWithoutCC.replace(/[\D\s]/g, "")
                            );
                          }
                        }
                      }}
                      placeholder="Phone number with country code."
                      sx={{
                        "& .MuiInputBase-input": {
                          padding: "8px",
                          fontFamily: "inherit",
                          fontWeight: 500,
                          color: "rgba(0,0,0)",
                          fontSize: "15px",
                          width: "16rem",
                          letterSpacing: 0,
                        },
                        "& .MuiOutlinedInput-root": {
                          paddingLeft: "0",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              {helperTextPhone && (
                <div className="helper-text">{helperTextPhone}</div>
              )}
            </div>

            <div className="su-inputs3">
              <div className="su-label-frame3">
                <div className="su-label3">Label</div>
                <div className="su-input-frame3">
                  <input
                    maxLength={64}
                    className="su-left-content"
                    placeholder="Create a strong password"
                    type="password"
                    value={password}
                    onInput={(e) => {
                      setHelperTextPassword("");
                      handlePassword(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    ref={businessPasswordRef}
                  />

                  <div className="su-right-content1">
                    <img
                      className="su-linear-iconseye-slash2"
                      alt=""
                      src={rightContentIcon2}
                      onClick={togglePasswordBtn}
                    />
                  </div>
                </div>
              </div>
              {helperTextPassword && (
                <div className="helper-text">{helperTextPassword}</div>
              )}
            </div>

            <div className="su-inputs3">
              <div className="su-label-frame3">
                <div className="su-label3">Label</div>
                <div className="su-input-frame3">
                  <input
                    maxLength={64}
                    className="su-left-content"
                    placeholder="Confirm Your Password"
                    type="password"
                    value={confirmPassword}
                    ref={confirmPasswordRef}
                    onInput={(e) => {
                      setHelperTextConfirmPassword("");
                      handleConfirmPassword(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    onCopy={handleCopyPaste}
                    onPaste={handleCopyPaste}
                    onCut={handleCopyPaste}
                  />

                  <div className="su-right-content2">
                    <img
                      className="su-linear-iconseye-slash2"
                      alt=""
                      src={rightContentIcon3}
                      onClick={togglePasswordBtn2}
                    />
                  </div>
                </div>
              </div>
              {helperTextConfirmPassword && (
                <div className="helper-text">{helperTextConfirmPassword}</div>
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
          </div>

          <div className="su-basic-components-control-ele-parent">
            <div className="su-basic-components-control-ele">
              {/* <div className="su-rectangle-parent">
                <div className="su-checked1">
                  <div className="su-group">
                    <div className="su-checkbox-wrapper-18">
                      <div className="su-round">
                        <input
                          type="checkbox"
                          id="checkbox-18"
                          ref={inputCheckboxRef}
                        />
                        <label for="checkbox-18"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <BpCheckbox />

              <div className="su-wrapper">
                <div className="su-div" style={{ fontWeight: 600 }}>
                  <span className="su-accept">
                    By clicking this, I agree to Zoqq's{" "}
                  </span>
                  <label
                    className="su-legal-agreements fw-bold text-decoration-underline"
                    onClick={handleOpenModal}
                  >
                    Terms & Policies
                  </label>{" "}
                  and{" "}
                  <label
                    className="su-legal-agreements fw-bold text-decoration-underline"
                    onClick={handleOpenModal}
                  >
                    Connected Account User Terms
                  </label>
                  .
                </div>
              </div>
            </div>

            <div
              className="su-inputs1"
              style={{ display: "none" }}
              ref={errorDivRef}
            >
              <div className="su-label-frame">
                <div className="su-input-frame error-div" ref={errorFrameRef}>
                  <div className="su-left-content error-message">
                    <img src={notifIcon} alt="" width={20} />
                    <span ref={errorSpanRef} style={{ fontSize: "11px" }}>
                      Something went wrong, please try again later.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="su-text-button"
              type="button"
              ref={signUpRef}
              onClick={handleSignUp}
              disabled={isLoading}
            >
              <div className="su-linear-iconsplaceholder1">
                <div className="su-vector1"></div>
              </div>
              {isLoading ? (
                <>
                  <PulseLoader size={12} />
                </>
              ) : (
                <>
                  <b className="su-button1">Sign Up</b>
                </>
              )}

              <div className="su-linear-iconsplaceholder2">
                <div className="su-vector2"></div>
              </div>
            </button>
          </div>
        </form>
        <div className="su-sign-up-inner2 mt-5">
          <div className="su-frame-group">
            <div className="su-already-have-an-account-wrapper">
              <b className="su-already-have-an">Already Have an Account?</b>
            </div>
            <button
              className="su-text-button1"
              type="button"
              onClick={moveToLogin}
            >
              <img className="su-linear-iconsarrow-left" alt="" />

              <img className="su-linear-iconsarrow-left1" alt="" />

              <b className="su-more">Sign In</b>
              <div className="su-linear-iconsplaceholder3">
                <div className="su-vector3"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        children={<TCs />}
        headerText="Zoqq's Terms Of Use"
      />
    </div>
  );
}

export default SignUp;
