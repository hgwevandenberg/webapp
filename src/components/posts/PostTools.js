/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router'
import Hint from '../hints/Hint'
import {
  BoltIcon,
  BubbleIcon,
  EyeIcon,
  FlagIcon,
  HeartIcon,
  PencilIcon,
  RepostIcon,
  ShareIcon,
  XBoxIcon,
  ArtistInviteSubmissionApprovedIcon,
  ArtistInviteSubmissionSelectedIcon,
} from '../assets/Icons'
import { numberToHuman } from '../../lib/number_to_human'

class ViewsTool extends PureComponent {
  static propTypes = {
    detailPath: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    postViewsCountRounded: PropTypes.string.isRequired,
  }
  static contextTypes = {
    onTrackRelatedPostClick: PropTypes.func.isRequired,
  }
  render() {
    const { detailPath, isLoggedIn, isPostDetail, postViewsCountRounded } = this.props
    return (
      <span className={classNames('PostTool', 'ViewsTool', { isPill: isLoggedIn, isPostDetail })}>
        <Link to={detailPath} onClick={this.context.onTrackRelatedPostClick}>
          <EyeIcon />
          <span className="PostToolValue">{postViewsCountRounded}</span>
          <Hint>Views</Hint>
        </Link>
      </span>
    )
  }
}

class TimeAgoTool extends PureComponent {
  static propTypes = {
    detailPath: PropTypes.string.isRequired,
    postCreatedAt: PropTypes.string.isRequired,
  }
  static contextTypes = {
    onTrackRelatedPostClick: PropTypes.func.isRequired,
  }
  render() {
    const { detailPath, postCreatedAt } = this.props
    return (
      <span className="PostTool TimeAgoTool">
        <Link to={detailPath} onClick={this.context.onTrackRelatedPostClick}>
          <span className="PostToolValue">{new Date(postCreatedAt).timeAgoInWords()}</span>
          <Hint>Visit</Hint>
        </Link>
      </span>
    )
  }
}

class CommentTool extends PureComponent {
  static propTypes = {
    detailPath: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    postCommentsCount: PropTypes.number.isRequired,
  }
  static contextTypes = {
    onClickToggleComments: PropTypes.func.isRequired,
    onTrackRelatedPostClick: PropTypes.func.isRequired,
  }
  render() {
    const { detailPath, isLoggedIn, postCommentsCount } = this.props
    return (
      <span className="PostTool CommentTool" data-count={postCommentsCount} >
        {isLoggedIn ?
          <button onClick={this.context.onClickToggleComments} >
            <BubbleIcon />
            <span className="PostToolValue" >
              {numberToHuman(postCommentsCount, false)}
            </span>
            <Hint>Comment</Hint>
          </button> :
          <Link to={detailPath} onClick={this.context.onTrackRelatedPostClick}>
            <BubbleIcon />
            <span className="PostToolValue" >
              {numberToHuman(postCommentsCount, false)}
            </span>
            <Hint>Comment</Hint>
          </Link>
        }
      </span>
    )
  }
}

class LoveTool extends PureComponent {
  static propTypes = {
    postLoved: PropTypes.bool.isRequired,
    postLovesCount: PropTypes.number.isRequired,
  }
  static contextTypes = {
    onClickLovePost: PropTypes.func.isRequired,
    onClickToggleLovers: PropTypes.func.isRequired,
  }
  render() {
    const { postLoved, postLovesCount } = this.props
    const { onClickLovePost, onClickToggleLovers } = this.context
    return (
      <span className="PostTool LoveTool" data-count={postLovesCount}>
        <button
          className={classNames({ isActive: postLoved, hasPostToolDrawer: postLovesCount > 0 })}
          onClick={onClickLovePost}
        >
          <HeartIcon />
          <Hint>Love</Hint>
        </button>
        <button
          className={classNames({ isActive: postLoved }, 'PostToolDrawerButton')}
          onClick={onClickToggleLovers}
        >
          <span className="PostToolValue" >
            {numberToHuman(postLovesCount, false)}
          </span>
        </button>
      </span>
    )
  }
}

class RepostTool extends PureComponent {
  static propTypes = {
    isOwnOriginalPost: PropTypes.bool.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    isRepostAnimating: PropTypes.bool.isRequired,
    postReposted: PropTypes.bool.isRequired,
    postRepostsCount: PropTypes.number.isRequired,
  }
  static contextTypes = {
    onClickRepostPost: PropTypes.func.isRequired,
    onClickToggleReposters: PropTypes.func.isRequired,
  }
  render() {
    const {
      isOwnOriginalPost, isOwnPost, isRepostAnimating, postReposted, postRepostsCount,
    } = this.props
    const { onClickRepostPost, onClickToggleReposters } = this.context
    return (
      <span className="PostTool RepostTool" data-count={postRepostsCount}>
        <button
          className={classNames({ hasPostToolDrawer: postRepostsCount > 0 })}
          onClick={!isOwnPost || !isOwnOriginalPost ? onClickRepostPost : null}
          style={{ pointerEvents: isOwnPost || isOwnOriginalPost || postReposted ? 'none' : null }}
        >
          <RepostIcon className={classNames({ isRepostAnimating })} />
          <Hint>Repost</Hint>
        </button>
        <button
          className="PostToolDrawerButton"
          onClick={onClickToggleReposters}
        >
          <span className="PostToolValue" >
            {numberToHuman(postRepostsCount, false)}
          </span>
        </button>
      </span>
    )
  }
}

