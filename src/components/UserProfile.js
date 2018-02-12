import React, { Component } from 'react';
import { connect } from 'react-redux';

import { push } from 'react-router-redux';
import { socialConnect, socialUnlink, logout } from '../actions/userActions';

import SocialButton from './SocialButton';
import { Col, Row, Well } from 'react-bootstrap';
import FontAwesome from '@fortawesome/react-fontawesome';

const SocialUserInfo = ({provider, bsStyle, ...props}) =>
  {
    const {id, token, email, name} = props;
    return (
      <Well>
        <h3 className={`text-${bsStyle}`}><FontAwesome icon={[`fab`, `${provider}`]}/> {` ${provider}`}</h3>
        {(token)
          ? <p>
            <strong>id</strong>: {id} <br/>
            <strong>token</strong>: {token.split('').slice(0, 12).join('') + '...'} <br/>
            <strong>email</strong>: {email} <br/>
            <strong>name</strong>: {name} <br/>

            <SocialButton provider={provider}
              onLoginSuccess={(response) => props.socialUnlink(response)}
              //onLoginFailure
              className="btn btn-danger"><FontAwesome icon={[`fab`, `${provider}`]}/> Unlink
            </SocialButton>
          </p>
          : <SocialButton provider={provider}
            onLoginSuccess={(response) => props.socialConnect(response, props.localEmail)}
            // onLoginFailure={handleSocialLoginFailer}
            className={`btn btn-${bsStyle}`}><FontAwesome icon={[`fab`, `${provider}`]}/> Connect
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
    document.title = `=== PROFILE ===`;
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
              {this.props.local && this.props.local.email &&
                <p>
                  <strong>email</strong>: {this.props.local.email} <br/>
                  <strong>token</strong>: {this.props.local.password.split('').slice(0,12).join('') + '...'}

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
            <SocialUserInfo provider="facebook" bsStyle="primary"
              socialUnlink={this.props.socialUnlink} {...this.props.facebook}
              localEmail={this.props.local.email} socialConnect={this.props.socialConnect}/>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <SocialUserInfo provider="google" bsStyle="danger"
              socialUnlink={this.props.socialUnlink} {...this.props.google}
              localEmail= {this.props.local.email} socialConnect={this.props.socialConnect}/>
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
