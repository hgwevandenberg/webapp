import React from 'react'
import Mousetrap from 'mousetrap'
import { Link } from 'react-router'
import { ElloMark } from '../iconography/ElloIcons'
import { SHORTCUT_KEYS } from '../../constants/action_types'


const shortcuts = {
  [SHORTCUT_KEYS.SEARCH]: '/search',
  [SHORTCUT_KEYS.DISCOVER]: '/discover',
  [SHORTCUT_KEYS.ONBOARDING]: '/onboarding/channels',
}

class Navbar extends React.Component {
  componentDidMount() {
    Mousetrap.bind(Object.keys(shortcuts), (event, shortcut) => {
      const { router } = this.context
      router.transitionTo(shortcuts[shortcut])
    })
  }

  componentWillUnmount() {
    Mousetrap.unbind(Object.keys(shortcuts))
  }

  render() {
    return (
      <nav className="Navbar" role="navigation">
        <Link to="/">
          <ElloMark />
        </Link>
        <div className="NavbarLinks">
          <Link to="/discover">Discover</Link>
          <Link to="/search">Search</Link>
          <Link to="/onboarding/channels">Onboarding</Link>
        </div>
      </nav>
    )
  }
}

Navbar.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Navbar
