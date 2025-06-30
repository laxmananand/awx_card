import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "../css/alert.css";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../../@redux/action/onboardingAction.js";
import {
  setCurrentPage,
  setShowTab,
} from "../../../../../@redux/features/onboardingFeatures.js";

function AlertMKYC() {
  const modalRef = useRef(null);

  const dispatch = useDispatch();

  var internalBusinessId = useSelector(
    (state) => state.onboarding?.UserStatusObj?.internalBusinessId
  );
  const [region, setRegion] = useState(sessionStorage.getItem("region"));

  const customerHashId =
    useSelector(
      (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
    ) || "";
  const clientId =
    useSelector((state) => state.onboarding?.UserOnboardingDetails?.clientId) ||
    "";
  const complianceStatus =
    useSelector((state) => state.onboarding?.complianceStatus) || "";

  const [generateBody, setGenerateBody] = useState("default");

  const [generateFooter, setGenerateFooter] = useState("defaultFooter");

  //TC Content
  const [tcVersion, setTCVersion] = useState("");
  const [tcName, setTCName] = useState("");
  const [tcContent, setTCContent] = useState("");

  //Response Modal Content
  const [fail, setFail] = useState(false);
  const [onboardStatus, setOnboardStatus] = useState("error");

  useEffect(() => {}, [generateBody, generateFooter]);
  //Tabs Starting
  const Default = () => {
    return (
      <>
        <div id="modal-body-text">
          Form submitted! We're excited to have you on board. Would you like to
          proceed with our Terms & Conditions?
        </div>
      </>
    );
  };

  const Loader = () => {
    return (
      <>
        <div
          className=" d-flex justify-content-center align-items-center"
          id="modal-body-loader"
        >
          <img src="/preloader.gif" alt="" className="w-100" />
        </div>
      </>
    );
  };

  const ResponseModal = () => {
    return (
      <>
        <div className="text-center" id="modal-body-response">
          <>
            <div
              className=" d-flex justify-content-center align-items-center"
              id="success-text"
            >
              <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
                <img src="/success.gif" alt="" width="50" className="" />

                <span
                  className="w-100 text-center opacity-75"
                  style={{
                    fontSize: "18px",
                  }}
                >
                  🎉 Welcome Onboard!
                </span>
                <span
                  style={{
                    fontSize: "15px",
                  }}
                  className="w-100 text-center opacity-75"
                >
                  Your application has been submitted successfully. Please wait
                  for approval and verification.
                </span>
              </div>
            </div>
          </>
        </div>
      </>
    );
  };

  const TCcontainer = () => {
    return (
      <>
        <div className=" text-center" id="modal-body-response-2">
          <input type="hidden" id="tCname" value={tcName} />
          <input type="hidden" id="tCversion" value={tcVersion} />
          <div
            id="tChtmlContent"
            style={{
              fontSize: "15px",
              overflowY: "auto",
              overflowX: "auto",
              height: "350px",
              padding: "5px 30px",
            }}
            dangerouslySetInnerHTML={{ __html: tcContent }}
          />
        </div>
      </>
    );
  };

  const ProceedKyc = () => {
    return (
      <>
        <button
          type="button"
          className="btn btn-primary success"
          id="proceedKycBtn"
          onClick={OnboardMKYCUser}
        >
          Agree & Proceed
        </button>
      </>
    );
  };

  const DefaultFooter = () => {
    return (
      <>
        <button
          type="button"
          className="btn btn-primary success"
          id="proceedKycBtn"
          onClick={showTCs}
        >
          Show
        </button>
      </>
    );
  };

  //Tabs Ending

  const showTCs = async () => {
    setGenerateBody("loader");
    const obj = await dispatch(actions.ShowTCS());
    if (obj.description) {
      setTCName(obj.name);
      setTCVersion(obj.versionId);
      setTCContent(obj.description);
      setGenerateBody("tcContainer");
      setGenerateFooter("proceedKyc");
    }
  };

  const OnboardMKYCUser = async () => {
    setGenerateBody("loader");
    setGenerateFooter(false);

    let body = {
      customerHashId: customerHashId,
      brn: internalBusinessId,
      region: region,
      clientId: clientId,
      complianceStatus: complianceStatus,
    };

    const obj = await dispatch(actions.PostEKYC(body));
    if (obj.onboardingStatus === "SUCCESS" && obj.status === "Failed") {
      let message = obj?.message;
      if (
        message ===
        "Your application has been initiated and is currently under review"
      ) {
        setFail(obj?.message);
        setOnboardStatus("under_review");
      }
      setGenerateBody("responseModal");
    } else if (obj.onboardingStatus === "SUCCESS" && obj.status !== "Failed") {
      setOnboardStatus("success");
      setGenerateBody("responseModal");
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.click();
        }
        dispatch(setCurrentPage(5));
        dispatch(setShowTab(2));
      }, 5000);
    } else {
      let message = obj?.response?.data?.message;

      if (
        message ===
        "Your application has been initiated and is currently under review"
      ) {
        setFail(obj?.response?.data?.message);
        setOnboardStatus("under_review");
      } else {
        setFail(obj?.response?.data?.message);
        setOnboardStatus("error");
      }

      setGenerateBody("responseModal");
    }
  };
  return (
    <>
      {/* Button trigger modal */}
      <button
        type="button"
        id="MKYCopenAlertModalBtn"
        data-bs-toggle="modal"
        data-bs-target="#MKYCAlertModal"
        style={{ display: "none" }}
      ></button>
      {/* Modal */}
      <div
        className="modal fade"
        id="MKYCAlertModal"
        tabIndex={-1}
        aria-labelledby="AddNewAccountModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ width: "650px" }}
        >
          <div className="modal-content">
            <div className="modal-header p-3">
              <h5 className="modal-title h5-custom" id="MKYCexampleModalLabel">
                <img src="/bell.png" alt="" width="30" />
                You're all set!
              </h5>
            </div>
            <div className="modal-body">
              {generateBody === "default" ? (
                <Default />
              ) : generateBody === "loader" ? (
                <Loader />
              ) : generateBody === "responseModal" ? (
                <ResponseModal />
              ) : generateBody === "tcContainer" ? (
                <TCcontainer tcContent={tcContent} />
              ) : (
                <></>
              )}
            </div>

            <div className="modal-footer p-1" id="t&CButtonsDiv">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={modalRef}
                onClick={() => modalRef.current.hide()}
              >
                Close
              </button>
              {generateFooter === "defaultFooter" ? (
                <DefaultFooter />
              ) : generateFooter === "proceedKyc" ? (
                <ProceedKyc />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AlertMKYC;
