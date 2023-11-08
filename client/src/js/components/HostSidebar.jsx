import React from "react";
import { MdEdit } from "react-icons/md";
import "../../css/components/Sidebar.css";
import { Link, useLocation } from "react-router-dom";

function HostSidebar(props) {
  const location = useLocation();
  const isHostTransferPage = location.pathname.includes("/transfer");
  const isHostTransferReceivePage =
    location.pathname.includes("/transfer_receive");

  return (
    <div className="sidebar">
      <img src="../../../images/placeholder.png" alt="Profile Picture" />
      <div className="side--basic--info">
        <div className="sidebar--user--header">
          <div className="sidebar--user--name">{props.name}</div>
          {props.ownerLoggedIn && !isHostTransferReceivePage ? (
            <div className="edit--button">
              <Link to={`/hosts/${props.hid}/edit`}>
                <button className="edit--button--icon">
                  <MdEdit />
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ width: "30px" }}></div>
          )}
        </div>
        <div className="sidebar--user--email">{props.email}</div>
      </div>
      {props.ownerLoggedIn && !isHostTransferReceivePage ? (
        <div className="host--transfer--button">
          <Link to={`/hosts/${props.hid}/transfer`}>
            <button className="transfer-button btn">Transfer Ownership</button>
          </Link>
        </div>
      ) : null}
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
