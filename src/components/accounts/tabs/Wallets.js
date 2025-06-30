import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import EachCurrenciesWallets from "./Wallets/EachCurrenciesWallets";

import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WalletsFetchSkeleton from "../../../loading_Skeleton/walletsLoadSkeleton.js";
import "react-toastify/dist/ReactToastify.css";

import "../css/accounts.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrencyList,
} from "../../../@redux/action/accounts";
import { Link } from "react-router-dom";
import ActivateAccount from "../../ActivateAccount.js";
import CompareAllPlans from "../../Signup/pages/CompareAllPlans.js";
import ManageSubscription from "../../settings/tabs/Subscription/ManageSubscription.js";

function Wallets() {
  const [showDetails, setShowDetails] = useState(false);
  const currencies = useSelector((state) => state.accounts.currencyList);
  const [showArray, setShowArray] = useState(
    new Array(currencies.length).fill(false)
  );
  const [activeArray, setActiveArray] = useState(
    new Array(currencies.length).fill(false)
  );
  const type = useSelector((state) => state.accounts.currentType);
  const isLoading = useSelector((state) => state.accounts.isLoading);

  const dispatch = useDispatch();

  
  const subStatus = useSelector((state) => state.subscription?.data?.status);
  const complianceStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
  );

  // wallet sorting based on amount and wallet length

  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const sortedCurrencies = [...currencies].sort((a, b) => Number(b.balance || 0) - Number(a.balance || 0));
  const filteredCurrencies = sortedCurrencies.filter((currency) =>
    currency.name?.toLowerCase().includes(searchTerm.toLowerCase()) 
  );
  
  const visibleCurrencies = showAll
    ? filteredCurrencies
    : filteredCurrencies.slice(0, 10);

  

  

  // AWX Account ID / Business ID
    const awxAccountId = useSelector((state) => state.auth.awxAccountId);    

  if (!complianceStatus) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Wallets",
            img: "/arrows/arrowLeft.svg",
            backurl: "/accounts",
            info: true,
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
            name: "Wallets",
            img: "/arrows/arrowLeft.svg",
            backurl: "/accounts",
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
              name: "Wallets",
              img: "/arrows/arrowLeft.svg",
              backurl: "/accounts",
              info: true,
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
              name: "Wallets",
              img: "/arrows/arrowLeft.svg",
              backurl: "/accounts",
              info: true,
            }}
          />
          <ManageSubscription />
        </>
      );
    } else {
      useEffect(() => {
        if (!showDetails)
          setShowArray(new Array(currencies.length).fill(false));
        setActiveArray(new Array(currencies.length).fill(false));
      }, [showDetails?.show]);

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

// Get Currency List and Balances for AWX

  useEffect(() => {
      dispatch(getCurrencyList(awxAccountId));

  }, []);

//...............xxx..............

return (
  <>
    <BreadCrumbs
      data={{
        name: "Wallets",
        img: "/arrows/arrowLeft.svg",
        backurl: "/accounts",
        info: true,
      }}
    />

    <div className="d-flex ustify-content-center">
      <div className="m-3 w-100">
       <div className="bg-white border p-4 rounded-5 shadow w-100">
       <div className="p-3 w-100">
       <div className="mb-4">
        <input
        type="text"
        className="form-control rounded-5 px-4 py-2"
        placeholder="Search by currency code"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
       </div>

            <SkeletonTheme baseColor="#E0E0E0" highlightColor="#D4F1F4">
              {isLoading ? (
                 <div className="w-100"
                 style={{
                 display: "grid",
                 gridTemplateColumns: "repeat(250px, 1fr)", //5 eaqual columns
                 gap: "15px",
                 overflowY: "auto",
                 maxHeight: "525px",
                 }}
                 >    
                  <WalletsFetchSkeleton />
                  <WalletsFetchSkeleton />
                  <WalletsFetchSkeleton />
                  <WalletsFetchSkeleton />
                  <WalletsFetchSkeleton />
                  
                </div>
              ) : (
                <div className="w-100"
                  style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", //5 eaqual columns
                  gap: "15px",
                  overflowY: "auto",
                  maxHeight: "525px",
                }}
                >
                {visibleCurrencies.map((currency, index) => (

                    <EachCurrenciesWallets
                      key={index}
                      type={currency?.name}
                      data={currency}
                      index={index}
                      isActivated={true}
                      setShowDetails={setShowDetails}
                      showArray={showArray}
                      handleShow={handleShow}
                      handleActive={handleActive}
                      activeArray={activeArray}
                      cardActivated={true}
                    />
                  ))}

                </div>
              )}
              {sortedCurrencies.length > 10 && (
                <div className="d-flex justify-content-center align-items-center text-center mt-4 w-100">
                 <button
                  className="btn btn-action rounded-5 fw-bold"
                  onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "Show Less ▲" : "Show All ▼"}
                </button>
                </div>
              )}
            </SkeletonTheme>
          </div>
        </div>
      </div>
    </div>
  </>
);
    }
  }
}
export default Wallets;
