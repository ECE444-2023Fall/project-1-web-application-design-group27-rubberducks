import React, { useState, useEffect } from "react";
import "../../css/pages/host_profile/Host_Profile.css";
import Cards from "../components/Cards";
import { MdEdit } from "react-icons/md";
import HostSidebar from "../components/HostSidebar";
import EventCategory from "../components/EventCategory";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
  Outlet,
  useParams,
  useOutletContext,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import { useGetHostInfo } from "../useGetHostInfo";

export default function Host_root() {
  const { hostId = "" } = useParams();
  const { hostInfo, loading } = useGetHostInfo(hostId);
  return (
    <>
      <Navbar />
      <HostSidebar
        hid={hostInfo.hid}
        name={hostInfo.name}
        email={hostInfo.email}
        bio={hostInfo.bio}
      />
      <Outlet context={[hostInfo]} />
    </>
  );
}

export function Host_profile() {
  const [hostInfo] = useOutletContext();
  return (
    <>
      <div>
        <div className="createEventBtnContainer">
          <Link to={`/hosts/${hostInfo.hid}/create_event`}>
            <Button variant="primary">Create Event</Button>
          </Link>
        </div>

        <div className="host--events">
          <EventCategory
            title="Upcoming Events"
            link={`/hosts/${hostInfo.hid}/upcoming`}
          />
          <hr />
          <div className="previous--events">
            <EventCategory
              title="Previous Events"
              link={`/hosts/${hostInfo.hid}/previous`}
            />
          </div>
        </div>
      </div>
      <Outlet context={[hostInfo]} />
    </>
  );
}

export function Host_upcoming() {
  const [hostInfo] = useOutletContext();
  return (
    <>
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Upcoming Events</h2>
            <span className="card--see-all small">
              <a href={`/hosts/${hostInfo.hid}`}>Return to Profile</a>
            </span>
          </div>
          <div>{hostInfo.bio}</div>
          <Cards />
          <Cards />
          <Cards />
        </div>
      </div>
    </>
  );
}

export function Host_previous() {
  const [hostInfo] = useOutletContext();
  return (
    <>
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">Previous Events</h2>
            <span className="card--see-all small">
              <a href={`/hosts/${hostInfo.hid}`}>Return to Profile</a>
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

export function Host_edit() {
  const [hostInfo] = useOutletContext();

  const navigate = useNavigate();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const submitForm = (data) => {
    if (data.password === data.confirmPassword) {
      const body = {};

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };

      // have to be logged into to get to this page
      const user = localStorage.getItem("user");
      const id = user.id;

      fetch(`/api/accounts/${id}`, requestOptions)
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
      <div className="form">
        <h1 className="edit_header">Edit Host Profile</h1>
        <br />
        <Form>
          <Form.Group>
            <Form.Label>New Email</Form.Label>
            <br />
            <Form.Control
              type="text"
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
            <Link to={`/hosts/${hid}`}>
              <Button variant="primary">Cancel</Button>
            </Link>
          </Form.Group>
          <br />
          <Form.Group>
            <Button variant="danger">Delete Profile</Button>
          </Form.Group>
        </Form>
      </div>
    </>
  );
}
