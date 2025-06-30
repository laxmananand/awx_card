import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/auth.css";
import FeaturesComponent from "./FeaturesComponent";
import "../css/auth.css";
import "animate.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./../js/logout-function";
import * as actions from "../../../@redux/action/onboardingAction";
import { RingLoader } from "react-spinners";

function Auth({ Children, showMenu = false }) {
  const [year, setYear] = useState("2023");
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYear(currentYear.toString());
  }, []);

  const dispatch = useDispatch();

  const isDashboardVisited = useSelector(
    (state) => state.onboarding.isDashboardVisited
  );
  useEffect(() => {
    if (isDashboardVisited) {
      logout();
    }
  }, [isDashboardVisited]);

  const [isLoading, setLoading] = useState(true);

  const res = useSelector((state) => state.onboarding?.ListCountryCode);

  useEffect(() => {
    const setPage = async () => {
      if (res.length > 0) {
        console.log(res);
        setLoading(false);
      } else {
        setLoading(true);
        try {
          await dispatch(actions.listCountry());
          await dispatch(actions.listNationality());
          await dispatch(actions.listCountryCode());
        } catch (error) {
          console.error("Error fetching lists:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    setPage();
  }, [res]);

  return (
    <>
      {isLoading ? (
        <>
          <div
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#fff",
              flexDirection: "column",
              gap: 15,
            }}
          >
            <RingLoader size={100} />
            <label htmlFor="">Preparing your experience...</label>
          </div>
        </>
      ) : (
        <>
          <div className="zoqq-sign-up-1-1">
            <FeaturesComponent />
            <Children />
          </div>

          <div className="zoqq-mobile">
            <Children />
          </div>
        </>
      )}
    </>
  );
}

export default Auth;
