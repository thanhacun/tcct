import React, { Component } from 'react';
/*=== ALGOLIA InstantSearch ===*/
import { InstantSearch, Configure} from 'react-instantsearch/dom';
import { connectSearchBox, connectHits, connectHighlight,
  connectPagination } from 'react-instantsearch/connectors'
import algoliaConfig from '../../config/algolia';
/*=== ALGOLIA InstantSearch ===*/

import { Pagination, FormGroup, FormControl } from 'react-bootstrap';

/*=== HOC wraps LocalIndex to use data from ALGOLIA ===*/
const connectAlgolia = (LocalIndex) => {
  return class ConnectAlgolia extends Component {
    render(){
      const { tho, busy, ...otherProps} = this.props;
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
      const ConnectedHits = connectHits(({hits}) => {
        const newHits = hits.map(hit => ({
          ...hit,
          // changing prop tho.title to return a Component, so LocalIndex can still
          // use title in either plain text or Component
          title: <ConnectedHighlight attributeName="title" hit={hit}/>
        }));
        return (
          <LocalIndex tho={newHits} busy ={!newHits.length} {...otherProps} />
        )
      });

      const ConnectedPagination = connectPagination( ({ refine, currentRefinement, nbPages }) => {
        console.log(currentRefinement);
        return (
          <Pagination
            prev next ellipsis maxButtons={5}
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
        <InstantSearch
          {...algoliaConfig}
        >
        <Configure hitsPerPage={100}/>
        <ConnectedSearchBox />
        <ConnectedHits />
        {/* <ConnectedPagination /> */}
        </InstantSearch>
      )
    }
  }
}

export default connectAlgolia;
