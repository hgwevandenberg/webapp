import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { trackEvent } from '../actions/analytics'
import { openModal } from '../actions/modals'
import { setIsProfileRolesActive } from '../actions/gui'
import {
  selectUserId,
  selectUserPostsAdultContent,
  selectUserCoverImage,
  selectUserUsername,
} from '../selectors/user'
import { selectViewsAdultContent } from '../selectors/profile'
import { selectHeroDPI, selectIsProfileRolesActive } from '../selectors/gui'
import { HeroProfile } from '../components/heros/HeroRenderables'
import ShareDialog from '../components/dialogs/ShareDialog'

function mapStateToProps(state, props) {
  const userId = selectUserId(state, props)
  const username = selectUserUsername(state, props)
  const dpi = selectHeroDPI(state)
  const coverImage = selectUserCoverImage(state, props)
  const isRolesOpen = selectIsProfileRolesActive(state)
  const useGif = selectViewsAdultContent(state) ||
    !selectUserPostsAdultContent(state, props) ||
    false
  return { userId, dpi, coverImage, isRolesOpen, useGif, username }
}

class HeroProfileContainer extends Component {
  static propTypes = {
    coverImage: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    dpi: PropTypes.string.isRequired,
    isRolesOpen: PropTypes.bool.isRequired,
    useGif: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    username: PropTypes.string,
  }

  static defaultProps = {
    coverImage: null,
    userId: null,
    username: null,
  }

  static childContextTypes = {
    onClickShareProfile: PropTypes.func,
    onClickOpenUserRoles: PropTypes.func,
  }

  getChildContext() {
    return {
      onClickShareProfile: this.onClickShareProfile,
      onClickOpenUserRoles: this.onClickOpenUserRoles,
    }
  }

  onClickShareProfile = () => {
    const { dispatch, username } = this.props
    const action = bindActionCreators(trackEvent, dispatch)
    dispatch(openModal(<ShareDialog username={username} trackEvent={action} />, '', null, 'open-share-dialog-profile'))
  }

  onClickOpenUserRoles = () => {
    const { dispatch, isRolesOpen } = this.props
    dispatch(setIsProfileRolesActive({ isActive: !isRolesOpen }))
  }

  render() {
    const { userId, dpi, coverImage, useGif } = this.props
    if (!userId) { return null }
    return (
      <HeroProfile
        dpi={dpi}
        sources={coverImage}
        useGif={useGif}
        userId={userId}
      />
    )
  }
}

export default connect(mapStateToProps)(HeroProfileContainer)

