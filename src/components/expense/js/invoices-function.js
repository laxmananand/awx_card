import Axios from "axios";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { json } from "react-router-dom";
import jsPDF from "jspdf";
import { blue } from "@mui/material/colors";

Axios.defaults.withCredentials = true;

// const [tableData,setTableData]=useState('');
export const listinvoices = async (fromDate, toDate) => {
  // Convert fromDate and toDate to Date objects
  const fromDateObj = new Date(fromDate);
  const toDateObj = new Date(toDate);

  // Convert Date objects to yyyy-mm-dd format
  const formattedFromDate = fromDateObj.toISOString().split("T")[0] || null;
  const formattedToDate = toDateObj.toISOString().split("T")[0] || null;

  console.log(formattedFromDate); // Output: "2024-01-10"
  var company = sessionStorage.getItem("internalBusinessId");
  try {
    // Make API call to fetch invoices
    const response = await Axios.get(
      sessionStorage.getItem("baseUrl") + "/expense/listinvoices",
      {
        params: {
          companyId: company,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
        },
      }
    );

    if (response.status === 200 && response.data) {
      return response;
    } else if (response.data.status === "NOT_FOUND") {
      return response;
    } else if (response.data.status === "BAD_REQUEST") {
      return response;
    } else {
      console.log("No Invoice found or Internal Server Error!");
      toast.error("Something went Wrong");
      return null;
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
    toast.error("Error fetching invoices");
    return null;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const Createinvoice = async (
  sendfields,
  setCurrentState,
  parsedCustomerdata
) => {
  var id = sendfields.Invoicenumber;
  var companyId = sendfields.CompanyId;
  var date = formatDate(sendfields.invoiceDate);
  var dueDate = formatDate(sendfields.dueDate);
  var description = sendfields.Description;
  var imgUrl = sessionStorage.getItem("pdfURL");
  var createdBy = sessionStorage.getItem("lastemail");
  var customerName = sendfields.customername;
  var customerEmail = parsedCustomerdata.customerEmail;
  var itemDetails = [];
  for (const item of sendfields.items) {
    itemDetails.push(item);
  }
  //var itemDetails=[sendfields.items]
  console.log(itemDetails);

  const response = await Axios.get(
    sessionStorage.getItem("baseUrl") + "/expense/createinvoice",
    {
      params: {
        id: id,
        customerEmail: customerEmail,
        customerName: customerName,
        date: date,
        companyId: companyId,
        dueDate: dueDate,
        description: description,
        imgUrl: imgUrl,
        createdBy: createdBy,
        itemDetails: itemDetails,
      },
    }
  );
  let obj = response.data;

  //let parseddata=JSON.parse(obj);
  console.log(obj);

  if (obj.length == 0) {
    toast.error("Something went wrong");
  }
  if (obj.statusText == "Internal Server Error") {
    toast.error("Internal Server Error");
  }
  if (obj.status == "BAD_REQUEST") {
    toast.error(obj.message);
  } else {
    console.log(obj);
    if (sessionStorage.getItem("xeroContactId")) {
      await xeroCreateInvoice(
        sessionStorage.getItem("xeroContactId"),
        response.config.params,
        sessionStorage.getItem("tenantId")
      );
    }
    toast.success(obj.message);
    setCurrentState("send");
  }

  return obj;
};

export const Createinvoicedoc = async (itemsArrayLength) => {
  var id = itemsArrayLength.Invoicenumber;
  var companyId = itemsArrayLength.CompanyId;
  var date = itemsArrayLength.invoiceDate;
  var dueDate = itemsArrayLength.dueDate;
  var description = itemsArrayLength.Description;
  var imgUrl = itemsArrayLength.Imageurl;
  var createdBy = sessionStorage.getItem("lastemail");
  var customerName = itemsArrayLength.RecipientName;
  var customerEmail = itemsArrayLength.customeremail;
  var itemDetails = itemsArrayLength.items;
  var filename = id + ".pdf";
  var address1 = itemsArrayLength.address1;
  var address2 = itemsArrayLength.address2;
  var paymentadvice = itemsArrayLength.paymentadvice;
  console.log(paymentadvice);
  console.log(itemsArrayLength);
  const dataToSend = {
    id: id,
    companyId: companyId,
    date: date,
    dueDate: dueDate,
    description: description,
    imgUrl: "abcd",
    createdBy: createdBy,
    customerName: customerName,
    customerEmail: customerEmail,
    items: itemDetails,
    filename: filename,
    template: "Invoice",
    return: "url",
    header: "Stylopay Invoice",
    address1: address1,
    address2: address2,
  };

  const doc = new jsPDF();
  // Create the header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  doc.text(10, 10, "Stylopay Invoice");

  // Create customer information
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(10, 20, customerName);
  doc.text(10, 25, customerEmail);
  doc.text(10, 30, address1);
  doc.text(10, 35, address2);

  // Create invoice information
  doc.setFont("helvetica", "bold");
  doc.text(70, 20, "Invoice No:");
  doc.setFont("helvetica", "normal");
  doc.text(70, 25, id);
  doc.setFont("helvetica", "bold");
  doc.text(70, 30, "Due Date:");
  doc.setFont("helvetica", "normal");
  doc.text(70, 35, dueDate);
  doc.setFont("helvetica", "bold");
  doc.text(70, 40, "Created By");
  doc.setFont("helvetica", "normal");
  doc.text(70, 45, createdBy);
  doc.text(115, 20, "Stylopay Private Limited");
  doc.text(115, 25, address1);
  doc.text(115, 30, address2);

  // Create the table
  const tableData = [];
  const columns = [
    "Sl No",
    "Description",
    "Quantity",
    "Price",
    "Currency",
    "Tax",
    "Discount",
    "Amount",
    "Tax Amount",
  ];

  // Add the header row
  tableData.push(columns);

  // Add item rows
  const items = itemsArrayLength.items;
  let totalTaxAmount = 0.0;

  items.forEach((item) => {
    const taxAmount = (parseFloat(item.amount) * parseFloat(item.tax)) / 100;
    tableData.push([
      item.slNo || "",
      item.description || "",
      item.quantity || "",
      item.price || 0,
      item.currency || "",
      item.tax || 0,
      item.discount || 0,
      item.amount || 0,
      (parseFloat(item.tax) / 100) * parseFloat(item.amount) || "",
    ]);
    totalTaxAmount += taxAmount;
  });

  doc.autoTable({
    startY: 75,
    head: [columns],
    body: tableData.slice(1),
  });

  // Calculate total values
  const totalAmount = items.reduce(
    (acc, item) => acc + parseFloat(item.amount),
    0
  );

  const totalDiscount = items.reduce(
    (acc, item) =>
      acc + (parseFloat(item.discount) / 100) * parseFloat(item.amount),
    0
  );

  const totalTaxamount = items.reduce(
    (acc, item) => acc + (parseFloat(item.tax) / 100) * parseFloat(item.amount),
    0
  );

  const currency = items[0].currency || "";
  const totalDiscountAmount = (totalDiscount / 100) * totalAmount;
  const amountPayable = totalAmount - totalDiscount + totalTaxamount;

  // Display total values
  doc.text(
    110,
    150,
    "Total Amount: " + totalAmount.toFixed(2) + " " + currency
  );
  doc.text(110, 155, "Total Discount: " + totalDiscount.toFixed(2));
  doc.text(110, 160, "Total Tax: " + totalTaxAmount.toFixed(2));
  doc.setLineWidth(2); // Set a thinner line width for the dotted line
  //doc.setDrawColor(blue);
  doc.setLineWidth(0.5); // Set a thinner line width for the dotted line
  doc.setDrawColor(0);
  doc.line(110, 165, 180, 165);
  doc.text(
    110,
    170,
    "Amount Payable: " + amountPayable.toFixed(2) + " " + currency
  );
  // Draw a dotted line
  doc.setLineWidth(0.5); // Set a thinner line width for the dotted line
  doc.setDrawColor(0); // Set the draw color to black

  const startX = 10;
  const endX = 190;
  const y = 174;
  const step = 4; // Adjust this value to change the spacing of the dots

  for (let x = startX; x < endX; x += step) {
    doc.line(x, y, x + 2, y); // Draw short line segments to create a dotted line
  }
  const scissor_x = 10;
  const scissor_y = 174;
  const scissor_size = 2;
  doc.line(
    scissor_x - scissor_size,
    scissor_y - scissor_size,
    scissor_x + scissor_size,
    scissor_y + scissor_size
  );
  doc.line(
    scissor_x - scissor_size,
    scissor_y + scissor_size,
    scissor_x + scissor_size,
    scissor_y - scissor_size
  );

  doc.setFontSize(12); // Adjust the font size for the "Payment Advisory" text
  doc.setFont("helvetica", "bold");
  doc.text(10, 190, "Payment Advisory");
  doc.setFont("helvetica", "normal");
  doc.text(10, 200, "Payment Id " + paymentadvice.uniquePaymentId);
  doc.text(10, 205, "Bank Name:" + paymentadvice.fullBankName);
  doc.text(10, 210, "Account Name: " + paymentadvice.accountName);
  doc.text(10, 215, "Routing Code Type : " + paymentadvice.routingCodeType1);
  doc.text(10, 220, "Routing Code Value : " + paymentadvice.routingCodeValue1);
  doc.setFont("helvetica", "bold");
  doc.text(110, 205, "Customer :");
  doc.text(110, 210, "Invoice No :");
  doc.line(110, 215, 200, 215);
  doc.text(110, 220, "Amount Due:");
  doc.text(110, 225, "Due On :");
  doc.line(110, 230, 200, 230);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(140, 205, customerName);
  doc.text(140, 210, id);
  doc.text(140, 220, amountPayable.toFixed(2));
  doc.text(140, 225, dueDate);

  const blob = doc.output("blob");
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1]; // Extract the base64 data
      //resolve(base64Data);

      // Prepare the data to send to the uploadtos3 API
      const selectedFileName = filename; // Provide a filename
      const uploadData = {
        filename: selectedFileName,
        file: base64Data,
      };
      try {
        // Call the uploadtos3 API to upload the file
        const uploadResponse = await Axios.post(
          sessionStorage.getItem("baseUrl") + "/expense/uploadtos3",
          uploadData
        );
        let obj = uploadResponse.data;
        console.log(obj);

        // Handle the result of the upload

        if (obj.hasOwnProperty("url")) {
          toast.success("Invoice Document has been built");
          doc.save(filename);
          //setUrl(bodyObj.url);
          resolve(obj.url);
        } else {
          doc.save(filename);
          resolve(
            "https://stylopay-sandbox-ohio-dev-dump-public.s3.amazonaws.com/Testinf-Invoice.pdf"
          );
          console.error(
            "Error uploading the file to S3:",
            uploadResponse.data.response
          );
        }
      } catch (uploadError) {
        console.error("Error uploading the file to S3:", uploadError);
        doc.save(filename);
        resolve(
          "https://stylopay-sandbox-ohio-dev-dump-public.s3.amazonaws.com/Testinf-Invoice.pdf"
        );
        toast.error(uploadError);
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
};

export const listcustomers = async () => {
  var company = sessionStorage.getItem("internalBusinessId");
  const response = await Axios.get(
    sessionStorage.getItem("baseUrl") + "/expense/listcustomers",
    {
      params: {
        companyId: company,
      },
    }
  );
  let obj = response.data;

  //let obj2 = obj.result;
  //let parseddata=JSON.parse(obj);
  console.log(obj);

  if (obj.length == 0) {
    console.log("No Customer found!");
  }
  if (obj.statusText == "Internal Server Error") {
    console.log("Internal Server Error");
  } else {
    console.log(obj);
  }

  return obj;
};
export const Createcustomerapi = async (updatedFields) => {
  var customerEmail = updatedFields.Customeremail;
  var customerName = updatedFields.Customername;
  var companyId = updatedFields.Companyid;
  var address1 = updatedFields.Address1;
  var address2 = updatedFields.Address2;
  var address3 = updatedFields.Address3;
  var address4 = updatedFields.Address4;

  const response = await Axios.get(
    sessionStorage.getItem("baseUrl") + "/expense/createcustomer",
    {
      params: {
        customerEmail: customerEmail,
        customerName: customerName,
        address1: address1,
        companyId: companyId,
        address2: address2,
        address3: address3,
        address4: address4,
      },
    }
  );
  let obj = response.data;

  // let parseddata = JSON.parse(obj);
  console.log(obj);

  if (obj.length == 0) {
    toast.error("Something went wrong");
  }
  if (obj.statusText == "Internal Server Error") {
    toast.error("Internal Server Error");
  }
  if (obj.status == "BAD_REQUEST") {
    toast.error(obj.message);
  } else {
    console.log(obj);
    if (sessionStorage.getItem("accessToken")) {
      await XeroGetTenantId(
        sessionStorage.getItem("accessToken"),
        updatedFields
      );
    }
    toast.success(obj.message);
  }

  return obj;
};

export const getActivatedBankAccount = async (currencyCode, custHashId) => {
  debugger;
  if (custHashId == "" || custHashId == null) {
    return [];
  } else {
    try {
      const response = await Axios.get(
        sessionStorage.getItem("baseUrl") + "/expense/fetchAccountDetails",
        {
          params: {
            currencyCode: currencyCode,
            custHashId: custHashId,
          },
        }
      );
      const filterData = response.data;
      var filter = filterData.content;
      if (filter.length != 0) {
        console.log(filter);
        return filter;
      } else if (filterData && filterData.length == 0) {
        toast.error("No account available!");
      } else {
        toast.error(filterData.message);
      }
    } catch (error) {
      toast.error("Something went wrong, try again later!");
    }
  }
};

export const xeroConnectionAccessToken = async (code) => {
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/xero/xero-connection",
      {
        code: code,
        redirectUriXeroCode: window.location.origin,
      }
    );
    if (response.status === 200 && response.data.access_token) {
      sessionStorage.setItem("accessToken", response.data.access_token);
      toast.success("Connected to xero successfully!");
    } else {
      toast.error("Failed to connect with xero!");
    }
  } catch (error) {
    toast.error("Failed to connect with xero!");
    console.error("Error exchanging code for token:", error);
  }
};

export const connectToXeroCode = async () => {
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/xero/xero-connection-code",
      {
        redirectUriXeroCode: window.location.origin,
      }
    );

    window.open(response.data.redirectUrl, "_blank");
  } catch (error) {
    toast.error("Failed to connect with xero!");
    console.error("Error:", error);
  }
};

