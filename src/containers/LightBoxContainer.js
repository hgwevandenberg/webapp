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
import { scrollToPosition } from '../lib/jello'
import { DismissButtonLGReverse } from '../components/buttons/Buttons'
import PostContainer from './PostContainer'
import CommentContainer from './CommentContainer'
// import { RegionItems } from '../regions/RegionRenderables'
import { css, select, media } from '../styles/jss'
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
      s.flex,
      s.itemsCenter,
      select(
        '> .LightBoxQueue',
        s.transitionOpacity,
        s.relative,
        {
          width: 'auto',
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
    width: 'auto',
  },
  media(
    s.maxBreak4,
    { marginLeft: 30,
      marginRight: 30,
    },
  ),
  media(
    s.maxBreak3,
    { marginLeft: 20,
      marginRight: 20,
    },
  ),
  media(
    s.maxBreak2,
    { marginLeft: 10,
      marginRight: 10,
    },
  ),
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
)

// Wraps LightBox controls/state around a component
// This function takes a component
function LightBoxWrapper(WrappedComponent) {
  class BaseLightBox extends Component {
    static propTypes = {
      innerHeight: PropTypes.number,
      innerWidth: PropTypes.number,
      commentIds: PropTypes.object, // for comment stream
      postAssetIdPairs: PropTypes.array, // post/asset id pairs
    }

    static defaultProps = {
      innerHeight: null,
      innerWidth: null,
      commentIds: null,
      postAssetIdPairs: null,
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

      const slideDelay = !prevState.open ? 200 : 0
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
            prevIndex = 0
          }

          if (existingItemIndex === (numberItems - 1)) {
            nextIndex = existingItemIndex
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

    setLightBoxStyle() {
      const { commentIds } = this.props

      if (commentIds) {
        return commentsLightBoxStyle
      }

      return postsListLightBoxStyle
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

      // scroll the page to image
      this.scrollToSelectedAsset(newAssetIdToSet, newPostIdToSet)

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

    scrollToSelectedAsset(newAssetIdToSet, newPostIdToSet) {
      const commentsStream = this.props.commentIds
      const assetDomId = `asset_${newAssetIdToSet}_${newPostIdToSet}`

      // grab elements from the dom
      const postList = document.getElementsByClassName('PostList')
      const postSideBar = document.getElementsByClassName('PostSideBar')
      const assetInDom = document.getElementById(assetDomId)

      // determine scroll offset of asset in dom
      let assetInDomTopOffset = null
      if (postSideBar.length) { // post detail view (scrolling inner-div needs different treatement)
        if (commentsStream) {
          assetInDomTopOffset = assetInDom.getBoundingClientRect().top + postSideBar[0].scrollTop
        } else {
          assetInDomTopOffset = assetInDom.getBoundingClientRect().top + postList[0].scrollTop
        }
      } else {
        assetInDomTopOffset = assetInDom.getBoundingClientRect().top + window.scrollY
      }

      // adjust scroll offset for window height / nav bar
      const windowHeight = window.innerHeight
      const offsetPadding = (windowHeight / 10)
      const scrollToOffset = (assetInDomTopOffset - offsetPadding)

      // scroll to new position
      if (postList.length && postSideBar.length) { // post detail view
        let scrollElement = postList[0]
        if (commentsStream) {
          scrollElement = postSideBar[0]
        }
        return scrollToPosition(0, scrollToOffset, { el: scrollElement })
      }
      return scrollToPosition(0, scrollToOffset) // stream container view
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

    handleImageClick(assetId, postId) {
      const { open, assetIdToSet, postIdToSet } = this.state

      if (open && (assetId === assetIdToSet) && (postId === postIdToSet)) {
        return this.close()
      }

      // advance to new image
      this.setState({
        open: true,
        assetIdToSet: assetId,
        postIdToSet: postId,
      })

      // scroll the page to image
      this.scrollToSelectedAsset(assetId, postId)

      // update pagination
      return this.setPagination(assetId, postId)
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

    constructPostIdsArray() {
      const { postAssetIdPairs } = this.props
      const allPostIds = []

      postAssetIdPairs.map(postAssedIdPair => allPostIds.push(postAssedIdPair[0]))

      const postIds = Array.from(new Set(allPostIds))
      return postIds
    }

    render() {
      const { postAssetIdPairs } = this.props

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
                    {!this.props.commentIds &&
                      postAssetIdPairs &&
                      this.constructPostIdsArray().map(postId =>
                      (<PostContainer
                        key={`lightBoxPost_${postId}`}
                        postId={postId}
                        isPostHeaderHidden
                        isLightBox
                        lightBoxSelectedId={this.state.assetIdToSet}
                        resizeLightBox={this.state.resize}
                        toggleLightBox={(assetId, postIdToSet) =>
                          this.handleImageClick(assetId, postIdToSet)}
                      />),
                    )}
                    {this.props.commentIds &&
                      postAssetIdPairs &&
                      this.constructPostIdsArray().map(postId =>
                      (<CommentContainer
                        key={`lightBoxPost_${postId}`}
                        commentId={postId}
                        isLightBox
                        lightBoxSelectedId={this.state.assetIdToSet}
                        toggleLightBox={(assetId, postIdToSet) =>
                          this.handleImageClick(assetId, postIdToSet)}
                      />),
                    )}
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
