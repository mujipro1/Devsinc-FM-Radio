import React from "react";
import './admin.css';
import EventList from "./EventList";
import { useState, useEffect } from 'react';

const Admin = () => {

    const [activeEvents, setEvents] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(''); // State to handle errors
  
    useEffect(() => {
      const fetchEvents = async () => {
        setLoading(true); // Set loading to true when fetch starts
        setError(''); // Clear any previous errors
  
        try {
          const response = await fetch(`http://localhost:5000/admin`);
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
    });


    return (
        <>
        <div className="row">
            <div className="col-md-10 offset-md-1 p-5">
                <div className="text-start">
                    <h2>Admin Dashboard</h2>
                </div>
                <div className="row">

                    <div className="col-md-4 p-3">
                        <div className="box-cont p-4">
                            <h5>Active Events</h5>
                            <p class='text-center big'>10</p>
                        </div>
                    </div>
                    <div className="col-md-4 p-3">
                        <div className="box-cont p-4">
                            <h5>Agents</h5>
                            <p class=' text-center big'>4</p>
                        </div>
                    </div>
                    <div className="col-md-4 p-3">
                        <div className="box-cont p-4">
                            <h5>Monthly Sales</h5>
                            <p class='text-center big'>10</p>
                        </div>
                    </div>
                </div>


                <div className="row px-3 my-4">
                    <div className="box-cont col-md-12 p-5">
                        <h4>Live Events</h4>
                            {/* <EventList {events}/> */}
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}

export default Admin;