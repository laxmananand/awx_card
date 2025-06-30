import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./components/dashboard/Index";
import AccountsHome from "./components/accounts/Index";
import ExpenseHome from "./components/expense/pages/Expense";
import SettingsHome from "./components/settings/Index";
import PaymentsHome from "./components/payments/Index";
import BillPayment from "./components/payments/pages/BillPayment/index";
import Cards from "./components/expense/pages/Cards";
import Bills from "./components/expense/pages/Bills";
import CreateRequest from "./components/expense/pages/CreateBill";
import Verification from "./components/expense/pages/Invoices";
import CreateRequestinvoice from "./components/expense/pages/Invoice/CreateInvoice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider, useDispatch, useSelector } from "react-redux";

// Sign-up
import SignIn from "./components/Signup/pages/SignIn";
import Signup from "./components/Signup/pages/Signup";
import SignUpVerification from "./components/Signup/pages/SignUpVerification";
import BusinessDetails from "./components/Signup/pages/BusinessDetails";
import AccountSetup from "./components/Signup/pages/AccountSetup";
import AccountSetup2 from "./components/Signup/pages/AccountSetup2";
import Subscription from "./components/Signup/pages/Subscription";
import AccessControlHome from "./components/accessControl/Index";
import ForgotPassword from "./components/Signup/pages/ForgotPassword";
import TwoFactorAuth from "./components/Signup/pages/2FA";
import TemporaryPassword from "./components/Signup/pages/TemporaryPassword";

// Business details
import Onboarding from "./components/onboarding/Account";
import RFIDetails from "./components/onboarding/dashboard/tabs/rfiDetails";

import PaymentHistory from "./components/settings/tabs/Subscription/PaymentHistory";
import CompareAllPlans from "./components/settings/tabs/Subscription/CompareAllPlans";
// import Layout from "./components/structure/Layout";
import CreateCard from "./components/expense/pages/Cards/CreateCard/CreateCard";
import Profile from "./components/Profile/Profile";
import Auth from "./components/Signup/pages/Auth";
import PaymentTracker from "./components/payments/pages/Transactions/PaymentTracker";
import Loader from "./components/structure/Loader";
import LoaderTest from "./components/LoaderTest";
import PaymentRFI from "./components/payments/pages/Transactions/PaymentRFI";
import { getSubscription } from "./@redux/action/subscription";
import { CheckoutForm } from "./components/subscription/CheckoutFormV2";
import Session from "./components/expense/pages/Invoice/Session";

import { logout } from "./components/Signup/js/logout-function";
import Dashboardv2 from "./@pages_v2";
import Sidebar from "./@component_v2/SidebarV3";
import Layoutv2 from "./components/structure/Layoutv2";
import Layout from "./components/structure/Layout";
import { setExpanded } from "./@redux/features/common";
import Cardholders from "./@pages_v2/cardholders";
import Transactions from "./components/payments/pages/Transactions";

const AppRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const expanded = useSelector((state) => state.common.expanded);
  const dispatch = useDispatch();

  // Define the routes where Sidebar should not be shown
  const noSidebarRoutes = [
    "/",
    "/sign-up",
    "/verification",
    "/business-details",
    "/account-setup",
    "/account-setup-2",
    "/subscription",
    "/forgotpassword",
    "/2fa",
    "/temporary-password",
  ];

  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);
  const logo = useSelector((state) => state.settings?.branding?.logoUrl);

  return (
    <>
      {shouldShowSidebar && (
        <Sidebar
          onNavigate={(url) => navigate(url)}
          onLogout={() => console.log("Logged Out!")}
          logoUrl={logo || "/logo_new.svg"}
          expanded={expanded}
          setExpanded={setExpanded}
          dispatch={dispatch}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={<Layout children={<Auth Children={SignIn} />} />}
        />
        <Route path="/loader" element={<LoaderTest />} />
        <Route
          path="/sign-up"
          element={<Layout children={<Auth Children={Signup} />} />}
        />
        <Route
          path="/verification"
          element={<Layout children={<Auth Children={SignUpVerification} />} />}
        />
        <Route
          path="/business-details"
          element={<Layout children={<Auth Children={BusinessDetails} />} />}
        />
        <Route
          path="/account-setup"
          element={<Layout children={<Auth Children={AccountSetup} />} />}
        />
        <Route
          path="/account-setup-2"
          element={<Layout children={<Auth Children={AccountSetup2} />} />}
        />
        <Route
          path="/subscription"
          element={<Layout children={<Subscription />} />}
        />
        <Route
          path="/forgotpassword"
          element={<Layout children={<Auth Children={ForgotPassword} />} />}
        />
        <Route
          path="/2fa"
          element={<Layout children={<Auth Children={TwoFactorAuth} />} />}
        />
        <Route
          path="/temporary-password"
          element={<Layout children={<Auth Children={TemporaryPassword} />} />}
        />

        <Route
          path="/accounts/global-accounts"
          element={<Layoutv2 children={<AccountsHome />} />}
        />
        <Route
          path="/accounts/wallets"
          element={<Layoutv2 children={<AccountsHome />} />}
        />
        <Route
          path="/accounts/conversion"
          element={<Layoutv2 children={<AccountsHome />} />}
        />
        <Route
          path="/accounts/statements"
          element={<Layoutv2 children={<AccountsHome />} />}
        />
        <Route
          path="/payments"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        {/* <Route path="/payments/bill" element={<Layoutv2 children={<BillPayment />} />} /> */}
        <Route
          path="/payments/beneficiaries"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        <Route
          path="/payments/request-money"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        <Route
          path="/payments/send-money"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        <Route
          path="/payments/transactions"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        <Route
          path="/payments/request-money/create-request"
          element={<Layoutv2 children={<PaymentsHome />} />}
        />
        <Route
          path="/expense"
          element={<Layoutv2 children={<ExpenseHome />} />}
        />
        <Route
          path="/expense/invoices"
          element={<Layoutv2 children={<Verification />} />}
        />

        <Route
          path="/expense/bills"
          element={<Layoutv2 children={<Bills />} />}
        />
        <Route
          path="/payments/bills"
          element={<Layoutv2 children={<Bills />} />}
        />

        <Route
          path="/payments/bills/payments"
          element={<Layoutv2 children={<BillPayment />} />}
        />
        {/* <Route path="/success" element={<Layoutv2 children={<Successbillpayment />} />} /> */}
        <Route
          path="/payments/bills/createbill"
          element={<Layoutv2 children={<CreateRequest />} />}
        />
        <Route
          path="/expense/bills/createbill"
          element={<Layoutv2 children={<CreateRequest />} />}
        />
        <Route
          path="/expense/invoices/create-invoice"
          element={<Layoutv2 children={<CreateRequestinvoice />} />}
        />
        <Route
          path="/settings/*"
          element={<Layoutv2 children={<SettingsHome />} />}
        />
        <Route
          path="/settings/subscription/payment-history"
          element={<Layoutv2 children={<PaymentHistory />} />}
        />
        <Route
          path="/compare-plans"
          element={<Layoutv2 children={<CompareAllPlans />} />}
        />
        <Route
          path="/expense/corporate-cards"
          element={<Layoutv2 children={<Cards />} />}
        />
        <Route
          path="/expense/corporate-cards/create-card"
          element={<Layoutv2 children={<CreateCard />} />}
        />
        <Route
          path="/payments/track-payment"
          element={<Layoutv2 children={<PaymentTracker />} />}
        />
        <Route
          path="/payments/rfi"
          element={<Layoutv2 children={<PaymentRFI />} />}
        />
        <Route
          path="/onboarding/Home"
          element={<Layoutv2 children={<Onboarding />} />}
        />
        <Route
          path="/onboarding/rfi"
          element={<Layoutv2 children={<RFIDetails />} />}
        />
        <Route
          path="/access-control/*"
          element={<Layoutv2 children={<AccessControlHome />} />}
        />
        <Route path="/profile" element={<Layoutv2 children={<Profile />} />} />
        <Route path="/checkout" element={<CheckoutForm />} />
        <Route path="/session" element={<Layoutv2 children={<Session />} />} />
        <Route
          path="/dashboard"
          element={<Layoutv2 children={<Dashboardv2 />} />}
        />
        <Route
          path="/accounts"
          element={<Layoutv2 children={<AccountsHome />} />}
        />
        <Route
          path="/card-holders"
          element={<Layoutv2 children={<Cardholders />} />}
        />
        <Route
          path="/cards"
          element={<Layoutv2 children={<Cards />} />}
        />
       
      </Routes>
    </>
  );
};

export default AppRouter;
