import { fullPostAllFragments } from './fragments'

export const findPostQuery = `
  ${fullPostAllFragments}
  query($username: String!, $token: String!) {
    post(username: $username, token: $token) { ...fullPost }
  }
`

export default findPostQuery
