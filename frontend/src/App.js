import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Agent from "./pages/Agent";
import CategoricalEvents from "./pages/CategoricalEvents";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/agent" element={<Agent />} />
                    <Route path="/concerts" element={<CategoricalEvents type="concerts"/>}></Route>
                    <Route path="/plays" element={<CategoricalEvents type="plays"/>}></Route>
                    <Route path="/sports" element={<CategoricalEvents type="sports"/>}></Route>
                    <Route path="/others" element={<CategoricalEvents type="other"/>}></Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
