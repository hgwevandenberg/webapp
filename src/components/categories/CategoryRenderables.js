import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import {
  CheckCircleIcon,
} from '../assets/Icons'
import { after, before, css, hover, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

export function CategorySubscribedIcon({ isSubscribed }) {
  if (!isSubscribed) { return null }
  return <CheckCircleIcon />
}
CategorySubscribedIcon.propTypes = {
  isSubscribed: PropTypes.bool.isRequired,
}

const categorySubscribeButtonStyle = css(
  s.bgcA,
  s.colorWhite,
  { 
    padding: '5px 15px 5px 6px',
    borderRadius: 100,
    transition: `background-color 0.2s ${s.ease}`,
  },
  hover({ backgroundColor: '#16a905'}),
  select('&.subscribed', s.bgcGreen),
  select('& .text',
    s.fontSize12,
    s.inlineBlock,
    s.pl10,
    { paddingTop: 4 },
  ),
  select('& .CheckCircleIcon', s.inlineBlock, { marginTop: -2 })
)

export function CategorySubscribeButton({ isSubscribed, subscribe, unsubscribe }) {
  return (
    <button
      className={`${categorySubscribeButtonStyle} subscribe-button${!isSubscribed ? ' subscribed' : ''}`}
      onClick={!isSubscribed ? subscribe : unsubscribe}>
        <CheckCircleIcon />
        <span className="text">
          {!isSubscribed ? 'Subscribe' : 'Subscribed'}
        </span>
    </button>
  )
}
CategorySubscribeButton.propTypes = {
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

const categoryCardLinkStyle = css(
  s.absolute,
  s.flex,
  s.itemsCenter,
  s.fullWidth,
  s.fullHeight,
  s.bgcBlack,
  { backgroundSize: 'cover' },
  before(
    s.absolute,
    s.flood,
    s.zIndex2,
    s.transitionBgColor,
    { content: '""', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
  ),
  hover(before({ backgroundColor: 'rgba(0, 0, 0, 0.3)' })),
)

const CategoryCardLink = ({ children, imageUrl, to }) => (
  <Link
    className={categoryCardLinkStyle}
    to={to}
    style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : null}
  >
    {children}
  </Link>
)
CategoryCardLink.propTypes = {
  children: PropTypes.node.isRequired,
  imageUrl: PropTypes.string,
  to: PropTypes.string.isRequired,
}

CategoryCardLink.defaultProps = {
  imageUrl: null,
}

const categoryCardTitleStyle = css(
  s.relative,
  s.block,
  s.mAuto,
  s.colorWhite,
  s.fontSize32,
  s.center,
  s.zIndex3,
  { width: 'calc(100% - 60px)'},
  select('& .CheckCircleIcon',
    s.absolute,
    { marginLeft: -32, marginTop: 11, width: 40, transform: 'scale(1.6)' },
    select('& .svg-stroke-bevel', s.strokeGreen),
    select('& circle', s.strokeGreen)
  ),
)

const CategoryCardTitle = ({ name, isSubscribed }) => (
  <span className={categoryCardTitleStyle}>
    <CategorySubscribedIcon isSubscribed={isSubscribed} />
    <span className="text">{name}</span>
  </span>
)
CategoryCardTitle.propTypes = {
  name: PropTypes.string.isRequired,
  isSubscribed: PropTypes.bool,
}
CategoryCardTitle.defaultProps = {
  isSubscribed: false,
}

// Card for /discover/all
const categoryCardStyle = css(
  s.relative,
  s.block,
  {
    margin: '0 20px 40px 20px',
    width: 'calc(25% - 40px)',
    paddingBottom: 'calc(25% - 40px)'
  },
  select('& .button-holder',
    s.absolute,
    s.flex,
    s.justifyCenter,
    s.fullWidth,
    s.zIndex3,
    { bottom: 40 }
  )
)

export const CategoryCard = ({ name, imageUrl, to, isSubscribed, subscribe, unsubscribe }) => (
  <li className={categoryCardStyle}>
    <CategoryCardLink imageUrl={imageUrl} to={to}>
      <CategoryCardTitle
        name={name}
        isSubscribed={isSubscribed}
      />
      <span className="button-holder">
        <CategorySubscribeButton
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          isSubscribed={isSubscribed}
        />
      </span>
    </CategoryCardLink>
  </li>
)
CategoryCard.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  to: PropTypes.string.isRequired,
  isSubscribed: PropTypes.bool.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
}

CategoryCard.defaultProps = {
  imageUrl: null,
}
