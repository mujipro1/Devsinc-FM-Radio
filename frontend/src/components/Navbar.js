import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav
            className="navbar navbar-expand-lg d-flex justify-content-center "
            style={{ backgroundColor: "#343a40" }}
        >
            <div className="container-fluid d-flex justify-content-center ">
                <a className="mx-3 navbar-brand text-white" href="/">
                    <img src="images/download.jpeg" alt="logo" style={{ width: "50px" }} />
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
                <div className="collapse text-center d-flex justify-content-center navbar-collapse" id="navbarNav">
                    <ul className="navbar nav  mb-2 mb-lg-0">
                        <li className="nav-item">
                            <div
                                className="nav-link text-white"
                                aria-current="page"
                                href="#"
                            >
                                <Link className='link' to="/music">Music</Link>
                            </div>
                        </li>
                        <li className="nav-item text-white">
                            <div className="nav-link text-white" href="#">
                                <Link className='link' to="/qawwali">Qawwali</Link>
                            </div>
                        </li>
                        <li className="nav-item text-white">
                            <div className="nav-link text-white" href="#">
                                <Link className='link' to="/concert">Concert</Link>
                            </div>
                        </li>
                        <li className="nav-item text-white">
                            <div className="nav-link text-white" href="#">
                                <Link className='link' to="/others">Other Events</Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div
                className="d-flex justify-content-end"
                style={{ marginRight: "20px" }}
            >
                <a className="text-center btn-x" href="/login">
                    Sell as Agent
                </a>
            </div>
        </nav>
    );
}

export default Navbar;
