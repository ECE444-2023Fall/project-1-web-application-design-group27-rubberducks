// CreateEvent.jsx
import React from 'react';
import "./Host_Profile.css";
import "./Create_Event.css";

export default function Create_Event() {
  return (
    <>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
    <div className="sidebar">
        <img src="../../../images/placeholder.png" alt="Profile Picture" />
        <div className="user--name">John Doe</div>
        <div className="user--email">john.doe@example.com</div>
    </div>
    <div className='form_block'>
        <h1>Create Event</h1>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" className="form-control" id="name" name="name" />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input type="date" className="form-control" id="date" name="date" />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input type="text" className="form-control" id="location" name="location" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea className="form-control" id="description" name="description"></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="capacity">Capacity:</label>
            <input type="number" className="form-control" id="capacity" name="capacity" />
          </div>
          <div className="d-flex justify-content-center">
          <button type="submit" className='form_button'>Create Event</button>
          </div>
        </form>
      </div>
    </>
  );
};

