import React, { useState } from 'react';
import './Search.css';

function SearchComponent() {
  const [searchType, setSearchType] = useState('Artist');

  return (
    <div className="search-container">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          {/* Location Selector */}
          <div className="col-12 col-md-auto mb-2 mb-md-0">
            <div className="btn-group">
              <button 
                className="btn btn-secondary square-btn dropdown-toggle" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Select Location
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item">Use Google Maps</button></li>
                <li><button className="dropdown-item">Use Browser Location</button></li>
              </ul>
            </div>
          </div>

          {/* Date Selector */}
          <div className="col-12 col-md-auto mb-2 mb-md-0">
            <button className="btn btn-secondary square-btn">
              <i className="bi bi-calendar"></i> Select Date
            </button>
          </div>

          {/* Search Bar and Type Selector */}
          <div className="col-12 col-md mb-2 mb-md-0">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control square-btn" 
                placeholder="Search events" 
              />
              <button 
                className="btn btn-secondary square-btn dropdown-toggle" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                {searchType}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={() => setSearchType('Artist')}>Artist</button></li>
                <li><button className="dropdown-item" onClick={() => setSearchType('Venue')}>Venue</button></li>
                <li><button className="dropdown-item" onClick={() => setSearchType('Event')}>Event</button></li>
              </ul>
            </div>
          </div>

          {/* Search Button */}
          <div className="col-12 col-md-auto">
            <button className="btn btn-primary square-btn w-100">Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchComponent;
