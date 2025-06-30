import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";

export default function Loader() {
  const open = useSelector((state) => state.common.loading);

  return (
    <div>
      <Backdrop sx={{ backgroundColor: "#FFFFFF", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
