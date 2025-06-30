import React, { useEffect, useState } from "react";
import SideBar from "../../../SideBar";
import BreadCrumbs from "../../../structure/BreadCrumbs";
import RFIModal from "./RFIModal"; //Use this if need any file for user to fulfill RFI
import { useLocation } from "react-router-dom";
import { fetchtransactionstatus } from "../../js/ListBeneficiaries";
const Timelines = ({ transactionType }) => {
  const transactionStatusTitles = {
    INITIATED: "Payment Initiated",
    COMPLIANCE_PROCESSING: "Compliance Review in Progress",
    IN_PROGRESS: "Compliance Review in Progress",
    AWAITING_FUNDS: "Funding Awaited",
    SCHEDULED: "Scheduled for Processing",
    CANCELLED: "Transaction Cancelled by Customer",
    DECLINED: "Transaction Declined",
    APPROVED: "Payout Approved",
    ACTION_REQUIRED: "Further Action Required",
    COMPLIANCE_RFI_REQUESTED: "Additional Information Requested",
    COMPLIANCE_RFI_RESPONDED: "RFI Response Received",
    COMPLIANCE_REJECTED: "Transaction Rejected by Compliance",
    COMPLIANCE_COMPLETED: "Compliance Clearance Completed",
    PG_PROCESSING: "Processing Initiated",
    ERROR: "Error in Transaction Processing",
    SENT_TO_BANK: "Instruction Sent to Partner Bank",
    PAID: "Payment Successfully Sent",
    RETURN: "Transaction Returned by Receiving Bank",
    EXPIRED: "Transaction Expired",
  };

  const color = {
    COMPLIANCE_PROCESSING: "bg-warning",
    IN_PROGRESS: "bg-warning",
    AWAITING_FUNDS: "bg-warning",
    SCHEDULED: "bg-info",
    CANCELLED: "bg-danger",
    DECLINED: "bg-danger",
    APPROVED: "bg-success",
    ACTION_REQUIRED: "bg-danger",
    COMPLIANCE_RFI_REQUESTED: "bg-danger",
    COMPLIANCE_RFI_RESPONDED: "bg-info",
    COMPLIANCE_REJECTED: "bg-danger",
    COMPLIANCE_COMPLETED: "bg-success",
    PG_PROCESSING: "bg-warning",
    ERROR: "bg-danger",
    SENT_TO_BANK: "bg-success",
    PAID: "bg-success",
    RETURN: "bg-danger",
    EXPIRED: "bg-danger",
  }

  const [reverseList, setReverseList] = useState([])

  useEffect(() => {
    const rootStyles = document.documentElement?.style;
    const length = transactionType?.length;
    if (length > 0) rootStyles?.setProperty("--duration", length + "s");
    if(transactionType) {
      const list = transactionType;
      list.reverse();
      setReverseList(list)
    }
  }, [transactionType]);

  return (
    <>
      <div className="py-3 flex-wrap">
        <h3 className=" px-0 mt-2">Payment details</h3>
      </div>

      <section className="w-100">
        <div className="timeline position-relative my-auto w-100 my-5">
          {reverseList?.map((step, key) => (
            <div
              key={key}
              className={
                "timeline-container px-5 position-relative w-50 " +
                (key % 2 == 1 ? "left-container" : "right-container")
              }
            >
              <img
                src="/timeline.svg"
                className={"position-absolute rounded-circle timeline_img " + (color[step?.status] || "bg-green")}
                width="30px"
              />
              <div className={"text-box px-3 py-2 position-relative rounded-3 text-white py-3 " +(color[step?.status] || "bg-green")}>
                <h5 className="my-0">
                  {transactionStatusTitles[step?.status]}
                </h5>
                <small>{step?.lastUpdatedAt}</small>
                <p className="m-0">{step?.statusDetails}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

const PaymentTracker = () => {
  const [amount, setAmount] = useState(0);
  const [userName, setUserName] = useState("John Duo");
  const [transactionType, setTransactionType] = useState([]);
  const location = useLocation();
  const { showDetails, customerHashId } = location.state || {};
  useEffect(() => {
    let system_reference_id = showDetails.authCode;
    fetchtransactionstatus(system_reference_id, customerHashId).then(
      (response) => {
        console.log(response);
        setTransactionType(response);
      }
    );
  }, [showDetails]);
  return (
    <div>
      <div style={{ display: "flex" }}>
        <SideBar />
        <div className="overflow-auto" style={{ flex: 1, height: "100vh" }}>
          <BreadCrumbs
            data={{
              name: "Payment Status",
              img: "/arrows/arrowLeft.svg",
              backurl: "/payments/transactions",
            }}
          />

          <div className="p-5">
            <div className="d-flex justify-content-around align-items-center">
              <div
                className="justify-content-center align-item-center"
                style={{ marginBottom: "20px" }}
              >
                <div className="d-flex justify-content-between px-3 flex-wrap">
                  <div className="d-flex align-items-center py-3">
                    <h5 className="text-nowrapd m-0 ">
                      Amount: {showDetails.authAmount}
                      {showDetails.authCurrencyCode}
                    </h5>
                  </div>
                </div>

                <div className="d-flex justify-content-between px-3 flex-wrap">
                  <h5 className="text-nowrapd m-0">Transferred from zoqq</h5>
                </div>
              </div>

              <div className="px-4 flex-wrap border d-inline-flex p-3 bg-green text-white rounded-4">
                <div>
                  {/* <p>From</p>
                                    <div>
                                        <h5>{userName}</h5>
                                        <img src="" alt="" />
                                    </div> */}
                  <p>ID: {showDetails.authCode}</p>
                </div>
                <div className="align-self-center mx-5">|</div>
                <div>
                  {/* <p>To</p>
                                    <div>
                                        <h5>Mithlesh Kumar</h5>
                                        <img src="" alt="" />
                                    </div> */}
                  <div>
                    <p>Paid at {showDetails.createdAt}</p>
                  </div>
                </div>
              </div>
            </div>

            <Timelines
              showDetails={showDetails}
              transactionType={transactionType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTracker;