// In use by the PostContainer for a weird design around the watch tool in mobile
export class WatchTool extends PureComponent {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    isWatchingPost: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    onClickWatchPost: PropTypes.func.isRequired,
  }
  render() {
    const { isMobile, isWatchingPost } = this.props
    const { onClickWatchPost } = this.context
    return (
      <span className={classNames('PostTool WatchTool', { isWatchingPost }, { isPill: isMobile })}>
        <button className={classNames({ isActive: isWatchingPost })} onClick={onClickWatchPost}>
          <BoltIcon />
          <Hint>{ isWatchingPost ? 'Mute' : 'Watch' }</Hint>
        </button>
      </span>
    )
  }
}

class ShareTool extends PureComponent {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
  }
  static contextTypes = {
    onClickSharePost: PropTypes.func.isRequired,
  }
  render() {
    return (
      <span className={classNames('PostTool', 'ShareTool', { isPill: !this.props.isLoggedIn })}>
        <button onClick={this.context.onClickSharePost}>
          <ShareIcon />
          <Hint>Share</Hint>
        </button>
      </span>
    )
  }
}

export class ArtistInviteSubmissionStatusTool extends PureComponent {
  static propTypes = {
    status: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }

  render() {
    const { title, slug, status } = this.props
    let resp = (<span />)
    if (status === 'approved') {
      const hint = `Accepted Submission to ${title}`
      resp = (
        <span className="PostTool ArtistInviteSubmissionStatusTool">
          <Link to={`/artist-invites/${slug}`}>
            <ArtistInviteSubmissionApprovedIcon />
            <Hint>{hint}</Hint>
          </Link>
        </span>
      )
    }
    if (status === 'selected') {
      const hint = `Selected Submission to ${title}`
      resp = (
        <span className="PostTool ArtistInviteSubmissionStatusTool">
          <Link to={`/artist-invites/${slug}`}>
            <ArtistInviteSubmissionSelectedIcon />
            <Hint>{hint}</Hint>
          </Link>
        </span>
      )
    }

    return resp
  }
}

export class EditTool extends PureComponent {
  static contextTypes = {
    onClickEditPost: PropTypes.func.isRequired,
  }
  render() {
    return (
      <span className="PostTool EditTool">
        <button onClick={this.context.onClickEditPost}>
          <PencilIcon />
          <Hint>Edit</Hint>
        </button>
      </span>
    )
  }
}

export class DeleteTool extends PureComponent {
  static contextTypes = {
    onClickDeletePost: PropTypes.func.isRequired,
  }
  render() {
    return (
      <span className="PostTool DeleteTool">
        <button onClick={this.context.onClickDeletePost}>
          <XBoxIcon />
          <Hint>Delete</Hint>
        </button>
      </span>
    )
  }
}

class FlagTool extends PureComponent {
  static contextTypes = {
    onClickFlagPost: PropTypes.func.isRequired,
  }
  render() {
    return (
      <span className="PostTool FlagTool ShyTool">
        <button onClick={this.context.onClickFlagPost}>
          <FlagIcon />
          <Hint className="Flag">Report Post</Hint>
        </button>
      </span>
    )
  }
}

