import React from "react";
import { MdEdit } from "react-icons/md";

function UserSidebar(props) {
  return (
    <div className="sidebar">
      <img src="../../../images/placeholder.png" alt="Profile Picture" />
      <div className="user--name">
        {props.name}{" "}
        <div className="edit--button">
          <button className="edit--button-icon">
            <MdEdit />
          </button>
        </div>
      </div>
      <div className="user--email">{props.email}</div>
    </div>
  );
}

export default UserSidebar;
