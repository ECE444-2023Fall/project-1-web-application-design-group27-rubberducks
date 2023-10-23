import React from "react";
import CardItem from "./CardItem";
import "./Cards.css";

function Cards() {
  return (
    <div className="cards">
      <h1>Events</h1>
      <div className="cards--container">
        <div className="cards--wrapper">
          <ul className="cards--items">
            <CardItem
              src="images/placeholder.png"
              text="placeholder title"
              label="placeholder"
              path="/events"
            />
            <CardItem
              src="images/placeholder.png"
              text="placeholder title"
              label="placeholder"
              path="/events"
            />
            <CardItem
              src="images/placeholder.png"
              text="placeholder title"
              label="placeholder"
              path="/events"
            />
            <CardItem
              src="images/placeholder.png"
              text="placeholder title"
              label="placeholder"
              path="/events"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
