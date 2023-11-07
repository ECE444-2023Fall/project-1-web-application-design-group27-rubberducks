import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../../css/ResourceError.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <>
        <Navbar />
        <div className="error-container">
          <p>Please Login to Access Resource</p>
          <br />
          <Link to="/login">
            <Button type="primary">Login</Button>
          </Link>
        </div>
      </>
    </>
  );
};

export default NotFound;
