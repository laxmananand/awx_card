import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast } from "react-toastify";

// Create a custom theme
const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "9px 20px",
          fontWeight: 500,
        },
      },
    },
  },
});

export const CustomDatepicker = ({
  selectedDate,
  onDateChange,
  label,
  required,
  helperText,
}) => {
  // Calculate the maximum selectable date (today minus 18 years)
  const maxDate = dayjs().subtract(18, "year");

  const [startDate, setStartDate] = useState(
    selectedDate ? dayjs(selectedDate) : null
  );

  useEffect(() => {
    if (selectedDate) {
      setStartDate(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (date) {
      const maxDate = dayjs().subtract(18, "year");
      if (date.isAfter(maxDate)) {
        // If the date is invalid (less than 18 years), clear it and show an error

        toast.error(
          `The selected date indicates an age below 18 years. Please select a date on or before ${maxDate.format(
            "DD/MM/YYYY"
          )}.`
        );

        setStartDate(null);
        onDateChange(null);
      } else {
        setStartDate(date);
        onDateChange(date.format("YYYY-MM-DD")); // Format date using dayjs
      }
    } else {
      setStartDate(null);
      onDateChange(null);
    }
  };

  return (
    <div className="input-container">
      <label className="input-label">
        {label}{" "}
        {required && <span style={{ color: "red", marginLeft: "5px" }}>*</span>}
      </label>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={startDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            maxDate={maxDate} // Disable dates below 18 years
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "1px solid lightgrey",
                borderRadius: "6px",
                padding: "2px 15px 2px 0",
                fontSize: "13px",
              },
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
};

export const CustomDatepickerGeneral = ({
  selectedDate,
  onDateChange,
  label,
  required,
  helperText,
}) => {
  const [startDate, setStartDate] = useState(
    selectedDate ? dayjs(selectedDate) : null
  );

  useEffect(() => {
    if (selectedDate) {
      setStartDate(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const handleDateChange = (date) => {
    if (date) {
      setStartDate(date);
      onDateChange(date.format("YYYY-MM-DD")); // Format date using dayjs
    } else {
      setStartDate(null);
      onDateChange(null);
    }
  };

  return (
    <div className="input-container">
      <label className="input-label">
        {label}{" "}
        {required && <span style={{ color: "red", marginLeft: "5px" }}>*</span>}
      </label>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={startDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "1px solid lightgrey",
                borderRadius: "6px",
                padding: "2px 15px 2px 0",
                fontSize: "13px",
              },
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>
      {helperText && <span className="helper-text">{helperText}</span>}
    </div>
  );
};

export default CustomDatepicker;
