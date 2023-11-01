import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Events from "./components/pages/Events";
import Clubs from "./components/pages/Clubs";
import Login from "./components/pages/Login";
import Create_Host_Profile from "./components/pages/Create_Host_Profile";
import SignUp from "./components/pages/SignUp";
import Profile from "./components/pages/profile/Profile";
import Profile_favourites from "./components/pages/profile/Profile_favourites";
import Profile_previous from "./components/pages/profile/Profile_previous";
import Profile_upcoming from "./components/pages/profile/Profile_upcoming";
import Host_profile from "./components/pages/host_profile/Host_Profile";
import Host_previous from "./components/pages/host_profile/Host_previous";
import Host_upcoming from "./components/pages/host_profile/Host_upcoming";
import Create_Event from "./components/pages/host_profile/Create_Event";


function App() {
  const [loginEvent, setLoginEvent] = useState(false);

  useEffect(() => {
    const loginListener = () => {
      setLoginEvent(!loginEvent);  
    };
    window.addEventListener('login-success', loginListener);

    return () => {
      window.removeEventListener('login-success', loginListener);
    };
  }, [loginEvent]);

  return (
    <>
      <Router>
        <Navbar key={loginEvent} /> {/* Add key to force Navbar to re-render on loginEvent change */}
        <Routes>
          <Route path="/" exact Component={Home} />
          <Route path="/events" exact Component={Events} />
          <Route path="/clubs" exact Component={Clubs} />
          <Route path="/login" exact Component={Login} />
          <Route
            path="/create_host_profile"
            exact
            Component={Create_Host_Profile}
          />
          <Route path="/signup" exact Component={SignUp} />
          <Route path="/profile" exact Component={Profile} />
          <Route
            path="/profile/favourite"
            exact
            Component={Profile_favourites}
          />
          <Route path="/profile/previous" exact Component={Profile_previous} />
          <Route path="/profile/upcoming" exact Component={Profile_upcoming} />
          <Route path="/host_profile" exact Component={Host_profile} />
          <Route path="/host_profile/create_event" exact Component={Create_Event} />
          <Route
            path="/host_profile/create_event"
            exact
            Component={Create_Event}
          />
          <Route
            path="/host_profile/previous"
            exact
            Component={Host_previous}
          />
          <Route
            path="/host_profile/upcoming"
            exact
            Component={Host_upcoming}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
