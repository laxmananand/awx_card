import React, { useEffect, useState } from "react";
import CustomSelect from "../../structure/CustomSelect.js";
import CreateRequest from "./CreateBill.js";
import { uploadtos3 } from "../js/bills-functions.js";
import ContentLoader from "react-content-loader";
import { toast } from "react-toastify";
import {
  setCurrentState,
  setApiData,
  setReviewFields,
  setTransferFields,
} from "../../../@redux/features/expence.js";
import { useDispatch } from "react-redux";

function AddNewAccountModal() {
  const dispatch = useDispatch();
  const [createbill, setCreatebill] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [base64EncodedFile, setBase64EncodedFile] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadbill = (selectedFileName, base64EncodedFile) => {
    if (!selectedFileName) {
      // Check if a file is selected before uploading
      setFileError(true);
      return;
    } else {
      setLoading(true);
      uploadtos3(selectedFileName, base64EncodedFile)
        .then((fetchedData) => {
          setUrl(fetchedData);
          console.log(fetchedData);

          dispatch(setCurrentState(0));
          dispatch(setApiData(null));
          dispatch(setTransferFields(null));
          dispatch(setReviewFields(null));

          if (fetchedData) {
            setLoading(false);
            window.location.href = `bills/createbill?filename=${encodeURIComponent(
              selectedFileName
            )}&url=${fetchedData}`;
          }
        })
        .catch((error) => {
          dispatch(setCurrentState(0));
          dispatch(setApiData(null));
          dispatch(setTransferFields(null));
          dispatch(setReviewFields(null));
          console.error("Error uploading to S3:", error);
          setLoading(false);
          setUrl(
            "https://stylopay-sandbox-ohio-dev-dump-public.s3.amazonaws.com/OD126075829427635000%20(1).pdf"
          );
          window.location.href = `bills/createbill?filename=${encodeURIComponent(
            selectedFileName
          )}&url=https://stylopay-sandbox-ohio-dev-dump-public.s3.amazonaws.com/OD126075829427635000%20(1).pdf`;
        });
    }
  };

  const options = [
    { value: "vanilla", label: "Vanilla" },
    { value: "strawberry", label: "Strawberry" },
    { value: "caramel", label: "Caramel" },
    { value: "mint", label: "Mint" },
    { value: "blueberry", label: "Blueberry" },
    { value: "raspberry", label: "Raspberry" },
    { value: "hazelnut", label: "Hazelnut" },
    { value: "peanut_butter", label: "Peanut Butter" },
    { value: "coconut", label: "Coconut" },
    { value: "lemon", label: "Lemon" },
    { value: "coffee", label: "Coffee" },
    { value: "pistachio", label: "Pistachio" },
    { value: "banana", label: "Banana" },
    { value: "butterscotch", label: "Butterscotch" },
    { value: "cherry", label: "Cherry" },
    { value: "almond", label: "Almond" },
    { value: "cinnamon", label: "Cinnamon" },
    { value: "honey", label: "Honey" },
    { value: "orange", label: "Orange" },
    { value: "maple", label: "Maple" },
  ];

  const [val, setVal] = useState();
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [pdfTextContent, setPdfTextContent] = useState(null);
  const [fileSizeError, setFileSizeError] = useState(false);

  const fileuploaded = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        // 2 MB
        setFileSizeError(true);
        setFileError(false);
        setSelectedFileName(null);
        setBase64EncodedFile(null);
        return;
      } else {
        setFileSizeError(false);
      }

      setSelectedFileName(selectedFile.name);
      setFileError(false);
      const reader = new FileReader();

      reader.onload = () => {
        const base64Data = reader.result;
        const base64Code = base64Data.split(",")[1];
        setBase64EncodedFile(base64Code);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    console.log(val);
  }, [val]);

  return (
    <>
      <button
        type="button"
        id="createbillbutton"
        className="btn bg-white border w-100 blue100 d-flex align-items-center justify-content-center py-3"
        data-bs-toggle="modal"
        data-bs-target="#AddNewAccountModal"
      ></button>
      <div
        className="modal fade"
        id="AddNewAccountModal"
        tabIndex={-1}
        aria-labelledby="AddNewAccountModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3 text-center position-relative">
            <div className="header-upload-bill d-flex justify-content-between align-items-center">
              <div></div>
              <h3 className="mb-0 ms-4 opacity-75">Create New Bill</h3>
              <button
                type="button"
                className="border-0 bg-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                X
              </button>
            </div>

            <div className="px-5 py-3 d-flex flex-column">
              <h6 className="my-3 opacity-75">Upload your bill here</h6>
              <div className="d-flex border-bottom mb-4">
                <div
                  className="bg-blue10 d-flex flex-column justify-content-center py-4 border-activeBlue rounded-4"
                  style={{ borderStyle: "dotted", width: "98%" }}
                >
                  <label htmlFor="fileInput" className="d-flex">
                    <img
                      src="/sidebar/expense/draganddrop.svg"
                      className="mx-auto"
                      alt="Drag and Drop"
                    />
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={fileuploaded}
                  />
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                {selectedFileName && <p className="mt-2">{selectedFileName}</p>}
                {fileError && (
                  <p className="text-danger mt-2">
                    Please choose a file before uploading.
                  </p>
                )}
                {fileSizeError && (
                  <p className="text-danger mt-2">
                    File size should not exceed 2 MB.
                  </p>
                )}
                <p className="mb-0" style={{ color: "brown" }}>
                  <span className="text-dark">Accepted Formats:</span>{" "}
                  application/PDF**
                </p>
                <p className="mb-0" style={{ color: "brown" }}>
                  <span className="text-dark">Max size:</span> 2MB**
                </p>
              </div>

              <button
                className="btn btn-action mt-4 rounded-5 fw-bold"
                onClick={() => uploadbill(selectedFileName, base64EncodedFile)}
                disabled={loading}
                style={{ letterSpacing: "1px" }}
              >
                {loading ? (
                  <>
                    <div id="uploadbuttonloader">
                      <img
                        className="google-icon"
                        alt=""
                        src="/sidebar/expense/loader.gif"
                      />
                    </div>
                  </>
                ) : (
                  <>UPLOAD</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddNewAccountModal;
