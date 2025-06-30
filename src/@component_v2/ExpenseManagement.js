import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./expense.css";
import { ScaleLoader } from "react-spinners";
import Axios from "axios";
import { setListBill, setListInvoices } from "../@redux/features/expence";
import { CircularProgress } from "@mui/material";

const now = new Date();

// Get the individual components of the current date and time
const day = String(now.getDate()).padStart(2, "0"); // Day (2 digits)
const month = String(now.getMonth() + 1).padStart(2, "0"); // Month (2 digits, months are zero-based)
const year = String(now.getFullYear()); // Year (4 digits)
const hours = String(now.getHours()).padStart(2, "0"); // Hours (2 digits)
const minutes = String(now.getMinutes()).padStart(2, "0"); // Minutes (2 digits)

// Concatenate the components in the desired format
const formattedDateTime = `${year}-${month}-${day}`;
const formattedTime = `${hours}:${minutes}`;

const toDate = formattedDateTime;

// Calculate the date one month prior
const lastMonthDate = new Date(now);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

// If subtracting a month causes the date to fall into the previous year, adjust the year and month accordingly
if (lastMonthDate.getMonth() === 11) {
  lastMonthDate.setFullYear(lastMonthDate.getFullYear() - 1);
}

// Get the individual components of the last month date
const lastMonthDay = String(lastMonthDate.getDate()).padStart(2, "0"); // Day (2 digits)
const lastMonthMonth = String(lastMonthDate.getMonth() + 1).padStart(2, "0"); // Month (2 digits, months are zero-based)
const lastMonthYear = String(lastMonthDate.getFullYear()); // Year (4 digits)

// Concatenate the components in the desired format
const formattedLastMonthDate = `${lastMonthYear}-${lastMonthMonth}-${lastMonthDay}`;

const fromDate = formattedLastMonthDate;

console.log(`From Date: ${fromDate}`);
console.log(`To Date: ${toDate}`);

// const [tableData,setTableData]=useState('');
export const listinvoices = async ({ fromDate, toDate, dispatch }) => {
  // Convert fromDate and toDate to Date objects
  const fromDateObj = new Date(fromDate);
  const toDateObj = new Date(toDate);

  // Convert Date objects to yyyy-mm-dd format
  const formattedFromDate = fromDateObj.toISOString().split("T")[0];
  const formattedToDate = toDateObj.toISOString().split("T")[0];

  console.log(formattedFromDate); // Output: "2024-01-10"

  // Retrieve companyId from sessionStorage
  var company = sessionStorage.getItem("internalBusinessId");

  if (!company) return;
  try {
    // Make API call to fetch invoices
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/expense/listinvoices",
      {
        params: {
          companyId: company,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
        },
      }
    );

    if (response.status === 200 && response.data) {
      if (dispatch) {
        dispatch(setListInvoices(response.data));
      }
      return response.data;
    } else {
      console.log("No Invoice found or Internal Server Error!");
      //toast.error("Something went Wrong");
      return null;
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
    //toast.error("Error fetching invoices");
    return null;
  }
};

export const listBills = async ({ fromDate, toDate, dispatch }) => {
  // Convert fromDate and toDate to Date objects
  const fromDateObj = new Date(fromDate);
  const toDateObj = new Date(toDate);

  // Convert Date objects to yyyy-mm-dd format
  const formattedFromDate = fromDateObj.toISOString().split("T")[0] || null;
  const formattedToDate = toDateObj.toISOString().split("T")[0] || null;

  console.log("bills" + formattedFromDate); // Output: "2024-01-10"

  var company = sessionStorage.getItem("internalBusinessId");
  if (!company) return;
  try {
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/expense/listbills",
      {
        params: {
          companyId: company,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
        },
      }
    );

    let obj = response.data;

    //let parseddata=JSON.parse(obj);
    console.log(obj);

    if (response.status === 200 && response.data) {
      if (dispatch) {
        dispatch(setListBill(response.data));
      }
      return response;
    } else if (response.data.status === "NOT_FOUND") {
      return response;
    } else if (response.data.status === "BAD_REQUEST") {
      return response;
    } else {
      console.log("No bill found or Internal Server Error!");
      toast.error("Something went Wrong");
      return null;
    }
  } catch (error) {
    console.error("Error fetching bills:", error);
    toast.error("Error fetching bills");
    return null;
  }
};

