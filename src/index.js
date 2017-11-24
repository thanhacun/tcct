import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Redirect } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { randomRange } from './utils/common_tools';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css'

import registerServiceWorker from './registerServiceWorker';
import Menu from './components/Menu';
import PrintTho from './components/tcct/PrintTho';
// import DisplayTho from './components/tcct/DisplayTho';

import store, { history } from './store';
import tcctRoutes from './data/tcct';

const app = document.getElementById('root');
// random a number in [1, 65] to show a random tho
// [] TODO: numbers of tho from a prop
ReactDOM.render(
<Provider store={store}>
  <ConnectedRouter history={history}>
    <div>
      <Menu />
      <Route exact path="/" key={`tcct_root`} render={() => (
        <Redirect to={`/tcct/xemtho/${randomRange(1, 65)}`} />
      )} />
      {tcctRoutes}
      <Route exact path="/tcct/print/:index" component={PrintTho} key={`tcct_print`} />
    </div>
  </ConnectedRouter>
</Provider>, app);
registerServiceWorker();
