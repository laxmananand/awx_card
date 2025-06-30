import React, { useEffect, useState } from "react";
import EachDayConversion from "./EachDayConversion";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../../../loading_Skeleton/Skeleton.css";
import { recentConversionData } from "../../../../@redux/action/accounts";
import { useDispatch, useSelector } from "react-redux";

function RecentConversion() {
  const transactions = useSelector((state) => state.accounts.conversionHistory);
  const isLoading = useSelector((state) => state.accounts.isLoading);
  const subStatus = useSelector((state) => state.subscription?.data?.status);
  const complianceStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
  );
  const custHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );

   // AWX Account ID / Business ID
    const awxAccountId = useSelector((state) => state.auth.awxAccountId) || "";
    
    const platform = useSelector((state)=>state.common.platform) || "";

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchRecentConversionData() {
      try {
        if(platform === "awx"){
          dispatch(recentConversionData(awxAccountId));
        }
        else{
        dispatch(recentConversionData(custHashId));
        }
      } catch (error) {
        console.error("Error fetching recent conversion data:", error);
      }
    }

    fetchRecentConversionData();
  }, []);

  if (!complianceStatus) {
    return (
      <div
        className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3"
        style={{ padding: "1rem 2rem" }}
      >
        <div
          className="d-flex align-items-center"
          style={{ marginTop: "10px" }}
        >
          <img src="/refresh.svg" />
          <p className="h5 m-0 ms-2">Recent Conversions</p>
        </div>
        <div
          className="rounded-circle bg-light-primary mx-auto mb-3"
          style={{ marginTop: "10px" }}
        >
          <img src="/exchange_2.svg" style={{ padding: "12px" }} width={60} />
        </div>
        <h4
          className="text-center"
          style={{ fontSize: "16px", lineHeight: "25px", marginTop: "-20px" }}
        >
          Ready to explore conversions?{" "}
          <Link to="/onboarding/Home" style={{ color: "#327e9d" }}>
            Activate your account{" "}
          </Link>
          to get started.
        </h4>
      </div>
    );
  } else if (complianceStatus !== "COMPLETED") {
    return (
      <div
        className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3"
        style={{ padding: "1rem 2rem" }}
      >
        <div
          className="d-flex align-items-center"
          style={{ marginTop: "10px" }}
        >
          <img src="/refresh.svg" />
          <p className="h5 m-0 ms-2">Recent Conversions</p>
        </div>
        <div
          className="rounded-circle bg-light-primary mx-auto mb-3"
          style={{ marginTop: "10px" }}
        >
          <img src="/exchange_2.svg" style={{ padding: "12px" }} width={60} />
        </div>
        <h4
          className="text-center"
          style={{ fontSize: "16px", lineHeight: "25px", marginTop: "-20px" }}
        >
          Your account verification is currently in process. Please await
          further updates on your
          <Link
            to="/onboarding/Home"
            style={{ color: "#327e9d", textDecoration: "none" }}
          >
            {" compliance process"}
          </Link>
          .
        </h4>
      </div>
    );
  } else {
    if (subStatus !== "active") {
      return (
        <div
          className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3"
          style={{ padding: "1rem 2rem" }}
        >
          <div
            className="d-flex align-items-center"
            style={{ marginTop: "10px" }}
          >
            <img src="/refresh.svg" />
            <p className="h5 m-0 ms-2">Recent Conversions</p>
          </div>
          <div
            className="rounded-circle bg-light-primary mx-auto mb-3"
            style={{ marginTop: "30px" }}
          >
            <img src="/exchange_2.svg" style={{ padding: "12px" }} width={60} />
          </div>
          <h4
            className="text-center"
            style={{ fontSize: "16px", lineHeight: "25px", marginTop: "-20px" }}
          >
            Streamline your conversions and unlock Zoqq's full potential -{" "}
            <Link to="/settings/subscription" style={{ color: "#327e9d" }}>
              Subscribe now!{" "}
            </Link>
          </h4>
        </div>
      );
    } else {
      if (transactions == "**No recent conversions in the last 7 days**") {
        return (
          <div
            className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3"
            style={{ padding: "1rem 2rem" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div
                className="d-flex align-items-center"
                style={{ marginTop: "10px" }}
              >
                <img src="/refresh.svg" />
                <p className="h5 m-0 ms-2">Recent Conversions</p>
              </div>
              <Link
                to="/payments/transactions"
                className="text-decoration-none grey1"
                style={{ marginTop: "15px" }}
              >
                View All
              </Link>
            </div>
            <SkeletonTheme baseColor="#F0F0F0" highlightColor="#D4F1F4">
              {isLoading ? (
                <div className="recentTransaction">
                  <h5>
                    <hr />
                    <Skeleton width={120} style={{ marginLeft: "-67%" }} />
                  </h5>
                  <h2>
                    <Skeleton />
                  </h2>
                  <h5>
                    <hr />
                    <Skeleton width={120} style={{ marginLeft: "-67%" }} />
                  </h5>
                  <h2>
                    <Skeleton />
                  </h2>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-center">
                    <div>
                      <img
                        src="/no_transactions.jpg"
                        style={{ width: "150px", height: "150px" }}
                      />
                    </div>
                  </div>
                  <p className="text-center" style={{ marginTop: "-25px" }}>
                    <span
                      className="fw-normal"
                      style={{
                        fontSize: "18px",
                        fontStyle: "italic",
                        fontFamily: "system-ui",
                        color: "var(--main-color)",
                      }}
                    >
                      <strong>
                        Oops!<br></br>It seems you haven't been doing any
                        conversions recently.
                      </strong>
                    </span>
                  </p>
                </>
              )}
            </SkeletonTheme>

            {/* <p className='yellow100 text-center mt-5' role='button' onClick={() => recentConversionData(10)}>Show More</p> */}
          </div>
        );
      } else {
        return (
          <div
            className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3"
            style={{ padding: "1rem 2rem" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div
                className="d-flex align-items-center"
                style={{ marginTop: "10px" }} 
              >
                <img src="/refresh.svg" />
                <p className="h5 m-0 ms-2">Recent Conversions</p>
              </div>
              <Link
                to="/payments/transactions"
                className="text-decoration-none grey1"
                style={{ marginTop: "15px" }}
              >
                View All
              </Link>
            </div>
            <br></br>
            <div
              className="flex-fill position-relative h-100 overflow-auto"
              style={{ marginTop: "-40px", maxHeight: "500px" }}
            >
              <SkeletonTheme baseColor="#F0F0F0" highlightColor="#D4F1F4">
                {isLoading && transactions?.length == 0 ? (
                  <div className="recentTransaction">
                    <h5>
                      <hr />
                      <Skeleton width={120} style={{ marginLeft: "-67%" }} />
                    </h5>
                    <h2>
                      <Skeleton />
                    </h2>
                    <h5>
                      <hr />
                      <Skeleton width={120} style={{ marginLeft: "-67%" }} />
                    </h5>
                    <h2>
                      <Skeleton />
                    </h2>
                  </div>
                ) : (
                  transactions?.map((transaction, key) => (
                    <EachDayConversion key={key} data={transaction} />
                  ))
                )}
              </SkeletonTheme>
            </div>

            {/* <p className='yellow100 text-center mt-5' role='button' onClick={() => recentConversionData(20)}>Show More</p> */}
          </div>
        );
      }
    }
  }
}
export default RecentConversion;
