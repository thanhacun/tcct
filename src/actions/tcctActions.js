import axios from 'axios';

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
    payload: axios.post(`/api/tcct/tho/${thoIndex}/comment`, {postedComment, commentAction})
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
