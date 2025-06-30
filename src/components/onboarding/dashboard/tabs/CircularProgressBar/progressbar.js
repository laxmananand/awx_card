import React, { useState, useEffect } from "react";
import "./css/style.css"; // Import your CSS file here

const CircularProgress = () => {
  const [progressStartValue, setProgressStartValue] = useState(0);
  const progressEndValue = 100; // Change this to 100
  const speed = 30;

  useEffect(() => {
    if (progressStartValue >= progressEndValue) {
      return; // Don't start a new interval if we've already reached 100%
    }

    const progress = setInterval(() => {
      setProgressStartValue((prevValue) => prevValue + 1);

      if (progressStartValue === progressEndValue) {
        clearInterval(progress);
      }
    }, speed);

    return () => clearInterval(progress); // Clear the interval on unmount
  }, [progressStartValue, progressEndValue]); // Depend on progressStartValue and progressEndValue

  return (
    <div className="container">
      <div
        className="circular-progress"
        style={{ background: `conic-gradient(#7d2ae8 ${progressStartValue * 3.6}deg, #ededed 0deg)` }}
      >
        <span className="progress-value">{`${progressStartValue}%`}</span>
      </div>
      <span className="text">HTML & CSS</span>
    </div>
  );
};

export default CircularProgress;
