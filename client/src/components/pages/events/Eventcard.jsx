import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendar, FaClock, FaStar, FaRedo, FaRegUserCircle } from "react-icons/fa";
import './Eventcard.css';

function EventCard({event, onStarClick}) {
  return (
    <li title = {`View ${event.name}`} className="eventCard">
        <Link className="eventLink" to={`/events/${event.eid}`}>
          <figure className={"eventImgWrapper ${event.label}"}
          data-category={event.label ? event.label : null}>
            <img
              src={event.img ? event.img : "images/placeholder.png"}
              alt="Event Image"
              className="eventImg"
            />
            <span title = {event.favorite ? "Click to Unfavourite!" : "Click to Favourite!"} className="starIcon"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStarClick(event);
                }}>
                <FaStar className={event.favorite ? 'filledStar' : 'defaultStar'}/>
            </span>
            {event.recurring && (
                <span title = "Recurring" className="redoIconSpan">
                    <FaRedo className="redoIcon"/>
                </span>
            )}
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
