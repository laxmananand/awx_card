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
import { listbeneficiaries } from "../../../../@redux/action/payments";
import { useSelector } from "react-redux";
import Listbeneficiary_Skeleton from "../../../../loading_Skeleton/Listbeneficiary_Skeleton";

import CustomInput from "../../../structure/NewStructures/CustomInput.js";

const columns = [
  { id: "beneficiaryName", label: "Beneficiary Name", minWidth: 170 },
  {
    id: "beneficiaryAccountNumber",
    label: "Account Number",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "beneficiaryEmail",
    label: "Email",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "payoutMethod",
    label: "Payout Method",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];
const payoutmethod = ["LOCAL", "SWIFT"];

function createData(
  beneficiaryName,
  payoutMethod,
  beneficiaryAccountNumber,
  beneficiaryEmail,
  beneficiaryBankName,
  beneficiaryContactNumber,
  beneficiaryAddress,
  destinationCurrency,
  destinationCountry,
  beneficiaryContactCountryCode,
  beneficiaryCountryCode,
  beneficiaryState,
  beneficiaryCity,
  beneficiaryPostcode,
  routingCodeType1,
  routingCodeValue1,
  beneficiaryHashId
) {
  return {
    beneficiaryName,
    payoutMethod,
    beneficiaryAccountNumber,
    beneficiaryEmail,
    beneficiaryBankName,
    beneficiaryContactNumber,
    beneficiaryAddress,
    destinationCurrency,
    destinationCountry,
    beneficiaryContactCountryCode,
    beneficiaryCountryCode,
    beneficiaryState,
    beneficiaryCity,
    beneficiaryPostcode,
    routingCodeType1,
    routingCodeValue1,
    beneficiaryHashId,
  };
}

export default function ColumnGroupingTable({ beneficiaries, setShowDetails }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("");
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.payments.isLoading);

  const filteredBeneficiaries =
    beneficiaries?.filter((item) => {
      const nameMatches =
        !searchQuery ||
        item.beneficiaryName
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase());
      const payoutMethodMatches =
        !selectedPayoutMethod || item?.payoutMethod === selectedPayoutMethod;

      return nameMatches && payoutMethodMatches;
    }) || [];
  const rows = filteredBeneficiaries?.map((item) =>
    createData(
      item.beneficiaryName,
      item.payoutMethod,
      item.beneficiaryAccountNumber,
      item.beneficiaryEmail,
      item.beneficiaryBankName,
      item.beneficiaryContactNumber,
      item.beneficiaryAddress,
      item.destinationCurrency,
      item.destinationCountry,
      item.beneficiaryContactCountryCode,
      item.beneficiaryCountryCode,
      item.beneficiaryState,
      item.beneficiaryCity,
      item.beneficiaryPostcode,
      item.routingCodeType1,
      item.routingCodeValue1,
      item.beneficiaryHashId
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
      <div className="d-flex flex-fill row mt-3 mb-2 align-items-baseline justify-content-end">
        
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

      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* {isLoading ? (
          <Listbeneficiary_Skeleton />
          ) : ( */}
      <TableContainer
        // sx={{ maxHeight: 500 }}
        className="rounded-5 border shadow">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  style={{
                    minWidth: column.minWidth,
                    fontWeight: "bold",
                  }}>
                  <h6>{column.label}</h6>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => {
                return (
                  <TableRow
                    className="rounded-pill"
                    style={{ cursor: "pointer" }}
                    tabIndex={-1}
                    key={row.code}
                    onClick={() => {
                      setShowDetails({ show: true, data: row });
                    }}
                    sx={{
                      "&:hover": {
                        borderRadius: "32px",
                        backgroundColor: "hsl(var(--primary), 39%, 93%)", // Light red color
                      },
                      "& > *": {
                        borderBottom: "unset", // Remove bottom border from cells
                      },
                    }}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      if (column.id === "beneficiaryName") {
                        return (
                          <TableCell
                            key={column.id}
                            align="center"
                            className="d-flex border-0 ps-4 align-items-center">
                            <div
                              className={`d-flex align-items-center justify-content-center rounded-circle bg-${
                                ["green", "yellow", "red"][idx % 3]
                              }-10 p-l-m`}
                              style={{ width: "40px", height: "40px" }}>
                              {value
                                ?.split(" ")
                                ?.map((item) =>
                                  item?.slice(0, 1)?.toUpperCase()
                                )
                                ?.slice(0, 3)}
                            </div>
                            <div className="ms-2 p-l-m">{value}</div>
                          </TableCell>
                        );
                      }
                      if (column.id === "payoutMethod") {
                        return (
                          <TableCell
                            key={column.id}
                            align="center"
                            className="d-flex border-0 ps-4 align-items-center justify-content-center">
                            <div
                              className={`d-flex align-items-center justify-content-center rounded-pill px-3 py-2 bg-${
                                ["red", "green"][value === "SWIFT" ? 0 : 1]
                              }-10 color-${
                                ["red", "green"][value === "SWIFT" ? 0 : 1]
                              }-70 p-l-m`}>
                              {value}
                            </div>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell
                          key={column.id}
                          align="center"
                          className=" border-0">
                          {(column.format && typeof value === "number"
                            ? column.format(value)
                            : value) || "-"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* )} */}

      {/* </Paper> */}
    </div>
  );
}
