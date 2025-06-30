import React, {useState,useEffect} from 'react'
import EachDayTransaction from './EachDayTransaction'
import {Link} from 'react-router-dom'
// import { transactionDetailsPayments } from '../../../../../data/accounts/globalAccounts'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import "../../../../accounts/css/accounts.css";

function RecentTransactions({transactions, isLoading, setShowDetails, transactionType}) {
   
    // const [isLoading,setIsLoading] = useState(true);
    // const [transactions, setTransactions] = useState([]);
  
if( transactions && ((transactions=="")||(transactions==[]))){
    if(transactions == "**No transactions found**" ){
        return (
          <div>
            {/* <div className='d-flex justify-content-between align-items-center'>
              <div className='d-flex align-items-center'>
                <img src='/refresh.svg' alt="Refresh Icon" />
                <h5 className='m-0 ms-2'>Recent Transactions</h5>
              </div> 
            </div> */}
        
            <SkeletonTheme baseColor="#F0F0F0" highlightColor="#D4F1F4">
              {isLoading ? (
                <div className='recentTransaction'>
                 <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
                 <h2><Skeleton/></h2>
                 <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
                 <h2><Skeleton/></h2>
                 <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
                 <h2><Skeleton/></h2>
                 </div>
              ) : (
              
                <>
                <div className='d-flex justify-content-center'>
                <div>
                  <img src='/lock_3.svg' className=' border p-3 bg-grey' />
                </div>
              </div>
      
              <p className='text-center pb-5 mb-5 mt-2 p-3'>
                <span className='fw-normal'>You don't have any account yet.
                  <br />
                  To create a account, you need to </span><a href='/onboarding/Home' className='blue100'>Activate Your Account</a><span className='fw-normal'> first.</span>
              </p>
              </>
        
              )}
            </SkeletonTheme>
          </div>
        );
      }
      else{
      return (
        <div>
          {/* <div className='d-flex justify-content-between align-items-center'>
             <div className='d-flex align-items-center'>
              <img src='/refresh.svg' alt="Refresh Icon" />
              <h5 className='m-0 ms-2'>Recent Transactions</h5>
            </div> 
          </div> */}
      
          <SkeletonTheme baseColor="#F0F0F0" highlightColor="#D4F1F4">
            {isLoading ? (
              <div className='recentTransaction'>
               <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
               <h2><Skeleton/></h2>
               <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
               <h2><Skeleton/></h2>
               <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
               <h2><Skeleton/></h2>
               </div>
            ) : (
                transactions?.map((transaction, key) => (
                <EachDayTransaction key={key} data={transaction} setShowDetails={setShowDetails}  txnType={transactionType}/>
              ))
            )}
          </SkeletonTheme>
      
          {/* <p className='yellow100 text-center mt-5' role='button' onClick={() => recentTransactionData(10)}>Show More</p> */}
        </div>
      );
              }

}
else{
      if(transactions == "**No transactions found**" ){
        return (
          <div>
            {/* <div className='d-flex justify-content-between align-items-center'>
              <div className='d-flex align-items-center'>
                <img src='/refresh.svg' alt="Refresh Icon" />
                <h5 className='m-0 ms-2'>Recent Transactions</h5>
              </div> 
            </div> */}
        
            <SkeletonTheme baseColor="#F0F0F0" highlightColor="#D4F1F4">
              {isLoading ? (
                <div className='recentTransaction'>
                 <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
                 <h2><Skeleton/></h2>
                 <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
                 <h2><Skeleton/></h2>
                 <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
                 <h2><Skeleton/></h2>
                 </div>
              ) : (
              
                <>
                <div className='d-flex justify-content-center'>
                <div>
                  <img src='/no_transactions.jpg'  style={{width:"150px",height:"150px"}}/>
                </div>
              </div>
              <p className='text-center' style={{marginTop:"-10px"}}>
                <span className='fw-normal' style={{fontSize:"20px",fontStyle:"italic",fontFamily:"system-ui",color:"var(--main-color)"}}><strong>Oops!<br></br>  It seems there is no transaction between the given date range.</strong></span>
              </p>
              </>
        
              )}
            </SkeletonTheme>
          </div>
        );
      }
      else{
      return (
        <div>
          {/* <div className='d-flex justify-content-between align-items-center'>
             <div className='d-flex align-items-center'>
              <img src='/refresh.svg' alt="Refresh Icon" />
              <h5 className='m-0 ms-2'>Recent Transactions</h5>
            </div> 
          </div> */}
      
          <SkeletonTheme baseColor="#F0F0F0" highlightColor="#D4F1F4">
            {isLoading ? (
              <div className='recentTransaction'>
               <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
               <h2><Skeleton/></h2>
               <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
               <h2><Skeleton/></h2>
               <h5><hr/><Skeleton width={120} style={{marginLeft: '-67%'}}/></h5>
               <h2><Skeleton/></h2>
               </div>
            ) : (
                transactions?.map((transaction, key) => (
                <EachDayTransaction key={key} data={transaction} setShowDetails={setShowDetails} txnType={transactionType}/>
              ))
            )}
          </SkeletonTheme>
      
           {/* <p className='yellow100 text-center mt-5' role='button' onClick={() => recentTransactionData(10)}>Show More</p>  */}
           {/* <button className='btn yellow100 text-center mt-5 mx-auto' onClick={()=>setData(data.concat([0,0]))} role='button'>Show More</button> */}

        </div>
      );
              }
      
}
}

export default RecentTransactions