import React, { useState, useEffect } from "react";
import "../../../css/pages/host_profile/Host_Profile.css";
import Cards from "../../components/Cards";
import { MdEdit } from "react-icons/md";
import HostSidebar from "../../components/HostSidebar";
import EventCategory from "../../components/EventCategory";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function Host_profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [events, setEvents] = useState([]);
  const [owner, setOwner] = useState(-1);

  useEffect(() => {
    fetch("/api/hosts/6")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
        setBio(data.bio);
        setEvents(data.events);
        setOwner(data.owner);
      });
  }, []);
  return (
    <>
      <div className="createEventBtnContainer">
        <Link to="/host_profile/create_event">
          <Button variant="primary">Create Event</Button>
        </Link>
      </div>
      <HostSidebar name={name} email={email} bio={bio} />
      <div className="host--events">
        <EventCategory title="Upcoming Events" link="/host_profile/upcoming" />
        <hr />
        <div className="previous--events">
          <EventCategory
            title="Previous Events"
            link="/host_profile/previous"
          />
        </div>
      </div>
    </>
  );
}
