import React, { useState, useEffect } from "react";
import "./Profile.css";
import Cards from "../../Cards";
import { MdEdit } from "react-icons/md";
import ReactDOM from "react-dom";

export default function Profile() {
  useEffect(() => {
    fetch("/accounts/1")
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  const [message, setMessage] = React.useState("");
  return (
    <>
      <div>{message}</div>
      <div className="edit--button">
        <button className="edit--button-icon">
          <MdEdit />
        </button>
      </div>
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
              <a href="/profile/favourite">See all</a>
            </span>
          </div>
          <Cards />
        </div>
        <hr />
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Upcoming Events</h2>
            <span className="card--see-all small">
              <a href="/profile/upcoming">See all</a>
            </span>
          </div>
          <Cards />
        </div>
        <hr />
        <div className="profile--category previous">
          <div className="card--header">
            <h2 className="card--heading">Previous Events</h2>
            <span className="card--see-all small">
              <a href="/profile/previous">See all</a>
            </span>
          </div>
          <Cards />
        </div>
      </div>
    </>
  );
}
