import React, { useState } from 'react';
import { FaSlidersH } from 'react-icons/fa';
import tagData from './tags.json';
import './TagDrawerButton.css';

function TagDrawerButton({ onTagSelection }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagClick = (tag) => {
    const newSelection = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];

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
                {tagData.tags.map(({ tag, description }) => (
                <div
                key={tag}
                className={`event-tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleTagClick(tag)}
                title={description}
                >
                    {tag}
                </div>
                ))}
            </div>
        )}
    </>
  );
}

export default TagDrawerButton;
