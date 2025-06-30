import React from "react";
import CustomSelect from "../../../structure/CustomSelect";
import CustomTextField from "../../../structure/CustomText";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Select from "react-select";
import { createbill } from "../../js/bills-functions";
import { getActivatedBankAccount } from "../../js/invoices-function";
import { fetchwallets } from "../../js/bills-functions.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setTransferFields,
  setCurrentState,
  setReviewFields,
} from "../../../../@redux/features/expence";

const options = [
  { value: "Personal Income", label: "Personal Income" },
  { value: "Other Income", label: "Other Income" },
];
const placeholder = ["Pay Through"];
const styles = {
  underline: {
    "&::before": {
      borderBottom: "none",
    },
    "&::after": {
      borderBottom: "none",
    },
  },
};
const customStyles = {
  control: (provided) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    "&:hover": {
      border: "none",
    },
    width: "100%",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 2,
    width: "100%",
    color: "rgba(0,0,0,0.6)",
  }),
};

function Transfer() {
  let dispatch = useDispatch();

  let currentState = useSelector((state) => state.expence.currentState);
  let apiData = useSelector((state) => state.expence.apiData);
  let transferFields = useSelector((state) => state.expence.transferFields);
  let reviewFields = useSelector((state) => state.expence.reviewFields);

  const [val, setVal] = useState();
  const [description, setDescription] = useState(
    reviewFields?.Description || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [paymentAdviceOptions, setPaymentAdviceOptions] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);

  //Error States
  const [descriptionError, setDescriptionError] = useState(false);

  const [payThroughError, setPayThroughError] = useState(false);

  const custHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );

  const handledescriptionchange = (event) => {
    setDescriptionError(false);
    setDescription(event.target.value);
  };

  const handleincomechange = (event) => {
    setPayThroughError(false);
    setPaymentMethod(event);
  };

  const handleNextClick = async () => {
    if (!paymentMethod) {
      setPayThroughError(true);
    } else if (!description) {
      setDescriptionError(true);
    } else {
      const updatedTransferFields = {
        ...transferFields, // Keep the existing data
        SourceofFunds: paymentMethod.value,
        Description: description,
        Createdby: sessionStorage.getItem("lastemail"),
        CompanyId: sessionStorage.getItem("internalBusinessId"),
      };

      console.log(updatedTransferFields);

      await dispatch(setReviewFields(updatedTransferFields));

      setIsLoading(true);

      await createbill(updatedTransferFields)
        .then((response) => {
          // Success case - put your success logic here
          setIsLoading(false);
          console.log(response);
          setTimeout(() => {
            dispatch(setCurrentState(2)); // Replace with the actual page URL
          }, 1500);
        })
        .catch((error) => {
          // Error case - handle the error, e.g., show an error message
          console.log("create bill error" + error);
          //toast.error(error)
          setIsLoading(false);
        });
    }

    // const errors = validateForm();
    // if (Object.keys(errors).length === 0) {
    //   //setCurrentState("review");
    //   handleNextToReview();
    // } else {
    //   setValidationErrors(errors);
    // }
  };

  const fetchbalances = async () => {
    var Currency = transferFields.currency;
    const list = await fetchwallets(Currency, custHashId);
    console.log("list is" + list);
    const options = list.map((item) => ({
      value: item.curSymbol,
      label: item.curSymbol + " - " + item.balance,
    }));

    setPaymentAdviceOptions(options);
    //setIsLoading(false)

    // Check if reviewFields.SourceofFunds matches any option
    const matchingOption = options.find(
      (option) => option.value === reviewFields.SourceofFunds
    );
    if (matchingOption) {
      setPaymentMethod(matchingOption);
    }
  };

  useEffect(() => {
    var Currency = transferFields.currency;
    fetchbalances(Currency);
  }, []);

  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bill?"
    );

    if (confirmed) {
      console.log("Deleting the bill...");
      window.history.back();
    }
  };
  return (
    <div>
      {
        <style>
          {`.blinking-text {
              animation: fade-animation 1.5s ease-in-out infinite;
              color: #ff; /* Set the text color */
              }

              @keyframes fade-animation {
                0%, 100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0;
                }`}
        </style>
      }
      <div
        className="opacity-50 m-3"
        onClick={() => dispatch(setCurrentState(0))}
        role="button"
      >
        <img src="/arrows/arrowLeft.svg" width={10} />
        &nbsp; back
      </div>

      <div className="d-flex align-items-center my-4">
        <p className="m-0 mx-3 blue100 fw-normal">1. Bill</p>
        <img src="/payments/lineH.svg" />
        <p className="m-0 mx-3 blue100 fw-500">2. Review</p>
        <img src="/payments/lineH_pending.svg" />
        <p className="m-0 mx-3 grey1 fw-normal">3. Add</p>
      </div>

      <div className="d-flex bg-light border p-3 rounded-4 fw-bold h-10">
        <div className="opacity-100">Payment Amount:</div>
        <div className="flex-fill opacity-75 px-2">
          {transferFields.TotalAmount} {transferFields.currency}
        </div>
      </div>

      <div className="pay-methods">
        <div className="d-flex pt-4">
          <div className="d-flex border-bottom w-50 me-2">
            <div className="d-flex">
              <img
                src="/expense/budget.svg"
                width={40}
                className="border-end px-2"
              />
            </div>
            <div className="input-group containertext w-100 h-100 d-flex align-items-center">
              {/* <CustomSelect placeholder="Source Of Funds" options={options} setValue={setVal}/> */}
              <div className="w-100">
                <Select
                  styles={customStyles}
                  options={paymentAdviceOptions}
                  placeholder={placeholder || "--SELECT--"}
                  onChange={handleincomechange}
                  value={paymentMethod}
                />
              </div>
              {/* {incomeerror && <span className="text-danger">{incomeerror}</span>}
            {validationErrors.income && (
              <span className="text-danger">{validationErrors.income}</span>
            )} */}
            </div>
          </div>

          <div className="d-flex border-bottom w-50 ms-2">
            <div className="d-flex">
              <img
                src="/expense/reference.svg"
                width={40}
                className="border-end my-auto px-2"
              />
            </div>
            <div className="input-group containertext w-100 h-100">
              {/* <CustomTextField id='description' label="Description" className="w-100" /> */}
              <TextField
                id="description"
                label="Description"
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
                value={description}
                onInput={handledescriptionchange}
                className="w-100"
              />
            </div>
          </div>
        </div>
        <div
          className="error-div2 w-100 d-flex my-2"
          style={{ fontSize: "14px", color: "brown" }}
        >
          {payThroughError && (
            <span className="w-50">Payment method must not be empty...</span>
          )}

          {descriptionError && (
            <span className="w-100 text-end">
              Description must not be empty...
            </span>
          )}
        </div>
      </div>

      <div className="d-flex align-items-center">
        <input
          type="checkbox"
          class="form-check-input me-2 my-0"
          id="notify"
          name="notify"
          value="true"
        />
        <label
          class="form-check-label fw-regular my-0 opacity-75"
          for="notify"
          style={{ fontSize: "14px" }}
        >
          Notify (optional)
        </label>
      </div>

      <div className="d-flex justify-content-between mt-5">
        <div className="d-flex align-items-center gap-2">
          <button className="btn fw-500 bg-secondary text-white border me-2 rounded-5 py-2 px-4">
            Save as Draft
            <img src="/payments/save.svg" className="ms-1" />
          </button>
          <button
            className="btn fw-500 bg-danger text-white border me-2 rounded-5 py-2 px-4"
            onClick={handleDeleteClick}
          >
            Delete
            <img src="/payments/delete.svg" className="ms-1" />
          </button>
        </div>

        <div>
          <button
            className="btn fw-500 bg-green100 text-white py-2 rounded-5 px-4"
            onClick={handleNextClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="blinking-text">Adding Bill...</span>
              </>
            ) : (
              "Add Bill ➤"
            )}{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
