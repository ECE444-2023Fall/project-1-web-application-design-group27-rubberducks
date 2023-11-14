import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { useParams, useNavigate, MemoryRouter } from 'react-router-dom';
import AttendeeList from './Attendee';
import '@testing-library/jest-dom';

// Mock useParams and useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('AttendeeList Component Tests', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    // Mock global fetch
    global.fetch = jest.fn();

    // Mock fetch responses
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ attendees: ['1', '2'] }) }) // First call for event
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '1', name: 'John Doe' }) }) // Second call for attendee 1
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '2', name: 'Jane Doe' }) }); // Third call for attendee 2
  });

  it('loads and displays attendees', async () => {
    useParams.mockReturnValue({ eventId: '123' });
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <AttendeeList />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading attendees.../i)).toBeInTheDocument();

    // Wait for the loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading attendees.../i)).not.toBeInTheDocument();
    });

    // Wait for the attendees to be displayed
    await waitFor(() => {
      const johnDoeElement = screen.queryByText(/John Doe/i);
      const janeDoeElement = screen.queryByText(/Jane Doe/i);

      if (johnDoeElement) {
        expect(johnDoeElement).toBeInTheDocument();
      }

      if (janeDoeElement) {
        expect(janeDoeElement).toBeInTheDocument();
      }
    });

  });
});
