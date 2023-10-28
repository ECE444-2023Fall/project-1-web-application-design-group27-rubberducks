import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendar, FaClock, FaStar, FaRegUserCircle } from "react-icons/fa";
import './Eventcard.css';

function EventCard({event}) {
  return (
    <li className="eventCard">
        <Link className="eventLink" to={event.path}>
          <figure className="eventImgWrapper" 
          data-category={event.label ? event.label : null}>
            <img
              src={event.img}
              alt="Event Image"
              className="eventImg"
            />
            <span className="starIcon"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStarClick(event);
                }}>
                <FaStar className={event.favorite ? 'filledStar' : 'defaultStar'}/>
            </span>
          </figure>
          <div className="eventInfo">
            <h5 className="eventName">{event.name}</h5>
            <div className="eventSubtitle">
              <FaRegUserCircle className="eventIcon" />
              <span className="eventHost">{event.host}</span>
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
              <span className="eventTime">{event.time}</span>
            </div>
          </div>
        </Link>
      </li>
  );
}

export default EventCard;
