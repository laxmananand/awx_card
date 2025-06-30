import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Typography,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as paymentreducer from "../../../../@redux/features/payments";
import * as paymentAction from "../../../../@redux/action/payments";

import e from "cors";

function TransferDetailsForm({ purposeCodeList, setCurrentState }) {
  const [transferDate, setTransferDate] = useState(dayjs());
  // const [purpose, setPurpose] = useState("Business expenses");
  const [transferReference, setTransferReference] = useState("");
  const [internalReference, setInternalReference] = useState("");

  const dispatch = useDispatch();
  const payload = useSelector((state) => state.payments?.payload);
  const platform = useSelector((state) => state.common?.platform);
  const awxAccountId = useSelector((state) => state.auth.awxAccountId);

  const authToken = useSelector((state) => state.common.authToken);
  const isLoading = useSelector((state) => state.payments?.isLoading);
  const isSuccess = useSelector((state) => state.payments?.isSuccess);
  const sendMoneyRes = useSelector((state)=> state.payments?.sendMoneyRes);
  const handlePurposeChange = (e) => {
    const selectedPurpose = e.target.value;
    dispatch(
      paymentreducer.setPayload({
        ...payload,
        purposeCode: selectedPurpose,
      })
    );
  };

  const handleswiftcode = (e) => {
    const selectedswiftcode = e.target.value;
    dispatch(
      paymentreducer.setPayload({
        ...payload,
        swiftcode: selectedswiftcode,
      })
    );
  };

  const handleBackClick = () => {
    // Reset purposeCode and swiftcode in payload
    dispatch(
      paymentreducer.setPayload({
        ...payload,
        purposeCode: "",
        swiftcode: "",
        customerComments: "",
      })
    );

    if (platform === "awx") {
      setCurrentState("awx");
    } else {
      // Change the current state
      setCurrentState("amount");
    }
  };

  const handleDescription = (e) => {
    dispatch(
      paymentreducer.setPayload({
        ...payload,
        customerComments: e.target.value,
      })
    );
  };

  const submitadditionalinfo = (e) => {
    e.preventDefault();
    console.log("payload", JSON.stringify(payload, null, 2));

    // setCurrentState("overview");
    if (platform !== "awx") {
      setCurrentState("overview");
    } else {
      dispatch(paymentAction.sendMoney_awx(payload, awxAccountId, authToken));
    }
  };

  //  useEffect(() => {
  //     if (sendMoneyRes?.id) {
  //       setCurrentState("recipient");
  //       dispatch(paymentreducer.resetPayload());
  //     }
  //   }, [sendMoneyRes]);

  return (
    <form onSubmit={submitadditionalinfo} className="additional-info-main">
      <Box
        className="additional-info-box border rounded-3 my-5 mx-auto d-flex flex-column align-items-start gap-5 shadow"
        sx={{ width: "100%", maxWidth: 850, padding: "1.5rem 2rem" }}>
        <Typography variant="h5" gutterBottom className="fw-600 mb-0">
          Transfer details
        </Typography>

        {/* Transfer Date */}
        <FormControl
          fullWidth
          className="d-flex flex-column align-items-start gap-2">
          <Typography variant="text" className="opacity-75">
            Transfer Date 🛈
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              className="border w-50 rounded-3 fw-500"
              value={transferDate}
              onChange={(newDate) => setTransferDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              format="YYYY/MM/DD"
              disabled={true}
            />
          </LocalizationProvider>
          <Typography
            variant="text"
            className="opacity-50 fw-500"
            style={{ fontSize: "15px" }}>
            {payload?.payoutMethod} transfers usually arrive{" "}
            {payload?.deliveryTAT === "REALTIME"
              ? " instantly."
              : payload?.deliveryTAT === "T0"
              ? " the same day."
              : payload?.deliveryTAT === "T1"
              ? " the next day."
              : " within 1-2 business days."}
          </Typography>
        </FormControl>

        {/* Purpose */}
        <FormControl fullWidth>
          <Typography
            variant="text"
            className="opacity-75 mb-3"
            id="purpose-label">
            Purpose
          </Typography>
          <Select
            required
            labelId="purpose-label"
            id="purpose"
            value={payload?.purposeCode}
            // onChange={(e) => setPurpose(e.target.value)}
            onChange={handlePurposeChange}
            className="fw-500 border rounded-3 text-secondary">
            {purposeCodeList?.map((purpose, index) => {
              const label =
                platform === "awx" ? purpose.label : purpose.description;
              const value =
                platform === "awx" ? purpose.value : purpose.purposeCode;

              return (
                <MenuItem
                  key={index}
                  value={value}
                  selected={payload?.purposeCode === value}>
                  {label}
                </MenuItem>
              );
            })}
          </Select>
          <Typography
            variant="text"
            className="mt-2 opacity-50"
            style={{ fontSize: "15px" }}>
            Please specify purpose to ensure timely dispatch of transfer.
          </Typography>
        </FormControl>

        {payload?.payoutMethod === "SWIFT" && (
          <>
            {/* Transfer Reference */}
            <FormControl fullWidth>
              <Typography
                variant="body1"
                className="opacity-75 mb-3"
                id="purpose-label">
                Swift Fee Type
              </Typography>

              <Select
                required
                labelId="swiftfeetype-label"
                id="swiftfeetype"
                value={payload?.swiftcode}
                onChange={handleswiftcode}
                className="fw-500 border rounded-3 text-secondary">
                {[
                  {
                    value: "OUR",
                    label: "The payer covers transfer fees in full.",
                  },
                  {
                    value: "SHA",
                    label:
                      "The transfer fees are shared between payer & payee.",
                  },
                ].map((item) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    selected={payload?.swiftFeeType == item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>

              {/* <Typography
          variant="text"
          className="mt-2 opacity-50"
          style={{ fontSize: "15px" }}>
          Displayed on recipient's bank statement.
        </Typography> */}
            </FormControl>
          </>
        )}

        {/* Internal Reference (Optional) */}
        <FormControl fullWidth>
          <Typography
            variant="text"
            className="opacity-75 mb-3"
            id="purpose-label">
            Transfer Description
          </Typography>
          <TextField
            fullWidth
            className="border rounded-3 text-secondary fw-600"
            value={payload?.customerComments}
            onChange={handleDescription}
            placeholder="Enter your internal reference..."
          />
          {/* <Typography
          variant="text"
          className="mt-2 opacity-50"
          style={{ fontSize: "15px" }}>
          We won’t send this to the recipient. It needs to be distinct over the
          last 7 days.
        </Typography> */}
        </FormControl>

        {/* Buttons */}
        {/* <Box className="w-100 d-flex align-items-center justify-content-end gap-2">
          <button
            className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
            variant="contained">
            Continue
          </button>
          <button
            className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
            variant="outlined"
            onClick={handleBackClick}>
            Back
          </button>
        </Box> */}

        <Box className="w-100 d-flex align-items-center justify-content-end gap-2">
          {platform === "awx" ? (
            <>
              <button
                className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
                variant="outlined"
                onClick={handleBackClick}
                >
                Back
              </button>
              <button
                className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
                // onClick={handlePayClick} // replace with your actual pay handler
                disabled={isLoading} // Disable the button when loading
              >
                {/* Pay */}

                {isLoading ? (
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Pay"
                )}
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
                variant="contained">
                Continue
              </button>
              <button
                className="btn btn-action w-80 rounded-5 align-items-center justify-content-center py-2 fw-600"
                variant="outlined"
                onClick={handleBackClick}>
                Back
              </button>
            </>
          )}
        </Box>
      </Box>
    </form>
  );
}

export default TransferDetailsForm;
