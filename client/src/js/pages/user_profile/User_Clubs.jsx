import React, { useState, useEffect } from "react";
import "../../../css/pages/user_profile/Profile_upcoming.css";
import UserCards from "../../components/UserCards";
import UserSidebar from "../../components/UserSidebar";

export default function My_Clubs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [orgs,setOrgs] = useState([]);

  // Function to fetch user details and their orgs
  const fetchUserDetailsAndOrgs = async () => {
    try {
      // Retrieve the user from local storage
      const user = JSON.parse(localStorage.getItem("user"));

      // Check if user exists and has an id
      if (!user || !user.id) {
        console.error("No user id found");
        return;
      }

      // Fetch user details including orgs
      fetch(`/api/accounts/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) =>{
          setName(data.name);
          setBio(data.bio);
          setEmail(data.email);
          setOrgs(data.orgs);
          console.log(data);
        });
      

    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // useEffect to fetch user details and orgs when the component mounts
  useEffect(() => {
    fetchUserDetailsAndOrgs();
  }, []);

  return (
    <>
      <UserSidebar name={name} email={email} bio={bio} />
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">My Clubs</h2>
          </div>
          {orgs.length > 0 ? (
            orgs.map((org) => (
              <UserCards key={org.id} org={org} /> // Make sure 'org' object contains all the properties expected by 'Cards'
            ))
          ) : (
            <p>You have not joined any clubs yet.</p>
          )}
        </div>
      </div>
    </>
  );
}