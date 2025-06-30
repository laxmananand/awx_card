import React, { useEffect, useState } from "react";
import AddNewAccountModal from "./AddNewAccountModal";
import { flag } from "../../data/accounts/globalAccounts";
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
  useEffect(() => {
    const content = document.getElementById("currency-content-" + index);

    if (content) {
      if (activeArray[index] && isActivated) {
        content.classList.add("bg-blue10", "border-activeBlue");
      } else {
        content.classList.remove("bg-blue10", "border-activeBlue");
      }
    }
  }, [activeArray]);

  useEffect(() => {
    const dropdown = document.getElementById("currency-" + index);

    if (dropdown) {
      if (showArray[index]) {
        dropdown.classList.add("show");
      } else {
        dropdown.classList.remove("show");
      }
    }
  }, [showArray]);

  return (
    <div
      className="col-12 col-sm-6 col-md-4 d-inline-block p-3"
      role="button"
      onClick={() => {
        handleShow(-1);
        handleActive(index);
        setShowDetails({ show: (true && cardActivated && isActivated), data });
      }}
    >
      <div className="p-4 border rounded-5 shadow h-100 blueHover d-flex flex-column" id={"currency-content-" + index}>
        <div className="d-flex">
          <img src={`/Rounded_Flags/${type.toLowerCase().slice(0, 2)}.svg`} width={50} className="rounded-circle" />
          {cardActivated &&
          
              <div
                className="d-inline-block my-auto ms-auto"
              >
                 {data?.status.toLowerCase() === "pending_activation" || data?.status.toLowerCase() === "pending activation" ?
                   (<span className='ms-3 px-3 py-1 rounded-pill bg-warning text-white' style={{ fontSize: '1rem' }}>Pending Activation</span>)
                   : data?.status.toLowerCase() === "active" ? 
                   (<span className='ms-3 px-3 py-1 rounded-pill bg-success text-white' style={{ fontSize: '1rem' }}>Active</span>)
                   : data?.status.toLowerCase() === "inactive" ?
                   (<span className='ms-3 px-3 py-1 rounded-pill bg-error text-white' style={{ fontSize: '1rem' }}>Inactive</span>)
                   :
                   (<span className='ms-3 px-3 py-1 rounded-pill bg-warning text-white' style={{ fontSize: '1rem' }}>{data?.status || ''}</span>)
                 }
              
              </div>
            
            
        }
        </div>

        <div className="mt-auto">
          <h6 className="mt-5">{type}</h6>
          {cardActivated ? (
            <>
              <p className="grey1 fw-normal m-0">
                {data?.fullBankName || data?.institution?.name}
                <br />
                <span className="text-break" style={{ fontWeight: 'bold', color:"black" }}>A/C {data?.uniquePaymentId || data?.account_number}</span>
                <br/></p>
                <p>
                <span className="text-break" style={{ fontWeight: 600 , color: "#268AC4"}}>{data?.tags?.Label || data?.label}</span>
              </p>
            </>
          ) : (
            <AddNewAccountModal
              getAccountDetails={getAccountDetails}
              index={index}
              isActivated={isActivated}
              cardActivated={cardActivated}
              options={options}
              type={type}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EachCurrencies;
