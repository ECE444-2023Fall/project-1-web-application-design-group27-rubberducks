import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/components/App.css";
import "../../css/pages/Create_Host_Profile.css";
// import { useNavigate } from "react-router-dom";

function CreateHostProfile() {
  const [club_name, setClubName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get the current account from local storage
    // CHANGE WHEN LOGIN INFO ACTUALLY STORED
    if (localStorage.getItem("user")) {
      const curr_account = JSON.parse(localStorage.getItem("user"));
      console.log(curr_account);

      const profile = {
        name: club_name,
        email: email,
        bio: bio,
        events: [],
        owner: curr_account.id,
        // Modify host schema to store pic
        // profilePhoto
      };

      // Create the new host
      fetch("/api/hosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
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
            // Get all current user data
            fetch(`/api/accounts/${curr_account.id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res2) => {
                if (!res2.ok) {
                  throw new Error(`HTTP error! Status: ${res2.status}`);
                }
                return res2.json();
              })
              .then((data2) => {
                console.log(
                  "successfully fetched account of the logged-in user"
                );

                const update_account = {
                  name: data2.name,
                  email: data2.email,
                  events: data2.events,
                  fav_events: data2.fav_events,
                  orgs: data2.orgs.concat(data.hid),
                  msgids: data2.msgids,
                };

                // Update the orgs of the current account
                console.log("created a new club");
                fetch(`/api/accounts/${curr_account.id}`, {
                  method: "PUT", // Use PUT to update the account
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(update_account), // Update orgs field
                })
                  .then((res3) => {
                    if (!res3.ok) {
                      throw new Error(`HTTP error! Status: ${res3.status}`);
                    }
                    return res3.json();
                  })
                  .then((data3) => {
                    console.log("successfully updated account orgs");
                    console.log(data3);
                    // Redirect to the created page or handle as needed
                    navigate(`/hosts/${data.hid}`);

                    setEmail("");
                    setBio("");
                    setClubName("");
                    setProfilePhoto(null);
                  })
                  .catch((err) => {
                    console.log("error:", err);
                    setErrorMessage(err.message);
                  });
              })
              .catch((err) => {
                console.log("error:", err);
                setErrorMessage(err.message);
              });
          }
        })
        .catch((err) => {
          console.log("error:", err);
          setErrorMessage(err.message);
        });
    }
  };

  const handleBack = () => {
    // Navigate back to the previous page
    navigate(-1);
  };

  return (
    <div className="container">
      <div className="create-host-title">
        <h2>Create Host Profile</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="club_name" id="club_name_label">
            Club Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="club_name"
            placeholder="Club Name"
            value={club_name}
            onChange={(e) => setClubName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="club_email" id="club_email_label">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="club_email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="club_bio" id="club_bio_label">
            Bio:
          </label>
          <textarea
            className="form-control"
            id="club_bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            cols="50"
          />
        </div>

        <div className="form-group">
          <label htmlFor="profilePhoto" id="photo_label">
            Club Photo
          </label>
          <input
            type="file"
            className="form-control-file"
            id="profilePhoto"
            accept="image/*"
            onChange={handleProfilePhotoChange}
          />
        </div>

        {profilePhoto && (
          <img
            src={URL.createObjectURL(profilePhoto)}
            alt="Selected Profile Photo"
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        )}
        {errorMessage && (
          <div className="club-error-message">{errorMessage}</div>
        )}

        <div className="button-group">
          <button
            type="button"
            className="btn btn-secondary back-button"
            onClick={handleBack}
          >
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Create Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateHostProfile;
