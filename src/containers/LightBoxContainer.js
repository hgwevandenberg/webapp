import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CommentContainer from '../containers/CommentContainer'
import { css, media, parent, select } from '../styles/jss'
import * as s from '../styles/jso'

const lightBoxImageStyle = css(
  s.block,
  s.relative,
  s.bgcF2,
  { display: 'none', margin: '0 auto' },
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
        '> .ImageAttachment',
        { width: '200px', backgroundColor: 'red' }
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
    }

    componentDidMount() {
      console.log('$$$ hi')
      console.log(this.props.commentIds)
    }

    componentWillUnmount() {
      console.log('$$$ goodbye')
    }

    componentDidUpdate() {
      console.log(this.props.commentIds)
    }

    render() {
      const { commentIds } = this.props

      return (
        <div className="with-lightbox">
          <div className={lightBoxImageStyle}>
            <div className="LightBoxMask">
              <div className="LightBox">
                <p className="ImageAttachment">lol</p>
                {commentIds.map(id =>
                  (<CommentContainer
                    isLightBox
                    commentId={id}
                    key={`commentContainer_${id}`}
                  />),
                )}
              </div>
            </div>
          </div>
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }
}
