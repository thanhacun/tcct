import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import renderHTML from 'react-render-html';

import { getTho } from '../../actions/tcctActions';

const ThoToPrint = (props) => {
  const selectedIndex = Number(props.match.params.index);
  const tho = props.tho.filter(eachTho => eachTho.index === selectedIndex)[0];
  const thoStyle = {
    container: {
      border: 'solid 1px',
      borderColor: 'lightgrey',
    },
    content: (tho && tho.imgUrl) ? {
      padding: '5px',
      backgroundImage: `url(${tho.imgUrl})`,
      backgroundSize: 'cover',
      fontWeight: 'bold',
      minHeight: '500px'
    } : {
      padding: '5px',
      minHeight: '500px'
    }
  };
  return (tho) ?
    <div style={thoStyle.container} className="container">
      <div style={thoStyle.content}>
        {renderHTML(tho.content)}
      </div>
    </div> :
    <div></div>
};

const mapStateToProps = store => store.tcct;
const mapDispatchToProps = dispatch => ({
  getTho: () => dispatch(getTho())
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount(){
      this.props.getTho();
    }
  })
)(ThoToPrint);
