import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt,  FaCalendar, FaClock } from "react-icons/fa";
import "../../css/components/EventDetails.css";
// import { Map } from './Map';
import { Button } from "./Button";
import "../../css/components/Button.css";


function formatTime(timeString) {
  // Use a regular expression to extract hours and minutes
  const timeParts = /^(\d+):(\d+):\d+$/.exec(timeString);

  if (!timeParts) {
    return "Invalid time format";
  }

  const hours = parseInt(timeParts[1], 10);
  const minutes = parseInt(timeParts[2], 10);

  // Format the time in 12-hour format
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  // Use padStart to ensure two-digit minutes
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${period}`;
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function EventDetails(props) {

  const formattedDate = formatDate(props.date);
  const formattedStartTime = formatTime(props.start_time);
  const formattedEndTime = formatTime(props.end_time);


  const [button, setButton] = useState(true);

  const showButton = () => {
      setButton(true);
  };

  useEffect(() => {
    showButton();
  }, []);

  return (
    <>
      <div className="event">
        <div className="event--base">
          <div className="event--header-pic">
          {/* <div className="event--header-pic" style={{ backgroundImage: 'url("images/placeholder.png"), linearGradient(rgba(0, 0, 0, 0.1))' }}> */}
          {/* <div className="event--header-pic" style={{ backgroundImage: 'url("images/placeholder.png")' }}> */}
            <div className="event--header-bar">
              <h1 className="event--header-text">{props.name}</h1>
              <ul className="event--subtitle">{props.owner}</ul>
            </div>
          </div>
          <div className="event--main">
            <div className="event--container">
              <div className="event--column-wrapper">
                <div className="event--two-columns-left-offset">
                  <div className="event--column-left">
                    <ul className="event--item-center">
                      <FaCalendar className="event--icon" />
                      <span>{formattedDate}</span>
                    </ul>
                    <ul className="event--item-center">
                      <FaClock className="event--icon" />
                      <ul>{formattedStartTime}</ul>
                      <ul>{"-  "}</ul>
                      <ul>{formattedEndTime}</ul>
                    </ul>
                    <ul className="event--item-center">
                      <FaMapMarkerAlt className="event--icon" />
                      <span>{props.location}</span>
                    </ul>
                  </div>
                  <div className="event--column-right">
                  <ul>
                    <span>{props.description}</span>
                  </ul>
                  </div>
                </div>
                <div className="event--two-columns-left-offset">
                  <div className="event--register">
                    {button && (
                    <Button to="/events" buttonStyle="register-button" buttonSize="btn--large">
                        Register
                    </Button>
                    )}
                  </div>
                  <div className="event--additional-info">
                    <div className="event--item">
                      <span>{props.tags}</span>
                    </div>
                    <div className="event--item-right-justified">
                      <span>{props.reoccuring}</span>
                    </div>
                    <div className="event--item-right-justified">
                      <span>{props.capacity}</span>
                    </div>
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
      </div>
    </>
  );
}

export default EventDetails;
