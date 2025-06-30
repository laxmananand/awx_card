import React, { useEffect, useRef, useState } from "react";
import CustomSelect from "../../../structure/CustomSelect";
import { flag, getRateGraph } from "../../../../data/accounts/globalAccounts";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../../../loading_Skeleton/Skeleton.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getSymbolFromCurrency from "currency-symbol-map";
import { useDispatch, useSelector } from "react-redux";
import { getCurrencyList } from "../../../../@redux/action/accounts";
import "../../css/accounts.css";
import Select from "react-select";
import exchangeRates from "../../../../@component_v2/exchangeRates.json";
import Chart from "chart.js/auto"; // Import Chart.js
import { CircularProgress } from "@mui/material";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = date.getMonth();
  const year = date.getFullYear() % 100; // Get last two digits of the year

  // Add suffix to day
  const suffix = ["th", "st", "nd", "rd"][(day - 20) % 10] || "th";
  const formattedDay = day + suffix;

  return `${formattedDay} ${monthNames[monthIndex]}`;
}

function CurrencyGraph() {
  const currencies = useSelector((state) => state.accounts.currencyList);
  const dispatch = useDispatch();
  const custHashId = useSelector(
    (state) => state.onboarding?.UserOnboardingDetails?.customerHashId
  );

  const [selectCurr, setSelectCurr] = useState("USD");
  const [selectCurr2, setSelectCurr2] = useState("SGD");
  const [amount, setAmount] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [data, setData] = useState([]);
  const [xValues, setXValues] = useState([]);

  useEffect(() => {
    setXValues(
      exchangeRates?.dates?.map((item) => formatDate(item))?.slice(170)
    );
    const { USD, GBP, HKD, AUD, EUR } = exchangeRates;
    setData({ USD, GBP, HKD, AUD, EUR });
  }, []);

  useEffect(() => {
    if (isLoading) return;
    // const xValues = ["1 Apr", "4 Apr", "7 Apr", "10 Apr", "13 Apr", "16 Apr", "19 Apr", "22 Apr", "Today"];
    const yValues = data[selectCurr];

    if (chartInstance.current) {
      chartInstance.current.destroy(); // Destroy existing chart instance
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: xValues,
        datasets: [
          {
            data: yValues,
            borderColor: "black",
            fill: false,
            pointRadius: 0,
            tension: 0.4,
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 6, // Set maximum number of ticks
            },
          },
          y: {
            grid: {
              display: false, // Remove horizontal grid lines
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Cleanup on component unmount
      }
    };
  }, [selectCurr, xValues, isLoading]);

  const options = currencies.map((currency) => ({
    value: currency.name,
    label: (
      <div>
        <img
          src={`/Rounded_Flags/${currency.name.toLowerCase().slice(0, 2)}.svg`}
          alt={currency.name}
          width={24}
          height={24}
        />
        <> </>
        <strong className="ps-2">{currency.name}</strong>
      </div>
    ),
  }));

  const options2 = currencies.map((currency) => ({
    value: currency.name,
    label: (
      <div>
        <img
          src={`/Rounded_Flags/${currency.name.toLowerCase().slice(0, 2)}.svg`}
          alt={currency.name}
          width={24}
          height={24}
        />
        <> </>
        <strong className="ps-2">{currency.name}</strong>
      </div>
    ),
  }));

  useEffect(() => {
    dispatch(getCurrencyList(custHashId));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchRate = async () => {
      if (selectCurr && selectCurr2) {
        try {
          const rate = await getRateGraph(1, selectCurr2, selectCurr);
          setAmount(Number(rate));
          setIsLoading(false);
        } catch (error) {
          toast.error("Something went wrong! Please try again later.");
          setIsLoading(false);
        }
      }
    };

    fetchRate();
  }, [selectCurr, selectCurr2]);

  // Currency swap button
  const currencySwap = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (selectCurr && selectCurr2) {
      try {
        const rate = await getRateGraph(1, selectCurr, selectCurr2);
        setAmount(Number(rate));
        setSelectCurr(selectCurr2);
        setSelectCurr2(selectCurr);
        // setIsLoading(false);
      } catch (error) {
        toast.error("Something went wrong! Please try again later.");
        setIsLoading(false);
      }
    }
  };

  // Filter options to exclude "USD" if already selected
  const filteredOptions = options.filter(
    (option) => option.value !== selectCurr2
  );
  const filteredOptions2 = options.filter(
    (option) => option.value !== selectCurr
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "52px",
      width: "132px",
      height: "48px",
      background: "transparent",
      border: "1px solid rgba(0,0,0, 0.15)",
      paddingRight: 3,
    }),
    indicatorSeparator: () => null,
    menu: (provided) => ({
      ...provided,
      width: "132px",
      borderRadius: "10px",
      maxHeight: 200,
      overflowY: "auto",
      background: "white",
    }),
    menuList: (provided) => ({
      ...provided,
      width: "132px",
      borderRadius: "10px",
      maxHeight: 200, // Ensure the menu list also matches the dropdown menu width
      overflowY: "auto",
      background: "white",
    }),
  };

  if (isLoading) {
    return (
      <>
        <div
          className="bg-light-primary p-4 d-flex flex-column justify-content-center align-items-center gap-4"
          style={{ borderRadius: 32, width: "100%", height: 306 }}
        >
          <CircularProgress sx={{ color: "black" }} />
          <label htmlFor="" className="fs-6">
            Please wait while we're fetching your exchange rates...
          </label>
        </div>
      </>
    );
  }

  return (
    <div
      className="bg-light-primary p-4"
      style={{ borderRadius: 32, width: "100%", height: 306 }}
    >
      {location.pathname !== "/dashboard" ? (
        <>
          {/* Currency section */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-2 conversion-main">
            {/* First currency */}
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <h3 className="fw-bold mt-2">1</h3>
              <div className="col-6 col-md-4 grey1 rounded-3 text-wrap ms-3 me-3">
                <div
                  className="custom-select-container"
                  style={{ width: "100%" }}
                >
                  <Select
                    styles={customStyles}
                    value={options2.find(
                      (option) => option.value === selectCurr2
                    )}
                    onChange={(selectedOption) =>
                      setSelectCurr2(selectedOption.value)
                    }
                    options={filteredOptions2}
                  />
                </div>
              </div>
            </div>

            {/* Exchange button */}
            <div className="d-flex align-items-center justify-content-center mb-3 mb-md-0">
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  outline: "none",
                }}
                onClick={currencySwap}
              >
                <img
                  src="/exchange_colour.png"
                  width={25}
                  height={35}
                  alt="exchange icon"
                />
              </button>
            </div>

            {/* Second currency value */}
            <div className="d-flex align-items-center mb-3 mb-md-0 ms-3 mt-2">
              <h3 className="fw-bold text-nowrap">
                <SkeletonTheme baseColor="#D3D3D3	" highlightColor="#D4F1F4">
                  {isLoading ? (
                    <span className="fw-700">
                      <Skeleton
                        width={120}
                        height={25}
                        style={{ borderRadius: "10px" }}
                      />
                    </span>
                  ) : (
                    `${amount} ${selectCurr}`
                  )}
                </SkeletonTheme>
              </h3>
            </div>

            {/* Second currency select  */}
            <div className="col-6 col-md-4 grey1 rounded-3 text-wrap ms-3">
              <div
                className="custom-select-container"
                style={{ width: "100%" }}
              >
                <Select
                  styles={customStyles}
                  value={options.find((option) => option.value === selectCurr)}
                  onChange={(selectedOption) =>
                    setSelectCurr(selectedOption.value)
                  }
                  options={filteredOptions}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-start">
            <div
              style={{ gap: 8 }}
              className="d-flex flex-column justify-content-center align-items-start"
            >
              <label style={{ fontSize: 16, fontWeight: 600 }}>
                Exchange Rate
              </label>

              <div
                className="d-flex justify-content-start align-items-center gap-2 fw-600"
                style={{ fontSize: 30 }}
              >
                <label htmlFor="">1</label>
                <label htmlFor="">{selectCurr}</label>
                <label htmlFor="">=</label>
                <label htmlFor="">{amount}</label>
                <label htmlFor="">{selectCurr2}</label>
              </div>
            </div>

            <Select
              styles={customStyles}
              value={options.find((option) => option.value === selectCurr2)}
              onChange={(selectedOption) =>
                setSelectCurr2(selectedOption.value)
              }
              options={filteredOptions}
            />
          </div>
        </>
      )}

      <div className="conversion-main-mobile">
        <div className="conversion-main-mobile-div">
          <span>1.00 {selectCurr2}</span>
          <Select
            value={options2.find((option) => option.value === selectCurr2)}
            onChange={(selectedOption) => setSelectCurr2(selectedOption.value)}
            options={filteredOptions2}
          />
        </div>

        <img
          src="/exchange_colour.png"
          width={25}
          height={35}
          alt="exchange icon"
          onClick={currencySwap}
        />

        <div className="conversion-main-mobile-div">
          <SkeletonTheme baseColor="#D3D3D3	" highlightColor="#D4F1F4">
            {isLoading ? (
              <span className="fw-700">
                <Skeleton
                  width={120}
                  height={25}
                  style={{ borderRadius: "10px" }}
                />
              </span>
            ) : (
              `${amount} ${selectCurr}`
            )}
          </SkeletonTheme>
          <Select
            value={options.find((option) => option.value === selectCurr)}
            onChange={(selectedOption) => setSelectCurr(selectedOption.value)}
            options={filteredOptions}
          />
        </div>
      </div>

      {/* Exchange rate graph (responsive canvas) */}
      <div className="mt-4">
        <canvas
          ref={chartRef}
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "auto",
            maxHeight: "160px",
          }}
        ></canvas>
      </div>
    </div>
  );
}

export default CurrencyGraph;
