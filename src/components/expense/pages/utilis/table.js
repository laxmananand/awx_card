import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useDispatch } from "react-redux";
// import { listbeneficiaries } from "../../../../@redux/action/payments";
import { useSelector } from "react-redux";
// import Listbeneficiary_Skeleton from "../../../../loading_Skeleton/Listbeneficiary_Skeleton";

import CustomTable from "../../../structure/NewStructures/CustomTable.js";
import { MoreHoriz } from "@mui/icons-material";

const payoutmethod = ["LOCAL", "SWIFT"];

const columns = [
  { id: "brand", label: "Brand", minWidth: 100 },
  { id: "card_number", label: "Card Number", minWidth: 170 },
  { id: "card_status", label: "Status", minWidth: 120 },
  { id: "created_at", label: "Created At", minWidth: 120 },
  { id: "updated_at", label: "Updated At", minWidth: 120 },
  { id: "action", label: "", minWidth: 60 },
];

const createData = (
  brand,
  card_id,
  card_number,
  card_status,
  cardholder_id,
  created_at,
  nick_name,
  updated_at,
  setShowDetails
) => {
  return {
    brand: brand === "VISA"
      ? <img src="/expense/card/visa.svg" alt="VISA" width={50} />
      : brand,
    card_number,
    card_status: (
      <span
        className={`$${
          card_status === "ACTIVE"
            ? "bg-success text-white"
            : card_status === "INACTIVE"
            ? "bg-secondary text-white"
            : card_status === "PENDING"
            ? "bg-warning text-dark"
            : "bg-danger text-white"
        } fw-500 px-4 py-2 fs-8 rounded-pill`}
      >
        {card_status}
      </span>
    ),
    created_at,
    updated_at: updated_at?.slice(0, 10),
    action: (
      <MoreHoriz
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails({
            show: true,
            data: {
              brand,
              card_id,
              card_number,
              card_status,
              cardholder_id,
              created_at,
              nick_name,
              updated_at,
            },
          });
        }}
        style={{ cursor: "pointer" }}
      />
    ),
  };
};

export default function ColumnGroupingTable({ cards, setShowDetails }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("");
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.payments.isLoading);
  const listCards = useSelector((state) => state.card?.cardsList);

  const filteredcards =
    cards?.filter((item) => {
      const nameMatches =
        !searchQuery ||
        item.beneficiaryName
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase());
      const payoutMethodMatches =
        !selectedPayoutMethod || item?.payoutMethod === selectedPayoutMethod;

      return nameMatches && payoutMethodMatches;
    }) || [];
  //   const rows = filteredBeneficiaries?.map((item) =>

  const rows =
    listCards &&
    listCards?.map((item) =>
      createData(
        item.brand,
        item.card_id,
        item.card_number,
        item.card_status,
        item.cardholder_id,
        item.created_at?.slice(0, 10),
        item.nick_name,
        item.updated_at,
        setShowDetails
      )
    );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handlePayoutMethodChange = (e) => {
    setSelectedPayoutMethod(e.target.value);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="w-100">
      {/* <Paper sx={{ width: "100%" }} className="shadow"> */}
      {/* <div className="d-flex flex-fill row mt-3 mb-2 align-items-baseline justify-content-end">
        <div className="col-12 col-md-4 my-2 my-lg-0 h-100">
          <div className="d-flex ms-md-3 me-md-1 rounded-3 flex-fill">
            <input
              className="form-control  shadow p-3  bg-body rounded-5"
              type="search"
              placeholder="Search By Name"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="col-12 col-md-4 my-2 my-lg-0 h-100">
          <div className="d-flex ms-md-3 me-md-1 rounded-3 flex-fill">
            <select
              id="payoutMethod"
              className="form-control select p-3 bg-white shadow bg-body rounded-5 w-100"
              value={selectedPayoutMethod}
              onChange={handlePayoutMethodChange}>
              <option value="">Payout Method</option>
              {payoutmethod.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div> */}

      {/* {isLoading ? (
          <Listbeneficiary_Skeleton />
          ) : ( */}

      {/* )} */}

      {/* </Paper> */}

      <CustomTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        className="rounded-5 shadow border"
        maxHeight={500}
      />
    </div>
  );
}
