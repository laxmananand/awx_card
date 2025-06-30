import { MuiOtpInput } from "mui-one-time-password-input";

export const CustomOTP = ({ otp, handleChange, onEnterPress }) => {
  // Function to handle input restriction
  const handleKeyDown = (event) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ];

    // Allow Ctrl+V (Paste)
    if (event.ctrlKey && event.key === "v") {
      return; // Allow paste shortcut
    }

    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("Text");
    if (!/^\d+$/.test(pasteData)) {
      event.preventDefault();
    }
  };
  return (
    <>
      <MuiOtpInput
        value={otp}
        onChange={handleChange}
        length={6}
        TextFieldsProps={{
          onKeyDown: handleKeyDown, // Attach keydown handler
          onPaste: handlePaste, // Attach paste handler
          onEnterPress: onEnterPress, // Attach submit handler
        }}
        sx={{
          "& .MuiOtpInput-TextField": {
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            color: "#333",
            textAlign: "center",
            border: "1px solid lightgrey",
          },
          "& .MuiOtpInput-TextField:focus": {
            borderColor: "#2196f3",
          },

          "& .MuiInputBase-input": {
            padding: "0",
            height: "47px",
            fontSize: "20px",
            fontWeight: 500,
          },
        }}
      />
    </>
  );
};

export default CustomOTP;
