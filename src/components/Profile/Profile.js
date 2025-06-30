import React, { useEffect } from "react";
import { useRef, useState } from "react";
import BreadCrumbs from "../structure/BreadCrumbs";
import SideBar from "../SideBar";
import CustomTextField from "../structure/CustomText";
import CustomSelect from "../structure/CustomSelect";
import "./css/profile.css";
import ContentLoader from "react-content-loader";
import Axios from "axios";

export const FetchCognitoDetails = async () => {
  var email = sessionStorage.getItem("lastemail");
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/getcognitouserinfo", {
      params: {
        email: email,
      },
    });

    let data = response.data;
    let userAttr = data.userAttributes;
    let json = {};
    if (userAttr.length > 0) {
      const phoneNumber = userAttr.find((attr) => attr.name === "phone_number");
      const countryName = userAttr.find((attr) => attr.name === "custom:countryName");
      const isdCode = userAttr.find((attr) => attr.name === "custom:isd_code");

      const contactName = userAttr.find((attr) => attr.name === "custom:contactName");
      if (contactName) {
        var name = contactName.value.split(" ");
        var firstName = name[0];
        var lastName = name[1];

        if (firstName && firstName !== "") {
          json.firstName = firstName;
        }

        if (lastName && lastName !== "") {
          json.lastName = lastName;
        }
      }

      if (phoneNumber) {
        var number = phoneNumber.value.split("+");
        json.phoneNumber = number[1];
      }

      if (countryName) {
        json.countryName = countryName.value;
      }

      if (isdCode) {
        json.countryCode = isdCode.value;
      }

      json.status = "SUCCESS";

      return JSON.stringify(json);
    } else {
      console.log("No results found for the following email: " + email);
      return JSON.stringify({ status: "BAD_REQUEST", message: `No results found for the following email: ${email}` });
    }
  } catch (error) {
    console.log("Something went wrong: ", error);
    return JSON.stringify({ status: "BAD_REQUEST", message: `Something went wrong. ${error.message}` });
  }
};

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const SetPage = async () => {
      const userDetails = await FetchCognitoDetails();

      setIsLoading(false);

      var res1 = sessionStorage.getItem("listCountry");
      var listCountry = JSON.parse(res1);

      var res2 = sessionStorage.getItem("listMobileCountryCode");
      var listMobileCountryCode = JSON.parse(res2);

      //Fixing Country List
      if (listCountry != null && listCountry.length > 0) {
        var List = listCountry;
        if (List.length > 0) {
          var select = document.getElementById("profileCountryName");
          if (select) {
            List.forEach((item) => {
              var option = document.createElement("option");
              option.value = item.ISOcc_2char;
              option.text = item.country_name;

              // Append the option to the select elements
              select.appendChild(option.cloneNode(true));
            });
          }
        } else {
          console.log("Country List Could Not Be Generated");
        }
      }

      //Fixing Country Code List
      if (listMobileCountryCode != null && listMobileCountryCode.length > 0) {
        var List2 = listMobileCountryCode;
        if (List2.length > 0) {
          var select2 = document.getElementById("profileCountryCode");
          if (select2) {
            List.forEach((item) => {
              var option = document.createElement("option");
              option.value = item.ISD_country_code;
              option.text = `${item.country_name} ( +${item.ISD_country_code} )`;

              // Append the option to the select elements
              select2.appendChild(option.cloneNode(true));
            });
          }
        } else {
          console.log("Country Code List Could Not Be Generated");
        }
      }

      if (userDetails !== null) {
        let obj = JSON.parse(userDetails);

        var FirstName = document.getElementById("profileFirstName");
        var LastName = document.getElementById("profileLastName");
        var CountryName = document.getElementById("profileCountryName");
        var CountryCode = document.getElementById("profileCountryCode");
        var PhoneNumber = document.getElementById("profilePhoneNumber");

        if (FirstName && LastName && CountryName && CountryCode && PhoneNumber) {
          FirstName.value = obj.firstName;
          LastName.value = obj.lastName;
          CountryName.value = obj.countryName;
          CountryCode.value = obj.countryCode;
          PhoneNumber.value = obj.phoneNumber;
        }
      }
    };

    SetPage();
  }, []);

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
  return (
    <>
      <style>
        {`h1, h2, h3, h4, h5{
          font-size:20px;
          text-transform:uppercase;
        }
        
        h3{
          text-align:center;
        }
        `}
      </style>
      <div>
        <div className="d-flex">
          <SideBar />
          <div className="container-fluid px-0 bg-light clear-left overflow-auto" style={{ height: "100vh" }}>
            <BreadCrumbs data={{ name: "Profile", img: "/arrows/arrowLeft.svg", backurl: "/" }} />

            {isLoading ? (
              <>Loading...</>
            ) : (
              <>
                <div className="w-75 bg-white p-5 mt-5 d-flex flex-column mx-auto">
                  <h3>Your Profile Details</h3>

                  <div onClick={handleImageClick} role="button">
                    <div className="d-flex align-items-center my-4 ">
                      <img src="/avatar.png" width={60} alt="" />
                      <input type="file" ref={inputRef} onChange={handleImageChange} style={{ display: "none" }} />
                      <h6 className="text-danger m-0 ms-2 ">Change Photo Profile</h6>
                    </div>
                  </div>
                  <div>
                    <h4>Personal Information</h4>

                    <div className="d-flex border-bottom mb-4">
                      <div className="d-flex my-4">
                        <img src="/profile/call-icon.svg" width={40} className="border-end my-auto px-2" />
                      </div>
                      <div className="input-group containertext w-100">
                        <input
                          type="text"
                          className="form-input w-100 border border-primary border-0 mx-3"
                          id="profileFirstName"
                        />
                        {/* <CustomTextField label="First Name" type="name" /> */}
                      </div>
                    </div>

                    <div className="d-flex border-bottom mb-4">
                      <div className="d-flex my-4">
                        <img src="/profile/call-icon.svg" width={40} className="border-end my-auto px-2" />
                      </div>
                      <div className="input-group containertext w-100">
                        <input
                          type="text"
                          className="form-input w-100 border border-primary border-0 mx-3"
                          id="profileLastName"
                        />
                        {/* <CustomTextField label="Last Name" type="name" /> */}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4>Contact Information</h4>

                    <div className="d-flex border-bottom mb-4">
                      <div className="d-flex my-4">
                        <img src="/payments/phone.svg" width={40} className="border-end my-auto px-2" />
                      </div>
                      <div className="input-group containertext w-100" style={{ display: "contents" }}>
                        <select
                          className="form-select w-50 border border-primary border-0 mx-3 select-custom"
                          id="profileCountryCode"
                        ></select>
                        <input
                          type="number"
                          maxLength="10"
                          className="form-input w-50 border border-primary border-0 mx-3"
                          id="profilePhoneNumber"
                        />
                        {/* <CustomTextField label="Phone Number" className="w-75" /> */}
                      </div>
                    </div>

                    <h6 style={{ textTransform: "uppercase" }}>Applicant Email</h6>
                    <div className="d-flex border-bottom mb-4">
                      <div className="d-flex my-4">
                        <img src="signup/Signup/public/job.svg" width={40} className="border-end my-auto px-2" />
                      </div>
                      <div className="input-group containertext w-100">
                        <input
                          type="text"
                          className="form-input w-100 border border-primary border-0 mx-3"
                          id="profileEmail"
                          value={sessionStorage.getItem("lastemail")}
                        />
                        {/* <CustomTextField label="Last Name" type="name" /> */}
                      </div>
                    </div>

                    <h4>Business Registered Country</h4>
                    <div className="d-flex border-bottom mb-4">
                      <div className="d-flex my-4">
                        <img src="/profile/maps.svg" width={40} className="border-end my-auto px-2" />
                      </div>
                      <div className="input-group containertext w-100">
                        <select
                          className="form-select border border-primary border-0 mx-3 select-custom"
                          id="profileCountryName"
                        ></select>
                        {/* <CustomTextField label="Country" type="country" /> */}
                      </div>
                    </div>

                    <a href="/onboarding/Home" style={{ fontSize: "small" }}>
                      Check Onboarding Details
                    </a>

                    <div className="d-flex">
                      <button className="btn w-50 blue100 border h-100 fw-500 py-3 my-3 me-1">CANCEL</button>

                      <button className="btn w-50 text-white bg-blue100 fw-500 py-3 my-3 ms-1">SAVE CHANGES</button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
