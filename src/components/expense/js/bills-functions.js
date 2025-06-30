import Axios from "axios";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { json } from "react-router-dom";
Axios.defaults.withCredentials = true;

export const listBills = async (fromDate, toDate) => {
  try {
    const data = await callNodeAPI(fromDate, toDate);
    return data;
  } catch (error) {
    // Handle errors
  }
};

const callNodeAPI = async (fromDate, toDate) => {

  // Convert fromDate and toDate to Date objects
  const fromDateObj = new Date(fromDate);
  const toDateObj = new Date(toDate);
  
  // Convert Date objects to yyyy-mm-dd format
  const formattedFromDate = fromDateObj.toISOString().split("T")[0] || null;
  const formattedToDate = toDateObj.toISOString().split("T")[0] || null;
  
  console.log("bills" + formattedFromDate); // Output: "2024-01-10"
  
  var company = sessionStorage.getItem("internalBusinessId");
  try {
  const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/expense/listbills", {
    params: {
      companyId: company,
      fromDate: formattedFromDate,
      toDate: formattedToDate,
    },
  });

  let obj = response.data;

  //let parseddata=JSON.parse(obj);
  console.log(obj);

  if (response.status === 200 && response.data) {
    return response;
  } else if (response.data.status === "NOT_FOUND") {
    return response;
  } else if (response.data.status === "BAD_REQUEST") {
    return response;
  } else {
    console.log("No bill found or Internal Server Error!");
    toast.error("Something went Wrong");
    return null;
  }
} catch (error) {
  console.error("Error fetching bills:", error);
  toast.error("Error fetching bills");
  return null;
}};

export const docanalysis = async (selectedFileName) => {
  console.log(selectedFileName);
  var objectkey = selectedFileName;

  const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/expense/docanalysis", {
    params: {
      objectKey: objectkey,
    },
  });
  console.log(response);

  let obj = response.data;
  let jsonString;
  if (typeof obj !== "string") {
    // Only stringify obj if it's not already a string
    jsonString = JSON.stringify(obj);
  } else {
    jsonString = obj; // obj is already a string, no need to stringify
  }
  const fixedJsonString = jsonString.replace(/NaN/g, "null");
  const jsonObject = JSON.parse(fixedJsonString);

  const queryResults = jsonObject.query_results;
  console.log(queryResults);

  // Check and handle NaN cases
  const address = isNaN(queryResults.Address) ? null : queryResults.Address;
  const dueDate = isNaN(queryResults.dueDate) ? null : queryResults.dueDate;
  const invoiceDate = isNaN(queryResults.InvoiceDate) ? null : queryResults.InvoiceDate;

  console.log({ address, dueDate, invoiceDate });

  return queryResults; // Return the obj
};
export const createbill = async (reviewFields) => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  var id = reviewFields.Billnumber;
  var companyId = reviewFields.CompanyId;
  var date = formatDate(reviewFields.Billdate);
  var dueDate = formatDate(reviewFields.Duedate);
  var amount = reviewFields.TotalAmount;
  var currency = reviewFields.currency;
  var description = reviewFields.Description;
  var imgUrl = reviewFields.Imageurl;
  var createdBy = reviewFields.Createdby;
  var sourceOfFund = reviewFields.SourceofFunds;
  var recipientName = reviewFields.RecipientName;
  var recipientAccountNumber = reviewFields.RecipientAccountNumber;

  const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/expense/createbill", {
    params: {
      id: id,
      companyId: companyId,
      date: date,
      dueDate: dueDate,
      amount: amount,
      currency: currency,
      description: description,
      imgUrl: imgUrl,
      createdBy: createdBy,
      sourceOfFund: sourceOfFund,
      recipientName: recipientName,
      recipientAccountnumber: recipientAccountNumber,
    },
  });
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
    if (sessionStorage.getItem("accessToken")) {
      await XeroGetTenantId(sessionStorage.getItem("accessToken"), reviewFields);
    }
    toast.success(obj.message);
  }

  return obj;
};


