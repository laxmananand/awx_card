import React from "react";
import { toast } from "react-toastify";

export const ValidateEmail = (email) => {
  // Regular expression to match email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the provided email matches the regular expression
  if (email != "" && !emailRegex.test(email)) {
    // If the email format is invalid, show an error message
    toast.warn("Please enter a valid email address. Example: abc@xyz.com");
  }
};

export const ValidatePhone = (phone) => {
  if (phone !== "") {
    // Remove any non-digit characters from the phone number
    const cleanedPhone = phone.replace(/\D/g, "");

    // Check if the cleaned phone number length is between 8 and 10 digits
    if (cleanedPhone.length < 8 || cleanedPhone.length > 10) {
      // If the phone number length is invalid, show an error message
      toast.error("Please enter a valid phone number between 8 to 10 digits. Example: 8569741235.");
    }
  }
};

export const setCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();

  // Add leading zero if month or day is less than 10
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }

  // Return date in the format "YYYY-MM-DD"
  return `${year}-${month}-${day}`;
};

// Get the current date in the format "YYYY-MM-DD"
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

//Prevent entering future dates using manual means
export const preventFutureDates = (event) => {
  let currentDate = getCurrentDate();
  if (event.target.value > currentDate) {
    toast.error("Please select a date on or before " + currentDate);
    event.target.value = "";
  } else {
  }
};
