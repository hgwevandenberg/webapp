/* eslint-disable no-constant-condition,no-underscore-dangle */
import React from 'react'
import get from 'lodash/get'
import { actionChannel, all, call, fork, put, select, take } from 'redux-saga/effects'
import { extractJSON, fetchCredentials, getHeaders, sagaFetch } from './api'
import { clearAuthToken, refreshAuthenticationToken } from '../actions/authentication'
import { openAlert } from '../actions/modals'
import Dialog from '../components/dialogs/Dialog'
import * as ACTION_TYPES from '../constants/action_types'
import { selectRefreshToken } from '../selectors/authentication'
import { selectPathname } from '../selectors/routing'

const V3_GRAPHQL_PATH = '/api/v3/graphql'

export const requestTypes = [
  ACTION_TYPES.V3.LOAD_STREAM,
  ACTION_TYPES.V3.LOAD_NEXT_CONTENT,
]

let unauthorizedActionQueue = []
const runningFetches = {}

function updateRunningFetches(serverResponse, query) {
  if (!serverResponse) { return }
  const serverResponseUrl = serverResponse.url && serverResponse.url.length
        ? serverResponse.url
        : serverResponse.headers.get('X-Request-Url')

  if (runningFetches[query]) {
    delete runningFetches[query]
  } else {
    Object.keys(runningFetches).forEach((key) => {
      delete runningFetches[key]
    })
  }
}

export function* handleRequestError(error, action) {
  const { meta, payload, type } = action
  const FAILURE = `${type}_FAILURE`
  function* fireFailureAction() {
    if (meta && meta.failureAction) {
      if (typeof meta.failureAction === 'function') {
        yield call(meta.failureAction)
      } else {
        yield put(meta.failureAction)
      }
    }
  }

  if (error.response) {
    const { status } = error.response
    payload.serverStatus = status
    if (status === 401 &&
        type !== ACTION_TYPES.AUTHENTICATION.REFRESH &&
        type !== ACTION_TYPES.AUTHENTICATION.USER) {
      unauthorizedActionQueue.push(action)
      if (Object.keys(runningFetches).length === 0) {
        yield put(clearAuthToken())
        const refreshToken = yield select(selectRefreshToken)
        yield put(refreshAuthenticationToken(refreshToken))
      }
      return true
    }

    if (status === 420) {
      yield put(openAlert(
        <Dialog
          title="Take a breath. You're doing Ello way too fast. A few more seconds. That's better."
          body="More Ello? Refresh the page to continue."
        />,
      ))
      yield put({ error, meta, payload, type: FAILURE })
      return true
    }

    const contentType = error.response.headers.get('content-type')
    if (contentType && contentType.indexOf('application/json') > -1) {
      payload.response = yield call(extractJSON, error.response)
    }
    yield put({ error, meta, payload, type: FAILURE })
    yield call(fireFailureAction)
  } else {
    if (/Failed to fetch/.test(error)) {
      payload.serverStatus = 404
    }
    yield put({ error, meta, payload, type: FAILURE })
    yield call(fireFailureAction)
  }
  return false
}

export function* performRequest(action) {
  const {
    type,
    meta,
    payload: { query, variables },
  } = action
  let { payload } = action
  const pathname = yield select(selectPathname)
  payload = {
    ...payload,
    pathname,
  }

  const tokenJSON = yield call(fetchCredentials)
  const accessToken = get(tokenJSON, 'token.access_token')

  const options = {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: getHeaders(accessToken),
  }

  const REQUEST = `${type}_REQUEST`
  const SUCCESS = `${type}_SUCCESS`

  yield put({ type: REQUEST, payload, meta })

  function* fireSuccessAction() {
    if (meta && meta.successAction) {
      if (typeof meta.successAction === 'function') {
        yield call(meta.successAction)
      } else {
        yield put(meta.successAction)
      }
    }
  }

  let response

  try {
    response = yield call(sagaFetch, V3_GRAPHQL_PATH, options)
  } catch (error) {
    updateRunningFetches(error.response, query)
    yield fork(handleRequestError, error, action)
    return false
  }

  const { json, serverResponse } = response
  payload.response = json

  // TODO: Errors come back as 200s, we need to deal with that here.

  updateRunningFetches(serverResponse, query)

  yield put({ meta, payload, type: SUCCESS })
  yield call(fireSuccessAction)
  return true
}

export function* handleRequest(requestChannel) {
  while (true) {
    const action = yield take(requestChannel)
    const { payload: { query } } = action

    if (!runningFetches[query]) {
      runningFetches[query] = true
      yield fork(performRequest, action)
    }
  }
}

function* refireUnauthorizedActions(authSuccessChannel) {
  while (true) {
    const successAction = yield take(authSuccessChannel)
    if (successAction && unauthorizedActionQueue.length) {
      yield unauthorizedActionQueue.map(action => put(action))
      unauthorizedActionQueue = []
    }
  }
}

export default function* requester() {
  const requestChannel = yield actionChannel(requestTypes)
  const authSuccessChannel = yield actionChannel([
    ACTION_TYPES.AUTHENTICATION.REFRESH_SUCCESS,
    ACTION_TYPES.AUTHENTICATION.USER_SUCCESS,
  ])
  yield all([
    fork(refireUnauthorizedActions, authSuccessChannel),
    fork(handleRequest, requestChannel),
  ])
}

export { runningFetches }

