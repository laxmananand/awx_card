import React, { useState } from "react";

function BlockCardModal({ onClose, onBlock, selectedRowData }) {
  const [selectedAction, setSelectedAction] = useState("");

  const handleBlock = (e) => {
    setSelectedAction(e.target.value);
    const cardHashId = selectedRowData?.cardHashId;
    console.log("Selected Action:", e.target.value);
    console.log("CardHashId to block:", cardHashId);

    // Lock/Unlock API call will be here (pending implementation)
    onBlock(e.target.value, cardHashId);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Block Card</h3>
        <select
          id="action"
          value={selectedAction}
          onChange={handleBlock}
          className="form-select"
        >
          <option value="">Select Card Action</option>
          <option value="suspend">Suspend</option>
          <option value="block">Block</option>
        </select>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlockCardModal;
