import React, { useState, useEffect } from "react";
import BreadCrumbs from "../../structure/BreadCrumbs";
import CardList from "./Cards/CardList";
import DetailsBar from "./Cards/DetailsBar";
import CreateNewCard from "./Cards/CreateNewCard";
import SideBar from "../../SideBar";
// import { listcards } from "../js/cards-functions";
import ContentLoader from "react-content-loader";
import "../css/card.css";
// import { useSelector } from "react-redux";
import CompareAllPlans from "../../Signup/pages/CompareAllPlans.js";
import ActivateAccount from "../../ActivateAccount.js";
import ManageSubscription from "../../settings/tabs/Subscription/ManageSubscription.js";
import { Link } from "react-router-dom";
import { listcards_awx } from "../../../@redux/action/cards.js";
import { useDispatch, useSelector } from "react-redux";
import { GenerateAuthToken } from "../../../@redux/action/auth.js";
import ColumnGroupingTable from "./utilis/table.js";

export function Cards() {
  const dispatch = useDispatch();

  const [showDetails, setShowDetails] = useState(false);
  const currencies = [true, true, true, true, false, false];
  const [apiCall, setApiCall] = useState(false);
  const [showArray, setShowArray] = useState(
    new Array(currencies.length).fill(false)
  );
  const [activeArray, setActiveArray] = useState(
    new Array(currencies.length).fill(false)
  );
  const [selectedRowData, setSelectedRowData] = useState();
  const [data, setData] = useState([]);
  const [showcardtable, setShowcardtable] = useState(true);
  const [carddata, setCarddata] = useState(true);

  const platform = useSelector((state) => state.common.platform);
  const awxAccountId = useSelector((state) => state.auth.awxAccountId);

  const authToken = useSelector((state) => state.common.authToken);
  const listCards = useSelector((state) => state.card?.cardsList);

  useEffect(() => {
    if (platform === "awx" && awxAccountId) {
      dispatch(GenerateAuthToken(awxAccountId));
      dispatch(listcards_awx(authToken, awxAccountId));
    }
  }, [platform, awxAccountId, dispatch]);
  // useEffect(() => {
  //   if (platform === "awx" && authToken) {
  //   }
  // }, [platform, authToken, dispatch]);

  const handleShow = (idx) => {
    const array = new Array(currencies.length).fill(false);
    array[idx] = true;
    setShowArray(array);
  };

  const handleActive = (idx) => {
    const array = new Array(currencies.length).fill(false);
    array[idx] = true;
    setActiveArray(array);
  };
  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
  };

  const status = useSelector((state) => state.subscription?.data?.status);
  //const status = "active";
  console.log(" sub status " + status);

  var complianceStatus = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
  );
  //var complianceStatus = "COMPLETED";

  var walletHashid = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.walletHashId
  );
  var customerHashId = useSelector(
    (state) => state.onboarding?.CustomerDetailsNIUM?.customerHashId
  );
  useEffect(() => {
    if (platform === "awx") {
      // setData(listCards);
      setShowcardtable(true);
      setApiCall(true);
    } else {
      if (complianceStatus === "COMPLETED") {
        setShowcardtable(true);
        listcards(walletHashid, customerHashId)
          .then((fetchedData) => {
            setApiCall(true);
            // Check if the fetched data is an array or has a valid response
            console.log("Data:", JSON.stringify(fetchedData));

            if (fetchedData === "No card has been added yet.") {
              console.log("No card found");
              setData([]);
              setCarddata(false);
            } else {
              setData(fetchedData);

              // Find the primary card and set its hash ID in session storage
              const primarycard = fetchedData.find(
                (item) => item.issuanceType === "primaryCard"
              );
              if (primarycard) {
                const primarycardhashid = primarycard.cardHashId;
                sessionStorage.setItem("primaryCardHashid", primarycardhashid);
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching cards:", error);
            // Optionally handle the error state here
          });
      } else {
        setShowcardtable(false);
      }
    }
  }, []);

  useEffect(() => {
    console.log("list cards: ", listCards);
  }, []);

  const refreshCardList = () => {
    listcards(walletHashid, customerHashId)
      .then((fetchedData) => {
        console.log("Fetched data:", fetchedData);

        if (fetchedData === "No card has been added yet.") {
          setData([]);
          setCarddata(false);
        } else {
          setData(fetchedData);

          // Optionally store the primary card in session storage
          const primaryCard = fetchedData.find(
            (card) => card.issuanceType === "primaryCard"
          );
          if (primaryCard) {
            sessionStorage.setItem("primaryCardHashid", primaryCard.cardHashId);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
      });
  };

  if (
    (status === undefined ||
      status === "inactive" ||
      status === "sub01" ||
      status === "sub02") &&
    showcardtable
  ) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Corporate Cards",
            img: "/arrows/arrowLeft.svg",
            // backurl: "/expense",
            backurl: "/dashboard",
            info: true,
          }}
        />
        <CompareAllPlans />
      </>
    );
  }

  if (!complianceStatus) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Corporate Cards",
            img: "/arrows/arrowLeft.svg",
            // backurl: "/expense",
            backurl: "/dashboard",
            info: true,
          }}
        />
        <ActivateAccount />
      </>
    );
  }
  if (complianceStatus !== "COMPLETED") {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Corporate Cards",
            img: "/arrows/arrowLeft.svg",
            // backurl: "/expense",
            backurl: "/dashboard",
            info: true,
          }}
        />

        <div className="d-flex ">
          <div className="m-3 w-100">
            <div className="row bg-white border p-4 d-flex rounded-3 w-100">
              <div
                className="rounded-5 bg-white d-flex flex-column border justify-content-center gap-3"
                style={{ padding: "5rem 9rem" }}
              >
                <div
                  className="rounded-circle bg-light-primary mx-auto mb-3"
                  style={{ marginTop: "30px" }}
                >
                  <img
                    src="/locked.svg"
                    style={{ marginTop: "10px" }}
                    width={100}
                  />
                </div>
                <h4
                  className="text-center"
                  style={{
                    fontSize: "18px",
                    lineHeight: "25px",
                    marginTop: "-15px",
                  }}
                >
                  Your account verification is currently in process. Please
                  await further updates on your
                  <Link
                    to="/onboarding/Home"
                    style={{ color: "#327e9d", textDecoration: "none" }}
                  >
                    {" compliance process"}
                  </Link>
                  .
                </h4>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  if (status === "canceled" && showcardtable) {
    return (
      <>
        <BreadCrumbs
          data={{
            name: "Corporate Cards",
            img: "/arrows/arrowLeft.svg",
            // backurl: "/expense",
            backurl: "/dashboard",
            info: true,
          }}
        />
        <ManageSubscription />
      </>
    );
  }

  if (!apiCall) {
    return (
      <>
        <div style={{ width: "100%", height: "100%" }}>
          <BreadCrumbs
            data={{
              name: "Corporate Cards",
              img: "/arrows/arrowLeft.svg",
              // backurl: "/expense",
              backurl: "/dashboard",
              info: true,
            }}
          />

          <ContentLoader
            width="100%"
            height="100%"
            viewBox="0 0 1000 550"
            backgroundColor="#eaeced"
            foregroundColor="#ffffff"
          >
            <rect x="51" y="45" rx="3" ry="3" width="906" height="17" />
            <circle cx="879" cy="123" r="11" />
            <circle cx="914" cy="123" r="11" />
            <rect x="104" y="115" rx="3" ry="3" width="141" height="15" />
            <rect x="305" y="114" rx="3" ry="3" width="299" height="15" />
            <rect x="661" y="114" rx="3" ry="3" width="141" height="15" />
            <rect x="55" y="155" rx="3" ry="3" width="897" height="2" />
            <circle cx="880" cy="184" r="11" />
            <circle cx="915" cy="184" r="11" />
            <rect x="105" y="176" rx="3" ry="3" width="141" height="15" />
            <rect x="306" y="175" rx="3" ry="3" width="299" height="15" />
            <rect x="662" y="175" rx="3" ry="3" width="141" height="15" />
            <rect x="56" y="216" rx="3" ry="3" width="897" height="2" />
            <circle cx="881" cy="242" r="11" />
            <circle cx="916" cy="242" r="11" />
            <rect x="106" y="234" rx="3" ry="3" width="141" height="15" />
            <rect x="307" y="233" rx="3" ry="3" width="299" height="15" />
            <rect x="663" y="233" rx="3" ry="3" width="141" height="15" />
            <rect x="57" y="274" rx="3" ry="3" width="897" height="2" />
            <circle cx="882" cy="303" r="11" />
            <circle cx="917" cy="303" r="11" />
            <rect x="107" y="295" rx="3" ry="3" width="141" height="15" />
            <rect x="308" y="294" rx="3" ry="3" width="299" height="15" />
            <rect x="664" y="294" rx="3" ry="3" width="141" height="15" />
            <rect x="58" y="335" rx="3" ry="3" width="897" height="2" />
            <circle cx="881" cy="363" r="11" />
            <circle cx="916" cy="363" r="11" />
            <rect x="106" y="355" rx="3" ry="3" width="141" height="15" />
            <rect x="307" y="354" rx="3" ry="3" width="299" height="15" />
            <rect x="663" y="354" rx="3" ry="3" width="141" height="15" />
            <rect x="57" y="395" rx="3" ry="3" width="897" height="2" />
            <circle cx="882" cy="424" r="11" />
            <circle cx="917" cy="424" r="11" />
            <rect x="107" y="416" rx="3" ry="3" width="141" height="15" />
            <rect x="308" y="415" rx="3" ry="3" width="299" height="15" />
            <rect x="664" y="415" rx="3" ry="3" width="141" height="15" />
            <rect x="55" y="453" rx="3" ry="3" width="897" height="2" />
            <rect x="51" y="49" rx="3" ry="3" width="2" height="465" />
            <rect x="955" y="49" rx="3" ry="3" width="2" height="465" />
            <circle cx="882" cy="484" r="11" />
            <circle cx="917" cy="484" r="11" />
            <rect x="107" y="476" rx="3" ry="3" width="141" height="15" />
            <rect x="308" y="475" rx="3" ry="3" width="299" height="15" />
            <rect x="664" y="475" rx="3" ry="3" width="141" height="15" />
            <rect x="55" y="513" rx="3" ry="3" width="897" height="2" />
            <rect x="52" y="80" rx="3" ry="3" width="906" height="17" />
            <rect x="53" y="57" rx="3" ry="3" width="68" height="33" />
            <rect x="222" y="54" rx="3" ry="3" width="149" height="33" />
            <rect x="544" y="55" rx="3" ry="3" width="137" height="33" />
            <rect x="782" y="56" rx="3" ry="3" width="72" height="33" />
            <rect x="933" y="54" rx="3" ry="3" width="24" height="33" />
          </ContentLoader>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="d-flex">
        <SideBar />
        <div
          className="container-fluid px-0 bg-light clear-left overflow-auto"
          style={{ height: "100vh" }}
        >
          <BreadCrumbs
            data={{
              name: "Corporate Cards",
              img: "/arrows/arrowLeft.svg",
              // backurl: "/expense",
              backurl: "/dashboard",
              info: true,
            }}
          />
          {carddata ? (
            <div className="d-flex flex-column w-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold" style={{fontSize: '2rem'}}>Manage Your Card(s)</h2>
                <div>
                  <CreateNewCard refreshCardList={refreshCardList} />
                </div>
              </div>
              {/* Card Grid Start */}
              <div className="row" style={{gap: '2rem 0'}}>
                {listCards && listCards.length > 0 ? (
                  listCards.map((card, idx) => (
                    <div key={card.cardHashId || idx} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch mb-4">
                      <div style={{
                        background: '#0a2342',
                        borderRadius: '16px',
                        color: 'white',
                        minHeight: '200px',
                        position: 'relative',
                        width: '100%',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                      }} className="p-4 d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span style={{writingMode: 'vertical-rl', textOrientation: 'mixed', fontWeight: 600, fontSize: '1rem', letterSpacing: '2px', color: '#fff8'}}>business</span>
                          <div>
                            <img src={card.brand === 'Mastercard' ? '/expense/card/mastercard.svg' : card.brand === 'Visa' ? '/expense/card/visa.svg' : '/expense/card/other-card.svg'} alt="brand" width={40} />
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <img src="/expense/card/chip.png" alt="chip" width={40} style={{marginRight: 8}} />
                          <div className="ms-auto">
                            <span className="fw-bold" style={{fontSize: '1.1rem', color: card.card_status === 'ACTIVE' ? '#2ecc40' : card.card_status === 'SUSPENDED' ? '#e74c3c' : '#f1c40f'}}>
                              <span className="me-2" style={{fontSize: 12, verticalAlign: 'middle'}}>
                                <i className="bi bi-circle-fill" style={{color: card.card_status === 'ACTIVE' ? '#2ecc40' : card.card_status === 'SUSPENDED' ? '#e74c3c' : '#f1c40f'}}></i>
                              </span>
                              {card.card_status}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-end mt-3">
                          <div>
                            <div style={{fontSize: 13, color: '#fff8'}}>Card Type</div>
                            <div className="fw-bold text-uppercase" style={{fontSize: 15}}>{card.cardType === 'VIR' ? 'VIRTUAL' : 'PHYSICAL'}</div>
                          </div>
                          <div className="text-end">
                            <div style={{fontSize: 13, color: '#fff8'}}>Last 4 Digits</div>
                            <div className="fw-bold" style={{fontSize: 15}}>{card.card_number?.replace(/\D/g, '').slice(-4)}</div>
                          </div>
                        </div>
                        {/* Action icons */}
                        <div style={{position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 8}}>
                          <button className="btn btn-light btn-sm rounded-circle mb-1" style={{boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}} title="Settings">
                            <i className="bi bi-gear"></i>
                          </button>
                          <button className="btn btn-light btn-sm rounded-circle" style={{boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}} title="View">
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <img src="/no_transactions.jpg" alt="no-cards" width={100} />
                    <p className="mt-3 fw-500" style={{fontSize: '15px', color: 'var(--main-color)'}}>No cards found.</p>
                  </div>
                )}
              </div>
              {/* Card Grid End */}
            </div>
          ) : (
            <ActivateAccount />
          )}
        </div>
      </div>
    </>
  );
}

export default Cards;
