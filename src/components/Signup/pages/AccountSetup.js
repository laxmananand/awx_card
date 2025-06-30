import React, { useEffect, useRef, useState } from "react";
import * as functions from "../js/account-setup.js";
import { useDispatch } from "react-redux";
import { openLoader, closeLoader } from "../../../@redux/features/common.js";
import { logout } from "../js/logout-function.js";
import "../css/accountSetUp.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";
import { ThreeDots } from "react-loader-spinner";
//Axios.defaults.withCredentials = true;

export default function Verification() {
  const [isLoading, setLoading] = useState(true);
  const [professionElements, setProfessionElements] = useState([]);
  const dispatch = useDispatch();

  const accountSelectOptionsRef = useRef();
  const errorDivRef = useRef();
  const errorSpanRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await functions.fetchUserPersonaDetails();
        // Handle the resolved data here

        const generatedProfessionElements = [];

        for (let i = 0; i < data.length; i++) {
          // Push JSX elements to the array
          (function (index) {
            generatedProfessionElements.push(
              <button
                className="acc1-basic-components-select1"
                key={index}
                onClick={() => toggleSelected(index)}
              >
                <div className="acc1-advanced-expense-management1">
                  {data[index].professionName}
                </div>
                <div
                  className="acc1-control-elements"
                  style={{ display: "none" }}
                >
                  <div className="acc1-rectangle-parent">
                    <div className="acc1-rectangle"></div>
                    <div className="acc1-checked">
                      <div className="acc1-group">
                        <img className="acc1-path-icon" alt="" src="path.svg" />
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })(i); // Immediately invoke the function with the current value of i
        }

        // Set the state with the array of JSX elements
        setProfessionElements(generatedProfessionElements);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data: " + error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();
  const moveToAccountSetup2 = () => {
    let errorDiv = errorDivRef.current;
    let span = errorSpanRef.current;

    let optionsRef = accountSelectOptionsRef.current;
    // Clone the array of JSX elements
    let options = [...optionsRef.children];

    let selectedOptions = [];

    for (var i = 0; i < options.length; i++) {
      if (options[i].className === "acc1-basic-components-select") {
        selectedOptions.push(options[i].children[0].innerText);
      }
    }

    if (selectedOptions.length === 0) {
      errorDiv.style.display = "block";
      span.innerText = "Please select an option to proceed.";
      span.style.color = "brown";
      return;
    }

    sessionStorage.setItem("UserPersona", selectedOptions.toString());

    // Swal.fire({
    //   icon: "success",
    //   text: "Ready to explore? User personas are in, features await!",
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     navigate("/account-setup-2");
    //   }
    // });

    navigate("/account-setup-2");
  };
  const goBack = () => {
    window.history.back();
  };

  const toggleSelected = (index) => {
    let optionsRef = accountSelectOptionsRef.current;
    // Get all the children elements
    let updatedElements = [...optionsRef.children];

    // Loop through all elements to deactivate them
    updatedElements.forEach((element, idx) => {
      if (idx === index) {
        // Activate the clicked element
        element.className = "acc1-basic-components-select";
        element.children[0].className = "acc1-advanced-expense-management";
        element.children[1].style.display = "block";
      } else {
        // Deactivate other elements
        element.className = "acc1-basic-components-select1";
        element.children[0].className = "acc1-advanced-expense-management1";
        element.children[1].style.display = "none";
      }
    });
  };

  return (
    <>
      <div className="acc1-sign-up">
        <div className="acc1-frame-parent">
          <div className="acc1-frame-group">
            <div className="acc1-text-button-wrapper">
              <div className="acc1-text-button">
                <img className="acc1-linear-iconsarrow-left" alt="" />

                <div className="acc1-more-wrapper">
                  <b className="acc1-more" onClick={goBack}>
                    {" "}
                    <img
                      className="acc1-linear-iconsarrow-left1"
                      loading="lazy"
                      alt=""
                      src="linear-iconsarrow-left.svg"
                    />
                    Back
                  </b>
                </div>
                <div className="acc1-linear-iconsplaceholder">
                  <div className="acc1-vector"></div>
                </div>
              </div>
            </div>
            <div className="acc1-progress-wrapper">
              <div className="acc1-progress">
                <img
                  className="acc1-progress-child"
                  loading="lazy"
                  alt=""
                  src="line-25.svg"
                />

                <img
                  className="acc1-progress-item"
                  loading="lazy"
                  alt=""
                  src="line-26.svg"
                />

                <img
                  className="acc1-progress-inner"
                  loading="lazy"
                  alt=""
                  src="line-27.svg"
                />
              </div>
            </div>
            <div className="acc1-complete-wrapper">
              <div className="acc1-complete">2/3 Complete</div>
            </div>
          </div>
          <div className="acc1-frame-wrapper main-div">
            <div className="acc1-who-are-you-parent">
              <h1 className="acc1-who-are-you d-flex flex-column text-center gap-2">
                <span
                  style={{
                    fontSize: "23px",
                    fontWeight: 600,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Let’s help you find the perfect account.
                </span>
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    letterSpacing: "-0.5px",
                    opacity: "50%",
                  }}
                >
                  Please choose the option that best describes you:
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    letterSpacing: "-0.5px",
                  }}
                >
                  I am a...
                </span>
              </h1>
              <div className="acc1-selects" ref={accountSelectOptionsRef}>
                {professionElements}
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
                className="acc1-text-button1"
                type="button"
                onClick={moveToAccountSetup2}
              >
                <div className="acc1-linear-iconsplaceholder1">
                  <div className="acc1-vector1"></div>
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

                <div className="acc1-linear-iconsplaceholder2">
                  <div className="acc1-vector2"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
