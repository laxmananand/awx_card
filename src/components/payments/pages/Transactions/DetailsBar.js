import React, { useEffect, useState } from "react";
import CustomTextField from "../../../structure/CustomText";
import { handleCopy } from "../../../structure/handleCopy";
// import { transactionDetailsPayments } from "../../../../data/accounts/globalAccounts";
import { Link } from "react-router-dom";
// import { businessTxnTag } from "../../js/listTransactions"
import { isRejected } from "@reduxjs/toolkit";
import "../.././css/uploadFile.css"
// import {uploadReciept} from "../../js/listTransactions";
import {useDispatch, useSelector} from "react-redux";
import {closeLoader, openLoader} from '../../../../@redux/features/common'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import {uploadReciept, businessTxnTag, downloadReceipt} from "../../../../@redux/action/payments";
import {transactionDetailsPayments} from "../../../../@redux/action/accounts";
import "../../../accounts/css/accounts.css";
import "../../css/buttonLoader.css";



function DetailsBar({ setShowDetails, handleShow, handleActive, showDetails }) {
  const [transactionsDetails, setTransactionDetails] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [baseFile,setbaseFile] = useState("");
  const customerHashId = useSelector((state) => state.onboarding?.UserOnboardingDetails?.customerHashId);
  const custHashId = useSelector((state) => state.onboarding?.UserOnboardingDetails?.customerHashId);
  const [fileName, setfileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileSize, setFileSize] = useState("");

  const uploadReceiptData = useSelector(state => state.payments.txnUploadReceipt);
  const businessTag = useSelector(state => state.payments.txnBusinessTag);
  const txnData = useSelector(state => state.accounts.txnHistoryPayments?.data);
  const downloadReceiptData = useSelector(state => state.accounts.downloadReceipt);

  const platform = useSelector((state)=>state.common.platform);
  

  const dispatch = useDispatch();
  
  useEffect(() => {
    // Initialize isChecked state based on showDetails or other conditions
    setIsChecked(showDetails?.businessTransaction);
  }, [showDetails]);

//   useEffect(() => {
//     dispatch((transactionDetailsPayments()));
// }, []);

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
  

  // business transaction checked function 
  const handleCheckboxChange = async () => {
    var formData = "";
    var txnId = showDetails?.authCode; 
    // Toggle the checked status
    if (isChecked==true) {
      // Call function when button is on
      formData = { txnId, businessTag:false };
       setIsChecked(false)
       dispatch(businessTxnTag(formData,custHashId));
       //dispatch(transactionDetailsPayments());
       
    }
    else{
      // Call function when button is off
      formData = { txnId, businessTag:true };
      setIsChecked(true)
      dispatch(businessTxnTag(formData,custHashId));
      //dispatch(transactionDetailsPayments());
    }
  };

  // upload pdf reciept

  const uploadFiles = async (e) => {
    console.log(e.target.files);
    const file = e.target.files[0];

// Get the size of file in bytes
const fileSizeInBytes = file.size;
const fileSizeInKB = fileSizeInBytes / 1024;
console.log(fileSizeInKB);
setFileSize(fileSizeInKB);

  if(fileSizeInKB > 150){
    toast.error("File size must not exceed 150 KB!");
  }
  else{
    const base64 = await convertFilesToBase64(file);
     console.log(base64);
    setbaseFile(base64);
  }
    // set the name of file
     const fileName = file.name;
     setfileName(fileName);
    //set the type of file
     const fileType = file.type;
     setFileType(fileType);

    

   // Now fileName contains the value "Account Statement.pdf"
    console.log(fileName);

   
  }

  //Base 64 conversion of a uploaded file 

  const convertFilesToBase64 = (file) =>{
    return new Promise ((resolve,reject) => {

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      const base64String = fileReader.result.split(',')[1]; // Extract base64 part
      resolve(base64String);
      console.log(base64String);
    };

    fileReader.onerror = (error) => {
      reject(error)
    };
  });
}

