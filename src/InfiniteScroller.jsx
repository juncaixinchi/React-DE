import React from 'react'
import InfiniteScroll from 'react-infinite-scroller'


export default class InfiniteScroller extends React.Component {

  render() {
    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={loadFunc}
        hasMore={true || false}
        loader={<div className="loader">Loading ...</div>}
      >
        {items}
      </InfiniteScroll>
    )
  }
}
