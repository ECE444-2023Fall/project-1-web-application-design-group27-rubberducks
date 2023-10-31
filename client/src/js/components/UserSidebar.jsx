import React from "react";
import { MdEdit } from "react-icons/md";
import "../../css/components/Sidebar.css";
import { Link } from "react-router-dom";

function UserSidebar(props) {
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
      {/* <div className="user--orgs">
        <div className="org--title">Org</div>
        {props.orgNames.map((orgName, index) => (
          <div key={index} className="org--name">
            {org}
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default UserSidebar;
