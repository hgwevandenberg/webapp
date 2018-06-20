import { fullPostAllFragments } from './fragments'

export default `
  ${fullPostAllFragments}
  query($id: String, $token: String, $perPage: String, $before: String) {
    commentStream(id: $id, token: $token, before: $before, perPage: $perPage) {
      comments { ...fullComment }
      next
      isLastPage
    }
  }
`
