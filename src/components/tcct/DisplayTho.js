import React, { Component } from 'react';

/*=== ALGOLIA InstantSearch ===*/
import { InstantSearch, Configure} from 'react-instantsearch/dom';
import { connectSearchBox, connectHits, connectHighlight,
  connectPagination} from 'react-instantsearch/connectors'
import algoliaConfig from '../../config/algolia';
/*=== ALGOLIA InstantSearch ===*/

import renderHTML from 'react-render-html';
import { Pagination, FormGroup, FormControl, ListGroup, Row, Col,
  ListGroupItem, Jumbotron, Clearfix, Button } from 'react-bootstrap';
import FontAwesome  from 'react-fontawesome';

const Jumbo = ({props}) =>
  <Jumbotron className="text-center" {...props}>
    <h2>Theo cánh chim trời - KIM BỒNG MIÊU</h2>
    <p>Dành tặng cố tác giả Kim Bồng Miêu<br/>
       Tuyển tập các bài thơ đã đăng của tác giả<br/>
    </p>
  </Jumbotron>
const DisplayUnitTho = ({tho}) => {
  const thoStyle = {
    container: {
      border: 'solid 1px',
      borderColor: 'lightgrey'
    },
    content: (tho.imgUrl) ? {
      padding: '5px',
      backgroundImage: `url(${tho.imgUrl})`,
      backgroundSize: 'cover',
      fontWeight: 'bold'
    } : {
      padding: '5px'
    }
  };

  return (
    <div style={thoStyle.container}>
      <div style={thoStyle.content}>
        {renderHTML(tho.content)}
      </div>
    </div>
  )

};

class DisplayTho extends Component {
  render() {
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

    class CustomizedHits extends Component {
      constructor(props){
        super(props);
        this.state = {selectID: 0}
      }

      render(){
        const {hits} = this.props
        const hitsList = hits.map((hit, selectID) =>
          <ListGroupItem
            active={selectID === this.state.selectID}
            key={hit.objectID}
            onClick={() => this.setState({selectID})}
          >
          {`${hit.index}. `} <ConnectedHighlight attributeName="title" hit={hit} />
          </ListGroupItem>
        );
        return (
          <div>
            <Row>
              <Col xsHidden md={4} mdOffset={1}><ConnectedSearchBox /></Col>
              <Clearfix />
            </Row>
            <Row>
              <Col xsHidden md={4} mdOffset={1}>
                <ListGroup>{ hitsList }</ListGroup>
                <ConnectedPagination />
              </Col>
              <Col xs={12} md={5} mdOffset={1}>
                {(hits[this.state.selectID]) ? <DisplayUnitTho tho={hits[this.state.selectID]} />: ''}
              </Col>
              <Col xs={12} mdHidden lgHidden>
                <Button bsStyle="default"><FontAwesome name="bars"/></Button>
              </Col>
              <Clearfix />
            </Row>
          </div>
        );
      }
    }

    const ConnectedHits = connectHits(({hits}) => <CustomizedHits hits = {hits}/>)

    const ConnectedPagination = connectPagination( ({ refine, currentRefinement, nbPages }) => {
      return (
        <Pagination
          prev next ellipsis maxButtons={6}
          items={nbPages}
          activePage={currentRefinement}
          onSelect={(eventKey) => {refine(eventKey)}}
        />
      )
    })

    const CustomizedSearchBox = ({currentRefinment, refine}) => (
      <FormGroup>
        <FormControl type="text" value={currentRefinment}
          onChange={(e) => refine(e.target.value)} placeholder="Tìm theo tên bài hoặc nội dung"/>
      </FormGroup>
    );
    const ConnectedSearchBox = connectSearchBox(CustomizedSearchBox);
    return (
      <div className="container">
        <Jumbo />
        <InstantSearch {...algoliaConfig} >
            <Configure hitsPerPage={12}/>
            <Row>
              {/* <ConnectedSearchBox /> */}
              {/* <ConnectedPagination /> */}
            </Row>
            <ConnectedHits />
        </InstantSearch>
      </div>
    )
  }
}

export default DisplayTho;
