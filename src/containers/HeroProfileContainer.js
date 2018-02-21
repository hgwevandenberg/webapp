import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { trackEvent } from '../actions/analytics'
import { openModal } from '../actions/modals'
import {
  selectUserId,
  selectUserPostsAdultContent,
  selectUserCoverImage,
  selectUserUsername,
} from '../selectors/user'
import { selectViewsAdultContent } from '../selectors/profile'
import { selectDPI } from '../selectors/gui'
import {
  HeroShareUserButton,
  HeroScrollToContentButton,
} from '../components/heros/HeroParts'
import UserContainer from './UserContainer'
import BackgroundImage from '../components/assets/BackgroundImage'
import ShareDialog from '../components/dialogs/ShareDialog'
import { css, media } from '../styles/jss'
import * as s from '../styles/jso'

function mapStateToProps(state, props) {
  const userId = selectUserId(state, props)
  const username = selectUserUsername(state, props)
  const dpi = selectDPI(state)
  const coverImage = selectUserCoverImage(state, props)
  const useGif = selectViewsAdultContent(state) ||
    !selectUserPostsAdultContent(state, props) ||
    false
  return { userId, dpi, coverImage, useGif, username }
}

const profileStyle = css(
  s.relative, s.flex, s.overflowHidden,
  media(s.minBreak2, { height: 'calc(100vh - 80px)', minHeight: 540 }),
)

class HeroProfileContainer extends Component { //eslint-disable-line
  static propTypes = {
    userId: PropTypes.string,
    username: PropTypes.string,
    dpi: PropTypes.string.isRequired,
    coverImage: PropTypes.object,
    useGif: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    userId: null,
    username: null,
    coverImage: null,
  }

  static childContextTypes = {
    onClickShareProfile: PropTypes.func,
  }

  getChildContext() {
    return {
      onClickShareProfile: this.onClickShareProfile,
    }
  }

  onClickShareProfile = () => {
    const { dispatch, username } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog username={username} trackEvent={action} />, '', null, 'open-share-dialog-profile'))
  }

  render() {
    const { userId, dpi, coverImage, useGif } = this.props
    if (!userId) { return null }
    return (
      <div className={profileStyle}>
        <BackgroundImage
          className="inHeroProfile hasOverlay6"
          dpi={dpi}
          sources={coverImage}
          useGif={useGif}
        />
        <UserContainer userId={userId} type="profile" />
        <HeroShareUserButton />
        <HeroScrollToContentButton />
      </div>
    )
  }
}

export default connect(mapStateToProps)(HeroProfileContainer)

