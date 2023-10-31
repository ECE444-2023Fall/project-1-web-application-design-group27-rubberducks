import React, { useState } from "react";
import "../../css/components/App.css";
import "../../css/pages/Create_Host_Profile.css";

function CreateHostProfile() {
  const [name, setName] = useState("");
  const [club_name, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const profile = {
      name,
      club_name,
      email,
      bio,
      profilePhoto, // Include the profile photo in the form data
    };

    // Handle form submission, including the profile photo data
    console.log("Profile Data:", profile);
  };

  return (
    <div className="container">
      <h2>Create Host Profile</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          placeholder="Host Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="club_name">Club Name:</label>
        <input
          type="text"
          id="club_name"
          placeholder="Club Name"
          value={club_name}
          onChange={(e) => setClubName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
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

        <label htmlFor="profilePhoto">Club Photo</label>
        <input
          type="file"
          id="profilePhoto"
          accept="image/*"
          onChange={handleProfilePhotoChange}
        />

        {profilePhoto && (
          <img
            src={URL.createObjectURL(profilePhoto)}
            alt="Selected Profile Photo"
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        )}

        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}

export default CreateHostProfile;
