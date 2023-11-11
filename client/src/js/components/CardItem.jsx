import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import "../../css/components/CardItem.css"
// import "../../css/pages/events/Eventsgrid.css"

function CardItem(props) {
  return (
    <>
      <li className="cards--item">
        <Link className="cards--item--link" to={props.path}>
          <figure className="cards--item--pic-wrap" data-category={props.label}>
            <img
              src={props.src}
              alt="Event Image"
              className="cards--item--img"
            />
          </figure>
          <div className="cards--item--info">
            <h5 className="cards--item--text">{props.text}</h5>
            <div className="cards--item--subtitle">
              <FaMapMarkerAlt className="cards--item--icon" />
              <span className="cards--item--location">{props.location}</span>
            </div>
            <div className="cards--item--subtitle">
              <FaClock className="cards--item--icon" />
              <span className="cards--item--date">{props.date}</span>
            </div>
          </div>
        </Link>
      </li>
    </>
  );
}

export default CardItem;
