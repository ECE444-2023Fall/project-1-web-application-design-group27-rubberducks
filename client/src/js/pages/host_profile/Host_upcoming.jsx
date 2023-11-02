import React, { useState, useEffect } from "react";
import "../../../css/pages/host_profile/Host_upcoming.css";
import Cards from "../../components/Cards";

export default function Host_upcoming({hid}) {
  const [hostname, setHostName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`/api/hosts/${hid}`)
      .then((res) => res.json())
      .then((data) => {
        setHostName(data.name);
        setEmail(data.email);
        setBio(data.bio);
        setEvents(data.events);
      });
  }, [hid]);
  return (
    <>
      <div className="sidebar">
        <img src="../../../../images/placeholder.png" alt="Profile Picture" />
        <div className="host--name">{hostname}</div>
        <div className="host--email">{email}</div>
        <div className="host--bio">
          <h2 className="sidebar--heading">Bio</h2>
          <p className="sidebar--paragraph">
            {bio}
          </p>
        </div>
        <div className="host--tags">
          <h2 className="sidebar--heading">Tags</h2>
        </div>
      </div>
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Upcoming Events</h2>
            <span className="card--see-all small">
              <a href={`/host_profile/${hid}`}>Return to Profile</a>
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
