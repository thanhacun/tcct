import axios from 'axios';
import emit from '../websocket';
import Auth from '../utils/Auth';

const apiServer = (process.env.NODE_ENV === 'production') ? '' : '';


// [] NOTE: why cannot use object spread here?
// const headerAuth = {authorization: `bearer ${Auth.getToken()}`};

const asyncCallWithExtra = async function(asyncCall, extra) {
  // asyncCall, extra: functions
  // using async, await pattern to return promise with extra (additional) steps
  // this to make sure payload of an asynccall still return data and can do some
  // other functions: such as emit a socket.io event
  const apiResult = await asyncCall();
  extra();
  return apiResult;
}

export function modifyTho(modifiedTho, modifyAction){
  return {
    type: 'MODIFY_THO',
    payload: axios({
      method: 'POST',
      url: apiServer + '/api/tcct/tho',
      headers: {authorization: `bearer ${Auth.getToken()}`},
      data: {modifiedTho, modifyAction}
    })
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
    payload: axios.get(`${apiServer}/api/tcct/tho/${index}`)
  }
};

export function getAllThos() {
  return {
    type: 'GET_ALL_THOS',
    payload: axios.get(`${apiServer}/api/tcct/allthos`)
  }
}

export function selectHit(hit) {
  return {
    type: 'SELECT_HIT',
    payload: {selectedIndex: hit.index, hit, pageTitle: `KBM - ${hit.title}`}
  }
};

export function getThoComments(thoIndex) {
  return {
    type: 'GET_THO_COMMENTS',
    payload: axios.get(`${apiServer}/api/tcct/tho/${thoIndex}/comments`)
  }
}

export function postThoComment(thoIndex, postedComment, commentAction) {
  return {
    type: 'POST_COMMENT',
    payload: asyncCallWithExtra(
      // NOTE: using axios OPTIONS to send post request with data and headers
      () => axios({
        method: 'POST',
        url: `${apiServer}/api/tcct/tho/${thoIndex}/comment`,
        headers: {authorization: `bearer ${Auth.getToken()}`},
        // headers: { ...headerAuth },
        data: {postedComment, commentAction}
      }),
      () => emit({message: 'POST_COMMENT', payload: thoIndex})
    ),
  }
}

export function hitsToStore(hits) {
  return {
    type: 'HITS_TO_STORE',
    payload: {hits}
  }
}
