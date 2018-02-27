import * as ACTION_TYPES from '../constants/action_types'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import navCategoriesQuery from '../queries/navCategories'
import allCategoriesQuery from '../queries/allCategories'
import {
  globalPostStreamQuery,
  subscribedPostStreamQuery,
  categoryPostStreamQuery,
} from '../queries/postStreamQueries'

const KINDS = {
  featured: 'FEATURED',
  recent: 'RECENT',
  trending: 'TRENDING',
}

const postStreamMeta = {
  renderStream: {
    asList: StreamRenderables.postsAsList,
    asGrid: StreamRenderables.postsAsGrid,
  },
}

export function getCategories() {
  return {
    type: ACTION_TYPES.V3.LOAD_CATEGORIES,
    payload: {
      query: allCategoriesQuery,
      variables: {},
    },
  }
}

export function getNavCategories() {
  return {
    type: ACTION_TYPES.V3.LOAD_CATEGORIES,
    payload: {
      query: navCategoriesQuery,
      variables: {},
    },
  }
}

export function loadGlobalPostStream(kind) {
  return {
    type: ACTION_TYPES.V3.LOAD_STREAM,
    payload: {
      query: globalPostStreamQuery,
      variables: { kind: KINDS[kind] },
    },
    meta: postStreamMeta,
  }
}

export function loadSubscribedPostStream(kind) {
  return {
    type: ACTION_TYPES.V3.LOAD_STREAM,
    payload: {
      query: subscribedPostStreamQuery,
      variables: { kind: KINDS[kind] },
    },
    meta: postStreamMeta,
  }
}

export function loadCategoryPostStream(slug, kind) {
  return {
    type: ACTION_TYPES.V3.LOAD_STREAM,
    payload: {
      query: categoryPostStreamQuery,
      variables: { kind: KINDS[kind], slug },
    },
    meta: postStreamMeta,
  }
}

export function bindDiscoverKey(type) {
  return {
    type: ACTION_TYPES.GUI.BIND_DISCOVER_KEY,
    payload: { type },
  }
}
