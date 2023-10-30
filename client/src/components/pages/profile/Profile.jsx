import React, { useState, useEffect } from "react";
import "./Profile.css";
import Cards from "../../Cards";
import ReactDOM from "react-dom";
import Sidebar from "../../Sidebar";
import EventCategory from "../../EventCategory";

export default function Profile() {
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
      <Sidebar name={name} email={email} orgs={orgs} />
      <div className="user--events">
        <EventCategory title="Favourite Events" link="/profile/favourite" />
        <hr />
        <EventCategory title="Upcoming Events" link="/profile/upcoming" />
        <hr />
        <div className="previous--events">
          <EventCategory title="Previous Events" link="/profile/previous" />
        </div>
      </div>
    </>
  );
}
