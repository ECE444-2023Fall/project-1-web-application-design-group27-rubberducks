import React, { useState, useEffect } from "react";
import "../../css/pages/host_profile/Host_Profile.css";
import Cards from "../components/Cards";
import { MdEdit } from "react-icons/md";
import HostSidebar from "../components/HostSidebar";
import EventCategory from "../components/EventCategory";
import { Form, Button, Modal } from "react-bootstrap";
import { set, useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
  Outlet,
  useParams,
  useOutletContext,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import { useGetHostInfo } from "../useGetHostInfo";
import { confirmPassword, checkPassword } from "../confirmPassword";
import { bouncy } from "ldrs";
import Favorites from "../components/Favorite";
import ProfileCategory from "../components/Profile_Category";

export default function Host_root() {
  const { hostId = "" } = useParams();
  const { hostInfo, ownerLoggedIn, loading } = useGetHostInfo(hostId);
  bouncy.register();

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <l-bouncy size="45" speed="1.75" color="#002452"></l-bouncy>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <HostSidebar
        ownerLoggedIn={ownerLoggedIn}
        hid={hostInfo.hid}
        name={hostInfo.name}
        email={hostInfo.email}
        bio={hostInfo.bio}
      />
      <Outlet context={[hostInfo, ownerLoggedIn]} />
    </>
  );
}

export function Host_profile() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {hostId} = useParams();
  const [hostInfo, ownerLoggedIn] = useOutletContext();
  console.log("The host ID from the URL is:", hostId);


  // Function to fetch event details by ID
  const fetchEventDetails = async (eid) => {
    const response = await fetch(`/api/events/${eid}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };

  // Function to fetch the user's events
  const fetchUserEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/hosts/${hostId}`); //fetch the current user
      console.log("Host ID:", hostId); // Check if the host ID is retrieved correctly

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const eventsPromises = data.events.map(fetchEventDetails); //fetch the current user's events details
      const eventsDetails = await Promise.all(eventsPromises);
      // Filter for upcoming events
      const currentDateTime = new Date();
      const upcoming = eventsDetails.filter(event => {
        const eventStart = new Date(`${event.date}T${event.start_time}`); //compare the event time and the current time
        return eventStart > currentDateTime || event.reoccuring > 0;
      });

      const previous = eventsDetails.filter(event => {
        const eventStart = new Date(`${event.date}T${event.start_time}`); //compare the event time and the current time
        return eventStart < currentDateTime && event.reoccuring == 0;
      });

      setPreviousEvents(previous);
      setUpcomingEvents(upcoming);
      console.log(upcomingEvents)
      
    } catch (error) {
      console.error("Error fetching user events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        {ownerLoggedIn ? (
          <div className="createEventBtnContainer">
            <Link to={`/hosts/${hostInfo.hid}/create_event`}>
              <Button variant="primary">Create Event</Button>
            </Link>
          </div>
        ) : null}

        <div className="host--events">
          <ProfileCategory
            title="Upcoming Events"
            link={`/hosts/${hostInfo.hid}/upcoming`}
            events={upcomingEvents.slice(0, 4)}
          />
          <hr />
          <div className="previous--events">
            <ProfileCategory
              title="Previous Events"
              link={`/hosts/${hostInfo.hid}/previous`}
              events={previousEvents.slice(0, 4)}
              
            />
          </div>
        </div>
      </div>
      <Outlet context={[hostInfo]} />
    </>
  );
}


