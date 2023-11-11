import React, { useState, useEffect } from "react";
import MyClubCards from "../../components/MyClubCard";
import UserSidebar from "../../components/UserSidebar";
import "../../../css/pages/user_profile/Profile_upcoming.css";

export default function My_Clubs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [orgsWithHosts, setOrgsWithHosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">My Clubs</h2>
          </div>
          {orgsWithHosts.length > 0 ? (
            orgsWithHosts.map((orgWithHost) => (
              <MyClubCards key={orgWithHost.id} org={orgWithHost} />
            ))
          ) : (
            <p>You have not joined any clubs yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
