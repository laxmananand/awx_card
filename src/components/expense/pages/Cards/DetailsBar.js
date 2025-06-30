import React, { useEffect, useState } from "react";
import {
  getcardnumber,
  getcvvandexpiry,
  getcardlimitdata,
  setcardpin,
  addSpendControls,
} from "../../js/cards-functions";
import { toast } from "react-toastify";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { GenerateAuthToken } from "../../../../@redux/action/auth";
import { getCardDetailS_awx, getsensitavecarddata_awx } from "../../../../@redux/action/cards";
import { updateCard_awx } from "../../../../@redux/action/cards";
// function getCardType(cardNumber) {
//   // Remove all non-digit characters (spaces, dashes, etc.)
//   cardNumber = cardNumber.replace(/\D/g, "");

//   // Visa starts with '4' and has 13 or 16 digits
//   if (/^4\d{12}(\d{3})?$/.test(cardNumber)) {
//     return "Visa";
//   }

//   // Mastercard starts with '51' - '55' or '2221' - '2720' and has 16 digits
//   if (
//     /^5[1-5]\d{14}$/.test(cardNumber) ||
//     /^2(2[2-9][1-9]|2[3-9]\d|[3-6]\d{2}|7[0-1]\d|720)\d{12}$/.test(cardNumber)
//   ) {
//     return "Mastercard";
//   }

//   // American Express starts with '34' or '37' and has 15 digits
//   if (/^3[47]\d{13}$/.test(cardNumber)) {
//     return "Amex";
//   }

//   // Return 'Unknown card type' if card type is not recognized
//   return "Unknown card type";
// }

import { setSensitivecarddetails } from "../../../../@redux/features/cards";
import CustomSelect from "../../../structure/NewStructures/CustomSelect";
import axios from "axios";

// export const CardComponent = ({
//   cardNumber,
//   expiry,
//   holdername,
//   cvv,
//   showCardNumber,
// }) => {
//   return (
//     <div id="cardcontainer">
//       <div className="card-container my-3">
//         <div className="card" style={{ border: "none" }}>
//           <div className="card-inner">
//             <div className="front">
//               <img src="/expense/card/comp/map.png" className="map-img" />
//               <div className="d-flex align-items-center justify-content-between w-100">
//                 <img src="/expense/card/comp/chip.png" width="60px" />
//                 {/* <img
//                   src={
//                     getCardType(cardNumber) === "Visa"
//                       ? "/expense/card/visa.svg"
//                       : getCardType(cardNumber) === "Mastercard"
//                         ? "/expense/card/mastercard.svg"
//                         : getCardType(cardNumber) === "Amex"
//                           ? "/expense/card/amex.svg"
//                           : "/expense/card/other-card.svg"
//                   }
//                   width="60px"
//                 /> */}
//               </div>

//               <div className="d-flex flex-column align-items-between w-100 justify-content-between mt-4 gap-2">
//                 <div
//                   className="d-flex align-items-center justify-content-between w-100 fw-500 py-3"
//                   style={{ fontSize: "28px" }}>
//                   {showCardNumber
//                     ? cardNumber
//                         .match(/.{1,4}/g)
//                         .map((chunk, idx) => <p key={idx}>{chunk}</p>)
//                     : ["XXXX", "XXXX", "XXXX", "XXXX"].map((chunk, idx) => (
//                         <p key={idx}>{chunk}</p>
//                       ))}{" "}
//                 </div>
//                 <div
//                   className="d-flex align-items-center justify-content-between gap-3 fw-500"
//                   style={{ fontSize: "14px" }}>
//                   <p className="mb-0">CARD HOLDER</p>
//                   <p className="mb-0">VALID TILL</p>
//                 </div>
//                 <div
//                   className="d-flex align-items-center justify-content-between w-100 fw-500"
//                   style={{ fontSize: "28px" }}>
//                   <p>{holdername || "JOHN DOE"}</p>
//                   <p>
//                     {expiry && expiry.length === 4
//                       ? `${expiry.slice(0, 2)}/${expiry.slice(2)}`
//                       : "MM/YY"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="back">
//               <img src="/expense/card/comp/map.png" className="map-img" />
//               <div className="bar" />
//               <div className="row card-cvv">
//                 <div>
//                   <img src="/expense/card/comp/pattern.png" />
//                 </div>
//                 <p>{showCardNumber ? cvv : "***"}</p>
//               </div>
//               <div className="row card-text mt-3">
//                 <p className="mb-1" style={{ fontSize: 10, fontWeight: 500 }}>
//                   Customer Service: For inquiries, please call:{" "}
//                   {`phone_number_regional`}
//                   (regional) or {`phone_number_international`} (International)
//                   Lost/Stolen Card? Call immediately for assistance.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


