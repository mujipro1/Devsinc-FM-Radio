import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const Profile = ({ agent, onUpdate }) => {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(agent.name);
    const [description, setDescription] = useState(agent.description);

    const handleSave = () => {
        onUpdate({ name, description });
        setEditMode(false);
    };

    return (
        <div>
            <h1>My Profile</h1>
            {editMode ? (
                <div>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            variant="secondary"
                            onClick={() => setEditMode(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            className="ml-2"
                        >
                            Save Changes
                        </Button>
                    </Form>
                </div>
            ) : (
                <div>
                    <p>
                        <strong>Name:</strong> {agent.name}
                    </p>
                    <p>
                        <strong>Description:</strong> {agent.description}
                    </p>
                    <Button onClick={() => setEditMode(true)}>
                        Edit Profile
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Profile;
