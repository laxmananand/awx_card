import React, { useState, useEffect } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { openLoader, closeLoader } from "../../../../../@redux/features/common";

export const GetKYBDetails = async (brn) => {
  return;
};

export const PostBusinessKYBDetails = async (dispatch) => {
  const brn = sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber");
  const businessDocumentType = document.getElementById("businessDocumentType").value;
  const businessDocumentFileInput = document.getElementById("businessDocumentFile");
  const email = sessionStorage.getItem("lastemail");
  const customerHashId = sessionStorage.getItem("customerHashId");

  if (businessDocumentType === "") {
    toast.warn("Document Type must not be empty");
    return; // Exit early if there's an issue
  }

  const businessDocumentFile = businessDocumentFileInput.files[0];

  if (!businessDocumentFile) {
    toast.warn("Please select a Document File");
    return; // Exit early if there's no file selected
  }

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("businessRegistrationNumber", brn);
  formData.append("email", email);
  formData.append("businessDocumentType", businessDocumentType);
  formData.append("businessDocumentFile", businessDocumentFile);
  formData.append("customerHashId", customerHashId);
  formData.append("region", sessionStorage.getItem("region"));

  try {
    dispatch(openLoader());

    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/UploadDocumentsBusiness",
      formData
    );

    const obj = response.data;
    dispatch(closeLoader());
    if (obj.clientId || obj.caseId) {
      toast.success("Submission successful");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error("Submission failed: " + obj.message);
    }
  } catch (error) {
    dispatch(closeLoader());
    console.error("Something went wrong: " + error);
  }
};

export const PostApplicantKYBDetails = async (fileTypes, dispatch) => {
  const brn = sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber");
  const customerHashId = sessionStorage.getItem("customerHashId");
  var email = sessionStorage.getItem("lastemail");

  //Applicant file POI details
  var applicantDocumentType = document.getElementById("applicantDocumentType").value;
  var applicantDocumentNumber = document.getElementById("applicantDocumentNumber").value;
  var applicantDocumentReferenceNumber = document.getElementById("applicantDocumentReferenceNumber").value;
  var applicantDocumentHolderName = document.getElementById("applicantDocumentHolderName").value;
  var applicantDocumentIssuanceCountry = document.getElementById("applicantDocumentIssuanceCountry").value;
  var applicantDocumentIssuingAuthority = document.getElementById("applicantDocumentIssuingAuthority").value;
  var applicantDocumentIssueDate = document.getElementById("applicantDocumentIssueDate").value;
  var applicantDocumentExpiryDate = document.getElementById("applicantDocumentExpiryDate").value;
  var applicantDocumentFile = document.getElementById("applicantDocumentFile").files[0];

  //Validations for the above
  if (applicantDocumentType == "") {
    toast.warn("Applicant Document Type must not be empty");
    return;
  }
  if (applicantDocumentNumber == "") {
    toast.warn("Applicant Document Number must not be empty");
    return;
  }
  // if (applicantDocumentReferenceNumber == "") {
  //   toast.warn("Applicant Document Reference Number must not be empty");
  //   return;
  // }
  // if (applicantDocumentHolderName == "") {
  //   toast.warn("Applicant Document Holder Name must not be empty");
  //   return;
  // }
  if (applicantDocumentIssuanceCountry == "") {
    toast.warn("Applicant Document Issuance Country must not be empty");
    return;
  }
  // if (applicantDocumentIssuingAuthority == "") {
  //   toast.warn("Applicant Document Issuing Authority must not be empty");
  //   return;
  // }
  // if (applicantDocumentIssueDate == "") {
  //   toast.warn("Applicant Document Issue Date must not be empty");
  //   return;
  // }
  if (applicantDocumentExpiryDate == "") {
    toast.warn("Applicant Document Expiry Date must not be empty");
    return;
  }
  if (!applicantDocumentFile) {
    toast.warn("Please Select a Document File");
    return;
  }

  //Applicant POA file details
  let applicantDocumentFilePOA = document.getElementById("applicantPOADocumentFile").files[0];

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("businessRegistrationNumber", brn);
  formData.append("customerHashId", customerHashId);
  formData.append("email", email);
  formData.append("fileTypes", fileTypes);
  formData.append("region", sessionStorage.getItem("region"));
  if (fileTypes === "both") {
    formData.append("applicantDocumentType", applicantDocumentType);
    formData.append("applicantDocumentNumber", applicantDocumentNumber);
    formData.append("applicantDocumentReferenceNumber", applicantDocumentReferenceNumber);
    formData.append("applicantDocumentHolderName", applicantDocumentHolderName);
    formData.append("applicantDocumentIssuanceCountry", applicantDocumentIssuanceCountry);
    formData.append("applicantDocumentIssuingAuthority", applicantDocumentIssuingAuthority);
    formData.append("applicantDocumentIssueDate", applicantDocumentIssueDate);
    formData.append("applicantDocumentExpiryDate", applicantDocumentExpiryDate);
    formData.append("applicantDocumentFile", applicantDocumentFile);
    formData.append("applicantDocumentFilePOA", applicantDocumentFilePOA);
  } else {
    formData.append("applicantDocumentType", applicantDocumentType);
    formData.append("applicantDocumentNumber", applicantDocumentNumber);
    formData.append("applicantDocumentReferenceNumber", applicantDocumentReferenceNumber);
    formData.append("applicantDocumentHolderName", applicantDocumentHolderName);
    formData.append("applicantDocumentIssuanceCountry", applicantDocumentIssuanceCountry);
    formData.append("applicantDocumentIssuingAuthority", applicantDocumentIssuingAuthority);
    formData.append("applicantDocumentIssueDate", applicantDocumentIssueDate);
    formData.append("applicantDocumentExpiryDate", applicantDocumentExpiryDate);
    formData.append("applicantDocumentFile", applicantDocumentFile);
  }

  try {
    dispatch(openLoader());
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/UploadDocumentsApplicant",
      formData
    );

    const obj = response.data;
    dispatch(closeLoader());
    if (obj.clientId || obj.caseId) {
      toast.success("Submission successful");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error("Submission failed: " + obj.message);
    }
  } catch (error) {
    dispatch(closeLoader());
    console.error("Something went wrong: " + error);
  }
};

