import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DismissButtonLGReverse } from '../components/buttons/Buttons'
import CommentContainer from './CommentContainer'
import PostContainer from './PostContainer'
import { PostBody } from '../components/posts/PostRenderables'
// import { RegionItems } from '../regions/RegionRenderables'
import { css, media, parent, select } from '../styles/jss'
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
        s.relative,
        s.transitionTransform,
        {
          width: 'auto',
          height: '100%',
          whiteSpace: 'nowrap',
        },
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
export default function (WrappedComponent) {
  return class extends Component {
    static propTypes = {
      content: PropTypes.object, // for individual posts
      commentIds: PropTypes.object, // for comment stream
      postIds: PropTypes.object, // for posts list stream
    }

    static defaultProps = {
      content: null,
      commentIds: null,
      postIds: null,
    }

    constructor(props) {
      super(props)
      this.state = {
        open: false,
        queueOffsetX: 0,
      }

      this.handleImageClick = this.handleImageClick.bind(this)
      this.closeLightBox = this.closeLightBox.bind(this)
    }

    componentDidUpdate(prevProps, prevState) {
      // set keybindings
      if (!prevState.open && this.state.open) {
        this.bindKeys()
      }

      // move queue to new image position
      let slideDelay = 0
      if (!prevState.open) {
        slideDelay = 500
      }

      if (this.state.open && (prevState.selectedAssetId !== this.state.selectedAssetId)) {
        setTimeout(() => {
          this.slideQueue()
        }, slideDelay)
      }
    }

    componentWillUnmount() {
      const releaseKeys = true
      this.bindKeys(releaseKeys)
    }

    bindKeys(unbind) {
      Mousetrap.unbind(SHORTCUT_KEYS.ESC)
      // Mousetrap.unbind(SHORTCUT_KEYS.PREV)
      // Mousetrap.unbind(SHORTCUT_KEYS.NEXT)

      if (!unbind) {
        Mousetrap.bind(SHORTCUT_KEYS.ESC, () => { this.closeLightBox() })

        // if (lightBox && assetId) {
        //   Mousetrap.bind(SHORTCUT_KEYS.ESC, () => { this.setLightBox(lightBox, assetId) })
        //   Mousetrap.bind(SHORTCUT_KEYS.PREV, () => { this.advanceLightBox('prev') })
        //   Mousetrap.bind(SHORTCUT_KEYS.NEXT, () => { this.advanceLightBox('next') })
        // }
      }
    }

    handleImageClick(assetId, inLightBox) {
      if (!inLightBox) {
        console.log(`show/hide lightbox: ${assetId}`)
      } else {
        console.log(`advance lightbox: ${assetId}`)
      }

      return this.setState({
        open: true,
        selectedAssetId: assetId,
      })
    }

    slideQueue() {
      const assetId = this.state.selectedAssetId
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

    closeLightBox() {
      const releaseKeys = true
      this.bindKeys(releaseKeys)

      return this.setState({
        open: false,
        selectedAssetId: null,
        queueOffsetX: 0,
      })
    }

    handleMaskClick(e) {
      if (e.target.nodeName !== 'IMG' &&
        e.target.nodeName !== 'VIDEO' &&
        e.target.nodeName !== 'BUTTON') {
        return this.closeLightBox()
      }
      return null
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
              <div className="LightBoxMask" onClick={(e) => this.handleMaskClick(e)}>
                <DismissButtonLGReverse
                  onClick={this.closeLightBox}
                />
                <div className="LightBox">
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
                        toggleLightBox={(assetId) => this.handleImageClick(assetId, true)}
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
                        toggleLightBox={(assetId) => this.handleImageClick(assetId, true)}
                        isLightBox
                        commentId={id}
                        key={`commentContainer_${id}`}
                      />),
                    )}
                    {postIds && postIds.map(id =>
                      (<article className="PostList" key={`postsAsList_${id}`}>
                        <PostContainer
                          toggleLightBox={(assetId) => this.handleImageClick(assetId, true)}
                          isLightBox
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
            toggleLightBox={(assetId) => this.handleImageClick(assetId, false)}
            {...this.props}
          />
        </div>
      )
    }
  }
}
