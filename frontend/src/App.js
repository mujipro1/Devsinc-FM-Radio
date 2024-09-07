import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Agent from "./pages/Agent";
import CategoricalEvents from "./pages/CategoricalEvents";
import Admin from "./pages/Admin";
import MapComponent from "./pages/Map";

import SignIn from "./pages/Signin";
import SignUp from "./pages/SignUp";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/map" element={<MapComponent />} />

                    <Route path="/" element={<Homepage />} />
                    <Route path="/agent" element={<Agent />} />
                    <Route path="/concerts" element={<CategoricalEvents type="music"/>}></Route>
                    <Route path="/plays" element={<CategoricalEvents type="qawwali"/>}></Route>
                    <Route path="/sports" element={<CategoricalEvents type="concert"/>}></Route>
                    <Route path="/others" element={<CategoricalEvents type="other"/>}></Route>
                    <Route path="/login" element={<SignIn/>}></Route>
                    <Route path="/SignUp" element={<SignUp/>}></Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