export const PostStakeholderKYBDetails = async (fileTypes, dispatch) => {
  var stakeholderEmail = document.getElementById("stakeholderDocumentEmail").value;
  const brn = sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber");
  const customerHashId = sessionStorage.getItem("customerHashId");
  var email = sessionStorage.getItem("lastemail");

  //stakeholder file POI details
  var stakeholderDocumentType = document.getElementById("stakeholderDocumentType").value;
  var stakeholderDocumentNumber = document.getElementById("stakeholderDocumentNumber").value;
  var stakeholderDocumentReferenceNumber = document.getElementById("stakeholderDocumentReferenceNumber").value;
  var stakeholderDocumentHolderName = document.getElementById("stakeholderDocumentHolderName").value;
  var stakeholderDocumentIssuanceCountry = document.getElementById("stakeholderDocumentIssuanceCountry").value;
  var stakeholderDocumentIssuingAuthority = document.getElementById("stakeholderDocumentIssuingAuthority").value;
  var stakeholderDocumentIssueDate = document.getElementById("stakeholderDocumentIssueDate").value;
  var stakeholderDocumentExpiryDate = document.getElementById("stakeholderDocumentExpiryDate").value;
  var stakeholderDocumentFile = document.getElementById("stakeholderDocumentFile").files[0];

  //Validations for the above
  if (stakeholderDocumentType == "") {
    toast.warn("stakeholder Document Type must not be empty");
    return;
  }
  if (stakeholderDocumentNumber == "") {
    toast.warn("stakeholder Document Number must not be empty");
    return;
  }
  // if (stakeholderDocumentReferenceNumber == "") {
  //   toast.warn("stakeholder Document Reference Number must not be empty");
  //   return;
  // }
  // if (stakeholderDocumentHolderName == "") {
  //   toast.warn("stakeholder Document Holder Name must not be empty");
  //   return;
  // }
  if (stakeholderDocumentIssuanceCountry == "") {
    toast.warn("stakeholder Document Issuance Country must not be empty");
    return;
  }
  // if (stakeholderDocumentIssuingAuthority == "") {
  //   toast.warn("stakeholder Document Issuing Authority must not be empty");
  //   return;
  // }
  // if (stakeholderDocumentIssueDate == "") {
  //   toast.warn("stakeholder Document Issue Date must not be empty");
  //   return;
  // }
  if (stakeholderDocumentExpiryDate == "") {
    toast.warn("stakeholder Document Expiry Date must not be empty");
    return;
  }
  if (!stakeholderDocumentFile) {
    toast.warn("Please Select a Document File");
    return;
  }

  //stakeholder POA file details
  let stakeholderDocumentFilePOA = document.getElementById("stakeholderPOADocumentFile").files[0];

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("businessRegistrationNumber", brn);
  formData.append("customerHashId", customerHashId);
  formData.append("email", email);
  formData.append("fileTypes", fileTypes);
  formData.append("region", sessionStorage.getItem("region"));
  if (fileTypes === "both") {
    formData.append("stakeholderDocumentType", stakeholderDocumentType);
    formData.append("stakeholderDocumentNumber", stakeholderDocumentNumber);
    formData.append("stakeholderDocumentReferenceNumber", stakeholderDocumentReferenceNumber);
    formData.append("stakeholderDocumentHolderName", stakeholderDocumentHolderName);
    formData.append("stakeholderDocumentIssuanceCountry", stakeholderDocumentIssuanceCountry);
    formData.append("stakeholderDocumentIssuingAuthority", stakeholderDocumentIssuingAuthority);
    formData.append("stakeholderDocumentIssueDate", stakeholderDocumentIssueDate);
    formData.append("stakeholderDocumentExpiryDate", stakeholderDocumentExpiryDate);
    formData.append("stakeholderDocumentFile", stakeholderDocumentFile);
    formData.append("stakeholderDocumentFilePOA", stakeholderDocumentFilePOA);
    formData.append("stakeholderEmail", stakeholderEmail);
  } else {
    formData.append("stakeholderDocumentType", stakeholderDocumentType);
    formData.append("stakeholderDocumentNumber", stakeholderDocumentNumber);
    formData.append("stakeholderDocumentReferenceNumber", stakeholderDocumentReferenceNumber);
    formData.append("stakeholderDocumentHolderName", stakeholderDocumentHolderName);
    formData.append("stakeholderDocumentIssuanceCountry", stakeholderDocumentIssuanceCountry);
    formData.append("stakeholderDocumentIssuingAuthority", stakeholderDocumentIssuingAuthority);
    formData.append("stakeholderDocumentIssueDate", stakeholderDocumentIssueDate);
    formData.append("stakeholderDocumentExpiryDate", stakeholderDocumentExpiryDate);
    formData.append("stakeholderDocumentFile", stakeholderDocumentFile);
    formData.append("stakeholderEmail", stakeholderEmail);
  }

  try {
    dispatch(openLoader());
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/UploadDocumentsStakeholder",
      formData
    );

    const obj = response.data;
    dispatch(closeLoader());
    if (obj.clientId || obj.caseId) {
      toast.success("Submission successful");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error("Submission failed: " + obj.message);
    }
  } catch (error) {
    dispatch(closeLoader());
    console.error("Something went wrong: " + error);
  }
};

