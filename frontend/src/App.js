import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Agent from "./pages/Agent";
import EventList from "./pages/EventList";

function App() {
    return (
        <EventList/>
    );
}

export default App;
