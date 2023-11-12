import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateHostProfile from '../src/js/pages/Create_Host_Profile'; 
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('CreateHostProfile Component', () => {
  it('renders CreateHostProfile component without crashing', () => {
    render(
      <MemoryRouter>
        <CreateHostProfile />
      </MemoryRouter>
    );
  });

  it('allows entering a club name', () => {
    render(
      <MemoryRouter>
        <CreateHostProfile />
      </MemoryRouter>
    );
    const clubNameInput = screen.getByPlaceholderText('Club Name');
    fireEvent.change(clubNameInput, { target: { value: 'Chess Club' } });
    expect(clubNameInput).toHaveValue('Chess Club');
  });

  it('allows entering an email', () => {
    render(
      <MemoryRouter>
        <CreateHostProfile />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'chessclub@example.com' } });
    expect(emailInput).toHaveValue('chessclub@example.com');
  });

  it('allows entering a bio', () => {
    render(
      <MemoryRouter>
        <CreateHostProfile />
      </MemoryRouter>
    );
    const bioInput = screen.getByLabelText('Bio:');
    fireEvent.change(bioInput, { target: { value: 'Chess club bio' } });
    expect(bioInput).toHaveValue('Chess club bio');
  });

});
