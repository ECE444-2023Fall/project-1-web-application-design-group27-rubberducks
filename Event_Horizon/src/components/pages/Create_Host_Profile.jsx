import React, { useState } from "react";
import "../../App.css";
import "./Create_Host_Profile.css"

function Create_Host_Profile() {
  // Define state to store form input values
  const [name, setName] = useState("");
  const [club_name, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a profile object with form input values
    const profile = {
      name,
      club_name,
      email,
      bio,
    };

    // Will need to store this info 
    console.log("Profile Data:", profile);
  };

  return (
    <div>
      <h2>Create Host Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="club_name">Club Name:</label>
        <input
          type="text"
          id="club_name"
          value={club_name}
          onChange={(e) => setClubName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="4"
          cols="50"
        />
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}

export default Create_Host_Profile;
