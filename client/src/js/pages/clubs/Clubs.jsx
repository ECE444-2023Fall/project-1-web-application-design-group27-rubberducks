import React, { useEffect, useState } from "react";
import "../../../css/components/App.css";
import "../../../css/pages/clubs/Clubs.css";
import ClubsGrid from "./Clubsgrid";
import Navbar from "../../components/Navbar";
import { bouncy } from "ldrs";
import { set } from "react-hook-form";
import {
  FaSearch
} from "react-icons/fa";

/* This is the club page itself */

function Clubs() {
  /* Configure Clubs Collection */
  const [clubs, setClubs] = useState([]);

  /* Configure Infinite Scroll */
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [fname, setfName] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);

  /* Configure Query */
  const [fOrd, setfOrd] = useState(0); // Sort order 0: Date asc 1: Date desc 2: Create asc 3: Create desc 4: Attend asc 5: Attend desc
  const [initialLoad, setInitialLoad] = useState(true); //initial load
  const isLogged = JSON.parse(localStorage.getItem("user")) ? true : false; //find if user logged in

  var spin_lock = false; // access control

  /* Fetch clubs from API */
  const loadClubs = async (page) => {
    if (!spin_lock && !loading) {
      spin_lock = true;
      //console.log('loadClubs called with page:', page);
      setLoading(true);
      try {
        // Configure the query attributes
        var fetchQuery = `api/hosts/?page=${page}&limit=${pageLimit}`;

        if (fname) {
          fetchQuery=fetchQuery.concat(`&name=${fname}`);
        }
        // Conduct the query
        const response = await fetch(fetchQuery);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.length) {
          setClubs((prevClubs) => [...prevClubs, ...data]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
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
    loadClubs(1);
  }, []);

  // Scroll listener (infinite scroll)
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop <
          document.documentElement.offsetHeight - 100 ||
        loading || !hasMore
      ) {
        return;
      } else {
        loadClubs(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  }
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    // Reset page count and clubs list
    setPage(1);
    setClubs([]);
    // Reload clubs with the new fname
    loadClubs(1);
  }, [fname]); // Run when fname changes

  const handleResetSearch = () => {
    setHasMore(true);
    setSearchTerm(null);
    setfName(null);
  }

  const handleApplySearch = (value) => {
    setHasMore(true);
    setfName(value);
  }

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
      <div className="clubsPage">
        <div className="club-search">
          <div className="input-icon-wrapper">
            <FaSearch className="input-icon" />
            <input type="text" value={fname?fname:""} placeholder={searchTerm?searchTerm:"Search by name"} onChange={(e) => handleSearch(e.target.value)} />
          </div>
          <div className="apply-buttons">
            <button class="btn--new btn--create" onClick={() => handleResetSearch()}>Reset</button>
            <button class="btn--new btn--create" onClick={() => handleApplySearch(searchTerm)}>Apply</button>
          </div>
        </div>
        <ClubsGrid
          clubs={clubs}
        />
      </div>
    </>
  );
}

export default Clubs;