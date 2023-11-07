import React, { useState, useEffect } from "react";
import "../../css/pages/user_profile/Profile.css";
import "../../css/pages/user_profile/Profile_edit.css";
import Cards from "../components/Cards";
import ReactDOM from "react-dom";
import Navbar from "../components/Navbar";
import UserSidebar from "../components/UserSidebar";
import EventCategory from "../components/EventCategory";
import { Outlet, useNavigate, Link, useOutletContext } from "react-router-dom";
import { useGetUserInfo } from "../useGetUserInfo";
import { useForm } from "react-hook-form";
import { Form, Button, Modal } from "react-bootstrap";
import { confirmPassword } from "../confirmPassword";

export default function Profile_root() {
  const { userInfo, loading } = useGetUserInfo();

  if (loading) {
    <div>Loading...</div>;
  }
  return (
    <>
      <Navbar />
      <UserSidebar name={userInfo.name} email={userInfo.email} />
      <Outlet context={[userInfo]} />
    </>
  );
}

export function Profile() {
  return (
    <>
      <div className="user--events">
        <EventCategory title="Favourite Events" link="/profile/favourite" />
        <hr />
        <EventCategory title="Upcoming Events" link="/profile/upcoming" />
        <hr />
        <div className="previous--events">
          <EventCategory title="Previous Events" link="/profile/previous" />
        </div>
      </div>
    </>
  );
}

export function Profile_upcoming() {
  return (
    <>
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Upcoming Events</h2>
            <span className="card--see-all small">
              <a href="/profile">Return to Profile</a>
            </span>
          </div>
          <Cards />
          <Cards />
          <Cards />
        </div>
      </div>
    </>
  );
}

export function Profile_previous() {
  const [userInfo] = useOutletContext();
  return (
    <>
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Previous Events</h2>
            <span className="card--see-all small">
              <a href="/profile">Return to Profile</a>
            </span>
          </div>
          <Cards />
          <Cards />
          <Cards />
        </div>
      </div>
    </>
  );
}

export function Profile_favourites() {
  return (
    <>
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Favourite Events</h2>
            <span className="card--see-all small">
              <a href="/profile">Return to Profile</a>
            </span>
          </div>
          <Cards />
          <Cards />
          <Cards />
        </div>
      </div>
    </>
  );
}

export function Profile_edit() {
  const [userInfo] = useOutletContext();

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleAccountDelete = async () => {
    for (let org of userInfo.orgs) {
      const orgInfo = await fetch(`/api/hosts/${org}`).then((res) =>
        res.json()
      );

      for (let event of orgInfo.events) {
        const eventRes = await fetch(`/api/events/${event}`, {
          method: "DELETE",
        });

        if (!eventRes.ok) {
          throw new Error("Failed to delete event");
        }
      }
      const orgRes = await fetch(`/api/hosts/${org}`, {
        method: "DELETE",
      });

      if (!orgRes.ok) {
        throw new Error("Failed to delete org");
      }
    }
    const accountRes = await fetch(`/api/accounts/${userInfo.uid}`, {
      method: "DELETE",
    });

    if (accountRes.ok) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      navigate("/login");
    } else {
      throw new Error("Failed to delete account");
    }
  };

  const navigate = useNavigate();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const submitForm = (data) => {
    if (
      data.password === data.confirmPassword &&
      confirmPassword(userInfo.email, data.oldPassword)
    ) {
      if (data.username === "") {
        data.username = userInfo.name;
      }
      if (data.password === "") {
        data.password = data.oldPassword;
      }
      const body = {
        name: data.username,
        password: data.password,
        email: userInfo.email,
        events: userInfo.events,
        fav_events: userInfo.fav_events,
        orgs: userInfo.orgs,
        msgids: userInfo.msgids,
      };

      const accessToken = localStorage.getItem("access_token");

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      };

      fetch("/api/accounts/" + userInfo.uid, requestOptions)
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
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
    } else if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
    } else {
      alert("Previous password incorrect");
    }
  };

  return (
    <>
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
                <Button variant="danger" onClick={handleAccountDelete}>
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
