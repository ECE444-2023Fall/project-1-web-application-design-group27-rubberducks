// AttendeeInfo.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/pages/host_profile/Attendee.css'; 
const AttendeeInfo = ({ attendees }) => {
  if (!attendees || attendees.length === 0) {
    return <div className="empty-message">No attendees found.</div>;
  }

  return (
    <ul className="attendee-list">
      {attendees.map((attendee) => (
        <li key={attendee.id} className="attendee-list-item">
          <div className="attendee-details">
            <div className="attendee-name">{attendee.name}</div>
            <div className="attendee-email">{attendee.email}</div>
            {/* Link to the attendee's detail page */}
            {/* <Link to={`/attendee/${attendee.id}`} className="attendee-link">
              View Profile */}
            {/* </Link> */}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AttendeeInfo;
