import React, { useEffect, useState } from 'react';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from Flask API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');  // Flask server URL
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);  // Runs once on component mount

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <div className="row">
        <div className="col-md-6">

        <div >
          {events.map((event) => (
            <div className='row my-3 event-box' key={event.id}>
              <div className='col-md-5 d-flex justify-content-start'>
                <img src={'/images/'+event.image} alt={event.title} className='event-image' />
              </div>
              <div className='col-md-7 px-4 my-2'>
                <h2>{event.title}</h2>
                <div>{event.description}</div>
                <div><strong>Date:</strong> {event.startdate} to {event.enddate}</div>
                <div><strong>Venue:</strong> {event.venue}</div>
                <div><strong>Artist:</strong> {event.artist}</div>
                <div><strong>Price:</strong> ${event.price}</div>
                <div><strong>Number of Tickets:</strong> {event.nooftickets}</div>
              </div>
            </div>
          ))}
        </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
