import React, { useState, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import "../../css/pages/Inbox.css";
import Navbar from "../components/Navbar";

function InboxPage() {
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();
  const curr_account = JSON.parse(localStorage.getItem("user"));

  const markAsRead = (id) => {
    const updateReadUrl = `/api/messages/${id}`;

    // Send a PUT request to mark the message as read
    fetch(updateReadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ read: true }), // Assuming you want to mark it as read
    })
      .then((response) => {
        if (response.ok) {
          console.log("Message marked as read successfully.");
          // Continue with displaying the message or any other logic.
        } else {
          console.error("Failed to mark the message as read.");
        }
      })
      .catch((error) => {
        console.error("Error while marking the message as read:", error);
      });
  };

  const getMessageLink = (id) => {
    // Fetch the message data
    fetch(`/api/messages/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        let link; // Declare the link variable here

        switch (data.msg_type) {
          case 1: // event notification
            link = "/inbox";
            console.log(link);
            navigate(link);
            return link; // Make sure to return the link
          case 2: // club notification
            link = "/inbox";
            console.log(link);
            navigate(link);
            return link; // Return the link
          case 3: // transfer request
            console.log("Handling transfer request");
            link = `/hosts/${
              data.message.split(/\s+(?=\S*$)/)[1]
            }/transfer_receive/${data.msgid}`;
            console.log(link);
            navigate(link);
            return link;
          default:
            link = "/inbox";
            console.log(link);
            navigate(link);
            return link;
        }
      });
  };

  const handleMessageClick = (message) => {
    // Mark the message as read when it's clicked
    markAsRead(message.msgid);
    // Handle navigation based on the message type
    console.log(message.msg_type);
    getMessageLink(message.msgid);
  };

  const handleDelete = (id) => {
    // Send a DELETE request to remove the message
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

        const updatedMsgids = curr_account_data.msgids.filter(
          (msgid) => msgid !== parseInt(id, 10)
        );
        const update_account = {
          name: curr_account_data.name,
          email: curr_account_data.email,
          events: curr_account_data.events,
          fav_events: curr_account_data.fav_events,
          orgs: curr_account_data.orgs,
          msgids: updatedMsgids,
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

            fetch(`/api/messages/${id}`, {
              method: "DELETE",
            })
              .then((response) => {
                if (response.ok) {
                  console.log("Message deleted successfully.");
                  // Remove the deleted message from the state
                  setMessages((prevMessages) =>
                    prevMessages.filter((message) => message.msgid !== id)
                  );
                } else {
                  console.error("Failed to delete the message.");
                }
              })
              .catch((error) => {
                console.error("Error while deleting the message:", error);
              });
          })
          .catch((error) => {
            console.error("Error while fetching current account:", error);
          });
      });
  };

  // Simulate fetching messages from an API
  useEffect(() => {
    fetch(`/api/messages/account/${curr_account.id}`)
      .then((response) => response.json())
      .then((data) => {
        // Sort messages by "created_at" in descending order
        if (Array.isArray(data)) {
          // Check if data is an array
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setMessages(data);
        } else {
          console.error("Data is not an array");
        }
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Inbox</h1>
      <div className="message-list">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.msgid}
              onClick={() => handleMessageClick(message)}
              className={`message ${
                message.read ? "normal-message" : "highlighted-message"
              }`}
            >
              <div className="message-content">{message.message}</div>
              <div className="message-date">
                Date: {message.created_at.split(":").slice(0, -1).join(":")}
              </div>
              {message.read && (
                <div className="message-actions">
                  <button
                    className="delete--button--icon"
                    onClick={() => handleDelete(message.msgid)}
                  >
                    <MdDeleteForever />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No messages in your inbox.</p>
        )}
      </div>
    </div>
  );
}

export default InboxPage;
