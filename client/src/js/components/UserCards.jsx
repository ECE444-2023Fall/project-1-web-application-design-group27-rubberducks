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
            src={org.image || "images/placeholder.png"} 
            text={org.name}
            path={`/hosts/${org.hid}`}
            onClick={() => onCardClick(org)}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserCards;