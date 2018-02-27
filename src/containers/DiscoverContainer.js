import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  bindDiscoverKey,
  loadCategoryPosts,
  loadDiscoverPosts,
} from '../actions/discover'
import { Discover } from '../components/views/Discover'
import {
  selectPropsPathname,
  selectDiscoverStream,
  selectDiscoverStreamKind,
} from '../selectors/routing'

export function getStreamAction(type) {
  switch (type) {
    case 'featured':
    case 'recommended':
      return loadCategoryPosts()
    case 'recent':
    case 'trending':
      return loadDiscoverPosts(type)
    default:
      return loadCategoryPosts(type)
  }
}

function mapStateToProps(state, props) {
  return {
    stream: selectDiscoverStream(state, props),
    kind: selectDiscoverStreamKind(state, props),
    pathname: selectPropsPathname(state, props),
  }
}

class DiscoverContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    stream: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
  }

  componentWillMount() {
    // const { dispatch, paramsType } = this.props
    // dispatch(bindDiscoverKey(paramsType))
  }

  componentDidUpdate(prevProps) {
    // const { dispatch, paramsType, pathname } = this.props
    // if (prevProps.pathname !== pathname) {
    //   dispatch(bindDiscoverKey(paramsType))
    // }
  }

  render() {
    const { stream, kind } = this.props
    return (
      <Discover
        stream={stream}
        kind={kind}
        key={`discover_${stream}`}
        streamAction={getStreamAction(stream)}
      />
    )
  }
}

export default connect(mapStateToProps)(DiscoverContainer)

