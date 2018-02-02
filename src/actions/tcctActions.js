import axios from 'axios';
import emit from '../websocket';

const asyncCallWithExtra = async function(asyncCall, extra) {
  // asyncCall, extra: function
  // using async, await pattern to return promise with extra (additional) steps
  // this to make sure payload of an asynccall still return data and can do some
  // other functions
  const apiResult = await asyncCall();
  extra();
  return apiResult;
}

export function modifyTho(modifiedTho, modifyAction){
  return {
    type: 'MODIFY_THO',
    payload: axios.post('/api/tcct/tho', {modifiedTho, modifyAction})
  }
};

export function saveDraftTho(newTho){
  return {
    type: 'SAVE_DRAFT_THO',
    payload: newTho
  }
};

export function getTho(index){
  return {
    type: 'GET_THO',
    payload: axios.get(`/api/tcct/tho/${index}`)
  }
};

export function selectHit(hit) {
  return {
    type: 'SELECT_HIT',
    payload: {selectedIndex: hit.index, hit, pageTitle: `KBM - ${hit.title}`}
  }
};

export function getThoComments(thoIndex) {
  return {
    type: 'GET_THO_COMMENTS',
    payload: axios.get(`/api/tcct/tho/${thoIndex}/comments`)
  }
}

export function postThoComment(thoIndex, postedComment, commentAction) {
  return {
    type: 'POST_COMMENT',
    // payload: axios.post(`/api/tcct/tho/${thoIndex}/comment`, {postedComment, commentAction}),
    payload: asyncCallWithExtra(
      () => axios.post(`/api/tcct/tho/${thoIndex}/comment`, {postedComment, commentAction}),
      () => emit({message: 'POST_COMMENT', payload: thoIndex})
    ),
  }
}

// export function pathToIndex(selectedIndex) {
//   return {
//     type: 'PATH_TO_INDEX',
//     payload: {selectedIndex}
//   }
// }

export function hitsToStore(hits) {
  return {
    type: 'HITS_TO_STORE',
    payload: {hits}
  }
}
