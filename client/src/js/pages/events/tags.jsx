import React, { useState, useEffect } from 'react';

/* This is a deprecated tags utility, at exists solely as a reference */

function TagSelector({ onTagSelect }) {

  // Define state variables
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Logic for fetching tags and backend access
  useEffect(() => {
    async function fetchTags() {
        try {
            const response = await fetch("api/tags/");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error("Failed to fetch tags:", error);
        }
    }

    fetchTags();
  }, []);

  // Logic for handling changing tags
  const handleTagChange = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prevTags => prevTags.filter(t => t !== tag));
    } else {
      setSelectedTags(prevTags => [...prevTags, tag]);
    }
  };

  useEffect(() => {
    onTagSelect(selectedTags);
  }, [selectedTags, onTagSelect]);

  return (
    <div className="tag-selector">
      {tags.map(tag => (
        <div key={tag.tag}>
          <input 
            type="checkbox" 
            value={tag.tag} 
            onChange={() => handleTagChange(tag.tag)} 
          />
          <label>{tag.tag}</label>
        </div>
      ))}
    </div>
  );
}

export default TagSelector;
