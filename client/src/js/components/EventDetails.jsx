import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt,  FaCalendar, FaClock } from "react-icons/fa";
import "../../css/components/EventDetails.css";
// import { Map } from './Map';
import { Button } from "./Button";
import "../../css/components/Button.css";


function EventDetails({event}) {

  const [button, setButton] = useState(true);

  const showButton = () => {
      setButton(true);
  };

  useEffect(() => {
    showButton();
  }, []);

  return (
    <>
      <div className="event--header-pic">
        <img></img>
          <div className="event--header-bar">
            <h1 className="event--header-text">{event.name}</h1>
            <ul className="event--subtitle">{event.host}</ul>
          </div>
      </div>
      <div className="event">
        <div className="event--container">
          <div className="event--column-wrapper">
            <div className="event--two-columns-left-offset">
              <div className="event--column-left">
                <ul className="event--item">
                  <FaCalendar className="event--icon" />
                  <span>{event.date}</span>
                </ul>
                <ul className="event--item">
                <FaClock className="event--icon" />
                <span>{event.time}</span>
                </ul>
                <ul className="event--item">
                  <FaMapMarkerAlt className="event--icon" />
                  <span>{event.location}</span>
                </ul>
              </div>
              <div className="event--column-right">
              <ul>
                <span>{event.description}</span>
                {/* <span>{"placeholder description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}</span> */}
              </ul>
              </div>
            </div>
          </div>
          <div className="event--item">
            {button && (
            <Button to="/events" buttonStyle="blue-button" buttonSize="btn--large">
                Register
            </Button>
            )}
          </div>
        </div>
        <div className="event--container">
          <div className="event--wrapper">
            <div className="event--item">
              <ul>
                <FaMapMarkerAlt className="event--icon" />
                <span className="event--location">{"google maps location"}</span>
              </ul>
            </div>
          </div>
        </div>
        {/* <Map /> */}
      </div>
    </>
  );
}

export default EventDetails;
