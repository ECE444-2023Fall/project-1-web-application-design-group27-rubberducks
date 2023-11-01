import React from 'react';
import './Eventsgrid.css';
import EventCard from './Eventcard';

function EventsGrid({ events, onStarClick }) {
    return (
        <div className="eventsGrid">
            {events.map(event => (
                <EventCard key={event.eid} event={event} onStarClick={onStarClick}/>
            ))}
        </div>
    );
}

export default EventsGrid;
