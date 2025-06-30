import React, { useState, useEffect, useRef } from "react";
import "./new-structure.css";

export const CustomFileInput = ({
  id,
  label,
  required = false,
  disabled = false,
  accept = "*", // Allowed file types
  onFileChange, // Callback function to handle file selection
  helperText,
  leftIcon, // Optional left icon
}) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(""); // Store file name

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Update state with file name
      onFileChange(file);
    }
  };

  // Trigger file selection programmatically
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className="file-input-container"
      style={{ position: "relative", width: "100%" }}
    >
      {/* Label */}
      {label && (
        <label className="file-input-label pb-3">
          {label}{" "}
          {required && (
            <span style={{ color: "brown", fontWeight: 600 }}>*</span>
          )}
        </label>
      )}

      {/* Custom File Input Wrapper */}
      <div
        className="file-input-wrapper"
        onClick={triggerFileInput}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: "1px dashed #ccc",
          padding: "10px 16px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          borderRadius: 12,
        }}
      >
        {leftIcon && <span>{leftIcon}</span>}
        <span style={{ flex: 1 }}>
          {fileName ? fileName : "Click to upload a file"}{" "}
          {/* Show file name */}
        </span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        required={required}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Helper Text */}
      {helperText && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
};

export default CustomFileInput;
