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
import * as actions from "../../../../@redux/action/onboardingAction";
import Embeded from "../Embedded";
import { CircularProgress, Card, Checkbox } from "@mui/material";
import { EditNote, FmdBad } from "@mui/icons-material";
import { CustomFileInput } from "./../../../structure/NewStructures/CustomFileInput";
import { CustomInput } from "./../../../structure/NewStructures/CustomInput";
import CustomSelect from "./../../../structure/NewStructures/CustomSelect";
import {
  fetchAccountRFIAWX,
  respondRFIAWX,
} from "../../../../@redux/action/auth";

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

function transformCamelCaseToWords(str) {
  // Break camelCase into words
  const words = str.replace(/([a-z])([A-Z])/g, "$1 $2").split(/(?=[A-Z])/);

  // Convert each word to uppercase
  const uppercaseWords = words.map((word) => word.toUpperCase());

  // Join the words with spaces
  const result = uppercaseWords.join(" ");

  return result;
}

// Optional helper component for address
const AddressGroup = ({ id, label, helperText, onChange, countryList }) => (
  <div className="d-flex flex-column gap-3">
    <label>{label}</label>
    <small>{helperText}</small>
    <CustomInput
      id={`${id}_line1`}
      placeholder="Address Line 1"
      label="Address Line 1"
      required
      onInput={(e) => onChange(id, { field: "address_line1", value: e })}
    />
    <CustomInput
      id={`${id}_line2`}
      placeholder="Address Line 2"
      label="Address Line 2"
      onInput={(e) => onChange(id, { field: "address_line2", value: e })}
    />
    <CustomInput
      id={`${id}_suburb`}
      placeholder="Suburb/City"
      label="Suburb/City"
      required
      onInput={(e) => onChange(id, { field: "suburb", value: e })}
    />
    <CustomInput
      id={`${id}_state`}
      placeholder="State"
      label="State"
      required
      onInput={(e) => onChange(id, { field: "state", value: e })}
    />
    <CustomInput
      id={`${id}_postcode`}
      placeholder="Postal Code"
      label="Postal Code"
      required
      onInput={(e) => onChange(id, { field: "postcode", value: e })}
    />
    <CustomSelect
      id={`${id}_country`}
      label="Country"
      options={countryList}
      required
      onChange={(e) => onChange(id, { field: "country_code", value: e?.value })}
    />
  </div>
);

const IdentityDocumentGroup = ({
  id,
  label,
  helperText,
  onChange,
  countryList,
  documentList,
}) => (
  <div className="d-flex flex-column gap-3">
    <label>{label}</label>
    <small>{helperText}</small>
    <CustomFileInput
      id={`${id}_front`}
      label="Front of ID"
      required
      onFileChange={(file) => onChange(id, { field: "front", value: file })}
    />
    <CustomFileInput
      id={`${id}_back`}
      label="Back of ID"
      required
      onFileChange={(file) => onChange(id, { field: "back", value: file })}
    />
    <CustomInput
      id={`${id}_number`}
      placeholder="Document Number"
      label="Document Number"
      required
      onInput={(e) => onChange(id, { field: "number", value: e })}
    />
    <CustomSelect
      id={`${id}_issuing_country`}
      options={countryList}
      label="Issuing Country"
      required
      onChange={(e) =>
        onChange(id, { field: "issuing_country", value: e?.value })
      }
    />
    <CustomSelect
      id={`${id}_type`}
      label="Document Type (e.g., PASSPORT)"
      options={documentList}
      required
      onChange={(e) => onChange(id, { field: "type", value: e?.value })}
    />
  </div>
);

const ConfirmationCheckbox = ({ id, label, helperText, onChange }) => (
  <div className="d-flex flex-column gap-2">
    <label>{label}</label>
    <small>{helperText}</small>
    <Checkbox onChange={(e) => onChange(id, e.target.checked)} />
  </div>
);

