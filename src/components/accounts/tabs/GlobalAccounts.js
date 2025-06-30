import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import EachCurrencies from "../../structure/EachCurrencies";
import DetailsBar from "./GlobalAccounts/DetailsBar";
import { AiFillBank } from "react-icons/ai";
import { getBankAccountForCreate } from "../../../data/accounts/globalAccounts";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AccountsFetchSkeleton from "../../../loading_Skeleton/gloabalAccounts_Skeleton";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import "../css/accounts.css";
import { useDispatch, useSelector } from "react-redux";
import { getBankDetails, getCurrencyList } from "../../../@redux/action/accounts";
import { Link } from "react-router-dom";
import ActivateAccount from "../../ActivateAccount.js";
import CompareAllPlans from "../../Signup/pages/CompareAllPlans.js";
import ManageSubscription from "../../settings/tabs/Subscription/ManageSubscription.js";
import getSymbolFromCurrency from 'currency-symbol-map'

function GlobalAccounts() {
  const [showDetails, setShowDetails] = useState(false);
  const currencies = useSelector((state) => state.accounts.currencyList);
  const [balance, setBalance] = useState(0);
  const [showArray, setShowArray] = useState(
    new Array(currencies.length).fill(false)
  );
  const [activeArray, setActiveArray] = useState(
    new Array(currencies.length).fill(false)
  );
  const bankDetails = useSelector((state) => state.accounts.bankDetails);
  const type = useSelector((state) => state.accounts.currentType);
  const isLoading = useSelector((state) => state.accounts.isLoading);

  const dispatch = useDispatch();

  const [bankAccountForCreate, setBankAccountForCreate] = useState([]);
  const custHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );
  const subStatus = useSelector((state) => state.subscription?.data?.status);
  const complianceStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
  );

  // AWX Account ID / Business ID
    const awxAccountId = useSelector((state) => state.auth.awxAccountId);

    const platform = useSelector((state)=>state.common.platform);
    
// filtered currency dropdown for AWX

const allowedCurrencies = ['AED','AUD', 'BRL', 'CAD', 'DKK', 'EUR', 'GBP', 'HKD', 'IDR', 'ILS', 'MXN', 'NZD', 'SGD', 'USD'];

