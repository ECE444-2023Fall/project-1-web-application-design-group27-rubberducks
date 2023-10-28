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
  const handleStarClick = (clickedEvent) => {
    /* Favorite logic */
    console.log('Favorited ${clickedEvent.id}');
    const updatedEvents = events.map(event =>
      event.id === clickedEvent.id
      ? {...event, favorite: !event.favorite}:event
    );
  }

  const eventsData = [
    { id: 1,
      name: 'TestEvent',
      img: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: 'NewHost',
      label: "New",
      path: '/event-detail/1',
      favorite: true,
    },
    { id: 1,
      name: 'TestEvent',
      img: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: 'NewHost',
      label: "New",
      path: '/event-detail/1',
      favorite: true,
    },
    { id: 1,
      name: 'TestEvent',
      img: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: 'NewHost',
      label: "",
      path: '/event-detail/1',
      favorite: true,
    },
    { id: 1,
      name: 'TestEvent',
      img: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: 'NewHost',
      label: "",
      path: '/event-detail/1',
      favorite: false,
    },
    { id: 1,
      name: 'TestEvent',
      img: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: 'NewHost',
      label: "",
      path: '/event-detail/1',
      favorite: false,
    },
    { id: 1,
      name: 'TestEvent',
      img: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: 'NewHost',
      label: "",
      path: '/event-detail/1',
      favorite: false,
    },
    { id: 1,
      name: 'TestEvent',
      img: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: 'NewHost',
      label: "",
      path: '/event-detail/1',
      favorite: false,
    },
    { id: 1,
      name: 'TestEvent',
      img: 'images/placeholder.png',
      date: 'Nov 1, 2023',
      location: 'SF Pit',
      time: '9:00PM',
      host: 'NewHost',
      label: "",
      path: '/event-detail/1',
      favorite: false,
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
