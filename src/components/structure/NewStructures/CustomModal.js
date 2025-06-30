import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import "./new-structure.css";

export default function CustomModal({
  isOpen,
  handleClose,
  children,
  headerText,
  width,
  height,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width || 800,
    maxHeight: height || 600,
    overflowY: "auto",
    bgcolor: "white",
    border: "none !important",
    borderRadius: "8px",
    boxShadow: 15,
    p: "1rem",
  };
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="custom-modal-parent">
        <div className="modal-parent">
          <div className="new-modal-header d-flex align-items-center justify-content-between">
            <h5>{headerText}</h5>{" "}
            <div className="modal-header-img-div" onClick={handleClose}>
              <img src="/useruserprofilecircle1.svg" alt="" />
            </div>
          </div>
          {children}
        </div>
      </Box>
    </Modal>
  );
}
