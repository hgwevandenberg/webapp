/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import withLightBoxContainer from '../../containers/LightBoxContainer'
import Avatar from '../assets/Avatar'
import {
  ArrowIcon,
  CheckCircleIcon,
  RepostIcon,
  StarIcon,
  XBoxIcon,
} from '../assets/Icons'
import { DismissButtonLG } from '../buttons/Buttons'
import Editor from '../editor/Editor'
import ContentWarningButton from '../posts/ContentWarningButton'
import { PostTools, EditTool, DeleteTool } from '../posts/PostTools'
import { TabListButtons } from '../tabs/TabList'
import RelationshipContainer from '../../containers/RelationshipContainer'
import StreamContainer from '../../containers/StreamContainer'
import { RegionItems } from '../regions/RegionRenderables'
import { loadUserDrawer } from '../../actions/user'
import { loadComments } from '../../actions/posts'
import { postLovers, postReposters } from '../../networking/api'
import { after, before, css, hover, media, modifier, select } from '../../styles/jss'
import * as s from '../../styles/jso'


const adminActionsStyle = css(
  s.bgcF2,
  s.colorA,
  s.flex,
  s.fontSize14,
  s.fullWidth,
  s.hv40,
  s.itemsCenter,
  s.justifyCenter,
  s.mb10,
  { marginTop: -10 },
)

const actionButtonStyle = css(
  s.mx5,
  s.transitionColor,
  after(s.inlineBlock, { content: 'attr(data-label)' }),
  hover(
    s.colorBlack,
    select('> .XBoxIcon', s.inlineBlock),
  ),
  select('> .SVGIcon', s.mr5),
  select('> .SVGIcon.CheckCircleIcon', { marginTop: -2, marginRight: 7 }),
  select('> .StarIcon', { paddingTop: 2, paddingLeft: 2 }),
  select('> .XBoxIcon', s.displayNone),
  select('.decline .XBoxIcon', s.inline),
  modifier(
    '.select',
    hover(
      s.colorYellow,
      select('> .StarIcon > g', { fill: '#ffc600' }),
    ),
  ),
  modifier(
    '.unapprove',
    s.colorGreen,
    hover(
      select('> .CheckCircleIcon', s.displayNone),
      after({ content: '"Unapprove"' }),
    ),
    select('> .CheckCircleIcon', s.inlineBlock),
  ),
  modifier(
    '.unselect',
    s.colorYellow,
    hover(
      select('> .StarIcon', s.displayNone),
      after({ content: '"Unselect"' }),
    ),
    select('> .StarIcon', s.inlineBlock, select('> g', { fill: '#ffc600' })),
  ),
)

const getActionIcon = (type) => {
  switch (type) {
    case 'decline':
      return <XBoxIcon />
    case 'approve':
      return <CheckCircleIcon />
    case 'select':
      return <StarIcon />
    case 'unapprove':
      return [<CheckCircleIcon key="normal" />, <XBoxIcon key="hover" />]
    case 'unselect':
      return [<StarIcon key="normal" />, <XBoxIcon key="hover" />]
    default:
      return null
  }
}

export const PostAdminActions = ({ actions, status }, { onClickAction }) => (
  <div className={`${adminActionsStyle} ${status}`}>
    {actions.entrySeq().map(([type, action]) => (
      <button
        className={`${actionButtonStyle} ${type}`}
        onClick={() => onClickAction(action)}
        data-label={action.get('label')}
        key={type}
      >
        {getActionIcon(type)}
      </button>
    ))}
  </div>
)
PostAdminActions.propTypes = {
  actions: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
}
PostAdminActions.contextTypes = {
  onClickAction: PropTypes.func.isRequired,
}

const PostHeaderTimeAgoLink = ({ to, createdAt }) =>
  (<Link className="PostHeaderTimeAgoLink" to={to}>
    <span>{new Date(createdAt).timeAgoInWords()}</span>
  </Link>)
