import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { MenuItem } from 'react-bootstrap';
import { Route } from 'react-router';

import ThoEdit from '../components/tcct/ThoEdit';
import ThoDisplay from '../components/tcct/ThoDisplay';
import UserSignup from '../components/UserSignup';
import UserLogin from '../components/UserLogin';
import UserProfile from '../components/UserProfile';
import UserConnect from '../components/UserConnect';
import DisplayTho from '../components/tcct/DisplayTho';

const tcctLinks = [
  {
    "id": 0,
    "path": "/tcct/xemtho",
    "des": "Xem thơ",
    "component": DisplayTho,
    "menu": true
  },
  {
    "id": 1,
    "path": "/tcct/suatho",
    "des": "Thêm/Sửa thơ",
    "component": ThoEdit,
    "menu": true
  },
  {
    "id": 7,
    "path": "/tcct/oldtho",
    "des": "Xem thơ",
    "component": ThoDisplay,
    "menu": false
  },
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
  }
];

const sortedMenu = tcctLinks.sort((link1, link2) => link1.id > link2.id);
const tcctMenuItems = sortedMenu.map((item, key) => {
  if (item.menu) {
    return (
      <LinkContainer to={item.path} key={`tcct_${item.id}`}>
        <MenuItem key={`key_${key}`} eventKey={`${key}.${item.id}`}>{item.des}</MenuItem>
      </LinkContainer>
    )
  } else {
    return null;
  }
});

const tcctRoutes = tcctLinks.map((app) => {
  return (
    <Route path={app.path} component={app.component} key={`tcct_${app.id}`} />
  );
});

export default tcctRoutes;
export { tcctMenuItems };
