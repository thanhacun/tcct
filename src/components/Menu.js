import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';

import { tcctMenuItems } from '../data/tcct';
import { getUserInfo } from '../actions/userActions';

class Menu extends Component {
  componentDidMount(){
    this.props.getUserInfo();
  }

  render(){
    return (
      <div className="container">
        <Navbar inverse collapseOnSelect fluid>
          <Navbar.Header>
            <Navbar.Brand><a href="/">Kim Bong Mieu</a></Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/tcct/showtho"><NavItem eventKey={1}>TCCT</NavItem></LinkContainer>
              <NavDropdown eventKey={2} title="Chi tiết" id="tcct">
                {tcctMenuItems}
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              {this.props.userEmail ?
                <LinkContainer to="/profile"><NavItem eventKey={1}>{this.props.userEmail}</NavItem></LinkContainer> :
                <LinkContainer to="/login"><NavItem eventKey={1}>Login</NavItem></LinkContainer>
              }
            </Nav>

          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
};

const mapStateToProps = (store) => {
  return store.user;
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfo: () => dispatch(getUserInfo())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
