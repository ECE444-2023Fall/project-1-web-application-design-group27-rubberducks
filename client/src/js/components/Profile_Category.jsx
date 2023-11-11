import React from "react";
import ProfileCards from "./Profile_Cards";

function ProfileCategory(props) {
  return (
    <>
      <div className="profile--category">
        <div className="card--header">
          <h2 className="card--heading">{props.title}</h2>
          <span className="card--see-all small">
            <a href={props.link}>See all</a>
          </span>
        </div>
        <ProfileCards events={props.events} /> {/* Pass the events prop to Cards */}
      </div>
    </>
  );
}

export default ProfileCategory;