export const XeroGetTenantId = async (accessToken, updatedFields) => {
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/xero/xero-connection-tenantId",
      {
        accessToken: accessToken,
      }
    );
    if (response.status === 200 && response.data.length > 0) {
      const firstObject = response.data[0];
      sessionStorage.setItem("tenantId", firstObject.tenantId);
      //call create customer xero
      if (sessionStorage.getItem("tenantId")) {
        await XeroCreateCustomer(
          sessionStorage.getItem("tenantId"),
          updatedFields,
          accessToken
        );
      }
    } else {
      toast.error("Failed to create customer!");
    }
  } catch (error) {
    toast.error("Failed to create customer!");
    console.error("Error while getting tenantId:", error);
  }
};

export const XeroCreateCustomer = async (
  tenantId,
  updatedFields,
  accessToken
) => {
  try {
    var customerEmail = updatedFields.Customeremail;
    var customerName = updatedFields.Customername;
    const spaceIndex = customerName.indexOf(" ");
    var firstName, lastName;
    if (spaceIndex !== -1) {
      firstName = customerName.substring(0, spaceIndex);
      lastName = customerName.substring(spaceIndex + 1);
    } else {
      firstName = customerName;
      lastName = "";
    }
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/xero/createcustomer",
      {
        params: {
          customerEmail: customerEmail,
          customerName: customerName,
          firstName: firstName,
          lastName: lastName,
          tenantId: tenantId,
          accessToken: accessToken,
        },
      }
    );
    if (response.status === 200 && response.data.Contacts.length > 0) {
      const firstObject = response.data.Contacts[0];
      sessionStorage.setItem("xeroContactId", firstObject.ContactID);
    } else {
      toast.error("Failed to create customer!");
    }
  } catch (error) {
    toast.error("Failed to create customer!");
    console.error("Error while creating customer at xero end:", error);
  }
};

