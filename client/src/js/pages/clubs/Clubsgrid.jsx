import React, { useState, useEffect } from "react";
import "../../../css/pages/clubs/Clubsgrid.css";
import ClubCard from "./Clubcard";

function ClubsGrid({clubs}) {
  const clubIds = clubs.map((e) => e.hid);
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
