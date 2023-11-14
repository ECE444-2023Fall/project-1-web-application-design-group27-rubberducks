import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import { Get_Profile_Img_Link } from "./Get_Img_Link";

describe('UserSidebar', () => {
  const userProps1 = {
    name: 'Test Name1',
    email: 'test1@gmail.com',
    profile_pic: '2',
  };

  it('renders user sidebar with correct information', () => {
    render(
      <Router>
        <UserSidebar {...userProps1} />
      </Router>
    );

    // Test that the rendered content matches the expected information
    expect(screen.getByText(userProps1.name)).toBeInTheDocument();
    expect(screen.getByText('test1@gmail.com')).toBeInTheDocument();

    //test the correct event image is displayed
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', Get_Profile_Img_Link(2));

    //check if transfer button and edit button appears
    const buttonElement1 = document.getElementsByClassName('edit--button--icon')[0];
    const buttonElement2 = document.getElementsByClassName('edit--button--icon')[1];
    expect(buttonElement1).toBeInTheDocument();
    expect(buttonElement2).toBeInTheDocument();

  });

});
