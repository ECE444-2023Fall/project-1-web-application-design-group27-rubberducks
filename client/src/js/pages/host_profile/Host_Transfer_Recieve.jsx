import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";

function HostTransferRecieve() {

  const {hostId, msgid} = useParams();
  
  const navigate = useNavigate();
  const [hostInfo, ownerLoggedIn] = useOutletContext();

  const changeMsgType = (id, new_type) => {
    const updateTypeUrl = `/api/messages/${id}`;

    // Send a PUT request to mark the message as read
    fetch(updateTypeUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ msg_type: new_type }), // Assuming you want to mark it as read
    })
      .then((response) => {
        if (response.ok) {
          console.log('Message type changed successfully.');
          // Continue with displaying the message or any other logic.
        } else {
          console.error('Failed to change message type.');
        }
      })
      .catch((error) => {
        console.error('Error while changing message type:', error);
      });
  };

  // useEffect(() => {
  //   if (!ownerLoggedIn) {
  //     navigate("/login-error");
  //   }
  // }, [ownerLoggedIn]);
  // const { hostId } = useParams();
  const [content, setContent] = useState("");
  const [sending_uid, setSendingAccount] = useState(-1);
  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [hostBio, setHostBio] = useState("");
  const [hostEvent, setHostEvent] = useState([]);

  useEffect(() => {
    fetch(`/api/hosts/${hostId}`)
      .then((res) => res.json())
      .then((data) => {
        setContent(
          `Club Transfer Request: ${data.name} is requesting to transfer ownership to you. id: ${hostId}`
        );
        setSendingAccount(data.owner);
        setHostName(data.name);
        setHostEmail(data.email);
        setHostBio(data.bio);
        setHostEvent(data.events);
      });
  }, []);

  const curr_account = JSON.parse(localStorage.getItem("user"));

  const handleApprove = () => {
    // Handle message approval logic
    // make it so you cant open the message again
    changeMsgType(msgid, -1);
    
    fetch(`/api/accounts/${curr_account.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((curr_account_data) => {
        console.log("successfully fetched account of the logged-in user");

        const update_account = {
          name: curr_account_data.name,
          email: curr_account_data.email,
          events: curr_account_data.events,
          fav_events: curr_account_data.fav_events,
          orgs: curr_account_data.orgs.concat(hostId),
          msgids: curr_account_data.msgids,
        };

        fetch(`/api/accounts/${curr_account.id}`, {
          method: "PUT", // Use PUT to update the account
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(update_account), // Update orgs field
        })
          .then((res2) => {
            if (!res2.ok) {
              throw new Error(`HTTP error! Status: ${res2.status}`);
            }
            return res2.json();
          })
          .then((data3) => {
            console.log("successfully updated account orgs");
            console.log(data3);

            // Update orgs field of sending account
            fetch(`/api/accounts/${sending_uid}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
              })
              .then((sending_account_data) => {
                console.log(
                  "successfully fetched account of the logged-in user"
                );

                const updatedOrgs = sending_account_data.orgs.filter(
                  (orgId) => orgId !== parseInt(hostId, 10)
                );

                const update_account = {
                  name: sending_account_data.name,
                  email: sending_account_data.email,
                  events: sending_account_data.events,
                  fav_events: sending_account_data.fav_events,
                  orgs: updatedOrgs,
                  msgids: sending_account_data.msgids,
                };

                fetch(`/api/accounts/${sending_uid}`, {
                  method: "PUT", // Use PUT to update the account
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(update_account), // Update orgs field
                })
                  .then((res2) => {
                    if (!res2.ok) {
                      throw Error(`HTTP error! Status: ${res2.status}`);
                    }
                    return res2.json();
                  })
                  .then((data3) => {
                    console.log("successfully updated account orgs");
                    console.log(data3);
                    fetch(`/api/hosts/${hostId}`, {
                      method: "PUT", // Use PUT to update the account
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: hostName,
                        email: hostEmail,
                        bio: hostBio,
                        events: hostEvent,
                        owner: curr_account.id,
                        pending_transfer: false,
                      }), // Update orgs field
                    })
                      .then((res2) => {
                        if (!res2.ok) {
                          throw Error(`HTTP error! Status: ${res2.status}`);
                        }
                        return res2.json();
                      })
                      .then((host_data) => {
                        console.log("successfully changed host owner");
                        console.log(host_data);
                      });
                  });
              });
          });
      });

    navigate("/inbox"); // Example: Navigate to the inbox after approval
  };

  const handleReject = () => {
    // Handle message rejection logic
    // make it so you cant open the message again
    changeMsgType(msgid, -1);
    fetch(`/api/hosts/${hostId}`, {
      method: "PUT", // Use PUT to update the account
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: hostName,
        email: hostEmail,
        bio: hostBio,
        events: hostEvent,
        owner: curr_account.id,
        pending_transfer: false,
      }), // Update orgs field
    })
      .then((res2) => {
        if (!res2.ok) {
          throw Error(`HTTP error! Status: ${res2.status}`);
        }
        return res2.json();
      })
      .then((host_data) => {
        console.log("set pending transfer to false");
        console.log(host_data);
        navigate("/inbox"); // Example: Navigate to the inbox after rejection
      });
    
  };

  return (
    <div
      className="container"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <div className="message-content">
        <p>{content}</p>
      </div>
      <div className="button-group">
        <button
          className="btn btn-success"
          onClick={handleApprove}
          style={{ marginRight: "10px" }}
        >
          Approve
        </button>
        <button className="btn btn-danger" onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
}

export default HostTransferRecieve;
