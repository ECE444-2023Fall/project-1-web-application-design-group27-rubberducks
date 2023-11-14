import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import Profile_root, {
  Profile,
  Profile_edit,
  Club_Edit,
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
import Create_Event from "./js/pages/host_profile/Create_Event.jsx";
import InboxPage from "./js/pages/Inbox.jsx";
import Events from "./js/pages/events/Events.jsx";
import EventDetailsPage from "./js/pages/EventDetails.jsx";
import Home from "./js/pages/home/Home.jsx";
import Clubs from "./js/pages/clubs/Clubs.jsx";
import Login from "./js/pages/Login.jsx";
import SignUp from "./js/pages/SignUp.jsx";
import NotFound from "./js/pages/Not_Found.jsx";
import My_Clubs from "./js/pages/user_profile/User_Clubs.jsx";
import Host_transfer_send from "./js/pages/host_profile/Host_Transfer_Send.jsx";
import Host_transfer_Recieve from "./js/pages/host_profile/Host_Transfer_Recieve.jsx";
import ResourceError from "./js/pages/ResourceError.jsx";
import AttendeeList from "./js/pages/host_profile/Attendee.jsx";
import Edit_Event from "./js/pages/Edit_Event.jsx";
import ViewAttributions from "./js/pages/View_Attributions.jsx";
import EditProfilePic from "./js/pages/user_profile/Edit_Profile_Pic.jsx";
import EditClubProfilePic from "./js/pages/user_profile/Edit_Profile_Pic_in_Club.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ResourceError />}>
      <Route element={<Home />} index />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route
        path="profile"
        element={<Profile_root />}
        errorElement={<ResourceError />}
      >
        <Route element={<Profile />} index />
        <Route path="upcoming" element={<Profile_upcoming />} />
        <Route path="favourite" element={<Profile_favourites />} />
        <Route path="previous" element={<Profile_previous />} />
        <Route path="edit" element={<Profile_edit />} />
        <Route path="edit_club" element={<Club_Edit />} />
        <Route path="edit_pic" element={<EditProfilePic />} />
        <Route path="edit_pic_club" element={<EditClubProfilePic />} />
        <Route path="create_host" element={<Create_Host_Profile />} />
        <Route path="clubs" element={<My_Clubs />} />
      </Route>
      <Route
        path="hosts"
        element={<Host_root />}
        errorElement={<ResourceError />}
      >
        <Route path=":hostId" errorElement={<ResourceError />}>
          <Route index element={<Host_profile />} />
          <Route path="upcoming" element={<Host_upcoming />} />
          <Route path="previous" element={<Host_previous />} />
          <Route path="edit" element={<Host_edit />} />
          <Route path="create_event" element={<Create_Event />} />
          <Route path="transfer" element={<Host_transfer_send />} />
          <Route
            path="transfer_receive/:msgid"
            element={<Host_transfer_Recieve />}
          />
        </Route>
      </Route>
      <Route path="events" errorElement={<ResourceError />}>
        <Route element={<Events />} index />
        <Route path=":eventId" element={<EventDetailsPage />} />
        <Route path=":eventId/attendees" element={<AttendeeList />} />
        <Route path=":eventId/edit_event" element={<Edit_Event />} />
      </Route>
      <Route path="clubs" errorElement={<ResourceError />}>
        <Route element={<Clubs />} index />
      </Route>
      <Route path="inbox" element={<InboxPage />} />
      <Route path="404" element={<ResourceError />} />
      <Route path="login-error" element={<NotFound />} />
      <Route path="attributions" element={<ViewAttributions />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
