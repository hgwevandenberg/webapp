import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Mousetrap from 'mousetrap'
import {
  selectInnerHeight,
  selectInnerWidth,
} from '../selectors/gui'
import {
  selectPostsAssetIds,
} from '../selectors/light_box'
import { DismissButtonLGReverse } from '../components/buttons/Buttons'
import CommentContainer from './CommentContainer'
import PostContainer from './PostContainer'
import ArtistInviteSubmissionContainer from './ArtistInviteSubmissionContainer'
import { PostBody } from '../components/posts/PostRenderables'
// import { RegionItems } from '../regions/RegionRenderables'
import { css, select } from '../styles/jss'
import * as s from '../styles/jso'
import { SHORTCUT_KEYS } from '../constants/application_types'

const baseLightBoxStyle = css(
  s.block,
  s.relative,
  s.bgcF2,
  { margin: '0 auto' },
  select(
    '> .LightBoxMask',
    s.fullscreen,
    s.fullWidth,
    s.fullHeight,
    s.bgcModal,
    s.zModal,
    { transition: `background-color 0.4s ${s.ease}` },
    select(
      '> .LightBox',
      s.fixed,
      s.flood,
      s.fullWidth,
      s.fullHeight,
      s.overflowHidden,
      select(
        '> .LightBoxQueue',
        s.transitionOpacity,
        s.relative,
        {
          width: 'auto',
          height: '100%',
          whiteSpace: 'nowrap',
          opacity: 1,
        },
      ),
    ),
    select(
      '> .LightBox.loaded',
      select(
        '> .LightBoxQueue',
        s.transitionTransform,
      ),
    ),
    select(
      '> .LightBox.loading',
      select(
        '> .LightBoxQueue',
        { opacity: 0 },
      ),
    ),
  ),
)

const imageRegionStyle = select(
  '> .ImageRegion',
  s.inlineBlock,
  s.relative,
  {
    margin: 0,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 40,
    width: 'auto',
  },
  select(
    '> .ImgHolderLightBox',
    s.inline,
  ),
)

const commentsLightBoxStyle = css(
  { ...baseLightBoxStyle },
  select(
    '> .LightBoxMask',
    select(
      '> .LightBox',
      select(
        '> .LightBoxQueue',
        select(
          '> .Comment',
          s.inline,
          { padding: 0 },
          select(
            '> .CommentBody',
            s.inline,
            { padding: 0,
              margin: 0,
              border: 'none',
              width: 'auto',
            },
            select(
              '> div',
              s.inline,
              { ...imageRegionStyle },
            ),
          ),
        ),
      ),
    ),
  ),
)

const postsListLightBoxStyle = css(
  { ...baseLightBoxStyle },
  select(
    '> .LightBoxMask',
    select(
      '> .LightBox',
      select(
        '> .LightBoxQueue',
        select(
          '> .PostList',
          s.inline,
          select(
            '> .Post',
            s.inline,
            { margin: 0,
              padding: 0,
            },
            select(
              '> .PostBody',
              s.inline,
              { padding: 0,
                margin: 0,
                border: 'none',
                width: 'auto',
              },
              select(
                '> div',
                s.inline,
                { ...imageRegionStyle },
              ),
            ),
          ),
        ),
      ),
    ),
  ),
)

const postsBodyLightBoxStyle = css(
  { ...baseLightBoxStyle },
  select(
    '> .LightBoxMask',
    select(
      '> .LightBox',
      select(
        '> .LightBoxQueue',
        select(
          '> .PostBody',
          s.inline,
          { padding: 0,
            margin: 0,
            border: 'none',
            width: 'auto',
          },
          select(
            '> div',
            s.inline,
            { ...imageRegionStyle },
          ),
        ),
      ),
    ),
  ),
)

