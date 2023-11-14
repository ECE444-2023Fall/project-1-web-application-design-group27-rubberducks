import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import HostSidebar from './HostSidebar';
import { Get_Img_Link } from './Get_Img_Link';

describe('HostSidebar', () => {
  const hostProps = {
    hid: '1',
    name: 'Chess Club',
    email: 'test1@gmail.com',
    bio: 'Some bio',
    profile_pic: '2',
    ownerLoggedIn: true,
  };

  const hostProps2 = {
    hid: '2',
    name: 'Photography Club',
    email: 'test2@gmail.com',
    bio: 'Some bio2',
    profile_pic: '3',
    ownerLoggedIn: false,
  };


  it('renders logged in host sidebar with correct information', () => {
    render(
      <Router>
        <HostSidebar {...hostProps} />
      </Router>
    );

    // Test that the rendered content matches the expected information
    expect(screen.getByText(hostProps.name)).toBeInTheDocument();
    expect(screen.getByText('test1@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('Some bio')).toBeInTheDocument();

    //test the correct event image is displayed
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', Get_Img_Link(2));
    expect(screen.getByText('Transfer Ownership')).toBeInTheDocument();

    //check if transfer button and edit button appears
    const buttonElement = document.getElementsByClassName('edit--button--icon')[0];
    if (hostProps.ownerLoggedIn) {
      expect(buttonElement).toBeInTheDocument();
      expect(screen.getByText('Transfer Ownership')).toBeInTheDocument();
    } else {
      expect(buttonElement === undefined);
      const transferElement = document.getElementsByClassName('transfer-button btn')[0];
      expect(transferElement === undefined);
    }

  });

  it('renders unlogged in host sidebar with correct information', () => {
    render(
      <Router>
        <HostSidebar {...hostProps2} />
      </Router>
    );

    // Test that the rendered content matches the expected information
    expect(screen.getByText(hostProps2.name)).toBeInTheDocument();
    expect(screen.getByText('test2@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('Some bio2')).toBeInTheDocument();

    //test the correct event image is displayed
    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', Get_Img_Link(3));

    //check if transfer button and edit button appears
    const buttonElement = document.getElementsByClassName('edit--button--icon')[0];
    if (hostProps2.ownerLoggedIn) {
      expect(buttonElement).toBeInTheDocument();
      expect(screen.getByText('Transfer Ownership')).toBeInTheDocument();
    } else {
      expect(buttonElement === undefined);
      const transferElement = document.getElementsByClassName('transfer-button btn')[0];
      expect(transferElement === undefined);
    }

  });

});
