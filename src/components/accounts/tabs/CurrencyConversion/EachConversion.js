import React from 'react'
import "../../../../data/accounts/globalAccounts"
import { useSelector } from 'react-redux';


function EachConversion({data}) {

        const platform = useSelector((state)=>state.common.platform) || "";

    if(data == "**No recent conversions in the last 7 days**"){
        return (
            <div className='d-flex align-items-center justify-content-between mb-3'>
                <div className='d-flex align-items-center'>
                    <img src='/accounts/currencyConversionBlue.svg' className='bg-blue10 p-2 rounded-3' />
                    <p className='m-0 ms-3 text-break me-4'>There are no new conversions to report</p>
                </div>
                </div>
        )
    }
    else{
        const transctionType = data && data.transactionType;
        const txnType = transctionType ? transctionType.replace(/_/g, ' ') : '';
    return (
        <div className='d-flex align-items-center justify-content-between mb-3'>
            <div className='d-flex align-items-center'>
                <img src='/accounts/currencyConversionBlue.svg' className='bg-blue10 p-2 rounded-3' />

            {/* When Platform !== "AWX" */}
                {platform!=="awx" &&
                <p className='m-0 ms-2 text-break me-4' style={{fontSize:"15px"}}>{txnType}
                <br></br>
                <span style={{fontSize:"11px"}}>TXN ID: </span>
                <span style={{color:"var(--main-color)", fontSize:"13px", fontWeight:500}}>{data?.authCode}</span>
                </p>
               }

         {/* When Platform === "AWX" */}
               {platform === "awx" && (
                 data?.status === "SETTLED" ? (
                  <p className='m-0 ms-2 text-break me-4' style={{ color: "green", fontSize: "15px" }}>
                    {data?.status.charAt(0).toUpperCase() + data?.status.slice(1).toLowerCase()}
                    <br></br>
                    <span style={{fontSize:"12px", color:"grey"}}>Ref No: </span>
                     <span style={{color:"var(--main-color)", fontSize:"13px", fontWeight:500}}>{data?.systemReferenceNumber}</span>
                    </p>
                 ) : (
                   <p className='m-0 ms-2 text-break me-4' style={{ color: "yellow", fontSize: "15px" }}>
                   {data?.status.charAt(0).toUpperCase() + data?.status.slice(1).toLowerCase()}
                   <br></br>
                   <span style={{fontSize:"12px", color:"grey"}}>Ref No: </span>
                   <span style={{color:"var(--main-color)", fontSize:"13px", fontWeight:500}}>{data?.systemReferenceNumber}</span>
                   </p>
                   )
                 )}
            </div>
            <div className='blue100 text-nowrap'>
            {/* When Platform !== "AWX" */}
                {platform !== "awx" && 
                <>
                    <span style={{ color: "red" , textAlign:"right", fontSize:"15px"}}>
                    -{Math.abs(data?.billingAmount)}{" "}
                    {data?.billingCurrencyCode}
                    </span>
                    <img src="/exchange_2.svg" class=" p-2 rounded-3"  style={{width:"35px",height:"45px"}}/>
                    <span style={{ color: "green",textAlign:"right", fontSize:"15px" }}>
                      +{Math.abs(data?.cardTransactionAmount)}{" "}
                       {data?.transactionCurrencyCode}
                   </span>     
                </>
                 }
              {/* When Platform === "AWX" */}
                 {platform === "awx" && 
                <>
                    <span style={{ color: "red" , textAlign:"right", fontSize:"15px"}}>
                    -{Math.abs(data?.sourceAmount)}{" "}
                    {data?.sourceCurrencycode}
                    </span>
                    <img src="/exchange_2.svg" class=" p-2 rounded-3"  style={{width:"35px",height:"45px"}}/>
                    <span style={{ color: "green",textAlign:"right", fontSize:"15px" }}>
                      +{Math.abs(data?.destinationAmount)}{" "}
                       {data?.destinationCurrencycode}
                   </span>     
                </>
                 }     
            </div>
        </div>
    )
    }
}

export default EachConversion