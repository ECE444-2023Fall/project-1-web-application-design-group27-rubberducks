import React from 'react';
import { render, waitFor, screen, act } from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom';
import EditProfilePic from '../src/js/pages/user_profile/Edit_Profile_Pic'; 
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

describe('Event Details Component', () => {
    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        // Mock global fetch
        global.fetch = jest.fn();
        localStorage.setItem('user', JSON.stringify({ id: '24' }));
    
        // Mock fetch responses
        global.fetch
          .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({"uid": 24,
          "name": "Rubberduck",
          "email": "ruoyi.xie@mail.utoronto.ca",
          "password": "pass",
          "events": [
            30,
            37,
            32,
            35,
            34,
            29,
            33
          ],
          "fav_events": [
            16,
            19,
            18,
            22,
            23,
            20
          ],
          "orgs": [
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            31
          ],
          "msgids": [
            1
          ],
          "profile_pic": 1 }) }); // Call for user
      });

      it('loads and displays edit profile picture page', async () => {
        await act(async () => {
        render(
          <MemoryRouter>
            <EditProfilePic />
          </MemoryRouter>
        );
    });
      await waitFor(() => {
        //check user side bar displayed correct information
        expect(screen.getByText("Rubberduck")).toBeInTheDocument();
        expect(screen.getByText("ruoyi.xie@mail.utoronto.ca")).toBeInTheDocument();
        const imageElements = screen.getAllByRole('img');
        expect(imageElements).toHaveLength(14); //13 profile images and 1 in the user sidebar
      });
    });

    afterEach(() => {
        localStorage.clear();
      });
    

});
