import React from 'react';
import '../../../css/pages/events/SortButton.css';
import { FaSort } from 'react-icons/fa';

function SortButton({ setOrder, currentSortOrder }) {
  return (
    <div className="sort-button">
      <FaSort className="sort-icon" />
      <select onChange={(e) => setOrder(e.target.value)} value={currentSortOrder}>
        <option value="0">Date Ascending</option>
        <option value="1">Date Descending</option>
        <option value="2">Newest</option>
        <option value="3">Oldest</option>
        <option value="4">Most Popular</option>
        <option value="5">Least Popular</option>
      </select>
    </div>
  );
}

export default SortButton;