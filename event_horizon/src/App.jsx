import { useState } from "react";
import "./App.css";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Events from "./components/pages/Events";
import Clubs from "./components/pages/Clubs";
import Login from "./components/pages/Login";
import Create_Host_Profile from "./components/pages/Create_Host_Profile";


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
          <Route path="/create_host_profile" exact Component={Create_Host_Profile} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
