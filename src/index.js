import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Redirect } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import registerServiceWorker from './registerServiceWorker';
import Menu from './components/Menu';

import store, { history } from './store';
import tcctRoutes from './data/tcct';

/* === LOAD fontawesome === */
import './components/fontawesomeLoading.js';
/* === LOAD fontawesome === */

const app = document.getElementById('root');
// [] TODO: numbers of tho from a prop
ReactDOM.render(
<Provider store={store}>
  <ConnectedRouter history={history}>
    <div>
      <Menu />
      <Route exact path="/" key={`tcct_root`} render={() => <Redirect to="/tcct/xemtho/random" />} />
      <Route path={`/tcct/xemtho/random`} key={`tcct_random`} render={
        () => <Redirect to={`/tcct/xemtho/${store.getState().tcct.thoIndex.selectedIndex}`}/>}/>
      {tcctRoutes}
    </div>
  </ConnectedRouter>
</Provider>, app);

// [X] TODO: only deploy registerServiceWorker in production mode
// [] TODO: and only when having https
if (process.env.NODE_ENV === 'production' && registerServiceWorker) {
  registerServiceWorker();
}
