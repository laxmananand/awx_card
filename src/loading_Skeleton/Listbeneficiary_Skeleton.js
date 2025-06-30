import React from "react";
import "../loading_Skeleton/Skeleton.css";
import 'react-loading-skeleton/dist/skeleton.css';
import ContentLoader from "react-content-loader";

function Listbeneficiary_Skeleton (){

    return(
       
        <ContentLoader
              speed={1}
              width={1300}
              height={400}
              viewBox="0 0 340 100"
              backgroundColor="#f6f6ef"
              foregroundColor="#e8e8e3"
            >
              <rect x="9" y="4" rx="0" ry="0" width="340" height="22" />
              {/* <rect x="18" y="14" rx="0" ry="0" width="303" height="6" /> */}

              <rect x="10" y="33" rx="0" ry="0" width="64" height="13" />
              <rect x="80" y="33" rx="0" ry="0" width="64" height="13" />
              <rect x="150" y="33" rx="0" ry="0" width="64" height="13" />
              <rect x="220" y="33" rx="0" ry="0" width="64" height="13" />
              <rect x="290" y="33" rx="0" ry="0" width="64" height="13" />
              
              <rect x="10" y="50" rx="0" ry="0" width="64" height="13" />
              <rect x="80" y="50" rx="0" ry="0" width="64" height="13" />
              <rect x="150" y="50" rx="0" ry="0" width="64" height="13" />
              <rect x="220" y="50" rx="0" ry="0" width="64" height="13" />
              <rect x="290" y="50" rx="0" ry="0" width="64" height="13" />

              <rect x="10" y="67" rx="0" ry="0" width="64" height="13" />
              <rect x="80" y="67" rx="0" ry="0" width="64" height="13" />
              <rect x="150" y="67" rx="0" ry="0" width="64" height="13" />
              <rect x="220" y="67" rx="0" ry="0" width="64" height="13" />
              <rect x="290" y="67" rx="0" ry="0" width="64" height="13" />
             
              <rect x="10" y="84" rx="0" ry="0" width="64" height="13" />
              <rect x="80" y="84" rx="0" ry="0" width="64" height="13" />
              <rect x="150" y="84" rx="0" ry="0" width="64" height="13" />
              <rect x="220" y="84" rx="0" ry="0" width="64" height="13" />
              <rect x="290" y="84" rx="0" ry="0" width="64" height="13" />

              {/* ... */}
            </ContentLoader>
       

    )
}

export default Listbeneficiary_Skeleton