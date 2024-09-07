import React, { useEffect, useState } from 'react';
import './EventList.css';

const EventList = ( {events} ) => {

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
