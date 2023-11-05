import React from "react";
import Cards from "./Cards";

function ClubCategory(props) {
  return (
    <>
      <div className="profile--category">
        <div className="card--header">
          <h2 className="card--heading">{props.title}</h2>
        </div>
        <Cards />
      </div>
    </>
  );
}

export default ClubCategory;
