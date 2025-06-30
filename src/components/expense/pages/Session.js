import React from "react";
import { Modal, Button } from "@mui/material"; // Replace with the actual UI library you are using

const SessionTimeoutModal = ({ onLogout, onClose }) => {
  return (
    <Modal isOpen={true} onRequestClose={onClose}>
      <div>
        <p>Your session has expired due to inactivity.</p>
        <Button onClick={onLogout}>Logout</Button>
      </div>
    </Modal>
  );
};

export default SessionTimeoutModal;
