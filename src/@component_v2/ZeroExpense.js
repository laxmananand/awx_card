import React from "react";

function ZeroExpense({ isActivated }) {
  return (
    <div className="rounded-5 p-5 bg-white d-flex flex-column border justify-content-around h-100">
      <div className="rounded-circle bg-light-primary mx-auto mb-3">
        <img src="/v2/sidebar/expense.svg" style={{ padding: "12px" }} />
      </div>
      <h4 className="text-center">
        You don&#39;t have any
        <br />
        expenses yet
      </h4>
    </div>
  );
}

export default ZeroExpense;