PostHeaderTimeAgoLink.propTypes = {
  createdAt: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

export class PostHeader extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    detailPath: PropTypes.string.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    postCreatedAt: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
  }
  render() {
    const { author, detailPath, isOwnPost, isPostDetail, postCreatedAt, postId } = this.props
    return (
      <header
        className={classNames('PostHeader', { isOwnPost })}
        key={`PostHeader_${postId}`}
      >
        <div className="PostHeaderAuthor">
          <Link className="PostHeaderLink" to={`/${author.get('username')}`}>
            <Avatar
              priority={author.get('relationshipPriority')}
              sources={author.get('avatar')}
              userId={`${author.get('id')}`}
              username={author.get('username')}
            />
            <span
              className="DraggableUsername"
              data-priority={author.get('relationshipPriority') || 'inactive'}
              data-userid={author.get('id')}
              data-username={author.get('username')}
              draggable
            >
              {isPostDetail && author.get('name') ?
                <span>
                  <span className="PostHeaderAuthorName">{author.get('name')}</span>
                </span>
                :
                `@${author.get('username')}`
              }
            </span>
          </Link>
        </div>
        <RelationshipContainer className="isInHeader" user={author} />
        {isPostDetail && author.get('name') &&
          <div className="PostDetailHeaderUsername">
            <Link className="PostHeaderLink" to={`/${author.get('username')}`}>
              <span
                className="DraggableUsername PostHeaderAuthorUsername"
                data-priority={author.get('relationshipPriority') || 'inactive'}
                data-userid={author.get('id')}
                data-username={author.get('username')}
                draggable
              >
                {`@${author.get('username')}`}
              </span>
            </Link>
          </div>
        }
        <div className="PostHeaderTools">
          <PostHeaderTimeAgoLink to={detailPath} createdAt={postCreatedAt} />
          {isPostDetail && isOwnPost &&
            <span>
              <EditTool />
              <DeleteTool />
            </span>
          }
        </div>
      </header>
    )
  }
}

export class ArtistInviteSubmissionHeader extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    detailPath: PropTypes.string.isRequired,
    postCreatedAt: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
  }
  render() {
    const { author, detailPath, postCreatedAt, postId } = this.props
    return (
      <header className="ArtistInviteSubmissionHeader" key={`ArtistInviteSubmissionHeader_${postId}`}>
        <div className="ArtistInviteSubmissionHeaderAuthor">
          <Link className="PostHeaderLink" to={`/${author.get('username')}`}>
            <Avatar
              priority={author.get('relationshipPriority')}
              sources={author.get('avatar')}
              userId={`${author.get('id')}`}
              username={author.get('username')}
            />
            <span
              className="DraggableUsername"
              data-priority={author.get('relationshipPriority') || 'inactive'}
              data-userid={author.get('id')}
              data-username={author.get('username')}
              draggable
            >
              {`@${author.get('username')}`}
            </span>
          </Link>
        </div>
        <RelationshipContainer className="isInHeader" user={author} />
        <div className="ArtistInviteSubmissionHeaderInvite">
          <Link className="PostHeaderLink" to="/artist-invites">
            <span className="ArtistInviteSubmissionHeaderInviteName">Artist Invite Submission</span>
          </Link>
        </div>
        <div className="PostHeaderTools">
          <PostHeaderTimeAgoLink to={detailPath} createdAt={postCreatedAt} />
        </div>
      </header>
    )
  }
}

export class CategoryHeader extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    categoryName: PropTypes.string.isRequired,
    categoryPath: PropTypes.string.isRequired,
    detailPath: PropTypes.string.isRequired,
    postCreatedAt: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
  }
  render() {
    const { author, categoryName, categoryPath, detailPath, postCreatedAt, postId } = this.props
    return (
      <header className="CategoryHeader" key={`CategoryHeader_${postId}`}>
        <div className="CategoryHeaderAuthor">
          <Link className="PostHeaderLink" to={`/${author.get('username')}`}>
            <Avatar
              priority={author.get('relationshipPriority')}
              sources={author.get('avatar')}
              userId={`${author.get('id')}`}
              username={author.get('username')}
            />
            <span
              className="DraggableUsername"
              data-priority={author.get('relationshipPriority') || 'inactive'}
              data-userid={author.get('id')}
              data-username={author.get('username')}
              draggable
            >
              {`@${author.get('username')}`}
            </span>
          </Link>
        </div>
        <RelationshipContainer className="isInHeader" user={author} />
        <div className="CategoryHeaderCategory">
          <Link className="PostHeaderLink" to={categoryPath}>
            <span>in </span>
            <span className="CategoryHeaderCategoryName">{categoryName}</span>
          </Link>
        </div>
        <div className="PostHeaderTools">
          <PostHeaderTimeAgoLink to={detailPath} createdAt={postCreatedAt} />
        </div>
      </header>
    )
  }
}

