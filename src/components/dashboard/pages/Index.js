import React from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";

function Home() {
  return (
    <div>
      <div className="d-flex">
        <SideBar />
        <div
          className="container-fluid px-0 bg-light clear-left overflow-auto"
          style={{ height: "100vh" }}
        >
          <Navbar />
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default Home;