export const PatchBusinessKYBDetails = async () => {
  const brn = sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber");
  const businessDocumentType = document.getElementById("businessDocumentType").value;
  const businessDocumentFileInput = document.getElementById("businessDocumentFile");
  var businessDocumentFile = null;

  if (businessDocumentFileInput && businessDocumentFileInput.files.length != 0) {
    businessDocumentFile = businessDocumentFileInput.files[0];
  }

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("businessRegistrationNumber", brn);
  formData.append("businessDocumentType", businessDocumentType);
  formData.append("businessDocumentFile", businessDocumentFile);

  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/PatchBusinessKYBDetails",
      formData
    );

    const obj = response.data;
    if (obj.status === "SUCCESS") {
      toast.success("Business KYB Details Updated");
    } else {
      toast.error("Update failed: " + obj.message);
    }
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
};

export const PatchApplicantKYBDetails = async () => {
  const brn = sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber");
  var applicantDocumentType = document.getElementById("applicantDocumentType").value;
  var applicantDocumentNumber = document.getElementById("applicantDocumentNumber").value;
  var applicantDocumentReferenceNumber = document.getElementById("applicantDocumentReferenceNumber").value;
  var applicantDocumentHolderName = document.getElementById("applicantDocumentHolderName").value;
  var applicantDocumentIssuanceCountry = document.getElementById("applicantDocumentIssuanceCountry").value;
  var applicantDocumentIssuingAuthority = document.getElementById("applicantDocumentIssuingAuthority").value;
  var applicantDocumentIssueDate = document.getElementById("applicantDocumentIssueDate").value;
  var applicantDocumentExpiryDate = document.getElementById("applicantDocumentExpiryDate").value;

  var applicantDocumentFile = document.getElementById("applicantDocumentFile");
  var applicantDoc = null;

  if (applicantDocumentFile && applicantDocumentFile.files.length != 0) {
    applicantDoc = applicantDocumentFile.files[0];
  }

  if (applicantDocumentType == "") {
    toast.warn("Applicant Document Type must not be empty");
    return;
  }
  if (applicantDocumentNumber == "") {
    toast.warn("Applicant Document Number must not be empty");
    return;
  }
  if (applicantDocumentReferenceNumber == "") {
    toast.warn("Applicant Document Reference Number must not be empty");
    return;
  }
  if (applicantDocumentHolderName == "") {
    toast.warn("Applicant Document Holder Name must not be empty");
    return;
  }
  if (applicantDocumentIssuanceCountry == "") {
    toast.warn("Applicant Document Issuance Country must not be empty");
    return;
  }
  if (applicantDocumentIssuingAuthority == "") {
    toast.warn("Applicant Document Issuing Authority must not be empty");
    return;
  }
  if (applicantDocumentIssueDate == "") {
    toast.warn("Applicant Document Issue Date must not be empty");
    return;
  }
  if (applicantDocumentExpiryDate == "") {
    toast.warn("Applicant Document Expiry Date must not be empty");
    return;
  }

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("businessRegistrationNumber", brn);
  formData.append("applicantDocumentType", applicantDocumentType);
  formData.append("applicantDocumentNumber", applicantDocumentNumber);
  formData.append("applicantDocumentReferenceNumber", applicantDocumentReferenceNumber);
  formData.append("applicantDocumentHolderName", applicantDocumentHolderName);
  formData.append("applicantDocumentIssuanceCountry", applicantDocumentIssuanceCountry);
  formData.append("applicantDocumentIssuingAuthority", applicantDocumentIssuingAuthority);
  formData.append("applicantDocumentIssueDate", applicantDocumentIssueDate);
  formData.append("applicantDocumentExpiryDate", applicantDocumentExpiryDate);
  formData.append("applicantDocumentFile", applicantDoc);

  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/PatchApplicantKYBDetails",
      formData
    );

    const obj = response.data;
    if (obj.status === "SUCCESS") {
      toast.success("Applicant KYB Details Updated");
    } else {
      toast.error("Update failed: " + obj.message);
    }
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
};

