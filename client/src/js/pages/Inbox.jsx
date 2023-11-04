import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../../css/pages/Inbox.css";

function InboxPage() {
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

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
          console.log('Message tyoe changed successfully.');
          // Continue with displaying the message or any other logic.
        } else {
          console.error('Failed to change message type.');
        }
      })
      .catch((error) => {
        console.error('Error while changing message type:', error);
      });
  };

  const markAsRead = (id) => {
    const updateReadUrl = `/api/messages/${id}`;

    // Send a PUT request to mark the message as read
    fetch(updateReadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ read: true }), // Assuming you want to mark it as read
    })
      .then((response) => {
        if (response.ok) {
          console.log('Message marked as read successfully.');
          // Continue with displaying the message or any other logic.
        } else {
          console.error('Failed to mark the message as read.');
        }
      })
      .catch((error) => {
        console.error('Error while marking the message as read:', error);
      });
  };

  const getMessageLink = (message) => {
    switch (message.msg_type) {
      case 1: // event notification
        return '/inbox';
      case 2: // club notification
        return '/inbox';
      case 3: // transfer request
        // make message unclickable
        changeMsgType(message.msgid, -1)
        return `/transfer_recieve/${message.message.split(/\s+(?=\S*$)/)[1]}`;
      default:
        return '/inbox' //reload inbox by default
    }
  };

  const handleMessageClick = (message) => {
    // Mark the message as read when it's clicked
    markAsRead(message.msgid);
    // Handle navigation based on the message type
    console.log(message.msg_type)
    const link = getMessageLink(message);
    console.log(link);
    // Perform navigation here (e.g., using React Router)
    navigate(link);
  };

  const handleDelete = (id) => {
    // Send a DELETE request to remove the message
    fetch(`/api/messages/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Message deleted successfully.');
          // Remove the deleted message from the state
          setMessages((prevMessages) => prevMessages.filter((message) => message.msgid !== id));
        } else {
          console.error('Failed to delete the message.');
        }
      })
      .catch((error) => {
        console.error('Error while deleting the message:', error);
      });
  };
  
  // Must be logged in
  const curr_account = JSON.parse(localStorage.getItem("user"));

  // Simulate fetching messages from an API
  useEffect(() => {
    fetch(`/api/messages/account/${curr_account.id}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  }, []);

  return (
    <div>
      <h1>Inbox</h1>
      <div className="message-list">
        {messages.map((message) => (
          <div key={message.msgid} onClick={() => handleMessageClick(message)} className={`message ${message.read ? 'normal-message' : 'highlighted-message'}`}>
            <div className="message-content">{message.message}</div>
            <div className="message-date">Date: {message.created_at}</div>
            {message.read && (
              <div className="message-actions">
                <button onClick={() => handleDelete(message.msgid)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

}

export default InboxPage;
