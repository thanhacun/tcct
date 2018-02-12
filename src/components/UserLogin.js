import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push, goBack } from 'react-router-redux';

import SocialButton from './SocialButton';

import { Jumbotron, Form, FormGroup, ControlLabel, FormControl,
  Button, Alert } from 'react-bootstrap';
import { localLogin, getUserInfo, socialLogin } from '../actions/userActions';
import FontAwesome from '@fortawesome/react-fontawesome';

//TODO: understand clearly dummy and smart components

class UserLogin extends Component {
  constructor(){
    super();
    this.state ={int_email: '', int_password: '', redirectTo: null};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loginFailure  = this.loginFailure.bind(this);
  }

  componentDidMount(){
    this.props.getUserInfo();
  }

  componentDidUpdate(){
    //redirect to profile if loggedin
    if (this.props.userEmail) {
      // [X] TODO: using react-router goBack here
      // this.props.goTo('/profile');
      this.props.goBack();
    }
  }

  loginFailure(response){
    //TODO: handle login failure
    console.log(response);
  }

  handleChange(e, type){
    this.setState({[type]: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.localLogin(this.state.int_email, this.state.int_password);
    this.setState({int_email: '', int_password: ''});
  }

  render(){
    document.title = `=== LOGIN ===`;
    return (
      <div className="container">
        <Jumbotron className="text-center">
          <h2><FontAwesome icon={`sign-in-alt`}/> Login or Register with:</h2>
          <SocialButton provider="facebook"
            onLoginSuccess={(response) => this.props.socialLogin(response)}
            onLoginFailure={(response) => this.loginFailure(response)}
            className="btn btn-primary"><FontAwesome icon={[`fab`, `facebook`]}/> Facebook
          </SocialButton>
          <SocialButton provider="google"
            onLoginSuccess={(response) => this.props.socialLogin(response)}
            onLoginFailure={(response) => this.loginFailure(response)}
            className="btn btn-danger" ><FontAwesome icon={[`fab`, `google-plus`]} /> Google
          </SocialButton>

        </Jumbotron>

        <h2> Local Login </h2>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>Email</ControlLabel>
            <FormControl type="email" value={this.state.int_email} onChange={(e) => this.handleChange(e, 'int_email')}/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl type="password" value={this.state.int_password} onChange={(e) => this.handleChange(e, 'int_password')} />
          </FormGroup>
          <Button type="submit" bsStyle="warning">Login</Button>
        </Form>
        <hr />
        {/* Show warning */}
        {(this.props.error) ?
          <Alert bsStyle="danger">
            <h4>Warning!</h4>
            <p>{this.props.error}</p>
          </Alert> : ""}
        <p>Need an account? <a href="" onClick={() => this.props.goTo("/signup")}>Signup</a></p>
      </div>
    );
  }
}

const mapStateToProps = store => store.user;

const mapDispatchToProps = dispatch => {
  return {
    localLogin: (email, password) => dispatch(localLogin(email, password)),
    goTo: (path) => dispatch(push(path)),
    goBack: () => dispatch(goBack()),
    getUserInfo: () => dispatch(getUserInfo()),
    socialLogin: (socialResponse) => dispatch(socialLogin(socialResponse))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserLogin);
