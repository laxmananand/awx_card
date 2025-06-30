import React, { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import CustomSelect from "../../../structure/CustomSelect";
import CustomDateRange from "../../../structure/CustomDateRangePicker";
import RecentTransactions from "./RecentTransactions/RecentTransactions";
// import { transactionDetailsPayments } from "../../../../data/accounts/globalAccounts"
import {
  AccStatementPdfPayments,
  AccStatementCsvPayments,
} from "../../../../data/accounts/accountStatementDownloads";
import "../../../accounts/css/pagination.css";
import "../../../accounts/css/accounts.css";
// import "../../../onboarding/account.css"
import dayjs, { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { closeLoader, openLoader } from "../../../../@redux/features/common";
import { transactionDetailsPayments } from "../../../../@redux/action/accounts";
import { setTxnData } from "../../../../@redux/features/payments";
import { setTxnHistoryPayments } from "../../../../@redux/features/accounts";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  GetBusinessCorporationDetails,
  GetApplicantBusinessDetails,
} from "../../js/listTransactions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiBorderRadius } from "react-icons/bi";
import Select from "react-select";
import "../../../accounts/css/accounts.css";
import { getCurrencyList, getBankDetails } from "../../../../@redux/action/accounts";


function TransactionList({ setShowDetails }) {
  const [isMore, setIsmore] = useState(false);
  const [txnType, setTransactionType] = useState("All");
  const [fromDate, setFromDate] = useState(
    dayjs(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [toDate, setToDate] = useState(dayjs(new Date()));
  // const [transactionsValidations, setTransactions] = useState([]);
  const isLoading = useSelector((state) => state.accounts.isLoading);
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [transactionStatus, setTransactionStatus] = useState();
  const [txnId, setTxnId] = useState();
  const transactions = useSelector(
    (state) => state.accounts.txnHistoryPayments?.data
  );
  const totalPages = useSelector(
    (state) => state.accounts.txnHistoryPayments?.totalPages
  );
  const dispatch = useDispatch();
  const custHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );
  const [transactionTypeObject, setTransactionTypeObject] = useState({
    value: "",
    label: "All",
  });

  const currencies = useSelector((state) => state.accounts.currencyList);
  const type = useSelector((state) => state.accounts.currentType);
  const bankDetails = useSelector((state) => state.accounts.bankDetails);
  const [accountNumber, setAccNumber] = useState("")

   // AWX Account ID / Business ID
   const awxAccountId = useSelector((state) => state.auth.awxAccountId);
   const platform = useSelector((state)=>state.common.platform);


  //Use to change the default date by calender
  const handleFromDateChange = (newFromDate) => {
    setFromDate(newFromDate);
    setCurrentPage(1);
  };

  const handleToDateChange = (newToDate) => {
    setToDate(newToDate);
    setCurrentPage(1);
  };

  const optionsAWX = [
    { value: "All", label: "All" },
    { value: "Deposits", label: "Deposits" },
    { value: "PayoutsTXN", label: "Payouts" },
    { value: "cardsTXN", label: "Cards" }
  ]

  const options = [
    { value: "", label: "All" },
    { value: "Remittance_Debit", label: "Wallet to Wallet Transfer" },
    { value: "Remittance_Debit_External", label: "Wallet To Account Transfer" },
    { value: "Remittance_Reversal", label: "Wallet To Account Reversal" },
    // { value: "Wallet_Credit_Mode_Card", label: "Wallet Credit Mode Card" },
    // {
    //   value: "Wallet_Credit_Mode_Prefund",
    //   label: "Wallet Credit Mode Prefund",
    // },
    // {
    //   value: "Wallet_Credit_Mode_Prefund_Cross_Currency",
    //   label: "Wallet Credit Mode Prefund Cross Currency",
    // },
    {
      value: "Wallet_Credit_Mode_Offline",
      label: "Own Bank to Wallet Transfer",
    },
    {
      value: "Wallet_Credit_Mode_Offline_Cross_Currency",
      label: "Own Bank to Wallet Transfer Multi Currency",
    },
    {
      value: "Wallet_Credit_Mode_Offline_ThirdParty",
      label: "Third Party Bank To Wallet Transfer",
    },
    { value: "Wallet_Fund_Transfer", label: "Wallet to Wallet Currency Conversion" },
    {
      value: "Customer_Wallet_Credit_Fund_Transfer",
      label: "Peer To Peer Wallet Transfer In",
    },
    {
      value: "Customer_Wallet_Debit_Fund_Transfer",
      label: "Peer To Peer Wallet Transfer Out",
    },
    {
      value: "Customer_Wallet_Debit_Intra_Region",
      label: "Peer To Peer Wallet Transfer out Region",
    },
    {
      value: "Customer_Wallet_Credit_Intra_Region",
      label: "Wallet To Wallet Transfer IN Region",
    },
    {
      value: "Customer_Wallet_Debit_Cross_Region",
      label: "Wallet To Wallet Transfer Out Cross Region",
    },
    {
      value: "Customer_Wallet_Credit_Cross_Region",
      label: "Wallet To Wallet Transfer IN Cross Region",
    },
    { value: "Client_Prefund", label: "Client Prefund" },
    { value: "Client_Refund", label: "Client Refund" },
    { value: "Fee_Debit", label: "Fee Debit" },
    { value: "Fee_Reversal", label: "Fee Reversal" },
    { value: "Fee_Waiver", label: "Fee Waiver" },
    { value: "Transfer_Local", label: "Transfer Local" },
    { value: "Transfer_Local_Reversal", label: "Transfer Local Reversal" },
    // { value: "Regulator_Auto_Sweep", label: "Regulator Auto Sweep" },
    // { value: "Regulatory_Block", label: "Regulatory Block" },
    // { value: "Regulatory_Debit", label: "Regulatory Debit" },
    // { value: "Regulatory_Debit_Reversal", label: "Regulatory Debit Reversal" },
  ];

  const optionTxnStatus = [
    { value: "", label: "All" },
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  async function fetchTransactionData() {
    const from_D = new Date(fromDate.toString());
    const from_year = from_D.getFullYear();
    const from_month = String(from_D.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1 and pad with '0' if needed.
    const from_day = String(from_D.getDate()).padStart(2, "0");
    let from_Date = `${from_year}-${from_month}-${from_day}`;

    const to_D = new Date(toDate.toString());
    const to_year = to_D.getFullYear();
    const to_month = String(to_D.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1 and pad with '0' if needed.
    const to_day = String(to_D.getDate()).padStart(2, "0");
    let to_Date = `${to_year}-${to_month}-${to_day}`;

    const formData = {
      txnType,
      fromDate: from_Date,
      toDate: to_Date,
      currentPage,
    };

    // dispatch(openLoader());

    try {
      if(platform === "awx"){
        dispatch(transactionDetailsPayments(formData, awxAccountId));
      }
      else{
        dispatch(transactionDetailsPayments(formData, custHashId));
      }
      
      //  alert("api call happend 2");

      //dispatch(closeLoader());
    } catch (error) {
      console.error("Error fetching recent conversion data:", error);
      //dispatch(closeLoader());
    }
  }

  async function fetchTransactionData2() {
    const formData = { txnType, currentPage };

    dispatch(openLoader());

    try {
      if(platform === "awx"){
        dispatch(transactionDetailsPayments(formData, awxAccountId));
      }
      else{
        dispatch(transactionDetailsPayments(formData, custHashId));
      }
      dispatch(closeLoader());
    } catch (error) {
      console.error("Error fetching recent conversion data:", error);
      dispatch(closeLoader());
    }
  }

  async function fetchTransactionDataDeposits() {

    const formData = { txnType, currentPage,  accountId: accountNumber?.value};

    dispatch(openLoader());

    try {
      if(platform === "awx"){
        dispatch(transactionDetailsPayments(formData, awxAccountId));
      }
      else{
        dispatch(transactionDetailsPayments(formData, custHashId));
      }
      dispatch(closeLoader());
    } catch (error) {
      console.error("Error fetching recent conversion data:", error);
      dispatch(closeLoader());
    }
  }

  // function for search by TXN ID

  async function fetchTransactionData3() {
    const formData = { txnId: txnId };

    dispatch(openLoader());

    try {

      if(platform === "awx"){
        dispatch(transactionDetailsPayments(formData, awxAccountId));
      }
      else{
        dispatch(transactionDetailsPayments(formData, custHashId));
      }
      //  alert("api call happend Txn id");

      dispatch(closeLoader());
    } catch (error) {
      console.error("Error fetching recent conversion data:", error);
      dispatch(closeLoader());
    }
  }

  //for pagination
  async function fetchTransactionDataPagination() {
    const from_D = new Date(fromDate.toString());
    const from_year = from_D.getFullYear();
    const from_month = String(from_D.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1 and pad with '0' if needed.
    const from_day = String(from_D.getDate()).padStart(2, "0");
    let from_Date = `${from_year}-${from_month}-${from_day}`;

    const to_D = new Date(toDate.toString());
    const to_year = to_D.getFullYear();
    const to_month = String(to_D.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so we add 1 and pad with '0' if needed.
    const to_day = String(to_D.getDate()).padStart(2, "0");
    let to_Date = `${to_year}-${to_month}-${to_day}`;

    const formData = {
      txnType,
      fromDate: from_Date,
      toDate: to_Date,
      currentPage,
    };

    dispatch(openLoader());

    try {
      if(platform === "awx"){
        dispatch(transactionDetailsPayments(formData, awxAccountId));
      }
      else{
        dispatch(transactionDetailsPayments(formData, custHashId));
      }
      //  alert("api call happend pagination");
      dispatch(closeLoader());
    } catch (error) {
      console.log("Error fetching recent conversion data:", error);
      dispatch(closeLoader());
    }
  }

  useEffect(() => {
  if(platform !== "awx"){
    if (fromDate && toDate) fetchTransactionData();
    else if (txnType) fetchTransactionData2();
  }
  else{
      if (txnType !== "Deposits"){
        fetchTransactionData2();
      }
      else if (txnType === "Deposits" && accountNumber && currencies){
      fetchTransactionDataDeposits();
     }
  }
  }, [toDate, fromDate, txnType, platform, accountNumber, currencies]);

  // Function to handle pagination
  async function handlePagination(direction) {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    // await fetchTransactionDataPagination(); // Assuming this function is defined elsewhere
  }

  // Use useEffect to call the API when currentPage changes
  useEffect(() => {
    async function fetchData() {
      await fetchTransactionDataPagination();
    }

    fetchData();
  }, [currentPage]);

  function generatePaginationLinks() {
    const pages = [];
    const maxPagesToShow = 10; // Change this number according to your requirement

    // If totalPages is less than or equal to maxPagesToShow, show all pages
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <li
            key={i}
            className={`page-number ${currentPage === i ? "active" : ""}`}
          >
            <a href="#!" onClick={() => handlePageClick(i)}>
              {i}
            </a>
          </li>
        );
      }
    } else {
      const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
      let startPage = currentPage - halfMaxPagesToShow;
      let endPage = currentPage + halfMaxPagesToShow;

      // Adjust startPage and endPage if they go beyond boundaries
      if (startPage < 1) {
        startPage = 1;
        endPage = maxPagesToShow;
      }
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxPagesToShow + 1;
      }

      // Add first page
      pages.push(
        <li
          key={1}
          className={`page-number ${currentPage === 1 ? "active" : ""}`}
        >
          <a href="#!" onClick={() => handlePageClick(1)}>
            {1}
          </a>
        </li>
      );

      // Add ellipsis if startPage is greater than 2
      if (startPage > 1) {
        pages.push(
          <li key="ellipsis-start">
            <span className="pagination-ellipsis">....</span>
          </li>
        );
      }

      // Add pages within range
      for (let i = startPage + 1; i < endPage; i++) {
        pages.push(
          <li
            key={i}
            className={`page-number ${currentPage === i ? "active" : ""}`}
          >
            <a href="#!" onClick={() => handlePageClick(i)}>
              {i}
            </a>
          </li>
        );
      }

      // Add ellipsis if endPage is less than totalPages - 1
      if (endPage < totalPages - 1) {
        pages.push(
          <li key="ellipsis-end">
            <span className="pagination-ellipsis">....</span>
          </li>
        );
      }

      // Add last page
      pages.push(
        <li
          key={totalPages}
          className={`page-number ${
            currentPage === totalPages ? "active" : ""
          }`}
        >
          <a href="#!" onClick={() => handlePageClick(totalPages)}>
            {totalPages}
          </a>
        </li>
      );
    }

    return pages;
  }

  // pdf download condition
  const pdfButtonClick = async () => {
    var buttonText = document.getElementById("button-text");
    var buttonLoader = document.getElementById("button-loader");

    buttonText.style.display = "none";
    buttonLoader.style.display = "flex";
    document.getElementById("pdfDwBtn").disabled = true;

    const result = await GetBusinessCorporationDetails();
    console.log(result);

    if (result && result.hasOwnProperty("businessRegistrationNumber")) {
      const result2 = await GetApplicantBusinessDetails();

      if (result2 && result2.hasOwnProperty("internalBusinessId")) {
        AccStatementPdfPayments(
          { txnType, fromDate, toDate, currentPage },
          custHashId
        );
      } else if (
        result2 &&
        result2.hasOwnProperty("status") &&
        result2.status == "BAD_REQUEST"
      ) {
        toast.error(result2.message);
        buttonText.style.display = "flex";
        buttonLoader.style.display = "none";
        document.getElementById("pdfDwBtn").disabled = false;
      } else {
        toast.error("Oops! Something went wrong!");
        buttonText.style.display = "flex";
        buttonLoader.style.display = "none";
        document.getElementById("pdfDwBtn").disabled = false;
      }
    } else if (
      result &&
      result.hasOwnProperty("status") &&
      result.status == "BAD_REQUEST"
    ) {
      toast.error(result.message);
      buttonText.style.display = "flex";
      buttonLoader.style.display = "none";
      document.getElementById("pdfDwBtn").disabled = false;
    } else {
      toast.error("Oops! Something went wrong!");
      buttonText.style.display = "flex";
      buttonLoader.style.display = "none";
      document.getElementById("pdfDwBtn").disabled = false;
    }
  };

  const handlePageClick = async (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //-----pdf condition end------

  // Date for reset

  const endDate = new Date().toISOString();

  var endDateParse = Date.parse(endDate);

  var endDateObj = new Date(endDateParse);

  var endDD = String(endDateObj.getDate()).padStart(2, "0");
  var endMM = String(endDateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since it's zero-based
  var endYYYY = endDateObj.getFullYear();

  const endDateFormat = endYYYY + "-" + endMM + "-" + endDD;

  const startDateSevenDaysAgo = new Date(
    endDateParse - 7 * 24 * 60 * 60 * 1000
  ); // Subtract 7 days in milliseconds

  var startDateObj = new Date(startDateSevenDaysAgo);

  const startDD = String(startDateObj.getDate()).padStart(2, "0");
  const startMM = String(startDateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since it's zero-based
  const startYYYY = startDateObj.getFullYear();

  const startDateFormat = startYYYY + "-" + startMM + "-" + startDD;

  /////----------------- TXN HIstory for AWX ------------------------///////////////
      
      
  // Call get Currency List for currency 
   useEffect(() => {
        if (platform === "awx" && awxAccountId) {
          dispatch(getCurrencyList(awxAccountId));
        }
      }, [platform, awxAccountId]);
      
  // filtered currency dropdown for AWX
  
  const allowedCurrencies = ['AED','AUD', 'BRL', 'CAD', 'DKK', 'EUR', 'GBP', 'HKD', 'IDR', 'ILS', 'MXN', 'NZD', 'SGD', 'USD'];
  
  // Filtered list
  const filteredCurrencies = currencies?.filter(currencyObj => 
    allowedCurrencies.includes(currencyObj?.name)
  );

  // currency option for awx

  const awxOptions = filteredCurrencies?.map(currencyObj => ({
    value: currencyObj?.name,
    label: (
      <div>
        <img
          src={`/Rounded_Flags/${currencyObj?.name.slice(0, 2).toLowerCase()}.svg`}
          className="rounded-circle"
          alt={currencyObj?.name}
          width={30}
        />
        <> </>
        <strong>{currencyObj?.name}</strong>
      </div>
    ),
  }));

  const awxAccNumOptions = bankDetails?.map(AccObj => ({
    value: AccObj?.id,
    label: "A/C : " + AccObj?.account_number
  }));

  // Styles for currency dropdown
  const customStyles = {
    control: (base, state) => ({
      ...base,
      padding: "2px",
      fontSize: "18px",
      position: "relative",
      boxShadow: "none",
      borderRadius: "32px",
      minWidth: "150px",     // Minimum width
      width: "100%",         // Stretch to fill parent
      maxWidth: "400px",  
    }),
  };

  useEffect(() => {
    if (currencies?.length) {
      const defaultCurrency = "SGD";
      changeCurrency(defaultCurrency); // this also fetches bank details
    }
  }, [currencies]);

   const changeCurrency = (type) => {
          if(platform === "awx"){
          dispatch(getBankDetails(type, awxAccountId));
          setAccNumber("");
          }
        };

   
    
      useEffect(() => {
          if (type) {
            if(platform === "awx"){
            dispatch(getBankDetails(type, awxAccountId));
            }
          }
        }, [type]);

  /////////////----------------------------------------------------/////////////////////////////

  if (transactions == "**No transactions found**") {
    return (
      <div>
        <div className="my-3 d-flex flex-row align-items-center">

        {platform === "awx" &&
        <>
          <div className="flex-fill me-3" style={{ maxWidth: "350px" }}>
            <label
              className="mb-3"
              style={{ marginLeft: "15px", fontSize: "18px" }}
            >
              Transaction Type
            </label>
            <div className="d-flex ms-md-3 me-md-1 border rounded-5 flex-fill py-2 p-2">
              <div className="input-group containertext w-100 h-100">
                <Select
                  className="w-100"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: "none",
                      borderRadius: "60px",
                      boxShadow: "none",
                      "&:hover": {
                        border: "none",
                      },
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 2,
                      borderRadius: "10px",
                    }),
                  }}
                  options={optionsAWX}
                  value={transactionTypeObject}
                  onChange={(item) => {
                    setTransactionType(item.value);
                    setTransactionTypeObject(item);
                  }}
                />{" "}
              </div>
            </div>
          </div>

{txnType === "Deposits" &&
  <>
   <div className="flex-fill" style={{ maxWidth: "200px" }}>
        <label
          className="mb-3"
          style={{ marginLeft: "15px", fontSize: "18px" }}
        >
          Currency
        </label>
     {/* Currency List Dropdown  */}
    <div id="accountsCuurencyDropdown">
      <div className="custom-select-container">
         <div className="custom-select">
           <Select
              styles={customStyles}
              className="rounded-5 border"
              value={awxOptions.find(
              (option) => option.value === type
              )
              }
              onChange={(selectedOption) =>
              changeCurrency(selectedOption.value)
              }
              options={awxOptions}
              />
              </div>
              </div>
              </div>
        </div>

      {/* Account number Dropdown  */}
      <div className="flex-fill" style={{ maxWidth: "280px" }}>
        <label
          className="mb-3"
          style={{ marginLeft: "15px", fontSize: "18px" }}
        >
          Account Number
        </label>
        <div id="accountsNumberDropdown">
        <div className="custom-select-container">
          <div className="custom-select">
          <Select
          styles={customStyles}
          className="rounded-5 border"
          value={accountNumber} // use directly
          onChange={(item) => setAccNumber(item)}
          options={awxAccNumOptions}
         />
        </div>
        </div>
        </div>
        </div>
        </>
}
</>
}

          

{platform !== "awx" &&
<>
<div className="">
            <label
              className="mb-3"
              style={{ marginLeft: "5px", fontSize: "18px" }}
            >
              Date Range
            </label>
            <div className="">
              <div className="rounded-5 mx-md-1 border">
                <CustomDateRange
                  className="w-30"
                  from={fromDate}
                  to={toDate}
                  setFromDate={handleFromDateChange}
                  setToDate={handleToDateChange}
                />
              </div>
            </div>
          </div>
          <div className="flex-fill" style={{ maxWidth: "350px" }}>
            <label
              className="mb-3"
              style={{ marginLeft: "15px", fontSize: "18px" }}
            >
              Transaction Type
            </label>
            <div className="d-flex ms-md-3 me-md-1 border rounded-5 flex-fill py-2 p-2">
              <div className="input-group containertext w-100 h-100">
                <Select
                  className="w-100"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: "none",
                      borderRadius: "60px",
                      boxShadow: "none",
                      "&:hover": {
                        border: "none",
                      },
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 2,
                      borderRadius: "10px",
                    }),
                  }}
                  options={options}
                  value={transactionTypeObject}
                  onChange={(item) => {
                    setTransactionType(item.value);
                    setTransactionTypeObject(item);
                  }}
                />{" "}
              </div>
            </div>
          </div>
  
          <div className="d-flex align-items-stretch h-100 ms-2">
            <button
              className="btn-action rounded-5 mx-2 text-nowrap"
              style={{ marginTop: "35px", border: "none", width: "115px" }}
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  transactionDetailsPayments(
                    { fromDate: startDateFormat, toDate: endDateFormat },
                    custHashId
                  )
                );
                setFromDate(startDateFormat);
                setToDate(endDateFormat);
                setTransactionType("");
                setTransactionTypeObject({ value: "", label: "All" });
                setTxnId("");
              }}
            >
              <div
                className="addAccountButtonText"
                style={{
                  fontWeight: "bold",
                  marginLeft: "-14px",
                  marginTop: "5px",
                }}
              >
                RESET
                <span style={{ fontWeight: "bold" }}>
                  <img
                    src="/reset.svg"
                    alt="Drag and Drop"
                    className="image-filter"
                  />
                </span>
              </div>
            </button>
          </div>
          </>
  }

        </div>
        <div className="mx-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center w-50">
              <img src="/refresh.svg" alt="Refresh Icon" />
              <h5 className="m-0 ms-2 w-50">Recent Transactions</h5>
            </div>
            {platform !== "awx" &&
            <div className="d-flex align-items-center w-25 border rounded-5 py-2">
              <input
                className="form-control border-0 p-relative"
                type="search"
                placeholder="Search By TXN ID"
                aria-label="Search"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                style={{
                  borderStartStartRadius: "20px",
                  borderEndStartRadius: "20px",
                }}
              />
              <button
                className="border-0 bg-white me-2"
                onClick={(e) => {
                  e.preventDefault();
                  fetchTransactionData3();
                }}
                type="button"
              >
                <img src="/search.svg" width={30} />
              </button>
            </div>
  }
          </div>
          <br></br>
          <div
            className="w-100 row"
            style={{ overflow: "auto", maxHeight: "500px" }}
          >
            <RecentTransactions
              setShowDetails={setShowDetails}
              transactions={transactions}
              isLoading={isLoading}
              transactionType = {txnType}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="my-3 d-flex flex-row align-items-center">

      { platform === "awx" && (
        <> 
     {/* Transaction Type  */}
        <div className="flex-fill me-3" style={{ maxWidth: "250px" }}>
            <label
              className="mb-3"
              style={{ marginLeft: "15px", fontSize: "18px" }}
            >
              Transaction Type
            </label>
            <div className="d-flex ms-md-3 me-md-1 border rounded-5 flex-fill py-2 p-2">
              <div className="input-group containertext w-100 h-100 rounded-5">
                <Select
                  className="w-100"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: "none",
                      borderRadius: "5px",
                      boxShadow: "none",
                      "&:hover": {
                        border: "none",
                      },
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 2,
                      borderRadius: "5px",
                      marginTop: "15px", // Add vertical spacing here

                    }),
                  }}
                  options={optionsAWX}
                  value={transactionTypeObject}
                  onChange={(item) => {
                    setTransactionType(item.value);
                    setTransactionTypeObject(item);
                  }}
                />
              </div>
            </div>
          </div>
      {txnType === "Deposits" &&
      <>
       <div className="flex-fill" style={{ maxWidth: "200px" }}>
            <label
              className="mb-3"
              style={{ marginLeft: "15px", fontSize: "18px" }}
            >
              Currency
            </label>
         {/* Currency List Dropdown  */}
        <div id="accountsCuurencyDropdown">
          <div className="custom-select-container">
             <div className="custom-select">
               <Select
                  styles={customStyles}
                  className="rounded-5 border"
                  value={awxOptions.find(
                  (option) => option.value === type
                  )
                  }
                  onChange={(selectedOption) =>
                  changeCurrency(selectedOption.value)
                  }
                  options={awxOptions}
                  />
                  </div>
                  </div>
                  </div>
            </div>

          {/* Account number Dropdown  */}
          <div className="flex-fill" style={{ maxWidth: "280px" }}>
            <label
              className="mb-3"
              style={{ marginLeft: "15px", fontSize: "18px" }}
            >
              Account Number
            </label>
            <div id="accountsNumberDropdown">
            <div className="custom-select-container">
              <div className="custom-select">
              <Select
              styles={customStyles}
              className="rounded-5 border"
              value={accountNumber} // use directly
              onChange={(item) => setAccNumber(item)}
              options={awxAccNumOptions}
             />
            </div>
            </div>
            </div>
            </div>
            </>
  }
            </>
           )}
               
         

