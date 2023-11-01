import React, { useState, useEffect } from "react";
import "../../../css/pages/user_profile/Profile_previous.css";
import Cards from "../../components/Cards";
import UserSidebar from "../../components/UserSidebar";

export default function Profile_favourites() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [favouriteEvents, setFavouriteEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/accounts/2")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
        setOrgs(data.orgs);
        setFavouriteEvents(data.fav_events);
        setEvents(data.events);

        setPreviousEvents(
          data.events.filter((event) => {
            return new Date(event.date) < new Date();
          })
        );

        setUpcomingEvents(
          data.events.filter((event) => {
            return new Date(event.date) >= new Date();
          })
        );
      });
  }, []);
  return (
    <>
      <UserSidebar name={name} email={email} orgs={orgs} />
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Previous Events</h2>
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
