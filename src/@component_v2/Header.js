import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomModal from "../components/structure/NewStructures/CustomModal";
import Profile from "./NewProfile";
import Notification from "../components/dashboard/modals/NotificationModal";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setShowTab,
} from "../@redux/features/onboardingFeatures";
import { AccountCircle, AccountCircleOutlined } from "@mui/icons-material";

function Header() {
  const [contactName, setContactName] = useState("User");
  const [contactNameInitials, setContactNameInitials] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let name = sessionStorage.getItem("contactName");

    if (name) {
      let firstName = name.split(" ");
      setContactName(firstName[0]);

      let initials = name
        .trim() // Trim leading and trailing spaces
        .split(/\s+/) // Split the name by one or more spaces
        .filter((word) => word) // Filter out empty strings
        .map((word) => word[0]) // Map each word to its first letter
        .join("") // Join the initials back into a single string
        .toUpperCase(); // Convert the initials to uppercase

      setContactNameInitials(initials);
    }
  }, []);

  const GoToProfile = () => {
    navigate("/profile");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [bgColor, setBgColor] = useState("white");
  const [borderColor, setBorderColor] = useState("darkgrey");
  const [img, setImg] = useState("/v2/header/notification.svg");
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [buttonRef, setButtonRef] = useState(null);

  const openNotificationBox = () => {
    // Toggle background color
    setBgColor((prevColor) =>
      prevColor === "white" ? "var(--sea-70)" : "white"
    );

    setBorderColor((prevColor) =>
      prevColor === "darkgrey" ? "var(--sea-70)" : "darkgrey"
    );

    // Toggle image source
    setImg((prevImg) =>
      prevImg === "/v2/header/notification.svg"
        ? "/v2/header/notification2.svg"
        : "/v2/header/notification.svg"
    );

    // Store the button reference for positioning the notification box
    setButtonRef(document.getElementById("notificationButton"));
    handleNotificationClick();
  };

  const handleNotificationClick = () => {
    // Generate some random text samples for notifications
    const randomNotifications = JSON.stringify([
      {
        message: "Congratulations, new HKD bank account added!",
        timestamp: "Today at 5:48 PM",
        isNew: true,
      },
      {
        message: "Congratulations, new USD bank account added!",
        timestamp: "Today at 12:48 PM",
        isNew: true,
      },
      {
        message: "Your recent transaction has been fulfilled",
        timestamp: "Today at 11:30 AM",
        isNew: true,
      },
      {
        message: "Congratulations, new SGD bank account added!",
        timestamp: "Yesterday at 1:45 PM",
        isNew: false,
      },
      {
        message: "Your account has been activated.",
        timestamp: "Yesterday at 6:00 PM",
        isNew: false,
      },
      {
        message: "Your account status is Pending.",
        timestamp: "Yesterday at 2:00 PM",
        isNew: false,
      },
    ]);
    setNotifications(randomNotifications);
    setIsNotificationOpen(!isNotificationOpen);
  };

  const closeNotification = () => {
    setIsNotificationOpen(false);
  };

  const [showProgress, setShowProgress] = useState(false);
  const [failedReason, setFailedReason] = useState("");
  let userStatusObj = useSelector((state) => state.onboarding?.UserStatusObj);
  let userOnboardingDetails = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails
  );
  useEffect(() => {
    if (
      userStatusObj?.lastScreenCompleted === "8" &&
      userStatusObj?.userStatus === "F"
    ) {
      setShowProgress(true);
      setFailedReason(userOnboardingDetails?.failedReason);
    }
  }, [userStatusObj, userOnboardingDetails]);

  const dispatch = useDispatch();

  const moveToOnboarding = () => {
    if (location.pathname === "/onboarding/Home") {
      dispatch(setCurrentPage(1));
      dispatch(setShowTab(0));
    } else {
      navigate("/onboarding/Home");
    }
  };

  return (
    <>
      {showProgress ? (
        <>
          <div className="mt-1 mb-5 border shadow rounded-5 pt-4 pb-5">
            <h4 className="ps-5 pb-3">Application Status:</h4>
            <div className="progress-notification d-flex justify-content-center align-items-center">
              <div className="progress-line start submitted"></div>
              <div className="progress-circle play">
                <img src="/progress-bar/start.svg" alt="" width="30" />
              </div>
              <div className="progress-line submitted"></div>
              <div className="progress-circle question">
                <img src="/progress-bar/question.svg" alt="" width="30" />
              </div>
              <div className="progress-line submitted"></div>
              <div className="progress-circle info">
                <img src="/progress-bar/info.svg" alt="" width="30" />
              </div>
              <div className="progress-line"></div>
              <div className="progress-circle tick">
                <img
                  src="/progress-bar/tick.svg"
                  alt=""
                  width="30"
                  style={{
                    visibility:
                      userStatusObj?.lastScreenCompleted === "8" &&
                      userStatusObj?.userStatus === "F"
                        ? "hidden"
                        : "visible",
                  }}
                />
              </div>
              <div className="progress-line end"></div>
            </div>
            <div className="progress-status d-flex justify-content-between align-items-start">
              <span
                className="fw-bold d-flex flex-column gap-2 align-items-center"
                style={{ color: "darkblue", width: "205px" }}
              >
                Initiated
                <span className="progress-text-desc invisible">
                  Your application has been initiated.
                </span>
              </span>
              <span
                className="fw-bold d-flex flex-column gap-2 align-items-center"
                style={{ color: "purple", width: "205px" }}
              >
                Under Review
                <span className="progress-text-desc invisible">
                  Your application has been initiated.
                </span>
              </span>
              <span
                className="fw-bold d-flex flex-column gap-2 align-items-center"
                style={{ color: "#3b71ca", width: "205px" }}
              >
                Information Required
                <span className="progress-text-desc progress-text-desc d-flex flex-column gap-4">
                  {failedReason}{" "}
                  {userOnboardingDetails?.failedReason ===
                  "Your update request has been processed successfully, and your KYC process has been re-initiated. We apologize for the inconvenience. Please wait for further updates." ? (
                    <></>
                  ) : (
                    <>
                      <a
                        href="#!"
                        className="fw-600"
                        onClick={() => moveToOnboarding()}
                      >
                        Check onboarding details →
                      </a>
                    </>
                  )}
                </span>
              </span>
              <span
                className="fw-bold d-flex flex-column gap-2 align-items-center"
                style={{ color: "forestgreen", width: "205px" }}
              >
                Approved
                <span className="progress-text-desc invisible">
                  Your application has been initiated.
                </span>
              </span>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      <div
        className="d-flex justify-content-between align-items-center dashboard-header mb-4"
        style={{ height: 48 }}
      >
        <h4 className="m-0 p-0 fw-600">Hello, {contactName}!</h4>

        <div className="header-img-div">
          <AccountCircle
            onClick={handleOpenModal}
            sx={{ fontSize: 40, cursor: "pointer" }}
            className="text-secondary"
          />
        </div>

        <CustomModal
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          children={<Profile close={handleCloseModal} />}
          headerText="Your Profile Details"
        />

        {isNotificationOpen && (
          <Notification
            notifications={notifications}
            onClose={closeNotification}
            buttonRef={buttonRef} // Pass the button reference to the Notification component
          />
        )}
      </div>
    </>
  );
}

export default Header;
