import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HeroPageHeaderContainer from './HeroPageHeaderContainer'
import * as ACTION_TYPES from '../constants/action_types' // TODO EXPORT TO ACTIONS
import getPageHeadersQuery from '../queries/getPageHeaders'
import { selectPathname } from '../selectors/routing' // TODO EXPORT TO SELECTORS

export function getPageHeaders({ kind, slug }) {
  return {
    type: ACTION_TYPES.V3.LOAD_PAGE_HEADERS,
    payload: {
      query: getPageHeadersQuery,
      variables: { kind, slug },
    },
  }
}
// END ACTIONS EXPORT

function selectPageHeaderKind(state) {
  const pathname = selectPathname(state)
  if (pathname === '/') {
    return 'EDITORIAL'
  } else if (pathname === '/artist-invites') {
    return 'ARTIST_INVITE'
  } else if (pathname === '/discover') {
    return 'GENERIC'
  } else if (/\/discover\/(all|subscribed|featured|trending).*/i.test(pathname)) {
    return 'GENERIC'
  } else if (/\/discover\/.*/i.test(pathname)) {
    return 'CATEGORY'
  }
  return null
}

function selectPageHeaderSlug(state) {
  const pathname = selectPathname(state)
  if (!/\/discover\/.*/i.test(pathname)) { return null }
  if (/\/discover\/(all|subscribed|featured|trending).*/i.test(pathname)) { return null }

  return /\/discover\/(.*)/i.exec(pathname)[1]
}

function selectPageHeaders(state, { pageHeaderKind, pageHeaderSlug }) {
  return state.json.get('pageHeaders', Immutable.Map()).valueSeq().filter(header =>
    (header.get('kind') === pageHeaderKind &&
      (!pageHeaderSlug || pageHeaderSlug === header.get('slug'))))
}
// END SELECTOR EXTRACTION

function mapStateToProps(state) {
  const pageHeaderKind = selectPageHeaderKind(state)
  const pageHeaderSlug = selectPageHeaderSlug(state)
  return {
    pageHeaderKind,
    pageHeaderSlug,
    pageHeaders: selectPageHeaders(state, { pageHeaderKind, pageHeaderSlug }),
  }
}

class HeroDispatchContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    pageHeaders: PropTypes.object.isRequired,
    pageHeaderKind: PropTypes.string,
    pageHeaderSlug: PropTypes.string,
  }

  static defaultProps = {
    pageHeaderKind: null,
    pageHeaderSlug: null,
  }

  componentDidUpdate() {
    const { dispatch, pageHeaderKind: kind, pageHeaderSlug: slug, pageHeaders } = this.props
    if (kind && pageHeaders.isEmpty()) {
      dispatch(getPageHeaders({ kind, slug }))
    }
  }

  render() {
    const { pageHeaderKind, pageHeaders } = this.props
    if (!pageHeaders || pageHeaders.isEmpty()) { return null }
    switch (pageHeaderKind) {
      case 'CATEGORY':
      case 'GENERIC':
        return <HeroPageHeaderContainer pageHeaders={pageHeaders} />
      default:
        return null
    }
  }
}

export default connect(mapStateToProps)(HeroDispatchContainer)
