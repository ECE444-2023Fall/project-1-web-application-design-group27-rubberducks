import React, { useEffect, useState } from 'react';
import { FaSlidersH, FaSearch, FaUser, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUsers, FaCheckSquare, FaRedo } from 'react-icons/fa';
import '../../../css/pages/events/TagDrawerButton.css';
import SortButton from './SortButton';
import "../../../css/components/App.css";

function TagDrawerButton({
  onTagSelection, onNameSearch, onHostSearch, onLocationSearch, onStartTimeSelect, 
  onEndTimeSelect, onDateSelect, onMaxAttendeesSelect, onCapacityReachedToggle, 
  onRecurringSelect, onReload, onSort, curSort, onClear
  }) {
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
          <div className="drawer-container">
            <div className="filter-drawer">
              <div className="filter-row">
                <div className="input-icon-wrapper">
                  <FaSearch className="input-icon" />
                  <input type="text" placeholder="Search by name" onChange={(e) => onNameSearch(e.target.value)} />
                </div>
                <div className="input-icon-wrapper">
                  <FaUser className="input-icon" />
                  <input type="text" placeholder="Search by host" onChange={(e) => onHostSearch(e.target.value)} />
                </div>
                <div className="input-icon-wrapper">
                  <FaMapMarkerAlt className="input-icon" />
                  <input type="text" placeholder="Search by location" onChange={(e) => onLocationSearch(e.target.value)} />
                </div>
              </div>
              <div className="filter-row">
                <div className="input-icon-wrapper">
                  <FaClock className="input-icon" />
                  <input type="time" onChange={(e) => onStartTimeSelect(e.target.value)} />
                </div>
                <div className="input-icon-wrapper">
                  <FaClock className="input-icon" />
                  <input type="time" onChange={(e) => onEndTimeSelect(e.target.value)} />
                </div>
                <div className="input-icon-wrapper">
                  <FaCalendarAlt className="input-icon" />
                  <input type="date" onChange={(e) => onDateSelect(e.target.value)} />
                </div>
              </div>
              <div className="filter-row">
                <div className="input-icon-wrapper">
                  <FaUsers className="input-icon" />
                  <input type="number" placeholder="Max attendees" onChange={(e) => onMaxAttendeesSelect(e.target.value)} />
                </div>
                <div className="input-icon-wrapper checkbox-wrapper">
                  <FaCheckSquare className="input-icon" />
                  <label>
                    Exclude Full
                    <input type="checkbox" onChange={(e) => onCapacityReachedToggle(e.target.checked)} />
                  </label>
                </div>
                <div className="input-icon-wrapper">
                  <FaRedo className="input-icon" />
                  <select onChange={(e) => onRecurringSelect(e.target.value)}>
                    <option value="0">Not Recurring</option>
                    <option value="1">Daily</option>
                    <option value="2">Weekly</option>
                    <option value="3">Bi-Weekly</option>
                    <option value="4">Monthly</option>
                  </select>
                </div>
              </div>
              <div className="filter-row">
                <div className="input-icon-wrapper">
                  <SortButton setOrder={onSort} currentSortOrder={curSort}></SortButton>
                </div>
              </div>
            </div>
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
            <div className="apply-buttons">
              <button className="btn--new btn--create" onClick={() => onClear()}>Reset</button>
              <button className="btn--new btn--create" onClick={() => onReload()}>Apply</button>
            </div>
          </div>
        )}
    </>
  );
}

export default TagDrawerButton;
