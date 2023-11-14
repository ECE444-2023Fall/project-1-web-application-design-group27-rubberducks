import React from 'react';
import { Link } from 'react-router-dom';
import "../../css/components/CardItem.css"
//This file is used for MyClubCard,add path,name in to the card
function MyClubCardItem(props) {
  return (
    <li className="cards--item">
      <Link className="cards--item--link" to={props.path}>
        <figure className="cards--item--pic-wrap">
          <img
            src={props.src}
            alt="Event Image"
            className="cards--item--img"
          />
        </figure>
        <div className="cards--item--info">
          <h5 className="cards--item--text">{props.text}</h5>
        </div>
      </Link>
    </li>
  );
}

export default MyClubCardItem;
