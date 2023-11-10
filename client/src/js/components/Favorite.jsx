import React from "react";
import CardItem from "./CardItem";
import "../../css/components/Eventcard.css";


function Favorites({event,onCardClick}) {
  return (
    <div className="cards">
      <div className="cards--container">
        <div className="cards--wrapper">
          <ul className="cards--items">    
            <CardItem
            key={event.eid}
            img src="../../../images/placeholder.png"
            text={event.name} 
            date={event.date || "placeholder date"} 
            location={event.location || "placeholder location"}
            path={`/events/${event.eid}`}
            onClick={() => onCardClick(org)}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}


export default Favorites;