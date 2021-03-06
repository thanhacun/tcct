import React from 'react';
// import PropTypes from 'prop-types';

/*=== ALGOLIA InstantSearch ===*/
import { InstantSearch } from 'react-instantsearch/dom';
import { connectSearchBox, connectHits, connectHighlight, connectPagination,
  connectHitsPerPage, connectStats } from 'react-instantsearch/connectors'
import algoliaConfig from '../../config/algolia';
/*=== ALGOLIA InstantSearch ===*/

import ReactPlayer from 'react-player';
import MarkdownPreview from 'react-markdown';

import { Pagination, FormGroup, FormControl, ListGroup, Col, InputGroup,
  ListGroupItem, Clearfix, Button, ButtonGroup, Grid, Row } from 'react-bootstrap';
import { branch, compose, withState, withHandlers, lifecycle } from 'recompose';
import FontAwesome from '@fortawesome/react-fontawesome';

import mediaQuery, {Mobile, Default} from './mediaQuery';
import showSelectedTho from './ShowSelectedTho';

import FormTho from './FormTho';
import Comments from './Comments';
import busyLoading from '../busyLoading';
import ShowJumbotron from './jumbotrons';

const ConnectedSearchBox = connectSearchBox(({currentRefinement, refine, ...props}) => {
  // const algoliaLogoStyle = {
  //   height: "20px"
  // };
  const { toggle, showList, searchFocus } = props;
  const SearchPrefix = mediaQuery(
    () => <InputGroup.Button><Button onClick={toggle}><FontAwesome icon={(showList) ? 'chevron-up' : 'chevron-down'} />
          </Button></InputGroup.Button>,
    () => <InputGroup.Addon><a href="https://algolia.com" target="_">
    {/* <img className="responsive" src={AlgoliaLogo} alt="Algolia logo" style={algoliaLogoStyle}/> */}
    <FontAwesome icon={['fab', 'algolia']} size={`lg`}/>
  </a></InputGroup.Addon>
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
              <FontAwesome icon={`times-circle`} /></Button>
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
    // handle markdown conttent in Tho
    // NOTE: do not use inlineHTML
    if (attributeName === "content") {
      highlightedHits = parseHit.map((part, index) => {
        if (part.isHighlighted) return `\`${part.value}\``
        // if (part.isHighlighted) return `~~${part.value}~~`
        return part.value;
      }).join('');
      return <MarkdownPreview source={highlightedHits} />;
    } else {
      highlightedHits = parseHit.map((part, index) => {
        if (part.isHighlighted) return <mark key={`hl_${index}`}>{part.value}</mark>
        return part.value;
      });
      return <span>{highlightedHits}</span>;
    }

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

const MediaPlayer = compose(
  withState('busy', 'busyHandler', true),
  withHandlers({
    onReady: props => () => {
      props.busyHandler(false);
    }
  })
)(({busy, busyHandler, ...props}) => {
  return (
    <div>
      {busy &&
          <span><FontAwesome icon={`spinner`} spin size="2x"/> Loading media...</span>
      }
      <ReactPlayer {...props}/>
    </div>
  )
});

const ShowDisplayTho = showSelectedTho(({thoObj, ...props}) =>{
  return (
    <div>
      <Default>
        <ButtonGroup className="hidden-print">
          <Button href="/tcct/xemtho/random"><FontAwesome icon={'random'} /></Button>
          <Button onClick={() => window.print()}><FontAwesome icon={`print`} /></Button>
          <Button onClick={() => props.goTo(`/tcct/suatho/${thoObj.index}`)}
          disabled={!props.isAdmin}><FontAwesome icon={`edit`} /></Button>
        </ButtonGroup>
      </Default>
      <ConnectedHighlight attributeName="content" hit={thoObj} {...props}/>
      {thoObj.mediaUrl &&
        <MediaPlayer url={thoObj.mediaUrl} controls width={`100%`} />
      }
      <hr />
      <Comments getThoComments={props.getThoComments} postThoComment={props.postThoComment}
        thoIndex={thoObj.index || 0} user={props.user} comments={props.comments}
        key={`trigger_render_${thoObj.index}`}
      />
    </div>
)
});

const ShowFormTho = connectStats(showSelectedTho(({nbHits, thoObj, ...props}) =>
    <FormTho
        selectedTho={thoObj}
        // [X] NOTE: this is a trick, using key to force a re-render
        // this case trying to use other than one-source-of-truth with is
        // NOT very welcome. The form tho can be either a blank form to input
        // new tho or a form with data from existed tho to edit
        key={`trigger_render_form_${thoObj.index}`}
        {...props} nbHits={nbHits}
    />
));

const EnhancedShowFormTho = compose(
  lifecycle({
    componentDidMount() {
      this.props.getTho(this.props.thoIndex);
    }
  }),
  branch(
    props => props.busy,
    busyLoading
  )
)(ShowFormTho);

const CustomizedHits = ({hits, ...props}) => {
  const { defaultPerPage, perPageItems, hitClick, showList, toggle, selectHit,
    searchFocus, selectedIndex, goTo } = props;
  // show only if there is more than 1 hit
  const shouldShow = (hits.length >= 1) && showList;
  // [X] TODO: Taking care of id when searching - number of hits return not in sequence!
  const currentID = (selectedIndex - 1) % defaultPerPage;
  const _targetID = hits.reduce((initialID, hit, currentHitID, theArray) => {
      return (hit.index === selectedIndex) ? currentHitID : initialID;
    }, (currentID >= hits.length) ? 0 : currentID);
  const currentPage = Math.ceil(selectedIndex / defaultPerPage);
  const thoTitle = (hits[_targetID]) ? hits[_targetID].title : '';

  const thoTemp = {index: '', title: '', content: '', footer: '', imgUrl: '', mediaUrl: '', postedUser: '', userEmail: ''};
  let ThoBlock = null;
  if (props.match.url.startsWith('/tcct/xemtho')) {
    ThoBlock = <ShowDisplayTho
      thoObj={hits[_targetID]} goTo={goTo}
      thoTitle={`KBM - Xem thơ - ${thoTitle}`}
      isAdmin={props.user.role && props.user.role.admin}
      getThoComments={props.getThoComments}
      postThoComment={props.postThoComment}
      user={props.user}
      comments={props.comments}
    />
  }
  if (props.match.url.startsWith('/tcct/suatho')) {
    ThoBlock = <EnhancedShowFormTho
        // thoObj={props.modifiedTho || hits[_targetID] || thoTemp}
        thoObj={props.tho || thoTemp}
        thoTitle={`KBM - Sửa thơ - ${thoTitle}`}
        user={props.user}
        modifyTho={props.modifyTho}
        busy={props.busy}
        refreshHits={props.refreshHits}
        getTho={props.getTho}
        thoIndex={selectedIndex}
        // [] NOTE: Problem with Update Blocking
        // https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
        key={`trigger_render_${selectedIndex}`}
      />
  }

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
          />
        </Col>
        <Clearfix visibleXsBlock/>
        <Col sm={8}>
          {/* [X] TODO: Showing tho for reading || for editing based on route */}
          {ThoBlock}
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
  const { refresh, ...passProps } = props;
  return (
    // [] NOTE: InstantSearch refresh prop not act as a trigger to refresh
    <InstantSearch {...algoliaConfig} refresh={refresh}>
      <ConnectedHits {...passProps} />
    </InstantSearch>
  );
};

export default IndexTho;
