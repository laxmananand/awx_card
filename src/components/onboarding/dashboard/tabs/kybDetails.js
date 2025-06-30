import React, { useEffect, useState, useRef } from "react";
import StakeholderDetails from "./stakeholderDetails2";
import { ReactSVG } from "react-svg";
import ContentLoader from "react-content-loader";
import * as functions from "./functions/kyb-details-function.js";
import * as utilities from "./functions/utility-details-function.js";
import AlertMKYC from "./modals/AlertMKYC.js";
import AlertEKYC from "./modals/Alert.js";
import Axios from "axios";
import "./css/kyb.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../@redux/action/onboardingAction.js";
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";
import {
  setCurrentPage,
  setShowTab,
} from "../../../../@redux/features/onboardingFeatures.js";
import * as restrictions from "../tabs/functions/restrictInput.js";

export const validations = {
  alpha: (value, name) => {
    const alphaRegex = /^[A-Za-z \-']+$/;
    if (value && !alphaRegex.test(value)) {
      toast.error(
        `${name} must contain only alphabetic characters. Example: "John"`
      );
    }
  },
  numeric: (value, name) => {
    const numericRegex = /^[0-9]+$/;
    if (value && !numericRegex.test(value)) {
      toast.error(
        `${name} must contain only numeric characters. Example: "12345"`
      );
    }
  },
  alphanumeric: (value, name) => {
    const alphanumericRegex = /^[A-Za-z0-9]+$/;
    if (value && !alphanumericRegex.test(value)) {
      toast.error(
        `${name} must contain only alphanumeric characters. Example: "A7F766UJO85"`
      );
    }
  },
  email: (value, name) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      toast.error(
        `${name} must be a valid email address. Example: "john.doe@example.com"`
      );
    }
  },

  name: (value, name) => {
    const nameRegex = /^[a-zA-Z0-9\s,.'\-\/]+$/;
    if (value && !nameRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, numbers, spaces, commas, periods, hyphens, and slashes.`
      );
    }
  },

  address: (value, name) => {
    const addressRegex = /^[A-Za-z0-9 ,.\-\/'&#@]*$/;
    if (value && !addressRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, numbers, spaces, commas, periods, hyphens, and slashes.`
      );
    }
  },
  city: (value, name) => {
    const cityRegex = /^[a-zA-Z\s\-']+$/;
    if (value && !cityRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, spaces, hyphens, and apostrophes.`
      );
    }
  },
  state: (value, name) => {
    const stateRegex = /^[a-zA-Z\s\-']+$/;
    if (value && !stateRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, spaces, hyphens, and apostrophes.`
      );
    }
  },
  postalCode: (value, name) => {
    const postalCodeRegex = /^[a-zA-Z0-9\s\-]+$/;
    if (value && !postalCodeRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, numbers, spaces, and hyphens.`
      );
    }
  },
};

export const generateCompletedDiv = () => {
  return (
    <>
      <div className="congratulation-area text-center mt-5">
        <div className="container" style={{ width: "100%" }}>
          <div className="congratulation-wrapper">
            <div className="congratulation-contents center-text">
              <div className="congratulation-contents-icon">
                <img src="/success-icon.png" alt="" width={100} />
              </div>
              <h4 className="congratulation-contents-title">
                {" "}
                Congratulations!{" "}
              </h4>
              <p className="congratulation-contents-para">
                {" "}
                Your compliance requirements are fulfilled. Explore the
                dashboard now and make the most of Zoqq!{" "}
              </p>
              <div className="btn-wrapper mt-4">
                <Link to="/dashboard" className="cmn-btn btn-bg-1">
                  {" "}
                  Go to Dashboard{" >>"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const generateIncompletedDiv = () => {
  const dispatch = useDispatch();
  return (
    <>
      <div className="congratulation-area text-center mt-5">
        <div className="container" style={{ width: "100%" }}>
          <div className="congratulation-wrapper">
            <div className="congratulation-contents center-text">
              <div
                className="congratulation-contents-icon"
                style={{ backgroundColor: "transparent" }}
              >
                <img src="/email.png" alt="" width={100} />
              </div>

              <p className="congratulation-contents-para">
                You haven't completed the onboarding process yet. Head over to
                the onboarding form to finish up and start enjoying all that
                Zoqq has to offer!
              </p>
              <div className="btn-wrapper mt-4">
                <Link
                  to="#!"
                  className="cmn-btn btn-bg-1"
                  onClick={() => {
                    dispatch(setCurrentPage(4));
                    dispatch(setShowTab(3));
                  }}
                >
                  Proceed ➤
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const generateInReviewDiv = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="congratulation-area text-center mt-5">
        <div className="container" style={{ width: "100%" }}>
          <div className="congratulation-wrapper">
            <div className="congratulation-contents center-text">
              <div
                className="congratulation-contents-icon"
                style={{ backgroundColor: "transparent" }}
              >
                <img src="/email.png" alt="" width={100} />
              </div>

              <p className="congratulation-contents-para">
                You application has been initiated and it is currently
                under-review, kindly wait until any further updates.
              </p>
              <div className="btn-wrapper mt-4">
                <Link to="/dashboard" className="cmn-btn btn-bg-1">
                  Go to Dashboard ➤
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const splitString = (str) => {
  const splitSentences = str.split(
    /(Business Registration Document|Letter of Authorization|Either|BUSINESS ->|Please)/g
  );
  const results = [];

  // Combine matches and text fragments
  for (let i = 0; i < splitSentences.length; i++) {
    if (splitSentences[i].trim()) {
      // Concatenate with the next fragment if it's a splitting term
      if (
        splitSentences[i] === "Business Registration Document" ||
        splitSentences[i] === "Letter of Authorization" ||
        splitSentences[i] === "Either" ||
        splitSentences[i] === "Please" ||
        splitSentences[i] === "BUSINESS ->"
      ) {
        results.push(
          `${splitSentences[i]} ${splitSentences[i + 1] || ""}`.trim()
        );
        i++; // Skip next since it's already appended
      } else {
        results.push(splitSentences[i].trim());
      }
    }
  }

  return results;
};

function kybDetails() {
  const list = ["progress", "pending", "approve"];
  const [status, setStatus] = useState(list[1]);
  const [status2, setStatus2] = useState(list[0]);
  const [status3, setStatus3] = useState(list[0]);
  const [status4, setStatus4] = useState(list[0]);
  const [status5, setStatus5] = useState(list[0]);

  const [fileSizeView, setFileSizeView] = useState(false);
  const [fileSizeViewApplicant, setFileSizeViewApplicant] = useState(false);

  const [fileSizeViewApplicantPOA, setFileSizeViewApplicantPOA] =
    useState(false);

  const [fileSizeViewLOA, setFileSizeViewLOA] = useState(false);

  const [BusinessLoader, setBusinessLoader] = useState(false);
  const [ApplicantLoader, setApplicantLoader] = useState(false);
  const [LOALoader, setLOALoader] = useState(false);

  const [showBusinessDiv, setShowBusinessDiv] = useState(false);
  const [showStakeholderDiv, setShowStakeholderDiv] = useState(false);
  const [showApplicantDiv, setShowApplicantDiv] = useState(false);
  const [showLOA, setShowLOAdiv] = useState(false);

  const [applicantData, setApplicantData] = useState([]);
  const [stakeholderData, setStakeholderData] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [loaData, setLOAData] = useState([]);

  const [region, setRegion] = useState(sessionStorage.getItem("region"));
  const listCountry = useSelector((state) => state.onboarding?.ListCountry);
  const documentType = useSelector(
    (state) => state.onboarding?.DocumentTypeValues
  );
  const CustomerDetailsNIUM = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM
  );

  var internalBusinessId = useSelector(
    (state) => state.onboarding?.UserStatusObj?.internalBusinessId
  );
  var lastScreenCompleted = Number(
    useSelector((state) => state.onboarding?.UserStatusObj?.lastScreenCompleted)
  );
  var userStatus = useSelector(
    (state) => state.onboarding?.UserStatusObj?.userStatus
  );

  var complianceStatus = useSelector(
    (state) => state.onboarding?.complianceStatus
  );
  var userOnboardingDetails = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails
  );
  var finalKycStatus = useSelector((state) => state.onboarding?.finalKycStatus);
  var applicantKycMode = useSelector(
    (state) => state.onboarding?.ApplicantBusinessDetails?.applicantKycMode
  );
  var applicantPosition = useSelector(
    (state) => state.onboarding?.ApplicantBusinessDetails?.applicantPosition
  );

  var businessKybMode = useSelector(
    (state) => state.onboarding?.BusinessCorporationDetails?.businessKybMode
  );

  const [kycUrl, setKycUrl] = useState(
    userOnboardingDetails?.redirectUrl || userOnboardingDetails?.kycUrl
  );
  const [complianceRemarks, setComplianceRemarks] = useState(
    userOnboardingDetails?.remarks
  );

  const [complianceRemarksDiv, setComplianceRemarksDiv] = useState(<></>);

  useEffect(() => {
    if (complianceRemarks?.includes("BUSINESS ->")) {
      let formattedStr = splitString(complianceRemarks);

      // Remove the first and last items for the main display
      let trimmedStr = formattedStr.slice(1, -1);
      // Get the last item
      let lastItem = formattedStr[formattedStr.length - 1];

      setComplianceRemarksDiv(
        <>
          {trimmedStr?.map((item, index) => {
            return (
              <p key={index}>
                {index + 1}. {item}
              </p>
            );
          })}
          {/* Display the last item */}
          {lastItem && <p className="mb-0">{lastItem}</p>}
        </>
      );
    } else {
      setComplianceRemarksDiv(<>{complianceRemarks}</>);
    }
  }, [complianceRemarks]);

  const [businessDocumentType, setBusinessDocumentType] = useState(null);

  useEffect(() => {
    if (!userOnboardingDetails?.remarks) {
      setComplianceRemarks(CustomerDetailsNIUM?.complianceRemarks);
    }
  }, []);

  useEffect(() => {
    if (businessData.length > 0) {
      setStatus2(list[1]);
    }

    if (applicantData.length > 0) {
      setStatus3(list[1]);
    }

    if (stakeholderData.length > 0) {
      let stakeWithDocs = 0;

      stakeholderData.map((stakeholder) => {
        // Check if documentDetails is not an empty array
        if (stakeholder.documentDetails.length > 0) {
          stakeWithDocs++;
        }
      });

      if (stakeWithDocs > 0) setStatus4(list[1]);
    }

    if (loaData.length > 0) {
      setStatus5(list[1]);
    }
  }, [
    status2,
    status3,
    status4,
    status5,
    applicantData,
    businessData,
    stakeholderData,
    loaData,
  ]);

  useEffect(() => {
    const SetPage = async () => {
      let obj = CustomerDetailsNIUM;

      //Updating applicant kyb details
      if (obj.identificationData) {
        // Initialize an array for LOA data
        const loaData = [];

        // Filter out items with type "BUSINESS REGISTRATION NUMBER" and handle "LOA"
        const filteredData = obj.identificationData.filter((item) => {
          if (item.type === "LOA") {
            loaData.push(item); // Collect LOA data
            return false; // Exclude LOA from the filtered data
          }
          return item.type !== "BUSINESS REGISTRATION NUMBER"; // Exclude BUSINESS REGISTRATION NUMBER
        });

        // Set applicantData with the filtered data
        setApplicantData(filteredData);

        // Set LOA data if any
        if (loaData.length > 0) {
          setLOAData(loaData);
        }
      }

      //Updating stakeholder kyb details
      if (obj.stakeholderDetails) {
        let docs = obj.stakeholderDetails
          .map((stakeholder) => {
            // Check if documentDetails is not an empty array
            if (stakeholder.documentDetails.length > 0) {
              return {
                email: stakeholder.email,
                documentDetails: stakeholder.documentDetails,
              };
            } else {
              return null; // If documentDetails is empty, return null
            }
          })
          .filter(Boolean); // Filter out null entries

        console.log("stakeholderDocs: ", obj.stakeholderDetails);
        setStakeholderData(obj.stakeholderDetails);
      }

      //Updating business kyb details
      if (obj.businessDetails?.documentDetails) {
        setBusinessData(obj.businessDetails.documentDetails);
      }
    };
    SetPage();
  }, []);

  const businessType = useSelector(
    (state) => state.onboarding?.BusinessCorporationDetails?.businessType
  );

  useEffect(() => {
    RenderDocumentDiv(
      {
        setShowBusinessDiv,
        setShowStakeholderDiv,
        setShowApplicantDiv,
        setShowLOAdiv,
      },
      complianceRemarks
    );
  }, []);

  const dispatch = useDispatch();

  //Business Document Requirements starts
  const [businessKey, setBusinessKey] = useState(0);
  const [toggleBusinessDocument, setToggleBusinessDocument] = useState(false);

  const [filename, setFilename] = useState("Browse Files");
  const [filetype, setFiletype] = useState(
    "Accepted Formats: jpg/jpeg/png/pdf"
  );
  const [filesize, setFilesize] = useState("0.00");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const fileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      const maxSizeInMB = 5;
      const fileSizeInMB = selectedFile.size / (1024 * 1024);

      // Validate file type
      if (!allowedTypes.includes(selectedFile.type)) {
        // Reset state if no file is selected
        setFile(null);
        setFilename("Browse File");
        setFiletype("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesize("0.00");
        setFileSizeView(false);
        toast.error(
          "Invalid file type. Only jpg, jpeg, png, and pdf files are allowed."
        );
        return;
      }

      // Validate file size
      if (fileSizeInMB > maxSizeInMB) {
        // Reset state if no file is selected
        setFile(null);
        setFilename("Browse File");
        setFiletype("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesize("0.00");
        setFileSizeView(false);
        toast.error("File size exceeds the maximum limit of 5MB.");
        return;
      }

      // Update state if validations pass
      setFile(selectedFile);
      setFilename(selectedFile.name);
      setFiletype("Uploaded Filetype: " + selectedFile.type);
      setFilesize(fileSizeInMB.toFixed(2));
      setFileSizeView(true);
    } else {
      // Reset state if no file is selected
      setFile(null);
      setFilename("Browse File");
      setFiletype("Accepted Formats: jpg/jpeg/png/pdf");
      setFilesize("0.00");
      setFileSizeView(false);
    }
  };

  const submitBusinessKYBDetails = async () => {
    if (!businessDocumentType) {
      toast.warn("Document Type must not be empty");
      return; // Exit early if there's an issue
    }

    if (!file) {
      toast.warn("Please select a Document File");
      return; // Exit early if there's no file selected
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("businessRegistrationNumber", internalBusinessId);
    formData.append("email", sessionStorage.getItem("lastemail"));
    formData.append("businessDocumentType", businessDocumentType);
    formData.append("businessDocumentFile", file);
    formData.append("customerHashId", userOnboardingDetails?.customerHashId);
    formData.append("region", region);

    let obj = await dispatch(
      actions.PostBusinessKYBDetails(formData, { setBusinessLoader })
    );
    if (obj.clientId || obj.caseId) {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const returnBusinessData = () => {
    let docs = [];
    for (let i = 0; i < businessData.length; i++) {
      docs.push(businessData[i].identificationType); // Pushing type to docs array
    }
    // Joining the type values with a comma and space
    const uploadedDocs = docs.join(", ");

    return (
      <div>
        Thank you for submitting your documents! We're now processing your
        information. Please wait for further compliance updates.
        <hr />
        <div>
          Your Uploaded Document(s):{" "}
          <span style={{ color: "var(--accent-blue-100)" }}>
            {uploadedDocs}
          </span>
        </div>
      </div>
    );
  };
  //Business document requirement ends

  //Applicant document requirement starts
  const [applicantKey, setApplicantKey] = useState(0);
  const [applicantDocumentType, setApplicantDocumentType] = useState(null);
  const [applicantDocumentNumber, setApplicantDocumentNumber] = useState("");
  const [
    applicantDocumentReferenceNumber,
    setApplicantDocumentReferenceNumber,
  ] = useState("");
  const [applicantDocumentHolderName, setApplicantDocumentHolderName] =
    useState("");
  const [
    applicantDocumentIssuanceCountry,
    setApplicantDocumentIssuanceCountry,
  ] = useState(null);
  const [
    applicantDocumentIssuingAuthority,
    setApplicantDocumentIssuingAuthority,
  ] = useState(null);
  const [applicantDocumentIssueDate, setApplicantDocumentIssueDate] =
    useState("");
  const [applicantDocumentExpiryDate, setApplicantDocumentExpiryDate] =
    useState("");

  const [applicantDocumentTypePOA, setApplicantDocumentTypePOA] =
    useState("PROOF_OF_ADDRESS");

  const [toggleApplicantDocument, setToggleApplicantDocument] = useState(false);
  const [toggleApplicantPOA, setToggleApplicantPOA] = useState(false);

  const [filenameApplicant, setFilenameApplicant] = useState("Browse Files");
  const [filetypeApplicant, setFiletypeApplicant] = useState(
    "Accepted Formats: jpg/jpeg/png/pdf"
  );
  const [filesizeApplicant, setFilesizeApplicant] = useState("0.00");

  const [filenameApplicantPOA, setFilenameApplicantPOA] =
    useState("Browse Files");
  const [filetypeApplicantPOA, setFiletypeApplicantPOA] = useState(
    "Accepted Formats: jpg/jpeg/png/pdf"
  );
  const [filesizeApplicantPOA, setFilesizeApplicantPOA] = useState("0.00");

  const [fileApplicant, setFileApplicant] = useState(null);
  const [fileApplicantPOA, setFileApplicantPOA] = useState(null);
  const fileInputRefApplicant = useRef(null);
  const fileInputRefApplicantPOA = useRef(null);

  const fileUploadApplicant = () => {
    fileInputRefApplicant.current.click();
  };

  const handleFileChangeApplicant = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      const maxSizeInMB = 5;
      const fileSizeInMB = selectedFile.size / (1024 * 1024);

      // Validate file type
      if (!allowedTypes.includes(selectedFile.type)) {
        // Reset state if no file is selected
        setFileApplicant(null);
        setFilenameApplicant("Browse File");
        setFiletypeApplicant("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesizeApplicant("0.00");
        setFileSizeViewApplicant(false);
        toast.error(
          "Invalid file type. Only jpg, jpeg, png, and pdf files are allowed."
        );
        return;
      }

      // Validate file size
      if (fileSizeInMB > maxSizeInMB) {
        // Reset state if no file is selected
        setFileApplicant(null);
        setFilenameApplicant("Browse File");
        setFiletypeApplicant("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesizeApplicant("0.00");
        setFileSizeViewApplicant(false);
        toast.error("File size exceeds the maximum limit of 5MB.");
        return;
      }

      setFileApplicant(selectedFile);
      setFilenameApplicant(selectedFile.name);
      setFiletypeApplicant("Uploaded Filetype: " + selectedFile.type);
      setFilesizeApplicant((selectedFile.size / (1024 * 1024)).toFixed(2));
      setFileSizeViewApplicant(true);
    } else {
      setFileApplicant(null);
      setFilenameApplicant("Browse File");
      setFiletypeApplicant("Accepted Formats: jpg/jpeg/png/pdf");
      setFilesizeApplicant("0.00");
      setFileSizeViewApplicant(false);
    }
  };

  const fileUploadApplicantPOA = () => {
    fileInputRefApplicantPOA.current.click();
  };

  const handleFileChangeApplicantPOA = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      const maxSizeInMB = 5;
      const fileSizeInMB = selectedFile.size / (1024 * 1024);

      // Validate file type
      if (!allowedTypes.includes(selectedFile.type)) {
        // Reset state if no file is selected
        setFileApplicantPOA(null);
        setFilenameApplicantPOA("Browse File");
        setFiletypeApplicantPOA("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesizeApplicantPOA("0.00");
        setFileSizeViewApplicantPOA(false);
        toast.error(
          "Invalid file type. Only jpg, jpeg, png, and pdf files are allowed."
        );
        return;
      }

      // Validate file size
      if (fileSizeInMB > maxSizeInMB) {
        // Reset state if no file is selected
        setFileApplicantPOA(null);
        setFilenameApplicantPOA("Browse File");
        setFiletypeApplicantPOA("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesizeApplicantPOA("0.00");
        setFileSizeViewApplicantPOA(false);
        toast.error("File size exceeds the maximum limit of 5MB.");
        return;
      }

      setFileApplicantPOA(selectedFile);
      setFilenameApplicantPOA(selectedFile.name);
      setFiletypeApplicantPOA("Uploaded Filetype: " + selectedFile.type);
      setFilesizeApplicantPOA((selectedFile.size / (1024 * 1024)).toFixed(2));
      setFileSizeViewApplicantPOA(true);
    } else {
      setFileApplicantPOA(null);
      setFilenameApplicantPOA("Browse File");
      setFiletypeApplicantPOA("Accepted Formats: jpg/jpeg/png/pdf");
      setFilesizeApplicantPOA("0.00");
      setFileSizeViewApplicantPOA(false);
    }
  };

  const submitApplicantKYBDetails = async () => {
    //Validations for the above
    if (!applicantDocumentType) {
      toast.warn("Applicant's Document Type must not be empty");
      return;
    } else if (!applicantDocumentNumber) {
      toast.warn("Applicant's Document Number must not be empty");
      return;
    } else if (!applicantDocumentIssuanceCountry) {
      toast.warn("Applicant's Document Issuance Country must not be empty");
      return;
    } else if (!applicantDocumentExpiryDate) {
      toast.warn("Applicant's Document Expiry Date must not be empty");
      return;
    } else if (!fileApplicant) {
      toast.warn("Please Select a Document File");
      return;
    } else if (toggleApplicantPOA && !applicantDocumentTypePOA) {
      toast.warn(
        "Applicant's Document Type for Proof of Address must not be empty"
      );
      return;
    } else if (toggleApplicantPOA && !fileApplicantPOA) {
      toast.warn(
        "Please select a file for Applicant's Document for Proof of Address"
      );
      return;
    } else {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("businessRegistrationNumber", internalBusinessId);
      formData.append("customerHashId", userOnboardingDetails?.customerHashId);
      formData.append("email", sessionStorage.getItem("lastemail"));
      formData.append("fileTypes", toggleApplicantPOA ? "both" : "poi");
      formData.append("region", region);

      //Default inclusion of applicant document
      formData.append("applicantDocumentType", applicantDocumentType);
      formData.append(
        "applicantDocumentNumber",
        applicantDocumentNumber?.trim()
      );
      formData.append(
        "applicantDocumentReferenceNumber",
        applicantDocumentReferenceNumber?.trim()
      );
      formData.append(
        "applicantDocumentHolderName",
        applicantDocumentHolderName?.trim()
      );
      formData.append(
        "applicantDocumentIssuanceCountry",
        applicantDocumentIssuanceCountry
      );
      formData.append(
        "applicantDocumentIssuingAuthority",
        applicantDocumentIssuingAuthority
      );
      formData.append("applicantDocumentIssueDate", applicantDocumentIssueDate);
      formData.append(
        "applicantDocumentExpiryDate",
        applicantDocumentExpiryDate
      );
      formData.append("applicantDocumentFile", fileApplicant);

      if (toggleApplicantPOA) {
        formData.append("applicantDocumentFilePOA", fileApplicantPOA);
      }

      let obj = await dispatch(
        actions.PostApplicantKYBDetails(formData, { setApplicantLoader })
      );
      if (obj.clientId || obj.caseId) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  };

  const returnApplicantData = () => {
    let docs = [];
    for (let i = 0; i < applicantData.length; i++) {
      docs.push(applicantData[i].type); // Pushing type to docs array
    }
    // Joining the type values with a comma and space
    const uploadedDocs = docs.join(", ");

    return (
      <div>
        Thank you for submitting your documents! We're now processing your
        information. Please wait for further compliance updates.
        <hr />
        <div>
          Your Uploaded Document(s):{" "}
          <span style={{ color: "var(--accent-blue-100)" }}>
            {uploadedDocs}
          </span>
        </div>
      </div>
    );
  };

  //Applicant document requirement starts

  //LOA requirement starts

  const [documentTypeLOA, setDocumentTypeLOA] = useState("LOA");
  const [filenameLOA, setFilenameLOA] = useState("Browse Files");
  const [filetypeLOA, setFiletypeLOA] = useState(
    "Accepted Formats: jpg/jpeg/png/pdf"
  );
  const [filesizeLOA, setFilesizeLOA] = useState("0.00");
  const [fileLOA, setFileLOA] = useState(null);
  const fileInputRefLOA = useRef(null);

  const fileUploadLOA = () => {
    fileInputRefLOA.current.click();
  };

  const handleFileChangeLOA = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      const maxSizeInMB = 5;
      const fileSizeInMB = selectedFile.size / (1024 * 1024);

      // Validate file type
      if (!allowedTypes.includes(selectedFile.type)) {
        // Reset state if no file is selected
        setFileLOA(null);
        setFilenameLOA("Browse File");
        setFiletypeLOA("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesizeLOA("0.00");
        setFileSizeViewLOA(false);
        toast.error(
          "Invalid file type. Only jpg, jpeg, png, and pdf files are allowed."
        );
        return;
      }

      // Validate file size
      if (fileSizeInMB > maxSizeInMB) {
        // Reset state if no file is selected
        setFileLOA(null);
        setFilenameLOA("Browse File");
        setFiletypeLOA("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesizeLOA("0.00");
        setFileSizeViewLOA(false);
        toast.error("File size exceeds the maximum limit of 5MB.");
        return;
      }

      setFileLOA(selectedFile);
      setFilenameLOA(selectedFile.name);
      setFiletypeLOA("Uploaded Filetype: " + selectedFile.type);
      setFilesizeLOA((selectedFile.size / (1024 * 1024)).toFixed(2));
      setFileSizeViewLOA(true);
    } else {
      setFileLOA(null);
      setFilenameLOA("Browse File");
      setFiletypeLOA("Accepted Formats: jpg/jpeg/png/pdf");
      setFilesizeLOA("0.00");
      setFileSizeViewLOA(false);
    }
  };

  const submitLOA = async () => {
    if (!documentTypeLOA) {
      toast.warn("LOA's Document Type must not be empty");
      return;
    } else if (!fileLOA) {
      toast.warn("Please Select a Document File");
      return;
    } else {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("businessRegistrationNumber", internalBusinessId);
      formData.append("customerHashId", userOnboardingDetails?.customerHashId);
      formData.append("email", sessionStorage.getItem("lastemail"));
      formData.append("fileTypes", "loa");
      formData.append("region", region);

      //Default inclusion of applicant document
      formData.append("applicantDocumentType", documentTypeLOA);
      formData.append("applicantDocumentFile", fileLOA);

      let obj = await dispatch(
        actions.PostLOADetails(formData, { setLOALoader })
      );
      if (obj.clientId || obj.caseId) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  };

  const returnLOADetails = () => {
    let docs = [];
    for (let i = 0; i < loaData.length; i++) {
      docs.push(loaData[i].type); // Pushing type to docs array
    }
    // Joining the type values with a comma and space
    const uploadedDocs = docs.join(", ");

    return (
      <div>
        Thank you for submitting your documents! We're now processing your
        information. Please wait for further compliance updates.
        <hr />
        <div>
          Your Uploaded Document(s):{" "}
          <span style={{ color: "var(--accent-blue-100)" }}>
            {uploadedDocs}
          </span>
        </div>
      </div>
    );
  };
  //LOA requirement ends

  const handleHover = () => {};

  const handleHoverOut = () => {};

  // Get the current date in the format "YYYY-MM-DD"
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0.00");
    const day = today.getDate().toString().padStart(2, "0.00");
    return `${year}-${month}-${day}`;
  }

  //Prevent entering future dates using manual means
  function preventFutureDates(event) {
    let currentDate = getCurrentDate();
    if (event.target.value > currentDate) {
      toast.warn("Please select a date on or before " + currentDate);
      event.target.value = "";
    } else {
    }
  }

  //Prevent entering past dates using manual means
  function preventPastDates(event) {
    let currentDate = getCurrentDate();
    let inputDate = event.target.value;

    // Check if the input date is valid and complete
    if (
      inputDate.length === 10 &&
      new Date(inputDate) < new Date(currentDate)
    ) {
      toast.warn("Please select a date after " + currentDate);
      inputDate = "";
    } else {
    }
  }

  return (
    <>
      <AlertEKYC />
      <AlertMKYC />

      {!complianceStatus ? (
        <>
          {
            <>
              {(lastScreenCompleted === 8 && userStatus === "F") ||
              userOnboardingDetails.status === "STARTED" ? (
                <>{generateInReviewDiv()}</>
              ) : (
                <>{generateIncompletedDiv()}</>
              )}
            </>
          }
        </>
      ) : complianceStatus === "COMPLETED" ? (
        <>{generateCompletedDiv()}</>
      ) : (
        <>
          <div className="accordion" id="accordionExample">
            <div className="accordion-item border-0" id="remarksDiv">
              <button
                className="accordion1 border-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFive"
                aria-expanded="true"
                aria-controls="collapseFive"
              >
                <div className="pending">
                  <div className="file-zip-parent">
                    <ReactSVG
                      src="/onboarding/accounts/kybDetails/busDocDet.svg"
                      beforeInjection={(svg) => {
                        svg.setAttribute("style", "stroke: yellow");
                        const paths = svg.querySelectorAll("path");
                        paths.forEach((path) => {
                          path.setAttribute("stroke", "#E0990C");
                        });
                      }}
                      className="file-zip-icon"
                    />
                    <img
                      className="edit-circle-icon1"
                      alt=""
                      src={"/onboarding/accounts/pending.svg"}
                    />
                  </div>
                </div>
                <div className="title4">
                  <div className="add-details-to1">
                    Compliance Remarks
                    <span className="mx-1" style={{ color: "red" }}>
                      *
                    </span>
                  </div>
                  {/* <div className={"bg-pending text-start"}>{"In-Progress"}</div> */}
                </div>
                <div className="icon-open2">
                  <div className="chevron-up1">
                    <img
                      className="arrow-icon15"
                      alt=""
                      src="/onboarding/arrow2.svg"
                    />
                  </div>
                </div>
              </button>
              <div
                id="collapseFive"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <form className="form">
                  <div className="d-flex align-self-stretch">
                    <div
                      style={{
                        display: "grid",
                        gridGap: "15px",
                        width: " 100%",
                      }}
                    >
                      <label htmlFor="country">
                        Remarks
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </label>
                      {/* <textarea
                        id="complianceRemarks"
                        readOnly
                        style={{
                          borderRadius: "15px",
                          height: "120px",
                          padding: "15px",
                          border: "2px solid lightgray",
                          color: "grey",
                          fontWeight: "500",
                        }}
                        value={complianceRemarks}
                        onInput={setComplianceRemarks}
                      ></textarea> */}
                      <div className="p-4 border rounded-4">
                        {complianceRemarksDiv}
                      </div>
                    </div>
                  </div>
                  {complianceStatus &&
                  (complianceStatus === "ERROR" ||
                    complianceStatus === "REJECT") ? (
                    <>
                      <div className="d-flex" style={{ gap: "15px" }}>
                        {businessKybMode &&
                        (businessKybMode === "E_KYC" ||
                          businessKybMode === "E_KYB") ? (
                          <>
                            <button
                              className="submit-btn"
                              type="button"
                              id="resubmitEKYC"
                              onClick={() => {
                                document
                                  .getElementById("openAlertModalBtn")
                                  .click();
                              }}
                              style={{ width: "13.5em" }}
                            >
                              <img
                                className="check-double-icon"
                                alt=""
                                src="/onboarding/submit-icon.svg"
                              />
                              <div className="label7 submitBtn">
                                Re-initiate E-KYC
                              </div>
                            </button>
                          </>
                        ) : (
                          <>
                            {" "}
                            <button
                              className="submit-btn"
                              type="button"
                              id="resubmitMKYC"
                              onClick={() => {
                                document
                                  .getElementById("MKYCopenAlertModalBtn")
                                  .click();
                              }}
                              style={{ width: "13.5em" }}
                            >
                              <div
                                id="button-text-mkyc"
                                style={{ display: "flex" }}
                              >
                                <img
                                  className="check-double-icon"
                                  alt=""
                                  src="/onboarding/submit-icon.svg"
                                />
                                <div className="label7 submitBtn">
                                  Re-initiate KYC
                                </div>
                              </div>
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </form>
              </div>
            </div>

            {applicantKycMode === "E_KYC" && kycUrl ? (
              <>
                <div className="accordion-item border-0" id="kycUrlKYBDiv">
                  <button
                    className="accordion1 border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFour"
                    aria-expanded="true"
                    aria-controls="collapseFour"
                  >
                    <div className={status}>
                      <div className="file-zip-parent">
                        <ReactSVG
                          src="/onboarding/accounts/kybDetails/busDocDet.svg"
                          beforeInjection={(svg) => {
                            svg.setAttribute("style", "stroke: yellow");
                            const paths = svg.querySelectorAll("path");
                            paths.forEach((path) => {
                              path.setAttribute(
                                "stroke",
                                status === "pending"
                                  ? "#E0990C"
                                  : status == "progress"
                                  ? "#299E58"
                                  : "#099cbc"
                              );
                            });
                          }}
                          className="file-zip-icon"
                        />
                        <img
                          className="edit-circle-icon1"
                          alt=""
                          src={"/onboarding/accounts/" + status + ".svg"}
                        />
                      </div>
                    </div>
                    <div className="title4">
                      <div className="add-details-to1">
                        Start KYC Process
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </div>
                      <div className={"bg-" + status + " text-start"}>
                        {status === "pending"
                          ? "Not Started"
                          : status == "progress"
                          ? "Submitted "
                          : "Approved"}
                      </div>
                    </div>
                    <div className="icon-open2">
                      <div className="chevron-up1">
                        <img
                          className="arrow-icon15"
                          alt=""
                          src="/onboarding/arrow2.svg"
                        />
                      </div>
                    </div>
                  </button>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <form className="form">
                      <div className="d-flex align-self-stretch">
                        <div className="input-group w-100 pb-0">
                          <input
                            maxLength={255}
                            id="kycUrl"
                            className="form-input my-0 pb-0"
                            value={kycUrl}
                            onInput={(e) => setKycUrl(e.target.value)}
                            readOnly
                          />
                          <label
                            htmlFor="country"
                            className="form-input-label ps-1"
                          >
                            KYC URL
                            <span className="mx-1" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="d-flex" style={{ gap: "15px" }}>
                        <button
                          className="submit-btn"
                          type="button"
                          id="submitEKYC"
                          onClick={() => {
                            window.open(kycUrl, "_blank");
                          }}
                        >
                          <img
                            className="check-double-icon"
                            alt=""
                            src="/onboarding/submit-icon.svg"
                          />
                          <div className="label7 submitBtn">Start E-KYC</div>
                        </button>
                      </div>
                      <label>
                        If the link appears expired,{" "}
                        <Link
                          to="#!"
                          onClick={() =>
                            dispatch(
                              actions.RegenerateKycUrl(
                                userOnboardingDetails.customerHashId,
                                { setKycUrl }
                              )
                            )
                          }
                        >
                          {" "}
                          regenerate a new kyc link
                        </Link>
                        .
                      </label>
                    </form>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {showBusinessDiv ? (
              <>
                <div className="accordion-item border-0" id="businessKYBDiv">
                  <button
                    className="accordion1 border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    <div className={status2}>
                      <div className="file-zip-parent">
                        <ReactSVG
                          src="/onboarding/accounts/kybDetails/busDocDet.svg"
                          beforeInjection={(svg) => {
                            svg.setAttribute("style", "stroke: yellow");
                            const paths = svg.querySelectorAll("path");
                            paths.forEach((path) => {
                              path.setAttribute(
                                "stroke",
                                status2 === "pending"
                                  ? "#E0990C"
                                  : status2 == "progress"
                                  ? "#299E58"
                                  : "#099cbc"
                              );
                            });
                          }}
                          className="file-zip-icon"
                        />
                        <img
                          className="edit-circle-icon1"
                          alt=""
                          src={"/onboarding/accounts/" + status2 + ".svg"}
                        />
                      </div>
                    </div>
                    <div className="title4">
                      <div className="add-details-to1">
                        Business Document Details
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </div>
                      <div className={"bg-" + status2 + " text-start"}>
                        {status2 === "pending"
                          ? "Submitted"
                          : status2 == "progress"
                          ? "Not Started"
                          : "Approved"}
                      </div>
                    </div>
                    <div className="icon-open2">
                      <div className="chevron-up1">
                        <img
                          className="arrow-icon15"
                          alt=""
                          src="/onboarding/arrow2.svg"
                        />
                      </div>
                    </div>
                  </button>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    {businessData.length > 0 ? (
                      <>
                        <form className="form">
                          {returnBusinessData()}

                          <div className="d-flex align-items-center w-100">
                            Would you like to upload any additional document(s)?
                            <input
                              maxLength={255}
                              type="checkbox"
                              className="mx-2"
                              value={toggleBusinessDocument}
                              onChange={(e) =>
                                setToggleBusinessDocument(e.target.checked)
                              }
                            />
                          </div>
                        </form>

                        {toggleBusinessDocument ? (
                          <>
                            <form className="form">
                              <div className="d-flex align-self-stretch">
                                <div className="input-group w-100 pb-0">
                                  <select
                                    id="businessDocumentType"
                                    className="form-input my-0 pb-0"
                                    value={businessDocumentType}
                                    onChange={(e) =>
                                      setBusinessDocumentType(e.target.value)
                                    }
                                  >
                                    <option value=""></option>
                                    {documentType.map((item) => {
                                      return (
                                        <option value={item.code}>
                                          {item.description}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  <label
                                    htmlFor="country"
                                    className="form-input-label ps-1"
                                  >
                                    Business Document Type
                                    <span
                                      className="mx-1"
                                      style={{ color: "red" }}
                                    >
                                      *
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div className="d-flex align-self-stretch browse1">
                                <div className="upload-document">
                                  Upload Document
                                </div>
                                <button
                                  type="button"
                                  className="browse-file1"
                                  onClick={fileUpload}
                                  style={{
                                    padding: "15px",
                                    borderRadius: "15px",
                                  }}
                                >
                                  <img
                                    className="files-icon"
                                    alt=""
                                    src="/onboarding/download51.svg"
                                  />
                                  <div
                                    className="drag-drop-or-group"
                                    style={{ display: "block" }}
                                  >
                                    <input
                                      maxLength={255}
                                      type="file"
                                      id="businessDocumentFile"
                                      ref={fileInputRef}
                                      style={{ display: "none" }}
                                      onChange={handleFileChange}
                                    />
                                    <div
                                      className="browse2"
                                      id="businessKYBFilename"
                                    >
                                      {filename}
                                    </div>
                                  </div>
                                </button>
                                <div className="w-100 text-center text-black text-uppercase mt-2 d-flex flex-column gap-1">
                                  <div
                                    className="button-21"
                                    id="businessKYBFiletype"
                                  >
                                    {filetype}
                                  </div>

                                  {fileSizeView ? (
                                    <>
                                      <div className="button-21">
                                        File size: {filesize}MB
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  <div
                                    className="button-21"
                                    style={{ color: "red" }}
                                  >
                                    **MAX FILE-SIZE: 5MB
                                  </div>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  gap: "15px",
                                  margin: "4rem 0",
                                }}
                              >
                                <button
                                  className="submit-btn"
                                  type="button"
                                  id="submitBusinessKYBDetails"
                                  onClick={submitBusinessKYBDetails}
                                  disabled={BusinessLoader}
                                >
                                  {BusinessLoader ? (
                                    <>
                                      <ScaleLoader
                                        height={20}
                                        width={5}
                                        color="white"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        className="check-double-icon"
                                        alt=""
                                        src="/onboarding/submit-icon.svg"
                                      />
                                      <div className="label7 submitBtn">
                                        Submit
                                      </div>
                                    </>
                                  )}
                                </button>
                              </div>
                            </form>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        <form className="form">
                          <div className="d-flex align-self-stretch">
                            <div className="input-group w-100 pb-0">
                              <select
                                id="businessDocumentType"
                                className="form-input my-0 pb-0"
                                value={businessDocumentType}
                                onChange={(e) =>
                                  setBusinessDocumentType(e.target.value)
                                }
                              >
                                <option value=""></option>
                                {documentType.map((item) => {
                                  return (
                                    <option value={item.code}>
                                      {item.description}
                                    </option>
                                  );
                                })}
                              </select>
                              <label
                                htmlFor="country"
                                className="form-input-label ps-1"
                              >
                                Business Document Type
                                <span className="mx-1" style={{ color: "red" }}>
                                  *
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className="d-flex align-self-stretch browse1">
                            <div className="upload-document">
                              Upload Document
                            </div>
                            <button
                              type="button"
                              className="browse-file1"
                              onClick={fileUpload}
                              style={{ padding: "15px", borderRadius: "15px" }}
                            >
                              <img
                                className="files-icon"
                                alt=""
                                src="/onboarding/download51.svg"
                              />
                              <div
                                className="drag-drop-or-group"
                                style={{ display: "block" }}
                              >
                                <input
                                  maxLength={255}
                                  type="file"
                                  id="businessDocumentFile"
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                  onChange={handleFileChange}
                                />
                                <div
                                  className="browse2"
                                  id="businessKYBFilename"
                                >
                                  {filename}
                                </div>
                              </div>
                            </button>
                            <div className="w-100 text-center text-black text-uppercase mt-2 d-flex flex-column gap-1">
                              <div
                                className="button-21"
                                id="businessKYBFiletype"
                              >
                                {filetype}
                              </div>
                              {fileSizeView ? (
                                <>
                                  <div className="button-21">
                                    File size: {filesize}MB
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                              <div
                                className="button-21"
                                style={{ color: "red" }}
                              >
                                **MAX FILE-SIZE: 5MB
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "15px",
                              margin: "4rem 0",
                            }}
                          >
                            <button
                              className="submit-btn"
                              type="button"
                              id="submitBusinessKYBDetails"
                              onClick={submitBusinessKYBDetails}
                              disabled={BusinessLoader}
                            >
                              {BusinessLoader ? (
                                <>
                                  <ScaleLoader
                                    height={20}
                                    width={5}
                                    color="white"
                                  />
                                </>
                              ) : (
                                <>
                                  <img
                                    className="check-double-icon"
                                    alt=""
                                    src="/onboarding/submit-icon.svg"
                                  />
                                  <div className="label7 submitBtn">Submit</div>
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {showStakeholderDiv ? (
              <>
                <div
                  className="accordion-item border-0 w-100"
                  id="stakeholderKYBDiv"
                >
                  <button
                    className="accordion1 border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="true"
                    aria-controls="collapseTwo"
                  >
                    <div className={status4}>
                      <div className="file-zip-parent">
                        <ReactSVG
                          src="/onboarding/accounts/kybDetails/stakeDocDet.svg"
                          beforeInjection={(svg) => {
                            svg.setAttribute("style", "stroke: yellow");
                            const paths = svg.querySelectorAll("path");
                            paths.forEach((path) => {
                              path.setAttribute(
                                "stroke",
                                status4 === "pending"
                                  ? "#E0990C"
                                  : status4 == "progress"
                                  ? "#299E58"
                                  : "#099cbc"
                              );
                            });
                          }}
                          className="file-zip-icon"
                        />
                        <img
                          className="edit-circle-icon1"
                          alt=""
                          src={"/onboarding/accounts/" + status4 + ".svg"}
                        />
                      </div>
                    </div>
                    <div className="title4">
                      <div className="add-details-to1">
                        Stakeholder Document Details
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </div>
                      <div className={"bg-" + status4 + " text-start"}>
                        {status4 === "pending"
                          ? "Submitted"
                          : status4 == "progress"
                          ? "Not Started"
                          : "Approved"}
                      </div>
                    </div>
                    <div className="icon-open2">
                      <div className="chevron-up1">
                        <img
                          className="arrow-icon15"
                          alt=""
                          src="/onboarding/arrow2.svg"
                        />
                      </div>
                    </div>
                  </button>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse py-3"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                    style={{ padding: "0 5.5rem" }}
                  >
                    <StakeholderDetails
                      stakeholderData={stakeholderData}
                      documentTypeList={documentType}
                    />
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {showApplicantDiv ? (
              <>
                <div className="accordion-item border-0" id="applicantKYBDiv">
                  <button
                    className="accordion1 border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="true"
                    aria-controls="collapseThree"
                  >
                    <div className={status3}>
                      <div className="file-zip-parent">
                        <ReactSVG
                          src="/onboarding/accounts/kybDetails/appDocDet.svg"
                          beforeInjection={(svg) => {
                            svg.setAttribute("style", "stroke: yellow");
                            const paths = svg.querySelectorAll("path");
                            paths.forEach((path) => {
                              path.setAttribute(
                                "stroke",
                                status3 === "pending"
                                  ? "#E0990C"
                                  : status3 == "progress"
                                  ? "#299E58"
                                  : "#099cbc"
                              );
                            });
                          }}
                          className="file-zip-icon"
                        />
                        <img
                          className="edit-circle-icon1"
                          alt=""
                          src={"/onboarding/accounts/" + status3 + ".svg"}
                        />
                      </div>
                    </div>
                    <div className="title4">
                      <div className="add-details-to1">
                        Applicant Document Details
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </div>
                      <div className={"bg-" + status3 + " text-start"}>
                        {status3 === "pending"
                          ? "Submitted"
                          : status3 == "progress"
                          ? "Not Started"
                          : "Approved"}
                      </div>
                    </div>
                    <div className="icon-open2">
                      <div className="chevron-up1">
                        <img
                          className="arrow-icon15"
                          alt=""
                          src="/onboarding/arrow2.svg"
                        />
                      </div>
                    </div>
                  </button>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    {applicantKycMode &&
                    (applicantKycMode === "E_KYC" ||
                      applicantKycMode === "E_DOC_VERIFY") ? (
                      <>
                        <form className="form">
                          <div className="d-flex align-self-stretch">{`No Documents required...`}</div>
                        </form>
                      </>
                    ) : (
                      <>
                        {applicantData.length > 0 ? (
                          <>
                            <form className="form">
                              {returnApplicantData()}

                              <div className="d-flex align-items-center w-100">
                                Would you like to upload any additional
                                document(s)?
                                <input
                                  maxLength={255}
                                  type="checkbox"
                                  className="mx-2"
                                  value={toggleApplicantDocument}
                                  onChange={(e) =>
                                    setToggleApplicantDocument(e.target.checked)
                                  }
                                />
                              </div>

                              {toggleApplicantDocument ? (
                                <>
                                  <div className="d-flex align-self-stretch">
                                    <div className="input-group w-50 me-2 pb-0">
                                      <select
                                        id="applicantDocumentType"
                                        className="form-input my-0 pb-0"
                                        value={applicantDocumentType}
                                        onChange={(e) =>
                                          setApplicantDocumentType(
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value=""></option>
                                        {documentType.map((item) => {
                                          return (
                                            <option value={item.code}>
                                              {item.description}
                                            </option>
                                          );
                                        })}
                                      </select>
                                      <label
                                        htmlFor="country"
                                        className="form-input-label ps-1"
                                      >
                                        Applicant Document Type
                                        <span
                                          className="mx-1"
                                          style={{ color: "red" }}
                                        >
                                          *
                                        </span>
                                      </label>
                                    </div>
                                    <div className="input-group w-50 ms-2 pb-0">
                                      <input
                                        maxLength={255}
                                        name="Applicant Document Number"
                                        className="form-input my-0 pb-0"
                                        value={applicantDocumentNumber}
                                        onInput={(e) => {
                                          restrictions.restrictInputDocumentNo(
                                            e
                                          );
                                          setApplicantDocumentNumber(
                                            e.target.value
                                          );
                                        }}
                                        onBlur={(e) =>
                                          validations.alphanumeric(
                                            e.target.value,
                                            e.target.name
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor="country"
                                        className="form-input-label ps-1"
                                      >
                                        Applicant Document Number
                                        <span
                                          className="mx-1"
                                          style={{ color: "red" }}
                                        >
                                          *
                                        </span>
                                      </label>
                                    </div>
                                  </div>

                                  <div className="d-flex align-self-stretch">
                                    <div className="input-group w-50 me-2 pb-0">
                                      <input
                                        maxLength={255}
                                        name="Applicant Document Reference Number"
                                        className="form-input my-0 pb-0"
                                        value={applicantDocumentReferenceNumber}
                                        onInput={(e) => {
                                          restrictions.restrictInputDocumentNo(
                                            e
                                          );
                                          setApplicantDocumentReferenceNumber(
                                            e.target.value
                                          );
                                        }}
                                        onBlur={(e) =>
                                          validations.alphanumeric(
                                            e.target.value,
                                            e.target.name
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor="country"
                                        className="form-input-label ps-1"
                                      >
                                        Applicant Document Reference Number
                                      </label>
                                    </div>
                                    <div className="input-group w-50 ms-2 pb-0">
                                      <input
                                        maxLength={255}
                                        name="Applicant Document Holder Name"
                                        className="form-input my-0 pb-0"
                                        value={applicantDocumentHolderName}
                                        onInput={(e) => {
                                          restrictions.restrictInputPersonName(
                                            e
                                          );
                                          setApplicantDocumentHolderName(
                                            e.target.value
                                          );
                                        }}
                                        onBlur={(e) =>
                                          validations.name(
                                            e.target.value,
                                            e.target.name
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor="country"
                                        className="form-input-label ps-1"
                                      >
                                        Applicant Document Holder Name
                                      </label>
                                    </div>
                                  </div>

                                  <div className="d-flex align-self-stretch">
                                    <div className="input-group w-50 me-2 pb-0">
                                      <select
                                        id="applicantDocumentIssuanceCountry"
                                        className="form-input my-0 pb-0"
                                        value={applicantDocumentIssuanceCountry}
                                        onChange={(e) =>
                                          setApplicantDocumentIssuanceCountry(
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value=""></option>
                                        {listCountry.map((item) => {
                                          return (
                                            <option value={item.code}>
                                              {item.description}
                                            </option>
                                          );
                                        })}
                                      </select>
                                      <label
                                        htmlFor="country"
                                        className="form-input-label ps-1"
                                      >
                                        Applicant Document Issuance Country
                                        <span
                                          className="mx-1"
                                          style={{ color: "red" }}
                                        >
                                          *
                                        </span>
                                      </label>
                                    </div>
                                    <div className="input-group w-50 ms-2 pb-0">
                                      <select
                                        id="applicantDocumentIssuingAuthority"
                                        className="form-input my-0 pb-0"
                                        value={
                                          applicantDocumentIssuingAuthority
                                        }
                                        onChange={(e) =>
                                          setApplicantDocumentIssuingAuthority(
                                            e.target.value
                                          )
                                        }
                                      >
                                        <option value=""></option>
                                        {listCountry.map((item) => {
                                          return (
                                            <option value={item.code}>
                                              {item.description}
                                            </option>
                                          );
                                        })}
                                      </select>
                                      <label
                                        htmlFor="country"
                                        className="form-input-label ps-1"
                                      >
                                        Applicant Document Issuing Authority
                                      </label>
                                    </div>
                                  </div>

                                  <div className="d-flex align-self-stretch">
                                    <div className="input-group w-50 me-2 pb-0">
                                      <input
                                        maxLength={255}
                                        type="date"
                                        id="applicantDocumentIssueDate"
                                        className="form-input my-0 pb-0"
                                        max={getCurrentDate()}
                                        onBlur={(event) => {
                                          preventFutureDates(event);
                                        }}
                                        value={applicantDocumentIssueDate}
                                        onChange={(e) =>
                                          setApplicantDocumentIssueDate(
                                            e.target.value
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor="country"
                                        className="form-input-label ps-1"
                                      >
                                        Applicant Document Issue Date
                                      </label>
                                    </div>
                                    <div className="input-group w-50 ms-2 pb-0">
                                      <input
                                        maxLength={255}
                                        type="date"
                                        id="applicantDocumentExpiryDate"
                                        className="form-input my-0 pb-0"
                                        min={getCurrentDate()}
                                        onBlur={(event) => {
                                          preventPastDates(event);
                                        }}
                                        value={applicantDocumentExpiryDate}
                                        onChange={(e) =>
                                          setApplicantDocumentExpiryDate(
                                            e.target.value
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor="country"
                                        className="form-input-label ps-1"
                                      >
                                        Applicant Document Expiry Date
                                        <span
                                          className="mx-1"
                                          style={{ color: "red" }}
                                        >
                                          *
                                        </span>
                                      </label>
                                    </div>
                                  </div>

                                  <div
                                    className="d-flex align-self-stretch browse1"
                                    onMouseOver={handleHover}
                                    onMouseOut={handleHoverOut}
                                  >
                                    <div className="upload-document">
                                      Upload Document
                                    </div>
                                    <button
                                      type="button"
                                      className="browse-file1"
                                      onClick={fileUploadApplicant}
                                      style={{
                                        padding: "15px",
                                        borderRadius: "15px",
                                      }}
                                    >
                                      <img
                                        className="files-icon"
                                        alt=""
                                        src="/onboarding/download51.svg"
                                      />

                                      <div
                                        className="drag-drop-or-group"
                                        style={{ display: "block" }}
                                      >
                                        <input
                                          maxLength={255}
                                          type="file"
                                          id="applicantDocumentFile"
                                          style={{ display: "none" }}
                                          ref={fileInputRefApplicant}
                                          onChange={handleFileChangeApplicant}
                                        />
                                        <div
                                          className="browse2"
                                          id="applicantDocumentFilename"
                                        >
                                          {filenameApplicant}
                                        </div>
                                      </div>
                                    </button>
                                    <div className="w-100 text-center text-black text-uppercase mt-2 d-flex flex-column gap-1">
                                      <div
                                        className="button-21"
                                        id="applicantDocumentFiletype"
                                      >
                                        {filetypeApplicant}
                                      </div>
                                      {fileSizeViewApplicant ? (
                                        <>
                                          <div className="button-21">
                                            File size: {filesizeApplicant}MB
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      <div
                                        className="button-21"
                                        style={{ color: "red" }}
                                      >
                                        **MAX FILE-SIZE: 5MB
                                      </div>
                                    </div>
                                  </div>

                                  <p
                                    className="w-100 d-none"
                                    style={{ marginTop: "4rem" }}
                                  >
                                    If the above document doesn't have any
                                    address proof, you need to upload an address
                                    proof. Do you want to upload a Proof of
                                    Address?{" "}
                                    <input
                                      maxLength={255}
                                      type="checkbox"
                                      id="POA-checkbox"
                                      onChange={(e) =>
                                        setToggleApplicantPOA(e.target.checked)
                                      }
                                      value={toggleApplicantPOA}
                                    />
                                  </p>

                                  {toggleApplicantPOA ? (
                                    <>
                                      <div id="POA-Div">
                                        <div className="d-flex align-self-stretch">
                                          <div className="input-group w-100 me-2 pb-0">
                                            <select
                                              id="applicantDocumentType"
                                              className="form-input my-0 pb-0"
                                              value={applicantDocumentTypePOA}
                                              onChange={(e) =>
                                                setApplicantDocumentTypePOA(
                                                  e.target.value
                                                )
                                              }
                                            >
                                              <option value="PROOF_OF_ADDRESS">
                                                PROOF OF ADDRESS
                                              </option>
                                            </select>
                                            <label
                                              htmlFor="country"
                                              className="form-input-label ps-1"
                                            >
                                              Applicant Document Type
                                              <span
                                                className="mx-1"
                                                style={{ color: "red" }}
                                              >
                                                *
                                              </span>
                                            </label>
                                          </div>
                                        </div>
                                        <div className="d-flex align-self-stretch browse1">
                                          <div className="upload-document">
                                            Upload Document
                                          </div>
                                          <button
                                            type="button"
                                            className="browse-file1"
                                            onClick={fileUploadApplicantPOA}
                                            style={{
                                              padding: "15px",
                                              borderRadius: "15px",
                                            }}
                                          >
                                            <img
                                              className="files-icon"
                                              alt=""
                                              src="/onboarding/download51.svg"
                                            />

                                            <div
                                              className="drag-drop-or-group"
                                              style={{ display: "block" }}
                                            >
                                              <input
                                                maxLength={255}
                                                type="file"
                                                id="applicantPOADocumentFile"
                                                style={{ display: "none" }}
                                                ref={fileInputRefApplicantPOA}
                                                onChange={
                                                  handleFileChangeApplicantPOA
                                                }
                                              />
                                              <div className="browse2">
                                                {filenameApplicantPOA}
                                              </div>
                                            </div>
                                          </button>
                                          <div className="w-100 text-center text-black text-uppercase mt-2 d-flex flex-column gap-1">
                                            <div className="button-21">
                                              {filetypeApplicantPOA}
                                            </div>
                                            {fileSizeViewApplicantPOA ? (
                                              <>
                                                <div className="button-21">
                                                  File size:{" "}
                                                  {filesizeApplicantPOA}MB
                                                </div>
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                            <div
                                              className="button-21"
                                              style={{ color: "red" }}
                                            >
                                              **MAX FILE-SIZE: 5MB
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <></>
                                  )}

                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "15px",
                                      margin: "4rem 0",
                                    }}
                                  >
                                    <button
                                      className="submit-btn"
                                      type="button"
                                      id="submitApplicantKYBDetails"
                                      onClick={submitApplicantKYBDetails}
                                      disabled={ApplicantLoader}
                                    >
                                      {ApplicantLoader ? (
                                        <>
                                          <ScaleLoader
                                            height={20}
                                            width={5}
                                            color="white"
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <img
                                            className="check-double-icon"
                                            alt=""
                                            src="/onboarding/submit-icon.svg"
                                          />
                                          <div className="label7 submitBtn">
                                            Submit
                                          </div>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </form>
                          </>
                        ) : (
                          <>
                            <form className="form">
                              <>
                                <div className="d-flex align-self-stretch">
                                  <div className="input-group w-50 me-2 pb-0">
                                    <select
                                      id="applicantDocumentType"
                                      className="form-input my-0 pb-0"
                                      value={applicantDocumentType}
                                      onChange={(e) =>
                                        setApplicantDocumentType(e.target.value)
                                      }
                                    >
                                      <option value=""></option>
                                      {documentType.map((item) => {
                                        return (
                                          <option value={item.code}>
                                            {item.description}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    <label
                                      htmlFor="country"
                                      className="form-input-label ps-1"
                                    >
                                      Applicant Document Type
                                      <span
                                        className="mx-1"
                                        style={{ color: "red" }}
                                      >
                                        *
                                      </span>
                                    </label>
                                  </div>
                                  <div className="input-group w-50 ms-2 pb-0">
                                    <input
                                      maxLength={255}
                                      name="Applicant Document Number"
                                      className="form-input my-0 pb-0"
                                      value={applicantDocumentNumber}
                                      onInput={(e) => {
                                        restrictions.restrictInputDocumentNo(e);
                                        setApplicantDocumentNumber(
                                          e.target.value
                                        );
                                      }}
                                      onBlur={(e) =>
                                        validations.alphanumeric(
                                          e.target.value,
                                          e.target.name
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor="country"
                                      className="form-input-label ps-1"
                                    >
                                      Applicant Document Number
                                      <span
                                        className="mx-1"
                                        style={{ color: "red" }}
                                      >
                                        *
                                      </span>
                                    </label>
                                  </div>
                                </div>

                                <div className="d-flex align-self-stretch">
                                  <div className="input-group w-50 me-2 pb-0">
                                    <input
                                      maxLength={255}
                                      name="Applicant Document Reference Number"
                                      className="form-input my-0 pb-0"
                                      value={applicantDocumentReferenceNumber}
                                      onInput={(e) => {
                                        restrictions.restrictInputDocumentNo(e);
                                        setApplicantDocumentReferenceNumber(
                                          e.target.value
                                        );
                                      }}
                                      onBlur={(e) =>
                                        validations.alphanumeric(
                                          e.target.value,
                                          e.target.name
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor="country"
                                      className="form-input-label ps-1"
                                    >
                                      Applicant Document Reference Number
                                    </label>
                                  </div>
                                  <div className="input-group w-50 ms-2 pb-0">
                                    <input
                                      maxLength={255}
                                      name="Applicant Document Holder Name"
                                      className="form-input my-0 pb-0"
                                      value={applicantDocumentHolderName}
                                      onInput={(e) => {
                                        restrictions.restrictInputPersonName(e);
                                        setApplicantDocumentHolderName(
                                          e.target.value
                                        );
                                      }}
                                      onBlur={(e) =>
                                        validations.name(
                                          e.target.value,
                                          e.target.name
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor="country"
                                      className="form-input-label ps-1"
                                    >
                                      Applicant Document Holder Name
                                    </label>
                                  </div>
                                </div>

                                <div className="d-flex align-self-stretch">
                                  <div className="input-group w-50 me-2 pb-0">
                                    <select
                                      id="applicantDocumentIssuanceCountry"
                                      className="form-input my-0 pb-0"
                                      value={applicantDocumentIssuanceCountry}
                                      onChange={(e) =>
                                        setApplicantDocumentIssuanceCountry(
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value=""></option>
                                      {listCountry.map((item) => {
                                        return (
                                          <option value={item.code}>
                                            {item.description}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    <label
                                      htmlFor="country"
                                      className="form-input-label ps-1"
                                    >
                                      Applicant Document Issuance Country
                                      <span
                                        className="mx-1"
                                        style={{ color: "red" }}
                                      >
                                        *
                                      </span>
                                    </label>
                                  </div>
                                  <div className="input-group w-50 ms-2 pb-0">
                                    <select
                                      id="applicantDocumentIssuingAuthority"
                                      className="form-input my-0 pb-0"
                                      value={applicantDocumentIssuingAuthority}
                                      onChange={(e) =>
                                        setApplicantDocumentIssuingAuthority(
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value=""></option>
                                      {listCountry.map((item) => {
                                        return (
                                          <option value={item.code}>
                                            {item.description}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    <label
                                      htmlFor="country"
                                      className="form-input-label ps-1"
                                    >
                                      Applicant Document Issuing Authority
                                    </label>
                                  </div>
                                </div>

                                <div className="d-flex align-self-stretch">
                                  <div className="input-group w-50 me-2 pb-0">
                                    <input
                                      maxLength={255}
                                      type="date"
                                      id="applicantDocumentIssueDate"
                                      className="form-input my-0 pb-0"
                                      max={getCurrentDate()}
                                      onBlur={(event) => {
                                        preventFutureDates(event);
                                      }}
                                      value={applicantDocumentIssueDate}
                                      onChange={(e) =>
                                        setApplicantDocumentIssueDate(
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor="country"
                                      className="form-input-label ps-1"
                                    >
                                      Applicant Document Issue Date
                                    </label>
                                  </div>
                                  <div className="input-group w-50 ms-2 pb-0">
                                    <input
                                      maxLength={255}
                                      type="date"
                                      id="applicantDocumentExpiryDate"
                                      className="form-input my-0 pb-0"
                                      min={getCurrentDate()}
                                      onBlur={(event) => {
                                        preventPastDates(event);
                                      }}
                                      value={applicantDocumentExpiryDate}
                                      onChange={(e) =>
                                        setApplicantDocumentExpiryDate(
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor="country"
                                      className="form-input-label ps-1"
                                    >
                                      Applicant Document Expiry Date
                                      <span
                                        className="mx-1"
                                        style={{ color: "red" }}
                                      >
                                        *
                                      </span>
                                    </label>
                                  </div>
                                </div>

                                <div
                                  className="d-flex align-self-stretch browse1"
                                  onMouseOver={handleHover}
                                  onMouseOut={handleHoverOut}
                                >
                                  <div className="upload-document">
                                    Upload Document
                                  </div>
                                  <button
                                    type="button"
                                    className="browse-file1"
                                    onClick={fileUploadApplicant}
                                    style={{
                                      padding: "15px",
                                      borderRadius: "15px",
                                    }}
                                  >
                                    <img
                                      className="files-icon"
                                      alt=""
                                      src="/onboarding/download51.svg"
                                    />

                                    <div
                                      className="drag-drop-or-group"
                                      style={{ display: "block" }}
                                    >
                                      <input
                                        maxLength={255}
                                        type="file"
                                        id="applicantDocumentFile"
                                        style={{ display: "none" }}
                                        ref={fileInputRefApplicant}
                                        onChange={handleFileChangeApplicant}
                                      />
                                      <div
                                        className="browse2"
                                        id="applicantDocumentFilename"
                                      >
                                        {filenameApplicant}
                                      </div>
                                    </div>
                                  </button>
                                  <div className="w-100 text-center text-black text-uppercase mt-2 d-flex flex-column gap-1">
                                    <div
                                      className="button-21"
                                      id="applicantDocumentFiletype"
                                    >
                                      {filetypeApplicant}
                                    </div>
                                    {fileSizeViewApplicant ? (
                                      <>
                                        <div className="button-21">
                                          File size: {filesizeApplicant}MB
                                        </div>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    <div
                                      className="button-21"
                                      style={{ color: "red" }}
                                    >
                                      **MAX FILE-SIZE: 5MB
                                    </div>
                                  </div>
                                </div>

                                <p
                                  className="w-100 d-none"
                                  style={{ marginTop: "4rem" }}
                                >
                                  If the above document doesn't have any address
                                  proof, you need to upload an address proof. Do
                                  you want to upload a Proof of Address?{" "}
                                  <input
                                    maxLength={255}
                                    type="checkbox"
                                    id="POA-checkbox"
                                    onChange={(e) =>
                                      setToggleApplicantPOA(e.target.checked)
                                    }
                                    value={toggleApplicantPOA}
                                  />
                                </p>

                                {toggleApplicantPOA ? (
                                  <>
                                    <div id="POA-Div">
                                      <div className="d-flex align-self-stretch">
                                        <div className="input-group w-100 me-2 pb-0">
                                          <select
                                            id="applicantDocumentType"
                                            className="form-input my-0 pb-0"
                                            value={applicantDocumentTypePOA}
                                            onChange={(e) =>
                                              setApplicantDocumentTypePOA(
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="PROOF_OF_ADDRESS">
                                              PROOF OF ADDRESS
                                            </option>
                                          </select>
                                          <label
                                            htmlFor="country"
                                            className="form-input-label ps-1"
                                          >
                                            Applicant Document Type
                                            <span
                                              className="mx-1"
                                              style={{ color: "red" }}
                                            >
                                              *
                                            </span>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="d-flex align-self-stretch browse1">
                                        <div className="upload-document">
                                          Upload Document
                                        </div>
                                        <button
                                          type="button"
                                          className="browse-file1"
                                          onClick={fileUploadApplicantPOA}
                                          style={{
                                            padding: "15px",
                                            borderRadius: "15px",
                                          }}
                                        >
                                          <img
                                            className="files-icon"
                                            alt=""
                                            src="/onboarding/download51.svg"
                                          />

                                          <div
                                            className="drag-drop-or-group"
                                            style={{ display: "block" }}
                                          >
                                            <input
                                              maxLength={255}
                                              type="file"
                                              id="applicantPOADocumentFile"
                                              style={{ display: "none" }}
                                              ref={fileInputRefApplicantPOA}
                                              onChange={
                                                handleFileChangeApplicantPOA
                                              }
                                            />
                                            <div className="browse2">
                                              {filenameApplicantPOA}
                                            </div>
                                          </div>
                                        </button>
                                        <div className="w-100 text-center text-black text-uppercase mt-2 d-flex flex-column gap-1">
                                          <div className="button-21">
                                            {filetypeApplicantPOA}
                                          </div>
                                          {fileSizeViewApplicantPOA ? (
                                            <>
                                              <div className="button-21">
                                                File size:{" "}
                                                {filesizeApplicantPOA}MB
                                              </div>
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                          <div
                                            className="button-21"
                                            style={{ color: "red" }}
                                          >
                                            **MAX FILE-SIZE: 5MB
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}

                                <div
                                  style={{
                                    display: "flex",
                                    gap: "15px",
                                    margin: "4rem 0",
                                  }}
                                >
                                  <button
                                    className="submit-btn"
                                    type="button"
                                    id="submitApplicantKYBDetails"
                                    onClick={submitApplicantKYBDetails}
                                    disabled={ApplicantLoader}
                                  >
                                    {ApplicantLoader ? (
                                      <>
                                        <ScaleLoader
                                          height={20}
                                          width={5}
                                          color="white"
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <img
                                          className="check-double-icon"
                                          alt=""
                                          src="/onboarding/submit-icon.svg"
                                        />
                                        <div className="label7 submitBtn">
                                          Submit
                                        </div>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </>
                            </form>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {showLOA ? (
              <>
                <div className="accordion-item border-0" id="loaKYBDiv">
                  <button
                    className="accordion1 border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseSeven"
                    aria-expanded="true"
                    aria-controls="collapseSeven"
                  >
                    <div className={status5}>
                      <div className="file-zip-parent">
                        <ReactSVG
                          src="/onboarding/accounts/kybDetails/busDocDet.svg"
                          beforeInjection={(svg) => {
                            svg.setAttribute("style", "stroke: yellow");
                            const paths = svg.querySelectorAll("path");
                            paths.forEach((path) => {
                              path.setAttribute(
                                "stroke",
                                status5 === "pending"
                                  ? "#E0990C"
                                  : status5 == "progress"
                                  ? "#299E58"
                                  : "#099cbc"
                              );
                            });
                          }}
                          className="file-zip-icon"
                        />
                        <img
                          className="edit-circle-icon1"
                          alt=""
                          src={"/onboarding/accounts/" + status5 + ".svg"}
                        />
                      </div>
                    </div>
                    <div className="title4">
                      <div className="add-details-to1">
                        Letter of Authorization Details
                        <span className="mx-1" style={{ color: "red" }}>
                          *
                        </span>
                      </div>
                      <div className={"bg-" + status5 + " text-start"}>
                        {status5 === "pending"
                          ? "Submitted"
                          : status5 == "progress"
                          ? "Not Started"
                          : "Approved"}
                      </div>
                    </div>
                    <div className="icon-open2">
                      <div className="chevron-up1">
                        <img
                          className="arrow-icon15"
                          alt=""
                          src="/onboarding/arrow2.svg"
                        />
                      </div>
                    </div>
                  </button>
                  <div
                    id="collapseSeven"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    {loaData.length > 0 ? (
                      <>
                        <form className="form">
                          {returnLOADetails()}

                          {/* <div className="d-flex align-items-center w-100">
                            Would you like to upload any additional document(s)?
                            <input maxLength={255}
                              type="checkbox"
                              className="mx-2"
                              value={toggleApplicantDocument}
                              onChange={(e) => setToggleApplicantDocument(e.target.checked)}
                            />
                          </div> */}
                        </form>

                        {/* {toggleApplicantDocument ? (
                          <>
                            <form className="form">
                              <div className="d-flex align-self-stretch">
                                <div className="input-group w-100 pb-0">
                                  <select
                                    id="businessDocumentType"
                                    
                                    className="form-input my-0 pb-0"
                                    value={businessDocumentType}
                                    onChange={(e) => setApplicantDocumentType(e.target.value)}
                                  >
                                    <option value=""></option>
                                    {documentType.map((item) => {
                                      return <option value={item.code}>{item.description}</option>;
                                    })}
                                  </select>
                                  <label htmlFor="country" className="form-input-label ps-1">
                                    Applicant Document Type
                                    <span className="mx-1" style={{ color: "red" }}>
                                      *
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div className="d-flex align-self-stretch browse1">
                                <div className="upload-document">Upload Document</div>
                                <button
                                  type="button"
                                  className="browse-file1"
                                  onClick={fileUpload}
                                  style={{ padding: "15px", borderRadius: "15px" }}
                                >
                                  <img className="files-icon" alt="" src="/onboarding/download51.svg" />
                                  <div className="drag-drop-or-group" style={{ display: "block" }}>
                                    <input maxLength={255}
                                      type="file"
                                      id="businessDocumentFile"
                                      ref={fileInputRef}
                                      style={{ display: "none" }}
                                      onChange={handleFileChange}
                                    />
                                    <div className="browse2" id="businessKYBFilename">
                                      {filename}
                                    </div>
                                  </div>
                                </button>
                                <div className="w-100 text-center text-black text-uppercase mt-2 d-flex flex-column gap-1">
                                  <div className="button-21" id="businessKYBFiletype">
                                    {filetype}
                                  </div>
                                  {fileSizeView ? (
                                    <><div className="button-21">File size: {filesize}MB</div>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  <div className="button-21" style={{ color: "red" }}>
                                    **MAX FILE-SIZE: 5MB
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: "flex", gap: "15px", margin: "4rem 0" }}>
                                <button
                                  className="submit-btn"
                                  type="button"
                                  id="submitApplicantKYBDetails"
                                  onClick={submitApplicantKYBDetails}
                                  disabled={ApplicantLoader}
                                >
                                  {ApplicantLoader ? (
                                    <>
                                      <ScaleLoader height={20} width={5} color="white" />
                                    </>
                                  ) : (
                                    <>
                                      <img className="check-double-icon" alt="" src="/onboarding/submit-icon.svg" />
                                      <div className="label7 submitBtn">Submit</div>
                                    </>
                                  )}
                                </button>
                              </div>
                            </form>
                          </>
                        ) : (
                          <></>
                        )} */}
                      </>
                    ) : (
                      <>
                        <form className="form">
                          <div className="d-flex align-self-stretch">
                            <div className="input-group w-100 pb-0">
                              <select
                                id="businessDocumentType"
                                className="form-input my-0 pb-0"
                                value={documentTypeLOA}
                                onChange={(e) =>
                                  setDocumentTypeLOA(e.target.value)
                                }
                              >
                                <option value="LOA">
                                  Letter of Authorization
                                </option>
                              </select>
                              <label
                                htmlFor="country"
                                className="form-input-label ps-1"
                              >
                                Applicant Document Type
                                <span className="mx-1" style={{ color: "red" }}>
                                  *
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className="d-flex align-self-stretch browse1">
                            <div className="upload-document">
                              Upload Document
                            </div>
                            <button
                              type="button"
                              className="browse-file1"
                              onClick={fileUploadLOA}
                              style={{ padding: "15px", borderRadius: "15px" }}
                            >
                              <img
                                className="files-icon"
                                alt=""
                                src="/onboarding/download51.svg"
                              />
                              <div
                                className="drag-drop-or-group"
                                style={{ display: "block" }}
                              >
                                <input
                                  maxLength={255}
                                  type="file"
                                  id="businessDocumentFile"
                                  ref={fileInputRefLOA}
                                  style={{ display: "none" }}
                                  onChange={handleFileChangeLOA}
                                />
                                <div
                                  className="browse2"
                                  id="businessKYBFilename"
                                >
                                  {filenameLOA}
                                </div>
                              </div>
                            </button>
                            <div className="w-100 text-center text-black text-uppercase mt-2 d-flex flex-column gap-1">
                              <div
                                className="button-21"
                                id="businessKYBFiletype"
                              >
                                {filetypeLOA}
                              </div>
                              {fileSizeViewLOA ? (
                                <>
                                  <div className="button-21">
                                    File size: {filesizeLOA}MB
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                              <div
                                className="button-21"
                                style={{ color: "red" }}
                              >
                                **MAX FILE-SIZE: 5MB
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "15px",
                              margin: "4rem 0",
                            }}
                          >
                            <button
                              className="submit-btn"
                              type="button"
                              id="submitApplicantKYBDetails"
                              onClick={submitLOA}
                              disabled={LOALoader}
                            >
                              {LOALoader ? (
                                <>
                                  <ScaleLoader
                                    height={20}
                                    width={5}
                                    color="white"
                                  />
                                </>
                              ) : (
                                <>
                                  <img
                                    className="check-double-icon"
                                    alt=""
                                    src="/onboarding/submit-icon.svg"
                                  />
                                  <div className="label7 submitBtn">Submit</div>
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
    </>
  );
}

const RenderDocumentDiv = (
  {
    setShowBusinessDiv,
    setShowStakeholderDiv,
    setShowApplicantDiv,
    setShowLOAdiv,
  },
  complianceRemarks
) => {
  const arr = [
    { keyword: "Business Registration Document", setDiv: setShowBusinessDiv },
    { keyword: "Stakeholder", setDiv: setShowStakeholderDiv },
    { keyword: "Applicant", setDiv: setShowApplicantDiv },
    { keyword: "LOA", setDiv: setShowLOAdiv },
    { keyword: "Letter of Authorization", setDiv: setShowLOAdiv },
  ];

  // Loop through the array and check if any keyword is present in the complianceRemarks
  arr.forEach(({ keyword, setDiv }) => {
    if (complianceRemarks?.includes(keyword)) {
      setDiv(true);
    }
  });
};
export default kybDetails;
