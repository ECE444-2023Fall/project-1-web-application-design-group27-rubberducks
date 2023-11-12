// import React from 'react';
// import { render } from '@testing-library/react';
// import { MemoryRouter } from 'react-router-dom';
// import  {
//   Host_profile,
//   Host_upcoming,
//   Host_previous,
//   Host_edit,
// } from '../src/js/pages/Host_Profile';

// jest.mock('../src/js/useGetHostInfo', () => ({
//   useGetHostInfo: () => ({
//     hostInfo: { hid: '1', name: 'Host Name', email: 'host@example.com', bio: 'Host Bio' },
//     ownerLoggedIn: true,
//     loading: false,
//   }),
// }));

// describe('Host_Profile Components', () => {
//   describe('Host_profile Component', () => {
//     it('renders Host_profile component without crashing', () => {
//       render(
//         <MemoryRouter>
//           <Host_profile />
//         </MemoryRouter>
//       );
//     });
//   });

//   describe('Host_upcoming Component', () => {
//     it('renders Host_upcoming component without crashing', () => {
//       render(
//         <MemoryRouter>
//           <Host_upcoming />
//         </MemoryRouter>
//       );
//     });
//   });

// //   describe('Host_previous Component', () => {
// //     it('renders Host_previous component without crashing', () => {
// //       render(
// //         <MemoryRouter>
// //           <Host_previous />
// //         </MemoryRouter>
// //       );
// //     });
// //   });

//   describe('Host_edit Component', () => {
//     it('renders Host_edit component without crashing', () => {
//       render(
//         <MemoryRouter>
//           <Host_edit />
//         </MemoryRouter>
//       );
//     });
//   });
// });
