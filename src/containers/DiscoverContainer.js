import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  bindDiscoverKey,
  loadGlobalPostStream,
  loadSubscribedPostStream,
  loadCategoryPostStream,
} from '../actions/discover'
import { Discover } from '../components/views/Discover'
import {
  selectPropsPathname,
  selectDiscoverStream,
  selectDiscoverStreamKind,
} from '../selectors/routing'

export function getStreamAction(stream, kind) {
  switch (stream) {
    case 'global':
      return loadGlobalPostStream(kind)
    case 'subscribed':
      return loadSubscribedPostStream(kind)
    default:
      return loadCategoryPostStream(stream, kind)
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
    pathname: PropTypes.string.isRequired,
  }

  componentWillMount() {
    const { dispatch, pathname } = this.props
    dispatch(bindDiscoverKey(pathname))
  }

  componentDidUpdate(prevProps) {
    const { dispatch, pathname } = this.props
    if (prevProps.pathname !== pathname) {
      dispatch(bindDiscoverKey(pathname))
    }
  }

  render() {
    const { stream, kind } = this.props
    return (
      <Discover
        stream={stream}
        kind={kind}
        key={`discover_${stream}_${kind}`}
        streamAction={getStreamAction(stream, kind)}
      />
    )
  }
}

export default connect(mapStateToProps)(DiscoverContainer)

