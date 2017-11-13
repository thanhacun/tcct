import React, { Component } from 'react';

/*=== ALGOLIA InstantSearch ===*/
import { InstantSearch, Configure} from 'react-instantsearch/dom';
import { connectSearchBox, connectHits, connectHighlight, connectPoweredBy,
  connectPagination} from 'react-instantsearch/connectors'
import algoliaConfig from '../../config/algolia';
/*=== ALGOLIA InstantSearch ===*/

import renderHTML from 'react-render-html';
import { Pagination, FormGroup, FormControl, ListGroup, Row, Col, InputGroup,
  ListGroupItem, Jumbotron, Clearfix, Button, Image, Thumbnail } from 'react-bootstrap';
import FontAwesome  from 'react-fontawesome';

const Jumbo = ({props}) =>
  <Jumbotron className="text-center" {...props}>
    <h2>Theo cánh chim trời</h2>
    <p>Dành tặng cố tác giả Kim Bồng Miêu<br/>
       Tuyển tập các bài thơ đã đăng của tác giả<br/>
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
        const {hits} = this.props;
        const hitsList = hits.map((hit, selectID) =>
          <ListGroupItem
            active={selectID === this.state.selectID}
            key={hit.objectID}
            onClick={() => this.setState({selectID})}
          >
          {`${hit.index}. `} <ConnectedHighlight attributeName="title" hit={hit} />
          </ListGroupItem>
        );
        const IndexMenu =
          <Col xsHidden md={4} mdOffset={1} sm={5}>
            <ConnectedSearchBox />
            <ListGroup>{ hitsList }</ListGroup>
            <ConnectedPagination/>
          </Col>
        const floatBtnStyle = {
          position: 'absolute',
          bottom: '5%',
          right: '10%'
        }

        return (
          <div>
            <Row>
              {IndexMenu}
              <Clearfix visibleXsBlock/>
              <Col xs={12} md={6} sm={7}>
                {(hits[this.state.selectID]) ? <DisplayUnitTho tho={hits[this.state.selectID]} />: ''}
              </Col>
              <Col xs={12} smHidden mdHidden>
                <Button
                  onClick={() => console.log('show IndexMenu')}><FontAwesome name="bars"
                  style={floatBtnStyle}/></Button>
              </Col>
              {/* <Clearfix visibleXsBlock/> */}
            </Row>
          </div>
        );
      }
    }

    const ConnectedHits = connectHits(({hits}) => <CustomizedHits hits = {hits}/>);
    const ConnectedLogo = connectPoweredBy(({url}) => {
      const algoliaLogoUrl = 'https://www.algolia.com/assets/svg/algolia-logo-31b6f5702e2052e72c46f19466ce2aae.svg';
      return(<a href={url}><Image responsive src={algoliaLogoUrl} /></a>);
    });
    const ConnectedPagination = connectPagination( ({ refine, currentRefinement, nbPages }) => {
      return (
        <Pagination
          prev next ellipsis maxButtons={6}
          items={nbPages}
          activePage={currentRefinement}
          onSelect={(eventKey) => {refine(eventKey)}}
        />
      )
    });

    const CustomizedSearchBox = ({currentRefinment, refine}) => (
      <FormGroup>
        <InputGroup>
          {/* <InputGroup.Addon><FontAwesome name="search" /></InputGroup.Addon> */}
          <InputGroup.Addon><ConnectedLogo /></InputGroup.Addon>
          <FormControl type="text" value={currentRefinment}
            onChange={(e) => refine(e.target.value)} placeholder="Tìm theo tên bài hoặc nội dung"/>
          <InputGroup.Addon><FontAwesome name="times-circle" onClick={() => refine('')}/></InputGroup.Addon>
          {/* <InputGroup.Button><ConnectedLogo /></InputGroup.Button> */}
        </InputGroup>
        {/* <ConnectedLogo /> */}
      </FormGroup>
    );
    const ConnectedSearchBox = connectSearchBox(CustomizedSearchBox);
    return (
      <div className="container">
        <Jumbo />
        <InstantSearch {...algoliaConfig} >
            <Configure hitsPerPage={12}/>
            {/* <ConnectedSearchBox /> */}
            {/* <ConnectedPagination /> */}
            <ConnectedHits />
        </InstantSearch>
      </div>
    )
  }
}

export default DisplayTho;
