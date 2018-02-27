import { responsiveImageVersions, tshirtImageVersions, imageVersionProps } from './fragments'

export default `
  ${imageVersionProps}
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
      category { id }
      user { id username avatar { ...tshirtImageVersions } }
    }
  }
`
