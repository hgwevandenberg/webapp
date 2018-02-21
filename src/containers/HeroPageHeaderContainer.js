import { Map } from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectUser } from '../selectors/user'
import {
  HeroPromotionCategory,
  HeroPromotionPage,
} from '../components/heros/HeroRenderables'
import {
  selectDPI,
  selectIsMobile,
} from '../selectors/gui'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectRandomPageHeader } from '../selectors/page_headers'
import { trackPostViews } from '../actions/posts'

function mapStateToProps(state) {
  const pageHeader = selectRandomPageHeader(state)
  const user = pageHeader ? selectUser(state, { userId: pageHeader.get('userId') }) : Map()
  const dpi = selectDPI(state)
  const isMobile = selectIsMobile(state)
  const isLoggedIn = selectIsLoggedIn(state)
  return { pageHeader, user, dpi, isMobile, isLoggedIn }
}

class HeroPageHeaderContainer extends Component { //eslint-disable-line
  static propTypes = {
    pageHeader: PropTypes.object,
    user: PropTypes.object,
    dpi: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pageHeader: null,
    user: null,
  }

  componentDidUpdate() {
    const { dispatch, pageHeader } = this.props
    if (pageHeader && pageHeader.get('postToken')) {
      dispatch(trackPostViews([], [pageHeader.get('postToken')], 'promo'))
    }
  }

  render() {
    const { pageHeader, user, dpi, isMobile, isLoggedIn } = this.props
    if (!pageHeader) { return null }
    switch (pageHeader.get('kind')) {
      case 'CATEGORY':
        return (
          <HeroPromotionCategory
            name={pageHeader.get('header', '')}
            description={pageHeader.get('subheader', '')}
            ctaCaption={pageHeader.getIn(['ctaLink', 'text'])}
            ctaHref={pageHeader.getIn(['ctaLink', 'url'])}
            sources={pageHeader.get('image')}
            creditSources={user.get('avatar', null)}
            creditUsername={user.get('username', null)}
            creditLabel="Posted by"
            dpi={dpi}
            isMobile={isMobile}
            isLoggedIn={isLoggedIn}
          />
        )
      case 'GENERIC':
        return (
          <HeroPromotionPage
            header={pageHeader.get('header', '')}
            subheader={pageHeader.get('subheader', '')}
            ctaCaption={pageHeader.getIn(['ctaLink', 'text'])}
            ctaHref={pageHeader.getIn(['ctaLink', 'url'])}
            sources={pageHeader.get('image')}
            creditSources={user.get('avatar', null)}
            creditUsername={user.get('username', null)}
            dpi={dpi}
            isMobile={isMobile}
            isLoggedIn={isLoggedIn}
          />
        )
      default:
        return null
    }
  }
}

export default connect(mapStateToProps)(HeroPageHeaderContainer)
