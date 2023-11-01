import React, { useEffect, useState } from "react";
import "../../../App.css";
import './Events.css';
import EventsGrid from './Eventsgrid';
import TagSelector from './tags'

function Events() {
  /* Get all events */
  const [events, setEvents] = useState([]);
  useEffect(() => {
    async function fetchEvents() {
        try {
            const response = await fetch("api/events/");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    }

    fetchEvents();
}, []);

const handleFilter = async (filterTags) => {
  async function fetchFilteredEvents() {
      try {
          const response = await fetch("api/events/filtered", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ tags: filterTags }),
          });

          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setEvents(data);
      } catch (error) {
          console.error("Failed to fetch filtered events:", error);
      }
  }

  fetchFilteredEvents();
};

const handleTagsSelected = (selectedTags) => {
  // Here, you can use the selectedTags for filtering or other logic.
  // For instance, calling your handleFilter function.
};

const handleStarClick = (clickedEvent) => {
  /* Favorite logic */
  console.log(`Favorited ${clickedEvent.id}`);
}

  return (
    <div className="eventsPage">
      <EventsGrid events={events} onStarClick={handleStarClick}/>
    </div>
  )
}

export default Events;
