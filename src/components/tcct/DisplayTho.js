import React, { Component } from 'react';

/*=== ALGOLIA InstantSearch ===*/
import { InstantSearch, Configure} from 'react-instantsearch/dom';
import { connectSearchBox, connectHits, connectHighlight,
  connectPagination, connectHitsPerPage } from 'react-instantsearch/connectors'
import algoliaConfig from '../../config/algolia';
/*=== ALGOLIA InstantSearch ===*/

import renderHTML from 'react-render-html';
import { Pagination, FormGroup, FormControl, ListGroup, Row, Col, InputGroup,
  ListGroupItem, Jumbotron, Clearfix, Button, ButtonGroup } from 'react-bootstrap';

import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import BusyLoading from '../BusyLoading';

//const bgUrl_1 = 'https://i.imgur.com/zLOqr2h.jpg';
const Jumbo = ({props}) =>
  <Jumbotron className="text-center" {...props}>
    <h2>Theo cánh chim trời</h2>
    <p>Dành tặng cố nhà thơ <br/>
    <strong>Kim Bồng Miêu</strong><br/>
       Tuyển tập các bài thơ đã đăng...<br/>
    </p>
  </Jumbotron>
const DisplayUnitTho = ({tho}) => {
  const thoStyle = {
    container: {
      border: 'solid 1px',
      borderColor: 'lightgrey',
    },
    content: (tho.imgUrl) ? {
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

  return (
    <div style={thoStyle.container} className="container-fluid">
      <div style={thoStyle.content}>
        {renderHTML(tho.content)}
      </div>
    </div>
  )

};

const ConnectedSearchBox = connectSearchBox(({currentRefinement, refine}) => (
  <FormGroup>
    <InputGroup>
      <InputGroup.Addon><FontAwesome name="search" /></InputGroup.Addon>
      <FormControl type="text" value={currentRefinement}
        onChange={(e) => refine(e.target.value)} placeholder="Tìm theo tên bài hoặc nội dung"/>
      <InputGroup.Addon><FontAwesome name="times-circle" onClick={() => refine('')}/></InputGroup.Addon>
    </InputGroup>
  </FormGroup>
));
const ConnectedHitsPerPage = connectHitsPerPage(({refine, currentRefinement, ...props}) => {
  return (
    <ConnectedPagination />
  )
});
const ConnectedPagination = connectPagination( ({ refine, currentRefinement, nbPages, ...props }) => {
  //(selectPage) ? refine(selectPage) : false;
  return (
    <Pagination
      prev next ellipsis maxButtons={6}
      items={nbPages}
      activePage={currentRefinement}
      onSelect={(eventKey) => {refine(eventKey)}}
    />
  )
});
const ConnectedHighlight = connectHighlight(
  ({ highlight, attributeName, hit, highlightProperty }) => {
    const parseHit = highlight({
      attributeName,
      hit,
      highlightProperty: '_highlightResult'
    });
    const highlightedHits = parseHit.map((part, index) => {
      if (part.isHighlighted) return <mark key={`hl_${index}`}>{part.value}</mark>;
      return part.value;
    });
    return <span>{highlightedHits}</span>;
});

const IndexMenu = (perPageItems, hitsList) => (
  <div>
    <ConnectedSearchBox />
    <ListGroup>{ hitsList }</ListGroup>
    <ConnectedHitsPerPage defaultRefinement={perPageItems}
      items={[{value: 1, label: 'title'}, {value: 2, label: 'content'}]} />
  </div>
)

class CustomizedHits extends Component {
  constructor(props){
    super(props);
    this.state = {selectID: 0,  xsMenuShow: false};
    // this.handleNavigation = this.handleNavigation.bind(this);
    // this.getRandom = this.getRandom.bind(this);
  }

  render(){
    const {hits} = this.props;
    const {selectID, xsMenuShow} = this.state;
    const hitsList = hits.map((hit, selectID) =>
      <ListGroupItem
        active={selectID === this.state.selectID}
        key={hit.objectID}
        onClick={() => this.setState({selectID, xsMenuShow: false})}
      >
      {`${hit.index}. `} <ConnectedHighlight attributeName="title" hit={hit} />
      </ListGroupItem>
    );



    // const IndexMenu = (perPageItems) => (
    //   <div>
    //     <ConnectedSearchBox />
    //     <ListGroup>{ hitsList }</ListGroup>
    //     <ConnectedHitsPerPage defaultRefinement={perPageItems}
    //       items={[{value: 1, label: 'title'}, {value: 2, label: 'content'}]} />
    //   </div>
    // )

    // const IndexMenu = (xsInvisible) =>
    //   <Col xsHidden={xsInvisible} md={4} mdOffset={1} sm={5}>
    //     <ConnectedSearchBox />
    //     <ListGroup>{ hitsList }</ListGroup>
    //     {(xsInvisible) ?
    //       <ConnectedHitsPerPage defaultRefinement={12} items={[{value: 1, label: 'title'}, {value: 2, label: 'content'}]}/> :
    //       <ConnectedHitsPerPage defaultRefinement={1} items={[{value: 1, label: 'title'}, {value: 2, label: 'content'}]}/>
    //     }
    //
    //   </Col>

    return (hits.length) ?
      <div>
        <Row>
          <MediaQuery minDeviceWidth={768}>
            <div>
            {/* <Col xsHidden md={4} mdOffset={1} sm={5}> */}
              {IndexMenu(12, hitsList)}
            {/* </Col> */}
            <Clearfix visibleXsBlock/>
            <Col xsHidden md={6} sm={7}>
              {(hits[selectID]) ? <DisplayUnitTho tho={hits[selectID]} /> : ''}
            </Col>
          </div>
          </MediaQuery>
          <MediaQuery maxDeviceWidth={768}>
            <div>
            {/* <Col xs={12} smHidden mdHidden lgHidden> */}
                {IndexMenu(1, hitsList)}
              {(xsMenuShow) ?
                <div></div> :
                <ButtonGroup>
                  {/* <Button bsStyle='default' onClick={() => this.handleNavigation('left')}>
                    <FontAwesome name="chevron-circle-left" /></Button> */}
                  <Button style={{marginBottom: '10px'}} onClick={() => this.setState({xsMenuShow: true})}>
                      <FontAwesome name="search" /> Mục lục</Button>
                  {/* <Button bsStyle='default' onClick={this.getRandom} disabled={!this.props.getRandom}>
                    <FontAwesome name="random" /></Button> */}
                  {/* <Button bsStyle='default' onClick={() => this.handleNavigation('right')}>
                      <FontAwesome name="chevron-circle-right" /></Button> */}
                </ButtonGroup>
              }
              {(!xsMenuShow && hits[selectID]) ? <DisplayUnitTho tho={hits[selectID]} />: ''}
            {/* </Col> */}
          </div>
          </MediaQuery>
        </Row>
      </div> :
      <BusyLoading />
  }
}
const ConnectedHits = connectHits(({hits, ...props}) => <CustomizedHits hits = {hits} {...props}/>);

const DisplayTho = () => (
  <div className="container">
    <Jumbo />
    <InstantSearch {...algoliaConfig} >
        {/* <Configure hitsPerPage={12}/> */}
        {/* <ConnectedSearchBox /> */}
        {/* <ConnectedPagination /> */}
        <ConnectedHits />
    </InstantSearch>
  </div>
);

export default DisplayTho;
