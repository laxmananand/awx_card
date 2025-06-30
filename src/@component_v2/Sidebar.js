import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../components/Signup/js/logout-function.js";
import { useDispatch } from "react-redux";
import { setCurrentTab } from "../@redux/features/onboardingFeatures.js";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const styleMenu = {
  position: "absolute",
  top: "7%",
  bgcolor: "background.paper",
  p: "10px 15px",
  borderRadius: "15px",
};

const styleProfile = {
  position: "absolute",
  top: "7%",
  bgcolor: "background.paper",
  p: "10px 15px",
  borderRadius: "15px",
  right: 0,
};

function Sidebar() {
  const currentTab = useSelector((state) => state.onboarding?.currentTab);
  const dispatch = useDispatch();
  const [padding, setPadding] = useState("65px 15px");
  const navigate = useNavigate();
  const showSidebar = useSelector((state) => state.auth.showSidebar);
  const userStatus = sessionStorage.getItem("userStatus");
  const complianceStatus = sessionStorage.getItem("complianceStatus");
  const subStatus = useSelector((state) => state.subscription?.data?.status);

  const logo = useSelector((state) => state.settings?.branding?.logoUrl);
  
   const [region, setRegion] = useState(sessionStorage.getItem("region"));
  
  const navLinks = [
    { label: "Dashboard", icon: "dashboard.svg", url: "/dashboard" },
    { label: "Accounts", icon: "accounts.svg", url: "/accounts" },
    { label: "Transactions", icon: "payments.svg", url: "/transactions" },
    { label: "Cards", icon: "card.svg", url: "/cards" },
    { label: "Settings", icon: "settings.svg", url: "/settings" },
  ];

// rendering card conditionally 

  const profileIndex = navLinks.findIndex(link => link.label === "Profile");

  if (region.toLowerCase() === "sg" || region.toLowerCase() === "us") {
    navLinks.splice(profileIndex, 0, { label: "Cards", icon: "card.svg", url: "/expense/corporate-cards" });
}

  const navLinks2 = [
    { label: "Profile", icon: "/sidebar/profile_new.svg", url: "/profile" },
    { label: "Logout", icon: "/v2/sidebar/logout.svg" },
  ];

  const [openMenu, setOpenMenu] = useState(false);
  const handleOpenMenu = () => setOpenMenu(true);
  const handleCloseMenu = () => {
    setShowHamburger(true);
    setOpenMenu(false);
  };

  const [openProfile, setOpenProfile] = useState(false);
  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);

  if (!showSidebar) {
    return <></>;
  }

  useEffect(() => {
    if (userStatus === "C") {
      if (complianceStatus === "COMPLETED") {
        if (subStatus) {
          if (subStatus !== "inactive") {
            setPadding("30px 15px");
          }
        } else {
        }
      }
    }
  }, [userStatus, complianceStatus]);

  useEffect(() => {
    console.log("currentTab", currentTab);
  }, [currentTab]);

  const [showHamburger, setShowHamburger] = useState(true);

  const dashboardLoading = useSelector((state) => state.auth?.dashboardLoading);

  return (
    <>
      <nav
        id="collapsable_nav"
        className="border d-flex justify-content-between flex-column shadow bg-primary-50"
        style={{
          zIndex: "9",
          padding: padding,
          pointerEvents: dashboardLoading ? "none" : "auto",
          opacity: dashboardLoading ? 0.5 : 1,
        }}
      >
        <div>
          <img id="logo" src={"/logo-zoqq-final01-1.svg"} width={86} />
        </div>

        <ul
          className="p-0 d-flex flex-column flex-fill my-5"
          style={{
            listStyle: "none",
          }}
        >
          {navLinks?.map((item) => (
            <li
              onClick={() => {
                navigate(item?.url);
                dispatch(setCurrentTab(item?.label));
              }}
              key={item?.label}
              className={
                "d-flex align-items-center cursor-pointer rounded-pill" +
                (currentTab === item?.label ? " nav-active" : "")
              }
            >
              <img src={"/v2/sidebar/" + item.icon} width={30} />
              <p style={{ whiteSpace: "nowrap" }} className="m-0 p-0">
                {item?.label}
              </p>
            </li>
          ))}
        </ul>

        <ul className="p-0 d-flex flex-column" style={{ listStyle: "none" }}>
          <li
            className="d-flex align-items-center cursor-pointer rounded-pill"
            onClick={() => {
              logout();
            }}
          >
            <img src="/v2/sidebar/logout.svg" width={30} />
            <p style={{ whiteSpace: "nowrap" }} className="m-0 p-0">
              Log Out
            </p>
          </li>
        </ul>
      </nav>

      <div
        id="mobile_navbar"
        className="bg-primary-50 justify-content-between px-3 py-2"
      >
        <div className="d-flex align-items-center gap-2">
          {showHamburger ? (
            <img
              src="/sidebar/hamburger.svg"
              alt=""
              width={40}
              onClick={() => {
                handleOpenMenu();
                setShowHamburger(!showHamburger);
              }}
            />
          ) : (
            <img
              src="/sidebar/cross.svg"
              alt=""
              width={40}
              onClick={() => {
                handleCloseMenu();
                setShowHamburger(!showHamburger);
              }}
            />
          )}

          <img
            src="/sidebar/profile_new.svg"
            alt=""
            width={40}
            onClick={() => handleOpenProfile()}
          />
        </div>

        <img
          src="/sidebar/profile_new.svg"
          alt=""
          width={40}
          onClick={() => handleOpenProfile()}
        />
      </div>

      <Modal
        open={openMenu}
        onClose={handleCloseMenu}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleMenu} className="bg-primary-50">
          <ul
            style={{ listStyle: "none", padding: "0" }}
            className="bg-primary-50 mb-0"
          >
            {navLinks?.map((item) => (
              <li
                onClick={() => {
                  navigate(item?.url);
                  dispatch(setCurrentTab(item?.label));
                  handleCloseMenu();
                }}
                key={item?.label}
                className={
                  "d-flex align-items-center cursor-pointer rounded-pill p-2 px-4 gap-2 my-3" +
                  (currentTab === item?.label ? " nav-active" : "")
                }
                style={{ transform: "scale(1)" }}
              >
                <img src={"/v2/sidebar/" + item.icon} width={25} />
                <p style={{ whiteSpace: "nowrap" }} className="m-0 p-0">
                  {item?.label}
                </p>
              </li>
            ))}
          </ul>
        </Box>
      </Modal>

      <Modal
        open={openProfile}
        onClose={handleCloseProfile}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleProfile} className="bg-primary-50">
          <ul
            style={{ listStyle: "none", padding: "0" }}
            className="bg-primary-50 mb-0"
          >
            {navLinks2?.map((item) => (
              <li
                onClick={() => {
                  if (item.label === "Profile") {
                    document.getElementById("profileOpen").click();
                    handleCloseProfile();
                  } else {
                    logout();
                  }
                }}
                key={item?.label}
                className={
                  "d-flex align-items-center cursor-pointer rounded-pill p-2 px-4 gap-2 my-3" +
                  (item?.label === "Profile" ? " nav-active" : "")
                }
                style={{ transform: "scale(1)" }}
              >
                <img src={item.icon} width={25} />
                <p style={{ whiteSpace: "nowrap" }} className="m-0 p-0">
                  {item?.label}
                </p>
              </li>
            ))}
          </ul>
        </Box>
      </Modal>
    </>
  );
}

export default Sidebar;
