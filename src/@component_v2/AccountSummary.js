import React, { useEffect, useRef, useState } from "react";
import { flag } from "../data/accounts/globalAccounts";
import "./accountSummary.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Axios, { AxiosError } from "axios";
import { ScaleLoader } from "react-spinners";
import { BarLoader } from "react-spinners";
import { CircularProgress } from "@mui/material";
import { Add, ChevronRight, PlusOne } from "@mui/icons-material";
import { getCurrencyList } from "../@redux/action/accounts";
import getSymbolFromCurrency from "currency-symbol-map";
Axios.defaults.withCredentials = true;

export const symbol = {
  USD: "$", // US Dollar
  SGD: "S$", // Singapore Dollar
  GBP: "£", // Great Britain Pound
  EUR: "€", // Euro
  HKD: "HK$", // Hong Kong Dollar
  AUD: "A$", // Australian Dollar
  INR: "₹", // Indian Rupee
  PKR: "₨", // Pakistani Rupee
  LKR: "Rs", // Sri Lankan Rupee
  NPR: "₨", // Nepalese Rupee
  BDT: "৳", // Bangladeshi Taka
  PHP: "₱", // Philippine Peso
  THB: "฿", // Thai Baht
  VND: "₫", // Vietnamese Dong
  KRW: "₩", // South Korean Won
  DKK: "kr", // Danish Krone
  NOK: "kr", // Norwegian Krone
  SEK: "kr", // Swedish Krona
  TRY: "₺", // Turkish Lira
  ARS: "$", // Argentine Peso
  BRL: "R$", // Brazilian Real
  CLP: "$", // Chilean Peso
  COP: "$", // Colombian Peso
  MXN: "$", // Mexican Peso
  PEN: "S/", // Peruvian Sol
  UYU: "$U", // Uruguayan Peso
  CNY: "¥", // Chinese Yuan
  TWD: "NT$", // New Taiwan Dollar
  JPY: "¥", // Japanese Yen
  IDR: "Rp", // Indonesian Rupiah
  MYR: "RM", // Malaysian Ringgit
};

export const fullform = {
  USD: "US Dollar",
  SGD: "Singapore Dollar",
  GBP: "Great Britain Pound",
  EUR: "Euro",
  HKD: "Hong Kong Dollar",
  AUD: "Australian Dollar",
  INR: "Indian Rupee",
  PKR: "Pakistani Rupee",
  LKR: "Sri Lankan Rupee",
  NPR: "Nepalese Rupee",
  BDT: "Bangladeshi Taka",
  PHP: "Philippine Peso",
  THB: "Thai Baht",
  VND: "Vietnamese Dong",
  KRW: "South Korean Won",
  DKK: "Danish Krone",
  NOK: "Norwegian Krone",
  SEK: "Swedish Krona",
  TRY: "Turkish Lira",
  ARS: "Argentine Peso",
  BRL: "Brazilian Real",
  CLP: "Chilean Peso",
  COP: "Colombian Peso",
  MXN: "Mexican Peso",
  PEN: "Peruvian Sol",
  UYU: "Uruguayan Peso",
  CNY: "Chinese Yuan",
  TWD: "New Taiwan Dollar",
  JPY: "Japanese Yen",
  IDR: "Indonesian Rupiah",
  MYR: "Malaysian Ringgit",
};

export const flags = {
  USD: "/flags/us.svg", // United States Dollar
  SGD: "/flags/sg.svg", // Singapore Dollar
  GBP: "/flags/gb.svg", // Great Britain Pound
  EUR: "/flags/eu.svg", // Euro
  HKD: "/flags/hk.svg", // Hong Kong Dollar
  AUD: "/flags/au.svg", // Australian Dollar
  INR: "/flags/in.svg", // Indian Rupee
  PKR: "/flags/pk.svg", // Pakistani Rupee
  LKR: "/flags/lk.svg", // Sri Lankan Rupee
  NPR: "/flags/np.svg", // Nepalese Rupee
  BDT: "/flags/bd.svg", // Bangladeshi Taka
  PHP: "/flags/ph.svg", // Philippine Peso
  THB: "/flags/th.svg", // Thai Baht
  VND: "/flags/vn.svg", // Vietnamese Dong
  KRW: "/flags/kr.svg", // South Korean Won
  DKK: "/flags/dk.svg", // Danish Krone
  NOK: "/flags/no.svg", // Norwegian Krone
  SEK: "/flags/se.svg", // Swedish Krona
  TRY: "/flags/tr.svg", // Turkish Lira
  ARS: "/flags/ar.svg", // Argentine Peso
  BRL: "/flags/br.svg", // Brazilian Real
  CLP: "/flags/cl.svg", // Chilean Peso
  COP: "/flags/co.svg", // Colombian Peso
  MXN: "/flags/mx.svg", // Mexican Peso
  PEN: "/flags/pe.svg", // Peruvian Sol
  UYU: "/flags/uy.svg", // Uruguayan Peso
  CNY: "/flags/cn.svg", // Chinese Yuan
  TWD: "/flags/tw.svg", // New Taiwan Dollar
  JPY: "/flags/jp.svg", // Japanese Yen
  IDR: "/flags/id.svg", // Indonesian Rupiah
  MYR: "/flags/my.svg", // Malaysian Ringgit
};

