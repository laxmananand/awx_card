import React, { useState } from "react";
import TextField from "@mui/material/TextField";

function NumberField(props) {
  const { className, readOnly, value, setValue } = props;
  const [inputValue, setInputValue] = useState(value || "");
  const regexPattern = /^\d+(\.{1})?(\d{1,2})?$/;

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    // Check if the new input value satisfies the regex pattern or is empty
    if (
      (regexPattern.test(newInputValue) || !newInputValue) &&
      newInputValue.length <= 15
    ) {
      setInputValue(newInputValue);
      setValue(newInputValue);
    }
  };
  const styles = {
    underline: {
        '&::before': {
            borderBottom: 'none',
        },
        '&::after': {
            borderBottom: 'none',
        },
    },
};

  const inputStyle = {
    fontWeight:500,
    fontSize:"16px"
  };

  return (
    <TextField
      {...props}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      className={className}
      InputProps={{
        classes: {
          underline: styles.underline,
        },
        readOnly,
        style: inputStyle, // Apply the style here
      }}
    />
  );
}

export default NumberField;
