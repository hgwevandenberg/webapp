import ArtistInvitesPage from '../../pages/ArtistInvitesPage'
import ArtistInvitesDetailPage from '../../pages/ArtistInvitesDetailPage'

export default [
  {
    path: 'invites',
    getComponents(location, cb) {
      cb(null, ArtistInvitesPage)
    },
  },
  {
    path: 'invites/:slug',
    getComponents(location, cb) {
      cb(null, ArtistInvitesDetailPage)
    },
  },
  {
    path: 'artist-invites',
    onEnter(nextState, replace) {
      replace({ pathname: '/invites', state: nextState })
    },
  },
  {
    path: 'artist-invites/:slug',
    onEnter(nextState, replace) {
      const slug = nextState.params.slug
      replace({ pathname: `/invites/${slug}`, state: nextState })
    },
  },
]

