import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import Navbar from "../Navbar";
import Dashboard from "./Dashboard";
import { toast } from "react-toastify";
import Axios from "axios";
import { resolvePath, useLocation } from "react-router-dom";
import ContentLoader from "react-content-loader";
import "./css/Dashboard.css";
import * as utilities from "../onboarding/dashboard/tabs/functions/utility-details-function.js";
import { setCustomerHashId } from "../../@redux/features/common";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { AuthUser } from "../onboarding/dashboard/tabs/functions/utility-details-function.js";

export const FetchDetails = async () => {
  var lastemail = sessionStorage.getItem("lastemail");
  if (lastemail && lastemail !== "") {
    try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/SignupRoutes/getuserstatus",
        {
          params: {
            email: lastemail,
          },
        }
      );

      let obj = response.data;
      if (obj.status != "BAD_REQUEST") {
        if (obj.internalBusinessId != "") {
          sessionStorage.setItem("internalBusinessId", obj.internalBusinessId);
          sessionStorage.setItem(
            "businessRegistrationNumber",
            obj.internalBusinessId
          );
        }

        if (obj.lastScreenCompleted != "") {
          sessionStorage.setItem(
            "lastScreenCompleted",
            obj.lastScreenCompleted
          );
        }

        if (obj.userStatus != "") {
          sessionStorage.setItem("userStatus", obj.userStatus);
        }
      } else {
        console.log("No results found for the email: " + lastemail);
      }
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  }
};

export const FetchOnboardingDetails = async (dispatch) => {
  var brn = sessionStorage.getItem("internalBusinessId");
  if (brn && brn !== "") {
    try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") +
          "/SignupRoutes/getuseronboardingstatus",
        {
          params: {
            brn: brn,
          },
        }
      );

      let data = response.data;

      if (data.length > 0) {
        let obj = data[0];

        if (obj.customerHashId != "") {
          dispatch(setCustomerHashId(obj.customerHashId));
          sessionStorage.setItem("customerHashId", obj.customerHashId);
        }

        if (obj.clientId != "") {
          sessionStorage.setItem("clientId", obj.clientId);
        }

        if (obj.caseId != "") {
          sessionStorage.setItem("caseId", obj.caseId);
        }

        if (obj.walletHashId != "") {
          sessionStorage.setItem("walletHashId", obj.walletHashId);
        }

        if (obj.kycUrl != "") {
          sessionStorage.setItem("kycUrl", obj.kycUrl);
        }

        if (obj.remarks != "") {
          sessionStorage.setItem("complianceRemarks", obj.remarks);
        }

        return obj;
      } else {
        console.log(
          "No results found for the business registration number : " + brn
        );

        return { status: "registration not found" };
      }
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  }
};

export const FetchCognitoDetails = async () => {
  var email = sessionStorage.getItem("lastemail");
  if (email && email !== "") {
    try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/SignupRoutes/getcognitouserinfo",
        {
          params: {
            email: email,
          },
        }
      );

      let data = response.data;
      let userAttr = data.userAttributes;
      if (userAttr.length > 0) {
        const contactName = userAttr.find(
          (attr) => attr.name === "custom:contactName"
        );
        if (contactName) {
          const contactNameValue = contactName.value;
          sessionStorage.setItem("contactName", contactNameValue);
        }

        const businessRegisteredCountry = userAttr.find(
          (attr) => attr.name === "custom:countryName"
        );
        if (businessRegisteredCountry) {
          const businessRegisteredCountryValue =
            businessRegisteredCountry.value;
          const countryList = JSON.parse(sessionStorage.getItem("listCountry"));

          for (var i = 0; i < countryList.length; i++) {
            if (businessRegisteredCountryValue === countryList[i].ISOcc_2char) {
              sessionStorage.setItem("region", countryList[i].region);
            }
          }
        }
      } else {
        console.log("No results found for the following email: " + email);
      }
    } catch (error) {
      console.log("Something went wrong: ", error);
    }
  }
};

