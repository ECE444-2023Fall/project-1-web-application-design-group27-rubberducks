import React from "react";
import CardItem from "./CardItem";
import "../../css/components/Cards.css";

function UserCards({org,onCardClick}) {
  return (
    <div className="cards">
      <div className="cards--container">
        <div className="cards--wrapper">
          <ul className="cards--items">     
            <CardItem
            key={org.hid}
            src={org.image || "images/placeholder.png"} // assuming 'org' has an 'image' property
            text={org.name} // assuming 'org' has a 'name' property
            label={org.category || "placeholder"} // assuming 'org' has a 'category' property
            date={org.date || "placeholder date"} // assuming 'org' has a 'date' property
            location={org.location || "placeholder location"} // assuming 'org' has a 'location' property
            path={`/host_profile/${org.hid}`}
            onClick={() => onCardClick(org)}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserCards;