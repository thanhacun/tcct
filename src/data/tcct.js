import React from 'react';
// import { compose, withState, withHandlers} from 'recompose';

import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';
import { Route } from 'react-router';

import UserSignup from '../components/UserSignup';
import UserLogin from '../components/UserLogin';
import UserProfile from '../components/UserProfile';
import UserConnect from '../components/UserConnect';
import ShowTho from '../components/tcct/ShowTho';

const tcctLinks = [
  {
    "id": 0,
    "path": "/tcct/xemtho",
    "subPath": "index",
    "startSubPath": 1,
    "des": "Xem thơ",
    "component": ShowTho,
    "menu": true
  },
  {
    "id": 1,
    "path": "/tcct/suatho",
    "subPath": "index",
    "startSubPath": 0,
    "des": "Thêm/Sửa thơ",
    "component": ShowTho,
    "menu": true
  },
  // {
  //   "id": 2,
  //   "path": "/tcct/suatho/0",
  //   "des": "Thêm thơ",
  //   "component": ShowTho,
  //   "menu": true
  // },
  {
    "id":3,
    "path": "/login",
    "des": "Login",
    "component": UserLogin,
    "menu": false
  },
  {
    "id":4,
    "path": "/signup",
    "des": "Signup",
    "component": UserSignup,
    "menu": false
  },
  {
    "id":5,
    "path": "/profile",
    "des": "Profile",
    "component": UserProfile,
    "menu": false
  },
  {
    "id":6,
    "path": "/connect",
    "des": "User Connect",
    "component": UserConnect,
    "menu": false
  },
];

// const sortedMenu = tcctLinks.sort((link1, link2) => link1.id > link2.id);

// [] TODO: LinkContainer not working well with activeKey and eventKey from Nav and NavItem

// const OldTCCTMenu = () => {
//   return (
//     <Nav activeKey={`/tcct/xemtho`}>
//       {
//         sortedMenu.map((item, key) => {
//           return (item.menu) ?
//             <LinkContainer to={(item.subPath) ? `${item.path}/${item.startSubPath}`: item.path} key={`tcct_${item.id}`}
//             // active={(activeKey===item.path) ? true : false}
//             >
//               <NavItem key={`key_${key}`} eventKey={item.path} >{item.des}</NavItem>
//             </LinkContainer>
//           : null
//         })
//       }
//     </Nav>
//   )
// };

const tcctRoutes = tcctLinks.map((app) => {
  return (
    <Route path={(app.subPath) ? `${app.path}/:${app.subPath}` : app.path}
    component={app.component} key={`tcct_${app.id}`} />
  );
});

const TCCTMenu = ({role}) =>
  <Nav activeKey={'/tcct/xemtho'}>
    <LinkContainer to={'/tcct/xemtho/1'} key={`tcct_0`}>
      <NavItem>{`Xem Thơ`}</NavItem>
    </LinkContainer>
    {(role && role.admin) ?
      <LinkContainer to={'/tcct/suatho/0'} key={`tcct_1`}>
        <NavItem>{`Thêm/Sửa Thơ`}</NavItem>
      </LinkContainer>
      : null}
  </Nav>

export default tcctRoutes;
export { TCCTMenu };
