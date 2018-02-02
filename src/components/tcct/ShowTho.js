import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withRouter } from 'react-router-dom';

import {selectHit, getTho, modifyTho, hitsToStore, getThoComments, postThoComment} from '../../actions/tcctActions';
import IndexTho from './IndexTho';

// Container
const ShowTho = props => {
  const { pageTitle, ...indexProps } = props.thoIndex;
  const { ...indexActions } = props;
  return (
    <div>
      <IndexTho { ...indexProps } { ...indexActions } />
    </div>
  )
};

const mapStateToProps = store => store.tcct;
const mapDispatchToProps = dispatch => ({
  getTho: (index) => dispatch(getTho(index)),
  selectHit: (hit) => {
    dispatch(selectHit(hit));
    dispatch(push(`${hit.index}`));
  },
  modifyTho: (modifiedTho, modifyAction) => dispatch(modifyTho(modifiedTho, modifyAction)),
  hitsToStore: (hits) => dispatch(hitsToStore(hits)),
  goTo: (path) => dispatch(push(path)),
  getThoComments: (thoIndex) => dispatch(getThoComments(thoIndex)),
  postThoComment: (thoIndex, postedComment, commentAction) => dispatch(postThoComment(thoIndex, postedComment, commentAction))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShowTho));
