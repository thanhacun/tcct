import React, { Component } from 'react';

/*=== ALGOLIA InstantSearch ===*/
import { InstantSearch, Configure} from 'react-instantsearch/dom';
import { connectSearchBox, connectHits, connectHighlight, connectPoweredBy,
  connectPagination} from 'react-instantsearch/connectors'
import algoliaConfig from '../../config/algolia';
/*=== ALGOLIA InstantSearch ===*/

import renderHTML from 'react-render-html';
import { Pagination, FormGroup, FormControl, ListGroup, Row, Col, InputGroup, Panel,
  ListGroupItem, Jumbotron, Clearfix, Button, Image, Thumbnail } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

const Jumbo = ({props}) =>
  <Jumbotron className="text-center" {...props}>
    <h2>Theo cánh chim trời</h2>
    <p>Dành tặng cố tác giả Kim Bồng Miêu<br/>
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
    <div style={thoStyle.container}>
      <div style={thoStyle.content}>
        {renderHTML(tho.content)}
      </div>
    </div>
  )

};

class DisplayTho extends Component {
  // constructor(props){
  //   super(props);
  //   this.state = {floatStyle: {}};
  //   this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  // }
  //
  // componentDidMount(){
  //   this.updateWindowDimensions();
  //   window.addEventListener('resize', this.updateWindowDimensions);
  // }
  //
  // componentWillUnMount(){
  //   window.removeEventListener('resize', this.updateWindowDimensions);
  // }
  //
  // updateWindowDimensions(){
  //   this.setState({
  //     floatStyle: {
  //       position: 'fixed',
  //       left: window.innerHeight * 0.95 + 'px',
  //       top: window.innerWidth * 0.95 + 'px'
  //     }
  //   }, () => console.log(this.state));
  // }
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
        this.state = {selectID: 0, xsMenuShow: false};
      }

      render(){
        const {hits} = this.props;
        const hitsList = hits.map((hit, selectID) =>
          <ListGroupItem
            active={selectID === this.state.selectID}
            key={hit.objectID}
            onClick={() => this.setState({selectID, xsMenuShow: false})}
          >
          {`${hit.index}. `} <ConnectedHighlight attributeName="title" hit={hit} />
          </ListGroupItem>
        );
        const IndexMenu = (xsInvisible) =>
          <Col xsHidden={xsInvisible} md={4} mdOffset={1} sm={5}>
            <ConnectedSearchBox />
            <ListGroup>{ hitsList }</ListGroup>
            <ConnectedPagination/>
          </Col>
        const { floatStyle } = this.state;

        return (
          <div>
            <Row>
              {IndexMenu(true)}
              <Clearfix visibleXsBlock/>
              <Col xsHidden md={6} sm={7}>
                {(hits[this.state.selectID]) ? <DisplayUnitTho tho={hits[this.state.selectID]} />: ''}
              </Col>
              <Col xs={12} smHidden mdHidden lgHidden>
                {IndexMenu(!this.state.xsMenuShow)}
                {(!this.state.xsMenuShow && hits[this.state.selectID]) ? <DisplayUnitTho tho={hits[this.state.selectID]} />: ''}
                <Button disabled={this.state.xsMenuShow}
                  onClick={() => this.setState({xsMenuShow: true})}><FontAwesome name="bars" /></Button>
              </Col>
            </Row>
          </div>
        );
      }
    }

    const ConnectedHits = connectHits(({hits, ...props}) => <CustomizedHits hits = {hits} {...props}/>);
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

    const CustomizedSearchBox = ({currentRefinement, refine}) => (
      <FormGroup>
        <InputGroup>
          <InputGroup.Addon><FontAwesome name="search" /></InputGroup.Addon>
          {/* <InputGroup.Addon><ConnectedLogo /></InputGroup.Addon> */}
          <FormControl type="text" value={currentRefinement}
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