export const PatchStakeholderKYBDetails = async () => {
  const brn = sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber");
  var email = sessionStorage.getItem("lastemail");
  var stakeholderDocumentType = document.getElementById("stakeholderDocumentType").value;
  var stakeholderDocumentNumber = document.getElementById("stakeholderDocumentNumber").value;
  var stakeholderDocumentReferenceNumber = document.getElementById("stakeholderDocumentReferenceNumber").value;
  var stakeholderDocumentHolderName = document.getElementById("stakeholderDocumentHolderName").value;
  var stakeholderDocumentIssuanceCountry = document.getElementById("stakeholderDocumentIssuanceCountry").value;
  var stakeholderDocumentIssuingAuthority = document.getElementById("stakeholderDocumentIssuingAuthority").value;
  var stakeholderDocumentIssueDate = document.getElementById("stakeholderDocumentIssueDate").value;
  var stakeholderDocumentExpiryDate = document.getElementById("stakeholderDocumentExpiryDate").value;
  var stakeholderDocumentFile = document.getElementById("stakeholderDocumentFile").files[0];
  var stakeholderEmail = sessionStorage.getItem("stakeholderemail");

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("businessRegistrationNumber", brn);
  formData.append("email", email);
  formData.append("stakeholderDocumentType", stakeholderDocumentType);
  formData.append("stakeholderDocumentNumber", stakeholderDocumentNumber);
  formData.append("stakeholderDocumentReferenceNumber", stakeholderDocumentReferenceNumber);
  formData.append("stakeholderDocumentHolderName", stakeholderDocumentHolderName);
  formData.append("stakeholderDocumentIssuanceCountry", stakeholderDocumentIssuanceCountry);
  formData.append("stakeholderDocumentIssuingAuthority", stakeholderDocumentIssuingAuthority);
  formData.append("stakeholderDocumentIssueDate", stakeholderDocumentIssueDate);
  formData.append("stakeholderDocumentExpiryDate", stakeholderDocumentExpiryDate);
  formData.append("stakeholderDocumentFile", stakeholderDocumentFile);
  formData.append("stakeholderEmail", stakeholderEmail);

  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/PatchStakeholderKYBDetails",
      formData
    );

    const obj = response.data;
    if (obj.status === "SUCCESS") {
      toast.success("Stakeholder KYB Details Updated");
    } else {
      toast.error("Update failed: " + obj.message);
    }
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
};

