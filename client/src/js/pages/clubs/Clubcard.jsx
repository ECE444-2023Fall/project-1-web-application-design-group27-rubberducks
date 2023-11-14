import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaRegEdit
} from "react-icons/fa";
import "../../../css/pages/clubs/Clubcard.css";
import { Get_Profile_Img_Link } from "../../components/Get_Img_Link";

/* This is the individual cards that represent a club */

function ClubCard({club}) {
  var label = null;
  if (club.events && club.events.length > 2) {
    label = "Active";
  }
  return (
    <li title={`View ${club.name}`} className="clubCard">
      <Link className="clubLink" to={`/hosts/${club.hid}`}>
        <figure
          className={`clubImgWrapper ${label}`}
          data-category={label ? label : null}
        >
          <img
            src={club.profile_pic ? Get_Profile_Img_Link(club.profile_pic) : "images/placeholder.png"}
            alt="Club Image"
            className="clubImg"
          />
        </figure>
        <div className="clubInfo">
          <h5 className="clubName">{club.name}</h5>
          <div className="clubSubtitle">
            <FaRegEdit className="clubIcon"/>
              {club.bio ? club.bio : "This club has not set a bio."}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default ClubCard;
