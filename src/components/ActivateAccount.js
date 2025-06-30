import React from "react";
import {useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function ActivateAccount(){

    
// const location = useLocation()
// const x=location.pathname;
// const firstSegment = x.split('/')[1];
// console.log(firstSegment);



    return(
        <div className="d-flex flex-column bg-white p-5 m-4 justify-content-center rounded-5 shadow">
            <div className="p-5 m-4">
              <div className="d-flex justify-content-center">
                <img
                  src="/locked.svg"
                  alt="add beneficiary"
                  width={250}
                />
              </div>
    
              <div className="d-flex justify-content-center ">
                <p className=" text-center pb-3 p-3">
                  <span className=" fw-30">
                  Ready to explore? Please{" "}
                  </span>
                  <Link to="/onboarding/Home" className=" blue100">
                    Activate Your Account
                  </Link>
                  <span className=" fw-30">
                  {" "}to get started.
                  </span>
                </p>
              </div>
            </div>
          </div>
    );

}