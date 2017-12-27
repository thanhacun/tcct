import React from 'react';
// import PropTypes from 'prop-types';

/*=== ALGOLIA InstantSearch ===*/
import { InstantSearch } from 'react-instantsearch/dom';
import { connectSearchBox, connectHits, connectHighlight, connectPagination,
  connectHitsPerPage } from 'react-instantsearch/connectors'
import algoliaConfig from '../../config/algolia';
/*=== ALGOLIA InstantSearch ===*/

import renderHTML from 'react-render-html';
import { Pagination, FormGroup, FormControl, ListGroup, Col, InputGroup,
  ListGroupItem, Jumbotron, Clearfix, Button, ButtonGroup, Grid, Row } from 'react-bootstrap';
import { branch, compose, withState, withHandlers, lifecycle } from 'recompose';
import FontAwesome from 'react-fontawesome';

import mediaQuery, {Mobile, Default} from './mediaQuery';
import showSelectedTho from './ShowSelectedTho';
import FormTho from './FormTho';

import busyLoading from '../busyLoading';
import AlgoliaLogo from './algolia-mark-blue.svg';

const ConnectedSearchBox = connectSearchBox(({currentRefinement, refine, ...props}) => {
  const algoliaLogoStyle = {
    height: "20px"
  };
  // const alogliaLogoSrc = "https://upload.wikimedia.org/wikipedia/commons/6/69/Algolia-logo.svg";
  const { toggle, showList, searchFocus, hitsNumber} = props;
  const SearchPrefix = mediaQuery(
    () => <InputGroup.Button><Button onClick={toggle}><FontAwesome name={(showList) ? 'chevron-up' : 'chevron-down'} />
          </Button></InputGroup.Button>,
    () => <InputGroup.Addon><a href="https://algolia.com" target="_"><img className="responsive"
    src={AlgoliaLogo} alt="Algolia logo"
    style={algoliaLogoStyle}/></a></InputGroup.Addon>
  );

  return (
    <FormGroup>
      <InputGroup>
        <SearchPrefix mobile />
        <SearchPrefix />
        <FormControl type="text" value={currentRefinement}
          onChange={(e) => refine(e.target.value)} placeholder={`Nhập từ bất kỳ...`}
          onFocus={searchFocus}
        />
          <InputGroup.Button>
            <Button onClick={() => refine()} disabled={!currentRefinement}>
              <FontAwesome name="times-circle" /></Button>
          </InputGroup.Button>

        </InputGroup>
      </FormGroup>
  );
  }
);

const ConnectedHitsPerPage = connectHitsPerPage(({refine, currentRefinement, ...props}) => {
  return null;
});
ConnectedHitsPerPage.defaultProps = {
  defaultRefinement: 20,
  items: [{value: 8}]
}

const ConnectedPagination = connectPagination( ({ refine, currentRefinement, nbPages, ...props }) => {
  const { ellipsis, maxButtons, showList } = props;
  const ShowPagination = <Pagination ellipsis={ellipsis} maxButtons={maxButtons}
    prev next
    items={nbPages}
    activePage={currentRefinement}
    onSelect={(eventKey) => {refine(eventKey)}}
  />;
  return (
    <div>
      <Mobile>{(showList) ? ShowPagination : null}</Mobile>
      <Default>{ShowPagination}</Default>
    </div>
  )
});

const ConnectedHighlight = connectHighlight(
  ({ highlight, attributeName, hit, highlightProperty }) => {
    const parseHit = highlight({
      attributeName,
      hit,
      highlightProperty: '_highlightResult'
    });
    // customized trick for highlighted content because the data is html code
    let highlightedHits = null;
    if (attributeName === "content") {
      highlightedHits = renderHTML(
        parseHit.map((part, index) => {
        if (part.isHighlighted) return `<mark>${part.value}</mark>`
        return part.value;
      }).join('')
    );
    } else {
      highlightedHits = parseHit.map((part, index) => {
        if (part.isHighlighted) return <mark key={`hl_${index}`}>{part.value}</mark>;
        return part.value;
      });
    }
    return <span>{highlightedHits}</span>;
});

const HitsList = ({hits, selectedIndex, ...props}) => {
  const { showList, hitClick } = props;
  const hitsList = hits.map(hit =>
    <ListGroupItem
      key={hit.objectID}
      active={hit.index === selectedIndex}
      onClick={() => hitClick(hit)}
    >
    {`${hit.index}. `} <ConnectedHighlight attributeName="title" hit={hit} />
    </ListGroupItem>
    );
    return (
      <div>
        <Mobile>
          {(showList) ? <ListGroup>{ hitsList }</ListGroup> : null}
        </Mobile>
        <Default>
          <ListGroup>{ hitsList }</ListGroup>
        </Default>
      </div>
    )
};

const ShowDisplayTho = showSelectedTho(({thoObj, ...props}) =>{
  return (
    <div>
      <Default>
        <ButtonGroup className="hidden-print">
          {/* <Button disabled><FontAwesome name="chevron-left" /></Button> */}
          <Button href="/tcct/xemtho/random"><FontAwesome name="random" /></Button>
          <Button onClick={() => window.print()}><FontAwesome name="print" /></Button>
          <Button onClick={() => props.goTo(`/tcct/suatho/${thoObj.index}`)}
          disabled={!props.isAdmin}><FontAwesome name="edit" /></Button>
          {/* <Button disabled><FontAwesome name="chevron-right" /></Button> */}
        </ButtonGroup>
      </Default>
    <ConnectedHighlight attributeName="content" hit={thoObj} {...props}/>
  </div>
)
});

