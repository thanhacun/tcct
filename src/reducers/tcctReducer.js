import { randomRange } from '../utils/common_tools';
const numberOfTho = 65;

const tcctInitialState = {
  tho: [],
  busy: false,
  thoIndex: {
    selectedIndex: 1,
    // selectedID: null,
    hit: null,
    // isShowed: false,
    defaultPerPage: 12,
    perPageItems: [{value: 1}],
    thoToPrint: null,
    randomIndex: null,
    currentSearch: ""
  }};

const tcct = (state=tcctInitialState, action, userData) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_THO_PENDING':
      return { ...state }
    case 'ADD_THO_FULFILLED':
      const { modifiedTho, update } = payload.data;
      if (update === 'deleted') { //delete a Tho
        return { ...state, tho: state.tho.filter(tho => {
          return tho.index !== modifiedTho.index;
        })};
      } else {
        if (update === 'updated'){ // update a Tho
          return { ...state, tho: state.tho.map(tho => {
            return (tho.index !== modifiedTho.index) ? tho : modifiedTho
          })};
        } else { // add a new Tho
          return { ...state, tho: [...state.tho, modifiedTho] };
        }
      }
    case 'ADD_THO_REJECTED':
      return { ...state }
    case 'SAVE_DRAFT_THO':
      return { ...state, draft: payload }

    case 'GET_THO_PENDING':
      return { ...state, busy: true }
    case 'GET_THO_FULFILLED':
      return { ...state, busy: false, tho: payload.data }
    case 'GET_THO_REJECTED':
      return { ...state, busy: false };

    case 'SELECT_HIT':
    case 'PATH_TO_INDEX':
      return { ...state, thoIndex: {...state.thoIndex, ...payload}};
    case '@@router/LOCATION_CHANGE':
      // [] TODO: when redirect from /, cannot get the redirect link
      const lastPath = payload.pathname.split('/').slice(-1)[0];
      return { ...state, thoIndex: {...state.thoIndex,
        // random only if route is '/' or have string random at last path
        // [] NOTE: this is not good as have to check path at more than 1 place  - DRY
        selectedIndex: (lastPath === '' || lastPath === 'random') ? randomRange(1, numberOfTho) : Number(lastPath)
      }}
    default:
      return { ...state, user: userData };
  }
}

export default tcct;
