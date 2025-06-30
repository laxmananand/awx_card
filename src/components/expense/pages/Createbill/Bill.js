import React from "react";
import CustomDate from "../../../structure/CustomDate";
import CustomTextField from "../../../structure/CustomText";
import CustomSelect from "../../../structure/CustomSelect";
import { useState, useRef, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  setTransferFields,
  setCurrentState,
} from "../../../../@redux/features/expence";

const options = [
  { value: "USD", label: "USD" },
  { value: "SGD", label: "SGD" },
  { value: "GBP", label: "GBP" },
  { value: "AUD", label: "AUD" },
  { value: "EURO", label: "EURO" },
  { value: "HKD", label: "HKD" },
];
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
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 2,
  }),
};

function Bill({ selectedFileName, selectedFileurl }) {
  const dispatch = useDispatch();

  let transferFields = useSelector((state) => state.expence.transferFields);

  //Data states
  const [recipientName, setRecipientName] = useState(
    transferFields?.RecipientName || ""
  );
  const [recipientAccountNumber, setRecipientAccountNumber] = useState(
    transferFields?.RecipientAccountNumber || ""
  );
  const [recipientBillNumber, setRecipientBillNumber] = useState(
    transferFields?.Billnumber || ""
  );
  const [recipientBillAmount, setRecipientBillAmount] = useState(
    transferFields?.TotalAmount || ""
  );
  const [recipientBillCurrency, setRecipientBillCurrency] = useState(null);
  const [recipientBillDate, setRecipientBillDate] = useState(
    transferFields?.Billdate || ""
  );
  const [recipientDueDate, setRecipientDueDate] = useState(
    transferFields?.Duedate || ""
  );

  useEffect(() => {
    // Set default value programmatically
    if (transferFields?.currency) {
      const defaultValue = options.find(
        (option) => option.value === transferFields.currency
      );
      setRecipientBillCurrency(defaultValue);
    }
  }, []);

  //Error states
  const [recipientNameError, setRecipientNameError] = useState(false);
  const [recipientAccountNumberError, setRecipientAccountNumberError] =
    useState(false);
  const [recipientBillNumberError, setRecipientBillNumberError] =
    useState(false);
  const [recipientBillAmountError, setRecipientBillAmountError] =
    useState(false);
  const [recipientBillCurrencyError, setRecipientBillCurrencyError] =
    useState(false);
  const [recipientBillDateError, setRecipientBillDateError] = useState(false);
  const [recipientDueDateError, setRecipientDueDateError] = useState(false);

  const ResetStates = () => {
    setRecipientNameError(false);

    setRecipientAccountNumberError(false);

    setRecipientBillNumberError(false);

    setRecipientBillAmountError(false);

    setRecipientBillDateError(false);

    setRecipientDueDateError(false);
  };

  const handleNextClick = async () => {
    if (!recipientName) {
      setRecipientNameError(true);
      return;
    } else if (!recipientAccountNumber) {
      setRecipientAccountNumberError(true);
      return;
    } else if (recipientAccountNumber.length < 8 || recipientAccountNumber.length > 20) {
      setRecipientAccountNumberError(true);
      return;
    }else if (!recipientBillNumber) {
      setRecipientBillNumberError(true);
      return;
    } else if (!recipientBillAmount) {
      setRecipientBillAmountError("amount");
      return;
    } else if (!recipientBillCurrency) {
      setRecipientBillAmountError("currency");
      return;
    } else if (!recipientBillDate) {
      setRecipientBillDateError(true);
      return;
    } else if (!recipientDueDate) {
      setRecipientDueDateError(true);
      return;
    } else {
      ResetStates();

      await dispatch(
        setTransferFields({
          Billnumber: recipientBillNumber,
          TotalAmount: recipientBillAmount,
          Billdate: dayjs(recipientBillDate).format("YYYY-MM-DD"),
          Duedate: dayjs(recipientDueDate).format("YYYY-MM-DD"),
          currency: recipientBillCurrency.value,
          Imageurl: selectedFileurl,
          RecipientName: recipientName,
          RecipientAccountNumber: recipientAccountNumber,
        })
      );

      await dispatch(setCurrentState(1));
    }

    // if (Object.keys(errors).length === 0) {
    //   const updatedFields = updateFieldValues();
    //   getUpdatedFields(updatedFields);
    //   setCurrentState("transfer");
    // } else {
    //   setValidationErrors(errors);
    // }
  };

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
    <div className="d-flex flex-column gap-2">
      <div className="d-flex align-items-center my-4">
        <p className="m-0 mx-3 blue100 fw-500">1. Bill</p>
        <img src="/payments/lineH_pending.svg" />
        <p className="m-0 mx-3 grey1 fw-normal">2. Review</p>
        <img src="/payments/lineH_pending.svg" />
        <p className="m-0 mx-3 grey1 fw-normal">3. Transfer</p>
      </div>

      <div className="d-flex bg-light align-items-center border rounded-4 p-3 my-3">
        <div className="border">
          <img src="/expense/pdf.svg" />
        </div>
        <div className="flex-fill mx-3 opacity-75">{selectedFileName}</div>
        {/* <div className='blue100 bg-white border btn fw-500 py-2 px-3 rounded-4'>
                    <img src='/expense/preview.svg' className='me-2' />
                    Preview
                </div> */}
      </div>

      <div className="recipient-name-number">
        <div className="d-flex">
          <div className="d-flex border-bottom w-50 me-2">
            <div className="d-flex">
              <img
                src="/payments/recipient-name.svg"
                width={40}
                className="border-end my-auto px-2"
              />
            </div>
            <div className="input-group containertext w-100 h-100">
              {/* <CustomTextField label="Bill Number" id='billnumber' value={apiData.InvoiceNumber} className="w-100" /> */}
              <TextField
                id="recipientName"
                //placeholder='Bill Number'
                label="Recipient Name"
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
                value={recipientName}
                onInput={(e) => {
                  setRecipientNameError(false);
                  setRecipientName(e.target.value);
                }}
                className="w-100"
              />
            </div>
          </div>

          <div className="d-flex border-bottom w-50 ms-2">
            <div className="d-flex">
              <img
                src="/payments/account-number.svg"
                width={40}
                className="border-end my-auto px-2"
              />
            </div>
            <div className="input-group containertext w-100 h-100">
              {/* <CustomTextField label="Bill Number" id='billnumber' value={apiData.InvoiceNumber} className="w-100" /> */}
              <TextField
                id="recipientAccountNumber"
                //placeholder='Bill Number'
                label="Recipient Account Number"
                type="number"
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
                value={recipientAccountNumber}
                onInput={(e) => {
                  setRecipientAccountNumberError(false);
                  setRecipientAccountNumber(e.target.value);
                }}
                className="w-100"
              />
            </div>
          </div>
        </div>

        <div
          className="error-div2 w-100 d-flex my-2"
          style={{ fontSize: "14px", color: "brown" }}
        >
          {recipientNameError && (
            <span className="w-50">Recipient name must not be empty...</span>
          )}
          {recipientAccountNumberError && (
            <span className="w-100 text-end">
              Recipient account number must be between 8 to 20 characters
            </span>
          )}
        </div>
      </div>

      <div className="bill-amount-currency">
        <div className="d-flex">
          <div className="d-flex border-bottom w-50 me-2">
            <div className="d-flex">
              <img
                src="/payments/requestNumber.svg"
                width={40}
                className="border-end my-auto px-2"
              />
            </div>
            <div className="input-group containertext w-100 h-100">
              {/* <CustomTextField label="Bill Number" id='billnumber' value={apiData.InvoiceNumber} className="w-100" /> */}
              <TextField
                id="billnumber"
                //placeholder='Bill Number'
                label="Bill Number"
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
                value={recipientBillNumber}
                onInput={(e) => {
                  setRecipientBillNumberError(false);
                  setRecipientBillNumber(e.target.value);
                }}
                className="w-100"
              />
            </div>
          </div>

          <div className="d-flex border-bottom w-50 ms-2">
            <div className="d-flex">
              <img
                src="/payments/money.svg"
                width={40}
                className="border-end my-auto px-2"
              />
            </div>
            <div className="input-group containertext w-100 h-100 d-flex align-items-center">
              {/* <CustomTextField id='totalAmount' value={apiData.TotalAmount} className="w-50" /> */}
              <TextField
                id="totalAmount"
                label="Bill Amount"
                type="number"
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
                value={recipientBillAmount}
                onInput={(e) => {
                  setRecipientBillAmountError(false);
                  setRecipientBillAmount(e.target.value);
                }}
                className="w-50"
              />
              <div className="w-50">
                {/* <CustomSelect placeholder="$" id='currency' options={options} setValue={setVal}/> */}
                <Select
                  label="Bill Currency"
                  styles={customStyles}
                  value={recipientBillCurrency}
                  options={options}
                  placeholder={"Currency"}
                  onChange={(selectedOption) => {
                    setRecipientBillAmountError(false);
                    setRecipientBillCurrency(selectedOption);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="error-div2 w-100 d-flex my-2"
          style={{ fontSize: "14px", color: "brown" }}
        >
          {recipientBillNumberError && (
            <span className="w-50">Bill number must not be empty...</span>
          )}
          {recipientBillAmountError && (
            <span className="w-100 text-end">
              Bill {recipientBillAmountError} must not be empty...
            </span>
          )}
        </div>
      </div>

      <div className="dates">
        <div className="d-flex">
          <div className="d-flex border-bottom w-50 me-2">
            <div className="input-group containertext w-100 h-100">
              <DatePicker
                label="Bill Date"
                value={dayjs(recipientBillDate)}
                // views={["year", "month", "day"]}
                format="DD/MM/YYYY"
                onChange={(e) => {
                  setRecipientBillDateError(false);
                  setRecipientBillDate(e);
                }}
                className="w-100"
              />
            </div>
          </div>

          <div className="d-flex border-bottom w-50 ms-2">
            <div className="input-group containertext w-100 h-100">
              <DatePicker
                label="Due Date"
                value={dayjs(recipientDueDate)}
                // views={["year", "month", "day"]}
                format="DD/MM/YYYY"
                onChange={(e) => {
                  setRecipientDueDateError(false);
                  setRecipientDueDate(e);
                }}
                className="w-100"
              />
            </div>
          </div>
        </div>
        <div
          className="error-div2 w-100 d-flex my-2"
          style={{ fontSize: "14px", color: "brown" }}
        >
          {recipientBillDateError && (
            <span className="w-50">Bill date must not be empty...</span>
          )}

          {recipientDueDateError && (
            <span className="w-100 text-end">
              Due date must not be empty...
            </span>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4 mb-2">
        <div className="d-flex justify-content-between align-items-center">
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
          >
            Next to Details ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bill;
