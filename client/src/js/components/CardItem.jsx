import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock,FaCalendar,FaRegUserCircle } from "react-icons/fa";
import "../../css/components/CardItem.css"
//This file add "location,date,time" icons to cards
function CardItem(props) {
  return (
    <>
      <li className="cards--item">
        <Link className="cards--item--link" to={props.path}>
          <div className="cards--item--pic-wrap">
            <img
              src={props.src}
              alt="Event Image"
              className="cards--item--img"
            />
          </div>
          <div className="cards--item--info">
            <h5 className="cards--item--text">{props.text}</h5>
            <div className="cards--item--subtitle">
              <FaMapMarkerAlt className="cards--item--icon" />
              <span className="cards--item--location">{props.location}</span>
            </div>
            <div className="cards--item--subtitle">
              <FaCalendar className="cards--item--icon" />
              <span className="eventDate">{props.date}</span>
            </div>
            <div className="cards--item--subtitle">
              <FaClock className="cards--item--icon" />
              <span className="eventTime">{props.start_time} - {props.end_time}</span>
            </div>
          </div>
        </Link>
      </li>
    </>
  );
}

export default CardItem;
