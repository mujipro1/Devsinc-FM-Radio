import React, { useState, useEffect } from 'react';
import EventList from './EventList';
import Navbar from '../components/Navbar';

const CategoricalEvents = ({ type }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(''); // State to handle errors

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); // Set loading to true when fetch starts
      setError(''); // Clear any previous errors

      try {
        const response = await fetch(`http://localhost:5000/customer?type=${type}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEvents(data); // Update events state with the fetched data
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('An error occurred while fetching events. Please try again.'); // Update error state
      } finally {
        setLoading(false); // Set loading to false once data is processed
      }
    };

    fetchEvents(); // Call the fetch function
  }, [type]); // Run the effect when the `type` prop changes

  return (

    <div className="categorical-events">
        <Navbar/>
      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      <EventList events={events} /> {/* Pass events to EventList */}
    </div>
  );
};

export default CategoricalEvents;