export function Host_upcoming() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { hostId } = useParams();

  // Function to fetch event details by ID
  const fetchEventDetails = async (eid) => {
    const response = await fetch(`/api/events/${eid}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };

  // Function to fetch the user's events
  const fetchUserEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/hosts/${hostId}`); //fetch the current user
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const eventsPromises = data.events.map(fetchEventDetails); //fetch the current user's events details
      const eventsDetails = await Promise.all(eventsPromises);
      // Filter for upcoming events
      const currentDateTime = new Date();
      const upcoming = eventsDetails.filter((event) => {
        const eventStart = new Date(`${event.date}T${event.start_time}`); //compare the event time and the current time
        return eventStart > currentDateTime || event.reoccuring > 0;
      });
    
      setUpcomingEvents(upcoming);

    } catch (error) {
      console.error("Error fetching user events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, []);

  if (isLoading) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <l-bouncy size="45" speed="1.75" color="#002452"></l-bouncy>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Upcoming Events</h2>
            <span className="card--see-all small">
              <Link to={`/hosts/${hostId}`}>Return to Profile</Link>
            </span>
          </div>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <Favorites key={event.eid} event={event} /> // Using Favorites component to render each event, favorites/upcoming/previous are all the same
            ))
          ) : (
            <p>You do not have any upcoming events yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

export function Host_previous() {
  const [previousEvents, setPreviousEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { hostId } = useParams();

  // Function to fetch event details by ID
  const fetchEventDetails = async (eid) => {
    const response = await fetch(`/api/events/${eid}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };

  // Function to fetch the user's events
  const fetchUserEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/hosts/${hostId}`); //fetch the current user
      console.log("Host ID:", hostId); // Check if the host ID is retrieved correctly

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const eventsPromises = data.events.map(fetchEventDetails); //fetch the current user's events details
      const eventsDetails = await Promise.all(eventsPromises);
      // Filter for upcoming events
      const currentDateTime = new Date();
      const previous = eventsDetails.filter((event) => {
        const eventStart = new Date(`${event.date}T${event.start_time}`); //compare the event time and the current time
        return eventStart < currentDateTime && event.reoccuring == 0;
      });

      setPreviousEvents(previous);
    } catch (error) {
      console.error("Error fetching user events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, []);

  if (isLoading) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <l-bouncy size="45" speed="1.75" color="#002452"></l-bouncy>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Previous Events</h2>
            <span className="card--see-all small">
              <Link to={`/hosts/${hostId}`}>Return to Profile</Link>
            </span>
          </div>
          {previousEvents.length > 0 ? (
            previousEvents.map((event) => (
              <Favorites key={event.eid} event={event} /> // Using Favorites component to render each event, favorites/previous/previous are all the same
            ))
          ) : (
            <p>You do not have any previous events yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

export function Host_edit() {
  const navigate = useNavigate();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [hostInfo, ownerLoggedIn] = useOutletContext();

  useEffect(() => {
    if (!ownerLoggedIn) {
      navigate("/login-error");
    }
  }, [ownerLoggedIn]);

  const [ownerInfo, setOwnerInfo] = useState(null);

  const getOwnerInfo = async () => {
    const res = await fetch(`/api/accounts/${hostInfo.owner}`);
    const data = await res.json();
    setOwnerInfo(data);
  };

  useEffect(() => {
    getOwnerInfo();
  }, []);

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const [loading, setLoading] = useState(false);
  bouncy.register();
  const handleProfileDelete = async () => {
    setLoading(true);
    for (let event of hostInfo.events) {
      //get all the events the org has
      const eventInfo = await fetch(`/api/events/${event}`).then((res) =>
        res.json()
      );

      for (let attendee of eventInfo.attendees) {
        //get all the attendees of the event
        const attendeeInfo = await fetch(`/api/accounts/${attendee}`).then(
          (res) => res.json()
        );
        //remove the event from the attendees' events and fav_events
        const attendeeRes = await fetch(`/api/accounts/${attendee}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            events: attendeeInfo.events.filter((e) => e !== event),
            fav_events: attendeeInfo.fav_events.filter((e) => e !== event),
          }),
        });
      }

      //delete the event
      const eventRes = await fetch(`/api/events/${event}`, {
        method: "DELETE",
      });

      if (!eventRes.ok) {
        throw new Error("Failed to delete event");
      }
    }

    //delete club from owner
    const ownerRes = await fetch(`/api/accounts/${ownerInfo.uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orgs: ownerInfo.orgs.filter((org) => org !== hostInfo.hid),
      }),
    });

    if (!ownerRes.ok) {
      throw new Error("Failed to delete org from owner orgs");
    }

    //delete the org
    const orgRes = await fetch(`/api/hosts/${hostInfo.hid}`, {
      method: "DELETE",
    });

    setLoading(false);
    if (!orgRes.ok) {
      throw new Error("Failed to delete org");
    } else {
      navigate("/");
    }
  };

  const submitForm = (data) => {
    setLoading(true);
    if (data.password === data.confirmPassword) {
      checkPassword(ownerInfo.email, data.oldPassword).then((isValid) => {
        if (isValid) {
          const body = {
            name: hostInfo.name,
            email: data.email,
            bio: data.bio,
            events: hostInfo.events,
            owner: hostInfo.owner,
          };
          const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          };

          fetch(`/api/hosts/${hostInfo.hid}`, requestOptions)
            .then((res) => {
              if (!res.ok) {
                console.log("error:", err);
              }
            })
            .then((data) => {
              setLoading(false);
              navigate(`/hosts/${hostInfo.hid}`);
            })
            .catch((error) => {
              console.error(
                "There has been a problem with your put operation:",
                error
              );
            });
          reset();
        } else {
          alert("Previous password incorrect");
        }
      });
    } else {
      alert("Passwords do not match");
    }
  };

  if (loading) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <l-bouncy size="45" speed="1.75" color="#002452"></l-bouncy>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="form">
        <h1 className="edit_header">Edit Host Profile</h1>
        <br />
        <Form>
          <Form.Group>
            <Form.Label>New Email</Form.Label>
            <br />
            <Form.Control
              type="email"
              placeholder="New Email"
              {...register("email", { maxLength: 50 })}
            />
            {errors.email?.type === "maxLength" && (
              <p style={{ color: "red" }}>
                <small>Email cannot exceed 50 characters</small>
              </p>
            )}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>New Bio</Form.Label>
            <br />
            <Form.Control
              type="text"
              placeholder="New Bio"
              {...register("bio", { maxLength: 120 })}
            />
            {errors.bio?.type === "maxLength" && (
              <p style={{ color: "red" }}>
                <small>Bio cannot exceed 120 characters</small>
              </p>
            )}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Previous Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Previous Password"
              {...register("oldPassword", { required: true })}
            />
            {errors.oldPassword?.type === "required" && (
              <p style={{ color: "red" }}>
                <small>Previous password is required</small>
              </p>
            )}
          </Form.Group>
          <br />
          <Form.Group>
            <Button variant="primary" onClick={handleSubmit(submitForm)}>
              Submit
            </Button>
            {"  "}
            <Link to={`/hosts/${hostInfo.hid}`}>
              <Button variant="primary">Cancel</Button>
            </Link>
          </Form.Group>
          <br />
          <Form.Group>
            <Button variant="danger" onClick={handleShowDelete}>
              Delete Profile
            </Button>
            <Modal show={showDelete} onHide={handleCloseDelete}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
              </Modal.Header>
              <br />
              <Modal.Body>
                Are you sure you want to delete your account? All of your data
                will be lost.
              </Modal.Body>
              <br />
              <Modal.Footer>
                <Button variant="danger" onClick={handleProfileDelete}>
                  Delete
                </Button>{" "}
                {"  "}
                <Button variant="secondary" onClick={handleCloseDelete}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Form.Group>
        </Form>
      </div>
    </>
  );
}
