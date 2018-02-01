
import { postSummary } from './fragments'

export default `
  ${postSummary}

  query($username: String!, $before: String) {
    userPostStream(username: $username, before: $before) {
      next
      isLastPage
      posts {
        ...postSummary
        repostedSource {
          ...postSummary
        }
      }
    }
  }
`
