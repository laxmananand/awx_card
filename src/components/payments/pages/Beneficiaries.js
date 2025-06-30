import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import DetailsBar from "./Beneficiaries/DetailsBar";
import CreateNewBeneficiary from "./Beneficiaries/CreateNewBeneficiary";
import { useDispatch, useSelector } from "react-redux";

import ColumnGroupingTable from "../../../components/payments/pages/utilities/ColumnGroupingTable";
import Listbeneficiary_Skeleton from "../../../loading_Skeleton/Listbeneficiary_Skeleton.js";
import ActiveAccount from "../../ActivateAccount.js";
import CompareAllPlans from '../../Signup/pages/CompareAllPlans.js';
import ManageSubscription from "../../settings/tabs/Subscription/ManageSubscription.js";
import { Link } from "react-router-dom";
function Beneficiaries() {
  const [showDetails, setShowDetails] = useState(false);
  const currencies = [true, true, true, true, false, false];
  // const beneficiaries = useSelector((state) => state.payments.beneficiaryList);
// const beneficiaryList_awx = useSelector((state)=> state.payments.beneficiaryList_awx);
  const platform = useSelector((state) => state.common.platform);
  
  const beneficiaries = useSelector((state) => {
    if (platform === "awx") {
      return state.payments.beneficiaryList_awx; // Make sure this exists in your reducer
    } else {
      return state.payments.beneficiaryList; // fallback or other platform list
    }
  });

 

  const isLoading = useSelector((state) => state.payments.isLoading);

  let complianceStatus =  useSelector((state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus);
 
  let complianceStatus_awx = useSelector((state)=> state.onboarding?.complianceStatus)

  let customerHashId = useSelector((state) => state.onboarding?.UserOnboardingDetails?.customerHashId);
  


  const status = useSelector(
    (state) => state.subscription?.data?.status
  );
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    setIsActivated(complianceStatus === "COMPLETED");
  }, []);

  const handleShow = (idx) => {
    const array = new Array(currencies.length).fill(false);
    array[idx] = true;
  };

  const handleActive = (idx) => {
    const array = new Array(currencies.length).fill(false);
    array[idx] = true;
  };

  if (complianceStatus_awx != "COMPLETED" && platform === "awx"  ) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Beneficiaries",
            img: "/arrows/arrowLeft.svg",
            backurl: "/payments",
            info: true,
          }}
        />

         <ActiveAccount/>
       </>
     );
   }

  if (complianceStatus?.toLowerCase() != "completed" && platform !== "awx") {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Beneficiaries",
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
  }

  if (( !status ||
    status === "inactive" ||
    status === "sub01" ||
    status === "sub02") && isActivated && platform !== "awx" ) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Beneficiaries",
            img: "/arrows/arrowLeft.svg",
            backurl: "/payments",
            info: true,
          }}
        />
            <CompareAllPlans/>
      </>
    );
  }

  if ((status === "canceled" ) && isActivated && platform !== "awx" ) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Beneficiaries",
            img: "/arrows/arrowLeft.svg",
            backurl: "/payments",
            info: true,
          }}
        />
            <ManageSubscription/>
      </>
    );
  }

  

  return (
    <>
      <BreadCrumbs
        data={{
          name: "Beneficiaries",
          img: "/arrows/arrowLeft.svg",
          backurl: "/payments",
          info: true,
        }}
      />

      <div className="d-flex flex-column bd-highlight m-2 mt-2 mb-3 p-4 shadow rounded">

        <div className="d-flex justify-content-between">
          <img
            src="/payments/beneficiaries.svg"
            className={"bg-primary-10 p-3 rounded-circle d-block shadow"}
          />

          <div className="text-white d-flex align-items-center ml-10">
            <CreateNewBeneficiary customerHashId={customerHashId} />
          </div>
        </div>

        {isLoading ? (
          <Listbeneficiary_Skeleton />
        ) : ( 
          <>
          {beneficiaries?.length === 0 ? (
            <>
              <div className="d-flex w-100 justify-content-center"> 
                <img src="/b3.png" alt="add beneficiary" width={300} />
              </div>
              <h3 className="text-center">
                Add your first beneficiary with a few clicks!
              </h3>
            </>
          ) : (
            <div className="d-flex flex-column">
              <ColumnGroupingTable
                beneficiaries={beneficiaries}
                setShowDetails={setShowDetails}
              />
            </div>
          )}
        </>
       )}
      </div>
      
        {showDetails?.show && (
          <DetailsBar
            setShowDetails={setShowDetails}
            data={showDetails?.data}
            handleShow={handleShow}
            handleActive={handleActive}
            color={showDetails?.color}
            customerHashId={customerHashId}
          />
        )}

        
    </>
  );
}

export default Beneficiaries;


