// CreateEvent.jsx
import React, { useState, useEffect, useRef } from "react";
import "../../../css/pages/host_profile/Create_Event.css";
import TagSelect from "./Tag_Select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import { set } from "react-hook-form";
import Choose_Picture from "../../components/Choose_Picture";

// Converts integer hours and minutes selected to formatted time to be stored in the database
export function convertTimetoString(hour, minute) {
  const formattedHour = `${hour}`.padStart(2, "0");
  const formattedMinute = `${minute}`.padStart(2, "0");
  return `${formattedHour}:${formattedMinute}`;
}

export default function Create_Event() {
  const navigate = useNavigate();
  const [hostInfo, ownerLoggedIn] = useOutletContext();

  //only the owner of the host can create event for the host
  useEffect(() => {
    if (!ownerLoggedIn) {
      navigate("/login-error");
    }
  }, [ownerLoggedIn]);

  const { hostId } = useParams();

  const [name, setEventName] = useState("");
  const currentDate = new Date();
  const [date, setDate] = useState(new Date());
  const [hour1, setHour1] = useState(0);
  const [minute1, setMinute1] = useState(0);
  const [hour2, setHour2] = useState(0);
  const [minute2, setMinute2] = useState(0);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState([0, 0]); // [lat, lng]
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
  const [host_pic, setHostPic] = useState(0);
  const [error, setError] = useState("");
  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0);

  //some handle change functions for some more complicated fields
  const handleTagChange = (tags) => {
    setSelectedTags(tags);
  };
  const handleEventPhotoChange = (e) => {
    const file = e.target.files[0];
    setEventPhoto(file);
  };
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };
  const handleSelectReocurring = (event) => {
    setReoccuring(event.target.value);
  };

  //fetch host info for later put request
  const handlePictureSelect = (index) => {
    setSelectedPictureIndex(index);
  };


  //fetch host info for later put request

  useEffect(() => {
    fetch(`/api/hosts/${hostId}`)
      .then((res) => res.json())
      .then((data) => {
        setHostName(data.name);
        setEmail(data.email);
        setBio(data.bio);
        setOwner(data.owner);
        setEvents(data.events);
        setHostPic(data.profile_pic);
      });
  }, [hostId]);

  //submit create event
  const handleSubmit = (e) => {
    e.preventDefault();
    const dateCreated = currentDate.toISOString();
    const startTime = new Date(0, 0, 0, hour1, minute1);
    const endTime = new Date(0, 0, 0, hour2, minute2);
    //event times should make sense
    if (startTime > endTime) {
      setError("End time must be after start time");
    } else {
      //build the event payload
      const event = {
        name: name,
        description: description,
        location: location,
        coords: coords,
        date: date,
        start_time: convertTimetoString(hour1, minute1),
        end_time: convertTimetoString(hour2, minute2),
        capacity: capacity,
        reoccuring: reoccuring,
        date_created: dateCreated,
        attendees: [],
        owner: hostId,
        tags: tags,
        profile_pic: selectedPictureIndex,
      };
      console.log("Event Data:", event);

      //create new event through post request
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
          // update host info with the new event
          const new_events = {
            events: [...events, data.eid],
            name: hostname,
            email: email,
            bio: bio,
            owner: owner,
            profile_pic: host_pic,
          };
          console.log(new_events);
          if (data && data.eid) {
            // Update host data
            fetch(`/api/hosts/${hostId}`, {
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

  //cancel create event
  const handleCancel = () => {
    navigate(`/hosts/${hostId}`);
  };

  //MAPS API. Autofill for location and get longitude and latitude for the location
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "ca" },
    fields: ["address_components", "name", "geometry"],
  };

  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current.getPlace();
      setLocation(place.name);
      setCoords([place.geometry.location.lat(), place.geometry.location.lng()]);
    });
  }, []);

  const handleAttributions = () => {
    navigate(`/attributions`);
  };

  return (
    <>
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
              maxLength={150}
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
              ref={inputRef}
              onChange={(e) => {
                setLocation(e.target.value);
              }}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            <label>Choose Event Picture</label>
          <Choose_Picture onPictureSelect={handlePictureSelect}/>
          </div>
          {/* <div className="form-group">
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
          </div> */}
          <div className="button-group">
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="button_event">
              Create Event
            </button>
          </div>
        </form>
        <button onClick={handleAttributions}>ViewAttributions</button>
      </div>
    </>
  );
}
