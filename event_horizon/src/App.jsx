import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Events from "./components/pages/Events";
import Clubs from "./components/pages/Clubs";
import Login from "./components/pages/Login";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact Component={Home} />
          <Route path="/events" exact Component={Events} />
          <Route path="/clubs" exact Component={Clubs} />
          <Route path="/login" exact Component={Login} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
