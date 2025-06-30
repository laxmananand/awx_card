import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
// import EditBeneficiary from "./EditBeneficiary";
import EditBeneficiarynew from "./EditBeneficiarynew";

import { onDelete } from "../../js/ListBeneficiaries";
import Swal from "sweetalert2";
import { setSelectedBeneficiary } from "../../../../@redux/features/payments";
import { fetchDetails } from "../../../../@redux/action/payments";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { blue, blueGrey, red } from "@mui/material/colors";
import * as paymentaction from "../../../../@redux/action/payments";
import "../../css/detailsbar.css";

function DetailsBar({
  setShowDetails,
  handleShow,
  handleActive,
  data,
  color,
  customerHashId,
}) {
  // const [beneficiaryDetails, setBeneficiaryDetails] = useState();

  const isLoading = useSelector((state) => state.payments?.isLoading);
  const phoneCodeList = useSelector((state) => state.payments?.phoneCodeList);
  const platform = useSelector((state) => state.common.platform);
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      paymentaction.fetchDetails(data?.beneficiaryHashId, customerHashId)
    );
  }, [data]);
  const selectedBeneficiary = useSelector(
    (state) => state.payments?.selectedBeneficiary
  );
  // React.useEffect(() => {
  //   dispatch(fetchDetails(data?.beneficiaryHashId, customerHashId));
  // }, [data.beneficiaryHashId]);

  useEffect(() => {
    function handleKeyPress(event) {
      if (event.key === "Escape") {
        dispatch(setSelectedBeneficiary({}));
        handleShow(-1);
        handleActive(-1);
        setShowDetails(false);
      }
    }
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  // useEffect(() => {
  //   console.log(data.beneficiaryHashId, 5555);
  // }, [data]);

  function createShortForm(fullName) {
    const words = fullName.split(" ");

    // Initialize with the first letter of the first word
    let shortForm = words[0].charAt(0).toUpperCase();

    // Check if there is a second word and add its first letter if it exists
    if (words.length > 1) {
      shortForm += words[1].charAt(0).toUpperCase();
    }
    return shortForm;
  }

  // Match the country code
  const matchedPhoneCode = phoneCodeList?.find(
    (item) => item.value === selectedBeneficiary?.beneficiaryContactCountryCode
  )?.phonecode; // Assuming `phoneCode` is the field for the code

  return (
    <>
      <div
        className="position-fixed bg-black w-100 h-100 top-0 opacity-50"
        style={{ width: "100vb", zIndex: 3 }}
        onClick={() => {
          handleShow(-1);
          handleActive(-1);
          setShowDetails(false);
          dispatch(setSelectedBeneficiary({}));
        }}></div>
      <nav
        className="d-flex bg-white text-black flex-column justify-content-start flex-start p-4 flex-1 border-top-0 gap-3 position-fixed top-0 h-100 details_bar shadow overflow-auto rounded"
        id="sidebar"
        style={{
          width: "350px",
          right: 0,
          transition: "right 0.3s ease-in-out",
          zIndex: 3,
        }}>
        <div className="mt-3 position-relative ">
          <h6 className="text-nowrap me-5">Beneficiary Details</h6>
          <button
            type="button"
            className="btn-close btn-sm  position-absolute end-0 top-0 me-2"
            onClick={() => {
              handleShow(-1);
              handleActive(-1);
              setShowDetails(false);
            }}
          />
        </div>

        <div className="d-flex flex-row bg-secondary bg-gradient text-black border justify-content-start p-3 my-3 rounded-5 shadow">
          <div
            className={`p-3 rounded-circle text-${color} shadow bg-primary-50`}
            style={{
              width: 55,
              height: 55,
            }}>
            <div className="text-center ">
              {createShortForm(data?.beneficiaryName)}
            </div>
          </div>
          <div className=" text-center w-100 rounded fw-500 justify-content-center p-3">
            <p className="my-auto text-nowrap">{data?.beneficiaryName}</p>
          </div>
        </div>

        {/* {isLoading ? (
        
          <ContentLoader
              speed={1}
              width={20}
              height={5}
              viewBox="0 0 340 100"
              backgroundColor="#f6f6ef"
              foregroundColor="#e8e8e3"
            >
            <rect x="10" y="33" rx="0" ry="0" width="64" height="13" />
            </ContentLoader>
        ) : ( <p className="my-auto ms-2 me-5 text-nowrap">{selectedBeneficiary?.beneficiaryName}</p>)} */}

        <div className="accordion accordion-flush " id="requestMoneyDetails">
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingOne">
              <button
                className="accordion-button collapsed fw-500"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseOne"
                aria-expanded="false"
                aria-controls="flush-collapseOne">
                Personal Info
              </button>
            </h2>
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse m-3"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#requestMoneyDetails">
              <div className="d-flex justify-content-between fw-normal">
                <p className="grey1 fw-500">Beneficiary Name</p>
                <p className="fw-500 text-wrap">{data?.beneficiaryName}</p>
              </div>

              <div className="d-flex justify-content-between fw-normal">
                <p className="grey1 fw-500">Email</p>
                <p className="fw-500 text-wrap">{data?.beneficiaryEmail}</p>
              </div>

              <div className="d-flex justify-content-between fw-normal">
                <p className="grey1 fw-500">Phone Number</p>
                {data?.beneficiaryContactCountryCode && (
                  <p className="fw-500 text-wrap">
                    {"+"}
                    {/* {data?.beneficiaryContactCountryCode}{" "} */}
                    {matchedPhoneCode ||
                      data?.beneficiaryContactCountryCode}{" "}
                    {data?.beneficiaryContactNumber}
                  </p>
                )}
              </div>
              <div className="d-flex justify-content-between fw-normal">
                <p className="grey1 fw-500">Address</p>
                <p className="fw-500 text-wrap">{data?.beneficiaryAddress}</p>
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="flush-headingTwo">
              <button
                className="accordion-button btn-accordion collapsed fw-500 text-decoration-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapseTwo"
                aria-expanded="false"
                aria-controls="flush-collapseTwo">
                Account Info
              </button>
            </h2>
            <div
              id="flush-collapseTwo"
              className="accordion-collapse collapse m-3"
              aria-labelledby="flush-headingTwo"
              data-bs-parent="#requestMoneyDetails">
              <div className="fw-normal">
                <p className="grey1 m-0 fw-500">Account Number</p>
                <p className="text-wrap fw-500">
                  {data?.beneficiaryAccountNumber}
                </p>
              </div>
              <div className="fw-normal">
                <p className="grey1 m-0 fw-500">Payout Method</p>
                <p className="text-wrap fw-500">{data?.payoutMethod}</p>
              </div>
              <div className="fw-normal">
                <p className="grey1 m-0 fw-500">Bank Name</p>
                <p className="text-wrap fw-500">{data?.beneficiaryBankName}</p>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="d-flex flex-column gap-2 ">
          {/* <Link
                to={`/payments/send-money?beneficiaryHashId=${data?.beneficiaryHashId}&beneficiaryName=${data?.beneficiaryName}&beneficiaryAccountNumber=${data?.beneficiaryAccountNumber}&payoutMethod=${data?.payoutMethod}&destinationCurrency=${data?.destinationCurrency}`}
                className="btn btn-action w-100 rounded-5 d-flex align-items-center justify-content-center py-2 fw-500"
              >
                <img src="/payments/send-money.svg" />
                Send Money
              </Link> */}

          <Link
            to="/payments/send-money"
            state={{
              beneficiaryHashId: data?.beneficiaryHashId,
              beneficiaryName: data?.beneficiaryName,
              beneficiaryAccountNumber: data?.beneficiaryAccountNumber,
              payoutMethod: data?.payoutMethod,
              destinationCurrency: data?.destinationCurrency,
            }}
            className="btn btn-action w-100 rounded-5 d-flex align-items-center justify-content-center py-2 fw-500">
            <img src="/payments/send-money.svg" />
            Send Money
          </Link>

          {/* <Link
                to="/payments/request-money"
                className="btn border rounded-3 my-2 py-3 fw-500 green100"
              >
                <img src="/payments/request-money.svg" />
                Request Money
              </Link> */}

          {/* <EditBeneficiary
              data={selectedBeneficiary}
              customerHashId={customerHashId}
            /> */}
          <button
            type="button"
            className="btn btn-action border w-100 d-flex align-items-center justify-content-center rounded-5 my-2 py-2 fw-500"
            data-bs-toggle="modal"
            data-bs-target="#EditAccountModal"
            disabled={platform === "awx"}>
            <CiEdit size={40} className="me-2" />
            Edit Beneficiary
          </button>

          <button
            className="btn btn-action border w-100 d-flex align-items-center justify-content-center rounded-5 my-2 fw-500"
            onClick={(e) => {
              e.preventDefault();
              Swal.fire({
                title: "Are you sure ?",
                text: "The beneficiary cannot be retrieved again.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
                closeButton: true,
                confirmButtonColor: "#228B22",
                cancelButtonColor: "#d33",
                customClass: {
                  title: "swal-title",
                  text: "swal-text",
                },
              }).then((result) => {
                if (result.isConfirmed) {
                  onDelete(customerHashId, data?.beneficiaryHashId);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  return;
                }
              });
            }}
            disabled={platform === "awx"}
            >
            <AiOutlineDelete size={40} className="me-2" />
            Delete
          </button>
        </div>
      </nav>

      <EditBeneficiarynew data={data} customerHashId={customerHashId} />
    </>
  );
}

export default DetailsBar;
