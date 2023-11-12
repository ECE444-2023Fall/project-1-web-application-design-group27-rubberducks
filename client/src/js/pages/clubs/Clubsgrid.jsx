import React, { useState, useEffect } from "react";
import "../../../css/pages/clubs/Clubsgrid.css";
import ClubCard from "./Clubcard";

/* This is the grid container which dynamically resizes event cards on screen res */

function ClubsGrid({clubs}) {
  const clubIds = clubs.map((e) => e.hid); // Populate map with club objects
  const hasDuplicates = clubIds.some(
    (id, index) => clubIds.indexOf(id) !== index
  );

  if (hasDuplicates) {
    console.warn("Duplicate keys detected:", clubs);
  }
  return (
    <div className="clubsGrid">
      {clubs.map((club) => (
        <ClubCard
          key={club.hid}
          club={club}
        />
      ))}
    </div>
  );
}

export default ClubsGrid;