let embeded = null;

// ../../@redux/features/auth




function DetailsBar({
  setShowDetails,
  handleShow,
  handleActive,
  selectedRowData,
}) {
  const dispatch = useDispatch();

  // console.log("selectedRowData", selectedRowData);
  if (!selectedRowData) {
    return null; // If no row data is selected, don't display the DetailsBar
  }
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({});
  const [cardlimitdata, setCardlimitdata] = useState([]);
  const [monthlyAmountLimit, setMonthlyAmountLimit] = useState(null);
  const [dailyamountlimit, setDailyamountlimit] = useState(null);
  const [isSettingCardLimit, setIsSettingCardLimit] = useState(false); // Add state for setting card limit
  const [cardlimitempty, setCardlimitempty] = useState(false);
  const [pinEditMode, setPinEditMode] = useState(false);
  const [pinoption, setPinoption] = useState(false);
  const [pinValues, setPinValues] = useState(Array(6).fill(""));
  const [apiResponse, setApiResponse] = useState(false);
  const [setPhysicalCardPin, setSetPhysicalCardPin] = useState(false);

  const walletHashid = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.walletHashId
  );
  const customerHashId = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.customerHashId
  );

  const awxAccountId = useSelector((state) => state.auth.awxAccountId);

  const authToken = useSelector((state) => state.common.authToken);
  // const listCards = useSelector((state) => state.card?.cardsList);

  const platform = useSelector((state) => state.common.platform);
  const currList = useSelector((state) => state.accounts.currencyList);


  useEffect(() => {
    if (platform === "awx" && awxAccountId && selectedRowData) {
      dispatch(GenerateAuthToken(awxAccountId));
      // dispatch(getsensitavecarddata_awx(authToken, selectedRowData?.card_id,awxAccountId));
      dispatch(getCardDetailS_awx(authToken, selectedRowData?.card_id,awxAccountId))
    }
  }, [selectedRowData?.card_id]);

  const { maskedCardNumber, cardHashId, cardType, cardStatus } =
    selectedRowData;

  const navigate = useNavigate();

  const card_data = useSelector((state) => state.card?.sensitivecarddetails);
  const selecdedCard = useSelector((state)=> state.card?.selecdedCard);

  // useEffect(() => {
  //   if (
  //     selectedRowData.cardType === "PHY" &&
  //     selectedRowData.cardStatus !== "P_BLOCK"
  //   ) {
  //     setSetPhysicalCardPin(true);
  //   }
  // }, []);

  const handleShowCardNumber = () => {
    dispatch(getsensitavecarddata_awx(authToken, selectedRowData?.card_id,awxAccountId));
    setApiResponse(true);
    if (showCardNumber) {
      setShowCardNumber(false);
      // Clear the values in setCardDetails
      setCardDetails({});
      return;
    } else {
      // Use Promise.all to wait for both API calls to complete
      // Promise.all([
      //   getcardnumber(cardHashId, walletHashid, customerHashId),
      //   getcvvandexpiry(cardHashId, walletHashid, customerHashId),
      // ])
      //   .then(([cardNumberData, cvvAndExpiryData]) => {
      //     console.log("Card Number Data:", cardNumberData);
      //     console.log("CVV and Expiry Data:", cvvAndExpiryData);
      setCardDetails({
        cardNumber: card_data?.card_number,
        cvv: card_data?.cvv,
        expiry: card_data.expiry,
      });
      console.log("Card Details:", cardDetails);
      setApiResponse(false);
      setShowCardNumber(true); // Set showCardNumber to true after both requests have completed

      // Set a timeout to reset showCardNumber to false and clear the values after 15 seconds
      setTimeout(() => {
        setShowCardNumber(false);
        setCardDetails({});
      }, 15000); // 15 seconds in milliseconds
      // })
      // .catch((error) => {
      //   // Handle any errors that might occur during the API requests
      //   console.error("Error:", error);
      //   // You can set an error state or show an error message to the user here
      // });
    }
  };

  const handleShowCardLimit = (cardId) => {
    dispatch(getsensitavecarddata_awx(authToken, cardId,awxAccountId));
  };

  const [enterPin, setEnterPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [enterDailyLimit, setDailyLimit] = useState("");
  const [enterMonthlyLimit, setMonthlyLimit] = useState("");
  const [enterTransactionPerLimit, setTransactionPerLimit] = useState("");
  const [nameoncard, setNameoncard] = useState("");
  const [nickname, setNickName] = useState("");
  const [currency, setCurrency] = useState("");
  // const [cash_withdrawal_limits,setCash_withdrawal_limits]= useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!enterPin || !confirmPin) {
      toast.error("Both fields are required!", { position: "top-right" });
      return;
    }

    if (enterPin.length !== 6 || confirmPin.length !== 6) {
      toast.error("PIN must be exactly 6 digits!", { position: "top-right" });
      return;
    }

    if (enterPin !== confirmPin) {
      toast.error("PINs do not match!", { position: "top-right" });
      return;
    }

    handleSetPin(walletHashid, customerHashId, enterPin);
  };

  const handleSetPin = (walletHashid, customerHashId, enterPin) => {
    const encodedPin = btoa(enterPin);
    setcardpin(cardHashId, encodedPin, walletHashid, customerHashId)
      .then((setpinresponse) => {
        debugger;
        if (setpinresponse.status === "BAD_REQUEST") {
          toast.error(setpinresponse.message);
        } else {
          toast.success("Pin Updated Successfully");
          setShowDetails(false); // Hides the sidebar
          handleActive(-1); // Optionally reset active state
          handleShow(-1); // Optionally reset view
        }
      })
      .catch((error) => {
        // Handle any errors that might occur during the API request
        console.error("Error:", error);
        toast.error(error);
      });
    // You can make an API call to update the PIN here
  };

  const handleSubmitForLimit = async (e) => {
    debugger;
    const payload = {
      enterDailyLimit,
      enterMonthlyLimit,
      enterTransactionPerLimit,
      nameoncard,
      nickname,
      currency,
    };
    await dispatch(
      updateCard_awx(authToken, payload, selectedRowData?.card_id,awxAccountId)
    );
  };

  const [cardToken, setCardToken] = useState("");
  const [hash, setHash] = useState("")

  const handleFetchToken = async()=>{
    try{
      const params = {
        cardId: selecdedCard?.card_id, accountId: awxAccountId, authToken
      }
      let res = await axios.post(sessionStorage.getItem("baseUrl") + "/expense/card-token", {params})
      if(res.data.token){setCardToken(res.data.token)};
    }catch(e){
      console.log(e)
    }finally{

    }
  }

  useEffect(()=>{
if(cardToken){
  const hash = {
    token: cardToken,
    rules: {
        '.details': {
            backgroundColor: '#2a2a2a',
            color: 'white',
            borderRadius: '20px',
            fontFamily: 'Arial'
 
        },
        '.details__row': {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px'
        },
        '.details__label': {
            width:  '100px',
            fontWeight: 'bold'
        },
        '.details__content': { display: 'flex' },
        '.details__button svg': { color: 'white' }
    }
 };
  
 
   const hashURI = encodeURIComponent(JSON.stringify(hash));
   setHash(hashURI)
}
  }, [cardToken])

  return (
    <nav
      className="details-bar d-flex bg-white flex-column justify-content-start flex-start p-4 flex-1 border border-top-0 position-relative mt-3"
      id="sidebar">
      <div className="mt-3 position-relative">
        <h6 className="text-nowrap me-5 text-uppercase">Card Details</h6>
        <button
          type="button"
          className="btn-close btn-sm  position-absolute end-0 top-0 me-2"
          onClick={() => {
            handleShow(-1);
            handleActive(-1);
            setShowDetails(false);
            dispatch(setSensitivecarddetails({}));
          }}
        />
      </div>

      <div className="btn border mt-3 d-none">
        {showCardNumber ? (
          <p className="pt-2 text-center">{card_data?.card_number}</p>
        ) : (
          <p className="pt-2 text-center">{maskedCardNumber}</p>
        )}

        {showCardNumber ? (
          <div className="d-flex fw-500">
            <p className="pe-3 ps-2">
              Expires: {card_data?.expiry_month + "/" + card_data?.expiry_year}
            </p>
            <p>CVV2: {card_data?.cvv}</p>
          </div>
        ) : (
          <div className="d-flex fw-500">
            <p className="pe-3 ps-2">Expires: ***</p>
            <p>CVV2: ***</p>
          </div>
        )}
      </div>

      {/* <CardComponent
        cardNumber={card_data.card_number || selectedRowData.card_number}
        expiry={
          card_data.expiry_month && card_data.expiry_year
            ? `${card_data?.expiry_month}/${card_data?.expiry_year}`
            : "MM/YY"
        }
        holdername={card_data?.name_on_card || "xxxxxxx"}
        cvv={card_data?.cvv || "***"}
        showCardNumber={showCardNumber}
      /> */}

      {/* <EmbededPayment cardid ={selectedRowData.card_number}/> */}

      
   {hash && 
   <>
    <iframe src={`https://demo.airwallex.com/issuing/pci/v2/${selecdedCard?.card_id}/details#${hash}`}/>
   <iframe src={`https://demo.airwallex.com/issuing/pci/v2/${selecdedCard?.card_id}/pin#${hash}`}/>
   </> }

      <button
        className="d-flex align-items-center justify-content-center gap-2 w-100 fw-600 text-secondary text-uppercase my-2 pe-auto bg-white border-0"
        onClick={handleFetchToken}>
        <img src="/expense/card/other-card.svg" width={30} />
        {apiResponse ? "Loading..." : "Show Card details"}
      </button>

      <div className="accordion accordion-flush mt-4" id="requestMoneyDetails">
        {setPhysicalCardPin && (
          <div
            className="accordion-item "
            style={{
              borderBottom: "5px solid #d3d3d3", // Adds a 10px bottom border
              borderRadius: "10px", // Optional: Adds rounded corners
              paddingBottom: "10px", // Optional: Adds padding at the bottom
            }}>
            <h2 className="accordion-header" id="flush-headingOne">
              <button
                className="accordion-button collapsed fw-500 ps-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne">
                Set Pin
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#requestMoneyDetails">
              <div className="d-flex justify-content-center">
                {/* Centering the heading */}
                <h6 className="text-dark my-3 text-center fw-bold">
                  Set Up Your Card PIN
                </h6>
              </div>
              <div className="d-flex justify-content-center">
                <form
                  className="d-col col-lg-6 my-2 my-lg-0 fw-500 ps-3 justify-content-center align-items-center"
                  onSubmit={handleSubmit}
                  style={{
                    border: "1px solid #d3d3d3",
                    borderRadius: "10px",
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    width: "80%",
                    maxWidth: "800px",
                  }}>
                  <input
                    type="password"
                    id="enterPin"
                    placeholder="Enter 6-digit PIN"
                    className="custom-input-classPhyicalCard full-width"
                    value={enterPin}
                    onChange={(e) => setEnterPin(e.target.value)}
                    style={{
                      marginTop: "10px",
                      marginBottom: "10px",
                      fontSize: "16px",
                      padding: "10px",
                      height: "50px",
                    }}
                  />
                  <input
                    type="password"
                    id="confirmPin"
                    placeholder="Confirm your PIN"
                    className="custom-input-classPhyicalCard full-width"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    style={{
                      marginTop: "10px",
                      marginBottom: "20px",
                      fontSize: "16px",
                      padding: "10px",
                      height: "50px",
                    }}
                  />
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-action rounded-5 d-flex align-items-center justify-content-center py-2 fw-500"
                      type="submit"
                      style={{ whiteSpace: "nowrap" }}>
                      Create Pin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="accordion-item" style={{ maxWidth: 400 }}>
          <h2 className="accordion-header" id="flush-headingTwo">
            <button
              className="accordion-button btn-accordion collapsed fw-500 text-decoration-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseTwo"
              aria-expanded={isSettingCardLimit} // Update aria-expanded
              aria-controls="flush-collapseTwo"
              onClick={() => {
                setIsSettingCardLimit(!isSettingCardLimit); // Toggle the state
                // handleShowCardLimit(selectedRowData.card_id); // Call the method with cardHashId
              }}>
              {"Update Card"}
              {/* Change button label */}
            </button>
          </h2>
          <div
            id="flush-collapseTwo"
            className={`accordion-collapse collapse ${
              isSettingCardLimit ? "show" : ""
            }`} // Show div when isSettingCardLimit is true
            aria-labelledby="flush-headingTwo"
            data-bs-parent="#requestMoneyDetails">
            {/* Add the content for setting card limit here */}
            {isSettingCardLimit && (
              <div>
                <div className="d-flex justify-content-center">
                  {/* Centering the heading */}
                  <h6 className="text-dark text-center fw-bold">
                    Set Your Card Limit
                  </h6>
                </div>
                <div className="d-flex justify-content-center">
                  <div
                    className="justify-content-center align-items-center w-"
                    style={{
                      border: "1px solid #d3d3d3",
                      borderRadius: "10px",
                      padding: "20px",
                      backgroundColor: "#f9f9f9",
                      // maxWidth: "800px",
                    }}>
                    <label>Name on Card</label>
                    <input
                      type="text"
                      id="entercardname"
                      placeholder="Enter Name on card"
                      className="custom-input-classPhyicalCard full-width"
                      value={nameoncard || selecdedCard?.name_on_card}
                      onChange={(e) => setNameoncard(e.target.value)}
                      style={{
                        marginTop: "10px",
                        marginBottom: "20px",
                        fontSize: "16px",
                        padding: "10px",
                        height: "50px",
                      }}
                    />
                    <label>Nick name</label>
                    <input
                      type="text"
                      id="nickname"
                      placeholder="Enter Nick name for card"
                      className="custom-input-classPhyicalCard full-width"
                      value={nickname || selecdedCard?.nick_name}
                      onChange={(e) => setNickName(e.target.value)}
                      style={{
                        marginTop: "10px",
                        marginBottom: "20px",
                        fontSize: "16px",
                        padding: "10px",
                        height: "50px",
                      }}
                    />
                    <label>Currency</label>

                    <CustomSelect
                      options={currList?.map((item) => {
                        return { label: item.name, value: item.name };
                      })}
                      value={currency || selecdedCard?.authorization_controls?.transaction_limits.currency}
                      onChange={(selected) => setCurrency(selected?.value)}
                      // label={`Select Currency`}
                      // required
                    />

                    <label>Daily limit</label>
                    <input
                      type="number"
                      id="enterDailyLimit"
                      placeholder="Enter daily limit"
                      className="custom-input-classPhyicalCard full-width mt-2"
                      value={enterDailyLimit || selecdedCard?.authorization_controls?.transaction_limits?.limits?.find((item)=>item?.interval === "DAILY")?.amount}
                      onChange={(e) => setDailyLimit(e.target.value)}
                      style={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        fontSize: "16px",
                        padding: "10px",
                        height: "50px",
                      }}
                    />

                    {/* <label>Cash withdrawal limit (per transaction)</label>
                    <input
                      type="number"
                      id="cash_withdrawal_limits"
                      placeholder="Enter cash withdrawal limit"
                      className="custom-input-classPhyicalCard full-width mt-2"
                      value={cash_withdrawal_limits}
                      onChange={(e) => setCash_withdrawal_limits(e.target.value)}
                      style={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        fontSize: "16px",
                        padding: "10px",
                        height: "50px",
                      }}
                    /> */}

                    <label>Monthly limit</label>
                    <input
                      type="number"
                      id="enterMonthlyLimit"
                      placeholder="Enter monthly limit"
                      className="custom-input-classPhyicalCard full-width"
                      value={enterMonthlyLimit || selecdedCard?.authorization_controls?.transaction_limits?.limits?.find((item)=>item.interval === "MONTHLY")?.amount}
                      onChange={(e) => setMonthlyLimit(e.target.value)}
                      style={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        fontSize: "16px",
                        padding: "10px",
                        height: "50px",
                      }}
                    />
                    <label>Per transaction limit</label>
                    <input
                      type="number"
                      id="enterTransactionPerLimit"
                      placeholder="Enter per transaction limit"
                      className="custom-input-classPhyicalCard full-width"
                      value={enterTransactionPerLimit || selecdedCard?.authorization_controls?.transaction_limits?.limits?.find((item)=>item.interval === "PER_TRANSACTION")?.amount}
                      onChange={(e) => setTransactionPerLimit(e.target.value)}
                      style={{
                        marginTop: "10px",
                        marginBottom: "20px",
                        fontSize: "16px",
                        padding: "10px",
                        height: "50px",
                      }}
                    />

                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-action rounded-5 d-flex align-items-center justify-content-center py-2 mt-3"
                        // type="submit"
                        style={{ whiteSpace: "nowrap" }}
                        onClick={handleSubmitForLimit}>
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <div className="d-flex justify-content-center align-items-center gap-2 p-4">
            <button className="btn btn-danger">Block</button>
            <button className="btn btn-success">Unblock</button>
          </div> */}
        </div>
      </div>
    </nav>
  );
}

export default DetailsBar;
