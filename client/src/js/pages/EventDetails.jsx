import React from "react";
//import React, { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import EventDetails from "../components/EventDetails";

function EventDetailsPage() {

  return (
    <>
      <Navbar />
      <EventDetails />
    </>
  );

}

export default EventDetailsPage;

  // const [event, setEvent] = useState("");

  // useEffect(() => {

  //   fetch("/api/events/${eid}")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const jsonString = JSON.stringify(data, null, 2);
  //       setEvent(jsonString);
  //     })
  //     .catch((error) => console.error("Failed to fetch event", error));

  // }, [eid]);

    // return (
  //   <div>
  //       {events.map(event => (
  //         <EventDetails key={eid} event={event}/>
  //       ))}
  //   </div>
  // );
