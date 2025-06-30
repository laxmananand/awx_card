import React, { useState } from "react";
import ExpenseCard from "./ExpenseCard";
import BreadCrumbs from "../../structure/BreadCrumbs";

const showCard3 = "true";

function Expense() {
  const [region, setRegion] = useState(sessionStorage.getItem("region"));
  const data = [
    {
      id: 1,
      color: "blue",
      title: "Invoices",
      // title: "Receivables",
      subtitle:
        "Seamless Invoicing  to facilitate payments in your desired currency.",
      img: "/sidebar/expense/invoices.svg",
      url: "invoices",
    },
    // {
    //   id: 2,
    //   color: "green",
    //   // title: "Payables",
    //   title: "Bills",
    //   subtitle:
    //     "Simplify Your Finances with Our Bill Management Feature All Your Bills.",
    //   img: "/sidebar/expense/bills.svg",
    //   url: "bills",
    // },
  ];

  //const thirdElementSessionValue = sessionStorage.getItem('registeredCountry').toLowerCase();

  // if (region.toLowerCase() === "sg" || region.toLowerCase() === "us") {
  //   data.push({
  //     id: 3,
  //     color: "yellow",
  //     title: "Cards",
  //     subtitle: "Empower Your Team with Corporate Cards",
  //     img: "/sidebar/expense/corporateCards.svg",
  //     url: "corporate-cards",
  //   });
  // }

  return (
    <>
      <div className="expences-bills w-100">
        {/* <div className='d-flex border bg-white'>
          <Link to="/dashboard">
            <img className='py-3 px-4 border-end' src='/accounts/accounts.svg' />
          </Link>
          <h6 className='p-4 m-0'>Expense</h6>
        </div> */}

        <BreadCrumbs
          data={{
            name: "Expense",
            backurl: "/dashboard",
            img: "/accounts/accounts.svg",
          }}
        />
        <div className="d-flex justify-content-start">
          {data.map((eachData) => (
            <ExpenseCard key={eachData.id} data={eachData} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Expense;
