import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import Profile from "../components/Profile"; // Import the Profile component

const localizer = momentLocalizer(moment);

const Agent = () => {
    const [activeTab, setActiveTab] = useState("calendar");
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null); // To track the selected event for editing
    const [editTitle, setEditTitle] = useState(""); // To store the new title for editing
    const [agent, setAgent] = useState({
        name: "John Doe",
        description: "A short description about John Doe.",
    }); // Example agent data

    // Handle adding a new event
    const addEvent = () => {
        if (newEventTitle && selectedDate) {
            const newEvent = {
                id: events.length, // Assign a unique ID
                title: newEventTitle,
                start: new Date(selectedDate),
                end: new Date(selectedDate),
                allDay: true,
            };
            setEvents([...events, newEvent]);
            setNewEventTitle(""); // Clear the input after adding
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
        return (
            <div className="container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    selectable
                    onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)} // Click on a date to add an event
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
                return <h1>My Events</h1>;
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
                <div className="col-md-3 col-lg-2 bg-dark text-white p-3">
                    <ul className="nav flex-column text-center">
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
