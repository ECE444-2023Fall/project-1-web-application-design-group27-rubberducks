import React from 'react';
import './Eventcard.css';

function EventCard({ event }) {
    const heartEmoji = event.favorited ? "❤️" : "♡";

    return (
        <a href={event.link} className="eventCardLink">
            <div className="eventCard">
                <div className="eventImageContainer">
                    <img src={event.image} alt={event.name} className="eventImage"/>
                </div>
                <div className="eventInfo">
                    <h3>{event.name}</h3>
                    <p className="eventHost">{event.host}</p>
                    <div className="eventDetails">
                        <span className="eventDateTime">{event.date} | {event.time}</span>
                        <span className="eventLocation">{event.location}</span>
                    </div>
                </div>
                <div className="eventHeart">
                    {heartEmoji}
                </div>
            </div>
        </a>
    );
}

export default EventCard;
