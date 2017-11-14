import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { Navbar, Nav, NavItem, NavDropdown, Image } from 'react-bootstrap';

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
          {/* <Navbar.Header>
            <Navbar.Brand><a href="/">KNM-TQD</a></Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header> */}
          <Navbar.Toggle />
          <Nav pullLeft navbar>
            <a href="/"><Image rounded responsive style={{marginLeft: '5px', height: '40px'}}
              src="https://i.imgur.com/K3iH2Bk.png" alt="Kim Bong Mieu"/></a></Nav>
          <Navbar.Collapse>
            <Nav>
              {tcctMenuItems}
              {/* <NavDropdown eventKey={2} title="Chi tiết" id="tcct">
              </NavDropdown> */}
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
