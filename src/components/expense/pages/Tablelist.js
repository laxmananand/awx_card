import React, { useEffect, useState } from "react";
import CustomSelect from "../../structure/CustomSelect";
import "../css/invoice-table.css";

import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

function CustomDateRange({ from, to, setFromDate, setToDate }) {
  const today = dayjs();

  return (
    <div
      className="d-flex align-items-center position-relative gap-2"
      style={{ fontSize: "15px" }}
    >
      <div className="from-date-table d-flex align-items-center justify-content-center gap-2 border rounded-5 px-4">
        <p className="grey1 my-auto text-nowrap">From</p>
        <DatePicker
          placeholder="From Date"
          value={from ? dayjs(from) : null}
          onChange={(date) => setFromDate(date ? date.toDate() : null)}
          views={["year", "month", "day"]}
          format="YYYY-MM-DD"
          className="w-100"
          maxDate={today}
        />
      </div>

      <div className="to-date-table d-flex align-items-center justify-content-center gap-2 border rounded-5 px-4">
        <p className="grey1 my-auto text-nowrap">To</p>
        <DatePicker
          placeholder="To Date"
          value={to ? dayjs(to) : null}
          onChange={(date) => setToDate(date ? date.toDate() : null)}
          views={["year", "month", "day"]}
          format="YYYY-MM-DD"
          className="w-100"
          minDate={from ? dayjs(from) : null}
          maxDate={today}
          disabled={!from}
        />
      </div>
    </div>
  );
}

function TableRow({ index, data, setShowDetails, setSelectedRowData }) {
  const colorList = [
    " blue100 bg-blue10",
    " green100 bg-green10",
    " yellow100 bg-yellow10",
  ];
  const row = data[index];
  function getColorClass(status) {
    if (status?.toUpperCase() === "P") {
      return "bg-yellow100 fs-8";
    } else if (status?.toUpperCase() === "C") {
      return "bg-green100 text-white fs-8";
    } else if (status?.toUpperCase() === "D") {
      return "bg-blue100 text-white fs-8";
    } else if (status?.toUpperCase() === "O") {
      return "bg-red100 text-white fs-8";
    } else if (status?.toUpperCase() === "R") {
      return "bg-secondary text-white fs-8";
    } else {
      return "bg-dark text-white fs-8";
    }
  }
  // Calculate the number of days overdue
  const dueDate = new Date(row?.dueDate);
  const currentDate = new Date();
  const timeDifference = currentDate - dueDate;
  const daysRemaining = Math.floor(timeDifference / (1000 * 3600 * 24));

  let overdueText = "";
  let overdueClass = "";

  if (daysRemaining > 0) {
    overdueText = `${daysRemaining} day${
      daysRemaining !== 1 ? "s" : ""
    } overdue`;
    overdueClass =
      "fw-500 py-2 rounded-pill text-white bg-danger text-center fs-8 w-max px-4 mx-auto"; // Change color for overdue
  } else if (daysRemaining === 0) {
    overdueText = "Due today";
    overdueClass =
      "fw-500 py-2 rounded-pill text-white bg-secondary text-center fs-8 w-max px-4 mx-auto"; // Change color for due today
  } else {
    overdueText = `Due in ${Math.abs(daysRemaining)} day${
      Math.abs(daysRemaining) !== 1 ? "s" : ""
    }`;
    overdueClass =
      "fw-500 py-2 rounded-pill text-white bg-success text-center fs-8 w-max px-4 mx-auto"; // Change color for due in the future
  }

  return (
    <tr
      onClick={() => {
        setShowDetails(true);
        setSelectedRowData(row);
      }}
      className="blueHover text-center align-middle"
      role="button"
    >
      <td scope="row" className="fw-500 opacity-75 text-center fs-8">
        {row?.id?.slice(0, 10)}
      </td>
      <td className="fw-500 d-flex justify-content-center">
        <div
          className={`d-inline-block py-2 px-4 rounded-pill fw-500 fs-8 ${getColorClass(
            row?.status
          )}`}
        >
          {row?.status === "P" || row?.status === "p"
            ? "Pending"
            : row?.status === "D" || row?.status === "d"
            ? "Draft"
            : row?.status === "O" || row?.status === "o"
            ? "Overdue"
            : row?.status === "C" || row?.status === "c"
            ? "Paid"
            : row?.status.toUpperCase() == "R" || row?.status === "r"
            ? "Processing"
            : row?.status}
        </div>
      </td>
      <td className="fw-500 opacity-75 text-center fs-8">
        {row?.recipientName}
      </td>

      <td className="fw-500 opacity-75 text-center fs-8">
        {row?.sourceOfFund}
      </td>
      <td>
        <div className={overdueClass}>{overdueText}</div>
      </td>

      <td className="fw-500 opacity-75 text-center fs-8">{row?.amount}</td>

      <td className="fw-500 opacity-75 text-center fs-8">
        {row?.recipientAccountnumber}
      </td>
    </tr>
  );
}

