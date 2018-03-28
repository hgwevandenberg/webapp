// import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { trackEvent } from '../actions/analytics'
import { openModal, closeModal } from '../actions/modals'
import { UserModal } from '../components/posts/PostRenderables'
import {
  toggleComments,
  toggleReposting,
} from '../actions/posts'
import { PostToolsLightBox } from '../components/posts/PostTools'
import { isElloAndroid } from '../lib/jello'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectDeviceSize,
  selectIsMobile,
} from '../selectors/gui'
import {
  selectPost,
  selectPostAuthor,
  selectPostCommentsCount,
  selectPostDetailPath,
  selectPostIsCommentsRequesting,
  selectPostIsOwn,
  selectPostIsOwnOriginal,
  selectPostLoved,
  selectPostLovesCount,
  selectPostReposted,
  selectPostRepostsCount,
  selectPostViewsCountRounded,
  selectPostShowCommentEditor,
} from '../selectors/post'

function mapStateToProps(state, props) {
  return {
    author: selectPostAuthor(state, props),
    detailPath: selectPostDetailPath(state, props),
    deviceSize: selectDeviceSize(state),
    isCommentsRequesting: selectPostIsCommentsRequesting(state, props),
    isLoggedIn: selectIsLoggedIn(state),
    isMobile: selectIsMobile(state),
    isOwnOriginalPost: selectPostIsOwnOriginal(state, props),
    isOwnPost: selectPostIsOwn(state, props),
    post: selectPost(state, props),
    postCommentsCount: selectPostCommentsCount(state, props),
    postLoved: selectPostLoved(state, props),
    postLovesCount: selectPostLovesCount(state, props),
    postReposted: selectPostReposted(state, props),
    postRepostsCount: selectPostRepostsCount(state, props),
    postViewsCountRounded: selectPostViewsCountRounded(state, props),
    showCommentEditor: selectPostShowCommentEditor(state, props),
  }
}

class PostLightBoxContainer extends Component {
  static propTypes = {
    author: PropTypes.object.isRequired,
    detailPath: PropTypes.string.isRequired,
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    isCommentsRequesting: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isOwnOriginalPost: PropTypes.bool.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    isRelatedPost: PropTypes.bool,
    post: PropTypes.object.isRequired,
    postCommentsCount: PropTypes.number,
    postId: PropTypes.string.isRequired,
    postLoved: PropTypes.bool,
    postLovesCount: PropTypes.number,
    postReposted: PropTypes.bool,
    postRepostsCount: PropTypes.number,
    postViewsCountRounded: PropTypes.string,
    showCommentEditor: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    isRelatedPost: false,
    resizeLightBox: false,
    postCommentsCount: null,
    postLoved: false,
    postLovesCount: null,
    postReposted: false,
    postRepostsCount: null,
    postViewsCountRounded: null,
    previousPath: null,
  }

  static childContextTypes = {
    onClickLovePost: PropTypes.func.isRequired,
    onClickRepostPost: PropTypes.func.isRequired,
    onClickSharePost: PropTypes.func.isRequired,
    onClickToggleComments: PropTypes.func.isRequired,
    onClickToggleLovers: PropTypes.func.isRequired,
    onClickToggleReposters: PropTypes.func.isRequired,
    onTrackRelatedPostClick: PropTypes.func.isRequired,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func.isRequired,
    onLaunchNativeEditor: PropTypes.func.isRequired,
    openShareDialog: PropTypes.func.isRequired,
    toggleLovePost: PropTypes.func.isRequired,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    return {
      onClickLovePost: isLoggedIn ? this.onClickLovePost : this.onOpenSignupModal,
      onClickRepostPost: isLoggedIn ? this.onClickRepostPost : this.onOpenSignupModal,
      onClickSharePost: this.onClickSharePost,
      onClickToggleComments: this.onClickToggleComments,
      onClickToggleLovers: PropTypes.func.isRequired,
      onClickToggleReposters: this.onClickToggleReposters,
      onTrackRelatedPostClick: this.onTrackRelatedPostClick,
    }
  }

  // componentWillMount() {
  // }

  // shouldComponentUpdate(nextProps) {
  //   return !Immutable.is(nextProps.post, this.props.post) ||
  //     [
  //       'isLoggedIn',
  //       'isMobile',
  //       'resizeLightBox',
  //     ].some(prop =>
  //       nextProps[prop] !== this.props[prop],
  //     )
  // }

  onClickLovePost = () => {
    const { postLoved, post } = this.props
    const { toggleLovePost } = this.context
    const trackLabel = 'web_production.post_actions_love'
    toggleLovePost({ isLoved: postLoved, post, trackLabel })
  }

  onClickRepostPost = () => {
    const { detailPath, dispatch, post, postReposted } = this.props
    if (!postReposted) {
      dispatch(toggleReposting(post, true))
    } else {
      dispatch(push(detailPath))
      this.onTrackRelatedPostClick()
    }
  }

  onClickSharePost = () => {
    const { post, author } = this.props
    const { openShareDialog } = this.context
    openShareDialog({ post, postAuthor: author })
  }

  onClickToggleComments = () => {
    const { detailPath, deviceSize, dispatch, isLoggedIn,
      post, showCommentEditor } = this.props
    if (isLoggedIn) {
      if ((deviceSize === 'mobile') || isElloAndroid()) {
        dispatch(push(detailPath))
      } else {
        const nextShowComments = !showCommentEditor
        dispatch(toggleComments(post, nextShowComments))
      }
    } else {
      dispatch(push(detailPath))
    }
  }

  onClickToggleLovers = () => {
    const { dispatch, postId } = this.props
    dispatch(openModal(
      <UserModal activeType="loves" postId={postId} tabs={this.getUserModalTabs()} />,
    ))
  }

  onClickToggleReposters = () => {
    const { dispatch, postId } = this.props
    dispatch(openModal(
      <UserModal activeType="reposts" postId={postId} tabs={this.getUserModalTabs()} />,
    ))
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onTrackRelatedPostClick = () => {
    const { dispatch, isRelatedPost } = this.props
    if (isRelatedPost) { dispatch(trackEvent('related_post_clicked')) }
  }

  onOpenSignupModal = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('post-tools')
  }

  render() {
    const {
      author,
      detailPath,
      isCommentsRequesting,
      isLoggedIn,
      isOwnOriginalPost,
      isOwnPost,
      postCommentsCount,
      postId,
      postLoved,
      postLovesCount,
      postReposted,
      postRepostsCount,
      postViewsCountRounded,
      showCommentEditor,
    } = this.props

    return (
      <PostToolsLightBox
        author={author}
        detailPath={detailPath}
        isCommentsRequesting={isCommentsRequesting}
        isLoggedIn={isLoggedIn}
        isOwnOriginalPost={isOwnOriginalPost}
        isOwnPost={isOwnPost}
        postCommentsCount={postCommentsCount}
        postId={postId}
        postLoved={postLoved}
        postLovesCount={postLovesCount}
        postReposted={postReposted}
        postRepostsCount={postRepostsCount}
        postViewsCountRounded={postViewsCountRounded}
        showCommentEditor={showCommentEditor}
      />
    )
  }
}

export default connect(mapStateToProps)(PostLightBoxContainer)
