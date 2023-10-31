import React, { useState, useEffect } from "react";
import "../../../css/pages/user_profile/Profile_edit.css";
import Sidebar from "../../components/UserSidebar";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function Profile_edit() {
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [favouriteEvents, setFavouriteEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/accounts/2")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
        setOrgs(data.orgs);
        setFavouriteEvents(data.fav_events);
        setEvents(data.events);

        setPreviousEvents(
          data.events.filter((event) => {
            return new Date(event.date) < new Date();
          })
        );

        setUpcomingEvents(
          data.events.filter((event) => {
            return new Date(event.date) >= new Date();
          })
        );
      });
  }, []);

  const navigate = useNavigate();
  const {
    register,
    watch,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const submitForm = (data) => {
    if (data.password === data.confirmPassword) {
      const body = {
        name: data.username,
        password: data.password,
        email: "putTest@utoronto.ca",
        events: [],
        fav_events: [],
        orgs: [],
      };

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };

      fetch("/api/accounts/2", requestOptions)
        .then((res) => {
          if (!res.ok) {
            console.log("error:", err);
          }
        })
        .then((data) => {
          navigate("/profile");
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your put operation:",
            error
          );
        });
      reset();
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <>
      <Sidebar name={name} email={email} orgs={orgs} />
      <div className="form">
        <h1 className="edit_header">Edit Profile</h1>
        <br />
        <Form>
          <Form.Group>
            <Form.Label>New Name</Form.Label>
            <br />
            <Form.Control
              type="text"
              placeholder="New Name"
              {...register("username", { maxLength: 50 })}
            />
            {errors.username?.type === "maxLength" && (
              <p style={{ color: "red" }}>
                <small>Name cannot exceed 50 characters</small>
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
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="New Password"
              {...register("password", {
                minLength: 8,
              })}
            />
            {errors.password?.type === "minLength" && (
              <p style={{ color: "red" }}>
                <small>Password must be at least 8 characters</small>
              </p>
            )}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm New Password"
              {...register("confirmPassword", {
                minLength: 8,
              })}
            />
            {errors.confirmPassword?.type === "minLength" && (
              <p style={{ color: "red" }}>
                <small>Password must be at least 8 characters</small>
              </p>
            )}
          </Form.Group>
          <br />
          <Form.Group>
            <Button variant="primary" onClick={handleSubmit(submitForm)}>
              Submit
            </Button>
            {"  "}
            <Link to="/profile">
              <Button variant="primary">Cancel</Button>
            </Link>
          </Form.Group>
          <br />
          <Form.Group>
            <Button variant="danger" onClick={handleShowDelete}>
              Delete Account
            </Button>
          </Form.Group>
        </Form>

        {/* <Modal show={showDelete} onHide={handleCloseDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal> */}
      </div>
    </>
  );
}

export default Profile_edit;
