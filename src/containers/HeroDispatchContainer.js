import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import HeroPageHeaderContainer from './HeroPageHeaderContainer'
import { loadPageHeaders } from '../actions/page_headers'
import {
  selectPageHeaders,
  selectPageHeaderSlug,
  selectPageHeaderKind,
} from '../selectors/page_headers'

function mapStateToProps(state) {
  return {
    pageHeaderKind: selectPageHeaderKind(state),
    pageHeaderSlug: selectPageHeaderSlug(state),
    pageHeaders: selectPageHeaders(state),
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
    const { pageHeaderKind, pageHeaders } = this.props
    if (!pageHeaders || pageHeaders.isEmpty()) { return null }
    switch (pageHeaderKind) {
      case 'CATEGORY':
      case 'GENERIC':
        return <HeroPageHeaderContainer />
      default:
        return null
    }
  }
}

export default connect(mapStateToProps)(HeroDispatchContainer)
