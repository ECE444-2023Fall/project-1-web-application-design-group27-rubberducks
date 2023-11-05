import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import Page_root from "./js/pages/Page_root.jsx";
import Profile_root, {
  Profile,
  Profile_edit,
  Profile_favourites,
  Profile_previous,
  Profile_upcoming,
} from "./js/pages/Profile.jsx";
import Host_root, {
  Host_edit,
  Host_previous,
  Host_profile,
  Host_upcoming,
} from "./js/pages/Host_Profile.jsx";
import Create_Host_Profile from "./js/pages/Create_Host_Profile.jsx";
import Create_Event from "./js/pages/Create_Event.jsx";
import Clubs from "./js/pages/Clubs.jsx";
import Events from "./js/pages/Events.jsx";
import Home from "./js/pages/Home.jsx";
import Login from "./js/pages/Login.jsx";
import Signup from "./js/pages/Signup.jsx";
import NotFound from "./js/pages/Not_Found.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<NotFound />}>
      <Route element={<Home />} index />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route
        path="profile"
        element={<Profile_root />}
        errorElement={<NotFound />}
      >
        <Route element={<Profile />} index />
        <Route path="upcoming" element={<Profile_upcoming />} />
        <Route path="favourite" element={<Profile_favourites />} />
        <Route path="previous" element={<Profile_previous />} />
        <Route path="edit" element={<Profile_edit />} />
        <Route path="create_host" element={<Create_Host_Profile />} />
      </Route>
      <Route path="clubs" element={<Clubs />} />
      <Route path="hosts" element={<Host_root />} errorElement={<NotFound />}>
        <Route path=":hostId" errorElement={<NotFound />}>
          <Route index element={<Host_profile />} />
          <Route path="upcoming" element={<Host_upcoming />} />
          <Route path="previous" element={<Host_previous />} />
          <Route path="edit" element={<Host_edit />} />
          <Route path="create_event" element={<Create_Event />} />
        </Route>
      </Route>
      <Route path="events" errorElement={<NotFound />}>
        <Route element={<Events />} index />
        <Route path=":eventId" element={<Event />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