function TableRowinvoice({ index, row, setShowDetails, setSelectedRowData }) {
  const colorList = [
    "blue100 bg-blue10",
    "green100 bg-green10",
    "yellow100 bg-yellow10",
    "red100 bg-red10",
  ];

  function getColorClass(status) {
    if (status.toUpperCase() === "P") {
      return "bg-yellow100 text-dark fs-8";
    } else if (status.toUpperCase() === "A" || status.toUpperCase() === "C") {
      return "bg-success text-white fs-8";
    } else if (status.toUpperCase() === "D") {
      return "bg-blue100 text-white fs-8";
    } else if (status.toUpperCase() === "O") {
      return "bg-red100 text-white fs-8";
    } else {
      return "bg-dark text-white fs-8"; // Default case, no class
    }
  }

  // Calculate the number of days overdue
  const dueDate = new Date(row.dueDate);
  const currentDate = new Date(row.date);
  const timeDifference = currentDate - dueDate;
  const daysRemaining = Math.floor(timeDifference / (1000 * 3600 * 24));

  let overdueText = "";
  let overdueClass =
    "d-inline-block py-1 px-3 rounded-pill fw-500 yellow100 bg-yellow10 ";

  if (daysRemaining > 0) {
    overdueText = `${daysRemaining} day${
      daysRemaining !== 1 ? "s" : ""
    } overdue`;
    overdueClass = "py-2 px-4 text-light fw-500 bg-danger rounded-pill fs-8"; // Change color for overdue
  } else if (daysRemaining === 0) {
    overdueText = "Due today";
    overdueClass = "py-2 px-4 text-light fw-500 bg-primary rounded-pill fs-8"; // Change color for due today
  } else {
    overdueText = `Due in ${Math.abs(daysRemaining)} day${
      Math.abs(daysRemaining) !== 1 ? "s" : ""
    }`;
    overdueClass = "py-2 px-4 text-light fw-500 bg-success rounded-pill fs-8"; // Change color for due in the future
  }

  return (
    <tr
      onClick={() => {
        setShowDetails(true);
        setSelectedRowData(row);
      }}
      className="blueHover text-center align-middle"
      role="button"
    >
      <td scope="row" className="text-center opacity-75 fs-8">
        {row.id}
      </td>
      <td className="text-center opacity-75 fs-8">{row.customerName}</td>
      {/* <td className="ps-4 opacity-75">
        {row.customerEmail}
      </td>
      <td className="ps-4 opacity-75">
        {row.description}
      </td> */}
      <td className="text-center opacity-75 fs-8">{row.createdBy}</td>
      <td className="text-center opacity-75 fs-8">{row.date}</td>
      <td className="text-center opacity-75 fs-8">{row.dueDate}</td>
      <td className="text-center opacity-75 d-flex justify-content-center align-items-start">
        <div className={overdueClass} style={{ width: "150px" }}>
          {overdueText}
        </div>
      </td>
      <td className="text-center opacity-75">
        <div
          className={`d-inline-block py-2 px-4 rounded-pill fw-500 text-white w-75 ${getColorClass(
            row.status
          )}`}
        >
          {row.status.toUpperCase() === "P"
            ? "Pending"
            : row.status.toUpperCase() === "C" ||
              row.status.toUpperCase() === "A"
            ? "Paid"
            : row.status.toUpperCase() === "O"
            ? "Overdue"
            : row.status.toUpperCase() == "D"
            ? "Draft"
            : row.status}
        </div>
      </td>
    </tr>
  );
}

