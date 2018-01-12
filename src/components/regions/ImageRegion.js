/* eslint-disable jsx-a11y/no-static-element-interactions */
import Immutable from 'immutable'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import ImageAsset from '../assets/ImageAsset'
import VideoAsset from '../assets/VideoAsset'
import { ElloBuyButton } from '../editor/ElloBuyButton'
import { css, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const STATUS = {
  PENDING: 'isPending',
  REQUEST: 'isRequesting',
  SUCCESS: null,
  FAILURE: 'isFailing',
}

const streamImageStyle = css(
  s.inline,
  s.relative,
  s.center,
  s.bgcF2,
  select(
    '> .ImgHolder',
    s.relative,
  ),
)

const lightBoxImageStyle = css(
  s.inline,
  select(
    '> .ImgHolderLightBox',
    s.inline,
    select(
      '> .ImageAttachment',
      s.transitionOpacity,
      {
        opacity: 0.5,
      },
    ),
    select(
      '> .ImageAttachment:hover',
      {
        cursor: 'pointer',
        opacity: 1,
      },
    ),
    select(
      '> .ImageAttachment.selected',
      s.transitionOpacity,
      {
        opacity: 1,
      },
    ),
  ),
)

class ImageRegion extends PureComponent {

  static propTypes = {
    asset: PropTypes.object,
    buyLinkURL: PropTypes.string,
    columnWidth: PropTypes.number,
    commentOffset: PropTypes.number,
    content: PropTypes.object.isRequired,
    contentWidth: PropTypes.number,
    detailPath: PropTypes.string.isRequired,
    isComment: PropTypes.bool,
    isPostBody: PropTypes.bool,
    isPostDetail: PropTypes.bool,
    isGridMode: PropTypes.bool.isRequired,
    isNotification: PropTypes.bool,
    isLightBoxImage: PropTypes.bool,
    lightBoxSelectedId: PropTypes.string,
    shouldUseVideo: PropTypes.bool.isRequired,
    handleStaticImageRegionClick: PropTypes.func,
  }

  static defaultProps = {
    asset: null,
    buyLinkURL: null,
    columnWidth: 0,
    commentOffset: 0,
    contentWidth: 0,
    isComment: false,
    isNotification: false,
    isPostBody: true,
    isPostDetail: false,
    isGridMode: false,
    isLightBoxImage: false,
    lightBoxSelectedId: null,
    handleStaticImageRegionClick: null,
  }

  static contextTypes = {
    onTrackRelatedPostClick: PropTypes.func,
  }

  componentWillMount() {
    this.state = {
      currentImageHeight: null,
      currentImageWidth: null,
      measuredImageHeight: null,
      measuredImageWidth: null,
      scaledImageHeight: null,
      scaledImageWidth: null,
      status: STATUS.REQUEST,
    }
  }

  componentDidMount() {
    const { shouldUseVideo, isLightBoxImage } = this.props

    if (shouldUseVideo && isLightBoxImage) {
      this.triggerLoadSuccess()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !Immutable.is(nextProps.isLightBoxImage, this.props.isLightBoxImage) ||
      !Immutable.is(nextProps.asset, this.props.asset) ||
      ['buyLinkURL', 'columnWidth', 'contentWidth', 'isGridMode', 'isLightBoxImage', 'lightBoxSelectedId'].some(prop =>
        nextProps[prop] !== this.props[prop],
      ) ||
      ['currentImageHeight', 'currentImageWidth', 'scaledImageHeight', 'scaledImageWidth', 'status'].some(prop => nextState[prop] !== this.state[prop])
  }

  componentDidUpdate() {
    const { isLightBoxImage } = this.props
    const { scaledImageHeight, scaledImageWidth } = this.state

    // return this.setImageScale()
    if (isLightBoxImage && scaledImageHeight === null && scaledImageWidth === null) {
      return this.setImageScale()
    }
    return null
  }

  onClickStaticImageRegion = (event) => {
    this.props.handleStaticImageRegionClick(event)
    return false
  }

  onLoadSuccess = (img) => {
    if (this.isBasicAttachment()) {
      const dimensions = this.getBasicAttachmentDimensions(img)
      this.setState({ width: dimensions.width, height: dimensions.height })
    }
    this.setState({ status: STATUS.SUCCESS })
  }

  onLoadFailure = () => {
    this.setState({ status: STATUS.FAILURE })
  }

  getAttachmentMetadata() {
    if (!this.attachment || this.isBasicAttachment()) { return null }
    const optimized = this.attachment.get('optimized')
    const xhdpi = this.attachment.get('xhdpi')
    const hdpi = this.attachment.get('hdpi')
    let width = null
    let height = null

    // Todo: Not sure if we need to calculate hdpi or if xhdpi will work
    if (optimized.getIn(['metadata', 'width'])) {
      width = Number(optimized.getIn(['metadata', 'width']))
      height = Number(optimized.getIn(['metadata', 'height']))
    } else if (xhdpi.getIn(['metadata', 'width'])) {
      width = Number(xhdpi.getIn(['metadata', 'width']))
      height = Number(xhdpi.getIn(['metadata', 'height']))
    } else if (hdpi.getIn(['metadata', 'width'])) {
      width = Number(hdpi.getIn(['metadata', 'width']))
      height = Number(hdpi.getIn(['metadata', 'height']))
    }
    return {
      width,
      height,
      ratio: width ? width / height : null,
    }
  }

  // Use the lowest of the size constraints to ensure we don't go askew, go
  // below 1:1 pixel density, or go above the desired grid cell height
  getImageDimensions(metadata = this.getAttachmentMetadata()) {
    if (!metadata) { return metadata }
    const { columnWidth, commentOffset, contentWidth, isGridMode, isComment } = this.props
    const { height, ratio } = metadata
    const allowableWidth = isGridMode ? columnWidth : contentWidth
    const widthOffset = isGridMode && isComment ? commentOffset : 0
    const calculatedWidth = allowableWidth - widthOffset
    const maxCellHeight = isGridMode ? 1200 : 7500
    const widthConstrainedRelativeHeight = Math.round(calculatedWidth * (1 / ratio))
    const hv = Math.min(widthConstrainedRelativeHeight, height, maxCellHeight)
    const wv = Math.round(hv * ratio)
    return {
      width: wv,
      height: hv,
      ratio,
    }
  }

  getBasicAttachmentDimensions(img) {
    const height = img.height
    const ratio = img.width / height
    return this.getImageDimensions({ height, ratio })
  }

  getImageSourceSet() {
    const { isGridMode } = this.props
    const images = []
    if (!this.isBasicAttachment()) {
      if (isGridMode) {
        images.push(`${this.attachment.getIn(['mdpi', 'url'])} 375w`)
        images.push(`${this.attachment.getIn(['hdpi', 'url'])} 1920w`)
      } else {
        images.push(`${this.attachment.getIn(['mdpi', 'url'])} 180w`)
        images.push(`${this.attachment.getIn(['hdpi', 'url'])} 750w`)
        images.push(`${this.attachment.getIn(['xhdpi', 'url'])} 1500w`)
        images.push(`${this.attachment.getIn(['optimized', 'url'])} 1920w`)
      }
    }
    return images.join(', ')
  }

  // scales lightbox images to fill available screen space
  setImageScale() {
    const { measuredImageHeight, measuredImageWidth } = this.state

    const dimensions = this.getImageDimensions()
    let imageHeight = null
    let imageWidth = null

    if (dimensions) {
      imageHeight = dimensions.height
      imageWidth = dimensions.width
    } else {
      const { width, height } = this.state
      imageHeight = height
      imageWidth = width
    }

    const innerHeightPadded = (window.innerHeight - 80)
    const innerWidthPadded = (window.innerWidth - (80 * 3))

    const innerRatio = innerWidthPadded / innerHeightPadded
    const imageRatio = imageWidth / imageHeight

    let scale = null

    if (imageRatio < innerRatio) {
      scale = (innerHeightPadded / imageHeight)
    } else {
      scale = (innerWidthPadded / imageWidth)
    }

    const setScaledImageHeight = (measuredImageHeight * scale)
    const setScaledImageWidth = (measuredImageWidth * scale)

    this.setState({
      currentImageHeight: measuredImageHeight,
      currentImageWidth: measuredImageWidth,
      scaledImageHeight: setScaledImageHeight,
      scaledImageWidth: setScaledImageWidth,
    })
  }

  triggerLoadSuccess() {
    if (this.props.shouldUseVideo) {
      this.setState({ status: STATUS.SUCCESS })
    }
  }

  handleScreenDimensions = (measuredDimensions) => {
    if (measuredDimensions) {
      this.setState({
        measuredImageHeight: measuredDimensions.height,
        measuredImageWidth: measuredDimensions.width,
      })

      if (this.props.shouldUseVideo) {
        return this.setImageScale()
      }
      return null
    }
    return null
  }

  isBasicAttachment() {
    const { asset } = this.props
    return !asset || !asset.get('attachment')
  }

  isGif() {
    return this.attachment.getIn(['optimized', 'metadata', 'type']) === 'image/gif'
  }

  renderImageAttachment() {
    const {
      asset,
      content,
      isNotification,
      isLightBoxImage,
      isPostBody,
      isPostDetail,
      isGridMode,
      lightBoxSelectedId,
    } = this.props
    const { scaledImageHeight, scaledImageWidth } = this.state
    const selected = (asset.get('id') === lightBoxSelectedId)
    const srcset = this.getImageSourceSet()
    const dimensions = this.getImageDimensions()
    return (
      <ImageAsset
        id={!isLightBoxImage ? `asset_${asset.get('id')}` : `lightBoxAsset_${asset.get('id')}`}
        alt={content.get('alt') ? content.get('alt').replace('.jpg', '') : null}
        className={`ImageAttachment${selected ? ' selected' : ''}`}
        height={(isNotification || isLightBoxImage) ? 'auto' : dimensions.height}
        onLoadFailure={this.onLoadFailure}
        onLoadSuccess={this.onLoadSuccess}
        role="presentation"
        isPostBody={isPostBody}
        isPostDetail={isPostDetail}
        isGridMode={isGridMode}
        srcSet={srcset}
        src={this.attachment.getIn(['hdpi', 'url'])}
        width={isNotification ? null : dimensions.width}
        style={isLightBoxImage ? { width: scaledImageWidth, height: scaledImageHeight } : null}
        onScreenDimensions={
          isPostBody && (isPostDetail || !isGridMode) ?
            ((measuredDimensions) => { this.handleScreenDimensions(measuredDimensions) }) :
            null
        }
      />
    )
  }

  renderLegacyImageAttachment() {
    const {
      asset,
      content,
      isNotification,
      isLightBoxImage,
      isPostBody,
      isPostDetail,
      isGridMode,
      lightBoxSelectedId,
    } = this.props
    const attrs = { src: content.get('url') }
    const { scaledImageHeight, scaledImageWidth, width, height } = this.state
    const stateDimensions = width ? { width, height } : {}
    const selected = (asset.get('id') === lightBoxSelectedId)
    if (isNotification) {
      attrs.height = 'auto'
    }
    return (
      <ImageAsset
        id={!isLightBoxImage ? `asset_${asset.get('id')}` : `lightBoxAsset_${asset.get('id')}`}
        alt={content.get('alt') ? content.get('alt').replace('.jpg', '') : null}
        className={`ImageAttachment${selected ? ' selected' : ''}`}
        onLoadFailure={this.onLoadFailure}
        onLoadSuccess={this.onLoadSuccess}
        role="presentation"
        isPostBody={isPostBody}
        isPostDetail={isPostDetail}
        isGridMode={isGridMode}
        style={isLightBoxImage ? { width: scaledImageWidth, height: scaledImageHeight } : null}
        onScreenDimensions={
          isPostBody && (isPostDetail || !isGridMode) ?
            ((measuredDimensions) => { this.handleScreenDimensions(measuredDimensions) }) :
            null
        }
        {...stateDimensions}
        {...attrs}
      />
    )
  }

  renderGifAttachment() {
    const {
      asset,
      content,
      isNotification,
      isLightBoxImage,
      isPostBody,
      isPostDetail,
      isGridMode,
      lightBoxSelectedId,
    } = this.props
    const { scaledImageHeight, scaledImageWidth } = this.state
    const selected = (asset.get('id') === lightBoxSelectedId)
    const dimensions = this.getImageDimensions()
    return (
      <ImageAsset
        id={!isLightBoxImage ? `asset_${asset.get('id')}` : `lightBoxAsset_${asset.get('id')}`}
        alt={content.get('alt') ? content.get('alt').replace('.gif', '') : null}
        className={`ImageAttachment${selected ? ' selected' : ''}`}
        height={(isNotification || isLightBoxImage) ? 'auto' : dimensions.height}
        onLoadFailure={this.onLoadFailure}
        onLoadSuccess={this.onLoadSuccess}
        role="presentation"
        isPostBody={isPostBody}
        isPostDetail={isPostDetail}
        isGridMode={isGridMode}
        src={this.attachment.getIn(['optimized', 'url'])}
        width={isNotification ? null : dimensions.width}
        style={isLightBoxImage ? { width: scaledImageWidth, height: scaledImageHeight } : null}
        onScreenDimensions={
          isPostBody && (isPostDetail || !isGridMode) ?
            ((measuredDimensions) => { this.handleScreenDimensions(measuredDimensions) }) :
            null
        }
      />
    )
  }

  renderVideoAttachment() {
    const {
      asset,
      isLightBoxImage,
      isPostBody,
      isPostDetail,
      isGridMode,
      lightBoxSelectedId,
    } = this.props
    const { scaledImageHeight, scaledImageWidth } = this.state
    const selected = (asset.get('id') === lightBoxSelectedId)
    const dimensions = this.getImageDimensions()
    return (
      <VideoAsset
        id={!isLightBoxImage ? `asset_${asset.get('id')}` : `lightBoxAsset_${asset.get('id')}`}
        className={`ImageAttachment${selected ? ' selected' : ''}`}
        height={dimensions.height}
        width={dimensions.width}
        src={this.attachment.getIn(['video', 'url'])}
        style={isLightBoxImage ? { width: scaledImageWidth, height: scaledImageHeight } : null}
        onScreenDimensions={
          isPostBody && (isPostDetail || !isGridMode) ?
            ((measuredDimensions) => { this.handleScreenDimensions(measuredDimensions) }) :
            null
        }
      />
    )
  }

  renderAttachment() {
    const { asset, shouldUseVideo } = this.props
    if (!this.isBasicAttachment()) {
      this.attachment = asset.get('attachment')
      if (shouldUseVideo) {
        return this.renderVideoAttachment()
      } else if (this.isGif()) {
        return this.renderGifAttachment()
      }
      return this.renderImageAttachment()
    }
    return this.renderLegacyImageAttachment()
  }

  renderRegionAsLink() {
    const { buyLinkURL, detailPath } = this.props
    return (
      <div className="RegionContent">
        <Link to={detailPath} onClick={this.context.onTrackRelatedPostClick}>
          {this.renderAttachment()}
        </Link>
        {
          buyLinkURL && buyLinkURL.length ?
            <ElloBuyButton to={buyLinkURL} /> :
            null
        }
      </div>
    )
  }

  renderRegionAsStatic() {
    const { currentImageHeight, currentImageWidth } = this.state
    const { buyLinkURL, isLightBoxImage } = this.props
    const imgHolderClass = isLightBoxImage ? 'ImgHolderLightBox' : 'ImgHolder'
    return (
      <div
        className={isLightBoxImage ? lightBoxImageStyle : streamImageStyle}
        onClick={this.onClickStaticImageRegion}
        style={!isLightBoxImage ? { height: currentImageHeight, width: currentImageWidth } : null}
      >
        <div className={imgHolderClass}>
          {this.renderAttachment()}
          {
            buyLinkURL && buyLinkURL.length && !isLightBoxImage ?
              <ElloBuyButton to={buyLinkURL} /> :
              null
          }
        </div>
      </div>
    )
  }

  render() {
    const { isGridMode, detailPath } = this.props
    const { status } = this.state
    const asLink = isGridMode && detailPath
    return (
      <div className={classNames('ImageRegion', status)} >
        {asLink ? this.renderRegionAsLink() : this.renderRegionAsStatic()}
      </div>
    )
  }
}

export default ImageRegion
