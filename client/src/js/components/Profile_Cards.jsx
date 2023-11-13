import React from "react";
import CardItem from "./CardItem";
import { Get_Img_Link } from "./Get_Img_Link";
import { Get_Profile_Img_Link } from "./Get_Img_Link";

function ProfileCards({ events }) { // Accept events as a prop
  return (
    <div className="cards">
      <div className="cards--container">
        <div className="cards--wrapper">
          <ul className="cards--items">
            {events.map((event, index) => (
              <CardItem
                key={index}
                src = {Get_Img_Link(event.profile_pic)}
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
