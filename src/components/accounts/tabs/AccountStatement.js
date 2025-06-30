import React from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import Form from "./AccountStatement/Form";
import RecentTransactions from "../../structure/RecentTransactions/RecentTransactions";
import RecentTransactionV2 from "../../../@component_v2/RecentTransaction";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ActivateAccount from "../../ActivateAccount.js";
import CompareAllPlans from "../../Signup/pages/CompareAllPlans.js";
import ManageSubscription from "../../settings/tabs/Subscription/ManageSubscription.js";

function AccountStatement() {
  const subStatus = useSelector((state) => state.subscription?.data?.status);
  const complianceStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
  );

  if (!complianceStatus) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Account Statement",
            img: "/arrows/arrowLeft.svg",
            backurl: "/accounts",
          }}
        />
        <ActivateAccount />
      </>
    );
  } else if (complianceStatus !== "COMPLETED") {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Account Statement",
            img: "/arrows/arrowLeft.svg",
            backurl: "/accounts",
          }}
        />

        <div className="d-flex ">
          <div className="m-3 w-100">
            <div className="row bg-white border p-4 d-flex rounded-3 w-100">
              <div
                className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3"
                style={{ padding: "5rem 9rem" }}
              >
                <div
                  className="rounded-circle bg-light-primary mx-auto mb-3"
                  style={{ marginTop: "30px" }}
                >
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
                  }}
                >
                  Your account verification is currently in process. Please
                  await further updates on your
                  <Link
                    to="/onboarding/Home"
                    style={{ color: "#327e9d", textDecoration: "none" }}
                  >
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
  } else {
    if (
      !subStatus ||
      subStatus === "inactive" ||
      subStatus === "sub01" ||
      subStatus === "sub02"
    ) {
      return (
        <>
          <BreadCrumbs
            data={{
              name: "Account Statement",
              img: "/arrows/arrowLeft.svg",
              backurl: "/accounts",
            }}
          />

          <CompareAllPlans />
        </>
      );
    } else if (subStatus === "canceled") {
      return (
        <>
          <BreadCrumbs
            data={{
              name: "Global Accounts",
              img: "/arrows/arrowLeft.svg",
              backurl: "/accounts",
              info: true,
            }}
          />
          <ManageSubscription />
        </>
      );
    } else {
      return (
        <>
          <BreadCrumbs
            data={{
              name: "Account Statement",
              img: "/arrows/arrowLeft.svg",
              backurl: "/accounts",
            }}
          />

          <div className="row">
            <div className="col-12 col-lg-7 p-3">
              <div className="m-3 bg-white p-5 border rounded-5 shadow">
                {/* <img src="/accounts/accountStatement.svg" className={'p-3 rounded-circle bg-light-primary d-block'} />
                <h5 className='m-0 mt-3 d-inline-block'>What period do you want to receive the statement?</h5> */}
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-light-primary">
                    <img
                      src="/accounts/accountStatement.svg"
                      style={{ padding: "10px" }}
                      width={50}
                    />
                  </div>
                  <p
                    className="h5 m-0 ms-2 d-inline-block"
                    style={{
                      fontWeight: 700,
                      fontSize: "25px",
                    }}
                  >
                    What period do you want to receive the statement?
                  </p>
                </div>
                <Form />
              </div>
            </div>

            <div className="col-12 col-lg-5 p-3">
              <div className="m-3">
                <RecentTransactions />
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}

export default AccountStatement;
