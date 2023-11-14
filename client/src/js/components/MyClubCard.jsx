import React from "react";
import MyClubCardItem from "./MyClubCardItem"
import "../../css/components/CardItem.css";
import { Get_Img_Link } from "./Get_Img_Link";
//This file is used in My Clubs, which will direct to host profile and display host's name, picture
function MyClubCards({orgs}) {
  return (
    <div className="cards">
      <div className="cards--container">
        <div className="cards--wrapper">
          {orgs.map(org => (
            <MyClubCardItem
            key={org.hid}
            src={Get_Img_Link(org.profile_pic)}
            text={org.name} 
            path={`/hosts/${org.hid}`}
            onClick={() => onCardClick(org)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default MyClubCards;