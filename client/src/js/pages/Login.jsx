import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/pages/Login.css";
import "../../css/components/Button.css";
import Navbar from "../components/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const submitLoginForm = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
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
          throw new Error("Login failed. Please check your credentials.");
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user.email); // accessing stored user email
        console.log(user.id); // accessing stored user id

        setEmail("");
        setPassword("");
        setLoginSuccess(true);
        setErrorMessage("");

        navigate("/");
        window.dispatchEvent(new Event("login-success"));
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <h2>Welcome Back!</h2>
          <form onSubmit={submitLoginForm}>
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
                {showPassword ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </span>
            </div>
            <div className="additional-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember me
              </label>
              <a href="#!" className="forgot-password">
                Forgot Password?
              </a>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {loginSuccess && (
              <p className="success-message" style={{ textAlign: "center" }}>
                Login successful!
              </p>
            )}
            <button type="submit" className="btn--login">
              Login
            </button>
            <div className="signup-option">
              <span>or</span>
              <a href="/signup">Sign Up</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
