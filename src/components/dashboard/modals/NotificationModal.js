import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./notification.css";
import { Link } from "react-router-dom";
import ContentLoader from "react-content-loader";

const Notification = ({ notifications, onClose, buttonRef }) => {
  const [newNotification, setNewNotification] = useState([]);
  const [oldNotification, setOldNotification] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate the position of the notification box relative to the button
  const positionStyle = buttonRef
    ? {
        position: "absolute",
        top: buttonRef.offsetTop + buttonRef.offsetHeight + 10 + "px", // Adjust the offset as needed
        right: "4%", // Adjust the offset as needed
      }
    : {};

  useEffect(() => {
    var obj = JSON.parse(notifications);
    var newNotifs = [];
    var oldNotifs = [];

    for (var k = 0; k < obj.length; k++) {
      if (obj[k].isNew === true) {
        newNotifs.push(obj[k]);
      } else {
        oldNotifs.push(obj[k]);
      }
    }

    console.log("new" + newNotifs);
    console.log("old" + oldNotifs);

    setNewNotification(newNotifs);
    setOldNotification(oldNotifs);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [notifications]);

  return (
    <div className="notification-container" style={positionStyle}>
      <div className="pointer"></div> {/* Top-facing pointer */}
      {/* <button className="close-btn" onClick={onClose}>
        Close
      </button> */}
      <p style={{ marginBottom: "15px" }}>Notifications</p>
      {/* New Notifications List */}
      <p style={{ color: "grey" }}>NEW</p>
      {isLoading ? (
        <>
          <ContentLoader
            speed={2}
            width={476}
            height={124}
            viewBox="0 0 476 124"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
            <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
            <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
            <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
            <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
            <circle cx="20" cy="20" r="20" />
          </ContentLoader>

          <ContentLoader
            speed={2}
            width={476}
            height={124}
            viewBox="0 0 476 124"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
            <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
            <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
            <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
            <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
            <circle cx="20" cy="20" r="20" />
          </ContentLoader>
        </>
      ) : (
        <ul className="mb-3 ul-1">
          {newNotification.map((notification, index) => (
            <li key={index}>
              <div className="list-main-div">
                <div className="list-img-div">
                  <img src="/avatar.png" alt="" width={50} />
                </div>

                <div className="list-message-div">
                  {notification.message}

                  <div className="list-timestamp-div">{notification.timestamp}</div>
                </div>

                <div className="mark-as-read">
                  <span>Mark as read</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {/* Earlier Notifications List */}
      <p style={{ color: "grey" }}>EARLIER</p>
      {isLoading ? (
        <>
          <ContentLoader
            speed={2}
            width={476}
            height={124}
            viewBox="0 0 476 124"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
            <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
            <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
            <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
            <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
            <circle cx="20" cy="20" r="20" />
          </ContentLoader>

          <ContentLoader
            speed={2}
            width={476}
            height={124}
            viewBox="0 0 476 124"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
            <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
            <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
            <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
            <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
            <circle cx="20" cy="20" r="20" />
          </ContentLoader>
        </>
      ) : (
        <ul className="mb-3 ul-2">
          {oldNotification.map((notification, index) => (
            <li key={index}>
              <div className="list-main-div">
                <div className="list-img-div">
                  <img src="/avatar.png" alt="" width={50} />
                </div>

                <div className="list-message-div">
                  {notification.message}

                  <div className="list-timestamp-div">{notification.timestamp}</div>
                  {/* <div className="mark-as-read d-none">
                  <span>Mark as read</span>
                </div> */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="see-more">
        <span>See More</span>
      </p>
    </div>
  );
};

export default Notification;
