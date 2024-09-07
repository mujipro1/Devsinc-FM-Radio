// AddEventModal.js
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import moment from "moment";

const AddEventModal = ({ show, handleClose, handleAddEvent }) => {
    const [newEvent, setNewEvent] = useState({
        title: "",
        description: "",
        start: new Date(),
        end: new Date(),
        venue: "",
        artist: "",
        host: "",
        capacity: "",
        numberOfTickets: "",
        price: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        handleAddEvent(newEvent);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={newEvent.title}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={newEvent.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Start</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="start"
                            value={moment(newEvent.start).format(
                                "YYYY-MM-DDTHH:mm"
                            )}
                            onChange={(e) =>
                                setNewEvent((prev) => ({
                                    ...prev,
                                    start: new Date(e.target.value),
                                }))
                            }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>End</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="end"
                            value={moment(newEvent.end).format(
                                "YYYY-MM-DDTHH:mm"
                            )}
                            onChange={(e) =>
                                setNewEvent((prev) => ({
                                    ...prev,
                                    end: new Date(e.target.value),
                                }))
                            }
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Venue</Form.Label>
                        <Form.Control
                            type="text"
                            name="venue"
                            value={newEvent.venue}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Artist</Form.Label>
                        <Form.Control
                            type="text"
                            name="artist"
                            value={newEvent.artist}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Host</Form.Label>
                        <Form.Control
                            type="text"
                            name="host"
                            value={newEvent.host}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Capacity</Form.Label>
                        <Form.Control
                            type="number"
                            name="capacity"
                            value={newEvent.capacity}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Number of Tickets</Form.Label>
                        <Form.Control
                            type="number"
                            name="numberOfTickets"
                            value={newEvent.numberOfTickets}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="price"
                            value={newEvent.price}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Add Event
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddEventModal;
