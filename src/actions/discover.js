import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import navCategoriesQuery from '../queries/navCategories'
import allCategoriesQuery from '../queries/allCategories'

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

export function getPagePromotionals() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.pagePromotionals() },
    meta: {
      mappingType: MAPPING_TYPES.PAGE_PROMOTIONALS,
      resultKey: '/page_promotionals',
    },
  }
}

export function loadCategoryPosts(type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.categoryPosts(type) },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
    },
  }
}

export function loadDiscoverPosts(type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.discoverPosts(type) },
    meta: {
      mappingType: MAPPING_TYPES.POSTS,
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
    },
  }
}

export function loadCommunities() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.communitiesPath() },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsGrid,
        asGrid: StreamRenderables.usersAsGrid,
      },
    },
  }
}

export function loadFeaturedUsers() {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.awesomePeoplePath() },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsGrid,
        asGrid: StreamRenderables.usersAsGrid,
      },
    },
  }
}

export function bindDiscoverKey(type) {
  return {
    type: ACTION_TYPES.GUI.BIND_DISCOVER_KEY,
    payload: { type },
  }
}
