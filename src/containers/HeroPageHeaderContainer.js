import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectUser } from '../selectors/user'
import {
  Hero,
  HeroPromotionCategory,
  HeroPromotionPage,
} from '../components/heros/HeroRenderables'
import {
  selectDPI,
  selectIsMobile,
} from '../selectors/gui'
import { selectIsLoggedIn } from '../selectors/authentication'

function mapStateToProps(state, { pageHeaders }) {
  const pageHeader = pageHeaders.get(Math.floor(Math.random() * pageHeaders.count()))
  const user = selectUser(state, {userId: pageHeader.get('userId')})
  const dpi = selectDPI(state)
  const isMobile = selectIsMobile(state)
  const isLoggedIn = selectIsLoggedIn(state)
  return { pageHeader, user, dpi, isMobile, isLoggedIn }
}

class HeroPageHeaderContainer extends Component {
  static propTypes = {
    pageHeaders: PropTypes.object.isRequired,
    pageHeader: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  render() {
    const { pageHeader, user, dpi, isMobile, isLoggedIn } = this.props
    switch (pageHeader.get('kind')) {
      case 'CATEGORY':
        return (
          <Hero>
            {[
              <HeroPromotionCategory
                key="HeroPromotionCategory"
                name={pageHeader.get('header', '')}
                description={pageHeader.get('subheader', '')}
                ctaCaption={pageHeader.getIn(['ctaLink', 'text'])}
                ctaHref={pageHeader.getIn(['ctaLink', 'url'])}
                sources={pageHeader.get('image')}
                creditSources={user.get('avatar', null)}
                creditUsername={user.get('username', null)}
                creditLabel='Posted by'
                dpi={dpi}
                isMobile={isMobile}
                isLoggedIn={isLoggedIn}
              />
            ]}
          </Hero>
        )
      case 'GENERIC':
      default:
        return null
    }
    return null
  }
}

export default connect(mapStateToProps)(HeroPageHeaderContainer)
