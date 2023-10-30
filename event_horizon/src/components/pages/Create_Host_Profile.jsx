import React, { useState } from "react";
// import { useHistory } from "react-router-dom";  
import "../../App.css";
import "./Create_Host_Profile.css";

function CreateHostProfile() {
  const [club_name, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // const history = useHistory();

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Get the current account from local storage
    // CHANGE WHEN LOGIN INFO ACTUALLY STORED
    const curr_account = {
      uid: 1,
      orgs: [] 
    };
  
    const profile = {
      name: club_name,
      email: email,
      bio: bio,
      events: [],
      owner: curr_account.uid
      // Modify host schema to store pic
      // profilePhoto
    };
  
    // Create the new host
    fetch("/api/hosts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profile)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data && data.hid) {
          // Update the orgs of the current account
          curr_account.orgs.push(data.hid); // Add the new host's hid to the orgs
  
          fetch(`/api/accounts/${curr_account.uid}`, {
            method: "PUT", // Use PUT to update the account
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ orgs: curr_account.orgs }) // Update orgs field
          })
            .then((res2) => {
              if (!res2.ok) {
                throw new Error(`HTTP error! Status: ${res2.status}`);
              }
              return res2.json();
            })
            .then((data2) => {
              console.log(data2);
              // Redirect to the created page or handle as needed
            })
            .catch((err) => {
              console.log("error:", err);
              setErrorMessage(err.message);
            });
        } else {
          setErrorMessage("Club creation failed");
        }
      })
      .catch((err) => {
        console.log("error:", err);
        setErrorMessage(err.message);
      });
  
    // Clear the input fields and error message
    setEmail("");
    setBio("");
    setClubName("");
    setProfilePhoto(null);
  };
  

  return (
    <div className="container">
      <h2>Create Host Profile</h2>
      <form onSubmit={handleSubmit}>

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
         {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}

export default CreateHostProfile;
