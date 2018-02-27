import { randomRange } from '../utils/common_tools';
const numberOfTho = 65;

const tcctInitialState = {
  tho: null,
  comments: [],
  busy: false,
  modifiedTho: null,
  refreshHits: false,
  thoIndex: {
    selectedIndex: 1,
    hit: null,
    defaultPerPage: 12,
    perPageItems: [{value: 1}],
    // thoToPrint: null,
    // randomIndex: null,
    currentSearch: "",
    pageTitle: "KBM",
    hits: [],
    maxIndex: null,
    comments: [
      {postedTime: new Date(), username: "thanhacun@yahoo.com", comment: "Bài thơ cảm động quá!"},
      {postedTime: new Date(), username: "helloworld@gmail.com", comment: "Cảm ơn tác giả"}
    ]
  },
};

const tcct = (state=tcctInitialState, action, userData) => {
  const { type, payload } = action;
  switch (type) {
    case 'MODIFY_THO_PENDING':
    case 'POST_COMMENT_PENDING':
      return { ...state, busy: true, refreshHits: false }
    case 'MODIFY_THO_FULFILLED':
      const { modifiedTho: tho, update } = payload.data;
      if (update === 'deleted') { //delete a Tho
        return { ...state, busy: false, tho, refreshHits: true};
      } else {
        if (update === 'updated'){ // update a Tho
          return { ...state, busy: false, tho, refreshHits: true};
        } else { // add a new Tho
          return { ...state, busy: false, tho, refreshHits: true};
        }
      }
    // case 'POST_COMMENT_FULFILLED':
    //   // const { postedComment, update } = payload.data;
    //   if (payload.data.update === 'deleted') {
    //     return { ...state, busy: false}
    //   } else {
    //     return { ...state, busy: false}
    //   }
    case 'MODIFY_THO_REJECTED':
    case 'POST_COMMENT_REJECTED':
      return { ...state, busy: false }
    case 'SAVE_DRAFT_THO':
      return { ...state, draft: payload }
    case 'GET_THO_PENDING':
    case 'GET_THO_COMMENTS_PENDING':
      return { ...state, busy: true }
    case 'GET_THO_FULFILLED':
      return { ...state, busy: false, tho: payload.data}
    case 'GET_THO_COMMENTS_FULFILLED':
    case 'POST_COMMENT_FULFILLED':
      return { ...state, busy: false, comments: payload.data.comments.reverse()}
    case 'GET_THO_REJECTED':
    case 'GET_THO_COMMENTS_REJECTED':
    case 'SELECT_HIT':
      return { ...state, thoIndex: {...state.thoIndex, ...payload}};
    case 'PATH_TO_INDEX':
      return { ...state, thoIndex: {...state.thoIndex, ...payload}};
    case '@@router/LOCATION_CHANGE':
      // [] TODO: when redirect from /, cannot get the redirect link
      const lastPath = payload.pathname.split('/').slice(-1)[0];
      return { ...state, thoIndex: {...state.thoIndex,
        // random only if route is '/' or have string random at last path
        // [X] NOTE: this is not good as have to check path at more than 1 place  - DRY
        selectedIndex: (lastPath === '' || lastPath === 'random') ? randomRange(1, numberOfTho) : Number(lastPath),
      }}
    case 'HITS_TO_STORE':
      return { ...state, thoIndex: {...state.thoIndex, ...payload}}
    default:
      return { ...state, user: userData };
  }
}

export default tcct;
