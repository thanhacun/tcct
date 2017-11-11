import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import { connect } from 'react-redux';
import { branch } from 'recompose';
import { getTho } from '../../actions/tcctActions';
import ThoIndex from './ThoIndex';
import BusyLoading from '../BusyLoading';

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
    this.state = {selectedID: 0};
  }

  componentDidMount(){
    this.props.getTho();
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

    if (this.props.busy) {
      return (
        // TODO better way to handle busy
        <BusyLoading />
      )
    } else {
      // NOTE: why thos[rndNumber] is not available here
      const { tho } = this.props;
      const ThoList = tho.map((eachTho) => {
        return <EachThoDisplay eachTho={eachTho} />
      });

      return (
        <div className="container">
          <Jumbo />
          <Grid>
            <Row className="show-grid">
              <Col xsHidden smHidden md={4} mdOffset={2}>
                <ThoIndex
                  tho={this.props.tho} selectedID={this.state.selectedID}
                  indexOnClick={ id => this.setState({selectedID: id}) }
                  getRandom = { randomID => this.setState({selectedID: randomID}) }
                  handleNavigation = { navigatedId => this.setState({selectedID: navigatedId}) }
                />
                {/* <Toolbar /> */}
              </Col>
              <Col xs={12} sm={4} clearFix>
                {/* TODO: use HOC */}
                {/* <EachThoDisplay eachTho={tho[this.state.selectedID]}/> */}
                {ThoList[this.state.selectedID]}
              </Col>
            </Row>
            <Row><Col mdHidden smHidden xs={12}>
              <Button onClick={() => console.log('Show index')}><FontAwesome name="search" /> Mục lục</Button>
            </Col></Row>
          </Grid>
        </div>
      );

    }
  }
}

const mapStateToProps = store => store.tcct;
const mapDispatchToProps = dispatch => ({
  getTho: () => dispatch(getTho())
});

//const ThoDisplayWithBusy = branch(({props}) => true, BusyLoading())(ThoDisplay);
export default connect(mapStateToProps, mapDispatchToProps)(ThoDisplay);
