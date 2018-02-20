import { responsiveImageVersions, tshirtImageVersions } from './fragments'

export default `
  ${responsiveImageVersions}
  ${tshirtImageVersions}
  query($kind: PageHeaderKind!, $slug: String) {
    pageHeaders(kind: $kind, slug: $slug) {
      id
      kind
      slug
      header
      subheader
      postToken
      ctaLink { text url }
      image { ...responsiveImageVersions }
      user {
        id
        username
        avatar { ...tshirtImageVersions }
      }
    }
  }
`
