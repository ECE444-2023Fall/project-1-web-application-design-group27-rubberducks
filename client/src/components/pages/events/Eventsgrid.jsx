import React from 'react';
import './Eventsgrid.css';
import EventCard from './Eventcard';

function EventsGrid({ events, onStarClick }) {
    const eventIds = events.map(e => e.eid);
    const hasDuplicates = eventIds.some((id, index) => eventIds.indexOf(id) !== index);

    if (hasDuplicates) {
    console.warn("Duplicate keys detected:", events);
}
    return (
        <div className="eventsGrid">
            {events.map(event => (
                <EventCard key={event.eid} event={event} onStarClick={onStarClick}/>
            ))}
        </div>
    );
}

export default EventsGrid;
