import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Createcustomer from "./createcustomer";
import queryString from "query-string";
import { toast } from "react-toastify";
import {
  xeroConnectionAccessToken,
  connectToXeroCode,
  xeroGetTenantId,
} from "../../js/invoices-function";
import { useNavigate } from "react-router-dom/dist/umd/react-router-dom.development";
import { FaMagnifyingGlass } from "react-icons/fa6";
import "../../css/addinvoicemodal.css";

export function EachCustomer({ customerdata, crossButtonRef }) {
  const navigate = useNavigate();
  const getInitials = (name) => {
    const nameArray = name.split(" ");
    const initials = nameArray.map((word) => word[0].toUpperCase()).join("");
    return initials;
  };

  const customerInitials = getInitials(customerdata.customerName);
  const customerDataQueryString = queryString.stringify({
    customerdata: JSON.stringify(customerdata),
  });

  const onClick = async () => {
    crossButtonRef.current.click();
    console.log(customerdata);
    if (sessionStorage.getItem("accessToken")) {
      await xeroGetTenantId(customerdata);
    }
    navigate(`/expense/invoices/create-invoice?${customerDataQueryString}`);
  };

  return (
    <div
      state={{ customerdata }}
      onClick={onClick}
      role="button"
      className="d-flex justify-content-between align-items-center m-1 text-decoration-none blueHover p-2 rounded-5"
    >
      <div className="d-flex align-items-center">
        <div
          className="bg-info p-3 rounded-circle me-2 text-white text-center"
          style={{ width: "50px", height: "50px" }}
        >
          {customerInitials?.slice(0, 2)}
        </div>
        <div className="text-start ms-2">
          <div className="text-dark">{customerdata.customerName}</div>
          <div className="grey1">{customerdata.customerEmail}</div>
        </div>
      </div>
      {/* <a
        className="nav-link"
        href="#"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img src="/threeDotsH.svg" />
      </a> */}
      <ul
        className="dropdown-menu py-4 px-2  "
        aria-labelledby="navbarDropdown"
      >
        <li>
          <a
            className="dropdown-item fw-500"
            href="#"
            onClick={() => {
              setShowDetails(true);
            }}
          >
            Details
          </a>
        </li>
        <li>
          <a className="dropdown-item fw-500" href="#">
            Send Money
          </a>
        </li>
        <li>
          <a className="dropdown-item fw-500" href="#">
            Request Money
          </a>
        </li>
        <li>
          <a className="dropdown-item fw-500" href="#">
            <img src="/sidebar/profile/profile.svg" className="me-2" />
            Edit
          </a>
        </li>
        <li>
          <a className="dropdown-item fw-500" href="#">
            <img src="/sidebar/profile/profile.svg" className="me-2" />
            Delete
          </a>
        </li>
      </ul>
    </div>
  );
}

function CreateNewBill({ customerdata }) {
  console.log("customerdata in addinvoivemodal", [customerdata]);

  const [code, setCode] = useState("");
  const [intervalRef, setIntervalRef] = useState(null);

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

  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const crossButtonRef = useRef(null);
  const handleCustomerSelection = (index) => {
    setSelectedCustomerIndex(index);
  };
  const {
    createdAt,
    companyId,
    address3,
    address2,
    address1,
    customerEmail,
    address4,
    id,
    customerName,
  } = customerdata;

  const filteredCustomers = customerdata.filter((customer) =>
    customer.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const displayCustomers = searchQuery ? filteredCustomers : customerdata;

  const [imageSrc, setImageSrc] = useState("/add-invoice.svg");

  const handleMouseEnter = () => {
    setImageSrc("/add-invoice-white.svg");
  };

  const handleMouseLeave = () => {
    setImageSrc("/add-invoice.svg");
  };
  return (
    <>
      {/* Button trigger modal */}
      <div className="d-flex h-100 w-100">
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
              Connect to <img src="/xero.svg" alt="xero-icon" width={25} />
            </span>
          </button>
        )}
        <button
          type="button"
          className="text-nowrap btn btn-action w-100 ms-3 rounded-5 d-flex align-items-center justify-content-center py-2 fw-500  h-100"
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
            Create invoice{" "}
            <img src={imageSrc} alt="add-invoice-icon" width={25} />
          </span>
        </button>
      </div>
      {/* Modal */}
      <div
        className="modal fade"
        id="AddNewAccountModal"
        tabIndex={-1}
        aria-labelledby="AddNewAccountModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content py-3 px-4 rounded-4 shadow">
            <div className="d-flex justify-content-between my-2 px-3 py-2">
              <h5 className="text-dark">Generate invoice for</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <form className="d-flex col-lg-6 border rounded-3 my-2 my-lg-0 w-100 shadow rounded-pill py-2 px-4 d-flex align-items-center justify-content-between gap-2">
              <input
                className="search-select border-0 rounded-pill w-100"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />{" "}
              <button className="btn p-0" type="submit" disabled>
                <FaMagnifyingGlass />
              </button>
            </form>

            <div className="d-flex align-items-center justify-content-center">
              <button
                type="button"
                className="btn bg-blue10 p-2 my-3 rounded-circle"
                data-bs-toggle="modal"
                data-bs-target="#CreateCustomerModal"
                data-bs-dismiss="modal"
              >
                <img src="/plus_blue.svg" alt="plus icon" width={20} />
              </button>
              <div
                type="button"
                className="btn blue100 fw-500 text-uppercase"
                data-bs-toggle="modal"
                data-bs-target="#CreateCustomerModal"
                data-bs-dismiss="modal"
              >
                New Customer
              </div>
            </div>

            <hr className="text-dark mt-0" />

            <div className="overflow-auto" style={{ maxHeight: "50vh" }}>
              {displayCustomers.map((customer, index) => (
                <EachCustomer
                  key={index}
                  customerdata={customer}
                  index={index}
                  onCustomerSelect={handleCustomerSelection}
                  crossButtonRef={crossButtonRef}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Createcustomer />
    </>
  );
}

export default CreateNewBill;
