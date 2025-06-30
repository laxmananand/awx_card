import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import Payments from "./Payments";
import Beneficiaries from "./pages/Beneficiaries";
import { useLocation } from "react-router-dom";
import RequestMoney from "./pages/ReceiveMoney";
import SendMoney from "./pages/SendMoney";
import Transactions from "./pages/Transactions";
import CreateRequest from "./pages/ReceiveMoney/CreateRequest/CreateRequest";
import { AuthUser } from "../onboarding/dashboard/tabs/functions/utility-details-function.js";
import { useDispatch, useSelector } from "react-redux";
import * as paymentreducer from "../../@redux/features/payments";

import {
  listbeneficiaries,
  fetchCurrency,
  listpurposeCode,
  getCurrencyAndCountry,
} from "../../@redux/action/payments";
import { listBeneficiary_awx } from "../../@redux/action/payments.js";
import Sidebar from "../../@component_v2/Sidebar";

import { GenerateAuthToken } from "../../@redux/action/auth.js";

function PaymentsHome() {
  // const customerHashId = sessionStorage.getItem("customerHashId");
  const dispatch = useDispatch();
  const beneficiaries = useSelector((state) => state.payments.beneficiaryList);
  const sourceCurrency = useSelector((state) => state.payments.sourceCurrency);
  const purposeCodeList = useSelector(
    (state) => state.payments.purposeCodeList
  );

  const platform = useSelector((state) => state.common.platform);

  let complianceStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
  );
  let customerHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );
  const awxAccountId = useSelector((state) => state.auth.awxAccountId);

  const authToken = useSelector((state) => state.common.authToken);
  // 🔁 Fetch new auth token when awxAccountId is available
  useEffect(() => {
    if (platform === "awx" && awxAccountId) {
      dispatch(GenerateAuthToken(awxAccountId));
      dispatch(listBeneficiary_awx(awxAccountId, authToken));
    }
  }, [platform, awxAccountId]);

  // if (platform === "awx") {
  //   dispatch(listBeneficiary_awx(awxAccountId, authToken));
  // }

  const ResetStates = async () => {
    if (platform === "awx") {
      dispatch(listBeneficiary_awx(awxAccountId, authToken));
    } else {
      dispatch(listbeneficiaries(customerHashId));
    }
    dispatch(fetchCurrency(customerHashId));
    dispatch(listpurposeCode(customerHashId));
    dispatch(getCurrencyAndCountry());
    dispatch(paymentreducer.setIsSuccess(null));
    dispatch(paymentreducer.resetPayload());
    dispatch(paymentreducer.resetSetSendMoneyRes());
    dispatch(paymentreducer.setSelectedBeneficiary({}));
  };

  const location = useLocation();
  const [url, setUrl] = useState();

  useEffect(() => {
    const Auth = async () => {
      await AuthUser();
    };
    Auth();
  }, []);

  useEffect(() => {
    // await AuthUser();
    setUrl(location.pathname);
    if (customerHashId) {
      ResetStates();
    }
  }, [location.pathname]);

  return (
    <div>
      {/* <Sidebar/> */}
      <div className="d-flex">
        {/* <SideBar /> */}
        <div
          className="container-fluid px-0 bg-light clear-left overflow-auto"
          style={{ height: "100%", overflowY: "auto" }}>
          {url === "/payments" ? (
            <Payments />
          ) : url === "/payments/beneficiaries" ? (
            <Beneficiaries />
          ) : url === "/payments/request-money" ? (
            <RequestMoney />
          ) : url === "/payments/send-money" ? (
            <SendMoney />
          ) : url === "/payments/transactions" ? (
            <Transactions />
          ) : url === "/payments/request-money/create-request" ? (
            <CreateRequest />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentsHome;
