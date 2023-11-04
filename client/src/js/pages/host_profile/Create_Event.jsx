// CreateEvent.jsx
import React, { useState , useEffect } from "react";
import "../../../css/pages/host_profile/Create_Event.css";
import TagSelect from "./Tag_Select";
import TimePicker from "react-bootstrap-time-picker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Create_Event({hid}) {
  const [name, setEventName] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(0);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [tags, setSelectedTags] = useState([]);
  const [reoccuring, setReoccuring] = useState("");
  const [eventPhoto, setEventPhoto] = useState(null);
  const [hostname, setHostName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  
  const handleTagChange = (tags) => {
    setSelectedTags(tags);
  };
  const handleEventPhotoChange = (e) => {
    const file = e.target.files[0];
    setEventPhoto(file);
  };
  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };
  const handleDateChange = (newDate) => {
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
      });
  }, [hid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const dateCreated = currentDate.toISOString();
    const event = {
      name,
      date,
      time,
      location,
      description,
      capacity,
      tags,
      reoccuring,
      dateCreated,
      //eventPhoto, //event photo not in models yet
    };

    console.log("Event Data:", event);
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      />
      <div className="sidebar">
        <img src="../../../images/placeholder.png" alt="Profile Picture" />
        <div className="host--name">{hostname}</div>
        <div className="host--email">{email}</div>
        <div className="host--bio">
          <h2 className="sidebar--heading">Bio</h2>
          <p className="sidebar--paragraph">
            {bio}
          </p>
        </div>
        <div className="host--tags">
          <h2 className="sidebar--heading">Tags</h2>
        </div>
      </div>
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
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <TimePicker
              id="time"
              name="time"
              step={30} // 30 minutes interval
              value={time}
              onChange={handleTimeChange}
              required
            />
          </div>

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
              <option value="">Not Recurring</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="montly">Monthly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="eventPhoto" className="col-form-label">
              Event Photo
            </label>
            <div className="d-flex align-items-start">
              <input
                type="file"
                id="eventPhoto"
                accept="image/*"
                onChange={handleEventPhotoChange}
              />

              {eventPhoto && (
                <img
                  src={URL.createObjectURL(eventPhoto)}
                  alt="Selected Event Photo"
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              )}
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="button_event">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
