import React, { useEffect, useRef, useState } from "react";
import "../../css/CountryDropdown.css";
import Form from "./Form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { GenerateAuthToken } from "../../../../@redux/action/auth";
import {
  addBeneficiaryawx,
  listBeneficiary_awx,
} from "../../../../@redux/action/payments";

/**
 * React component for adding a new beneficiary.
 * Renders a button to trigger a modal with a form for entering beneficiary details.
 * @param {string} customerHashId - Unique identifier for the customer.
 */

import { init, createElement } from "@airwallex/components-sdk";

import { setAuthCode } from "../../../../@redux/features/auth";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";

let embeded = null;

// ../../@redux/features/auth
const EmbededPayment = () => {
  const [elementShow, setElementShow] = useState(true); // Example, set element show state
  const [errorMessage, setErrorMessage] = useState(true); // Example: set error state
  const dispatch = useDispatch();

  //const api_token = useSelector((state) => state.common.authToken);
  const awxAccountId = useSelector((state) => state.auth.awxAccountId);

  const get_access_token = async (apiToken, accountId) => {
    try {
      const response = await axios.post(
        process.env.VITE_BASE_URL + "/awx/authorizeAccountAWX",
        {
          accountId: accountId,
          codeChallenge: "",
          authToken: apiToken,
          scope : ["w:awx_action:transfers_edit"]
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
    async function fetchData() {
      const api_token = await dispatch(GenerateAuthToken());

      try {
        console.log("api_token: ", api_token);
        console.log("accountId: ", awxAccountId);

        const access_token = await get_access_token(api_token, awxAccountId);

        console.log("access_token: ", access_token);

        const options = {
          env: "demo",
          authCode: access_token,
          clientId: process.env.VITE_AWX_clientId,
          codeVerifier: process.env.VITE_AWX_codeVerifier,
        };
        // STEP #2: Initialize Airwallex on mount with the appropriate production environment and other configurations
        await init(options).then(() => {
          console.log("init");
        });

        // STEP #4: Create the drop-in element
        embeded = await createElement("beneficiaryForm", {
          customizations: {
            minHeight: 500,
          },
        });
        console.log("i ma here");
        const containerElement = document.getElementById(
          "beneficiary-form-container"
        );
        embeded.mount(containerElement);

        // STEP ##6: Add an event listener to handle events when the element is mounted

        // STEP ##7: Add an event listener to handle events when the payment is successful.
        const onReady = (event) => {
          /**
           * ... Handle events on success
           */
          // Add needed logics after component is rendered
          setElementShow(true);
          console.log(`Element is mounted: ${JSON.stringify(event)}`);
        };

        // STEP ##7: Add an event listener to handle events when the payment is successful.
        const onSuccess = (event) => {
          /**
           * ... Handle events on success
           */
          window.alert(`Confirm success with ${JSON.stringify(event.detail)}`);
        };

        // STEP ##8: Add an event listener to handle events when the payment has failed.
        const onError = (error) => {
          /**
           * ... Handle event on error
           */
          setErrorMessage({ error });
          console.log("There was an error", { error });
          // get_access_token(api_token, awxAccountId);
          dispatch(GenerateAuthToken());
        };

        embeded.on("ready", onReady);
        embeded.on("success", onSuccess);
        embeded.on("error", onError);
        return () => {
          embeded.on("ready", onReady);
          embeded.on("success", onSuccess);
          embeded.on("error", onError);
        };
      } catch (error) {
        console.error(error);
      }
    }

    void fetchData();
  }, [dispatch]); // This effect should ONLY RUN ONCE as we do not want to reload Airwallex and remount the elements

  // Example: Custom styling for the wechat container, can be placed in css
  const containerStyle = {
    height: "500vh",
  };

  return (
    <>
      <div>
        {/* Example below: show loading state */}
        {!elementShow && <p>Loading...</p>}
        {/* Example below: display response message block */}
        {errorMessage.length > 0 && <p id="error">{errorMessage}</p>}
        {/**
         * STEP #3a: Add an empty container for the dropin element to be placed into
         * - Ensure this is the only element in your document with this id,
         *   otherwise the element may fail to mount.
         */}
        <div
          id="beneficiary-form-container"
          style={{
            ...containerStyle, // Example: container styling can be moved to css
            // Example: only show element when mounted
          }}
        />
      </div>
    </>
  );
};

function CreateNewBeneficiary({ customerHashId }) {
  const platform = useSelector((state) => state.common.platform);
  const dispatch = useDispatch();
  const [formData, setFormData] = React.useState({});
  const clearFormData = () => {
    setFormData({});
  };

  const awxAccountId = useSelector((state) => state.auth.awxAccountId);
  const btnRef = useRef(null);

  const authToken = useSelector((state) => state.common.authToken);
  // 🔁 Fetch new auth token when awxAccountId is available
  useEffect(() => {
    if (platform === "awx" && awxAccountId) {
      dispatch(GenerateAuthToken(awxAccountId));
    }
  }, [platform, awxAccountId, dispatch]);

  const innerFucntion = () => {
    //setFormData({}); //Empty the data if suceeded
    document.getElementById("closeModalButton1").click();
    // dispatch(listbeneficiaries(customerHashId));
    return;
  };

  return (
    <>
      {/* Button trigger modal */}
      <button
        type="button"
        className="btn btn-action w-80 rounded-5 d-flex align-items-center justify-content-center py-2 fw-500"
        data-bs-toggle="modal"
        // data-bs-target="#AddNewAccountModal"
        data-bs-target={
          platform === "awx" ? "#AddNewAccountModalAWX" : "#AddNewAccountModal"
        }
        id="AddNewAccountModalButton">
        <span className="h3 m-0">+&nbsp;</span> New Beneficiary
      </button>
      {/* Modal for nium*/}
      <div
        className="modal fade"
        data-bs-backdrop="static"
        id="AddNewAccountModal"
        tabIndex={-1}
        aria-labelledby="AddNewAccountModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="d-flex flex-column modal-content p-5 gap-4 text-center text-dark">
            <div className="d-flex flex-row p-2 justify-content-between align-items-center border-bottom border-warning">
              <h2>Add beneficiary</h2>
              <button
                id="closeModalButton"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={clearFormData}></button>
            </div>
            <Form
              customerHashId={customerHashId}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        </div>
      </div>

      {/* Modal for airwallex*/}
      <div
        className="modal fade"
        data-bs-backdrop="static"
        id="AddNewAccountModalAWX"
        tabIndex={-1}
        aria-labelledby="AddNewAccountModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="d-flex flex-column modal-content p-5 gap-4 text-center text-dark">
            <div className="d-flex flex-row p-2 justify-content-between align-items-center border-bottom border-warning">
              <h2>Add beneficiary</h2>
              <button
                id="closeModalButton1"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={clearFormData}
                ref={btnRef}></button>
            </div>
            {/* <Form customerHashId={customerHashId} formData={formData} setFormData={setFormData} /> */}

            <div>
                        
              <div className="p-4" id="beneficiary-form-container">
                <EmbededPayment />
              </div>
              <button
                type="button"
                className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500"
                onClick={async () => {
                  const { values: beneficiary, errors } =
                    await embeded.submit();
                  if (!errors) {
                    const payload = { beneficiary };

                    setFormData(payload);

                    // Submit the beneficiary information to the backend for processing
                    console.log("befeneiciary", formData);
                    try {
                      await dispatch(
                        addBeneficiaryawx({
                          formData: payload,
                          awxAccountId,
                          authToken,
                        })
                      );
                      console.log("API Success:", payload);
                      btnRef.current?.click();
                      toast.success("Beneficiary added successfully...");
                      dispatch(listBeneficiary_awx(awxAccountId, authToken));
                    } catch (error) {
                      console.error(
                        "API Error:",
                        error.response?.data || error.message
                      );
                    }
                  } else {
                    // Handle errors using the error code
                    console.log(errors);
                  }
                }}>
                Save Beneficiary
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateNewBeneficiary;
