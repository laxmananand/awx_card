import React from "react";
import EachCard from "../structure/EachCard";
import BreadCrumbs from "../structure/BreadCrumbs";
import Sidebar from "../../@component_v2/Sidebar";

function Accounts() {
  const data = [
    {
      id: 1,
      color: "blue",
      title: "Global Accounts",
      subtitle: "Manage multiple currency accounts globally for seamless international transactions.",
      img: "/accounts/globalAccounts.svg",
      url: "/accounts/global-accounts",
    },
    {
      id: 2,
      color: "green",
      title: "Currency Conversion",
      subtitle: "Effortlessly convert currencies at competitive rates to facilitate international transactions.",
      img: "/accounts/currencyConversion.svg",
      url: "/accounts/wallets",
    },
    {
      id: 3,
      color: "green",
      title: "Currency Conversion",
      subtitle: "Effortlessly convert currencies at competitive rates to facilitate international transactions.",
      img: "/accounts/currencyConversion.svg",
      url: "/accounts/conversion",
    },
    // {
    //   id: 3,
    //   color: "yellow",
    //   title: "Account Statements",
    //   subtitle: "Access detailed account statements for easy tracking of transactions and financial activities.",
    //   img: "/accounts/accountStatement.svg",
    //   url: "/accounts/statements",
    // },
    {
      id: 4,
      color: "yellow",
      title: "Transactions",
      subtitle: " View, track, and manage all transactions across your accounts, including detailed history and real-time updates for easy financial oversight.",
      img: "/payments/transactions.svg",
      url: "/payments/transactions",
    },
  ];
  return (
    <>
      <BreadCrumbs data={{ name: "Accounts", img: "/accounts/accounts.svg", backurl: "/dashboard" }} />

      <div className="row d-flex">
        {data.map((eachData) => (
          <EachCard key={eachData.id} data={eachData} />
        ))}
      </div>
    </>
  );
}

export default Accounts;
