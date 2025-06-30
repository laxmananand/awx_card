import React, { useEffect, useState, useRef } from "react";
import * as functions from "../js/expense.js";
import SideBar from "../../SideBar.js";
//import { listbills } from "../js/bills-functions.js";
import BreadCrumbs from "../../structure/BreadCrumbs";
import {
  xeroConnectionAccessToken,
  connectToXeroCode,
  xeroGetTenantId,
} from "../js/invoices-function";
import AddNewAccountModal from "./Addbillsmodal.js";
import Tablelist from "./Tablelist.js";
import DetailsBar from "./DetailsBar.js";
import ContentLoader from "react-content-loader";
import Sidebar from "../../../@component_v2/Sidebar.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CompareAllPlans from "../../Signup/pages/CompareAllPlans.js";
import ActivateAccount from "../../ActivateAccount.js";
import { listBills } from "./../../../@redux/action/expence.js";
import { useNavigate, useLocation } from "react-router-dom";
import ManageSubscription from "../../settings/tabs/Subscription/ManageSubscription.js";

// Function to dynamically import the new CSS file
const importNewCss = async () => {
  try {
    await import("../css/global.css");
    await import("../css/index.css");
    await import("../css/index-copy.css");
    await import("../css/global-copy.css");
    await import("../css/bills.css");
  } catch (error) {
    console.error("Error importing CSS:", error);
  }
};

