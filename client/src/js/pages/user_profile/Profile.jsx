import React, { useState, useEffect } from "react";
import "../../../css/pages/user_profile/Profile.css";
import Cards from "../../components/Cards";
import ReactDOM from "react-dom";
import UserSidebar from "../../components/UserSidebar";
import EventCategory from "../../components/EventCategory";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [favouriteEvents, setFavouriteEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchData = () => {
    fetch("/api/accounts/2")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
        setOrgs(data.orgs);
        setFavouriteEvents(data.fav_events);
        setEvents(data.events);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <UserSidebar name={name} email={email} orgs={orgs} />
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
