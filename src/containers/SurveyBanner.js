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
    return (<div className={isMobile ? 'SurveyBanner' : 'SurveyBanner'}>
      <h2>Take our survey!</h2>
      <div>Can you take 3 minutes to answer a quick survey about your experience on Ello?</div>
      <div>You will be opted in to a drawing for a $50 gift certificate</div>
      <button><Link to="https://tlnt.at/2UInPAq" target="_blank" >OK</Link></button>
      <button onClick={this.onClickNotNow} >Not right Now</button>
      <button onClick={this.onClickNotAgain} >Don’t show this again</button>
    </div>)
  }
}

export default connect(mapStateToProps)(SurveyBanner)
