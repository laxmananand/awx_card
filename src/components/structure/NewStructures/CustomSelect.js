import React, { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const CustomSelect = ({
  id,
  options = [],
  value = "",
  onChange,
  className,
  style,
  label,
  helperText,
  required,
  isMulti,
  disabled = false,
  isLoading,
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "2px 12px",
      fontSize: "12px",
      borderRadius: "6px",
      boxShadow: state.isFocused ? "0 0 0 1px #333" : null,
      outline: state.isFocused ? "1px solid #e62755" : "none",
      ...style, // Merge custom inline styles passed from the parent component
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "black" : null,
      fontSize: "12px",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className={`select-container ${className}`} style={style}>
      <label className="select-label">
        {label}
        {required && <span style={{ color: "red", marginLeft: "5px" }}>*</span>}
      </label>
      <Select
        id={id}
        components={animatedComponents}
        options={options}
        styles={customStyles}
        onChange={onChange}
        defaultValue={isMulti ? [] : null}
        value={
          isMulti ? value : options?.find((option) => option?.value === value)
        }
        isSearchable={true}
        isMulti={isMulti}
        isDisabled={disabled}
        isLoading={isLoading}
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
      {helperText && <span className="select-helper-text">{helperText}</span>}
    </div>
  );
};

export default CustomSelect;
