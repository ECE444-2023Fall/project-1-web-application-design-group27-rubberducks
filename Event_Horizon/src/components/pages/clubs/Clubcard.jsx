import React from 'react';
import './Clubcard.css';

function ClubCard({ club }) {
    return (
        <a href={club.link} className="clubCardLink">
            <div className="clubCard">
                <div className="clubImageContainer">
                    <img src={club.image} alt={club.name} className="clubImage"/>
                </div>
                <div className="clubMembersCount">{club.membersCount}👤</div>
                <div className="clubInfo">
                    <span className="clubLocation">{club.location}</span>
                    <h3>{club.name}</h3>
                    <p className="clubDescription">{club.description}</p>
                </div>
                <div className="clubTags">
                    {club.tags && club.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            </div>
        </a>
    );
}

export default ClubCard;
