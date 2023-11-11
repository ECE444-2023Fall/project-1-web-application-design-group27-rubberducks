import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../src/js/pages/SignUp'; 
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('SignUp Component', () => {
  it('renders SignUp component without crashing', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
  });

  it('allows entering a name', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput).toHaveValue('John Doe');
  });

  it('allows entering an email', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    expect(emailInput).toHaveValue('john@example.com');
  });

  it('allows confirming an email', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    const confirmEmailInput = screen.getByPlaceholderText('Confirm Email');
    fireEvent.change(confirmEmailInput, { target: { value: 'john@example.com' } });
    expect(confirmEmailInput).toHaveValue('john@example.com');
  });

  it('allows entering a password', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput).toHaveValue('password123');
  });

  it('allows confirming a password', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    expect(confirmPasswordInput).toHaveValue('password123');
  });

});
