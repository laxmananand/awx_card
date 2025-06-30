import React, { useState, useEffect } from "react";
import "./dashboard-header.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  setCurrentPage,
  setShowTab,
} from "../@redux/features/onboardingFeatures";
import { useDispatch } from "react-redux";
import { Modal, Box } from "@mui/material";
import { ChevronRight, Close } from "@mui/icons-material";

export const DashboardHeader = ({
  complianceStatus,
  subStatus,
  setShowHeader,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState("inactive");
  const contactName = useSelector((state) => state?.onboarding?.contactName);
  const userStatusObj = useSelector(
    (state) => state?.onboarding?.UserStatusObj
  );
  const userOnboardingDetails = useSelector(
    (state) => state?.onboarding?.UserOnboardingDetails
  );

  const platform = useSelector((state) => state.common.platform);

  useEffect(() => {
    if (complianceStatus && complianceStatus === "COMPLETED") {
      if (subStatus) {
        setSubscription(subStatus);
      }
    }
  }, [subStatus, subscription, complianceStatus, userStatusObj]);

  const moveToOnboarding = () => {
    if (location.pathname === "/onboarding/Home") {
      dispatch(setCurrentPage(1));
      dispatch(setShowTab(0));
    } else {
      navigate("/onboarding/Home");
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dashboardLoading = useSelector((state) => state.auth?.dashboardLoading);
  const expanded = useSelector((state) => state.common.expanded);

  const rfiDetails = useSelector((state) => state.onboarding.rfiDetails);
  let typeStatusPairs = null;
  let allClosed = null;

  useEffect(() => {
    if (rfiDetails && rfiDetails.length > 0) {
      // Get all { type, status } pairs
      typeStatusPairs = rfiDetails.map((item) => ({
        type: item.type,
        status: item.status,
      }));

      // Check if every status is CLOSED
      allClosed = typeStatusPairs.every((entry) => entry.status === "CLOSED");

      console.log("All RFIs closed?", allClosed);
      console.log("Types and statuses:", typeStatusPairs);
    }
  }, [rfiDetails]);

  return (
    <>
      <div
        className=""
        style={{
          pointerEvents: dashboardLoading ? "none" : "auto",
          opacity: dashboardLoading ? 0.5 : 1,
          minWidth: "100%",
          height: 40,
          background: "#327E9D",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 5000,
        }}
      >
        <div
          className="add-account d-flex align-items-center justify-content-between px-2"
          style={{ height: 40 }}
        >
          <div style={{ width: "10%" }}></div>

          <div
            style={{
              fontSize: 12,
              color: "white",
              fontWeight: 500,
            }}
          >
            {complianceStatus === "IN_PROGRESS" ? (
              <>
                {contactName
                  ? `Congrats ${
                      contactName?.split(" ")[0]
                    }! Application submitted.`
                  : "Congratulations! Application submitted."}
                <a
                  href="#!"
                  onClick={moveToOnboarding}
                  style={{ marginLeft: "5px" }}
                >
                  {" "}
                  Complete Your KYC Now
                </a>
                {", To Unlock The Full Potential Of Zoqq."}
              </>
            ) : complianceStatus === "ACTION_REQUIRED" ? (
              <>
                {contactName
                  ? `Congrats ${
                      contactName?.split(" ")[0]
                    }! Your application is submitted and
              currently under review by our compliance team. Kindly await further updates.`
                  : `Congrats! Your application is submitted and
              currently under review by our compliance team. Kindly await further updates.`}
              </>
            ) : complianceStatus == "RFI_REQUESTED" ? (
              <>
                Please provide some more information for additional
                verification.
                <a
                  style={{ marginLeft: "5px" }}
                  href="/onboarding/rfi"
                  className="mx-1"
                >
                  Check Details
                </a>
              </>
            ) : complianceStatus == "COMPLETED" ? (
              <>
                {subscription === "inactive" ? (
                  <>
                    Unlock Seamless Payments,
                    <a
                      style={{ marginLeft: "5px" }}
                      href="/settings/subscription"
                      className="mx-1"
                    >
                      Subscribe Now
                    </a>
                    and Explore Limitless Possibilities!
                  </>
                ) : subscription === "canceled" ? (
                  <>
                    Your Zoqq subscription has been canceled. Please
                    <a href="/settings/subscription" className="mx-1">
                      RESUBSCRIBE
                    </a>
                    to continue using our services.
                  </>
                ) : subscription === "active" ? (
                  <></>
                ) : (
                  <>
                    Unlock Seamless Payments,
                    <a
                      style={{ marginLeft: "5px" }}
                      href="/settings/subscription"
                      className="mx-1"
                    >
                      Subscribe Now
                    </a>
                    and Explore Limitless Possibilities!
                  </>
                )}

                {platform === "awx" ? (
                  <>
                    We need a bit more information to continue. Based on your
                    recent activity, some additional verification is required to
                    move forward.
                    <a
                      style={{ marginLeft: "5px" }}
                      href="/onboarding/rfi"
                      className="mx-1"
                    >
                      Check Details
                    </a>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : complianceStatus == "RFI_RESPONDED" ? (
              <>
                Your response to the RFI has been received. Kindly await further
                updates.
                <a style={{ marginLeft: "5px" }} href="/onboarding/rfi">
                  Check Details
                </a>
              </>
            ) : complianceStatus == "ERROR" ? (
              <>
                Whoops! It seems there's a slight hiccup. Some details need a
                second look.
                {platform === "nium" && (
                  <a
                    style={{ marginLeft: "5px" }}
                    href="#!"
                    onClick={moveToOnboarding}
                    className="mx-2"
                  >
                    {" "}
                    Head back to the onboarding form and fix those hiccups?
                  </a>
                )}
              </>
            ) : complianceStatus == "REJECT" ? (
              <>
                Your submission has been rejected.
                {platform === "nium" ? (
                  <>
                    <a
                      style={{ marginLeft: "5px" }}
                      href="#!"
                      onClick={moveToOnboarding}
                      className="mx-2"
                    >
                      {" "}
                      Please review
                    </a>{" "}
                    and address the issues before resubmitting.
                  </>
                ) : (
                  <> Please contact to Zooq Support.</>
                )}
              </>
            ) : complianceStatus === "INITIATED" ? (
              <>
                {contactName
                  ? `Congrats ${
                      contactName?.split(" ")[0]
                    }! Your account verification process has been initiated. Please await further updates on your compliance process.`
                  : "Congratulations! Your account verification process has been initiated. Please await further updates on your compliance process."}
                {platform === "nium" && (
                  <a
                    style={{ marginLeft: "5px" }}
                    href="#!"
                    onClick={moveToOnboarding}
                  >
                    Check Account Details
                  </a>
                )}
              </>
            ) : (
              <>
                {(userStatusObj?.lastScreenCompleted === "8" &&
                  userStatusObj?.userStatus === "F") ||
                userStatusObj?.userStatus === "P" ? (
                  <>
                    Your application has been initiated and is currently under
                    review. We will notify you with further updates.{" "}
                  </>
                ) : (
                  <>
                    Maximize your experience!{" "}
                    <a
                      style={{ marginLeft: "5px" }}
                      href="#!"
                      onClick={moveToOnboarding}
                    >
                      Activate your account
                    </a>{" "}
                    and unlock all features by adding your business details.
                  </>
                )}
              </>
            )}

            <ChevronRight sx={{ fontSize: 18 }} />
          </div>
          <Close
            sx={{
              fontSize: 24,
              opacity: 0.75,
              cursor: "pointer",
            }}
            onClick={() => setShowHeader(false)}
          />
        </div>
      </div>

      <StatusModal
        open={open}
        handleClose={handleClose}
        obj={userOnboardingDetails}
        moveToOnboarding={moveToOnboarding}
      />
    </>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 850,
  maxHeight: 650,
  overflowY: "auto",
  bgcolor: "#fff",
  borderRadius: "24px",
  boxShadow: 24,
  p: "10px 32px 32px 32px",
};

export const StatusModal = ({ open, handleClose, obj, moveToOnboarding }) => {
  let transactionType = [
    {
      status: "SCHEDULED",
      statusDetails: `${obj?.failedReason}.`,
      // lastUpdatedAt: "2023-11-09 11:43:01",
    },
    {
      status: "IN_PROGRESS",
      statusDetails:
        "Application has been accepted and is under-review by our compliance.",
      // lastUpdatedAt: "2023-11-09 11:43:01",
    },
    {
      status: "INITIATED",
      statusDetails: "Application has been submitted by user.",
      // lastUpdatedAt: "2023-11-09 11:43:24",
    },
  ];

  const transactionStatusTitles = {
    INITIATED: "Application Submitted",
    IN_PROGRESS: "Application Under Review",
    SCHEDULED: "Request For Information",
  };

  const color = {
    COMPLIANCE_PROCESSING: "bg-warning",
    IN_PROGRESS: "bg-warning",
    AWAITING_FUNDS: "bg-warning",
    SCHEDULED: "bg-info",
    CANCELLED: "bg-danger",
    DECLINED: "bg-danger",
    APPROVED: "bg-success",
    ACTION_REQUIRED: "bg-danger",
    COMPLIANCE_RFI_REQUESTED: "bg-danger",
    COMPLIANCE_RFI_RESPONDED: "bg-info",
    COMPLIANCE_REJECTED: "bg-danger",
    COMPLIANCE_COMPLETED: "bg-success",
    PG_PROCESSING: "bg-warning",
    ERROR: "bg-danger",
    SENT_TO_BANK: "bg-success",
    PAID: "bg-success",
    RETURN: "bg-danger",
    EXPIRED: "bg-danger",
  };

  const [reverseList, setReverseList] = useState([]);

  useEffect(() => {
    // Reverse the transactionType array and set it once
    const reversedTransactionList = [...transactionType].reverse();
    setReverseList(reversedTransactionList);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <>
          <div className="pb-5 flex-wrap w-100 d-flex justify-content-between align-items-center">
            <h3 className=" px-0 mt-2">Onboarding Process: </h3>
            <h3 onClick={() => handleClose()}>X</h3>
          </div>

          <section className="w-100">
            <div className="timeline position-relative my-auto w-100 my-5">
              {reverseList?.map((step, key) => (
                <div
                  key={key}
                  className={
                    "timeline-container px-5 position-relative w-50 " +
                    (key % 2 == 1 ? "left-container" : "right-container")
                  }
                >
                  <img
                    src="/timeline.svg"
                    className={
                      "position-absolute rounded-circle timeline_img " +
                      (color[step?.status] || "bg-green")
                    }
                    width="30px"
                  />
                  <div
                    className={`text-box px-3 py-2 position-relative rounded-4 py-3 
                      ${color[step?.status] || "bg-green"} ${
                      step?.status === "IN_PROGRESS"
                        ? "text-dark"
                        : step?.status === "SCHEDULED"
                        ? "text-dark"
                        : "text-white"
                    }`}
                  >
                    <h5 className="mb-3">
                      {transactionStatusTitles[step?.status]}
                    </h5>

                    <p
                      className="m-0 d-flex flex-column gap-3"
                      style={{ fontSize: "14px" }}
                    >
                      {step?.statusDetails}

                      {step?.status === "SCHEDULED" ? (
                        <>
                          <span
                            onClick={() => {
                              handleClose();
                              moveToOnboarding();
                            }}
                            style={{
                              textDecoration: "underline",
                              marginRight: "5px",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              fontSize: "13px",
                            }}
                          >
                            Check application details ➜
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      </Box>
    </Modal>
  );
};

export default DashboardHeader;