const EachAccount = ({
  data = { name: "SGD", balance: 0 },
  updateSummary,
  curr,
}) => {
  const showAccountSummary = () => {
    updateSummary(data.balance.toFixed(2), data.curSymbol || data.name);
  };

  return (
    <div
      className="d-flex flex-column p-3 me-2 align-items-between justify-content-between"
      onClick={showAccountSummary}
      style={{
        borderRadius: 20,
        border: "1px solid rgba(0,0,0,0.1)",
        cursor: "pointer",
        height: 154,
        background:
          curr === data?.name || curr === data?.curSymbol
            ? "white"
            : "transparent",
      }}
    >
      <div
        className="d-flex justify-content-between"
        style={{ width: 192, height: 40 }}
      >
        <div style={{ display: "grid", gridGap: "6px" }}>
          <span style={{ fontSize: "13px", fontWeight: "600" }}>
            {fullform[data?.curSymbol] ||
              fullform[data?.name] ||
              data?.pocketName}
          </span>
          <p className="opacity-50 fw-normal" style={{ fontSize: "13px" }}>
            {data?.curSymbol || data?.name}{" "}
            <span className="opacity-25">|</span> *{data?.isoCode || "XXXX"}
          </p>
        </div>

        <img
          className=""
          width={34}
          height={34}
          src={`/flags/${
            data?.curSymbol?.slice(0, 2)?.toLowerCase() ||
            data?.name?.slice(0, 2)?.toLowerCase()
          }.svg`}
          style={{
            borderRadius: "50%",
            border: "1px solid rgba(0,0,0,0.35)",
            objectFit: "cover",
          }}
        />
      </div>

      <h5 className="w-100" style={{ height: 28, fontSize: 24 }}>
        {getSymbolFromCurrency(data?.name || data?.curSymbol)}{" "}
        {data?.balance.toFixed(2)}
      </h5>
    </div>
  );
};

