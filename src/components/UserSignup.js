import React, { Component } from 'react';
import { connect } from 'react-redux';

import SocialButton from './SocialButton';

import { Form, FormGroup, ControlLabel, FormControl, Button,
  Alert } from 'react-bootstrap';
import FontAwesome from '@fortawesome/react-fontawesome';

import { localSignup, socialSignup, getUserInfo } from '../actions/userActions';
import { goTo } from '../actions/commonActions';

//TODO: understand clearly dummy and smart components
//TODO: redux-form

class UserSignup extends Component {
  constructor(props){
    super(props);
    this.state ={int_email: '', int_password: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSocialLoginFailer = this.handleSocialLoginFailer.bind(this);
  }

  componentDidMount(){
    this.props.getUserInfo();
  }

  componentDidUpdate(){
    if (this.props.profile && this.props.profile.email) {
      this.props.goTo('/profile');
    }
    if (this.props.justSignup) {
      this.props.goTo('/login');
    }
  }

  handleChange(e, type){
    //ES6 dynamic object key
    this.setState({[type]: e.target.value});
  }

  handleSubmit(e){
    this.props.localSignup(this.state.int_email, this.state.int_password);
    this.setState({int_email: '', int_password: ''});
    e.preventDefault();
  }

  handleSocialLoginFailer(response){
    console.log(response);
  }

  render(){
    document.title = `=== SIGNUP ===`;
    return (
      <div className="container">
        <h1><FontAwesome icon={`user-plus`}/> Local Signup</h1>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <ControlLabel>Email</ControlLabel>
              <FormControl type="email" value={this.state.int_email} onChange={(e) => this.handleChange(e, 'int_email')}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <FormControl type="password" value={this.state.int_password} onChange={(e) => this.handleChange(e, 'int_password')} />
            </FormGroup>
            <Button type="submit" bsStyle="primary">Submit</Button>
          </Form>
        <br />
        <h1><FontAwesome icon={`user-plus`}/>Social Signup</h1>
        <SocialButton provider="facebook" className="btn btn-primary"
          onLoginSuccess={(socialResponse) => this.props.socialSignup(socialResponse)}
          onLoginFailure={(response) => this.handleSocialLoginFailer(response)}>
          <FontAwesome icon={[`fab`, `facebook`]} /> Facebook
        </SocialButton>

        <SocialButton provider="google" className="btn btn-danger"
          onLoginSuccess={(socialResponse) => this.props.socialSignup(socialResponse)}
          onLoginFailure={(response) => this.handleSocialLoginFailer(response)}>
          <FontAwesome icon={[`fab`, `google`]}/> Google
        </SocialButton>
        <hr />
        {this.props.error &&
          <Alert bsStyle="danger">
            <h4>Warning!</h4>
            <p>{this.props.error}</p>
          </Alert>
        }
      </div>
    );
  }
}

const mapStateToProps = store => {
  return store.user
}

const mapDispatchToProps = dispatch => {
  return {
    localSignup: (email, password) => dispatch(localSignup(email, password)),
    socialSignup: (socialResponse) => dispatch(socialSignup(socialResponse)),
    getUserInfo: () => dispatch(getUserInfo()),
    goTo: (path) => goTo(dispatch, path)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSignup);
