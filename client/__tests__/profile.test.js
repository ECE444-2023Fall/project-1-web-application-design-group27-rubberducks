import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  // Profile_root,
  Profile,
  Profile_upcoming,
  Profile_previous,
  Profile_favourites,
  Profile_edit,
} from '../src/js/pages/Profile';

jest.mock('../src/js/useGetUserInfo', () => ({
  useGetUserInfo: () => ({
    userInfo: { name: 'John Doe', email: 'john@example.com' },
    loading: false,
  }),
}));

describe('Profile Components', () => {
  // Remove the describe block for Profile_root Component
  // describe('Profile_root Component', () => {
  //   it('renders Profile_root component without crashing', () => {
  //     render(
  //       <MemoryRouter>
  //         <Profile_root />
  //       </MemoryRouter>
  //     );

  //     expect(screen.getByText('John Doe')).toBeInTheDocument();
  //     expect(screen.getByText('john@example.com')).toBeInTheDocument();
  //   });
  // });

  describe('Profile Component', () => {
    it('renders Profile component without crashing', () => {
      render(<Profile />);
    });
  });

  describe('Profile_upcoming Component', () => {
    it('renders Profile_upcoming component without crashing', () => {
      render(<Profile_upcoming />);
    });
  });

  describe('Profile_previous Component', () => {
    it('renders Profile_previous component without crashing', () => {
      render(<Profile_previous />);
    });
  });

  describe('Profile_favourites Component', () => {
    it('renders Profile_favourites component without crashing', () => {
      render(<Profile_favourites />);
    });
  });

//   describe('Profile_edit Component', () => {
//     it('renders Profile_edit component without crashing', () => {
//       render(<Profile_edit />);
//     });
//   });
});
