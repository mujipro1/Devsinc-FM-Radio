import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import './Search.css';
import EventList from '../pages/EventList';

function SearchComponent() {
  const [searched, setSearched] = useState(false);
  const [searchType, setSearchType] = useState('Artist');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Select Location');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false); // State to handle loading
  const [error, setError] = useState(''); // State to handle errors
  const [events, setEvents] = useState([]);

  const handleUseBrowserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocation('Current Location');
        },
        (error) => {
          console.error("Error obtaining location: ", error);
          alert("Unable to retrieve your location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleUseGoogleMaps = () => {
    alert("Google Maps functionality to be implemented.");
    // Integrate with Google Maps API here
  };

  const handleSearch = () => {
    setSearched(true);
    setLoading(true); // Set loading to true when search starts
    setError(''); // Clear any previous errors

    let url = `http://localhost:5000/customer?type=${searchType.toLowerCase()}&query=${searchQuery}`;
    
    if (latitude && longitude) {
      url += `&lat=${latitude}&lon=${longitude}`;
    }

    if (startDate) {
      url += `&startDate=${startDate.toISOString()}`;
    }
    
    if (endDate) {
      url += `&endDate=${endDate.toISOString()}`;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON if response is ok
      })
      .then(data => {
        console.log(data)
        setEvents(data); // Update events state with the search results
        setLoading(false); // Set loading to false once data is processed
      })
      .catch(error => {
        console.error('Error during search:', error);
        setError('An error occurred during the search. Please try again.'); // Update error state
        setLoading(false); // Set loading to false if there's an error
      });
  };

  return (
    <div className="search-container mt-0">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          {/* Location Selector */}
          <div className="col-12 col-md-auto mb-2 ">
            <div className="btn-group">
              <button 
                className="btn btn-secondary  dropdown-toggle" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                {location}
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={handleUseGoogleMaps}>Use Google Maps</button></li>
                <li><button className="dropdown-item" onClick={handleUseBrowserLocation}>Use Browser Location</button></li>
              </ul>
            </div>
          </div>

          {/* Date Selector */}
          <div className="col-12 col-md-auto mb-2 mb-md-0">
            <div className="d-flex align-items-center">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="form-control "
              />
              <span className="mx-2">to</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="End Date"
                className="form-control "
              />
            </div>
          </div>

          {/* Search Bar and Type Selector */}
          <div className="col-12 col-md mb-2 mb-md-0">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control " 
                placeholder="Search events" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="btn btn-secondary  dropdown-toggle" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                {searchType}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={() => setSearchType('music')}>Music</button></li>
                <li><button className="dropdown-item" onClick={() => setSearchType('qawwali')}>Qawwali</button></li>
                <li><button className="dropdown-item" onClick={() => setSearchType('concert')}>Concert</button></li>
              </ul>
            </div>
          </div>

          {/* Search Button */}
          <div className="col-12 col-md-auto">
            <button className="btn btn-i  w-100" onClick={handleSearch}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
        
        {/* Display Errors */}
        {error && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="alert alert-danger">
                {error}
              </div>
            </div>
          </div>
        )}

        {searched && <div className="row mt-4">
          <div className="col-12">
            <h3>Search Results</h3>
            <EventList events={events} /> {/* Pass events to EventList */}
          </div>
        </div>}

      </div>
    </div>
  );
}

export default SearchComponent;
