import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt,  FaCalendar, FaClock } from "react-icons/fa";
//import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import EventHostSidebar from "../components/EventHostSideBar";
// import { useGetHostInfo } from "../useGetHostInfo";
import { useGetEventInfo } from "../useGetEventInfo";
// import { Map } from './Map';
import { Button } from "../components/Button";
import "../../css/components/EventDetails.css";
import "../../css/components/Button.css";
// import TagSelect from "./host_profile/Tag_Select";
import AttendeeList from "./host_profile/Attendee";

function formatTime(timeString) {
  // Use a regular expression to extract hours and minutes
  const timeParts = /^(\d+):(\d+):\d+$/.exec(timeString);

  if (!timeParts) {
    return "Invalid time format";
  }

  const hours = parseInt(timeParts[1], 10);
  const minutes = parseInt(timeParts[2], 10);

  // Format the time in 12-hour format
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  // Use padStart to ensure two-digit minutes
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${period}`;
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function processReoccuring(reoccuring) {
  const label = [
    "Not Reoccuring",
    "Daily",
    "Weekly",
    "Bi-weekly",
    "Monthly",
  ];

  if (reoccuring >= 0 && reoccuring <= 4) {
    return label[reoccuring];
  } else {
    return "Invalid reoccurrence value";
  }
}

// function translateTags(tags) {

//   const tagNames = [
//     "Zero", "One", "Two", "Three", "Four",
//     "Five", "Six", "Seven", "Eight", "Nine"
//   ];

//   const result = tags.map((num) => {
//     if (num >= 0 && num < tagNames.length) {
//       return tagNames[num];
//     }
//     return "";
//   });

//   return result;
// }


export default function EventDetailsPage() {
  const { eventId = "" } = useParams();
  const [loading, setLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState({});
  const [hostInfo, setHostInfo] = useState({});
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadEventInfo = async () => {
      try {
        const eventResponse = await fetch("/api/events/" + eventId);

        if (eventResponse.status === 404) {
          setError("Event not found");
        } else if (eventResponse.ok) {
          const eventData = await eventResponse.json();
          setEventInfo(eventData);

          const hostId = eventData.owner;

          const hostResponse = await fetch("/api/hosts/" + hostId);

          if (hostResponse.status === 404) {
            setError("Host not found");
          } else if (hostResponse.ok) {
            const hostData = await hostResponse.json();
            setHostInfo(hostData);
          } else {
            setError("Error fetching host information");
            console.log(hostResponse.status);
          }
        } else {
          setError("Error fetching event information");
          console.log(eventResponse.status);
        }
      } catch (err) {
        setError("Network error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEventInfo();
  }, [eventId]);


  const formattedDate = formatDate(eventInfo.date);
  const formattedStartTime = formatTime(eventInfo.start_time);
  const formattedEndTime = formatTime(eventInfo.end_time);
  const reoccurrence = processReoccuring(eventInfo.reoccuring);
  // const tagArray = translateTags(eventInfo.tags);

  const [button, setButton] = useState(true);

  const showButton = () => {
      setButton(true);
  };

  useEffect(() => {
    showButton();
  }, []);

  return (
    <>
      <Navbar />
      <EventHostSidebar
        hid={hostInfo.hid}
        name={hostInfo.name}
        email={hostInfo.email}
        bio={hostInfo.bio}
      />
      <div className="event">
        <div className="event--base">
          <div className="event--header-pic">
          {/* <div className="event--header-pic" style={{ backgroundImage: 'url("images/placeholder.png"), linearGradient(rgba(0, 0, 0, 0.1))' }}> */}
          {/* <div className="event--header-pic" style={{ backgroundImage: 'url("images/placeholder.png")' }}> */}
            <div className="event--header-bar">
              <h1 className="event--header-text">{eventInfo.name}</h1>
              { error ? <ul className="event-subtitle">Error: {error}</ul> : (
                <ul className="event-subtitle">{hostInfo.name}</ul>
              )}
              < Button to="/events" buttonStyle=".btn--grey" buttonSize="btn--large">
                Edit Event
              </Button>
            </div>
          </div>
          <div className="event--main">
            <div className="event--container">
              <div className="event--column-wrapper">
                <div className="event--two-columns-left-offset">
                  <div className="event--column-left">
                    <ul className="event--item-center">
                      <FaCalendar className="event--icon" />
                      <span>{formattedDate}</span>
                    </ul>
                    <ul className="event--item-center">
                      <FaClock className="event--icon" />
                      <ul>{formattedStartTime}</ul>
                      <ul>{"-  "}</ul>
                      <ul>{formattedEndTime}</ul>
                    </ul>
                    <ul className="event--item-center">
                      <FaMapMarkerAlt className="event--icon" />
                      <span>{eventInfo.location}</span>
                    </ul>
                  </div>
                  <div className="event--column-right">
                  <ul>
                    <span>{eventInfo.description}</span>
                  </ul>
                  </div>
                </div>
                <div className="event--two-columns-left-offset">
                  <div className="event--register">
                    <div className="event--button">
                      {button && (
                      <Button to="/events" buttonStyle="btn--register" buttonSize="btn--large">
                          Register
                      </Button>
                      )}
                    </div>
                    <div className="event--button">
                      {button && (
                      <Button to={`/events/${eventId}/attendees`} buttonStyle="btn--register" buttonSize="btn--large">
                           Attendee Info
                      </Button>
                      )}
                    </div>
                  </div>
                  <div className="event--additional-info">
                    <div className="event--item">
                      <div className="label">{"Event Tags"}</div>
                      {/* <div className="text">
                        {tagArray.map((tag, index) => (
                          <span key={index} className="event-tag">{tag}</span>
                        ))}
                      </div> */}
                      <div className="text">{eventInfo.tags}</div>
                    </div>
                    <div className="event--item">
                      <div className="label">{"Reoccurrence"}</div>
                      <div className="text">{reoccurrence}</div>
                    </div>
                    <div className="event--item">
                      <div className="label">{"Event Capacity"}</div>
                      <div className="text">{eventInfo.capacity}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="event--container">
            <div className="event--wrapper">
              <div className="event--item">
                <ul>
                  <FaMapMarkerAlt className="event--icon" />
                  <span>{"google maps location"}</span>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
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
