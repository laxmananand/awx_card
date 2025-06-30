import React, { useEffect } from "react";
import { useRef, useState } from "react";
import "./new-profile.css";
import Axios from "axios";
import { ScaleLoader } from "react-spinners";
import CustomInput from "../components/structure/NewStructures/CustomInput";
import CustomSelect from "../components/structure/NewStructures/CustomSelect";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../@redux/action/onboardingAction";
import { MuiTelInput } from "mui-tel-input";

const NewProfile = ({ close }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [loaderText, setLoaderText] = useState(
    "Loading Your Profile Info. Please Wait..."
  );

  const [personName, setPersonName] = useState("");
  const [email, setEmail] = useState(sessionStorage.getItem("lastemail"));
  const [phoneNumber, setPhoneNumber] = useState("");

  const listCountry = useSelector(
    (state) => state.onboarding?.ListCountryZOQQ ?? []
  ).map((item) => ({
    value: item.ISOcc_2char,
    label: item.country_name,
  }));

  const listCountryCode = useSelector(
    (state) => state.onboarding?.ListCountryCode ?? []
  ).map((item) => ({
    value: item.ISD_country_code,
    label: `${item.country_name} (+${item.ISD_country_code})`,
  }));

  const [listCountryValue, setListCountryValue] = useState(null);
  const [listCountryCodeValue, setListCountryCodeValue] = useState(null);

  const [userDetailsInitial, setUserDetailsInitial] = useState({});

  const userDetails = useSelector(
    (state) => state.onboarding?.UserCognitoDetails
  );
  const contactName = useSelector((state) => state.onboarding?.contactName);

  useEffect(() => {
    const SetPage = async () => {
      if (userDetails) {
        let obj = userDetails?.userAttributes;

        let name = obj.find(
          (item) => item.name === "custom:contactName"
        )?.value;

        let country = obj.find(
          (item) => item.name === "custom:countryName"
        )?.value;
        let cc = obj.find((item) => item.name === "custom:isd_code")?.value;
        let phoneNo = obj.find((item) => item.name === "phone_number")?.value;

        setPersonName(name);
        setListCountryValue(country);
        setListCountryCodeValue("+" + cc);

        setPhoneNumber(phoneNo);

        let initialState = {
          personName: name,
          countryCode: cc,
          phoneNumber: phoneNo,
        };
        setUserDetailsInitial(initialState);
      }

      setIsLoading(false);
    };

    SetPage();
  }, [userDetails]);

  const inputRef = useRef(null);
  const [image, setImage] = useState("");

  const handleImageClick = () => {
    inputRef.current.click();
  };
  const handleImageChange = (event) => {
    const file = event.target.file[0];
    console.log(file);
    setImage("");
  };

  const handleUpdateAttr = async () => {
    let params = { email: email, type: "update" };

    if (personName !== userDetailsInitial.personName) {
      params.personName = personName;
    }

    let phone2 = phoneNumber;

    if (phone2 !== userDetailsInitial.phoneNumber) {
      // Extract the country code (without '+')
      let cc2 = phone2.split(" ")[0].replace("+", ""); // This will give '54'

      // Extract the phone number
      let phoneNumber2 = phone2.split(" ").slice(1).join("").replace(/\s/g, ""); // This will give '8965894569'

      // Output results
      if (cc2 !== userDetailsInitial.cc) {
        params.countrycode = cc2;
      }

      params.phoneNumber = phoneNumber2;

      console.log("Country Code (cc):", cc2); // Output: '54'
      console.log("Phone Number:", phoneNumber2); // Output: '8965894569'
    }

    let allowedKeys = ["email", "type"];
    let otherKeys = Object.keys(params).filter(
      (key) => !allowedKeys.includes(key)
    );

    if (otherKeys.length > 0) {
      console.log("params", params);
      try {
        setIsLoading(true);
        setLoaderText("Updating Your Profile. Please Wait...");
        let obj = await dispatch(actions.HandleBusinessDetails(params));
        setIsLoading(false);
        setLoaderText("Loading Your Profile Info. Please Wait...");

        if (obj.ResponseMetadata?.HTTPStatusCode == 200) {
          toast.success("Your profile has been updated successfully.");
        } else if (obj.errorCode) {
          let msg = obj.msg || obj.message;
          let reason = msg.split("operation: ")[1];
          toast.error("Profile Update Failed: " + reason + "...");
        } else {
          toast.error("Profile Update Failed: INTERNAL_SERVER_ERROR");
        }
      } catch (error) {
        setIsLoading(false);
        setLoaderText("Loading Your Profile Info. Please Wait...");
        console.log("Something went wrong: ", error);
        toast.error("Profile Update Failed: INTERNAL_SERVER_ERROR");
      }
    } else {
      toast.warn("No changes detected. Please modify a value to proceed.");
      return;
    }
  };

  return (
    <>
      <div>
        {isLoading ? (
          <>
            <div
              className="p-5 d-flex flex-column align-items-center justify-content-center gap-5"
              style={{ height: "520px" }}
            >
              <ScaleLoader size={50} color="black" />
              {loaderText}
            </div>
          </>
        ) : (
          <>
            <div
              className="bg-white d-flex flex-column mx-auto overflow-scroll"
              style={{ height: "520px" }}
            >
              <div className="group-section">
                <h6>Profile</h6>

                <div className="np-group-row">
                  <h4>Update/View Profile</h4>
                  {/* <CustomSelect
                    id="countryOfOperation"
                    required
                    value={countryOfOperation}
                    onChange={setCountryOfOperation}
                    className="custom-select-class full-width" // Custom classname
                    style={{}} // Custom inline styles
                    label="Country Of Operation" // Label for the select
                    helperText="" // Helper text
                    options={listCountry}
                    isMulti={true}
                  /> */}
                  {/* <div>
                    <div className="d-flex align-items-center gap-3 ">
                      <img
                        src="/user.png"
                        width={50}
                        alt=""
                        style={{
                          borderRadius: "50%",
                          border: "2px solid var(--sea-70)",
                          padding: "3px",
                        }}
                      />
                      <div className="d-flex flex-column gap-2">
                        <input
                          type="file"
                          ref={inputRef}
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                        <button
                          className="upload-btn"
                          onClick={handleImageClick}
                        >
                          Upload
                        </button>
                        <span className="recom-size">
                          Recommended size 1:1, upto 2MB.
                        </span>
                      </div>
                    </div>
                  </div> */}
                  <div className="d-flex align-items-center justify-content-center gap-3 my-4">
                    <CustomInput
                      type="text"
                      id="profileFirstName"
                      placeholder="Enter your first name..."
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      className="custom-input-class full-width"
                      style={{}}
                      label="Full Name"
                      helperText=""
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="group-section">
                <h6>Contact Details</h6>
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div className="np-group-row-2">
                    {" "}
                    <CustomInput
                      type="text"
                      id="profileEmail"
                      placeholder="Enter your email Address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="custom-input-class full-width"
                      style={{}}
                      label="Email Address"
                      helperText=""
                      required
                      disabled={true}
                      maxLength={40}
                    />
                    <div>
                      <span style={{ fontSize: "13px", fontWeight: 400 }}>
                        Phone Number (with country code)*
                      </span>
                      <div className="d-flex align-items-center justify-content-start w-100 border rounded-pill py-1 px-3 my-3">
                        {/* <CustomSelect
                        id="profileCountryCode"
                        value={listCountryCodeValue}
                        onChange={setListCountryCodeValue}
                        className="custom-select-class full-width" // Custom classname
                        style={{}} // Custom inline styles
                        label="ISD Code" // Label for the select
                        helperText="" // Helper text
                        options={listCountryCode}
                      />

                      <CustomInput
                        type="text"
                        id="profilePhoneNumber"
                        placeholder="Enter your phone number..."
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (/^\d{0,15}$/.test(value)) {
                            setPhoneNumber(value);
                          }
                        }}
                        className="custom-input-class full-width"
                        style={{}}
                        label="Phone Number"
                        helperText=""
                      /> */}

                        <MuiTelInput
                          value={phoneNumber}
                          onChange={(e) => {
                            if (e) {
                              // Split phone string based on space separator
                              let phone = e.split(" ");
                              // Extract country code (without '+')
                              let cc = phone[0];

                              // Set the extracted country code
                              setListCountryValue(cc);

                              // Rejoin the remaining phone number parts (if any) as a single string
                              let phoneWithoutCC = phone.slice(1).join(" ");

                              // Check and limit the length of phoneWithoutCC to a maximum of 15 characters
                              if (phoneWithoutCC.length <= 15) {
                                setPhoneNumber(e);
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
                </div>
              </div>

              <div className="group-section">
                <h6>Additional Details</h6>
                <div className="d-flex align-items-center justify-content-center gap-3 w-100">
                  <div className="np-group-row-2">
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <CustomSelect
                        id="profileCountryName"
                        value={listCountryValue}
                        onChange={setListCountryValue}
                        className="custom-select-class full-width" // Custom classname
                        style={{}} // Custom inline styles
                        label="Business Registered Country" // Label for the select
                        helperText="" // Helper text
                        options={listCountry}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group-section-2">
                <Link to="/onboarding/Home" style={{ fontSize: "14px" }}>
                  Check onboarding details
                </Link>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-action rounded-pill p-l-b d-flex justify-content-center cancel"
                    onClick={close}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-action rounded-pill p-l-b d-flex justify-content-center save"
                    onClick={handleUpdateAttr}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NewProfile;
