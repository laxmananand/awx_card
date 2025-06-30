import Axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import * as states from "../features/onboardingFeatures";
import {
  setAdminFlag,
  setAWXAccountId,
  setShowSidebar,
} from "../features/auth";
import CryptoJS from "crypto-js";
import { logout } from "../../components/Signup/js/logout-function.js";

const now = new Date();
const formattedDateTime = `${now.getDate().toString().padStart(2, "0")}:${(
  now.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}:${now.getFullYear().toString().slice(-2)}:${now
  .getHours()
  .toString()
  .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

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

//Onboarding Actions
export const GetBusinessCorporationDetails = (brn) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") +
        "/OnboardingRoutes/getBusinessIncorporationDetails",
      {
        params: {
          businessRegistrationNumber: brn,
        },
      }
    );

    let obj = response.data;
    dispatch(states.setBusinessCorporationDetails(obj));
    return obj;
  } catch (error) {
    return {
      message: "Something went wrong, please try again!",
      status: "BAD_REQUEST",
    };
  }
};

export const GetAdditionalBusinessCorporationDetails =
  (brn) => async (dispatch) => {
    try {
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/getAdditionalBusinessDetails",
        {
          params: {
            businessRegistrationNumber: brn,
          },
        }
      );

      let obj = response.data;
      dispatch(states.setAdditionalBusinessCorporationDetails(obj));
      if (obj.hasOwnProperty("regCountry")) {
        sessionStorage.setItem("registerdCountry", obj.regCountry);
      }
      return obj;
    } catch (error) {
      return {
        message: "Something went wrong, please try again!",
        status: "BAD_REQUEST",
      };
    }
  };

export const GetStakeholderDetails = (brn) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") +
        "/OnboardingRoutes/GetStakeholderDetails",
      {
        params: {
          businessRegistrationNumber: brn,
        },
      }
    );

    let obj = response.data;
    dispatch(states.setStakeholderDetails(obj));
    return obj;
  } catch (error) {
    return [];
  }
};

export const GetApplicantBusinessDetails = (brn) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") +
        "/OnboardingRoutes/GetApplicantBusinessDetails",
      {
        params: {
          businessRegistrationNumber: brn,
        },
      }
    );

    let obj = response.data;
    dispatch(states.setApplicantBusinessDetails(obj));
    return obj;
  } catch (error) {
    return {
      message: "Something went wrong, please try again!",
      status: "BAD_REQUEST",
    };
  }
};

export const FetchDetails = () => async (dispatch, getState) => {
  var lastemail = sessionStorage.getItem("lastemail");
  const platform = getState().common.platform;
  if (lastemail) {
    try {
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/SignupRoutes/getuserstatus",
        {
          params: {
            email: lastemail,
            platform,
          },
        }
      );

      let obj = platform === "nium" ? response.data : response.data[0];

      if (obj.status === "UNAUTHORIZED_ACCESS") {
        Swal.fire({
          title: "Unauthorized Access",
          text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
          icon: "error",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            logout();
          } else {
            setTimeout(() => {
              logout();
            }, 1500);
          }
        });

        return;
      }

      if (obj.status != "BAD_REQUEST") {
        dispatch(states.setUserStatusObj(obj));

        if (obj.updatedTime) {
          sessionStorage.setItem("updatedTime", obj.updatedTime);
        }
        if (obj.userStatus) {
          sessionStorage.setItem("userStatus", obj.userStatus);
        }
        if (obj.userEmailId) {
          sessionStorage.setItem("userEmailId", obj.userEmailId);
        }
        if (obj.internalBusinessId) {
          sessionStorage.setItem("internalBusinessId", obj.internalBusinessId);
          if (platform === "awx")
            dispatch(setAWXAccountId(obj.internalBusinessId));
        }
        if (obj.createdTime) {
          sessionStorage.setItem("createdTime", obj.createdTime);
        }
        if (obj.lastScreenCompleted) {
          sessionStorage.setItem(
            "lastScreenCompleted",
            obj.lastScreenCompleted
          );
        }

        return obj;
      } else {
        return {
          message: "No results found for the email: " + lastemail,
          status: "BAD_REQUEST",
        };
      }
    } catch (error) {
      return {
        message: "Something went wrong, please try again later!",
        status: "BAD_REQUEST",
      };
    }
  } else {
    return { message: "Email not found for the user", status: "BAD_REQUEST" };
  }
};

export const FetchOnboardingDetails = (brn) => async (dispatch) => {
  if (brn) {
    try {
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") +
          "/SignupRoutes/getuseronboardingstatus",
        {
          params: {
            brn: brn,
          },
        }
      );

      let data = response.data;

      if (data.status === "UNAUTHORIZED_ACCESS") {
        Swal.fire({
          title: "Unauthorized Access",
          text: "Your session has expired or you are attempting to access with the wrong Business-Id. Please Sign In again.",
          icon: "error",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            logout();
          } else {
            setTimeout(() => {
              logout();
            }, 1500);
          }
        });

        return;
      }

      if (data.length > 0) {
        let obj = data[0];

        dispatch(states.setUserOnboardingDetails(obj));
        return obj;
      } else {
        return {
          message:
            "No results found for the business registration number : " + brn,
          status: "BAD_REQUEST",
        };
      }
    } catch (error) {
      return { message: "Something went wrong: ", status: "BAD_REQUEST" };
    }
  } else {
    return {
      message: "Business registration number not found",
      status: "BAD_REQUEST",
    };
  }
};

export const FetchCognitoDetails = () => async (dispatch) => {
  var email = sessionStorage.getItem("lastemail");
  if (email) {
    try {
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/SignupRoutes/getcognitouserinfo",
        {
          params: {
            email: email,
          },
        }
      );

      let data = response.data;

      if (data.status === "UNAUTHORIZED_ACCESS") {
        Swal.fire({
          title: "Unauthorized Access",
          text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
          icon: "error",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            logout();
          } else {
            setTimeout(() => {
              logout();
            }, 1500);
          }
        });

        return;
      }

      dispatch(states.setUserCognitoDetails(data));

      let adminFlagObj = data.userAttributes?.find(
        (item) => item.name === "custom:adminflag"
      );
      if (adminFlagObj) {
        let adminFlagVal = adminFlagObj?.value;
        console.log("adminFlag: ", adminFlagVal);
        dispatch(setAdminFlag(adminFlagVal));
      }

      return data;
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  }
};

export const fetchKycStatus = (customerHashId) => async (dispatch) => {
  if (customerHashId) {
    try {
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/getKycStatusClient",
        {
          params: {
            customerHashId: customerHashId,
          },
        }
      );

      let obj = response.data;
      dispatch(states.setCustomerDetailsNIUMObj(obj));

      if (obj.hasOwnProperty("complianceStatus")) {
        dispatch(states.setComplianceStatus(obj.complianceStatus));
        //sessionStorage.setItem("complianceStatus", obj.complianceStatus);
      }

      if (obj.hasOwnProperty("status")) {
        dispatch(states.setFinalKycStatus(obj.status));
        //sessionStorage.setItem("finalKycStatus", obj.status);
      }

      return obj;
    } catch (error) {
      console.log("Something went wrong: " + error);
      return error;
    }
  } else {
    console.log("KYC STATUS NOT available");
    return { status: "BAD_REQUEST", message: "KYC STATUS NOT available" };
  }
};

export const FetchEnumValues = (category, region) => async (dispatch) => {
  if (!category) {
    toast.warn("Category Must Not Be Empty");
  } else {
    try {
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/CommonRoutes/fetchenumvalues",
        {
          params: {
            category: category,
            region: region,
          },
        }
      );

      let obj = response.data;
      if (obj.data) {
        if (category === "businessType") {
          dispatch(states.setBusinessTypeValues(obj.data));
        }
        if (category === "listedExchange") {
          dispatch(states.setListedExchangeValues(obj.data));
        }
        if (category === "totalEmployees") {
          dispatch(states.setTotalEmployeesValues(obj.data));
        }
        if (category === "annualTurnover") {
          dispatch(states.setAnnualTurnoverValues(obj.data));
        }
        if (category === "industrySector") {
          dispatch(states.setIndustrySectorValues(obj.data));
        }
        if (category === "intendedUseOfAccount") {
          dispatch(states.setIntendedUseOfAccountValues(obj.data));
        }
        if (category === "position") {
          dispatch(states.setPositionValues(obj.data));
        }
        if (category === "countryName") {
          dispatch(states.setCountryNameValues(obj.data));
        }
        if (category === "unregulatedTrustType") {
          dispatch(states.setUnregulatedTrustTypeValues(obj.data));
        }
        if (category === "occupation") {
          dispatch(states.setOccupation(obj.data));
        }

        if (category === "documentType") {
          dispatch(states.setDocumentTypeValues(obj.data));
        }

        if (region === "EU") {
          if (category === "monthlyTransactionVolume") {
            dispatch(states.setMonthlyTransactionVolume(obj.data));
          }
          if (category === "monthlyTransactions") {
            dispatch(states.setMonthlyTransactions(obj.data));
          }
          if (category === "averageTransactionValue") {
            dispatch(states.setAverageTransactionValue(obj.data));
          }
        }
        return obj.data;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }
};

export const listCountry = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/CommonRoutes/listCountry"
    );
    let obj = response.data;
    var List = obj.result;
    if (List) {
      dispatch(states.setCountryZoqq(List));
      return List;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
};

export const listCountryCode = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/CommonRoutes/listCountryCode"
    );
    let obj = response.data;
    var List = obj.result;
    if (List) {
      dispatch(states.setCountryCodeValues(List));
      return List;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
};

export const listNationality = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/CommonRoutes/listNationality"
    );
    let obj = response.data;
    var List = obj.result;
    if (List) {
      dispatch(states.setNationalityValues(List));
      return List;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
};

export const GetCorporateDetailsList =
  (businessRegistrationNumber, region) => async (dispatch) => {
    if (businessRegistrationNumber) {
      try {
        const response = await axiosInstance.get(
          sessionStorage.getItem("baseUrl") +
            "/OnboardingRoutes/getBusinessList",
          {
            params: {
              region: region,
              businessRegistrationNumber: businessRegistrationNumber,
            },
          }
        );

        let obj = response.data;
        let result = obj;

        if (result.length && result.length > 0) {
          return result;
        } else {
          return [];
        }
      } catch (error) {
        return [];
      }
    }
  };

export const GetCorporateDetailsNIUM = (region, brn) => async (dispatch) => {
  if (brn) {
    try {
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/getBusinessDetails",
        {
          params: {
            region: region,
            businessRegistrationNumber: brn,
          },
        }
      );

      let obj = response.data;
      if (obj) {
        dispatch(states.setBusinessDetailsNIUMObj(obj));
        return obj;
      } else {
        dispatch(states.setBusinessDetailsNIUMObj({}));
        toast.error("No business details found for: " + brn);
        return obj;
      }
    } catch (error) {
      dispatch(states.setBusinessDetailsNIUMObj({}));
      toast.error("Error fetching business details: " + error.message);
    }
  } else {
    dispatch(states.setBusinessDetailsNIUMObj({}));
    toast.error("No option selected.");
  }
};

export const PostBusinessAddressDetails = (requestBody) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      `${sessionStorage.getItem(
        "baseUrl"
      )}/OnboardingRoutes/postBusinessAddressDetails`,
      {
        params: {
          email: requestBody.email,
          businessRegistrationNumber: requestBody.businessRegistrationNumber,
          businessName: requestBody.businessName,
          businessType: requestBody.businessType,
          tradeName: requestBody.tradeName,
          settlorName: requestBody.settlorName,
          trusteeName: requestBody.trusteeName,
          partnerName: requestBody.partnerName,
          partnerState: requestBody.partnerState,
          partnerCountry: requestBody.partnerCountry,
          associationName: requestBody.associationName,
          associationNumber: requestBody.associationNumber,
          associationChairPerson: requestBody.associationChairPerson,
          registrationAddress_1: requestBody.registrationAddress_1,
          registrationAddress_2: requestBody.registrationAddress_2,
          registrationCity: requestBody.registrationCity,
          registrationState: requestBody.registrationState,
          registrationPostCode: requestBody.registrationPostCode,
          registrationCountry: requestBody.registrationCountry,
          sameBusinessAddress: requestBody.sameBusinessAddress,
          businessAddress_1: requestBody.businessAddress_1,
          businessAddress_2: requestBody.businessAddress_2,
          businessCity: requestBody.businessCity,
          businessState: requestBody.businessState,
          businessPostCode: requestBody.businessPostCode,
          businessCountry: requestBody.businessCountry,
          businessKybMode: requestBody.businessKybMode,
        },
      }
    );

    const obj = response.data;
    if (obj.status === "SUCCESS") {
      try {
        const response2 = await axiosInstance.get(
          `${sessionStorage.getItem(
            "baseUrl"
          )}/OnboardingRoutes/getBusinessIncorporationDetails`,
          {
            params: {
              businessRegistrationNumber:
                requestBody.businessRegistrationNumber,
            },
          }
        );
        const obj2 = response2.data;
        dispatch(states.setBusinessCorporationDetails(obj2));

        if (obj2.businessName) {
          try {
            const response3 = await axiosInstance.get(
              `${sessionStorage.getItem("baseUrl")}/SignupRoutes/getuserstatus`,
              {
                params: {
                  email: requestBody.email,
                },
              }
            );

            const obj3 = response3.data;

            if (obj3.status === "UNAUTHORIZED_ACCESS") {
              Swal.fire({
                title: "Unauthorized Access",
                text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
                icon: "error",
                confirmButtonText: "OK",
              }).then((result) => {
                if (result.isConfirmed) {
                  logout();
                } else {
                  setTimeout(() => {
                    logout();
                  }, 1500);
                }
              });

              return;
            }

            if (obj3.status !== "BAD_REQUEST") {
              dispatch(states.setUserStatusObj(obj3));
              dispatch(states.setShowTab(1));
              dispatch(states.setCurrentPage(2));
              toast.success("General Details Submitted");
              return obj;
            }
          } catch (error) {
            console.error("Error fetching user status:", error);
            toast.success("General Details Submitted");
            return obj;
          }
        }
      } catch (error) {
        console.error("Error fetching business incorporation details:", error);
        toast.success("General Details Submitted");
        return obj;
      }
    } else {
      toast.error(`Submission Failed: ${obj.message}`);
    }
  } catch (error) {
    console.error("Error submitting business address details:", error);
    toast.error("Something went wrong, please try again!");
  }
};

export const PatchBusinessAddressDetails =
  (requestBody) => async (dispatch, getState) => {
    let userDetailsObj = getState().onboarding.UserStatusObj;
    let userOnboardingDetails = getState().onboarding.UserOnboardingDetails;
    try {
      const response = await axiosInstance.get(
        `${sessionStorage.getItem(
          "baseUrl"
        )}/OnboardingRoutes/patchBusinessAddressDetails`,
        {
          params: {
            businessRegistrationNumber: requestBody.businessRegistrationNumber,
            businessName: requestBody.businessName,
            businessType: requestBody.businessType,
            tradeName: requestBody.tradeName,
            settlorName: requestBody.settlorName,
            trusteeName: requestBody.trusteeName,
            partnerName: requestBody.partnerName,
            partnerState: requestBody.partnerState,
            partnerCountry: requestBody.partnerCountry,
            associationName: requestBody.associationName,
            associationNumber: requestBody.associationNumber,
            associationChairPerson: requestBody.associationChairPerson,
            registrationAddress_1: requestBody.registrationAddress_1,
            registrationAddress_2: requestBody.registrationAddress_2,
            registrationCity: requestBody.registrationCity,
            registrationState: requestBody.registrationState,
            registrationPostCode: requestBody.registrationPostCode,
            registrationCountry: requestBody.registrationCountry,
            sameBusinessAddress: requestBody.sameBusinessAddress,
            businessAddress_1: requestBody.businessAddress_1,
            businessAddress_2: requestBody.businessAddress_2,
            businessCity: requestBody.businessCity,
            businessState: requestBody.businessState,
            businessPostCode: requestBody.businessPostCode,
            businessCountry: requestBody.businessCountry,
          },
        }
      );

      const obj = response.data;
      if (obj.status === "SUCCESS") {
        try {
          const response2 = await axiosInstance.get(
            `${sessionStorage.getItem(
              "baseUrl"
            )}/OnboardingRoutes/getBusinessIncorporationDetails`,
            {
              params: {
                businessRegistrationNumber:
                  requestBody.businessRegistrationNumber,
              },
            }
          );
          const obj2 = response2.data;
          dispatch(states.setBusinessCorporationDetails(obj2));

          if (obj2.businessName) {
            try {
              const response3 = await axiosInstance.get(
                `${sessionStorage.getItem(
                  "baseUrl"
                )}/SignupRoutes/getuserstatus`,
                {
                  params: {
                    email: sessionStorage.getItem("lastemail"),
                  },
                }
              );

              const obj3 = response3.data;

              if (obj3.status === "UNAUTHORIZED_ACCESS") {
                Swal.fire({
                  title: "Unauthorized Access",
                  text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
                  icon: "error",
                  confirmButtonText: "OK",
                }).then((result) => {
                  if (result.isConfirmed) {
                    logout();
                  } else {
                    setTimeout(() => {
                      logout();
                    }, 1500);
                  }
                });

                return;
              }

              if (obj3.status !== "BAD_REQUEST") {
                dispatch(states.setUserStatusObj(obj3));

                toast.success("General Details Updated.");

                return obj;
              }
            } catch (error) {
              console.error("Error fetching user status:", error);

              toast.success("General Details Updated.");

              return obj;
            }
          }
        } catch (error) {
          console.error(
            "Error fetching business incorporation details:",
            error
          );

          toast.success("General Details Updated.");

          return obj;
        }
      } else {
        toast.error(`Update Failed: ${obj.message}`);
      }
    } catch (error) {
      console.error("Error updating business address details:", error);
      toast.error("Something went wrong, please try again!");
    }
  };

export const PostRiskAssessmentInfo =
  (body, { setBtnLoader }) =>
  async (dispatch) => {
    try {
      setBtnLoader(true);
      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/postRiskAssessmentInfo",
        body
      );

      let obj = response.data;
      if (obj.status == "SUCCESS") {
        try {
          const response2 = await axiosInstance.get(
            sessionStorage.getItem("baseUrl") +
              "/OnboardingRoutes/getAdditionalBusinessDetails",
            {
              params: {
                businessRegistrationNumber: body.businessRegistrationNumber,
              },
            }
          );

          let obj2 = response2.data;
          dispatch(states.setAdditionalBusinessCorporationDetails(obj2));
          if (obj2.regCountry) {
            try {
              const response3 = await axiosInstance.get(
                `${sessionStorage.getItem(
                  "baseUrl"
                )}/SignupRoutes/getuserstatus`,
                {
                  params: {
                    email: body.email || sessionStorage.getItem("lastemail"),
                  },
                }
              );

              const obj3 = response3.data;

              if (obj3.status === "UNAUTHORIZED_ACCESS") {
                Swal.fire({
                  title: "Unauthorized Access",
                  text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
                  icon: "error",
                  confirmButtonText: "OK",
                }).then((result) => {
                  if (result.isConfirmed) {
                    logout();
                  } else {
                    setTimeout(() => {
                      logout();
                    }, 1500);
                  }
                });

                return;
              }

              if (obj3.status !== "BAD_REQUEST") {
                dispatch(states.setUserStatusObj(obj3));
                dispatch(states.setCurrentPage(3));
                dispatch(states.setShowTab(5));
                toast.success("Business Details Submitted");
                return obj;
              }
            } catch (error) {
              console.error("Error fetching user status:", error);
              toast.success("Business Details Submitted");
              return obj;
            }
          }
        } catch (error) {
          console.error("Error fetching additional business details:", error);
          toast.success("Business Details Submitted");
          return obj;
        }
      } else {
        setBtnLoader(false);
        console.error("Business details submission failed: " + obj.message);
        toast.error("Submission Failed: " + obj.message);
      }
    } catch (error) {
      setBtnLoader(false);
      console.error("Something went wrong: " + JSON.stringify(error));
      toast.error("Something went wrong, please try again later!");
    }
  };

export const PatchRiskAssessmentInfo = (body) => async (dispatch, getState) => {
  try {
    const response = await axiosInstance.post(
      sessionStorage.getItem("baseUrl") +
        "/OnboardingRoutes/patchRiskAssessmentInfo",
      body
    );

    let obj = response.data;
    if (obj.status == "SUCCESS") {
      try {
        const response2 = await axiosInstance.get(
          sessionStorage.getItem("baseUrl") +
            "/OnboardingRoutes/getAdditionalBusinessDetails",
          {
            params: {
              businessRegistrationNumber: body.businessRegistrationNumber,
            },
          }
        );

        let obj2 = response2.data;
        dispatch(states.setAdditionalBusinessCorporationDetails(obj2));
        toast.success("Business Details Updated");
        return obj;
      } catch (error) {
        console.error("Error fetching additional business details:", error);
        toast.success("Business Details Updated");
        return obj;
      }
    } else {
      console.error("Business details update failed: " + obj.message);
      toast.error("Update Failed: " + obj.message);
    }
  } catch (error) {
    console.error("Something went wrong: " + JSON.stringify(error));
    toast.error("Something went wrong, please try again later!");
  }
};

export const PostStakeholderDetails =
  ({ body, setSubmitBtnShow, setBtnLoader, navigate }) =>
  async (dispatch) => {
    setBtnLoader(true);

    try {
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/PostBusinessPartnerAddressDetails",
        {
          params: body,
        }
      );

      let obj = response.data;

      if (obj.status == "SUCCESS") {
        try {
          const response2 = await axiosInstance.get(
            sessionStorage.getItem("baseUrl") +
              "/OnboardingRoutes/GetStakeholderDetails",
            {
              params: {
                businessRegistrationNumber: body.businessRegistrationNumber,
              },
            }
          );

          let obj2 = response2.data;
          dispatch(states.setStakeholderDetails(obj2));

          if (obj2 && obj2.length > 0) {
            try {
              const response3 = await axiosInstance.get(
                `${sessionStorage.getItem(
                  "baseUrl"
                )}/SignupRoutes/getuserstatus`,
                {
                  params: {
                    email: body.email || sessionStorage.getItem("lastemail"),
                  },
                }
              );

              const obj3 = response3.data;

              if (obj3.status === "UNAUTHORIZED_ACCESS") {
                Swal.fire({
                  title: "Unauthorized Access",
                  text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
                  icon: "error",
                  confirmButtonText: "OK",
                }).then((result) => {
                  if (result.isConfirmed) {
                    logout();
                  } else {
                    setTimeout(() => {
                      logout();
                    }, 1500);
                  }
                });

                return;
              }

              if (obj3.status !== "BAD_REQUEST") {
                dispatch(states.setUserStatusObj(obj3));
                // dispatch(states.setCurrentPage(4));
                // dispatch(states.setShowTab(3));
                setSubmitBtnShow(true);
                setBtnLoader(false);

                setTimeout(() => {
                  navigate(0);
                }, 2000);
                toast.success("Shareholder/Business Partner Details Submitted");
                //return obj;
              }
            } catch (error) {
              console.error("Error fetching user status:", error);
              toast.success("Shareholder/Business Partner Details Submitted");
              setSubmitBtnShow(true);
              setBtnLoader(false);

              setTimeout(() => {
                navigate(0);
              }, 2000);
              //return obj;
            }
          }
        } catch (error) {
          setSubmitBtnShow(true);
          setBtnLoader(false);

          setTimeout(() => {
            navigate(0);
          }, 2000);
          toast.success("Shareholder/Business Partner Details Submitted");
          return obj;
        }
      } else {
        toast.error("Submission failed: " + obj.message);
        //return obj;
      }
    } catch (error) {
      console.log("Something went wrong: " + error);
      //return error;
    }
  };

export const PatchStakeholderDetails =
  (body, { setBtnLoader }) =>
  async (dispatch) => {
    try {
      setBtnLoader(true);

      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/PatchBusinessPartnerAddressDetails",
        {
          params: body,
        }
      );

      let obj = response.data;
      if (obj.status == "SUCCESS") {
        try {
          const response2 = await axiosInstance.get(
            sessionStorage.getItem("baseUrl") +
              "/OnboardingRoutes/GetStakeholderDetails",
            {
              params: {
                businessRegistrationNumber: body.businessRegistrationNumber,
              },
            }
          );

          let obj2 = response2.data;
          dispatch(states.setStakeholderDetails(obj2));
          toast.success("Shareholder/Business Partner Updated");
          setBtnLoader(false);
        } catch (error) {
          toast.success("Shareholder/Business Partner Updated");
          setBtnLoader(false);
        }
      } else {
        toast.error("Update failed: " + obj.message);
        setBtnLoader(false);
      }
    } catch (error) {
      toast.error("Something went wrong: " + error);
      setBtnLoader(false);
    }
  };

export const DeleteStakeholderDetails =
  (body, { setBtnLoader, navigate }) =>
  async (dispatch) => {
    try {
      setBtnLoader(true);
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/DeleteBusinessPartnerAddressDetails",
        {
          params: body,
        }
      );

      let obj = response.data;
      if (obj.status == "SUCCESS") {
        try {
          const response2 = await axiosInstance.get(
            sessionStorage.getItem("baseUrl") +
              "/OnboardingRoutes/GetStakeholderDetails",
            {
              params: {
                businessRegistrationNumber: body.businessRegistrationNumber,
              },
            }
          );

          let obj2 = response2.data;
          dispatch(states.setStakeholderDetails(obj2));
          toast.success("Shareholder/Business Partner Deleted.");
          setBtnLoader(false);

          setTimeout(() => {
            navigate(0);
          }, 2000);

          return obj;
        } catch (error) {
          toast.success("Shareholder/Business Partner Deleted.");
          setBtnLoader(false);
          return obj;
        }
      } else {
        toast.error("Deletion failed: " + obj.message);
        setBtnLoader(false);
      }
    } catch (error) {
      toast.error("Something went wrong: " + error);
      setBtnLoader(false);
    }
  };

export const PostApplicantDetails = (body) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") +
        "/OnboardingRoutes/postApplicantContactDetails",
      {
        params: body,
      }
    );

    let obj = response.data;

    if (obj.status == "SUCCESS") {
      try {
        const response2 = await axiosInstance.get(
          sessionStorage.getItem("baseUrl") +
            "/OnboardingRoutes/GetApplicantBusinessDetails",
          {
            params: {
              businessRegistrationNumber: body.businessRegistrationNumber,
            },
          }
        );

        let obj2 = response2.data;
        dispatch(states.setApplicantBusinessDetails(obj2));

        if (obj2 && obj2.applicantFirstName) {
          try {
            const response3 = await axiosInstance.get(
              `${sessionStorage.getItem("baseUrl")}/SignupRoutes/getuserstatus`,
              {
                params: {
                  email: body.email || sessionStorage.getItem("lastemail"),
                },
              }
            );

            const obj3 = response3.data;

            if (obj3.status === "UNAUTHORIZED_ACCESS") {
              Swal.fire({
                title: "Unauthorized Access",
                text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
                icon: "error",
                confirmButtonText: "OK",
              }).then((result) => {
                if (result.isConfirmed) {
                  logout();
                } else {
                  setTimeout(() => {
                    logout();
                  }, 1500);
                }
              });

              return;
            }

            if (obj3.status !== "BAD_REQUEST") {
              dispatch(states.setUserStatusObj(obj3));
              //dispatch(states.setCurrentPage(4));
              //dispatch(states.setShowTab(3));
              toast.success("Applicant Details Submitted");
              return obj;
            }
          } catch (error) {
            console.error("Error fetching user status:", error);
            toast.success("Applicant Details Submitted");
            return obj;
          }
        }
      } catch (error) {
        toast.success("Applicant Details Submitted");
        return obj;
      }
    } else {
      toast.error("Submission failed: " + obj.message);
    }
  } catch (error) {
    console.log("Something went wrong: " + error);
  }
};

export const PatchApplicantDetails = (body) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") +
        "/OnboardingRoutes/patchApplicantContactDetails",
      {
        params: body,
      }
    );

    let obj = response.data;

    if (obj.status == "SUCCESS") {
      try {
        const response2 = await axiosInstance.get(
          sessionStorage.getItem("baseUrl") +
            "/OnboardingRoutes/GetApplicantBusinessDetails",
          {
            params: {
              businessRegistrationNumber: body.businessRegistrationNumber,
            },
          }
        );

        let obj2 = response2.data;
        dispatch(states.setApplicantBusinessDetails(obj2));
        toast.success("Applicant Details Updated");
        return obj;
      } catch (error) {
        toast.success("Applicant Details Updated");
        return obj;
      }
    } else {
      toast.error("Update failed: " + obj.message);
    }
  } catch (error) {
    console.log("Something went wrong: " + error);
  }
};

export const ShowTCS = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") +
        "/OnboardingRoutes/GetTerms&Conditions"
    );

    let obj = response.data;

    return obj;
  } catch (error) {
    return error;
  }
};

export const PostEKYC = (body) => async (dispatch) => {
  const params = {
    businessRegistrationNumber: body.brn,
    name: document.getElementById("tCname").value,
    versionId: document.getElementById("tCversion").value,
    accept: "true",
    region: body.region,
  };

  if (body.complianceStatus) {
    params.complianceStatus = body.complianceStatus;
    if (
      body.complianceStatus === "ERROR" ||
      body.complianceStatus === "REJECT"
    ) {
      params.customerHashId = body.customerHashId;
      params.clientId = body.clientId;
    }
  }

  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/OnboardEKYCUser",
      {
        params: params,
      }
    );

    let obj = response.data;

    if (obj.onboardingStatus == "Failed") {
      return obj;
    } else if (obj.onboardingStatus === "SUCCESS") {
      dispatch(states.setUserOnboardingDetails(obj));

      try {
        const response3 = await axiosInstance.get(
          `${sessionStorage.getItem("baseUrl")}/SignupRoutes/getuserstatus`,
          {
            params: {
              email: sessionStorage.getItem("lastemail"),
            },
          }
        );

        const obj3 = response3.data;

        if (obj3.status === "UNAUTHORIZED_ACCESS") {
          Swal.fire({
            title: "Unauthorized Access",
            text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
            icon: "error",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              logout();
            } else {
              setTimeout(() => {
                logout();
              }, 1500);
            }
          });

          return;
        }

        if (obj3.status !== "BAD_REQUEST") {
          dispatch(states.setUserStatusObj(obj3));

          if (obj.customerHashId) {
            try {
              const response4 = await axiosInstance.get(
                sessionStorage.getItem("baseUrl") +
                  "/OnboardingRoutes/getKycStatusClient",
                {
                  params: {
                    customerHashId: obj.customerHashId,
                  },
                }
              );

              let obj4 = response4.data;
              dispatch(states.setCustomerDetailsNIUMObj(obj4));

              if (obj4.hasOwnProperty("complianceStatus")) {
                dispatch(states.setComplianceStatus(obj4.complianceStatus));
              }

              if (obj4.hasOwnProperty("status")) {
                dispatch(states.setFinalKycStatus(obj4.status));
              }
              return obj;
            } catch (error) {
              console.log("Something went wrong: " + error);
              return obj;
            }
          } else {
            console.log("KYC STATUS NOT available");
            return obj;
          }
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
        return obj;
      }
    } else {
      return obj;
    }
  } catch (error) {
    return error;
  }
};

export const RegenerateKycUrl =
  (customerHashId, { setKycUrl }) =>
  async (dispatch) => {
    if (!customerHashId) {
      Swal.fire({
        icon: "error",
        text: "Customer ID not available",
        allowOutsideClick: false,
      });
      return;
    }

    Swal.fire({
      didOpen: () => {
        Swal.showLoading();
      },
      text: "Generating Link... Please wait...",
      allowOutsideClick: false,
      width: 400,
    });

    try {
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/regeneratekycurl",
        {
          params: { customerHashId },
        }
      );

      const obj = response.data;

      if (obj.status && obj.redirectUrl && obj.expiryInMinutes) {
        Swal.fire({
          icon: "success",
          text: "New KYC Link Generated Successfully. Please Click 'OK' To Continue.",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            setKycUrl(obj.redirectUrl);
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
  };

export const PostBusinessKYBDetails =
  (formData, { setBusinessLoader }) =>
  async (dispatch) => {
    try {
      setBusinessLoader(true);
      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/UploadDocumentsBusiness",
        formData
      );

      const obj = response.data;
      if (obj.clientId || obj.caseId) {
        try {
          const response4 = await axiosInstance.get(
            sessionStorage.getItem("baseUrl") +
              "/OnboardingRoutes/getKycStatusClient",
            {
              params: {
                customerHashId: formData.get("customerHashId"),
              },
            }
          );

          let obj4 = response4.data;
          setBusinessLoader(false);
          dispatch(states.setCustomerDetailsNIUMObj(obj4));

          if (obj4.hasOwnProperty("complianceStatus")) {
            dispatch(states.setComplianceStatus(obj4.complianceStatus));
          }

          if (obj4.hasOwnProperty("status")) {
            dispatch(states.setFinalKycStatus(obj4.status));
          }
          toast.success("Business Document(s) Submitted");

          return obj;
        } catch (error) {
          setBusinessLoader(false);
          toast.success("Business Document(s) Submitted");

          console.log("FETCH NIUM DETAILS FAILED: " + error);
          return obj;
        }
      } else {
        setBusinessLoader(false);
        toast.error("Submission failed: " + obj.message);
      }
    } catch (error) {
      setBusinessLoader(false);
      toast.error("Something went wrong, please try again later!");
    }
  };

export const PostApplicantKYBDetails =
  (formData, { setApplicantLoader }) =>
  async (dispatch) => {
    try {
      setApplicantLoader(true);
      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/UploadDocumentsApplicant",
        formData
      );

      const obj = response.data;
      if (obj.clientId || obj.caseId) {
        try {
          const response4 = await axiosInstance.get(
            sessionStorage.getItem("baseUrl") +
              "/OnboardingRoutes/getKycStatusClient",
            {
              params: {
                customerHashId: formData.get("customerHashId"),
              },
            }
          );

          let obj4 = response4.data;
          setApplicantLoader(false);
          dispatch(states.setCustomerDetailsNIUMObj(obj4));

          if (obj4.hasOwnProperty("complianceStatus")) {
            dispatch(states.setComplianceStatus(obj4.complianceStatus));
          }

          if (obj4.hasOwnProperty("status")) {
            dispatch(states.setFinalKycStatus(obj4.status));
          }
          toast.success("Applicant Document(s) Submitted");

          return obj;
        } catch (error) {
          setApplicantLoader(false);
          toast.success("Applicant Document(s) Submitted");

          console.log("FETCH NIUM DETAILS FAILED: " + error);
          return obj;
        }
      } else {
        setApplicantLoader(false);
        toast.error("Submission failed: " + obj.message);
      }
    } catch (error) {
      setApplicantLoader(false);
      console.error("Something went wrong: " + error);
    }
  };

export const PostStakeholderKYBDetails =
  (formData, { setStakeholderLoader }) =>
  async (dispatch) => {
    try {
      setStakeholderLoader(true);
      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/UploadDocumentsStakeholder",
        formData
      );

      const obj = response.data;
      if (obj.clientId || obj.caseId) {
        try {
          const response4 = await axiosInstance.get(
            sessionStorage.getItem("baseUrl") +
              "/OnboardingRoutes/getKycStatusClient",
            {
              params: {
                customerHashId: formData.get("customerHashId"),
              },
            }
          );

          let obj4 = response4.data;
          setStakeholderLoader(false);
          dispatch(states.setCustomerDetailsNIUMObj(obj4));

          if (obj4.hasOwnProperty("complianceStatus")) {
            dispatch(states.setComplianceStatus(obj4.complianceStatus));
          }

          if (obj4.hasOwnProperty("status")) {
            dispatch(states.setFinalKycStatus(obj4.status));
          }
          toast.success("Stakeholder Document(s) Submitted");

          return obj;
        } catch (error) {
          setStakeholderLoader(false);
          toast.success("Stakeholder Document(s) Submitted");

          console.log("FETCH NIUM DETAILS FAILED: " + error);
          return obj;
        }
      } else {
        setStakeholderLoader(false);
        toast.error("Submission failed: " + obj.message);
      }
    } catch (error) {
      setStakeholderLoader(false);
      console.error("Something went wrong: " + error);
    }
  };

export const PostLOADetails =
  (formData, { setLOALoader }) =>
  async (dispatch) => {
    try {
      setLOALoader(true);
      const response = await axiosInstance.post(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/UploadDocumentLOA",
        formData
      );

      const obj = response.data;
      if (obj.clientId || obj.caseId) {
        try {
          const response4 = await axiosInstance.get(
            sessionStorage.getItem("baseUrl") +
              "/OnboardingRoutes/getKycStatusClient",
            {
              params: {
                customerHashId: formData.get("customerHashId"),
              },
            }
          );

          let obj4 = response4.data;
          setLOALoader(false);
          dispatch(states.setCustomerDetailsNIUMObj(obj4));

          if (obj4.hasOwnProperty("complianceStatus")) {
            dispatch(states.setComplianceStatus(obj4.complianceStatus));
          }

          if (obj4.hasOwnProperty("status")) {
            dispatch(states.setFinalKycStatus(obj4.status));
          }
          toast.success("Letter of Authorization Submitted");

          return obj;
        } catch (error) {
          setLOALoader(false);
          toast.success("Letter of Authorization Submitted");

          console.log("FETCH NIUM DETAILS FAILED: " + error);
          return obj;
        }
      } else {
        setLOALoader(false);
        toast.error("Submission failed: " + obj.message);
      }
    } catch (error) {
      setLOALoader(false);
      console.error("Something went wrong: " + error);
    }
  };

export const encryptPassword = (password) => {
  const secretKey = process.env.VITE_secretkey; // Replace with an actual secret key
  const encryptedPassword = CryptoJS.AES.encrypt(
    password,
    secretKey
  ).toString();
  return encryptedPassword;
};

//Signup Actions
export const handleSignIn =
  (
    email,
    password,
    emailRegex,
    emailTagRegex,
    {
      setHelperTextEmail,
      setHelperTextPassword,
      displayMessage,
      setLoading,
      navigate,
    }
  ) =>
  async (dispatch) => {
    if (!email && !password) {
      setHelperTextEmail(`Enter your email address to continue...`);
      setHelperTextPassword(`Enter your password to continue...`);
    } else if (!email) {
      setHelperTextEmail(`Enter your email address to continue...`);
    } else if (!emailRegex.test(email)) {
      setHelperTextEmail(`Enter a valid email address (e.g. : abc@xyz.com)`);
    } else if (emailTagRegex.test(email)) {
      setHelperTextEmail(`HTML tags not allowed inside a email address...`);
    } else if (!password) {
      setHelperTextPassword(`Enter your password to continue...`);
    } else if (emailTagRegex.test(password)) {
      setHelperTextPassword(`HTML tags not allowed inside password...`);
    } else {
      displayMessage(``, "reset");

      setLoading(true);

      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/SignupRoutes/login",
        {
          params: {
            email: email,
            password: encryptPassword(password),
          },
        }
      );

      let obj = response.data;

      if (obj.authenticationResult) {
        if (obj?.authenticationResult?.accessToken) {
          sessionStorage.setItem("lastemail", email);
          sessionStorage.setItem(
            "_cookie",
            obj?.authenticationResult?.accessToken
          );
          dispatch(setShowSidebar(true));
          CreateSession(email, obj, { navigate, setLoading }, dispatch);
        }
      } else if (obj.errorCode) {
        setLoading(false);
        if (obj.errorCode == "UserNotConfirmedException") {
          sessionStorage.setItem("lastemail", email);
          sessionStorage.setItem("_cookie", obj.cookie);
          displayMessage(
            "Email-id not verified, please verify first!",
            "error"
          );
          setTimeout(() => {
            navigate("/verification");
          }, 1500);
        } else if (obj.errorCode == "NotAuthorizedException") {
          displayMessage(
            "Invalid email or password. Please try again.",
            "error"
          );
        } else if (obj.errorCode == "ResourceNotFoundException") {
          displayMessage(
            "There is some configuration issues, please contact your admin",
            "error"
          );
        } else if (obj.errorCode == "UserNotFoundException") {
          displayMessage(
            "WE ARE SURE THE ENTERED EMAIL IS NOT REGISTERED WITH US, PLEASE ENTER THE CORRECT REGISTERED EMAIL",
            "error"
          );
        } else if (obj.errorCode == "UserLambdaValidationException") {
          displayMessage(
            "WE ARE SURE THE ENTERED EMAIL IS NOT REGISTERED WITH US, PLEASE SIGN-UP TO CONTINUE.",
            "error"
          );
        } else if (obj.errorCode == "PasswordResetRequiredException") {
          displayMessage("Password Reset Required", "error");
        } else {
          displayMessage(
            "Something went wrong, please try again later!",
            "error"
          );
        }
      } else if (obj.challengeName === "NEW_PASSWORD_REQUIRED") {
        setLoading(false);
        sessionStorage.setItem("lastemail", email);

        let obj2 = JSON.parse(obj.ChallengeParameters?.userAttributes);
        let phoneNumber = obj2?.phone_number;

        sessionStorage.setItem("phone_number", phoneNumber);

        displayMessage(
          "Please reset your temporary password before proceeding.",
          "error"
        );

        setTimeout(() => {
          navigate("/temporary-password");
        }, 1500);
      }
    }
  };

const CreateSession = async (
  email,
  obj,
  { navigate, setLoading },
  dispatch
) => {
  //Encrypt session data
  const jsonData = {
    status: "SUCCESS",
    email: email,
    timestamp: formattedDateTime,
    sessionId: obj?.authenticationResult?.accessToken,
  };
  let secretKey = null;

  // Convert JSON object to string
  const jsonString = JSON.stringify(jsonData);

  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/CommonRoutes/fetchsecretkey"
    );
    let obj2 = response.data;

    secretKey = obj2.secretKey;

    // Encrypt JSON string
    const encryptedData = CryptoJS.AES.encrypt(
      jsonString,
      secretKey
    ).toString();

    sessionStorage.setItem("_session", encryptedData);

    await Check2FA({ navigate, setLoading, dispatch });
    // let res = JSON.parse(check2Step);
    // if (res.status === "SUCCESS" && res.enable_fa === "NA") {
    //   await NavigateDashboard({ navigate, setLoading, dispatch });
    // } else {
    //   setLoading(false);
    //   navigate("/2fa");
    // }
  } catch (error) {
    setLoading(false);
    console.log("Error generating secret key");
    navigate("/2fa");
  }
};

const Check2FA = async ({ navigate, setLoading, dispatch }) => {
  try {
    let obj = await dispatch(FetchCognitoDetails());

    if (obj.ResponseMetadata.HTTPStatusCode == 200 && obj.userAttributes) {
      let userAttr = obj.userAttributes;
      let name = "";
      let phone_number = "";
      let country_code = "";
      let country_name = "";
      let business_name = "";
      let enable_fa = "";
      let fa_secretKey = "";

      for (var i = 0; i < userAttr.length; i++) {
        let item = userAttr[i];
        if (item.name == "custom:contactName") {
          name = item.value;
        }

        if (item.name == "custom:countryName") {
          country_name = item.value;
        }

        if (item.name == "custom:businessName") {
          business_name = item.value;
        }

        if (item.name == "phone_number") {
          phone_number = item.value;
        }

        if (item.name == "custom:isd_code") {
          country_code = item.value;
        }

        if (item.name == "custom:fa_secretkey") {
          fa_secretKey = item.value;
        }

        if (item.name == "custom:enable_fa") {
          enable_fa = item.value;
        }
      }

      sessionStorage.setItem("contactName", name);
      sessionStorage.setItem("region", country_name);

      if (!enable_fa) {
        navigate("/2fa");
        // NavigateDashboard({ navigate, setLoading, dispatch });
      } else if (enable_fa && enable_fa !== "NA") {
        navigate("/2fa");
        // NavigateDashboard({ navigate, setLoading, dispatch });
      } else {
        if (!name || !business_name || !country_name) {
          setLoading(false);
          navigate("/business-details");
        } else {
          NavigateDashboard({ navigate, setLoading, dispatch });
        }
      }
    } else if (obj.errorCode) {
      setLoading(false);
      let msg = obj.msg || obj.message;
      let msgSplit = msg.split("operation:");
      let errorMsg = msgSplit[1];

      displayMessage(`Sign-In Failed: ${errorMsg}`, "error");
      setTimeout(() => {
        navigate(0);
      }, 1500);
      return;
    }
  } catch (error) {
    return {
      message: "Something went wrong: " + error,
      status: "ERROR",
    };
  }
};

const NavigateDashboard = async ({ navigate, setLoading, dispatch }) => {
  var lastemail = sessionStorage.getItem("lastemail");

  if (lastemail) {
    try {
      let obj = await dispatch(FetchDetails());

      setLoading(false);

      if (obj.status !== "BAD_REQUEST") {
        //Redirect to dashboard page if form filling is done
        navigate("/dashboard");
      } else if (obj.status === "BAD_REQUEST") {
        //Redirect to account setup page if form filling has not been started
        navigate("/account-setup");
      }
    } catch (error) {
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 1500);

      return;
    }
  } else {
    setLoading(false);
    setTimeout(() => {
      navigate("/");
    }, 1500);

    return;
  }
};

export const generateQR = () => async (dispatch) => {
  let email = sessionStorage.getItem("lastemail");
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/SignupRoutes/generateQR",
      {
        params: {
          email: email,
        },
      }
    );
    let obj = response.data;
    return obj;
  } catch (error) {
    return JSON.stringify({
      message: "Something went wrong, please try again later!",
      status: "BAD_REQUEST",
    });
  }
};

export const Reset2Fa = (email) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/SignupRoutes/reset2fa",
      {
        params: { email: email },
      }
    );
    let obj = response.data;

    if (obj.status === "UNAUTHORIZED_ACCESS") {
      Swal.fire({
        title: "Unauthorized Access",
        text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
        } else {
          setTimeout(() => {
            logout();
          }, 1500);
        }
      });

      return;
    }

    if (obj?.ResponseMetadata?.HTTPStatusCode === 200) {
      return { status: "SUCCESS", message: "2FA RESET SUCCESSFULLY!" };
    } else {
      return { status: "ERROR", message: "2FA RESET FAILED!" };
    }
  } catch (error) {
    return { status: "BAD_REQUEST", message: "NETWORK ERROR!" };
  }
};

export const setup2Fa = (otp, secretKey) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/SignupRoutes/verifyQR",
      {
        params: {
          otp: otp,
          secretKey: secretKey,
          email: sessionStorage.getItem("lastemail"),
        },
      }
    );
    let obj = response.data;

    if (obj.status === "UNAUTHORIZED_ACCESS") {
      Swal.fire({
        title: "Unauthorized Access",
        text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
        } else {
          setTimeout(() => {
            logout();
          }, 1500);
        }
      });

      return;
    }

    return obj;
  } catch (error) {
    return;
  }
};

export const handleVerification = (otp, secretKey) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/SignupRoutes/verifyQR2",
      {
        params: {
          otp: otp,
          secretKey: secretKey,
        },
      }
    );
    let obj = response.data;

    if (obj.status === "UNAUTHORIZED_ACCESS") {
      Swal.fire({
        title: "Unauthorized Access",
        text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
        } else {
          setTimeout(() => {
            logout();
          }, 1500);
        }
      });

      return;
    }

    return obj;
  } catch (error) {
    return;
  }
};

export const SignUp =
  (email, password, phoneNumber, cc) => async (dispatch) => {
    try {
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/SignupRoutes/signup",
        {
          params: {
            email: email,
            password: encryptPassword(password),
            phoneNumber: phoneNumber,
            countrycode: cc,
          },
        }
      );

      let obj = response.data;

      return obj;
    } catch (error) {
      return;
    }
  };

export const VerifyUser = (email, verificationCode) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/SignupRoutes/confirmSignup",
      {
        params: {
          email: email,
          code: verificationCode,
        },
      }
    );

    let obj = response.data;

    if (obj.status === "UNAUTHORIZED_ACCESS") {
      Swal.fire({
        title: "Unauthorized Access",
        text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
        } else {
          setTimeout(() => {
            logout();
          }, 1500);
        }
      });

      return;
    }

    return obj;
  } catch (error) {
    return error;
  }
};

export const ResendConfirmation = (email) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") + "/SignupRoutes/resendConfirmation",
      {
        params: {
          email: email,
        },
      }
    );

    let obj = response.data;

    if (obj.status === "UNAUTHORIZED_ACCESS") {
      Swal.fire({
        title: "Unauthorized Access",
        text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
        } else {
          setTimeout(() => {
            logout();
          }, 1500);
        }
      });

      return;
    }

    return obj;
  } catch (error) {
    return error;
  }
};

export const HandleBusinessDetails = (params) => async (dispatch) => {
  try {
    const response = await axiosInstance.get(
      sessionStorage.getItem("baseUrl") +
        "/SignupRoutes/updatecognitoattributes",
      {
        params: params,
      }
    );
    let obj = response.data;

    if (obj.status === "UNAUTHORIZED_ACCESS") {
      Swal.fire({
        title: "Unauthorized Access",
        text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          logout();
        } else {
          setTimeout(() => {
            logout();
          }, 1500);
        }
      });

      return;
    }

    if (obj.ResponseMetadata?.HTTPStatusCode == 200) {
      try {
        await dispatch(FetchCognitoDetails());
      } catch (error) {
        console.log("Error fetching Cognito details: ", error);
      }
    }

    return obj;
  } catch (error) {
    console.log("Something went wrong: ", error);
    return error;
  }
};

export const SendResetOTP =
  (params, { setLoading }) =>
  async (dispatch) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/sendresetotp",
        {
          params: params,
        }
      );
      let obj = response.data;
      setLoading(false);

      return obj;
    } catch (error) {
      setLoading(false);
      console.log("Something went wrong: ", error);
      return error;
    }
  };

export const VerifyResetOTP =
  (params, { setLoading }) =>
  async (dispatch) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/OnboardingRoutes/verifyresetotp",
        {
          params: params,
        }
      );
      let obj = response.data;
      setLoading(false);

      return obj;
    } catch (error) {
      setLoading(false);
      console.log("Something went wrong: ", error);
      return error;
    }
  };

export const ResetTemporaryPassword =
  (params, { setLoading }) =>
  async (dispatch) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") +
          "/SignupRoutes/resettemporarypassword",
        {
          params: params,
        }
      );
      let obj = response.data;
      setLoading(false);

      return obj;
    } catch (error) {
      setLoading(false);
      console.log("Something went wrong: ", error);
      return error;
    }
  };

export const ResendTemporaryPassword =
  (params, { setLoading }) =>
  async (dispatch) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") +
          "/SignupRoutes/resendtemporarypassword",
        {
          params: params,
        }
      );
      let obj = response.data;
      setLoading(false);

      return obj;
    } catch (error) {
      setLoading(false);
      console.log("Something went wrong: ", error);
      return error;
    }
  };

export const HandleVerificationMethod =
  (params, { setLoading }) =>
  async (dispatch) => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        sessionStorage.getItem("baseUrl") + "/SignupRoutes/setup2fa",
        {
          params: params,
        }
      );
      let obj = response.data;

      if (obj.status === "UNAUTHORIZED_ACCESS") {
        Swal.fire({
          title: "Unauthorized Access",
          text: "Your session has expired or you are attempting to access with the wrong email. Please Sign In again.",
          icon: "error",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            logout();
          } else {
            setTimeout(() => {
              logout();
            }, 1500);
          }
        });

        return;
      }

      if (obj.ResponseMetadata?.HTTPStatusCode == 200) {
        try {
          let res = await dispatch(FetchCognitoDetails());
          if (res) setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log("Error fetching Cognito details: ", error);
        }
      }

      return obj;
    } catch (error) {
      setLoading(false);
      console.log("Something went wrong: ", error);
      return error;
    }
  };