export const FetchRegisteredCountry = async () => {
  var brn = sessionStorage.getItem("internalBusinessId");

  if (brn && brn != "") {
    try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/getAdditionalBusinessDetails",
        {
          params: {
            businessRegistrationNumber: brn,
          },
        }
      );

      let obj = response.data;

      if (obj.hasOwnProperty("regCountry")) {
        sessionStorage.setItem("registerdCountry", obj.regCountry);
      }
    } catch (error) {
      console.log("Something went wrong: " + error);
    }
  } else {
    console.log("BRN not available");
  }
};

export const fetchKycStatus = async () => {
  var customerHashId = sessionStorage.getItem("customerHashId");

  if (customerHashId && customerHashId != "") {
    try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") +
          "/OnboardingRoutes/getKycStatusClient",
        {
          params: {
            customerHashId: customerHashId,
          },
        }
      );

      let obj = response.data;

      if (obj.hasOwnProperty("complianceStatus")) {
        sessionStorage.setItem("complianceStatus", obj.complianceStatus);
      }

      if (obj.hasOwnProperty("status")) {
        sessionStorage.setItem("finalKycStatus", obj.status);
      }
    } catch (error) {
      console.log("Something went wrong: " + error);
    }
  } else {
    console.log("KYC STATUS NOT available");
  }
};

