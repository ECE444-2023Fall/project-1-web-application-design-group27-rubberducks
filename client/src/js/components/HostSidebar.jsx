import React from "react";
import { MdEdit } from "react-icons/md";
import "../../css/components/Sidebar.css";
import { Link } from "react-router-dom";

function HostSidebar(props) {
  return (
    <div className="sidebar">
      <img src="../../../images/placeholder.png" alt="Profile Picture" />
      <div className="side--basic--info">
        <div className="sidebar--user--header">
          <div className="sidebar--user--name">{props.name}</div>
          <div className="edit--button">
            <Link to="/host_profile/edit">
              <button className="edit--button--icon">
                <MdEdit />
              </button>
            </Link>
          </div>
        </div>
        <div className="sidebar--user--email">{props.email}</div>
      </div>

      <div className="host--info">
        <div className="host--bio">
          <h2 className="sidebar--heading">Bio</h2>
          <p className="sidebar--paragraph">{props.bio}</p>
        </div>
        <div className="host--tags">
          <h2 className="sidebar--heading">Tags</h2>
        </div>
      </div>
    </div>
  );
}

export default HostSidebar;
