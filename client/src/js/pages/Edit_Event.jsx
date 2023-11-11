import React, { useState, useEffect, useRef} from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TagSelect from "./host_profile/Tag_Select";
import "../../css/pages/host_profile/Create_Event.css"
import { convertTimetoString } from "./host_profile/Create_Event";
import Navbar from "../components/Navbar";
import EventHostSidebar from "../components/EventHostSideBar";
import { bouncy } from "ldrs";
import { set } from "react-hook-form";

export default function Edit_Event() {
  const navigate = useNavigate();
  const { eventId = "" } = useParams();
  const [loading, setLoading] = useState(true);
  const [eventInfo, setEventInfo] = useState({});
  const [hostInfo, setHostInfo] = useState({});
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [hour1, setHour1] = useState(0);
  const [minute1, setMinute1] = useState(0);
  const [hour2, setHour2] = useState(0);
  const [minute2, setMinute2] = useState(0);
  const [tags, setSelectedTags] = useState([]);
  const currentDate = new Date();
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState([0, 0]); // [lat, lng]
  //MAPS API
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "ca" },
    fields: ["address_components", "name", "geometry"],
  };
  bouncy.register();
  
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
          setSelectedTags(eventData.tags);
          setDate(new Date(eventData.date));
          setStartTime(eventData.start_time);
          setEndTime(eventData.end_time);
          setLocation(eventData.location);

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
      }
    };
    const getUserInfo = async () => {
      const get_user = JSON.parse(localStorage.getItem("user"));
      if (!get_user || !get_user.id) {
        console.error("No user id found");
        setError("User not logged in");
      } else {
        const userResponse = await fetch(`/api/accounts/${get_user.id}`);
        if (userResponse.status === 404) {
          setError("User information not found");
        } else if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
      }
    };
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current.getPlace();
      setLocation(place.name);
      setCoords([place.geometry.location.lat(), place.geometry.location.lng()]);
    });
    loadEventInfo();
    getUserInfo();
  }, [eventId]);
  
  const handleTagChange = (tags) => {
    setSelectedTags(tags);
  };
  const handleSelectReocurring = (e) => {
    setEventInfo({ ...eventInfo, reoccuring: e.target.value });
  };
  const handleCancel = () => {
    navigate(`/events/${eventId}`);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  useEffect(() => {
    setLoading(true);
    const [hourStr, minuteStr] = start_time.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    setHour1(hour);
    setMinute1(minute);
    setLoading(false);
  }, [start_time]);

  useEffect(() => {
    setLoading(true);
    const [hourStr, minuteStr] = end_time.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    setHour2(hour);
    setMinute2(minute);
    setLoading(false);
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current.getPlace();
      setLocation(place.name);
      setCoords([place.geometry.location.lat(), place.geometry.location.lng()]);
    });
  }, [end_time]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const startTime = new Date(0, 0, 0, hour1, minute1);
    const endTime = new Date(0, 0, 0, hour2, minute2);
    if (startTime > endTime) {
      setError("End time must be after start time");
      return;
    }
    const updatedEvent = {
        name: eventInfo.name,
        date: date,
        description: eventInfo.description,
        location: location,
        coords: coords,
        start_time: convertTimetoString(hour1, minute1),
        end_time: convertTimetoString(hour2, minute2),
        capacity: eventInfo.capacity,
        reoccuring: eventInfo.reoccuring,
        date_created: eventInfo.date_created,
        attendees: eventInfo.attendees,
        owner: eventInfo.owner,
        tags: tags,
    };

    fetch(`/api/events/${eventId}`, {
      method: "PUT", // Update the method to PUT
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Event updated successfully:", data);
        navigate(`/events/${eventId}`);
      })
      .catch((err) => {
        console.error("Error updating event:", err);
      });
  };

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
     <EventHostSidebar
        hid={hostInfo.hid}
        name={hostInfo.name}
        email={hostInfo.email}
        bio={hostInfo.bio}
      />
      <div className="form_block_event">
        <h1>Edit Event</h1>
        
        <form onSubmit={handleUpdate}>

          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Event Name"
              value={eventInfo.name}
              onChange={(e) => setEventInfo({ ...eventInfo, name: e.target.value })}
              maxLength={150}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <br />
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              minDate={currentDate}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="start_time">Start Time:</label>
            <div className="time-input-container">
              <input
                type="number"
                className="time-input"
                min="0"
                max="23"
                value={hour1}
                onChange={(e) => setHour1(e.target.value)}
              />
              <span>:</span>
              <input
                type="number"
                className="time-input"
                min="0"
                max="59"
                value={minute1}
                onChange={(e) => setMinute1(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="end_time">End Time:</label>
            <div className="time-input-container">
              <input
                type="number"
                className="time-input"
                min="0"
                max="23"
                value={hour2}
                onChange={(e) => setHour2(e.target.value)}
              />
              <span>:</span>
              <input
                type="number"
                className="time-input"
                min="0"
                max="59"
                value={minute2}
                onChange={(e) => setMinute2(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            className="form-control"
            id="location"
            name="location"
            value={location}
            ref={inputRef}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={450}
            required
          />
            </div>


          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={eventInfo.description}
              onChange={(e) => setEventInfo({ ...eventInfo, description: e.target.value })}
              maxLength={450}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity:</label>
            <input
              type="number"
              className="form-control"
              id="capacity"
              name="capacity"
              value={eventInfo.capacity}
              min="0"
              onChange={(e) => setEventInfo({ ...eventInfo, capacity: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Select Tags: </label>
            <TagSelect selectedTags={tags} onTagChange={handleTagChange} />
          </div>

          <div className="form-group">
            <label htmlFor="reoccuring" className="form_label_oneline">
              Reoccuring Options:{" "}
            </label>
            <select
              id="reoccuring"
              value={eventInfo.reoccuring}
              onChange={handleSelectReocurring}
            >
              <option value="0">Not Recurring</option>
              <option value="1">Daily</option>
              <option value="2">Weekly</option>
              <option value="3">Bi-weekly</option>
              <option value="4">Monthly</option>
            </select>
          </div>

          <div className="button-group">
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="button_event">
              Update Event
            </button>
          </div>
        </form>
      </div>
    </>
  );
}