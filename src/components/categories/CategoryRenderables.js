import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
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

export function CategorySubNav({ stream }) {
  if (stream === 'global') {
    return (
      <ul>
        <li><Link to="/discover">Featured</Link></li>
        <li><Link to="/discover/trending">Trending</Link></li>
        <li><Link to="/discover/recent">Recent</Link></li>
      </ul>
    )
  }
  return (
    <ul>
      <li><Link to={`/discover/${stream}`}>Featured</Link></li>
      <li><Link to={`/discover/${stream}/trending`}>Trending</Link></li>
    </ul>
  )
}
CategorySubNav.propTypes = {
  stream: PropTypes.string.isRequired,
}
