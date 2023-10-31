import React from "react";
import Cards from "./Cards";

function EventCategory(props) {
  return (
    <>
      <div className="profile--category">
        <div className="card--header">
          <h2 className="card--heading">{props.title}</h2>
          <span className="card--see-all small">
            <a href={props.link}>See all</a>
          </span>
        </div>
        <Cards />
      </div>
    </>
  );
}

export default EventCategory;
