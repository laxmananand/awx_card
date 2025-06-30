import React, { useEffect, useRef, useState } from "react";
import * as functions from "../js/account-setup-2.js";
import { useDispatch } from "react-redux";
import { openLoader, closeLoader } from "../../../@redux/features/common.js";
import { logout } from "../js/logout-function.js";
import "../css/accountSetUp2.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";
//Axios.defaults.withCredentials = true;

export default function Verification() {
  const [isLoading, setLoading] = useState(true);
  const [elements, setElements] = useState(null);
  const dispatch = useDispatch();

  const accountSelectOptionsRef = useRef();
  const errorDivRef = useRef();
  const errorSpanRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      //var UserPersonaValues = sessionStorage.getItem("UserPersona").split(",");
      var userPersona = "Solopreneur";

      try {
        setLoading(true);
        const inputObject = await functions.fetchUserPersonaFeatures(
          userPersona
        );
        setLoading(false);

        const data = Object.entries(inputObject).map(([key, value]) => {
          return { featureName: value };
        });

        const generatedProfessionElements = [];

        for (let i = 0; i < data.length; i++) {
          // Push JSX elements to the array
          (function (index) {
            generatedProfessionElements.push(
              <button
                className="acc2-basic-components-select1"
                key={index}
                onClick={() => toggleSelected(index)}
              >
                <div className="acc2-advanced-expense-management1">
                  {data[index].featureName}
                </div>
                <div
                  className="acc2-control-elements"
                  style={{ display: "none" }}
                >
                  <div className="acc2-advanced-features">
                    <div className="acc2-advanced-features1"></div>
                    <div className="acc2-checked">
                      <div className="acc2-group">
                        <div className="acc2-rectangle"></div>
                        <img className="acc2-path-icon" alt="" src="path.svg" />
                      </div>
                    </div>
                  </div>
                  <div className="acc2-div">Text</div>
                </div>
              </button>
            );
          })(i); // Immediately invoke the function with the current value of i
        }

        // Set the state with the array of JSX elements
        setElements(generatedProfessionElements);
      } catch (error) {
        console.error("Error fetching data: " + error);
      }
    };
    fetchData();
  }, []);
  const navigate = useNavigate();
  const moveToDashboard = () => {
    let errorDiv = errorDivRef.current;
    let span = errorSpanRef.current;

    let optionsRef = accountSelectOptionsRef.current;
    // Clone the array of JSX elements
    let options = [...optionsRef.children];

    let selectedOptions = [];

    for (var i = 0; i < options.length; i++) {
      if (options[i].className === "acc2-basic-components-select") {
        selectedOptions.push(options[i].children[0].innerText);
      }
    }

    if (selectedOptions.length === 0) {
      errorDiv.style.display = "block";
      span.innerText = "Please select one or more options to proceed.";
      span.style.color = "brown";
      return;
    }

    sessionStorage.setItem("UserFeatures", selectedOptions.toString());
    // Swal.fire({
    //   icon: "success",
    //   text: "Welcome aboard! Your journey with Zoqq begins now.",
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     navigate("/dashboard");
    //   }
    // });

    navigate("/dashboard");
  };

  const goBack = () => {
    window.history.back();
  };

  const toggleSelected = (index) => {
    let optionsRef = accountSelectOptionsRef.current;
    // Clone the array of JSX elements
    let updatedElements = [...optionsRef.children];

    if (updatedElements[index].className === "acc2-basic-components-select") {
      // Modify the clicked button to add the unselected class
      updatedElements[index].className = "acc2-basic-components-select1";
      updatedElements[index].children[0].className =
        "acc2-advanced-expense-management1";
      updatedElements[index].children[1].style.display = "none";
    } else {
      // Modify the clicked button to add the selected class
      updatedElements[index].className = "acc2-basic-components-select";
      updatedElements[index].children[0].className =
        "acc2-advanced-expense-management";
      updatedElements[index].children[1].style.display = "block";
    }
  };
  return (
    <>
      <div className="acc2-sign-up">
        <div className="acc2-frame-parent">
          <div className="acc2-text-button-wrapper">
            <div className="acc2-text-button">
              <img className="acc2-linear-iconsarrow-left" alt="" />

              <div className="acc2-more-wrapper">
                <b className="acc2-more" onClick={goBack}>
                  {" "}
                  <img
                    className="acc2-linear-iconsarrow-left1"
                    loading="lazy"
                    alt=""
                    src="linear-iconsarrow-left.svg"
                  />
                  Back
                </b>
              </div>
              <div className="acc2-linear-iconsplaceholder">
                <div className="acc2-vector"></div>
              </div>
            </div>
          </div>
          <div className="acc2-progress-wrapper">
            <div className="acc2-progress">
              <img
                className="acc2-progress-child"
                loading="lazy"
                alt=""
                src="line-25.svg"
              />

              <img
                className="acc2-progress-item"
                loading="lazy"
                alt=""
                src="line-25.svg"
              />

              <img
                className="acc2-progress-inner"
                loading="lazy"
                alt=""
                src="line-27.svg"
              />
            </div>
          </div>
          <div className="acc2-complete-wrapper">
            <div className="acc2-complete">3/3 Complete</div>
          </div>
        </div>
        <div className="acc2-sign-up-inner main-div">
          <div className="acc2-frame-group">
            <div className="acc2-what-do-you-want-to-use-parent">
              <h1 className="acc2-what-do-you d-flex flex-column text-center gap-2">
                <span
                  style={{
                    fontSize: "23px",
                    fontWeight: 600,
                    letterSpacing: "-0.5px",
                  }}
                >
                  What would you like to explore?
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    letterSpacing: "-0.5px",
                    opacity: "50%",
                  }}
                >
                  Choose the features you want to unlock:
                </span>
              </h1>
              <div className="acc2-selects" ref={accountSelectOptionsRef}>
                {elements}
              </div>
              <div
                className="inputs1"
                style={{ display: "none" }}
                ref={errorDivRef}
              >
                <div className="label-frame">
                  <div className="input-frame error-div">
                    <div className="left-content error-message">
                      <img src="error.svg" alt="" width={20} />
                      <span ref={errorSpanRef}>
                        Something went wrong, please try again later.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                disabled={isLoading}
                className="acc2-text-button1"
                type="button"
                onClick={moveToDashboard}
              >
                <div className="acc2-linear-iconsplaceholder1">
                  <div className="acc2-vector1"></div>
                </div>
                {isLoading ? (
                  <>
                    <ThreeDots
                      visible={true}
                      height="25"
                      width="30"
                      color="black"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </>
                ) : (
                  <>
                    <b className="biz-button">Continue</b>
                  </>
                )}
                <div className="acc2-linear-iconsplaceholder2">
                  <div className="acc2-vector2"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
