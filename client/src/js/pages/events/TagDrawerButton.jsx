import React, { useEffect, useState } from 'react';
import { FaSlidersH, FaSearch, FaUser, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUsers, FaCheckSquare, FaRedo } from 'react-icons/fa';
import '../../../css/pages/events/TagDrawerButton.css';
import SortButton from './SortButton';
import "../../../css/components/App.css";

function TagDrawerButton({
  tags, selectedTags, onTagSelection,
  fName, onNameSearch,
  fHost, onHostSearch,
  fLoc, onLocationSearch,
  fTimeS, onStartTimeSelect,
  fTimeE, onEndTimeSelect,
  fDate, onDateSelect,
  fCap, onMaxAttendeesSelect,
  fCapR, onCapacityReachedToggle,
  fReo, onRecurringSelect,
  fOrd, onSort,
  onClear, onApply
  }) {

  // Goal is to initialize locals that will later update in events and call useeffect based on an update variable

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTagClick = (etid) => {
    const newSelection = selectedTags.includes(etid)
      ? selectedTags.filter(t => t !== etid)
      : [...selectedTags, etid];
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
                  <input type="text" value={fName?fName:""} placeholder={fName?fName:"Search by name"} onChange={(e) => onNameSearch(e.target.value)} />
                </div>
                <div className="input-icon-wrapper">
                  <FaUser className="input-icon" />
                  <input type="text" value={fHost?fHost:""} placeholder={fHost?fHost:"Search by host"} onChange={(e) => onHostSearch(e.target.value)} />
                </div>
                <div className="input-icon-wrapper">
                  <FaMapMarkerAlt className="input-icon" />
                  <input type="text" value={fLoc?fLoc:""} placeholder={fLoc?fLoc:"Search by location"} onChange={(e) => onLocationSearch(e.target.value)} />
                </div>
              </div>
              <div className="filter-row">
                <div className="input-icon-wrapper">
                  <FaClock className="input-icon" />
                  <input type="time" value={fTimeS} onChange={(e) => onStartTimeSelect(e.target.value)} />
                </div>
                <div className="input-icon-wrapper">
                  <FaClock className="input-icon" />
                  <input type="time" value={fTimeE} onChange={(e) => onEndTimeSelect(e.target.value)} />
                </div>
                <div className="input-icon-wrapper">
                  <FaCalendarAlt className="input-icon" />
                  <input type="date" value={fDate} onChange={(e) => onDateSelect(e.target.value)} />
                </div>
              </div>
              <div className="filter-row">
                <div className="input-icon-wrapper">
                  <FaUsers className="input-icon" />
                  <input type="number" value={fCap?fCap:""} placeholder={fCap?fCap:"Max attendees"} onChange={(e) => onMaxAttendeesSelect(e.target.value)} />
                </div>
                <div className="input-icon-wrapper">
                  <FaCheckSquare className="input-icon" />
                  <select value={fCapR} onChange={(e) => onCapacityReachedToggle(e.target.value)}>
                    <option value="0"> Show Filled Events</option>
                    <option value="1"> Hide Filled Events</option>
                  </select>
                </div>
                <div className="input-icon-wrapper">
                  <FaRedo className="input-icon" />
                  <select value={fReo} onChange={(e) => onRecurringSelect(e.target.value)}>
                    <option value="-1"> -- </option>
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
                  <SortButton setOrder={onSort} currentSortOrder={fOrd}></SortButton>
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
              <button className="btn--new btn--create" onClick={onClear}>Reset</button>
              <button className="btn--new btn--create" onClick={onApply}>Apply</button>
            </div>
          </div>
        )}
    </>
  );
}

export default TagDrawerButton;