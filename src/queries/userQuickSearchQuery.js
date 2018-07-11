export default `
  query($query: String!) {
    searchUsers(query: $query, perPage: 10) {
      users {
        id
        username
        avatar { small { url } }
      }
    }
  }
`
