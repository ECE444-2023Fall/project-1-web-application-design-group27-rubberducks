import React from "react";
import "../../css/components/Sidebar.css";

function EventHostSidebar(props) {
  return (
    <div className="sidebar">
      <img src="../../../images/placeholder.png" alt="Profile Picture" />
      <div className="side--basic--info">
        <div className="sidebar--user--header">
          <div className="sidebar--user--name">{props.name}</div>
        </div>
        <div className="sidebar--user--email">{props.email}</div>
      </div>

      <div className="host--info">
        <div className="host--bio">
          <h2 className="sidebar--heading">Bio</h2>
          <p className="sidebar--paragraph">{props.bio}</p>
        </div>
        {/* <div className="host--tags">
          <h2 className="sidebar--heading">Tags</h2>
        </div> */}
      </div>
    </div>
  );
}

export default EventHostSidebar;