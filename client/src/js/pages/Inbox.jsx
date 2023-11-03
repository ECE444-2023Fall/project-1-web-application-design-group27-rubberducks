import React, { useState, useEffect } from 'react';
import "../../css/pages/Inbox.css";

function InboxPage() {
  const [messages, setMessages] = useState([]);

  const getMessageLink = (type) => {
    // first set message to read

    switch (type) {
      case 'transfer-account':
        return '/announcement';
      case 'reminder':
        return '/reminder';
      // Add more cases for different message types and their respective links
      default:
        return '/default-link'; // A default link for unknown types
    }
  };

  // Must be logged in
  const curr_account = JSON.parse(localStorage.getItem("user"));
  console.log(curr_account);

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
          <div
            key={message.msgid}
            href={getMessageLink(message.type)}
            className={`message ${message.read ? 'normal-message' : 'highlighted-message'}`}
          >
            <div className="message-content">{message.message}</div>
            <div className="message-date">Date: {message.created_at}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InboxPage;

