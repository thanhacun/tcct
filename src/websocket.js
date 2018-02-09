// setup websocket listeners at client - using init
// create emit function to broadcast messages
// create redux middleware to handle socket.io emit by intercept actions/reducers
// having emit object of {message, payload}

import io from 'socket.io-client';
import { getThoComments } from './actions/tcctActions';
const socket = io();

export const init = (store) => {
  socket.on('POST_COMMENT', (payload) => {
    // Listen to post_comment event
    // fire action only if the router is the same with payload (thoIndex in this case)
    if (store.getState().router.location.pathname.endsWith(`/xemtho/${payload}`)) {
      store.dispatch(getThoComments(payload))
    }
  });
};

// export default (store) => (next) => (action) => {
//   const result = next(action);
//   if (action.emit) {
//     const { message, payload } = action.emit;
//     // [] TODO: true callback or promise here
//     setTimeout(() => socket.emit(message, payload), 1000);
//   }
//   return result;
// }

export default ({message, payload}) => {
  // console.log(`Broadcast ${message} with data as ${payload}`);
  socket.emit(message, payload);
}
