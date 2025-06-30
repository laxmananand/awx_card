import React, { useEffect, useState } from "react";
import EachInfoData from "./EachInfoData";
import { handleCopy } from "../../../structure/handleCopy";
import { flag } from "../../../../data/accounts/globalAccounts";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function DetailsBar({ setShowDetails, handleShow, handleActive, data, type }) {

  const platform = useSelector((state)=>state.common.platform);
  const [jsonData, setJSONData] = useState("");

  useEffect(() => {
    console.log(data);
  }, [data]);

  const labels = [
    "Name of the Account Holder",
    "Account Number",
    "Bank Name",
    "Bank Address",
    "Routing Type",
    `${data?.routingCodeType1} Code`,
    "Routing Type",
    `${data?.routingCodeType2} Code`,
    "Label",
  ];
  const title = [
    "accountName",
    "uniquePaymentId",
    "fullBankName",
    "bankAddress",
    "routingCodeType1",
    "routingCodeValue1",
    "routingCodeType2",
    "routingCodeValue2",
    "Label",
  ];

  const labelsAWX = ["Account Number", "Bank Name", "Bank Address", "Status" , "Label" ];
  const titleAWX = ["account_number", "institution?.name",
    ["institution?.address", "institution?.city", "institution?.zip_code"],
     "status", "label"];

  // Use this in place of direct key access
  const getValue = (key) => {
    if (Array.isArray(key)) {
      return key
        .map(k => k.split("?.").reduce((obj, prop) => obj?.[prop], data))
        .filter(Boolean)
        .join(", ");
    }
  
    if (typeof key === "string" && key.includes("?.")) {
      return key.split("?.").reduce((obj, prop) => obj?.[prop], data);
    }
  
    return data?.[key] || data?.tags?.[key];
  };
  
// Function to copy the Details
useEffect(() => {
  const isAWX = platform === "awx";
  const useLabels = isAWX ? labelsAWX : labels;
  const useTitle = isAWX ? titleAWX : title;

  const getValue = (key) => {
    if (Array.isArray(key)) {
      return key
        .map(k => k.split("?.").reduce((obj, prop) => obj?.[prop], data))
        .filter(Boolean)
        .join(", ");
    }

    if (typeof key === "string" && key.includes("?.")) {
      return key.split("?.").reduce((obj, prop) => obj?.[prop], data);
    }

    return data?.[key] || data?.tags?.[key];
  };

  const copyData = useLabels.map((label, i) => ({
    label,
    text: getValue(useTitle[i]),
  }));

  let finalData = [...copyData];

  if (platform === "awx") {
    const supportedFeatureData = (data?.supported_features || []).flatMap(
      (feature, index) => {
        const header = `Supported Feature ${index + 1}`;
        const rows = [
          `Currency: ${feature.currency}`,
          `Transfer Method: ${feature.transfer_method}`,
          `Local Clearing System: ${feature.local_clearing_system || "N/A"}`,
          ...(feature.routing_codes || []).map(
            (route) =>
              `Routing Code [${route.type
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}]: ${route.value}`
          ),
        ];
        return [{ label: header, text: rows.join("\n") }];
      }
    );

    finalData = [...copyData, ...supportedFeatureData];
  }

  const finalText = finalData
    .filter((item) => Boolean(item?.text))
    .map((item) => `${item.label}:\n${item.text}`)
    .join("\n\n");

  setJSONData(finalText);
}, [data, platform]);

  
//..............................................

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === "Escape") {
        setShowDetails(false); // Call your function when "Esc" is pressed
      }
    }

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <>
      <div
        className="position-fixed bg-black w-100 h-100 top-0 opacity-50"
        style={{ width: "100vw" }}
        onClick={() => {
          handleShow(-1);
          handleActive(-1);
          setShowDetails(false);
        }}
      ></div>
      <nav
        className="d-flex bg-white flex-column justify-content-start flex-start p-4 flex-1 border-top-0 position-fixed top-0 h-100 details_bar shadow"
        id="sidebar"
        style={{
          width: "350px",
          right: 0,
          transition: "right 0.3s ease-in-out",
          borderEndStartRadius: "20px",
          borderStartStartRadius: "20px",
          overflowY: "auto",
        }}
      >
        <div className="mt-3 position-relative">
          <h6 className="text-nowrap me-5">Bank Account Details</h6>
          <button
            type="button"
            className="btn-close btn-sm  position-absolute end-0 top-0 me-2"
            onClick={() => {
              handleShow(-1);
              handleActive(-1);
              setShowDetails(false);
            }}
          />
        </div>

        <div
          className="d-flex border p-3 justify-content-start align-items-center my-3"
          style={{ borderRadius: "32px" }}
        >
          <img
            src={`/Rounded_Flags/${(data?.currencyCode || type || "").toLowerCase().slice(0, 2) }.svg`}
            width={45}
          />
          <p className="my-auto ms-2 h6 me-5">
            <span className="grey1 text-wrap"               
            title={data?.fullBankName || data?.institution?.name}
            >
            {data?.fullBankName || data?.institution?.name}
            </span>
            <br />
            <span className="text-nowrap">{data?.currencyCode || type}</span>
          </p>
        </div>

        {(platform === "awx" ? labelsAWX : labels).map((label, i) => {
          const key = platform === "awx" ? titleAWX[i] : title[i];
          const value = getValue(key);
          return (
            value && <EachInfoData key={i} data={{ label, text: value }} />
          );
        })}

