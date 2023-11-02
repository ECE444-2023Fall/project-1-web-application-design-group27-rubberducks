import React, { useEffect, useState } from "react";
import "../../../App.css";
import './Events.css';
import EventsGrid from './Eventsgrid';
import TagDrawerButton from './TagDrawerButton';

function Events() {

  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadEvents = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`api/events/?page=${page}&limit=20`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      console.log("Prev data", events);
      setEvents((prevEvents) => [...prevEvents, ...data]);
      setPage(page + 1);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents(1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
        return;
      }
      loadEvents(page);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page, loading]);

  /* Get all events */
  /*
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
  */

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  
  useEffect(() => {
    async function fetchTags() {
        try {
            const response = await fetch("api/events/tags");
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
  

  /*
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
*/

const handleTagsSelected = (selectedTags) => {
  // Here, you can use the selectedTags for filtering or other logic.
  // For instance, calling your handleFilter function.
  console.log(`Handle tags ${selectedTags}`);
  // handleFilter(selectedTags);
}

const handleStarClick = (clickedEvent) => {
  /* Favorite logic */
  console.log(`Favorite clicked ${clickedEvent.eid}`);
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
