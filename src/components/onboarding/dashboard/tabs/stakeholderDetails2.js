import React, { useEffect, useRef, useState } from "react";
import * as functions from "./functions/kyb-details-function.js";
import Axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Modal,
  MenuItem,
  Select,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import * as actions from "../../../../@redux/action/onboardingAction.js";
import * as restrictions from "./functions/restrictInput.js";

import CustomInput from "./../../../structure/NewStructures/CustomInput";
import CustomSelect from "./../../../structure/NewStructures/CustomSelect";
import CustomDatepicker from "./../../../structure/NewStructures/CustomDatePickerFuture";
import CustomPastDatepicker from "./../../../structure/NewStructures/CustomDatePicker";
import { blueGrey } from "@mui/material/colors";
import { ScaleLoader } from "react-spinners";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 800,
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
  maxHeight: 600,
  overflowY: "scroll",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: blueGrey[700],
    color: theme.palette.common.white,
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    width: 40,
    textAlign: "center",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
      formData.append(
        "stakeholderDocumentType",
        stakeholderDocumentType?.value
      );
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
        stakeholderDocumentIssuanceCountry?.value
      );
      formData.append(
        "stakeholderDocumentIssuingAuthority",
        stakeholderDocumentIssuingAuthority?.value
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [viewType, setViewType] = useState("new");

  const resetStates = () => {
    setStakeholderLoader(false);
    setFileSizeViewStakeholder(false);
    setFileSizeViewStakeholderPOA(false);

    // Stakeholder document requirement resets
    setStakeholderDocumentType(null);
    setStakeholderDocumentNumber("");
    setStakeholderDocumentReferenceNumber("");
    setStakeholderDocumentHolderName("");
    setStakeholderDocumentIssuanceCountry(null);
    setStakeholderDocumentIssuingAuthority(null);
    setStakeholderDocumentIssueDate("");
    setStakeholderDocumentExpiryDate("");

    // Reset stakeholder POA specific states
    setStakeholderDocumentTypePOA("PROOF_OF_ADDRESS");
    setToggleStakeholderDocument(false);
    setToggleStakeholderPOA(false);

    // Reset file-related states
    setFilenameStakeholder("Browse Files");
    setFiletypeStakeholder("Accepted Formats: jpg/jpeg/png/pdf");
    setFilesizeStakeholder("0.00");

    setFilenameStakeholderPOA("Browse Files");
    setFiletypeStakeholderPOA("Accepted Formats: jpg/jpeg/png/pdf");
    setFilesizeStakeholderPOA("0.00");

    setFileStakeholder(null);
    setFileStakeholderPOA(null);
  };

  const FillStakeholderDetails = ({ row }) => {
    setEmail(row.email);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell
                style={{
                  textAlign: "start",
                  width: "10rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                }}
              >
                Shareholder/Business Partner Name
              </StyledTableCell>
              <StyledTableCell
                align="right"
                style={{ fontWeight: 500, textTransform: "uppercase" }}
              >
                Shareholder Type
              </StyledTableCell>
              <StyledTableCell
                align="right"
                style={{ fontWeight: 500, textTransform: "uppercase" }}
              >
                View/Edit
              </StyledTableCell>
              <StyledTableCell
                align="right"
                style={{ fontWeight: 500, textTransform: "uppercase" }}
              >
                Uploaded Document(s)
              </StyledTableCell>
            </TableRow>
          </TableHead>
          {Number(lastScreenCompleted) >= 3 ? (
            <TableBody>
              {stakeholderData &&
                stakeholderData.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      style={{
                        textAlign: "start",
                        width: "10rem",
                        fontWeight: 500,
                      }}
                    >
                      {`${row.firstName} ${
                        row.middleName && row.middleName !== "null"
                          ? row.middleName
                          : ""
                      } ${row.lastName}`}
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ fontWeight: 500 }}>
                      {`INDIVIDUAL`}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        className="d-flex align-items-center justify-content-center gap-1 mx-auto py-2 px-4"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          resetStates();
                          FillStakeholderDetails({ row });
                          handleOpen();
                        }}
                        disabled={
                          row.documentDetails?.length > 0 ? true : false
                        }
                      >
                        <img src="/upload.svg" alt="" width={25} />
                        UPLOAD
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <div style={{ maxWidth: "15rem", textAlign: "justify" }}>
                        {row.documentDetails?.length > 0 ? (
                          row.documentDetails?.map((item) => {
                            return (
                              <div
                                className="w-100"
                                style={{ fontWeight: 500 }}
                              >
                                ∘ {item.identificationType}
                              </div>
                            );
                          })
                        ) : (
                          <div
                            className="w-100"
                            style={{ fontWeight: 500, textAlign: "left" }}
                          >
                            No documents have been uploaded yet.
                          </div>
                        )}
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          ) : (
            // <TableBody>
            //   {rows.map((row, index) => (
            //     <StyledTableRow key={index}>
            //       <StyledTableCell
            //         component="th"
            //         scope="row"
            //         style={{
            //           textAlign: "start",
            //           width: "20rem",
            //           fontWeight: 500,
            //         }}
            //       >
            //         {row.entityType === "INDIVIDUAL"
            //           ? `${row?.stakeholderDetails?.firstName}  ${
            //               row?.stakeholderDetails?.middleName || ""
            //             } ${row?.stakeholderDetails?.lastName}`
            //           : `${row?.businessName || "Business Name Not Found"}`}
            //       </StyledTableCell>
            //       <StyledTableCell align="right" style={{ fontWeight: 500 }}>
            //         {row.entityType === "INDIVIDUAL"
            //           ? `INDIVIDUAL`
            //           : `CORPORATE`}
            //       </StyledTableCell>
            //       <StyledTableCell align="center">
            //         <Button
            //           className="d-flex align-items-center justify-content-center gap-2 mx-auto py-2 px-4"
            //           variant="contained"
            //           color="primary"
            //           onClick={() => {
            //             resetStates();
            //             setBusinessPartnerRequire(
            //               row?.entityType === "INDIVIDUAL" ? "no" : "yes"
            //             );
            //             setBusinessPartner(
            //               row?.entityType === "INDIVIDUAL" ? "no" : "yes"
            //             );
            //             setSubmitBtnShow(true);
            //             setActiveRow(
            //               row?.entityType === "INDIVIDUAL"
            //                 ? row.stakeholderDetails
            //                 : row.businessPartner
            //             );
            //             setViewType("view");
            //             FillStakeholderDetails({ row });
            //             handleOpen();
            //           }}
            //         >
            //           <img src="/onboarding/edit-icon2.svg" alt="" width={25} />
            //           Update
            //         </Button>
            //       </StyledTableCell>
            //       <StyledTableCell align="center">
            //         <Button
            //           className="d-flex align-items-center justify-content-center gap-2 mx-auto py-2 px-3"
            //           variant="contained"
            //           color="error"
            //           onClick={() => handleDeleteStakeholder(row?.slNo)}
            //           style={{ width: "8rem" }}
            //           disabled
            //         >
            //           {btnLoader ? (
            //             <>
            //               <ClipLoader color={`#fff`} size={25} />
            //             </>
            //           ) : (
            //             <>
            //               <img src="/payments/delete.svg" alt="" width={25} />
            //               Delete
            //             </>
            //           )}
            //         </Button>
            //       </StyledTableCell>
            //     </StyledTableRow>
            //   ))}

            //   <StyledTableRow key={`addNewStakeholder`}>
            //     <StyledTableCell colSpan={4} className="text-uppercase fw-500">
            //       <HoverButton />
            //     </StyledTableCell>
            //   </StyledTableRow>
            // </TableBody>
            <></>
          )}
        </Table>
      </TableContainer>

      <div>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <>
              <form className="form" id="stakeholderKybForm">
                <CustomInput
                  maxLength={40}
                  label="Stakeholder Email"
                  className="custom-input-class full-width"
                  value={email}
                  onInput={(e) => setEmail(e.target.value)}
                  readOnly={true}
                  required
                />

                <Divider className="my-4" />

                <div className="d-flex justify-content-between align-items-center w-100 my-3 gap-4">
                  <CustomSelect
                    label="Document Type"
                    className="custom-select-class full-width"
                    value={stakeholderDocumentType}
                    onChange={setStakeholderDocumentType}
                    options={documentTypeList.map((item) => ({
                      value: item.code,
                      label: item.description,
                    }))}
                    required
                  />

                  <CustomInput
                    maxLength={255}
                    label="Document Number"
                    className="custom-input-class full-width"
                    value={stakeholderDocumentNumber}
                    onInput={(e) => {
                      restrictions.restrictInputDocumentNo(e);
                      setStakeholderDocumentNumber(e.target.value);
                    }}
                    onBlur={(e) =>
                      validations.docNo(e.target.value, e.target.name)
                    }
                    required
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center w-100 my-3 gap-4">
                  <CustomInput
                    maxLength={255}
                    label="Document Reference Number"
                    className="custom-input-class full-width"
                    value={stakeholderDocumentReferenceNumber}
                    onInput={(e) => {
                      restrictions.restrictInputDocumentNo(e);
                      setStakeholderDocumentReferenceNumber(e.target.value);
                    }}
                    onBlur={(e) =>
                      validations.docNo(e.target.value, e.target.name)
                    }
                  />

                  <CustomInput
                    maxLength={255}
                    label="Document Holder Name"
                    className="custom-input-class full-width"
                    value={stakeholderDocumentHolderName}
                    onInput={(e) => {
                      restrictions.restrictInputPersonName(e);
                      setStakeholderDocumentHolderName(e.target.value);
                    }}
                    onBlur={(e) =>
                      validations.name(e.target.value, e.target.name)
                    }
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center w-100 my-3 gap-4">
                  <CustomSelect
                    label="Document Issuance Country"
                    value={stakeholderDocumentIssuanceCountry}
                    onChange={setStakeholderDocumentIssuanceCountry}
                    className="custom-select-class full-width"
                    options={listCountry.map((item) => ({
                      value: item.code,
                      label: item.description,
                    }))}
                    required
                  />

                  <CustomSelect
                    label="Document Issuing Authority"
                    className="custom-select-class full-width"
                    value={stakeholderDocumentIssuingAuthority}
                    onChange={setStakeholderDocumentIssuingAuthority}
                    options={listCountry.map((item) => ({
                      value: item.code,
                      label: item.description,
                    }))}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center w-100 my-3 gap-4">
                  <CustomPastDatepicker
                    label="Document Issue Date"
                    selectedDate={stakeholderDocumentIssueDate}
                    onDateChange={setStakeholderDocumentIssueDate}
                    helperText={``}
                  />

                  <CustomDatepicker
                    label="Document Expiry Date"
                    selectedDate={stakeholderDocumentExpiryDate}
                    onDateChange={setStakeholderDocumentExpiryDate}
                    helperText={``}
                    required
                  />
                </div>

                <p className="mt-5 text-secondary">Upload Document:</p>
                <button
                  type="button"
                  className="browse-file1 w-100 border-0 d-flex align-items-center justify-content-center border border-secondary gap-2 mt-2"
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
                      style={{ display: "none", fontWeight: 500 }}
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

                <p className="w-100 d-none" style={{ marginTop: "4rem" }}>
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
                      <CustomSelect
                        label="Document Type"
                        className="custom-select-class full-width"
                        value={stakeholderDocumentTypePOA}
                        onChange={setStakeholderDocumentTypePOA}
                        required
                        options={[
                          {
                            value: "PROOF_OF_ADDRESS",
                            label: "Proof of Address",
                          },
                        ]}
                      />

                      <div className="upload-document text-secondary mt-3">
                        Upload Document:
                      </div>
                      <button
                        type="button"
                        className="browse-file1 w-100 d-flex justify-content-center align-items-center mt-2 gap-2 border-0"
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
                            style={{ display: "none", fontWeight: 500 }}
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
                  </>
                ) : (
                  <></>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "2rem",
                    justifyContent: "end",
                  }}
                >
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
              </form>

              {/* <div
                id="accessDivs"
                className={`mt-5 d-flex flex-column gap-5 ${
                  lastScreenCompleted < 8 ? "" : "d-none"
                }`}
              >
                <div
                  id="buttons-div"
                  style={{ width: "100%", paddingLeft: "50px" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex justify-content-center align-items-center gap-3"></div>

                  {submitBtnShow !== "hide" && (
                    <Button
                      variant="contained"
                      onClick={
                        submitBtnShow
                          ? handleSubmitStakeholder
                          : handleUpdateStakeholder
                      }
                      type="button"
                      className={`rounded-pill ${
                        submitBtnShow ? "submit-btn" : "update-btn"
                      }`}
                      id={
                        submitBtnShow
                          ? "submitStakeholderDetails"
                          : "updateStakeholderDetails"
                      }
                    >
                      {btnLoader ? (
                        <ClipLoader size={25} color={`#fff`} />
                      ) : (
                        <>
                          <img
                            className="check-double-icon"
                            alt=""
                            src={
                              submitBtnShow
                                ? "/onboarding/submit-icon.svg"
                                : "/auth/update-icon.svg"
                            }
                            width={25}
                          />
                          <div className="label7">
                            {submitBtnShow ? "Submit" : "update"}
                          </div>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div> */}
            </>
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default stakeholderDetails;
