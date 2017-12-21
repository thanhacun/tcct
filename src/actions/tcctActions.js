import axios from 'axios';

export function modifyTho(modifiedTho, modifyAction){
  return {
    type: 'ADD_THO',
    payload: axios.post('/api/tcct/tho', {modifiedTho, modifyAction})
  }
};

export function saveDraftTho(newTho){
  return {
    type: 'SAVE_DRAFT_THO',
    payload: newTho
  }
};

export function getTho(){
  return {
    type: 'GET_THO',
    payload: axios.get('/api/tcct/tho')
  }
};

export function selectHit(hit) {
  return {
    type: 'SELECT_HIT',
    payload: {selectedIndex: hit.index, hit, pageTitle: `KBM - ${hit.title}`}
  }
};

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
