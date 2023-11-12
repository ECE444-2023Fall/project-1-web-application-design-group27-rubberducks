import React from "react";
import ProfileCards from "./Profile_Cards";
import "../../css/components/ProfileCategory.css";
//This file is used in My Profile and Host Profile, it will display different categories
//such as favorite/upcoming/previous events. 
function ProfileCategory(props) {
  if (!props.events || props.events.length === 0) {
    return (
      <div className="profile--category">
        <div className="card--header">
          <h2 className="card--heading">{props.title}</h2>
          <span className="card--see-all small">
            <a href={props.link}>See all</a>
          </span>
        </div>
        <div className="profile--category--empty">
                You do not have any events. <a href="/events"> Find Events</a>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="profile--category">
        <div className="card--header">
          <h2 className="card--heading">{props.title}</h2>
          <span className="card--see-all small">
            <a href={props.link}>See all</a>
          </span>
        </div>
        <ProfileCards events={props.events} />{" "}
        {/* Pass the events prop to Cards */}
      </div>
    </>
  );
}

export default ProfileCategory;
