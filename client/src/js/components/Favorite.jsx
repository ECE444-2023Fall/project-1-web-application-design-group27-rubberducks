import React from "react";
import CardItem from "./CardItem";
import "../../css/components/CardItem.css";

function Favorites({ events }) {
  if (!events || events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <div className="cards">
      <div className="cards--container">
        <div className="cards--wrapper">
          {events.map(event => (
            <CardItem
              key={event.eid}
              src={event.image || "../../../images/placeholder.png"}
              text={event.name}
              date={event.date || "placeholder date"}
              location={event.location || "placeholder location"}
              path={`/events/${event.eid}`}
              onClick={() => onCardClick(event)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
