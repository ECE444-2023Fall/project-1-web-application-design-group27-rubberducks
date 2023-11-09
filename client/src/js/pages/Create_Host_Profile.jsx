import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../../css/components/App.css";
import "../../css/pages/Create_Host_Profile.css";
// import { useNavigate } from "react-router-dom";

function CreateHostProfile() {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [profilePhoto, setProfilePhoto] = useState(null); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
  };

  const onSubmit = (data) => {
    // Get the current account from local storage
    if (localStorage.getItem("user")) {
      const curr_account = JSON.parse(localStorage.getItem("user"));

      const profile = {
        name: data.club_name,
        email: data.email,
        bio: data.bio,
        events: [],
        owner: curr_account.id,
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
                const update_account = {
                  name: data2.name,
                  email: data2.email,
                  events: data2.events,
                  fav_events: data2.fav_events,
                  orgs: data2.orgs.concat(data.hid),
                  msgids: data2.msgids,
                };

                // Update the orgs of the current account
                fetch(`/api/accounts/${curr_account.id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(update_account),
                })
                  .then((res3) => {
                    if (!res3.ok) {
                      throw new Error(`HTTP error! Status: ${res3.status}`);
                    }
                    return res3.json();
                  })
                  .then((data3) => {
                    navigate(`/hosts/${data.hid}`);

                    // Clear form fields
                    setProfilePhoto(null);
                  })
                  .catch((err) => {
                    setErrorMessage(err.message);
                  });
              })
              .catch((err) => {
                setErrorMessage(err.message);
              });
          }
        })
        .catch((err) => {
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="club_name" id="club_name_label">
            Club Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="club_name"
            placeholder="Club Name"
            {...register("club_name", { required: true, maxLength: 50 })}
          />
          {errors.club_name?.type === "required" && (
            <p style={{ color: "red" }}>
              <small>Club name is required</small>
            </p>
          )}
          {errors.club_name?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Club name cannot exceed 50 characters</small>
            </p>
          )}
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
            {...register("email", { required: true, maxLength: 50 })}
          />
          {errors.email?.type === "required" && (
            <p style={{ color: "red" }}>
              <small>Email is required</small>
            </p>
          )}
          {errors.email?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Email cannot exceed 50 characters</small>
            </p>
          )}
        </div>
  
        <div className="form-group">
          <label htmlFor="club_bio" id="club_bio_label">
            Bio:
          </label>
          <textarea
            className="form-control"
            id="club_bio"
            {...register("bio", { maxLength: 400 })}
          />
          {errors.bio?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Bio cannot exceed 400 characters</small>
            </p>
          )}
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
};  

export default CreateHostProfile;