const AllExpenses = ({ data, idx }) => {
  //data = data.filter((item, index) => data.indexOf(item) === index);

  let name = "user";
  let balance = 0.0;
  let currency = "";

  if (data.type === "Bill") {
    name = data.recipientName;
    balance = data.amount;
    currency = data.sourceOfFund;
  } else {
    name = data.customerName;
    // Parse itemDetails string into array
    const itemDetails = JSON.parse(data.itemDetails);
    // Sum up the amount values
    balance = itemDetails.reduce(
      (total, item) => total + parseFloat(item.amount),
      0
    );
  }

  return (
    <tr className="each-transaction align-middle">
      <td className="d-flex align-items-center h-100 border-0">
        <div
          className="rounded-circle bg-light-primary me-2"
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            width={18.75}
            height={14.25}
            src={
              data.type === "Bill"
                ? "/v2/misc/bill.svg"
                : "/v2/misc/invoice.svg"
            }
            className=""
          />
        </div>
        <div>
          <p className="m-0 p-0" style={{ fontSize: 14, fontWeight: 600 }}>
            {data.type === "Bill" ? "Bill" : "Invoice"}
          </p>
          <p
            className="m-0 p-0 opacity-50"
            style={{ fontSize: 12, fontWeight: 400 }}
          >
            {data.id}
          </p>
        </div>
      </td>
      <td className="h6 border-0">
        <p
          className="d-flex m-0 bg-pending rounded-pill px-4 py-2 text-align-center justify-content-center align-items-center"
          style={{ fontSize: 14, padding: "5px 12px", width: "max-content" }}
        >
          {data.status === "P"
            ? "Pending"
            : data.status === "R"
            ? "Review"
            : data.status === "C"
            ? "Paid"
            : "Pending"}
        </p>
      </td>
      <td className="h6 border-0">
        <div
          className="d-flex justify-content-center align-items-center gap-2"
          style={{ width: 50 }}
        >
          <img src="/v2/misc/calender.svg" style={{ width: 18, height: 20 }} />
          {/* <p style={{ fontSize: 12, marginBottom: 0 }}>{data?.date}</p> */}
        </div>
      </td>
      <td className="h6 border-0">
        <div className="d-flex justify-content-start align-items-start flex-column gap-2">
          <p className="m-0 p-0" style={{ fontSize: 14, opacity: 1 }}>
            {name}
          </p>
          <p className="m-0 p-0" style={{ fontSize: 12, opacity: 0.5 }}>
            {data?.description}
          </p>
        </div>
      </td>
      <td className="h6 border-0 text-error">
        <div className="d-flex justify-content-end align-items-center gap-1">
          {"-"}
          <span style={{ textAlign: "end", fontWeight: 600 }}>
            {Math.abs(balance).toFixed(2)} {currency || "SGD"}
          </span>
        </div>
      </td>
    </tr>
  );
};

const AllInvoices = ({ data, idx }) => {
  let name = "user";
  let balance = 0.0;
  let currency = "";

  if (data.type === "Bill") {
    name = data.recipientName;
    balance = data.amount;
    currency = data.sourceOfFund;
  } else {
    name = data.customerName;
    // Parse itemDetails string into array
    const itemDetails = JSON.parse(data.itemDetails);
    // Sum up the amount values
    balance = itemDetails.reduce(
      (total, item) => total + parseFloat(item.amount),
      0
    );
  }

  return (
    <tr className="each-transaction align-middle">
      <td className="d-flex align-items-center h-100 border-0">
        <div
          className="rounded-circle bg-light-primary me-2"
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            width={18.75}
            height={14.25}
            src={
              data.type === "Bill"
                ? "/v2/misc/bill.svg"
                : "/v2/misc/invoice.svg"
            }
            className=""
          />
        </div>
        <div>
          <p className="m-0 p-0" style={{ fontSize: 14, fontWeight: 600 }}>
            {data.type === "Bill" ? "Bill" : "Invoice"}
          </p>
          <p
            className="m-0 p-0 opacity-50"
            style={{ fontSize: 12, fontWeight: 400 }}
          >
            {data.id}
          </p>
        </div>
      </td>
      <td className="h6 border-0">
        <p
          className="d-flex m-0 bg-pending rounded-pill px-4 py-2 text-align-center justify-content-center align-items-center"
          style={{ fontSize: 14, padding: "5px 12px", width: "max-content" }}
        >
          {data.status === "P"
            ? "Pending"
            : data.status === "R"
            ? "Review"
            : data.status === "C"
            ? "Paid"
            : "Pending"}
        </p>
      </td>
      <td className="h6 border-0">
        <div
          className="d-flex justify-content-center align-items-center gap-2"
          style={{ width: 50 }}
        >
          <img src="/v2/misc/calender.svg" style={{ width: 18, height: 20 }} />
          {/* <p style={{ fontSize: 12, marginBottom: 0 }}>{data?.date}</p> */}
        </div>
      </td>
      <td className="h6 border-0">
        <div className="d-flex justify-content-start align-items-start flex-column gap-2">
          <p className="m-0 p-0" style={{ fontSize: 14, opacity: 1 }}>
            {name}
          </p>
          <p className="m-0 p-0" style={{ fontSize: 12, opacity: 0.5 }}>
            {data?.description}
          </p>
        </div>
      </td>
      <td className="h6 border-0 text-error">
        <div className="d-flex justify-content-end align-items-center gap-1">
          {"-"}
          <span style={{ textAlign: "end", fontWeight: 600 }}>
            {Math.abs(balance).toFixed(2)} {currency || "SGD"}
          </span>
        </div>
      </td>
    </tr>
  );
};

