import React from 'react'

function EachTransaction({data}) {
    
    if(data=="**No recent transactions in the last 7 days**"){
    return (
        <div className='d-flex align-items-center justify-content-between mb-3'>
            <div className='d-flex align-items-center'>
                <img src='/accounts/currencyConversionBlue.svg' className='bg-blue10 p-2 rounded-3' />
                <p className='m-0 ms-3 text-break me-4'>There are no new transactions to report</p>
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
                    <p className='m-0 ms-2 text-break me-4'  style={{fontSize:"15px"}}>{txnType}<br></br><span style={{fontSize:"11px"}}>TXN ID: </span><span style={{color:"var(--main-color)", fontSize:"13px", fontWeight:500}}>{data?.authCode}</span>
          </p>
                </div>
                <div className='blue100 text-nowrap'>
                {data?.transactionType === "Wallet_Fund_Transfer" && data?.debit === true ? (
                  <>
                      <span style={{ color: "red", textAlign:"right", fontSize:"15px" }}>
                      -{Math.abs(data?.billingAmount)} {data?.billingCurrencyCode}
                       </span>
                  <img src="/exchange_2.svg" class=" p-2 rounded-3"  style={{width:"35px",height:"45px"}}/>
                    <span style={{ color: "green", textAlign:"right", fontSize:"15px" }}>
                    +{Math.abs(data?.cardTransactionAmount)} {data?.transactionCurrencyCode}
                    </span>
                    </>
                   ) : (data?.debit === true ? (
                    <span style={{ color: "red", textAlign:"right", fontSize:"15px" }}>
                     -{Math.abs(data?.billingAmount)} {data?.billingCurrencyCode}
                    </span>
                  ) : (data?.debit === false ? (
                     <span style={{ color: "green", textAlign:"right", fontSize:"15px" }}>
                     +{Math.abs(data?.cardTransactionAmount)} {data?.transactionCurrencyCode}
                      </span>
                    ) : null))}
               </div>
            </div>
        )
    }
    
}

export default EachTransaction