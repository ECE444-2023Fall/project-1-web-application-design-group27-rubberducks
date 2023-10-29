import React, { useState } from "react";
import "../../Login.css";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirming password
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [signupSuccess, setSignupSuccess] = useState(false);

    const submitSignUpForm = (e) => {
        e.preventDefault();

        if (email !== confirmEmail) {
            setErrorMessage("Emails do not match.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

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
            console.log(data);
            setName("");
            setEmail("");
            setConfirmEmail("");
            setPassword("");
            setConfirmPassword(""); // Reset confirmed password
            setErrorMessage("");
            setSignupSuccess(true);
            // Maybe navigate to login or dashboard page after successful signup
        })
        .catch((err) => {
            console.log("error:", err);
            setErrorMessage(err.message);
        });
    };

    return (
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
                            {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
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
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {signupSuccess && <p className="success-message" style={{textAlign: 'center'}}>Signup successful!</p>}
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
