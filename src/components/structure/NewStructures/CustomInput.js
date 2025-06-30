import React from "react";

export const CustomInput = ({
  type,
  id,
  placeholder,
  value,
  onInput,
  className,
  style,
  label,
  helperText,
  required,
  disabled = false,
  max,
  leftIcon, // Accepts an MUI icon component (e.g., <SearchIcon />)
  rightIcon, // Accepts an MUI icon component (e.g., <VisibilityIcon />)
  onRightIconClick, // Function for right icon (e.g., show/hide password)
  regex,
  onEnterPress,
}) => {
  // ✅ Validate input only on blur
  const handleBlur = () => {
    if (value && regex?.pattern && !regex.pattern.test(value)) {
      toast.error(regex.message); // ✅ Use custom error message
    }
  };

  const handleInput = (e) => {
    const { value } = e.target;

    // Allow clearing the field
    if (value === "") {
      onInput("");
      return;
    }

    // Apply character restriction from restrict.js
    // if (!restrict[type] || restrict[type].test(value)) {
    //   onInput(value);
    // }

    onInput(value);
  };

  return (
    <div
      className="input-container"
      style={{ position: "relative", width: "100%" }}
    >
      {/* Label */}
      <label className="input-label">
        {label}{" "}
        {required && <span style={{ color: "brown", fontWeight: 600 }}>*</span>}
      </label>

      {/* Input Field */}
      <div style={{ position: "relative", width: "100%" }}>
        {leftIcon && (
          <span
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          placeholder={placeholder}
          value={value}
          onInput={handleInput}
          className={`custom-input-class full-width ${className && className} ${
            disabled && "opacity-75"
          }`}
          style={{
            ...style,
            paddingLeft: leftIcon ? "55px" : "20px", // Adjust padding if left icon exists
            paddingRight: rightIcon ? "55px" : "20px", // Adjust padding if right icon exists
          }}
          maxLength={max || 100}
          disabled={disabled}
          required={required}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onEnterPress();
            }
          }}
        />

        {rightIcon && (
          <span
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={onRightIconClick} // Handles click event if provided
          >
            {rightIcon}
          </span>
        )}
      </div>

      {/* Helper Text */}
      {helperText && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
};

export default CustomInput;
