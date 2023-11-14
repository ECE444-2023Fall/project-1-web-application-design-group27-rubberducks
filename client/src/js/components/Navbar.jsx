import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { RiArrowDropDownFill } from "react-icons/ri";
import "../../css/components/Navbar.css";
import logoImage from "../../../public/images/Screenshot_2023-11-09_at_4.35.40_PM-removebg-preview.png";

function Navbar() {
  const [click, setClick] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [button, setButton] = useState(true);
  const [buttonText, setButtonText] = useState("Login");
  const [userClubs, setUserClubs] = useState([]);

  const handleClick = () => setClick(!click);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (window.innerWidth <= 960) {
      setButton(false);
      if (user) {
        setButtonText("Logout");
      } else {
        setButtonText("Login");
      } // Change to "Login" when the button should be shown
    } else {
      setButton(true);
      if (user) {
        setButtonText("Logout");
      } else {
        setButtonText("Login");
      }
    }
  };

  const loggedIn = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
      closeMobileMenu();
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    showButton();
    loggedIn();
  }, []);

  window.addEventListener("resize", showButton);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setButtonText("Login");
    setIsLoggedIn(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container"></div>
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img
            src={logoImage}
            alt="Logo"
            style={{ width: "100px", height: "auto" }}
          />
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
                    onClick={(closeMobileMenu, toggleDropdown)}
                  >
                    My Profile
                  </Link>
                </li>
                {userClubs.length >= 0 && (
                  <li>
                    <Link
                      to="/profile/clubs"
                      className="dropdown-nav-links"
                      onClick={closeMobileMenu}
                    >
                      My Clubs
                    </Link>
                    <ul>
                      {userClubs.map((club) => (
                        <li key={club.id}>
                          <Link
                            to={`/club/${club.id}`} // Uncomment this if you want individual club links
                            className="dropdown-nav-links"
                            onClick={closeMobileMenu}
                          >
                            {club.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                <li>
                  <Link
                    to="/profile/create_host"
                    className="dropdown-nav-links"
                    onClick={(closeMobileMenu, toggleDropdown)}
                  >
                    + Create Club
                  </Link>
                </li>
              </ul>
            </li>
          )}
          {isLoggedIn && (
            <li className="nav-item">
              <Link to="/inbox" className="nav-links" onClick={closeMobileMenu}>
                Inbox
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link
              to="/login"
              className="nav-links-mobile"
              onClick={buttonText === "Logout" ? handleLogout : closeMobileMenu}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </Link>
          </li>
        </ul>
        {button && (
          <Button
            to="/login"
            buttonStyle="btn--outline"
            onClick={buttonText === "Logout" ? handleLogout : null}
          >
            {buttonText}
          </Button>
        )}
      </nav>
    </>
  );
}

export default Navbar;
