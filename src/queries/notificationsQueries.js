import {
  imageVersionProps,
  tshirtImageVersions,
  responsiveImageVersions,
} from './fragments'

export const notificationStreamQuery = `
  ${imageVersionProps}
  ${tshirtImageVersions}
  ${responsiveImageVersions}

  fragment authorSummary on User {
    id
    username
    name
    currentUserState { relationshipPriority }
    avatar { ...tshirtImageVersions }
  }

  fragment contentProps on ContentBlocks {
    linkUrl
    kind
    data
    links { assets }
  }

  fragment postSummary on Post {
    id
    token
    createdAt
    summary { ...contentProps }
    author { ...authorSummary }
    assets { id attachment { ...responsiveImageVersions } }
    postStats { lovesCount commentsCount viewsCount repostsCount }
    currentUserState { watching loved reposted }
  }

  fragment commentSummary on Comment {
    id
    createdAt
    author { ...authorSummary }
    summary { ...contentProps }
    content { ...contentProps }
    assets { id attachment { ...responsiveImageVersions } }
  }

  fragment categorySummary on Category {
    id slug name
  }

  fragment categoryPostSummary on CategoryPost {
    id
    status
    category { ...categorySummary }
    post { ...postSummary repostedSource { ...postSummary } }
    featuredBy { ...authorSummary }
  }

  fragment categoryUserSummary on CategoryUser {
    id
    role
    category { ...categorySummary }
    user { ...authorSummary }
  }

  fragment artistInviteSubmissionSummary on ArtistInviteSubmission {
    id
    status
    post { ...postSummary repostedSource { ...postSummary } }
    artistInvite { id title slug }
  }

  fragment loveSummary on Love {
    id
    post { ...postSummary repostedSource { ...postSummary } }
    user { ...authorSummary }
  }

  fragment watchSummary on Watch {
    id
    post { ...postSummary repostedSource { ...postSummary } }
    user { ...authorSummary }
  }

  query($perPage: Int, $before: String, $category: NotificationCategory) {
    notificationStream(perPage: $perPage, before: $before, category: $category) {
      isLastPage
      next
      notifications {
        id
        kind
        subjectType
        createdAt
        originatingUser { ...authorSummary }
        subject {
          __typename
          ... on Post { ...postSummary repostedSource { ...postSummary } }
          ... on Comment { ...commentSummary parentPost { ...postSummary repostedSource { ...postSummary } } }
          ... on User { ...authorSummary }
          ... on CategoryUser { ...categoryUserSummary }
          ... on CategoryPost { ...categoryPostSummary }
          ... on Love { ...loveSummary }
          ... on ArtistInviteSubmission { ...artistInviteSubmissionSummary }
          ... on Watch { ...watchSummary }
        }
      }
    }
  }
`

export default notificationStreamQuery
