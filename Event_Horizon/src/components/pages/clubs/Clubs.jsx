import React, { useState } from "react";
import "../../../App.css";
import './Clubs.css';
import ClubsGrid from './Clubsgrid';
import FooterSearch from '../../Footersearch';



function Clubs() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchLogic = (term) => {
    console.log('Searching for: ${term}');
    /* Search logic: search by name, organizer, description keyword */
  }

  const clubsData = [
    { id: 1,
      name: "Elite Ten Counil",
      description: "Home of the Elite 10",
      location: "SF100",
      image: 'images/placeholder.png',
      link: '/club-detail/1',
      tags: ["food", "cooking", "research"],
      membersCount: 10
    },
    { id: 2,
      name: "Chinese Cuisine RS",
      description: "Research in Chinese Cuisine",
      location: "SF100",
      image: 'images/placeholder.png',
      link: '/club-detail/1',
      tags: ["food", "cooking", "research"],
      membersCount: 50
    },
    { id: 3,
      name: "Don RS",
      description: "Donburi Enthusiasts",
      location: "SF100",
      image: 'images/placeholder.png',
      link: '/club-detail/1',
      tags: ["food", "cooking", "research"],
      membersCount: 50
    },
    { id: 4,
      name: "Cutting-Edge Cooking RS",
      description: "Latest Cooking Techniques",
      location: "SF100",
      image: 'images/placeholder.png',
      link: '/club-detail/1',
      tags: ["food", "cooking", "research"],
      membersCount: 50
    },
    { id: 1,
      name: "Local Cuisine RS",
      description: "Don't even know why this is a club",
      location: "SF100",
      image: 'images/placeholder.png',
      link: '/club-detail/1',
      tags: ["food", "cooking", "research"],
      membersCount: 50
    },
  ]
  return (
    <div className="clubsPage">
      <ClubsGrid clubs={clubsData}/>
      <FooterSearch
        placeholder = "Search for clubs..."
        onSearch = {handleSearchLogic}
        searchTerm = {searchTerm}
        setSearchTerm = {setSearchTerm}
      />
    </div>
  )
}

export default Clubs;
