// CreateEvent.jsx
import React, {useState} from 'react';
import "./Create_Event.css";
import TagSelect from './Tag_Select';
import TimePicker from 'react-bootstrap-time-picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Create_Event() {
  const [name, setEventName] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(0);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [tags, setSelectedTags] = useState([]);
  const [reoccuring, setReoccuring] = useState(false);
  const [eventPhoto, setEventPhoto] = useState(null);
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
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
    <div className="sidebar">
        <img src="../../../images/placeholder.png" alt="Profile Picture" />
        <div className="host--name">host</div>
        <div className="host--email">host@example.com</div>
        <div className="host--bio">
          <h2 className="sidebar--heading">Bio</h2>
          <p className="sidebar--paragraph">
            This is my bio. I am a host and I love to organize events.
          </p>
        </div>
        <div className="host--tags">
          <h2 className="sidebar--heading">Tags</h2>
        </div>
      </div>
    <div className='form_block'>
        <h1>Create Event</h1>
        <form>
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
          <label htmlFor='date'>Date:</label>
          <br></br>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            className="form-control"
            required
          />
          </div>

          <div className='form-group'>
          <label htmlFor='time'>Time:</label>
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
          <TagSelect selectedTags={tags} onTagChange={handleTagChange} />
          </div>

          <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="recurring"
            name="recurring"
            checked={reoccuring}
            onChange={(e) => setReoccuring(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="recurring">
            Recurring Event
          </label>
        </div>
        <div className="form-group">
        <label htmlFor="eventPhoto" className="col-form-label">Event Photo</label>
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
          <button type="submit" className='form_button'>Create Event</button>
          </div>

        </form>
      </div>
    </>
  );
};
