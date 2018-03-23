import React from 'react'
import PropTypes from 'prop-types'
import { css, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import PostContainer from './../../containers/PostContainer'
import CommentContainer from './../../containers/CommentContainer'
import { DismissButtonLGReverse } from './../buttons/Buttons'

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
        '> .LightBoxQueue.transition',
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

function setLightBoxStyle(commentIds) {
  if (commentIds) {
    return commentsLightBoxStyle
  }

  return postsListLightBoxStyle
}

const LightBox = ({
  commentIds,
  postAssetIdPairs,
  assetIdToSet,
  postIdToSet,
  queuePostIdsArray,
  queueOffsetX,
  loading,
  loaded,
  showOffsetTransition,
  resize,
  close,
  handleMaskClick,
  handleImageClick,
}) => {
  const lightBoxSelectedIdPair = { assetIdToSet, postIdToSet }

  return (
    <div className={setLightBoxStyle(commentIds)}>
      <div className="LightBoxMask" role="presentation" onClick={handleMaskClick}>
        <DismissButtonLGReverse
          onClick={close}
        />
        <div className={`LightBox ${loading ? 'loading' : ''}${loaded ? 'loaded' : ''}`}>
          <div
            className={`LightBoxQueue${showOffsetTransition ? ' transition' : ''}`}
            style={{ transform: `translateX(${queueOffsetX}px)` }}
          >
            {!commentIds &&
              postAssetIdPairs &&
              queuePostIdsArray &&
              queuePostIdsArray.map(postId =>
              (<PostContainer
                key={`lightBoxPost_${postId}`}
                postId={postId}
                isPostHeaderHidden
                isLightBox
                lightBoxSelectedIdPair={lightBoxSelectedIdPair}
                resizeLightBox={resize}
                toggleLightBox={handleImageClick}
              />),
            )}
            {commentIds &&
              postAssetIdPairs &&
              queuePostIdsArray &&
              queuePostIdsArray.map(postId =>
              (<CommentContainer
                key={`lightBoxPost_${postId}`}
                commentId={postId}
                isLightBox
                lightBoxSelectedIdPair={lightBoxSelectedIdPair}
                toggleLightBox={handleImageClick}
              />),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
const propTypes = {
  commentIds: PropTypes.array,
  postAssetIdPairs: PropTypes.array.isRequired,
  assetIdToSet: PropTypes.number.isRequired,
  postIdToSet: PropTypes.number.isRequired,
  queuePostIdsArray: PropTypes.array,
  queueOffsetX: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  loaded: PropTypes.bool.isRequired,
  showOffsetTransition: PropTypes.bool.isRequired,
  resize: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  handleMaskClick: PropTypes.func.isRequired,
  handleImageClick: PropTypes.func.isRequired,
}
const defaultProps = {
  commentIds: null,
  queuePostIdsArray: null,
}
LightBox.propTypes = propTypes
LightBox.defaultProps = defaultProps

export default LightBox
