import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import shallowCompare from 'react-addons-shallow-compare'
import { scrollToTop, scrollToOffsetTop } from '../vendor/scrolling'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE } from '../constants/action_types'
import { Footer } from '../components/footer/Footer'

function mapStateToProps(state) {
  const { gui, stream } = state
  const isPaginatoring = stream.type === LOAD_NEXT_CONTENT_REQUEST && gui.deviceSize === 'mobile'
  return {
    isLayoutToolHidden: gui.isLayoutToolHidden,
    isGridMode: gui.isGridMode,
    isOffsetLayout: gui.isOffsetLayout,
    isPaginatoring,
  }
}

class FooterContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLayoutToolHidden: PropTypes.bool.isRequired,
    isOffsetLayout: PropTypes.bool.isRequired,
    isPaginatoring: PropTypes.bool,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onClickScrollToTop = () => {
    const { isOffsetLayout } = this.props
    return isOffsetLayout ? scrollToOffsetTop() : scrollToTop()
  }

  onClickToggleLayoutMode = () => {
    const { dispatch, isGridMode } = this.props
    const newMode = isGridMode ? 'list' : 'grid'
    dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  }

  render() {
    const { isLayoutToolHidden, isGridMode, isPaginatoring } = this.props
    const props = {
      isLayoutToolHidden,
      isGridMode,
      isPaginatoring,
      onClickScrollToTop: this.onClickScrollToTop,
      onClickToggleLayoutMode: this.onClickToggleLayoutMode,
    }
    return <Footer {...props} />
  }
}

export default connect(mapStateToProps)(FooterContainer)

