import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Mousetrap from 'mousetrap'
import { DismissButtonLGReverse } from '../components/buttons/Buttons'
import CommentContainer from './CommentContainer'
import PostContainer from './PostContainer'
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

function manuallySetAssetClasses(prevAssetId, currentAssetId) {
  const prevAsset = document.getElementById(`lightBoxAsset_${prevAssetId}`)
  const currentAsset = document.getElementById(`lightBoxAsset_${currentAssetId}`)

  if (prevAsset) {
    prevAsset.classList.remove('selected')
  }
  if (currentAsset) {
    currentAsset.classList.add('selected')
  }
}

// Wraps LightBox controls/state around a component
// This function takes a component
export default function (WrappedComponent) {
  return class extends Component {
    static propTypes = {
      content: PropTypes.object, // for individual posts
      commentIds: PropTypes.object, // for comment stream
      postIds: PropTypes.object, // for posts list stream
      // below for individual posts
      author: PropTypes.object,
      columnWidth: PropTypes.number,
      commentOffset: PropTypes.number,
      contentWarning: PropTypes.string,
      contentWidth: PropTypes.number,
      detailPath: PropTypes.string,
      innerHeight: PropTypes.number,
      innerWidth: PropTypes.number,
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
      content: null,
      commentIds: null,
      postIds: null,
      // below for individual posts
      author: null,
      columnWidth: null,
      commentOffset: null,
      contentWarning: null,
      contentWidth: null,
      detailPath: null,
      innerHeight: null,
      innerWidth: null,
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
        queueOffsetX: 0,
      }

      this.handleImageClick = this.handleImageClick.bind(this)
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

      // manually set some stuff on the containers that are stateless (streams)
      const { commentIds, postIds } = this.props
      if (commentIds || postIds) {
        manuallySetAssetClasses(prevState.assetIdToSet, this.state.assetIdToSet)
      }
    }

    componentWillUnmount() {
      const releaseKeys = true
      this.bindKeys(releaseKeys)
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

    handleImageClick(assetId) {
      this.setState({
        open: true,
        assetIdToSet: assetId,
      })
      // update pagination
      return this.setPagination(assetId)
    }

    advance(direction) {
      let newAssetIdToSet = null

      switch (direction) {
        case 'prev' :
          newAssetIdToSet = this.state.assetIdToSetPrev
          break
        case 'next' :
          newAssetIdToSet = this.state.assetIdToSetNext
          break
        default :
          newAssetIdToSet = this.state.assetIdToSet
      }

      // advance to new image
      this.setState({
        assetIdToSet: newAssetIdToSet,
      })

      // update pagination
      return this.setPagination(newAssetIdToSet)
    }

    setPagination(assetId) {
      const { content } = this.props
      const imageContent = content.filter(region => region.get('kind') === 'image')
      const numberItems = imageContent.size

      let existingItemIndex = null
      imageContent.map((region, index) => {
        const loopAsset = region.get('asset')
        const loopAssetId = loopAsset ? loopAsset.get('id') : null

        if (loopAssetId === assetId) {
          existingItemIndex = index
          return existingItemIndex
        }
        return null
      })

      if (existingItemIndex !== null) {
        let prevIndex = existingItemIndex - 1
        let nextIndex = existingItemIndex + 1

        if (existingItemIndex === 0) {
          prevIndex = numberItems - 1
        }

        if (existingItemIndex === (numberItems - 1)) {
          nextIndex = 0
        }

        /* eslint-disable no-underscore-dangle */
        const prevItemAssetId = imageContent._tail.array[prevIndex].get('asset').get('id')
        const nextItemAssetId = imageContent._tail.array[nextIndex].get('asset').get('id')
        /* eslint-enable no-underscore-dangle */

        this.setState({
          assetIdToSetPrev: prevItemAssetId,
          assetIdToSetNext: nextItemAssetId,
        })
      }
    }

    slideQueue() {
      const assetId = this.state.assetIdToSet
      const assetDomId = `lightBoxAsset_${assetId}`

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

    setLightBoxStyle() {
      const {
        content,
        commentIds,
        postIds,
      } = this.props

      if (commentIds) {
        return commentsLightBoxStyle
      }

      if (postIds) {
        return postsListLightBoxStyle
      }

      if (content) {
        return postsBodyLightBoxStyle
      }

      return baseLightBoxStyle
    }

    render() {
      const {
        commentIds,
        postIds,
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
                        toggleLightBox={assetId => this.handleImageClick(assetId)}
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
                        toggleLightBox={assetId => this.handleImageClick(assetId)}
                        isLightBox
                        lightBoxSelectedId={this.state.assetIdToSet}
                        commentId={id}
                        key={`commentContainer_${id}`}
                      />),
                    )}
                    {postIds && postIds.map(id =>
                      (<article className="PostList" key={`postsAsList_${id}`}>
                        <PostContainer
                          toggleLightBox={assetId => this.handleImageClick(assetId)}
                          isLightBox
                          lightBoxSelectedId={this.state.assetIdToSet}
                          postId={id}
                          isPostHeaderHidden={isPostHeaderHidden}
                        />
                      </article>),
                    )}
                  </div>
                </div>
              </div>
            </div>
          }
          <WrappedComponent
            toggleLightBox={assetId => this.handleImageClick(assetId)}
            {...this.props}
          />
        </div>
      )
    }
  }
}
