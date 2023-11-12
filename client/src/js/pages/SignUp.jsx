import React, { useState } from "react";
import "../../css/pages/Login.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function SignUp() {
  // State variables to manage form inputs and messages
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  // React Router navigation hook
  const navigate = useNavigate();

  // Function to handle form submission
  const submitSignUpForm = (e) => {
    e.preventDefault();
    // Check if the password meets a minimum length requirement
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    // Check if the provided email and confirmEmail match
    if (email !== confirmEmail) {
      setErrorMessage("Emails do not match.");
      return;
    }
    // Check if the provided password and confirmPassword match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Send a POST request to the signup API
    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        if (res.status === 409) {
          throw new Error("Email already in use");
        } else if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Clear form inputs and set signup success state
        setName("");
        setEmail("");
        setConfirmEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
        setSignupSuccess(true);

        // Navigate to the login page after successful signup
        navigate("/login");
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  return (
    <>
      {/* Render the Navbar component */}
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <h2>Create Account</h2>
          <form onSubmit={submitSignUpForm}>
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Confirm Email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </span>
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="additional-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
            </div>
            {/* Display error message if signup fails */}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            {/* Display success message if signup succeeds */}
            {signupSuccess && (
              <p className="success-message" style={{ textAlign: "center" }}>
                Signup successful!
              </p>
            )}
            <button type="submit" className="btn--login">
              Sign Up
            </button>
            <div className="signup-option">
              <span>or</span>
              <a href="/login">Log In</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
