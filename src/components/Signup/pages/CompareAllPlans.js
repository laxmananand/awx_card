import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as functions from "../js/subscription.js";
import { useDispatch, useSelector } from "react-redux";
import { getSubscriptionPlanDetails } from "../../../@redux/action/subscription.js";

function CompareAllPlans() {
  const dispatch = useDispatch();
  const features = useSelector((state) => state.subscription.planDetails);
  const showButton = useSelector(
    (state) => state.subscription.data?.isEligible
  );

  const [select, setSelect] = useState("pro");
  const [litePrice, setLitePrice] = useState("0.00"); // Default price for Lite
  const [proPrice, setProPrice] = useState("0.00"); // Default price for Pro

  // Fetch subscription details on mount
  useEffect(() => {
    dispatch(getSubscriptionPlanDetails());
  }, [dispatch]);

  // Extract prices dynamically
  useEffect(() => {
    if (features && features.length) {
      // Find the Lite and Pro plan prices
      const liteFeature = features.find((item) => item.plan_id === 1);
      const proFeature = features.find((item) => item.plan_id === 2);

      if (liteFeature) setLitePrice(`$${liteFeature.plan_price}`);
      if (proFeature) setProPrice(`$${proFeature.plan_price}`);
    }
  }, [features]);

  const Features = ({ title }) => {
    return (
      <div className="my-4 fw-normal d-flex align-items-center">
        <img src="/auth/exclamation.svg" className="me-2 my-1" /> {title}
      </div>
    );
  };

  const Lite = ({ lite, selected }) => {
    return (
      <div className="my-4 fw-normal d-flex justify-content-center ">
        <img
          className="my-1"
          src={
            lite
              ? "/auth/yellowTick.svg"
              : selected
              ? "/auth/red-cross-circle.svg"
              : "/auth/cross-circle.svg"
          }
        />
      </div>
    );
  };

  const Pro = ({ pro }) => {
    return (
      <div className="my-4 fw-normal d-flex justify-content-center">
        <img
          className="my-1"
          src={pro ? "/auth/blueTick.svg" : "/auth/cross-circle.svg"}
        />
      </div>
    );
  };

  return (
    <div className="w-100 d-flex align-items-center my-5">
      <div className="bg-white p-5 mx-auto w-75 rounded-5 shadow">
        {/* <Link to="/signup/account-setup" className='text-decoration-none d-flex mb-3'><img src="/auth/arrowrightshort.svg" /><p className='text-dark m-0 ms-1 fw-normal'>Back</p></Link> */}

        <div className="d-flex">
          <div className="w-100 px-3">
            <h5 className="fw-600 pt-3">EXPLORE ZOQQ</h5>
            <p className="fw-normal">Explore our system and its features</p>
            <hr style={{ opacity: "10%" }} />

            {features?.map((feature, key) => (
              <Features key={key} title={feature.features_name} />
            ))}
          </div>

          <div
            className={
              "w-50 p-3" + (select === "lite" ? " shadow rounded-5" : "")
            }
            onClick={() => setSelect("lite")}
            role="button"
          >
            <div className="d-flex align-items-center">
              <div>
                <img
                  src="/auth/lite.svg"
                  className="bg-yellow10 p-2 mb-2 me-3 rounded-4"
                />
              </div>
              <div>
                <p className="m-0 yellow100 fw-normal">Business</p>
                <h5 className="m-0">Lite</h5>
              </div>
            </div>
            <hr style={{ opacity: "10%" }} />

            {features?.map((feature, key) => (
              <Lite
                key={key}
                lite={feature.plan_id == 1}
                selected={select === "lite"}
              />
            ))}

            {showButton && (
              <Link
                to="/checkout"
                className="btn bg-yellow100 text-white fw-500 w-100 py-3 rounded-4"
                state={{
                  id: "lite",
                }}
              >
                START FOR {litePrice}
              </Link>
            )}
          </div>

          <div
            className={
              "w-50 p-3" + (select === "pro" ? " shadow rounded-5" : "")
            }
            onClick={() => setSelect("pro")}
            role="button"
          >
            <div className="d-flex align-items-center">
              <div>
                <img
                  src="/auth/pro.svg"
                  className="bg-blue10 p-2 mb-2 me-3 rounded-4"
                />
              </div>
              <div>
                <p className="m-0 blue100 fw-normal">Business</p>
                <h5 className="m-0">Pro</h5>
              </div>
            </div>
            <hr style={{ opacity: "10%" }} />

            {features?.map((feature, key) => (
              <Pro
                key={key}
                pro={feature.plan_id == 1 || feature.plan_id == 2}
              />
            ))}

            {showButton && (
              <Link
                to="/checkout"
                className="btn bg-blue100 text-white fw-500 w-100 py-3 rounded-4"
                state={{
                  id: "pro",
                }}
              >
                START FOR {proPrice}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareAllPlans;
