import Immutable from 'immutable'
import * as ACTION_TYPES from '../constants/action_types'

function deepGet(object, [head, ...tail], fallback = null) {
  const val = object[head]
  if (val === undefined || val === null) { return fallback }
  if (tail.length === 0) { return val }
  return deepGet(val, tail, fallback)
}

function smartDeepMerge(oldMap, newMap) {
  return oldMap.mergeDeepWith((oldVal, newVal) => {
    if (oldVal === null || oldVal === undefined) { return newVal }
    if (newVal === null || newVal === undefined) { return oldVal }
    return newVal
  }, newMap)
}

function parseList(state, list, parser) {
  if (!Array.isArray(list)) { return state }
  return list.reduce(parser, state)
}

function parsePagination(state, stream, pathname, query, variables) {
  const { posts: models, next, isLastPage } = stream
  const mergedState = state.mergeDeepIn(['pages', pathname], Immutable.fromJS({
    pagination: Immutable.fromJS({ next, query, variables, isLastPage }),
  }))
  return mergedState.updateIn(['pages', pathname, 'ids'], ids =>
    (ids || Immutable.List()).concat(models.map(m => m.id)),
  )
}

function parseAsset(state, asset) {
  if (!asset) { return state }
  return state.mergeDeepIn(['assets', asset.id], Immutable.fromJS({
    id: asset.id,
    attachment: {}, // TODO
  }))
}

function parseCategory(state, category) {
  if (!category) { return state }
  return state.mergeDeepIn(['categories', category.id], Immutable.fromJS({
    id: category.id,
  }))
}

function parseUser(state, user) {
  if (!user) { return state }
  const state1 = state.mergeDeepIn(['users', user.id], Immutable.fromJS({
    id: user.id,
    username: user.username,
  }))
  const state2 = parseList(state1, user.categories, parseCategory)

  return state2
}

function parsePost(state, post) {
  if (!post) { return state }

  const newPost = Immutable.fromJS({
    // ids
    id: post.id,
    authorId: deepGet(post, ['author', 'id']), // We don't use links for this

    // Properties
    token: post.token,
    createdAt: post.createdAt,

    // Content
    summary: post.summary,
    content: post.content,

    // Stats
    lovesCount: deepGet(post, ['postStats', 'lovesCount']),
    commentsCount: deepGet(post, ['postStats', 'commentsCount']),
    viewsCount: deepGet(post, ['postStats', 'viewsCount']),
    repostsCount: deepGet(post, ['postStats', 'repostsCount']),

    // Current user state
    watching: deepGet(post, ['currentUserState', 'watching']),
    loved: deepGet(post, ['currentUserState', 'loved']),
    reposted: deepGet(post, ['currentUserState', 'reposted']),
  })

  const oldPost = state.getIn(['posts', post.id], Immutable.Map())
  const mergedPost = smartDeepMerge(oldPost, newPost)
  const state1 = state.setIn(['posts', post.id], mergedPost)
  const state2 = parseUser(state1, post.author)
  const state3 = parseList(state2, post.assets, parseAsset)
  const state4 = parsePost(state3, post.repostedSource)

  return state4
}

function parseQueryType(state, stream, pathname, query, variables) {
  const { posts } = stream
  const state1 = parseList(state, posts, parsePost)
  return parsePagination(state1, stream, pathname, query, variables)
}

function parseStream(state, { payload: { response: { data }, pathname, query, variables } }) {
  return Object.keys(data).reduce((s, key) =>
    parseQueryType(s, data[key], pathname, query, variables),
    state,
  )
}

// Dispatch different graphql response types for parsing (reducing)
export default function (state, action) {
  const { type } = action
  switch (type) {
    case ACTION_TYPES.V3.LOAD_STREAM_SUCCESS:
    case ACTION_TYPES.V3.LOAD_NEXT_CONTENT_SUCCESS:
      return parseStream(state, action)
    default:
      return state
  }
}