export class RepostHeader extends PureComponent {
  static propTypes = {
    detailPath: PropTypes.string.isRequired,
    inUserDetail: PropTypes.bool.isRequired,
    isOwnPost: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    postCreatedAt: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    repostAuthor: PropTypes.object.isRequired,
    repostedBy: PropTypes.object.isRequired,
  }
  render() {
    const {
      detailPath,
      inUserDetail,
      isOwnPost,
      isPostDetail,
      postCreatedAt,
      postId,
      repostAuthor,
      repostedBy,
    } = this.props
    return (
      <header className={classNames('RepostHeader', { inUserDetail, isOwnPost })} key={`RepostHeader_${postId}`}>
        <div className="RepostHeaderAuthor">
          <Link className="PostHeaderLink" to={`/${repostAuthor.get('username')}`}>
            <Avatar
              priority={repostAuthor.get('relationshipPriority')}
              sources={repostAuthor.get('avatar')}
              userId={`${repostAuthor.get('id')}`}
              username={repostAuthor.get('username')}
            />
            <span
              className="DraggableUsername"
              data-priority={repostAuthor.get('relationshipPriority') || 'inactive'}
              data-userid={repostAuthor.get('id')}
              data-username={repostAuthor.get('username')}
              draggable
            >
              {`@${repostAuthor.get('username')}`}
            </span>
          </Link>
        </div>
        <RelationshipContainer className="isInHeader" user={repostAuthor} />
        <div className="RepostHeaderReposter">
          <Link className="PostHeaderLink" to={`/${repostedBy.get('username')}`}>
            <RepostIcon />
            <span
              className="DraggableUsername"
              data-priority={repostedBy.get('relationshipPriority') || 'inactive'}
              data-userid={repostedBy.get('id')}
              data-username={repostedBy.get('username')}
              draggable
            >
              {` by @${repostedBy.get('username')}`}
            </span>
          </Link>
        </div>
        <div className="PostHeaderTools">
          <PostHeaderTimeAgoLink to={detailPath} createdAt={postCreatedAt} />
          {isPostDetail && isOwnPost &&
            <span>
              <EditTool />
              <DeleteTool />
            </span>
          }
        </div>
      </header>
    )
  }
}

export class PostBody extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    columnWidth: PropTypes.number.isRequired,
    commentOffset: PropTypes.number.isRequired,
    content: PropTypes.object.isRequired,
    contentWarning: PropTypes.string,
    contentWidth: PropTypes.number.isRequired,
    detailPath: PropTypes.string.isRequired,
    innerHeight: PropTypes.number.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    isPostBody: PropTypes.bool.isRequired,
    isRepost: PropTypes.bool.isRequired,
    isLightBox: PropTypes.bool,
    resizeLightBox: PropTypes.bool,
    toggleLightBox: PropTypes.func,
    lightBoxSelectedId: PropTypes.string,
    post: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    repostContent: PropTypes.object,
    showEditor: PropTypes.bool.isRequired,
    summary: PropTypes.object.isRequired,
    supportsNativeEditor: PropTypes.bool.isRequired,
  }
  static defaultProps = {
    contentWarning: null,
    repostContent: null,
    isPostBody: true,
    isLightBox: false,
    resizeLightBox: false,
  }
  render() {
    const {
      author,
      columnWidth,
      commentOffset,
      content,
      contentWarning,
      contentWidth,
      detailPath,
      innerHeight,
      isGridMode,
      isPostDetail,
      isPostBody,
      isRepost,
      isLightBox,
      resizeLightBox,
      toggleLightBox,
      lightBoxSelectedId,
      post,
      postId,
      repostContent,
      showEditor,
      summary,
      supportsNativeEditor,
    } = this.props

    if (showEditor && !supportsNativeEditor) {
      return <Editor post={post} />
    }
    const cells = []

    if (contentWarning && !isPostDetail) {
      cells.push(<ContentWarningButton contentWarning={contentWarning} key={`contentWarning_${postId}`} />)
    }

    const regionProps = {
      postId,
      columnWidth,
      commentOffset,
      contentWidth,
      detailPath,
      innerHeight,
      isGridMode,
      isPostDetail,
      isPostBody,
      isLightBox,
      resizeLightBox,
      toggleLightBox,
      lightBoxSelectedId,
    }
    if (isRepost) {
      // this is weird, but the post summary is
      // actually the repost summary on reposts
      if (isGridMode) {
        regionProps.content = summary
        cells.push(<RegionItems {...regionProps} key={`RegionItems_${postId}`} />)
      } else {
        regionProps.content = repostContent
        cells.push(<RegionItems {...regionProps} key={`RegionItems_${postId}`} />)
        if (content && content.size) {
          regionProps.content = content
          cells.push(
            <div className="PostBody RepostedBody" key={`RepostedBody_${postId}`}>
              <Avatar
                priority={author.get('relationshipPriority')}
                sources={author.get('avatar')}
                to={`/${author.get('username')}`}
                userId={`${author.get('id')}`}
                username={author.get('username')}
              />
              <RegionItems {...regionProps} />
            </div>,
          )
        }
      }
    } else {
      regionProps.content = isGridMode ? summary : content
      cells.push(<RegionItems {...regionProps} key={`RegionItems_${postId}`} />)
    }
    return (
      <div className="PostBody" key={`PostBody_${postId}`}>
        {cells}
      </div>
    )
  }
}

