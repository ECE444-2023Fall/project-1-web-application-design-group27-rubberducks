import React from "react";
import "./Host_previous.css";
import Cards from "../Cards";

export default function Host_favourites() {
  return (
    <>
      <div className="sidebar">
        <img src="../../../images/placeholder.png" alt="Profile Picture" />
        <div className="host--name">host</div>
        <div className="host--email">host@example.com</div>
        <div className="host--bio">
          <h2 className="sidebar--heading">Bio</h2>
          <p className="sidebar--paragraph">
            This is my bio. I am a host and I love to organize events.
          </p>
        </div>
      </div>
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Previous Events</h2>
            <span className="card--see-all small">
              <a href="/host_profile">Return to Profile</a>
            </span>
          </div>
          <Cards />
          <Cards />
          <Cards />
        </div>
      </div>
    </>
  );
}
