import React, { PropTypes } from 'react'
import Editor from '../editor/Editor'
import PostContainer from '../../containers/PostContainer'
import StreamContainer from '../../containers/StreamContainer'
import { MainView } from '../views/MainView'
import { loadRelatedPosts } from '../../actions/posts'

export const PostDetail = ({ hasEditor, post, streamAction }) =>
  <MainView className="PostDetail">
    <div className="PostDetails Posts asList">
      <article className="PostList" id={`Post_${post.get('id')}`}>
        <div className="StreamContainer">
          <PostContainer postId={post.get('id')} />
          {hasEditor ? <Editor post={post} isComment /> : null}
        </div>
        {streamAction ?
          <StreamContainer action={streamAction} className="CommentStreamContainer" /> :
          null
        }
        <StreamContainer action={loadRelatedPosts()} /> :
      </article>
    </div>
  </MainView>
PostDetail.propTypes = {
  hasEditor: PropTypes.bool.isRequired,
  post: PropTypes.object.isRequired,
  streamAction: PropTypes.object,
}
PostDetail.defaultProps = {
  streamAction: null,
}

export const PostDetailError = ({ children }) =>
  <MainView className="PostDetail">
    <section className="StreamContainer isError">
      {children}
    </section>
  </MainView>
PostDetailError.propTypes = {
  children: PropTypes.node.isRequired,
}

