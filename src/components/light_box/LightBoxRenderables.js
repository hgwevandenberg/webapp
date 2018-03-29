import React from 'react'
import PropTypes from 'prop-types'
import { css, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'
import PostContainer from './../../containers/PostContainer'
import PostLightBoxContainer from './../../containers/PostLightBoxContainer'
import CommentContainer from './../../containers/CommentContainer'
import { DismissButtonLGReverse } from './../buttons/Buttons'

const baseLightBoxStyle = css(
  s.block,
  s.relative,
  s.bgcF2,
  s.zIndex3,
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

const navButtonStyle = css(
  s.fixed,
  s.wv40,
  s.hv40,
  s.zIndex4,
  {
    top: 'calc(50% - 20px)',
    left: 20,
    backgroundColor: 'blue',
  },

  select('&.next',
    {
      left: 'auto',
      right: 20,
    },
  ),
)

const postLightBoxContainerStyle = css(
  s.fixed,
  s.block,
  s.fullWidth,
  s.zIndex4,
  {
    bottom: 0,
    left: 0,
    height: 50,
    backgroundColor: 'yellow',
  },

  select('& .controls',
    {
      backgroundColor: 'pink',
    },
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
  advance,
  advanceDirections,
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
        {advanceDirections.prev &&
          <button
            className={`prev ${navButtonStyle}`}
            onClick={() => { advance('prev') }}
          >
            Previous
          </button>
        }
        {advanceDirections.next &&
          <button
            className={`next ${navButtonStyle}`}
            onClick={() => { advance('next') }}
          >
            Next
          </button>
        }
        <div className={`LightBox ${loading ? 'loading' : ''}${loaded ? 'loaded' : ''}`}>
          {postIdToSet &&
            <div className={`${postLightBoxContainerStyle} controls-holder`}>
              <PostLightBoxContainer
                className="controls"
                postId={postIdToSet}
                resizeLightBox={resize}
              />
            </div>
          }
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
  assetIdToSet: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  postIdToSet: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  queuePostIdsArray: PropTypes.array,
  queueOffsetX: PropTypes.number.isRequired,
  advance: PropTypes.func.isRequired,
  advanceDirections: PropTypes.object.isRequired,
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