export const uploadtos3 = async (selectedFileName, base64EncodedFile) => {
  console.log(base64EncodedFile);
  var file = base64EncodedFile;
  const dataToSend = {
    filename: selectedFileName,
    file: base64EncodedFile,
  };
  console.log(dataToSend);

  const response = await Axios.post(sessionStorage.getItem("baseUrl") + "/expense/uploadtos3", dataToSend);
  let obj = response.data;

  //let parseddata=JSON.parse(obj);
  console.log(obj);

  if (obj.length == 0) {
    //toast.error('Something went wrong')
    return "https://stylopay-sandbox-ohio-dev-dump-public.s3.amazonaws.com/OD126075829427635000%20(1).pdf";
  }
  if (obj.statusText == "Internal Server Error") {
    toast.error("Internal Server Error");
  }
  if (obj.status == "BAD_REQUEST") {
    toast.error(obj.message);
  }
  if (obj.hasOwnProperty("message")) {
    toast.error(obj.message);
    return obj;
  }
  if (obj.hasOwnProperty("url")) {
    return obj.url;
  } else {
    return "https://stylopay-sandbox-ohio-dev-dump-public.s3.amazonaws.com/OD126075829427635000%20(1).pdf";
  }
};

export const fetchwallets = async (currencyCode, custHashId) => {

  if (custHashId == "" || custHashId == null) {
    return [];
  } else {
    try {
      const response = await Axios.get(sessionStorage.getItem("baseUrl") + "/expense/fetchbalances", {
        params: {
          currencyCode: currencyCode,
          custHashId: custHashId,
        },
      });
      var filter = response.data;
      // var filter = filterData.content;
      if (filter.length != 0) {
        console.log(filter);
        return filter;
      } else if (filterData && filterData.length == 0) {
        toast.error("No Wallet available!");
      } else {
        toast.error(filterData.message);
      }
    } catch (error) {
      toast.error("Something went wrong, try again later!");
    }
  }
};

export const XeroGetTenantId = async (accessToken, updatedFields) => {
  try {
    const response = await Axios.post(sessionStorage.getItem("baseUrl") + "/xero/xero-connection-tenantId", {
      accessToken: accessToken,
    });
    if (response.status === 200 && response.data.length > 0) {
      const firstObject = response.data[0];
      sessionStorage.setItem("tenantId", firstObject.tenantId);
      //call get customer xero
      if (sessionStorage.getItem("tenantId")) {
        await xeroGetCustomerId(sessionStorage.getItem("tenantId"), updatedFields);
      }
    } else {
      toast.error("Failed to upload bill at xero end!");
    }
  } catch (error) {
    toast.error("Failed to upload bill at xero end!");
    console.error("Error while getting tenantId:", error);
  }
};

export const xeroGetCustomerId = async (tenantId, updatedFields) => {
  try {
    const response = await Axios.post(sessionStorage.getItem("baseUrl") + "/xero/getCustomer", {
      code: sessionStorage.getItem("accessToken"),
      name: sessionStorage.getItem("contactName"), //from session send here the customer name
      tenantId: tenantId,
    });
    if (response.status === 200 && response.data.Contacts.length > 0) {
      const firstObject = response.data.Contacts[0];
      sessionStorage.setItem("xeroContactId", firstObject.ContactID);
      await xeroCreateInvoice(sessionStorage.getItem("xeroContactId"), updatedFields, tenantId);
    } else {
      await xeroCreateCustomerEnd(updatedFields);
    }
  } catch (error) {
    toast.error("Failed to upload bill at xero end!");
    console.error("Error while getting xeroGetCustomerId:", error);
  }
};

export const xeroCreateCustomerEnd = async (updatedFields) => {
  try {
    var customerName = sessionStorage.getItem("contactName"); //take from session
    const spaceIndex = customerName.indexOf(" ");
    var firstName, lastName;
    if (spaceIndex !== -1) {
      firstName = customerName.substring(0, spaceIndex);
      lastName = customerName.substring(spaceIndex + 1);
    } else {
      firstName = customerName;
      lastName = "";
    }

    const response = await Axios.post(sessionStorage.getItem("baseUrl") + "/xero/xeroCreateCustomerEnd", {
      code: sessionStorage.getItem("accessToken"),
      email: sessionStorage.getItem("lastemail"), //take from session
      firstName: firstName,
      lastName: lastName,
      name: customerName,
      tenantId: sessionStorage.getItem("tenantId"),
    });
    if (response.status === 200 && response.data.Contacts.length > 0) {
      const firstObject = response.data.Contacts[0];
      sessionStorage.setItem("xeroContactId", firstObject.ContactID);
      await xeroCreateInvoice(
        sessionStorage.getItem("xeroContactId"),
        updatedFields,
        sessionStorage.getItem("tenantId")
      );
    } else {
      toast.error("Failed to upload bill at xero end!");
    }
  } catch (error) {
    toast.error("Failed to upload bill at xero end!");
    console.error("Error while creating customer at xero end:", error);
  }
};