// Filtered list
const filteredCurrencies = currencies?.filter(currencyObj => 
  allowedCurrencies.includes(currencyObj?.name)
);


  if (!complianceStatus) {
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
        <ActivateAccount />
      </>
    );
  } else if (complianceStatus !== "COMPLETED") {
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
              name: "Global Accounts",
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
      useEffect(() => {
        if (!showDetails)
          setShowArray(new Array(currencies.length).fill(false));
        setActiveArray(new Array(currencies.length).fill(false));
      }, [showDetails?.show]);

      useEffect(() => {
        if (currencies?.length) {
          const defaultCurrency = "SGD";
          changeCurrency(defaultCurrency); // this also fetches bank details
        }
      }, [currencies]);
      
      

      const changeCurrency = (type) => {
        if(platform === "awx"){
        dispatch(getBankDetails(type, awxAccountId));
        }
        else{
        dispatch(getBankDetails(type, custHashId));
        }
        currencies?.map((currency) => {
          if (currency.name === type)
            setBalance(getSymbolFromCurrency(type) + " " + currency.balance);
        });

        setShowDetails(false);
      };

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

// Get Currency List and Balances 

useEffect(() => {
  if (platform === "awx" && awxAccountId) {
    dispatch(getCurrencyList(awxAccountId));
  } else if (custHashId) {
    dispatch(getCurrencyList(custHashId));
  }
}, [platform, custHashId, awxAccountId]);

//...............xxx..............

      const getAccountDetails = () => {
        if (type) {
          if(platform === "awx"){
          dispatch(getBankDetails(type, awxAccountId));
          }
          else{
          dispatch(getBankDetails(type, custHashId));
          }
        }
      };

      // useEffect(() => {
      //   getAccountDetails();
      // }, [type])

  // Bank Name Dropdown Fetch for create account
      useEffect(() => {
        if (platform !== "awx") {
          setBankAccountForCreate([]);
      
          const getbankNames = async () => {
            const list = await getBankAccountForCreate(type);
            setBankAccountForCreate(list);
          };
      
          if (type) getbankNames();
        }
      }, [platform, type]);


      const customStyles = {
        control: (base, state) => ({
          ...base,
          padding: "2px",
          fontSize: "18px",
          position: "relative",
          boxShadow: "none",
          borderRadius: "32px",
          minWidth: "150px",     // Minimum width
          width: "100%",         // Stretch to fill parent
          maxWidth: "400px",  
        }),
      };

      const options = currencies.map((currency) => ({
        value: currency.name,
        label: (
          <div>
            <img
              src={`/Rounded_Flags/${currency.name.toLowerCase().slice(0, 2)}.svg`}
              className="rounded-circle"
              alt={currency.name}
              width={30}
            />
            <> </>
            <strong>{currency.name}</strong>
          </div>
        ),
      }));

      // currency option for awx

      const awxOptions = filteredCurrencies?.map(currencyObj => ({
        value: currencyObj?.name,
        label: (
          <div>
            <img
              src={`/Rounded_Flags/${currencyObj?.name.slice(0, 2).toLowerCase()}.svg`}
              className="rounded-circle"
              alt={currencyObj?.name}
              width={30}
            />
            <> </>
            <strong>{currencyObj?.name}</strong>
          </div>
        ),
      }));

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

          <div className="d-flex ">
            <div className="m-3 w-100">
              <div className="row bg-white border p-4 d-flex rounded-5 shadow w-100">
                <div className="p-3">
                  <div className="bg-light-primary p-3 rounded-circle d-inline-block">
                    <AiFillBank className="color-secondary-70" size={50} />
                  </div>
                  <br />
                  <SkeletonTheme baseColor="#E0E0E0" highlightColor="#D4F1F4">
                    {isLoading ? (
                      <>
                      <div className="d-flex flex-wrap align-items-center mt-3 gap-2">
                        <h3
                          className="text-nowrap m-0 mt-3 d-inline-block fw-bold ms-3"
                          height={100}
                          style={{color:"rgb(129, 128, 128)"}}
                           >
                          Total Funds :{" "}
                          <span className="fw-600 ms-1">
                            <Skeleton
                              width={200}
                              height={35}
                              style={{ borderRadius: "25px"}}
                            />
                          </span>
                        </h3>
                        </div>
                        
                        <div className="d-flex flex-wrap mt-3">
                          <AccountsFetchSkeleton />
                          <AccountsFetchSkeleton />
                          <AccountsFetchSkeleton />
                        </div>
                      </>
                    ) : (
                      <>
                       <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                         <h3 className="m-0 fw-bold text-nowrap ms-3" style={{color:"rgb(129, 128, 128)"}}>
                         Total Funds :
                          </h3>
                          <h2 className="mt-2">
                          <span
                            className="fw-bold ms-1" 
                          >
                            {balance}
                          </span>
                          </h2>
                          <div id="accountsCuurencyDropdown">
                           <div className="custom-select-container">
                            <div className="custom-select">
                              <Select
                              styles={customStyles}
                              className="rounded-5 border"
                              value={
                                 (platform === "awx" ? awxOptions : options).find(
                                 (option) => option.value === type
                                 )
                              }
                              onChange={(selectedOption) =>
                                changeCurrency(selectedOption.value)
                              }
                              options={platform === "awx" ? awxOptions : options}
                            />
                       </div>
                     </div>
                    </div>
                  </div>
                        {/* <img src="/info_circle.svg" className='ms-2 mb-2' alt='info' /> */}
                      </>
                    )}
                  </SkeletonTheme>
                </div>

                {
                  !isLoading && (
                    <div
                      className="w-100 row"
                      style={{ overflow: "auto", maxHeight: "525px" }}
                    >
                      {/* <div class="scroll"> */}
                      <EachCurrencies
                        key={"-1"}
                        getAccountDetails={getAccountDetails}
                        isActivated={true}
                        type={type}
                        setShowDetails={setShowDetails}
                        showArray={showArray}
                        handleShow={handleShow}
                        handleActive={handleActive}
                        activeArray={activeArray}
                        cardActivated={false}
                        options={bankAccountForCreate}
                      />
                      {bankDetails?.map((currency, index) => (
                        <EachCurrencies
                          type={type}
                          data={currency}
                          key={index}
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
                  )
                  // </div>
                }
              </div>
            </div>

            {showDetails?.show && (
              <DetailsBar
                setShowDetails={setShowDetails}
                handleShow={handleShow}
                handleActive={handleActive}
                data={showDetails?.data}
                type={type}
              />
            )}
          </div>
          {/* Close SkeletonTheme here */}
        </>
      );
    }
  }
}
export default GlobalAccounts;
