import React, { useEffect, useState } from "react";
import SideBar from "../../../SideBar";
import Navbar from "../../../Navbar";
import { toast } from "react-toastify";
import Axios from "axios";
import { Link, useLocation } from "react-router-dom";
import ContentLoader from "react-content-loader";
import BreadCrumbs from "../../../structure/BreadCrumbs";
import { ReactSVG } from "react-svg";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";


function transformCamelCaseToWords(str) {
  // Break camelCase into words
  const words = str.replace(/([a-z])([A-Z])/g, "$1 $2").split(/(?=[A-Z])/);

  // Convert each word to uppercase
  const uppercaseWords = words.map((word) => word.toUpperCase());

  // Join the words with spaces
  const result = uppercaseWords.join(" ");

  return result;
}

export const GetRFIDetails = async () => {
  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  // Get the value of the 'transactionId' parameter
  const transactionId = urlParams.get("transactionId");

  // var customerHashId = sessionStorage.getItem("customerHashId");
  let customerHashId = useSelector((state) => state.onboarding?.UserOnboardingDetails?.customerHashId);
  var region = "SG";

  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetTransactionRFIDetails", {
      params: { transactionId: transactionId, customerHashId: customerHashId },
    });

    let obj2 = response.data;
    let obj = [];

    if (obj2 && obj2.content) {
      obj = obj2.content;
    }
    if (obj.status == "BAD_REQUEST") {
      toast.error("Cannot fetch RFI Details, please contact your admin.");
      return [];
    } else if (obj && obj.length >= 0) {
      return obj;
    } else {
      toast.error("Something went wrong please try again later.");
      return [];
    }
  } catch (error) {
    toast.error("Something went wrong please try again later.");
    return [];
  }
};

