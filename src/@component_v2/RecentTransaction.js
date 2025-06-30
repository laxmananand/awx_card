import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import { ScaleLoader } from "react-spinners";
import { setComplianceStatus } from "../@redux/features/onboardingFeatures";
import { CircularProgress } from "@mui/material";
Axios.defaults.withCredentials = true;

const EachTransaction = ({ data, key, idx }) => {
  const [randomBackground, setRandomBackground] = useState("brown");

  let contactName = data?.labels?.beneficiaryName;

  // Split the name into an array of words
  let nameParts = contactName?.split(" ");

  // Initialize an empty string for the result
  let result = nameParts?.[0]?.slice(0, 1);

  useEffect(() => {
    const darkColors = [
      "#2c3e50",
      "#34495e",
      "#2c2c2c",
      "#1e272e",
      "#222",
      "#3d3d3d",
      "#4a4a4a",
      "#555555",
      "#6c7a89",
      "#4b4b4b",
    ];

    const randomIndex = Math.floor(Math.random() * darkColors.length);
    setRandomBackground(darkColors[randomIndex]);
  }, []);

  return (
    <tr className="each-transaction align-middle">
      <td className="d-flex align-items-center justify-content-between h-100 border-0">
        <div className="d-flex align-items-center justify-content-start gap-2">
          <div
            className="rounded-circle me-2"
            style={{
              padding: "10px 16px",
              background: randomBackground,
              color: "white",
              fontSize: "20px",
            }}
          >
            {result ? result.toUpperCase() : "N"}
          </div>
          <div className="d-flex align-items-start justify-content-center flex-column gap-2">
            <p className="m-0 p-0" style={{ fontSize: 14, fontWeight: 600 }}>
              {data?.labels?.beneficiaryName}
            </p>
            <p
              className="m-0 p-0 opacity-50"
              style={{ fontSize: 12, fontWeight: 500 }}
            >
              {data?.dateOfTransaction}
            </p>
          </div>
        </div>
      </td>
      <td className="h6 border-0">
        <p className="d-flex opacity-50 m-0 p-0">
          {data?.billingCurrencyCode} Balance
        </p>
      </td>
      <td
        className="h6 border-0"
        style={{
          color: data?.debit === true ? "brown" : "green",
          fontWeight: 600,
          textAlign: "end",
        }}
      >
        {data?.debit === true ? "-" : "+"}{" "}
        <span style={{ marginLeft: "2px" }}>
          {data?.billingAmount?.toFixed(2)} {data?.transactionCurrencyCode}
        </span>
      </td>
    </tr>
  );
};

const TransactionsSection = ({ transactions, transacLoading }) => {
  if (transacLoading) {
    return (
      <div className="p-3 d-flex flex-column align-items-center justify-content-center gap-3">
        <CircularProgress sx={{ color: "black" }} />
        Fetching Transactions. Please Wait...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center">
        <div className="rounded-circle bg-light-primary mx-auto mb-4">
          <img src="/no_transactions.jpg" width={75} />
        </div>
        <h4 className="text-center fs-6">
          You don't have any transactions yet
        </h4>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex justify-content-between">
        <span style={{ fontSize: "16px", fontWeight: 600 }}>
          Recent Transactions
        </span>
        <a
          href="/payments/transactions"
          className="d-flex align-items-center text-primary-dark"
          style={{
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          View All
        </a>
      </div>
      <div className="flex-fill position-relative h-100 overflow-auto mt-2">
        <table className="table position-absolute overflow-auto">
          <tbody>
            {transactions.map((item, key) => (
              <EachTransaction
                data={item}
                key={key + "_transaction"}
                idx={key}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InfoBlock = ({ icon, message, linkText, linkUrl }) => (
  <div
    className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3 h-100"
    style={{ padding: "5rem" }}
  >
    <div className="rounded-circle bg-light-primary mx-auto mb-3">
      <img src={icon} style={{ padding: "12px" }} width={60} />
    </div>
    <h4
      className="text-center"
      style={{ fontSize: "15px", lineHeight: "25px" }}
    >
      {message}{" "}
      <Link to={linkUrl} style={{ color: "#327e9d" }}>
        {linkText}
      </Link>
    </h4>
  </div>
);

const TransactionsComponent = ({
  isActivated,
  subStatus,
  transactions,
  transacLoading,
  platform,
}) => {
  if (!isActivated) {
    return (
      <InfoBlock
        icon="/v2/sidebar/payments.svg"
        message="Ready to explore transactions?"
        linkText="Activate your account"
        linkUrl="/onboarding/Home"
      />
    );
  }

  if (platform === "nium" && subStatus !== "active") {
    return (
      <InfoBlock
        icon="/v2/sidebar/payments.svg"
        message="Streamline your transactions and unlock Zoqq's full potential -"
        linkText="Subscribe now!"
        linkUrl="/settings/subscription"
      />
    );
  }

  return (
    <div
      className="active-transaction-block rounded-5 bg-white d-flex flex-column border justify-content-center gap-2 h-100"
      style={{ padding: 30 }}
    >
      <TransactionsSection
        transactions={transactions}
        transacLoading={transacLoading}
      />
    </div>
  );
};

const RecentTransactionV2 = ({ isActivated }) => {
  const subStatus = useSelector((state) => state.subscription?.data?.status);
  const custHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );

  const [transactions, setTransactions] = useState([]);
  const [transacLoading, setTransacLoading] = useState(true);
  const platform = useSelector((state) => state.common.platform);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      setTransacLoading(true);
      if (!custHashId) {
        setTransactions([]);
        setTransacLoading(false);
        return;
      }

      try {
        const { data } = await Axios.get(
          `${sessionStorage.getItem(
            "baseUrl"
          )}/AccountsRoutes/transactionHistory`,
          {
            params: {
              page: 1,
              size: 4,
              startDate: "",
              endDate: "",
              transactionType: "",
              custHashId,
            },
          }
        );

        if (data.status === "BAD_REQUEST") {
          console.error("Error:", data.message);
          setTransactions([]);
        } else {
          setTransactions(data.content || []);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      }

      setTransacLoading(false);
    };

    fetchRecentTransactions();
  }, [custHashId]);

  return (
    <TransactionsComponent
      isActivated={isActivated}
      subStatus={subStatus}
      transactions={transactions}
      transacLoading={transacLoading}
      platform={platform}
    />
  );
};

export default RecentTransactionV2;
