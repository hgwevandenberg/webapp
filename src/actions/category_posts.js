import { LOAD_STREAM } from '../constants/action_types'
import { CATEGORY_POSTS } from '../constants/mapping_types'
import * as api from '../networking/api'

export function sendCategoryPostAction(action) {
  return {
    type: LOAD_STREAM,
    meta: {
      mappingType: CATEGORY_POSTS,
      updateResult: true,
    },
    payload: {
      endpoint: { path: action.get('href') },
      method: action.get('method'),
    },
  }
}
