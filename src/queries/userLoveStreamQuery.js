import { loveSummaryAllFragments } from './fragments'

export default `
    ${loveSummaryAllFragments}
    query($username: String!, $perPage: String, $before: String) {
      userLoveStream(username: $username, perPage: $perPage, before: $before) {
        next
        isLastPage
        loves { ...fullLove }
      }
    }
`
