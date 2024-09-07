import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav
            className="navbar navbar-expand-lg"
            style={{ backgroundColor: "#343a40" }}
        >
            <div className="container-fluid">
                <a className="navbar-brand text-white" href="/">
                    Logo
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <div
                                className="nav-link text-white"
                                aria-current="page"
                                href="#"
                            >
                                <Link to="/concerts">Concerts</Link>
                            </div>
                        </li>
                        <li className="nav-item text-white">
                            <div className="nav-link text-white" href="#">
                                <Link to="/plays">Plays</Link>
                            </div>
                        </li>
                        <li className="nav-item text-white">
                            <div className="nav-link text-white" href="#">
                                <Link to="/sports">Sports</Link>
                            </div>
                        </li>
                        <li className="nav-item text-white">
                            <div className="nav-link text-white" href="#">
                                <Link to="/others">Other Events</Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                className="d-flex justify-content-end"
                style={{ marginRight: "20px" }}
            >
                <a className="btn btn-outline-light" href="agent">
                    Sell as Agent
                </a>
            </div>
        </nav>
    );
}

export default Navbar;
