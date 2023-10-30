import React from "react";
import { MdEdit } from "react-icons/md";
import "./Sidebar.css";
import { Link } from "react-router-dom";

function UserSidebar(props) {
  const ProfileEditButton = () => <EditButton label="Edit Profile" />;
  return (
    <div className="sidebar">
      <img src="../../../images/placeholder.png" alt="Profile Picture" />
      <div className="user--header">
        <div className="user--name">{props.name}</div>
        <div className="edit--button">
          <Link to="/profile/edit">
            <button className="edit--button--icon">
              <MdEdit />
            </button>
          </Link>
        </div>
      </div>
      <div className="user--email">{props.email}</div>
    </div>
  );
}

export default UserSidebar;