const AllBills = ({ data, idx }) => {
  let name = "user";
  let balance = 0.0;
  let currency = "";

  if (data.type === "Bill") {
    name = data.recipientName;
    balance = data.amount;
    currency = data.sourceOfFund;
  } else {
    name = data.customerName;
    // Parse itemDetails string into array
    const itemDetails = JSON.parse(data.itemDetails);
    // Sum up the amount values
    balance = itemDetails.reduce(
      (total, item) => total + parseFloat(item.amount),
      0
    );
  }

  return (
    <tr className="each-transaction">
      <td className="d-flex align-items-center p-2 h-100 border-0">
        <div
          className="rounded-circle bg-light-primary me-2"
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            width={18.75}
            height={14.25}
            src={
              data.type === "Bill"
                ? "/v2/misc/bill.svg"
                : "/v2/misc/invoice.svg"
            }
            className=""
          />
        </div>
        <div>
          <p className="m-0 p-0">{data.type === "Bill" ? "Bill" : "Invoice"}</p>
          <p className="m-0 p-0 opacity-50">{data.id}</p>
        </div>
      </td>
      <td className="h6 border-0">
        <p className="d-flex m-0 p-0 bg-pending rounded-pill px-3 py-2 text-align-center">
          {data.status === "P"
            ? "Pending"
            : data.status === "R"
            ? "Review"
            : data.status === "C"
            ? "Paid"
            : "Pending"}
        </p>
      </td>
      <td className="h6 border-0">
        <img src="/v2/misc/calender.svg" />
      </td>
      <td className="h6 border-0">
        <p className="d-flex m-0 p-0">{name}</p>
      </td>
      <td className="h6 border-0 text-error">
        {"-"}
        <span style={{ marginLeft: "6px" }}>
          {Math.abs(balance).toFixed(2)} {currency}
        </span>
      </td>
    </tr>
  );
};

