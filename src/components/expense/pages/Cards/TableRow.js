import React from "react";

function TableRow({ index, data, setShowDetails, setSelectedRowData, unblockCardApi }) {
    const row = data[index];
  
    return (
      <tr className="blueHover opacity-75" role="button">
        <td scope="row" onClick={() => { setShowDetails(true); setSelectedRowData(data); }}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <img
              src={row.cardType === "Visa" ? "/visa.svg" : "/other-card.svg"}
              alt=""
              width={30}
            />
            <span style={{ color: 'blue' }}>*{row.maskedCardNumber.slice(-4)}</span>
          </div>
        </td>
        <td className="text-center align-middle">{row.embossingLine1}</td>
        <td className="text-center align-middle">{row.user}</td>
        <td className="text-center align-middle">
          {row.issuanceMode === "NORMAL_DELIVERY_LOCAL" ? "Local Delivery" : "Virtual"}
        </td>
        <td className="text-center align-middle">
          {row.cardType === "VIR" ? "Virtual" : "Physical"}
        </td>
        <td className="text-center align-middle">{row.cardStatus}</td>
        <td className="text-center align-middle">
          <button
            className="btn btn-primary"
            onClick={() => unblockCardApi(row.cardHashId)}
          >
            Unblock
          </button>
        </td>
      </tr>
    );
  }
  
  export default TableRow;
