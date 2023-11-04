import React, { useState, useEffect } from "react";
import "../../css/components/App.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BrowserRouter as Router, Routes, Route, Outlet, useParams } from "react-router-dom";
import Home from "../pages/Home";
import Events from "../pages/Events";
import EventDetailsPage from "../pages/EventDetails";
import Clubs from "../pages/Clubs";
import Login from "../pages/Login";
import Create_Host_Profile from "../pages/Create_Host_Profile";
import SignUp from "../pages/SignUp";
import Profile from "../pages/user_profile/Profile";
import Profile_edit from "../pages/user_profile/Profile_edit";
import Profile_favourites from "../pages/user_profile/Profile_favourites";
import Profile_previous from "../pages/user_profile/Profile_previous";
import Profile_upcoming from "../pages/user_profile/Profile_upcoming";
import Host_profile from "../pages/host_profile/Host_Profile";
import Host_edit from "../pages/host_profile/Host_edit";
import Host_previous from "../pages/host_profile/Host_previous";
import Host_upcoming from "../pages/host_profile/Host_upcoming";
import Create_Event from "../pages/host_profile/Create_Event";

function App() {
  const [loginEvent, setLoginEvent] = useState(false);

  useEffect(() => {
    const loginListener = () => {
      setLoginEvent(!loginEvent);
    };
    window.addEventListener("login-success", loginListener);

    return () => {
      window.removeEventListener("login-success", loginListener);
    };
  }, [loginEvent]);

  return (
    <>
      <Router>
        <Navbar key={loginEvent} />{" "}
        {/* Add key to force Navbar to re-render on loginEvent change */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create_host_profile" element={<Create_Host_Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<Profile_edit />} />
          <Route path="/profile/favourite" element={<Profile_favourites />} />
          <Route path="/profile/previous" element={<Profile_previous />} />
          <Route path="/profile/upcoming" element={<Profile_upcoming />} />
          <Route path="/host_profile/:hid/*" element={<HostProfileRoutes />} />
        </Routes>
      </Router>
    </>
  );
}

function HostProfileRoutes() {
  const { hid } = useParams();
  return (
    <Routes>
      <Route path="/" element={<Host_profile hid={hid} />} />
      <Route path="/edit" element={<Host_edit hid={hid} />} />
      <Route path="/create_event" element={<Create_Event hid={hid} />} />
      <Route path="/previous" element={<Host_previous hid={hid} />} />
      <Route path="/upcoming" element={<Host_upcoming hid={hid} />} />
    </Routes>
  );
}

export default App;
