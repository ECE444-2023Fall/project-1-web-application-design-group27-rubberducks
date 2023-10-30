import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { RiArrowDropDownFill } from "react-icons/ri";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to false, change based on login backend logic
  const [button, setButton] = useState(true);
  const [userOrgs, setUserOrgs] = useState([]);

  const handleClick = () => setClick(!click);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            LOGO
          </Link>
          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fa-solid fa-times" : "fa-solid fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/events" className="nav-links" onClick={closeMobileMenu}>
                Events
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/clubs" className="nav-links" onClick={closeMobileMenu}>
                Clubs
              </Link>
            </li>
          
            {isLoggedIn && (
              <li className={`nav-item ${dropdownOpen ? "active" : ""}`}>
                <div className="nav-links" onClick={toggleDropdown}>
                  Account <RiArrowDropDownFill />
                </div>
                <ul className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
                  <li>
                    <Link
                      to="/profile"
                      className="dropdown-nav-links"
                      onClick={closeMobileMenu}
                    >
                      My Profile
                    </Link>
                  </li>
                  {userOrgs.length > 0 && (
                    <li>
                      <span className="dropdown-nav-links">My Organizations</span>
                      <ul>
                        {userOrgs.map((org) => (
                          <li key={org.hid}>
                            <Link
                              to={`/org/${org.hid}`} // assuming this is the desired link structure
                              className="dropdown-nav-links"
                              onClick={closeMobileMenu}
                            >
                              {org.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/create_host_profile"
                      className="dropdown-nav-links"
                      onClick={closeMobileMenu}
                    >
                      + Create Profile
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            {!isLoggedIn && (
              <li className="nav-item">
                <Link
                  to="/login"
                  className="nav-links-mobile"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
          {!isLoggedIn && button && (
            <Button to="/login" buttonStyle="btn--outline">
              LOGIN
            </Button>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "./Button";
// import { RiArrowDropDownFill } from "react-icons/ri";
// import "./Navbar.css";

// function Navbar() {
//   const [click, setClick] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(true); // Need to set this based on login backend logic
//   const [button, setButton] = useState(true);
//   const [userOrgs, setUserOrgs] = useState([]); // To store the user's organizations

//   const handleClick = () => setClick(!click);
//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
//   const closeMobileMenu = () => setClick(false);

//   const showButton = () => {
//     if (window.innerWidth <= 960) {
//       setButton(false);
//     } else {
//       setButton(true);
//     }
//   };

//   useEffect(() => {
//     showButton();
//   }, []);

//   window.addEventListener("resize", showButton);

//   // Simulated function to fetch user's organizations
//   const fetchUserOrgs = () => {
//     // Replace this with actual API call to get user's organizations
//     // Example:
//     // fetch("/api/user/orgs")
//     //   .then((response) => response.json())
//     //   .then((data) => setUserOrgs(data));
//   };

//   useEffect(() => {
//     // Fetch user's organizations when the component loads
//     if (isLoggedIn) {
//       fetchUserOrgs();
//     }
//   }, [isLoggedIn]);

//   return (
//     <>
//       <nav className="navbar">
//         <div className="navbar-container"></div>
//         <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
//           LOGO
//         </Link>
//         <div className="menu-icon" onClick={handleClick}>
//           <i className={click ? "fa-solid fa-times" : "fa-solid fa-bars"} />
//         </div>
//         <ul className={click ? "nav-menu active" : "nav-menu"}>
//           <li className="nav-item">
//             <Link to="/" className="nav-links" onClick={closeMobileMenu}>
//               Home
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/events" className="nav-links" onClick={closeMobileMenu}>
//               Events
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/clubs" className="nav-links" onClick={closeMobileMenu}>
//               Clubs
//             </Link>
//           </li>

//           {isLoggedIn ? (
//             // If user is logged in, display the dropdown menu with organizations
//             <li className={`nav-item ${dropdownOpen ? "active" : ""}`}>
//               <div className="nav-links" onClick={toggleDropdown}>
//                 Account <RiArrowDropDownFill />
//               </div>
//               <ul className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
//                 <li>
//                   <Link
//                     to="/user-profile"
//                     className="dropdown-nav-links"
//                     onClick={closeMobileMenu}
//                   >
//                     My Profile
//                   </Link>
//                 </li>
//                 {userOrgs.length > 0 && (
//                   <li>
//                     <span className="dropdown-nav-links">My Organizations</span>
//                     <ul>
//                       {userOrgs.map((org) => (
//                         <li key={org.hid}>
//                           <Link
//                             // this needs to route to the host profile
//                             // host_profile at the specified hid
//                             // to={`/org/${org.hid}`}
//                             to="/host_profile"
//                             className="dropdown-nav-links"
//                             onClick={closeMobileMenu}
//                           >
//                             {org.name}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   </li>
//                 )}
//                 <li>
//                   <Link
//                     to="/create_host_profile"
//                     className="dropdown-nav-links"
//                     onClick={closeMobileMenu}
//                   >
//                     + Create Profile
//                   </Link>
//                 </li>
//               </ul>
//             </li>
//           ) : (
//             // If user is not logged in, display the "Login" button
//             <li className="nav-item">
//               <Link
//                 to="/login"
//                 className="nav-links-mobile"
//                 onClick={closeMobileMenu}
//               >
//                 Login
//               </Link>
//             </li>
//           )}
//         </ul>
//         {!isLoggedIn && button && (
//           <Button to="/login" buttonStyle="btn--outline">
//             LOGIN
//           </Button>
//         )}
//       </nav>
//     </>
//   );
// }

// export default Navbar;
