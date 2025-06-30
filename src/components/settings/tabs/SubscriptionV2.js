import React, { useEffect, useState } from "react";
import SideBar from "../../SideBar.js";
import BreadCrumbs from "../../structure/BreadCrumbs.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSubscription,
} from "../../../@redux/action/subscription.js";
import CompareAllPlans from "../../Signup/pages/CompareAllPlans.js";
import dayjs from "dayjs";
import { setClientSecret } from "../../../@redux/features/subscription.js";
import { closeLoader, openLoader } from "../../../@redux/features/common.js";
import ManageSubscription from "./Subscription/ManageSubscription.js";

function SubscriptionDetails() {
  const dispatch = useDispatch();
  const location = useLocation();
  const status = useSelector(
    (state) => state.subscription?.planDetails?.status
  );
  const subscriptionData = useSelector(
    (state) => state.subscription.data
  );
  const [isActivated, setIsActivated] = useState(false);

  const complianceStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
  );

  useEffect(() => {
    setIsActivated(complianceStatus === "COMPLETED");
  }, []);

  useEffect(() => {
    dispatch(getSubscription())
    dispatch(setClientSecret(""));
  }, []);

  useEffect(() => {
    if (status || !isActivated) {
      dispatch(closeLoader());
    } else {
      dispatch(openLoader());
    }
  }, [status]);

  return (
    <div className="bg-white h-100">
      <BreadCrumbs
        data={{
          name: "Subscription",
          img: "/arrows/arrowLeft.svg",
          backurl: "/settings",
          info: true,
        }}
      />

      {isActivated && status && (
        <>
          {status !== "INACTIVE" &&
            (status === "canceled" || status === "active") ? (
            <ManageSubscription />
          ) : (
            <CompareAllPlans />
          )}
        </>
      )}

      {!subscriptionData?.isEligible && (
        <CompareAllPlans hideButton={true} />
      )}
    </div>
  );
}

export default SubscriptionDetails;
