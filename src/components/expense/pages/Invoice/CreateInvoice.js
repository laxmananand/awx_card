import React, { useEffect, useState } from "react";
import BreadCrumbs from "../../../structure/BreadCrumbs";
import Details from "./Details";
import Documents from "./Items";
import Review from "./Send";
import DetailsSideBar from "./DetailsSideBar";
import SendSidebar from "./SendSidebar";
import SideBar from "../../../SideBar";
import { useLocation } from "react-router-dom";
import {
  Createinvoice,
  getActivatedBankAccount,
  xeroCreateInvoice,
} from "../../js/invoices-function";
import dayjs from "dayjs";
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";
import CustomInput from "./../../../structure/NewStructures/CustomInput";
import CustomSelect from "./../../../structure/NewStructures/CustomSelect";
import { CustomDatepickerGeneral } from "./../../../structure/NewStructures/CustomDatePicker";
import * as restrictions from "../../../onboarding/dashboard/tabs/functions/restrictInput";
import "../../css/invoice-table.css";
import {
  AddCircleOutline,
  Clear,
  Delete,
  EditNote,
  EmailOutlined,
  NoteAdd,
  Visibility,
  VisibilityOutlined,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import {
  CreateInvoice,
  CreateInvoiceDoc,
} from "../../../../@redux/action/expence";
import CustomModal from "../../../structure/NewStructures/CustomModal";

export const validations = {
  alpha: (value, name) => {
    const alphaRegex = /^[A-Za-z \-']+$/;
    if (value && !alphaRegex.test(value)) {
      toast.error(
        `${name} must contain only alphabetic characters. Example: "John"`
      );
    }
  },
  numeric: (value, name) => {
    const numericRegex = /^[0-9]+$/;
    if (value && !numericRegex.test(value)) {
      toast.error(
        `${name} must contain only numeric characters. Example: "12345"`
      );
    }
  },
  alphanumeric: (value, name) => {
    const alphanumericRegex = /^[A-Za-z0-9]+$/;
    if (value && !alphanumericRegex.test(value)) {
      toast.error(
        `${name} must contain only alphanumeric characters. Example: "John123"`
      );
    }
  },
  email: (value, name) => {
    const emailRegex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      toast.error(
        `${name} must be a valid email address. Example: "john.doe@example.com"`
      );
    }
  },
  address: (value, name) => {
    const addressRegex = /^[A-Za-z0-9 ,.\-\/'&#@]*$/;
    if (value && !addressRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, numbers, spaces, commas, periods, hyphens, and slashes.`
      );
    }
  },
  city: (value, name) => {
    const cityRegex = /^[a-zA-Z\s\-']+$/;
    if (value && !cityRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, spaces, hyphens, and apostrophes.`
      );
    }
  },
  state: (value, name) => {
    const stateRegex = /^[a-zA-Z\s\-']+$/;
    if (value && !stateRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, spaces, hyphens, and apostrophes.`
      );
    }
  },
  postalCode: (value, name) => {
    const postalCodeRegex = /^[a-zA-Z0-9\s\-]+$/;
    if (value && !postalCodeRegex.test(value)) {
      toast.error(
        `${name} contains invalid characters. Allowed characters: letters, numbers, spaces, and hyphens.`
      );
    }
  },
};

function CreateRequestinvoice() {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [currentState, setCurrentState] = useState("items");
  const [customerdata, setCustomerdata] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const customerdataparam = searchParams.get("customerdata");
  const parsedCustomerdata = JSON.parse(customerdataparam);

  const customername = parsedCustomerdata.customerName;
  const customeremail = parsedCustomerdata.customerEmail;
  const [detailsfields, setDetailsfields] = useState(null);
  const [url, setUrl] = useState("");

  const handleitems = (fields) => {
    setDetailsfields(fields);
    setCurrentState("details"); // Move to the "details" state
  };
  const [sendfields, Setsendfields] = useState();
  const handleGetSendFields = (fields) => {
    Setsendfields(fields);
    setCurrentState("send"); // Move to the "send" state
  };

  const [rows, setRows] = useState([1]);
  const [nextValue, setNextValue] = useState(2);
  const [amounts, setAmounts] = useState({});
  const [itemDetails, setItemDetails] = useState({});

  const [invoicenumber, setInvoicenumber] = useState("");
  const [description, setDescription] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [invoicedate, setInvoicedate] = useState("");
  const [duedate, setDuedate] = useState("");
  const [selectedPaymentAdvice, setSelectedPaymentAdvice] = useState(null);

  const [curr, setCurr] = useState(null);
  const [currLoading, setCurrLoading] = useState(false);
  const [paymentAdviceOptions, setPaymentAdviceOptions] = useState([]);
  const custHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );

  const [items, setItems] = useState([
    {
      slNo: 1,
      description: "",
      quantity: 0,
      price: 0,
      taxName: "",
      tax: 0,
      discountName: "",
      discount: 0,
    },
  ]);

  const handleChange = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.slNo === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((prevItems) => {
      const newSlNo = prevItems.length + 1; // Auto-increment SL No
      return [
        ...prevItems,
        {
          slNo: newSlNo,
          description: "",
          quantity: 0,
          price: 0,
          taxName: "",
          tax: 0,
          discountName: "",
          discount: 0,
        },
      ];
    });
  };

  const removeItem = (slNo) => {
    setItems(
      (prevItems) =>
        prevItems
          .filter((item) => item.slNo !== slNo) // Remove item
          .map((item, index) => ({ ...item, slNo: index + 1 })) // Recalculate SL No
    );
  };

  const calculateAmount = (item) => {
    if (!item.description?.trim()) return 0;
    return Math.max(0, item.quantity * item.price); // Avoid negative amounts
  };

  const calculateTax = (item) => {
    if (!item.description?.trim()) return 0;
    return Math.max(
      0,
      (calculateAmount(item) * parseFloat(item.tax || 0)) / 100
    );
  };

  const calculateDiscount = (item) => {
    if (!item.description?.trim()) return 0;
    return Math.max(
      0,
      (calculateAmount(item) * parseFloat(item.discount || 0)) / 100
    );
  };

  const subtotal = items.reduce((sum, item) => sum + calculateAmount(item), 0);
  const totalTax = items.reduce((sum, item) => sum + calculateTax(item), 0);
  const totalDiscount = items.reduce(
    (sum, item) => sum + calculateDiscount(item),
    0
  );

  const grandTotal = Math.max(0, subtotal + totalTax - totalDiscount);

  const currOptions = [
    {
      value: "SGD",
      label: "Singaporean Dollar (SGD)",
      flagSrc: "/flags/sg.svg",
      currencyCode: "SGD",
    },
    {
      value: "EUR",
      label: "Euro (EUR)",
      flagSrc: "/flags/fr.svg",
      currencyCode: "EUR",
    },
    {
      value: "USD",
      label: "United States Dollar (USB)",
      flagSrc: "/flags/us.svg",
      currencyCode: "USD",
    },
    {
      value: "HKD",
      label: "Hong Kong Dollar (HKD)",
      flagSrc: "/flags/hk.svg",
      currencyCode: "HKD",
    },
    {
      value: "GBP",
      label: "Great Britain Pound (GBP)",
      flagSrc: "/flags/gb.svg",
      currencyCode: "GBP",
    },
    {
      value: "AUD",
      label: "Australian Dollar (AUD)",
      flagSrc: "/flags/au.svg",
      currencyCode: "AUD",
    },
  ];

  const getAccountDetails = async (curr) => {
    try {
      setCurrLoading(true);
      const list = await getActivatedBankAccount(curr, custHashId);

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
          value: item.uniquePaymentId,
          label: `${item.uniquePaymentId} - ${item.accountType} (${item.fullBankName})`,
          flagSrc: flag ? flag.src : "", // Add flag source to each option
          currencyCode: item.currencyCode,
        };
      });

      // Set options for react-select dropdown
      setPaymentAdviceOptions(options);
    } catch (e) {
      console.log(e);
    } finally {
      setCurrLoading(false);
    }
  };

  // useEffect(() => {
  //   getAccountDetails();
  // }, []);

  const [previewData, setPreviewData] = useState(null);

  const validateInvoice = () => {
    if (!invoicenumber?.trim()) return "Invoice number is required.";
    if (!description?.trim()) return "Invoice description is required.";
    if (!curr?.value) return "Please select a payment currency.";
    if (!items.length) return "At least one invoice item is required.";
    if (!selectedPaymentAdvice?.value) return "Please select a payment advice.";
    if (!invoicedate) return "Invoice date is required.";
    if (!duedate) return "Due date is required.";

    // Validate each item in the items array
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.description.trim())
        return `Item ${i + 1}: Description is required.`;
      if (!item.quantity || item.quantity <= 0)
        return `Item ${i + 1}: Quantity must be greater than 0.`;
      if (!item.price || item.price <= 0)
        return `Item ${i + 1}: Price must be greater than 0.`;
    }
    return null; // No errors
  };

  const createInvoice = async () => {
    try {
      setLoading(true);

      // Perform validation
      const validationError = validateInvoice();
      if (validationError) {
        toast.error(validationError);
        return;
      }

      const updatedItems = items.map((item) => ({
        ...item,
        amount: item.quantity * item.price, // Ensure amount is explicitly calculated
        currency: curr?.value || "",
      }));

      const requestBody = {
        itemDetails: updatedItems,
        Invoicenumber: invoicenumber,
        Description: description,
        Createdby: sessionStorage.getItem("lastemail"),
        RecipientName: parsedCustomerdata.customerName,
        CompanyId: sessionStorage.getItem("internalBusinessId"),
        filename: `${invoicenumber}.pdf`,
        header: "Invoice",
        template: "Invoice",
        returntype: "url",
        address1: parsedCustomerdata.address1,
        address2: parsedCustomerdata.address2,
        invoiceDate: invoicedate,
        dueDate: duedate,
        customeremail: parsedCustomerdata.customerEmail,
        paymentadvice: selectedPaymentAdvice?.value,
        currency: curr?.value || "",
      };

      console.log("Request Body:", requestBody);

      let response = await dispatch(
        CreateInvoiceDoc({ invoiceData: requestBody, setPreviewData })
      );

      if (response?.statusCode !== 200) {
        toast.error(
          response?.message || "Failed to generate invoice document."
        );
        return;
      }

      setPreviewData(response);

      const createInvoiceBody = {
        id: invoicenumber,
        customerEmail: parsedCustomerdata.customerEmail,
        customerName: parsedCustomerdata.customerName,
        date: invoicedate,
        companyId: sessionStorage.getItem("internalBusinessId"),
        dueDate: duedate,
        description,
        imgUrl: response?.url || "",
        createdBy: sessionStorage.getItem("lastemail"),
        itemDetails: updatedItems,
      };

      console.log("Create Invoice Body:", createInvoiceBody);

      let createInvoiceResponse = await dispatch(
        CreateInvoice({ createInvoiceBody })
      );

      if (!createInvoiceResponse || createInvoiceResponse.length === 0) {
        toast.error("Something went wrong.");
        return;
      }

      const { status, statusText, message } = createInvoiceResponse;

      if (statusText === "Internal Server Error") {
        toast.error("Internal Server Error");
        return;
      }

      if (status === "BAD_REQUEST") {
        toast.error(message);
        return;
      }

      if (sessionStorage.getItem("xeroContactId")) {
        await xeroCreateInvoice(
          sessionStorage.getItem("xeroContactId"),
          response.config?.params,
          sessionStorage.getItem("tenantId")
        );
      }

      toast.success(message);
    } catch (e) {
      console.error("Error creating invoice:", e);
      toast.error(
        "Something went wrong while creating your invoice, please try again later!"
      );
    } finally {
      setLoading(false);
    }
  };

  const viewInvoice = async () => {
    previewData?.url && window.open(previewData?.url, "_blank");
  };

  const [show, setShow] = useState(false);
  const handleCloseModal = () => {
    setShow(false);
  };

  const sendInvoiceAsEmail = async () => {
    try {
      setLoading(true);
    } catch (e) {
      toast.error(
        "Something went wrong while creating your invoice, please try again later!"
      );
      console.log(e);
    } finally {
      setLoading(false);
    }
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
            backurl: "/expense/invoices",
            name: "Create New Invoice",
            info: true,
            img: "/arrows/arrowLeft.svg",
          }}
        />

        <div className="d-flex justify-content-end align-items-center gap-3 p-4">
          {previewData && (
            <IconButton
              onClick={viewInvoice}
              className={"bg-white text-dark border rounded-1"}
              loading={isLoading}
            >
              <VisibilityOutlined />
            </IconButton>
          )}
          {!previewData && (
            <Button
              variant="contained"
              className={"px-4 py-2"}
              loading={isLoading}
              loadingPosition="center"
              endIcon={<EditNote />}
              disabled={isLoading}
              onClick={createInvoice}
              color="primary"
            >
              {`Create Invoice`}
            </Button>
          )}

          {previewData && (
            <Button
              variant="outlined"
              loading={isLoading}
              loadingPosition="center"
              endIcon={<EmailOutlined />}
              disabled={isLoading}
              onClick={() => setShow(true)}
              className={"px-4 py-2"}
            >
              {`Email Invoice`}
            </Button>
          )}
        </div>

        <div className="d-flex align-items-start justify-content-between gap-3 px-4">
          <Card className="p-4" sx={{ width: "90%" }}>
            <h4>New Invoice</h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1rem 2rem",
                padding: "1rem 0",
              }}
            >
              <CustomInput
                maxLength={50}
                label="Invoice Number"
                name="Invoice Number"
                value={invoicenumber}
                onInput={(e) => {
                  restrictions.restrictInputDocumentNo(e);
                  setInvoicenumber(e.target.value);
                }}
                onBlur={(e) =>
                  validations.alphanumeric(e.target.value, e.target.name)
                }
                className="custom-input-class full-width"
                required
              />

              <CustomInput
                maxLength={100}
                label="Invoice Description"
                name="Invoice Description"
                value={description}
                onInput={(e) => {
                  setDescription(e.target.value);
                }}
                onBlur={(e) =>
                  validations.alphanumeric(e.target.value, e.target.name)
                }
                className="custom-input-class full-width"
                required
              />

              <CustomInput
                maxLength={100}
                label="P.O/S.O. Number (Optional)"
                name="P.O/S.O. Number"
                value={orderNumber}
                onInput={(e) => {
                  restrictions.restrictInputDocumentNo(e);
                  setOrderNumber(e.target.value);
                }}
                onBlur={(e) =>
                  validations.alphanumeric(e.target.value, e.target.name)
                }
                className="custom-input-class full-width"
              />

              <CustomSelect
                id="paymentMethod"
                label="Payment Currency"
                className="custom-select-class full-width"
                value={curr}
                onChange={(selected) => {
                  setCurr(selected);
                  getAccountDetails(selected.value);
                }}
                options={currOptions}
                required
              />
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Items</th>
                    <th>QTY</th>
                    <th>Cost/Tax/Discount (%)</th>
                    <th className="text-end">Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <>
                      <tr key={item.slNo}>
                        <td style={{ width: "45%" }}>
                          <CustomInput
                            maxLength={100}
                            placeholder="Description"
                            name="Item Name"
                            value={item.description}
                            onInput={(e) => {
                              handleChange(
                                item.slNo,
                                "description",
                                e.target.value
                              );
                            }}
                            onBlur={(e) =>
                              validations.alphanumeric(
                                e.target.value,
                                e.target.name
                              )
                            }
                            className="custom-input-class full-width"
                          />
                        </td>
                        <td>
                          <CustomInput
                            maxLength={100}
                            placeholder="Quantity"
                            name="Item Name"
                            value={item.quantity}
                            onInput={(e) => {
                              restrictions.restrictInputNumber(e);
                              handleChange(
                                item.slNo,
                                "quantity",
                                Number(e.target.value)
                              );
                            }}
                            onBlur={(e) =>
                              validations.alphanumeric(
                                e.target.value,
                                e.target.name
                              )
                            }
                            className="custom-input-class full-width"
                          />
                        </td>
                        <td>
                          <CustomInput
                            maxLength={10}
                            placeholder="Cost"
                            name="Item Cost"
                            value={item.price}
                            onInput={(e) => {
                              restrictions.restrictInputAmount(e);
                              handleChange(
                                item.slNo,
                                "price",
                                Number(e.target.value)
                              );
                            }}
                            onBlur={(e) =>
                              validations.numeric(e.target.value, e.target.name)
                            }
                            className="custom-input-class full-width"
                          />
                        </td>
                        <td className="text-end">
                          <label>{calculateAmount(item).toFixed(2)}</label>
                        </td>

                        {items.length > 1 && (
                          <td rowSpan={3}>
                            <IconButton
                              className="delete-btn px-auto text-danger"
                              onClick={() => removeItem(item.slNo)}
                            >
                              <Delete />
                            </IconButton>
                          </td>
                        )}
                      </tr>

                      <tr>
                        <td className="text-end">Tax</td>
                        <td>
                          <CustomInput
                            maxLength={100}
                            placeholder="Tax Name"
                            name="Item Tax"
                            value={item.taxName}
                            onInput={(e) => {
                              handleChange(
                                item.slNo,
                                "taxName",
                                e.target.value
                              );
                            }}
                            onBlur={(e) =>
                              validations.alphanumeric(
                                e.target.value,
                                e.target.name
                              )
                            }
                            className="custom-input-class full-width"
                          />
                        </td>
                        <td>
                          <CustomInput
                            maxLength={10}
                            placeholder="Tax"
                            name="Item Tax"
                            value={item.tax}
                            onInput={(e) => {
                              restrictions.restrictInputAmount(e);

                              let inputValue = Number(e.target.value);
                              if (inputValue > 99) inputValue = 99; // Prevent entering more than 99%

                              handleChange(item.slNo, "tax", inputValue);
                            }}
                            onBlur={(e) =>
                              validations.numeric(e.target.value, e.target.name)
                            }
                            className="custom-input-class full-width"
                          />
                        </td>
                        <td className="text-end">
                          {" "}
                          <div>{calculateTax(item).toFixed(2)}</div>
                        </td>
                      </tr>

                      <tr>
                        <td className="text-end">Discount</td>
                        <td>
                          <CustomInput
                            maxLength={100}
                            placeholder="Discount Name"
                            name="Item Discount"
                            value={item.discountName}
                            onInput={(e) => {
                              handleChange(
                                item.slNo,
                                "discountName",
                                e.target.value
                              );
                            }}
                            onBlur={(e) =>
                              validations.alphanumeric(
                                e.target.value,
                                e.target.name
                              )
                            }
                            className="custom-input-class full-width"
                          />
                        </td>
                        <td>
                          <CustomInput
                            maxLength={10}
                            placeholder="Discount"
                            name="Item Discount"
                            value={item.discount}
                            onInput={(e) => {
                              restrictions.restrictInputAmount(e);
                              let inputValue = Number(e.target.value);
                              if (inputValue > 99) inputValue = 99; // Prevent entering more than 99%

                              handleChange(item.slNo, "discount", inputValue);
                            }}
                            onBlur={(e) =>
                              validations.numeric(e.target.value, e.target.name)
                            }
                            className="custom-input-class full-width"
                          />
                        </td>
                        <td className="text-end">
                          {" "}
                          <div>{calculateDiscount(item).toFixed(2)}</div>
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={6}>
                          <Divider />
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
              <div
                onClick={addItem}
                className="text-primary d-flex align-items-center gap-1 px-3 py-4"
                style={{ cursor: "pointer" }}
              >
                <AddCircleOutline /> <p className="mb-0">Add item</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <h4>Invoice Information & Payments</h4>

            <div className="d-flex flex-column gap-3 pt-3">
              <CustomInput
                maxLength={100}
                label="Send To"
                name="Send To"
                value={`${customername} (${customeremail})`}
                className="custom-input-class full-width"
                disabled
                required
              />

              <CustomSelect
                id="paymentMethod"
                label="Payment Method"
                className="custom-select-class full-width"
                value={selectedPaymentAdvice}
                onChange={setSelectedPaymentAdvice}
                options={paymentAdviceOptions}
                required
                isLoading={currLoading}
              />

              <div className="d-flex align-items-center justify-content-between gap-3">
                <CustomDatepickerGeneral
                  selectedDate={invoicedate}
                  onDateChange={setInvoicedate}
                  label="Invoice Date"
                  helperText={``}
                  required
                />

                <CustomDatepickerGeneral
                  selectedDate={duedate}
                  onDateChange={setDuedate}
                  label="Due Date"
                  helperText={``}
                  required
                />
              </div>
            </div>

            <Divider className="my-4" />

            <div>
              <div className="d-flex align-items-center justify-content-between">
                <p className="text-secondary">Subtotal:</p>
                <p className="text-secondary fs-6 fw-bold">
                  {subtotal.toFixed(2)} {curr && curr.value}
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <p className="text-secondary">Tax:</p>
                <p className="text-danger fs-6 fw-bold">
                  + {totalTax.toFixed(2)} {curr && curr.value}
                </p>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <p className="text-secondary">Discount:</p>
                <p className="text-success fs-6 fw-bold">
                  - {totalDiscount.toFixed(2)} {curr && curr.value}
                </p>
              </div>

              <Divider className="my-2" />
              <div className="d-flex align-items-center justify-content-between">
                <p className="text-secondary">Total:</p>
                <p className="text-primary fs-6 fw-bold">
                  {grandTotal.toFixed(2)} {curr && curr.value}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <CustomModal
        isOpen={show}
        handleClose={handleCloseModal}
        children={
          <Review
            pdfUrl={previewData?.url || ""}
            handleClose={handleCloseModal}
            senderEmail={customeremail}
          />
        }
        headerText={`Send Invoice as Email`}
        height={"auto"}
      />
    </div>
  );
}

export default CreateRequestinvoice;
