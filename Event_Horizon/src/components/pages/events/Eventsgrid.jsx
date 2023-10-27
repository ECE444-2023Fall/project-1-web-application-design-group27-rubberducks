import React from 'react';
import './Eventsgrid.css';
import EventCard from './Eventcard';

function EventsGrid({ events }) {
    return (
        <div className="eventsGrid">
            {events.map(event => (
                <EventCard key={event.id} event={event}/>
            ))}
        </div>
    );
}

export default EventsGrid;
