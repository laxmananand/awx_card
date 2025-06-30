import React, { useEffect, useState } from "react";
import { init, createElement } from "@airwallex/components-sdk";
import axios from "axios";
import { setAuthToken } from "../../../@redux/features/common";
import { setAuthCode } from "../../../@redux/features/auth";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUserAWX } from "../../../@redux/action/auth";

export const scope = [
  "w:awx_action:onboarding",
  "w:awx_action:transfers_edit",
  "w:awx_action:kyb",
  "r:awx_action:rfi_view",
  "w:awx_action:rfi_edit",
  "r:awx_action:sca_view",
  "w:awx_action:sca_edit",
];

const getDynamicScope = (type) => {
  const baseScope = [scope[0]];

  if (type === "rfi") {
    baseScope.push(scope[3], scope[4]);
  }

  return baseScope;
};

const Embeded = ({ type, subType }) => {
  const [elementShow, setElementShow] = useState(true); // Example, set element show state
  const [errorMessage, setErrorMessage] = useState(true); // Example: set error state
  const dispatch = useDispatch();
  const api_token = useSelector((state) => state.common.authToken);
  const awxAccountId = useSelector((state) => state.auth.awxAccountId);
  const email = sessionStorage.getItem("lastemail");

  useEffect(() => {}, [subType]);

  const selectedScope = getDynamicScope(type);

  const get_access_token = async (apiToken, accountId) => {
    try {
      const response = await axios.post(
        process.env.VITE_BASE_URL + "/awx/authorizeAccountAWX",
        {
          accountId: accountId,
          codeChallenge: "",
          authToken: apiToken,
          scope: selectedScope,
        }
      );

      if (response.data?.authCode) {
        dispatch(setAuthCode(response.data.authCode)); // Save auth code to Redux
        return response.data.authCode;
      }
    } catch (error) {
      console.error("Error fetching auth code:", error);
    }
  };

  useEffect(() => {
    let embededInstance;

    async function fetchData() {
      try {
        const access_token = await get_access_token(api_token, awxAccountId);

        const options = {
          env: "demo",
          authCode: access_token,
          clientId: process.env.VITE_AWX_clientId,
          codeVerifier: process.env.VITE_AWX_codeVerifier,
        };

        await init(options);

        embededInstance = await createElement(
          type === "rfi" && subType.includes("KYC")
            ? "kycRfi"
            : type === "rfi" && subType.includes("TRANSACTION")
            ? "transactionRfi"
            : type === "rfi" && subType.includes("PAYMENT")
            ? "paymentEnablementRfi"
            : type === "rfi" && subType.includes("CARDHOLDER")
            ? "cardholderRfi"
            : "kyc",
          {
            hideHeader: true,
            hideNav: false,
          }
        );

        const containerElement = document.getElementById("onboarding");

        if (containerElement && containerElement.children.length === 0) {
          embededInstance.mount(containerElement);
        }

        const onReady = (event) => {
          setElementShow(true);
          console.log(`Element is mounted: ${JSON.stringify(event)}`);
        };

        const onSuccess = async (event) => {
          await dispatch(
            UpdateUserAWX({
              email,
              accountId: awxAccountId,
              lastScreenCompleted: 8,
              userStatus: "C",
            })
          );
        };

        const onError = (event) => {
          const { error } = event;
          setErrorMessage(error);
          console.log("There was an error", error);
        };

        embededInstance.on("ready", onReady);
        embededInstance.on("success", onSuccess);
        embededInstance.on("error", onError);
      } catch (error) {
        console.error(error);
      }
    }

    void fetchData();

    return () => {
      if (embededInstance) {
        // embededInstance.off("ready");
        // embededInstance.off("success");
        // embededInstance.off("error");
        embededInstance.unmount();
        embededInstance.destroy();
      }
    };
  }, [dispatch]);

  // Example: Custom styling for the wechat container, can be placed in css
  const containerStyle = {
    height: "100vh",
  };

  return (
    <div>
      {/* Example below: show loading state */}
      {!elementShow && <p>Loading...</p>}
      {/* Example below: display response message block */}
      {errorMessage && errorMessage.length > 0 && (
        <p id="error">{errorMessage}</p>
      )}
      {/**
       * STEP #3a: Add an empty container for the dropin element to be placed into
       * - Ensure this is the only element in your document with this id,
       *   otherwise the element may fail to mount.
       */}
      <div
        id="onboarding"
        style={{
          ...containerStyle, // Example: container styling can be moved to css
          // Example: only show element when mounted
        }}
      />
    </div>
  );
};

export default Embeded;
