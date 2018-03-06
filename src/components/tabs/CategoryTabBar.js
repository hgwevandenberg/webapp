import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'
import { before, css, hover, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const backgroundStyles = source => ({
  backgroundImage: `url("${source}")`,
})

// single tab style
const categoryTabStyle = css(
  s.relative,
  s.inlineBlock,
  s.fullWidth,
  s.fullHeight,
  s.pt0,
  s.pb0,
  s.pr10,
  s.pl10,
  s.overflowHidden,
  s.alignTop,
  s.bgcBlack,
  s.transitionColor,
  {
    whiteSpace: 'normal',
    backgroundSize: 'cover',
  },

  before(
    s.absolute,
    s.flood,
    s.zIndex1,
    s.transitionBgColor,
    {
      content: '""',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
  ),

  select('& + &',
    {
      borderLeft: '1px solid #fff',
    },
  ),

  // hover / active state
  select('&.isActive', before({ backgroundColor: 'rgba(0, 0, 0, 0.8)', })),
  select('&:active', before({ backgroundColor: 'rgba(0, 0, 0, 0.8)', })),
  select('.no-touch &:hover', before({ backgroundColor: 'rgba(0, 0, 0, 0.8)', })),

  // text label
  select('& .text-label',
    s.relative,
    s.flex,
    s.justifyCenter,
    s.itemsCenter,
    s.fullWidth,
    s.fullHeight,
    s.zIndex2,
  ),

  media(s.minBreak2,
    {
      width: 120,
    },
  ),
  media(s.minBreak4,
    s.fullWidth,
    {
      minWwidth: 120,
    },
  ),
)

const CategoryTab = ({ isActive, label, source, to }) => (
  <Link
    className={classNames({ isActive }, `${categoryTabStyle}`)}
    to={to}
    style={source ? backgroundStyles(source) : null}
  >
    <span className="text-label">{label}</span>
  </Link>
)
CategoryTab.propTypes = {
  isActive: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

const AllCategoryTab = ({ pathname }) => {
  const isActive = pathname === '/discover' ||
    pathname === '/discover/trending' ||
    pathname === '/discover/recent'
  return (
    <Link
      className={classNames({ isActive }, `${categoryTabStyle}`)}
      to="/discover"
    >
      <span className="text-label">All</span>
    </Link>
  )
}
AllCategoryTab.propTypes = {
  pathname: PropTypes.string.isRequired,
}

const SubscribedCategoryTab = ({ pathname }) => {
  const isActive = pathname === '/discover/subscribed' ||
    pathname === '/discover/subscribed/trending' ||
    pathname === '/discover/subscribed/recent'
  return (
    <Link
      className={classNames({ isActive }, `${categoryTabStyle}`)}
      to="/discover/subscribed"
    >
      <span className="text-label">Subscribed</span>
    </Link>
  )
}
SubscribedCategoryTab.propTypes = {
  pathname: PropTypes.string.isRequired,
}

const SubscribedZeroStateTab = () => (
  <Link
    className={categoryTabStyle}
    to="/discover/all"
  >
    <span className="text-label">Find and subscribe to a community</span>
  </Link>
)

// main tab bar style
const categoryTabBarStyle = css(
  s.absolute,
  s.zIndex2,
  s.fontSize12,
  s.colorWhite,
  s.nowrap,
  s.bgcBlack,
  s.borderBottom,
  {
    right: 0,
    bottom: -70,
    left: 0,
    height: 70,
    borderColor: '#fff',
  },
  media('(max-width: 23.375em)', // 374 / 16 = 23.375em
    {
      bottom: -50,
      height: 50,
    },
  ),
  media(s.maxBreak2,
    select('.isProfileMenuActive .Navbar ~ &',
      s.displayNone,
    ),
  ),
  media(s.minBreak2,
    s.fontSize14,
    {
      bottom: -80,
      height: 80,
    },
  ),
)

// nav tag that holds all of the tabs style
const categoryTabsHolderStyle = css(
  s.relative,
  s.inlineBlock,
  s.fullHeight,
  s.overflowScrollWebX,
  s.nowrap,
  s.alignTop,
  {
    width: 'calc(100% - 70px)',
  },
  media(s.minBreak2,
    s.fontSize14,
    {
      width: 'calc(100% - 90px)',
    },
  ),
  media(s.minBreak4,
    s.flex,
  ),
)

// tab bar tools style
const categoryTabBarToolsStyle = css(
  s.relative,
  s.inlineBlock,
  s.fullHeight,
  s.pr10,
  s.rightAlign,
  s.alignTop,
  s.bgcBlack,
  {
    width: 70,
  },

  before(
    s.absolute,
    s.zIndex2,
    s.wv20,
    s.fullHeight,
    {
      content: '""',
      top: 0,
      left: -20,
      background: 'linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 90%)'
    },
  ),

  media(s.minBreak2,
    s.pr20,
    {
      width: '90px',
    },
    before(
      s.wv30,
      {
        left: -30,
      },
    ),
  ),
  media(s.minBreak4,
    s.absolute,
    s.pr40,
    {
      top: 0,
      right: 0,
    },
  ),

  // style Edit link
  select('& .edit',
    s.flex,
    s.fullWidth,
    s.fullHeight,
    s.flexColumn,
    s.justifyCenter,
  ),
)

export const CategoryTabBar = ({ pathname, tabs, subscribed }) => (
  <div className={categoryTabBarStyle}>
    <nav className={categoryTabsHolderStyle}>
      <AllCategoryTab pathname={pathname} />
      {subscribed && <SubscribedCategoryTab pathname={pathname} />}
      {subscribed && tabs.length < 1 && <SubscribedZeroStateTab />}

      {tabs.map(tab =>
        (<CategoryTab
          isActive={(tab.activePattern ? tab.activePattern.test(pathname) : tab.to === pathname)}
          key={`CategoryTab_${tab.to}`}
          label={tab.label}
          source={tab.source}
          to={tab.to}
        />),
      )}
    </nav>
    <div className={categoryTabBarToolsStyle}>
      <Link
        activeClassName="isActive"
        className="edit"
        to="/discover/all"
      >
        <span>Edit</span>
      </Link>
    </div>
  </div>
)
CategoryTabBar.propTypes = {
  pathname: PropTypes.string.isRequired,
  subscribed: PropTypes.bool.isRequired,
  tabs: PropTypes.array.isRequired,
}

export default CategoryTabBar

