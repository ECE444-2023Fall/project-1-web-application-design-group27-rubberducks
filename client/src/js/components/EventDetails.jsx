import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt,  FaCalendar, FaClock } from "react-icons/fa";
import "../../css/components/EventDetails.css";
import { Button } from "./Button";
import "../../css/components/Button.css";


function EventDetails() {

  const [button, setButton] = useState(true);

  const showButton = () => {
      setButton(true);
  };

  useEffect(() => {
    showButton();
  }, []);

  return (
    <>
      {/* <div className="event--header-pic" style={{ backgroundImage: 'url("images/placeholder.png"), linearGradient(rgba(0, 0, 0, 0.1))' }}> */}
      {/* <div className="event--header-pic" style={{ backgroundImage: 'url("images/placeholder.png")' }}> */}
      <div className="event--header-pic">
        <div className="event--header-bar">
          <h1 className="event--header-text">{"Placeholder Event"}</h1>
          <ul className="event--subtitle">{"Placeholder Club"}</ul>
        </div>
      </div>
      <div className="event">
        <div className="event--container">
          <div className="event--column-wrapper">
            <div className="event--two-columns-left-offset">
              <div className="event--column-left">
                <ul className="event--item-center">
                  <FaCalendar className="event--icon" />
                  <span>{"placeholder date"}</span>
                </ul>
                <ul className="event--item-center">
                  <FaClock className="event--icon" />
                  <span>{"placeholder time"}</span>
                </ul>
                <ul className="event--item-center">
                  <FaMapMarkerAlt className="event--icon" />
                  <span>{"placeholder location"}</span>
                </ul>
              </div>
              <div className="event--column-right">
              <ul>
                <span>{"placeholder description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}</span>
              </ul>
              </div>
            </div>
            <div className="event--two-columns-left-offset">
              <div className="event--register">
                {button && (
                <Button to="/events" buttonStyle="blue-button" buttonSize="btn--large">
                    Register
                </Button>
                )}
              </div>
              <div className="event--additional-info">
                <div className="event--item">
                  <span>{"tag list"}</span>
                </div>
                <div className="event--item-right-justified">
                  <span>{"reoccuring event: weekly on Tuesdays"}</span>
                </div>
                <div className="event--item-right-justified">
                  <span>{"capacity: value"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="event--container">
          <div className="event--wrapper">
            <div className="event--item">
              <ul>
                <FaMapMarkerAlt className="event--icon" />
                <span>{"google maps location"}</span>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventDetails;
