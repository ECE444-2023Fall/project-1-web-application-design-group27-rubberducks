import React from "react";
import { MdEdit } from "react-icons/md";
import "../../css/components/Sidebar.css";
import { Link } from "react-router-dom";

function UserSidebar(props) {
  return (
    <div className="sidebar">
      <img src="../../../images/placeholder.png" alt="Profile Picture" />
      <div className="side--basic--info">
        <div className="sidebar--user--header">
          <Link className="profile--name--link" to="/profile">
            <div className="sidebar--user--name">{props.name}</div>
          </Link>
          <div className="edit--button">
            <Link to="/profile/edit">
              <button className="edit--button--icon">
                <MdEdit />
              </button>
            </Link>
          </div>
        </div>
        <div className="sidebar--user--email">{props.email}</div>
      </div>
    </div>
  );
}

export default UserSidebar;