export const xeroCreateInvoice = async (
  xeroContactId,
  updatedFields,
  tenantId
) => {
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/xero/createInvoice",
      {
        updatedFields: updatedFields,
        xeroContactId: xeroContactId,
        accessToken: sessionStorage.getItem("accessToken"),
        tenantId: tenantId,
      }
    );
    if (response.status === 200 && response.data.Id) {
      console.log("Invoice created successfully!");
    } else {
      toast.error("Failed to create invoice!");
    }
  } catch (error) {
    toast.error("Failed to create invoice!");
    console.error("Error while creating invoice at  xero end:", error);
  }
};

export const xeroGetTenantId = async (customerdata) => {
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/xero/xero-connection-tenantId",
      {
        accessToken: sessionStorage.getItem("accessToken"),
      }
    );
    if (response.status === 200 && response.data.length > 0) {
      const firstObject = response.data[0];
      sessionStorage.setItem("tenantId", firstObject.tenantId);
      //call create customer xero
      if (sessionStorage.getItem("tenantId")) {
        await xeroGetCustomerId(
          sessionStorage.getItem("tenantId"),
          customerdata
        );
      }
    } else {
      toast.error("Failed to create customer!");
    }
  } catch (error) {
    toast.error("Failed to create customer!");
    console.error("Error while getting tenantId:", error);
  }
};

