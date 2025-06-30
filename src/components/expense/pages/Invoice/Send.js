import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomSelect from "../../../structure/CustomSelect";
import { sendInvoice } from "../../js/invoices-function.js";
import { toast } from "react-toastify";
import axios from "axios";
import { validations } from "./CreateInvoice.js";
import CustomInput from "../../../structure/NewStructures/CustomInput.js";
import { EmailOutlined } from "@mui/icons-material";

function Attachment({ filename, setFiles }) {
  const [name, setName] = useState("");
  const [extension, setExtension] = useState("");

  useEffect(() => {
    if (filename) {
      const data = filename.split("\\");
      const file = data[data.length - 1].split(".");
      setExtension(file[file.length - 1].toUpperCase());
      setName(file.slice(0, file.length - 1).join("."));
    }
  }, [filename]);

  return (
    <>
      {filename ? (
        <div className="d-flex py-3 align-items-center gap-3">
          <label
            for="files"
            className="text-secondary"
            style={{ fontSize: 13 }}
          >
            File:
          </label>
          <div className="d-flex flex-fill align-items-center justify-content-between bg-blue10 py-2 border rounded-2">
            <div className="d-flex">
              <img
                src="/payments/attachment.svg"
                width={40}
                className="px-2 me-2"
              />
              <p className="fw-500 m-0 me-2">{extension}</p>
              <p className="fw-normal m-0">{name}</p>
            </div>
            {/*<img src="/delete_blue.svg" width={40} className='px-2' onClick={() => setFiles("")} role='button' />*/}
          </div>
        </div>
      ) : (
        <label
          for="files"
          className="fw-normal mt-3 border-bottom border-dark pb-2"
        >
          File:
        </label>
      )}
    </>
  );
}

function Send({ pdfUrl, handleClose, senderEmail }) {
  const [from, setFrom] = useState(sessionStorage.getItem("lastemail"));
  const [isLoading, setIsLoading] = useState(false);
  const [to, setTo] = useState(senderEmail || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [filename, setFilename] = useState("");

  useEffect(() => {
    // Fetch PDF file from the URL
    fetchPdfFile(pdfUrl);
  }, []);

  const fetchPdfFile = async (pdfurl) => {
    try {
      const url = sessionStorage.getItem("baseUrl") + "/xero/getPDF";
      const response = await axios.post(
        url,
        { url: pdfurl },
        { responseType: "blob" }
      ); // Ensure responseType is 'blob'

      // Create a blob from the response data
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      setPdfFile(pdfBlob);

      // Extract filename from the URL
      const urlParts = pdfurl.split("/");
      const pdfFilename = urlParts[urlParts.length - 1];
      setFilename(pdfFilename);
    } catch (error) {
      console.error("Error fetching PDF file:", error);
    }
  };

  const handleCreateInvoice = () => {
    if (!from) {
      toast.error("Sender Email must not be empty");
      return;
    }
    if (!to) {
      toast.error("Recipient Email must not be empty");
      return;
    } else if (!message) {
      toast.error("Email Description must not be empty");
      return;
    } else if (!subject) {
      toast.error("Email Subject must not be empty");
      return;
    } else if (!pdfFile) {
      toast.error("Please select a file");
      return;
    }

    // Function to read the file and convert it to base64
    const readFileAsBase64 = (pdfFile) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => {
          toast.error("Error reading the file.");
          reject(error);
        };
        reader.readAsDataURL(pdfFile);
      });

    // Read the PDF file and convert it to base64
    readFileAsBase64(pdfFile)
      .then((base64String) => {
        const updatedFields = {
          to: to,
          pdf_content: base64String,
          pdf_filename: filename, // Use file.name for the filename
          plain_text_content: message,
          subject: subject,
        };

        setIsLoading(true);
        return sendInvoice(updatedFields);
      })
      .then((fetchedData) => {
        setIsLoading(false);
        if (
          fetchedData.status === "BAD_REQUEST" ||
          fetchedData.length === 0 ||
          fetchedData.statusText === "Internal Server Error"
        ) {
          toast.error("Failed to send mail to the customer");
        } else {
          toast.success("Invoice is successfully sent to the customer");
          setTimeout(() => {
            handleClose();
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Error sending invoice:", error);
        setIsLoading(false);
        toast.error("Failed to send mail to the customer");
      });
  };

  return (
    <div className="p-3">
      <div className="d-flex flex-column">
        <CustomInput
          maxLength={50}
          label="From"
          name="From"
          value={from}
          onInput={(e) => setFrom(e.target.value)}
          onBlur={(e) => validations.email(e.target.value, e.target.name)}
          className="custom-input-class full-width"
          required
        />
        <CustomInput
          maxLength={50}
          label="To"
          name="To"
          value={to}
          onInput={(e) => setTo(e.target.value)}
          onBlur={(e) => validations.email(e.target.value, e.target.name)}
          className="custom-input-class full-width"
          required
        />
        <CustomInput
          maxLength={50}
          label="Subject"
          name="Subject"
          value={subject}
          onInput={(e) => setSubject(e.target.value)}
          onBlur={(e) => validations.address(e.target.value, e.target.name)}
          className="custom-input-class full-width"
          required
        />
        {pdfFile && <Attachment filename={filename} file={pdfFile} />}{" "}
        {/* Pass filename prop instead of files */}
        <CustomInput
          maxLength={50}
          label="Message"
          name="Message"
          value={message}
          onInput={(e) => setMessage(e.target.value)}
          onBlur={(e) => validations.address(e.target.value, e.target.name)}
          className="custom-input-class full-width"
          required
        />
      </div>

      <div className="d-flex justify-content-end mt-4">
        <Button
          variant="contained"
          loading={isLoading}
          loadingPosition="center"
          endIcon={<EmailOutlined />}
          disabled={isLoading}
          onClick={handleCreateInvoice}
          className={"px-4 py-2"}
          color="secondary"
        >
          {`Send Invoice`}
        </Button>
      </div>
    </div>
  );
}

export default Send;
