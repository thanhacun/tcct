class Auth {
  static authenticateUser(token) {
    // token can be a real token or false value in case of admin user
    sessionStorage.setItem('token', token);
    !token && sessionStorage.setItem('_isAdmin', true);  
  }

  static isUserAuthenticated() {
    return sessionStorage.getItem('token') !== null;
  }

  static deauthenticateUser() {
    sessionStorage.removeItem('token');
  }

  static getToken() {
    return sessionStorage.getItem('token');
  }
}

export default Auth;
