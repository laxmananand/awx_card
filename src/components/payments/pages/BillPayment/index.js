import React, { useEffect, useState } from "react";
import DataTable from "./BillTable";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

function BillPayment() {
  const location = useLocation();
  return (
    <DataTable/>
  );
}
export default BillPayment;