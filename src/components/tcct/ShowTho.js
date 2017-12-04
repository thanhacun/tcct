import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {selectHit, getTho, pathToIndex, modifyTho} from '../../actions/tcctActions';
import IndexTho from './IndexTho';

// Container
const ShowTho = props => {
  const { ...indexProps } = props.thoIndex;
  const { ...indexActions } = props;
  return (
    <div>
      <IndexTho { ...indexProps } { ...indexActions }/>
    </div>
  );
};

const mapStateToProps = store => store.tcct;
const mapDispatchToProps = dispatch => ({
  getTho: () => dispatch(getTho()),
  pathToIndex: (selectedIndex) => dispatch(pathToIndex(selectedIndex)),
  selectHit: (hit) => {
    dispatch(selectHit(hit));
    dispatch(push(`${hit.index}`));
  },
  modifyTho: (modifiedTho, modifyAction) => dispatch(modifyTho(modifiedTho, modifyAction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowTho);