function ExpenseManagementV2({ isActivated }) {
  const dispatch = useDispatch();
  const [dataLoading, setDataLoading] = useState(false);
  const subStatus = useSelector((state) => state.subscription?.data?.status);

  const [activeIndex, setActiveIndex] = useState(0); // State to track active item index

  const [invoicesData, setInvoicesData] = useState([]);
  const [billsData, setBillsData] = useState([]);
  const [allData, setAllData] = useState([]);

  const handleItemClick = (index) => {
    setActiveIndex(index); // Update active item index
  };

  useEffect(() => {}, [isActivated, subStatus]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoicesObj = await listinvoices({ fromDate, toDate, dispatch });
      if (invoicesObj && invoicesObj.length > 0) {
        // Add a 'type' property to each invoice item
        const invoicesWithLabel = invoicesObj.map((item) => ({
          ...item,
          type: "Invoice",
        }));
        setInvoicesData(invoicesWithLabel);
        return invoicesWithLabel;
      }
      return [];
    };

    const fetchBills = async () => {
      const billsObj = await listBills({ fromDate, toDate, dispatch });
      if (billsObj && billsObj.length > 0) {
        // Add a 'type' property to each bill item
        const billsWithLabel = billsObj.map((item) => ({
          ...item,
          type: "Bill",
        }));
        setBillsData(billsWithLabel);
        return billsWithLabel;
      }
      return [];
    };

    const setData = async () => {
      try {
        setDataLoading(true);
        const [invoicesWithLabel, billsWithLabel] = await Promise.all([
          fetchInvoices(),
          fetchBills(),
        ]);
        setAllData([...invoicesWithLabel, ...billsWithLabel]);
        setDataLoading(false);
      } catch (error) {
        setDataLoading(false);
        console.error("Error fetching data:", error);
        // Handle error if necessary
      }
    };

    setData();
  }, []);

  let userStatusObj = useSelector((state) => state.onboarding.UserStatusObj);
  const complianceStatus = useSelector(
    (state) => state.onboarding.complianceStatus
  );
  let platform = useSelector((state) => state.common.platform);

  const SubscriptionMessage = () => (
    <div
      className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3 h-100 expense-main"
      style={{ padding: "0" }}
    >
      <div
        className="d-flex flex-column position-relative"
        style={{ bottom: "0" }}
      >
        <div className="rounded-circle bg-light-primary mx-auto mb-3">
          <img
            src="/v2/sidebar/expense.svg"
            style={{ padding: "12px" }}
            width={48}
          />
        </div>
        <h4
          className="text-center"
          style={{ fontSize: "15px", lineHeight: "25px" }}
        >
          Supercharge your expense management!{" "}
          <Link to="/settings/subscription" style={{ color: "#327e9d" }}>
            Subscribe now{" "}
          </Link>
          to unlock Zoqq's full potential.
        </h4>
      </div>
    </div>
  );

  const LoadingMessage = ({ text }) => (
    <div className="p-3 d-flex flex-column align-items-center justify-content-center gap-5">
      <CircularProgress sx={{ color: "black" }} />
      {text}
    </div>
  );

  const EmptyExpenseMessage = () => (
    <>
      <div className="rounded-circle bg-light-primary mx-auto mb-3">
        <img
          src="/v2/sidebar/expense.svg"
          style={{ padding: "12px" }}
          width={48}
        />
      </div>
      <h4 className="text-center fs-6">You don't have any expenses yet</h4>
    </>
  );

  const ExpenseTable = ({ activeIndex, allData, invoicesData, billsData }) => (
    <div className="flex-fill position-relative h-100 overflow-auto mt-2">
      <div className="d-flex align-items-center gap-4">
        {["All", "Invoices", "Bills"].map((label, index) => (
          <span
            key={index}
            className={`heading ${activeIndex === index ? "active" : ""}`}
            onClick={() => handleItemClick(index)}
          >
            {label}
          </span>
        ))}
      </div>

      <table className="table position-absolute overflow-auto mt-4">
        <tbody>
          {activeIndex === 0 &&
            allData.map((item, index) => (
              <AllExpenses key={index} idx={index + 1} data={item} />
            ))}
          {activeIndex === 1 &&
            (invoicesData.length > 0 ? (
              invoicesData.map((item, index) => (
                <AllInvoices key={index} idx={index + 1} data={item} />
              ))
            ) : (
              <tr>
                <td colSpan="100%">No invoices available</td>
              </tr>
            ))}
          {activeIndex === 2 &&
            (billsData.length > 0 ? (
              billsData.map((item, index) => (
                <AllBills key={index} idx={index + 1} data={item} />
              ))
            ) : (
              <tr>
                <td colSpan="100%">No bills available</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  const ExpenseManagement = ({
    dataLoading,
    allData,
    invoicesData,
    billsData,
    activeIndex,
  }) => (
    <div
      className="rounded-5 bg-white d-flex flex-column border justify-content-center h-100 expense-main"
      style={{ padding: "30px" }}
    >
      {dataLoading ? (
        <LoadingMessage text="Fetching Expenses. Please Wait..." />
      ) : allData.length === 0 ? (
        <EmptyExpenseMessage />
      ) : (
        <>
          <div className="d-flex justify-content-between">
            <span style={{ fontSize: 16, fontWeight: 500 }}>
              Expense Management
            </span>
            <a
              href="#!"
              className="d-flex align-items-center text-primary-dark"
              style={{
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              View All
            </a>
          </div>

          <ExpenseTable
            activeIndex={activeIndex}
            allData={allData}
            invoicesData={invoicesData}
            billsData={billsData}
          />
        </>
      )}
    </div>
  );

  const OnboardingMessage = ({ userStatusObj }) => (
    <div
      className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3 h-100 expense-main"
      style={{ padding: "5rem 9rem" }}
    >
      <div className="rounded-circle bg-light-primary mx-auto mb-3">
        <img
          src="/v2/sidebar/expense.svg"
          style={{ padding: "12px" }}
          width={48}
        />
      </div>
      <h4
        className="text-center"
        style={{ fontSize: "15px", lineHeight: "25px" }}
      >
        {userStatusObj?.lastScreenCompleted === "8" &&
        userStatusObj?.userStatus === "F" ? (
          "Your profile is currently under review. You will be able to view your expenses and bills once the review process is complete."
        ) : (
          <p className="px-5 fw-600">
            <Link
              to="/onboarding/Home"
              style={{ color: "#327e9d", fontWeight: 600 }}
            >
              Activate your account{" "}
            </Link>
            and start tracking your expenses!
          </p>
        )}
      </h4>
    </div>
  );

  return (
    <>
      {isActivated ? (
        platform === "nium" && subStatus !== "active" ? (
          <SubscriptionMessage />
        ) : (
          <ExpenseManagement
            dataLoading={dataLoading}
            allData={allData}
            invoicesData={invoicesData}
            billsData={billsData}
            activeIndex={activeIndex}
          />
        )
      ) : (
        <>
          {platform === "awx" && complianceStatus === "COMPLETED" ? (
            <SubscriptionMessage />
          ) : (
            <OnboardingMessage userStatusObj={userStatusObj} />
          )}
        </>
      )}
    </>
  );
}

export default ExpenseManagementV2;
