import React, { useState } from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import { TextField } from "@mui/material";
import Theme from "./Branding/Theme";
import Brand from "./Branding/Brand";
import PortalLink from "./Branding/PortalLink";
import IFrame from "./Branding/IFrame";

function Branding() {
  const [currentState, setCurrentState] = useState("theme");
  const [colour, setColour] = useState({ main: "#fff" });
  const [logo, setLogo] = useState(null);
  const [font, setFont] = useState(null);

  return (
    <div className="bg-white h-100">
      <BreadCrumbs
        data={{
          name: "Branding",
          img: "/arrows/arrowLeft.svg",
          backurl: "/dashboard",
          info: true,
        }}
      />

      <div className="d-flex justify-content-between">
        <button
          onClick={() => setCurrentState("theme")}
          className={
            "btn border w-100 text-center m-3 p-3 rounded-4" +
            (currentState === "theme" ? " fw-600 blue100" : " fw-500")
          }
        >
          <img
            className="me-2"
            src={
              "/settings/branding/" +
              (currentState === "theme" ? "theme_o.svg" : "theme.svg")
            }
          />
          THEME
        </button>

        <button
          onClick={() => setCurrentState("brand")}
          className={
            "btn border w-100 text-center m-3 p-3 rounded-4" +
            (currentState === "brand" ? " fw-600 blue100" : " fw-500")
          }
        >
          <img
            className="me-2"
            src={
              "/settings/branding/" +
              (currentState === "brand" ? "brand_o.svg" : "brand.svg")
            }
          />
          BRAND
        </button>

        <button
          onClick={() => setCurrentState("portalLink")}
          className={
            "btn border w-100 text-center m-3 p-3 rounded-4" +
            (currentState === "portalLink" ? " fw-600 blue100" : " fw-500")
          }
        >
          <img
            className="me-2"
            src={
              "/settings/branding/" +
              (currentState === "portalLink"
                ? "portalLink_o.svg"
                : "portalLink.svg")
            }
          />
          PORTAL LINK
        </button>
      </div>

      <h5 className="ms-3 my-2">
        {currentState === "theme"
          ? "Change theme"
          : currentState === "brand"
          ? "Add your company logo and Company Name to your Portal"
          : currentState === "portalLink" && "Customize your domain"}
      </h5>

      <div className="row">
        <div className="col-3">
          {currentState === "theme" ? (
            <Theme setColour={setColour} setFont={setFont} />
          ) : currentState === "brand" ? (
            <Brand setLogo={setLogo} />
          ) : (
            ""
          )}
        </div>

        {currentState === "portalLink" && (
          <div className="col-12">
            <PortalLink />
          </div>
        )}

        {currentState !== "portalLink" && (
          <div className="col-9">
            <IFrame colour={colour} logo={logo} font={font} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Branding;
