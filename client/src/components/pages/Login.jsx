import React, { useState } from "react";
import "../../Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const login = (e) => {
    e.preventDefault();
  
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
          setEmail("");
          setPassword("");
          setErrorMessage("");
        } else {
          setErrorMessage("Login failed. Please check your credentials.");
        }
      })
      .catch((err) => {
        console.log("error:", err);
        setErrorMessage("There was an issue with your login. Please try again.");
      });
  };
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back!</h2>
        <form onSubmit={login}>
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
          <button onClick={login}>Login</button>
          
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
