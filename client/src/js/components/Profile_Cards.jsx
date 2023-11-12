import React from "react";
import CardItem from "./CardItem";

function ProfileCards({ events }) { // Accept events as a prop
  return (
    <div className="cards">
      <div className="cards--container">
        <div className="cards--wrapper">
          <ul className="cards--items">
            {events.map((event, index) => (
              <CardItem
                key={index}
                src={event.image || "../../../images/placeholder.png"}
                text={event.name}
                start_time = {event.start_time}
                end_time = {event.end_time}
                date={event.date}
                location={event.location}
                path={`/events/${event.eid}`} // Construct path dynamically
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfileCards;
