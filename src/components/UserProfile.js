import React, { Component } from 'react';
import { connect } from 'react-redux';

import { push } from 'react-router-redux';
import { socialConnect, socialUnlink, logout } from '../actions/userActions';

import SocialButton from './SocialButton';
import { Col, Row, Well } from 'react-bootstrap';

const SocialUserInfo = ({provider, bsStyle, ...props}) =>
  {
    const {id, token, email, name} = props;
    return (
      <Well>
        <h3 className={`text-${bsStyle}`}><span className={`fa fa-${provider}`}></span>{` ${provider}`}</h3>
        {(token)
          ? <p>
            <strong>id</strong>: {id} <br/>
            <strong>token</strong>: {token.split('').slice(0, 12).join('') + '...'} <br/>
            <strong>email</strong>: {email} <br/>
            <strong>name</strong>: {name} <br/>

            <SocialButton provider={provider}
              onLoginSuccess={(response) => props.socialUnlink(response)}
              //onLoginFailure
              className="btn btn-danger"><span className={`fa fa-${provider}`}></span> Unlink
            </SocialButton>
          </p>
          : <SocialButton provider={provider}
            onLoginSuccess={(response, local_email) => props.socialConnect(response, props.local.email)}
            // onLoginFailure={handleSocialLoginFailer}
            className={`btn btn-${bsStyle}`}><span className={`fa fa-${provider}`}></span> Connect
          </SocialButton> }
        </Well>
    )
}

class UserProfile extends Component {
  componentDidUpdate(){
    //redirect to home if logout
    if (!this.props.userEmail) {
      this.props.goTo('/');
    }
  }
  render(){
    return(
      <div className="container">
        <div className="page-header text-center">
          <h1><span className="fa fa-anchor"></span> User Profile</h1>
          <a onClick={this.props.logout} className="btn btn-default btn-sm">Logout</a>
        </div>
        <Row>

          {/* LOCAL INFORMATION */}
          <Col sm={6}>
            <Well>
              <h3><span className="fa fa-user"></span> Local</h3>
              {this.props.local.email &&
                <p>
                  <strong>email</strong>: {this.props.local.email} <br/>
                  <strong>password</strong>: {this.props.local.password.split('').slice(0,12).join('') + '...'}

                  {/* <a href="" className="btn btn-default" disabled>Unlink</a> */}
                </p>
              }
              {/* {(this.props.local.email) ?
                <p>
                  <strong>email</strong>: {this.props.local.email} <br/>
                  <strong>password</strong>: {this.props.local.password.split('').slice(0,12).join('') + '...'}

                  <a href="" className="btn btn-default" disabled>Unlink</a>
                </p> :
                <a onClick={() => this.props.goTo('/connect/local')} className="btn btn-default" disabled>Connect Local</a>} */}
            </Well>
          </Col>

          {/* FACEBOOK INFORMATION */}
          <Col sm={6}>
            <SocialUserInfo provider="facebook" {...this.props.socialUnlink}
              {...this.props.facebook} {...this.props.local.email} bsStyle="primary"/>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <SocialUserInfo provider="google" {...this.props.socialUnlink}
              {...this.props.google} {...this.props.local.email} bsStyle="danger"/>
          </Col>
        </Row>
      </div>
    );
  }
};

const mapStateToProps = store => store.user;

const mapDispatchToProps = dispatch => {
  return {
    goTo: (path) => dispatch(push(path)),
    socialConnect: (socialResponse, local_email) => dispatch(socialConnect(socialResponse, local_email)),
    socialUnlink: (socialResponse) => dispatch(socialUnlink(socialResponse)),
    logout: () => dispatch(logout())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
