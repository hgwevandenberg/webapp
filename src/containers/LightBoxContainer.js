import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DismissButtonLGReverse } from '../components/buttons/Buttons'
import CommentContainer from './CommentContainer'
import { css, media, parent, select } from '../styles/jss'
import * as s from '../styles/jso'
import { SHORTCUT_KEYS } from '../constants/application_types'

const lightBoxImageStyle = css(
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
      s.relative,
      s.containedAlignMiddle,
      s.center,
      select(
        '> .Comment',
        { padding: 0 },
        select(
          '> .CommentBody',
          { padding: 0,
            margin: 0,
            border: 'none',
          },
        ),
      ),
      select(
        '> .ImageAttachment',
        { width: '200px', backgroundColor: 'red' },
      ),
    ),
  ),
)

// Wraps LightBox controls/state around a component
// This function takes a component
export default function (WrappedComponent) {
  return class extends Component {
    static propTypes = {
      commentIds: PropTypes.object,
    }

    static defaultProps = {
      commentIds: null,
    }

    constructor(props) {
      super(props)
      this.state = {
        open: false,
      }

      this.handleToggle = this.handleToggle.bind(this)
      this.closeLightBox = this.closeLightBox.bind(this)
    }

    componentDidMount() {
      console.log('$$$ hi')
      console.log(this.props.commentIds)
    }

    componentWillUnmount() {
      console.log('$$$ goodbye')

      const releaseKeys = true
      this.bindKeys(releaseKeys)
    }

    componentDidUpdate() {
      console.log(this.props.commentIds)
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

    handleToggle() {
      console.log('show/hide lightbox')

      this.bindKeys()
      return this.setState({
        open: true,
      })
    }

    closeLightBox() {
      console.log('close me')

      const releaseKeys = true
      this.bindKeys(releaseKeys)

      return this.setState({
        open: false,
      })
    }

    handleMaskClick(e) {
      if (e.target.nodeName !== 'IMG' && e.target.nodeName !== 'BUTTON') {
        return this.closeLightBox()
      }
      return null
    }

    render() {
      const { commentIds } = this.props

      return (
        <div className="with-lightbox">
          {this.state.open &&
            <div className={lightBoxImageStyle}>
              <div className="LightBoxMask" onClick={(e) => this.handleMaskClick(e)}>
                <DismissButtonLGReverse
                  onClick={this.closeLightBox}
                />
                <div className="LightBox">
                  <p className="ImageAttachment">lol</p>
                  {commentIds.map(id =>
                    (<CommentContainer
                      toggleLightBox={this.handleToggle}
                      isLightBox
                      commentId={id}
                      key={`commentContainer_${id}`}
                    />),
                  )}
                </div>
              </div>
            </div>
          }
          <WrappedComponent
            toggleLightBox={this.handleToggle}
            {...this.props}
          />
        </div>
      )
    }
  }
}
