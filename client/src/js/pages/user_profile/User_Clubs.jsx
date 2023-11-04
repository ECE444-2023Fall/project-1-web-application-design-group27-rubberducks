import React, { useState, useEffect } from "react";
import "../../../css/pages/user_profile/Profile_upcoming.css";
import Cards from "../../components/Cards";
import UserSidebar from "../../components/UserSidebar";

export default function My_Clubs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [userClubs, setUserClubs] = useState([]);

  // Function to fetch clubs that the current user has joined
  const fetchUserClubs = async () => {
    // Retrieve the user from local storage
    const user = JSON.parse(localStorage.getItem("user"));

    // If a user is found and has an 'id', fetch their clubs
    if (user && user.id) {
      try {
        // const response = await fetch(`/api/clubs/user/${user.id}`, {
        //   // Uncomment and modify if you need to send headers for authorization, etc.
        //   // headers: {
        //   //   Authorization: `Bearer ${user.token}`, // Example if you're using token-based auth
        //   // },
        // });
        const response = await fetch('/api/hosts' );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const clubs = await response.json();
        setUserClubs(clubs);
      } catch (error) {
        console.error("Failed to fetch user clubs:", error);
        // Add any error handling logic you need here
      }
    }
  };

  // useEffect to set user data from local storage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const currentUser = JSON.parse(user);
      setName(currentUser.name);
      setEmail(currentUser.email);
      setBio(currentUser.bio);
      setOrgs(currentUser.orgs);
    }
  }, []);

  // useEffect to fetch clubs when the component mounts
  useEffect(() => {
    fetchUserClubs();
  }, []);

  return (
    <>
      <UserSidebar name={name} email={email} orgs={orgs} bio={bio} />
      <div className="user--events">
        <div className="profile--category">
          <div className="card--header">
            <h2 className="card--heading">My Clubs</h2>
          </div>
          {userClubs.length > 0 ? (
            userClubs.map(club => (
              <Cards key={club.id} club={club} /> // Adjust `club.id` and `club` based on your data structure
            ))
          ) : (
            <p>You have not joined any clubs yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import "../../../css/pages/user_profile/Profile_upcoming.css";
// import Cards from "../../components/Cards";
// import UserSidebar from "../../components/UserSidebar";

// export default function My_Clubs() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [bio, setBio] = useState("");
//   const [orgs, setOrgs] = useState([]);

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (user) {
//       const curr_account = JSON.parse(user);
//       setName(curr_account.name);
//       setEmail(curr_account.email);
//       setBio(curr_account.bio);
//       setOrgs(curr_account.orgs);
//     } else {
//       setName("hi");
//       setEmail("random");
//       setBio("some bio");
//       setOrgs([]);
//     }
//   }, []); 

//   return (
//     <>
//       <UserSidebar name={name} email={email} orgs={orgs} bio={bio}/>
//       <div className="user--events">
//         <div className="profile--category">
//           <div className="card--header">
//             <h2 className="card--heading">My Clubs</h2>
//           </div>
//           <Cards />
//           <Cards />
//           <Cards />
//         </div>
//       </div>
//     </>
//   );
// }