function Home({ isActivated }) {
  const location = useLocation();
  const [a, setA] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activated, setActivated] = useState(isActivated);
  const dispatch = useDispatch();
  const subStatus = useSelector((state) => state.subscription?.data?.status);
  useEffect(() => {
    const SetPage = async () => {
      await AuthUser();

      //Setting Country Lists for all tabs
      const listCountry = await utilities.listCountry();
      const listNationality = await utilities.listNationality();
      const listMobileCountryCode = await utilities.listCountryCode();

      sessionStorage.setItem("listCountry", JSON.stringify(listCountry));
      sessionStorage.setItem(
        "listNationality",
        JSON.stringify(listNationality)
      );
      sessionStorage.setItem(
        "listMobileCountryCode",
        JSON.stringify(listMobileCountryCode)
      );

      await FetchDetails();
      await FetchOnboardingDetails(dispatch);
      await FetchCognitoDetails();
      await FetchRegisteredCountry();
      await fetchKycStatus();

      setIsLoading(false);

      if (sessionStorage.getItem("complianceStatus") == "COMPLETED") {
        if (subStatus === "inactive") {
          setActivated(false);
        } else {
          setActivated(true);
        }
      } else {
        setActivated(false);
      }

      // Parse the URL parameters
      const searchParams = new URLSearchParams(location.search);
      const params = Object.fromEntries(searchParams.entries());

      if (params["a"]) {
        localStorage.setItem("a", params["a"]);
        setA(params["a"]);
      }
      const params2 = localStorage.getItem("a");
      const root = document.documentElement;

      if (params2) {
        const styles = params2.split(";");
        styles.forEach((style) => {
          const [property, value] = style.split(":");
          if (property && value) {
            root.style.setProperty(property.trim(), value.trim());
          }
        });
      }
    };
    SetPage();
  }, [a, subStatus]);

  return (
    <div>
      <div className="d-flex">
        {/* <SideBar /> */}
        <div
          className="container-fluid px-0 bg-light clear-left overflow-auto"
          style={{ height: "100vh" }}
        >
          {/* <Navbar />
          <Dashboard /> */}

          {isLoading ? (
            <>
              <ContentLoader
                speed={2}
                width={"100%"}
                height={900}
                // viewBox="0 0 1200 900"
                backgroundColor="#eaeced"
                foregroundColor="#ffffff"
              >
                <rect x="68" y="37" rx="3" ry="3" width="298" height="129" />
                <rect x="426" y="37" rx="3" ry="3" width="298" height="129" />
                <rect x="786" y="37" rx="3" ry="3" width="298" height="129" />
                <rect x="104" y="217" rx="3" ry="3" width="578" height="42" />
                <rect x="123" y="308" rx="3" ry="3" width="906" height="17" />
                <circle cx="951" cy="386" r="11" />
                <circle cx="986" cy="386" r="11" />
                <rect x="176" y="378" rx="3" ry="3" width="141" height="15" />
                <rect x="377" y="377" rx="3" ry="3" width="299" height="15" />
                <rect x="733" y="377" rx="3" ry="3" width="141" height="15" />
                <rect x="127" y="418" rx="3" ry="3" width="897" height="2" />
                <circle cx="952" cy="447" r="11" />
                <circle cx="987" cy="447" r="11" />
                <rect x="177" y="439" rx="3" ry="3" width="141" height="15" />
                <rect x="378" y="438" rx="3" ry="3" width="299" height="15" />
                <rect x="734" y="438" rx="3" ry="3" width="141" height="15" />
                <rect x="128" y="479" rx="3" ry="3" width="897" height="2" />
                <circle cx="953" cy="505" r="11" />
                <circle cx="988" cy="505" r="11" />
                <rect x="178" y="497" rx="3" ry="3" width="141" height="15" />
                <rect x="379" y="496" rx="3" ry="3" width="299" height="15" />
                <rect x="735" y="496" rx="3" ry="3" width="141" height="15" />
                <rect x="129" y="537" rx="3" ry="3" width="897" height="2" />
                <circle cx="954" cy="566" r="11" />
                <circle cx="989" cy="566" r="11" />
                <rect x="179" y="558" rx="3" ry="3" width="141" height="15" />
                <rect x="380" y="557" rx="3" ry="3" width="299" height="15" />
                <rect x="736" y="557" rx="3" ry="3" width="141" height="15" />
                <rect x="130" y="598" rx="3" ry="3" width="897" height="2" />
                <circle cx="953" cy="626" r="11" />
                <circle cx="988" cy="626" r="11" />
                <rect x="178" y="618" rx="3" ry="3" width="141" height="15" />
                <rect x="379" y="617" rx="3" ry="3" width="299" height="15" />
                <rect x="735" y="617" rx="3" ry="3" width="141" height="15" />
                <rect x="129" y="658" rx="3" ry="3" width="897" height="2" />
                <circle cx="954" cy="687" r="11" />
                <circle cx="989" cy="687" r="11" />
                <rect x="179" y="679" rx="3" ry="3" width="141" height="15" />
                <rect x="380" y="678" rx="3" ry="3" width="299" height="15" />
                <rect x="736" y="678" rx="3" ry="3" width="141" height="15" />
                <rect x="127" y="716" rx="3" ry="3" width="897" height="2" />
                <rect x="123" y="312" rx="3" ry="3" width="2" height="465" />
                <rect x="1027" y="312" rx="3" ry="3" width="2" height="465" />
                <circle cx="954" cy="747" r="11" />
                <circle cx="989" cy="747" r="11" />
                <rect x="179" y="739" rx="3" ry="3" width="141" height="15" />
                <rect x="380" y="738" rx="3" ry="3" width="299" height="15" />
                <rect x="736" y="738" rx="3" ry="3" width="141" height="15" />
                <rect x="127" y="776" rx="3" ry="3" width="897" height="2" />
                <rect x="124" y="343" rx="3" ry="3" width="906" height="17" />
                <rect x="125" y="320" rx="3" ry="3" width="68" height="33" />
                <rect x="294" y="317" rx="3" ry="3" width="149" height="33" />
                <rect x="616" y="318" rx="3" ry="3" width="137" height="33" />
                <rect x="854" y="319" rx="3" ry="3" width="72" height="33" />
                <rect x="1005" y="317" rx="3" ry="3" width="22" height="33" />
                <circle cx="743" cy="237" r="20" />
                <rect x="739" y="217" rx="0" ry="0" width="67" height="40" />
                <circle cx="802" cy="237" r="20" />
                <circle cx="890" cy="238" r="20" />
                <rect x="890" y="218" rx="0" ry="0" width="140" height="40" />
                <circle cx="1032" cy="238" r="20" />
              </ContentLoader>
            </>
          ) : (
            <>
              <Navbar isActivated={activated} />
              <Dashboard isActivated={activated} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
