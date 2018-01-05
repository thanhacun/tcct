import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Redirect } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';


import registerServiceWorker from './registerServiceWorker';
import Menu from './components/Menu';
// import PrintTho from './components/tcct/PrintTho';

import store, { history } from './store';
import tcctRoutes from './data/tcct';

// === fontawesome 5.x.x ===
import fontawesome from '@fortawesome/fontawesome';
import { faChevronUp, faChevronDown, faTimesCircle, faPrint, faRandom,
  faEdit, faSignInAlt, faUserPlus, faTimes, faTrashAlt, faSyncAlt, faSave } from '@fortawesome/fontawesome-free-solid';
  import { faAlgolia, faFacebook, faGooglePlus, faGoogle } from '@fortawesome/fontawesome-free-brands';
fontawesome.library.add(faChevronUp, faChevronDown, faTimesCircle, faPrint, faRandom,
  faEdit, faAlgolia, faSignInAlt, faUserPlus, faTimes, faTrashAlt, faSyncAlt, faSave,
  faFacebook, faGooglePlus, faGoogle);
// === fontawesome 5.x.x ===

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
      {/* <Route exact path="/tcct/print/:index" component={PrintTho} key={`tcct_print`} /> */}
      {tcctRoutes}
    </div>
  </ConnectedRouter>
</Provider>, app);

// Only deploy registerServiceWorker in production mode
if (process.env.NODE_ENV === 'production' && registerServiceWorker) {
  registerServiceWorker();
}
