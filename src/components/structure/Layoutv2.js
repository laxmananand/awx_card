import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardHeader from "../../@component_v2/DashboardHeader";
import Axios from "axios";
import { setCustomerHashId } from "../../@redux/features/common";
import { useLocation } from "react-router-dom";

function Layoutv2({ children }) {
  const [showHeader, setShowHeader] = useState(false);
  const [kycStatus, setKycStatus] = useState("NOT_STARTED");
  const expanded = useSelector((state) => state.common.expanded);

  const subStatus = useSelector((state) => state.subscription?.data?.status);

  const showSidebar = useSelector((state) => state.auth.showSidebar);

  const dispatch = useDispatch();

  const FetchUserStatus = useSelector(
    (state) => state.onboarding?.UserStatusObj
  );
  const KycStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM
  );
  const platform = useSelector((state) => state.common.platform);
  const rfiDetails = useSelector((state) => state.onboarding.rfiDetails);

  useEffect(() => {
    const SetPage = async () => {
      if (FetchUserStatus?.userStatus === "C") {
        if (KycStatus?.complianceStatus !== "COMPLETED") {
          setShowHeader(true);
          setKycStatus(KycStatus?.complianceStatus);
        } else {
          if (platform === "awx") {
            if (rfiDetails && rfiDetails.length > 0) {
              // Get all { type, status } pairs
              const typeStatusPairs = rfiDetails.map((item) => ({
                type: item.type,
                status: item.status,
              }));

              // Check if every status is CLOSED
              const allClosed = typeStatusPairs.every(
                (entry) => entry.status === "CLOSED"
              );

              console.log("All RFIs closed?", allClosed);
              console.log("Types and statuses:", typeStatusPairs);

              if (allClosed) {
                setShowHeader(false);
              } else {
                setShowHeader(true);
              }
            }
          } else if (subStatus && subStatus === "active") {
            setShowHeader(false);
          } else {
            setShowHeader(true);
          }

          setKycStatus(KycStatus?.complianceStatus);
        }

        if (location.pathname === "/onboarding/Home") {
          setShowHeader(false);
        }
      } else {
        if (location.pathname === "/onboarding/Home") {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
      }
    };

    SetPage();
  }, [FetchUserStatus, KycStatus, subStatus, location.pathname]);

  return (
    <>
      {showHeader ? (
        <>
          {/* <DashboardHeader
            complianceStatus={kycStatus}
            subStatus={subStatus}
            setShowHeader={setShowHeader}
          /> */}
        </>
      ) : (
        <></>
      )}

      <div
        className="dashboard-component"
        style={{
          marginLeft: expanded ? "220px" : "100px",
        }}
      >
        <div>{children}</div>
      </div>

      {/* <div className='position-absolute bottom-0 end-0' onMouseEnter={maximise} onMouseLeave={minimize}>
                <iframe src="https://zoqq-bot.vercel.app/chat" width={width} height={height} className='mx-5 my-3 border rounded-4' />
            </div> */}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          zIndex: 9999,
          background: "black",
          padding: "3px 5px",
          color: "white",
          fontSize: 12,
          fontWeight: 300,
        }}
      >
        By using these payment services, you agree to T&Cs{" "}
        <a
          href="https://nb0syzexil2forkl.public.blob.vercel-storage.com/Privacy%20Policy_Zoqq_Ver1.0%20%281%29-XQjJJj7JygEcp2GSke490Emnoo5mEK.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
        >
          here
        </a>
      </div>
    </>
  );
}

export default Layoutv2;