function Tablelist({
  setShowDetails,
  data,
  currentPage,
  setCurrentPage,
  totalPages,
  headers,
  setSelectedRowData,
  pagename,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}) {
  const options = [
    { value: "", label: "All" },
    { value: "D", label: "Draft" },
    { value: "P", label: "Pending" },
    { value: "C", label: "Paid" },
    { value: "O", label: "Overdue" },
  ];

  const optionsNew = [
    { value: "", label: "All" },
    { value: "D", label: "Draft" },
    { value: "P", label: "Pending" },
    { value: "C", label: "Paid" },
    { value: "O", label: "Overdue" },
    { value: "R", label: "Processing" },
  ];

  const [val, setVal] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Filter data based on the selected status
    if (data) {
      const filtered = data?.filter(
        (item) => val === "" || item.status?.toUpperCase() === val
      );
      setFilteredData(filtered);
    }
  }, [data, val]);

  useEffect(() => {
    // Filter data based on the selected status, search query for recipient name, and invoice ID
    const filtered = data.filter(
      (item) =>
        searchQuery === "" ||
        (item.recipientName &&
          item.recipientName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (item.id && item.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [searchQuery, data]);

  // Pagination logic
  const itemsPerPage = 10;
  const paginatedDataBills = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Pagination logic for invoices
  const paginatedDataInvoice = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPagesCalculated = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page whenever the filter or search query changes
  }, [filteredData, setCurrentPage]);

  return (
    <div>
      <div className="row mt-3 mb-5 d-flex flex-column ps-4">
        <span className="search-label ms-2 mb-3">Filter by:</span>

        <div className="d-flex align-items-center justify-content-start gap-3 w-100">
          <div className="col-12 col-md-4 w-50">
            <div className="mx-md-1">
              <CustomDateRange
                from={fromDate}
                to={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                className="w-100"
              />
            </div>
          </div>
          <div className="col-12 col-md-4 w-50">
            <div className="ms-md-1 me-md-3 h-100 py-2 border rounded-5 px-3">
              {pagename === "Invoices" ? (
                <CustomSelect
                  placeholder="Status: "
                  options={options}
                  setValue={setVal}
                />
              ) : (
                <CustomSelect
                  placeholder="Status: "
                  options={optionsNew}
                  setValue={setVal}
                />
              )}
            </div>
          </div>
        </div>

        <span className="search-label ms-2 my-3">Or search by:</span>

        <div className="col-12 col-md-4 my-lg-0 w-100">
          <div className="d-flex me-md-1 border rounded-5 flex-fill ps-4 pe-0 w-50">
            {pagename === "Invoices" ? (
              <input
                className="table-search-input border-0"
                type="search"
                placeholder="Search by Recipient Name or Invoice ID"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ opacity: "0.7" }}
              />
            ) : (
              <input
                className="table-search-input border-0"
                type="search"
                placeholder="Search by Recipient Name or Bill No"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ opacity: "0.7" }}
              />
            )}{" "}
            <button className="btn" type="submit" disabled>
              <img src="/search.svg" alt="Search" width={40} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-3 overflow-auto rounded-3 border">
        <table className="table">
          <thead className="table-light py-3">
            <tr className="grey1">
              {headers.map((header, index) => (
                <th key={index} scope="col" className="text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border-top-0">
            {pagename === "Bills" ? (
              paginatedDataBills.length > 0 ? (
                paginatedDataBills.map((item, index) => (
                  <TableRow
                    key={index}
                    data={paginatedDataBills}
                    index={index}
                    setShowDetails={setShowDetails}
                    setSelectedRowData={setSelectedRowData}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="text-center py-4">
                    <>
                      <div className="d-flex justify-content-center">
                        <div>
                          <img
                            src="/no_transactions.jpg"
                            alt="no-transactions-icon"
                            width={100}
                          />
                        </div>
                      </div>
                      <p className="text-center">
                        <span
                          className="fw-normal mt-3"
                          style={{
                            fontSize: "15px",
                            color: "var(--main-color)",
                          }}
                        >
                          Oops! It seems that you haven't created any bill(s)
                          for the given dates/search query.
                        </span>
                      </p>
                    </>
                  </td>
                </tr>
              )
            ) : pagename === "Invoices" ? (
              paginatedDataInvoice.length > 0 ? (
                paginatedDataInvoice.map((item, index) => (
                  <TableRowinvoice
                    key={index}
                    row={item}
                    index={index}
                    setShowDetails={setShowDetails}
                    setSelectedRowData={setSelectedRowData}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="text-center py-4">
                    <>
                      <div className="d-flex justify-content-center">
                        <div>
                          <img
                            src="/no_transactions.jpg"
                            alt="no-transactions-icon"
                            width={100}
                          />
                        </div>
                      </div>
                      <p className="text-center">
                        <span
                          className="fw-normal mt-3"
                          style={{
                            fontSize: "15px",
                            color: "var(--main-color)",
                          }}
                        >
                          Oops! It seems that you haven't created any invoice(s)
                          for the given dates/search query.
                        </span>
                      </p>
                    </>
                  </td>
                </tr>
              )
            ) : pagename === "Cards" ? (
              paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  data={data}
                  index={index}
                  setShowDetails={setShowDetails}
                  setSelectedRowData={setSelectedRowData}
                />
              ))
            ) : (
              <tr>
                <td colSpan={headers.length}>
                  Rows are not available based on the conditions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div
          className="d-flex justify-content-center align-items-center gap-4 mb-3"
          role="group"
          aria-label="Basic example"
        >
          <IconButton
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="fs-8 text-dark fw-600"
          >
            <ChevronLeft /> Previous
          </IconButton>
          <p className="fs-6 fw-bold py-2 px-3 border bg-white mb-0 border-secondary rounded-4 border-2">
            {currentPage}
          </p>
          <IconButton
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPagesCalculated}
            className="fs-8 text-dark fw-600"
          >
            Next <ChevronRight />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default Tablelist;
