import React, { useEffect, useRef, useState } from "react";
import * as functions from "./functions/kyb-details-function.js";
import Axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";
import * as actions from "../../../../@redux/action/onboardingAction.js";
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
        `${name} must contain only alphanumeric characters. Example: "AX986567GT"`
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
  docNo: (value, name) => {
    const docNoRegex = /^[A-Za-z0-9._-]+$/;
    if (value && !docNoRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, spaces, hyphens, and apostrophes.`
      );
    }
  },
};

function stakeholderDetails({ stakeholderData, documentTypeList }) {
  const dispatch = useDispatch();

  const [StakeholderLoader, setStakeholderLoader] = useState(false);
  const [fileSizeViewStakeholder, setFileSizeViewStakeholder] = useState(false);
  const [fileSizeViewStakeholderPOA, setFileSizeViewStakeholderPOA] =
    useState(false);

  //Stakeholder document requirement starts
  const [stakeholderDocumentType, setStakeholderDocumentType] = useState(null);
  const [stakeholderDocumentNumber, setStakeholderDocumentNumber] =
    useState("");
  const [
    stakeholderDocumentReferenceNumber,
    setStakeholderDocumentReferenceNumber,
  ] = useState("");
  const [stakeholderDocumentHolderName, setStakeholderDocumentHolderName] =
    useState("");
  const [
    stakeholderDocumentIssuanceCountry,
    setStakeholderDocumentIssuanceCountry,
  ] = useState(null);
  const [
    stakeholderDocumentIssuingAuthority,
    setStakeholderDocumentIssuingAuthority,
  ] = useState(null);
  const [stakeholderDocumentIssueDate, setStakeholderDocumentIssueDate] =
    useState("");
  const [stakeholderDocumentExpiryDate, setStakeholderDocumentExpiryDate] =
    useState("");

  const [stakeholderDocumentTypePOA, setStakeholderDocumentTypePOA] =
    useState("PROOF_OF_ADDRESS");

  const [toggleStakeholderDocument, setToggleStakeholderDocument] =
    useState(false);
  const [toggleStakeholderPOA, setToggleStakeholderPOA] = useState(false);

  const [filenameStakeholder, setFilenameStakeholder] =
    useState("Browse Files");
  const [filetypeStakeholder, setFiletypeStakeholder] = useState(
    "Accepted Formats: jpg/jpeg/png/pdf"
  );
  const [filesizeStakeholder, setFilesizeStakeholder] = useState("0.00");

  const [filenameStakeholderPOA, setFilenameStakeholderPOA] =
    useState("Browse Files");
  const [filetypeStakeholderPOA, setFiletypeStakeholderPOA] = useState(
    "Accepted Formats: jpg/jpeg/png/pdf"
  );
  const [filesizeStakeholderPOA, setFilesizeStakeholderPOA] = useState("0.00");

  const [fileStakeholder, setFileStakeholder] = useState(null);
  const [fileStakeholderPOA, setFileStakeholderPOA] = useState(null);
  const fileInputStakeholder = useRef(null);
  const fileInputStakeholderPOA = useRef(null);

  const fileUploadStakeholder = () => {
    fileInputStakeholder.current.click();
  };

  const handleFileChangeStakeholder = (event) => {
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
        setFileStakeholder(null);
        setFilenameStakeholder("Browse File");
        setFiletypeStakeholder("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesizeStakeholder("0.00");
        setFileSizeViewStakeholder(false);
        toast.error(
          "Invalid file type. Only jpg, jpeg, png, and pdf files are allowed."
        );
        return;
      }

      // Validate file size
      if (fileSizeInMB > maxSizeInMB) {
        // Reset state if no file is selected
        setFileStakeholder(null);
        setFilenameStakeholder("Browse File");
        setFiletypeStakeholder("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesizeStakeholder("0.00");
        setFileSizeViewStakeholder(false);
        toast.error("File size exceeds the maximum limit of 5MB.");
        return;
      }

      setFileStakeholder(selectedFile);
      setFilenameStakeholder(selectedFile.name);
      setFiletypeStakeholder("Uploaded Filetype: " + selectedFile.type);
      setFilesizeStakeholder((selectedFile.size / (1024 * 1024)).toFixed(2));
      setFileSizeViewStakeholder(true);
    } else {
      setFileStakeholder(null);
      setFilenameStakeholder("Browse File");
      setFiletypeStakeholder("Accepted Formats: jpg/jpeg/png/pdf");
      setFilesizeStakeholder("0.00");
      setFileSizeViewStakeholder(false);
    }
  };

  const fileUploadStakeholderPOA = () => {
    fileInputStakeholderPOA.current.click();
  };

  const handleFileChangeStakeholderPOA = (event) => {
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
        setFileStakeholderPOA(null);
        setFilenameStakeholderPOA("Browse File");
        setFiletypeStakeholderPOA("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesizeStakeholderPOA("0.00");
        setFileSizeViewStakeholderPOA(false);
        toast.error(
          "Invalid file type. Only jpg, jpeg, png, and pdf files are allowed."
        );
        return;
      }

      // Validate file size
      if (fileSizeInMB > maxSizeInMB) {
        // Reset state if no file is selected
        setFileStakeholderPOA(null);
        setFilenameStakeholderPOA("Browse File");
        setFiletypeStakeholderPOA("Accepted Formats: jpg/jpeg/png/pdf");
        setFilesizeStakeholderPOA("0.00");
        setFileSizeViewStakeholderPOA(false);
        toast.error("File size exceeds the maximum limit of 5MB.");
        return;
      }

      setFileStakeholderPOA(selectedFile);
      setFilenameStakeholderPOA(selectedFile.name);
      setFiletypeStakeholderPOA("Uploaded Filetype: " + selectedFile.type);
      setFilesizeStakeholderPOA((selectedFile.size / (1024 * 1024)).toFixed(2));
      setFileSizeViewStakeholderPOA(true);
    } else {
      setFileStakeholderPOA(null);
      setFilenameStakeholderPOA("Browse File");
      setFiletypeStakeholderPOA("Accepted Formats: jpg/jpeg/png/pdf");
      setFilesizeStakeholderPOA("0.00");
      setFileSizeViewStakeholderPOA(false);
    }
  };

  const submitStakeholderKYBDetails = async () => {
    //Validations for the above
    if (!email) {
      toast.warn("Stakeholder's Email not found");
      return;
    } else if (!stakeholderDocumentType) {
      toast.warn("Stakeholder's Document Type must not be empty");
      return;
    } else if (!stakeholderDocumentNumber) {
      toast.warn("Stakeholder's Document Number must not be empty");
      return;
    } else if (!stakeholderDocumentIssuanceCountry) {
      toast.warn("Stakeholder's Document Issuance Country must not be empty");
      return;
    } else if (!stakeholderDocumentExpiryDate) {
      toast.warn("Stakeholder's Document Expiry Date must not be empty");
      return;
    } else if (!fileStakeholder) {
      toast.warn("Please Select a Document File");
      return;
    } else if (toggleStakeholderPOA && !stakeholderDocumentTypePOA) {
      toast.warn(
        "Stakeholder's Document Type for Proof of Address must not be empty"
      );
      return;
    } else if (toggleStakeholderPOA && !fileStakeholderPOA) {
      toast.warn(
        "Please select a file for Stakeholder's Document for Proof of Address"
      );
      return;
    } else {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("businessRegistrationNumber", internalBusinessId);
      formData.append("customerHashId", userOnboardingDetails?.customerHashId);
      formData.append("email", sessionStorage.getItem("lastemail"));
      formData.append("fileTypes", toggleStakeholderPOA ? "both" : "poi");
      formData.append("region", region);

      //Default inclusion of stakeholder document
      formData.append("stakeholderDocumentType", stakeholderDocumentType);
      formData.append(
        "stakeholderDocumentNumber",
        stakeholderDocumentNumber?.trim()
      );
      formData.append(
        "stakeholderDocumentReferenceNumber",
        stakeholderDocumentReferenceNumber?.trim()
      );
      formData.append(
        "stakeholderDocumentHolderName",
        stakeholderDocumentHolderName?.trim()
      );
      formData.append(
        "stakeholderDocumentIssuanceCountry",
        stakeholderDocumentIssuanceCountry
      );
      formData.append(
        "stakeholderDocumentIssuingAuthority",
        stakeholderDocumentIssuingAuthority
      );
      formData.append(
        "stakeholderDocumentIssueDate",
        stakeholderDocumentIssueDate
      );
      formData.append(
        "stakeholderDocumentExpiryDate",
        stakeholderDocumentExpiryDate
      );
      formData.append("stakeholderDocumentFile", fileStakeholder);
      formData.append("stakeholderEmail", email);

      if (toggleStakeholderPOA) {
        formData.append("stakeholderDocumentFilePOA", fileStakeholderPOA);
      }

      let obj = await dispatch(
        actions.PostStakeholderKYBDetails(formData, { setStakeholderLoader })
      );
      if (obj.clientId || obj.caseId) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  };

  const returnStakeholderData = () => {
    // Initialize an array to store formatted document information
    let formattedDocs = [];

    // Initialize a counter for numbering
    let counter = 1;

    // Iterate over each stakeholder
    for (let i = 0; i < stakeholderData.length; i++) {
      // Get the email of the stakeholder
      let email = stakeholderData[i].email;

      // Iterate over the documentDetails of each stakeholder
      for (let j = 0; j < stakeholderData[i].documentDetails.length; j++) {
        // Extract identificationType
        let identificationType =
          stakeholderData[i].documentDetails[j].identificationType;

        // Construct the formatted document information with numbering
        let formattedDoc = `${counter}. ${email} - ${identificationType}`;

        // Push the formatted document information to the array
        formattedDocs.push(formattedDoc);

        // Increment the counter
        counter++;
      }
    }

    // Joining the formatted document information with line breaks
    const uploadedDocs = formattedDocs.join("\n");

    return (
      <div>
        Thank you for submitting your documents! We're now processing your
        information. Please wait for further compliance updates.
        <hr />
        <div>
          Your Uploaded Document(s):{" "}
          <pre
            style={{
              color: "var(--accent-blue-100)",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily: "inherit",
            }}
          >
            {uploadedDocs}
          </pre>
        </div>
      </div>
    );
  };

  // Pagination functions
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataArray, setDataArray] = useState([]);
  const [onlyPartner, setOnlyPartner] = useState(false);

  const stakeholderDetails = useSelector(
    (state) => state.onboarding?.StakeholderDetails
  );
  const listCountry = useSelector((state) => state.onboarding?.ListCountry);

  const [region, setRegion] = useState(sessionStorage.getItem("region"));
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

  var businessKybMode = useSelector(
    (state) => state.onboarding?.BusinessCorporationDetails?.businessKybMode
  );

  useEffect(() => {
    const SetPage = async () => {
      try {
        const stakeholderArray = stakeholderDetails;
        // Extract entries with stakeholderEmail
        const allHaveEmail = stakeholderArray.filter(
          (entry) => entry.stakeholderEmail
        );
        const allPartners = stakeholderArray.filter(
          (entry) => entry.stakeholderPartner === "yes"
        );

        if (allHaveEmail.length > 0) {
          setTotalPages(allHaveEmail.length);
          setDataArray(allHaveEmail);
          setOnlyPartner(false);
        } else if (allPartners.length > 0) {
          setOnlyPartner(true);
        }
      } catch (error) {
        console.error("Error fetching Stakeholder details:", error);
      }
    };

    SetPage();
  }, []);

  useEffect(() => {
    FillStakeholderDetails(0);
  }, [dataArray]);

  //Pagination functions

  const handlePageClick = async (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      FillStakeholderDetails(pageNumber - 1); // Adjust for zero-based array
    }
  };

  const handlePrevClick = async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      FillStakeholderDetails(currentPage - 2); // Adjust for zero-based array
    }
  };

  const handleNextClick = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      FillStakeholderDetails(currentPage); // Adjust for zero-based array
    }
  };

  const generatePaginationLinks = () => {
    const maxPages = Math.min(totalPages, 10); // Restrict to a maximum of 10 pages
    return Array.from({ length: maxPages }, (_, i) => i + 1).map((i) => (
      <li
        key={i}
        className={`page-number ${currentPage === i ? "active" : ""}`}
      >
        <a href="#!" onClick={() => handlePageClick(i)}>
          {i}
        </a>
      </li>
    ));
  };

  const FillStakeholderDetails = (index) => {
    var obj = dataArray[index];
    if (obj && obj != "") {
      if (obj.hasOwnProperty("stakeholderEmail")) {
        setEmail(obj.stakeholderEmail);
        return "success";
      } else {
        return "failed";
      }
    }
  };

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
      toast.error("Please select a date on or before: " + currentDate);
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
      toast.error("Please select a date after: " + currentDate);
      event.target.value = "";
    } else {
    }
  }

  const [email, setEmail] = useState("");

  return (
    <>
      {stakeholderData.length > 0 ? (
        <>
          <form className="form">{returnStakeholderData()}</form>
        </>
      ) : (
        <>
          <form className="form" id="stakeholderKybForm">
            {onlyPartner ? (
              <>
                <div className="d-flex align-self-stretch">
                  You don't need to upload documents for only Business
                  Partners(s). Your application is in-progress. Please await
                  further updates.
                </div>
              </>
            ) : (
              <>
                <div className="d-flex align-self-stretch">
                  <div className="input-group w-100 me-2 pb-0">
                    <input
                      maxLength={40}
                      id="stakeholderDocumentEmail"
                      className="form-input my-0 pb-0"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={true}
                    />
                    <label htmlFor="country" className="form-input-label ps-1">
                      Stakeholder Email
                    </label>
                  </div>
                </div>

                <div className="d-flex align-self-stretch">
                  <div className="input-group w-50 me-2 pb-0">
                    <select
                      id="stakeholderDocumentType"
                      className="form-input my-0 pb-0"
                      value={stakeholderDocumentType}
                      onChange={(e) =>
                        setStakeholderDocumentType(e.target.value)
                      }
                    >
                      <option value=""></option>
                      {documentTypeList.map((item) => {
                        return (
                          <option value={item.code}>{item.description}</option>
                        );
                      })}
                    </select>
                    <label htmlFor="country" className="form-input-label ps-1">
                      Stakeholder Document Type
                      <span className="mx-1" style={{ color: "red" }}>
                        *
                      </span>
                    </label>
                  </div>
                  <div className="input-group w-50 ms-2 pb-0">
                    <input
                      maxLength={255}
                      name="Stakeholder Document Number"
                      className="form-input my-0 pb-0"
                      value={stakeholderDocumentNumber}
                      onInput={(e) => {
                        restrictions.restrictInputDocumentNo(e);
                        setStakeholderDocumentNumber(e.target.value);
                      }}
                      onBlur={(e) =>
                        validations.docNo(e.target.value, e.target.name)
                      }
                    />
                    <label htmlFor="country" className="form-input-label ps-1">
                      Stakeholder Document Number
                      <span className="mx-1" style={{ color: "red" }}>
                        *
                      </span>
                    </label>
                  </div>
                </div>

                <div className="d-flex align-self-stretch">
                  <div className="input-group w-50 me-2 pb-0">
                    <input
                      maxLength={255}
                      name="Stakeholder Document Reference Number"
                      className="form-input my-0 pb-0"
                      value={stakeholderDocumentReferenceNumber}
                      onInput={(e) => {
                        restrictions.restrictInputDocumentNo(e);
                        setStakeholderDocumentReferenceNumber(e.target.value);
                      }}
                      onBlur={(e) =>
                        validations.docNo(e.target.value, e.target.name)
                      }
                    />
                    <label htmlFor="country" className="form-input-label ps-1">
                      Stakeholder Document Reference Number
                    </label>
                  </div>
                  <div className="input-group w-50 ms-2 pb-0">
                    <input
                      maxLength={255}
                      name="Stakeholder Document Holder Name"
                      className="form-input my-0 pb-0"
                      value={stakeholderDocumentHolderName}
                      onInput={(e) => {
                        restrictions.restrictInputPersonName(e);
                        setStakeholderDocumentHolderName(e.target.value);
                      }}
                      onBlur={(e) =>
                        validations.name(e.target.value, e.target.name)
                      }
                    />
                    <label htmlFor="country" className="form-input-label ps-1">
                      Stakeholder Document Holder Name
                    </label>
                  </div>
                </div>

                <div className="d-flex align-self-stretch">
                  <div className="input-group w-50 me-2 pb-0">
                    <select
                      id="stakeholderDocumentIssuanceCountry"
                      className="form-input my-0 pb-0"
                      value={stakeholderDocumentIssuanceCountry}
                      onChange={(e) =>
                        setStakeholderDocumentIssuanceCountry(e.target.value)
                      }
                    >
                      <option value=""></option>
                      {listCountry.map((item) => {
                        return (
                          <option value={item.code}>{item.description}</option>
                        );
                      })}
                    </select>
                    <label htmlFor="country" className="form-input-label ps-1">
                      Stakeholder Document Issuance Country
                      <span className="mx-1" style={{ color: "red" }}>
                        *
                      </span>
                    </label>
                  </div>
                  <div className="input-group w-50 ms-2 pb-0">
                    <select
                      id="stakeholderDocumentIssuingAuthority"
                      className="form-input my-0 pb-0"
                      value={stakeholderDocumentIssuingAuthority}
                      onChange={(e) =>
                        setStakeholderDocumentIssuingAuthority(e.target.value)
                      }
                    >
                      <option value=""></option>
                      {listCountry.map((item) => {
                        return (
                          <option value={item.code}>{item.description}</option>
                        );
                      })}
                    </select>
                    <label htmlFor="country" className="form-input-label ps-1">
                      Stakeholder Document Issuing Authority
                    </label>
                  </div>
                </div>

                <div className="d-flex align-self-stretch">
                  <div className="input-group w-50 me-2 pb-0">
                    <input
                      maxLength={255}
                      type="date"
                      id="stakeholderDocumentIssueDate"
                      className="form-input my-0 pb-0"
                      max={getCurrentDate()}
                      onBlur={(event) => {
                        preventFutureDates(event);
                      }}
                      value={stakeholderDocumentIssueDate}
                      onChange={(e) =>
                        setStakeholderDocumentIssueDate(e.target.value)
                      }
                    />
                    <label htmlFor="country" className="form-input-label ps-1">
                      Stakeholder Document Issue Date
                    </label>
                  </div>
                  <div className="input-group w-50 ms-2 pb-0">
                    <input
                      maxLength={255}
                      type="date"
                      id="stakeholderDocumentExpiryDate"
                      className="form-input my-0 pb-0"
                      min={getCurrentDate()}
                      onBlur={(event) => {
                        preventPastDates(event);
                      }}
                      value={stakeholderDocumentExpiryDate}
                      onChange={(e) =>
                        setStakeholderDocumentExpiryDate(e.target.value)
                      }
                    />
                    <label htmlFor="country" className="form-input-label ps-1">
                      Stakeholder Document Expiry Date
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
                    onClick={fileUploadStakeholder}
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
                        id="stakeholderDocumentFile"
                        style={{ display: "none" }}
                        ref={fileInputStakeholder}
                        onChange={handleFileChangeStakeholder}
                      />
                      <div className="browse2" id="stakeholderDocumentFilename">
                        {filenameStakeholder}
                      </div>
                    </div>
                  </button>
                  <div className="w-100 text-center text-black text-uppercase mt-2">
                    <div className="button-21" id="stakeholderDocumentFiletype">
                      {filetypeStakeholder}
                    </div>

                    {fileSizeViewStakeholder ? (
                      <>
                        <div className="button-21">
                          File size:{" "}
                          <span id="stakeholderDocumentFilesize">
                            {filesizeStakeholder}
                          </span>
                          MB
                        </div>
                      </>
                    ) : (
                      <></>
                    )}

                    <div className="button-21" style={{ color: "red" }}>
                      **MAX FILE-SIZE: 5MB
                    </div>
                  </div>
                </div>

                <p className="w-100" style={{ marginTop: "4rem" }}>
                  If the above document doesn't have any address proof, you need
                  to upload an address proof. Do you want to upload a Proof of
                  Address?{" "}
                  <input
                    maxLength={255}
                    type="checkbox"
                    id="POA-checkboxStakeholder"
                    onChange={(e) => setToggleStakeholderPOA(e.target.checked)}
                    value={toggleStakeholderPOA}
                  />
                </p>

                {toggleStakeholderPOA ? (
                  <>
                    <div id="POA-Div2" className="">
                      <div className="d-flex align-self-stretch">
                        <div className="input-group w-100 me-2 pb-0">
                          <select
                            id="stakeholderDocumentType"
                            className="form-input my-0 pb-0"
                            value={stakeholderDocumentTypePOA}
                            onChange={(e) =>
                              setStakeholderDocumentTypePOA(e.target.value)
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
                            Stakeholder Document Type
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
                          onClick={fileUploadStakeholderPOA}
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
                              id="stakeholderPOADocumentFile"
                              style={{ display: "none" }}
                              ref={fileInputStakeholderPOA}
                              onChange={handleFileChangeStakeholderPOA}
                            />
                            <div className="browse2">
                              {filenameStakeholderPOA}
                            </div>
                          </div>
                        </button>
                        <div className="w-100 text-center text-black text-uppercase mt-2">
                          <div className="button-21">
                            {filetypeStakeholderPOA}
                          </div>

                          {fileSizeViewStakeholderPOA ? (
                            <>
                              <div className="button-21">
                                File size: {filesizeStakeholderPOA}MB
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                          <div className="button-21" style={{ color: "red" }}>
                            **MAX FILE-SIZE: 5MB
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div style={{ display: "flex", gap: "15px", margin: "2rem 0" }}>
                  <button
                    className="submit-btn"
                    type="button"
                    id="submitStakeholderKYBDetails"
                    onClick={submitStakeholderKYBDetails}
                  >
                    {StakeholderLoader ? (
                      <>
                        <ScaleLoader height={20} width={5} color="white" />
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
              </>
            )}
          </form>

          {/* Pagination Generation */}

          {onlyPartner ? (
            <></>
          ) : (
            <>
              <div id="stakeholderIndexDiv" className="center-div">
                <ul className="pagination-block">
                  <li>
                    <a
                      href="#!"
                      className="prev"
                      id="prevBtn"
                      onClick={handlePrevClick}
                      style={{
                        color:
                          currentPage > 1
                            ? "var(--accent-blue-100)"
                            : "darkgrey",
                      }}
                    >
                      &#8249; Prev
                    </a>
                  </li>
                  {generatePaginationLinks()}

                  <li>
                    <a
                      href="#!"
                      className="next"
                      id="nextBtn"
                      onClick={handleNextClick}
                      style={{
                        color:
                          currentPage < totalPages
                            ? "var(--accent-blue-100)"
                            : "darkgrey",
                      }}
                    >
                      Next &#8250;
                    </a>
                  </li>
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default stakeholderDetails;
