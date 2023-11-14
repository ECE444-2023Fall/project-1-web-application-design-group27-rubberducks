import React, { useEffect, useState } from "react";
import "../../../css/components/App.css";
import "../../../css/pages/events/Events.css";
import EventsGrid from "./Eventsgrid";
import TagDrawerButton from "./TagDrawerButton";
import SortButton from "./SortButton";
import Navbar from "../../components/Navbar";
import { bouncy } from "ldrs";
import { set } from "react-hook-form";

function Events() {
  /* Configure Events Collection */
  const [events, setEvents] = useState([]);

  /* Configure Infinite Scroll */
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* Configure Tags */
  const [selectedTags, setSelectedTags] = useState([]);

  /* Configure Query */
  const [fName, setfName] = useState(null); // Name <str>
  const [fLoc, setfLoc] = useState(null); // Location <str?
  const [fTimeS, setfTimeS] = useState(null); // Start Time <time>
  const [fTimeE, setfTimeE] = useState(null); // End Time <time>
  const [fDate, setfDate] = useState(null); // Date <date>
  const [fCap, setfCap] = useState(null); // Capacity <int>
  const [fCapR, setfCapR] = useState(null); // Capacity Reached, set true to disable filled events <1,0>
  const [fReo, setfReo] = useState(null); // Reoccuring <0,1,2,3,4>
  const [fHost, setfHost] = useState(null); // Host <str>
  const [fUid, setfUid] = useState(null); // UserID <int>
  const [fOrd, setfOrd] = useState(0); // Sort order 0: Date asc 1: Date desc 2: Create asc 3: Create desc 4: Attend asc 5: Attend desc

  /* Configure Favoriting System */
  const isLogged = JSON.parse(localStorage.getItem("user")) ? true : false; //find if user logged in
  const [favEvents, setFavEvents] = useState([]); //favourite events
  const [initialLoad, setInitialLoad] = useState(true); //initial load

  var spin_lock = false; // access control

  /* API Fetch */
  const loadEvents = async (page) => {
    if (!spin_lock && !loading) {
      spin_lock = true;
      //console.log('loadEvents called with page:', page);
      setLoading(true);
      try {
        // Configure the query attributes
        var fetchQuery = `api/events/?page=${page}&limit=${pageLimit}&ft=1`;
        const tagQuery = selectedTags.join(",");
        fetchQuery = fetchQuery.concat(`&ord=${fOrd}`);
        if (tagQuery.length > 0) {
          fetchQuery = fetchQuery.concat(`&tags=${tagQuery}`);
        } // Tags
        if (fName) {
          fetchQuery = fetchQuery.concat(`&name=${fName}`);
        } // Name
        if (fLoc) {
          fetchQuery = fetchQuery.concat(`&loc=${fLoc}`);
        } // Location
        if (fDate) {
          fetchQuery = fetchQuery.concat(`&date=${fDate}`);
        } // Date
        if (fTimeS) {
          fetchQuery = fetchQuery.concat(`&ts=${fTimeS}`);
        } // Time Start
        if (fTimeE) {
          fetchQuery = fetchQuery.concat(`&te=${fTimeE}`);
        } // Time End
        if (fCap) {
          fetchQuery = fetchQuery.concat(`&cap=${fCap}`);
        } // Capacity
        if (fCapR) {
          fetchQuery = fetchQuery.concat(`&capr=${fCapR}`);
        } // Capacity Reached
        if (fReo) {
          fetchQuery = fetchQuery.concat(`&re=${fReo}`);
        } // Reoccuring
        if (fHost) {
          fetchQuery = fetchQuery.concat(`&host=${fHost}`);
        } // Host
        if (fUid) {
          fetchQuery = fetchQuery.concat(`&uid=${fUid}`);
        }

        const response = await fetch(fetchQuery);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        //console.log("Fetched data:", data);
        //console.log("Prev data", events);
        if (data.length) {
          setEvents((prevEvents) => [...prevEvents, ...data]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
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
      } finally {
        setLoading(false);
        spin_lock = false;
      }
    }
  };

  // Initial events by getting first page
  useEffect(() => {
    loadEvents(1);
  }, []);

  // Initialize favourites by getting user info
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

  // Scroll listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop <
          document.documentElement.offsetHeight - 100 ||
        loading || !hasMore
      ) {
        return;
      } else {
        loadEvents(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading]);

  // Handlers for various query attributes
  const handleTagsSelected = (selection) => {
    setSelectedTags(selection);
    //handleReload();
  };
  const handleSortChange = (value) => {
    setfOrd(value);
    //handleReload();
  };
  const handleNameSearch = (name) => {
    setfName(name);
    //handleReload();
  };
  const handleHostSearch = (host) => {
    setfHost(host);
    //handleReload();
  };
  const handleLocationSearch = (location) => {
    setfLoc(location);
    //handleReload();
  };
  const handleTimeSelect = (time) => {
    setfTimeS(time);
    //handleReload();
  };
  const handleEndTimeSelect = (time) => {
    if (!fTimeS || time > fTimeS) {
      setfTimeE(time);
      //andleReload();
    } else {
      alert("End time must be later than start time.");
    }
  };
  const handleDateSelect = (date) => {
    setfDate(date);
    //handleReload();
  };

  const handleMaxAttendeesSelect = (number) => {
    setfCap(number);
    //handleReload();
  };
  const handleCapacityReachedToggle = (reached) => {
    setfCapR(reached ? 1 : 0);
    //handleReload();
  };
  const handleRecurringSelect = (recurring) => {
    setfReo(recurring);
    //handleReload();
  };
  const clearFilters = () => {
    setfName(null);
    setfLoc(null);
    setfTimeS(null);
    setfTimeE(null);
    setfDate(null);
    setfCap(null);
    setfCapR(null);
    setfReo(null);
    setfHost(null);
    setfUid(null)
    setfOrd(0);
  }
  const handleReload = () => {
    setPage(1);
    setEvents([]);
    loadEvents(1);
  };

  // Favouriting event handler
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
  bouncy.register();

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
      <div className="eventsPage">
        <div className="eventTagDrawer">
          <TagDrawerButton
            onTagSelection={handleTagsSelected}
            onNameSearch={handleNameSearch}
            onHostSearch={handleHostSearch}
            onLocationSearch={handleLocationSearch}
            onStartTimeSelect={handleTimeSelect}
            onEndTimeSelect={handleEndTimeSelect}
            onDateSelect={handleDateSelect}
            onMaxAttendeesSelect={handleMaxAttendeesSelect}
            onCapacityReachedToggle={handleCapacityReachedToggle}
            onRecurringSelect={handleRecurringSelect}
            onReload={handleReload}
            onSort={handleSortChange}
            curSort={fOrd}
            onClear={clearFilters}
          />
        </div>
        <EventsGrid
          events={events}
          onStarClick={handleStarClick}
          favEvents={favEvents}
        />
      </div>
    </>
  );
}

export default Events;
