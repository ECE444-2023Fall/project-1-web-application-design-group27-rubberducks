import { useState, useEffect } from "react";
import "../../css/components/App.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Events from "../pages/Events";
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
          <Route path="/profile/" exact Component={Profile} />
          <Route path="/profile/edit" exact Component={Profile_edit} />
          <Route
            path="/profile/favourite"
            exact
            Component={Profile_favourites}
          />
          <Route path="/profile/previous" exact Component={Profile_previous} />
          <Route path="/profile/upcoming" exact Component={Profile_upcoming} />
          <Route path="/host_profile" exact Component={Host_profile} />
          <Route path="/host_profile/edit" exact Component={Host_edit} />
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
