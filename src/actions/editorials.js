import React from 'react'
import { V3 } from '../constants/action_types'
import { editorials as editorialRenderable, postsAsPostStream } from '../components/streams/StreamRenderables'
import { ErrorStateEditorial } from '../components/errors/Errors'
import { ZeroStateEditorial } from '../components/zeros/Zeros'
import { editorialStreamQuery } from '../queries/editorialStreamQueries'
import { findPostsQuery } from '../queries/findPosts'

export const loadEditorials = (isPreview, before) => (
  {
    type: V3.LOAD_STREAM,
    payload: {
      query: editorialStreamQuery,
      variables: { preview: isPreview, before },
    },
    meta: {
      renderStream: {
        asList: editorialRenderable,
        asGrid: editorialRenderable,
      },
    },
  }
)

export const loadPostStream = ({ query: queryName, variables, resultKey, ...props }) => {
  let query
  switch (queryName) {
    case 'findPosts':
      query = findPostsQuery
      break
    default:
      query = findPostsQuery
  }
  return {
    type: V3.POST.LOAD_MANY,
    payload: { query, variables },
    meta: {
      renderProps: { ...props },
      renderStream: {
        asList: postsAsPostStream,
        asGrid: postsAsPostStream,
        asZero: <ZeroStateEditorial />,
        asError: <ErrorStateEditorial />,
      },
      resultKey,
    },
  }
}

