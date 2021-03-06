import Auth from '../utils/Auth';

const userInitialState = {
  userEmail: null,
  busy: false,
  error: null,
  local: {},
  facebook: {},
  google: {},
  role: {admin: false, user: false},
  justSignup: false,
  allUsers: [],
  thos: []
};
const providers = ['local', 'facebook', 'google'];
let [userData, userEmail] = [null, {}, null]

const cleanData = (rawData) => {
  // helper function return cleaned user data (without _id and __v)
  return providers.reduce((accResult, provider) => {
    if (provider in rawData) {
      accResult[provider] = rawData[provider];
    } else {
      accResult[provider] = {};
    }
    return {...accResult, role: rawData.role, _id: rawData._id, profile: rawData.profile,
      allUsers: rawData.allUsers || []};
  }, {});
}

const user = function(state=userInitialState, action){
  // clean userData and get userEmail
  if (action.payload && action.payload.data) {
    userData = cleanData(action.payload.data);
    userEmail = providers.reduce((accResult, provider) => {
      if (userData.hasOwnProperty(provider) && userData[provider].email) {
        accResult =  userData[provider].email;
      }
      return accResult;
    }, null);
  }

  switch (action.type) {

    // ==========================================
    // ALL PENDING ACTIONS RETURN THE SAME OBJECT
    // ==========================================
    case 'GET_USER_INFO_PENDING':
    case 'LOCAL_SIGNUP_PENDING':
    case 'LOGIN_PENDING':
    case 'SOCIAL_LOGIN_PENDING':
    case 'SOCIAL_SIGNUP_PENDING':
    case 'SOCIAL_CONNECT_PENDING':
    case 'GET_ALL_USERS_INFO_PENDING':
    case 'GET_ALL_THOS_PENDING':
      return { ...state, busy: true };

    // ========================================
    // ALL REJECTED ACTIONS HAVE SAME BEHAVIOR
    // exploit fall through
    // ========================================
    case 'GET_USER_INFO_REJECTED':
    case 'GET_ALL_USERS_INFO_REJECTED':
    case 'LOGIN_REJECTED':
      Auth.deauthenticateUser();
      // eslint-disable-next-line
    case 'SOCIAL_SIGNUP_REJECTED':
    case 'LOCAL_SIGNUP_REJECTED':
      return { ...state, busy: false, error: action.payload.response.data.error };

    // =================================
    // LOGIN FULFILLED ACTIONS
    // =================================
    case 'LOGIN_FULFILLED':
    case 'SOCIAL_LOGIN_FULFILLED':
      Auth.authenticateUser(action.payload.data.token);
      // eslint-disable-next-line
    case 'GET_USER_INFO_FULFILLED':
    case 'GET_ALL_USERS_INFO_FULFILLED':
      return { ...state, busy: false, justSignup: false, ...userData, userEmail };
      // return { ...state, busy: false, ...userData, allUsers: action.payload.data}

    // ========================
    // SIGNUP FULFILLED ACTIONS
    // ========================
    case 'LOCAL_SIGNUP_FULFILLED':
      Auth.authenticateUser(action.payload.data.token);
    case 'SOCIAL_SIGNUP_FULFILLED':
    case 'SOCIAL_CONNECT_FULFILLED':
    case 'SOCIAL_UNLINK_FULFILLED':
      return { ...state, busy: false, ...userData, justSignup: true };

    // =============
    // OTHER ACTIONS
    // =============
    case 'GET_ALL_THOS_FULFILLED':
      return { ...state, busy: false, thos: action.payload.data}
    case 'LOGOUT':
      Auth.deauthenticateUser();
      return { ...userInitialState }

    default:
      return state;
  }
};

export default user;
