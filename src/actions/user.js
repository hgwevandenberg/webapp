import React from 'react'
import * as ACTION_TYPES from '../constants/action_types'
import * as MAPPING_TYPES from '../constants/mapping_types'
import * as api from '../networking/api'
import * as StreamRenderables from '../components/streams/StreamRenderables'
import * as StreamFilters from '../components/streams/StreamFilters'
import { ErrorState } from '../components/errors/Errors'
import userPostStreamQuery from '../queries/userPostStream'
import userLoveStreamQuery from '../queries/userLoveStreamQuery'
import { findUserQuery } from '../queries/findUser'

export function flagUser(username, kind) {
  return {
    type: ACTION_TYPES.USER.FLAG,
    payload: {
      endpoint: api.flagUser(`~${username}`, kind),
      method: 'POST',
    },
    meta: {},
  }
}

export function loadUserDetail({ username }) {
  return {
    type: ACTION_TYPES.V3.USER.DETAIL,
    payload: {
      query: findUserQuery,
      variables: { username },
    },
    meta: {},
  }
}

export function loadUserPostsV3(username) {
  return {
    type: ACTION_TYPES.V3.LOAD_STREAM,
    payload: {
      query: userPostStreamQuery,
      variables: { username },
    },
    meta: {
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
    },
  }
}

export function loadUserLoves(username) {
  return {
    type: ACTION_TYPES.V3.LOAD_STREAM,
    payload: {
      query: userLoveStreamQuery,
      variables: { username },
    },
    meta: {
      renderStream: {
        asList: StreamRenderables.postsAsList,
        asGrid: StreamRenderables.postsAsGrid,
      },
    },
  }
}

export function loadUserFollowing(username, priority) {
  const endpoint = api.userFollowing(username, priority)
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsGrid,
        asGrid: StreamRenderables.usersAsGrid,
      },
      resultKey: `/${username}/following?per_page=10&priority=${priority}`,
    },
  }
}
export function loadUserUsers(username, type) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint: api.userResources(username, type) },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      renderStream: {
        asList: StreamRenderables.usersAsGrid,
        asGrid: StreamRenderables.usersAsGrid,
      },
    },
  }
}

export function loadUserDrawer(endpoint, postId, resultType) {
  return {
    type: ACTION_TYPES.LOAD_STREAM,
    payload: { endpoint },
    meta: {
      mappingType: MAPPING_TYPES.USERS,
      mergeResults: true,
      renderStream: {
        asList: StreamRenderables.usersAsGrid,
        asGrid: StreamRenderables.usersAsGrid,
        asError: <ErrorState />,
      },
      resultKey: `/posts/${postId}/${resultType}`,
      updateKey: `/posts/${postId}/`,
    },
  }
}

export function collabWithUser(id, message) {
  return {
    type: ACTION_TYPES.USER.COLLAB_WITH,
    payload: {
      body: { body: message },
      endpoint: api.collabWithUser(id),
      method: 'POST',
    },
  }
}

export function hireUser(id, message) {
  return {
    type: ACTION_TYPES.USER.HIRE_ME,
    payload: {
      body: { body: message },
      endpoint: api.hireUser(id),
      method: 'POST',
    },
  }
}

