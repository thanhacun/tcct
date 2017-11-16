import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ListGroup, ListGroupItem, ButtonGroup, Button, Pagination } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import BusyLoading from '../BusyLoading';
//import connectAlgolia from './connectAlgolia';

//[X] TODO: handling pages
//[X] TODO: sortting tho
//[X] TODO: handling buttons group here
//[X] TODO: handling instant search

const paginationBar = (WrappedComponent, options) => {
  return class PaginationBar extends Component {
    constructor(props){
      super(props);
      this.state = {itemPerPage: 12, currentPage: 1, activePage: 1};
      this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(eventKey){
      this.setState({activePage: eventKey})
    }

    itemsOnPage(activePage, listThos){
      const itemPerPage = options.itemPerPage;
      const pageItems = listThos.slice(itemPerPage * (activePage - 1), itemPerPage * activePage );
      return pageItems;
    }

    render(){
      const { listThos, ...otherProps } = this.props
      const { activePage } = this.state;
      const onPageThos = this.itemsOnPage(activePage, listThos)
      const pagiStatus = {
        itemPerPage: options.itemPerPage,
        activePage: activePage,
      }

      return (
        <div>
          <WrappedComponent listThos = {onPageThos} {...otherProps} {...pagiStatus}/>
          <Pagination
            prev next ellipsis maxButtons={5}
            items={Math.ceil(listThos.length / options.itemPerPage)}
            activePage={this.state.activePage}
            onSelect={this.handleSelect}
          />
        </div>
      )

    }
  };
}

class ListTho extends Component {
  constructor(props){
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.state={selectedID: 0}
  }

  handleOnClick(selectedID, index){
    this.setState({selectedID}, () => this.props.indexOnClick(selectedID, index));
  }

  render(){
    const {listThos} = this.props;
    const {selectedID} = this.state;
    const activeStyle = {
      fontWeight: 'bold'
    };
    const IndexTho = listThos.map((eachTho, id) =>
      <ListGroupItem key={(eachTho.objectID) ? eachTho.objectID : `thoindex_${id}`}
        disabled={selectedID === id ? true : false}
        style={selectedID === id ? activeStyle: {}}
        onClick={() => this.handleOnClick(id, eachTho.index)}
      > {`${eachTho.index}. ` } {eachTho.title} </ListGroupItem>
    );
    return (
      <ListGroup>{IndexTho}</ListGroup>
    );
  }
}

const ListThoWithPage = paginationBar(ListTho, {
  itemPerPage: 12
});

class ThoIndex extends Component {
  constructor(props){
    super(props);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.getRandom = this.getRandom.bind(this);
  }

  getRandom(){
    //[X] TODO: avoid random same ID as current ID
    while (true){
      const randomID = Math.round(Math.random() * (this.props.tho.length - 1));
      if (randomID !== this.props.selectedID){
        this.props.getRandom(randomID);
        break;
      }
    }
  }

  handleNavigation(actionType, selectedID){
    this.props.handleNavigation(selectedID + (actionType === 'next' ? 1 : -1))
  }

  render(){
    const { selectedID, tho } = this.props;
    //const sortedTho = tho.sort((tho1, tho2) => tho1.index - tho2.index);

    const Toolbar = () => (
      <ButtonGroup>
        <Button bsStyle='default' disabled={(selectedID === 0) ? true : false}
          onClick={() => this.handleNavigation('previous', selectedID)}>
          <FontAwesome name="chevron-circle-left" /></Button>
        <Button bsStyle='default' disabled><FontAwesome name="pencil-square-o" /></Button>
        <Button bsStyle='default' onClick={this.getRandom} disabled={!this.props.getRandom}>
          <FontAwesome name="random" /></Button>
        <Button bsStyle='default' disabled={(selectedID === tho.length - 1) ? true : false}
            onClick={() => this.handleNavigation('next', selectedID)}>
            <FontAwesome name="chevron-circle-right" /></Button>
      </ButtonGroup>

    );
    return (
      (this.props.busy) ?
      <BusyLoading message='Loading index...' /> :
      <div>
        <ListThoWithPage listThos={tho} {...this.props}/>
        <Toolbar />
      </div>
    );
  }
}

ThoIndex.propTypes = {
  tho: PropTypes.array,
  selectedID: PropTypes.number,
  getRandom: PropTypes.func,
  handleNavigation: PropTypes.func,
  indexOnClick: PropTypes.func
}

export default ThoIndex;
