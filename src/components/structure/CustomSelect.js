import React from "react";
import Select from "react-select";

function CustomSelect(props) {
  const { options, placeholder, multiple, setValue, label } = props;

  const customStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: 14,
      border: "none",
      boxShadow: "none",
      "&:hover": {
        border: "none",
      },
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: 14,
      zIndex: 2,
      borderRadius: "10px",
    }),
  };

  const handleChange = (selectedOptions) => {
    if (multiple) {
      // For multi-select, extract an array of values
      const selectedValues = selectedOptions.map((option) => option.value);
      setValue(selectedValues);
    } else {
      // For single-select, directly set the value
      setValue(selectedOptions.value);
    }
  };

  return (
    <div
      className={`w-100 border-0 d-flex ${
        location.pathname.includes("bills") ||
        location.pathname.includes("invoices")
          ? "align-items-center"
          : "flex-column"
      }`}
    >
      <label
        className="mx-3"
        style={{
          fontSize: "14px",
          fontWeight: "500",
          color: "rgba(0, 0, 0, 0.65)",
        }}
      >
        {placeholder}
      </label>
      <div className="w-100">
        <Select
          {...props}
          styles={customStyles}
          options={options}
          placeholder={placeholder || "--SELECT--"}
          isMulti={multiple}
          onChange={handleChange} // Use the handleChange function
        />
      </div>
    </div>
  );
}

export default CustomSelect;
