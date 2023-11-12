import React from "react";
import CardItem from "./CardItem";
import "../../css/components/CardItem.css";
import { Get_Img_Link } from "./Get_Img_Link";
//This file links each card to its corresponding event, it is used for favorites/upcoming/previous events in profile/host_profile page
function Favorites({ events }) {
  return (
    <div className="cards">
      <div className="cards--container">
        <div className="cards--wrapper">
          {events.map(event => (
            <CardItem
              key={event.eid}
              src={Get_Img_Link(event.profile_pic)}
              text={event.name}
              date={event.date}
              location={event.location}
              start_time = {event.start_time}
              end_time = {event.end_time}
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
