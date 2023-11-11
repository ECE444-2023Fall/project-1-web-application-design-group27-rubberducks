import React from "react";
import Navbar from "../components/Navbar";
import "../../css/ResourceError.css";

function ResourceError() {
  return (
    <>
      <Navbar />
      <div className="error-container">
        <h1>404</h1>
        <p>Resource not found</p>
      </div>
    </>
  );
}

export default ResourceError;
