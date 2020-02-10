import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { neverShowSurveyBanner, dontShowSurveyBannerToday } from '../actions/gui'
import { css, select, media, descendent } from '../styles/jss'

export function mapStateToProps(_) {
  return {
  }
}

const surveyBannerStyle = css(
  {
    position: 'fixed',
    top: '50%',
    right: '0',
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.9)',
    padding: '48px',
    maxWidth: '30rem',
    zIndex: '9999',
  },
  descendent('h2,p', {
    color: 'white',
  }),
  descendent('h2', {
    fontSize: '1.5rem',
    lineHeight: '1',
  }),
  descendent('p', {
    fontSize: '0.875rem',
  }),
  descendent('.actions', {
    textAlign: 'center',
    marginTop: '2rem',
  }),
  descendent('a.button', {
    width: '100%',
    marginBottom: '1rem',
    height: '3.75rem',
    lineHeight: '3.75rem',
    paddingRight: '1.875rem',
    paddingLeft: '1.875rem',
    fontSize: '0.875rem',
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(0, 209, 0)',
    borderRadius: '0.3125rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgb(0, 209, 0)',
    borderImage: 'initial',
    transition: 'background-color 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, border-color 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, color 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, width 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s',
  }),
  descendent('a.button:hover, a.button:focus, a.button:active', {
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(0, 177, 0)',
    borderColor: 'rgb(0, 177, 0)',
  }),

  descendent('button', {
    background: 'transparent',
    border: '0',
    fontSize: '0.875rem',
    height: '2.25rem',
    lineHeight: '2.25rem',
    paddingRight: '1.875rem',
    paddingLeft: '1.875rem',
    color: 'rgba(255,255,255,0.5)',
    transition: 'color 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s',
  }),

  descendent('button:hover, button:focus, button:active', {
    color: 'rgba(255,255,255,1)',
  }),

  media('screen and (max-width: 30rem)', {
    overflow: 'auto',
    width: '100vw',
    height: '100vh',
    maxWidth: 'none',
  }),
)

class SurveyBanner extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
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
    return (
      <div className={surveyBannerStyle}>
        <h2>
          Take our survey!
        </h2>
        <p>
          Can you take 3 minutes to answer a quick survey about your experience on Ello?
        </p>
        <p>
          You will be opted in to a drawing for a $50 gift certificate.
        </p>
        <div className="actions">
          <Link className="button" target="_blank" href="https://tlnt.at/2UInPAq" onClick={this.onClickOK}>OK</Link>
          <button onClick={this.onClickNotNow}>Not right now</button>
          <button onClick={this.onClickNotAgain}>Don&rsquo;t show this again</button>
        </div>
      </div>)
  }
}

export default connect(mapStateToProps)(SurveyBanner)
