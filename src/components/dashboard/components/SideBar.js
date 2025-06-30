import React, { useDebugValue, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as functions from "../js/dashboard-internal.js";

// Create a function to import all files from a directory dynamically
async function importAll(r) {
  const files = {};
  for (const key of r.keys()) {
    const fileName = key.replace("./", "");
    files[fileName] = await r(key);
  }
  return files;
}

function SideBar() {
  const [assets, setAssets] = useState(null);
  const [isHide, setIsHide] = useState(false);
  const [url, setUrl] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Use require.context to get all files from the directory
    const requireContext = require.context(
      "../assets/",
      true,
      /\.(svg|png|jpg|jpeg|gif)$/
    );

    // Call the function and get all files in the directory
    importAll(requireContext).then((fetchedAssets) => {
      setAssets(fetchedAssets);
    });
    setUrl(location.pathname);
  }, []);

  useEffect(() => {
    const accountsButton = document.getElementById("accounts-collapse");
    const paymentsButton = document.getElementById("payments-collapse");
    const expenseButton = document.getElementById("expense-collapse");
    const settingsButton = document.getElementById("settings-collapse");

    if (accountsButton) {
      if (url.startsWith("/accounts")) {
        accountsButton.classList.add("show");
      } else {
        accountsButton.classList.remove("show");
      }
    }
    if (paymentsButton) {
      if (url.startsWith("/payments")) {
        paymentsButton.classList.add("show");
      } else {
        paymentsButton.classList.remove("show");
      }
    }
    if (expenseButton) {
      if (url.startsWith("/expense")) {
        expenseButton.classList.add("show");
      } else {
        expenseButton.classList.remove("show");
      }
    }
    if (settingsButton) {
      if (url.startsWith("/settings")) {
        settingsButton.classList.add("show");
      } else {
        settingsButton.classList.remove("show");
      }
    }
  }, [url]);

  if (!assets) {
    return <div>Loading...</div>;
  }
  return (
    <nav
      className="d-flex bg-green flex-column justify-content-between flex-start px-3 flex-1"
      style={{ height: "100vh" }}
      id="sidebar"
    >
      <ul
        className="p-0 list-unstyled accordion overflow-auto flex-fill"
        id="sidebarAccordion"
      >
        <Link to="/" className="d-inline-block my-4">
          <img alt="" src={assets["logo.svg"].default} />
        </Link>
        <div className="bg-gainsboro my-1" style={{ height: "0.06rem" }} />
        <li className="bg-white rounded-4">
          <Link
            to="/"
            className={
              (url === "/" ? "opacity-75 fw-bolder " : "") +
              "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
              (isHide ? "center" : "start")
            }
          >
            <img
              className=""
              alt=""
              src={assets["sidebar/dashboard.svg"].default}
            />
            <div className={isHide ? "d-none" : "h6 m-0 ms-2"}>Dashboard</div>
          </Link>
        </li>

        <li className="bg-white rounded-4">
          <Link
            to="/accounts"
            className={
              (url === "/accounts" ? "opacity-75 fw-bolder " : "") +
              "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
              (isHide ? "center" : "start dropdown-toggle")
            }
            aria-expanded={url.startsWith("/accounts")}
          >
            <img
              className=""
              alt=""
              src={assets["sidebar/accounts.svg"].default}
            />
            <div className={isHide ? "d-none" : "m-0 ms-2"}>Accounts</div>
          </Link>
        </li>
        <div
          className="collapse ps-3"
          id="accounts-collapse"
          data-bs-parent="#sidebarAccordion"
          style={{}}
        >
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li className="bg-white rounded-4">
              <Link
                to="/accounts/global-accounts"
                className={
                  (url.startsWith("/accounts/global-accounts")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/accounts/globalAccounts.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>
                  Global Accounts
                </div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/accounts/conversion"
                className={
                  (url.startsWith("/accounts/conversion")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={
                    assets["sidebar/accounts/currencyConversion.svg"].default
                  }
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Conversion</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/accounts/statements"
                className={
                  (url.startsWith("/accounts/statements")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/accounts/accountStatement.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Statements</div>
              </Link>
            </li>
          </ul>
        </div>

        <li className="bg-white rounded-4">
          <Link
            to="/payments"
            className={
              (url === "/payments" ? "opacity-75 fw-bolder " : "") +
              "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
              (isHide ? "center" : "start dropdown-toggle")
            }
            aria-expanded={url.startsWith("/payments")}
          >
            <img
              className=""
              alt=""
              src={assets["sidebar/payments.svg"].default}
            />
            <div className={isHide ? "d-none" : "m-0 ms-2"}>Payments</div>
          </Link>
        </li>
        <div
          className="collapse ps-3"
          id="payments-collapse"
          data-bs-parent="#sidebarAccordion"
          style={{}}
        >
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li className="bg-white rounded-4">
              <Link
                to="/payments/beneficiaries"
                className={
                  (url.startsWith("/payments/beneficiaries")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/payments/beneficiaries.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>
                  Beneficiaries
                </div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/payments/request-money"
                className={
                  (url.startsWith("/payments/request-money")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/payments/requestMoney.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>
                  Request Money
                </div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/payments/send-money"
                className={
                  (url.startsWith("/payments/send-money")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/payments/sendMoney.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Send Money</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/payments/transactions"
                className={
                  (url.startsWith("/payments/transactions")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/payments/transactions.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>
                  Transactions
                </div>
              </Link>
            </li>
          </ul>
        </div>

        <li className="bg-white rounded-4">
          <Link
            to="/expense"
            className={
              (url === "/expense" ? "opacity-75 fw-bolder " : "") +
              "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
              (isHide ? "center" : "start dropdown-toggle")
            }
            aria-expanded={url.startsWith("/expense")}
          >
            <img
              className=""
              alt=""
              src={assets["sidebar/expense.svg"].default}
            />
            <div className={isHide ? "d-none" : "m-0 ms-2"}>Expense</div>
          </Link>
        </li>
        <div
          className="collapse ps-3"
          id="expense-collapse"
          data-bs-parent="#sidebarAccordion"
          style={{}}
        >
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li className="bg-white rounded-4">
              <Link
                to="/expense/invoices"
                className={
                  (url.startsWith("/expense/invoices")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/expense/invoices.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Invoices</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/expense/bills"
                className={
                  (url.startsWith("/expense/bills")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/expense/bills.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Bills</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/expense/corporate-cards"
                className={
                  (url.startsWith("/expense/corporate-cards")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/expense/corporateCards.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>
                  Corporate Cards
                </div>
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-gainsboro my-1" style={{ height: "0.06rem" }} />
        <li className="bg-white rounded-4">
          <Link
            to="/settings"
            className={
              (url === "/settings" ? "opacity-75 fw-bolder " : "") +
              "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
              (isHide ? "center" : "start dropdown-toggle")
            }
            aria-expanded={url.startsWith("/settings")}
          >
            <img
              className=""
              alt=""
              src={assets["sidebar/settings.svg"].default}
            />
            <div className={isHide ? "d-none" : "m-0 ms-1"}>Settings</div>
          </Link>
        </li>
        <div
          className="collapse ps-3"
          id="settings-collapse"
          data-bs-parent="#sidebarAccordion"
          style={{}}
        >
          <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li className="bg-white rounded-4">
              <Link
                to="/settings/2FAsetup"
                className={
                  (url.startsWith("/settings/2FAsetup")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/settings/2FAsetup.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>2FA Setup</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/settings/branding"
                className={
                  (url.startsWith("/settings/branding")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/settings/branding.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Branding</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/settings/password"
                className={
                  (url.startsWith("/settings/password")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/settings/password.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>Password</div>
              </Link>
            </li>
            <li className="bg-white rounded-4">
              <Link
                to="/settings/subscription"
                className={
                  (url.startsWith("/settings/subscription")
                    ? "opacity-75 fw-bolder "
                    : "") +
                  "text-decoration-none px-2 bg-green w-100 border-0 d-flex flex-nowrap align-items-center text-white py-2 my-3 justify-content-" +
                  (isHide ? "center" : "start")
                }
              >
                <img
                  className=""
                  alt=""
                  src={assets["sidebar/settings/subscription.svg"].default}
                />
                <div className={isHide ? "d-none" : "m-0 ms-1"}>
                  Subscription
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </ul>
      <div className={"text-white " + (isHide ? "" : "")}>
        <div className="d-flex flex-nowrap align-items-center mb-2">
          <img
            className={isHide ? "mx-auto" : ""}
            alt=""
            src={assets["sidebar/avatar.svg"].default}
          />
          <div className={isHide ? "d-none" : "ms-2 text-nowrap"}>
            Daniel Brown
          </div>
          <div className={isHide ? "d-none" : ""}>
            <a
              className={"nav-link"}
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img alt="" src={assets["sidebar/threeDots.svg"].default} />
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <a className="dropdown-item" href="#">
                  <img
                    src={assets["sidebar/profile/profile.svg"].default}
                    className="me-2"
                  />
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <img
                    src={assets["sidebar/profile/business.svg"].default}
                    className="me-2"
                  />
                  Business
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <img
                    src={assets["sidebar/profile/branding.svg"].default}
                    className="me-2"
                  />
                  Branding
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/">
                  <img
                    src={assets["sidebar/profile/logout.svg"].default}
                    className="me-2"
                  />
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>
        <button
          className={
            "bg-transparent border-0 my-3 d-flex m" +
            (isHide ? "x" : "s") +
            "-auto"
          }
          onClick={() => {
            setIsHide(!isHide);
          }}
        >
          <img
            src={
              isHide
                ? assets["sidebar/arrowRight.svg"].default
                : assets["sidebar/arrowLeft.svg"].default
            }
          />
        </button>
      </div>
    </nav>
  );
}

export default SideBar;