const ShowFormTho = showSelectedTho(({thoObj, ...props}) =>
  <FormTho selectedTho={thoObj} {...props}/>
);

const ShowJumbotron = () => {
  const bgImages = ['https://i.imgur.com/zFku8m1.jpg'];
  const jbStyle={
    backgroundImage: `url(${bgImages[0]})`,
    opacity: '0.8',
    backgroundSize: 'cover',
    color: 'red',
    fontFamily: 'monospace',
    fontWeight: 'bold'
  };

  return (
    <Default>
      <Jumbotron style={jbStyle}>
        <div>
          <h3 className="text-center">
            Trời hừng sáng rộn ràng <br />
            Mây ráng chiều thanh thản <br/>
            Cả cuộc đời trong sáng <br/>
            Chí không để lụi tàn... <br/>
          </h3>
        </div>
      </Jumbotron>
    </Default>
  )
}

const thoTemp = {index: '', title: '', content: '', footer: '', imgUrl: ''};

const CustomizedHits = ({hits, ...props}) => {
  const { defaultPerPage, perPageItems, hitClick, showList, toggle, selectHit,
    searchFocus, selectedIndex, goTo } = props;
  // show only if there is more than 1 hit
  const shouldShow = (hits.length >= 1) && showList;

  // [X] TODO: Taking care of id when searching - number of hits return not in sequence!
  const currentID = (selectedIndex -1) % defaultPerPage;
  const _targetID = hits.reduce((initialID, hit, currentHitID, theArray) => {
      return (hit.index === selectedIndex) ? currentHitID : initialID;
    }, (currentID >= hits.length) ? 0 : currentID);
  const currentPage = Math.ceil(selectedIndex / defaultPerPage);
  const thoTitle = (hits[_targetID]) ? hits[_targetID].title : '';

  return (
      <Grid><Row>
        <ShowJumbotron />
        <Col sm={4} className="hidden-print">
          <ConnectedHitsPerPage  defaultRefinement={defaultPerPage} items={perPageItems}/>
          <ConnectedSearchBox
            showList={shouldShow} toggle={toggle}
            searchFocus={searchFocus} hitsNumber={hits.length}
          />
          <HitsList
            hits={hits}
            selectedIndex={selectedIndex}
            showList={shouldShow}
            hitClick={(hit) => hitClick(hit, selectHit)}
          />
          <ConnectedPagination ellipsis maxButtons={5} showList={shouldShow}
            defaultRefinement={currentPage}
            // using the same trick with fomrtho to force a re-render
            key={`trigger_render_page_${selectedIndex}`
          }
          />
        </Col>
        <Clearfix visibleXsBlock/>
        <Col sm={8}>
          {/* [X] TODO: Showing tho for reading || for editing based on route */}
          {props.match.url.startsWith('/tcct/xemtho') &&
            <ShowDisplayTho thoObj={hits[_targetID]} goTo={goTo}
              thoTitle={`KBM - Xem thơ - ${thoTitle}`} isAdmin={props.user.role && props.user.role.admin}/>
          }
          {props.match.url.startsWith('/tcct/suatho') &&
            <ShowFormTho thoObj={hits[_targetID] || thoTemp} thoTitle={`KBM - Sửa thơ - ${thoTitle}`}
              // [X] NOTE: this is a trick, using key to force a re-render
              // this case trying to use more than one source of truth with is
              // not very welcome. The form tho can be either a blank form to input
              // new tho or a form with data from existed tho to edit
              key={`trigger_render_form_${selectedIndex}`}
              user={props.user}
              modifyTho={props.modifyTho}
            />
          }
        </Col>
      </Row></Grid>
  );
};
const handleHitsState = compose(
  withState('showList', 'handleShowList', false),
  withHandlers({
    toggle: ({handleShowList}) => () => handleShowList((current) => !current),
    searchFocus: ({handleShowList}) => () => {
      handleShowList(true);
    },
    hitClick: ({handleShowList}) => (hit, selectHit) => {
      handleShowList(false);
      selectHit(hit);
    }
  })
);

const hitsLifeCycle = lifecycle({
  componentDidUpdate() {
    if (this.props.thoIndex.hits.length === 0) {
      this.props.hitsToStore(this.props.hits);
    }
  }
});

const EnhancedHits = compose(
  // hitsLifeCycle,
  handleHitsState,
)(CustomizedHits);

const EnhancedHitsWithBusy = branch(
  ({hits}) => hits.length === 0,
  busyLoading
)(EnhancedHits);

const ConnectedHits = connectHits(({ hits, selectedID, ...props }) =>
  <EnhancedHitsWithBusy hits={hits} selectedID={selectedID} { ...props } />
);

const IndexTho = (props) => {
  const { ...passProps } = props;
  return (
    <InstantSearch {...algoliaConfig}>
      <ConnectedHits {...passProps} />
    </InstantSearch>
  );
};

export default IndexTho;
