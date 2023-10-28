import React, { useState } from "react";
import "../../Login.css";
import axios from "axios";  


function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5173/auth/signup", {
        name: name,
        email: email,
        password: password
      });
  
      if (response.data && response.data.message) {
        console.log(response.data.message);
        // Navigate user to the login page or display a success message
        //  react-router: history.push("/login");
      } else {
        setErrorMessage("There was an issue with your signup. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage("There was an issue with your signup. Please try again.");

    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome!</h2>
        <form onSubmit={handleSubmit}>
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
            {/* <a href="#!" className="forgot-password">Forgot Password?</a> */}
          </div>
          {/* <p className="error-message">Error message placeholder</p> */}
          <button type="submit">Sign Up</button>
          
          
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