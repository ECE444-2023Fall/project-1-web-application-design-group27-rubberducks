import React, { useState, useEffect } from 'react';

function TagSelector({ onTagSelect }) {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

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
