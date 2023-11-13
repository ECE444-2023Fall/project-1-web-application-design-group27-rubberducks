import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyClubCards from './MyClubCard'; // Update with the correct path
import { MemoryRouter } from 'react-router-dom';

describe('MyClubCards Component', () => {
  it('renders multiple club cards based on provided orgs data', () => {
    const mockOrgs = [
      { hid: 1, profile_pic: 1, name: "Chess Club" },
      { hid: 2, profile_pic: 2, name: "Photography Club" }
    ];

    render(
      <MemoryRouter>
        <MyClubCards orgs={mockOrgs} />
      </MemoryRouter>
    );

    // Check if the correct number of cards are rendered
    const cardItems = screen.getAllByRole('link');
    expect(cardItems.length).toBe(mockOrgs.length);

    // Check if each card has the correct text and path
    mockOrgs.forEach(org => {
        // Check if the club name is in the document
        expect(screen.getByText(org.name)).toBeInTheDocument();
      
        // Use a regular expression to match the link's accessible name
        expect(screen.getByRole('link', { name: new RegExp(org.name, 'i') })).toHaveAttribute('href', `/hosts/${org.hid}`);
      });
      
  });
});
