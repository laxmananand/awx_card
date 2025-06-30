import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import Accounts from "./Accounts";
import { useLocation } from "react-router-dom";
import GlobalAccounts from "./tabs/GlobalAccounts";
import CurrencyConversion from "./tabs/CurrencyConversion";
import AccountStatement from "./tabs/AccountStatement";
import Sidebar from "../../@component_v2/Sidebar";
import { AuthUser } from "../onboarding/dashboard/tabs/functions/utility-details-function";
import Wallets from "./tabs/Wallets";

function AccountsHome() {
  const location = useLocation();
  const [url, setUrl] = useState();

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
    AuthUser();
  }, []);

  return (
    <div>
      {/* <Sidebar /> */}
      <div className="d-flex">
        {/* <SideBar /> */}
        <div
          className="container-fluid px-0 bg-light clear-left overflow-auto"
          style={{ height: "100vh" }}
        >
          {url === "/accounts" ? (
            <Accounts />
          ) : url === "/accounts/global-accounts" ? (
            <GlobalAccounts />
          ): url === "/accounts/wallets" ? (
            <Wallets />
          ) : url === "/accounts/conversion" ? (
            <CurrencyConversion />
          ) : url === "/accounts/statements" ? (
            <AccountStatement />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountsHome;
