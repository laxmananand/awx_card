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

const CustomFutureDatepicker = ({
  selectedDate,
  onDateChange,
  label,
  required,
  helperText,
}) => {
  // Set the minimum selectable date to today
  const minDate = dayjs();

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
      if (date.isBefore(minDate, "day")) {
        // If the date is invalid (in the past), clear it and show an error
        toast.error(
          `The selected date cannot be in the past. Please select a date on or after ${minDate.format(
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
    <div className="input-container" style={{ gap: "2px" }}>
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
            minDate={minDate} // Disable past dates
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "1px solid lightgrey",
                borderRadius: "6px",
                padding: "2px 15px 2px 0",
              },
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
};

export default CustomFutureDatepicker;
