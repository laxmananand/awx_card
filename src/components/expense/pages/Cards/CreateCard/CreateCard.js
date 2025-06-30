import React, { useState } from "react";
import BreadCrumbs from "../../../../structure/BreadCrumbs";
import CustomTextField from "../../../../structure/CustomText";
import CustomSelect from "../../../../structure/CustomSelect";
import { Link } from "react-router-dom";
import SideBar from "../../../../SideBar";
import { RxCardStack } from "react-icons/rx";
import { BsCardChecklist } from "react-icons/bs";
import { TextField } from "@mui/material";
import Select from 'react-select';

import { addcard,addSpendControls } from "../../../js/cards-functions";
import { toast } from "react-toastify";

function CreateCard() {
  const cardTypes = [
    { label: "Virtual", value: "GPR_VIR" },
    { label: "Physical", value: "GPR_PHY" }
  ];
  const styles = {
    underline: {
        '&::before': {
            borderBottom: 'none',
        },
        '&::after': {
            borderBottom: 'none',
        },
    },
};

const customStyles = {
  control: (provided) => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      '&:hover': {
          border: 'none',
      },
  }),
  menu: (provided) => ({
      ...provided,
      zIndex: 2,
  }),
};


  const [perTransactionAmount, setPerTransactionAmount] = useState(10000);
  const [dailyAmountLimit, setDailyAmountLimit] = useState(100000);
  const [monthlyAmountLimit, setMonthlyAmountLimit] = useState(500000);
  const [lifetimeAmountLimit, setLifetimeAmountLimit] = useState(1000000);
  const [lifetimeCountLimit, setLifetimeCountLimit] = useState(10);
  const [transactionDurationLimit, setTransactionDurationLimit] = useState(30);
  const [spendBox, setSpendBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState("");
  const [val, setVal] = useState();
  const [incomeerror,setIncomeerror] = useState("");

  const handleFieldChange = (field, value) => {
    switch (field) {
      case "perTransactionAmount":
        setPerTransactionAmount(value);
        break;
      case "dailyAmountLimit":
        setDailyAmountLimit(value);
        break;
      case "monthlyAmountLimit":
        setMonthlyAmountLimit(value);
        break;
      case "lifetimeAmountLimit":
        setLifetimeAmountLimit(value);
        break;
      case "lifetimeCountLimit":
        setLifetimeCountLimit(value);
        break;
      case "transactionDurationLimit":
        setTransactionDurationLimit(value);
        break;
      default:
        break;
    }
  };

  const handledescriptionchange = (event) => {debugger
    var newValue = event.target.value;
    setDescription(newValue);
    console.log(newValue)
    if (newValue.trim() === "") {
        setDescriptionError("Name On Card cannot be empty");
        
    } else {
        setDescriptionError("");
      setValidationErrors(""); // Clear the error message
    }
    //onDateChange(newDate);
  };
  const handleincomechange = (event) => {debugger
    var newValue = event.value;
    setVal(newValue);
    console.log(newValue)
    if (newValue === "") {
        setIncomeerror("currency cannot be empty");
    } else {
        setIncomeerror("");
        setValidationErrors(""); // Clear the error message
    }
    //onDateChange(newDate);
  };

  
  const validateForm = () => {
    const errors = {};
    const description = document.getElementById("description").value;
    // const currency =val !== undefined && val !== null ? val : '';

    // Implement your validation logic here
    if (description=='') {
        errors.description = 'Bill Description is required.';
    }

    if (!val) {
        errors.income = 'CardType is required.';
    }

    // You can add more validation rules as needed

    return errors;
};
const handleNextClick = () => {debugger
  const errors = validateForm();

  if (Object.keys(errors).length === 0) {
      //setCurrentState("review");
      handleNextToReview();
  } else {
      setValidationErrors(errors);
  }
};

const handleNextToReview = () => {debugger
  // Assuming you want to add more data to transferFields
 var nameoncard=document.getElementById("description").value;
 var cardtype = val;
 setIsLoading(true);
 addcard(nameoncard,cardtype)
.then((response) => {debugger
// Success case - put your success logic here
setIsLoading(false);
console.log(response)
if (spendBox) {
  const spendControlsData = {
    // Provide the necessary data for spend controls
    perTransactionAmount,
    dailyAmountLimit,
    monthlyAmountLimit,
    lifetimeAmountLimit,
    lifetimeCountLimit,
    transactionDurationLimit,
  };
  addSpendControls(response.cardHashId, spendControlsData)
    .then((spendControlsResponse) => {
      // Handle success for spend controls API
      setIsLoading(false);
      console.log("Spend Controls Added:", spendControlsResponse);
      toast.success(spendControlsResponse)
    })
    .catch((spendControlsError) => {
      // Handle error for spend controls API
      setIsLoading(false);
      console.error("Error adding spend controls:", spendControlsError);
    });
  }

})
.catch((error) => {debugger
// Error case - handle the error, e.g., show an error message
console.log("create bill error"+error)
//toast.error(error)
setIsLoading(false);
});

};
      
      

  return (
    <div className="d-flex">
      <SideBar />
      <div
        className="container-fluid px-0 bg-light clear-left overflow-auto"
        style={{ height: "100vh" }}
      >
        <BreadCrumbs
          data={{
            backurl: "/expense/corporate-cards",
            name: "Create New Cards",
            info: true,
            img: "/arrows/arrowLeft.svg",
          }}
        />

        <div className="d-flex">
          <div className="bg-white m-3 p-4 border rounded-3 flex-fill">
            <h6>Card Details &nbsp;</h6>
            <p className="fw-500 fs-6 pt-4">Overview</p>
            <div className="d-flex">
              <div className="d-flex border-bottom mb-4 w-50 me-2">
                <RxCardStack className="border-end my-auto px-2" size={40} />
                <div className="input-group containertext w-100 h-100">
                  {/* <CustomTextField label="Name on card" className="w-100" /> */}
                  <TextField
                        id='description'
                        label="Name on Card"
            
            InputProps={{
                classes: {
                    underline: styles.underline,
                },
                
            }}
            InputLabelProps={{
                classes: {
                    focused: styles.inputLabel,
                },
            }}
            defaultValue={description} 
            onChange={handledescriptionchange}
            className="w-100"
        />
        {descriptionError && <span className="text-danger">{descriptionError}</span>}
        {validationErrors.description && <span className='text-danger'>{validationErrors.description}</span>}
                </div>
              </div>

              <div className="d-flex border-bottom mb-4 w-50 ms-2">
                <BsCardChecklist className="border-end my-auto px-2" size={40} />
                <div className="input-group containertext w-100 h-100">
                  {/* <CustomSelect placeholder="Card Type" onChange={handleincomechange}  options={cardTypes} /> */}
                  <Select styles={customStyles} options={cardTypes} placeholder="Card Type"  onChange={handleincomechange} />
                        {incomeerror && <span className="text-danger">{incomeerror}</span>}
                        {validationErrors.income && <span className='text-danger'>{validationErrors.income}</span>}
                </div>
              </div>
            </div>

            <div className="checkbox-lg">
              <input
                className="form-check-input"
                type="checkbox"
                id="checkbox"
                value={true}
                onChange={() => setSpendBox(!spendBox)}
                checked={spendBox}
              />
              <label className="fw-normal ps-2" htmlFor="checkbox">
                Set Spend Limit &#40;Optional&#41;
              </label>
            </div>

            {spendBox ? (
              <>
                <p className="fw-500 fs-6 pt-2 mt-4">Spend Controls</p>
                <div className="d-flex">
                  <div className="d-flex w-100">
                    <label htmlFor="PER_TRANSACTION_AMOUNT_LIMIT" className="form-label w-25">
                      Per Transaction Amount Limit
                    </label>
                    <input
                      type="range"
                      className="form-range w-50"
                      id="PER_TRANSACTION_AMOUNT_LIMIT"
                      min="100"
                      max="100000"
                      step="100"
                      value={perTransactionAmount}
                      onChange={(e) =>
                        handleFieldChange("perTransactionAmount", parseInt(e.target.value, 10))
                      }
                    />
                    <span className="ms-2">{perTransactionAmount} USD</span>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="d-flex w-100">
                    <label htmlFor="DAILY_AMOUNT_LIMIT" className="form-label w-25">
                      Daily Amount Limit
                    </label>
                    <input
                      type="range"
                      className="form-range w-50"
                      id="DAILY_AMOUNT_LIMIT"
                      min="100"
                      max="1000000"
                      step="100"
                      value={dailyAmountLimit}
                      onChange={(e) =>
                        handleFieldChange("dailyAmountLimit", parseInt(e.target.value, 10))
                      }
                    />
                    <span className="ms-2">{dailyAmountLimit} USD</span>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="d-flex w-100">
                    <label htmlFor="MONTHLY_AMOUNT_LIMIT" className="form-label w-25">
                      Monthly Amount Limit
                    </label>
                    <input
                      type="range"
                      className="form-range w-50"
                      id="MONTHLY_AMOUNT_LIMIT"
                      min="100"
                      max="10000000"
                      step="100"
                      value={monthlyAmountLimit}
                      onChange={(e) =>
                        handleFieldChange("monthlyAmountLimit", parseInt(e.target.value, 10))
                      }
                    />
                    <span className="ms-2">{monthlyAmountLimit} USD</span>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="d-flex w-100">
                    <label htmlFor="LIFETIME_AMOUNT_LIMIT" className="form-label w-25">
                      Lifetime Amount Limit
                    </label>
                    <input
                      type="range"
                      className="form-range w-50"
                      id="LIFETIME_AMOUNT_LIMIT"
                      min="100"
                      max="10000000"
                      step="100"
                      value={lifetimeAmountLimit}
                      onChange={(e) =>
                        handleFieldChange("lifetimeAmountLimit", parseInt(e.target.value, 10))
                      }
                    />
                    <span className="ms-2">{lifetimeAmountLimit} USD</span>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="d-flex w-100">
                    <label htmlFor="LIFETIME_COUNT_LIMIT" className="form-label w-25">
                      Lifetime Count Limit
                    </label>
                    <input
                      type="range"
                      className="form-range w-50"
                      id="LIFETIME_COUNT_LIMIT"
                      min="1"
                      max="100"
                      step="1"
                      value={lifetimeCountLimit}
                      onChange={(e) =>
                        handleFieldChange("lifetimeCountLimit", parseInt(e.target.value, 10))
                      }
                    />
                    <span className="ms-2">{lifetimeCountLimit}</span>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="d-flex w-100">
                    <label htmlFor="TRANSACTION_DURATION_LIMIT" className="form-label w-25">
                      Transaction Duration Limit
                    </label>
                    <input
                      type="range"
                      className="form-range w-50"
                      id="TRANSACTION_DURATION_LIMIT"
                      min="1"
                      max="365"
                      step="1"
                      value={transactionDurationLimit}
                      onChange={(e) =>
                        handleFieldChange("transactionDurationLimit", parseInt(e.target.value, 10))
                      }
                    />
                    <span className="ms-2">{transactionDurationLimit} days</span>
                  </div>
                </div>
              </>
            ) : <></>
            }

            <div className="d-flex justify-content-end mt-5">
              <div>
                <button className="btn fw-500 btn-dark border me-2 py-2 rounded-4">
                  Cancel
                </button>
                {/* <button
        className="btn fw-500 bg-green100 text-white py-2 rounded-4"
        onClick={handleIssueCard}
      >
        Issue Card
      </button> */}
      <button className='btn fw-500 btn-action py-2 rounded-4' onClick={handleNextClick} disabled={isLoading}>
                         {isLoading ? <>
          <div >
                 Adding Card
                </div>
        </> : 'Add Card'} &gt;</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCard;
