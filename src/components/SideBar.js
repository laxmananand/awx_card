import React, { useDebugValue, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { AiOutlineControl } from "react-icons/ai";
import { LiaUsersCogSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideBar } from "../@redux/features/common";
import { logout } from "./Signup/js/logout-function";

function SideBar() {
  return <></>
  const [Username, setUsername] = useState("Username");
  useEffect(() => {
    const onSave = () => {
      const root = document.documentElement;
      const rootStyles = root?.style;
      const style = localStorage.getItem("style");
      if (Boolean(style)) {
        const colour = JSON.parse(style);

        if (colour?.main) rootStyles?.setProperty("--main-color", colour?.main); // Modify the value of a CSS variable
        if (colour?.primary) rootStyles?.setProperty("--primary-color-100", colour?.primary); // Modify the value of a CSS variable
        if (colour?.primaryB) rootStyles?.setProperty("--primary-color-10", colour?.primaryB); // Modify the value of a CSS variable
        if (colour?.secondary) rootStyles?.setProperty("--secondary-color-100", colour?.secondary); // Modify the value of a CSS variable
        if (colour?.secondaryB) rootStyles?.setProperty("--secondary-color-10", colour?.secondaryB); // Modify the value of a CSS variable
        if (colour?.tertiary) rootStyles?.setProperty("--tertiary-color-100", colour?.tertiary); // Modify the value of a CSS variable
        if (colour?.tertiaryB) rootStyles?.setProperty("--tertiary-color-10", colour?.tertiaryB); // Modify the value of a CSS variable
        if (colour?.color0) rootStyles?.setProperty("--color-0", colour?.color0); // Modify the value of a CSS variable
        if (colour?.color25) rootStyles?.setProperty("--color-25", colour?.color25); // Modify the value of a CSS variable
        if (colour?.color50) rootStyles?.setProperty("--color-50", colour?.color50); // Modify the value of a CSS variable
        if (colour?.color75) rootStyles?.setProperty("--color-75", colour?.color75); // Modify the value of a CSS variable
        if (colour?.color100) rootStyles?.setProperty("--color-100", colour?.color100); // Modify the value of a CSS variable
        if (colour?.font) rootStyles?.setProperty("--font", colour?.font); // Modify the value of a CSS variable
      }
    };

    var contactName = sessionStorage.getItem("contactName");
    if (contactName) {
      setUsername(contactName?.split(" ")[0]);
    }
    onSave();
  }, []);

  const [logo, setLogo] = useState("/logo.svg");

  useEffect(() => {
    const img = localStorage.getItem("logo");
    if (img) setLogo(img);
  }, [localStorage.getItem("logo")]);

  useEffect(() => {
    const brandName = localStorage.getItem("brandName");
    if (brandName) document.title = brandName;
  }, [localStorage.getItem("brandName")]);

  const isHide = useSelector((state) => state.common.isSideBarClose);
  const dispatch = useDispatch();

  const setIsHide = () => {};
  const [url, setUrl] = useState("");
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    if (pathname.endsWith("/")) {
      const newPathname = pathname.slice(0, -1);
      setUrl(newPathname);
    } else {
      setUrl(pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    const accountsButton = document.getElementById("accounts-collapse");
    const paymentsButton = document.getElementById("payments-collapse");
    const expenseButton = document.getElementById("expense-collapse");
    const settingsButton = document.getElementById("settings-collapse");
    const accessControlButton = document.getElementById("access-control-collapse");

    if (accountsButton) {
      if (url.startsWith("/accounts")) {
        accountsButton.classList.add("show");
        handleIconClick("accounts", true);
      } else {
        accountsButton.classList.remove("show");
      }
    }
    if (paymentsButton) {
      if (url.startsWith("/payments")) {
        paymentsButton.classList.add("show");
        handleIconClick("payments", true);
      } else {
        paymentsButton.classList.remove("show");
      }
    }
    if (expenseButton) {
      if (url.startsWith("/expense")) {
        expenseButton.classList.add("show");
        handleIconClick("expense", true);
      } else {
        expenseButton.classList.remove("show");
      }
    }
    if (settingsButton) {
      if (url.startsWith("/settings")) {
        settingsButton.classList.add("show");
        handleIconClick("settings", true);
      } else {
        settingsButton.classList.remove("show");
      }
    }
    if (accessControlButton) {
      if (url.startsWith("/access-control")) {
        accessControlButton.classList.add("show");
        handleIconClick("access-control", true);
      } else {
        accessControlButton.classList.remove("show");
      }
    }
  }, [url]);

  const [isRotatedAccounts, setIsRotatedAccounts] = useState(false);
  const [isRotatedPayments, setIsRotatedPayments] = useState(false);
  const [isRotatedExpense, setIsRotatedExpense] = useState(false);
  const [isRotatedSettings, setIsRotatedSettings] = useState(false);
  const [isRotatedAccessControl, setIsRotatedAccessControl] = useState(false);

  const handleIconClick = (type, prevState) => {
    if (type === "accounts") {
      setIsRotatedAccounts(prevState);
      setIsRotatedPayments(false);
      setIsRotatedExpense(false);
      setIsRotatedSettings(false);
      setIsRotatedAccessControl(false);
    } else if (type === "payments") {
      setIsRotatedAccounts(false);
      setIsRotatedPayments(prevState);
      setIsRotatedExpense(false);
      setIsRotatedSettings(false);
      setIsRotatedAccessControl(false);
    } else if (type === "expense") {
      setIsRotatedAccounts(false);
      setIsRotatedPayments(false);
      setIsRotatedExpense(prevState);
      setIsRotatedSettings(false);
      setIsRotatedAccessControl(false);
    } else if (type === "settings") {
      setIsRotatedAccounts(false);
      setIsRotatedPayments(false);
      setIsRotatedExpense(false);
      setIsRotatedSettings(prevState);
      setIsRotatedAccessControl(false);
    } else if (type === "access-control") {
      setIsRotatedAccounts(false);
      setIsRotatedPayments(false);
      setIsRotatedExpense(false);
      setIsRotatedSettings(false);
      setIsRotatedAccessControl(prevState);
    }
  };
  //const shouldHide=false;
  const thirdElementSessionValue = sessionStorage.getItem("registerdCountry");
  const thirdElementSessionValue2 = sessionStorage.getItem("countryCodeCognito");
  const shouldHide = thirdElementSessionValue !== "SG" && thirdElementSessionValue2 !== "SG";

  return (
    <nav
      className="d-flex bg-green flex-column justify-content-between flex-start px-3 flex-1"
      style={{ height: "100vh", minWidth: isHide ? "" : "30vb" }}
      id="sidebar"
    >
      <ul className="p-0 list-unstyled accordion overflow-auto flex-fill" id="sidebarAccordion">
        <Link to="/dashboard" className="d-inline-block my-4">
          <img alt="" id="logo" src={logo} width={isHide ? "64" : "100"} />
        </Link>
        <div className="bg-gainsboro my-1" style={{ height: "0.06rem" }} />
        <li className="bg-white rounded-4 my-3">
          <Link
            to="/dashboard"
            className={
              (url === "/dashboard" ? "opacity-75 fw-bolder " : "") +
              "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
              (isHide ? "center" : "start")
            }
          >
            <img className="" alt="" src="/sidebar/dashboard.svg" />
            <div className={isHide ? "d-none" : "m-0 ms-2"}>Dashboard</div>
          </Link>
        </li>

        <li className="bg-white rounded-4 d-flex">
          <Link
            to="/accounts"
            className={
              (url === "/accounts" ? "opacity-75 fw-bolder " : "") +
              "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 justify-content-" +
              (isHide ? "center" : "start")
            }
            aria-expanded={false && url.startsWith("/accounts")}
          >
            <img className="" alt="" src="/sidebar/accounts.svg" />
            <div className={isHide ? "d-none" : "m-0 ms-2"}>Accounts</div>
          </Link>
          <div
            role="button"
            data-bs-toggle="collapse"
            data-bs-target="#accounts-collapse"
            aria-expanded="false"
            aria-controls="accounts-collapse"
            onClick={() => {
              handleIconClick("accounts", !isRotatedAccounts);
            }}
            className={`${url === "/accounts" ? "opacity-75 fw-bolder " : ""}bg-green pe-2 d-flex align-items-center`}
          >
            {isRotatedAccounts ? <IoIosArrowUp className="text-white" /> : <IoIosArrowDown className="text-white" />}
          </div>
        </li>
        <div className="collapse ps-3" id="accounts-collapse" data-bs-parent="#sidebarAccordion" style={{}}>
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li className="bg-white rounded-4">
              <Link
                to="/accounts/global-accounts"
                className={
                  (url.startsWith("/accounts/global-accounts") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/accounts/globalAccounts.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Global Accounts</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/accounts/conversion"
                className={
                  (url.startsWith("/accounts/conversion") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/accounts/currencyConversion.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Conversion</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/accounts/statements"
                className={
                  (url.startsWith("/accounts/statements") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/accounts/accountStatement.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Statements</div>
              </Link>
            </li>
          </ul>
        </div>

        <li className="bg-white rounded-4 d-flex my-3">
          <Link
            to="/payments"
            className={
              (url === "/payments" ? "opacity-75 fw-bolder " : "") +
              "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 justify-content-" +
              (isHide ? "center" : "start")
            }
            aria-expanded={false && url.startsWith("/payments")}
          >
            <img className="" alt="" src="/sidebar/payments.svg" />
            <div className={isHide ? "d-none" : "m-0 ms-2"}>Payments</div>
          </Link>
          <div
            role="button"
            data-bs-toggle="collapse"
            data-bs-target="#payments-collapse"
            aria-expanded="false"
            aria-controls="payments-collapse"
            onClick={() => {
              handleIconClick("payments", !isRotatedPayments);
            }}
            className={`${url === "/payments" ? "opacity-75 fw-bolder " : ""}bg-green pe-2 d-flex align-items-center`}
          >
            {isRotatedPayments ? <IoIosArrowUp className="text-white" /> : <IoIosArrowDown className="text-white" />}
          </div>
        </li>
        <div className="collapse ps-3" id="payments-collapse" data-bs-parent="#sidebarAccordion" style={{}}>
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li className="bg-white rounded-4">
              <Link
                to="/payments/beneficiaries"
                className={
                  (url.startsWith("/payments/beneficiaries") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/payments/beneficiaries.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Beneficiaries</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/payments/request-money"
                className={
                  (url.startsWith("/payments/request-money") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/payments/requestMoney.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Request Money</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/payments/send-money"
                className={
                  (url.startsWith("/payments/send-money") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/payments/sendMoney.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Send Money</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/payments/transactions"
                className={
                  (url.startsWith("/payments/transactions") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/payments/transactions.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Transactions</div>
              </Link>
            </li>
          </ul>
        </div>

        <li className="bg-white rounded-4 d-flex my-3">
          <Link
            to="/expense"
            className={
              (url === "/expense" ? "opacity-75 fw-bolder " : "") +
              "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 justify-content-" +
              (isHide ? "center" : "start")
            }
            aria-expanded={false && url.startsWith("/expense")}
          >
            <img className="" alt="" src="/sidebar/expense.svg" />
            <div className={isHide ? "d-none" : "m-0 ms-2"}>Expense</div>
          </Link>
          <div
            role="button"
            data-bs-toggle="collapse"
            data-bs-target="#expense-collapse"
            aria-expanded="false"
            aria-controls="expense-collapse"
            onClick={() => {
              handleIconClick("expense", !isRotatedExpense);
            }}
            className={`${url === "/expense" ? "opacity-75 fw-bolder " : ""}bg-green pe-2 d-flex align-items-center`}
          >
            {isRotatedExpense ? <IoIosArrowUp className="text-white" /> : <IoIosArrowDown className="text-white" />}
          </div>
        </li>
        <div className="collapse ps-3" id="expense-collapse" data-bs-parent="#sidebarAccordion" style={{}}>
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li className="bg-white rounded-4">
              <Link
                to="/expense/invoices"
                className={
                  (url.startsWith("/expense/invoices") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/invoiceside.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Invoices</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/expense/bills"
                className={
                  (url.startsWith("/expense/bills") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/billssidebar.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Bills</div>
              </Link>
            </li>
            <li className={`bg-white rounded-4 ${shouldHide ? "d-none" : ""}`}>
              <Link
                to="/expense/corporate-cards"
                className={
                  (url.startsWith("/expense/corporate-cards") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/cardssidebar.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Corporate Cards</div>
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-gainsboro my-1" style={{ height: "0.06rem" }} />
        <li className="bg-white rounded-4 d-flex my-3">
          <Link
            to="/settings"
            className={
              (url === "/settings" ? "opacity-75 fw-bolder " : "") +
              "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 justify-content-" +
              (isHide ? "center" : "start")
            }
            aria-expanded={false && url.startsWith("/settings")}
          >
            <img className="" alt="" src="/sidebar/settings.svg" />
            <div className={isHide ? "d-none" : "m-0 ms-1"}>Settings</div>
          </Link>
          <div
            role="button"
            data-bs-toggle="collapse"
            data-bs-target="#settings-collapse"
            aria-expanded="false"
            aria-controls="settings-collapse"
            onClick={() => {
              handleIconClick("settings", !isRotatedSettings);
            }}
            className={`${url === "/settings" ? "opacity-75 fw-bolder " : ""}bg-green pe-2 d-flex align-items-center`}
          >
            {isRotatedSettings ? <IoIosArrowUp className="text-white" /> : <IoIosArrowDown className="text-white" />}
          </div>
        </li>
        <div className="collapse ps-3" id="settings-collapse" data-bs-parent="#sidebarAccordion" style={{}}>
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li className="bg-white rounded-4">
              <Link
                to="/settings/security"
                className={
                  (url.startsWith("/settings/security") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/settings/password.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Security</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/settings/branding"
                className={
                  (url.startsWith("/settings/branding") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/settings/branding.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Branding</div>
              </Link>
            </li>

            <li className="bg-white rounded-4">
              <Link
                to="/settings/subscription"
                className={
                  (url.startsWith("/settings/subscription") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/settings/subscription.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Subscription</div>
              </Link>
            </li>
          </ul>
        </div>
        <li className="bg-white rounded-4 d-flex my-3 d-none">
          <Link
            to="/access-control"
            className={
              (url === "/access-control" ? "opacity-75 fw-bolder " : "") +
              "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 justify-content-" +
              (isHide ? "center" : "start")
            }
            aria-expanded={false && url.startsWith("/access-control")}
          >
            {/* <img
                            className=""
                            alt=""
                            src="/sidebar/settings.svg"
                        /> */}
            <LiaUsersCogSolid size={25} />
            <div className={isHide ? "d-none" : "m-0 ms-1"}>User Access</div>
          </Link>
          <div
            role="button"
            data-bs-toggle="collapse"
            data-bs-target="#access-control-collapse"
            aria-expanded="false"
            aria-controls="access-control-collapse"
            onClick={() => {
              handleIconClick("access-control", !isRotatedAccessControl);
            }}
            className={`${
              url === "/access-control" ? "opacity-75 fw-bolder " : ""
            }bg-green pe-2 d-flex align-items-center`}
          >
            {isRotatedAccessControl ? (
              <IoIosArrowUp className="text-white" />
            ) : (
              <IoIosArrowDown className="text-white" />
            )}
          </div>
        </li>
        <div className="collapse ps-3" id="access-control-collapse" data-bs-parent="#sidebarAccordion" style={{}}>
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li className="bg-white rounded-4">
              <Link
                to="/access-control/team-members"
                className={
                  (url.startsWith("/access-control/team-members") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/settings/password.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Team Members</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/access-control/roles-permissions"
                className={
                  (url.startsWith("/access-control/roles-permissions") ? "opacity-75 fw-bolder " : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img className="" alt="" src="/sidebar/settings/branding.svg" />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Roles & Permission</div>
              </Link>
            </li>
          </ul>
        </div>
      </ul>
      <div className={"text-white "}>
        <div className="d-flex flex-nowrap justify-content-between align-items-center mb-2">
          <div className="d-flex rounded-circle">
            <img alt="" width={40} src="/avatar.png" />
          </div>
          <div className={isHide ? "d-none" : "text-nowrap"} id="sidebarUsername">
            {Username.length <= 10 ? Username : Username.slice(0, 10) + "..."}
          </div>
          <div className={isHide ? "d-none" : ""}>
            <a href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img alt="" src="/sidebar/threeDots.svg" />
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <Link to="/profile" className="dropdown-item">
                  <img src="/sidebar/profile/profile.svg" className="me-2" />
                  Profile
                </Link>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <img src="/sidebar/profile/business.svg" className="me-2" />
                  Business
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <img src="/sidebar/profile/branding.svg" className="me-2" />
                  Branding
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={logout}>
                  <img src="/sidebar/profile/logout.svg" className="me-2" />
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>
        <button
          className={"bg-transparent border-0 my-3 d-flex m" + (isHide ? "x" : "s") + "-auto"}
          onClick={() => {
            dispatch(toggleSideBar());
          }}
        >
          <img src={isHide ? "/sidebar/arrowRight.svg" : "/sidebar/arrowLeft.svg"} />
        </button>
      </div>
    </nav>
  );
}

export default SideBar;
