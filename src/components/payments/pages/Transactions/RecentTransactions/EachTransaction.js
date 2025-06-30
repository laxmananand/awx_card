import React from "react";
import { useSelector } from "react-redux";

function EachTransaction({ data, setShowDetails, transactionType }) {

  const platform = useSelector((state)=>state.common.platform) || "";
  
  if (data == "**No transactions found**") {
    return (
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <img
            src="/accounts/currencyConversionBlue.svg"
            className="bg-blue10 p-2 rounded-3"
          />
          <p className="m-0 ms-3 text-break me-4">{data}</p>
        </div>
      </div>
    );
  } else {
    const transctionType = data && data?.transactionType;
    const txnType = transctionType ? transctionType.replace(/_/g, " ") : "";
    return (
      <div
        className="d-flex align-items-center justify-content-between mb-2 p-2 px-3 w-100"
        id="eachTrans"
        role="button"
        onClick={() => setShowDetails(data)}
      >
        {" "}
        {/* border-activeBlue border */}
        <div className="d-flex align-items-center justify-content-start mb-2 w-75 me-auto">
          <img
            src="/accounts/currencyConversionBlue.svg"
            className="bg-blue10 p-2 rounded-3"
          />
          <p className="m-0 ms-3 text-break me-4 fw-500">
          <span style={{fontWeight:500}}>{txnType || data?.source_type || data?.status}</span>
            <br></br>
            { platform !== "awx" &&
            <>
            <span style={{fontSize:"12px"}}>TXN ID: </span><span style={{color:"var(--main-color)", fontWeight:700, fontSize:"14px"}}>{data?.authCode}</span>
            </>            
            }
          </p>
        </div>
        <div className="mb-2 p-2 px-3 w-50 text-center mx-auto">
          {platform !== "awx" &&
          <>
          {data?.debit === true ? (
            <span style={{color: "red", fontWeight:500}}>
              -{Math.abs(data?.cardTransactionAmount)}{" "}
              {data?.transactionCurrencyCode}
            </span>
          ) : (
            <span style={{ color: "green", fontWeight:500 }}>
              +{Math.abs(data?.cardTransactionAmount)}{" "}
              {data?.transactionCurrencyCode}
            </span>
          )}
          </>
        }
        {platform === "awx" && transactionType === "All" && data?.amount  &&
        <>
        { String(data.amount).includes("-") ? (
         <span style={{color: "red", fontWeight:500}}>
         {data?.amount} {data?.currency}
       </span>
        ):(
        <span style={{color: "green", fontWeight:500}}>
          {data.amount} {data?.currency}
        </span>
        )
       }
       </>
      }

   {platform === "awx" && transactionType === "Deposits" &&
          <>
          {data?.type === "DEBIT" ? (
            <span style={{color: "red", fontWeight:500}}>
              -{Math.abs(data?.amount)}{" "}
              {data?.currency}
            </span>
          ) : (
            <span style={{ color: "green", fontWeight:500 }}>
              +{Math.abs(data?.amount)}{" "}
              {data?.currency}
            </span>
          )}
          </>
        }
        </div>

   {platform === "awx" && transactionType === "All"  &&
        <div className="mb-2 p-2 px-3 w-50 text-center mx-auto">
         <span style={{color: "black", fontWeight:500}}>
         {data?.balance} {data?.currency}
       </span>
       </div>
      }
        

      {platform  !== "awx" &&
        <div className="text-nowrap px-4 w-50 text-end">
        {/* {data?.status === "Approved" ? (
           <span style={{color: "green", fontSize:"16px", fontWeight:700}}>{data?.status}</span>
         ) : data?.status === "Pending" ? ( 
         <span style={{color: "#FFC000", fontSize:"16px", fontWeight:700}}>{data?.status}</span>
         ) : data?.status === "Rejected" ? ( 
         <span style={{color: "red", fontSize:"16px", fontWeight:700}}>{data?.status}</span>
         ) : null } */}
         <span style={{fontSize:"16px",fontWeight:700}}>
          {data?.labels?.remittanceStatus}
         </span>
        </div> 
  }
  {platform  === "awx"  &&
    <div className="text-nowrap px-4 w-50 text-end">
    {/* {data?.status === "Approved" ? (
       <span style={{color: "green", fontSize:"16px", fontWeight:700}}>{data?.status}</span>
     ) : data?.status === "Pending" ? ( 
     <span style={{color: "#FFC000", fontSize:"16px", fontWeight:700}}>{data?.status}</span>
     ) : data?.status === "Rejected" ? ( 
     <span style={{color: "red", fontSize:"16px", fontWeight:700}}>{data?.status}</span>
     ) : null } */}
     <span style={{fontSize:"16px",fontWeight:700}}>
      {data?.description}
     </span>
    </div> 
  }

      </div>
    );
  }
}

export default EachTransaction;
