import React, { useState } from 'react';

function TaxModal({ onClose, onSave }) {
  const [taxType, setTaxType] = useState('');
  const [taxValue, setTaxValue] = useState('');

  const handleSave = () => {
    // Check for required fields, you can add more validation if needed
    if (taxType && taxValue) {
      // Call the onSave callback and pass the custom tax data
      onSave(taxType, taxValue);
      onClose(); // Close the modal
    } else {
      // Handle validation or display an error message
      // You can add your error handling logic here
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Custom Tax</h2>
        <div>
          <label>Tax Type:</label>
          <input
            type="text"
            value={taxType}
            onChange={(e) => setTaxType(e.target.value)}
          />
        </div>
        <div>
          <label>Tax Value:</label>
          <input
            type="number"
            value={taxValue}
            onChange={(e) => setTaxValue(e.target.value)}
          />
        </div>
        <div>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default TaxModal;
