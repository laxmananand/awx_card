import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/Cards.css";
import { useSelector } from "react-redux";

function Card({ isActivated }) {
  const subStatus = useSelector((state) => state.subscription?.data?.status);
  const complianceStatus = sessionStorage.getItem("complianceStatus");
  const [subscription, setSubscription] = useState("inactive");
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    if (subStatus && complianceStatus) {
      setSubscription(subStatus);
      setKycStatus(complianceStatus);
    }
  }, [subscription, complianceStatus]);
  return (
    <div className="bg-white m-3 pb-3 border">
      <div className="d-flex align-items-center justify-content-between bg-white p-4">
        <div className="d-flex">
          <img src="/card.svg" />
          <h4 className="m-0 ms-2">Cards</h4>
        </div>

        {isActivated && (
          <Link
            to="/expense/corporate-cards"
            className="text-decoration-none blue100 m-0"
          >
            {/* View All */}
          </Link>
        )}
      </div>
      {!isActivated ? (
        <>
          <div className="d-flex justify-content-center">
            <div>
              <img src="/lock_3.svg" className=" border p-3 bg-grey" />
            </div>
          </div>

          <p className="text-center pb-5 mb-5 mt-2 p-3">
            <span className="fw-normal">
              You don't have any cards yet.
              <br />
              To create cards, you need to
            </span>
            {kycStatus === "COMPLETED" && subscription === "inactive" ? (
              <>
                <Link to="/settings/subscription" className="blue100 mx-1">
                  Subscribe
                </Link>
              </>
            ) : (
              <>
                <Link to="/onboarding/Home" className="blue100 mx-1">
                  Activate Your Account
                </Link>
              </>
            )}
            <span className="fw-normal"> first.</span>
          </p>
        </>
      ) : (
        // <div className="d-flex">
        //   <p className="text-center pb-5 mb-5 mt-2 p-3">
        //     <span className="fw-normal">
        //       You don't have any cards yet.
        //       <br />
        //       To create cards, you need to
        //     </span>
        //     <Link to="/onboarding" className="blue100">
        //       Activate Your Account
        //     </Link>
        //     <span className="fw-normal"> first.</span>
        //   </p>
        //   {/* <img className="mx-auto mb-3" src="card_image.svg" /> */}
        // </div>

        <>
          <div className="cards-active-main">
            <div className="cards-locked-container">
              <div className="d-flex justify-content-center my-3">
                <div style={{ border: "1px solid grey" }}>
                  <img src="/lock_3.svg" className="p-3 bg-grey" />
                </div>
              </div>
              <p className="text-center mt-2 p-3">
                <span className="fw-500">
                  You don't have any cards yet.
                  <br />
                  To add cards,{" "}
                </span>
                <Link to="/expense/corporate-cards" className="blue100">
                  Click Here
                </Link>
                <span className="fw-normal"> .</span>
              </p>
            </div>

            <div className="cards-container">
              <div class="cards-main-div">
                <div class="card-inner">
                  <div class="card-front">
                    <img
                      src="https://i.ibb.co/PYss3yv/map.png"
                      class="map-img"
                    />
                    <div class="card-front-row">
                      <img
                        src="https://i.ibb.co/G9pDnYJ/chip.png"
                        width="60px"
                      />
                      <img
                        src="https://i.ibb.co/WHZ3nRJ/visa.png"
                        width="60px"
                      />
                    </div>
                    <div class="card-front-row card-no">
                      <p>XXXX</p>
                      <p>XXXX</p>
                      <p>XXXX</p>
                      <p>XXXX</p>
                    </div>
                    <div class="card-front-row card-holder">
                      <p>CARD HOLDER NAME</p>
                      <p>EXPIRY DATE</p>
                    </div>
                    <div class="card-front-row name">
                      <p>HOLDER NAME</p>
                      <p>MM/DD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Card;
