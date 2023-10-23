import React from "react";
import "./Profile_favourites.css";
import Cards from "../../Cards";

export default function Profile_favourites() {
  return (
    <>
      <div className="sidebar">
        <img src="../../../images/placeholder.png" alt="Profile Picture" />
        <div className="user--name">John Doe</div>
        <div className="user--email">john.doe@example.com</div>
      </div>
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Favourite Events</h2>
            <span className="card--see-all small">
              <a href="/profile">Return to Profile</a>
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