//Uplaod Reciept api call

 function uplaodTxnReciept() {

  var txnId = showDetails?.authCode;
  var fileDiv = document.getElementById("uploadReciept").value;
  const formData = { baseFile, fileName, fileType, txnId };

  if((fileDiv == "")||(fileDiv == null)){
    toast.error("Please choose a valid file!");
  }
 else if (!(fileType === "image/png" || fileType === "image/jpg" || fileType === "image/jpeg" || fileType === "application/pdf")) {
  toast.error("Only files in PDF, PNG, JPG, and JPEG formats will be accepted!");
  }
  else if (fileSize > 150){
    toast.error("File size must not exceed 150 KB!");
  }
  else{
    
    Swal.fire({
      title: "Do you wish to upload this file?",
      html: `<div id="swal-textAccounts">You will not be able to replace or delete this file.</div>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, uplaod it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      closeButton: true,
      confirmButtonColor: "var(--sun-50)",
      cancelButtonColor: "#C41E3A",
      customClass: {
          title: 'swal-title'
      },
      willOpen: () => {
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();
        const closeButton = document.querySelector('.swal2-close');
    
        if (confirmButton) {
          confirmButton.style.borderRadius = '50px'; // Adjust the value as needed
          confirmButton.style.color = "black"
        }
    
        if (cancelButton) {
          cancelButton.style.borderRadius = '50px'; // Adjust the value as needed
          // cancelButton.style.color = "black"
        }
    
        if (closeButton) {
          closeButton.style.borderRadius = '50px'; // Adjust the value as needed
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(uploadReciept(formData,custHashId));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
       return;
      }
    });
  }
}

  return (
    <nav
      className="d-flex bg-white flex-column justify-content-start flex-start p-4 flex-1 border border-top-0 position-relative"
      id="sidebar"
      style={{ width: "60vb" }}
      key={showDetails?.authCode}
    >
      <div className="mt-3 position-relative">
        <h4 className="text-nowrap me-5">Transaction Details</h4>
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

      <div className="border p-3 my-3 rounded-5 d-flex align-items-center">
        <div>
          <img className="bg-yellow10 p-3 me-3 rounded-5" src="/refresh_gray.svg" />
        </div>

        <div>
          <p className="text-wrap m-0">
            {showDetails?.labels?.bankName}
            <br />
            <span className="grey1 fw-500">{showDetails?.labels?.remittanceStatus}</span>
            <br />
            <span>
              {showDetails?.debit === true ? (
                <span style={{ color: "red" }}>
                  -{Math.abs(showDetails?.cardTransactionAmount)} {showDetails?.transactionCurrencyCode}
                </span>
              ) : (
                <span style={{ color: "green" }}>
                  +{Math.abs(showDetails?.cardTransactionAmount)} {showDetails?.transactionCurrencyCode}
                </span>
              )}
            </span>
          </p>
        </div>
      </div>

     {platform !== "awx" && 
      <div>
      <label className="form-check-label" style={{ fontSize: "18px", fontWeight: "700", marginLeft: "15px" }}>
        Mark as Business Txn
      </label>
      {isChecked === true ? (
      <div className="form-check form-switch" style={{ marginLeft: "290px", marginTop: "-22px" }}>
        <input
          className="form-check-input"
          style={{ width: "40px", transition: "1s" }}
          type="checkbox"
          role="switch"
          checked={isChecked} // Set the checked attribute based on isChecked state
          id={`flexSwitchCheck${showDetails?.authCode}`}
          onChange={handleCheckboxChange}
        />
      </div>
      ): ( <div className="form-check form-switch" style={{ marginLeft: "290px", marginTop: "-22px" }}>
      <input
        className="form-check-input"
        style={{ width: "40px", transition: "1s" }}
        type="checkbox"
        role="switch"
        checked={isChecked}
        id={`flexSwitchCheck${showDetails?.authCode}`}
        onChange={handleCheckboxChange}
      />
    </div> )}
    </div>
}


      <div className="accordion accordion-flush" id="requestMoneyDetails" style={{marginTop:"20px"}}>
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingOne">
            <button
              className="accordion-button collapsed fw-500"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseOne"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
            >
             SUMMARY
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            className="accordion-collapse collapse mt-3"
            aria-labelledby="flush-headingOne"
            data-bs-parent="#requestMoneyDetails"
          >
            {showDetails?.labels?.hasOwnProperty("beneficiaryName") && (showDetails?.labels?.beneficiaryName !== "") ? (
            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">Receiver Name</p>
              <p className="text-wrap fw-500">{showDetails?.labels?.beneficiaryName}</p>
            </div>):null}

            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">Sent Amount</p>
              <p className="text-wrap fw-500">
                {showDetails?.authAmount} {showDetails?.authCurrencyCode}
              </p>
            </div>
            {showDetails?.labels?.hasOwnProperty("markupRate") && (showDetails?.labels?.markupRate !== "") ? (
            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">Fee</p>
              <p className="text-wrap fw-500">{showDetails?.labels?.markupRate}</p>
            </div>):null}
            {showDetails?.labels?.hasOwnProperty("netExchangeRate") && (showDetails?.labels?.netExchangeRate !== "") ? (
            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">Net Exchange Rate</p>
              <p className="text-wrap fw-500">{showDetails?.labels?.netExchangeRate}</p>
            </div>):null}

            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">Recieved Amount</p>
              <p className="text-wrap fw-500">
                {showDetails?.cardTransactionAmount} {showDetails?.transactionCurrencyCode}
              </p>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingTwo">
            <button
              className="accordion-button btn-accordion collapsed fw-500 text-decoration-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseTwo"
              aria-expanded="false"
              aria-controls="flush-collapseTwo"
            >
              INFO
            </button>
          </h2>
          <div
            id="flush-collapseTwo"
            className="accordion-collapse collapse mt-3"
            aria-labelledby="flush-headingTwo"
            data-bs-parent="#requestMoneyDetails"
          >
            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">Transaction Id</p>
              <p className="text-wrap fw-500">{showDetails?.authCode}</p>
            </div>

            {showDetails?.labels?.hasOwnProperty("bankName") && (showDetails?.labels?.bankName !== "") ? (
            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">Sent to</p>
              <p className="text-wrap fw-500">{showDetails?.labels?.bankName}</p>
            </div>):null}
             
            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">Status</p>
              <p className="text-wrap fw-500">{showDetails?.labels?.remittanceStatus}</p>
            </div>
            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">Date & Time of Transaction</p>
              <p className="text-wrap fw-500">{showDetails?.createdAt} (in UTC timestamp)</p>
            </div>

            {showDetails?.labels?.hasOwnProperty("customerComments") && (showDetails?.labels?.customerComments !== "") ? (
            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">Description</p>
              <p className="text-wrap fw-500">{showDetails?.labels?.customerComments}</p>
            </div>):null}
          </div>
        </div>
    {/* nav for rfi details */}
    {showDetails.hasOwnProperty("rfiDetails") && showDetails.rfiDetails.length > 0 ? (
    <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingThree">
            <button
              className="accordion-button btn-accordion collapsed fw-500 text-decoration-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseThree"
              aria-expanded="false"
              aria-controls="flush-collapseThree"
            >
              RFI DETAILS
            </button>
          </h2>
          <div
            id="flush-collapseThree"
            className="accordion-collapse collapse mt-3"
            aria-labelledby="flush-headingThree"
            data-bs-parent="#requestMoneyDetails"
          >
            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">RFI Status</p>
              <p className="text-wrap fw-500">{showDetails?.rfiDetails[0]?.rfiStatus ? showDetails.rfiDetails[0]?.rfiStatus.replace(/_/g, ' ') : ''}</p>
            </div>
            <div className="fw-normal">
              <p className="grey1 m-0 fw-500">Remarks</p>
              <p className="text-wrap fw-500">{showDetails?.rfiDetails[0]?.remarks}</p>
            </div>
          </div>
        </div>) : null }
        

{/* nav for upload Receipt */}
{platform !== "awx" &&
<div>
        {(showDetails.hasOwnProperty("receiptType"))&&(showDetails.hasOwnProperty("receiptFileName")) 
       && (showDetails?.receiptType==null) && (showDetails?.receiptFileName==null) ? (
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingFour">
            <button
              className="accordion-button btn-accordion collapsed fw-500 text-decoration-none"
              type="button"
              style={{border:"none"}}
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseFour"
              aria-expanded="false"
              aria-controls="flush-collapseFour"
            >
              UPLOAD RECEIPT
            </button>
            </h2>
            <div
            id="flush-collapseFour"
            className="accordion-collapse collapse mt-4"
            aria-labelledby="flush-headingFour"
            data-bs-parent="#requestMoneyDetails"
          >
         <div d-flex flex-column gap-3 align-items-center w-25>
          {/* <label style={{border:"none" ,fontWeight:500, fontSize:"18px"}}>Upload Your Receipt Here</label> */}
        <div style={{marginLeft:"12px"}}>
         <input
          className="form-control mt-2 p-2 fw-500 position-relative"
          style={{width:"260px", border:"3px solid hsl(var(--primary), 20%, 62%)",  borderStartStartRadius: "20px",borderEndStartRadius: "20px"}}
          type="file"
          id="uploadReciept"
          onChange={(e) => {
            uploadFiles(e);
          }}
        /> 
          <button className="btn border"
          style={{borderRadius:"8px", width:"65px", height:"47px" , 
            backgroundColor:"hsl(var(--primary), 20%, 62%)", marginLeft:"256px", marginTop: "-46px",
            borderEndEndRadius: "20px",borderStartEndRadius: "20px" }}

          onClick={(e)=>{e.preventDefault(); uplaodTxnReciept();}}
          >
          <img src='/upload.svg'/>        
          </button>
          </div>
          <br/>
          <br/>
          <p style={{color:"red", marginTop: "-25px"}}>📌 Accepted files must be in PDF, PNG, JPG, or JPEG format, with a maximum size of 150 KB.</p>
          </div>
          </div>
          </div>
       ) :  <div className='d-flex align-items-stretch ms-2' style={{marginTop:"20px"}}>
        <button
       className="btn-action w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500 "
       style={{ border:"none"}}
       onClick={(e)=>{e.preventDefault(); dispatch(downloadReceipt({txnId:showDetails?.authCode},custHashId));}}
     >     
      <div id="button-textDownloadReceipt" style={{marginLeft:"25px" , marginTop:"5px"}}>
               <div className="addAccountButtonText" style={{fontWeight:"bold", fontSize:"18px"}}>Download Receipt
               <span style={{ fontWeight: "bold" }}><img src='/downloadReceipt.svg' alt="Drag and Drop" className="image-filter"/></span>
               </div>
               </div>
              <div id="button-loaderDownloadReceipt" style={{marginLeft:"5px"}}>
                  <img className="addAccountButtonLoader" style={{width: "50px",height:"30px"}}alt="" src="\accounts\Double Ring-1.5s-200px.gif"/>
                </div>
     </button>

     </div>}
     </div>}
     </div> 

      {showDetails && showDetails.transactionType && showDetails.transactionType.includes("Remittance_Debit") ? (
        <Link
          className="btn btn-action w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500 " style={{height:"50px"}}
          to={"/payments/track-payment"}
          state={{ showDetails: showDetails, customerHashId: customerHashId }}
        >
          <span style={{fontSize:"18px", fontWeight:"bold"}}>Track Payment</span>
        </Link>
      ) : null}

      {showDetails.hasOwnProperty("rfiDetails") && (showDetails?.rfiDetails.length > 0) && (showDetails?.rfiDetails[0]?.rfiStatus !== "RFI_RESPONDED") ? (
        <button
          className="btn btn-action border w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500"
          style={{ border:"none" , height:"50px"}}
          onClick={() => {
            window.location.href = `/payments/rfi?transactionId=${showDetails?.authCode}`;
          }}
        >
          <span style={{fontSize:"18px", fontWeight:"bold"}}>Respond to RFI</span>
        </button>
      ) : null}

          {/* <!-- Custom bootstrap upload file--> */}
        
          {/* <!-- End --> */}
     

    </nav>
  );
}

export default DetailsBar;
  