//Submit to NIUM
export const PostMKYC = async () => {
  var brn = sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber");
  var region = "SG";

  // if (sessionStorage.getItem("region")) {
  //   region = sessionStorage.getItem("region");
  // }

  const complianceStatus = sessionStorage.getItem("complianceStatus") || "";
  const customerHashId = sessionStorage.getItem("customerHashId") || "";
  const clientId = sessionStorage.getItem("clientId") || "";

  const params = {
    businessRegistrationNumber: brn,
    name: document.getElementById("tCname").value,
    versionId: document.getElementById("tCversion").value,
    accept: "true",
    customerHashId: "",
    clientId: "",
    region: region,
  };

  if (complianceStatus && complianceStatus === "ERROR") {
    params.customerHashId = customerHashId;
    params.clientId = clientId;
  }
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/OnboardMKYCUser", {
      params: params,
    });

    let obj = response.data;
    if (obj.status == "BAD_REQUEST") {
      return obj;
    } else if (obj.clientId != "" || obj.customerHashId != "") {
      sessionStorage.setItem("Onboarding response: ", JSON.stringify(obj));
      //When onboarding succeeds, setting up important details
      sessionStorage.setItem("clientId", obj.clientId);
      sessionStorage.setItem("caseId", obj.caseId);
      sessionStorage.setItem("complianceStatus", obj.status);
      sessionStorage.setItem("customerHashId", obj.customerHashId);
      sessionStorage.setItem("walletHashId", obj.walletHashId);
      sessionStorage.setItem("kycUrl", obj.redirectUrl);

      return obj;
    } else {
      return obj;
    }
  } catch (error) {
    return error;
  }
};

