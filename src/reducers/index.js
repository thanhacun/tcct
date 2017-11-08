/* Reducers are just funtions */
import { routerReducer } from 'react-router-redux';
import user from './userReducer';
import tcct from './tcctReducer'

export default (state={}, action) => {
  return {
    user: user(state.user, action),
    tcct: tcct(state.tcct, action, state.user),
    router: routerReducer(state.router, action),
  };
};
