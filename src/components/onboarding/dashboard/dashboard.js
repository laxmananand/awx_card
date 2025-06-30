import React, { useState, useEffect, useRef } from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import General from "./tabs/general";
import BusinessDetails from "./tabs/businessDetails";
import KybDetails from "./tabs/kybDetails";
import ApplicantDetails from "./tabs/applicantDetails";
import StakeholderDetails, {
  validations,
} from "./tabs/stakeholderDetailsAdvance2";
import * as actions from "../../../@redux/action/onboardingAction";
import * as utilities from "./tabs/functions/utility-details-function.js";
import ContentLoader from "react-content-loader";
import { AuthUser } from "./tabs/functions/utility-details-function.js";
import { useDispatch, useSelector } from "react-redux";
import { init, createElement } from "@airwallex/components-sdk";
import { Base64 } from "js-base64";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import {
  setCurrentPage,
  setShowTab,
  setCurrentTab,
} from "../../../@redux/features/onboardingFeatures.js";
import { useNavigate } from "react-router-dom";
import {
  AuthorizeElements,
  CreateAccountAWX,
  GenerateAuthToken,
} from "../../../@redux/action/auth.js";
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
} from "@mui/material";
import CustomInput from "../../structure/NewStructures/CustomInput.js";
import { HashLoader } from "react-spinners";
import Embeded from "./Embedded.js";
import { toast } from "react-toastify";

function dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const [showTab, setShowTab] = useState(0);
  let showTab = useSelector((state) => state.onboarding?.showTab);
  const [progress, setProgress] = useState("0%");

  const [isLoading, setLoading] = useState(true);

  //State variables for pagination
  //const [currentPage, setCurrentPage] = useState(1);
  let currentPage = useSelector((state) => state.onboarding?.currentPage);
  const [totalPages, setTotalPages] = useState(5);

  let UserStatus = useSelector((state) => state.onboarding?.UserStatusObj);
  let UserOnboardingDetails = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails
  );

  var internalBusinessId = useSelector(
    (state) => state.onboarding?.UserStatusObj?.internalBusinessId
  );
  var lastScreenCompleted = useSelector(
    (state) => state.onboarding?.UserStatusObj?.lastScreenCompleted
  );
  var userStatus = useSelector(
    (state) => state.onboarding?.UserStatusObj?.userStatus
  );

  const platform = useSelector((state) => state.common.platform);

  useEffect(() => {
    const Auth = async () => {
      AuthUser();
    };
    Auth();
  }, []);

  const SetPage = async (internalBusinessId, lastScreenCompleted) => {
    setLoading(true);

    var brn = internalBusinessId;
    var lastScreenCompletedNumber = Number(lastScreenCompleted);

    // if (lastScreenCompletedNumber == 1) {
    //   dispatch(actions.GetBusinessCorporationDetails(brn));
    // } else if (lastScreenCompletedNumber == 2) {
    //   dispatch(actions.GetBusinessCorporationDetails(brn));
    //   dispatch(actions.GetAdditionalBusinessCorporationDetails(brn));
    // } else if (lastScreenCompletedNumber == 3) {
    //   dispatch(actions.GetBusinessCorporationDetails(brn));
    //   dispatch(actions.GetAdditionalBusinessCorporationDetails(brn));
    //   dispatch(actions.GetStakeholderDetails(brn));
    // } else if (lastScreenCompletedNumber >= 4) {
    //   dispatch(actions.GetBusinessCorporationDetails(brn));
    //   dispatch(actions.GetAdditionalBusinessCorporationDetails(brn));
    //   dispatch(actions.GetStakeholderDetails(brn));
    //   dispatch(actions.GetApplicantBusinessDetails(brn));
    // }

    const region = sessionStorage.getItem("region");

    //Setting Constant Values for all fields
    dispatch(actions.FetchEnumValues("businessType", region));
    dispatch(actions.FetchEnumValues("listedExchange", region));
    dispatch(actions.FetchEnumValues("totalEmployees", region));
    dispatch(actions.FetchEnumValues("annualTurnover", region));
    dispatch(actions.FetchEnumValues("industrySector", region));
    dispatch(actions.FetchEnumValues("intendedUseOfAccount", region));
    dispatch(actions.FetchEnumValues("position", region));
    dispatch(actions.FetchEnumValues("countryName", region));
    dispatch(actions.FetchEnumValues("unregulatedTrustType", region));
    dispatch(actions.FetchEnumValues("documentType", region));
    dispatch(actions.FetchEnumValues("occupation", region));

    if (region === "EU") {
      dispatch(actions.FetchEnumValues("monthlyTransactionVolume", region));
      dispatch(actions.FetchEnumValues("monthlyTransactions", region));
      dispatch(actions.FetchEnumValues("averageTransactionValue", region));
    }

    setLoading(false);
  };

  useEffect(() => {
    // var internalBusinessId = sessionStorage.getItem("internalBusinessId");
    // var lastScreenCompleted = sessionStorage.getItem("lastScreenCompleted");
    // var userStatus = sessionStorage.getItem("userStatus");

    if (internalBusinessId && lastScreenCompleted && userStatus) {
      var lastScreenCompletedNumber = Number(lastScreenCompleted);

      if (lastScreenCompletedNumber === 1 && userStatus === "N") {
        dispatch(setCurrentPage(2));
        dispatch(setShowTab(1));
      } else if (lastScreenCompletedNumber === 2 && userStatus === "N") {
        dispatch(setCurrentPage(3));
        dispatch(setShowTab(5));
      } else if (lastScreenCompletedNumber === 3 && userStatus === "N") {
        dispatch(setCurrentPage(3));
        dispatch(setShowTab(5));
      } else if (lastScreenCompletedNumber == 4 && userStatus === "N") {
        dispatch(setCurrentPage(4));
        dispatch(setShowTab(3));
      } else if (lastScreenCompletedNumber > 4 && userStatus === "N") {
        dispatch(setCurrentPage(5));
        dispatch(setShowTab(2));
      } else if (lastScreenCompletedNumber === 8 && userStatus === "C") {
        dispatch(setCurrentPage(5));
        dispatch(setShowTab(2));
      } else {
        dispatch(setCurrentPage(1));
        dispatch(setShowTab(0));
      }
    }

    if (platform === "nium") {
      SetPage(internalBusinessId, lastScreenCompleted);
    }
  }, []);

  useEffect(() => {
    dispatch(setCurrentTab(null));
  }, []);

  useEffect(() => {
    if (Number(lastScreenCompleted) === 1) {
      setProgress("20%");
    } else if (Number(lastScreenCompleted) === 2) {
      setProgress("40%");
    } else if (Number(lastScreenCompleted) === 3) {
      setProgress("60%");
    } else if (Number(lastScreenCompleted) === 4) {
      setProgress("80%");
    } else if (Number(lastScreenCompleted) === 8) {
      setProgress("100%");
    } else {
      setProgress("0%");
    }
  }, [lastScreenCompleted]);

  const [email, setEmail] = useState(sessionStorage.getItem("lastemail") || "");
  const [tC, setTC] = useState(false);
  const [dataUsage, setDataUsage] = useState(false);
  const [show, setShow] = useState(false);

  const awxAccountId = useSelector((state) => state.auth.awxAccountId);
  const authToken = useSelector((state) => state.common.authToken);
  const userAttr = useSelector(
    (state) => state.onboarding.UserCognitoDetails?.userAttributes
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        // Case: Everything already exists — nothing to do.
        if (authToken && awxAccountId) {
          setShow(true);
          return;
        } else {
          toast.error(
            "Something went wrong while setting up your environment. Refresh the page and please try again."
          );
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    if (platform === "awx") {
      initialize();
    }
  }, [dispatch]); // Runs only once on mount

  if (isLoading) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Business Details",
            img: "/accounts/accounts.svg",
            backurl: "/dashboard",
          }}
        />

        <div
          className="d-flex justify-content-center align-items-center flex-column w-100 gap-5"
          style={{ height: "80vh" }}
        >
          <CircularProgress size={`5rem`} sx={{ color: "orange" }} />
          <label htmlFor="">
            Please wait while we're setting up your environment...
          </label>
        </div>
      </>
    );
  }

  return (
    <>
      <BreadCrumbs
        data={{
          name: "Business Details",
          img: "/accounts/accounts.svg",
          backurl: "/dashboard",
        }}
      />
      {platform === "nium" ? (
        <div className={`navigationsub-parent`} style={{ background: "white" }}>
          <>
            <div
              className="noticetextprogress-parent"
              style={{ width: "100%" }}
            >
              <div className="noticetextprogress1" style={{ width: "100%" }}>
                <img
                  className="file-zip-icon"
                  alt=""
                  src="/onboarding/lock_1.svg"
                />
                <div className="status1">
                  <div className="add-details-to1">
                    Add details to complete account activation
                  </div>
                  <div className="progress1">
                    <div className="div6" />
                    <div
                      className="div7"
                      id="div7"
                      style={{ width: `${progress}` }}
                    />
                    <div className="div8" />
                    <div className="div9" />
                    <div className="div10" />
                    <div className="div11" />
                  </div>
                </div>
              </div>
              <div className="tabs" style={{}}>
                {/* General Details */}
                <button
                  className={showTab == 0 ? "tab" : "tab1"}
                  onClick={() => {
                    dispatch(setCurrentPage(1));
                    dispatch(setShowTab(0));
                  }}
                  id="generalDetailsBtn"
                >
                  <img
                    className="icon6"
                    alt=""
                    src={
                      showTab == 0
                        ? "/onboarding/tabs/select_tab1.svg"
                        : "/onboarding/tabs/tab1.svg"
                    }
                  />
                  <div className={showTab == 0 ? "label34" : "label4"}>
                    General
                  </div>
                </button>

                {/* Business Details */}
                <button
                  className={showTab == 1 ? "tab" : "tab1"}
                  onClick={() => {
                    dispatch(setCurrentPage(2));
                    dispatch(setShowTab(1));
                  }}
                  id="businessDetailsBtn"
                >
                  <img
                    className="icon6"
                    alt=""
                    src={
                      showTab == 1
                        ? "/onboarding/tabs/select_tab2.svg"
                        : "/onboarding/tabs/tab2.svg"
                    }
                  />
                  <div className={showTab == 1 ? "label34" : "label4"}>
                    Business Details
                  </div>
                </button>

                {/* Stakeholder Details */}
                <button
                  className={showTab == 5 ? "tab" : "tab1"}
                  onClick={() => {
                    dispatch(setCurrentPage(3));
                    dispatch(setShowTab(5));
                  }}
                  id="stakeholderDetailsBtn"
                >
                  <img
                    className="icon6"
                    alt=""
                    src={
                      showTab == 5
                        ? "/onboarding/tabs/select_tab3.svg"
                        : "/onboarding/tabs/tab3.svg"
                    }
                  />
                  <div className={showTab == 5 ? "label34" : "label4"}>
                    Stakeholder Details
                  </div>
                </button>

                {/* Applicant Details */}
                <button
                  className={showTab == 3 ? "tab" : "tab1"}
                  onClick={() => {
                    dispatch(setCurrentPage(4));
                    dispatch(setShowTab(3));
                  }}
                  id="applicantDetailsBtn"
                >
                  <img
                    className="icon6"
                    alt=""
                    src={
                      showTab == 3
                        ? "/onboarding/tabs/select_tab4.svg"
                        : "/onboarding/tabs/tab4.svg"
                    }
                  />
                  <div className={showTab == 3 ? "label34" : "label4"}>
                    Applicant Details
                  </div>
                </button>

                {/* KYB Details */}
                <button
                  className={showTab == 2 ? "tab" : "tab1"}
                  onClick={() => {
                    dispatch(setCurrentPage(5));
                    dispatch(setShowTab(2));
                  }}
                  id="KYBDetailsBtn"
                >
                  <img
                    className="icon6"
                    alt=""
                    src={
                      showTab == 2
                        ? "/onboarding/tabs/select_tab3.svg"
                        : "/onboarding/tabs/tab3.svg"
                    }
                  />
                  <div className={showTab == 2 ? "label34" : "label4"}>
                    KYB Details
                  </div>
                </button>
              </div>

              {showTab === 0 ? (
                <General />
              ) : showTab == 1 ? (
                <BusinessDetails />
              ) : showTab == 2 ? (
                <KybDetails />
              ) : showTab == 3 ? (
                <ApplicantDetails />
              ) : (
                <StakeholderDetails />
              )}

              {/* {Number(lastScreenCompleted) > 4 && userStatus === "N" ? (
              <>
                <div className="hr mt-5"></div>

                <>
                  <div className="reinitiate-kyc my-3 d-flex align-items-center">
                    <img className="me-2" alt="" src="/info-2.svg" width={30} />
                    It looks like your onboarding process was somehow
                    interrupted. To ensure a smooth experience, please finish
                    your onboarding process by
                    <a href="#!" onClick={handleReintiateKyc} className="mx-1">
                      Clicking here
                    </a>{" "}
                    📝.
                  </div>
                </>
              </>
            ) : (
              <></>
            )} */}
            </div>
          </>
        </div>
      ) : (
        <div className="d-flex justify-content-between align-items-start bg-white p-4 gap-4">
          {show && (
            <Card
              className="p-3 border rounded-4"
              style={{ width: "100%", borderRadius: 15 }}
            >
              <Embeded setLoading={setLoading} />
            </Card>
          )}
        </div>
      )}
    </>
  );
}

export default dashboard;