export const FetchOnboardingDetails = async () => {
  var brn = sessionStorage.getItem("internalBusinessId");
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/getuseronboardingstatus", {
      params: {
        brn: brn,
      },
    });

    let data = response.data;

    if (data.length > 0) {
      let obj = data[0];

      if (obj.customerHashId != "") {
        sessionStorage.setItem("customerHashId", obj.customerHashId);
      }

      if (obj.clientId != "") {
        sessionStorage.setItem("clientId", obj.clientId);
      }

      if (obj.caseId != "") {
        sessionStorage.setItem("caseId", obj.caseId);
      }

      if (obj.walletHashId != "") {
        sessionStorage.setItem("walletHashId", obj.walletHashId);
      }

      if (obj.kycUrl != "") {
        sessionStorage.setItem("kycUrl", obj.kycUrl);
        if (document.getElementById("kycUrl")) {
          document.getElementById("kycUrl").value = obj.kycUrl;
        }
      }

      return { status: "success" };
    } else {
      console.log("No results found for the business registration number : " + brn);

      return { status: "registration not found" };
    }
  } catch (error) {
    console.log("Something went wrong: ", error);
  }
};

export const ShowTCS = async () => {
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetTerms&Conditions");

    let obj = response.data;

    return obj;
  } catch (error) {
    return error;
  }
};

export const PostApplicantKYBDetails2 = async () => {
  document.getElementById("MKYCopenAlertModalBtn").click();
};

export const UploadDocumentsApplicant = async (fileTypes, dispatch) => {
  const brn = sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber");
  const customerHashId = sessionStorage.getItem("customerHashId");
  var email = sessionStorage.getItem("lastemail");

  //Applicant file POI details
  var applicantDocumentType = document.getElementById("EKYBapplicantDocumentType").value;
  var applicantDocumentNumber = document.getElementById("EKYBapplicantDocumentNumber").value;
  var applicantDocumentReferenceNumber = document.getElementById("EKYBapplicantDocumentReferenceNumber").value;
  var applicantDocumentHolderName = document.getElementById("EKYBapplicantDocumentHolderName").value;
  var applicantDocumentIssuanceCountry = document.getElementById("EKYBapplicantDocumentIssuanceCountry").value;
  var applicantDocumentIssuingAuthority = document.getElementById("EKYBapplicantDocumentIssuingAuthority").value;
  var applicantDocumentIssueDate = document.getElementById("EKYBapplicantDocumentIssueDate").value;
  var applicantDocumentExpiryDate = document.getElementById("EKYBapplicantDocumentExpiryDate").value;
  var applicantDocumentFile = document.getElementById("EKYBapplicantDocumentFile").files[0];

  //Validations for the above
  if (applicantDocumentType == "") {
    toast.warn("Applicant Document Type must not be empty");
    return;
  }
  if (applicantDocumentNumber == "") {
    toast.warn("Applicant Document Number must not be empty");
    return;
  }
  // if (applicantDocumentReferenceNumber == "") {
  //   toast.warn("Applicant Document Reference Number must not be empty");
  //   return;
  // }
  // if (applicantDocumentHolderName == "") {
  //   toast.warn("Applicant Document Holder Name must not be empty");
  //   return;
  // }
  if (applicantDocumentIssuanceCountry == "") {
    toast.warn("Applicant Document Issuance Country must not be empty");
    return;
  }
  // if (applicantDocumentIssuingAuthority == "") {
  //   toast.warn("Applicant Document Issuing Authority must not be empty");
  //   return;
  // }
  // if (applicantDocumentIssueDate == "") {
  //   toast.warn("Applicant Document Issue Date must not be empty");
  //   return;
  // }
  if (applicantDocumentExpiryDate == "") {
    toast.warn("Applicant Document Expiry Date must not be empty");
    return;
  }
  if (!applicantDocumentFile) {
    toast.warn("Please Select a Document File");
    return;
  }

  //Applicant POA file details
  let applicantDocumentFilePOA = document.getElementById("EKYBapplicantPOADocumentFile").files[0];

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("businessRegistrationNumber", brn);
  formData.append("customerHashId", customerHashId);
  formData.append("email", email);
  formData.append("fileTypes", fileTypes);
  if (fileTypes === "both") {
    formData.append("applicantDocumentType", applicantDocumentType);
    formData.append("applicantDocumentNumber", applicantDocumentNumber);
    formData.append("applicantDocumentReferenceNumber", applicantDocumentReferenceNumber);
    formData.append("applicantDocumentHolderName", applicantDocumentHolderName);
    formData.append("applicantDocumentIssuanceCountry", applicantDocumentIssuanceCountry);
    formData.append("applicantDocumentIssuingAuthority", applicantDocumentIssuingAuthority);
    formData.append("applicantDocumentIssueDate", applicantDocumentIssueDate);
    formData.append("applicantDocumentExpiryDate", applicantDocumentExpiryDate);
    formData.append("applicantDocumentFile", applicantDocumentFile);
    formData.append("applicantDocumentFilePOA", applicantDocumentFilePOA);
  } else {
    formData.append("applicantDocumentType", applicantDocumentType);
    formData.append("applicantDocumentNumber", applicantDocumentNumber);
    formData.append("applicantDocumentReferenceNumber", applicantDocumentReferenceNumber);
    formData.append("applicantDocumentHolderName", applicantDocumentHolderName);
    formData.append("applicantDocumentIssuanceCountry", applicantDocumentIssuanceCountry);
    formData.append("applicantDocumentIssuingAuthority", applicantDocumentIssuingAuthority);
    formData.append("applicantDocumentIssueDate", applicantDocumentIssueDate);
    formData.append("applicantDocumentExpiryDate", applicantDocumentExpiryDate);
    formData.append("applicantDocumentFile", applicantDocumentFile);
  }

  try {
    dispatch(openLoader());
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/UploadDocumentsApplicant",
      formData
    );

    const obj = response.data;
    dispatch(closeLoader());
    if (obj.clientId || obj.caseId) {
      toast.success("Submission successful");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error("Submission failed: " + obj.message);
    }
  } catch (error) {
    dispatch(closeLoader());
    console.error("Something went wrong: " + error);
  }
};

