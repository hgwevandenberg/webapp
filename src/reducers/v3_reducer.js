import Immutable from 'immutable'
import * as ACTION_TYPES from '../constants/action_types'

function parsePagination(state, models, next, pathname, query, variables) {
  const mergedState = state.mergeDeepIn(['pages', pathname], Immutable.Map({
    pagination: Immutable.Map({ next, query, variables })
  }))
  return mergedState.updateIn(['pages', pathname, 'ids'], (ids) => {
    return (ids || Immutable.List()).concat(models.map((m) => m.id))
  })
}

function parseAsset(state, asset) {
  return state.mergeDeepIn(['assets', asset.id], Immutable.Map({
    id: asset.id
  }))
}

function parseCategory(state, category) {
  return state
}

function parseUser(state, user) {
  if (user === null) { return state }
  const state1 = state.mergeDeepIn(['users', user.id], Immutable.Map({
    id: user.id,
    username: user.username,
  }))
  const state2 = parseList(state1, user.categories, parseCategory)

  return state2
}

function parsePost(state, post) {
  const state1 = state.mergeDeepIn(['posts', post.id], Immutable.Map({
    id: post.id,
    token: post.token,
  }))
  const state2 = parseUser(state1, post.author)
  const state3 = parseList(state2, post.assets, parseAsset)

  return state3
}

function parseList(state, list, parser) {
  if (!Array.isArray(list)) { return state }
  return list.reduce(parser, state)
}

function parseQueryType(state, {next, posts}, pathname, query, variables) {
  const state1 = parseList(state, posts, parsePost)
  return parsePagination(state1, posts, next, pathname, query, variables)
}

function parseStream(state, {payload: {response: {data}, pathname, query, variables}}) {
  return Object.keys(data).reduce((s, key) => {
    return parseQueryType(s, data[key], pathname, query, variables)
  }, state)
}

// Dispatch different graphql response types for parsing (reducing)
export default function(state, action) {
  const { type } = action
  switch (action.type) {
    case ACTION_TYPES.V3.LOAD_STREAM_SUCCESS:
    case ACTION_TYPES.V3.LOAD_NEXT_CONTENT_SUCCESS:
      return parseStream(state, action)
    default:
      return state
  }
}
