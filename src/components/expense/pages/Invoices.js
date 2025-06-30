import React, { useEffect, useState } from "react";
import * as functions from "../js/expense.js";
import SideBar from "../../SideBar.js";
import { listinvoices, listcustomers } from "../js/invoices-function.js";
import BreadCrumbs from "../../structure/BreadCrumbs";

import AddNewAccountModal from "./Addbillsmodal.js";
import Tablelist from "./Tablelist.js";
import DetailsBar from "./Invoice/Detailsbarinvoice.js";
import Addinvoicemodal from "./Invoice/Addinvoicemodal.js";
import ContentLoader from "react-content-loader";
import { ToastContainer, toast, useToast } from "react-toastify";
import { Skeleton } from "@mui/material";
import Sidebar from "../../../@component_v2/Sidebar.js";
import { Link } from "react-router-dom";
import CompareAllPlans from "../../Signup/pages/CompareAllPlans.js";
import ActivateAccount from "../../ActivateAccount.js";
import { useSelector } from "react-redux";
import ManageSubscription from "../../settings/tabs/Subscription/ManageSubscription.js";

export default function Verification() {
  const [pagename, setPagename] = useState("Invoices");
  const [assets, setAssets] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [customerdata, setCustomerdata] = useState([]);
  const [val, setVal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const [showDetails, setShowDetails] = useState(false);
  const currencies = [true, true, true, true, false, false];
  const [showArray, setShowArray] = useState(
    new Array(currencies.length).fill(false)
  );
  const [activeArray, setActiveArray] = useState(
    new Array(currencies.length).fill(false)
  );
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openmodal, setOpenmodal] = useState(false);
  const [notactivated, setNotactivated] = useState(false);
  const [invoice, setInvoice] = useState(true);
  const [invoiceCreated, setinvoiceCreated] = useState(false);

  const status = useSelector((state) => state.subscription?.data?.status);

  const handleShow = (idx) => {
    const array = new Array(currencies.length).fill(false);
    array[idx] = true;
    setShowArray(array);
  };

  const handleActive = (idx) => {
    const array = new Array(currencies.length).fill(false);
    array[idx] = true;
    setActiveArray(array);
  };

  // Calculate the start and end indices of rows to display
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const headers = [
    "Invoice Id",
    "Recipient Name",
    // "Email",
    // "Description",
    "Requested By",
    "Requested Date",
    "Due Date",
    "Overdue",
    "Status",
  ];

  // Slice the tableData array based on the current page
  //const currentPageData = tableData.slice(startIndex, endIndex);
  const currentPageData = tableData;
  const options = [
    { value: "Date", label: "Date" },
    { value: "PaymentStatus", label: "Payment Status" },
    { value: "Billnumber", label: "Billnumber" },
  ];

  var complianceStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
  );

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 6);
    setFromDate(lastMonth);
    setToDate(today);
  }, []);

  const setListInvoices = async () => {
    if (fromDate && toDate) {
      let response = await listinvoices(fromDate, toDate);
      let fetchedData = response.data;
      if (fetchedData?.message === "No invoice added for the company") {
        sessionStorage.setItem("invoicefound", "N");
        setInvoice(false);
      } else if (fetchedData.message === "Invalid company ID") {
        // Handle invalid company ID case if needed
      } else if (fetchedData?.message?.includes(":")) {
        setinvoiceCreated(true);
        setTableData([]);
        //toast.error(fetchedData?.message);
      } else if (fetchedData.message) {
        //toast.error(fetchedData.message);
      } else {
        setTableData(fetchedData);
        setinvoiceCreated(true);
        console.log(fetchedData);
      }
    }
  };

  useEffect(() => {
    if (!(status === undefined || status === "inactive") && notactivated) {
      setListInvoices();
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    importNewCss();
    if (complianceStatus === "COMPLETED") {
      setNotactivated(true);
      setListInvoices();
      listcustomers().then((fetchedData) => {
        setCustomerdata(fetchedData);
        console.log(fetchedData);
      });
    } else {
      setNotactivated(false);
    }
    sessionStorage.setItem("Page", "Invoices");
  }, []);

  // Function to dynamically import the new CSS file
  const importNewCss = async () => {
    try {
      const css = await import("../css/global.css");
      const css1 = await import("../css/index.css");
      const css2 = await import("../css/index-copy.css");
      const css3 = await import("../css/global-copy.css");
      const css4 = await import("../css/bills.css");
    } catch (error) {
      console.error("Error importing CSS:", error);
    }
  };

  if (!tableData) {
    return <div>Loading...</div>;
  }

  if (!complianceStatus) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Invoices",
            img: "/arrows/arrowLeft.svg",
            backurl: "/expense",
            info: true,
          }}
        />
        <ActivateAccount />
      </>
    );
  }

  if (complianceStatus !== "COMPLETED") {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Invoices",
            img: "/arrows/arrowLeft.svg",
            backurl: "/expense",
            info: true,
          }}
        />
        <div className="d-flex ">
          <div className="m-3 w-100">
            <div className="row bg-white border p-4 d-flex rounded-3 w-100">
              <div
                className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3"
                style={{ padding: "5rem 9rem" }}
              >
                <div
                  className="rounded-circle bg-light-primary mx-auto mb-3"
                  style={{ marginTop: "30px" }}
                >
                  <img
                    src="/locked.svg"
                    style={{ marginTop: "10px" }}
                    width={100}
                  />
                </div>
                <h4
                  className="text-center"
                  style={{
                    fontSize: "18px",
                    lineHeight: "25px",
                    marginTop: "-15px",
                  }}
                >
                  Your account verification is currently in process. Please
                  await further updates on your
                  <Link
                    to="/onboarding/Home"
                    style={{ color: "#327e9d", textDecoration: "none" }}
                  >
                    {" compliance process"}
                  </Link>
                  .
                </h4>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (
    status === undefined ||
    status === "inactive" ||
    status === "sub01" ||
    status === "sub02"
  ) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Invoices",
            img: "/arrows/arrowLeft.svg",
            backurl: "/expense",
            info: true,
          }}
        />
        <CompareAllPlans />
      </>
    );
  }

  if (status === "canceled") {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Invoices",
            img: "/arrows/arrowLeft.svg",
            backurl: "/expense",
            info: true,
          }}
        />
        <ManageSubscription />
      </>
    );
  }

  return (
    <>
      <div>
        <div className="d-flex">
          {/* <Sidebar /> */}
          <div
            className="container-fluid px-0 bg-light clear-left overflow-auto"
            style={{ height: "100vh" }}
          >
            <BreadCrumbs
              data={{
                name: "Invoices",
                img: "/arrows/arrowLeft.svg",
                backurl: "/expense",
                info: true,
              }}
            />
            {invoice && !notactivated && <ActivateAccount />}

            {invoice ? (
              notactivated && (
                <div className="d-flex">
                  <div className="row m-3 bg-white border p-4 d-flex rounded-3 flex-fill overflow-auto">
                    <div className="p-3 d-flex justify-content-between align-items-baseline">
                      <div>
                        <img
                          src="/invoices.svg"
                          className={
                            "p-3 rounded-circle bg-light-primary d-block"
                          }
                        />
                      </div>
                      {notactivated ? (
                        <div className="text-white d-flex align-items-center">
                          <Addinvoicemodal customerdata={customerdata} />
                        </div>
                      ) : null}
                    </div>
                    {notactivated &&
                      (!invoiceCreated ? (
                        // <div>Loading Invoices...</div>
                        <>
                          <div style={{ width: "100%", height: "100%" }}>
                            <ContentLoader
                              width="100%"
                              height="100%"
                              viewBox="0 0 1000 550"
                              backgroundColor="#eaeced"
                              foregroundColor="#ffffff"
                            >
                              <rect
                                x="51"
                                y="45"
                                rx="3"
                                ry="3"
                                width="906"
                                height="17"
                              />
                              <circle cx="879" cy="123" r="11" />
                              <circle cx="914" cy="123" r="11" />
                              <rect
                                x="104"
                                y="115"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="305"
                                y="114"
                                rx="3"
                                ry="3"
                                width="299"
                                height="15"
                              />
                              <rect
                                x="661"
                                y="114"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="55"
                                y="155"
                                rx="3"
                                ry="3"
                                width="897"
                                height="2"
                              />
                              <circle cx="880" cy="184" r="11" />
                              <circle cx="915" cy="184" r="11" />
                              <rect
                                x="105"
                                y="176"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="306"
                                y="175"
                                rx="3"
                                ry="3"
                                width="299"
                                height="15"
                              />
                              <rect
                                x="662"
                                y="175"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="56"
                                y="216"
                                rx="3"
                                ry="3"
                                width="897"
                                height="2"
                              />
                              <circle cx="881" cy="242" r="11" />
                              <circle cx="916" cy="242" r="11" />
                              <rect
                                x="106"
                                y="234"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="307"
                                y="233"
                                rx="3"
                                ry="3"
                                width="299"
                                height="15"
                              />
                              <rect
                                x="663"
                                y="233"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="57"
                                y="274"
                                rx="3"
                                ry="3"
                                width="897"
                                height="2"
                              />
                              <circle cx="882" cy="303" r="11" />
                              <circle cx="917" cy="303" r="11" />
                              <rect
                                x="107"
                                y="295"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="308"
                                y="294"
                                rx="3"
                                ry="3"
                                width="299"
                                height="15"
                              />
                              <rect
                                x="664"
                                y="294"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="58"
                                y="335"
                                rx="3"
                                ry="3"
                                width="897"
                                height="2"
                              />
                              <circle cx="881" cy="363" r="11" />
                              <circle cx="916" cy="363" r="11" />
                              <rect
                                x="106"
                                y="355"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="307"
                                y="354"
                                rx="3"
                                ry="3"
                                width="299"
                                height="15"
                              />
                              <rect
                                x="663"
                                y="354"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="57"
                                y="395"
                                rx="3"
                                ry="3"
                                width="897"
                                height="2"
                              />
                              <circle cx="882" cy="424" r="11" />
                              <circle cx="917" cy="424" r="11" />
                              <rect
                                x="107"
                                y="416"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="308"
                                y="415"
                                rx="3"
                                ry="3"
                                width="299"
                                height="15"
                              />
                              <rect
                                x="664"
                                y="415"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="55"
                                y="453"
                                rx="3"
                                ry="3"
                                width="897"
                                height="2"
                              />
                              <rect
                                x="51"
                                y="49"
                                rx="3"
                                ry="3"
                                width="2"
                                height="465"
                              />
                              <rect
                                x="955"
                                y="49"
                                rx="3"
                                ry="3"
                                width="2"
                                height="465"
                              />
                              <circle cx="882" cy="484" r="11" />
                              <circle cx="917" cy="484" r="11" />
                              <rect
                                x="107"
                                y="476"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="308"
                                y="475"
                                rx="3"
                                ry="3"
                                width="299"
                                height="15"
                              />
                              <rect
                                x="664"
                                y="475"
                                rx="3"
                                ry="3"
                                width="141"
                                height="15"
                              />
                              <rect
                                x="55"
                                y="513"
                                rx="3"
                                ry="3"
                                width="897"
                                height="2"
                              />
                              <rect
                                x="52"
                                y="80"
                                rx="3"
                                ry="3"
                                width="906"
                                height="17"
                              />
                              <rect
                                x="53"
                                y="57"
                                rx="3"
                                ry="3"
                                width="68"
                                height="33"
                              />
                              <rect
                                x="222"
                                y="54"
                                rx="3"
                                ry="3"
                                width="149"
                                height="33"
                              />
                              <rect
                                x="544"
                                y="55"
                                rx="3"
                                ry="3"
                                width="137"
                                height="33"
                              />
                              <rect
                                x="782"
                                y="56"
                                rx="3"
                                ry="3"
                                width="72"
                                height="33"
                              />
                              <rect
                                x="933"
                                y="54"
                                rx="3"
                                ry="3"
                                width="24"
                                height="33"
                              />
                            </ContentLoader>
                          </div>
                        </>
                      ) : (
                        <div className="overflow-auto">
                          <Tablelist
                            data={currentPageData}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            headers={headers}
                            setShowDetails={setShowDetails}
                            setSelectedRowData={setSelectedRowData}
                            pagename={pagename}
                            fromDate={fromDate}
                            toDate={toDate}
                            setFromDate={setFromDate}
                            setToDate={setToDate}
                          />
                        </div>
                      ))}
                  </div>

                  {showDetails && (
                    <DetailsBar
                      setShowDetails={setShowDetails}
                      handleShow={handleShow}
                      handleActive={handleActive}
                      selectedRowData={selectedRowData}
                    />
                  )}
                </div>
              )
            ) : (
              <div className="d-flex ">
                <div className="m-3 w-100">
                  <div className="row bg-white border p-4 d-flex rounded-3 w-100">
                    <div className="p-3">
                      <div>
                        <img
                          src="/invoices.svg"
                          className={
                            "p-3 rounded-circle bg-light-primary d-block"
                          }
                        />
                      </div>
                      <div className="d-flex justify-content-center">
                        <div>
                          <img
                            src="/invoiceup2lo.jpg"
                            // className=" border p-3 bg-grey"
                            style={{ maxWidth: "250px", maxHeight: "600px" }}
                          />
                        </div>
                      </div>

                      <p className="text-center pb-5 mb-5 mt-2 p-3">
                        <span className="fw-normal">
                          You have not added any Invoice yet.
                          <br />
                          <p className="text-center pb-3 mb-3 mt-2 p-3"></p>
                        </span>

                        <span className="fw-normal"></span>
                        <div
                          className="text-white d-flex justify-content-center align-items-center"
                          style={{ maxWidth: "450px", margin: "0 auto" }}
                        >
                          <Addinvoicemodal customerdata={customerdata} />
                        </div>
                        {/* <span className="fw-normal"> first.</span> */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