const launchCommentEditorStyle = css(
  s.mt30,
  s.relative,
)

const launchCommentEditorAvatarStyle = css(
  { top: 10 },
)

const launchCommentEditorButtonStyle = css(
  s.absolute,
  s.bgcBlack,
  s.colorWhite,
  s.sansRegular,
  s.ml20,
  s.fontSize14,
  {
    borderRadius: 5,
    height: 50,
    width: 'calc(100% - 50px)',
    maxWidth: '640px',
    paddingLeft: 8,
    textAlign: 'left',
  },
  before(
    s.absolute,
    {
      top: 15,
      left: -20,
      width: 0,
      height: 0,
      content: '""',
      borderColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: 10,
      borderRightColor: '#000',
    },
  ),
)

// wrap post in LightBox factory
export const PostBodyWithLightBox = withLightBoxContainer(PostBody)

export const LaunchNativeCommentEditorButton = ({ avatar, post }, { onLaunchNativeEditor }) =>
  <LaunchCommentEditorButton avatar={avatar} post={post} onLaunch={onLaunchNativeEditor} />

LaunchNativeCommentEditorButton.propTypes = {
  avatar: PropTypes.object,
  post: PropTypes.object,
}
LaunchNativeCommentEditorButton.defaultProps = {
  avatar: null,
  post: null,
}
LaunchNativeCommentEditorButton.contextTypes = {
  onLaunchNativeEditor: PropTypes.func.isRequired,
}

export const LaunchMobileCommentEditorButton = ({ avatar, post }, { onToggleInlineCommenting }) =>
  <LaunchCommentEditorButton avatar={avatar} post={post} onLaunch={onToggleInlineCommenting} />

LaunchMobileCommentEditorButton.propTypes = {
  avatar: PropTypes.object,
  post: PropTypes.object,
}
LaunchMobileCommentEditorButton.defaultProps = {
  avatar: null,
  post: null,
}
LaunchMobileCommentEditorButton.contextTypes = {
  onToggleInlineCommenting: PropTypes.func.isRequired,
}

const LaunchCommentEditorButton = ({ avatar, post, onLaunch }) =>
  (<div className={launchCommentEditorStyle}>
    <Avatar className={`${launchCommentEditorAvatarStyle}`} sources={avatar} />
    <button
      className={launchCommentEditorButtonStyle}
      onClick={() => onLaunch(post, true, null)}
    >
      Comment...
    </button>
  </div>)

LaunchCommentEditorButton.propTypes = {
  avatar: PropTypes.object,
  post: PropTypes.object,
  onLaunch: PropTypes.func,
}
LaunchCommentEditorButton.defaultProps = {
  avatar: null,
  post: null,
  onLaunch: null,
}

const relatedPostButtonStyle = css(
  s.absolute,
  { top: 0, right: 0 },
  s.fontSize18,
  s.colorA,
  s.transitionColor,
  hover(s.colorBlack),
  select('& > .ArrowIcon', s.rotate90, { marginLeft: 15 }),
)

export const RelatedPostsButton = (props, { onClickScrollToRelatedPosts }) =>
  (<button
    className={relatedPostButtonStyle}
    onClick={onClickScrollToRelatedPosts}
  >
    <span>Related Posts</span>
    <ArrowIcon />
  </button>)
RelatedPostsButton.contextTypes = {
  onClickScrollToRelatedPosts: PropTypes.func.isRequired,
}

