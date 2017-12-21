import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {selectHit, getTho, modifyTho, hitsToStore} from '../../actions/tcctActions';
import IndexTho from './IndexTho';

// Container
const ShowTho = props => {
  const { pageTitle, ...indexProps } = props.thoIndex;
  const { ...indexActions } = props;
  return (
    <div>
      <IndexTho { ...indexProps } { ...indexActions }/>
    </div>
  )
};

const mapStateToProps = store => store.tcct;
const mapDispatchToProps = dispatch => ({
  getTho,
  selectHit: (hit) => {
    dispatch(selectHit(hit));
    dispatch(push(`${hit.index}`));
  },
  modifyTho: (modifiedTho, modifyAction) => dispatch(modifyTho(modifiedTho, modifyAction)),
  hitsToStore: (hits) => dispatch(hitsToStore(hits))
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowTho);
