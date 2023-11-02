import React, { useEffect, useState } from "react";
import "../../../App.css";
import './Events.css';
import EventsGrid from './Eventsgrid';
import TagDrawerButton from './TagDrawerButton';

function Events() {

  /* Configure Tags */
  
  const [selectedTags, setSelectedTags] = useState([]);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  /* Configure Fetch */
  const [fName, setfName] = useState(null)
  const [fLoc, setfLoc] = useState(null)
  const [fTimeS, setfTimeS] = useState(null)
  const [fTimeE, setfTimeE] = useState(null)
  const [fDateS, setfDateS] = useState(null)
  const [fDateE, setfDateE] = useState(null)
  const [fCap, setfCap] = useState(null)
  const [fCapR, setfCapR] = useState(null) // set true to disable filled events
  const [fReo, setfReo] = useState(null)
  const [fUid, setfUid] = useState(null)

  var spin_lock = false; // access control

  const loadEvents = async (page) => {
    const tagQuery = selectedTags.join(',');
    if (!spin_lock && !loading) {
      spin_lock = true;
      //console.log('loadEvents called with page:', page);
      setLoading(true);
      try {
        const response = await fetch(`api/events/?page=${page}&limit=20&tags=${tagQuery}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        //console.log("Fetched data:", data);
        //console.log("Prev data", events);
        if (data.length) {
          setEvents((prevEvents) => [...prevEvents, ...data]);
          setPage(prevPage => prevPage + 1);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
        spin_lock = false;
      }
    }
  };

  useEffect(() => {
    loadEvents(1);
  }, []);

  
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
        return;
      } else {
        loadEvents(page);
      }
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

const handleTagsSelected = (selection) => {
  setSelectedTags(selection);
  setPage(1);
  setEvents([]);
  loadEvents(1);
}

const handleStarClick = (clickedEvent) => {
  /* Favorite logic */
  console.log(`Favorite clicked ${clickedEvent.eid}`);
  console.log(`SelectedTags Debug`, selectedTags)
}

  return (
    <div className="eventsPage">
      <span className="eventTagDrawer">
        <TagDrawerButton onTagSelection={handleTagsSelected} />
        <button onClick={() => loadEvents(page)}>Reload Current Offset (Inf Scroll Debug)</button>
        <button onClick={() => handleTagsSelected(selectedTags)}>Reload Tags Selection (Filter Debug)</button>
      </span>
      <EventsGrid events={events} onStarClick={handleStarClick}/>
    </div>
  )
}

export default Events;
