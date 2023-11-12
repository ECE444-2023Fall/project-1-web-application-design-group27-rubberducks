import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaCalendar, FaClock } from "react-icons/fa";
//import { useNavigate } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import HostSidebar from "../components/HostSideBar";
import { useGetEventInfo } from "../useGetEventInfo";
import Map from "../components/Map";
import { Button } from "../components/Button";
import "../../css/components/EventDetails.css";
import "../../css/components/Button.css";
// import TagSelect from "./host_profile/Tag_Select";
import AttendeeList from "./host_profile/Attendee";
import { Loader } from "@googlemaps/js-api-loader";
import TagSelect from "./host_profile/Tag_Select";

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
  const label = ["Not Reoccuring", "Daily", "Weekly", "Bi-weekly", "Monthly"];

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
  const { eventInfo, hostInfo, userInfo, userLoggedIn, ownerLoggedIn, loading } = useGetEventInfo(eventId);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const formattedDate = formatDate(eventInfo.date);
  const formattedStartTime = formatTime(eventInfo.start_time);
  const formattedEndTime = formatTime(eventInfo.end_time);
  const reoccurrence = processReoccuring(eventInfo.reoccuring);
  // const tagArray = translateTags(eventInfo.tags);

  const [isRegistered, setIsRegistered] = useState(false);

  const checkIfRegistered = () => {
    if (userLoggedIn) {
      console.log("user", userInfo);
      if (eventInfo.attendees.includes(userInfo.uid)) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    } else {
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    checkIfRegistered();
  }, []);

  const handleRegister = () => {
    console.log("user", userInfo);
    //make sure there is still space left for the event
    if (eventInfo.attendees.length >= eventInfo.capacity) {
      setMessage("The event is at full capacity.");
    } else if (!userLoggedIn) {
      setMessage("Please log in to register.")
      navigate(`/login`);
    } else if (eventInfo.attendees.includes(userInfo.uid)) {
      setMessage("You are already registered.");
    } else {
      //update attendees for event
      fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: eventInfo.name,
          description: eventInfo.description,
          location: eventInfo.location,
          coords: eventInfo.coords,
          date: eventInfo.date,
          start_time: eventInfo.start_time,
          end_time: eventInfo.end_time,
          capacity: eventInfo.capacity,
          reoccuring: eventInfo.reoccuring,
          date_created: eventInfo.date_created,
          owner: eventInfo.owner,
          tags: eventInfo.tags,
          attendees: [...eventInfo.attendees, userInfo.uid],
        }),
      }).then((response) => {
        if (response.ok) {
          setMessage("You are successfully registered.");
          setIsRegistered(true);
          //update registered event in user's account
          fetch(`/api/accounts/${userInfo.uid}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: userInfo.name,
              email: userInfo.email,
              events: [...userInfo.events, eventId],
              fav_events: userInfo.fav_events,
              orgs: userInfo.orgs,
              msgids: userInfo.msgids,
            }),
          }).then((response) => {
            if (response.ok) {
              console.log("User account updated successfully.");
            } else {
              // Handle errors, e.g., show an error message
              console.error("User account update failed.");
            }
          });
        } else {
          setMessage("Registration Failed.");
          setIsRegistered(false);
        }
      });
    }
  };

  const handleUnregister = () => {
    console.log("user", userInfo);
    //make sure there is still space left for the event
    if (eventInfo.attendees.includes(userInfo.uid)) {
      fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendees: eventInfo.attendees.filter((id) => id !== userInfo.uid),
        }),
      }).then((response) => {
        if (response.ok) {
          setMessage("You are successfully unregistered.");
          setIsRegistered(false);
          //update registered event in user's account
          fetch(`/api/accounts/${userInfo.uid}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              events: userInfo.events.filter((e) => e !== eventId),
            }),
          }).then((response) => {
            if (response.ok) {
              console.log("User account updated successfully.");
            } else {
              // Handle errors, e.g., show an error message
              console.error("User account update failed.");
            }
          });
        } else {
          setMessage("Unregistration Failed.");
          setIsRegistered(true);
        }
      });
    } else {
      setMessage("You have not registered yet.");
    }
  };

  const isOwner = userInfo.uid === hostInfo.owner;

  const handleEdit = () => {
    navigate(`/events/${eventId}/edit_event`);
  };

  return (
    <>
      <Navbar />
      <HostSidebar
        ownerLoggedIn={ownerLoggedIn}
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
              <ul className="event-subtitle">{hostInfo.name}</ul>
              {/* display event button only if current user is the owner of the event host */}
              {isOwner && (
              <Button onClick={handleEdit} buttonStyle=".btn--grey" buttonSize="btn--large">
                Edit Event
              </Button>
              )}
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
                      <ul>{`${formattedStartTime} - ${formattedEndTime}`}</ul>
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
                      {ownerLoggedIn ? ( 
                        <Button to={`/events/${eventId}/attendees`} buttonStyle="btn--register" buttonSize="btn--large">
                          Attendee Info
                        </Button>
                        ) : (""                          
                      )}
                      {isRegistered ? (
                        <Button onClick={handleUnregister} buttonStyle="btn--register" buttonSize="btn--large">
                          Unregister
                        </Button>
                        ) : (
                        <Button onClick={handleRegister} buttonStyle="btn--register" buttonSize="btn--large">
                          Register
                        </Button>
                      )}
                    </div>
                    {message && <p>{message}</p>}
                  </div>
                  <div className="event--additional-info">
                    <div className="event--item">
                      <div className="label">{"Event Tags:"}</div>
                      {/* <TagSelect> selectedTags={eventInfo.tags} onTagChange={}</TagSelect> */}
                      <div className="text">{eventInfo.tags}</div>
                    </div>
                    <div className="event--item">
                      <div className="label">{"Reoccurrence:"}</div>
                      <div className="text">{reoccurrence}</div>
                    </div>
                    <div className="event--item">
                      <div className="label">{"Event Capacity:"}</div>
                      <div className="text">{eventInfo.capacity}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="map--container">
            {eventInfo && eventInfo.coords && (
              <Map lat={eventInfo.coords[0]} lng={eventInfo.coords[1]}></Map>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

