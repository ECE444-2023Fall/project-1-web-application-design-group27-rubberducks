import React, { useEffect, useState } from 'react';
import { FaSlidersH } from 'react-icons/fa';
import './TagDrawerButton.css';

function TagDrawerButton({ onTagSelection }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function fetchTags() {
        try {
            const response = await fetch("api/events/tags");
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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagClick = (etid) => {
    const newSelection = selectedTags.includes(etid)
      ? selectedTags.filter(t => t !== etid)
      : [...selectedTags, etid];

    setSelectedTags(newSelection);
    onTagSelection(newSelection);
  };

  return (
    <>
        <span className={`event-filter ${drawerOpen ? 'drawer-open' : ''}`} onClick={() => setDrawerOpen(!drawerOpen)}>
            <FaSlidersH className="filter-icon"/>
        </span>

        {drawerOpen && (
            <div className="tag-drawer">
                {tags.map(({ etid, name, description }) => (
                <div
                key={etid}
                className={`event-tag ${selectedTags.includes(etid) ? 'selected' : ''}`}
                onClick={() => handleTagClick(etid)}
                title={description}
                >
                    {name}
                </div>
                ))}
            </div>
        )}
    </>
  );
}

export default TagDrawerButton;