export const Post = ({
  adminActions,
  author,
  avatar,
  columnWidth,
  commentOffset,
  content,
  contentWarning,
  contentWidth,
  detailPath,
  innerHeight,
  isCommentsActive,
  isCommentsRequesting,
  isGridMode,
  isLoggedIn,
  isMobile,
  isOwnOriginalPost,
  isOwnPost,
  isPostDetail,
  isPostHeaderHidden,
  isRelatedPost,
  isRepost,
  isRepostAnimating,
  isWatchingPost,
  isLightBox,
  resizeLightBox,
  toggleLightBox,
  lightBoxSelectedId,
  post,
  postCommentsCount,
  postCreatedAt,
  postHeader,
  postId,
  postLoved,
  postLovesCount,
  postReposted,
  postRepostsCount,
  postViewsCountRounded,
  repostContent,
  showCommentEditor,
  showEditor,
  submissionStatus,
  summary,
  supportsNativeEditor,
}) => (
  <div className={classNames('Post', { isPostHeaderHidden: isPostHeaderHidden && !isRepost })}>
    {postHeader}
    {adminActions && !isLightBox &&
      <PostAdminActions
        actions={adminActions}
        status={submissionStatus}
      />
    }
    <PostBody
      {...{
        author,
        columnWidth,
        commentOffset,
        content,
        contentWarning,
        contentWidth,
        detailPath,
        innerHeight,
        isGridMode,
        isPostDetail,
        isRepost,
        isLightBox,
        resizeLightBox,
        toggleLightBox,
        lightBoxSelectedId,
        post,
        postId,
        repostContent,
        showEditor,
        summary,
        supportsNativeEditor,
      }}
    />
    {!isLightBox &&
      <PostTools
        {...{
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
          postCreatedAt,
          postCommentsCount,
          postId,
          postLoved,
          postLovesCount,
          postReposted,
          postRepostsCount,
          postViewsCountRounded,
        }}
      />
    }
    {isLoggedIn && showCommentEditor && supportsNativeEditor && !isLightBox &&
      <LaunchNativeCommentEditorButton avatar={avatar} post={post} />
    }
    {showCommentEditor && !supportsNativeEditor && !isLightBox && <Editor post={post} isComment />}
    {showCommentEditor && !isLightBox &&
      <StreamContainer
        action={loadComments(postId)}
        className="TabListStreamContainer isFullWidth"
        paginatorText="See More"
        paginatorTo={detailPath}
        postCommentsCount={postCommentsCount}
        shouldInfiniteScroll={false}
      />
    }
  </div>
)
Post.propTypes = {
  adminActions: PropTypes.object,
  author: PropTypes.object.isRequired,
  avatar: PropTypes.object,
  columnWidth: PropTypes.number.isRequired,
  commentOffset: PropTypes.number.isRequired,
  content: PropTypes.object,
  contentWarning: PropTypes.string,
  contentWidth: PropTypes.number.isRequired,
  detailPath: PropTypes.string.isRequired,
  innerHeight: PropTypes.number.isRequired,
  isCommentsActive: PropTypes.bool.isRequired,
  isCommentsRequesting: PropTypes.bool.isRequired,
  isGridMode: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isOwnOriginalPost: PropTypes.bool.isRequired,
  isOwnPost: PropTypes.bool.isRequired,
  isPostDetail: PropTypes.bool.isRequired,
  isPostHeaderHidden: PropTypes.bool,
  isRelatedPost: PropTypes.bool,
  isRepost: PropTypes.bool.isRequired,
  isRepostAnimating: PropTypes.bool.isRequired,
  isWatchingPost: PropTypes.bool.isRequired,
  isLightBox: PropTypes.bool,
  resizeLightBox: PropTypes.bool,
  toggleLightBox: PropTypes.func,
  lightBoxSelectedId: PropTypes.string,
  post: PropTypes.object.isRequired,
  postCommentsCount: PropTypes.number,
  postCreatedAt: PropTypes.string,
  postHeader: PropTypes.node,
  postId: PropTypes.string.isRequired,
  postLoved: PropTypes.bool,
  postLovesCount: PropTypes.number,
  postReposted: PropTypes.bool,
  postRepostsCount: PropTypes.number,
  postViewsCountRounded: PropTypes.string,
  repostContent: PropTypes.object,
  showCommentEditor: PropTypes.bool.isRequired,
  showEditor: PropTypes.bool.isRequired,
  submissionStatus: PropTypes.string,
  summary: PropTypes.object,
  supportsNativeEditor: PropTypes.bool.isRequired,
}