export const PaymentRFI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const list = ["pending", "approve"];
  const [status, setStatus] = useState(list[0]);
  const [rfiTemplate, setRfiTemplate] = useState([]);

  useEffect(() => {
    const SetPage = async () => {
      try {
        const rfiDetails = await GetRFIDetails();
        const rfiArray = rfiDetails[0].rfiDetails;
        if (rfiArray && rfiArray.length > 0) {
          setRfiTemplate(rfiArray);
        }
      } catch (error) {
        console.error("Error fetching RFI details:", error);
      }
    };

    SetPage();
  }, [rfiTemplate]);

  //Respond to RFI for all documents except other documents
  const submitRFITransaction = async (event) => {
    // Find the closest form element, starting from the target element
    const form = event.target.closest("form");
    let customerHashId = useSelector((state) => state.onboarding?.UserOnboardingDetails?.customerHashId);


    if (form) {
      const inputElement = form.querySelector("#templateName");
      let templateName = "";
      // Check if the input element is found
      if (inputElement) {
        // Access the value property to get the input's value
        const inputValue = inputElement.value;

        // Now you can use inputValue as the value of the input element
        templateName = inputValue;
      } else {
        console.error("Input element with ID 'templateName' not found.");
      }

      // Get the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      // Get the value of the 'transactionId' parameter
      const transactionId = urlParams.get("transactionId");

      const creds = {
        customerHashId: customerHashId,
        transactionId: transactionId,
        rfiName: templateName,
        templateId: form.querySelector("#templateId").value,
      };

      // Create a FormData object to handle file uploads
      const formData = new FormData(form);

      // Append individual properties of 'creds' to 'formData'
      formData.append("creds", JSON.stringify(creds));

      try {
        // Make an API request using Axios or another HTTP client library
        const response = await Axios.post(
          sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/RespondTransactionRFIDetails",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              // Add any other headers if needed
            },
          }
        );

        // Handle the API response
        let obj = response.data;
        if (obj.status === "BAD_REQUEST") {
          toast.error(`Something went wrong: ${obj.message}`);
        } else {
          toast.success(`RFI RESPONDED`);
        }
      } catch (error) {
        console.error("API request failed:", error);
      }
    } else {
      console.error("Form not found.");
    }
  };

  //Respond to RFI for other documents
  const submitRFIOtherDocumentTransaction = async (event) => {
    // Find the closest form element, starting from the target element
    const form = event.target.closest("form");

    if (form) {
      // Create a FormData object to handle file uploads
      const formData = new FormData(form);
      formData.append("caseId", sessionStorage.getItem("caseId"));
      formData.append("clientId", sessionStorage.getItem("clientId"));
      formData.append("region", "SG");
      formData.append(
        "brn",
        sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber")
      );
      formData.append("templateId", document.getElementById("templateId").value);
      formData.append("documentType", document.getElementById("documentTypeRFI").value);

      try {
        // Make an API request using Axios or another HTTP client library
        const response = await Axios.post(
          sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/RespondToRFIOtherDocument",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              // Add any other headers if needed
            },
          }
        );

        // Handle the API response
        let obj = response.data;
        if (obj.status === "BAD_REQUEST") {
          toast.error(`Something went wrong: ${obj.message}`);
        } else {
          toast.success(`RFI RESPONDED`);
        }
      } catch (error) {
        console.error("API request failed:", error);
      }
    } else {
      console.error("Form not found.");
    }
  };

  //Rendering elements functions - shouryadeep
  const [labels, setLabels] = useState([""]); // Initial array with an empty string

  const changeLabel = (index, e) => {
    let newLabel = e.target.value;
    const updatedLabels = [...labels];
    updatedLabels[index] = newLabel;
    setLabels(updatedLabels);
  };

  const addMore = () => {
    setLabels([...labels, ""]); // Add an empty string to the array
  };

  const deleteDiv = (index) => {
    const updatedLabels = [...labels];
    updatedLabels.splice(index, 1);
    setLabels(updatedLabels);
  };

  return (
    <div>
      <div className="d-flex">
        <SideBar />
        <div className="container-fluid px-0 bg-light clear-left overflow-auto" style={{ height: "100vh" }}>
          <BreadCrumbs
            data={{
              name: "Transaction RFI Details",
              img: "/accounts/accounts.svg",
              backurl: "/dashboard",
            }}
          />
          {isLoading ? (
            <>
              <div style={{ marginTop: "25px" }}>
                <ContentLoader viewBox="0 0 500 475" height={475} width={500} foregroundColor="#d3cfcf">
                  <circle cx="70.2" cy="73.2" r="41.3" />
                  <rect x="129.9" y="29.5" width="125.5" height="17" />
                  <rect x="129.9" y="64.7" width="296" height="17" />
                  <rect x="129.9" y="97.8" width="253.5" height="17" />
                  <rect x="129.9" y="132.3" width="212.5" height="17" />

                  <circle cx="70.7" cy="243.5" r="41.3" />
                  <rect x="130.4" y="199.9" width="125.5" height="17" />
                  <rect x="130.4" y="235" width="296" height="17" />
                  <rect x="130.4" y="268.2" width="253.5" height="17" />
                  <rect x="130.4" y="302.6" width="212.5" height="17" />

                  <circle cx="70.7" cy="412.7" r="41.3" />
                  <rect x="130.4" y="369" width="125.5" height="17" />
                  <rect x="130.4" y="404.2" width="296" height="17" />
                  <rect x="130.4" y="437.3" width="253.5" height="17" />
                  <rect x="130.4" y="471.8" width="212.5" height="17" />
                </ContentLoader>
              </div>
            </>
          ) : (
            <>
              <div
                className="container-fluid px-0 bg-light clear-left overflow-auto"
                id="main-container"
                style={{ height: "100vh" }}
              >
                <div className="navigationsub-parent" style={{ background: "white" }}>
                  {rfiTemplate.length === 0 ? (
                    <>
                      <div style={{ margin: "15px" }}>No RFI Details Available...</div>
                    </>
                  ) : (
                    <>
                      {rfiTemplate.map((RFItemplate, index) => (
                        <div className="accordion" id="accordionExample">
                          <div className="accordion-item border-0">
                            <button
                              className="accordion1 border-0"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse${index}`}
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              <div className={RFItemplate.rfiStatus == "RFI_RESPONDED" ? list[1] : list[0]}>
                                <div className="file-zip-parent">
                                  <ReactSVG
                                    src="/onboarding/accounts/applicationReview/kycDet.svg"
                                    beforeInjection={(svg) => {
                                      svg.setAttribute("style", "stroke: yellow");
                                      const paths = svg.querySelectorAll("path");
                                      paths.forEach((path) => {
                                        path.setAttribute(
                                          "stroke",
                                          RFItemplate.rfiStatus === "RFI_REQUESTED" ? "#E0990C" : "#099cbc"
                                        );
                                      });
                                    }}
                                    className="file-zip-icon"
                                  />
                                  <img
                                    className="edit-circle-icon1"
                                    alt=""
                                    src={
                                      "/onboarding/accounts/" +
                                      (RFItemplate.rfiStatus === "RFI_RESPONDED" ? list[1] : list[0]) +
                                      ".svg"
                                    }
                                  />
                                </div>
                              </div>
                              <div className="title4">
                                <div className="add-details-to1">
                                  {transformCamelCaseToWords(RFItemplate.description)}
                                  <span className="mx-1" style={{ color: "red" }}>
                                    *
                                  </span>
                                </div>
                                <div
                                  className={
                                    "bg-" +
                                    (RFItemplate.rfiStatus === "RFI_RESPONDED" ? list[1] : list[0]) +
                                    " text-start"
                                  }
                                >
                                  {RFItemplate.rfiStatus}
                                </div>
                              </div>
                              <div className="icon-open2">
                                <div className="chevron-up1">
                                  <img className="arrow-icon15" alt="" src="arrow2.svg" />
                                </div>
                              </div>
                            </button>
                            <div
                              id={`collapse${index}`}
                              className="accordion-collapse collapse"
                              aria-labelledby="headingOne"
                              data-bs-parent="#accordionExample"
                            >
                              <form className="form" id={`${RFItemplate.description}Form`}>
                                <>
                                  {RFItemplate.rfiStatus === "RFI_RESPONDED" ? (
                                    <>
                                      <div style={{ width: "100%", fontSize: "medium" }}>
                                        Your response to the RFI has been received. Kindly await further updates.
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <p style={{ width: "100%", color: "brown", paddingLeft: "12px" }}>
                                        Remarks: {RFItemplate.remarks}**
                                      </p>

                                      {RFItemplate.requiredData.map((requiredField, index) => (
                                        <>
                                          <input type="hidden" id="templateName" value={RFItemplate.description} />
                                          <input type="hidden" id="templateId" value={RFItemplate.rfiHashId} />
                                          {RFItemplate.description == "otherDocument" ? (
                                            <>
                                              {requiredField.type == "document" ? (
                                                <>
                                                  <div className="d-flex align-self-stretch">
                                                    <div className="input-group w-100 me-2 pb-0">
                                                      <select
                                                        className="form-input my-0 pb-0"
                                                        id="documentTypeRFI"
                                                        onChange={(e) => {
                                                          changeLabel(index, e);
                                                        }}
                                                      >
                                                        <option value=""></option>
                                                        <option value="BUSINESS_REGISTRATION_DOC">
                                                          Business Registration Document
                                                        </option>
                                                        <option value="TRUST_DEED">Trust Deed</option>
                                                        <option value="NATIONAL_ID">National ID</option>
                                                        <option value="PASSPORT">Passport</option>
                                                        <option value="DRIVER_LICENCE">Driver's Licence</option>
                                                        <option value="PARTNERSHIP_DEED">Partnership Deed</option>
                                                        <option value="ASSOCIATION_DEED">Association Deed</option>
                                                        <option value="PROOF_OF_ADDRESS">Proof Of Address</option>
                                                        <option value="LOA">Letter of Authorization</option>
                                                      </select>
                                                      <label htmlFor="country" className="form-input-label ps-1">
                                                        Please specify the type of document you'd like to upload.
                                                        <span className="mx-1" style={{ color: "red" }}>
                                                          *
                                                        </span>
                                                      </label>
                                                    </div>
                                                  </div>

                                                  {labels.map((label, index) => (
                                                    <div key={index} className="d-flex align-self-stretch browse1">
                                                      <div className="upload-document"></div>
                                                      <button
                                                        type="button"
                                                        className="browse-file1"
                                                        style={{ padding: "15px" }}
                                                      >
                                                        <div
                                                          className="drag-drop-or-group"
                                                          style={{ display: "block", width: "100%" }}
                                                        >
                                                          <input
                                                            type="file"
                                                            id={`file${index}`}
                                                            name={`file${index}`}
                                                            style={{ display: "block" }}
                                                          />
                                                        </div>
                                                      </button>
                                                    </div>
                                                  ))}

                                                  <Link to="#!" onClick={addMore} className="w-100 text-center">
                                                    ADD MORE
                                                  </Link>

                                                  <Link
                                                    to="#!"
                                                    onClick={() => deleteDiv(index)}
                                                    className="w-100 text-center text-danger"
                                                  >
                                                    DELETE SECTION
                                                  </Link>
                                                </>
                                              ) : (
                                                <></>
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              {requiredField.type == "document" ? (
                                                <>
                                                  <div class="d-flex align-self-stretch browse1">
                                                    <div class="upload-document">{requiredField.label}</div>
                                                    <button
                                                      type="button"
                                                      class="browse-file1"
                                                      style={{ padding: "15px" }}
                                                    >
                                                      <div
                                                        class="drag-drop-or-group"
                                                        style={{ display: "block", width: "100%" }}
                                                      >
                                                        <input
                                                          type="file"
                                                          id={requiredField.value}
                                                          name={requiredField.value}
                                                          style={{ display: "block" }}
                                                        />
                                                      </div>
                                                    </button>
                                                  </div>
                                                </>
                                              ) : (
                                                <>
                                                  <div className="d-flex align-self-stretch">
                                                    <div className="input-group w-100 me-2 pb-0">
                                                      {requiredField.value === "sourceOfFunds" ? (
                                                        <>
                                                          <select
                                                            className="form-input my-0 pb-0"
                                                            id={requiredField.value}
                                                            name={requiredField.value}
                                                          >
                                                            <option value=""></option>
                                                            <option value="Salary">Salary</option>
                                                            <option value="Personal Savings">Personal Savings</option>
                                                            <option value="Personal Wealth">Personal Wealth</option>
                                                            <option value="Retirement Funds">Retirement Funds</option>
                                                            <option value="Business Owner/Shareholder">
                                                              Business Owner/Shareholder
                                                            </option>
                                                            <option value="Loan Facility">Loan Facility</option>
                                                            <option value="Personal Account">Personal Account</option>
                                                            <option value="Corporate Account">Corporate Account</option>
                                                          </select>
                                                        </>
                                                      ) : (
                                                        <>
                                                          <input
                                                            id={requiredField.value}
                                                            name={requiredField.value}
                                                            className="form-input my-0 pb-0"
                                                            type={
                                                              requiredField.label?.toLowerCase().includes("date")
                                                                ? "date"
                                                                : "text"
                                                            }
                                                          />
                                                        </>
                                                      )}

                                                      <label htmlFor="country" className="form-input-label ps-1">
                                                        {requiredField.label}
                                                        <span className="mx-1" style={{ color: "red" }}>
                                                          *
                                                        </span>
                                                      </label>
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                            </>
                                          )}
                                        </>
                                      ))}
                                    </>
                                  )}
                                </>

                                {RFItemplate.rfiStatus === "RFI_RESPONDED" ? (
                                  <></>
                                ) : (
                                  <>
                                    {RFItemplate.description == "otherDocument" ? (
                                      <>
                                        <button
                                          className="submit-btn"
                                          id="submitRfiDetails"
                                          type="button"
                                          onClick={submitRFIOtherDocumentTransaction}
                                        >
                                          <img className="check-double-icon" alt="" src="check-double.svg" />
                                          <div className="label7 submitBtn">Submit</div>
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          className="submit-btn"
                                          id="submitRfiDetails"
                                          type="button"
                                          onClick={submitRFITransaction}
                                        >
                                          <img className="check-double-icon" alt="" src="check-double.svg" />
                                          <div className="label7 submitBtn">Submit</div>
                                        </button>
                                      </>
                                    )}
                                  </>
                                )}
                              </form>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentRFI;
