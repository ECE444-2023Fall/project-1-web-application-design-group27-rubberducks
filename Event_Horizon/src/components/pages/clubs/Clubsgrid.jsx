import React from 'react';
import './Clubsgrid.css';
import ClubCard from './Clubcard';

function ClubsGrid({ clubs }) {
    return (
        <div className="clubsGrid">
            {clubs.map(club => (
                <ClubCard key={club.id} club={club} />
            ))}
        </div>
    );
}

export default ClubsGrid;
