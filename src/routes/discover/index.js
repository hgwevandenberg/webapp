import DiscoverContainer from '../../containers/DiscoverContainer'
import DiscoverAllContainer from '../../containers/DiscoverAllContainer'

const discoverAll = () => ({
  path: 'discover/all',
  getComponents(location, cb) {
    cb(null, DiscoverAllContainer)
  },
})

const discover = () => ({
  path: 'discover(/:type)(/trending)',
  getComponents(location, cb) {
    cb(null, DiscoverContainer)
  },
  onEnter(nextState, replace) {
    const type = nextState.params.type || 'featured'
    const rootPath = '/discover'

    // redirect back to root path if type is unrecognized
    // or, if a logged out user is visiting /discover, redirect to /
    if (!type) {
      replace({ state: nextState, pathname: rootPath })
    }
  },
})

export {
  discoverAll,
  discover,
}

export default [
  discoverAll,
  discover,
]