// Wraps LightBox controls/state around a component
// This function takes a component
function LightBoxWrapper(WrappedComponent) {
  class BaseLightBox extends Component {
    static propTypes = {
      innerHeight: PropTypes.number,
      innerWidth: PropTypes.number,
      postIds: PropTypes.object, // for posts list stream
      commentIds: PropTypes.object, // for comment stream
      submissionIds: PropTypes.object, // for artist invite list stream
      postAssetIdPairs: PropTypes.array, // post/asset id pairs for navigation
      // below for individual posts
      content: PropTypes.object, // for individual posts
      author: PropTypes.object,
      columnWidth: PropTypes.number,
      commentOffset: PropTypes.number,
      contentWarning: PropTypes.string,
      contentWidth: PropTypes.number,
      detailPath: PropTypes.string,
      isGridMode: PropTypes.bool,
      isPostDetail: PropTypes.bool,
      isPostHeaderHidden: PropTypes.bool,
      isRepost: PropTypes.bool,
      post: PropTypes.object,
      postId: PropTypes.string,
      repostContent: PropTypes.object,
      showEditor: PropTypes.bool,
      summary: PropTypes.object,
      supportsNativeEditor: PropTypes.bool,
    }

    static defaultProps = {
      innerHeight: null,
      innerWidth: null,
      postIds: null,
      commentIds: null,
      submissionIds: null,
      postAssetIdPairs: null,
      // below for individual posts
      content: null,
      author: null,
      columnWidth: null,
      commentOffset: null,
      contentWarning: null,
      contentWidth: null,
      detailPath: null,
      isGridMode: false,
      isPostDetail: false,
      isPostHeaderHidden: false,
      isRepost: false,
      post: null,
      postId: null,
      repostContent: null,
      showEditor: false,
      summary: null,
      supportsNativeEditor: false,
    }

    constructor(props) {
      super(props)
      this.state = {
        open: false,
        loading: true,
        loaded: false,
        assetIdToSet: null,
        assetIdToSetPrev: null,
        assetIdToSetNext: null,
        postIdToSet: null,
        postIdToSetPrev: null,
        postIdToSetNext: null,
        innerWidth: this.props.innerWidth,
        innerHeight: this.props.innerHeight,
        resize: false,
        queueOffsetX: 0,
      }

      this.handleImageClick = this.handleImageClick.bind(this)
      this.handleViewPortResize = this.handleViewPortResize.bind(this)
      this.close = this.close.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
      // set keybindings
      if (!prevState.open && this.state.open) {
        this.bindKeys()
      }

      const slideDelay = !prevState.open ? 5 : 0
      const transitionDelay = 200

      // advance lightbox queue to specific asset
      if (this.state.open && (prevState.assetIdToSet !== this.state.assetIdToSet)) {
        setTimeout(() => {
          this.slideQueue()
        }, slideDelay)
      }

      // remove loading close if lightbox was recently opened
      if (this.state.open && !prevState.open) {
        setTimeout(() => {
          this.removeLoadingClass()
        }, transitionDelay)
      }

      // check for viewport resizes
      if ((this.state.open && !this.state.resize) &&
        ((this.props.innerWidth !== this.state.innerWidth) ||
        (this.props.innerHeight !== this.state.innerHeight))) {
        this.handleViewPortResize(true)
      }

      // reset resize bool
      if (!prevState.resize && this.state.resize) {
        this.handleViewPortResize(false)
      }
    }

    componentWillUnmount() {
      const releaseKeys = true
      this.bindKeys(releaseKeys)
    }

    setLightBoxStyle() {
      const {
        content,
        commentIds,
        postIds,
        submissionIds,
      } = this.props

      if (commentIds) {
        return commentsLightBoxStyle
      }

      if (postIds || submissionIds) {
        return postsListLightBoxStyle
      }

      if (content) {
        return postsBodyLightBoxStyle
      }

      return baseLightBoxStyle
    }

    setPagination(assetId, postId) {
      const { postAssetIdPairs } = this.props

      if (postAssetIdPairs) {
        const numberItems = postAssetIdPairs.length
        let existingItemIndex = null

        // match `assetId` and `postId` with `postAssetIdPairs` pair
        postAssetIdPairs.map((postAssetIdPair, index) => {
          if ((postAssetIdPair[1] === assetId) &&
            (postAssetIdPair[0] === postId)) {
            existingItemIndex = index
            return existingItemIndex
          }
          return null
        })

        // if there was a match, set prev/next indices + grab ids
        if (existingItemIndex !== null) {
          let prevIndex = existingItemIndex - 1
          let nextIndex = existingItemIndex + 1

          if (existingItemIndex === 0) {
            prevIndex = numberItems - 1
          }

          if (existingItemIndex === (numberItems - 1)) {
            nextIndex = 0
          }

          const prevItemAssetId = postAssetIdPairs[prevIndex][1]
          const nextItemAssetId = postAssetIdPairs[nextIndex][1]
          const prevItemPostId = postAssetIdPairs[prevIndex][0]
          const nextItemPostId = postAssetIdPairs[nextIndex][0]

          return this.setState({
            assetIdToSetPrev: prevItemAssetId,
            assetIdToSetNext: nextItemAssetId,
            postIdToSetPrev: prevItemPostId,
            postIdToSetNext: nextItemPostId,
          })
        }
        return null
      }
      return null
    }

    advance(direction) {
      let newAssetIdToSet = null
      let newPostIdToSet = null

      switch (direction) {
        case 'prev' :
          newAssetIdToSet = this.state.assetIdToSetPrev
          newPostIdToSet = this.state.postIdToSetPrev
          break
        case 'next' :
          newAssetIdToSet = this.state.assetIdToSetNext
          newPostIdToSet = this.state.postIdToSetNext
          break
        default :
          newAssetIdToSet = this.state.assetIdToSet
          newPostIdToSet = this.state.postIdToSet
      }

      // advance to new image
      this.setState({
        assetIdToSet: newAssetIdToSet,
        postIdToSet: newPostIdToSet,
      })

      // update pagination
      return this.setPagination(newAssetIdToSet, newPostIdToSet)
    }

    slideQueue() {
      const assetId = this.state.assetIdToSet
      const postId = this.state.postIdToSet
      const assetDomId = `lightBoxAsset_${assetId}_${postId}`

      // select the DOM elements
      const lightBoxDomQueue = document.getElementsByClassName('LightBoxQueue')[0]
      const assetInDom = document.getElementById(assetDomId)

      // measurements
      const viewportWidth = window.innerWidth
      const lightBoxDimensions = lightBoxDomQueue.getBoundingClientRect()
      const assetDimensions = assetInDom.getBoundingClientRect()

      // positioning calculations
      const desiredGap = ((viewportWidth - (assetDimensions.width)) / 2)
      const imageOffsetToBox = assetDimensions.x - lightBoxDimensions.x
      const newOffset = desiredGap - imageOffsetToBox

      // update the box position
      return this.setState({
        queueOffsetX: newOffset,
      })
    }

    close() {
      const releaseKeys = true
      this.bindKeys(releaseKeys)

      return this.setState({
        open: false,
        loading: true,
        loaded: false,
        assetIdToSet: null,
        queueOffsetX: 0,
      })
    }

    handleMaskClick(e) {
      if (e.target.nodeName !== 'IMG' &&
        e.target.nodeName !== 'VIDEO' &&
        e.target.nodeName !== 'BUTTON') {
        return this.close()
      }
      return null
    }

    handleViewPortResize(isResize) {
      // resize on
      if (isResize) {
        return this.setState({
          innerWidth,
          innerHeight,
          resize: true,
        })
      }

      // resize off
      setTimeout(() => {
        this.slideQueue()
      }, 250)

      return this.setState({
        resize: false,
      })
    }

    removeLoadingClass() {
      const transitionDelay = 200

      this.setState({
        loading: false,
      })

      return setTimeout(() => {
        this.setState({
          loaded: true,
        })
      }, transitionDelay)
    }

    bindKeys(unbind) {
      Mousetrap.unbind(SHORTCUT_KEYS.ESC)
      Mousetrap.unbind(SHORTCUT_KEYS.PREV)
      Mousetrap.unbind(SHORTCUT_KEYS.NEXT)

      if (!unbind) {
        Mousetrap.bind(SHORTCUT_KEYS.ESC, () => { this.close() })
        Mousetrap.bind(SHORTCUT_KEYS.PREV, () => { this.advance('prev') })
        Mousetrap.bind(SHORTCUT_KEYS.NEXT, () => { this.advance('next') })
      }
    }

    handleImageClick(assetId, postId) {
      this.setState({
        open: true,
        assetIdToSet: assetId,
        postIdToSet: postId,
      })

      // update pagination
      return this.setPagination(assetId, postId)
    }

    render() {
      const {
        commentIds,
        postIds,
        submissionIds,
        author,
        columnWidth,
        commentOffset,
        content,
        contentWarning,
        contentWidth,
        detailPath,
        innerHeight,
        innerWidth,
        isGridMode,
        isPostDetail,
        isRepost,
        post,
        postId,
        repostContent,
        showEditor,
        summary,
        supportsNativeEditor,
        isPostHeaderHidden,
      } = this.props

      return (
        <div className="with-lightbox">
          {this.state.open &&
            <div className={this.setLightBoxStyle()}>
              <div className="LightBoxMask" role="presentation" onClick={e => this.handleMaskClick(e)}>
                <DismissButtonLGReverse
                  onClick={this.close}
                />
                <div className={`LightBox ${this.state.loading ? 'loading' : ''}${this.state.loaded ? 'loaded' : ''}`}>
                  <div
                    className="LightBoxQueue"
                    style={{ transform: `translateX(${this.state.queueOffsetX}px)` }}
                  >
                    {content &&
                      <PostBody
                        author={author}
                        columnWidth={columnWidth}
                        commentOffset={commentOffset}
                        content={content}
                        contentWarning={contentWarning}
                        contentWidth={contentWidth}
                        detailPath={detailPath}
                        innerHeight={innerHeight}
                        innerWidth={innerWidth}
                        isGridMode={isGridMode}
                        isPostDetail={isPostDetail}
                        isRepost={isRepost}
                        isLightBox
                        resizeLightBox={this.state.resize}
                        toggleLightBox={(assetId, postIdToSet) =>
                          this.handleImageClick(assetId, postIdToSet)}
                        lightBoxSelectedId={this.state.assetIdToSet}
                        post={post}
                        postId={postId}
                        repostContent={repostContent}
                        showEditor={showEditor}
                        summary={summary}
                        supportsNativeEditor={supportsNativeEditor}
                      />
                    }
                    {commentIds && commentIds.map(id =>
                      (<CommentContainer
                        toggleLightBox={(assetId, postIdToSet) =>
                          this.handleImageClick(assetId, postIdToSet)}
                        isLightBox
                        resizeLightBox={this.state.resize}
                        lightBoxSelectedId={this.state.assetIdToSet}
                        commentId={id}
                        key={`commentContainer_${id}`}
                      />),
                    )}
                    {postIds && postIds.map(id =>
                      (<article className="PostList" key={`postsAsList_${id}`}>
                        <PostContainer
                          toggleLightBox={(assetId, postIdToSet) =>
                            this.handleImageClick(assetId, postIdToSet)}
                          isLightBox
                          resizeLightBox={this.state.resize}
                          lightBoxSelectedId={this.state.assetIdToSet}
                          postId={id}
                          isPostHeaderHidden={isPostHeaderHidden}
                        />
                      </article>),
                    )}
                    {submissionIds && submissionIds.map(id => (
                      <article className="PostList" key={`postsAsList_${id}`}>
                        <ArtistInviteSubmissionContainer
                          toggleLightBox={(assetId, postIdToSet) =>
                            this.handleImageClick(assetId, postIdToSet)}
                          isLightBox
                          resizeLightBox={this.state.resize}
                          lightBoxSelectedId={this.state.assetIdToSet}
                          submissionId={id}
                        />
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }
          <WrappedComponent
            toggleLightBox={(assetId, postIdToSet) => this.handleImageClick(assetId, postIdToSet)}
            {...this.props}
          />
        </div>
      )
    }
  }

  function makeMapStateToProps() {
    return (state, props) =>
      ({
        innerHeight: selectInnerHeight(state),
        innerWidth: selectInnerWidth(state),
        postAssetIdPairs: selectPostsAssetIds(state, props),
      })
  }

  return connect(makeMapStateToProps)(BaseLightBox)
}

export default LightBoxWrapper
