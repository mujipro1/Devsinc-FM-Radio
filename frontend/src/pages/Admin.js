import React from "react";
import './admin.css';
import EventList from "./EventList";

const Admin = () => {
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
                            <EventList {events}/>
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}

export default Admin;