export const xeroGetCustomerId = async (tenantId, customerdata) => {
  try {
    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/xero/getCustomer",
      {
        code: sessionStorage.getItem("accessToken"),
        name: customerdata.customerName,
        tenantId: tenantId,
      }
    );
    if (response.status === 200 && response.data.Contacts.length > 0) {
      const firstObject = response.data.Contacts[0];
      sessionStorage.setItem("xeroContactId", firstObject.ContactID);
    } else {
      await xeroCreateCustomerEnd(customerdata);
    }
  } catch (error) {
    toast.error("Failed to create customer!");
    console.error("Error while getting tenantId:", error);
  }
};

export const xeroCreateCustomerEnd = async (customerData) => {
  try {
    var customerName = customerData.customerName;
    const spaceIndex = customerName.indexOf(" ");
    var firstName, lastName;
    if (spaceIndex !== -1) {
      firstName = customerName.substring(0, spaceIndex);
      lastName = customerName.substring(spaceIndex + 1);
    } else {
      firstName = customerName;
      lastName = "";
    }

    const response = await Axios.post(
      sessionStorage.getItem("baseUrl") + "/xero/xeroCreateCustomerEnd",
      {
        code: sessionStorage.getItem("accessToken"),
        email: customerData.customerEmail,
        firstName: firstName,
        lastName: lastName,
        name: customerData.customerName,
        tenantId: sessionStorage.getItem("tenantId"),
      }
    );
    if (response.status === 200 && response.data.Contacts.length > 0) {
      const firstObject = response.data.Contacts[0];
      sessionStorage.setItem("xeroContactId", firstObject.ContactID);
    } else {
      toast.error("Failed to create customer!");
    }
  } catch (error) {
    toast.error("Failed to create customer!");
    console.error("Error while creating customer at xero end:", error);
  }
};

async function convertFileToBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // Base64 string
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching and converting file to base64:", error);
    throw error;
  }
}

export const sendInvoice = async (updatedFields) => {
  const { to, pdf_filename, plain_text_content, subject, pdf_content } =
    updatedFields;

  try {
    const response = await Axios.post(
      `${sessionStorage.getItem("baseUrl")}/expense/sendInvoice`,
      {
        to,
        pdf_content,
        pdf_filename,
        plain_text_content,
        subject,
      }
    );
    const obj = response.data;

    if (!obj || obj.statusText === "Internal Server Error") {
      toast.error("Internal Server Error");
    } else if (obj.status === "BAD_REQUEST") {
      toast.error(obj.message);
    } else {
      return obj;
    }
  } catch (error) {
    console.error("Error sending invoice:", error);
    toast.error("Something went wrong while sending the invoice.");
  }
};
