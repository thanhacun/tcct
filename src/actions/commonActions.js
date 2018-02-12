import { push, goBack } from 'react-router-redux';

export function goTo (dispatch, path){
  return dispatch(push(path))
}

export function back(dispatch) {
  return dispatch(goBack());
}
