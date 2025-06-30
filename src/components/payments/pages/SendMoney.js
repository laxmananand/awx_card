import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import Recipient from "./SendMoney/Recipient";
import Amount from "./SendMoney/Amount";
import OverView from "./SendMoney/OverView";
import Response from "./SendMoney/Response";
import TransferDetailsForm from "./SendMoney/additionalinfo.js";
// import { listbeneficiaries } from "../js/ListBeneficiaries";
import { fetchCurrency } from "../js/ListBeneficiaries";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CompareAllPlans from "../../Signup/pages/CompareAllPlans.js";
import ActivateAccount from "../../ActivateAccount.js";
import ManageSubscription from "../../settings/tabs/Subscription/ManageSubscription.js";
import * as paymentreducer from "../../../@redux/features/payments.js";
import * as paymentaction from "../../../@redux/features/payments.js";
import { GenerateAuthToken } from "../../../@redux/action/auth.js";
import axios from "axios";
import { setAuthCode } from "../../../@redux/features/auth";
import { init, createElement } from "@airwallex/components-sdk";
import { Box, Button } from "@mui/material";
import { scope } from "../../onboarding/dashboard/Embedded.js";
// import Button from "Button";

let embeded = null;

const EmbededPayment = ({ beneficiaryHashId }) => {
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
        embeded = await createElement("payoutForm", {
          defaultValues: {
            beneficiary_id: beneficiaryHashId, // use beneficiary id under the account
          },
          customizations: {
            maxHeight: 500,
          },
        });
        console.log("i am in payment");
        const containerElement = document.getElementById("payoutForm");
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
    height: "500",
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
          id="payoutForm"
          style={{
            ...containerStyle, // Example: container styling can be moved to css
            // Example: only show element when mounted
          }}
        />
        {/* <Button
          variant="primary"
          onClick={async () => {
            if (payoutFormRef.current) {
              const submitResult = await payoutFormRef.current.submit();
              // updatePayloadPanel(submitResult);
            }
          }}>
          submit
        </Button> */}
      </div>
    </>
  );
};