export const PostDetailAsideTop = ({
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
  postHeader,
  postId,
  postLoved,
  postLovesCount,
  postReposted,
  postRepostsCount,
  postViewsCountRounded,
}) => (
  <div className="PostDetailAsideTop">
    {postHeader}
    <PostTools
      {...{
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
        postCreatedAt,
        postCommentsCount,
        postId,
        postLoved,
        postLovesCount,
        postReposted,
        postRepostsCount,
        postViewsCountRounded,
      }}
    />
  </div>
)
PostDetailAsideTop.propTypes = {
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
  isRelatedPost: PropTypes.bool,
  isRepostAnimating: PropTypes.bool.isRequired,
  isWatchingPost: PropTypes.bool.isRequired,
  postCommentsCount: PropTypes.number,
  postCreatedAt: PropTypes.string,
  postHeader: PropTypes.node,
  postId: PropTypes.string.isRequired,
  postLoved: PropTypes.bool,
  postLovesCount: PropTypes.number,
  postReposted: PropTypes.bool,
  postRepostsCount: PropTypes.number,
  postViewsCountRounded: PropTypes.string,
}

export const PostDetailAsideBottom = ({
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
}) => (
  <div className="PostDetailAsideBottom">
    <PostTools
      {...{
        author,
        detailPath,
        isCommentsActive,
        isCommentsRequesting,
        isGridMode,
        isLoggedIn,
        isMobile: isMobile && !isPostDetail,
        isOwnOriginalPost,
        isOwnPost,
        isPostDetail,
        isRelatedPost,
        isRepostAnimating,
        isWatchingPost,
        postCreatedAt,
        postCommentsCount,
        postId,
        postLoved,
        postLovesCount,
        postReposted,
        postRepostsCount,
        postViewsCountRounded,
      }}
    />
  </div>
)
PostDetailAsideBottom.propTypes = {
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
  isRelatedPost: PropTypes.bool,
  isRepostAnimating: PropTypes.bool.isRequired,
  isWatchingPost: PropTypes.bool.isRequired,
  postCommentsCount: PropTypes.number,
  postCreatedAt: PropTypes.string,
  postId: PropTypes.string.isRequired,
  postLoved: PropTypes.bool,
  postLovesCount: PropTypes.number,
  postReposted: PropTypes.bool,
  postRepostsCount: PropTypes.number,
  postViewsCountRounded: PropTypes.string,
}

const userModalStyle = css(
  s.bgcWhite,
  s.fullWidth,
  s.mxAuto,
  s.overflowScroll,
  s.relative,
  { borderRadius: 5, maxWidth: 1000, minHeight: 400, maxHeight: 820 },
  select('& .Users.asGrid', media(s.minBreak4, { marginLeft: -20 })),
  select('& .UserProfileCard', media(s.minBreak4, s.mt20, s.ml20, { width: 'calc(33.33333% - 20px)' })),
  select('& .StreamContainer', media(s.minBreak4, s.p20)),
  select('& .CloseModal', s.colorA, hover(s.colorBlack)),
)

const userModalTabsStyle = css(
  s.center,
  s.mt40,
)

const userModalTabStyle = css(
  s.fontSize24,
  s.sansBlack,
  modifier(
    '.LabelTab',
    s.fontSize24,
    media(s.minBreak2, { fontSize: '38px !important' }),
  ),
  select(':last-child', s.mr0),
)

export class UserModal extends PureComponent {

  componentWillMount() {
    this.state = { activeType: this.props.activeType }
  }

  onClickTab = ({ type }) => {
    this.setState({ activeType: type })
  }

  render() {
    const { activeType } = this.state
    const { postId, tabs } = this.props
    const streamAction = activeType === 'loves' ?
      loadUserDrawer(postLovers(postId), postId, activeType) :
      loadUserDrawer(postReposters(postId), postId, activeType)
    return (
      <div className={userModalStyle}>
        <TabListButtons
          activeType={activeType}
          className={`${userModalTabsStyle}`}
          key={`TabListButtons_${activeType}`}
          onTabClick={this.onClickTab}
          tabClasses={`LabelTab ${userModalTabStyle}`}
          tabs={tabs}
        />
        <StreamContainer
          action={streamAction}
          className="TabListStreamContainer"
          key={`userModal_${activeType}`}
          paginatorCentered
          paginatorText="Load More"
          shouldInfiniteScroll={false}
        />
        <DismissButtonLG />
      </div>
    )
  }
}
UserModal.propTypes = {
  activeType: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
}

