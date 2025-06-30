import React, { useEffect, useState } from "react";
import getSymbolFromCurrency from "currency-symbol-map";
import { fullform } from "../../../../data/accounts/globalAccounts";

function EachCurrenciesWallets({
  isActivated,
  index,
  showArray,
  activeArray,
  data,
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
        className="p-3 border rounded-5 shadow-sm blueHover d-flex flex-column justify-content-between h-100"
        id={`currency-content-${index}`}
      >
        {/* Header: Flag and Titles */}
        <div
          className="d-flex justify-content-between align-items-start w-100 mb-2"
          style={{ height: 40 }}
        >
          <div style={{ display: "grid", gap: "4px" }}>
            <p className="mb-0" style={{ fontSize: "1rem", fontWeight: 600 }}>
              {fullform[type] || ""}
            </p>
            <p className="mb-0 opacity-50" style={{ fontSize: "1rem", fontWeight: 600 }}>
              {type}
            </p>
          </div>
  
          <img
            src={`/Rounded_Flags/${type.toLowerCase().slice(0, 2)}.svg`}
            width={40}
            height={40}
            className="rounded-circle"
            alt={`${type} flag`}
          />
        </div>
  
        {/* Balance Info */}
        <div className="mt-5 text-center">
          <p
            className="text-break m-0"
            style={{ fontWeight: 'bold', color: "black", fontSize: '1.2rem' }}
          >
            {getSymbolFromCurrency(type)} {data?.balance}
          </p>  
        </div>

      </div>
    
  );
  
}

export default EachCurrenciesWallets;
