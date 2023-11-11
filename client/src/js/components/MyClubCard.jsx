import React from "react";
import MyClubCardItem from "./MyClubCardItem"
import "../../css/components/Eventcard.css";

function MyClubCards({org,onCardClick}) {
  return (
    <div className="cards">
      <div className="cards--container">
        <div className="cards--wrapper">
          <ul className="cards--items">     
            <MyClubCardItem
            key={org.hid}
            img src="../../../images/placeholder.png"// assuming 'org' has an 'image' property
            text={org.name} // assuming 'org' has a 'name' property
            // label={org.category || "placeholder"} // assuming 'org' has a 'category' property
            // date={org.date || "placeholder date"} // assuming 'org' has a 'date' property
            // location={org.location || "placeholder location"} // assuming 'org' has a 'location' property
            path={`/hosts/${org.hid}`}
            onClick={() => onCardClick(org)}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyClubCards;