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
import AttendeeList from "./host_profile/Attendee";
import { Loader } from "@googlemaps/js-api-loader";
import tagData from '../../../tags.json';
import { Get_Img_Link } from "../components/Get_Img_Link";
import { bouncy } from "ldrs";

// format the imported time to display in AM/PM
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

// format the imported date to display as dd, month yyyy
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// return the string associated with the reoccurring integer
function processReoccuring(reoccuring) {
  const label = ["Not Reoccuring", "Daily", "Weekly", "Bi-weekly", "Monthly"];

  if (reoccuring >= 0 && reoccuring <= 4) {
    return label[reoccuring];
  } else {
    return "Invalid reoccurrence value";
  }
}

function convertTags(tagList) {
  // Check if tagList is empty
  if (!tagList || tagList.length === 0) {
      return null;
  }

  // Create a mapping from numbers to words based on the tag data
  const mapping = tagData.tags.reduce((acc, tag, index) => {
      acc[(index + 1)] = tag.tag;
      return acc;
  }, {});

  // Convert number strings to integers and then to words using the mapping
  const result = [];
  for (let i = 0; i < tagList.length; i++) {
      const numStr = tagList[i];
      const num = parseInt(numStr, 10);
      result.push(mapping[num]);
  }

  return result;
}

export default function EventDetailsPage() {
  const { eventId = "" } = useParams();
  const { eventInfo, hostInfo, userInfo, userLoggedIn, ownerLoggedIn, isAlreadyRegistered, loading } = useGetEventInfo(eventId);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const formattedDate = formatDate(eventInfo.date);
  const formattedStartTime = formatTime(eventInfo.start_time);
  const formattedEndTime = formatTime(eventInfo.end_time);
  const reoccurrence = processReoccuring(eventInfo.reoccuring);
  const tagLabels = convertTags(eventInfo.tags);

  const [checkRegistered, setCheckRegistered] = useState(isAlreadyRegistered);

  const checkIfRegistered = () => {
    if (!loading && userLoggedIn) {
      console.log("user", userInfo);
      if (eventInfo.attendees.includes(userInfo.uid)) {
        setCheckRegistered(true);
      } else {
        setCheckRegistered(false);
      }
    } else {
      setCheckRegistered(false);
    }
  };

  useEffect(() => {
    checkIfRegistered();
  }, [userLoggedIn, eventInfo, userInfo]);

  const handleRegister = () => {
    // checkIfRegistered();
    console.log("user", userInfo);
    //make sure there is still space left for the event
    if (eventInfo.attendees.length >= eventInfo.capacity) {
      setMessage("The event is at full capacity.");
      // if user isn't logged in, send them to login page
    } else if (!userLoggedIn) {
      setMessage("Please log in to register.")
      navigate(`/login`);
      // if user is already listed as attendee, 
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
          profile_pic: eventInfo.profile_pic,
        }),
      }).then((response) => {
        if (response.ok) {
          //update registered event in user's account
          if (userInfo.events.includes(eventId)) {
            console.log("User's events already includes this event");
          } else {
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
                profile_pic: userInfo.profile_pic,
              }),
            }).then((response) => {
              if (response.ok) {
                console.log("User account updated successfully.");
                setCheckRegistered(true);
              } else {
                // Handle errors, e.g., show an error message
                console.error("User account update failed.");
              }
            });
            setMessage("You are successfully registered.");
          }
        } else {
          setMessage("Registration Failed.");
        }
      });
    }
    checkIfRegistered();
  };

  const handleUnregister = () => {
    // checkIfRegistered();
    console.log("user", userInfo);
    //check that user is registered
    if (eventInfo.attendees.includes(userInfo.uid)) {

      console.log(`event attendees before: ${eventInfo.attendees}`)
      const updated_attendees = eventInfo.attendees.filter((u) => u !== parseInt(userInfo.uid,10))
      console.log(`event attendees after: ${updated_attendees}`)

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
          attendees: updated_attendees,
          profile_pic: eventInfo.profile_pic,
        }),
      }).then((response) => {
        if (response.ok) {
          //remove event from user's account
          console.log(`account events before: ${userInfo.events}`)
          const updated_events = userInfo.events.filter((e) => e !== parseInt(eventId,10))
          console.log(`account events before: ${updated_events}`)
          
          fetch(`/api/accounts/${userInfo.uid}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: userInfo.name,
              email: userInfo.email,
              events: updated_events,
              fav_events: userInfo.fav_events,
              orgs: userInfo.orgs,
              msgids: userInfo.msgids,
              profile_pic: userInfo.profile_pic,
            }),
          }).then((response) => {
            if (response.ok) {
              console.log("User account updated successfully.");
              setCheckRegistered(false);
            } else {
              // Handle errors, e.g., show an error message
              console.error("User account update failed.");
            }
          });
          setMessage("You are successfully unregistered.");
        } else {
          setMessage("Unregistration Failed.");
        }
      });
    } else {
      setMessage("You have not registered yet.");
    }
    checkIfRegistered();
  };

  const isOwner = userInfo.uid === hostInfo.owner;

  const handleEdit = () => {
    navigate(`/events/${eventId}/edit_event`);
  };

  const imageUrl = Get_Img_Link(eventInfo.profile_pic);

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <l-bouncy size="45" speed="1.75" color="#002452"></l-bouncy>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <HostSidebar
        ownerLoggedIn={ownerLoggedIn}
        hid={hostInfo.hid}
        name={hostInfo.name}
        email={hostInfo.email}
        bio={hostInfo.bio}
        profile_pic={hostInfo.profile_pic}
      />
      <div className="event">
        <div className="event--base">
          <div className="event--header">
            <img className="event--bg" src={imageUrl}/>
            <div className="event--header-bar">
              <h1 className="event--header-text">{eventInfo.name}</h1>
              <ul className="event-subtitle">{hostInfo.name}</ul>
              {/* display event button only if current user is the owner of the event host */}
              {isOwner && (
              <Button onClick={handleEdit} buttonStyle="event--edit-btn" buttonSize="btn--large">
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
                        ) : checkRegistered ? (
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
                      {!loading && tagLabels !== null ? (
                        tagLabels.map(tagLabel => (
                        <div key={tagLabel} className="event-tag">
                          {tagLabel}
                        </div>
                      ))
                      ) : (
                        <div className="text">{""}</div>
                      )}  
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

