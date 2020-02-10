import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { neverShowSurveyBanner, dontShowSurveyBannerToday } from '../actions/gui'
import { selectIsMobile } from '../selectors/gui'

export function mapStateToProps(state) {
  return {
    isMobile: selectIsMobile(state),
  }
}

class SurveyBanner extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
  }

  static defaultProps = {
  }

  onClickOK = () => {
    const { dispatch } = this.props
    dispatch(neverShowSurveyBanner())

    return false
  }

  onClickNotNow = () => {
    const { dispatch } = this.props
    dispatch(dontShowSurveyBannerToday())
  }

  onClickNotAgain = () => {
    const { dispatch } = this.props
    dispatch(neverShowSurveyBanner())
  }

  render() {
    const { isMobile } = this.props
    return (<div className={isMobile ? 'mobile' : 'desktop'}>
      <button><Link to="https://tlnt.formstack.com/forms/survey" target="_blank" onClick={this.onClickOK} >OK</Link></button>
      <button onClick={this.onClickNotNow} >Not right Now</button>
      <button onClick={this.onClickNotAgain} >Don’t show this again</button>
    </div>)
  }
}

export default connect(mapStateToProps)(SurveyBanner)
