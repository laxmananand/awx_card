import React from "react";
import CustomDate from "../../../structure/CustomDate";
import CustomTextField from "../../../structure/CustomText";
import CustomSelect from "../../../structure/CustomSelect";
import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import Select from "react-select";
import { getTodayDate } from "@mui/x-date-pickers/internals";
import { Createinvoice } from "../../js/invoices-function";
import { Createinvoicedoc } from "../../js/invoices-function";
import { toast } from "react-toastify";
import { getActivatedBankAccount } from "../../js/invoices-function";
import ReactSelect from "react-select";
import { useSelector } from "react-redux";

function Details({
  setCurrentState,
  detailsfields,
  getsendfields,
  updateddetailsFields,
  geturl,
  url,
  setUrl,
  parsedCustomerdata,
  invoicenumber,
  setInvoicenumber,
  description,
  setDescription,
  invoicedate,
  setInvoicedate,
  duedate,
  setDuedate,
  selectedPaymentAdvice,
  setSelectedPaymentAdvice,
}) {
  console.log(detailsfields);
  const [val, setVal] = useState();

  const [invoicenumbererror, setInvoicenumbererror] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [descriptionerror, setDescriptionerror] = useState();
  const [previewclicked, setPreviewclicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentAdviceOptions, setPaymentAdviceOptions] = useState([]);
  const [previewClicked, setPreviewClicked] = useState(false); // Added state to track preview click
  const custHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );

  // const [url,setUrl]=useState();
  const options = [
    { value: "$", label: "$" },
    { value: "$", label: "$" },
  ];
  const placeholder = ["-- Select --"];
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
      background: "white",
      opacity: 1,
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 2,
      background: "white",
      opacity: 1,
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: "white", // Apply background to the list as well
      opacity: 1,
    }),
  };
  const handleinvoicenumberchange = (event) => {
    var newValue = event.target.value;
    setInvoicenumber(newValue);
    console.log(newValue);
    if (newValue.trim() === "") {
      setInvoicenumbererror("Invoice number cannot be empty");
    } else {
      setInvoicenumbererror("");
      setValidationErrors(""); // Clear the error message
    }
    //onDateChange(newDate);
  };
  const handledescriptionchange = (event) => {
    var newValue = event.target.value;
    setDescription(newValue);
    console.log(newValue);
    if (newValue.trim() === "") {
      setDescriptionerror("Invoice Description cannot be empty");
    } else {
      setDescriptionerror("");
      setValidationErrors(""); // Clear the error message
    }
    //onDateChange(newDate);
  };
  const handleinvoicechange = (defaultValue) => {
    setInvoicedate(defaultValue);
    console.log(defaultValue);
    //onDateChange(newDate);
  };
  const handleduedatechange = (defaultValue) => {
    setDuedate(defaultValue);
    console.log(defaultValue);
    //onDateChange(newDate);
  };

  const validateForm = () => {
    let error = [];
    // Implement your validation logic here
    if (!invoiceNumber) {
      toast.error("Invoice number is required.");
      error.push("Invoice number is required.");
    }
    if (!invoiceDesc) {
      toast.error("Invoice description is required.");
      error.push("Invoice description is required.");
    }
    if (!invoiceDate || !dayjs(invoiceDate).isValid()) {
      toast.error("Invalid invoice date.");
      error.push("Invalid invoice date.");
    }

    // Validate due date
    if (!dueDate || !dayjs(dueDate).isValid()) {
      toast.error("Invalid due date.");
      error.push("Invalid due date.");
    }
    if (!paymentId) {
      toast.error("Payment advice is required.");
      error.push("Payment advice is required.");
    }

    // You can add more validation rules as needed

    return error;
  };
  const handleNextTosend = () => {
    var company = sessionStorage.getItem("internalBusinessId");

    if (previewclicked) {
      const updateddetailsFields = {
        ...detailsfields, // Keep the existing data
        Invoicenumber: document.getElementById("invoicenumber").value,
        Description: document.getElementById("description").value,
        Createdby: "Pabitra",
        RecipientName: parsedCustomerdata.customerName,
        CompanyId: company,
        filename: document.getElementById("invoicenumber").value + ".pdf",
        header: "Invoice",
        template: "Invoice",
        returntype: "url",
        address1: parsedCustomerdata.address1,
        address2: parsedCustomerdata.address2,
        invoiceDate: dayjs(invoicedate).format("YYYY-MMM-DD"),
        dueDate: dayjs(duedate).format("YYYY-MMM-DD"),
        Imageurl: url,
      };
      Createinvoice(updateddetailsFields, setCurrentState, parsedCustomerdata);

      // Call the function from props to pass data to Review component
      getsendfields(updateddetailsFields);
    } else {
      toast.error("Please check preview first");
    }
  };

  const previewclick = () => {
    const errors = validateForm();

    var company = sessionStorage.getItem("internalBusinessId");

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      // setCurrentState("send");
      setPreviewclicked(!previewclicked);
      const updateddetailsFields = {
        ...detailsfields, // Keep the existing data
        Invoicenumber: document.getElementById("invoicenumber").value,
        Description: document.getElementById("description").value,
        Createdby: "Pabitra",
        RecipientName: parsedCustomerdata.customerName,
        CompanyId: company,
        filename: document.getElementById("invoicenumber").value + ".pdf",
        header: "Invoice",
        template: "Invoice",
        returntype: "url",
        address1: parsedCustomerdata.address1,
        address2: parsedCustomerdata.address2,
        invoiceDate: dayjs(invoicedate).format("YYYY-MMM-DD"),
        dueDate: dayjs(duedate).format("YYYY-MMM-DD"),
        customeremail: parsedCustomerdata.customerEmail,
        paymentadvice: selectedPaymentAdvice,
      };

      Createinvoicedoc(updateddetailsFields).then((fetchedData) => {
        debugger;
        if (fetchedData) {
          setUrl(fetchedData);
          sessionStorage.setItem("pdfURL", fetchedData);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    } else {
      setValidationErrors(errors);
    }
  };

  const updateParentFields = () => {
    setInvoicenumber(invoiceNumber);
    setDescription(invoiceDesc);
    setInvoicedate(invoiceDate);
    setDuedate(dueDate);
    setSelectedPaymentAdvice(paymentId.uniquePaymentId);
  };

  const handleNextClick = async () => {
    const errors = validateForm();

    if (invoiceNumber && invoiceDesc && invoiceDate && dueDate && paymentId) {
      await updateParentFields();
    }

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      const updateddetailsFields = {
        ...detailsfields,
        Invoicenumber: invoiceNumber,
        Description: invoiceDesc,
        Createdby: "Pabitra",
        RecipientName: parsedCustomerdata.customerName,
        CompanyId: sessionStorage.getItem("internalBusinessId"),
        filename: invoiceNumber + ".pdf",
        header: "Invoice",
        template: "Invoice",
        returntype: "url",
        address1: parsedCustomerdata.address1,
        address2: parsedCustomerdata.address2,
        invoiceDate: dayjs(invoiceDate).format("YYYY-MMM-DD"),
        dueDate: dayjs(dueDate).format("YYYY-MMM-DD"),
        customeremail: parsedCustomerdata.customerEmail,
        paymentadvice: paymentId.uniquePaymentId,
      };

      if (!previewClicked) {
        const fetchedData = await Createinvoicedoc(updateddetailsFields);
        if (fetchedData) {
          setUrl(fetchedData);
          sessionStorage.setItem("pdfURL", fetchedData);
          setPreviewClicked(true);
        }
        setLoading(false);
      } else {
        Createinvoice(
          updateddetailsFields,
          setCurrentState,
          parsedCustomerdata
        );
        getsendfields(updateddetailsFields);
        setLoading(false);
      }
    } else {
      setValidationErrors(errors);
    }
  };

  // Custom Option component to show flag and payment ID
  const CustomOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{ display: "flex", alignItems: "center", padding: "10px" }}
      >
        {/* Flag Icon */}
        <img
          src={data.flagSrc}
          alt={data.currencyCode}
          style={{
            width: "20px",
            height: "20px",
            marginRight: "10px",
            borderRadius: "50%",
            border: "1px solid lightgrey",
          }}
        />
        {/* Payment ID */}
        {data.label}
      </div>
    );
  };

  const getAccountDetails = async () => {
    const list = await getActivatedBankAccount("SGD", custHashId);

    // Flags array
    const flags = [
      { currencyCode: "SGD", src: "/flags/sg.svg" },
      { currencyCode: "EUR", src: "/flags/fr.svg" },
      { currencyCode: "USD", src: "/flags/us.svg" },
      { currencyCode: "HKD", src: "/flags/hk.svg" },
      { currencyCode: "GBP", src: "/flags/gb.svg" },
      { currencyCode: "AUD", src: "/flags/au.svg" },
    ];

    // Map list to include flag icon with options
    const options = list.map((item) => {
      const flag = flags.find(
        (flag) => flag.currencyCode === item.currencyCode
      );
      return {
        value: item,
        label: item.uniquePaymentId,
        flagSrc: flag ? flag.src : "", // Add flag source to each option
        currencyCode: item.currencyCode,
      };
    });

    // Set options for react-select dropdown
    setPaymentAdviceOptions(options);
  };

  useEffect(() => {
    getAccountDetails();
  }, []);
  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Invoice?"
    );

    if (confirmed) {
      console.log("Deleting the bill...");
      window.history.back();
    }
  };

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDesc, setInvoiceDesc] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(dayjs());
  const [dueDate, setDueDate] = useState(dayjs());
  const [paymentId, setPaymentId] = useState(null);

  const tableHeaders = [
    {
      label: "Inv. Number",
      width: "50px",
      borderStyle: { borderTopLeftRadius: "8px" },
    },
    { label: "Inv. Description", width: "50px" },
    { label: "Inv. Date", width: "200px" },
    { label: "Due Date", width: "200px" },
    {
      label: "Payment ID",
      width: "200px",
      borderStyle: { borderTopRightRadius: "8px" },
    },
  ];

  return (
    <div
      style={{ height: "33rem" }}
      className="d-flex justify-content-between flex-column gap-4"
    >
      <div className="d-flex flex-column gap-3">
        <div className="d-flex align-items-center my-2">
          <p className="m-0 mx-3 blue100 fw-normal">1. Items</p>
          <img src="/payments/lineH.svg" />
          <p className="m-0 mx-3 blue100 fw-500">2. Details</p>
          <img src="/payments/lineH_pending.svg" />
          <p className="m-0 mx-3 grey1 fw-normal">3. Send</p>
        </div>

        <div
          className="mx-2 my-2 text-primary"
          onClick={() => setCurrentState("items")}
          role="button"
        >
          ⬅️ BACK
        </div>

        <>
          <style>
            {`.table-input{
              border: none;
              border-bottom: 1px solid lightgrey;
              padding-top: 24px;
              padding-bottom: 14px;
              font-size: 15px;
              color:rgba(0,0,0,0.8)
              font-weight:500;
          }
          
          .table-input:focus-visible{
              outline:0;
              border-bottom:2px solid rgba(0,0,0,0.5)
          }
          
          .table-input:hover{
              cursor:text;
          }`}
          </style>

          <form
            className="rounded-4 my-4"
            style={{ border: "1px solid rgba(0,0,0,0.4)" }}
          >
            <table
              className="table mb-0"
              style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
            >
              <thead
                className="py-3"
                style={{
                  background: "rgba(0,0,0, 0.4)",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <tr
                  style={{
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                >
                  {tableHeaders.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      width={header.width}
                      style={header.borderStyle}
                    >
                      <span className="text-light fw-500 px-2">
                        {header.label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="border-top-0 py-3">
                <>
                  <tr className="opacity-75">
                    <td className="ps-3 pt-2 pb-4">
                      <input
                        type="text"
                        value={invoiceNumber}
                        onInput={(e) => setInvoiceNumber(e.target.value)}
                        className="table-input"
                        id="invoiceNumber"
                      />
                    </td>
                    <td className="ps-3 pt-2 pb-4">
                      <input
                        type="text"
                        value={invoiceDesc}
                        onInput={(e) => setInvoiceDesc(e.target.value)}
                        className="table-input"
                        id="invoiceDesc"
                      />
                    </td>
                    <td className="ps-2 pt-2 pb-4">
                      <div className="border-bottom">
                        <DatePicker
                          defaultValue={dayjs(invoiceDate)}
                          views={["year", "month", "day"]}
                          format="YYYY-MMM-DD"
                          onChange={(e) => setInvoiceDate(e)}
                          className="w-100"
                          value={invoiceDate}
                        />
                      </div>
                    </td>
                    <td className="ps-2 pt-2 pb-4">
                      <div className="border-bottom">
                        <DatePicker
                          defaultValue={dayjs(dueDate)}
                          views={["year", "month", "day"]}
                          format="YYYY-MMM-DD"
                          onChange={(e) => setDueDate(e)}
                          className="w-100"
                          value={duedate}
                        />
                      </div>
                    </td>
                    <td className="ps-2 pt-2 pb-4">
                      <div
                        className="border-bottom"
                        style={{ paddingTop: "10px", paddingBottom: "8px" }}
                      >
                        <Select
                          label="Account Number"
                          id="paymentadvice"
                          styles={customStyles}
                          options={paymentAdviceOptions}
                          components={{ Option: CustomOption }}
                          placeholder={placeholder || "--SELECT--"}
                          onChange={(selectedOption) => {
                            setPaymentId(
                              selectedOption ? selectedOption.value : null
                            );
                          }}
                          value={paymentAdviceOptions?.find(
                            (item) =>
                              item.label ==
                              selectedPaymentAdvice?.uniquePaymentId
                          )}
                          className="w-100"
                        />
                      </div>
                    </td>
                  </tr>
                </>
              </tbody>
            </table>
          </form>
        </>
      </div>

      <div className="d-flex justify-content-between mt-5">
        <div className="d-flex">
          <button
            className="btn fw-500 bg-primary border me-2 py-2 px-4 rounded-5 text-light d-flex justify-content-center align-items-center gap-1"
            style={{ fontSize: "15px" }}
          >
            Save as Draft
            <img
              src="/payments/save.svg"
              className="ms-1"
              alt="save"
              width={20}
            />
          </button>
          <button
            className="btn fw-500 bg-danger border me-2 py-2 px-4 rounded-5 text-light d-flex justify-content-center align-items-center"
            onClick={handleDeleteClick}
            style={{ fontSize: "15px" }}
          >
            Delete
            <img
              src="/payments/delete.svg"
              className="ms-1"
              alt="delete"
              width={20}
            />
          </button>
        </div>

        <div>
          <div>
            <div>
              <button
                className={`btn fw-500 py-2 rounded-5 px-4 ${
                  previewClicked
                    ? "bg-green100 text-white"
                    : "blue100 border border-primary"
                }`}
                onClick={handleNextClick}
                disabled={loading}
              >
                {loading ? (
                  "Loading..."
                ) : previewClicked ? (
                  "Create Invoice"
                ) : (
                  <>
                    Preview
                    <img
                      src="/expense/preview.svg"
                      className="ms-1"
                      alt="preview"
                    />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* {url && (
                <iframe src={url}width="100%" height="400" title="Preview"></iframe>
            )} */}
    </div>
  );
}

export default Details;
