import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import "./Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [button, setButton] = useState(true);

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
        <div className="navbar-container"></div>
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
          <li className={`nav-item ${dropdownOpen ? "active" : ""}`}>
            <div className="nav-links" onClick={toggleDropdown}>
              Account <i className="fas fa-caret-down" />
            </div>
            <ul className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
              <li>
                <Link to="/user-profile" className="nav-links" onClick={closeMobileMenu}>
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/create_host_profile" className="nav-links" onClick={closeMobileMenu}>
                  Create Host Profile
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <Link
              to="/login"
              className="nav-links-mobile"
              onClick={closeMobileMenu}
            >
              Login
            </Link>
          </li>
        </ul>
        {button && <Button to="/login" buttonStyle="btn--outline">LOGIN</Button>}
      </nav>
    </>
  );
}

export default Navbar;
