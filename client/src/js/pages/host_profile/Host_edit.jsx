import React, { useState, useEffect } from "react";
import "../../../css/pages/user_profile/Profile_edit.css";
import HostSidebar from "../../components/HostSidebar";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function Host_edit() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [events, setEvents] = useState([]);
  const [owner, setOwner] = useState(-1);

  useEffect(() => {
    fetch("/api/hosts/6")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
        setBio(data.bio);
        setEvents(data.events);
        setOwner(data.owner);
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
      const body = {};

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
      <HostSidebar name={name} email={email} bio={bio} />
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
            <Link to="/host_profile">
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

export default Host_edit;