export default function Bills() {
  const [pagename, setPagename] = useState("Bills");
  const [assets, setAssets] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [val, setVal] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(tableData?.length / rowsPerPage);
  const [showDetails, setShowDetails] = useState(false);
  const currencies = [true, true, true, true, false, false];
  const [showArray, setShowArray] = useState(
    new Array(currencies.length).fill(false)
  );
  const [activeArray, setActiveArray] = useState(
    new Array(currencies.length).fill(false)
  );

  const [selectedRowData, setSelectedRowData] = useState(null);
  const [bill, setBill] = useState(true);
  const status = useSelector((state) => state.subscription?.data?.status);
  //const status = "active";
  const [code, setCode] = useState("");
  const [intervalRef, setIntervalRef] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const ListBills = useSelector((state) => state.expence.listBill);

  const [showtable, setShowtable] = useState(false);
  const complianceStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
  );
  const customerHashId = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.customerHashId
  );
  
  const [billFound, setBillFound] = useState(false);
  const [apiCall, setApiCall] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [noBillsWithinDateRange, setNoBillsWithinDateRange] = useState(false);

  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 6);
    setFromDate(lastMonth);
    setToDate(today);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (complianceStatus === "COMPLETED") {
          const obj = await dispatch(listBills(fromDate, toDate));
          setTableData(obj);
          setShowtable(true);
          setApiCall(true);
          if (obj?.message?.includes(":")) {
            setBillFound("Y");
            setTableData([]);
          } else {
            const billFoundStatus = obj.length === 0 ? "N" : "Y";
            sessionStorage.setItem("Billfound", billFoundStatus);
            setBillFound(billFoundStatus);
          }
        } else {
          setShowtable(false);
          setApiCall(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setShowtable(false);
      }
    };

    fetchData();
    importNewCss();

    const options = [
      { value: "Date", label: "Date" },
      { value: "PaymentStatus", label: "Payment Status" },
      { value: "Billnumber", label: "Billnumber" },
    ];
  }, [dispatch, complianceStatus, pagename, fromDate, toDate]);

  useEffect(() => {
    if (billFound === "N") {
      setBill(false);
    } else if (billFound === "Y") {
      setBill(true);
    }
  }, [billFound]);

  const connectToXero = () => {
    connectButtonClick();
    connectToXeroCode();
  };

  const connectButtonClick = () => {
    const interval = setInterval(() => {
      setCode(localStorage.getItem("authorizationCode"));
    }, 1000);
    setIntervalRef(interval);
  };

  useEffect(() => {
    if (code) {
      clearInterval(intervalRef);
      xeroConnectionAccessToken(code);
      localStorage.removeItem("authorizationCode");
    }
  }, [code]);

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
  const currentPageData = tableData;
  const headers = [
    "Bill No",
    "Status",
    "Recipient Name",
    "Source Of Fund",
    "Due Date",
    "Amount",
    "Recipient Account No.",
  ];

  const crossButtonRef = useRef(null);

  const [imageSrc, setImageSrc] = useState("/add-bill.svg");

  const handleMouseEnter = () => {
    setImageSrc("/add-bill-white.svg");
  };

  const handleMouseLeave = () => {
    setImageSrc("/add-bill.svg");
  };

  if (!complianceStatus) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Bills",
            img: "/arrows/arrowLeft.svg",
            backurl: "/payments",
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
            name: "Bills",
            img: "/arrows/arrowLeft.svg",
            backurl: "/payments",
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
    (status === undefined ||
      status === "inactive" ||
      status === "sub01" ||
      status === "sub02") &&
    showtable
  ) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Bills",
            img: "/arrows/arrowLeft.svg",
            backurl: "/payments",
            info: true,
          }}
        />
        <CompareAllPlans />
      </>
    );
  }

  if (status === "canceled" && showtable) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Bills",
            img: "/arrows/arrowLeft.svg",
            backurl: "/payments",
            info: true,
          }}
        />
        <ManageSubscription />
      </>
    );
  }

  if (!apiCall) {
    return (
      <>
        <div style={{ width: "100%", height: "100%" }}>
          <BreadCrumbs
            data={{
              name: "Bills",
              img: "/arrows/arrowLeft.svg",
              backurl: "/payments",
              info: true,
            }}
          />

          <ContentLoader
            width="100%"
            height="100%"
            viewBox="0 0 1000 550"
            backgroundColor="#eaeced"
            foregroundColor="#ffffff"
          >
            <rect x="51" y="45" rx="3" ry="3" width="906" height="17" />
            <circle cx="879" cy="123" r="11" />
            <circle cx="914" cy="123" r="11" />
            <rect x="104" y="115" rx="3" ry="3" width="141" height="15" />
            <rect x="305" y="114" rx="3" ry="3" width="299" height="15" />
            <rect x="661" y="114" rx="3" ry="3" width="141" height="15" />
            <rect x="55" y="155" rx="3" ry="3" width="897" height="2" />
            <circle cx="880" cy="184" r="11" />
            <circle cx="915" cy="184" r="11" />
            <rect x="105" y="176" rx="3" ry="3" width="141" height="15" />
            <rect x="306" y="175" rx="3" ry="3" width="299" height="15" />
            <rect x="662" y="175" rx="3" ry="3" width="141" height="15" />
            <rect x="56" y="216" rx="3" ry="3" width="897" height="2" />
            <circle cx="881" cy="242" r="11" />
            <circle cx="916" cy="242" r="11" />
            <rect x="106" y="234" rx="3" ry="3" width="141" height="15" />
            <rect x="307" y="233" rx="3" ry="3" width="299" height="15" />
            <rect x="663" y="233" rx="3" ry="3" width="141" height="15" />
            <rect x="57" y="274" rx="3" ry="3" width="897" height="2" />
            <circle cx="882" cy="303" r="11" />
            <circle cx="917" cy="303" r="11" />
            <rect x="107" y="295" rx="3" ry="3" width="141" height="15" />
            <rect x="308" y="294" rx="3" ry="3" width="299" height="15" />
            <rect x="664" y="294" rx="3" ry="3" width="141" height="15" />
            <rect x="58" y="335" rx="3" ry="3" width="897" height="2" />
            <circle cx="881" cy="363" r="11" />
            <circle cx="916" cy="363" r="11" />
            <rect x="106" y="355" rx="3" ry="3" width="141" height="15" />
            <rect x="307" y="354" rx="3" ry="3" width="299" height="15" />
            <rect x="663" y="354" rx="3" ry="3" width="141" height="15" />
            <rect x="57" y="395" rx="3" ry="3" width="897" height="2" />
            <circle cx="882" cy="424" r="11" />
            <circle cx="917" cy="424" r="11" />
            <rect x="107" y="416" rx="3" ry="3" width="141" height="15" />
            <rect x="308" y="415" rx="3" ry="3" width="299" height="15" />
            <rect x="664" y="415" rx="3" ry="3" width="141" height="15" />
            <rect x="55" y="453" rx="3" ry="3" width="897" height="2" />
            <rect x="51" y="49" rx="3" ry="3" width="2" height="465" />
            <rect x="955" y="49" rx="3" ry="3" width="2" height="465" />
            <circle cx="882" cy="484" r="11" />
            <circle cx="917" cy="484" r="11" />
            <rect x="107" y="476" rx="3" ry="3" width="141" height="15" />
            <rect x="308" y="475" rx="3" ry="3" width="299" height="15" />
            <rect x="664" y="475" rx="3" ry="3" width="141" height="15" />
            <rect x="55" y="513" rx="3" ry="3" width="897" height="2" />
            <rect x="52" y="80" rx="3" ry="3" width="906" height="17" />
            <rect x="53" y="57" rx="3" ry="3" width="68" height="33" />
            <rect x="222" y="54" rx="3" ry="3" width="149" height="33" />
            <rect x="544" y="55" rx="3" ry="3" width="137" height="33" />
            <rect x="782" y="56" rx="3" ry="3" width="72" height="33" />
            <rect x="933" y="54" rx="3" ry="3" width="24" height="33" />
          </ContentLoader>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="d-flex">
        <div
          className="container-fluid px-0 bg-light clear-left overflow-auto"
          style={{ height: "100vh" }}
        >
          <BreadCrumbs
            data={{
              name: "Bills",
              img: "/arrows/arrowLeft.svg",
              backurl: "/payments",
              info: true,
            }}
          />

          {bill ? (
            showtable && (
              <div className="d-flex">
                <div className="row m-3 bg-white border p-4 d-flex rounded-3 flex-fill overflow-auto">
                  <div className="p-3 d-flex justify-content-between align-items-baseline">
                    <div>
                      <img
                        src="/payments/request-money.svg"
                        className={
                          "p-3 rounded-circle bg-light-primary d-block"
                        }
                      />
                    </div>
                    {showtable ? (
                      <div className=" d-flex align-items-center">
                        <div className="d-flex w-100">
                          {!code && (
                            <button
                              type="button"
                              className="btn-dark h-100 text-nowrap ms-3 btn text-white w-100 rounded-5 d-flex align-items-center px-3 
      justify-content-center py-2 fw-500"
                              onClick={connectToXero}
                            >
                              <span
                                className="mx-3 my-1 d-flex align-items-center gap-2"
                                style={{ fontSize: "16px" }}
                              >
                                Connect to{" "}
                                <img
                                  src="/xero.svg"
                                  alt="xero-icon"
                                  width={25}
                                />
                              </span>
                            </button>
                          )}

                          <buttton
                            type="button"
                            className="btn btn-action w-100 ms-3 rounded-5 d-flex align-items-center justify-content-center py-2 fw-500  h-100"
                            data-bs-toggle="modal"
                            data-bs-target="#AddNewAccountModal"
                            ref={crossButtonRef}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                          >
                            <span
                              className="m-0 my-1 d-flex align-items-center gap-2"
                              style={{ fontSize: "16px" }}
                            >
                              Create Bill{" "}
                              <img
                                src={imageSrc}
                                alt="add-invoice-icon"
                                width={25}
                              />
                            </span>
                          </buttton>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  {showtable ? ( // Render the table if showTable is true
                    tableData.length === 0 && !setBill ? (
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
                    )
                  ) : (
                    <></>
                  )}
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
            <div className="d-flex" style={{ overflow: "hidden" }}>
              <div className="m-3 w-100">
                <div className="row bg-white border p-4 d-flex rounded-5 shadow w-100">
                  {/* <h3 className="m-0 ms-2">Bills</h3> */}
                  <div className="p-3">
                    <div>
                      <img
                        src="/payments/request-money.svg"
                        className={
                          "p-3 rounded-circle bg-light-primary d-block"
                        }
                      />
                      {/* <h5 className="text-nowrap m-0 mt-3 d-inline-block">Bills</h5> */}
                    </div>
                    <br />
                    <div className="d-flex justify-content-center">
                      <div>
                        <img
                          src="/BILL2.jpg"
                          //className=" border p-3 bg-grey"
                          style={{ maxWidth: "300px", maxHeight: "550px" }}
                        />
                      </div>
                    </div>

                    <p className="text-center pb-5 mb-5 mt-2 p-3">
                      <span className="fw-normal">
                        You have not added any Bill yet.
                        <br />
                        <p className="text-center pb-3 mb-3 mt-2 p-3"></p>
                      </span>
                      <div className="text-white d-flex justify-content-center align-items-center">
                        {code ? (
                          ""
                        ) : (
                          <button
                            type="button"
                            className="btn-dark h-100 text-nowrap ms-3 btn text-white rounded-5 d-flex align-items-center px-3 justify-content-center py-2 fw-500"
                            onClick={connectToXero}
                          >
                            <span
                              className="mx-3 my-1 d-flex align-items-center gap-2"
                              style={{ fontSize: "16px" }}
                            >
                              Connect to{" "}
                              <img src="/xero.svg" alt="xero-icon" width={25} />
                            </span>
                          </button>
                        )}
                        <buttton
                          type="button"
                          className="text-nowrap btn btn-action ms-3 rounded-5 d-flex align-items-center justify-content-center py-2 fw-500  h-100"
                          data-bs-toggle="modal"
                          data-bs-target="#AddNewAccountModal"
                        >
                          <span className="h3 m-0">+&nbsp;</span>
                          <div className="text-nowrap">Add Your First Bill</div>
                        </buttton>
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

      <div>
        <AddNewAccountModal />
      </div>
    </>
  );
}