export const UploadDocumentsBusiness = async () => {
  const brn = sessionStorage.getItem("internalBusinessId") || sessionStorage.getItem("businessRegistrationNumber");
  const businessDocumentType = document.getElementById("EKYBbusinessDocumentType").value;
  const businessDocumentFileInput = document.getElementById("EKYBbusinessDocumentFile");
  const email = sessionStorage.getItem("lastemail");
  const customerHashId = sessionStorage.getItem("customerHashId");

  if (businessDocumentType === "") {
    toast.warn("Document Type must not be empty");
    return; // Exit early if there's an issue
  }

  const businessDocumentFile = businessDocumentFileInput.files[0];

  if (!businessDocumentFile) {
    toast.warn("Please select a Document File");
    return; // Exit early if there's no file selected
  }

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("businessRegistrationNumber", brn);
  formData.append("email", email);
  formData.append("businessDocumentType", businessDocumentType);
  formData.append("businessDocumentFile", businessDocumentFile);
  formData.append("customerHashId", customerHashId);

  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/UploadDocumentsBusiness",
      formData
    );

    const obj = response.data;
    if (obj.clientId || obj.caseId) {
      toast.success("Submission successful");
    } else {
      toast.error("Submission failed: " + obj.message);
    }
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
};

export const RegenerateKycUrl = async () => {
  let customerHashId = sessionStorage.getItem("customerHashId");
  if (customerHashId && customerHashId !== "") {
    Swal.fire({
      didOpen: () => {
        Swal.showLoading();
      },
      text: "Generating Link... Please wait...",
      allowOutsideClick: false,
      width: 400,
    });

    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/regeneratekycurl", {
        params: { customerHashId: customerHashId },
      });
      let obj = response.data;
      if (obj.status && obj.redirectUrl && obj.expiryInMinutes) {
        Swal.fire({
          icon: "success",
          text: "New KYC Link Generated Successfully, Please Click 'OK' To Continue.",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "KYC Link Generation Failed",
          text: `Reason: ${obj.message}`,
          allowOutsideClick: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "KYC Link Generation Failed. Network Error.",
        allowOutsideClick: false,
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      text: "Customer Id not available",
      allowOutsideClick: false,
    });
  }
};