export const DynamicForm = ({ questions, onFileChange }) => {
  const identityDocumentTypes = [
    { label: "Driving License", value: "DRIVING_LICENSE" },
    { label: "Passport", value: "PASSPORT" },
    { label: "Identity Card", value: "IDENTITY_CARD" },
    { label: "Medicare Card", value: "MEDICARE_CARD" },
    { label: "SSN", value: "SSN" },
    { label: "ITIN", value: "ITIN" },
  ];

  const countries = useSelector((state) => state.onboarding.ListCountryZOQQ);
  const countryList = countries?.map((item) => ({
    label: item?.country_name,
    value: item?.ISOcc_2char,
  }));

  return (
    <form className="d-flex flex-column gap-5">
      {questions.map((question, index) => {
        const {
          id,
          key,
          title,
          description,
          answer: { type },
        } = question;

        const label = `${index + 1}. ${title?.en || key}`;
        const helperText = description?.en || "";

        switch (type) {
          case "TEXT":
            return (
              <CustomInput
                key={id}
                id={id}
                label={label}
                placeholder={label}
                required
                helperText={helperText}
                onInput={(e) => onFileChange(id, e)}
              />
            );

          case "ATTACHMENT":
            return (
              <CustomFileInput
                key={id}
                id={id}
                label={label}
                required
                accept="image/*,.pdf"
                helperText={helperText}
                onFileChange={(file) => onFileChange(id, file)}
              />
            );

          case "IDENTITY_DOCUMENT":
            return (
              <IdentityDocumentGroup
                key={id}
                id={id}
                label={label}
                helperText={helperText}
                onChange={(qid, { field, value }) => {
                  onFileChange(qid, (prev = {}) => ({
                    ...prev,
                    [field]: value,
                  }));
                }}
                countryList={countryList}
                documentList={identityDocumentTypes}
              />
            );

          case "ADDRESS":
            return (
              <AddressGroup
                key={id}
                id={id}
                label={label}
                helperText={helperText}
                onChange={(qid, { field, value }) => {
                  onFileChange(qid, (prev = {}) => ({
                    ...prev,
                    [field]: value,
                  }));
                }}
                countryList={countryList}
              />
            );

          case "CONFIRMATION":
            return (
              <ConfirmationCheckbox
                key={id}
                id={id}
                label={label}
                helperText={helperText}
                onChange={(value) => onFileChange(id, value)}
              />
            );

          default:
            return null;
        }
      })}
    </form>
  );
};

export const GetRFIDetails = async (
  caseId,
  clientId,
  region,
  { setIsLoading }
) => {
  try {
    //setIsLoading(true);
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetRFIDetails",
      {
        params: { caseId: caseId, clientId: clientId, region: region },
      }
    );

    let obj = response.data;
    //setIsLoading(false);
    if (obj.status == "BAD_REQUEST") {
      toast.error("Cannot fetch RFI Details, please contact your admin.");
      return [];
    } else if (obj.rfiTemplates && obj.rfiTemplates.length >= 0) {
      return obj;
    } else {
      toast.error("Something went wrong please try again later.");
      return [];
    }
  } catch (error) {
    //setIsLoading(false);

    toast.error("Something went wrong please try again later.");
    return [];
  }
};