function SendMoney() {
  // const [payload, setPayload] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Access the state object from location
  const {
    beneficiaryHashId,
    beneficiaryName,
    beneficiaryAccountNumber,
    payoutMethod,
    destinationCurrency,
  } = location.state || {};
  const [currentState, setCurrentState] = useState("recipient");
  // const [selectedBeneficiary, setSelectedBeneficiary] = useState({});
  const platform = useSelector((state) => state.common.platform);

  // const beneficiaries = useSelector((state) => state.payments?.beneficiaryList);

  const beneficiaries = useSelector((state) => {
    if (platform === "awx") {
      return state.payments.beneficiaryList_awx; // Make sure this exists in your reducer
    } else {
      return state.payments.beneficiaryList; // fallback or other platform list
    }
  });

  const sourceCurrency = useSelector((state) => state.payments?.sourceCurrency);

  let complianceStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
  );

  let complianceStatus_awx = useSelector((state)=> state.onboarding?.complianceStatus);
  

  let customerHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );

  const purposeCodeList = useSelector(
    (state) => state.payments.purposeCodeList
  );
  const status = useSelector((state) => state.subscription?.data?.status);
  const [isActivated, setIsActivated] = useState(false);
  const payload = useSelector((state) => state.payments?.payload);
  let tnxrefid = useSelector((state) => state.payments?.sendMoneyRes);

  useEffect(() => {
    if (tnxrefid?.id) {
      setCurrentState("response");
    }
  }, [tnxrefid]);

  // useEffect(() => {
  //   setIsActivated(complianceStatus === "COMPLETED");
  // }, []);
  useEffect(() => {
    if (beneficiaryName != null && beneficiaryHashId != null) {
      if (platform === "awx"){
        setCurrentState("awx");
        dispatch(
          paymentreducer.setPayload({
            ...payload,
            beneficiary_id: beneficiaryHashId,
            benificiaryname: beneficiaryName,
            beneficiaryAccountNumber: beneficiaryAccountNumber,
            destinationCurrency: destinationCurrency,
            // sourceCurrency: destinationCurrency,
            sourceOfFunds: "Corporate Account",
          })
        );
      }
      else{
        setCurrentState("amount");
        dispatch(
          paymentreducer.setPayload({
            ...payload,
            id: beneficiaryHashId,
            benificiaryname: beneficiaryName,
            beneficiaryAccountNumber: beneficiaryAccountNumber,
            destinationCurrency: destinationCurrency,
            // sourceCurrency: destinationCurrency,
            sourceOfFunds: "Corporate Account",
          })
        );
      }
      // setPayload({
      // });
    }
  }, [customerHashId]);

  if (
    (!status ||
      status === "inactive" ||
      status === "sub01" ||
      status === "sub02") &&
    isActivated &&
    platform !== "awx"
  ) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Send Money",
            img: "/arrows/arrowLeft.svg",
            backurl: "/payments",
            info: true,
          }}
        />

        <CompareAllPlans />
      </>
    );
  }

  if (status === "canceled" && isActivated && platform !== "awx") {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Send Money",
            img: "/arrows/arrowLeft.svg",
            backurl: "/payments",
            info: true,
          }}
        />
        <ManageSubscription />
      </>
    );
  }

  if (complianceStatus_awx != "COMPLETED" && platform === "awx"  ) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Send Money",
            img: "/arrows/arrowLeft.svg",
            backurl: "/payments",
            info: true,
          }}
        />

        <ActivateAccount />
      </>
    );
  }

  if (complianceStatus?.toLowerCase() != "completed" && platform !== "awx") {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Send Money",
            img: "/arrows/arrowLeft.svg",
            backurl: "/payments",
            info: true,
          }}
        />
        <div className="d-flex ">
          <div className="m-3 w-100">
            <div className="row bg-white border p-4 d-flex rounded-3 w-100">
              <div
                className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3"
                style={{ padding: "5rem 9rem" }}>
                <div
                  className="rounded-circle bg-light-primary mx-auto mb-3"
                  style={{ marginTop: "30px" }}>
                  <img
                    src="/locked.svg"
                    style={{ marginTop: "10px" }}
                    width={100}
                  />
                </div>
                <h4
                  className="text-center"
                  style={{
                    fontSize: "18px",
                    lineHeight: "25px",
                    marginTop: "-15px",
                  }}>
                  Your account verification is currently in process. Please
                  await further updates on your
                  <Link
                    to="/onboarding/Home"
                    style={{ color: "#327e9d", textDecoration: "none" }}>
                    {" compliance process"}
                  </Link>
                  .
                </h4>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BreadCrumbs
        data={{
          name: "Send Money",
          img: "/arrows/arrowLeft.svg",
          backurl: "/payments",
          info: true,
        }}
      />

      {currentState === "awx" && (
        // <div className="w-50 mx-auto my-5">
        <Box
          sx={{
            width: "50%",
            mx: "auto",
            my: 2,
            maxHeight: 600,
            overflow: "auto",
          }}>
          <EmbededPayment beneficiaryHashId={payload.beneficiary_id} />
          {/* <button
            type="button"
            className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 mt-4 py-2 fw-500"
            onClick={async () => {
              const obj = await embeded.submit();
            
              if (obj) {
                dispatch(paymentreducer.setPayload({...payload,obj}));

                setCurrentState("additionalinfo");
                
                console.log("payload", payload);
              } else {
                // Handle errors using the error code
                console.log(errors);
              }
            }}>
            Next
          </button> */}

          <div className="d-flex justify-content-between gap-3 mt-4">
            <button
              type="button"
              className="btn btn-secondary w-100 d-flex align-items-center justify-content-center rounded-5 py-2 fw-500"
              onClick={() => {
                 dispatch(
                      paymentreducer.resetPayload({})
                    );
                // Handle back navigation
                setCurrentState("recipient"); // change "previousState" to your actual previous state key
              }}>
              Back
            </button>

            <button
              type="button"
              className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 py-2 fw-500"
              onClick={async () => {
                const obj = await embeded.submit();

                if (obj) {
                  dispatch(paymentreducer.setPayload({ ...payload, obj }));
                  dispatch(paymentreducer.setPurposeCodeList(obj.additionalInfo.reason))
                  setCurrentState("additionalinfo");

                  console.log("payload", payload);
                } else {
                  console.log(errors);
                }
              }}>
              Next
            </button>
          </div>
        </Box>
      )}

      {currentState === "recipient" && (
        <Recipient
          beneficiaries={beneficiaries}
          customerHashId={customerHashId}
          setCurrentState={setCurrentState}
          beneficiaryName={beneficiaryName}
          beneficiaryHashId={beneficiaryHashId}
          payoutMethod={payoutMethod}
          beneficiaryAccountNumber={beneficiaryAccountNumber}
          // setSelectedBeneficiary={setSelectedBeneficiary}
        />
      )}

      {currentState === "overview" && (
        <OverView
          setCurrentState={setCurrentState}
          // selectedBeneficiary = {selectedBeneficiary}
        />
      )}

      {currentState === "response" && (
        <Response
          setCurrentState={setCurrentState}
          // selectedBeneficiary={selectedBeneficiary}
          // setSelectedBeneficiary={setSelectedBeneficiary}
        />
      )}

      {currentState === "amount" && (
        <Amount
          currency={sourceCurrency}
          setCurrentState={setCurrentState}
          // selectedBeneficiary={selectedBeneficiary}
          // setSelectedBeneficiary={setSelectedBeneficiary}
        />
      )}

      {currentState === "additionalinfo" && (
        <TransferDetailsForm
          purposeCodeList={purposeCodeList}
          setCurrentState={setCurrentState}
        />
      )}
    </>
  );
}

export default SendMoney;
