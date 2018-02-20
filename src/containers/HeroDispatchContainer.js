import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HeroPageHeaderContainer from './HeroPageHeaderContainer'
import HeroProfileContainer from './HeroProfileContainer'
import { loadPageHeaders } from '../actions/page_headers'
import {
  selectPageHeaders,
  selectPageHeaderSlug,
  selectPageHeaderKind,
} from '../selectors/page_headers'
import { selectViewNameFromRoute } from '../selectors/routing'

function mapStateToProps(state, props) {
  return {
    isUserProfile: selectViewNameFromRoute(state, props) === 'userDetail',
    pageHeaderKind: selectPageHeaderKind(state),
    pageHeaderSlug: selectPageHeaderSlug(state),
    pageHeaders: selectPageHeaders(state),
    params: props.params,
  }
}

class HeroDispatchContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    pageHeaders: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    pageHeaderKind: PropTypes.string,
    pageHeaderSlug: PropTypes.string,
    isUserProfile: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    pageHeaderKind: null,
    pageHeaderSlug: null,
  }

  componentWillMount() {
    const { dispatch, pageHeaderKind: kind, pageHeaderSlug: slug, pageHeaders } = this.props
    if (kind && pageHeaders.isEmpty()) {
      dispatch(loadPageHeaders({ kind, slug }))
    }
  }

  componentDidUpdate() {
    const { dispatch, pageHeaderKind: kind, pageHeaderSlug: slug, pageHeaders } = this.props
    if (kind && pageHeaders.isEmpty()) {
      dispatch(loadPageHeaders({ kind, slug }))
    }
  }

  render() {
    const { pageHeaderKind, pageHeaders, isUserProfile, params } = this.props
    if (!isUserProfile && (!pageHeaders || pageHeaders.isEmpty())) { return null }
    switch (pageHeaderKind) {
      case 'CATEGORY':
      case 'GENERIC':
        return <HeroPageHeaderContainer />
      default:
        if (isUserProfile) {
          return <HeroProfileContainer params={params} />
        }
        return null
    }
  }
}

export default connect(mapStateToProps)(HeroDispatchContainer)
