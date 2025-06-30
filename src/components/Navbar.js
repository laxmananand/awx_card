import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Notification from "./dashboard/modals/NotificationModal.js";

function Navbar({ isActivated }) {
  const [username, setUsername] = useState("User");
  useEffect(() => {
    var contactName = sessionStorage.getItem("contactName");
    if (contactName) {
      setUsername(contactName?.split(" ")[0]);
    }
  }, []);

  const [bgColor, setBgColor] = useState("transparent");
  const [img, setImg] = useState("/notification.svg");

  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [buttonRef, setButtonRef] = useState(null);

  const openNotificationBox = () => {
    // Toggle background color
    setBgColor((prevColor) => (prevColor === "transparent" ? "grey" : "transparent"));

    // Toggle image source
    setImg((prevImg) => (prevImg === "/notification.svg" ? "/notification2.svg" : "/notification.svg"));

    // Store the button reference for positioning the notification box
    setButtonRef(document.getElementById("notificationButton"));
    handleNotificationClick();
  };

  const handleNotificationClick = () => {
    // Generate some random text samples for notifications
    const randomNotifications = JSON.stringify([
      {
        message: "Congratulations, new HKD bank account added!",
        timestamp: "Today at 5:48 PM",
        isNew: true,
      },
      {
        message: "Congratulations, new USD bank account added!",
        timestamp: "Today at 12:48 PM",
        isNew: true,
      },
      {
        message: "Your recent transaction has been fulfilled",
        timestamp: "Today at 11:30 AM",
        isNew: true,
      },
      {
        message: "Congratulations, new SGD bank account added!",
        timestamp: "Yesterday at 1:45 PM",
        isNew: false,
      },
      {
        message: "Your account has been activated.",
        timestamp: "Yesterday at 6:00 PM",
        isNew: false,
      },
      {
        message: "Your account status is Pending.",
        timestamp: "Yesterday at 2:00 PM",
        isNew: false,
      },
    ]);
    setNotifications(randomNotifications);
    setIsNotificationOpen(!isNotificationOpen);
  };

  const closeNotification = () => {
    setIsNotificationOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand text-dark" to="#!">
          Hello, {username}!
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <form className="d-flex col-lg-6 bg-light border rounded-3 mx-2 my-2 my-lg-0 mx-auto">
            <button className="btn" type="submit">
              <img src="/search.svg" />
            </button>
            <input
              className="form-control border-0 bg-light"
              type="search"
              placeholder="What do you want to find?"
              aria-label="Search"
            />
          </form>
          <ul className="navbar-nav mb-2 mb-lg-0">
            {/* <li className="nav-item mx-2 my-2 my-lg-0">
                            <a className="nav-link border d-flex justify-content-center align-items-center" href="#">
                                <img src="/chat.svg" />
                                <p className='m-0 ms-2 d-lg-none'>Chat</p>
                            </a>
                        </li> */}
            <li className="nav-item mx-2 my-2 my-lg-0">
              <button
                id="notificationButton" // Set an ID for the button
                to="#!"
                className="nav-link border d-flex justify-content-center align-items-center"
                style={{ background: bgColor, borderRadius: "15px" }}
                onClick={openNotificationBox}
              >
                <img src={img} alt="Notification" />
                <p className="m-0 ms-2 d-lg-none">Notifications</p>
              </button>
              {isNotificationOpen && (
                <Notification
                  notifications={notifications}
                  onClose={closeNotification}
                  buttonRef={buttonRef} // Pass the button reference to the Notification component
                />
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
