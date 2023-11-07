import React from "react";
// import React, { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import EventHostSidebar from "../components/EventHostSideBar";
import EventDetails from "../components/EventDetails";
import { useGetHostInfo } from "../useGetHostInfo";
import { useGetEventInfo } from "../useGetEventInfo";

export default function EventDetailsPage() {
  const { eventId = "" } = useParams();
  const { eventInfo, loadingEvent } = useGetEventInfo(eventId);
  const hostId = eventInfo.owner;
  const { hostInfo, loadingHost } = useGetHostInfo(hostId);

  return (
    <>
      <Navbar />
      <EventHostSidebar
        hid={hostInfo.hid}
        name={hostInfo.name}
        email={hostInfo.email}
        bio={hostInfo.bio}
      />
      <EventDetails 
        name={eventInfo.name}
        owner={eventInfo.owner}
        date={eventInfo.date}
        start_time={eventInfo.start_time}
        end_time={eventInfo.end_time}
        location={eventInfo.location}
        description={eventInfo.description}
        tags={eventInfo.tags}
        reoccuring={eventInfo.reoccuring}
        capacity={eventInfo.capacity}
      />
    </>
  );

}


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
