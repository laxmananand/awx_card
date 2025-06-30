import React, { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { temporaryBlockCardApi } from "../../js/cards-functions";
// import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { activeCardApi, temporaryUnBlockCardApi, permanentBlockCardApi } from "../../js/cards-functions";
import { useDispatch, useSelector } from "react-redux";


function TableRow({ index, setShowDetails, data, setSelectedRowData, refreshCardList }) {
  const row = data[index];
  const colorList = [
    " blue100 bg-blue10",
    " green100 bg-green10",
    " yellow100 bg-yellow10",
  ];
  function getColorClass(cardStatus) {
    if ( cardStatus === "ACTIVE") {
      return "text-white bg-success";
    } else if (cardStatus === "INACTIVE") {
      return "text-white bg-danger";
    } else if (cardStatus === "PENDING") {
      return "text-white bg-secondary";
    } else {
      return "text-white bg-primary";
    }
  }
  const date = data?.created_at.split(' ')[0]; 

  var lastfourdigit = data.card_number?.replace(/\D/g, "").slice(-4);
  function getInitials(firstName, lastName) {
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName.charAt(0);
    return `${firstInitial}${lastInitial}`;
  }
  // const initials = getInitials(data.firstName, data.lastName);

  const initials = data.nick_name;

  function getCardType(cardNumber) {
    // Remove all non-digit characters (spaces, dashes, etc.)
    cardNumber = cardNumber.replace(/\D/g, "");

    // Visa starts with '4' and has 13 or 16 digits
    if (/^4\d{12}(\d{3})?$/.test(cardNumber)) {
      return "Visa";
    }

    // Mastercard starts with '51' - '55' or '2221' - '2720' and has 16 digits
    if (
      /^5[1-5]\d{14}$/.test(cardNumber) ||
      /^2(2[2-9][1-9]|2[3-9]\d|[3-6]\d{2}|7[0-1]\d|720)\d{12}$/.test(cardNumber)
    ) {
      return "Mastercard";
    }

    // American Express starts with '34' or '37' and has 15 digits
    if (/^3[47]\d{13}$/.test(cardNumber)) {
      return "Amex";
    }

    // Return 'Unknown card type' if card type is not recognized
    return "Unknown card type";
  }

  var walletHashid = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.walletHashId
  ); 
  var customerHashId =  useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.customerHashId
  );

  const permanentlyBlockedAction = () => {
    Swal.fire({
      icon: "info",
      title: "Card Permanently Blocked",
      text: "Oops! Your card is permanently blocked.",
      showCancelButton: true,
      cancelButtonText: "Cancel"
    });
  };


  const temporaryBlockedAction = (cardHashId) => {
    Swal.fire({
      icon: "info",
      title: "Card Temporarily Blocked",
      text: "Oops! Your card is temporarily blocked. Do you want to unblock it?",
      showCancelButton: true,
      confirmButtonText: "Unblock",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call your function here
        unblockCardApi(cardHashId);
      }
    });
  }
  
  const activePhysicalCard = (cardHashId) => {
    Swal.fire({
      icon: "info",
      title: "Card Temporarily inactive",
      text: "Oops! Your card is temporarily inactive. Do you want to activate it?",
      showCancelButton: true,
      confirmButtonText: "Activate",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call your function here
        activePhysicalCardApi(cardHashId);
      }
    });
  }

  
  const takeAction = (cardStatus, rowData) => {
    if (cardStatus === "VIRTUAL_ACTIVE" || cardStatus === "ACTIVE") {
      // User can block permanently or temporarily
      virtualActiveStatusAction(rowData);
    } else if (cardStatus === "P_BLOCK") {
      // Card is permanently blocked
      permanentlyBlockedAction();
    } else if (cardStatus === "TEMP_BLOCK") {
      // User can unblock the card
      temporaryBlockedAction(rowData);
    } else if (cardStatus === "INACTIVE") {
      activePhysicalCard(rowData);
    } else {
      console.log("Unhandled status:", cardStatus);
    }
  };

  const virtualActiveStatusAction = (cardHashId) => {
    Swal.fire({
      icon: "info",
      title: "Currently card is active",
      html: `
        <p>Your card is currently active. What action would you like to take?</p>
        <select 
          id="blockOption" 
          class="bg-white my-auto fw-bold pe-2 ps-2" 
          style="cursor: pointer; width: 100%; padding: 0.5rem; border: 2px solid grey; border-radius: 4px;">
          <option value="">Select Card Action</option>
          <option value="temporary">Temporary Block</option>
          <option value="permanent">Permanent Block</option>
        </select>
        <div id="reasonDropdown" style="display: none;  margin-top: 10px">
          <select 
            id="reasonOption" 
            class="bg-white my-auto fw-bold pe-2 ps-2" 
            style="cursor: pointer; width: 100%; padding: 0.5rem; border: 2px solid grey; border-radius: 4px;">
            <option value="">Select Reason</option>
            <option value="fraud">Fraudulent Activity</option>
            <option value="lost">Card Lost</option>
            <option value="stolen">card Stolen</option>
            <option value="damaged">card damaged</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Proceed",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const selectedOption = document.getElementById("blockOption").value;
        if (selectedOption === "permanent") {
          const selectedReason = document.getElementById("reasonOption").value;
          if (!selectedReason) {
            Swal.showValidationMessage("Please select a reason for permanent block.");
            return false;
          }
          return { action: "permanent", reason: selectedReason };
        } else if (selectedOption === "temporary") {
          return { action: "temporary" };
        } else {
          Swal.showValidationMessage("Please select a card action.");
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value.action === "temporary") {
          console.log("Temporary Block selected");
          console.log(cardHashId);
          temporaryBlockCards(cardHashId);  // Call the function for temporary block
        } else if (result.value.action === "permanent") {
          const selectedReason = result.value.reason;
          console.log(`Permanent Block selected with reason: ${selectedReason}`);
          // Call the function for permanent block with reason
          permanentBlockCard(cardHashId, selectedReason);
        }
      }
    });
  
    // Listen for change in the "blockOption" dropdown to show/hide the reason dropdown
    document.getElementById("blockOption").addEventListener("change", (event) => {
      const reasonDropdown = document.getElementById("reasonDropdown");
      if (event.target.value === "permanent") {
        reasonDropdown.style.display = "block";
      } else {
        reasonDropdown.style.display = "none";
      }
    });
  };


  const activePhysicalCardApi = (cardHashId) => {
    console.log(`Performing temporary block`);
    // Add your logic here
    activeCardApi(walletHashid, customerHashId, cardHashId).then((fetchedData) => {
      
      console.log("Data:", JSON.stringify(fetchedData));
      
      if (fetchedData === "Active") {
        refreshCardList();
        toast.success("Card is successfully activated");
      } else if(fetchedData ==="Wait"){
        toast.error("Activation not allowed for 24 hours from issuance");
      }  
      else {
        toast.error("An error occurred. Please try again.");
      }
    }).catch((error) => {
      console.error("Error fetching cards:", error);
    });
  };


  const unblockCardApi = (cardHashId) => {
    console.log(`Performing temporary block`);
    // Add your logic here
    temporaryUnBlockCardApi(walletHashid, customerHashId, cardHashId).then((fetchedData) => {
      
      console.log("Data:", JSON.stringify(fetchedData));

      if (fetchedData === "Card is successfully unlocked") {
        refreshCardList();
        toast.success("Card is successfully unlocked");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }).catch((error) => {
      console.error("Error fetching cards:", error);
    });
  };

    
  const temporaryBlockCards = (cardHashId) => {
    console.log(`Performing temporary block`);
    // Add your logic here
    temporaryBlockCardApi(walletHashid, customerHashId, cardHashId).then((fetchedData) => {
      
      console.log("Data:", JSON.stringify(fetchedData));

      if (fetchedData === "Card is successfully locked") {
        refreshCardList();
        toast.success("Card is successfully locked");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }).catch((error) => {
      console.error("Error fetching cards:", error);
    });
  };
  
  const permanentBlockCard = (cardHashId, selectedReason) => {
    console.log(`Performing temporary block`);
    // Add your logic here
    permanentBlockCardApi(walletHashid, customerHashId, cardHashId, selectedReason).then((fetchedData) => {
      
      console.log("Data:", JSON.stringify(fetchedData));

      if (fetchedData === "Success") {
        refreshCardList();
        toast.success("Card is successfully blocked");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }).catch((error) => {
      console.error("Error fetching cards:", error);
    });
  };
  
  return (
    <tr
      className="blueHover opacity-75"
      role="button"
    >
      <td scope="row"
      onClick={() => {
        setShowDetails(true);
        setSelectedRowData(data);
      }}
      >
        {" "}
        <div className="d-flex align-items-center justify-content-center gap-2">
          <img
            src={
              data.brand === "Visa"
                ? "/expense/card/visa.svg"
                : data.brand === "Mastercard"
                ? "/expense/card/mastercard.svg"
                : data.brand === "Amex"
                ? "/expense/card/amex.svg"
                : "/expense/card/other-card.svg"
            }
            alt=""
            width={30}
          />

          <span style={{ color: 'blue' }}>*{lastfourdigit}</span>
        </div>
      </td>

      <td className="text-center align-middle">
        <span className="fw-500">{data.nick_name}</span>
      </td>
      <td className="text-center align-middle">
      
        {date}
      </td>
      {/* <td className="text-center align-middle">
        <div className="w-100 d-flex justify-content-center align-items-center">
          <div
            className={
              "py-2 px-4 rounded-pill fw-500 text-center text-white bg-black text-uppercase"
            }
            style={{
              width: "8rem",
              fontSize: "14px",
              padding: "0.75rem 0 !important",
            }}
          >
            {data.cardType === "VIR" ? "Virtual" : "PHYsical"}
          </div>
        </div>
      </td> */}
      <td className="text-center align-middle">
        <div className="w-100 d-flex justify-content-center align-items-center">
          <div
            className={
              "py-2 px-4 rounded-pill fw-500 text-center " +
              getColorClass(data.card_status)
            }
            style={{
              width: "8rem",
              fontSize: "14px",
              padding: "0.75rem 0 !important",
            }}
          >
            {data.card_status}
          </div>
        </div>
      </td>
      <td className="text-center align-middle"
      onClick={() => {
        takeAction(data?.cardStatus, data?.cardHashId);
      }}
      >  
        <div className="w-100 d-flex justify-content-center align-items-center">
        <div
            className={
              "py-2 px-4 rounded-pill fw-500 text-center bg-primary text-white"
            }
            style={{
              width: "10rem",
              fontSize: "14px",
              padding: "0.75rem 0 !important",
            }}
          >
            {"Action"}
          </div>
        </div>
      </td>
    </tr>
  );
}

function CardList({ setShowDetails, data, setSelectedRowData, refreshCardList }) {

  const listCards = useSelector((state) => state.card?.cardsList);


  //  useEffect(() => {
  //   console.log("data is :",data);
  //  },[])

  return (
    <div>
      <div className="mx-3 text-center align-middle">
        <table className="table border">
          <thead className="table-light py-3">
            <tr className="grey1">
              <th scope="col" className="fw-500 text-center">
                Card Number
              </th>
              <th scope="col" className="fw-500 text-center">
                Name On Card
              </th>
              <th scope="col" className="fw-500 text-center">
              Created At
              </th>
              {/* <th scope="col" className="fw-500 text-center">
                Card Type
              </th> */}
              <th scope="col" className="fw-500 text-center">
                Status
              </th>
              <th scope="col" className="fw-500 text-center">
                Block/Unblock
              </th>
            </tr>
          </thead>
          <tbody className="border-top-0">
            {listCards.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <>
                    <div className="d-flex justify-content-center">
                      <div>
                        <img
                          src="/no_transactions.jpg"
                          alt="no-transactions-icon"
                          width={100}
                        />
                      </div>
                    </div>
                    <p className="text-center mt-3">
                      <span
                        className="fw-500"
                        style={{
                          fontSize: "15px",
                          color: "var(--main-color)",
                        }}
                      >
                        Oops! It seems that you haven't created any card(s) for
                        the given dates/search query.
                      </span>
                    </p>
                  </>
                </td>
              </tr>
            ) : (
              <>
                {listCards.map((item, index) => (
                  <TableRow
                    key={index}
                    data={item}
                    index={index}
                    setShowDetails={setShowDetails}
                    setSelectedRowData={setSelectedRowData}
                    refreshCardList={refreshCardList}
                  />
                ))}
              </>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default CardList;
