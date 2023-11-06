// CreateEvent.jsx
import React, { useState, useEffect } from "react";
import "../../../css/pages/host_profile/Create_Event.css";
import TagSelect from "./Tag_Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HostSidebar from "../../components/HostSidebar";
import { useNavigate } from "react-router-dom";

function convertTimetoString(hour, minute) {
  const formattedHour = `${hour}`.padStart(2, "0");
  const formattedMinute = `${minute}`.padStart(2, "0");
  return `${formattedHour}:${formattedMinute}`;
}

export default function Create_Event({ hid }) {
  const [name, setEventName] = useState("");
  const currentDate = new Date();
  const [date, setDate] = useState(new Date());
  const [hour1, setHour1] = useState(0);
  const [minute1, setMinute1] = useState(0);
  const [hour2, setHour2] = useState(0);
  const [minute2, setMinute2] = useState(0);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [tags, setSelectedTags] = useState([]);
  const [reoccuring, setReoccuring] = useState(0);
  const [eventPhoto, setEventPhoto] = useState(null);
  const [hostname, setHostName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [owner, setOwner] = useState(-1);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleTagChange = (tags) => {
    setSelectedTags(tags);
  };
  const handleEventPhotoChange = (e) => {
    const file = e.target.files[0];
    setEventPhoto(file);
  };
  const handleDateChange = (newDate) => {
    const currentDate = new Date();
    setDate(newDate);
  };
  const handleSelectReocurring = (event) => {
    setReoccuring(event.target.value);
  };

  useEffect(() => {
    fetch(`/api/hosts/${hid}`)
      .then((res) => res.json())
      .then((data) => {
        setHostName(data.name);
        setEmail(data.email);
        setBio(data.bio);
        setOwner(data.owner);
        setEvents(data.events);
      });
  }, [hid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateCreated = currentDate.toISOString();
    const startTime = new Date(0, 0, 0, hour1, minute1);
    const endTime = new Date(0, 0, 0, hour2, minute2);
    if (startTime > endTime) {
      setError("End time must be after start time");
    } else {
      const event = {
        name: name,
        description: description,
        location: location,
        date: date,
        start_time: convertTimetoString(hour1, minute1),
        end_time: convertTimetoString(hour2, minute2),
        capacity: capacity,
        reoccuring: reoccuring,
        date_created: dateCreated,
        attendees: [],
        owner: owner,
        tags: tags,
        //eventPhoto, //event photo not in models yet
      };
      console.log("Event Data:", event);

      //create new event
      fetch("/api/events/all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log(events);
          const new_events = {
            events: [...events, data.eid],
            name: hostname,
            email: email,
            bio: bio,
            owner: owner,
          };
          console.log(new_events);
          if (data && data.eid) {
            // Update host data
            fetch(`/api/hosts/${hid}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(new_events),
            })
              .then((res2) => {
                if (!res2.ok) {
                  throw new Error(`HTTP error! Status: ${res2.status}`);
                }
                return res2.json();
              })
              .then(() => {
                console.log("successfully updated host events");
                navigate(`/events/${data.eid}`);
              })
              .catch((err) => {
                console.log("error:", err);
                setErrorMessage(err.message);
              });
          }
        })
        .catch((err) => {
          console.log("error:", err);
          setErrorMessage(err.message);
        });
    }
  };

  const handleCancel = () => {
    navigate(`/host_profile/${hid}`);
  };

  return (
    <>
      <HostSidebar hid={hid} name={hostname} email={email} bio={bio} />
      <div className="form_block_event">
        <h1>Create Event</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Event Name"
              value={name}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <br></br>
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
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity:</label>
            <input
              type="number"
              className="form-control"
              id="capacity"
              name="capacity"
              value={capacity}
              min="0"
              onChange={(e) => setCapacity(e.target.value)}
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
              value={reoccuring}
              onChange={handleSelectReocurring}
            >
              <option value="0">Not Recurring</option>
              <option value="1">Daily</option>
              <option value="2">Weekly</option>
              <option value="3">Bi-weekly</option>
              <option value="4">Monthly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="eventPhoto" className="button_event">
              Upload Photo
            </label>
            <div className="d-flex align-items-start">
              <input
                type="file"
                id="eventPhoto"
                accept="image/*"
                onChange={handleEventPhotoChange}
              />
              <br></br>
              {eventPhoto && (
                <img
                  src={URL.createObjectURL(eventPhoto)}
                  alt="Selected Event Photo"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              )}
            </div>
          </div>
          <div className="button-group">
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="button_event">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
