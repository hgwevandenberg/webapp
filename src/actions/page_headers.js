import * as ACTION_TYPES from '../constants/action_types'
import getPageHeadersQuery from '../queries/getPageHeaders'

export default function loadPageHeaders({ kind, slug }) {
  return {
    type: ACTION_TYPES.V3.LOAD_PAGE_HEADERS,
    payload: {
      query: getPageHeadersQuery,
      variables: { kind, slug },
    },
  }
}
