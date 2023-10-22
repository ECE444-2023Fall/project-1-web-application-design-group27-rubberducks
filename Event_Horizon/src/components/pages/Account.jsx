import React from "react";
import "../../App.css";
import { Button } from './../Button'; // Import the Button component

function Account() {
  return (
  <>
    <div>Account</div>
        <Button to="/create_host_profile" buttonStyle="blue-button">
            Create Host Profile
        </Button>
  </>
  );
}

export default Account;