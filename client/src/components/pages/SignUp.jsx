import React, { useState } from "react";
import "../../Login.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const submitSignUpForm = (e) => { // Updated function name here
    e.preventDefault();
  
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
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data && data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          // Navigate to the main/dashboard page 
  
          // Clear the input fields and error message
          setName("");
          setEmail("");
          setPassword("");
          setErrorMessage("");
        } else {
          setErrorMessage("There was an issue with your Signup. Please try again.");
        }
      })
      .catch((err) => {
        console.log("error:", err);
        if (err.message && err.message.includes("409")) {
          setErrorMessage("Email already in use.");
        } else {
          setErrorMessage("There was an issue with your Signup. Please try again.");
        }
      });
  };
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome!</h2>
        <form onSubmit={submitSignUpForm}> {/* Updated function name here */}
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
              {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
            </span>
          </div>
          <div className="additional-options">
            <label>
              <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
              Remember me
            </label>
          </div>
          <button onClick={submitSignUpForm}>Sign Up</button> {/* Updated function name here */}
          <div className="signup-option">
            <span>or</span>
            <a href="/login">Log In</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
