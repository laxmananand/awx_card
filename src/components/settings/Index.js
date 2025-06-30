import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import { useLocation } from "react-router-dom";
import Security from "./tabs/Security";
import Settings from "./Settings";
import Subscription from "./tabs/Subscription";
import Branding from "./tabs/Branding";
import Sidebar from "../../@component_v2/Sidebar";

function SettingsHome() {
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

  return (
    <div>
      <div className="d-flex">
        {/* <Sidebar/> */}
        <div className="container-fluid px-0 bg-light clear-left overflow-auto" style={{ height: "100vh" }}>
          {url === "/settings" ? (
            <Settings />
          ) : url === "/settings/security" ? (
            <Security />
          ) : url === "/settings/subscription" ? (
            <Subscription />
          ) : url === "/settings/branding" ? (
            <Branding />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsHome;
