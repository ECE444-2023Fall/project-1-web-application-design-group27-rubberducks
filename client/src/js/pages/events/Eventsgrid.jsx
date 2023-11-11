import React, { useState, useEffect } from "react";
import "../../../css/pages/events/Eventsgrid.css";
import EventCard from "./Eventcard";

function EventsGrid({ events, onStarClick }) {
  const eventIds = events.map((e) => e.eid);
  const hasDuplicates = eventIds.some(
    (id, index) => eventIds.indexOf(id) !== index
  );
  const [favEvents, setFavEvents] = useState([]);

  const loadFavEvents = async () => {
    //load the users favourite events if logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const favEvents = await fetch(`/api/accounts/${user.id}`)
        .then((res) => res.json())
        .then((data) => data.fav_events);
      setFavEvents(favEvents);
    }
  };

  useEffect(() => {
    loadFavEvents();
  }, [favEvents]);

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
