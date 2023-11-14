import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendar,
  FaClock,
  FaStar,
  FaRedo,
  FaRegUserCircle,
} from "react-icons/fa";
import "../../../css/pages/events/Eventcard.css";
import { Get_Img_Link } from "../../components/Get_Img_Link";

/* This is the individual event card */

function EventCard({ event, onStarClick, favEvents }) {
  /* If event is created within last 3 days, assign "New" label */
  const eventDate = new Date(event.date_created);
  const currentDate = new Date();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(currentDate.getDate() - 3);
  var label = null;
  if (event.attendees && event.attendees.length > 20) {
    label = "Hot";
  } else if (eventDate >= threeDaysAgo && eventDate <= currentDate) {
    label = "New";
  }

  const isLogged = JSON.parse(localStorage.getItem("user")) ? true : false; //find if user logged in

  /* Event Card */
  return (
    <li title={`View ${event.name}`} className="eventCard">
      <Link className="eventLink" to={`/events/${event.eid}`}>
        <figure
          className={`eventImgWrapper ${label}`}
          data-category={label ? label : null}
        >
          <img
            src={event.profile_pic ? Get_Img_Link(event.profile_pic) : "images/placeholder.png"}
            alt="Event Image"
            className="eventImg"
          />
          {event.reoccuring > 0 && (
            <span title="Reocurring" className="redoIconSpan">
              <FaRedo className="redoIcon" />
            </span>
          )}
          {isLogged && ( //if user logged in, show star icon
            <span
              title={
                favEvents.includes(event.eid) ? "Unfavourite" : "Favourite"
              }
              className="starIcon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onStarClick(event);
              }}
            >
              <FaStar
                className={
                  favEvents.includes(event.eid) ? "filledStar" : "defaultStar" //if event is in favEvents, show filled star
                }
              />
            </span>
          )}
        </figure>
        <div className="eventInfo">
          <h5 className="eventName">{event.name}</h5>
          <div className="eventSubtitle">
            <FaRegUserCircle className="eventIcon" />
            <Link
              className="eventHost"
              to={`/hosts/${event.owner}`}
              title={`View ${event.owner_name}`}
            >
              {event.owner_name}
            </Link>
          </div>
          <div className="eventSubtitle">
            <FaMapMarkerAlt className="eventIcon" />
            <span className="eventLocation">{event.location}</span>
          </div>
          <div className="eventSubtitle">
            <FaCalendar className="eventIcon" />
            <span className="eventDate">{event.date}</span>
          </div>
          <div className="eventSubtitle">
            <FaClock className="eventIcon" />
            <span className="eventTime">
              {event.start_time} - {event.end_time}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default EventCard;
