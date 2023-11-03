import React from "react";
import { MdEdit } from "react-icons/md";
import "../../css/components/Sidebar.css";
import { Link, useLocation } from "react-router-dom";

function HostSidebar(props) {
  const location = useLocation();
  const isHostTransferPage = location.pathname.includes("/transfer");

  return (
    <div className="sidebar">
      <img src="../../../images/placeholder.png" alt="Profile Picture" />
      <div className="side--basic--info">
        <div className="sidebar--user--header">
          <div className="sidebar--user--name">{props.name}</div>
          <div className="edit--button">
            <Link to={`/host_profile/${props.hid}/edit`}>
              <button className="edit--button--icon">
                <MdEdit />
              </button>
            </Link>
          </div>
        </div>
        <div className="sidebar--user--email">{props.email}</div>
        {isHostTransferPage ? null : (
          <div className="host--transfer--button">
            <Link to={`/host_profile/${props.hid}/transfer`}>
              <button className="transfer-button">Transfer Ownership</button>
            </Link>
          </div>
        )}
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
