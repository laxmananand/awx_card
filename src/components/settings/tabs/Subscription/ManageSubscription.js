import CompareAllPlans from "../../../Signup/pages/CompareAllPlans.js"
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { cancelSubscriptionPlanAPI, changeSubscriptionPlanAPI, preventCancelSubscriptionPlanAPI } from "../../../../@redux/action/subscription.js";
import PaymentMethods from "./PaymentMethods.js";
import Swal from "sweetalert2";

function ManageSubscription() {

  const status = useSelector((state) => state.subscription?.data?.status);
  const fullPlanDetails = useSelector((state) => state.subscription?.data);

  const dispatch = useDispatch()

  const changePlan = (newPlanId) => {
    Swal.fire({
      icon: "warning",
      text: "Once you upgrade your plan, you won't be able to downgrade. Please note that payments will be automatically deducted from your default payment method.",
      confirmButtonText: "Upgrade",
      cancelButtonText: "Cancel",
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(changeSubscriptionPlanAPI(newPlanId))
      }
    });
  }

  const cancelSubscription = () => {
    Swal.fire({
      icon: "warning",
      text: "Once you cancel your plan, it will remain active until the end of the current period.",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(cancelSubscriptionPlanAPI())
      }
    });
  }

  const preventCancelSubscription = () => {
    Swal.fire({
      icon: "warning",
      text: "Are you sure you want to reactivate the plan? Please note that the amount will be charged to your default payment method.",
      confirmButtonText: "Re-Activate",
      cancelButtonText: "Cancel",
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(preventCancelSubscriptionPlanAPI())
      }
    });
  }

  return (

    <div className="row m-4">
      <div className="col-9 mx-auto">
        <div className="p-3 d-flex flex-column align-items-baseline">
          <img src="/settings/subscription.svg" className={"bg-yellow10 p-3 rounded-4 border d-block"} />

          <div className="d-flex mt-3 justify-content-between w-100">
            <h5 className="text-nowrap m-0">Subscription Setup</h5>
            <Link className='m-0 blue100 text-decoration-none' to="/settings/subscription/payment-history">Payment history</Link>
          </div>

          <div className="mt-4 mb-3 fs-5">Your plan</div>

          <div className="w-100 border p-3 d-flex align-items-center" style={{ borderRadius: (status !== "canceled" ? "32px 32px 0 0" : "32px") }}>
            <img src="/settings/subscription/mini.svg" className={"bg-green10 p-3 rounded-4 d-block"} />

            <div className="flex-fill ms-3">
              <p className="fw-normal m-0 green100">{fullPlanDetails?.planType?.toLowerCase() == "lite" ? "Business: Lite" : "Business: Pro"}</p>
              <p className="m-0">
                {fullPlanDetails?.currency?.toUpperCase()} {(Number(fullPlanDetails?.amount) / 100).toFixed(2)} / month
              </p>
            </div>

            <div className="d-flex flex-column">

              <div className="d-flex gap-1">
                <p className={`m-0 ms-auto ${status === "active" ? "green100 bg-green10" : "yellow100 bg-yellow10"} py-1 my-1 px-3 rounded-pill d-inline`}>
                  {status?.toUpperCase()}
                </p>
                {(status === "past_due") &&
                  <a href={fullPlanDetails?.paymentUrl} className="btn btn-outline-dark rounded-pill fw-500" target="_blank">Pay Now</a>
                }
              </div>

              {(status === "past_due") && <p className="m-0">
                <span className="fw-normal">Due on: </span>
                {dayjs(fullPlanDetails?.currentPeriodStart * 1000).format("DD MMM YYYY")}
              </p>}

             

              {(status !== "canceled" && status !== "past_due") && <p className="m-0">
                <span className="fw-normal">Paid by: </span>
                {dayjs(fullPlanDetails?.currentPeriodStart * 1000).format("DD MMM YYYY")}
              </p>}
              {status === "canceled" && <p className="m-0">
                <span className="fw-normal">Canceled On: </span>
                {dayjs(fullPlanDetails?.currentPeriodEnd * 1000).format("DD MMM YYYY")}
              </p>}
            </div>
          </div>
          {status !== "canceled" && <div
            className="w-100 border-none border-start border-end border-bottom bg-light p-3 d-flex align-items-center"
            style={{ borderRadius: "0 0 32px 32px" }}
          >
            {/* <div className='bg-green100 text-white ps-5 pe-2 pt-4 rounded-4 pb-2'>
                  *265
                </div> */}

            {/* <div className='flex-fill ms-3'>
                  <p className='m-0'>Card 2947 **** **** 2655</p>
                  <p className='m-0 yellow100'>Change Card</p>
                </div> */}


            <div className="d-flex flex-column ms-auto">
              {!fullPlanDetails?.cancelAt && <p className="m-0">
                <span className="fw-normal">Next payment: </span>
                {dayjs(fullPlanDetails?.currentPeriodEnd * 1000).format("DD MMM YYYY")}
              </p>}
              {fullPlanDetails?.cancelAt &&
                <div className="d-flex flex-column flex-end">
                  <p className="m-0">
                    <span className="fw-normal">Your plan will be cancelled on: </span>
                    {dayjs(fullPlanDetails?.cancelAt * 1000).format("DD MMM YYYY")}
                  </p>
                  <button
                    type="button"
                    onClick={preventCancelSubscription}
                    target="_blank"
                    className="btn m-0 p-0 fw-500 ms-auto text-primary d-inline text-decoration-underline text-end"
                  >
                    Don't Cancel Subscription
                  </button>
                </div>}
              {!fullPlanDetails?.cancelAt && <button
                type="button"
                onClick={cancelSubscription}
                target="_blank"
                className="btn m-0 p-0 fw-500 ms-auto text-danger d-inline text-decoration-underline"
              >
                Cancel Subscription
              </button>}
            </div>
          </div>
          }

          {fullPlanDetails?.planType?.toLowerCase() === "lite" && status === "active" && <div className="mt-5 fs-5">Other Plans</div>}

          {(fullPlanDetails?.planType?.toLowerCase() === "lite" && status === "active") && (
            <div className="w-100 p-3 d-flex align-items-center my-3 rounded-5 shadow">
              <img src="/settings/subscription/pro.svg" className={"bg-blue10 p-3 rounded-4 d-block"} />

              <div className="flex-fill ms-3">
                <p className="fw-normal m-0 blue100">Business: Pro</p>
                <p className="m-0">USD 4.99 / month</p>
              </div>

              <button
                type="button"
                onClick={() => changePlan("pro")}
                className="btn btn-action d-flex flex-column rounded-4 fw-500 p-2 px-3"
              >
                Upgrade Plan
              </button>
            </div>
          )}
          {/* {(fullPlanDetails?.amount != 1000 && status==="active") && (
            <div className="w-100 p-3 d-flex align-items-center my-3 rounded-5 shadow">
              <img src="/settings/subscription/lite.svg" className={"bg-yellow10 p-3 rounded-4 d-block"} />

              <div className="flex-fill ms-3">
                <p className="fw-normal m-0 yellow100">Business: Lite</p>
                <p className="m-0">USD 10 / month</p>
              </div>

              <button
                type="button"
                onClick={() => changePlan("lite")}
                className="btn btn-action d-flex flex-column rounded-4 fw-500 p-2 px-3"
              >
                Degrade Plan
              </button>
            </div>
          )} */}

          <PaymentMethods />


          <Link
            to="/compare-plans"
            className="btn btn-action rounded-pill text-decoration-none mx-auto fw-500 my-3 px-3 py-2 mt-5"
          >
            {status === "canceled" ? "Re-activate Plan" : "Compare All Plans"}
          </Link>
        </div>
      </div>
    </div>

  )
}

export default ManageSubscription;