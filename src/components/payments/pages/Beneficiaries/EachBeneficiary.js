import React from "react";

function EachBeneficiary({ setShowDetails, data, color }) {
  
  function createShortForm(fullName) {
    const words = fullName.split(" ");
    let shortForm = words[0].charAt(0).toUpperCase();
    for (let i = 1; i < words.length; i++) {
      shortForm += words[i].charAt(0).toUpperCase();
    }
    return shortForm;
  }
  return (
    <div
      className="d-flex justify-content-between align-items-center hover p-3"
      role="button"
      onClick={() => setShowDetails({ show: true, data, color })}
    >
      <div className="d-flex align-items-center">
        <div
          className={"p-3 rounded-circle me-2 text-white" + color}
          style={{ width: 55, height: 55 }}
        >
          <div className="text-center">
            {createShortForm(data.beneficiaryName)}
          </div>
        </div>
        <div>
          <div>{data.beneficiaryName}</div>
          <div className="grey1">{data.beneficiaryEmail}</div>
        </div>
      </div>
    </div>
  );
}

export default EachBeneficiary;
