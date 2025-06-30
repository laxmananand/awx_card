import React, { useState, useEffect } from "react";
import Axios from "axios";
import { toast } from "react-toastify";

export const GetBusinessCorporationDetails = async (brn) => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getBusinessIncorporationDetails",
      {
        params: {
          businessRegistrationNumber: brn,
        },
      }
    );

    let obj = response.data;
    return JSON.stringify(obj);
  } catch (error) {
    console.log("Something went wrong: " + error);
  }
};

export const GetAdditionalBusinessCorporationDetails = async (brn) => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/getAdditionalBusinessDetails",
      {
        params: {
          businessRegistrationNumber: brn,
        },
      }
    );

    let obj = response.data;

    return JSON.stringify(obj);
  } catch (error) {
    console.log("Something went wrong: " + error);
  }
};

export const GetStakeholderDetails = async (brn) => {
  try {
    const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetStakeholderDetails", {
      params: {
        businessRegistrationNumber: brn,
      },
    });

    let obj = response.data;
    return JSON.stringify(obj);
  } catch (error) {
    console.error("Something went wrong: " + error);
    return [];
  }
};

export const GetApplicantBusinessDetails = async (brn) => {
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/GetApplicantBusinessDetails",
      {
        params: {
          businessRegistrationNumber: brn,
        },
      }
    );

    let obj = response.data;
    return JSON.stringify(obj);
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
};

export const GetKYBDetails = async (brn) => {
  return;
};

export const FetchDetails = async () => {
  var lastemail = sessionStorage.getItem("lastemail");
  if (lastemail && lastemail !== "") {
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/SignupRoutes/getuserstatus", {
        params: {
          email: lastemail,
        },
      });

      let obj = response.data;
      if (obj.status != "BAD_REQUEST") {
        if (obj.internalBusinessId != "") {
          sessionStorage.setItem("internalBusinessId", obj.internalBusinessId);
        }

        if (obj.lastScreenCompleted != "") {
          sessionStorage.setItem("lastScreenCompleted", obj.lastScreenCompleted);
        }

        if (obj.userStatus != "") {
          sessionStorage.setItem("userStatus", obj.userStatus);
        }
      } else {
        console.error("No results found for the email: " + lastemail);
      }
    } catch (error) {
      console.error("Something went wrong: ", error);
    }
  }
};

export const FetchOnboardingDetails = async () => {
  var brn = sessionStorage.getItem("internalBusinessId");
  if (brn && brn !== "") {
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
        }

        if (obj.region != "") {
          sessionStorage.setItem("region", obj.region);
        }

        if (obj.remarks != "") {
          sessionStorage.setItem("complianceRemarks", obj.remarks);
        }

        if (!sessionStorage.getItem("complianceStatus")) {
          if (obj.status !== "") {
            sessionStorage.setItem("complianceStatus", obj.status);
          }
        }

        return obj;
      } else {
        console.log("No results found for the business registration number : " + brn);

        return { status: "registration not found" };
      }
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  }
};
