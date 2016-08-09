import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { isEqual, pick } from 'lodash'
import { SHORTCUT_KEYS } from '../constants/application_types'
import { closeOmnibar } from '../actions/omnibar'
import Mousetrap from '../vendor/mousetrap'
import { Omnibar } from '../components/omnibar/Omnibar'

export function shouldContainerUpdate(thisProps, nextProps) {
  const pickProps = ['classList', 'isActive']
  const thisCompare = pick(thisProps, pickProps)
  const nextCompare = pick(nextProps, pickProps)
  return !isEqual(thisCompare, nextCompare)
}

export function mapStateToProps(state) {
  return {
    avatar: state.profile.avatar,
    ...state.omnibar,
  }
}

class OmnibarContainer extends Component {
  static propTypes = {
    avatar: PropTypes.shape({}),
    classList: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
  }

  componentWillMount() {
    this.state = {
      isFullScreen: false,
    }
  }

  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.FULLSCREEN, () => { this.onToggleFullScreen() })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isFullScreen !== nextState.isFullScreen) {
      return true
    }
    return shouldContainerUpdate(this.props, nextProps)
  }

  componentDidUpdate() {
    const { isActive } = this.props
    if (isActive) {
      document.body.classList.add('isOmnibarActive')
    } else if (!isActive) {
      document.body.classList.remove('isOmnibarActive')
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.FULLSCREEN)
  }

  onToggleFullScreen = () => {
    const { isFullScreen } = this.state
    this.setState({ isFullScreen: !isFullScreen })
  }

  onClickCloseOmnibar = () => {
    const { isActive, dispatch } = this.props
    if (isActive) {
      dispatch(closeOmnibar())
    }
  }

  render() {
    const { avatar, classList, isActive } = this.props
    const { isFullScreen } = this.state
    const elementProps = { avatar, classList, isActive, isFullScreen }
    return <Omnibar {...elementProps} onClickCloseOmnibar={this.onClickCloseOmnibar} />
  }
}

export default connect(mapStateToProps)(OmnibarContainer)

