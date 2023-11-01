import React, { useEffect, useState } from "react";
import "../../../App.css";
import './Events.css';
import EventsGrid from './Eventsgrid';
import TagDrawerButton from './TagDrawerButton';

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

/*
const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    async function fetchTags() {
        try {
            const response = await fetch("api/tags/");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error("Failed to fetch tags:", error);
        }
    }

    fetchTags();
  }, []);
*/

const handleFilter = async (filterTags) => {
  async function fetchFilteredEvents() {
      try {
          const response = await fetch("api/events/filtered", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ filters: filterTags }),
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
  console.log(`Handle tags ${selectedTags}`);
  handleFilter(selectedTags);
}

const handleStarClick = (clickedEvent) => {
  /* Favorite logic */
  console.log(`Favorited ${clickedEvent.eid}`);
}

  return (
    <div className="eventsPage">
      <span className="eventTagDrawer">
        <TagDrawerButton onTagSelection={handleTagsSelected} />
      </span>
      <EventsGrid events={events} onStarClick={handleStarClick}/>
    </div>
  )
}

export default Events;