function AccountSummary({ isActivated }) {
  const [balanceLoading, setBalanceLoading] = useState(false);

  const subStatus = useSelector((state) => state.subscription?.data?.status);
  const complianceStatus = useSelector(
    (state) => state.onboarding.complianceStatus
  );
  let platform = useSelector((state) => state.common.platform);
  const carouselRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const scrollRight = () => {
    if (carouselRef.current) {
      shiftArray();
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      shiftArrayLeft();
    }
  };

  const currList = useSelector((state) => state.accounts.currencyList);
  const defaultCurr = useSelector((state) => state.accounts.type);

  const userStatus = useSelector((state) => state.onboarding.UserStatusObj);

  const allowedCurrencies = [
    "AED",
    "AUD",
    "BRL",
    "CAD",
    "DKK",
    "EUR",
    "GBP",
    "HKD",
    "IDR",
    "ILS",
    "MXN",
    "NZD",
    "SGD",
    "USD",
  ];

  // Filtered list
  const filteredCurrencies = currList?.filter((currencyObj) =>
    allowedCurrencies.includes(currencyObj?.name)
  );

  const [accountDetails, setAccountDetails] = useState(
    filteredCurrencies || []
  );

  const reqBalance = filteredCurrencies
    ?.find((item) => item.name === "USD") // No {} means implicit return
    ?.balance?.toFixed(2); // Add ?. here

  const [balances, setBalances] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [activeBalance, setActiveBalance] = useState(reqBalance || "0.00");

  const shiftArray = () => {
    const data = accountDetails;
    const front = data[0];
    setAccountDetails([...data.slice(1), front]);
  };

  // Automatically shift the carousel at regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      shiftArray(); // Automatically shift the carousel left
    }, 3000); // Adjust the interval time (3000ms = 3s)

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [accountDetails]); // Re-run effect when `data` changes

  const shiftArrayLeft = () => {
    const data = accountDetails;
    const last = data[data.length - 1]; // Get the last element
    setAccountDetails([last, ...data.slice(0, -1)]); // Move it to the front
  };

  const custHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );

  useEffect(() => {
    const FetchBalance = async () => {
      try {
        setBalanceLoading(true);

        // let currencyList = [];

        // if (currList && currList.length > 1) {
        //   currencyList = currList;
        // } else {
        //   const response = await Axios.get(
        //     sessionStorage.getItem("baseUrl") +
        //       "/AccountsRoutes/fetchBalance",
        //     {
        //       params: {
        //         custHashId: custHashId,
        //       },
        //     }
        //   );
        //   currencyList = response.data;
        // }

        // if (currencyList && currencyList.length > 0) {
        //   setActiveBalance(currencyList[0]?.balance.toFixed(2));
        //   setAccountDetails(currencyList);
        //   setBalances(currencyList);
        // } else if (currencyList && currencyList.length == 0) {
        //   setAccountDetails([]);
        //   setBalances([]);
        // } else {
        //   setAccountDetails([]);
        //   setBalances([]);
        // }

        await dispatch(
          getCurrencyList(
            platform === "nium" ? custHashId : userStatus.internalBusinessId
          )
        );

        console.log("currList: ", currList);
        console.log("defaultCurr: ", defaultCurr);
      } catch (error) {
        // Handle any errors here
        console.error("Error:", { error });
        // if (error instanceof AxiosError) {
        //   if (
        //     error.response &&
        //     error.response.data &&
        //     error.response.data.status === "BAD_REQUEST"
        //   ) {
        //     setBalances([]);
        //     setAccountDetails([]);
        //   } else {
        //     setBalances([]);
        //     setAccountDetails([]);
        //   }
        // } else {
        //   setBalances([]);
        //   setAccountDetails([]);
        // }
      } finally {
        setBalanceLoading(false);
      }
    };

    if (isActivated) {
      FetchBalance();
    }
  }, [isActivated, subStatus]);

  // useEffect(() => {}, [selectedCurrency, activeBalance]);
  const handleSendMoney = () => {
    navigate("/payments/send-money");
  };
  const handleReceiveMoney = () => {
    // Swal.fire({
    //   icon: "warning",
    //   text: "Stay tuned! This feature will be available soon.",
    // });
  };

  let userStatusObj = useSelector((state) => state.onboarding.UserStatusObj);

  const BalanceSection = ({
    balance,
    currency,
    isLoading,
    handleSendMoney,
  }) => (
    <div
      className="rounded-5 p-4 bg-white account-summary"
      style={{ height: 224 }}
    >
      {isLoading ? (
        <div
          className="d-flex flex-column align-items-center justify-content-center gap-4"
          style={{ height: 200 }}
        >
          <CircularProgress color="black" />
          Fetching Balance. Please Wait...
        </div>
      ) : (
        <>
          <div className="d-flex flex-column justify-content-start align-items-start gap-4 w-100">
            <label style={{ fontSize: 16, fontWeight: 600 }}>
              Total Balance
            </label>

            <h1 className="fw-bold" style={{ fontSize: "60px" }}>
              {balance}{" "}
              <span className="opacity-75 text-secondary">{currency}</span>
            </h1>
            <div className="d-flex align-items-center justify-content-between w-100">
              <button
                className="btn fw-bold btn-dark rounded-pill d-flex align-items-center justify-content-center"
                type="button"
                onClick={handleSendMoney}
                style={{ height: 48, width: 360, fontWeight: 500 }}
              >
                <img src="/v2/misc/send.svg" className="me-2" alt="icon" /> Send
                Money
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const AccountActions = ({ subStatus }) => (
    <>
      {platform === "nium" ? (
        <div className="pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
          {subStatus === "active" ? (
            <>
              <p style={{ fontSize: "16px", marginBottom: 0, fontWeight: 600 }}>
                Accounts
              </p>
            </>
          ) : (
            <p style={{ fontSize: "14px", marginBottom: 0, fontWeight: 500 }}>
              Discover the power of global finance with Zoqq's multicurrency
              accounts.{" "}
              <Link to="/settings/subscription" style={{ color: "#327e9d" }}>
                Subscribe Now!
              </Link>
            </p>
          )}

          {subStatus === "active" && (
            <>
              <Link
                to="/accounts/global-accounts"
                className="text-primary-dark"
                style={{
                  fontSize: "14px",
                  marginBottom: 0,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <Add sx={{ fontSize: 14 }} /> Add Account
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
            <>
              <p style={{ fontSize: "16px", marginBottom: 0, fontWeight: 600 }}>
                Accounts
              </p>
            </>

            <Link
              to="/accounts/global-accounts"
              className="text-primary-dark"
              style={{
                fontSize: "14px",
                marginBottom: 0,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Add sx={{ fontSize: 14 }} /> Add Account
            </Link>

            {platform === "awx" && (
              <Link
                to="/accounts/wallets"
                className="text-primary-dark"
                style={{
                  fontSize: "14px",
                  marginleft: 10,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                View All <ChevronRight sx={{ fontSize: 14 }} />
              </Link>
            )}
          </div>
        </>
      )}
    </>
  );

  const AccountCarousel = ({
    accountDetails,
    setActiveBalance,
    setSelectedCurrency,
  }) => (
    <div id="carouselExample" className="carousel">
      {/* <button
        className="carousel-control-next opacity-100"
        type="button"
        onClick={scrollLeft}
        style={{ left: 0 }}
      >
        <img
          src="/v2/misc/right-arrow.svg"
          className="bg-secondary-dark p-2 rounded-circle"
          width={28}
          style={{ transform: "rotate(180deg)" }}
        />
      </button> */}
      <div className="carousel-inner ps-3">
        <div className="d-flex overflow-hidden" ref={carouselRef}>
          {accountDetails?.map((account, key) => (
            <EachAccount
              data={account}
              key={key + "_account"}
              idx={key}
              updateSummary={(balance, currency) => {
                setActiveBalance(balance);
                setSelectedCurrency(currency);
              }}
              curr={selectedCurrency}
            />
          ))}
        </div>
      </div>
      {accountDetails && accountDetails.length > 0 && (
        <button
          className="carousel-control-next opacity-100"
          type="button"
          onClick={scrollRight}
        >
          <img
            src="/v2/misc/right-arrow.svg"
            className="bg-secondary-dark p-2 rounded-circle"
            width={28}
            style={{ transform: "scale(1.5)" }}
          />
        </button>
      )}
    </div>
  );

  const AccountSummary = ({
    isActivated,
    subStatus,
    activeBalance,
    selectedCurrency,
    balanceLoading,
    accountDetails,
    handleSendMoney,
  }) => (
    <section
      id="account_summary"
      className="bg-light-primary h-100"
      style={{ padding: "4px", borderRadius: "36px" }}
    >
      <BalanceSection
        balance={activeBalance || "0.00"}
        currency={selectedCurrency || "USD"}
        isLoading={balanceLoading}
        handleSendMoney={handleSendMoney}
      />
      {platform === "nium" && !balanceLoading && accountDetails?.length > 0 ? (
        <>
          <AccountActions subStatus={subStatus} />
          <AccountCarousel
            accountDetails={accountDetails}
            setActiveBalance={setActiveBalance}
            setSelectedCurrency={setSelectedCurrency}
          />
        </>
      ) : (
        <>
          <AccountActions subStatus={subStatus} />
          <AccountCarousel
            accountDetails={accountDetails}
            setActiveBalance={setActiveBalance}
            setSelectedCurrency={setSelectedCurrency}
          />
        </>
      )}
    </section>
  );

  const OnboardingMessage = ({ userStatusObj }) => (
    <div className="p-4 d-flex justify-content-between account-summary-footer mt-2">
      {userStatusObj?.lastScreenCompleted === "8" &&
      userStatusObj?.userStatus === "F" ? (
        <h4
          className="text-center"
          style={{
            fontSize: "14px",
            marginBottom: 0,
            fontWeight: 600,
            lineHeight: "25px",
          }}
        >
          Your profile is currently under review. You will be able to access
          your global accounts once the review process is complete.
        </h4>
      ) : (
        <p style={{ fontSize: "14px", marginBottom: 0, fontWeight: 600 }}>
          Start managing your finances across multiple multi-currency accounts
          instantly -{" "}
          <Link to="/onboarding/Home" style={{ color: "#327e9d" }}>
            Activate Now!
          </Link>
        </p>
      )}
    </div>
  );

  return (
    <>
      {isActivated ? (
        <AccountSummary
          isActivated={isActivated}
          subStatus={subStatus}
          activeBalance={activeBalance}
          selectedCurrency={selectedCurrency}
          balanceLoading={balanceLoading}
          accountDetails={accountDetails}
          handleSendMoney={handleSendMoney}
        />
      ) : (
        <section
          id="account_summary"
          className="bg-light-primary h-100"
          style={{ padding: "4px", borderRadius: "32px" }}
        >
          <BalanceSection
            balance="0.00"
            currency="USD"
            handleSendMoney={handleSendMoney}
          />
          {platform === "awx" && complianceStatus === "COMPLETED" ? (
            <AccountActions subStatus={subStatus} />
          ) : (
            <OnboardingMessage userStatusObj={userStatusObj} />
          )}
        </section>
      )}
    </>
  );
}

export default AccountSummary;
