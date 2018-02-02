
export const imageVersionProps = `
  fragment imageVersionProps on Image {
    url
    metadata { height width type size }
  }
`

export const avatarImageVersion = `
  ${imageVersionProps}
  fragment avatarImageVersion on TshirtImageVersions {
    small { ...imageVersionProps }
    regular { ...imageVersionProps }
    large { ...imageVersionProps }
    original { ...imageVersionProps }
  }
`

export const assetImageVersions = `
  ${imageVersionProps}
  fragment assetImageVersions on ResponsiveImageVersions {
    xhdpi { ...imageVersionProps }
    hdpi { ...imageVersionProps }
    mdpi { ...imageVersionProps }
    ldpi { ...imageVersionProps }
    optimized { ...imageVersionProps }
    original { ...imageVersionProps }
    video { ...imageVersionProps }
  }
`

export const authorSummary = `
  ${avatarImageVersion}
  fragment authorSummary on User {
    id
    username
    name
    avatar { ...avatarImageVersion }
    currentUserState { relationshipPriority }
  }
`

export const contentProps = `
  fragment contentProps on ContentBlocks {
    linkUrl
    kind
    data
    links { assets }
  }
`

export const postSummary = `
  ${contentProps}
  ${authorSummary}
  ${assetImageVersions}
  fragment postSummary on Post {
    id
    token
    createdAt
    summary { ...contentProps }
    repostContent { ...contentProps }
    author { ...authorSummary }
    assets { id attachment { ...assetImageVersions } }
    postStats { lovesCount commentsCount viewsCount repostsCount }
    currentUserState { watching loved reposted }
  }
`
