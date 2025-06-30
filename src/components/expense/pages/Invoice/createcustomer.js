import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { Createcustomerapi } from '../../js/invoices-function';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function Createcustomer() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const clearForm = () => {
    document.getElementById("customerName").value = "";
    document.getElementById("customerEmail").value = "";
    document.getElementById("address1").value = "";
    document.getElementById("address2").value = "";
    document.getElementById("address3").value = "";
    document.getElementById("address4").value = "";
    setErrors({});
  };

  const closemodal = () => {
    const modal = document.getElementById("CreateCustomerModal");
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    const modalBackdrop = document.getElementsByClassName("modal-backdrop");
    // Remove the backdrop
    if (modalBackdrop.length > 0) {
      document.body.removeChild(modalBackdrop[0]);
    }
    // Clear form fields
    clearForm();
  };

  const validateInputs = (customername, customeremail, address1, address2, address3, address4) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const textRegex = /^[a-zA-Z\s]+$/;
    const addressRegex = /^[^<>]*$/;

    if (!customername || !textRegex.test(customername)) {
      errors.customerName = "Customer Name is required and should not contain special characters.";
      toast.error(errors.customerName);
      return;
    }
    if (!customeremail || !emailRegex.test(customeremail)) {
      errors.customerEmail = "Customer email is required and should contain a valid email address - work1@companyname.com";
      toast.error(errors.customerEmail);
      return;
    }
    if (!address1 || !addressRegex.test(address1)) {
      errors.address1 = "Address line 1 is required.";
      toast.error(errors.address1);
      return;
    }
    if (!address3 || !textRegex.test(address3)) {
      errors.address3 = "City is required and should not contain numbers or special characters.";
      toast.error(errors.address3);
      return;
    }
    if (!address4 || !textRegex.test(address4)) {
      errors.address4 = "State is required and should not contain numbers or special characters.";
      toast.error(errors.address4);
      return;
    }
    return errors;
  };

  const handleCreateCustomer = () => {
    const customername = document.getElementById("customerName").value;
    const customeremail = document.getElementById("customerEmail").value;
    const address1 = document.getElementById("address1").value ?? '';
    const address2 = document.getElementById("address2").value ?? '';
    const address3 = document.getElementById("address3").value ?? '';
    const address4 = document.getElementById("address4").value ?? '';

    const validationErrors = validateInputs(customername, customeremail, address1, address2, address3, address4);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedFields = {
      Customername: customername,
      Customeremail: customeremail,
      Companyid: sessionStorage.getItem("internalBusinessId"),
      Address1: address1,
      Address2: address2,
      Address3: address3,
      Address4: address4,
    };
    const customerdatatosent = {
      customerName: customername,
      customerEmail: customeremail,
      companyId: sessionStorage.getItem("internalBusinessId"),
      address1: address1,
      address2: address2,
      address3: address3,
      address4: address4,
    };

    setIsLoading(true);
    Createcustomerapi(updatedFields).then((fetchedData) => {
      console.log(fetchedData)
      setIsLoading(false);
      if (
        fetchedData.status === "BAD_REQUEST" ||
        fetchedData.length === 0 ||
        fetchedData.statusText === "Internal Server Error"
      ) {
        closemodal(); // Close the modal if condition is met
      } else {
        const customerDataQueryString = encodeURIComponent(
          JSON.stringify(customerdatatosent)
        );
        window.location.href = `/expense/invoices/create-invoice?customerdata=${customerDataQueryString}`;
      }
    });
  };

  return (
    <div
      className="modal fade"
      id="CreateCustomerModal"
      tabIndex={-1}
      aria-labelledby="CreateCustomerModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-5 rounded-5">
          <div className="d-flex justify-content-between mt-2">
            <h5 className="text-dark">Create New Customer</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={closemodal}
            />
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="d-flex flex-column">
              <TextField
                className="mt-2"
                variant="standard"
                label="Customer Name"
                id="customerName"
              />
              <TextField
                className="mt-2"
                variant="standard"
                label="Customer Email"
                id="customerEmail"
              />
              <TextField
                className="mt-2"
                variant="standard"
                label="Address line 1"
                id="address1"
              />
              <TextField
                className="mt-2"
                variant="standard"
                label="Address line 2"
                id="address2"
              />
            </div>

            <div className="d-flex">
              <TextField
                className="mt-2 me-1"
                variant="standard"
                label="City"
                id="address3"
              />
              <TextField
                className="mt-2 ms-1"
                variant="standard"
                label="State"
                id="address4"
              />
            </div>

            <div className="text-center d-flex mt-5">
              <button
                className="btn btn-outline-dark w-50 me-2 py-2 p-l-m rounded-pill"
                data-bs-target="#AddNewAccountModal"
                data-bs-toggle="modal"
                onClick={(e) => {
                  e.preventDefault();
                  closemodal();
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="btn btn-action p-l-m w-50 ms-2 py-2 rounded-pill"
                onClick={handleCreateCustomer}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Createcustomer;
