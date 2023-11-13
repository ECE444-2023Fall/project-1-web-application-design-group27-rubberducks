import React, { useState, useEffect} from 'react';
import "../../../css/components/Choose_Picture.css";
import "../../../css/pages/user_profile/Profile.css";
import Navbar from '../../components/Navbar';
import { bouncy } from "ldrs";
import UserSidebar from '../../components/UserSidebar';
import { useNavigate } from "react-router-dom";

const EditProfilePic = () => {
  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
        const get_user = JSON.parse(localStorage.getItem("user"));
        if (!get_user || !get_user.id) {
          console.error("No user id found");
          setError("User not logged in");
        } else {
          const userResponse = await fetch(`/api/accounts/${get_user.id}`);
          if (userResponse.status === 404) {
            setError("User information not found");
          } else if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserInfo(userData);
            setSelectedPictureIndex(userData.profile_pic);
            setLoading(false);
          }
        }
      };
      getUserInfo();
    }, []);
  const profilePictures = [
    '../../../profile_pictures/placeholder.png',
    '../../../profile_pictures/img1.jpg',
    '../../../profile_pictures/img2.jpg',
    '../../../profile_pictures/img3.jpg',
    '../../../profile_pictures/img4.jpg',
    '../../../profile_pictures/img5.jpg',
    '../../../profile_pictures/img6.jpg',
    '../../../profile_pictures/img7.jpg',
    '../../../profile_pictures/img8.jpg',
    '../../../profile_pictures/img9.jpg',
    '../../../profile_pictures/img10.jpg',
    '../../../profile_pictures/img11.jpg',
    '../../../profile_pictures/img12.jpg',
  ];

  const handlePictureClick = (index) => {
    setSelectedPictureIndex(index);
  };
  const handleCancel = () => {
    navigate(`/profile`);
  };

  const handleSubmit = () => {
    const accountInfo = {
        name: userInfo.name,
        email: userInfo.email,
        events: userInfo.events,
        fav_events: userInfo.fav_events,
        orgs: userInfo.orgs,
        msgids: userInfo.msgids,
        profile_pic: selectedPictureIndex,
    }
    fetch(`/api/accounts/${userInfo.uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountInfo),
      })
        .then((res2) => {
          if (!res2.ok) {
            throw new Error(`HTTP error! Status: ${res2.status}`);
          }
          return res2.json();
        })
        .then(() => {
          console.log("successfully updated profile picture");
          navigate(`/profile`);
        })
        .catch((err) => {
          console.log("error:", err);
        });
  }

  
  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <l-bouncy size="45" speed="1.75" color="#002452"></l-bouncy>
        </div>
      </>
    );
  }


  return (
    <>
    <UserSidebar name={userInfo.name} email={userInfo.email} profile_pic={selectedPictureIndex}/>
    <div className="form">
        <h1 className="edit_header">Choose Profile Picture</h1>
      <div className="profile-pictures">
        {profilePictures.map((picture, index) => (
          <img
            key={index}
            src={picture}
            alt={`Profile Picture ${index + 1}`}
            className={selectedPictureIndex === index ? 'selected' : ''}
            onClick={() => handlePictureClick(index)}
          />
        ))}
      </div>
      <div className="button-group">
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
            <button onClick={handleSubmit} className="button_event">
              Update Picture
            </button>
          </div>
    </div>
    </>
  );
};

export default EditProfilePic;
