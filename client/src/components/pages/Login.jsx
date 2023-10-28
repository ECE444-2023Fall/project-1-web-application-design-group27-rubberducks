import React, { useState } from "react";
import "../../Login.css";
import axios from "axios";  // if you're using axios

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("/api/auth/login", {
        email: email,
        password: password
      });
  
      if (response.data && response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        // Navigate to the main/dashboard page 
      } else {
        setErrorMessage("There was an issue with your Login. Please try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("There was an issue with your Login. Please try again.");
    }
  };
  
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
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
            <a href="#!" className="forgot-password">Forgot Password?</a>
          </div>
          const [errorMessage, setErrorMessage] = useState("");
          {/* <p className="error-message">Error message placeholder</p> */}
          <button type="submit">Login</button>
          
          
          <div className="signup-option">
            <span>or</span>
            <a href="/signup">Sign Up</a>
          </div>


        </form>
      </div>
    </div>
  );
}

export default Login;