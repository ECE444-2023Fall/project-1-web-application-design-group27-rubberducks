import React from "react";
import { MdEdit } from "react-icons/md";
import "../../css/components/Sidebar.css";
import { Link } from "react-router-dom";
import { Get_Profile_Img_Link } from "./Get_Img_Link";

function ClubSidebar(props) {
  return (
    <div className="sidebar">
      <div >
      <img src={Get_Profile_Img_Link(props.profile_pic)} alt="Profile Picture" />
      <div className="edit--profile--pic">
            <Link to={{
                pathname:"/profile/edit_pic_club",
                state:{returnPath: "/profile/clubs"}
                }}>
              <button className="edit--button--icon">
                <MdEdit />
              </button>
            </Link>
          </div>
          </div>
      <div className="side--basic--info">
        <div className="sidebar--user--header">
          <Link className="profile--name--link" to="/profile/clubs">
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

export default ClubSidebar;
