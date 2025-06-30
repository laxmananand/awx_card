import React, { useState } from "react";
import Select from "react-select";

function CustomSelectNew(props) {
  const {
    options = [],
    placeholder,
    multiple,
    setValue,
    isTextField,
    setIsTextField,
  } = props;

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      "&:hover": {
        border: "none",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 2,
    }),
  };

  const handleChange = (selectedOptions) => {
    if (selectedOptions && selectedOptions.value === "none") {
      setIsTextField(true);
    } else {
      setIsTextField(false);
      if (multiple) {
        // For multi-select, extract an array of values
        const selectedValues = selectedOptions.map((option) => option.value);
        setValue(selectedValues);
      } else {
        // For single-select, directly set the value
        setValue(selectedOptions.value);
      }
    }
  };

  return (
    <div className="w-100 border-0">
      {isTextField ? (
        <div className="d-flex">
          <input
            required
            type="text"
            placeholder={placeholder || "--ENTER VALUE--"}
            onChange={(e) => setValue(e.target.value)}
            className="form-control"
            style={{ border: "none" }}
          />
          <button
            type="button"
            className="btn"
            onClick={() => {
              setIsTextField(false);
            }}
            // style={{ border: "none" }}
          >
            x
          </button>
        </div>
      ) : (
        <Select
          {...props}
          styles={customStyles}
          options={[
            { label: "None of the below", value: "none" },
            ...(options || []), // Ensure options is always an array
          ]}
          placeholder={placeholder || "--SELECT--"}
          isMulti={multiple}
          onChange={handleChange} // Use the handleChange function
        />
      )}
    </div>
  );
}

export default CustomSelectNew;
