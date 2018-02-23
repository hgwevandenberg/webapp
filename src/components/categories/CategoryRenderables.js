import React from 'react'
import PropTypes from 'prop-types'
import {
  CheckCircleIcon,
} from '../assets/Icons'

export function CategorySubscribedIcon({ isSubscribed }) {
  if (!isSubscribed) { return null }
  return <CheckCircleIcon />
}
CategorySubscribedIcon.propTypes = {
  isSubscribed: PropTypes.bool.isRequired,
}

export function CategorySubscribeLink({ isSubscribed, subscribe, unsubscribe }) {
  if (!isSubscribed) {
    return (
      <div>
        <button onClick={subscribe}>Subscribe</button>
      </div>
    )
  }
  return (
    <div>
      <button onClick={unsubscribe}>Subscribed</button>
    </div>
  )
}
CategorySubscribeLink.propTypes = {
  isSubscribed: PropTypes.bool.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
}
