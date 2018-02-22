import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classNames from 'classnames'

const backgroundStyles = source => ({
  backgroundImage: `url("${source}")`,
})

const CategoryTab = ({ isActive, label, source, to }) => (
  <Link
    className={classNames('CategoryTab', { isActive })}
    to={to}
    style={source ? backgroundStyles(source) : null}
  >
    <span className="CategoryTabLabel">{label}</span>
  </Link>
)
CategoryTab.propTypes = {
  isActive: PropTypes.boolean.isRequired,
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
      className={classNames('CategoryTab', { isActive })}
      to="/discover"
    >
      <span className="CategoryTabLabel">All</span>
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
      className={classNames('CategoryTab', { isActive })}
      to="/discover/subscribed"
    >
      <span className="CategoryTabLabel">Subscribed</span>
    </Link>
  )
}
SubscribedCategoryTab.propTypes = {
  pathname: PropTypes.string.isRequired,
}

export const CategoryTabBar = ({ pathname, tabs, subscribed }) => (
  <div className="CategoryTabBar">
    <nav className="CategoryTabs">
      <AllCategoryTab pathname={pathname} />
      {subscribed && <SubscribedCategoryTab pathname={pathname} />}

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
    <div className="CategoryTabBarUtility">
      <Link
        activeClassName="isActive"
        className="CategoryUtilTab"
        to="/discover/all"
      >
        <span>See All</span>
      </Link>
    </div>
  </div>
)
CategoryTabBar.propTypes = {
  pathname: PropTypes.string.isRequired,
  subscribed: PropTypes.boolean.isRequired,
  tabs: PropTypes.array.isRequired,
}

export default CategoryTabBar

