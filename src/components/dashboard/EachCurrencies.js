import React, { useEffect, useState, useRef } from "react";
import AddNewAccountModal from "../structure/AddNewAccountModal";
import { flag, getBankAccountForCreate } from "../../data/accounts/globalAccounts";
import { Link } from "react-router-dom";

function EachCurrencies({
  getAccountDetails,
  isActivated,
  setShowDetails,
  index,
  showArray,
  handleShow,
  activeArray,
  handleActive,
  cardActivated,
  data,
  options,
  type,
}) {
  const [dropdown, setDropdown] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const SetPage = async () => {
      const result = await getBankAccountForCreate(options); // Assuming this is an async function that fetches data

      // Once the data is fetched, update the state and mark dataLoaded as true
      setDropdown(result);
      setDataLoaded(true);

      const content = document.getElementById("currency-content-" + index);

      if (content) {
        if (activeArray[index] && isActivated) {
          content.classList.add("bg-blue10", "border-activeBlue");
        } else {
          content.classList.remove("bg-blue10", "border-activeBlue");
        }
      }

      const dropdown = document.getElementById("currency-" + index);

      if (dropdown) {
        if (showArray[index]) {
          dropdown.classList.add("show");
        } else {
          dropdown.classList.remove("show");
        }
      }
    };

    SetPage();
  }, [activeArray, showArray]);

  // to close the redirecting dropdown 

  useEffect(() => {
    const handleScroll = () => {
      handleShow(-1); // Close the dropdown when scrolling
    };

    if (dropdownRef.current) {
      dropdownRef.current.addEventListener("scroll", handleScroll); // Adding scroll event listener to the dropdown
    }

    return () => {
      if (dropdownRef.current) {
        dropdownRef.current.removeEventListener("scroll", handleScroll); // Removing scroll event listener on cleanup
      }
    };
  }, [handleShow]);
 

  return (
    <div
      className="col-12 col-sm-6 col-md-4 d-inline-block p-3"
      role="button"
      onClick={() => {
        handleShow(-1);
        handleActive(index);
        setShowDetails({ show: true && cardActivated && isActivated, data });
      }}
    >
      <div className="p-3 border rounded h-100 blueHover d-flex flex-column" id={"currency-content-" + index}>
        <div className="d-flex">
          <img src={flag[type]} width={60} className="rounded-circle" />
          {isActivated && cardActivated ? (
            <>
              <a
                className={"d-inline-block my-auto ms-auto"}
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={(e) => {
                  if (showArray[index] == true) handleShow(-1);
                  else handleShow(index);
                  e.stopPropagation();
                }}
              >
                <img src="/threeDotsH.svg" />
              </a>
              <ul
                ref={dropdownRef}
                id={"currency-" + index}
                className="dropdown-menu"
                aria-labelledby="navbarDropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <li>
                  <Link to="/accounts/conversion" className="dropdown-item" href="#">
                    Conversion
                  </Link>
                </li>
                <li>
                  <Link to="/accounts/statements" className="dropdown-item" href="#">
                    Statements
                  </Link>
                </li>
                <li>
                  <Link to="/payments/send-money" className="dropdown-item" href="#">
                    Send Money
                  </Link>
                </li>
              </ul>
            </>
          ) : (
            ""
          )}
        </div>

        <div className="mt-auto">
          <h6 className="mt-5">{type}</h6>
          {cardActivated ? (
            <>
              <p className="grey1 fw-normal m-0">
                {data.fullBankName}
                <br />
                <span className="text-break">A/C {data.uniquePaymentId}</span>
              </p>
            </>
          ) : (
            <>
              {dataLoaded ? (
                <AddNewAccountModal
                  getAccountDetails={getAccountDetails}
                  index={index}
                  isActivated={isActivated}
                  cardActivated={cardActivated}
                  options={dropdown}
                  type={type}
                />
              ) : (
                <p>Loading...</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EachCurrencies;
