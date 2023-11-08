import React, { useState, useEffect } from "react";
import "../../../css/pages/host_profile/Host_upcoming.css";
import AttendeeInfo from "../../components/Attendee_info"
import { useParams,useNavigate } from 'react-router-dom'; 
import { Button} from '../../components/Button'

const AttendeeList = ({}) => {
  const [attendees, setAttendees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendees = async () => {
      setIsLoading(true);
      try {
        // Fetch the event to get the list of attendee IDs
        const eventResponse = await fetch(`/api/events/${eventId}`);
        // const eventResponse = await fetch("/api/events/9");
        if (!eventResponse.ok) {
          throw new Error('Network response was not ok for fetching event');
        }
        const eventData = await eventResponse.json();
        const attendeeIds = eventData.attendees;

        // Now, fetch details for each attendee0
        const attendeeDetailsPromises = attendeeIds.map((uid) =>
          fetch(`/api/accounts/${uid}`).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok for fetching attendee');
            }
            return response.json();
          })
        );

        const attendeeDetails = await Promise.all(attendeeDetailsPromises);
        setAttendees(attendeeDetails);
      } catch (error) {
        console.error("Failed to fetch attendees", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);

  if (isLoading) {
    return <div>Loading attendees...</div>;
  }

  if (attendees.length === 0) {
    return <div>No attendees found.</div>;
  }
  
  return (
    <>
      <Button onClick={() => navigate(-1)} buttonStyle="btn--register"  buttonSize="btn--large" className="return-button">Return</Button>
      <AttendeeInfo attendees={attendees} />
    </>
  );
};

export default AttendeeList;
