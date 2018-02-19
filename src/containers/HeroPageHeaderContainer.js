import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectUser } from '../selectors/user'
import {
  Hero,
  HeroPromotionCategory,
} from '../components/heros/HeroRenderables'
import {
  selectDPI,
  selectIsMobile,
} from '../selectors/gui'
import { selectIsLoggedIn } from '../selectors/authentication'

function mapStateToProps(state, { pageHeaders }) {
  const pageHeader = pageHeaders.get(Math.floor(Math.random() * pageHeaders.count()))
  const user = selectUser(state, { userId: pageHeader.get('userId') })
  const dpi = selectDPI(state)
  const isMobile = selectIsMobile(state)
  const isLoggedIn = selectIsLoggedIn(state)
  return { pageHeader, user, dpi, isMobile, isLoggedIn }
}

class HeroPageHeaderContainer extends Component { //eslint-disable-line
  static propTypes = {
    pageHeader: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    dpi: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }

  render() {
    const { pageHeader, user, dpi, isMobile, isLoggedIn } = this.props
    switch (pageHeader.get('kind')) {
      case 'CATEGORY':
      case 'GENERIC':
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
                creditLabel="Posted by"
                dpi={dpi}
                isMobile={isMobile}
                isLoggedIn={isLoggedIn}
              />]}
          </Hero>
        )
      default:
        return null
    }
  }
}

export default connect(mapStateToProps)(HeroPageHeaderContainer)