export const rfiDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const list = ["pending", "approve"];
  const [status, setStatus] = useState(list[0]);
  const [rfiTemplate, setRfiTemplate] = useState([]);
  const dispatch = useDispatch();

  var caseId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.caseId
  );
  var clientId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.clientId
  );
  var region = useSelector((state) => state.onboarding?.region);
  var internalBusinessId = useSelector(
    (state) => state.onboarding?.UserStatusObj?.internalBusinessId
  );

  let documentType = useSelector(
    (state) => state.onboarding?.DocumentTypeValues
  );

  const platform = useSelector((state) => state.common.platform);
  const rfiDetails = useSelector((state) => state.onboarding.rfiDetails);
  const [show, setShow] = useState(false);
  const [type, setType] = useState("rfi");
  const [subType, setSubType] = useState("");

  useEffect(() => {
    const SetPage = async () => {
      try {
        setIsLoading(true);

        const rfiDetails = await GetRFIDetails(caseId, clientId, region, {
          setIsLoading,
        });
        const rfiArray = rfiDetails.rfiTemplates;
        if (rfiArray && rfiArray.length > 0) {
          setRfiTemplate(rfiArray);
        }
      } catch (error) {
        console.error("Error fetching RFI details:", error);
      }

      //Setting Constant Values for all fields
      await dispatch(actions.FetchEnumValues("businessType", region));
      await dispatch(actions.FetchEnumValues("listedExchange", region));
      await dispatch(actions.FetchEnumValues("totalEmployees", region));
      await dispatch(actions.FetchEnumValues("annualTurnover", region));
      await dispatch(actions.FetchEnumValues("industrySector", region));
      await dispatch(actions.FetchEnumValues("intendedUseOfAccount", region));
      await dispatch(actions.FetchEnumValues("position", region));
      await dispatch(actions.FetchEnumValues("countryName", region));
      await dispatch(actions.FetchEnumValues("unregulatedTrustType", region));
      await dispatch(actions.FetchEnumValues("documentType", region));

      if (region === "EU") {
        await dispatch(
          actions.FetchEnumValues("monthlyTransactionVolume", region)
        );
        await dispatch(actions.FetchEnumValues("monthlyTransactions", region));
        await dispatch(
          actions.FetchEnumValues("averageTransactionValue", region)
        );
      } else {
        setIsLoading(false);
      }
    };

    const SetPageAWX = async () => {
      try {
        setIsLoading(true);

        // setShow(true);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };

    if (platform === "nium") {
      SetPage();
    } else {
      SetPageAWX();
    }
  }, []);

  useEffect(() => {
    if (documentType) {
      console.log("Document Type: ", documentType);
    }
  }, [documentType]);

  //Respond to RFI for all documents except other documents
  const submitRFI = async (event) => {
    // Find the closest form element, starting from the target element
    const form = event.target.closest("form");

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

      // Create a FormData object to handle file uploads
      const formData = new FormData(form);
      formData.append("caseId", caseId);
      formData.append("clientId", clientId);
      formData.append("region", region);
      formData.append("name", templateName);
      formData.append("brn", internalBusinessId);

      try {
        // Make an API request using Axios or another HTTP client library
        const response = await axiosInstance.post(
          sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/RespondToRFI",
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
  const submitRFIOtherDocument = async (event) => {
    // Find the closest form element, starting from the target element
    const form = event.target.closest("form");

    if (form) {
      // Create a FormData object to handle file uploads
      const formData = new FormData(form);
      formData.append("caseId", caseId);
      formData.append("clientId", clientId);
      formData.append("region", region);
      formData.append("brn", internalBusinessId);
      formData.append("templateId", form.querySelector("#templateId").value);
      formData.append(
        "documentType",
        form.querySelector("#documentTypeRFI").value
      );

      if (form.querySelector("#documentTypeRFI").value === "Others") {
        formData.append(
          "otherDocumentType",
          form.querySelector("#OtherDocumentType").value
        );
      }

      try {
        // Make an API request using Axios or another HTTP client library
        const response = await axiosInstance.post(
          sessionStorage.getItem("baseUrl") +
            "/OnboardingRoutes/RespondToRFIOtherDocument",
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

    if (newLabel === "Others") {
      document.getElementById("OtherDocumentTypeDiv").style.display = "flex";
    } else {
      document.getElementById("OtherDocumentTypeDiv").style.display = "none";
    }
  };

  const addMore = () => {
    setLabels([...labels, ""]); // Add an empty string to the array
  };

  const deleteDiv = (index) => {
    const updatedLabels = [...labels];
    updatedLabels.splice(index, 1);
    setLabels(updatedLabels);
  };

  const [selectedRFI, setSelectedRFI] = useState(null);

  const handleRFIShow = (item) => {
    setSelectedRFI(item);
    setShow(true);
  };

  const getRfiMessage = (type) => {
    switch (type) {
      case "TRANSACTION":
        return {
          title: "Provide more information to release your transaction(s)",
          description:
            "Your transaction(s) are held under review. To release them, please provide the requested information as soon as possible.",
        };
      case "CARDHOLDER":
        return {
          title: "Provide more information to approve your cardholder(s)",
          description:
            "Your cardholder application(s) are held under review. To approve them, please provide the requested information as soon as possible.",
        };
      case "PAYMENT_ENABLEMENT":
        return {
          title: "Provide more information to release your payment(s)",
          description:
            "Your payment(s) are held under review. To approve them, please provide the requested information as soon as possible.",
        };
      default:
        return {
          title: "Additional information required",
          description:
            "Our onboarding team needs more information to approve your application.",
        };
    }
  };

  const authToken = useSelector((state) => state.common.authToken);
  const accountId = useSelector((state) => state.auth.awxAccountId);

  const CardholderContent = () => {
    const questions = selectedRFI.active_request.questions;
    const [formData, setFormData] = useState({});

    const handleFileChange = (id, valueOrUpdater) => {
      setFormData((prev) => {
        const newValue =
          typeof valueOrUpdater === "function"
            ? valueOrUpdater(prev[id])
            : valueOrUpdater;

        const updated = {
          ...prev,
          [id]: newValue,
        };

        console.log(`Updated formData for ${id}:`, updated);
        return updated;
      });
    };

    const uploadFileToAirwallex = async (file) => {
      if (!file) {
        throw new Error("No file provided for upload");
      }
      if (!(file instanceof File)) {
        console.error("Invalid file object:", file);
        throw new Error("Invalid file object");
      }
      if (!authToken) {
        console.error("No authToken provided");
        throw new Error("No authToken provided");
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          `${
            process.env.VITE_BASE_URL
          }/awx/upload-files-awx?authToken=${encodeURIComponent(authToken)}`,
          {
            method: "POST",
            body: formData,
          }
        );

        console.log(`Upload response status: ${response.status}`);
        console.log(
          `Upload response headers:`,
          Object.fromEntries(response.headers)
        );

        const text = await response.text();
        console.log(`Upload response body: ${text}`);

        if (!response.ok) {
          let errorData;
          try {
            errorData = JSON.parse(text);
          } catch {
            errorData = {
              message: {
                error: `HTTP ${response.status}: ${text || "Unknown error"}`,
              },
            };
          }
          throw new Error(errorData.message?.error || "File upload failed");
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse response JSON:", text, e);
          throw new Error("Invalid response format from backend");
        }

        if (!data.file_id) {
          console.error("No file_id in response:", data);
          throw new Error("No file_id returned from backend");
        }

        return data.file_id;
      } catch (error) {
        console.error("File upload error:", error);
        throw error;
      }
    };

    const buildRFIPayload = async (questions, formData) => {
      if (!formData || typeof formData !== "object") {
        console.error("formData is undefined or invalid:", formData);
        throw new Error("Invalid form data");
      }

      const results = await Promise.all(
        questions.map(async (question) => {
          const { id, answer } = question;
          const type = answer.type;
          const userInput = formData[id];

          if (!userInput) {
            console.warn(`No input provided for question ${id} (${type})`);
            return {
              id,
              answer: {
                type,
                comment: "No input provided",
                confirmed: false,
              },
            };
          }

          console.log(`Processing question ${id} (${type}):`, userInput);

          const answerObj = {
            type,
            comment: "Submitted via dynamic RFI form",
            confirmed: true,
          };

          switch (type) {
            case "TEXT":
              answerObj.text = userInput;
              break;

            case "ATTACHMENT": {
              const file = userInput;
              if (!(file instanceof File)) {
                console.warn(`Invalid file for ${id}:`, file);
                throw new Error("Invalid file object");
              }
              const file_id = await uploadFileToAirwallex(file);
              answerObj.attachments = [{ file_id }];
              break;
            }

            case "IDENTITY_DOCUMENT": {
              const {
                front,
                back,
                issuing_country,
                number,
                type: docType,
              } = userInput;

              if (!front || !back || !issuing_country || !number || !docType) {
                console.warn(
                  `Incomplete IDENTITY_DOCUMENT data for ${id}:`,
                  userInput
                );
                answerObj.comment = "Incomplete identity document data";
                answerObj.confirmed = false;
                answerObj.identity_document = {
                  front_file_id: null,
                  back_file_id: null,
                  issuing_country: issuing_country || null,
                  number: number || null,
                  type: docType || null,
                };
                break;
              }

              if (!(front instanceof File) || !(back instanceof File)) {
                console.warn(`Invalid file objects for ${id}:`, {
                  front,
                  back,
                });
                throw new Error("Invalid file objects for identity document");
              }

              const [frontId, backId] = await Promise.all([
                uploadFileToAirwallex(front),
                uploadFileToAirwallex(back),
              ]);

              answerObj.identity_document = {
                front_file_id: frontId,
                back_file_id: backId,
                issuing_country,
                number,
                type: docType,
              };
              break;
            }

            case "ADDRESS":
              answerObj.address = { ...userInput };
              break;

            case "CONFIRMATION":
              answerObj.confirmed = !!userInput;
              break;

            case "LIVENESS": {
              if (!(userInput instanceof File)) {
                console.warn(`Invalid file for ${id}:`, userInput);
                throw new Error("Invalid file object");
              }
              const file_id = await uploadFileToAirwallex(userInput);
              answerObj.attachments = [{ file_id }];
              break;
            }

            default:
              console.warn(`Unknown question type: ${type}`);
              answerObj.comment = `Unknown question type: ${type}`;
              answerObj.confirmed = false;
          }

          return {
            id,
            answer: answerObj,
          };
        })
      );

      return { questions: results };
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const missingFields = questions.filter(
        (q) =>
          !formData[q.id] ||
          (Array.isArray(formData[q.id]) && formData[q.id].length === 0)
      );

      if (missingFields.length > 0) {
        const missingTitles = missingFields
          .map((q) => q.title?.en || q.key)
          .join(", ");
        toast.error(`Please complete all required fields: ${missingTitles}`);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Submitting formData:", formData);
        const payload = await buildRFIPayload(questions, formData);
        console.log("Final RFI Payload:", JSON.stringify(payload, null, 2));

        const rfiId = selectedRFI?.id;

        const result = await dispatch(
          respondRFIAWX(rfiId, accountId, payload, authToken)
        );

        if (result.status || result.status === "ANSWERED") {
          toast.success("RFI submitted successfully");

          await dispatch(fetchAccountRFIAWX(accountId, authToken));
          setSelectedRFI(null);
          setShow(false);
        }
      } catch (err) {
        console.error("Submission error:", err);
        toast.error("Failed to submit RFI form");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="p-5">
        <h2 className="text-xl font-bold mb-4">Cardholder RFI Information</h2>
        <div>
          <DynamicForm questions={questions} onFileChange={handleFileChange} />
          <button
            type="submit"
            className="bg-dark text-white rounded-pill border-0 fs-6 d-flex align-items-center justify-content-center gap-2 mt-4 mx-auto"
            onClick={handleSubmit}
            style={{ padding: "10px 35px" }}
          >
            <EditNote /> Submit
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "RFI Details",
            img: "/accounts/accounts.svg",
            backurl: "/dashboard",
          }}
        />

        <div
          className="d-flex justify-content-center align-items-center flex-column w-100 gap-5"
          style={{ height: "80vh" }}
        >
          <CircularProgress size={`5rem`} sx={{ color: "orange" }} />
          <label htmlFor="">Updating RFI Details... Please wait...</label>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="d-flex">
        <SideBar />
        <div
          className="container-fluid px-0 bg-light clear-left overflow-auto"
          style={{ height: "100vh" }}
        >
          <BreadCrumbs
            data={{
              name: "RFI Details",
              img: "/accounts/accounts.svg",
              backurl: "/dashboard",
            }}
          />

          <div className="m-3">
            {platform === "awx" ? (
              <Card
                className="border rounded-4"
                style={{
                  width: "100%",
                  borderRadius: 15,
                  minHeight: "100vh",
                  overflowY: "auto",
                }}
              >
                <div className="d-flex justify-content-center align-items-start w-100 h-100">
                  <div
                    className="rfi-sidebar h-100 border-end p-4"
                    style={{ width: "40rem" }}
                  >
                    <label
                      htmlFor=""
                      className="text-secondary mb-3"
                      style={{ fontSize: 18, fontWeight: 600 }}
                    >
                      List of RFIs:
                    </label>

                    {rfiDetails?.map((item) => {
                      return (
                        <div className="d-flex align-items-center justify-content-between mb-5">
                          <div className="d-flex align-items-center justify-content-start gap-2 pe-4">
                            <FmdBad sx={{ color: "brown" }} />

                            <div className="d-flex flex-column align-items-start justify-content-start gap-1">
                              <label
                                htmlFor=""
                                className="text-danger fw-bold"
                                style={{ fontSize: 14 }}
                              >
                                {/* Provide more information{" "}
                                {item.type === "TRANSACTION"
                                  ? "to release your transaction(s)"
                                  : item.type === "CARDHOLDER"
                                  ? "to approve your cardholder(s)"
                                  : item.type === "PAYMENT_ENABLEMENT"
                                  ? "to release your payment(s)"
                                  : ""} */}

                                {getRfiMessage(item.type)?.title}
                              </label>
                              <label
                                htmlFor=""
                                className="text-dark fw-bold"
                                style={{ fontSize: 12 }}
                              >
                                {/* {item.type?.includes("KYC")
                                  ? "Our onboarding team needs more information to approve your application."
                                  : item.type === "TRANSACTION"
                                  ? "Your transaction(s) are held under review. To release them, please provide the requested information as soon as possible."
                                  : item.type === "CARDHOLDER"
                                  ? "Your cardholder application(s) are held under review. To approve them, please provide the requested information as soon as possible."
                                  : item.type === "PAYMENT_ENABLEMENT"
                                  ? "Your payment(s) are held under review. To approve them, please provide the requested information as soon as possible."
                                  : ""} */}

                                {getRfiMessage(item.type)?.description}
                              </label>
                            </div>
                          </div>

                          {item.status === "CLOSED" ? (
                            <button
                              className="border border-success text-white bg-success px-4 py-2 rounded-pill"
                              style={{ fontSize: 13, fontWeight: 600 }}
                            >
                              CLOSED
                            </button>
                          ) : item?.status === "ANSWERED" ? (
                            <button
                              className="border border-primary text-white bg-primary px-4 py-2 rounded-pill"
                              style={{ fontSize: 13, fontWeight: 600 }}
                            >
                              ANSWERED
                            </button>
                          ) : (
                            <button
                              className="border border-secondary text-dark bg-white px-4 py-2 rounded-pill"
                              style={{ fontSize: 13, fontWeight: 600 }}
                              onClick={() => handleRFIShow(item)}
                            >
                              PENDING
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="h-100 w-100">
                    {show && selectedRFI?.type !== "CARDHOLDER" ? (
                      <Embeded
                        key={selectedRFI.id} // forces React to remount when ID changes
                        type="rfi"
                        subType={selectedRFI.type}
                        data={selectedRFI}
                      />
                    ) : show && selectedRFI?.type === "CARDHOLDER" ? (
                      <CardholderContent />
                    ) : (
                      <>
                        <div className="d-flex flex-column align-items-center justify-content-center gap-4 mt-5 pt-5">
                          <img src="/rfi-list.png" alt="" width={250} />

                          <label
                            htmlFor=""
                            className="fw-500 text-secondary fs-8 px-5"
                          >
                            Review your RFIs on the left. Click on 'Pending'
                            when you're ready to begin.
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <>
                <div
                  className="container-fluid px-0 bg-light clear-left overflow-auto"
                  id="main-container"
                  style={{ minheight: "100vh", overflowY: "auto" }}
                >
                  <div
                    className="navigationsub-parent p-4"
                    style={{ background: "white" }}
                  >
                    {isLoading ? (
                      <>
                        <div
                          className="twoFA-frame-parent w-100 align-items-center"
                          style={{ padding: "5rem" }}
                        >
                          <img
                            src="/Fetch_RFI.gif"
                            alt=""
                            style={{ width: "25%" }}
                          />
                          <h5 className="fs-6 fw-bold">
                            Please wait while we're fetching your RFI (Request
                            For Information) details...
                          </h5>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="container-rfi w-100"
                          // style={{
                          //   borderRadius: "24px",
                          //   boxShadow: "0 0 20px 2px rgb(0, 0, 0, 0.2)",
                          //   minHeight: "100%",
                          // }}
                        >
                          {rfiTemplate.length === 0 ? (
                            <>
                              <div
                                className="twoFA-frame-parent w-100 align-items-center"
                                style={{ padding: "5rem" }}
                              >
                                <img
                                  src="/Fetch_RFI.jpg"
                                  alt=""
                                  style={{ width: "25%" }}
                                />
                                <h5 className="fs-6 fw-bold">
                                  No RFI (Request For Information) details
                                  available...
                                </h5>
                              </div>
                            </>
                          ) : (
                            <>
                              {rfiTemplate.map((RFItemplate, index) => (
                                <div
                                  className="accordion"
                                  id="accordionExample"
                                >
                                  <div className="accordion-item border-0">
                                    <button
                                      className="accordion1 border-0"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#collapse${index}`}
                                      aria-expanded="true"
                                      aria-controls="collapseOne"
                                    >
                                      <div
                                        className={
                                          RFItemplate.status == "RFI_RESPONDED"
                                            ? list[1]
                                            : list[0]
                                        }
                                      >
                                        <div className="file-zip-parent">
                                          <ReactSVG
                                            src="/onboarding/accounts/applicationReview/kycDet.svg"
                                            beforeInjection={(svg) => {
                                              svg.setAttribute(
                                                "style",
                                                "stroke: yellow"
                                              );
                                              const paths =
                                                svg.querySelectorAll("path");
                                              paths.forEach((path) => {
                                                path.setAttribute(
                                                  "stroke",
                                                  RFItemplate.status ===
                                                    "RFI_RESPONDED"
                                                    ? "#099cbc"
                                                    : "#E0990C"
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
                                              (RFItemplate.status ===
                                              "RFI_RESPONDED"
                                                ? list[1]
                                                : list[0]) +
                                              ".svg"
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="title4">
                                        <div className="add-details-to1">
                                          {transformCamelCaseToWords(
                                            RFItemplate.template.name
                                          )}
                                          <span
                                            className="mx-1"
                                            style={{ color: "red" }}
                                          >
                                            *
                                          </span>
                                        </div>
                                        <div
                                          className={
                                            "bg-" +
                                            (RFItemplate.status ===
                                            "RFI_RESPONDED"
                                              ? list[1]
                                              : list[0]) +
                                            " text-start"
                                          }
                                        >
                                          {RFItemplate.status}
                                        </div>
                                      </div>
                                      <div className="icon-open2">
                                        <div className="chevron-up1">
                                          <img
                                            className="arrow-icon15"
                                            alt=""
                                            src="arrow2.svg"
                                          />
                                        </div>
                                      </div>
                                    </button>
                                    <div
                                      id={`collapse${index}`}
                                      className="accordion-collapse collapse"
                                      aria-labelledby="headingOne"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <form
                                        className="form"
                                        id={`${RFItemplate.template.name}Form`}
                                      >
                                        <>
                                          {RFItemplate.status ===
                                          "RFI_RESPONDED" ? (
                                            <>
                                              <div
                                                style={{
                                                  width: "100%",
                                                  fontSize: "medium",
                                                }}
                                              >
                                                Your response to the RFI has
                                                been received. Kindly await
                                                further updates.
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <p
                                                style={{
                                                  width: "100%",
                                                  color: "brown",
                                                  paddingLeft: "12px",
                                                }}
                                              >
                                                Remarks: {RFItemplate.remarks}**
                                              </p>

                                              {RFItemplate.template.requiredFields.map(
                                                (requiredField, index) => (
                                                  <>
                                                    <input
                                                      type="hidden"
                                                      id="templateName"
                                                      value={
                                                        RFItemplate.template
                                                          .name
                                                      }
                                                    />
                                                    <input
                                                      type="hidden"
                                                      id="templateId"
                                                      value={
                                                        RFItemplate.templateId
                                                      }
                                                    />
                                                    {RFItemplate.template
                                                      .name ==
                                                    "otherDocument" ? (
                                                      <>
                                                        {requiredField.type ==
                                                        "document" ? (
                                                          <>
                                                            <div className="d-flex align-self-stretch">
                                                              <div className="input-group w-100 me-2 pb-0">
                                                                <select
                                                                  className="form-input my-0 pb-0"
                                                                  id="documentTypeRFI"
                                                                  onChange={(
                                                                    e
                                                                  ) => {
                                                                    changeLabel(
                                                                      index,
                                                                      e
                                                                    );
                                                                  }}
                                                                >
                                                                  {" "}
                                                                  <option value=""></option>
                                                                  {documentType ? (
                                                                    <>
                                                                      {documentType.map(
                                                                        (
                                                                          item
                                                                        ) => {
                                                                          return (
                                                                            <option
                                                                              value={
                                                                                item.code
                                                                              }
                                                                            >
                                                                              {
                                                                                item.description
                                                                              }
                                                                            </option>
                                                                          );
                                                                        }
                                                                      )}
                                                                    </>
                                                                  ) : (
                                                                    <>
                                                                      {" "}
                                                                      <option value="BUSINESS_REGISTRATION_DOC">
                                                                        Business
                                                                        Registration
                                                                        Document
                                                                      </option>
                                                                      <option value="TRUST_DEED">
                                                                        Trust
                                                                        Deed
                                                                      </option>
                                                                      <option value="NATIONAL_ID">
                                                                        National
                                                                        ID
                                                                      </option>
                                                                      <option value="PASSPORT">
                                                                        Passport
                                                                      </option>
                                                                      <option value="DRIVER_LICENCE">
                                                                        Driver's
                                                                        Licence
                                                                      </option>
                                                                      <option value="PARTNERSHIP_DEED">
                                                                        Partnership
                                                                        Deed
                                                                      </option>
                                                                      <option value="ASSOCIATION_DEED">
                                                                        Association
                                                                        Deed
                                                                      </option>
                                                                      <option value="PROOF_OF_ADDRESS">
                                                                        Proof Of
                                                                        Address
                                                                      </option>
                                                                      <option value="LOA">
                                                                        Letter
                                                                        of
                                                                        Authorization
                                                                      </option>
                                                                      <option value="Others">
                                                                        Others
                                                                      </option>
                                                                    </>
                                                                  )}
                                                                </select>

                                                                <label
                                                                  htmlFor="country"
                                                                  className="form-input-label ps-1"
                                                                >
                                                                  Please specify
                                                                  the type of
                                                                  document you'd
                                                                  like to
                                                                  upload.
                                                                  <span
                                                                    className="mx-1"
                                                                    style={{
                                                                      color:
                                                                        "red",
                                                                    }}
                                                                  >
                                                                    *
                                                                  </span>
                                                                </label>
                                                              </div>
                                                            </div>

                                                            <div
                                                              style={{
                                                                display: "none",
                                                              }}
                                                              className="align-self-stretch"
                                                              id="OtherDocumentTypeDiv"
                                                            >
                                                              <div className="input-group w-100 me-2 pb-0">
                                                                <input
                                                                  id="OtherDocumentType"
                                                                  name="OtherDocumentType"
                                                                  className="form-input my-0 pb-0"
                                                                  type="text"
                                                                />
                                                                <label
                                                                  htmlFor="country"
                                                                  className="form-input-label ps-1"
                                                                >
                                                                  Others (please
                                                                  specify):
                                                                  <span
                                                                    className="mx-1"
                                                                    style={{
                                                                      color:
                                                                        "red",
                                                                    }}
                                                                  >
                                                                    *
                                                                  </span>
                                                                </label>
                                                              </div>
                                                            </div>

                                                            {labels.map(
                                                              (
                                                                label,
                                                                index
                                                              ) => (
                                                                <div
                                                                  key={index}
                                                                  className="d-flex align-self-stretch browse1"
                                                                >
                                                                  <div className="upload-document"></div>
                                                                  <button
                                                                    type="button"
                                                                    className="browse-file1"
                                                                    style={{
                                                                      padding:
                                                                        "15px",
                                                                      borderRadius:
                                                                        "15px",
                                                                    }}
                                                                  >
                                                                    <div
                                                                      className="drag-drop-or-group"
                                                                      style={{
                                                                        display:
                                                                          "block",
                                                                        width:
                                                                          "100%",
                                                                      }}
                                                                    >
                                                                      <input
                                                                        type="file"
                                                                        id={`file${index}`}
                                                                        name={`file${index}`}
                                                                        style={{
                                                                          display:
                                                                            "block",
                                                                        }}
                                                                      />
                                                                    </div>
                                                                  </button>
                                                                </div>
                                                              )
                                                            )}

                                                            <Link
                                                              to="#!"
                                                              onClick={addMore}
                                                              className="w-100 text-center"
                                                            >
                                                              ADD MORE
                                                            </Link>

                                                            <Link
                                                              to="#!"
                                                              onClick={() =>
                                                                deleteDiv(index)
                                                              }
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
                                                        {requiredField.type ==
                                                        "document" ? (
                                                          <>
                                                            <div class="d-flex align-self-stretch browse1">
                                                              <div class="upload-document">
                                                                {
                                                                  requiredField.fieldLabel
                                                                }
                                                              </div>
                                                              <button
                                                                type="button"
                                                                class="browse-file1"
                                                                style={{
                                                                  padding:
                                                                    "15px",
                                                                  borderRadius:
                                                                    "15px",
                                                                }}
                                                              >
                                                                <div
                                                                  class="drag-drop-or-group"
                                                                  style={{
                                                                    display:
                                                                      "block",
                                                                    width:
                                                                      "100%",
                                                                  }}
                                                                >
                                                                  <input
                                                                    type="file"
                                                                    id={
                                                                      requiredField.fieldValue
                                                                    }
                                                                    name={
                                                                      requiredField.fieldValue
                                                                    }
                                                                    style={{
                                                                      display:
                                                                        "block",
                                                                    }}
                                                                  />
                                                                </div>
                                                              </button>
                                                            </div>
                                                          </>
                                                        ) : (
                                                          <>
                                                            <div className="d-flex align-self-stretch">
                                                              <div className="input-group w-100 me-2 pb-0">
                                                                <input
                                                                  id={
                                                                    requiredField.fieldValue
                                                                  }
                                                                  name={
                                                                    requiredField.fieldValue
                                                                  }
                                                                  className="form-input my-0 pb-0"
                                                                  type={
                                                                    requiredField.fieldLabel
                                                                      .toLowerCase()
                                                                      .includes(
                                                                        "date"
                                                                      )
                                                                      ? "date"
                                                                      : "text"
                                                                  }
                                                                />
                                                                <label
                                                                  htmlFor="country"
                                                                  className="form-input-label ps-1"
                                                                >
                                                                  {
                                                                    requiredField.fieldLabel
                                                                  }
                                                                  <span
                                                                    className="mx-1"
                                                                    style={{
                                                                      color:
                                                                        "red",
                                                                    }}
                                                                  >
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
                                                )
                                              )}
                                            </>
                                          )}
                                        </>

                                        {RFItemplate.status ===
                                        "RFI_RESPONDED" ? (
                                          <></>
                                        ) : (
                                          <>
                                            {RFItemplate.template.name ==
                                            "otherDocument" ? (
                                              <>
                                                <button
                                                  className="submit-btn"
                                                  id="submitRfiDetails"
                                                  type="button"
                                                  onClick={
                                                    submitRFIOtherDocument
                                                  }
                                                >
                                                  <img
                                                    className="check-double-icon"
                                                    alt=""
                                                    src="check-double.svg"
                                                  />
                                                  <div className="label7 submitBtn">
                                                    Submit
                                                  </div>
                                                </button>
                                              </>
                                            ) : (
                                              <>
                                                <button
                                                  className="submit-btn"
                                                  id="submitRfiDetails"
                                                  type="button"
                                                  onClick={submitRFI}
                                                >
                                                  <img
                                                    className="check-double-icon"
                                                    alt=""
                                                    src="check-double.svg"
                                                  />
                                                  <div className="label7 submitBtn">
                                                    Submit
                                                  </div>
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
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default rfiDetails;
