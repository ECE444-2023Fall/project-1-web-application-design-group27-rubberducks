import React, { useState, useEffect } from "react";
import "../../../css/pages/events/Eventsgrid.css";
import EventCard from "./Eventcard";

function EventsGrid({ events, onStarClick, favEvents }) {
  const eventIds = events.map((e) => e.eid);
  const hasDuplicates = eventIds.some(
    (id, index) => eventIds.indexOf(id) !== index
  );

  if (hasDuplicates) {
    console.warn("Duplicate keys detected:", events);
  }
  return (
    <div className="eventsGrid">
      {events.map((event) => (
        <EventCard
          key={event.eid}
          event={event}
          onStarClick={onStarClick}
          favEvents={favEvents}
        />
      ))}
    </div>
  );
}

export default EventsGrid;
