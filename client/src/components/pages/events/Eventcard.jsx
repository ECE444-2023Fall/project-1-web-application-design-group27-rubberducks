import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendar, FaClock, FaStar, FaRedo, FaRegUserCircle } from "react-icons/fa";
import './Eventcard.css';

function EventCard({event, onStarClick}) {
  const eventDate = new Date(event.date_created);
  const currentDate = new Date();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(currentDate.getDate() - 3);

  var label = null;
  if (event.attendees && event.attendees.length > 20) {
    label = "Hot";
  } else if (eventDate >= threeDaysAgo && eventDate <= currentDate){
    label = "New";
  }

  console.log(event.reoccuring);
  return (
    <li title = {`View ${event.name}`} className="eventCard">
        <Link className="eventLink" to={`/events/${event.eid}`}>
          <figure className={`eventImgWrapper ${label}`}
          data-category={label ? label : null}>
            <img
              src={event.img ? event.img : "images/placeholder.png"}
              alt="Event Image"
              className="eventImg"
            />
            {event.reoccuring && (
              <span title="Reocurring" className="redoIconSpan">
                <FaRedo className="redoIcon" />
              </span>
            )}
            <span title = {event.favorite ? "Click to Unfavourite!" : "Click to Favourite!"} className="starIcon"
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