{data?.supported_features?.length > 0 && (
  <div className="mt-3">
    <h6 className="mb-3 grey1">Supported Features</h6>
    {data.supported_features.map((feature, index) => (
      <div
        key={index}
        className="border p-3 mb-3"
        style={{ borderRadius: "20px" }}
      >
        <p><strong >Transfer Method:</strong> {feature.transfer_method}</p>
        <p><strong >Local Clearing System:</strong> {feature.local_clearing_system || "N/A"}</p>

        {feature.routing_codes?.length > 0 && (
          <div className="mt-2">
            <strong style={{color: "rgb(129, 128, 128)"}}>Routing Codes:</strong>
            <ul className="mt-1 mb-0 ps-3">
              {feature.routing_codes.map((route, idx) => (
                <li key={idx}>
                <span><strong style={{fontSize: "14px"}}>{route.type?.replace(/_/g, " ").toUpperCase()} :</strong> {route.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
)}

    <button
          className="btn border my-2 py-3"
          style={{ borderRadius: "32px" }}
          onClick={(event) => {
            handleCopy(event, jsonData);
          }}
        >
          <img src="/copy_blue.svg" className="me-2" />
          Copy
        </button>

        <button
          className="btn btn-action rounded-5 fw-bold my-3 py-3"
          style={{ borderRadius: "32px" }}
          onClick={(e) => {
                      e.preventDefault();
                      Swal.fire({
                        title: "Are you sure?",
                        html: `
                        <div style="display: flex;
                           width: 100%;
                           justify-content: center;
                           align-items: center;
                           padding: 5px 50px;
                           font-weight:bold;">
                       You can't undo it.
                        </div>
                      `,
                        // icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, proceed!",
                        cancelButtonText: "No, cancel!",
                        reverseButtons: true,
                        closeButton: true,
                        confirmButtonColor: "var(--sun-50)",
                        cancelButtonColor: "#C41E3A",
                        customClass: {
                          title: "swal-title",
                          popup: 'custom-swal-popup'
                        },
                        didOpen: () => {
                          document.querySelector('.swal2-popup').style.transition = 'all 1s ease-in-out'; // Set transition speed
                        },
                        willOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                          const cancelButton = Swal.getCancelButton();
                          const closeButton = document.querySelector(".swal2-close");
          
                          if (confirmButton) {
                            confirmButton.style.borderRadius = "50px"; // Adjust the value as needed
                            confirmButton.style.color = "black";
                          }
          
                          if (cancelButton) {
                            cancelButton.style.borderRadius = "50px"; // Adjust the value as needed
                            // cancelButton.style.color = "black"
                          }
          
                          if (closeButton) {
                            closeButton.style.borderRadius = "50px"; // Adjust the value as needed
                          }
                        },
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                         
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                          return;
                        }
                      });
                    }}
        >
          Close Account
        </button>
      </nav>
    </>
  );
}

export default DetailsBar;