{platform !== "awx" &&  
    <>
     <div className="">
            <label
              className="mb-3"
              style={{ marginLeft: "5px", fontSize: "18px" }}
            >
              Date Range
            </label>
            <div className="">
              <div className="rounded-5 mx-md-1 border">
                <CustomDateRange
                  className="w-30"
                  from={fromDate}
                  to={toDate}
                  setFromDate={handleFromDateChange}
                  setToDate={handleToDateChange}
                />
              </div>
            </div>
          </div>
          <div className="flex-fill" style={{ maxWidth: "350px" }}>
            <label
              className="mb-3"
              style={{ marginLeft: "15px", fontSize: "18px" }}
            >
              Transaction Type
            </label>
            <div className="d-flex ms-md-3 me-md-1 border rounded-5 flex-fill py-2 p-2">
              <div className="input-group containertext w-100 h-100 rounded-5">
                <Select
                  className="w-100"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: "none",
                      borderRadius: "5px",
                      boxShadow: "none",
                      "&:hover": {
                        border: "none",
                      },
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 2,
                      borderRadius: "5px",
                    }),
                  }}
                  options={options}
                  value={transactionTypeObject}
                  onChange={(item) => {
                    setTransactionType(item.value);
                    setTransactionTypeObject(item);
                  }}
                />
              </div>
            </div>
          </div>

          {/* <div className="flex-fill" >
          <label className='mb-3' style={{ marginLeft: "15px" }}>Status</label>
          <div className='d-flex ms-md-3 me-md-1 border rounded-3 flex-fill py-2'>
            <div className="input-group containertext w-100 h-100">
              <CustomSelect options={optionTxnStatus} setValue={setTransactionStatus} />
            </div>
          </div>
        </div> */}

          <div className="d-flex align-items-stretch h-100 ">
            <button
              className="btn-action rounded-5 h-100 mx-2 p-3  text-nowrap"
              id="pdfDwBtn"
              style={{ marginTop: "35px", border: "none" }}
              onClick={(e) => {
                e.preventDefault();
                pdfButtonClick();
              }}
            >
              <div
                id="button-text"
                style={{ marginLeft: "2%", marginTop: "2px" }}
              >
                <div
                  className="addAccountButtonText"
                  style={{ fontWeight: "bold" }}
                >
                  PDF
                </div>
                <span style={{ fontWeight: "bold" }}>
                  <img
                    src="/draganddrop_w.svg"
                    alt="Drag and Drop"
                    className="image-filter"
                  />
                </span>
              </div>
              <div id="button-loader" style={{ marginLeft: "4%" }}>
                <img
                  className="addAccountButtonLoader"
                  style={{ width: "54px", height: "28px" }}
                  alt=""
                  src="\accounts\Double Ring-1.5s-200px.gif"
                />
              </div>
            </button>
            <button
              className="btn-action rounded-5 h-100 mx-1 p-3 fw-500 text-nowrap"
              id="CsvDwBtn"
              style={{ marginTop: "35px", border: "none" }}
              onClick={(e) => {
                e.preventDefault();
                AccStatementCsvPayments(
                  { txnType, fromDate, toDate, currentPage },
                  custHashId
                );
              }}
            >
              <div
                id="button-textTwo"
                style={{ marginLeft: "2%", marginTop: "2px" }}
              >
                <div
                  className="addAccountButtonText"
                  style={{ fontWeight: "bold" }}
                >
                  CSV
                  <span style={{ fontWeight: "bold" }}>
                    <img
                      src="/draganddrop_w.svg"
                      alt="Drag and Drop"
                      className="image-filter"
                    />
                  </span>
                </div>
              </div>
              <div id="button-loaderTwo" style={{ marginLeft: "4%" }}>
                <img
                  className="addAccountButtonLoader"
                  style={{ width: "54px", height: "28px" }}
                  alt=""
                  src="\accounts\Double Ring-1.5s-200px.gif"
                />
              </div>
            </button>
            <button
              className="btn-action rounded-5 mx-2 text-nowrap"
              style={{ marginTop: "35px", border: "none", width: "115px" }}
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  transactionDetailsPayments(
                    { fromDate: startDateFormat, toDate: endDateFormat },
                    custHashId
                  )
                );
                setFromDate(startDateFormat);
                setToDate(endDateFormat);
                setTransactionType("");
                setTransactionTypeObject({ value: "", label: "All" });
                setTxnId("");
              }}
            >
              <div
                className="addAccountButtonText"
                style={{
                  fontWeight: "bold",
                  marginLeft: "-14px",
                  marginTop: "5px",
                }}
              >
                RESET
                <span style={{ fontWeight: "bold" }}>
                  <img
                    src="/reset.svg"
                    alt="Drag and Drop"
                    className="image-filter"
                  />
                </span>
              </div>
            </button>
          </div>
          </>
  }
        </div>

        {/* {isMore && <div className='d-flex'>
        <div className='border w-50 h-10 rounded-3 mx-0 ml-10'><CustomSelect placeholder={"status"}/></div>
      </div>}  */}

        {/* 
       <button className='col-12 blue100 text-center mb-4 w-30' onClick={()=>setIsmore(!isMore)} role='button'>
        {isMore?<>Less Filters</>:<>More Filters</>} 
      </button>  */}

        <div className="mx-3">
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ marginTop: "30px" }}
          >
            <div className="d-flex align-items-center w-50">
              <img src="/refresh.svg" alt="Refresh Icon" />
              <h5 className="m-0 ms-2 w-50">Recent Transactions</h5>
            </div>

             {/* Search by TXN id field */}
            {platform!=="awx" &&
            <div className="d-flex align-items-center w-25 border rounded-5 py-2">
              <input
                className="form-control border-0 p-relative"
                type="search"
                placeholder="Search By TXN ID"
                aria-label="Search"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                style={{
                  borderStartStartRadius: "20px",
                  borderEndStartRadius: "20px",
                }}
              />
              <button
                className="border-0 bg-white me-2"
                onClick={(e) => {
                  e.preventDefault();
                  fetchTransactionData3();
                }}
                type="button"
              >
                <img src="/search.svg" width={30} />
              </button>
            </div>
             }
        {/* -----------xxxxxxx------------- */}
          </div>
          <br></br>
          <div className="row" style={{ overflow: "auto", maxHeight: "500px" }}>
            <RecentTransactions
              setShowDetails={setShowDetails}
              transactions={transactions}
              isLoading={isLoading}
              transactionType = {txnType}
            />
          </div>
        </div>

        {/* <div className="d-flex justify-content-between align-items-center mb-3"> 
  <button
     type="button"
     className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
     onClick={() => handlePagination('prev')}
  > <i className="fas fa-angle-left"></i> Previous
  </button>
  <p className="m-0">
    Page {currentPage} of {totalPages}
  </p>
  <button
      type="button"
      className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
      onClick={() => handlePagination('next')}
  >
    Next <i className="fas fa-angle-right"></i>
  </button>
</div> */}
{platform !== "awx" &&
        <div id="transactionPaginationDiv" className="center-div">
          <ul className="pagination-block">
            <li>
              <a
                href="#!"
                className={`pagination-button ${
                  currentPage === 1 ? "disabled" : ""
                }`}
                onClick={() => handlePagination("prev")}
              >
                &#8249; Prev
              </a>
            </li>
            {generatePaginationLinks()}
            <li>
              <a
                href="#!"
                className={`pagination-button ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
                onClick={() => handlePagination("next")}
              >
                Next &#8250;
              </a>
            </li>
          </ul>
        </div>
  }
        {/* onClick={handleNextClick}  */}
      </div>
    );
  }
}

export default TransactionList;
