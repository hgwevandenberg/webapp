import Immutable from 'immutable'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import { COMMENTS, POSTS } from '../constants/mapping_types'

// post streams + single posts
export const selectPropsPostId = (state, props) =>
  get(props, 'postId') || get(props, 'post', Immutable.Map()).get('id')
export const selectPropsPostIds = (state, props) => get(props, 'postIds')
export const selectPosts = state => state.json.get(POSTS, Immutable.Map())

// comment streams
export const selectComments = state => state.json.get(COMMENTS, Immutable.Map())
export const selectPropsCommentIds = (state, props) => get(props, 'commentIds')

// in-progress
// currently requires `postIds`, `postId`, or `commentIds`
export const selectPostsAssetIds = createSelector(
  [
    selectPropsPostIds,
    selectPropsPostId,
    selectPosts,
    selectPropsCommentIds,
    selectComments,
  ],
  (propsPostIds, singlePostId, posts, propsCommentIds, comments) => {
    // standard posts stream
    let postIds = propsPostIds
    let postsToMap = posts

    // single post
    if (!postIds && singlePostId) {
      postIds = []
      postIds.push(singlePostId)
    }

    // comments stream
    if (!postIds && propsCommentIds) {
      postsToMap = comments
      postIds = propsCommentIds
    }

    // iterate posts in state and return associated assetIds as array
    const combinedPostsAssetIds = []
    postIds.map((postId) => {
      const post = postsToMap.get(postId, Immutable.Map())
      const postContent = post.get('content')
      const postRepostContent = post.get('repostContent')

      if (postRepostContent) {
        postRepostContent.map((region) => {
          const assetId = region.getIn(['links', 'assets'])
          if (assetId) {
            return combinedPostsAssetIds.push([postId, assetId])
          }
          return null
        })
      }

      postContent.map((region) => {
        const assetId = region.getIn(['links', 'assets'])
        if (assetId) {
          return combinedPostsAssetIds.push([postId, assetId])
        }
        return null
      })

      return combinedPostsAssetIds
    })

    return combinedPostsAssetIds
  },
)
