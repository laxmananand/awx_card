import React, { useState, useRef, useEffect } from "react";
import Header from "../@component_v2/Header";
import AccountSummary from "../@component_v2/AccountSummary";
import ZeroExpense from "../@component_v2/ZeroExpense";
import Currencies from "../@component_v2/Currencies";
import RecentTransactionV2 from "../@component_v2/RecentTransaction";
import ExpenseManagementV2 from "../@component_v2/ExpenseManagement";
import Sidebar from "../@component_v2/Sidebar";
import { toast } from "react-toastify";
import Axios from "axios";
import { resolvePath, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { AuthUser } from "../components/onboarding/dashboard/tabs/functions/utility-details-function";
import * as utilities from "../components/onboarding/dashboard/tabs/functions/utility-details-function";
import {
  closeLoader,
  openLoader,
  setCardholderId,
  setCustomerHashId,
  setDashboardType,
} from "../@redux/features/common";
import "./indexNew.css";
import BannerSvgComponent from "../@component_v2/BannerSvgComponent";
import { ClipLoader, MoonLoader, ScaleLoader } from "react-spinners";
import { setCurrentTab } from "../@redux/features/onboardingFeatures";

import * as actions from "../@redux/action/onboardingAction";
import {
  setRegion,
  setContactName,
  setActivated,
  setDashboardVisited,
} from "../@redux/features/onboardingFeatures";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Divider,
  Drawer,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material";
import { getbrandingDetails } from "../@redux/action/settings";
import { getSubscription } from "../@redux/action/subscription";
import CurrencyGraph from "../components/accounts/tabs/CurrencyConversion/CurrencyGraphConversion";
import { setDashboardLoading } from "../@redux/features/auth";
import {
  CreateAccountAWX,
  fetchAccountAWX,
  fetchCardDetailsAWX,
  GenerateAuthToken,
} from "../@redux/action/auth";
import Cards from "../components/expense/pages/Cards";
import CustomTable from "../components/structure/NewStructures/CustomTable";
import {
  Block,
  Close,
  Code,
  ExpandMore,
  MoreHoriz,
  Password,
  ReplayCircleFilled,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";
import CardComponent from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
Axios.defaults.withCredentials = true;

export const CardDetails = ({ data }) => {
  const fields = [
    { label: "Purpose", value: data.purpose },
    { label: "Nick Name", value: data.nick_name },
    { label: "Brand", value: data.brand },
    { label: "Form Factor", value: data.form_factor },
    { label: "Created By", value: data.created_by },
    { label: "Program Type", value: data.program?.type },
    { label: "Program Purpose", value: data.program?.purpose },
    { label: "Name on Card", value: data.name_on_card },
    {
      label: "Transaction Currency",
      value: data.authorization_controls?.transaction_limits?.currency,
    },
  ];

  const limits = data.authorization_controls?.transaction_limits?.limits || [];

  return (
    <div>
      {fields.map(
        (item, idx) =>
          item.value && (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "5px",
              }}
            >
              <label className="fs-8 text-dark text-start fw-bold">
                {item.label} :
              </label>
              <label className="fs-8 text-secondary text-end">
                {item.value}
              </label>
            </div>
          )
      )}

      {limits.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h5 className="text-dark fw-bold mb-2">Transaction Limits:</h5>
          {limits.map((limit, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                paddingBottom: "4px",
                borderBottom: "1px dashed #aaa",
              }}
            >
              <label className="fs-8 text-dark fw-bold">
                {limit.interval.replace("_", " ")} Limit
              </label>
              <label className="fs-8 text-secondary">
                {limit.amount.toLocaleString()}
                {data.authorization_controls?.transaction_limits?.currency}{" "}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function Dashboard() {
  const location = useLocation();
  const [a, setA] = useState("");
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subStatus = useSelector((state) => state.subscription?.data?.status);
  const plan = useSelector((state) => state.subscription?.data?.plan);
  const countryList = useSelector((state) => state.onboarding?.ListCountryZOQQ);
  const countryCodeList = useSelector(
    (state) => state.onboarding?.ListCountryCode
  );
  const nationalityList = useSelector(
    (state) => state.onboarding?.ListNationality
  );

  let complianceStatus = useSelector(
    (state) =>
      state.onboarding?.CustomerDetailsNIUM?.complianceStatus ||
      state.onboarding?.CustomerDetailsNIUM?.status
  );

  const cognitoDetails = useSelector(
    (state) => state.onboarding?.UserCognitoDetails
  );
  const fetchDetails = useSelector((state) => state.onboarding?.UserStatusObj);
  const activated = useSelector((state) => state.onboarding?.isActivated);

  let customerDetails = useSelector(
    (state) => state.onboarding.CustomerDetailsNIUM
  );

  let platform = useSelector((state) => state.common.platform);
  const authToken = useSelector((state) => state.common.authToken);
  const cardholderId = useSelector((state) => state.common.cardholderId);

  const [cardLoading, setCardLoading] = useState(false);
  const [cardDetailsLoading, setCardDetailsLoading] = useState(false);

  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

  const [openDrawer, setOpenDrawer] = useState(false);

  const [activeCardDetails, setActiveCardDetails] = useState(null);

  const handleCloseDrawer = () => {
    setActiveCard(null);
    setOpenDrawer(false);
  };

  // 1. Define the columns
  const columns = [
    { id: "brand", label: "Brand" },
    { id: "card_number", label: "Card Number" },
    { id: "card_status", label: "Status" },
    { id: "created_at", label: "Created At" },
    { id: "updated_at", label: "Updated At" },
    { id: "actions", label: "" },
  ];

  // 2. Convert `cards` to rows
  const rows = cards.slice(0, 2).map((card) => ({
    brand:
      card.brand == "VISA" ? (
        <>
          <img src="/expense/card/visa.svg" alt="" width={50} height={30} />
        </>
      ) : (
        card.brand
      ),
    card_number: card.card_number,
    card_status: (
      <span
        className={`${
          card.card_status === "ACTIVE"
            ? "bg-success text-white"
            : card.card_status === "INACTIVE"
            ? "bg-secondary text-white"
            : card.card_status === "PENDING"
            ? "bg-warning text-dark"
            : "bg-danger text-white"
        } fw-500 px-4 py-2 fs-8 rounded-pill`}
      >
        {card.card_status}
      </span>
    ),
    created_at: card.created_at?.slice(0, 10),
    updated_at: card.updated_at?.slice(0, 10),
    actions: (
      <MoreHoriz
        onClick={() => {
          setActiveCard(card);
          setOpenDrawer(true);
        }}
      />
    ),
  }));

  const FetchCards = async (id, type) => {
    try {
      setCardLoading(true);
      let cardsResponse = await dispatch(
        fetchCardDetailsAWX("", authToken, type)
      );
      if (cardsResponse.items && cardsResponse.items.length > 0) {
        setCards(cardsResponse.items);
        return cardsResponse.items;
      }

      return false;
    } catch (e) {
      console.log(e);
    } finally {
      setCardLoading(false);
    }
  };

  useEffect(() => {
    const updateUserAttributes = (userAttr) => {
      const contactName = userAttr.find(
        (attr) => attr.name === "custom:contactName"
      )?.value;
      const countryCode = userAttr.find(
        (attr) => attr.name === "custom:countryName"
      )?.value;

      const adminFlag = userAttr.find(
        (attr) => attr.name === "custom:adminflag"
      )?.value;

      const userType = userAttr.find(
        (attr) => attr.name === "custom:userType"
      )?.value;

      if (adminFlag && adminFlag === "CARDHOLDER" && userType) {
        dispatch(setDashboardType(adminFlag));
        dispatch(setCardholderId(userType));
      }

      if (contactName) {
        dispatch(setContactName(contactName));
        sessionStorage.setItem("contactName", contactName);
      }

      if (countryCode) {
        const matchedCountry = countryList.find(
          (c) => c.ISOcc_2char === countryCode
        );
        if (matchedCountry) {
          dispatch(setRegion(matchedCountry.region));
          sessionStorage.setItem("region", matchedCountry.region);
        }
      }

      return userType;
    };

    const SetPageGeneric = async (isNium) => {
      try {
        await AuthUser();
        dispatch(setDashboardVisited(true));
        setLoading(true);
        dispatch(setDashboardLoading(true));

        const userAttr = cognitoDetails.userAttributes;
        if (userAttr?.length) {
          let res = updateUserAttributes(userAttr);
          await FetchCards(res);
        } else {
          console.log(
            "No registration found for the following email: " + email
          );
        }
      } catch (e) {
        console.error("Dashboard setup error:", e);
      } finally {
        setLoading(false);
        dispatch(setDashboardLoading(false));
      }
    };

    SetPageGeneric(platform === "nium");
  }, [subStatus, activated, complianceStatus]);

  const [cardToken, setCardToken] = useState("");
  const [hash, setHash] = useState("");

  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const handleFetchCardDetails = async () => {
    try {
      setCardDetailsLoading(true);

      const params = {
        cardId: activeCard?.card_id,
        // accountId: accountId,
        authToken,
      };
      let res = await axios.get(
        sessionStorage.getItem("baseUrl") + "/awx/card-details-awx",
        { params }
      );

      let obj = res.data;
      if (obj.card_number) {
        setState({
          number: obj.card_number,
          expiry: `${String(obj.expiry_month).padStart(2, "0")}/${
            obj.expiry_year
          }`,
          cvc: obj.cvv,
          name: obj.name_on_card,
          focus: "",
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setCardDetailsLoading(false);
    }
  };

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleFetchCardInfo = async () => {
    try {
      const params = {
        cardId: activeCard?.card_id,
        authToken,
      };
      const res = await axios.get(
        sessionStorage.getItem("baseUrl") + "/awx/card-info-awx",
        { params }
      );

      const obj = res.data;
      if (obj?.card_id) {
        setActiveCardDetails(obj);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCardUpdate = async (body) => {
    try {
      setCardDetailsLoading(true);
      const params = {
        cardId: activeCard?.card_id,
        authToken,
      };

      const res = await axios.post(
        sessionStorage.getItem("baseUrl") + "/awx/card-update-awx",
        body,
        { params }
      );

      const obj = res.data;
      if (obj?.card_id) {
        let listCards = await FetchCards("", "update");
        if (listCards.length > 0) {
          let a = listCards?.find(
            (item) => item.card_id === activeCard?.card_id
          );
          setActiveCard(a);
          toast.success("Card updated successfully!");
        } else {
          toast.success("Failed to update card, try again later!");
          handleCloseDrawer();
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setCardDetailsLoading(false);
    }
  };

  const handleAccordionChange = (event, expanded) => {
    setIsAccordionOpen(expanded);
    if (expanded && !activeCardDetails) {
      handleFetchCardInfo();
    }
  };

  const handleFetchToken = async () => {
    try {
      const params = {
        cardId: activeCard?.card_id,
        // accountId: accountId,
        authToken,
      };
      let res = await axios.post(
        sessionStorage.getItem("baseUrl") + "/expense/card-token",
        { params }
      );
      if (res.data.token) {
        setCardToken(res.data.token);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  useEffect(() => {
    if (cardToken) {
      const hash = {
        token: cardToken,
        rules: {
          ".details": {
            backgroundColor: "#2a2a2a",
            color: "white",
            borderRadius: "20px",
            fontFamily: "Arial",
          },
          ".details__row": {
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
          },
          ".details__label": {
            width: "100px",
            fontWeight: "bold",
          },
          ".details__content": { display: "flex" },
          ".details__button svg": { color: "white" },
        },
      };

      const hashURI = encodeURIComponent(JSON.stringify(hash));
      setHash(hashURI);
    }
  }, [cardToken, state]);

  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const date = new Date();
    const options = { weekday: "long", month: "long", day: "2-digit" };
    setCurrentDate(date.toLocaleDateString("en-US", options));
    const hours = date.getHours();
    if (hours < 12) setGreeting("Good Morning!");
    else if (hours < 18) setGreeting("Good Afternoon!");
    else setGreeting("Good Evening!");
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <section id="dashboard" className="px-5 py-4 opacity-50">
            <div
              className="heading-loader d-flex justify-content-between mb-4 align-items-center"
              style={{ height: 48 }}
            >
              {/* Header Skeleton */}
              <div className="header-text">
                {" "}
                <Skeleton
                  animation="wave"
                  variant="text"
                  style={{ borderRadius: "32px" }}
                  width={"300px"}
                />
                <Skeleton
                  animation="wave"
                  variant="text"
                  style={{ borderRadius: "32px" }}
                  width={"200px"}
                />
              </div>
              <div className="header-profile d-flex gap-2">
                {/* <Skeleton
                  animation="wave"
                  variant="circular"
                  width={50}
                  height={50}
                /> */}
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={48}
                  height={48}
                />
              </div>
            </div>

            <>
              <div className="loader-blocks">
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  style={{ borderRadius: "32px" }}
                  height={306}
                  width={"55%"}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  style={{ borderRadius: "32px" }}
                  height={306}
                  width={"45%"}
                />
              </div>

              <div className="loader-blocks">
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  style={{ borderRadius: "32px" }}
                  height={306}
                  width={"55%"}
                />
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  style={{ borderRadius: "32px" }}
                  height={306}
                  width={"45%"}
                />
              </div>
            </>
          </section>
        </>
      ) : (
        <section id="dashboard" className="px-5 py-4" style={{ background: '#f5faff', minHeight: '100vh' }}>
          {/* Greeting and Date */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <div style={{ fontSize: "14px", color: "#099cbc" }}>{currentDate}</div>
              <div style={{ fontSize: "24px", fontWeight: 600, color: '#09212f' }}>{greeting} AWX!</div>
            </div>
            <div>
              <IconButton>
                <img src="/profile/avatar.svg" alt="profile" width={40} />
              </IconButton>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="d-flex gap-4 mb-4">
            <div className="bg-white rounded-4 shadow p-4 flex-fill d-flex flex-column align-items-start" style={{ minWidth: 200, borderLeft: '6px solid #099cbc' }}>
              <div style={{ fontSize: 18, color: "#099cbc" }}>Current Balance</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#09212f" }}>$ 5.10</div>
            </div>
            <div className="bg-white rounded-4 shadow p-4 flex-fill d-flex flex-column align-items-start" style={{ minWidth: 200, borderLeft: '6px solid #299e58' }}>
              <div style={{ fontSize: 18, color: "#299e58" }}>Total Credit</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#299e58" }}>$ 1.00</div>
            </div>
            <div className="bg-white rounded-4 shadow p-4 flex-fill d-flex flex-column align-items-start" style={{ minWidth: 200, borderLeft: '6px solid #e0990c' }}>
              <div style={{ fontSize: 18, color: "#e0990c" }}>Total Debit</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#e0990c" }}>$ 0.00</div>
            </div>
          </div>

          {/* Main Content: Recent Transactions + My Cards */}
          <div className="d-flex gap-4">
            {/* Recent Transactions */}
            <div className="flex-fill bg-white rounded-4 shadow p-4" style={{ minWidth: 0 }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{ fontSize: 20, fontWeight: 600, color: '#09212f' }}>Recent Transactions</div>
                <div style={{ fontSize: 14, color: "#099cbc" }}>Last 30 days</div>
              </div>
              <table className="table">
                <thead>
                  <tr style={{ background: "#099cbc", color: "#fff" }}>
                    <th>Date</th>
                    <th>Receiver</th>
                    <th>Status</th>
                    <th>Info</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example static data, replace with real data as needed */}
                  <tr>
                    <td>Jun 26, 2025</td>
                    <td>PP Consumer</td>
                    <td style={{ color: "#299e58", fontWeight: 600 }}>SUCCESS</td>
                    <td>00000234000000002A330000000002E79/Card se...</td>
                  </tr>
                  <tr>
                    <td>Jun 12, 2025</td>
                    <td>SELF</td>
                    <td style={{ color: "#299e58", fontWeight: 600 }}>SUCCESS</td>
                    <td>1d1b4a24013aa3fae69c2a6d18393f6d/Money Tra...</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* My Cards Section */}
            <div className="bg-white rounded-4 shadow p-4" style={{ minWidth: 340, maxWidth: 400 }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div style={{ fontSize: 20, fontWeight: 600, color: '#09212f' }}>My Cards</div>
                <a href="/cards" style={{ fontSize: 14, color: "#099cbc", textDecoration: "none" }}>View All</a>
              </div>
              <div style={{ fontSize: 14, color: "#299e58", marginBottom: 8 }}>Active</div>
              {/* Show only first two cards visually */}
              {cards.slice(0, 2).map((card, idx) => (
                <div key={card.card_id || idx} className="mb-4">
                  <div style={{
                    background: "linear-gradient(135deg, #099cbc 60%, #299e58 100%)",
                    borderRadius: 18,
                    color: "#fff",
                    padding: 20,
                    minWidth: 300,
                    minHeight: 170,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    position: "relative"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>business</span>
                      <span style={{ fontSize: 12, color: "#fff", fontWeight: 700, background: '#299e58', borderRadius: 8, padding: '2px 10px' }}>
                        ACTIVE
                      </span>
                      <img src="/expense/card/visa.svg" alt="VISA" width={40} />
                    </div>
                    <div style={{ margin: "24px 0 8px 0", fontSize: 18, letterSpacing: 2 }}>
                      Card Type <span style={{ fontWeight: 700 }}>{card.form_factor || "VIRTUAL"}</span>
                    </div>
                    <div style={{ fontSize: 16 }}>
                      Last 4 Digits <span style={{ fontWeight: 700 }}>{card.card_number?.slice(-4)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Dashboard;
