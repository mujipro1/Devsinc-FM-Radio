import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import Profile from "../components/Profile";
import { useNavigate } from "react-router-dom";
import EventList from "./EventList";
import AddEventModal from "../components/AddEventModal";

const localizer = momentLocalizer(moment);

const Agent = ( { user }) => {
    const [activeTab, setActiveTab] = useState("events");
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [formattedDate, setFormattedDate] = useState(""); // New state for formatted date
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [agent, setAgent] = useState({
        name: "John Doe",
        description: "A short description about John Doe.",
    });

    const navigate = useNavigate();

    function formatDateForSQL(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    

    useEffect(() => {
        let url = `http://localhost:5000/agent?id=test`;

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Parse JSON if response is ok
            })
            .then((data) => {
                setEvents(data); // Update events state with the search results
            })
            .catch((error) => {
                console.error("Error during search:", error);
            });
    });

    const handleAddEvent = (newEvent) => {
        const today = new Date().setHours(0, 0, 0, 0);

        const newEventStartNormalized = new Date(newEvent.start).setHours(
            0,
            0,
            0,
            0
        );

        if (newEventStartNormalized < today) {
            alert("Cannot add events to past dates.");
            return;
        }

        const event = {
            title: newEvent.title,
            startdate: formatDateForSQL(new Date(newEvent.start)),
            enddate: formatDateForSQL(new Date(newEvent.end)),
            description: newEvent.description,
            venue: newEvent.venue,
            artist: newEvent.artist,
            host: newEvent.host,
            nooftickets: newEvent.numberOfTickets,
            price: newEvent.price,
            agentID: user,
            coords: "37, 73",
        };

        fetch('http://localhost:5000/addEvent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((data) => {
              // Handle success, e.g., redirect to another page or show a success message
              console.log('successful:', data);
              navigate('/agent')
            })
            .catch((error) => {
              console.error('Error during sign-in:', error);
            });
    };

    const updateEvent = () => {
        if (selectedEvent && editTitle) {
            const updatedEvents = events.map((event) =>
                event.id === selectedEvent.id
                    ? { ...event, title: editTitle }
                    : event
            );
            setEvents(updatedEvents);
            setSelectedEvent(null);
        }
    };

    const deleteEvent = () => {
        if (selectedEvent) {
            const filteredEvents = events.filter(
                (event) => event.id !== selectedEvent.id
            );
            setEvents(filteredEvents);
            setSelectedEvent(null);
        }
    };

    const handleProfileUpdate = (updatedProfile) => {
        setAgent(updatedProfile);
    };

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
                    min={today}
                    onSelectSlot={(slotInfo) => {
                        const selectedDateNormalized = new Date(
                            slotInfo.start
                        ).setHours(0, 0, 0, 0);
                        const todayNormalized = today.setHours(0, 0, 0, 0);

                        if (selectedDateNormalized >= todayNormalized) {
                            setSelectedDate(slotInfo.start);
                            setFormattedDate(
                                moment(slotInfo.start).format("MMMM Do YYYY")
                            ); // Format and set the date
                        } else {
                            alert("Cannot add events to past dates.");
                        }
                    }}
                    onSelectEvent={(event) => {
                        setSelectedEvent(event);
                        setEditTitle(event.title);
                    }}
                />
                {selectedDate && (
                    <div className="mt-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAddEventModal(true)}
                        >
                            Add Event On {formattedDate}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case "events":
                return (
                    <div>
                        <button
                            className="btn btn-primary mb-3"
                            onClick={() => setShowAddEventModal(true)}
                        >
                            Add Event
                        </button>
                        <EventList events={events} />
                    </div>
                );
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

            {/* Modal for adding a new event */}
            <AddEventModal
                show={showAddEventModal}
                handleClose={() => setShowAddEventModal(false)}
                handleAddEvent={handleAddEvent}
            />
        </div>
    );
};

export default Agent;
