import React from "react";
import Header from "./Header";
import Currencies from "./Currencies";
import RecentTransaction from "./RecentTransaction";
import Card from "./Card";
import CurrencyGraph from "./CurrencyGraph";
import UpdateToProCard from "./UpdateToProCard";
import AccountSecurityCard from "./AccountSecurityCard";

function Dashboard() {
  return (
    <div className="bg-light">
      <Header />

      <Currencies />

      <div className="cotainer-fluid row">
        <div className="col-12 col-md-7">
          <RecentTransaction />
        </div>
        <div className="col-12 col-md-5">
          <Card />
        </div>
      </div>

      <div className="container-fluid row">
        <div className="col-12 col-md-6 col-lg-4 mb-3">
          <CurrencyGraph />
        </div>
        <div className="col-12 col-md-6 col-lg-4 mb-3">
          <UpdateToProCard />
        </div>
        <div className="col-12 col-md-6 col-lg-4 mb-3">
          <AccountSecurityCard />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
