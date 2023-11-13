import React, { useState, useEffect } from "react";
import MyClubCards from "../../components/MyClubCard";
import { Outlet, useNavigate, Link, useOutletContext } from "react-router-dom";
import ClubSidebar from "../../components/ClubSidebar";
import "../../../css/pages/user_profile/Profile_upcoming.css";
//This file implements My Club page, it will fetch current user's clubs and display on the page, each club card will lead to a host profile
export default function My_Clubs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [orgsWithHosts, setOrgsWithHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    profile_pic: null,
  });

  // Function to fetch user details and their orgs
  const fetchUserDetailsAndOrgs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        console.error("No user id found");
        return;
      }

      const response = await fetch(`/api/accounts/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUserInfo(data);
      setName(data.name);
      setBio(data.bio);
      setEmail(data.email);
      setOrgs(data.orgs); // Update the orgs state

      // Fetch the host details after setting the orgs
      await fetchHostDetailsForOrgs(data.orgs);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Function to fetch host details for each org
  const fetchHostDetailsForOrgs = async (orgs) => {
    const hostFetchPromises = orgs.map((org) =>
      fetch(`/api/hosts/${org}`).then((res) => res.json())
    );

    try {
      const hostDetailsArray = await Promise.all(hostFetchPromises);
      setOrgsWithHosts(hostDetailsArray); // Update the orgsWithHosts state
    } catch (error) {
      console.error("Error fetching host details:", error);
    }
  };

  // useEffect to fetch user details and orgs when the component mounts
  useEffect(() => {
    fetchUserDetailsAndOrgs();
  }, []);

  if (loading) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <l-bouncy size="45" speed="1.75" color="#002452"></l-bouncy>
        </div>
      </>
    );
  }

  return (
    <>
      <ClubSidebar  name={userInfo.name} email={userInfo.email} profile_pic={userInfo.profile_pic} />
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">My Clubs</h2>
          </div>
          {orgsWithHosts.length > 0 ? (
            <MyClubCards orgs = {orgsWithHosts}/>
          ) : (
            <div className="profile--category--empty">
            You do not have any clubs.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

