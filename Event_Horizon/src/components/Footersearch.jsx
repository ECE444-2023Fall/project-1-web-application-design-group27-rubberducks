import React, { useState } from 'react';
import './Footersearch.css';

function FooterSearch({ placeholder = "Search", onSearch, searchTerm, setSearchTerm }) {
    const handleSearch = (event) => {
        event.preventDefault();
        if (onSearch) {
            onSearch(searchTerm);
        }
    }

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="footerSearch">
            <form onSubmit={handleSearch}>
                <input 
                    className="footerSearchInput"
                    type="text" 
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleChange} 
                />
                <button
                    className="footerSearchButton"
                    type="submit">
                </button>
            </form>
        </div>
    );
}

export default FooterSearch;