export const xeroCreateInvoice = async (xeroContactId, updatedFields, tenantId) => {
  try {
    const response = await Axios.post(sessionStorage.getItem("baseUrl") + "/xero/createInvoiceBill", {
      updatedFields: updatedFields,
      xeroContactId: xeroContactId,
      accessToken: sessionStorage.getItem("accessToken"),
      tenantId: tenantId,
    });
    if (response.status === 200 && response.data.Invoices[0].InvoiceID) {
      console.log(response);
      //store invoice id and call attachment api
      sessionStorage.setItem("xeroInvoicesID", response.data.Invoices[0].InvoiceID);
      await xeroUploadBill(sessionStorage.getItem("xeroInvoicesID"), sessionStorage.getItem("tenantId"));
    } else {
      toast.error("Failed to create bill at xero end!");
    }
  } catch (error) {
    toast.error("Failed to create bill at xero end!");
    console.error("Error while creating bill at  xero end:", error);
  }
};

export const xeroUploadBill = async (xeroInvoicesID, tenantId) => {
  try {
    const response = await Axios.post(sessionStorage.getItem("baseUrl") + "/xero/uploadInvoiceBill", {
      xeroInvoicesID: xeroInvoicesID,
      selectedFileurl: sessionStorage.getItem("selectedFileurl"),
      accessToken: sessionStorage.getItem("accessToken"),
      tenantId: tenantId,
    });
    if (response.status === 200 && response.data) {
      console.log(response);
    } else {
      toast.error("Failed to create bill at xero end!");
    }
  } catch (error) {
    toast.error("Failed to create bill at xero end!");
    console.error("Error while creating bill at  xero end:", error);
  }
};


export const listinvoices = async (req, res) => {
  let {
    companyId,
    fromDate = null,
    toDate = null,
    offset = null,
    limit = null,
    status = null,
    customerEmail = null,
  } = req.query;

  console.log(companyId);

  try {
    const url = process.env.base_url + constant.invoiceurl + "/" + companyId;
    console.log(url);
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": process.env.x_api_key,
      "x-client-name": process.env.x_client_name,
      "x-client-id": process.env.x_client_id,
      "x-program-id": process.env.x_program_id,
      "x-request-id": requestId,
    };
    console.log(headers);

    const requestBody = {
      fromDate,
      toDate,
      offset,
      limit,
      status,
      customerEmail,
    };
    console.log(requestBody);

    const response = await axios.post(url, requestBody, { headers });
    console.log(response);

    if (response.data.bills && response.data.bills.length > 0) {
      // Case: Invoices found
      res.status(200).json(response.data.invoices);
    } else if (response.data.message && response.data.status === "SUCCESS") {
      // Case: No invoices found
      res.status(200).json({
        status: "NOT_FOUND",
        message: response.data.message,
      });
    } else if (
      response.data.message &&
      response.data.status === "BAD_REQUEST"
    ) {
      // Case: No invoices found
      res.status(200).json({
        status: "BAD_REQUEST",
        message: response.data.message,
      });
    } else {
      // Case: Unexpected response format
      res.status(500).json({
        status: "ERROR",
        message: "Unexpected response format",
      });
    }
  } catch (error) {
    console.error(error);

    if (error.response) {
      // Case: Known error response from the server
      res.status(error.response.status).json({
        status: "ERROR",
        message: error.response.data.message || "Internal Server Error",
      });
    } else {
      // Case: Unknown error
      res.status(500).json({
        status: "ERROR",
        message: "An unknown error occurred",
      });
    }
  }
};

