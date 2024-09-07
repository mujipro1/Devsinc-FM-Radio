import React, { useEffect, useState } from 'react';
import './EventList.css';

const EventList = ( {events} ) => {

  return (
    <div>
      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <div className="row">
        <div className="col-md-6 ">

        <div >
          {events.map((event) => (
            <div className='row event-box' key={event.id}>
              <div className='col-md-4 d-flex justify-content-start'>
                <img src={event.image} alt={event.title} className='event-image' />
              </div>
              <div className='col-md-8 '>
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <p><strong>Date:</strong> {event.startdate} to {event.enddate}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Artist:</strong> {event.artist}</p>
                <p><strong>Price:</strong> ${event.price}</p>
                <p><strong>Number of Tickets:</strong> {event.nooftickets}</p>
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
