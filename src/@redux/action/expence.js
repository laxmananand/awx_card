import axios from "axios";
import jsPDF from "jspdf";
import { setListBill, setUpdateBill } from "../features/expence";
import { setIsLoading } from "../features/payments";
import { toast } from "react-toastify";

export const listBills = (fromDate, toDate) => async (dispatch, getState) => {
  var company = getState().onboarding.UserStatusObj.internalBusinessId;
  // Convert fromDate and toDate to Date objects
  const fromDateObj = new Date(fromDate);
  const toDateObj = new Date(toDate);

  // Convert Date objects to yyyy-mm-dd format
  const formattedFromDate = fromDateObj.toISOString().split("T")[0] || null;
  const formattedToDate = toDateObj.toISOString().split("T")[0] || null;
  try {
    const response = await axios.get(
      sessionStorage.getItem("baseUrl") + `/expense/listbills`,
      {
        params: {
          companyId: company,
          fromDate: formattedFromDate,
          toDate: formattedToDate,
        },
      }
    );
    let obj = response.data;
    if (obj?.message?.includes(":")) {
      setListBill([]);
      return obj;
    }
    console.log(obj);
    dispatch(setListBill(obj));

    if (Array.isArray(obj)) {
      return obj;
    } else {
      return [];
    }
  } catch (error) {
    dispatch(setListBill([]));
    return [];
  }
};

export const updateBill = (body) => async (dispatch, getState) => {
  var company = getState().onboarding.UserStatusObj.internalBusinessId;
  dispatch(setIsLoading(true));
  try {
    const response = await axios.post(
      sessionStorage.getItem("baseUrl") + `/expense/updatebills`,
      body
    );

    let obj = response.data;

    dispatch(setIsLoading(false));
    dispatch(setUpdateBill(obj));
  } catch (err) {
    dispatch(setIsLoading(false));
    console.log("error updating bill ", err);
  }
};

export const CreateInvoiceDoc =
  ({ invoiceData, setPreviewData }) =>
  async (dispatch, getState) => {
    try {
      const {
        Invoicenumber: id,
        CompanyId: companyId,
        invoiceDate: date,
        dueDate,
        Description: description,
        Imageurl: imgUrl = "abcd",
        RecipientName: customerName,
        customeremail: customerEmail,
        itemDetails,
        address1,
        address2,
        paymentadvice,
        currency,
      } = invoiceData;

      const createdBy = sessionStorage.getItem("lastemail");
      const filename = `${id}.pdf`;

      const dataToSend = {
        id,
        companyId,
        date,
        dueDate,
        description,
        imgUrl,
        createdBy,
        customerName,
        customerEmail,
        items: itemDetails,
        filename,
        template: "Invoice",
        return: "url",
        header: "Stylopay Invoice",
        address1,
        address2,
      };

      console.log("Invoice Data to Send:", dataToSend);

      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(10, 10, "Stylopay Invoice");

      // Customer Details
      doc.setFontSize(12);
      doc.text(10, 20, customerName);
      doc.text(10, 25, customerEmail);
      doc.text(10, 30, address1);
      doc.text(10, 35, address2);

      // Invoice Info
      doc.text(70, 20, "Invoice No:");
      doc.setFont("helvetica", "normal");
      doc.text(70, 25, id);
      doc.setFont("helvetica", "bold");
      doc.text(70, 30, "Due Date:");
      doc.setFont("helvetica", "normal");
      doc.text(70, 35, dueDate);

      // Table Headers
      const columns = [
        "Sl No",
        "Description",
        "Quantity",
        "Price",
        "Currency",
        "Tax (%)",
        "Discount (%)",
        "Amount",
      ];

      const tableData = itemDetails.map((item, index) => [
        item.slNo || index + 1,
        item.description || "",
        item.quantity || "",
        item.price || 0,
        item.currency || "",
        item.tax || 0,
        item.discount || 0,
        item.amount || 0,
      ]);

      doc.autoTable({ startY: 75, head: [columns], body: tableData });

      // Calculate Totals
      const totalAmount = itemDetails.reduce(
        (acc, item) => acc + Math.max(0, parseFloat(item.amount) || 0),
        0
      );

      const totalTax = itemDetails.reduce(
        (acc, item) =>
          acc +
          Math.max(
            0,
            ((parseFloat(item.tax) || 0) / 100) *
              Math.max(0, parseFloat(item.amount) || 0)
          ),
        0
      );

      const totalDiscount = itemDetails.reduce(
        (acc, item) =>
          acc +
          Math.max(
            0,
            ((parseFloat(item.discount) || 0) / 100) *
              Math.max(0, parseFloat(item.amount) || 0)
          ),
        0
      );

      // Ensure amountPayable never goes negative
      const amountPayable = Math.max(0, totalAmount - totalDiscount + totalTax);

      // Display Totals
      doc.text(110, 150, `Total Amount: ${currency} ${totalAmount.toFixed(2)}`);
      doc.text(
        110,
        155,
        `Total Discount: ${currency} ${totalDiscount.toFixed(2)}`
      );
      doc.text(110, 160, `Total Tax: ${currency} ${totalTax.toFixed(2)}`);
      doc.text(
        110,
        170,
        `Amount Payable: ${currency} ${amountPayable.toFixed(2)}`
      );

      // Convert to Blob & Upload to S3
      return new Promise((resolve, reject) => {
        const blob = doc.output("blob");
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = async () => {
          try {
            const base64Data = reader.result.split(",")[1];
            const uploadData = { filename, file: base64Data };

            const uploadResponse = await axios.post(
              sessionStorage.getItem("baseUrl") + "/expense/uploadtos3",
              uploadData
            );

            if (uploadResponse.data?.url) {
              console.log("Invoice Document generated successfully!");
              setPreviewData(uploadResponse?.data);
              //doc.save(filename);
              resolve(uploadResponse?.data);
            } else {
              console.error(
                "Error uploading the file to S3:",
                uploadResponse.data.response
              );
              resolve({
                statusCode: 500,
                message:
                  "Error uploading the file to S3: " +
                  uploadResponse.data.response,
              });
            }
          } catch (uploadError) {
            console.error("Upload Error:", uploadError);
            resolve({
              statusCode: 500,
              message: "Upload Error: " + { uploadError },
            });
            //toast.error(uploadError);
          }
        };
        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      console.error("Error in Createinvoicedoc:", error);
      //toast.error("Failed to generate invoice document.");
      return {
        statusCode: 500,
        message: "Something went wrong, please try again!",
      };
    }
  };

export const CreateInvoice =
  ({ createInvoiceBody }) =>
  async (dispatch, getState) => {
    try {
      const response = await axios.get(
        sessionStorage.getItem("baseUrl") + "/expense/createinvoice",
        {
          params: {
            ...createInvoiceBody,
          },
        }
      );
      let obj = response.data;
      return obj;
    } catch (e) {
      console.log(e);
      return {
        status: "BAD_REQUEST",
        message: "Something went wrong, please try again later!",
      };
    } finally {
    }
  };
