import React, { useEffect, useState } from "react";
import "../../../css/components/App.css";
import "../../../css/pages/home/Home.css";
import EventsGrid from "../events/Eventsgrid";
import ClubsGrid from "../clubs/Clubsgrid";
import Navbar from "../../components/Navbar";
import { bouncy } from "ldrs";
import { set } from "react-hook-form";

function Home() {
  /* Configure Events Collection */
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);

  /* Image Billboard */
  const [currentBillboard, setCurrentBillboard] = useState(0);
  const billboardImages = ['images/banner1.png', 'images/banner2.png', 'images/banner3.png', 'images/banner4.png'];

  /* Configure Infinite Scroll */
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* Configure login state for favouriting system */
  const isLogged = JSON.parse(localStorage.getItem("user")) ? true : false; //find if user logged in
  const [favEvents, setFavEvents] = useState([]); //favourite events
  const [initialLoad, setInitialLoad] = useState(true); //initial load

  var spin_lock = false; // access control

  // Fetch events from API
  const loadEvents = async (page) => {
    if (!spin_lock && !loading) {
      spin_lock = true;
      //console.log('loadEvents called with page:', page);
      setLoading(true);
      try {
        // Configure the query attributes
        var fetchQuery = `api/events/?page=1&limit=12&ft=1`; // Only fetch 12 events with dates in the future
        fetchQuery = fetchQuery.concat(`&ord=4`); // Order by popularity

        // Send request
        const response = await fetch(fetchQuery);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Receive response
        const data = await response.json();
        //console.log("Fetched data:", data);
        //console.log("Prev data", events);
        
        // Populate events array
        if (data.length) {
          setEvents((prevEvents) => [...prevEvents, ...data]);
        }

        if (isLogged) {
          //if user logged in, load fav events
          const userRes = await fetch(
            "/api/accounts/" + JSON.parse(localStorage.getItem("user")).id
          )
            .then((res) => res.json())
            .then((data) => data);
          setFavEvents(userRes.fav_events);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } 
      try {
        var fetchQuery2 = `api/hosts/?page=1&limit=12&ord=1`;

        // Conduct the query
        const response = await fetch(fetchQuery2);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data2 = await response.json();

        if (data2.length) {
          setClubs((prevClubs) => [...prevClubs, ...data2]);
        }
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
      } finally {
        setLoading(false);
        spin_lock = false;
      }
    }
  };

  // Initial load
  useEffect(() => {
    loadEvents(1);
  }, []);

  // Favouriting system initialization
  useEffect(() => {
    if (!initialLoad && favEvents.length > 0) {
      const body = {
        fav_events: favEvents,
      };

      const requestOptions = {
        //update fav events for logged in user
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };

      fetch(
        `/api/accounts/${JSON.parse(localStorage.getItem("user")).id}`,
        requestOptions
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          data;
        })
        .catch((error) => {
          console.error("Error while updating account fav_events:", error);
        });
    } else if (initialLoad) {
      setInitialLoad(false);
    }
  }, [favEvents]);

  // Dynamic billboard
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBillboard((current) => (current + 1) % billboardImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Favouriting click handler
  const handleStarClick = (clickedEvent) => {
    /* Favorite logic */
    if (isLogged) {
      if (favEvents.includes(clickedEvent.eid)) {
        const index = favEvents.indexOf(clickedEvent.eid);
        if (index > -1) {
          //if event in favEvents
          setFavEvents(
            (prevFavEvents) => prevFavEvents.filter((_, i) => i !== index) //remove event from favEvents
          );
        }
      } else {
        setFavEvents((prevFavEvents) => [...prevFavEvents, clickedEvent.eid]); //add event to favEvents
      }
    } else {
      alert("You must be logged in to favourite events.");
    }
  };

  bouncy.register(); // Loading screen

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <l-bouncy size="45" speed="1.75" color="#002452"></l-bouncy>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="homePage">
        <div className="billboard">
            <img src={billboardImages[currentBillboard]} alt="Event Billboard" />
        </div>
        <div className="banner">
            <div className="eventsBanner">Hottest Events</div>
        </div>
        <EventsGrid
          events={events}
          onStarClick={handleStarClick}
          favEvents={favEvents}
        />
        <div className="banner">
            <div className="eventsBanner">Most Active Clubs</div>
        </div>
        <ClubsGrid
          clubs={clubs}
        />
      </div>
    </>
  );
}

export default Home;
