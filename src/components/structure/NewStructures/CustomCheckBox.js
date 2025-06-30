import React from "react";

const CustomCheckbox = ({
  id,
  label,
  checked,
  onChange,
  required = false,
  disabled = false,
}) => {
  return (
    <div
      className="checkbox-container"
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: "10px",
        padding: "8px 0",
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          width: "16px",
          height: "16px",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />

      <label
        htmlFor={id}
        className="checkbox-label"
        style={{
          margin: 0,
          fontWeight: 500,
          color: "#333",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "brown", fontWeight: 600 }}> *</span>
        )}
      </label>
    </div>
  );
};

export default CustomCheckbox;
