import React, { useState, useEffect } from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import DetailsBar from "./Transactions/DetailsBar";
import CreateNewRequest from "./ReceiveMoney/CreateNewRequest";
import TransactionList from "./Transactions/TransactionList";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
//import { transactionDetailsPayments } from "../../../data/accounts/globalAccounts"
import CompareAllPlans from "../../Signup/pages/CompareAllPlans.js";
import ActivateAccount from "../../ActivateAccount.js";
import ManageSubscription from "../../settings/tabs/Subscription/ManageSubscription.js";

function Transactions() {
  const [showDetails, setShowDetails] = useState(false);
  const currencies = [true, true, true, true, false, false];
  const [showArray, setShowArray] = useState(
    new Array(currencies.length).fill(false)
  );
  const [activeArray, setActiveArray] = useState(
    new Array(currencies.length).fill(false)
  );
  //const [transactionsDetails, setTransactionDetails] = useState();

  const status = useSelector((state) => state.subscription?.data?.status );
  const complianceStatus = useSelector((state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus);
  // const [isActivated, setIsActivated] = useState(false);

  // useEffect(() => {
  //   setIsActivated( complianceStatus === "COMPLETED");
  // }, []);

  const handleShow = (idx) => {
    const array = new Array(currencies.length).fill(false);
    array[idx] = true;
    setShowArray(array);
  };

  const handleActive = (idx) => {
    const array = new Array(currencies.length).fill(false);
    array[idx] = true;
    setActiveArray(array);
  };

  if (!complianceStatus) {
    return (
      <>
      <BreadCrumbs
        data={{
          name: "Transaction",
          img: "/arrows/arrowLeft.svg",
          backurl: "/accounts",
          info: true,
        }}
      />
       <ActivateAccount/>
      </>
    )
  }
  else if (complianceStatus !== "COMPLETED") {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Transaction",
            img: "/arrows/arrowLeft.svg",
            backurl: "/accounts",
            info: true,
          }}
        />
           <div className='d-flex '>
        <div className='m-3 w-100'>
          <div className='row bg-white border p-4 d-flex rounded-3 w-100'>
      <div
            className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3"
            style={{ padding: "5rem 9rem" }}
          >
            
            <div className="rounded-circle bg-light-primary mx-auto mb-3" style={{marginTop: "30px"}}>
              <img src="/locked.svg" style={{marginTop: "10px"}} width={100} />
            </div>
            <h4 className="text-center" style={{ fontSize: "18px", lineHeight: "25px" , marginTop: "-15px"}}>
            Your account verification is currently in process.
            Please await further updates on your
            <Link to="/onboarding/Home" style={{ color: "#327e9d", textDecoration: "none" }}>
                {" compliance process"}
            </Link>.
            </h4>
          </div>
            </div>
          </div>
        </div>
      </>
    );
  }
else{
  if (!status ||
    status === "inactive" ||
    status === "sub01" ||
    status === "sub02" ) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Transaction",
            img: "/arrows/arrowLeft.svg",
            backurl: "/accounts",
            info: true,
          }}
        />

          <CompareAllPlans/>
         
      </>
    );
  }
  if ((status === "canceled" )) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Transaction",
            img: "/arrows/arrowLeft.svg",
            backurl: "/accounts",
            info: true,
          }}
        />
            <ManageSubscription/>
      </>
    );
  }
  else{

  return (
    <>
      <BreadCrumbs
        data={{
          name: "Transactions",
          img: "/arrows/arrowLeft.svg",
          backurl: "/accounts",
          info: true,
        }}
      />

      <div className="d-flex">
        <div className="row m-3 bg-white border p-4 d-flex rounded-3 flex-fill">
          <div className="p-3 d-flex flex-column align-items-baseline" style={{marginTop: "-18px"}}>
            <img
              src="/refresh_gray.svg"
              className={"bg-grey p-3 rounded-5 border d-block"}
            />
          </div>

          <TransactionList setShowDetails={setShowDetails} />
        </div>

        {showDetails && (
          <DetailsBar
            setShowDetails={setShowDetails}
            handleShow={handleShow}
            handleActive={handleActive}
            showDetails={showDetails}
          />
        )}
      </div>
    </>
  );
}
}
}

export default Transactions;
