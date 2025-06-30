import React from "react";
import EachCard from "../structure/EachCard";
import BreadCrumbs from "../structure/BreadCrumbs";
//import RecentTransactions from "../structure/RecentTransactions/RecentTransactions";

function Payments() {
  const data = [
    {
      id: 1,
      color: "blue",
      title: "Beneficiaries",
      subtitle: "Manage beneficiary details, set default currencies, and ensure secure, seamless payments with tracking, approval workflows, and access controls.",
      img: "/payments/beneficiaries.svg",
      url: "/payments/beneficiaries",
    },
    // {
    //   id: 2,
    //   color: "green",
    //   title: "Request Money",
    //   subtitle: "Move funds across your currency accounts to facilitate payments in your desired currency.",
    //   img: "/payments/request-money.svg",
    //   url: "/payments/request-money",
    // },
    {
      id: 2,
      color: "yellow",
      title: "Send Money",
      subtitle: "Send money internationally in various currencies, ensuring smooth and efficient cross-border payments.",
      img: "/payments/send-money.svg",
      url: "/payments/send-money",
    },

    {
      id: 3,
      color: "green",
      // title: "Payables",
      title: "Bills",
      subtitle:
        "Simplify Your Finances with Our Bill Management Feature All Your Bills.",
      img: "/sidebar/expense/bills.svg",
      url: "bills",
    },

    // {
    //   id: 4,
    //   color: "yellow",
    //   title: "Transactions",
    //   subtitle: " View, track, and manage all transactions across your accounts, including detailed history and real-time updates for easy financial oversight.",
    //   img: "/payments/transactions.svg",
    //   url: "/payments/transactions",
    // },
  ];
  return (
    <>
      <BreadCrumbs data={{ name: "Payments", img: "/accounts/accounts.svg", backurl: "/dashboard" }} />

      <div className="row">
        {data.map((eachData) => (
          <EachCard key={eachData.id} data={eachData} />
        ))}
      </div>
    </>
  );
}

export default Payments;
