import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyClubCardItem from './MyClubCardItem'; // Update with the correct path
import { MemoryRouter } from 'react-router-dom';

describe('MyClubCardItem Component', () => {
  it('renders club card with provided data', () => {
    const mockProps = {
      src: "test-image.jpg",
      text: "Test Club",
      path: "/test-path"
    };

    render(
      <MemoryRouter>
        <MyClubCardItem {...mockProps} />
      </MemoryRouter>
    );

    // Check if the image is rendered with the correct src
    const imageElement = screen.getByRole('img', { name: /event image/i });
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockProps.src);

    // Check if the text is rendered
    const textElement = screen.getByText(mockProps.text);
    expect(textElement).toBeInTheDocument();

    // Check if the link is correct
    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', mockProps.path);
  });
});
