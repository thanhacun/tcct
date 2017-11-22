import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import { connect } from 'react-redux';
// import { branch } from 'recompose';
import { getTho } from '../../actions/tcctActions';
import ThoIndex from './ThoIndex';
//import BusyLoading from '../BusyLoading';

import { Jumbotron, Grid, Row, Col, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

const EachThoDisplay = ({eachTho}) => {
  const thoStyle = {
    container: {
      border: 'solid 1px',
      borderColor: 'lightgrey'
    },
    content: (eachTho.imgUrl) ? {
      padding: '5px',
      backgroundImage: `url(${eachTho.imgUrl})`,
      backgroundSize: 'cover',
      fontWeight: 'bold'
    } : {
      padding: '5px'
    }
  };

  return (
    <div key={`list_${eachTho.index}`} style={thoStyle.container}>
      <div style={thoStyle.content}>
        {renderHTML(eachTho.content)}
      </div>
    </div>
  )

};

class ThoDisplay extends Component {
  constructor(props){
    super(props);
    this.handleIndexSelect = this.handleIndexSelect.bind(this);
    this.returnThoByIndex = this.returnThoByIndex.bind(this);
    this.state = {selectedID: 0, selectedIndex: 1};
  }

  componentDidMount(){
    this.props.getTho();
  }

  handleIndexSelect(selectedIndex){
    const selectedID = this.props.tho.reduce((returnID, currentTho, currentID) => {
      return (currentTho.index === selectedIndex) ? currentID : returnID;
    }, 0);
    this.setState({selectedID});
  }

  returnThoByIndex(index){
    const { tho } = this.props;
    return  tho.reduce((returnTho, currentTho) => {
      return (currentTho.index === index) ? currentTho : returnTho
    }, null);
  }

  render(){
    const Jumbo = (props) => {
      return (
          <Jumbotron className="text-center" {...props}>
            <h2>TCCT - Thơ Kim Bồng Miêu</h2>
            <p>Tuyển tập các bài thơ hay của tác giả Kim Bồng Miêu</p>
          </Jumbotron>
      )
    }
    const { tho } = this.props;
    //[] TODO: sort tho at api level
    const sortedTho = tho.sort((tho1, tho2) => tho1.index - tho2.index);
    return (
      <div className="container">
        <Jumbo />
        <Grid>
          <Row className="show-grid">
            <Col xsHidden smHidden md={4} mdOffset={2}>
              <ThoIndex
                tho={sortedTho}
                // indexOnClick={ (selectedID, selectedIndex) => this.handleIndexSelect(selectedIndex) }
                indexOnClick = { (selectedID, selectedIndex) => this.setState({selectedID, selectedIndex})}
                getRandom = { selectedID => this.setState({selectedID}) }
                handleNavigation = { selectedID => this.setState({selectedID}) }
              >

              </ThoIndex>
              {/* <Toolbar /> */}
            </Col>
            <Col xs={12} sm={4}>
              {/* {(sortedTho[this.state.selectedID]) ? <EachThoDisplay eachTho={sortedTho[this.state.selectedID]} /> : ''} */}
              {(this.returnThoByIndex(this.state.selectedIndex)) ?
                <EachThoDisplay eachTho={this.returnThoByIndex(this.state.selectedIndex)} /> :
                <div></div>}

              <Button onClick={() => console.log('Show index')}><FontAwesome name="search" /> Mục lục</Button>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = store => store.tcct;
const mapDispatchToProps = dispatch => ({
  getTho: () => dispatch(getTho())
});

//const ThoDisplayWithBusy = branch(({props}) => props.busy, BusyLoading)(ThoDisplay);
//const ThoDisplayWithBusy = BusyLoading(ThoDisplay);
export default connect(mapStateToProps, mapDispatchToProps)(ThoDisplay);
