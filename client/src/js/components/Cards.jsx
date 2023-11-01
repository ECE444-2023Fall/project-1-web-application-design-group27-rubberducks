import React from "react";
import CardItem from "./CardItem";
import "../../css/components/Cards.css";

function Cards() {
  return (
    <div className="cards">
      <div className="cards--container">
        <div className="cards--wrapper">
          <ul className="cards--items">
            <CardItem
              src="images/placeholder.png"
              text="placeholder title"
              label="placeholder"
              date="placeholder date"
              location="placeholder location"
              path="/events"
            />
            <CardItem
              src="images/placeholder.png"
              text="placeholder title"
              label="placeholder"
              date="placeholder date"
              location="placeholder location"
              path="/events"
            />
            <CardItem
              src="images/placeholder.png"
              text="placeholder title"
              label="placeholder"
              date="placeholder date"
              location="placeholder location"
              path="/events"
            />
            <CardItem
              src="images/placeholder.png"
              text="placeholder title"
              label="placeholder"
              date="placeholder date"
              location="placeholder location"
              path="/events"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
