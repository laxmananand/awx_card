import React from "react";
import Skeleton, { SkeletonTheme }  from "react-loading-skeleton";
import "../loading_Skeleton/Skeleton.css";
import 'react-loading-skeleton/dist/skeleton.css'


function AccountsFetchSkeleton (){

    return (
        <div
          id="skeleton_Accounts"
          style={{
            minWidth: '30%',
            borderRadius: '32px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          <div style={{ width: '100%', position: 'relative' }}>
            <Skeleton
              circle={true}
              width={60}
              height={60}
              style={{
                position: 'absolute',
                left: '0',
                top: '0',
                borderRadius: '50%',
                marginBottom: '50px',
              }}
            />
          </div>
    
          <h4 className="d-flex align-items-start rounded-5 ms-1" style={{ width: '100%', marginTop: '60px' }}>
            <Skeleton width={90} height={30} style={{ marginLeft: '0', borderRadius: "35px" }} />
          </h4>
    
          <h1 style={{ width: '100%' }}>
            <Skeleton height={60} style={{borderRadius: "35px"}}/>
          </h1>
        </div>
      );
}

export default AccountsFetchSkeleton