export class PostTools extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    detailPath: PropTypes.string.isRequired,
    isCommentsActive: PropTypes.bool.isRequired,
    isCommentsRequesting: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isOwnOriginalPost: PropTypes.bool.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    isRelatedPost: PropTypes.bool.isRequired,
    isRepostAnimating: PropTypes.bool.isRequired,
    isWatchingPost: PropTypes.bool.isRequired,
    postCommentsCount: PropTypes.number.isRequired,
    postCreatedAt: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    postLoved: PropTypes.bool.isRequired,
    postLovesCount: PropTypes.number.isRequired,
    postReposted: PropTypes.bool.isRequired,
    postRepostsCount: PropTypes.number.isRequired,
    postViewsCountRounded: PropTypes.string.isRequired,
  }

  render() {
    const {
      author,
      detailPath,
      isCommentsActive,
      isCommentsRequesting,
      isGridMode,
      isLoggedIn,
      isMobile,
      isOwnOriginalPost,
      isOwnPost,
      isPostDetail,
      isRelatedPost,
      isRepostAnimating,
      isWatchingPost,
      postCommentsCount,
      postCreatedAt,
      postId,
      postLoved,
      postLovesCount,
      postReposted,
      postRepostsCount,
      postViewsCountRounded,
    } = this.props
    const cells = []
    if (!isPostDetail) {
      cells.push(
        <ViewsTool
          detailPath={detailPath}
          isLoggedIn={isLoggedIn}
          isPostDetail={isPostDetail}
          key={`ViewsTool_${postId}`}
          postViewsCountRounded={postViewsCountRounded}
        />,
      )
    }
    if (!isRelatedPost) {
      cells.push(
        <TimeAgoTool
          detailPath={detailPath}
          key={`TimeAgoTool_${postId}`}
          postCreatedAt={postCreatedAt}
        />,
      )
    }
    if (author.get('hasCommentingEnabled')) {
      cells.push(
        <CommentTool
          detailPath={detailPath}
          isLoggedIn={isLoggedIn}
          key={`CommentTool_${postId}`}
          postCommentsCount={postCommentsCount}
        />,
      )
    }
    if (author.get('hasLovesEnabled')) {
      cells.push(
        <LoveTool
          key={`LoveTool_${postId}`}
          postLoved={postLoved}
          postLovesCount={postLovesCount}
        />,
      )
    }
    if (author.get('hasRepostingEnabled') && !(isOwnPost && Number(postRepostsCount) === 0)) {
      cells.push(
        <RepostTool
          isOwnOriginalPost={isOwnOriginalPost}
          isOwnPost={isOwnPost}
          isRepostAnimating={isRepostAnimating}
          key={`RepostTool_${postId}`}
          postReposted={postReposted}
          postRepostsCount={postRepostsCount}
        />,
      )
    }
    if (isPostDetail) {
      cells.push(
        <ViewsTool
          detailPath={detailPath}
          isPostDetail={isPostDetail}
          isLoggedIn={isLoggedIn}
          key={`ViewsTool_${postId}`}
          postViewsCountRounded={postViewsCountRounded}
        />,
      )
    }

    if (!isOwnPost && !isOwnOriginalPost) {
      if (isPostDetail || (!isMobile && !isGridMode)) {
        cells.push(
          <WatchTool
            isMobile={isMobile}
            isWatchingPost={isWatchingPost}
            key={`WatchTool_${postId}`}
          />,
        )
      }
    }

    if (author.get('hasSharingEnabled')) {
      cells.push(
        <ShareTool
          isLoggedIn={isLoggedIn}
          key={`ShareTool_${postId}`}
        />,
      )
    }
    if (isLoggedIn) {
      if (!isOwnPost) {
        cells.push(<FlagTool key={`FlagTool_${postId}`} />)
      }
    }
    return (
      <footer className={classNames('PostTools', { isCommentsRequesting }, { isCommentsActive })}>
        {cells}
      </footer>
    )
  }
}

export class PostToolsLightBox extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    detailPath: PropTypes.string.isRequired,
    isCommentsRequesting: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isOwnOriginalPost: PropTypes.bool.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    postCommentsCount: PropTypes.number.isRequired,
    postId: PropTypes.string.isRequired,
    postLoved: PropTypes.bool.isRequired,
    postLovesCount: PropTypes.number.isRequired,
    postReposted: PropTypes.bool.isRequired,
    postRepostsCount: PropTypes.number.isRequired,
    postViewsCountRounded: PropTypes.string.isRequired,
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
    } = this.props
    const cells = []

    if (author.get('hasCommentingEnabled')) {
      cells.push(
        <CommentTool
          detailPath={detailPath}
          isLoggedIn={isLoggedIn}
          key={`CommentTool_${postId}`}
          postCommentsCount={postCommentsCount}
        />,
      )
    }
    if (author.get('hasLovesEnabled')) {
      cells.push(
        <LoveTool
          key={`LoveTool_${postId}`}
          postLoved={postLoved}
          postLovesCount={postLovesCount}
        />,
      )
    }
    if (author.get('hasRepostingEnabled') && !(isOwnPost && Number(postRepostsCount) === 0)) {
      cells.push(
        <RepostTool
          isOwnOriginalPost={isOwnOriginalPost}
          isOwnPost={isOwnPost}
          isRepostAnimating={false}
          key={`RepostTool_${postId}`}
          postReposted={postReposted}
          postRepostsCount={postRepostsCount}
        />,
      )
    }
    cells.push(
      <ViewsTool
        detailPath={detailPath}
        isPostDetail={false}
        isLoggedIn={isLoggedIn}
        key={`ViewsTool_${postId}`}
        postViewsCountRounded={postViewsCountRounded}
      />,
    )

    if (author.get('hasSharingEnabled')) {
      cells.push(
        <ShareTool
          isLoggedIn={isLoggedIn}
          key={`ShareTool_${postId}`}
        />,
      )
    }

    return (
      <header className={classNames('PostTools', { isCommentsRequesting })}>
        {cells}
      </header>
    )
  }
}

