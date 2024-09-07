import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import Profile from "../components/Profile"; // Import the Profile component
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import EventList from "./EventList"; // Import the EventList component

const localizer = momentLocalizer(moment);

const Agent = () => {
    const [activeTab, setActiveTab] = useState("events");
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null); // To track the selected event for editing
    const [editTitle, setEditTitle] = useState(""); // To store the new title for editing
    const [agent, setAgent] = useState({
        name: "John Doe",
        description: "A short description about John Doe.",
    }); // Example agent data

    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        let url = `http://localhost:5000/agent?id=test`;
    

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON if response is ok
      })
      .then(data => {
        setEvents(data); // Update events state with the search results
      })
      .catch(error => {
        console.error('Error during search:', error);
      });
    });  
    // Handle adding a new event
    const addEvent = () => {
        if (newEventTitle && selectedDate) {
            const today = new Date().setHours(0, 0, 0, 0); // Normalize time to compare dates only
            const selectedDateNormalized = new Date(selectedDate).setHours(
                0,
                0,
                0,
                0
            );

            if (selectedDateNormalized < today) {
                alert("Cannot add events to past dates.");
                return;
            }

            const newEvent = {
                id: events.length, // Assign a unique ID
                title: newEventTitle,
                start: new Date(selectedDate),
                end: new Date(selectedDate),
                allDay: true,
            };
            setEvents([...events, newEvent]);
            setNewEventTitle(""); // Clear the input after adding
            setSelectedDate(null); // Clear the selected date after adding
        }
    };

    // Handle updating the event
    const updateEvent = () => {
        if (selectedEvent && editTitle) {
            const updatedEvents = events.map((event) =>
                event.id === selectedEvent.id
                    ? { ...event, title: editTitle }
                    : event
            );
            setEvents(updatedEvents);
            setSelectedEvent(null); // Close the modal after editing
        }
    };

    // Handle deleting the event
    const deleteEvent = () => {
        if (selectedEvent) {
            const filteredEvents = events.filter(
                (event) => event.id !== selectedEvent.id
            );
            setEvents(filteredEvents);
            setSelectedEvent(null); // Close the modal after deleting
        }
    };

    // Handle updating agent profile
    const handleProfileUpdate = (updatedProfile) => {
        setAgent(updatedProfile);
    };

    // Calendar Content
    const renderCalendar = () => {
        const today = new Date();

        return (
            <div className="container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    selectable
                    min={today} // Disable selecting past dates
                    onSelectSlot={(slotInfo) => {
                        const selectedDateNormalized = new Date(
                            slotInfo.start
                        ).setHours(0, 0, 0, 0);
                        const todayNormalized = today.setHours(0, 0, 0, 0);

                        if (selectedDateNormalized >= todayNormalized) {
                            setSelectedDate(slotInfo.start); // Click on a date to add an event
                        } else {
                            alert("Cannot add events to past dates.");
                        }
                    }}
                    onSelectEvent={(event) => {
                        setSelectedEvent(event); // Open modal for editing
                        setEditTitle(event.title); // Prefill the title for editing
                    }}
                />
                {selectedDate && (
                    <div className="mt-3">
                        <h5>
                            Add Event on{" "}
                            {moment(selectedDate).format("MMMM Do YYYY")}
                        </h5>
                        <input
                            type="text"
                            placeholder="Event Title"
                            className="form-control"
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                        />
                        <button
                            className="btn btn-primary mt-2"
                            onClick={addEvent}
                        >
                            Add Event
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case "events":
                return <EventList events={events} />;
            case "calendar":
                return renderCalendar();
            case "profile":
                return <Profile agent={agent} onUpdate={handleProfileUpdate} />;
            default:
                return <h1>Welcome Agent!</h1>;
        }
    };

    return (
        <div className="container-fluid">
            <div className="row vh-100">
                {/* Sidebar */}
                <div className="col-md-3 col-lg-2 bg-dark text-white p-3 d-flex flex-column">
                    <ul className="nav flex-column text-center mb-auto">
                        <li className="nav-item mb-3">
                            <button
                                className={`nav-link text-white ${
                                    activeTab === "events"
                                        ? "active bg-secondary"
                                        : ""
                                }`}
                                onClick={() => setActiveTab("events")}
                            >
                                My Events
                            </button>
                        </li>
                        <li className="nav-item mb-3">
                            <button
                                className={`nav-link text-white ${
                                    activeTab === "calendar"
                                        ? "active bg-secondary"
                                        : ""
                                }`}
                                onClick={() => setActiveTab("calendar")}
                            >
                                My Calendar
                            </button>
                        </li>
                        <li className="nav-item mb-3">
                            <button
                                className={`nav-link text-white ${
                                    activeTab === "profile"
                                        ? "active bg-secondary"
                                        : ""
                                }`}
                                onClick={() => setActiveTab("profile")}
                            >
                                My Profile
                            </button>
                        </li>
                    </ul>
                    {/* Go Back Button */}
                    <div className="mt-auto">
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/")}
                        >
                            Go Back
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="col-md-9 col-lg-10 bg-light p-4">
                    {renderContent()}
                </div>
            </div>

            {/* Modal for editing or deleting an event */}
            {selectedEvent && (
                <Modal show={true} onHide={() => setSelectedEvent(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit or Delete Event</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input
                            type="text"
                            className="form-control"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setSelectedEvent(null)}
                        >
                            Close
                        </Button>
                        <Button variant="danger" onClick={deleteEvent}>
                            Delete Event
                        </Button>
                        <Button variant="primary" onClick={updateEvent}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Agent;
