import React, { useState, useEffect } from "react";
import "../../../css/pages/user_profile/Profile_upcoming.css";
import Cards from "../../components/Cards";
import UserSidebar from "../../components/UserSidebar";

export default function My_Clubs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const curr_account = JSON.parse(user);
      setName(curr_account.name);
      setEmail(curr_account.email);
      setBio(curr_account.bio);
      setOrgs(curr_account.orgs);
    } else {
      setName("hi");
      setEmail("random");
      setBio("some bio");
      setOrgs([]);
    }
  }, []); 

  return (
    <>
      <UserSidebar name={name} email={email} bio={bio} />
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">My Clubs</h2>
          </div>
          <Cards />
          <Cards />
          <Cards />
        </div>
      </div>
    </>
  );
}
