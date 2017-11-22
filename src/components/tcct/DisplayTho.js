import React from 'react';
import { push } from 'react-router-redux';

/*=== ALGOLIA InstantSearch ===*/
import { InstantSearch } from 'react-instantsearch/dom';
import { connectSearchBox, connectHits, connectHighlight,
  connectPagination, connectHitsPerPage } from 'react-instantsearch/connectors'
import algoliaConfig from '../../config/algolia';
/*=== ALGOLIA InstantSearch ===*/
import { branch, renderNothing, compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import renderHTML from 'react-render-html';
import { Pagination, FormGroup, FormControl, ListGroup, Row, Col, InputGroup,
  ListGroupItem, Jumbotron, Clearfix, Button, ButtonGroup } from 'react-bootstrap';

import MediaQuery from 'react-responsive';
import FontAwesome from 'react-fontawesome';
import busyLoading from '../busyLoading';

import {selectHit} from '../../actions/tcctActions';

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
    <div style={thoStyle.container} className="container-fluid">
      <div style={thoStyle.content}>
        {/* Showing highlighted content for searching */}
        <ConnectedHighlight attributeName="content" hit={tho} />
        {/* {renderHTML(tho.content)} */}
      </div>
    </div> :
    <div></div>
};

const ConnectedSearchBox = connectSearchBox(({currentRefinement, refine, ...props}) => {
  const { isMobile, toggle, showList } = props;
  const placeholder = (isMobile) ? "Đánh từ bất kỳ..." : "Tìm theo tên bài hoặc nội dung...";
  const searchPrefix = (isMobile) ?
    <InputGroup.Button><Button onClick={toggle}><FontAwesome name={(showList) ? "times": "plus"} /></Button></InputGroup.Button> :
    <InputGroup.Addon><FontAwesome name="search" /></InputGroup.Addon>
  return (
    <FormGroup>
      <InputGroup>
        {searchPrefix}
        <FormControl type="text" value={currentRefinement}
          onChange={(e) => refine(e.target.value)} placeholder={placeholder} onFocus={(isMobile) ? toggle : null}/>
          <InputGroup.Button><Button onClick={() => refine()}><FontAwesome name="times-circle" /></Button></InputGroup.Button>
        </InputGroup>
      </FormGroup>
  );
  }
);

const ConnectedHitsPerPage = connectHitsPerPage(({refine, currentRefinement, ...props}) => {
  return (<div></div>);
});

const ConnectedPagination = connectPagination( ({ refine, currentRefinement, nbPages, ...props }) => {
  const { ellipsis, maxButtons, showList } = props;
  return (showList) ?
    <Pagination ellipsis={ellipsis} maxButtons={maxButtons}
      prev next
      items={nbPages}
      activePage={currentRefinement}
      onSelect={(eventKey) => {refine(eventKey)}}
    /> :
    <div></div>
});

const ConnectedHighlight = connectHighlight(
  ({ highlight, attributeName, hit, highlightProperty }) => {
    const parseHit = highlight({
      attributeName,
      hit,
      highlightProperty: '_highlightResult'
    });
    // do some customized tricks for highlighted content because of html code
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

const HitsList = ({hits, selectedID, ...props}) => {
  //[X] TODO: hide if having only record
  const { showList } = props;
  const hitsList = hits.map((hit, index) =>
    <ListGroupItem
      key={hit.objectID}
      active={index === selectedID}
      onClick={() => props.hitClick(index)}
    >
    {`${hit.index}. `} <ConnectedHighlight attributeName="title" hit={hit} />
    </ListGroupItem>
    );
  return (showList) ? <ListGroup>{ hitsList }</ListGroup> : <div></div>
}

const Mobile = props => <MediaQuery { ...props } maxWidth={767} />;
const Default = props => <MediaQuery { ...props } minWidth={768} />;

const CustomizedHits = ({hits, ...props}) => {
  const { defaultPerPage, perPageItems, selectedID, hitClick, isMobile, showList, toggle, selectHit } = props;
  const shouldShow = (hits.length > 1) && (!isMobile || showList);
  return (
    <div>
        <div>
          <Col sm={4}>
            <ConnectedSearchBox isMobile={isMobile} showList={shouldShow} toggle={toggle} />
            <HitsList hits={hits} selectedID={selectedID} showList={shouldShow}
              hitClick={(selectedID) => hitClick(selectedID, selectHit)} />
            <ConnectedHitsPerPage defaultRefinement={defaultPerPage} items={perPageItems} />
            <ConnectedPagination ellipsis maxButtons={5} showList={shouldShow} />
          </Col>
          <Clearfix visibleXsBlock/>
          <Col sm={8}>
            <DisplayUnitTho tho={hits[selectedID]} />
          </Col>
        </div>
    </div>
  );
};

const showHitsState = compose(
  withState('showList', 'handleShowList', false),
  withHandlers({
    toggle: ({handleShowList}) => () => handleShowList((current) => !current),
    hitClick: ({handleShowList}) => (selectedID, selectHit) => {
      handleShowList(false);
      selectHit(selectedID);
    }
  })
)

const EnhancedHits = showHitsState(CustomizedHits);

const WithBusyLoadingCustomize = branch (
  ({hits, ...props}) => {
    return hits.length === 0;
  },
  busyLoading
)(EnhancedHits);

const ConnectedHits = connectHits(({hits, selectedID, ...props}) =>
  <WithBusyLoadingCustomize hits={hits} selectedID={selectedID} {...props}/>
);

const DisplayTho = (props) => {
  const selectedID = (props.selectedID !== Number(props.match.params.index)) ? props.match.params.index : props.selectedID;
  const { defaultPerPage, perPageItems, isShowed } = props;
  return (
    <div className="container">
      <Jumbo />
      <InstantSearch { ...algoliaConfig } >
        {/* props: isMobile, hitsPerPage, perPageItems, thoIndex  */}
        <Mobile>
          <ConnectedHits isMobile defaultPerPage={defaultPerPage}
            perPageItems={perPageItems} selectedID={selectedID} isShowed={isShowed}
            selectHit={(selectedID) => props.selectHit(selectedID)}
          />
        </Mobile>
        <Default>
          <ConnectedHits defaultPerPage={defaultPerPage}
            perPageItems={perPageItems} isShowed={isShowed} selectedID={selectedID}
            selectHit={(selectedID) => props.selectHit(selectedID)}
          />
        </Default>
      </InstantSearch>
    </div>
  );
};

const mapStateToProps = store => store.tcct.thoIndex;
const mapDispatchToProps = dispatch => ({
  selectHit: (selectedID) => {
    dispatch(selectHit(selectedID));
    dispatch(push(`/tcct/xemtho/${selectedID}`));
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(DisplayTho);
