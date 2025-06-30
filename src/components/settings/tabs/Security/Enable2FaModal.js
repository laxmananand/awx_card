import React, { useEffect, useState, useRef } from "react";
import * as functions from "../../jsFile/SecurityJs/2faAuth.js";
import qrcode from "qrcode";
import clipboardCopy from "clipboard-copy";
import "../../css/settings.css";
import { handleCopy } from "../../../structure/handleCopy.js";
import OtpInput from 'react-otp-input';
import "../../css/otpInput.css";
import { FadeLoader } from 'react-spinners';
import Swal from "sweetalert2";
import {setActive2fa} from "../../../../@redux/features/settings.js";
import { useDispatch, useSelector } from "react-redux";




function Enable2FA({ secretKey, barData }) {

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const closeRef = useRef(null)

  const copyToClipboard = () => {
    if (secretKey) {
      clipboardCopy(secretKey); // Copy the barData to clipboard
    }
  };

  const verifyQrCode = async () =>{
    const formData = {secretKey, otp}

    if(formData?.otp.length<6){
      Swal.fire({
        title: `Please provide the six-digit code for verification.`,
        icon: "warning",
        confirmButtonColor: "var(--main-color)",
        customClass: {
          title: 'swal-titleSettings'
        }
      }).then(() => {
        return;
      });
    }
 else{
    setLoading(true)
    const obj = await functions.verifyQRCode(formData);
    if (obj && (obj.status==="SUCCESS")){
      closeRef.current.click();
      dispatch(setActive2fa(true));
      setLoading(false);
      setOtp("");
    }
    else{
      setLoading(false);
    }
   
 }
  }


  return (
    <>
      {/* Button trigger modal */}

      {/* Modal */}
      {loading && (
            <div className="loader-overlaySettings">
                <div className="loader-containerSettings">
                    <FadeLoader color={'var(--main-color)'} loading={loading} size={50} />
                </div>
            </div>
        )}
      <div
        className="modal fade"
        id="enable2FaModal"
        tabIndex={-1}
        aria-labelledby="enable2FaModalLabel"
        aria-hidden="true"
      >
        <button data-bs-dismiss="modal" data-bs-target="enable2FaModal" ref={closeRef} className='d-none'>
          close
        </button>
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          style={{ marginLeft: "450px" }}
        >
          <div className="modal-content p-5 text-center text-dark">
            <div className="title" style={{ textAlign: "center" }}>
              <div
                className="Header-1Settings w-100"
                style={{ marginLeft: "85px", marginTop: "-25px", fontSize: "24px" }}
              >
                Enable Two-Factor Authentication (2FA)
              </div>
            </div>
            <div
              className="lable-text"
              style={{ textAlign: "left", color: "black", fontSize: "18px" }}
            >
              1. You will need an authenticator mobile app to enable 2FA for
              your account.
            </div>
            <div className="fields mt-1">
              <div style={{marginLeft: "-25px"}}>
                <QRCodeComponent barData={barData} />
              </div>
              <div
                className="lable-text"
                style={{
                  textAlign: "left",
                  color: "black",
                  fontSize: "18px"
                }}
              >
                2. Scan the QR code with your authenticator app.
              </div>
              <div
                className="lable-text"
                style={{
                  textAlign: "left",
                  marginTop: "5px",
                  marginLeft: "20px"
                }}
              >
                If you can't scan the code, you can enter this secret key into
                your authenticator app.
              </div>
              <div
                style={{
                  border: "2px solid #8f9096",
                  borderRadius: "10px",
                  width: "fit-content",
                  height: "50px",
                  padding: "13px",
                  marginLeft: "125px",
                  marginTop: "20px"
                }}
              >
                <span
                  id="secretKeyField"
                  style={{ color: "var(--main-color)", fontSize: "18px", fontWeight: 700 }}
                >
                  {secretKey}
                </span>
                <img
                  src="/copy.svg"
                  role="button"
                  className='me-2'
                  style={{ marginLeft: "20px", marginTop: "-5px" }}
                  onClick={(event) => {
                    handleCopy(event, secretKey);
                    copyToClipboard()
                  }}
                />
              </div>
              <div
                className="lable-text"
                style={{
                  textAlign: "left",
                  color: "black",
                  fontSize: "18px",
                  marginTop: "15px"
                }}
              >
                3. After scanning the QR code, enter the six-digit code from
                your authenticator.
              </div>
              <div style={{marginLeft:"184px", marginTop:"20px"}}>
              <OtpInput
               id="otpVerify"
               onChange={(otp) => {
                // Filter out non-numeric characters
                const numericOtp = otp.replace(/\D/g, '');
                setOtp(numericOtp);
            }}
                value={otp}
                numInputs={6}
                type="text"
                renderInput={(props, index) => (
                <input
                  {...props}
                  key={index}
                  style={{ 
                    display: "inline-block",
                    width: "45px",
                    height: "45px",
                    marginRight: "10px",
                    textAlign: "center",
                    fontSize: "20px",
                    border: "2px solid #8f9096",
                    borderRadius: "10px",
                    background: "rgb(232, 232, 232)",
                }}
                />
               )}
            />
            </div>
            </div>

            <div style={{marginLeft:"140px", marginTop:"25px"}}>
                <button
                  className="button-main"
                  type="button"
                  id="button-cancel"
                  style={{ height: "50px", borderRadius: "10px", width:"200px" ,background : "#880808	"}}
                  onClick={() => {
                    closeRef.current.click();
                    setOtp("");
                }}                >
                  <div id="buttonText" style={{ display: "flex", fontWeight:500, fontSize:"18px", marginLeft:"60px" }}>
                    <div style={{color:"white"}}>CANCEL</div>
                  </div>
                </button>
              </div>
                
              <div style={{marginLeft:"350px", marginTop:"-50px"}}>
                <button
                  className="button-main"
                  type="button"
                  id="button-verify"
                  style={{ height: "50px", borderRadius: "10px", width:"200px" ,background : "var(--main-color)"}}
                  onClick={verifyQrCode}
                >
                  <div id="buttonText" style={{ display: "flex", fontWeight:500, fontSize:"18px", marginLeft:"54px" }}>
                    <div style={{color:"white"}}>VERIFY</div>
                    <img
                      className="job-icon"
                      alt=""
                      style={{marginLeft: "5px" }}
                      src="/public/signup/Signup/public/double-right-sign.svg"
                    />
                  </div>
                </button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
}

function QRCodeComponent({ barData }) {
  const [qrCodeUrl, setQRCodeUrl] = useState("");

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const dataUri = await qrcode.toDataURL(barData);
        setQRCodeUrl(dataUri);
      } catch (err) {}
    };

    generateQRCode();
  }, [barData]);

  return <>{qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" width={200} />}</>;
}

function validateAndLimitInput(event) {
  const inputElement = event.target;
  // Remove non-digit characters
  const sanitizedInput = inputElement.value.replace(/\D/g, "");

  // Limit the input to 6 digits
  inputElement.value = sanitizedInput.slice(0, 6);
}

export default Enable2FA;
