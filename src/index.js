import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css'

import registerServiceWorker from './registerServiceWorker';
import Menu from './components/Menu';
import DisplayTho from './components/tcct/DisplayTho';

import store, { history } from './store';
import tcctRoutes from './data/tcct';

const app = document.getElementById('root');
ReactDOM.render(
<Provider store={store}>
  <ConnectedRouter history={history}>
    <div>
      <Menu />
      <Route exact path="/" component={DisplayTho} />
      {tcctRoutes}
    </div>
  </ConnectedRouter>
</Provider>, app);
registerServiceWorker();
