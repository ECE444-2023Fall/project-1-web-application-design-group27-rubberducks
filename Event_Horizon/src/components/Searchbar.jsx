// SearchBar.jsx
import React, { useState } from 'react';
import './Searchbar.css'

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Propagate the search value up to the parent if needed
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <input
      type="searchInput"
      placeholder="Search..."
      value={searchTerm}
      onChange={handleChange}
    />
  );
}

export default SearchBar;