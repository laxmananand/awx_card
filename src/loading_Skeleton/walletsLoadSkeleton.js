import React from "react";
import Skeleton, { SkeletonTheme }  from "react-loading-skeleton";
import "../loading_Skeleton/Skeleton.css";
import 'react-loading-skeleton/dist/skeleton.css'


function WalletsFetchSkeleton (){

    return (
    <div 
    className="p-3 border rounded-5 shadow-sm blueHover d-flex flex-column justify-content-between"
    style={{width: "250px"}}>

       {/* Header: Flag and Titles */}
        <div
          className="d-flex justify-content-between align-items-start w-100 mb-2"
          style={{ height: 40 }}
        >

        <div style={{ display: "grid", gap: "4px" }}>
            <p className="mb-0" style={{ fontSize: "1rem", fontWeight: 600 }}>
            <Skeleton width={150} height={30} style={{borderRadius: "35px" }} />
            </p>
           <p className="mb-0" style={{ fontSize: "1rem", fontWeight: 600 }}>
            <Skeleton width={70} height={25} style={{borderRadius: "35px"}}/>
           </p>
        </div>
          <Skeleton
              circle={true}
              width={40}
              height={40}
            />
           </div>

        {/* Balance Info */}
          <div className="mt-5 text-center">
          <p
            className="text-break m-0"
            style={{ fontWeight: 'bold', color: "black", fontSize: '1.2rem' }}
          >
            <Skeleton width={80} height={30} style={{borderRadius: "35px"}}/>
          </p>  
        </div>  
        </div>
      
      );
}

export default WalletsFetchSkeleton