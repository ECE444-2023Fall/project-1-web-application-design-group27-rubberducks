import React, { useState, useEffect } from "react";
import "../../../css/pages/user_profile/Profile_edit.css";
import HostSidebar from "../../components/HostSidebar";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function Host_transfer_send({ hid }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [events, setEvents] = useState([]);
  const [owner, setOwner] = useState(-1);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch(`/api/hosts/${hid}`)
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
    fetch(`/api/accounts/${data.email}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((recieving_account) => {
        if (recieving_account.uid == user.id){
          throw new Error(`Cannot transfer account to yourself`);
        };
        const request_host_transfer = {
          account_id: recieving_account.uid,
          message: `[Club Transfer Request]: ${name} is requesting to transfer ownership to you. id: ${hid}`,
          msg_type: 3,
        };

        // send message
        fetch(`/api/messages/`, {
          method: "POST", // Use PUT to update the account
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request_host_transfer),
        })
          .then((res2) => {
            if (!res2.ok) {
              throw new Error(`HTTP error! Status: ${res2.status}`);
            }
            return res2.json();
          })
          .then((request_sent) => {
            console.log("successfully sent message ");
            console.log(request_sent);
            // Update the mesgids id of the recieving account
            const update_account = {
              name: recieving_account.name,
              email: recieving_account.email,
              events: recieving_account.events,
              fav_events: recieving_account.fav_events,
              orgs: recieving_account.orgs,
              msgids: recieving_account.msgids.concat(request_sent.msgid),
            };

            fetch(`/api/accounts/${recieving_account.uid}`, {
              method: "PUT", // Use PUT to update the account
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(update_account), // Update msgids field
            })
            .then((res3) => {
              if (!res3.ok) {
                throw new Error(`HTTP error! Status: ${res3.status}`);
              }
              return res3.json();
            })
            .then((data3) => {
              console.log("successfully updated account msgids");
              console.log(data3);
              // Redirect to the created page or handle as needed
              navigate(-1);
            })
            .catch((err) => {
              console.error("error:", err);
            });
          })
          .catch((error) => {
            console.error("There has been a problem with your put operation:", error);
          });
      });
    reset();
  };

  return (
    <>
      <HostSidebar name={name} email={email} bio={bio} />
      <div className="form">
        <h1 className="edit_header">Transfer Host Ownership</h1>
        <br />
        <Form>
          <Form.Group>
            <Form.Label>New Owner Email</Form.Label>
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
            <Button variant="primary" onClick={handleSubmit(submitForm)}>
              Send Transfer Request
            </Button>{" "}
            <Link to={`/host_profile/${hid}`}>
              <Button variant="primary">Cancel</Button>
            </Link>
          </Form.Group>
        </Form>
      </div>
    </>
  );
}

export default Host_transfer_send;
