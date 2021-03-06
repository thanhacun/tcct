import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { Navbar, Nav, NavItem } from 'react-bootstrap';

import { TCCTMenu } from '../data/tcct';
import { getUserInfo } from '../actions/userActions';

class Menu extends Component {
  componentDidMount(){
    this.props.getUserInfo();
  }

  render(){
    const logoStyle = {
      height: "50px",
      marginTop: "-15px",
      marginLeft: "-15px"
    }
    return (
      <div className="container">
        <Navbar collapseOnSelect fluid fixedTop>
          <Navbar.Header>
            <Navbar.Brand><a href="/"><img src="https://i.imgur.com/K3iH2Bk.png" style={logoStyle} alt="Kim Bong Mieu"/></a></Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <TCCTMenu role={this.props.role}/>
            <Nav pullRight>
              {this.props.userEmail ?
                <LinkContainer to="/profile"><NavItem eventKey={`profile`}>{this.props.userEmail}</NavItem></LinkContainer> :
                <LinkContainer to="/login"><NavItem eventKey={`login`}>Login</NavItem></LinkContainer>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
};

const mapStateToProps = (store) => store.user;

const mapDispatchToProps = (dispatch) => ({getUserInfo: () => dispatch(getUserInfo())});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
