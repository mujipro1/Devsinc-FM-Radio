import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EventList.css";

const EventList = ({ events }) => {
  const [detailPage, setDetailPage] = useState(false);
  const [detailedEvent, setDetailedEvent] = useState();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false); // State to handle loading
  const [error, setError] = useState(''); // State to handle errors
  const [successMessage, setSuccessMessage] = useState(''); // State to handle success message

  const showDetails = (event) => {
    setDetailPage(true);
    setDetailedEvent(event);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting

    fetch("http://localhost:5000/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        eventId: detailedEvent.id, // Send the event ID along with form data
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Parse JSON if response is ok
      })
      .then(data => {
        setSuccessMessage("Purchase successful!"); // Set success message
        setShowModal(false); // Close the modal after successful submission
      })
      .catch(error => {
        console.error('Error during purchase:', error);
        setError('An error occurred during the purchase. Please try again.'); // Update error state
      })
      .finally(() => {
        setLoading(false); // Set loading to false after processing
      });
  };

  return (
    <div>
      {!detailPage && events?.length === 0 ? (
        <p>No events available</p>
      ) : !detailPage && events?.length > 0 ? (
        <div className="row">
          <div className="col-md-6">
            <div>
              {events?.map((event) => (
                <div
                  className="row my-3 event-box"
                  key={event.id}
                >
                  <div className="col-md-5 d-flex justify-content-start">
                    <img
                      src={"/images/" + event.image}
                      alt={event.title}
                      className="event-image"
                    />
                  </div>
                  <div className="col-md-7 px-4 my-2">
                    <h2>{event.title}</h2>
                    <div>{event.description}</div>
                    <div>
                      <strong>Date:</strong>{" "}
                      {event.startdate} to {event.enddate}
                    </div>
                    <div>
                      <strong>Venue:</strong>{" "}
                      {event.venue}
                    </div>
                    <div>
                      <strong>Artist:</strong>{" "}
                      {event.artist}
                    </div>
                    <div>
                      <strong>Price:</strong> $
                      {event.price}
                    </div>
                    <div>
                      <strong>Number of Tickets:</strong>{" "}
                      {event.nooftickets}
                    </div>
                    <div>
                      <a onClick={() => showDetails(event)}>Details</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : detailPage && (
        <>
          <div
            className="row my-3 event-box"
            key={detailedEvent.id}
          >
            <div className="col-md-5 d-flex justify-content-start">
              <img
                src={"/images/" + detailedEvent.image}
                alt={detailedEvent.title}
                className="event-image"
              />
            </div>
            <div className="col-md-7 px-4 my-2">
              <h2>{detailedEvent.title}</h2>
              <div>{detailedEvent.description}</div>
              <div>
                <strong>Date:</strong>{" "}
                {detailedEvent.startdate} to {detailedEvent.enddate}
              </div>
              <div>
                <strong>Venue:</strong>{" "}
                {detailedEvent.venue}
              </div>
              <div>
                <strong>Artist:</strong>{" "}
                {detailedEvent.artist}
              </div>
              <div>
                <strong>Price:</strong> $
                {detailedEvent.price}
              </div>
              <div>
                <strong>Number of Tickets:</strong>{" "}
                {detailedEvent.nooftickets}
              </div>
            </div>
          </div>
          <div className="row my-3 event-box">
            <div className="col-md-6">
              <strong>Description: </strong>
              <div>{detailedEvent.description}</div>
            </div>
            <div className="col-md-6">
              <button className="btn btn-secondary square-btn" onClick={() => setShowModal(true)}>Purchase</button>
            </div>
          </div>
        </>
      )}

      {/* Modal for Purchase */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Complete Your Purchase</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {loading ? 'Submitting...' : 'Complete Purchase'}
                  </button>
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
