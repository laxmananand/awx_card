import React, { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";
import { BiLabel } from "react-icons/bi";
import Loader from "./../Signup/assets/Signup/public/loader.gif";
import { flag, fullform, createAccount } from "../../data/accounts/globalAccounts";
import CustomTextField from "./CustomText";
import "../accounts/css/accounts.css";
import { useDispatch, useSelector } from "react-redux";
import { getBankDetails } from "../../@redux/action/accounts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddNewAccountModal({ isActivated, cardActivated, options, type, getAccountDetails, index }) {
  const [val, setVal] = useState();

  const [bankName, setbankName] = useState("");
  const [label, setlabel] = useState("");
  const complianceStatus =  useSelector((state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus);
  const custHashId = useSelector((state) => state.onboarding?.UserOnboardingDetails?.customerHashId);
  const dispatch = useDispatch()
  const platform = useSelector((state)=>state.common.platform);

  // AWX Account ID / Business ID
  const awxAccountId = useSelector((state) => state.auth.awxAccountId);
  const authToken = useSelector((state)=> state.auth.authCode);


  const onSubmit = async (e) => {
    e.preventDefault();

    // Create Account for nium or others
    if(platform!=="awx"){

      if (bankName == "") {
        toast.error("Please select a bank!");
      } else if (label == "") {
        toast.error("Please enter label!");
      }
      else{
      const formData = { currencyCode: type, bankName, label };
      const result = await createAccount(formData,custHashId);

      if(result && result.hasOwnProperty("uniquePaymentId")){
      dispatch(getBankDetails(type,custHashId));
      }
      else if(result && result.hasOwnProperty("status") && result.status == "BAD_REQUEST"){
        toast.error(result.message);
      }
      else{
        toast.error("Something went wrong! Please try again later.");
      }
      }

    }

  // Create Account for Air Wallex
    else{
     if (label == "") {
        toast.error("Please enter label!");
      }
      else{
      const formData = { currencyCode: type, label, platform, authToken };
      const result = await createAccount(formData,awxAccountId);
      if(result && result?.status==="success"){
      dispatch(getBankDetails(type,awxAccountId));
      }
      else if(result && result.hasOwnProperty("status") && result.status == "BAD_REQUEST"){
        toast.error(result.message);
      }
      else{
        toast.error("Something went wrong! Please try again later.");
      }
      }
    }
   
    //getAccountDetails();
  };

  return (
    <form className="row mt-4" onSubmit={onSubmit}>
      <div onClick={(e) => e.stopPropagation()}>
        {/* Button trigger modal */}
        {platform!=="awx" && (
        ['USD', 'SGD', 'EUR', 'HKD', 'AUD', 'GBP'].includes(type) ? (
        <button
          type="button"
          className="btn border w-100 blue100 d-flex align-items-center justify-content-center py-3 fw-500 rounded-5"
          data-bs-toggle="modal"
          data-bs-target={"#AddNewAccountModal" + index}
          disabled={(!isActivated)||(complianceStatus!=="COMPLETED")}
          style={{ backgroundColor: ((!isActivated || complianceStatus !== "COMPLETED") && "#E0E0E0") || "white" }}
        > 
          <img src="/plus_1.svg" />
          Get Bank Account
          {(!isActivated && <img src="/lock_2.svg" />)||((complianceStatus!=="COMPLETED") && <img src="/lock_2.svg" />)}
        </button>
        ) : (
         <p className="border w-100 blue100 d-flex align-items-center justify-content-center py-3 fw-500 rounded-5" style={{fontSize: "18px"}}>Wallet</p>
        ))}

    {platform==="awx" && (
           [
            'AED','AUD', 'BRL', 'CAD', 'DKK', 'EUR', 'GBP', 
            'HKD', 'IDR', 'ILS', 'MXN', 'NZD', 'SGD', 'USD'
          ]
          .includes(type) ? (
            <button
              type="button"
              className="btn border w-100 blue100 d-flex align-items-center justify-content-center py-3 fw-500 rounded-5"
              data-bs-toggle="modal"
              data-bs-target={"#AddNewAccountModal" + index}
              disabled={(!isActivated)||(complianceStatus!=="COMPLETED")}
              style={{ backgroundColor: ((!isActivated || complianceStatus !== "COMPLETED") && "#E0E0E0") || "white" }}
            > 
              <img src="/plus_1.svg" />
              Get Bank Account
              {(!isActivated && <img src="/lock_2.svg" />)||((complianceStatus!=="COMPLETED") && <img src="/lock_2.svg" />)}
            </button>
            ) : (
             <p className="border w-100 blue100 d-flex align-items-center justify-content-center py-3 fw-500 rounded-5" style={{fontSize: "18px"}}>Wallet</p>
            )
        )}
        
        {/* Modal */}
        <div
          className="modal fade"
          id={"AddNewAccountModal" + index}
          tabIndex={-1}
          aria-labelledby="AddNewAccountModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-5 text-center position-relative" style={{borderRadius:"32px"}}>
              <button
                type="button"
                className="btn-close position-absolute end-0 top-0 m-4"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="addAccountModalCloseButton"
              />
              <img               
              src={`/Rounded_Flags/${type.toLowerCase().slice(0, 2)}.svg`}
              width={50} className="mx-auto rounded-circle" />
              <p className="fw-bold h6 my-1">
                {type}, {fullform[type]}
              </p> 
              <h6 className="my-4">Get Bank Account</h6>
         
              {/* Bank Name dropdown */}
              {platform!=="awx" && (
              <div className="d-flex border-bottom mb-4">
                <div className="d-flex">
                  <img src="/bank_outline.svg" width={40} className="border-end my-auto px-2" />
                </div>
                <div className="input-group containertext w-100 h-100">
                  <CustomSelect options={options} setValue={setbankName} />
                </div>
              </div>
               )}              
              
              {/* Descripttion/ Label input field */}
                <div className="d-flex border-bottom mb-2">
                  <div className="d-flex align-items-center px-2">
                    <BiLabel size={20} className="grey1" />
                  </div>
                  <div className="input-group containertext w-100 h-100">
                    <CustomTextField label="Account Label" value={label}  
                    onChange={(e) => {
                    const input = e.target.value;
                    const filtered = input.replace(/[^a-zA-Z0-9 ]/g, ''); // Allow only letters, numbers, and spaces
                    setlabel(filtered);
                     }} />
                  </div>
                </div>
            
              <button className="btn btn-action text-black py-2" type="submit" style={{ marginTop: "10px", borderRadius:"32px", width: "250px", marginLeft: "80px" }}>
                <div id="button-text">
                  <div className="addAccountButtonText" style={{ marginBottom: "2px", marginLeft: "-62px", justifyContent: "center", display: "flex", fontWeight: 700 }}>
                    Create Account
                  </div>
                </div>
                <div id="button-loader">
                  <img className="addAccountButtonLoader" style={{display: "flex", width: "fit-content", justifyContent: "center", marginLeft: "-55px"}} alt="" src={Loader} />
                </div>
              </button>
              {platform==="awx" && (
              <p className="d-flex justify-content-center align-items-center mt-4">By using these payment services, you agree to T&Cs<a href="#" className="ms-1">here</a></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddNewAccountModal;
