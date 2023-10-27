import React, { useState } from "react";
import "../../../App.css";
import './Events.css';
import EventsGrid from './Eventsgrid';
import FooterSearch from '../../Footersearch';



function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchLogic = (term) => {
    console.log('Searching for: ${term}');
    /* Search logic: search by name, organizer, description keyword */
  }

  const eventsData = [
    { id: 1,
      name: 'Shokugeki!',
      image: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: "Elite Ten Council",
      link: '/event-detail/1',
      favorited: true
    },
    { id: 2,
      name: 'Mapo Tofu Research Event',
      image: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: "Chinese Cuisine RS",
      link: '/event-detail/1',
      favorited: true
    },
    { id: 3,
      name: 'Katsu Don Taste Testing',
      image: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: "Don RS",
      link: '/event-detail/1',
      favorited: false
    },
    { id: 4,
      name: 'Peanut Butter Squid Experiment',
      image: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: "Cutting-Edge Cooking RS",
      link: '/event-detail/1',
      favorited: false
    },
    { id: 5,
      name: 'Cultural Festival Preparation',
      image: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: "Local Cuisine RS",
      link: '/event-detail/1',
      favorited: false
    },
  ]
  return (
    <div className="eventsPage">
      <EventsGrid events={eventsData}/>
      <FooterSearch
        placeholder = "Search for events..."
        onSearch = {handleSearchLogic}
        searchTerm = {searchTerm}
        setSearchTerm = {setSearchTerm}
      />
    </div>
  )
}

export default Events;
