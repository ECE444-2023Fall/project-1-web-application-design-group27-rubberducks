import React from "react";
import CardItem from "./CardItem";
import "../../css/components/Cards.css";

function ProfileCards({ events }) { // Accept events as a prop
  return (
    <div className="cards">
      <div className="cards--container">
        <div className="cards--wrapper">
          <ul className="cards--items">
            {events.map((event, index) => (
              <CardItem
                key={index}
                src={event.image || "images/placeholder.png"}
                text={event.title || "placeholder title"}
                label={event.label || "placeholder"}
                date={event.date || "placeholder date"}
                location={event.location || "placeholder location"}
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
