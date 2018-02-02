import { applyMiddleware, createStore } from 'redux';
import createHistory from 'history/createBrowserHistory';
import logger from 'redux-logger';

import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { routerMiddleware } from 'react-router-redux';

import syncUserMiddleware from './utils/syncUser';
import reducer from './reducers/index';
import { init } from './websocket';

export let history = createHistory();

const middleware = (process.env.NODE_ENV !== 'production' && logger) ?
  applyMiddleware(syncUserMiddleware, routerMiddleware(history), promise(), thunk, logger):
  applyMiddleware(syncUserMiddleware, routerMiddleware(history), promise(), thunk)

const store = createStore(reducer, middleware);
init(store);

export default store;
