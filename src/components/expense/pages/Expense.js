import React, { useEffect, useState } from "react";
import * as functions from "../js/expense.js";
import SideBar from "../../SideBar.js";
import Expense from "./ExpenseDashboard.js";
import Sidebar from "../../../@component_v2/Sidebar.js";

export default function Verification() {
  useEffect(() => {
    importNewCss();
  }, []);

  const importNewCss = async () => {
    try {
      const css = await import("../css/global.css");
      const css1 = await import("../css/index.css");
      const css2 = await import("../css/index-copy.css");
      const css3 = await import("../css/global-copy.css");
    } catch (error) {
      console.error("Error importing CSS:", error);
    }
  };

  return (
    <div className="d-flex">
      {/* <Sidebar/> */}
      {/* <div className="expences"> */}

      <Expense />

      {/* </div> */}
    </div>
  );
}
