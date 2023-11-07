import React, { useState } from "react";
import Navbar from "../components/Navbar";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div>
        <h1>404 - Restricted Access</h1>
        <p>Sorry, you have to be logged in to access this page.</p>
      </div>
    </>
  );
};

export default NotFound;
